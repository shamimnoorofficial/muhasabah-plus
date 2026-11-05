/* Muhasabah Pro membership (Netlify Identity accounts + Stripe card payments).
 *
 * GET  /api/pro                      → plans, payment availability and the signed-in member's status
 * POST /api/pro { action: "checkout", lifetime, monthly, saveCard, autoRenew }
 *                                     → { clientSecret, kind, id } to confirm with Stripe.js
 * POST /api/pro { action: "confirm", kind, id }      → verifies the payment with Stripe and grants Pro
 * POST /api/pro { action: "autorenew", on }          → turns monthly auto-renewal on/off
 * POST /api/pro { action: "cashback", streak }       → refunds $1 of the lifetime fee per 40-day streak (10× max)
 *
 * Pro is only ever granted after the server has read the payment back from Stripe, and card
 * details go straight from the browser to Stripe. Uses STRIPE_SECRET_KEY / STRIPE_PUBLISHABLE_KEY.
 */
import type { Config } from '@netlify/functions';
import { getUser } from '@netlify/identity';
import { and, eq } from 'drizzle-orm';
import { database } from '../../db/index.js';
import { proCashback, proMembers } from '../../db/schema.js';

const LIFETIME_CENTS = 1000;
const MONTHLY_CENTS = 100;
const CASHBACK_CENTS = 100;
const CASHBACK_DAYS = 40;
const CASHBACK_STEPS = 10;
const DAY = 86_400_000;
const ACTIVE = new Set(['active', 'trialing', 'past_due']);
const STRIPE_VERSION = '2024-06-20';

type Member = typeof proMembers.$inferSelect;
type Params = Record<string, string | number | boolean | undefined | null>;

function keys() {
  const secret = process.env.STRIPE_SECRET_KEY || '';
  const publishable = process.env.STRIPE_PUBLISHABLE_KEY || '';
  const enabled = (secret.startsWith('sk_') || secret.startsWith('rk_')) && publishable.startsWith('pk_');
  return { secret, publishable, enabled };
}

class StripeError extends Error {
  constructor(public code: string, public status = 502) { super(code); }
}

async function stripe(path: string, params?: Params, opts: { method?: string; idempotency?: string } = {}) {
  const method = opts.method || (params ? 'POST' : 'GET');
  const body = new URLSearchParams();
  for (const [k, v] of Object.entries(params || {})) if (v !== undefined && v !== null && v !== '') body.append(k, String(v));
  const url = 'https://api.stripe.com/v1/' + path + (method === 'GET' && params ? (path.includes('?') ? '&' : '?') + body : '');
  const headers: Record<string, string> = { Authorization: `Bearer ${keys().secret}`, 'Stripe-Version': STRIPE_VERSION };
  if (method !== 'GET') headers['Content-Type'] = 'application/x-www-form-urlencoded';
  if (opts.idempotency) headers['Idempotency-Key'] = opts.idempotency;
  let res: Response;
  try { res = await fetch(url, { method, headers, body: method === 'GET' ? undefined : body }); }
  catch { throw new StripeError('stripe_unreachable'); }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error('Stripe request failed', path.split('?')[0].split('/')[0], data?.error?.type, data?.error?.code);
    throw new StripeError(data?.error?.code === 'resource_missing' ? 'not_found' : 'stripe_error', res.status >= 500 ? 502 : 400);
  }
  return data;
}

/* Prices are created in the Stripe account on first use, so no dashboard setup is needed. */
const priceCache: Record<string, string> = {};
async function price(kind: 'monthly' | 'lifetime') {
  if (priceCache[kind]) return priceCache[kind];
  const lookup = `muhasabah_pro_${kind}_usd`;
  const found = await stripe(`prices?lookup_keys[]=${lookup}&active=true&limit=1`);
  let id = found?.data?.[0]?.id;
  if (!id) {
    const created = await stripe('prices', {
      currency: 'usd',
      unit_amount: kind === 'monthly' ? MONTHLY_CENTS : LIFETIME_CENTS,
      lookup_key: lookup,
      'product_data[name]': kind === 'monthly' ? 'Muhasabah Pro — Monthly' : 'Muhasabah Pro — Lifetime',
      ...(kind === 'monthly' ? { 'recurring[interval]': 'month' } : {}),
    }, { idempotency: `price-${lookup}` });
    id = created.id;
  }
  priceCache[kind] = id;
  return id;
}

async function memberFor(user: { id: string; email?: string }) {
  const db = database();
  const [row] = await db.select().from(proMembers).where(eq(proMembers.userId, user.id));
  if (row) return row;
  const fresh = { userId: user.id, email: user.email || '', createdAt: Date.now() };
  await db.insert(proMembers).values(fresh).onConflictDoNothing();
  const [again] = await db.select().from(proMembers).where(eq(proMembers.userId, user.id));
  return again as Member;
}
async function update(userId: string, set: Partial<Member>) {
  await database().update(proMembers).set(set).where(eq(proMembers.userId, userId));
}

async function customerFor(m: Member) {
  if (m.stripeCustomerId) return m.stripeCustomerId;
  const c = await stripe('customers', { email: m.email, 'metadata[user_id]': m.userId, 'metadata[source]': 'muhasabah-pro' }, { idempotency: `customer-${m.userId}` });
  await update(m.userId, { stripeCustomerId: c.id });
  m.stripeCustomerId = c.id;
  return c.id as string;
}

function subFields(sub: any): Partial<Member> {
  return {
    subscriptionId: sub.id,
    subscriptionStatus: sub.status,
    subscriptionPeriodEnd: sub.current_period_end ? sub.current_period_end * 1000 : null,
    subscriptionAutoRenew: !sub.cancel_at_period_end && !sub.cancel_at,
    syncedAt: Date.now(),
  };
}

async function refreshSubscription(m: Member, force = false) {
  if (!m.subscriptionId || !keys().enabled) return m;
  if (!force && m.syncedAt && Date.now() - m.syncedAt < 10 * 60_000) return m;
  try {
    const sub = await stripe(`subscriptions/${m.subscriptionId}`);
    const set = subFields(sub);
    await update(m.userId, set);
    return { ...m, ...set } as Member;
  } catch { return m; }
}

function isMonthlyActive(m: Member) {
  return !!m.subscriptionId && ACTIVE.has(m.subscriptionStatus || '') && (!m.subscriptionPeriodEnd || m.subscriptionPeriodEnd > Date.now() - 3 * DAY);
}

async function status(m: Member) {
  const claims = await database().select().from(proCashback).where(eq(proCashback.userId, m.userId));
  const claimed = claims.length;
  const lifetime = !!m.lifetimePaymentIntent;
  const monthly = isMonthlyActive(m);
  let cards: { id: string; brand: string; last4: string; exp: string }[] = [];
  if (m.stripeCustomerId && keys().enabled) {
    try {
      const pm = await stripe(`customers/${m.stripeCustomerId}/payment_methods?type=card&limit=3`);
      cards = (pm.data || []).map((p: any) => ({ id: p.id, brand: p.card?.brand || 'card', last4: p.card?.last4 || '', exp: `${String(p.card?.exp_month || '').padStart(2, '0')}/${String(p.card?.exp_year || '').slice(-2)}` }));
    } catch { /* cards are optional */ }
  }
  const nextStep = claimed + 1;
  return {
    email: m.email,
    pro: lifetime || monthly,
    lifetime: lifetime ? { purchasedAt: m.lifetimePurchasedAt } : null,
    monthly: m.subscriptionId && m.subscriptionStatus !== 'incomplete' && m.subscriptionStatus !== 'incomplete_expired'
      ? { status: m.subscriptionStatus, active: monthly, periodEnd: m.subscriptionPeriodEnd, autoRenew: m.subscriptionAutoRenew }
      : null,
    cashback: lifetime ? {
      claimed,
      refundedCents: claims.reduce((s, c) => s + c.amountCents, 0),
      remaining: CASHBACK_STEPS - claimed,
      nextEligibleAt: claimed >= CASHBACK_STEPS ? null : (m.lifetimePurchasedAt || 0) + nextStep * CASHBACK_DAYS * DAY,
    } : null,
    cards,
  };
}

const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'private, no-store' } });

export default async (req: Request) => {
  const k = keys();
  if (req.method === 'GET') {
    const user = await getUser();
    let member = null;
    if (user) {
      try { member = { ...(await status(await refreshSubscription(await memberFor(user)))), driveLinked: !!(user.userMetadata as any)?.drive_sync }; }
      catch { member = { email: user.email || '', pro: false, unavailable: true }; }
    }
    return json({
      enabled: k.enabled,
      publishableKey: k.enabled ? k.publishable : null,
      currency: 'usd',
      plans: { lifetime: LIFETIME_CENTS / 100, monthly: MONTHLY_CENTS / 100 },
      cashback: { everyDays: CASHBACK_DAYS, amount: CASHBACK_CENTS / 100, steps: CASHBACK_STEPS },
      /* Google Drive backup for Pro members (OAuth client ID from Google Cloud Console). */
      googleClientId: /\.apps\.googleusercontent\.com$/.test(process.env.GOOGLE_CLIENT_ID || '') ? process.env.GOOGLE_CLIENT_ID : null,
      signedIn: !!user,
      member,
    });
  }

  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  if (req.headers.get('origin') !== new URL(req.url).origin) return new Response('Forbidden', { status: 403 });
  const user = await getUser();
  if (!user) return json({ error: 'auth_required' }, 401);

  const raw = await req.text();
  if (raw.length > 2048) return json({ error: 'too_large' }, 413);
  let body: any;
  try { body = JSON.parse(raw); } catch { return json({ error: 'invalid_json' }, 400); }

  try {
    let m = await memberFor(user);
    if (user.email && m.email !== user.email) { await update(m.userId, { email: user.email }); m.email = user.email; }

    if (body.action === 'autorenew') {
      if (!k.enabled) return json({ error: 'not_configured' }, 503);
      m = await refreshSubscription(m, true);
      if (!isMonthlyActive(m)) return json({ error: 'no_subscription' }, 400);
      const sub = await stripe(`subscriptions/${m.subscriptionId}`, { cancel_at_period_end: body.on ? 'false' : 'true' });
      await update(m.userId, subFields(sub));
      return json({ member: await status({ ...m, ...subFields(sub) } as Member) });
    }

    if (body.action === 'cashback') {
      if (!k.enabled) return json({ error: 'not_configured' }, 503);
      if (!m.lifetimePaymentIntent) return json({ error: 'no_lifetime' }, 400);
      const streak = Math.floor(Number(body.streak));
      const claims = await database().select().from(proCashback).where(eq(proCashback.userId, m.userId));
      const step = claims.length + 1;
      if (step > CASHBACK_STEPS) return json({ error: 'cashback_complete' }, 400);
      if (!Number.isFinite(streak) || streak < CASHBACK_DAYS) return json({ error: 'streak_too_short', need: CASHBACK_DAYS }, 400);
      /* One $1 step per 40 days of membership, so the refund schedule can't be rushed. */
      const eligibleAt = (m.lifetimePurchasedAt || 0) + step * CASHBACK_DAYS * DAY;
      if (Date.now() < eligibleAt) return json({ error: 'not_yet', eligibleAt }, 400);
      const refund = await stripe('refunds', {
        payment_intent: m.lifetimePaymentIntent,
        amount: CASHBACK_CENTS,
        reason: 'requested_by_customer',
        'metadata[type]': 'muhasabah_streak_cashback',
        'metadata[step]': step,
        'metadata[user_id]': m.userId,
        'metadata[streak]': streak,
      }, { idempotency: `cashback-${m.userId}-${step}` });
      await database().insert(proCashback).values({ userId: m.userId, step, amountCents: CASHBACK_CENTS, refundId: refund.id, streak, createdAt: Date.now() }).onConflictDoNothing();
      return json({ ok: true, step, member: await status(m) });
    }

    if (body.action === 'checkout') {
      if (!k.enabled) return json({ error: 'not_configured' }, 503);
      m = await refreshSubscription(m, true);
      const wantLifetime = !!body.lifetime && !m.lifetimePaymentIntent;
      const wantMonthly = !!body.monthly && !isMonthlyActive(m);
      if (!wantLifetime && !wantMonthly) return json({ error: body.lifetime || body.monthly ? 'already_pro' : 'no_plan' }, 400);
      const customer = await customerFor(m);
      const saveCard = !!body.saveCard;
      const autoRenew = body.autoRenew !== false;

      if (wantMonthly) {
        /* Drop an abandoned checkout so the customer never ends up with two subscriptions. */
        if (m.subscriptionId && m.subscriptionStatus === 'incomplete') {
          try { await stripe(`subscriptions/${m.subscriptionId}`, undefined, { method: 'DELETE' }); } catch { /* already gone */ }
        }
        const params: Params = {
          customer,
          'items[0][price]': await price('monthly'),
          payment_behavior: 'default_incomplete',
          'payment_settings[save_default_payment_method]': 'on_subscription',
          'payment_settings[payment_method_types][0]': 'card',
          'expand[0]': 'latest_invoice.payment_intent',
          description: wantLifetime ? 'Muhasabah Pro — Lifetime + Monthly' : 'Muhasabah Pro — Monthly',
          'metadata[user_id]': m.userId,
          'metadata[lifetime]': wantLifetime ? '1' : '0',
          'metadata[auto_renew]': autoRenew ? '1' : '0',
          'metadata[save_card]': saveCard ? '1' : '0',
        };
        if (wantLifetime) params['add_invoice_items[0][price]'] = await price('lifetime');
        const sub = await stripe('subscriptions', params);
        await update(m.userId, { ...subFields(sub), subscriptionStatus: sub.status });
        const secret = sub.latest_invoice?.payment_intent?.client_secret;
        if (!secret) throw new StripeError('stripe_error');
        return json({ kind: 'subscription', id: sub.id, clientSecret: secret, amount: (wantLifetime ? LIFETIME_CENTS : 0) + MONTHLY_CENTS });
      }

      const pi = await stripe('payment_intents', {
        amount: LIFETIME_CENTS,
        currency: 'usd',
        customer,
        'payment_method_types[0]': 'card',
        setup_future_usage: saveCard ? 'off_session' : undefined,
        description: 'Muhasabah Pro — Lifetime',
        statement_descriptor_suffix: 'MUHASABAH PRO',
        receipt_email: m.email || undefined,
        'metadata[user_id]': m.userId,
        'metadata[plan]': 'lifetime',
        'metadata[save_card]': saveCard ? '1' : '0',
      });
      return json({ kind: 'payment', id: pi.id, clientSecret: pi.client_secret, amount: LIFETIME_CENTS });
    }

    if (body.action === 'confirm') {
      if (!k.enabled) return json({ error: 'not_configured' }, 503);
      const id = String(body.id || '');
      let paymentMethod: string | null = null, saveCard = false;
      if (body.kind === 'payment' && /^pi_[A-Za-z0-9]+$/.test(id)) {
        const pi = await stripe(`payment_intents/${id}`);
        if (pi.metadata?.user_id !== m.userId || pi.metadata?.plan !== 'lifetime') return json({ error: 'not_found' }, 404);
        if (pi.status !== 'succeeded') return json({ error: 'not_paid', status: pi.status }, 409);
        if (!m.lifetimePaymentIntent) await update(m.userId, { lifetimePaymentIntent: pi.id, lifetimePurchasedAt: pi.created * 1000 });
        paymentMethod = pi.payment_method; saveCard = pi.metadata?.save_card === '1';
      } else if (body.kind === 'subscription' && /^sub_[A-Za-z0-9]+$/.test(id)) {
        let sub = await stripe(`subscriptions/${id}?expand[]=latest_invoice.payment_intent`);
        if (sub.metadata?.user_id !== m.userId) return json({ error: 'not_found' }, 404);
        const pi = sub.latest_invoice?.payment_intent;
        if (!ACTIVE.has(sub.status) || !pi || pi.status !== 'succeeded') return json({ error: 'not_paid', status: sub.status }, 409);
        if (sub.metadata?.auto_renew === '0' && !sub.cancel_at_period_end) sub = await stripe(`subscriptions/${id}`, { cancel_at_period_end: 'true' });
        const set: Partial<Member> = subFields(sub);
        if (sub.metadata?.lifetime === '1' && !m.lifetimePaymentIntent) { set.lifetimePaymentIntent = pi.id; set.lifetimePurchasedAt = pi.created * 1000; }
        await update(m.userId, set);
        paymentMethod = pi.payment_method; saveCard = sub.metadata?.save_card === '1';
      } else return json({ error: 'invalid_payment' }, 400);

      if (saveCard && paymentMethod && m.stripeCustomerId) {
        try { await stripe(`customers/${m.stripeCustomerId}`, { 'invoice_settings[default_payment_method]': paymentMethod }); } catch { /* not critical */ }
      }
      const [fresh] = await database().select().from(proMembers).where(and(eq(proMembers.userId, m.userId)));
      return json({ member: await status(fresh) });
    }

    return json({ error: 'unknown_action' }, 400);
  } catch (e) {
    if (e instanceof StripeError) return json({ error: e.code }, e.status);
    console.error('Pro request failed', e instanceof Error ? e.message : 'unknown');
    return json({ error: 'unavailable' }, 503);
  }
};

export const config: Config = { path: '/api/pro' };
