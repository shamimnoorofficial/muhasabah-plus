const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const baseURL = process.env.TEST_BASE_URL || 'http://localhost:8889';
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const lang of ['en', 'bn', 'ar']) {
      const context = await browser.newContext({ serviceWorkers: 'block' });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.addInitScript(lang => {
        localStorage.setItem('muhasabah:data:v1', JSON.stringify({ lang }));
      }, lang);
      await page.goto(baseURL);
      await page.locator('#mhs-startup').waitFor({ state: 'detached' });
      assert.equal(await page.locator('html').getAttribute('lang'), lang);
      const button = page.getByRole('button', { name: lang === 'bn' ? 'এগিয়ে যান' : 'Continue', exact: true });
      // The bundle currently translates welcome content for Bengali and English.
      if (lang === 'bn') {
        await page.getByText('স্বাগতম • অভ্যাস গড়ুন, পুরস্কার অর্জন করুন', { exact: true }).waitFor();
      } else {
        await page.getByText('Welcome • Make Habit, Get Reward', { exact: true }).waitFor();
      }
      assert.equal(await page.locator('.mhs-loading').count(), 0);
      await button.click();
      assert.equal(errors.length, 0, errors.join('\n'));
      await context.close();
    }
    const context = await browser.newContext({ serviceWorkers: 'block' });
    const page = await context.newPage();
    await page.addInitScript(() => {
      localStorage.setItem('muhasabah:data:v1', JSON.stringify({ lang: 'bn' }));
    });
    await page.route('**/assets/app.js', route => route.abort());
    await page.goto(baseURL);
    await page.getByText('মুহাসাবা খোলা যায়নি। সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।', { exact: true }).waitFor();
    assert.equal(await page.locator('#mhs-startup-retry').textContent(), 'আবার চেষ্টা করুন');
    await page.unroute('**/assets/app.js');
    await page.locator('#mhs-startup-retry').click();
    await page.locator('#mhs-startup').waitFor({ state: 'detached' });
    await context.close();
    const slow = await browser.newContext({ serviceWorkers: 'block' });
    const slowPage = await slow.newPage();
    await slowPage.clock.install();
    await slowPage.route('**/assets/app.js', () => {});
    await slowPage.goto(baseURL, { waitUntil: 'commit' });
    await slowPage.locator('#mhs-startup-message').waitFor();
    await slowPage.clock.fastForward(16000);
    assert.equal(await slowPage.locator('#mhs-startup-retry').isVisible(), true);
    await slow.close();
    console.log('Startup: English, Bengali, Arabic, failed download, retry and stalled download passed');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
