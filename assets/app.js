var dA = Object.create;
var {
  getPrototypeOf: pA,
  defineProperty: Uu,
  getOwnPropertyNames: vA
} = Object;
var yA = Object.prototype.hasOwnProperty;
var Zn = (e, n, t) => {
  t = e != null ? dA(pA(e)) : {};
  let r = n || !e || !e.__esModule ? Uu(t, "default", {
    value: e,
    enumerable: !0
  }) : t;
  for (let l of vA(e)) if (!yA.call(r, l)) Uu(r, l, {
    get: () => e[l],
    enumerable: !0
  });
  return r;
};
var Hr = (e, n) => () => (n || e((n = {
  exports: {}
}).exports, n), n.exports);
var mA = (e, n) => {
  for (var t in n) Uu(e, t, {
    get: n[t],
    enumerable: !0,
    configurable: !0,
    set: r => n[t] = () => r
  });
};
var hA = (e, n) => () => (e && (n = e(e = 0)), n);
var Gt = Hr(BA => {
  var Ft = Symbol.for("react.element"),
    gA = Symbol.for("react.portal"),
    kA = Symbol.for("react.fragment"),
    SA = Symbol.for("react.strict_mode"),
    wA = Symbol.for("react.profiler"),
    EA = Symbol.for("react.provider"),
    PA = Symbol.for("react.context"),
    CA = Symbol.for("react.forward_ref"),
    zA = Symbol.for("react.suspense"),
    NA = Symbol.for("react.memo"),
    TA = Symbol.for("react.lazy"),
    sa = Symbol.iterator;
  function RA(e) {
    if (e === null || typeof e !== "object") return null;
    return e = sa && e[sa] || e["@@iterator"], typeof e === "function" ? e : null;
  }
  var pa = {
      isMounted: function () {
        return !1;
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {}
    },
    va = Object.assign,
    ya = {};
  function ot(e, n, t) {
    this.props = e, this.context = n, this.refs = ya, this.updater = t || pa;
  }
  ot.prototype.isReactComponent = {};
  ot.prototype.setState = function (e, n) {
    if (typeof e !== "object" && typeof e !== "function" && e != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, e, n, "setState");
  };
  ot.prototype.forceUpdate = function (e) {
    this.updater.enqueueForceUpdate(this, e, "forceUpdate");
  };
  function ma() {}
  ma.prototype = ot.prototype;
  function Ou(e, n, t) {
    this.props = e, this.context = n, this.refs = ya, this.updater = t || pa;
  }
  var _u = Ou.prototype = new ma();
  _u.constructor = Ou;
  va(_u, ot.prototype);
  _u.isPureReactComponent = !0;
  var Aa = Array.isArray,
    ha = Object.prototype.hasOwnProperty,
    Bu = {
      current: null
    },
    ga = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    };
  function ka(e, n, t) {
    var r,
      l = {},
      u = null,
      o = null;
    if (n != null) for (r in n.ref !== void 0 && (o = n.ref), n.key !== void 0 && (u = "" + n.key), n) ha.call(n, r) && !ga.hasOwnProperty(r) && (l[r] = n[r]);
    var c = arguments.length - 2;
    if (c === 1) l.children = t;else if (1 < c) {
      for (var s = Array(c), d = 0; d < c; d++) s[d] = arguments[d + 2];
      l.children = s;
    }
    if (e && e.defaultProps) for (r in c = e.defaultProps, c) l[r] === void 0 && (l[r] = c[r]);
    return {
      $$typeof: Ft,
      type: e,
      key: u,
      ref: o,
      props: l,
      _owner: Bu.current
    };
  }
  function UA(e, n) {
    return {
      $$typeof: Ft,
      type: e.type,
      key: n,
      ref: e.ref,
      props: e.props,
      _owner: e._owner
    };
  }
  function Qu(e) {
    return typeof e === "object" && e !== null && e.$$typeof === Ft;
  }
  function LA(e) {
    var n = {
      "=": "=0",
      ":": "=2"
    };
    return "$" + e.replace(/[=:]/g, function (t) {
      return n[t];
    });
  }
  var da = /\/+/g;
  function Lu(e, n) {
    return typeof e === "object" && e !== null && e.key != null ? LA("" + e.key) : n.toString(36);
  }
  function xr(e, n, t, r, l) {
    var u = typeof e;
    if (u === "undefined" || u === "boolean") e = null;
    var o = !1;
    if (e === null) o = !0;else switch (u) {
      case "string":
      case "number":
        o = !0;
        break;
      case "object":
        switch (e.$$typeof) {
          case Ft:
          case gA:
            o = !0;
        }
    }
    if (o) return o = e, l = l(o), e = r === "" ? "." + Lu(o, 0) : r, Aa(l) ? (t = "", e != null && (t = e.replace(da, "$&/") + "/"), xr(l, n, t, "", function (d) {
      return d;
    })) : l != null && (Qu(l) && (l = UA(l, t + (!l.key || o && o.key === l.key ? "" : ("" + l.key).replace(da, "$&/") + "/") + e)), n.push(l)), 1;
    if (o = 0, r = r === "" ? "." : r + ":", Aa(e)) for (var c = 0; c < e.length; c++) {
      u = e[c];
      var s = r + Lu(u, c);
      o += xr(u, n, t, s, l);
    } else if (s = RA(e), typeof s === "function") for (e = s.call(e), c = 0; !(u = e.next()).done;) u = u.value, s = r + Lu(u, c++), o += xr(u, n, t, s, l);else if (u === "object") throw n = String(e), Error("Objects are not valid as a React child (found: " + (n === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : n) + "). If you meant to render a collection of children, use an array instead.");
    return o;
  }
  function $r(e, n, t) {
    if (e == null) return e;
    var r = [],
      l = 0;
    return xr(e, r, "", "", function (u) {
      return n.call(t, u, l++);
    }), r;
  }
  function OA(e) {
    if (e._status === -1) {
      var n = e._result;
      n = n(), n.then(function (t) {
        if (e._status === 0 || e._status === -1) e._status = 1, e._result = t;
      }, function (t) {
        if (e._status === 0 || e._status === -1) e._status = 2, e._result = t;
      }), e._status === -1 && (e._status = 0, e._result = n);
    }
    if (e._status === 1) return e._result.default;
    throw e._result;
  }
  var ge = {
      current: null
    },
    jr = {
      transition: null
    },
    _A = {
      ReactCurrentDispatcher: ge,
      ReactCurrentBatchConfig: jr,
      ReactCurrentOwner: Bu
    };
  function Sa() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  BA.Children = {
    map: $r,
    forEach: function (e, n, t) {
      $r(e, function () {
        n.apply(this, arguments);
      }, t);
    },
    count: function (e) {
      var n = 0;
      return $r(e, function () {
        n++;
      }), n;
    },
    toArray: function (e) {
      return $r(e, function (n) {
        return n;
      }) || [];
    },
    only: function (e) {
      if (!Qu(e)) throw Error("React.Children.only expected to receive a single React element child.");
      return e;
    }
  };
  BA.Component = ot;
  BA.Fragment = kA;
  BA.Profiler = wA;
  BA.PureComponent = Ou;
  BA.StrictMode = SA;
  BA.Suspense = zA;
  BA.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = _A;
  BA.act = Sa;
  BA.cloneElement = function (e, n, t) {
    if (e === null || e === void 0) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + e + ".");
    var r = va({}, e.props),
      l = e.key,
      u = e.ref,
      o = e._owner;
    if (n != null) {
      if (n.ref !== void 0 && (u = n.ref, o = Bu.current), n.key !== void 0 && (l = "" + n.key), e.type && e.type.defaultProps) var c = e.type.defaultProps;
      for (s in n) ha.call(n, s) && !ga.hasOwnProperty(s) && (r[s] = n[s] === void 0 && c !== void 0 ? c[s] : n[s]);
    }
    var s = arguments.length - 2;
    if (s === 1) r.children = t;else if (1 < s) {
      c = Array(s);
      for (var d = 0; d < s; d++) c[d] = arguments[d + 2];
      r.children = c;
    }
    return {
      $$typeof: Ft,
      type: e.type,
      key: l,
      ref: u,
      props: r,
      _owner: o
    };
  };
  BA.createContext = function (e) {
    return e = {
      $$typeof: PA,
      _currentValue: e,
      _currentValue2: e,
      _threadCount: 0,
      Provider: null,
      Consumer: null,
      _defaultValue: null,
      _globalName: null
    }, e.Provider = {
      $$typeof: EA,
      _context: e
    }, e.Consumer = e;
  };
  BA.createElement = ka;
  BA.createFactory = function (e) {
    var n = ka.bind(null, e);
    return n.type = e, n;
  };
  BA.createRef = function () {
    return {
      current: null
    };
  };
  BA.forwardRef = function (e) {
    return {
      $$typeof: CA,
      render: e
    };
  };
  BA.isValidElement = Qu;
  BA.lazy = function (e) {
    return {
      $$typeof: TA,
      _payload: {
        _status: -1,
        _result: e
      },
      _init: OA
    };
  };
  BA.memo = function (e, n) {
    return {
      $$typeof: NA,
      type: e,
      compare: n === void 0 ? null : n
    };
  };
  BA.startTransition = function (e) {
    var n = jr.transition;
    jr.transition = {};
    try {
      e();
    } finally {
      jr.transition = n;
    }
  };
  BA.unstable_act = Sa;
  BA.useCallback = function (e, n) {
    return ge.current.useCallback(e, n);
  };
  BA.useContext = function (e) {
    return ge.current.useContext(e);
  };
  BA.useDebugValue = function () {};
  BA.useDeferredValue = function (e) {
    return ge.current.useDeferredValue(e);
  };
  BA.useEffect = function (e, n) {
    return ge.current.useEffect(e, n);
  };
  BA.useId = function () {
    return ge.current.useId();
  };
  BA.useImperativeHandle = function (e, n, t) {
    return ge.current.useImperativeHandle(e, n, t);
  };
  BA.useInsertionEffect = function (e, n) {
    return ge.current.useInsertionEffect(e, n);
  };
  BA.useLayoutEffect = function (e, n) {
    return ge.current.useLayoutEffect(e, n);
  };
  BA.useMemo = function (e, n) {
    return ge.current.useMemo(e, n);
  };
  BA.useReducer = function (e, n, t) {
    return ge.current.useReducer(e, n, t);
  };
  BA.useRef = function (e) {
    return ge.current.useRef(e);
  };
  BA.useState = function (e) {
    return ge.current.useState(e);
  };
  BA.useSyncExternalStore = function (e, n, t) {
    return ge.current.useSyncExternalStore(e, n, t);
  };
  BA.useTransition = function () {
    return ge.current.useTransition();
  };
  BA.version = "18.3.1";
});
var Ta = Hr(hd => {
  function Wu(e, n) {
    var t = e.length;
    e.push(n);
    e: for (; 0 < t;) {
      var r = t - 1 >>> 1,
        l = e[r];
      if (0 < br(l, n)) e[r] = n, e[t] = l, t = r;else break e;
    }
  }
  function Ze(e) {
    return e.length === 0 ? null : e[0];
  }
  function rl(e) {
    if (e.length === 0) return null;
    var n = e[0],
      t = e.pop();
    if (t !== n) {
      e[0] = t;
      e: for (var r = 0, l = e.length, u = l >>> 1; r < u;) {
        var o = 2 * (r + 1) - 1,
          c = e[o],
          s = o + 1,
          d = e[s];
        if (0 > br(c, t)) s < l && 0 > br(d, c) ? (e[r] = d, e[s] = t, r = s) : (e[r] = c, e[o] = t, r = o);else if (s < l && 0 > br(d, t)) e[r] = d, e[s] = t, r = s;else break e;
      }
    }
    return n;
  }
  function br(e, n) {
    var t = e.sortIndex - n.sortIndex;
    return t !== 0 ? t : e.id - n.id;
  }
  if (typeof performance === "object" && typeof performance.now === "function") Mu = performance, hd.unstable_now = function () {
    return Mu.now();
  };else el = Date, Du = el.now(), hd.unstable_now = function () {
    return el.now() - Du;
  };
  var Mu,
    el,
    Du,
    $e = [],
    mn = [],
    md = 1,
    _e = null,
    de = 3,
    ll = !1,
    Kn = !1,
    Jt = !1,
    Ea = typeof setTimeout === "function" ? setTimeout : null,
    Pa = typeof clearTimeout === "function" ? clearTimeout : null,
    wa = typeof setImmediate < "u" ? setImmediate : null;
  typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function Vu(e) {
    for (var n = Ze(mn); n !== null;) {
      if (n.callback === null) rl(mn);else if (n.startTime <= e) rl(mn), n.sortIndex = n.expirationTime, Wu($e, n);else break;
      n = Ze(mn);
    }
  }
  function Ku(e) {
    if (Jt = !1, Vu(e), !Kn) if (Ze($e) !== null) Kn = !0, Fu(Xu);else {
      var n = Ze(mn);
      n !== null && Gu(Ku, n.startTime - e);
    }
  }
  function Xu(e, n) {
    Kn = !1, Jt && (Jt = !1, Pa(qt), qt = -1), ll = !0;
    var t = de;
    try {
      Vu(n);
      for (_e = Ze($e); _e !== null && (!(_e.expirationTime > n) || e && !Na());) {
        var r = _e.callback;
        if (typeof r === "function") {
          _e.callback = null, de = _e.priorityLevel;
          var l = r(_e.expirationTime <= n);
          n = hd.unstable_now(), typeof l === "function" ? _e.callback = l : _e === Ze($e) && rl($e), Vu(n);
        } else rl($e);
        _e = Ze($e);
      }
      if (_e !== null) var u = !0;else {
        var o = Ze(mn);
        o !== null && Gu(Ku, o.startTime - n), u = !1;
      }
      return u;
    } finally {
      _e = null, de = t, ll = !1;
    }
  }
  var ul = !1,
    nl = null,
    qt = -1,
    Ca = 5,
    za = -1;
  function Na() {
    return hd.unstable_now() - za < Ca ? !1 : !0;
  }
  function Iu() {
    if (nl !== null) {
      var e = hd.unstable_now();
      za = e;
      var n = !0;
      try {
        n = nl(!0, e);
      } finally {
        n ? Yt() : (ul = !1, nl = null);
      }
    } else ul = !1;
  }
  var Yt;
  if (typeof wa === "function") Yt = function () {
    wa(Iu);
  };else if (typeof MessageChannel < "u") tl = new MessageChannel(), Zu = tl.port2, tl.port1.onmessage = Iu, Yt = function () {
    Zu.postMessage(null);
  };else Yt = function () {
    Ea(Iu, 0);
  };
  var tl, Zu;
  function Fu(e) {
    nl = e, ul || (ul = !0, Yt());
  }
  function Gu(e, n) {
    qt = Ea(function () {
      e(hd.unstable_now());
    }, n);
  }
  hd.unstable_IdlePriority = 5;
  hd.unstable_ImmediatePriority = 1;
  hd.unstable_LowPriority = 4;
  hd.unstable_NormalPriority = 3;
  hd.unstable_Profiling = null;
  hd.unstable_UserBlockingPriority = 2;
  hd.unstable_cancelCallback = function (e) {
    e.callback = null;
  };
  hd.unstable_continueExecution = function () {
    Kn || ll || (Kn = !0, Fu(Xu));
  };
  hd.unstable_forceFrameRate = function (e) {
    0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : Ca = 0 < e ? Math.floor(1000 / e) : 5;
  };
  hd.unstable_getCurrentPriorityLevel = function () {
    return de;
  };
  hd.unstable_getFirstCallbackNode = function () {
    return Ze($e);
  };
  hd.unstable_next = function (e) {
    switch (de) {
      case 1:
      case 2:
      case 3:
        var n = 3;
        break;
      default:
        n = de;
    }
    var t = de;
    de = n;
    try {
      return e();
    } finally {
      de = t;
    }
  };
  hd.unstable_pauseExecution = function () {};
  hd.unstable_requestPaint = function () {};
  hd.unstable_runWithPriority = function (e, n) {
    switch (e) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        e = 3;
    }
    var t = de;
    de = e;
    try {
      return n();
    } finally {
      de = t;
    }
  };
  hd.unstable_scheduleCallback = function (e, n, t) {
    var r = hd.unstable_now();
    switch (typeof t === "object" && t !== null ? (t = t.delay, t = typeof t === "number" && 0 < t ? r + t : r) : t = r, e) {
      case 1:
        var l = -1;
        break;
      case 2:
        l = 250;
        break;
      case 5:
        l = 1073741823;
        break;
      case 4:
        l = 1e4;
        break;
      default:
        l = 5000;
    }
    return l = t + l, e = {
      id: md++,
      callback: n,
      priorityLevel: e,
      startTime: t,
      expirationTime: l,
      sortIndex: -1
    }, t > r ? (e.sortIndex = t, Wu(mn, e), Ze($e) === null && e === Ze(mn) && (Jt ? (Pa(qt), qt = -1) : Jt = !0, Gu(Ku, t - r))) : (e.sortIndex = l, Wu($e, e), Kn || ll || (Kn = !0, Fu(Xu))), e;
  };
  hd.unstable_shouldYield = Na;
  hd.unstable_wrapCallback = function (e) {
    var n = de;
    return function () {
      var t = de;
      de = n;
      try {
        return e.apply(this, arguments);
      } finally {
        de = t;
      }
    };
  };
});
var ji = {};
mA(ji, {
  version: () => Xs,
  unstable_renderSubtreeIntoContainer: () => Ks,
  unstable_batchedUpdates: () => Zs,
  unmountComponentAtNode: () => Vs,
  render: () => Ds,
  hydrateRoot: () => Ms,
  hydrate: () => Ws,
  flushSync: () => Is,
  findDOMNode: () => Qs,
  createRoot: () => Bs,
  createPortal: () => _s,
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: () => Os
});
function S(e) {
  for (var n = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, t = 1; t < arguments.length; t++) n += "&args[]=" + encodeURIComponent(arguments[t]);
  return "Minified React error #" + e + "; visit " + n + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
function tt(e, n) {
  Tt(e, n), Tt(e + "Capture", n);
}
function Tt(e, n) {
  gr[e] = n;
  for (e = 0; e < n.length; e++) Bc.add(n[e]);
}
function Md(e) {
  if (po.call(Ua, e)) return !0;
  if (po.call(Ra, e)) return !1;
  if (Wd.test(e)) return Ua[e] = !0;
  return Ra[e] = !0, !1;
}
function Dd(e, n, t, r) {
  if (t !== null && t.type === 0) return !1;
  switch (typeof n) {
    case "function":
    case "symbol":
      return !0;
    case "boolean":
      if (r) return !1;
      if (t !== null) return !t.acceptsBooleans;
      return e = e.toLowerCase().slice(0, 5), e !== "data-" && e !== "aria-";
    default:
      return !1;
  }
}
function Vd(e, n, t, r) {
  if (n === null || typeof n > "u" || Dd(e, n, t, r)) return !0;
  if (r) return !1;
  if (t !== null) switch (t.type) {
    case 3:
      return !n;
    case 4:
      return n === !1;
    case 5:
      return isNaN(n);
    case 6:
      return isNaN(n) || 1 > n;
  }
  return !1;
}
function we(e, n, t, r, l, u, o) {
  this.acceptsBooleans = n === 2 || n === 3 || n === 4, this.attributeName = r, this.attributeNamespace = l, this.mustUseProperty = t, this.propertyName = e, this.type = n, this.sanitizeURL = u, this.removeEmptyString = o;
}
function ci(e) {
  return e[1].toUpperCase();
}
function fi(e, n, t, r) {
  var l = ae.hasOwnProperty(n) ? ae[n] : null;
  if (l !== null ? l.type !== 0 : r || !(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") Vd(n, t, l, r) && (t = null), r || l === null ? Md(n) && (t === null ? e.removeAttribute(n) : e.setAttribute(n, "" + t)) : l.mustUseProperty ? e[l.propertyName] = t === null ? l.type === 3 ? !1 : "" : t : (n = l.attributeName, r = l.attributeNamespace, t === null ? e.removeAttribute(n) : (l = l.type, t = l === 3 || l === 4 && t === !0 ? "" : "" + t, r ? e.setAttributeNS(r, n, t) : e.setAttribute(n, t)));
}
function Ht(e) {
  if (e === null || typeof e !== "object") return null;
  return e = La && e[La] || e["@@iterator"], typeof e === "function" ? e : null;
}
function tr(e) {
  if (Yu === void 0) try {
    throw Error();
  } catch (t) {
    var n = t.stack.trim().match(/\n( *(at )?)/);
    Yu = n && n[1] || "";
  }
  return `
` + Yu + e;
}
function qu(e, n) {
  if (!e || Ju) return "";
  Ju = !0;
  var t = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (n) {
      if (n = function () {
        throw Error();
      }, Object.defineProperty(n.prototype, "props", {
        set: function () {
          throw Error();
        }
      }), typeof Reflect === "object" && Reflect.construct) {
        try {
          Reflect.construct(n, []);
        } catch (d) {
          var r = d;
        }
        Reflect.construct(e, [], n);
      } else {
        try {
          n.call();
        } catch (d) {
          r = d;
        }
        e.call(n.prototype);
      }
    } else {
      try {
        throw Error();
      } catch (d) {
        r = d;
      }
      e();
    }
  } catch (d) {
    if (d && r && typeof d.stack === "string") {
      for (var l = d.stack.split(`
`), u = r.stack.split(`
`), o = l.length - 1, c = u.length - 1; 1 <= o && 0 <= c && l[o] !== u[c];) c--;
      for (; 1 <= o && 0 <= c; o--, c--) if (l[o] !== u[c]) {
        if (o !== 1 || c !== 1) do if (o--, c--, 0 > c || l[o] !== u[c]) {
          var s = `
` + l[o].replace(" at new ", " at ");
          return e.displayName && s.includes("<anonymous>") && (s = s.replace("<anonymous>", e.displayName)), s;
        } while (1 <= o && 0 <= c);
        break;
      }
    }
  } finally {
    Ju = !1, Error.prepareStackTrace = t;
  }
  return (e = e ? e.displayName || e.name : "") ? tr(e) : "";
}
function Zd(e) {
  switch (e.tag) {
    case 5:
      return tr(e.type);
    case 16:
      return tr("Lazy");
    case 13:
      return tr("Suspense");
    case 19:
      return tr("SuspenseList");
    case 0:
    case 2:
    case 15:
      return e = qu(e.type, !1), e;
    case 11:
      return e = qu(e.type.render, !1), e;
    case 1:
      return e = qu(e.type, !0), e;
    default:
      return "";
  }
}
function ho(e) {
  if (e == null) return null;
  if (typeof e === "function") return e.displayName || e.name || null;
  if (typeof e === "string") return e;
  switch (e) {
    case st:
      return "Fragment";
    case ft:
      return "Portal";
    case vo:
      return "Profiler";
    case si:
      return "StrictMode";
    case yo:
      return "Suspense";
    case mo:
      return "SuspenseList";
  }
  if (typeof e === "object") switch (e.$$typeof) {
    case Ic:
      return (e.displayName || "Context") + ".Consumer";
    case Qc:
      return (e._context.displayName || "Context") + ".Provider";
    case Ai:
      var n = e.render;
      return e = e.displayName, e || (e = n.displayName || n.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
    case di:
      return n = e.displayName || null, n !== null ? n : ho(e.type) || "Memo";
    case gn:
      n = e._payload, e = e._init;
      try {
        return ho(e(n));
      } catch (t) {}
  }
  return null;
}
function Kd(e) {
  var n = e.type;
  switch (e.tag) {
    case 24:
      return "Cache";
    case 9:
      return (n.displayName || "Context") + ".Consumer";
    case 10:
      return (n._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return e = n.render, e = e.displayName || e.name || "", n.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef");
    case 7:
      return "Fragment";
    case 5:
      return n;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return ho(n);
    case 8:
      return n === si ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if (typeof n === "function") return n.displayName || n.name || null;
      if (typeof n === "string") return n;
  }
  return null;
}
function _n(e) {
  switch (typeof e) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return e;
    case "object":
      return e;
    default:
      return "";
  }
}
function Mc(e) {
  var n = e.type;
  return (e = e.nodeName) && e.toLowerCase() === "input" && (n === "checkbox" || n === "radio");
}
function Xd(e) {
  var n = Mc(e) ? "checked" : "value",
    t = Object.getOwnPropertyDescriptor(e.constructor.prototype, n),
    r = "" + e[n];
  if (!e.hasOwnProperty(n) && typeof t < "u" && typeof t.get === "function" && typeof t.set === "function") {
    var {
      get: l,
      set: u
    } = t;
    return Object.defineProperty(e, n, {
      configurable: !0,
      get: function () {
        return l.call(this);
      },
      set: function (o) {
        r = "" + o, u.call(this, o);
      }
    }), Object.defineProperty(e, n, {
      enumerable: t.enumerable
    }), {
      getValue: function () {
        return r;
      },
      setValue: function (o) {
        r = "" + o;
      },
      stopTracking: function () {
        e._valueTracker = null, delete e[n];
      }
    };
  }
}
function il(e) {
  e._valueTracker || (e._valueTracker = Xd(e));
}
function Dc(e) {
  if (!e) return !1;
  var n = e._valueTracker;
  if (!n) return !0;
  var t = n.getValue(),
    r = "";
  return e && (r = Mc(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== t ? (n.setValue(e), !0) : !1;
}
function Ol(e) {
  if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
  try {
    return e.activeElement || e.body;
  } catch (n) {
    return e.body;
  }
}
function go(e, n) {
  var t = n.checked;
  return J({}, n, {
    defaultChecked: void 0,
    defaultValue: void 0,
    value: void 0,
    checked: t != null ? t : e._wrapperState.initialChecked
  });
}
function Oa(e, n) {
  var t = n.defaultValue == null ? "" : n.defaultValue,
    r = n.checked != null ? n.checked : n.defaultChecked;
  t = _n(n.value != null ? n.value : t), e._wrapperState = {
    initialChecked: r,
    initialValue: t,
    controlled: n.type === "checkbox" || n.type === "radio" ? n.checked != null : n.value != null
  };
}
function Vc(e, n) {
  n = n.checked, n != null && fi(e, "checked", n, !1);
}
function ko(e, n) {
  Vc(e, n);
  var t = _n(n.value),
    r = n.type;
  if (t != null) {
    if (r === "number") {
      if (t === 0 && e.value === "" || e.value != t) e.value = "" + t;
    } else e.value !== "" + t && (e.value = "" + t);
  } else if (r === "submit" || r === "reset") {
    e.removeAttribute("value");
    return;
  }
  n.hasOwnProperty("value") ? So(e, n.type, t) : n.hasOwnProperty("defaultValue") && So(e, n.type, _n(n.defaultValue)), n.checked == null && n.defaultChecked != null && (e.defaultChecked = !!n.defaultChecked);
}
function _a(e, n, t) {
  if (n.hasOwnProperty("value") || n.hasOwnProperty("defaultValue")) {
    var r = n.type;
    if (!(r !== "submit" && r !== "reset" || n.value !== void 0 && n.value !== null)) return;
    n = "" + e._wrapperState.initialValue, t || n === e.value || (e.value = n), e.defaultValue = n;
  }
  t = e.name, t !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, t !== "" && (e.name = t);
}
function So(e, n, t) {
  if (n !== "number" || Ol(e.ownerDocument) !== e) t == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + t && (e.defaultValue = "" + t);
}
function wt(e, n, t, r) {
  if (e = e.options, n) {
    n = {};
    for (var l = 0; l < t.length; l++) n["$" + t[l]] = !0;
    for (t = 0; t < e.length; t++) l = n.hasOwnProperty("$" + e[t].value), e[t].selected !== l && (e[t].selected = l), l && r && (e[t].defaultSelected = !0);
  } else {
    t = "" + _n(t), n = null;
    for (l = 0; l < e.length; l++) {
      if (e[l].value === t) {
        e[l].selected = !0, r && (e[l].defaultSelected = !0);
        return;
      }
      n !== null || e[l].disabled || (n = e[l]);
    }
    n !== null && (n.selected = !0);
  }
}
function wo(e, n) {
  if (n.dangerouslySetInnerHTML != null) throw Error(S(91));
  return J({}, n, {
    value: void 0,
    defaultValue: void 0,
    children: "" + e._wrapperState.initialValue
  });
}
function Ba(e, n) {
  var t = n.value;
  if (t == null) {
    if (t = n.children, n = n.defaultValue, t != null) {
      if (n != null) throw Error(S(92));
      if (rr(t)) {
        if (1 < t.length) throw Error(S(93));
        t = t[0];
      }
      n = t;
    }
    n == null && (n = ""), t = n;
  }
  e._wrapperState = {
    initialValue: _n(t)
  };
}
function Zc(e, n) {
  var t = _n(n.value),
    r = _n(n.defaultValue);
  t != null && (t = "" + t, t !== e.value && (e.value = t), n.defaultValue == null && e.defaultValue !== t && (e.defaultValue = t)), r != null && (e.defaultValue = "" + r);
}
function Qa(e) {
  var n = e.textContent;
  n === e._wrapperState.initialValue && n !== "" && n !== null && (e.value = n);
}
function Kc(e) {
  switch (e) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function Eo(e, n) {
  return e == null || e === "http://www.w3.org/1999/xhtml" ? Kc(n) : e === "http://www.w3.org/2000/svg" && n === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
}
function kr(e, n) {
  if (n) {
    var t = e.firstChild;
    if (t && t === e.lastChild && t.nodeType === 3) {
      t.nodeValue = n;
      return;
    }
  }
  e.textContent = n;
}
function Fc(e, n, t) {
  return n == null || typeof n === "boolean" || n === "" ? "" : t || typeof n !== "number" || n === 0 || fr.hasOwnProperty(e) && fr[e] ? ("" + n).trim() : n + "px";
}
function Gc(e, n) {
  e = e.style;
  for (var t in n) if (n.hasOwnProperty(t)) {
    var r = t.indexOf("--") === 0,
      l = Fc(t, n[t], r);
    t === "float" && (t = "cssFloat"), r ? e.setProperty(t, l) : e[t] = l;
  }
}
function Po(e, n) {
  if (n) {
    if (Gd[e] && (n.children != null || n.dangerouslySetInnerHTML != null)) throw Error(S(137, e));
    if (n.dangerouslySetInnerHTML != null) {
      if (n.children != null) throw Error(S(60));
      if (typeof n.dangerouslySetInnerHTML !== "object" || !("__html" in n.dangerouslySetInnerHTML)) throw Error(S(61));
    }
    if (n.style != null && typeof n.style !== "object") throw Error(S(62));
  }
}
function Co(e, n) {
  if (e.indexOf("-") === -1) return typeof n.is === "string";
  switch (e) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return !1;
    default:
      return !0;
  }
}
function pi(e) {
  return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
}
function Ia(e) {
  if (e = Mr(e)) {
    if (typeof No !== "function") throw Error(S(280));
    var n = e.stateNode;
    n && (n = ou(n), No(e.stateNode, e.type, n));
  }
}
function Yc(e) {
  Et ? Pt ? Pt.push(e) : Pt = [e] : Et = e;
}
function Jc() {
  if (Et) {
    var e = Et,
      n = Pt;
    if (Pt = Et = null, Ia(e), n) for (e = 0; e < n.length; e++) Ia(n[e]);
  }
}
function qc(e, n) {
  return e(n);
}
function Hc() {}
function $c(e, n, t) {
  if (Hu) return e(n, t);
  Hu = !0;
  try {
    return qc(e, n, t);
  } finally {
    if (Hu = !1, Et !== null || Pt !== null) Hc(), Jc();
  }
}
function Sr(e, n) {
  var t = e.stateNode;
  if (t === null) return null;
  var r = ou(t);
  if (r === null) return null;
  t = r[n];
  e: switch (n) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (r = !r.disabled) || (e = e.type, r = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !r;
      break e;
    default:
      e = !1;
  }
  if (e) return null;
  if (t && typeof t !== "function") throw Error(S(231, n, typeof t));
  return t;
}
function Yd(e, n, t, r, l, u, o, c, s) {
  var d = Array.prototype.slice.call(arguments, 3);
  try {
    n.apply(t, d);
  } catch (m) {
    this.onError(m);
  }
}
function qd(e, n, t, r, l, u, o, c, s) {
  sr = !1, _l = null, Yd.apply(Jd, arguments);
}
function Hd(e, n, t, r, l, u, o, c, s) {
  if (qd.apply(this, arguments), sr) {
    if (sr) {
      var d = _l;
      sr = !1, _l = null;
    } else throw Error(S(198));
    Bl || (Bl = !0, Ro = d);
  }
}
function rt(e) {
  var n = e,
    t = e;
  if (e.alternate) for (; n.return;) n = n.return;else {
    e = n;
    do n = e, (n.flags & 4098) !== 0 && (t = n.return), e = n.return; while (e);
  }
  return n.tag === 3 ? t : null;
}
function xc(e) {
  if (e.tag === 13) {
    var n = e.memoizedState;
    if (n === null && (e = e.alternate, e !== null && (n = e.memoizedState)), n !== null) return n.dehydrated;
  }
  return null;
}
function Wa(e) {
  if (rt(e) !== e) throw Error(S(188));
}
function $d(e) {
  var n = e.alternate;
  if (!n) {
    if (n = rt(e), n === null) throw Error(S(188));
    return n !== e ? null : e;
  }
  for (var t = e, r = n;;) {
    var l = t.return;
    if (l === null) break;
    var u = l.alternate;
    if (u === null) {
      if (r = l.return, r !== null) {
        t = r;
        continue;
      }
      break;
    }
    if (l.child === u.child) {
      for (u = l.child; u;) {
        if (u === t) return Wa(l), e;
        if (u === r) return Wa(l), n;
        u = u.sibling;
      }
      throw Error(S(188));
    }
    if (t.return !== r.return) t = l, r = u;else {
      for (var o = !1, c = l.child; c;) {
        if (c === t) {
          o = !0, t = l, r = u;
          break;
        }
        if (c === r) {
          o = !0, r = l, t = u;
          break;
        }
        c = c.sibling;
      }
      if (!o) {
        for (c = u.child; c;) {
          if (c === t) {
            o = !0, t = u, r = l;
            break;
          }
          if (c === r) {
            o = !0, r = u, t = l;
            break;
          }
          c = c.sibling;
        }
        if (!o) throw Error(S(189));
      }
    }
    if (t.alternate !== r) throw Error(S(190));
  }
  if (t.tag !== 3) throw Error(S(188));
  return t.stateNode.current === t ? e : n;
}
function jc(e) {
  return e = $d(e), e !== null ? bc(e) : null;
}
function bc(e) {
  if (e.tag === 5 || e.tag === 6) return e;
  for (e = e.child; e !== null;) {
    var n = bc(e);
    if (n !== null) return n;
    e = e.sibling;
  }
  return null;
}
function np(e) {
  if (en && typeof en.onCommitFiberRoot === "function") try {
    en.onCommitFiberRoot(tu, e, void 0, (e.current.flags & 128) === 128);
  } catch (n) {}
}
function lp(e) {
  return e >>>= 0, e === 0 ? 32 : 31 - (tp(e) / rp | 0) | 0;
}
function lr(e) {
  switch (e & -e) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return e & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return e & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return e;
  }
}
function Il(e, n) {
  var t = e.pendingLanes;
  if (t === 0) return 0;
  var r = 0,
    l = e.suspendedLanes,
    u = e.pingedLanes,
    o = t & 268435455;
  if (o !== 0) {
    var c = o & ~l;
    c !== 0 ? r = lr(c) : (u &= o, u !== 0 && (r = lr(u)));
  } else o = t & ~l, o !== 0 ? r = lr(o) : u !== 0 && (r = lr(u));
  if (r === 0) return 0;
  if (n !== 0 && n !== r && (n & l) === 0 && (l = r & -r, u = n & -n, l >= u || l === 16 && (u & 4194240) !== 0)) return n;
  if ((r & 4) !== 0 && (r |= t & 16), n = e.entangledLanes, n !== 0) for (e = e.entanglements, n &= r; 0 < n;) t = 31 - Ye(n), l = 1 << t, r |= e[t], n &= ~l;
  return r;
}
function up(e, n) {
  switch (e) {
    case 1:
    case 2:
    case 4:
      return n + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return n + 5000;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function op(e, n) {
  for (var {
    suspendedLanes: t,
    pingedLanes: r,
    expirationTimes: l,
    pendingLanes: u
  } = e; 0 < u;) {
    var o = 31 - Ye(u),
      c = 1 << o,
      s = l[o];
    if (s === -1) {
      if ((c & t) === 0 || (c & r) !== 0) l[o] = up(c, n);
    } else s <= n && (e.expiredLanes |= c);
    u &= ~c;
  }
}
function Uo(e) {
  return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
}
function rf() {
  var e = cl;
  return cl <<= 1, (cl & 4194240) === 0 && (cl = 64), e;
}
function $u(e) {
  for (var n = [], t = 0; 31 > t; t++) n.push(e);
  return n;
}
function Ir(e, n, t) {
  e.pendingLanes |= n, n !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, n = 31 - Ye(n), e[n] = t;
}
function ip(e, n) {
  var t = e.pendingLanes & ~n;
  e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= n, e.mutableReadLanes &= n, e.entangledLanes &= n, n = e.entanglements;
  var r = e.eventTimes;
  for (e = e.expirationTimes; 0 < t;) {
    var l = 31 - Ye(t),
      u = 1 << l;
    n[l] = 0, r[l] = -1, e[l] = -1, t &= ~u;
  }
}
function yi(e, n) {
  var t = e.entangledLanes |= n;
  for (e = e.entanglements; t;) {
    var r = 31 - Ye(t),
      l = 1 << r;
    l & n | e[r] & n && (e[r] |= n), t &= ~l;
  }
}
function lf(e) {
  return e &= -e, 1 < e ? 4 < e ? (e & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
}
function Da(e, n) {
  switch (e) {
    case "focusin":
    case "focusout":
      Cn = null;
      break;
    case "dragenter":
    case "dragleave":
      zn = null;
      break;
    case "mouseover":
    case "mouseout":
      Nn = null;
      break;
    case "pointerover":
    case "pointerout":
      wr.delete(n.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Er.delete(n.pointerId);
  }
}
function $t(e, n, t, r, l, u) {
  if (e === null || e.nativeEvent !== u) return e = {
    blockedOn: n,
    domEventName: t,
    eventSystemFlags: r,
    nativeEvent: u,
    targetContainers: [l]
  }, n !== null && (n = Mr(n), n !== null && mi(n)), e;
  return e.eventSystemFlags |= r, n = e.targetContainers, l !== null && n.indexOf(l) === -1 && n.push(l), e;
}
function cp(e, n, t, r, l) {
  switch (n) {
    case "focusin":
      return Cn = $t(Cn, e, n, t, r, l), !0;
    case "dragenter":
      return zn = $t(zn, e, n, t, r, l), !0;
    case "mouseover":
      return Nn = $t(Nn, e, n, t, r, l), !0;
    case "pointerover":
      var u = l.pointerId;
      return wr.set(u, $t(wr.get(u) || null, e, n, t, r, l)), !0;
    case "gotpointercapture":
      return u = l.pointerId, Er.set(u, $t(Er.get(u) || null, e, n, t, r, l)), !0;
  }
  return !1;
}
function ff(e) {
  var n = Yn(e.target);
  if (n !== null) {
    var t = rt(n);
    if (t !== null) {
      if (n = t.tag, n === 13) {
        if (n = xc(t), n !== null) {
          e.blockedOn = n, cf(e.priority, function () {
            of(t);
          });
          return;
        }
      } else if (n === 3 && t.stateNode.current.memoizedState.isDehydrated) {
        e.blockedOn = t.tag === 3 ? t.stateNode.containerInfo : null;
        return;
      }
    }
  }
  e.blockedOn = null;
}
function Sl(e) {
  if (e.blockedOn !== null) return !1;
  for (var n = e.targetContainers; 0 < n.length;) {
    var t = Oo(e.domEventName, e.eventSystemFlags, n[0], e.nativeEvent);
    if (t === null) {
      t = e.nativeEvent;
      var r = new t.constructor(t.type, t);
      zo = r, t.target.dispatchEvent(r), zo = null;
    } else return n = Mr(t), n !== null && mi(n), e.blockedOn = t, !1;
    n.shift();
  }
  return !0;
}
function Va(e, n, t) {
  Sl(e) && t.delete(n);
}
function fp() {
  Lo = !1, Cn !== null && Sl(Cn) && (Cn = null), zn !== null && Sl(zn) && (zn = null), Nn !== null && Sl(Nn) && (Nn = null), wr.forEach(Va), Er.forEach(Va);
}
function xt(e, n) {
  e.blockedOn === n && (e.blockedOn = null, Lo || (Lo = !0, F.unstable_scheduleCallback(F.unstable_NormalPriority, fp)));
}
function Pr(e) {
  function n(l) {
    return xt(l, e);
  }
  if (0 < sl.length) {
    xt(sl[0], e);
    for (var t = 1; t < sl.length; t++) {
      var r = sl[t];
      r.blockedOn === e && (r.blockedOn = null);
    }
  }
  Cn !== null && xt(Cn, e), zn !== null && xt(zn, e), Nn !== null && xt(Nn, e), wr.forEach(n), Er.forEach(n);
  for (t = 0; t < Sn.length; t++) r = Sn[t], r.blockedOn === e && (r.blockedOn = null);
  for (; 0 < Sn.length && (t = Sn[0], t.blockedOn === null);) ff(t), t.blockedOn === null && Sn.shift();
}
function sp(e, n, t, r) {
  var l = W,
    u = Ct.transition;
  Ct.transition = null;
  try {
    W = 1, hi(e, n, t, r);
  } finally {
    W = l, Ct.transition = u;
  }
}
function Ap(e, n, t, r) {
  var l = W,
    u = Ct.transition;
  Ct.transition = null;
  try {
    W = 4, hi(e, n, t, r);
  } finally {
    W = l, Ct.transition = u;
  }
}
function hi(e, n, t, r) {
  if (Wl) {
    var l = Oo(e, n, t, r);
    if (l === null) to(e, n, r, Ml, t), Da(e, r);else if (cp(l, e, n, t, r)) r.stopPropagation();else if (Da(e, r), n & 4 && -1 < ap.indexOf(e)) {
      for (; l !== null;) {
        var u = Mr(l);
        if (u !== null && uf(u), u = Oo(e, n, t, r), u === null && to(e, n, r, Ml, t), u === l) break;
        l = u;
      }
      l !== null && r.stopPropagation();
    } else to(e, n, r, null, t);
  }
}
function Oo(e, n, t, r) {
  if (Ml = null, e = pi(r), e = Yn(e), e !== null) if (n = rt(e), n === null) e = null;else if (t = n.tag, t === 13) {
    if (e = xc(n), e !== null) return e;
    e = null;
  } else if (t === 3) {
    if (n.stateNode.current.memoizedState.isDehydrated) return n.tag === 3 ? n.stateNode.containerInfo : null;
    e = null;
  } else n !== e && (e = null);
  return Ml = e, null;
}
function sf(e) {
  switch (e) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (bd()) {
        case vi:
          return 1;
        case nf:
          return 4;
        case Ql:
        case ep:
          return 16;
        case tf:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
function Af() {
  if (wl) return wl;
  var e,
    n = gi,
    t = n.length,
    r,
    l = "value" in En ? En.value : En.textContent,
    u = l.length;
  for (e = 0; e < t && n[e] === l[e]; e++);
  var o = t - e;
  for (r = 1; r <= o && n[t - r] === l[u - r]; r++);
  return wl = l.slice(e, 1 < r ? 1 - r : void 0);
}
function El(e) {
  var n = e.keyCode;
  return "charCode" in e ? (e = e.charCode, e === 0 && n === 13 && (e = 13)) : e = n, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
}
function Al() {
  return !0;
}
function Za() {
  return !1;
}
function Le(e) {
  function n(t, r, l, u, o) {
    this._reactName = t, this._targetInst = l, this.type = r, this.nativeEvent = u, this.target = o, this.currentTarget = null;
    for (var c in e) e.hasOwnProperty(c) && (t = e[c], this[c] = t ? t(u) : u[c]);
    return this.isDefaultPrevented = (u.defaultPrevented != null ? u.defaultPrevented : u.returnValue === !1) ? Al : Za, this.isPropagationStopped = Za, this;
  }
  return J(n.prototype, {
    preventDefault: function () {
      this.defaultPrevented = !0;
      var t = this.nativeEvent;
      t && (t.preventDefault ? t.preventDefault() : typeof t.returnValue !== "unknown" && (t.returnValue = !1), this.isDefaultPrevented = Al);
    },
    stopPropagation: function () {
      var t = this.nativeEvent;
      t && (t.stopPropagation ? t.stopPropagation() : typeof t.cancelBubble !== "unknown" && (t.cancelBubble = !0), this.isPropagationStopped = Al);
    },
    persist: function () {},
    isPersistent: Al
  }), n;
}
function Cp(e) {
  var n = this.nativeEvent;
  return n.getModifierState ? n.getModifierState(e) : (e = Pp[e]) ? !!n[e] : !1;
}
function Si() {
  return Cp;
}
function pf(e, n) {
  switch (e) {
    case "keyup":
      return Qp.indexOf(n.keyCode) !== -1;
    case "keydown":
      return n.keyCode !== 229;
    case "keypress":
    case "mousedown":
    case "focusout":
      return !0;
    default:
      return !1;
  }
}
function vf(e) {
  return e = e.detail, typeof e === "object" && "data" in e ? e.data : null;
}
function Wp(e, n) {
  switch (e) {
    case "compositionend":
      return vf(n);
    case "keypress":
      if (n.which !== 32) return null;
      return Ya = !0, Ga;
    case "textInput":
      return e = n.data, e === Ga && Ya ? null : e;
    default:
      return null;
  }
}
function Mp(e, n) {
  if (At) return e === "compositionend" || !wi && pf(e, n) ? (e = Af(), wl = gi = En = null, At = !1, e) : null;
  switch (e) {
    case "paste":
      return null;
    case "keypress":
      if (!(n.ctrlKey || n.altKey || n.metaKey) || n.ctrlKey && n.altKey) {
        if (n.char && 1 < n.char.length) return n.char;
        if (n.which) return String.fromCharCode(n.which);
      }
      return null;
    case "compositionend":
      return df && n.locale !== "ko" ? null : n.data;
    default:
      return null;
  }
}
function Ja(e) {
  var n = e && e.nodeName && e.nodeName.toLowerCase();
  return n === "input" ? !!Dp[e.type] : n === "textarea" ? !0 : !1;
}
function yf(e, n, t, r) {
  Yc(r), n = Dl(n, "onChange"), 0 < n.length && (t = new ki("onChange", "change", null, t, r), e.push({
    event: t,
    listeners: n
  }));
}
function Vp(e) {
  Nf(e, 0);
}
function lu(e) {
  var n = vt(e);
  if (Dc(n)) return e;
}
function Zp(e, n) {
  if (e === "change") return n;
}
function qa() {
  dr && (dr.detachEvent("onpropertychange", hf), Cr = dr = null);
}
function hf(e) {
  if (e.propertyName === "value" && lu(Cr)) {
    var n = [];
    yf(n, Cr, e, pi(e)), $c(Vp, n);
  }
}
function Kp(e, n, t) {
  e === "focusin" ? (qa(), dr = n, Cr = t, dr.attachEvent("onpropertychange", hf)) : e === "focusout" && qa();
}
function Xp(e) {
  if (e === "selectionchange" || e === "keyup" || e === "keydown") return lu(Cr);
}
function Fp(e, n) {
  if (e === "click") return lu(n);
}
function Gp(e, n) {
  if (e === "input" || e === "change") return lu(n);
}
function Yp(e, n) {
  return e === n && (e !== 0 || 1 / e === 1 / n) || e !== e && n !== n;
}
function zr(e, n) {
  if (qe(e, n)) return !0;
  if (typeof e !== "object" || e === null || typeof n !== "object" || n === null) return !1;
  var t = Object.keys(e),
    r = Object.keys(n);
  if (t.length !== r.length) return !1;
  for (r = 0; r < t.length; r++) {
    var l = t[r];
    if (!po.call(n, l) || !qe(e[l], n[l])) return !1;
  }
  return !0;
}
function Ha(e) {
  for (; e && e.firstChild;) e = e.firstChild;
  return e;
}
function $a(e, n) {
  var t = Ha(e);
  e = 0;
  for (var r; t;) {
    if (t.nodeType === 3) {
      if (r = e + t.textContent.length, e <= n && r >= n) return {
        node: t,
        offset: n - e
      };
      e = r;
    }
    e: {
      for (; t;) {
        if (t.nextSibling) {
          t = t.nextSibling;
          break e;
        }
        t = t.parentNode;
      }
      t = void 0;
    }
    t = Ha(t);
  }
}
function gf(e, n) {
  return e && n ? e === n ? !0 : e && e.nodeType === 3 ? !1 : n && n.nodeType === 3 ? gf(e, n.parentNode) : "contains" in e ? e.contains(n) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(n) & 16) : !1 : !1;
}
function kf() {
  for (var e = window, n = Ol(); n instanceof e.HTMLIFrameElement;) {
    try {
      var t = typeof n.contentWindow.location.href === "string";
    } catch (r) {
      t = !1;
    }
    if (t) e = n.contentWindow;else break;
    n = Ol(e.document);
  }
  return n;
}
function Ei(e) {
  var n = e && e.nodeName && e.nodeName.toLowerCase();
  return n && (n === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || n === "textarea" || e.contentEditable === "true");
}
function Jp(e) {
  var n = kf(),
    t = e.focusedElem,
    r = e.selectionRange;
  if (n !== t && t && t.ownerDocument && gf(t.ownerDocument.documentElement, t)) {
    if (r !== null && Ei(t)) {
      if (n = r.start, e = r.end, e === void 0 && (e = n), "selectionStart" in t) t.selectionStart = n, t.selectionEnd = Math.min(e, t.value.length);else if (e = (n = t.ownerDocument || document) && n.defaultView || window, e.getSelection) {
        e = e.getSelection();
        var l = t.textContent.length,
          u = Math.min(r.start, l);
        r = r.end === void 0 ? u : Math.min(r.end, l), !e.extend && u > r && (l = r, r = u, u = l), l = $a(t, u);
        var o = $a(t, r);
        l && o && (e.rangeCount !== 1 || e.anchorNode !== l.node || e.anchorOffset !== l.offset || e.focusNode !== o.node || e.focusOffset !== o.offset) && (n = n.createRange(), n.setStart(l.node, l.offset), e.removeAllRanges(), u > r ? (e.addRange(n), e.extend(o.node, o.offset)) : (n.setEnd(o.node, o.offset), e.addRange(n)));
      }
    }
    n = [];
    for (e = t; e = e.parentNode;) e.nodeType === 1 && n.push({
      element: e,
      left: e.scrollLeft,
      top: e.scrollTop
    });
    typeof t.focus === "function" && t.focus();
    for (t = 0; t < n.length; t++) e = n[t], e.element.scrollLeft = e.left, e.element.scrollTop = e.top;
  }
}
function xa(e, n, t) {
  var r = t.window === t ? t.document : t.nodeType === 9 ? t : t.ownerDocument;
  Bo || dt == null || dt !== Ol(r) || (r = dt, "selectionStart" in r && Ei(r) ? r = {
    start: r.selectionStart,
    end: r.selectionEnd
  } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
    anchorNode: r.anchorNode,
    anchorOffset: r.anchorOffset,
    focusNode: r.focusNode,
    focusOffset: r.focusOffset
  }), pr && zr(pr, r) || (pr = r, r = Dl(_o, "onSelect"), 0 < r.length && (n = new ki("onSelect", "select", null, n, t), e.push({
    event: n,
    listeners: r
  }), n.target = dt)));
}
function dl(e, n) {
  var t = {};
  return t[e.toLowerCase()] = n.toLowerCase(), t["Webkit" + e] = "webkit" + n, t["Moz" + e] = "moz" + n, t;
}
function uu(e) {
  if (eo[e]) return eo[e];
  if (!pt[e]) return e;
  var n = pt[e],
    t;
  for (t in n) if (n.hasOwnProperty(t) && t in Sf) return eo[e] = n[t];
  return e;
}
function Qn(e, n) {
  zf.set(e, n), tt(n, [e]);
}
function ba(e, n, t) {
  var r = e.type || "unknown-event";
  e.currentTarget = t, Hd(r, n, void 0, e), e.currentTarget = null;
}
function Nf(e, n) {
  n = (n & 4) !== 0;
  for (var t = 0; t < e.length; t++) {
    var r = e[t],
      l = r.event;
    r = r.listeners;
    e: {
      var u = void 0;
      if (n) for (var o = r.length - 1; 0 <= o; o--) {
        var c = r[o],
          s = c.instance,
          d = c.currentTarget;
        if (c = c.listener, s !== u && l.isPropagationStopped()) break e;
        ba(l, c, d), u = s;
      } else for (o = 0; o < r.length; o++) {
        if (c = r[o], s = c.instance, d = c.currentTarget, c = c.listener, s !== u && l.isPropagationStopped()) break e;
        ba(l, c, d), u = s;
      }
    }
  }
  if (Bl) throw e = Ro, Bl = !1, Ro = null, e;
}
function V(e, n) {
  var t = n[Zo];
  t === void 0 && (t = n[Zo] = new Set());
  var r = e + "__bubble";
  t.has(r) || (Tf(n, e, 2, !1), t.add(r));
}
function no(e, n, t) {
  var r = 0;
  n && (r |= 4), Tf(t, e, r, n);
}
function Nr(e) {
  if (!e[pl]) {
    e[pl] = !0, Bc.forEach(function (t) {
      t !== "selectionchange" && (Hp.has(t) || no(t, !1, e), no(t, !0, e));
    });
    var n = e.nodeType === 9 ? e : e.ownerDocument;
    n === null || n[pl] || (n[pl] = !0, no("selectionchange", !1, n));
  }
}
function Tf(e, n, t, r) {
  switch (sf(n)) {
    case 1:
      var l = sp;
      break;
    case 4:
      l = Ap;
      break;
    default:
      l = hi;
  }
  t = l.bind(null, n, t, e), l = void 0, !To || n !== "touchstart" && n !== "touchmove" && n !== "wheel" || (l = !0), r ? l !== void 0 ? e.addEventListener(n, t, {
    capture: !0,
    passive: l
  }) : e.addEventListener(n, t, !0) : l !== void 0 ? e.addEventListener(n, t, {
    passive: l
  }) : e.addEventListener(n, t, !1);
}
function to(e, n, t, r, l) {
  var u = r;
  if ((n & 1) === 0 && (n & 2) === 0 && r !== null) e: for (;;) {
    if (r === null) return;
    var o = r.tag;
    if (o === 3 || o === 4) {
      var c = r.stateNode.containerInfo;
      if (c === l || c.nodeType === 8 && c.parentNode === l) break;
      if (o === 4) for (o = r.return; o !== null;) {
        var s = o.tag;
        if (s === 3 || s === 4) {
          if (s = o.stateNode.containerInfo, s === l || s.nodeType === 8 && s.parentNode === l) return;
        }
        o = o.return;
      }
      for (; c !== null;) {
        if (o = Yn(c), o === null) return;
        if (s = o.tag, s === 5 || s === 6) {
          r = u = o;
          continue e;
        }
        c = c.parentNode;
      }
    }
    r = r.return;
  }
  $c(function () {
    var d = u,
      m = pi(t),
      g = [];
    e: {
      var y = zf.get(e);
      if (y !== void 0) {
        var E = ki,
          P = e;
        switch (e) {
          case "keypress":
            if (El(t) === 0) break e;
          case "keydown":
          case "keyup":
            E = Np;
            break;
          case "focusin":
            P = "focus", E = bu;
            break;
          case "focusout":
            P = "blur", E = bu;
            break;
          case "beforeblur":
          case "afterblur":
            E = bu;
            break;
          case "click":
            if (t.button === 2) break e;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            E = Ka;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            E = vp;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            E = Up;
            break;
          case wf:
          case Ef:
          case Pf:
            E = hp;
            break;
          case Cf:
            E = Op;
            break;
          case "scroll":
            E = dp;
            break;
          case "wheel":
            E = Bp;
            break;
          case "copy":
          case "cut":
          case "paste":
            E = kp;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            E = Fa;
        }
        var C = (n & 4) !== 0,
          M = !C && e === "scroll",
          p = C ? y !== null ? y + "Capture" : null : y;
        C = [];
        for (var A = d, v; A !== null;) {
          v = A;
          var k = v.stateNode;
          if (v.tag === 5 && k !== null && (v = k, p !== null && (k = Sr(A, p), k != null && C.push(Tr(A, k, v)))), M) break;
          A = A.return;
        }
        0 < C.length && (y = new E(y, P, null, t, m), g.push({
          event: y,
          listeners: C
        }));
      }
    }
    if ((n & 7) === 0) {
      e: {
        if (y = e === "mouseover" || e === "pointerover", E = e === "mouseout" || e === "pointerout", y && t !== zo && (P = t.relatedTarget || t.fromElement) && (Yn(P) || P[cn])) break e;
        if (E || y) {
          if (y = m.window === m ? m : (y = m.ownerDocument) ? y.defaultView || y.parentWindow : window, E) {
            if (P = t.relatedTarget || t.toElement, E = d, P = P ? Yn(P) : null, P !== null && (M = rt(P), P !== M || P.tag !== 5 && P.tag !== 6)) P = null;
          } else E = null, P = d;
          if (E !== P) {
            if (C = Ka, k = "onMouseLeave", p = "onMouseEnter", A = "mouse", e === "pointerout" || e === "pointerover") C = Fa, k = "onPointerLeave", p = "onPointerEnter", A = "pointer";
            if (M = E == null ? y : vt(E), v = P == null ? y : vt(P), y = new C(k, A + "leave", E, t, m), y.target = M, y.relatedTarget = v, k = null, Yn(m) === d && (C = new C(p, A + "enter", P, t, m), C.target = v, C.relatedTarget = M, k = C), M = k, E && P) n: {
              C = E, p = P, A = 0;
              for (v = C; v; v = at(v)) A++;
              v = 0;
              for (k = p; k; k = at(k)) v++;
              for (; 0 < A - v;) C = at(C), A--;
              for (; 0 < v - A;) p = at(p), v--;
              for (; A--;) {
                if (C === p || p !== null && C === p.alternate) break n;
                C = at(C), p = at(p);
              }
              C = null;
            } else C = null;
            E !== null && ec(g, y, E, C, !1), P !== null && M !== null && ec(g, M, P, C, !0);
          }
        }
      }
      e: {
        if (y = d ? vt(d) : window, E = y.nodeName && y.nodeName.toLowerCase(), E === "select" || E === "input" && y.type === "file") var N = Zp;else if (Ja(y)) {
          if (mf) N = Gp;else {
            N = Xp;
            var T = Kp;
          }
        } else (E = y.nodeName) && E.toLowerCase() === "input" && (y.type === "checkbox" || y.type === "radio") && (N = Fp);
        if (N && (N = N(e, d))) {
          yf(g, N, t, m);
          break e;
        }
        T && T(e, y, d), e === "focusout" && (T = y._wrapperState) && T.controlled && y.type === "number" && So(y, "number", y.value);
      }
      switch (T = d ? vt(d) : window, e) {
        case "focusin":
          if (Ja(T) || T.contentEditable === "true") dt = T, _o = d, pr = null;
          break;
        case "focusout":
          pr = _o = dt = null;
          break;
        case "mousedown":
          Bo = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Bo = !1, xa(g, t, m);
          break;
        case "selectionchange":
          if (qp) break;
        case "keydown":
        case "keyup":
          xa(g, t, m);
      }
      var R;
      if (wi) e: {
        switch (e) {
          case "compositionstart":
            var O = "onCompositionStart";
            break e;
          case "compositionend":
            O = "onCompositionEnd";
            break e;
          case "compositionupdate":
            O = "onCompositionUpdate";
            break e;
        }
        O = void 0;
      } else At ? pf(e, t) && (O = "onCompositionEnd") : e === "keydown" && t.keyCode === 229 && (O = "onCompositionStart");
      if (O && (df && t.locale !== "ko" && (At || O !== "onCompositionStart" ? O === "onCompositionEnd" && At && (R = Af()) : (En = m, gi = "value" in En ? En.value : En.textContent, At = !0)), T = Dl(d, O), 0 < T.length && (O = new Xa(O, e, null, t, m), g.push({
        event: O,
        listeners: T
      }), R ? O.data = R : (R = vf(t), R !== null && (O.data = R)))), R = Ip ? Wp(e, t) : Mp(e, t)) d = Dl(d, "onBeforeInput"), 0 < d.length && (m = new Xa("onBeforeInput", "beforeinput", null, t, m), g.push({
        event: m,
        listeners: d
      }), m.data = R);
    }
    Nf(g, n);
  });
}
function Tr(e, n, t) {
  return {
    instance: e,
    listener: n,
    currentTarget: t
  };
}
function Dl(e, n) {
  for (var t = n + "Capture", r = []; e !== null;) {
    var l = e,
      u = l.stateNode;
    l.tag === 5 && u !== null && (l = u, u = Sr(e, t), u != null && r.unshift(Tr(e, u, l)), u = Sr(e, n), u != null && r.push(Tr(e, u, l))), e = e.return;
  }
  return r;
}
function at(e) {
  if (e === null) return null;
  do e = e.return; while (e && e.tag !== 5);
  return e ? e : null;
}
function ec(e, n, t, r, l) {
  for (var u = n._reactName, o = []; t !== null && t !== r;) {
    var c = t,
      s = c.alternate,
      d = c.stateNode;
    if (s !== null && s === r) break;
    c.tag === 5 && d !== null && (c = d, l ? (s = Sr(t, u), s != null && o.unshift(Tr(t, s, c))) : l || (s = Sr(t, u), s != null && o.push(Tr(t, s, c)))), t = t.return;
  }
  o.length !== 0 && e.push({
    event: n,
    listeners: o
  });
}
function nc(e) {
  return (typeof e === "string" ? e : "" + e).replace($p, `
`).replace(xp, "");
}
function vl(e, n, t) {
  if (n = nc(n), nc(e) !== n && t) throw Error(S(425));
}
function Vl() {}
function Do(e, n) {
  return e === "textarea" || e === "noscript" || typeof n.children === "string" || typeof n.children === "number" || typeof n.dangerouslySetInnerHTML === "object" && n.dangerouslySetInnerHTML !== null && n.dangerouslySetInnerHTML.__html != null;
}
function ev(e) {
  setTimeout(function () {
    throw e;
  });
}
function ro(e, n) {
  var t = n,
    r = 0;
  do {
    var l = t.nextSibling;
    if (e.removeChild(t), l && l.nodeType === 8) if (t = l.data, t === "/$") {
      if (r === 0) {
        e.removeChild(l), Pr(n);
        return;
      }
      r--;
    } else t !== "$" && t !== "$?" && t !== "$!" || r++;
    t = l;
  } while (t);
  Pr(n);
}
function Tn(e) {
  for (; e != null; e = e.nextSibling) {
    var n = e.nodeType;
    if (n === 1 || n === 3) break;
    if (n === 8) {
      if (n = e.data, n === "$" || n === "$!" || n === "$?") break;
      if (n === "/$") return null;
    }
  }
  return e;
}
function rc(e) {
  e = e.previousSibling;
  for (var n = 0; e;) {
    if (e.nodeType === 8) {
      var t = e.data;
      if (t === "$" || t === "$!" || t === "$?") {
        if (n === 0) return e;
        n--;
      } else t === "/$" && n++;
    }
    e = e.previousSibling;
  }
  return null;
}
function Yn(e) {
  var n = e[be];
  if (n) return n;
  for (var t = e.parentNode; t;) {
    if (n = t[cn] || t[be]) {
      if (t = n.alternate, n.child !== null || t !== null && t.child !== null) for (e = rc(e); e !== null;) {
        if (t = e[be]) return t;
        e = rc(e);
      }
      return n;
    }
    e = t, t = e.parentNode;
  }
  return null;
}
function Mr(e) {
  return e = e[be] || e[cn], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
}
function vt(e) {
  if (e.tag === 5 || e.tag === 6) return e.stateNode;
  throw Error(S(33));
}
function ou(e) {
  return e[Rr] || null;
}
function In(e) {
  return {
    current: e
  };
}
function Z(e) {
  0 > yt || (e.current = Ko[yt], Ko[yt] = null, yt--);
}
function D(e, n) {
  yt++, Ko[yt] = e.current, e.current = n;
}
function Rt(e, n) {
  var t = e.type.contextTypes;
  if (!t) return Bn;
  var r = e.stateNode;
  if (r && r.__reactInternalMemoizedUnmaskedChildContext === n) return r.__reactInternalMemoizedMaskedChildContext;
  var l = {},
    u;
  for (u in t) l[u] = n[u];
  return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = n, e.__reactInternalMemoizedMaskedChildContext = l), l;
}
function ze(e) {
  return e = e.childContextTypes, e !== null && e !== void 0;
}
function Zl() {
  Z(Ce), Z(me);
}
function lc(e, n, t) {
  if (me.current !== Bn) throw Error(S(168));
  D(me, n), D(Ce, t);
}
function Rf(e, n, t) {
  var r = e.stateNode;
  if (n = n.childContextTypes, typeof r.getChildContext !== "function") return t;
  r = r.getChildContext();
  for (var l in r) if (!(l in n)) throw Error(S(108, Kd(e) || "Unknown", l));
  return J({}, t, r);
}
function Kl(e) {
  return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || Bn, xn = me.current, D(me, e), D(Ce, Ce.current), !0;
}
function uc(e, n, t) {
  var r = e.stateNode;
  if (!r) throw Error(S(169));
  t ? (e = Rf(e, n, xn), r.__reactInternalMemoizedMergedChildContext = e, Z(Ce), Z(me), D(me, e)) : Z(Ce), D(Ce, t);
}
function Uf(e) {
  rn === null ? rn = [e] : rn.push(e);
}
function rv(e) {
  iu = !0, Uf(e);
}
function Wn() {
  if (!lo && rn !== null) {
    lo = !0;
    var e = 0,
      n = W;
    try {
      var t = rn;
      for (W = 1; e < t.length; e++) {
        var r = t[e];
        do r = r(!0); while (r !== null);
      }
      rn = null, iu = !1;
    } catch (l) {
      throw rn !== null && (rn = rn.slice(e + 1)), ef(vi, Wn), l;
    } finally {
      W = n, lo = !1;
    }
  }
  return null;
}
function Fn(e, n) {
  mt[ht++] = Fl, mt[ht++] = Xl, Xl = e, Fl = n;
}
function Lf(e, n, t) {
  Be[Qe++] = ln, Be[Qe++] = un, Be[Qe++] = jn, jn = e;
  var r = ln;
  e = un;
  var l = 32 - Ye(r) - 1;
  r &= ~(1 << l), t += 1;
  var u = 32 - Ye(n) + l;
  if (30 < u) {
    var o = l - l % 5;
    u = (r & (1 << o) - 1).toString(32), r >>= o, l -= o, ln = 1 << 32 - Ye(n) + l | t << l | r, un = u + e;
  } else ln = 1 << u | t << l | r, un = e;
}
function Pi(e) {
  e.return !== null && (Fn(e, 1), Lf(e, 1, 0));
}
function Ci(e) {
  for (; e === Xl;) Xl = mt[--ht], mt[ht] = null, Fl = mt[--ht], mt[ht] = null;
  for (; e === jn;) jn = Be[--Qe], Be[Qe] = null, un = Be[--Qe], Be[Qe] = null, ln = Be[--Qe], Be[Qe] = null;
}
function Of(e, n) {
  var t = Ie(5, null, null, 0);
  t.elementType = "DELETED", t.stateNode = n, t.return = e, n = e.deletions, n === null ? (e.deletions = [t], e.flags |= 16) : n.push(t);
}
function oc(e, n) {
  switch (e.tag) {
    case 5:
      var t = e.type;
      return n = n.nodeType !== 1 || t.toLowerCase() !== n.nodeName.toLowerCase() ? null : n, n !== null ? (e.stateNode = n, Ue = e, Re = Tn(n.firstChild), !0) : !1;
    case 6:
      return n = e.pendingProps === "" || n.nodeType !== 3 ? null : n, n !== null ? (e.stateNode = n, Ue = e, Re = null, !0) : !1;
    case 13:
      return n = n.nodeType !== 8 ? null : n, n !== null ? (t = jn !== null ? {
        id: ln,
        overflow: un
      } : null, e.memoizedState = {
        dehydrated: n,
        treeContext: t,
        retryLane: 1073741824
      }, t = Ie(18, null, null, 0), t.stateNode = n, t.return = e, e.child = t, Ue = e, Re = null, !0) : !1;
    default:
      return !1;
  }
}
function Xo(e) {
  return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
}
function Fo(e) {
  if (X) {
    var n = Re;
    if (n) {
      var t = n;
      if (!oc(e, n)) {
        if (Xo(e)) throw Error(S(418));
        n = Tn(t.nextSibling);
        var r = Ue;
        n && oc(e, n) ? Of(r, t) : (e.flags = e.flags & -4097 | 2, X = !1, Ue = e);
      }
    } else {
      if (Xo(e)) throw Error(S(418));
      e.flags = e.flags & -4097 | 2, X = !1, Ue = e;
    }
  }
}
function ic(e) {
  for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13;) e = e.return;
  Ue = e;
}
function yl(e) {
  if (e !== Ue) return !1;
  if (!X) return ic(e), X = !0, !1;
  var n;
  if ((n = e.tag !== 3) && !(n = e.tag !== 5) && (n = e.type, n = n !== "head" && n !== "body" && !Do(e.type, e.memoizedProps)), n && (n = Re)) {
    if (Xo(e)) throw _f(), Error(S(418));
    for (; n;) Of(e, n), n = Tn(n.nextSibling);
  }
  if (ic(e), e.tag === 13) {
    if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(S(317));
    e: {
      e = e.nextSibling;
      for (n = 0; e;) {
        if (e.nodeType === 8) {
          var t = e.data;
          if (t === "/$") {
            if (n === 0) {
              Re = Tn(e.nextSibling);
              break e;
            }
            n--;
          } else t !== "$" && t !== "$!" && t !== "$?" || n++;
        }
        e = e.nextSibling;
      }
      Re = null;
    }
  } else Re = Ue ? Tn(e.stateNode.nextSibling) : null;
  return !0;
}
function _f() {
  for (var e = Re; e;) e = Tn(e.nextSibling);
}
function Ut() {
  Re = Ue = null, X = !1;
}
function zi(e) {
  Ge === null ? Ge = [e] : Ge.push(e);
}
function bt(e, n, t) {
  if (e = t.ref, e !== null && typeof e !== "function" && typeof e !== "object") {
    if (t._owner) {
      if (t = t._owner, t) {
        if (t.tag !== 1) throw Error(S(309));
        var r = t.stateNode;
      }
      if (!r) throw Error(S(147, e));
      var l = r,
        u = "" + e;
      if (n !== null && n.ref !== null && typeof n.ref === "function" && n.ref._stringRef === u) return n.ref;
      return n = function (o) {
        var c = l.refs;
        o === null ? delete c[u] : c[u] = o;
      }, n._stringRef = u, n;
    }
    if (typeof e !== "string") throw Error(S(284));
    if (!t._owner) throw Error(S(290, e));
  }
  return e;
}
function ml(e, n) {
  throw e = Object.prototype.toString.call(n), Error(S(31, e === "[object Object]" ? "object with keys {" + Object.keys(n).join(", ") + "}" : e));
}
function ac(e) {
  var n = e._init;
  return n(e._payload);
}
function Bf(e) {
  function n(p, A) {
    if (e) {
      var v = p.deletions;
      v === null ? (p.deletions = [A], p.flags |= 16) : v.push(A);
    }
  }
  function t(p, A) {
    if (!e) return null;
    for (; A !== null;) n(p, A), A = A.sibling;
    return null;
  }
  function r(p, A) {
    for (p = new Map(); A !== null;) A.key !== null ? p.set(A.key, A) : p.set(A.index, A), A = A.sibling;
    return p;
  }
  function l(p, A) {
    return p = On(p, A), p.index = 0, p.sibling = null, p;
  }
  function u(p, A, v) {
    if (p.index = v, !e) return p.flags |= 1048576, A;
    if (v = p.alternate, v !== null) return v = v.index, v < A ? (p.flags |= 2, A) : v;
    return p.flags |= 2, A;
  }
  function o(p) {
    return e && p.alternate === null && (p.flags |= 2), p;
  }
  function c(p, A, v, k) {
    if (A === null || A.tag !== 6) return A = so(v, p.mode, k), A.return = p, A;
    return A = l(A, v), A.return = p, A;
  }
  function s(p, A, v, k) {
    var N = v.type;
    if (N === st) return m(p, A, v.props.children, k, v.key);
    if (A !== null && (A.elementType === N || typeof N === "object" && N !== null && N.$$typeof === gn && ac(N) === A.type)) return k = l(A, v.props), k.ref = bt(p, A, v), k.return = p, k;
    return k = Ll(v.type, v.key, v.props, null, p.mode, k), k.ref = bt(p, A, v), k.return = p, k;
  }
  function d(p, A, v, k) {
    if (A === null || A.tag !== 4 || A.stateNode.containerInfo !== v.containerInfo || A.stateNode.implementation !== v.implementation) return A = Ao(v, p.mode, k), A.return = p, A;
    return A = l(A, v.children || []), A.return = p, A;
  }
  function m(p, A, v, k, N) {
    if (A === null || A.tag !== 7) return A = $n(v, p.mode, k, N), A.return = p, A;
    return A = l(A, v), A.return = p, A;
  }
  function g(p, A, v) {
    if (typeof A === "string" && A !== "" || typeof A === "number") return A = so("" + A, p.mode, v), A.return = p, A;
    if (typeof A === "object" && A !== null) {
      switch (A.$$typeof) {
        case ol:
          return v = Ll(A.type, A.key, A.props, null, p.mode, v), v.ref = bt(p, null, A), v.return = p, v;
        case ft:
          return A = Ao(A, p.mode, v), A.return = p, A;
        case gn:
          var k = A._init;
          return g(p, k(A._payload), v);
      }
      if (rr(A) || Ht(A)) return A = $n(A, p.mode, v, null), A.return = p, A;
      ml(p, A);
    }
    return null;
  }
  function y(p, A, v, k) {
    var N = A !== null ? A.key : null;
    if (typeof v === "string" && v !== "" || typeof v === "number") return N !== null ? null : c(p, A, "" + v, k);
    if (typeof v === "object" && v !== null) {
      switch (v.$$typeof) {
        case ol:
          return v.key === N ? s(p, A, v, k) : null;
        case ft:
          return v.key === N ? d(p, A, v, k) : null;
        case gn:
          return N = v._init, y(p, A, N(v._payload), k);
      }
      if (rr(v) || Ht(v)) return N !== null ? null : m(p, A, v, k, null);
      ml(p, v);
    }
    return null;
  }
  function E(p, A, v, k, N) {
    if (typeof k === "string" && k !== "" || typeof k === "number") return p = p.get(v) || null, c(A, p, "" + k, N);
    if (typeof k === "object" && k !== null) {
      switch (k.$$typeof) {
        case ol:
          return p = p.get(k.key === null ? v : k.key) || null, s(A, p, k, N);
        case ft:
          return p = p.get(k.key === null ? v : k.key) || null, d(A, p, k, N);
        case gn:
          var T = k._init;
          return E(p, A, v, T(k._payload), N);
      }
      if (rr(k) || Ht(k)) return p = p.get(v) || null, m(A, p, k, N, null);
      ml(A, k);
    }
    return null;
  }
  function P(p, A, v, k) {
    for (var N = null, T = null, R = A, O = A = 0, x = null; R !== null && O < v.length; O++) {
      R.index > O ? (x = R, R = null) : x = R.sibling;
      var Q = y(p, R, v[O], k);
      if (Q === null) {
        R === null && (R = x);
        break;
      }
      e && R && Q.alternate === null && n(p, R), A = u(Q, A, O), T === null ? N = Q : T.sibling = Q, T = Q, R = x;
    }
    if (O === v.length) return t(p, R), X && Fn(p, O), N;
    if (R === null) {
      for (; O < v.length; O++) R = g(p, v[O], k), R !== null && (A = u(R, A, O), T === null ? N = R : T.sibling = R, T = R);
      return X && Fn(p, O), N;
    }
    for (R = r(p, R); O < v.length; O++) x = E(R, p, O, v[O], k), x !== null && (e && x.alternate !== null && R.delete(x.key === null ? O : x.key), A = u(x, A, O), T === null ? N = x : T.sibling = x, T = x);
    return e && R.forEach(function (Ve) {
      return n(p, Ve);
    }), X && Fn(p, O), N;
  }
  function C(p, A, v, k) {
    var N = Ht(v);
    if (typeof N !== "function") throw Error(S(150));
    if (v = N.call(v), v == null) throw Error(S(151));
    for (var T = N = null, R = A, O = A = 0, x = null, Q = v.next(); R !== null && !Q.done; O++, Q = v.next()) {
      R.index > O ? (x = R, R = null) : x = R.sibling;
      var Ve = y(p, R, Q.value, k);
      if (Ve === null) {
        R === null && (R = x);
        break;
      }
      e && R && Ve.alternate === null && n(p, R), A = u(Ve, A, O), T === null ? N = Ve : T.sibling = Ve, T = Ve, R = x;
    }
    if (Q.done) return t(p, R), X && Fn(p, O), N;
    if (R === null) {
      for (; !Q.done; O++, Q = v.next()) Q = g(p, Q.value, k), Q !== null && (A = u(Q, A, O), T === null ? N = Q : T.sibling = Q, T = Q);
      return X && Fn(p, O), N;
    }
    for (R = r(p, R); !Q.done; O++, Q = v.next()) Q = E(R, p, O, Q.value, k), Q !== null && (e && Q.alternate !== null && R.delete(Q.key === null ? O : Q.key), A = u(Q, A, O), T === null ? N = Q : T.sibling = Q, T = Q);
    return e && R.forEach(function (Oe) {
      return n(p, Oe);
    }), X && Fn(p, O), N;
  }
  function M(p, A, v, k) {
    if (typeof v === "object" && v !== null && v.type === st && v.key === null && (v = v.props.children), typeof v === "object" && v !== null) {
      switch (v.$$typeof) {
        case ol:
          e: {
            for (var N = v.key, T = A; T !== null;) {
              if (T.key === N) {
                if (N = v.type, N === st) {
                  if (T.tag === 7) {
                    t(p, T.sibling), A = l(T, v.props.children), A.return = p, p = A;
                    break e;
                  }
                } else if (T.elementType === N || typeof N === "object" && N !== null && N.$$typeof === gn && ac(N) === T.type) {
                  t(p, T.sibling), A = l(T, v.props), A.ref = bt(p, T, v), A.return = p, p = A;
                  break e;
                }
                t(p, T);
                break;
              } else n(p, T);
              T = T.sibling;
            }
            v.type === st ? (A = $n(v.props.children, p.mode, k, v.key), A.return = p, p = A) : (k = Ll(v.type, v.key, v.props, null, p.mode, k), k.ref = bt(p, A, v), k.return = p, p = k);
          }
          return o(p);
        case ft:
          e: {
            for (T = v.key; A !== null;) {
              if (A.key === T) {
                if (A.tag === 4 && A.stateNode.containerInfo === v.containerInfo && A.stateNode.implementation === v.implementation) {
                  t(p, A.sibling), A = l(A, v.children || []), A.return = p, p = A;
                  break e;
                } else {
                  t(p, A);
                  break;
                }
              } else n(p, A);
              A = A.sibling;
            }
            A = Ao(v, p.mode, k), A.return = p, p = A;
          }
          return o(p);
        case gn:
          return T = v._init, M(p, A, T(v._payload), k);
      }
      if (rr(v)) return P(p, A, v, k);
      if (Ht(v)) return C(p, A, v, k);
      ml(p, v);
    }
    return typeof v === "string" && v !== "" || typeof v === "number" ? (v = "" + v, A !== null && A.tag === 6 ? (t(p, A.sibling), A = l(A, v), A.return = p, p = A) : (t(p, A), A = so(v, p.mode, k), A.return = p, p = A), o(p)) : t(p, A);
  }
  return M;
}
function Ti() {
  Ni = gt = Yl = null;
}
function Ri(e) {
  var n = Gl.current;
  Z(Gl), e._currentValue = n;
}
function Go(e, n, t) {
  for (; e !== null;) {
    var r = e.alternate;
    if ((e.childLanes & n) !== n ? (e.childLanes |= n, r !== null && (r.childLanes |= n)) : r !== null && (r.childLanes & n) !== n && (r.childLanes |= n), e === t) break;
    e = e.return;
  }
}
function zt(e, n) {
  Yl = e, Ni = gt = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & n) !== 0 && (Pe = !0), e.firstContext = null);
}
function Me(e) {
  var n = e._currentValue;
  if (Ni !== e) if (e = {
    context: e,
    memoizedValue: n,
    next: null
  }, gt === null) {
    if (Yl === null) throw Error(S(308));
    gt = e, Yl.dependencies = {
      lanes: 0,
      firstContext: e
    };
  } else gt = gt.next = e;
  return n;
}
function Ui(e) {
  Jn === null ? Jn = [e] : Jn.push(e);
}
function If(e, n, t, r) {
  var l = n.interleaved;
  return l === null ? (t.next = t, Ui(n)) : (t.next = l.next, l.next = t), n.interleaved = t, fn(e, r);
}
function fn(e, n) {
  e.lanes |= n;
  var t = e.alternate;
  t !== null && (t.lanes |= n), t = e;
  for (e = e.return; e !== null;) e.childLanes |= n, t = e.alternate, t !== null && (t.childLanes |= n), t = e, e = e.return;
  return t.tag === 3 ? t.stateNode : null;
}
function Li(e) {
  e.updateQueue = {
    baseState: e.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: {
      pending: null,
      interleaved: null,
      lanes: 0
    },
    effects: null
  };
}
function Wf(e, n) {
  e = e.updateQueue, n.updateQueue === e && (n.updateQueue = {
    baseState: e.baseState,
    firstBaseUpdate: e.firstBaseUpdate,
    lastBaseUpdate: e.lastBaseUpdate,
    shared: e.shared,
    effects: e.effects
  });
}
function on(e, n) {
  return {
    eventTime: e,
    lane: n,
    tag: 0,
    payload: null,
    callback: null,
    next: null
  };
}
function Rn(e, n, t) {
  var r = e.updateQueue;
  if (r === null) return null;
  if (r = r.shared, (I & 2) !== 0) {
    var l = r.pending;
    return l === null ? n.next = n : (n.next = l.next, l.next = n), r.pending = n, fn(e, t);
  }
  return l = r.interleaved, l === null ? (n.next = n, Ui(r)) : (n.next = l.next, l.next = n), r.interleaved = n, fn(e, t);
}
function Cl(e, n, t) {
  if (n = n.updateQueue, n !== null && (n = n.shared, (t & 4194240) !== 0)) {
    var r = n.lanes;
    r &= e.pendingLanes, t |= r, n.lanes = t, yi(e, t);
  }
}
function cc(e, n) {
  var {
    updateQueue: t,
    alternate: r
  } = e;
  if (r !== null && (r = r.updateQueue, t === r)) {
    var l = null,
      u = null;
    if (t = t.firstBaseUpdate, t !== null) {
      do {
        var o = {
          eventTime: t.eventTime,
          lane: t.lane,
          tag: t.tag,
          payload: t.payload,
          callback: t.callback,
          next: null
        };
        u === null ? l = u = o : u = u.next = o, t = t.next;
      } while (t !== null);
      u === null ? l = u = n : u = u.next = n;
    } else l = u = n;
    t = {
      baseState: r.baseState,
      firstBaseUpdate: l,
      lastBaseUpdate: u,
      shared: r.shared,
      effects: r.effects
    }, e.updateQueue = t;
    return;
  }
  e = t.lastBaseUpdate, e === null ? t.firstBaseUpdate = n : e.next = n, t.lastBaseUpdate = n;
}
function Jl(e, n, t, r) {
  var l = e.updateQueue;
  kn = !1;
  var {
      firstBaseUpdate: u,
      lastBaseUpdate: o
    } = l,
    c = l.shared.pending;
  if (c !== null) {
    l.shared.pending = null;
    var s = c,
      d = s.next;
    s.next = null, o === null ? u = d : o.next = d, o = s;
    var m = e.alternate;
    m !== null && (m = m.updateQueue, c = m.lastBaseUpdate, c !== o && (c === null ? m.firstBaseUpdate = d : c.next = d, m.lastBaseUpdate = s));
  }
  if (u !== null) {
    var g = l.baseState;
    o = 0, m = d = s = null, c = u;
    do {
      var {
        lane: y,
        eventTime: E
      } = c;
      if ((r & y) === y) {
        m !== null && (m = m.next = {
          eventTime: E,
          lane: 0,
          tag: c.tag,
          payload: c.payload,
          callback: c.callback,
          next: null
        });
        e: {
          var P = e,
            C = c;
          switch (y = n, E = t, C.tag) {
            case 1:
              if (P = C.payload, typeof P === "function") {
                g = P.call(E, g, y);
                break e;
              }
              g = P;
              break e;
            case 3:
              P.flags = P.flags & -65537 | 128;
            case 0:
              if (P = C.payload, y = typeof P === "function" ? P.call(E, g, y) : P, y === null || y === void 0) break e;
              g = J({}, g, y);
              break e;
            case 2:
              kn = !0;
          }
        }
        c.callback !== null && c.lane !== 0 && (e.flags |= 64, y = l.effects, y === null ? l.effects = [c] : y.push(c));
      } else E = {
        eventTime: E,
        lane: y,
        tag: c.tag,
        payload: c.payload,
        callback: c.callback,
        next: null
      }, m === null ? (d = m = E, s = g) : m = m.next = E, o |= y;
      if (c = c.next, c === null) if (c = l.shared.pending, c === null) break;else y = c, c = y.next, y.next = null, l.lastBaseUpdate = y, l.shared.pending = null;
    } while (1);
    if (m === null && (s = g), l.baseState = s, l.firstBaseUpdate = d, l.lastBaseUpdate = m, n = l.shared.interleaved, n !== null) {
      l = n;
      do o |= l.lane, l = l.next; while (l !== n);
    } else u === null && (l.shared.lanes = 0);
    et |= o, e.lanes = o, e.memoizedState = g;
  }
}
function fc(e, n, t) {
  if (e = n.effects, n.effects = null, e !== null) for (n = 0; n < e.length; n++) {
    var r = e[n],
      l = r.callback;
    if (l !== null) {
      if (r.callback = null, r = t, typeof l !== "function") throw Error(S(191, l));
      l.call(r);
    }
  }
}
function qn(e) {
  if (e === Dr) throw Error(S(174));
  return e;
}
function Oi(e, n) {
  switch (D(Lr, n), D(Ur, e), D(nn, Dr), e = n.nodeType, e) {
    case 9:
    case 11:
      n = (n = n.documentElement) ? n.namespaceURI : Eo(null, "");
      break;
    default:
      e = e === 8 ? n.parentNode : n, n = e.namespaceURI || null, e = e.tagName, n = Eo(n, e);
  }
  Z(nn), D(nn, n);
}
function Ot() {
  Z(nn), Z(Ur), Z(Lr);
}
function Mf(e) {
  qn(Lr.current);
  var n = qn(nn.current),
    t = Eo(n, e.type);
  n !== t && (D(Ur, e), D(nn, t));
}
function _i(e) {
  Ur.current === e && (Z(nn), Z(Ur));
}
function ql(e) {
  for (var n = e; n !== null;) {
    if (n.tag === 13) {
      var t = n.memoizedState;
      if (t !== null && (t = t.dehydrated, t === null || t.data === "$?" || t.data === "$!")) return n;
    } else if (n.tag === 19 && n.memoizedProps.revealOrder !== void 0) {
      if ((n.flags & 128) !== 0) return n;
    } else if (n.child !== null) {
      n.child.return = n, n = n.child;
      continue;
    }
    if (n === e) break;
    for (; n.sibling === null;) {
      if (n.return === null || n.return === e) return null;
      n = n.return;
    }
    n.sibling.return = n.return, n = n.sibling;
  }
  return null;
}
function Bi() {
  for (var e = 0; e < uo.length; e++) uo[e]._workInProgressVersionPrimary = null;
  uo.length = 0;
}
function pe() {
  throw Error(S(321));
}
function Qi(e, n) {
  if (n === null) return !1;
  for (var t = 0; t < n.length && t < e.length; t++) if (!qe(e[t], n[t])) return !1;
  return !0;
}
function Ii(e, n, t, r, l, u) {
  if (bn = u, Y = n, n.memoizedState = null, n.updateQueue = null, n.lanes = 0, zl.current = e === null || e.memoizedState === null ? cv : fv, e = t(r, l), vr) {
    u = 0;
    do {
      if (vr = !1, Or = 0, 25 <= u) throw Error(S(301));
      u += 1, re = b = null, n.updateQueue = null, zl.current = sv, e = t(r, l);
    } while (vr);
  }
  if (zl.current = $l, n = b !== null && b.next !== null, bn = 0, re = b = Y = null, Hl = !1, n) throw Error(S(300));
  return e;
}
function Wi() {
  var e = Or !== 0;
  return Or = 0, e;
}
function je() {
  var e = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null
  };
  return re === null ? Y.memoizedState = re = e : re = re.next = e, re;
}
function De() {
  if (b === null) {
    var e = Y.alternate;
    e = e !== null ? e.memoizedState : null;
  } else e = b.next;
  var n = re === null ? Y.memoizedState : re.next;
  if (n !== null) re = n, b = e;else {
    if (e === null) throw Error(S(310));
    b = e, e = {
      memoizedState: b.memoizedState,
      baseState: b.baseState,
      baseQueue: b.baseQueue,
      queue: b.queue,
      next: null
    }, re === null ? Y.memoizedState = re = e : re = re.next = e;
  }
  return re;
}
function _r(e, n) {
  return typeof n === "function" ? n(e) : n;
}
function io(e) {
  var n = De(),
    t = n.queue;
  if (t === null) throw Error(S(311));
  t.lastRenderedReducer = e;
  var r = b,
    l = r.baseQueue,
    u = t.pending;
  if (u !== null) {
    if (l !== null) {
      var o = l.next;
      l.next = u.next, u.next = o;
    }
    r.baseQueue = l = u, t.pending = null;
  }
  if (l !== null) {
    u = l.next, r = r.baseState;
    var c = o = null,
      s = null,
      d = u;
    do {
      var m = d.lane;
      if ((bn & m) === m) s !== null && (s = s.next = {
        lane: 0,
        action: d.action,
        hasEagerState: d.hasEagerState,
        eagerState: d.eagerState,
        next: null
      }), r = d.hasEagerState ? d.eagerState : e(r, d.action);else {
        var g = {
          lane: m,
          action: d.action,
          hasEagerState: d.hasEagerState,
          eagerState: d.eagerState,
          next: null
        };
        s === null ? (c = s = g, o = r) : s = s.next = g, Y.lanes |= m, et |= m;
      }
      d = d.next;
    } while (d !== null && d !== u);
    s === null ? o = r : s.next = c, qe(r, n.memoizedState) || (Pe = !0), n.memoizedState = r, n.baseState = o, n.baseQueue = s, t.lastRenderedState = r;
  }
  if (e = t.interleaved, e !== null) {
    l = e;
    do u = l.lane, Y.lanes |= u, et |= u, l = l.next; while (l !== e);
  } else l === null && (t.lanes = 0);
  return [n.memoizedState, t.dispatch];
}
function ao(e) {
  var n = De(),
    t = n.queue;
  if (t === null) throw Error(S(311));
  t.lastRenderedReducer = e;
  var {
      dispatch: r,
      pending: l
    } = t,
    u = n.memoizedState;
  if (l !== null) {
    t.pending = null;
    var o = l = l.next;
    do u = e(u, o.action), o = o.next; while (o !== l);
    qe(u, n.memoizedState) || (Pe = !0), n.memoizedState = u, n.baseQueue === null && (n.baseState = u), t.lastRenderedState = u;
  }
  return [u, r];
}
function Df() {}
function Vf(e, n) {
  var t = Y,
    r = De(),
    l = n(),
    u = !qe(r.memoizedState, l);
  if (u && (r.memoizedState = l, Pe = !0), r = r.queue, Mi(Xf.bind(null, t, r, e), [e]), r.getSnapshot !== n || u || re !== null && re.memoizedState.tag & 1) {
    if (t.flags |= 2048, Br(9, Kf.bind(null, t, r, l, n), void 0, null), le === null) throw Error(S(349));
    (bn & 30) !== 0 || Zf(t, n, l);
  }
  return l;
}
function Zf(e, n, t) {
  e.flags |= 16384, e = {
    getSnapshot: n,
    value: t
  }, n = Y.updateQueue, n === null ? (n = {
    lastEffect: null,
    stores: null
  }, Y.updateQueue = n, n.stores = [e]) : (t = n.stores, t === null ? n.stores = [e] : t.push(e));
}
function Kf(e, n, t, r) {
  n.value = t, n.getSnapshot = r, Ff(n) && Gf(e);
}
function Xf(e, n, t) {
  return t(function () {
    Ff(n) && Gf(e);
  });
}
function Ff(e) {
  var n = e.getSnapshot;
  e = e.value;
  try {
    var t = n();
    return !qe(e, t);
  } catch (r) {
    return !0;
  }
}
function Gf(e) {
  var n = fn(e, 1);
  n !== null && Je(n, e, 1, -1);
}
function sc(e) {
  var n = je();
  return typeof e === "function" && (e = e()), n.memoizedState = n.baseState = e, e = {
    pending: null,
    interleaved: null,
    lanes: 0,
    dispatch: null,
    lastRenderedReducer: _r,
    lastRenderedState: e
  }, n.queue = e, e = e.dispatch = av.bind(null, Y, e), [n.memoizedState, e];
}
function Br(e, n, t, r) {
  return e = {
    tag: e,
    create: n,
    destroy: t,
    deps: r,
    next: null
  }, n = Y.updateQueue, n === null ? (n = {
    lastEffect: null,
    stores: null
  }, Y.updateQueue = n, n.lastEffect = e.next = e) : (t = n.lastEffect, t === null ? n.lastEffect = e.next = e : (r = t.next, t.next = e, e.next = r, n.lastEffect = e)), e;
}
function Yf() {
  return De().memoizedState;
}
function Nl(e, n, t, r) {
  var l = je();
  Y.flags |= e, l.memoizedState = Br(1 | n, t, void 0, r === void 0 ? null : r);
}
function au(e, n, t, r) {
  var l = De();
  r = r === void 0 ? null : r;
  var u = void 0;
  if (b !== null) {
    var o = b.memoizedState;
    if (u = o.destroy, r !== null && Qi(r, o.deps)) {
      l.memoizedState = Br(n, t, u, r);
      return;
    }
  }
  Y.flags |= e, l.memoizedState = Br(1 | n, t, u, r);
}
function Ac(e, n) {
  return Nl(8390656, 8, e, n);
}
function Mi(e, n) {
  return au(2048, 8, e, n);
}
function Jf(e, n) {
  return au(4, 2, e, n);
}
function qf(e, n) {
  return au(4, 4, e, n);
}
function Hf(e, n) {
  if (typeof n === "function") return e = e(), n(e), function () {
    n(null);
  };
  if (n !== null && n !== void 0) return e = e(), n.current = e, function () {
    n.current = null;
  };
}
function $f(e, n, t) {
  return t = t !== null && t !== void 0 ? t.concat([e]) : null, au(4, 4, Hf.bind(null, n, e), t);
}
function Di() {}
function xf(e, n) {
  var t = De();
  n = n === void 0 ? null : n;
  var r = t.memoizedState;
  if (r !== null && n !== null && Qi(n, r[1])) return r[0];
  return t.memoizedState = [e, n], e;
}
function jf(e, n) {
  var t = De();
  n = n === void 0 ? null : n;
  var r = t.memoizedState;
  if (r !== null && n !== null && Qi(n, r[1])) return r[0];
  return e = e(), t.memoizedState = [e, n], e;
}
function bf(e, n, t) {
  if ((bn & 21) === 0) return e.baseState && (e.baseState = !1, Pe = !0), e.memoizedState = t;
  return qe(t, n) || (t = rf(), Y.lanes |= t, et |= t, e.baseState = !0), n;
}
function ov(e, n) {
  var t = W;
  W = t !== 0 && 4 > t ? t : 4, e(!0);
  var r = oo.transition;
  oo.transition = {};
  try {
    e(!1), n();
  } finally {
    W = t, oo.transition = r;
  }
}
function es() {
  return De().memoizedState;
}
function iv(e, n, t) {
  var r = Ln(e);
  if (t = {
    lane: r,
    action: t,
    hasEagerState: !1,
    eagerState: null,
    next: null
  }, ns(e)) ts(n, t);else if (t = If(e, n, t, r), t !== null) {
    var l = Se();
    Je(t, e, r, l), rs(t, n, r);
  }
}
function av(e, n, t) {
  var r = Ln(e),
    l = {
      lane: r,
      action: t,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
  if (ns(e)) ts(n, l);else {
    var u = e.alternate;
    if (e.lanes === 0 && (u === null || u.lanes === 0) && (u = n.lastRenderedReducer, u !== null)) try {
      var o = n.lastRenderedState,
        c = u(o, t);
      if (l.hasEagerState = !0, l.eagerState = c, qe(c, o)) {
        var s = n.interleaved;
        s === null ? (l.next = l, Ui(n)) : (l.next = s.next, s.next = l), n.interleaved = l;
        return;
      }
    } catch (d) {} finally {}
    t = If(e, n, l, r), t !== null && (l = Se(), Je(t, e, r, l), rs(t, n, r));
  }
}
function ns(e) {
  var n = e.alternate;
  return e === Y || n !== null && n === Y;
}
function ts(e, n) {
  vr = Hl = !0;
  var t = e.pending;
  t === null ? n.next = n : (n.next = t.next, t.next = n), e.pending = n;
}
function rs(e, n, t) {
  if ((t & 4194240) !== 0) {
    var r = n.lanes;
    r &= e.pendingLanes, t |= r, n.lanes = t, yi(e, t);
  }
}
function Xe(e, n) {
  if (e && e.defaultProps) {
    n = J({}, n), e = e.defaultProps;
    for (var t in e) n[t] === void 0 && (n[t] = e[t]);
    return n;
  }
  return n;
}
function Yo(e, n, t, r) {
  n = e.memoizedState, t = t(r, n), t = t === null || t === void 0 ? n : J({}, n, t), e.memoizedState = t, e.lanes === 0 && (e.updateQueue.baseState = t);
}
function dc(e, n, t, r, l, u, o) {
  return e = e.stateNode, typeof e.shouldComponentUpdate === "function" ? e.shouldComponentUpdate(r, u, o) : n.prototype && n.prototype.isPureReactComponent ? !zr(t, r) || !zr(l, u) : !0;
}
function ls(e, n, t) {
  var r = !1,
    l = Bn,
    u = n.contextType;
  return typeof u === "object" && u !== null ? u = Me(u) : (l = ze(n) ? xn : me.current, r = n.contextTypes, u = (r = r !== null && r !== void 0) ? Rt(e, l) : Bn), n = new n(t, u), e.memoizedState = n.state !== null && n.state !== void 0 ? n.state : null, n.updater = cu, e.stateNode = n, n._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = u), n;
}
function pc(e, n, t, r) {
  e = n.state, typeof n.componentWillReceiveProps === "function" && n.componentWillReceiveProps(t, r), typeof n.UNSAFE_componentWillReceiveProps === "function" && n.UNSAFE_componentWillReceiveProps(t, r), n.state !== e && cu.enqueueReplaceState(n, n.state, null);
}
function Jo(e, n, t, r) {
  var l = e.stateNode;
  l.props = t, l.state = e.memoizedState, l.refs = {}, Li(e);
  var u = n.contextType;
  typeof u === "object" && u !== null ? l.context = Me(u) : (u = ze(n) ? xn : me.current, l.context = Rt(e, u)), l.state = e.memoizedState, u = n.getDerivedStateFromProps, typeof u === "function" && (Yo(e, n, u, t), l.state = e.memoizedState), typeof n.getDerivedStateFromProps === "function" || typeof l.getSnapshotBeforeUpdate === "function" || typeof l.UNSAFE_componentWillMount !== "function" && typeof l.componentWillMount !== "function" || (n = l.state, typeof l.componentWillMount === "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount === "function" && l.UNSAFE_componentWillMount(), n !== l.state && cu.enqueueReplaceState(l, l.state, null), Jl(e, t, l, r), l.state = e.memoizedState), typeof l.componentDidMount === "function" && (e.flags |= 4194308);
}
function _t(e, n) {
  try {
    var t = "",
      r = n;
    do t += Zd(r), r = r.return; while (r);
    var l = t;
  } catch (u) {
    l = `
Error generating stack: ` + u.message + `
` + u.stack;
  }
  return {
    value: e,
    source: n,
    stack: l,
    digest: null
  };
}
function co(e, n, t) {
  return {
    value: e,
    source: null,
    stack: t != null ? t : null,
    digest: n != null ? n : null
  };
}
function qo(e, n) {
  try {
    console.error(n.value);
  } catch (t) {
    setTimeout(function () {
      throw t;
    });
  }
}
function us(e, n, t) {
  t = on(-1, t), t.tag = 3, t.payload = {
    element: null
  };
  var r = n.value;
  return t.callback = function () {
    jl || (jl = !0, li = r), qo(e, n);
  }, t;
}
function os(e, n, t) {
  t = on(-1, t), t.tag = 3;
  var r = e.type.getDerivedStateFromError;
  if (typeof r === "function") {
    var l = n.value;
    t.payload = function () {
      return r(l);
    }, t.callback = function () {
      qo(e, n);
    };
  }
  var u = e.stateNode;
  return u !== null && typeof u.componentDidCatch === "function" && (t.callback = function () {
    qo(e, n), typeof r !== "function" && (Un === null ? Un = new Set([this]) : Un.add(this));
    var o = n.stack;
    this.componentDidCatch(n.value, {
      componentStack: o !== null ? o : ""
    });
  }), t;
}
function vc(e, n, t) {
  var r = e.pingCache;
  if (r === null) {
    r = e.pingCache = new Av();
    var l = new Set();
    r.set(n, l);
  } else l = r.get(n), l === void 0 && (l = new Set(), r.set(n, l));
  l.has(t) || (l.add(t), e = zv.bind(null, e, n, t), n.then(e, e));
}
function yc(e) {
  do {
    var n;
    if (n = e.tag === 13) n = e.memoizedState, n = n !== null ? n.dehydrated !== null ? !0 : !1 : !0;
    if (n) return e;
    e = e.return;
  } while (e !== null);
  return null;
}
function mc(e, n, t, r, l) {
  if ((e.mode & 1) === 0) return e === n ? e.flags |= 65536 : (e.flags |= 128, t.flags |= 131072, t.flags &= -52805, t.tag === 1 && (t.alternate === null ? t.tag = 17 : (n = on(-1, 1), n.tag = 2, Rn(t, n, 1))), t.lanes |= 1), e;
  return e.flags |= 65536, e.lanes = l, e;
}
function ke(e, n, t, r) {
  n.child = e === null ? Qf(n, null, t, r) : Lt(n, e.child, t, r);
}
function hc(e, n, t, r, l) {
  t = t.render;
  var u = n.ref;
  if (zt(n, l), r = Ii(e, n, t, r, u, l), t = Wi(), e !== null && !Pe) return n.updateQueue = e.updateQueue, n.flags &= -2053, e.lanes &= ~l, sn(e, n, l);
  return X && t && Pi(n), n.flags |= 1, ke(e, n, r, l), n.child;
}
function gc(e, n, t, r, l) {
  if (e === null) {
    var u = t.type;
    if (typeof u === "function" && !Ji(u) && u.defaultProps === void 0 && t.compare === null && t.defaultProps === void 0) return n.tag = 15, n.type = u, is(e, n, u, r, l);
    return e = Ll(t.type, null, r, n, n.mode, l), e.ref = n.ref, e.return = n, n.child = e;
  }
  if (u = e.child, (e.lanes & l) === 0) {
    var o = u.memoizedProps;
    if (t = t.compare, t = t !== null ? t : zr, t(o, r) && e.ref === n.ref) return sn(e, n, l);
  }
  return n.flags |= 1, e = On(u, r), e.ref = n.ref, e.return = n, n.child = e;
}
function is(e, n, t, r, l) {
  if (e !== null) {
    var u = e.memoizedProps;
    if (zr(u, r) && e.ref === n.ref) if (Pe = !1, n.pendingProps = r = u, (e.lanes & l) !== 0) (e.flags & 131072) !== 0 && (Pe = !0);else return n.lanes = e.lanes, sn(e, n, l);
  }
  return Ho(e, n, t, r, l);
}
function as(e, n, t) {
  var r = n.pendingProps,
    l = r.children,
    u = e !== null ? e.memoizedState : null;
  if (r.mode === "hidden") {
    if ((n.mode & 1) === 0) n.memoizedState = {
      baseLanes: 0,
      cachePool: null,
      transitions: null
    }, D(St, Te), Te |= t;else {
      if ((t & 1073741824) === 0) return e = u !== null ? u.baseLanes | t : t, n.lanes = n.childLanes = 1073741824, n.memoizedState = {
        baseLanes: e,
        cachePool: null,
        transitions: null
      }, n.updateQueue = null, D(St, Te), Te |= e, null;
      n.memoizedState = {
        baseLanes: 0,
        cachePool: null,
        transitions: null
      }, r = u !== null ? u.baseLanes : t, D(St, Te), Te |= r;
    }
  } else u !== null ? (r = u.baseLanes | t, n.memoizedState = null) : r = t, D(St, Te), Te |= r;
  return ke(e, n, l, t), n.child;
}
function cs(e, n) {
  var t = n.ref;
  if (e === null && t !== null || e !== null && e.ref !== t) n.flags |= 512, n.flags |= 2097152;
}
function Ho(e, n, t, r, l) {
  var u = ze(t) ? xn : me.current;
  if (u = Rt(n, u), zt(n, l), t = Ii(e, n, t, r, u, l), r = Wi(), e !== null && !Pe) return n.updateQueue = e.updateQueue, n.flags &= -2053, e.lanes &= ~l, sn(e, n, l);
  return X && r && Pi(n), n.flags |= 1, ke(e, n, t, l), n.child;
}
function kc(e, n, t, r, l) {
  if (ze(t)) {
    var u = !0;
    Kl(n);
  } else u = !1;
  if (zt(n, l), n.stateNode === null) Tl(e, n), ls(n, t, r), Jo(n, t, r, l), r = !0;else if (e === null) {
    var {
      stateNode: o,
      memoizedProps: c
    } = n;
    o.props = c;
    var s = o.context,
      d = t.contextType;
    typeof d === "object" && d !== null ? d = Me(d) : (d = ze(t) ? xn : me.current, d = Rt(n, d));
    var m = t.getDerivedStateFromProps,
      g = typeof m === "function" || typeof o.getSnapshotBeforeUpdate === "function";
    g || typeof o.UNSAFE_componentWillReceiveProps !== "function" && typeof o.componentWillReceiveProps !== "function" || (c !== r || s !== d) && pc(n, o, r, d), kn = !1;
    var y = n.memoizedState;
    o.state = y, Jl(n, r, o, l), s = n.memoizedState, c !== r || y !== s || Ce.current || kn ? (typeof m === "function" && (Yo(n, t, m, r), s = n.memoizedState), (c = kn || dc(n, t, c, r, y, s, d)) ? (g || typeof o.UNSAFE_componentWillMount !== "function" && typeof o.componentWillMount !== "function" || (typeof o.componentWillMount === "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount === "function" && o.UNSAFE_componentWillMount()), typeof o.componentDidMount === "function" && (n.flags |= 4194308)) : (typeof o.componentDidMount === "function" && (n.flags |= 4194308), n.memoizedProps = r, n.memoizedState = s), o.props = r, o.state = s, o.context = d, r = c) : (typeof o.componentDidMount === "function" && (n.flags |= 4194308), r = !1);
  } else {
    o = n.stateNode, Wf(e, n), c = n.memoizedProps, d = n.type === n.elementType ? c : Xe(n.type, c), o.props = d, g = n.pendingProps, y = o.context, s = t.contextType, typeof s === "object" && s !== null ? s = Me(s) : (s = ze(t) ? xn : me.current, s = Rt(n, s));
    var E = t.getDerivedStateFromProps;
    (m = typeof E === "function" || typeof o.getSnapshotBeforeUpdate === "function") || typeof o.UNSAFE_componentWillReceiveProps !== "function" && typeof o.componentWillReceiveProps !== "function" || (c !== g || y !== s) && pc(n, o, r, s), kn = !1, y = n.memoizedState, o.state = y, Jl(n, r, o, l);
    var P = n.memoizedState;
    c !== g || y !== P || Ce.current || kn ? (typeof E === "function" && (Yo(n, t, E, r), P = n.memoizedState), (d = kn || dc(n, t, d, r, y, P, s) || !1) ? (m || typeof o.UNSAFE_componentWillUpdate !== "function" && typeof o.componentWillUpdate !== "function" || (typeof o.componentWillUpdate === "function" && o.componentWillUpdate(r, P, s), typeof o.UNSAFE_componentWillUpdate === "function" && o.UNSAFE_componentWillUpdate(r, P, s)), typeof o.componentDidUpdate === "function" && (n.flags |= 4), typeof o.getSnapshotBeforeUpdate === "function" && (n.flags |= 1024)) : (typeof o.componentDidUpdate !== "function" || c === e.memoizedProps && y === e.memoizedState || (n.flags |= 4), typeof o.getSnapshotBeforeUpdate !== "function" || c === e.memoizedProps && y === e.memoizedState || (n.flags |= 1024), n.memoizedProps = r, n.memoizedState = P), o.props = r, o.state = P, o.context = s, r = d) : (typeof o.componentDidUpdate !== "function" || c === e.memoizedProps && y === e.memoizedState || (n.flags |= 4), typeof o.getSnapshotBeforeUpdate !== "function" || c === e.memoizedProps && y === e.memoizedState || (n.flags |= 1024), r = !1);
  }
  return $o(e, n, t, r, u, l);
}
function $o(e, n, t, r, l, u) {
  cs(e, n);
  var o = (n.flags & 128) !== 0;
  if (!r && !o) return l && uc(n, t, !1), sn(e, n, u);
  r = n.stateNode, dv.current = n;
  var c = o && typeof t.getDerivedStateFromError !== "function" ? null : r.render();
  return n.flags |= 1, e !== null && o ? (n.child = Lt(n, e.child, null, u), n.child = Lt(n, null, c, u)) : ke(e, n, c, u), n.memoizedState = r.state, l && uc(n, t, !0), n.child;
}
function fs(e) {
  var n = e.stateNode;
  n.pendingContext ? lc(e, n.pendingContext, n.pendingContext !== n.context) : n.context && lc(e, n.context, !1), Oi(e, n.containerInfo);
}
function Sc(e, n, t, r, l) {
  return Ut(), zi(l), n.flags |= 256, ke(e, n, t, r), n.child;
}
function jo(e) {
  return {
    baseLanes: e,
    cachePool: null,
    transitions: null
  };
}
function ss(e, n, t) {
  var r = n.pendingProps,
    l = G.current,
    u = !1,
    o = (n.flags & 128) !== 0,
    c;
  if ((c = o) || (c = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), c) u = !0, n.flags &= -129;else if (e === null || e.memoizedState !== null) l |= 1;
  if (D(G, l & 1), e === null) {
    if (Fo(n), e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null)) return (n.mode & 1) === 0 ? n.lanes = 1 : e.data === "$!" ? n.lanes = 8 : n.lanes = 1073741824, null;
    return o = r.children, e = r.fallback, u ? (r = n.mode, u = n.child, o = {
      mode: "hidden",
      children: o
    }, (r & 1) === 0 && u !== null ? (u.childLanes = 0, u.pendingProps = o) : u = Au(o, r, 0, null), e = $n(e, r, t, null), u.return = n, e.return = n, u.sibling = e, n.child = u, n.child.memoizedState = jo(t), n.memoizedState = xo, e) : Vi(n, o);
  }
  if (l = e.memoizedState, l !== null && (c = l.dehydrated, c !== null)) return pv(e, n, o, r, c, l, t);
  if (u) {
    u = r.fallback, o = n.mode, l = e.child, c = l.sibling;
    var s = {
      mode: "hidden",
      children: r.children
    };
    return (o & 1) === 0 && n.child !== l ? (r = n.child, r.childLanes = 0, r.pendingProps = s, n.deletions = null) : (r = On(l, s), r.subtreeFlags = l.subtreeFlags & 14680064), c !== null ? u = On(c, u) : (u = $n(u, o, t, null), u.flags |= 2), u.return = n, r.return = n, r.sibling = u, n.child = r, r = u, u = n.child, o = e.child.memoizedState, o = o === null ? jo(t) : {
      baseLanes: o.baseLanes | t,
      cachePool: null,
      transitions: o.transitions
    }, u.memoizedState = o, u.childLanes = e.childLanes & ~t, n.memoizedState = xo, r;
  }
  return u = e.child, e = u.sibling, r = On(u, {
    mode: "visible",
    children: r.children
  }), (n.mode & 1) === 0 && (r.lanes = t), r.return = n, r.sibling = null, e !== null && (t = n.deletions, t === null ? (n.deletions = [e], n.flags |= 16) : t.push(e)), n.child = r, n.memoizedState = null, r;
}
function Vi(e, n) {
  return n = Au({
    mode: "visible",
    children: n
  }, e.mode, 0, null), n.return = e, e.child = n;
}
function hl(e, n, t, r) {
  return r !== null && zi(r), Lt(n, e.child, null, t), e = Vi(n, n.pendingProps.children), e.flags |= 2, n.memoizedState = null, e;
}
function pv(e, n, t, r, l, u, o) {
  if (t) {
    if (n.flags & 256) return n.flags &= -257, r = co(Error(S(422))), hl(e, n, o, r);
    if (n.memoizedState !== null) return n.child = e.child, n.flags |= 128, null;
    return u = r.fallback, l = n.mode, r = Au({
      mode: "visible",
      children: r.children
    }, l, 0, null), u = $n(u, l, o, null), u.flags |= 2, r.return = n, u.return = n, r.sibling = u, n.child = r, (n.mode & 1) !== 0 && Lt(n, e.child, null, o), n.child.memoizedState = jo(o), n.memoizedState = xo, u;
  }
  if ((n.mode & 1) === 0) return hl(e, n, o, null);
  if (l.data === "$!") {
    if (r = l.nextSibling && l.nextSibling.dataset, r) var c = r.dgst;
    return r = c, u = Error(S(419)), r = co(u, r, void 0), hl(e, n, o, r);
  }
  if (c = (o & e.childLanes) !== 0, Pe || c) {
    if (r = le, r !== null) {
      switch (o & -o) {
        case 4:
          l = 2;
          break;
        case 16:
          l = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          l = 32;
          break;
        case 536870912:
          l = 268435456;
          break;
        default:
          l = 0;
      }
      l = (l & (r.suspendedLanes | o)) !== 0 ? 0 : l, l !== 0 && l !== u.retryLane && (u.retryLane = l, fn(e, l), Je(r, e, l, -1));
    }
    return Yi(), r = co(Error(S(421))), hl(e, n, o, r);
  }
  if (l.data === "$?") return n.flags |= 128, n.child = e.child, n = Nv.bind(null, e), l._reactRetry = n, null;
  return e = u.treeContext, Re = Tn(l.nextSibling), Ue = n, X = !0, Ge = null, e !== null && (Be[Qe++] = ln, Be[Qe++] = un, Be[Qe++] = jn, ln = e.id, un = e.overflow, jn = n), n = Vi(n, r.children), n.flags |= 4096, n;
}
function wc(e, n, t) {
  e.lanes |= n;
  var r = e.alternate;
  r !== null && (r.lanes |= n), Go(e.return, n, t);
}
function fo(e, n, t, r, l) {
  var u = e.memoizedState;
  u === null ? e.memoizedState = {
    isBackwards: n,
    rendering: null,
    renderingStartTime: 0,
    last: r,
    tail: t,
    tailMode: l
  } : (u.isBackwards = n, u.rendering = null, u.renderingStartTime = 0, u.last = r, u.tail = t, u.tailMode = l);
}
function As(e, n, t) {
  var r = n.pendingProps,
    l = r.revealOrder,
    u = r.tail;
  if (ke(e, n, r.children, t), r = G.current, (r & 2) !== 0) r = r & 1 | 2, n.flags |= 128;else {
    if (e !== null && (e.flags & 128) !== 0) e: for (e = n.child; e !== null;) {
      if (e.tag === 13) e.memoizedState !== null && wc(e, t, n);else if (e.tag === 19) wc(e, t, n);else if (e.child !== null) {
        e.child.return = e, e = e.child;
        continue;
      }
      if (e === n) break e;
      for (; e.sibling === null;) {
        if (e.return === null || e.return === n) break e;
        e = e.return;
      }
      e.sibling.return = e.return, e = e.sibling;
    }
    r &= 1;
  }
  if (D(G, r), (n.mode & 1) === 0) n.memoizedState = null;else switch (l) {
    case "forwards":
      t = n.child;
      for (l = null; t !== null;) e = t.alternate, e !== null && ql(e) === null && (l = t), t = t.sibling;
      t = l, t === null ? (l = n.child, n.child = null) : (l = t.sibling, t.sibling = null), fo(n, !1, l, t, u);
      break;
    case "backwards":
      t = null, l = n.child;
      for (n.child = null; l !== null;) {
        if (e = l.alternate, e !== null && ql(e) === null) {
          n.child = l;
          break;
        }
        e = l.sibling, l.sibling = t, t = l, l = e;
      }
      fo(n, !0, t, null, u);
      break;
    case "together":
      fo(n, !1, null, null, void 0);
      break;
    default:
      n.memoizedState = null;
  }
  return n.child;
}
function Tl(e, n) {
  (n.mode & 1) === 0 && e !== null && (e.alternate = null, n.alternate = null, n.flags |= 2);
}
function sn(e, n, t) {
  if (e !== null && (n.dependencies = e.dependencies), et |= n.lanes, (t & n.childLanes) === 0) return null;
  if (e !== null && n.child !== e.child) throw Error(S(153));
  if (n.child !== null) {
    e = n.child, t = On(e, e.pendingProps), n.child = t;
    for (t.return = n; e.sibling !== null;) e = e.sibling, t = t.sibling = On(e, e.pendingProps), t.return = n;
    t.sibling = null;
  }
  return n.child;
}
function vv(e, n, t) {
  switch (n.tag) {
    case 3:
      fs(n), Ut();
      break;
    case 5:
      Mf(n);
      break;
    case 1:
      ze(n.type) && Kl(n);
      break;
    case 4:
      Oi(n, n.stateNode.containerInfo);
      break;
    case 10:
      var r = n.type._context,
        l = n.memoizedProps.value;
      D(Gl, r._currentValue), r._currentValue = l;
      break;
    case 13:
      if (r = n.memoizedState, r !== null) {
        if (r.dehydrated !== null) return D(G, G.current & 1), n.flags |= 128, null;
        if ((t & n.child.childLanes) !== 0) return ss(e, n, t);
        return D(G, G.current & 1), e = sn(e, n, t), e !== null ? e.sibling : null;
      }
      D(G, G.current & 1);
      break;
    case 19:
      if (r = (t & n.childLanes) !== 0, (e.flags & 128) !== 0) {
        if (r) return As(e, n, t);
        n.flags |= 128;
      }
      if (l = n.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), D(G, G.current), r) break;else return null;
    case 22:
    case 23:
      return n.lanes = 0, as(e, n, t);
  }
  return sn(e, n, t);
}
function er(e, n) {
  if (!X) switch (e.tailMode) {
    case "hidden":
      n = e.tail;
      for (var t = null; n !== null;) n.alternate !== null && (t = n), n = n.sibling;
      t === null ? e.tail = null : t.sibling = null;
      break;
    case "collapsed":
      t = e.tail;
      for (var r = null; t !== null;) t.alternate !== null && (r = t), t = t.sibling;
      r === null ? n || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
  }
}
function ve(e) {
  var n = e.alternate !== null && e.alternate.child === e.child,
    t = 0,
    r = 0;
  if (n) for (var l = e.child; l !== null;) t |= l.lanes | l.childLanes, r |= l.subtreeFlags & 14680064, r |= l.flags & 14680064, l.return = e, l = l.sibling;else for (l = e.child; l !== null;) t |= l.lanes | l.childLanes, r |= l.subtreeFlags, r |= l.flags, l.return = e, l = l.sibling;
  return e.subtreeFlags |= r, e.childLanes = t, n;
}
function yv(e, n, t) {
  var r = n.pendingProps;
  switch (Ci(n), n.tag) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return ve(n), null;
    case 1:
      return ze(n.type) && Zl(), ve(n), null;
    case 3:
      if (r = n.stateNode, Ot(), Z(Ce), Z(me), Bi(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), e === null || e.child === null) yl(n) ? n.flags |= 4 : e === null || e.memoizedState.isDehydrated && (n.flags & 256) === 0 || (n.flags |= 1024, Ge !== null && (ii(Ge), Ge = null));
      return bo(e, n), ve(n), null;
    case 5:
      _i(n);
      var l = qn(Lr.current);
      if (t = n.type, e !== null && n.stateNode != null) ps(e, n, t, r, l), e.ref !== n.ref && (n.flags |= 512, n.flags |= 2097152);else {
        if (!r) {
          if (n.stateNode === null) throw Error(S(166));
          return ve(n), null;
        }
        if (e = qn(nn.current), yl(n)) {
          r = n.stateNode, t = n.type;
          var u = n.memoizedProps;
          switch (r[be] = n, r[Rr] = u, e = (n.mode & 1) !== 0, t) {
            case "dialog":
              V("cancel", r), V("close", r);
              break;
            case "iframe":
            case "object":
            case "embed":
              V("load", r);
              break;
            case "video":
            case "audio":
              for (l = 0; l < cr.length; l++) V(cr[l], r);
              break;
            case "source":
              V("error", r);
              break;
            case "img":
            case "image":
            case "link":
              V("error", r), V("load", r);
              break;
            case "details":
              V("toggle", r);
              break;
            case "input":
              Oa(r, u), V("invalid", r);
              break;
            case "select":
              r._wrapperState = {
                wasMultiple: !!u.multiple
              }, V("invalid", r);
              break;
            case "textarea":
              Ba(r, u), V("invalid", r);
          }
          Po(t, u), l = null;
          for (var o in u) if (u.hasOwnProperty(o)) {
            var c = u[o];
            o === "children" ? typeof c === "string" ? r.textContent !== c && (u.suppressHydrationWarning !== !0 && vl(r.textContent, c, e), l = ["children", c]) : typeof c === "number" && r.textContent !== "" + c && (u.suppressHydrationWarning !== !0 && vl(r.textContent, c, e), l = ["children", "" + c]) : gr.hasOwnProperty(o) && c != null && o === "onScroll" && V("scroll", r);
          }
          switch (t) {
            case "input":
              il(r), _a(r, u, !0);
              break;
            case "textarea":
              il(r), Qa(r);
              break;
            case "select":
            case "option":
              break;
            default:
              typeof u.onClick === "function" && (r.onclick = Vl);
          }
          r = l, n.updateQueue = r, r !== null && (n.flags |= 4);
        } else {
          o = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = Kc(t)), e === "http://www.w3.org/1999/xhtml" ? t === "script" ? (e = o.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is === "string" ? e = o.createElement(t, {
            is: r.is
          }) : (e = o.createElement(t), t === "select" && (o = e, r.multiple ? o.multiple = !0 : r.size && (o.size = r.size))) : e = o.createElementNS(e, t), e[be] = n, e[Rr] = r, ds(e, n, !1, !1), n.stateNode = e;
          e: {
            switch (o = Co(t, r), t) {
              case "dialog":
                V("cancel", e), V("close", e), l = r;
                break;
              case "iframe":
              case "object":
              case "embed":
                V("load", e), l = r;
                break;
              case "video":
              case "audio":
                for (l = 0; l < cr.length; l++) V(cr[l], e);
                l = r;
                break;
              case "source":
                V("error", e), l = r;
                break;
              case "img":
              case "image":
              case "link":
                V("error", e), V("load", e), l = r;
                break;
              case "details":
                V("toggle", e), l = r;
                break;
              case "input":
                Oa(e, r), l = go(e, r), V("invalid", e);
                break;
              case "option":
                l = r;
                break;
              case "select":
                e._wrapperState = {
                  wasMultiple: !!r.multiple
                }, l = J({}, r, {
                  value: void 0
                }), V("invalid", e);
                break;
              case "textarea":
                Ba(e, r), l = wo(e, r), V("invalid", e);
                break;
              default:
                l = r;
            }
            Po(t, l), c = l;
            for (u in c) if (c.hasOwnProperty(u)) {
              var s = c[u];
              u === "style" ? Gc(e, s) : u === "dangerouslySetInnerHTML" ? (s = s ? s.__html : void 0, s != null && Xc(e, s)) : u === "children" ? typeof s === "string" ? (t !== "textarea" || s !== "") && kr(e, s) : typeof s === "number" && kr(e, "" + s) : u !== "suppressContentEditableWarning" && u !== "suppressHydrationWarning" && u !== "autoFocus" && (gr.hasOwnProperty(u) ? s != null && u === "onScroll" && V("scroll", e) : s != null && fi(e, u, s, o));
            }
            switch (t) {
              case "input":
                il(e), _a(e, r, !1);
                break;
              case "textarea":
                il(e), Qa(e);
                break;
              case "option":
                r.value != null && e.setAttribute("value", "" + _n(r.value));
                break;
              case "select":
                e.multiple = !!r.multiple, u = r.value, u != null ? wt(e, !!r.multiple, u, !1) : r.defaultValue != null && wt(e, !!r.multiple, r.defaultValue, !0);
                break;
              default:
                typeof l.onClick === "function" && (e.onclick = Vl);
            }
            switch (t) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                r = !!r.autoFocus;
                break e;
              case "img":
                r = !0;
                break e;
              default:
                r = !1;
            }
          }
          r && (n.flags |= 4);
        }
        n.ref !== null && (n.flags |= 512, n.flags |= 2097152);
      }
      return ve(n), null;
    case 6:
      if (e && n.stateNode != null) vs(e, n, e.memoizedProps, r);else {
        if (typeof r !== "string" && n.stateNode === null) throw Error(S(166));
        if (t = qn(Lr.current), qn(nn.current), yl(n)) {
          if (r = n.stateNode, t = n.memoizedProps, r[be] = n, u = r.nodeValue !== t) {
            if (e = Ue, e !== null) switch (e.tag) {
              case 3:
                vl(r.nodeValue, t, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 && vl(r.nodeValue, t, (e.mode & 1) !== 0);
            }
          }
          u && (n.flags |= 4);
        } else r = (t.nodeType === 9 ? t : t.ownerDocument).createTextNode(r), r[be] = n, n.stateNode = r;
      }
      return ve(n), null;
    case 13:
      if (Z(G), r = n.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
        if (X && Re !== null && (n.mode & 1) !== 0 && (n.flags & 128) === 0) _f(), Ut(), n.flags |= 98560, u = !1;else if (u = yl(n), r !== null && r.dehydrated !== null) {
          if (e === null) {
            if (!u) throw Error(S(318));
            if (u = n.memoizedState, u = u !== null ? u.dehydrated : null, !u) throw Error(S(317));
            u[be] = n;
          } else Ut(), (n.flags & 128) === 0 && (n.memoizedState = null), n.flags |= 4;
          ve(n), u = !1;
        } else Ge !== null && (ii(Ge), Ge = null), u = !0;
        if (!u) return n.flags & 65536 ? n : null;
      }
      if ((n.flags & 128) !== 0) return n.lanes = t, n;
      return r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (n.child.flags |= 8192, (n.mode & 1) !== 0 && (e === null || (G.current & 1) !== 0 ? ee === 0 && (ee = 3) : Yi())), n.updateQueue !== null && (n.flags |= 4), ve(n), null;
    case 4:
      return Ot(), bo(e, n), e === null && Nr(n.stateNode.containerInfo), ve(n), null;
    case 10:
      return Ri(n.type._context), ve(n), null;
    case 17:
      return ze(n.type) && Zl(), ve(n), null;
    case 19:
      if (Z(G), u = n.memoizedState, u === null) return ve(n), null;
      if (r = (n.flags & 128) !== 0, o = u.rendering, o === null) {
        if (r) er(u, !1);else {
          if (ee !== 0 || e !== null && (e.flags & 128) !== 0) for (e = n.child; e !== null;) {
            if (o = ql(e), o !== null) {
              n.flags |= 128, er(u, !1), r = o.updateQueue, r !== null && (n.updateQueue = r, n.flags |= 4), n.subtreeFlags = 0, r = t;
              for (t = n.child; t !== null;) u = t, e = r, u.flags &= 14680066, o = u.alternate, o === null ? (u.childLanes = 0, u.lanes = e, u.child = null, u.subtreeFlags = 0, u.memoizedProps = null, u.memoizedState = null, u.updateQueue = null, u.dependencies = null, u.stateNode = null) : (u.childLanes = o.childLanes, u.lanes = o.lanes, u.child = o.child, u.subtreeFlags = 0, u.deletions = null, u.memoizedProps = o.memoizedProps, u.memoizedState = o.memoizedState, u.updateQueue = o.updateQueue, u.type = o.type, e = o.dependencies, u.dependencies = e === null ? null : {
                lanes: e.lanes,
                firstContext: e.firstContext
              }), t = t.sibling;
              return D(G, G.current & 1 | 2), n.child;
            }
            e = e.sibling;
          }
          u.tail !== null && $() > Bt && (n.flags |= 128, r = !0, er(u, !1), n.lanes = 4194304);
        }
      } else {
        if (!r) if (e = ql(o), e !== null) {
          if (n.flags |= 128, r = !0, t = e.updateQueue, t !== null && (n.updateQueue = t, n.flags |= 4), er(u, !0), u.tail === null && u.tailMode === "hidden" && !o.alternate && !X) return ve(n), null;
        } else 2 * $() - u.renderingStartTime > Bt && t !== 1073741824 && (n.flags |= 128, r = !0, er(u, !1), n.lanes = 4194304);
        u.isBackwards ? (o.sibling = n.child, n.child = o) : (t = u.last, t !== null ? t.sibling = o : n.child = o, u.last = o);
      }
      if (u.tail !== null) return n = u.tail, u.rendering = n, u.tail = n.sibling, u.renderingStartTime = $(), n.sibling = null, t = G.current, D(G, r ? t & 1 | 2 : t & 1), n;
      return ve(n), null;
    case 22:
    case 23:
      return Gi(), r = n.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (n.flags |= 8192), r && (n.mode & 1) !== 0 ? (Te & 1073741824) !== 0 && (ve(n), n.subtreeFlags & 6 && (n.flags |= 8192)) : ve(n), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(S(156, n.tag));
}
function mv(e, n) {
  switch (Ci(n), n.tag) {
    case 1:
      return ze(n.type) && Zl(), e = n.flags, e & 65536 ? (n.flags = e & -65537 | 128, n) : null;
    case 3:
      return Ot(), Z(Ce), Z(me), Bi(), e = n.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (n.flags = e & -65537 | 128, n) : null;
    case 5:
      return _i(n), null;
    case 13:
      if (Z(G), e = n.memoizedState, e !== null && e.dehydrated !== null) {
        if (n.alternate === null) throw Error(S(340));
        Ut();
      }
      return e = n.flags, e & 65536 ? (n.flags = e & -65537 | 128, n) : null;
    case 19:
      return Z(G), null;
    case 4:
      return Ot(), null;
    case 10:
      return Ri(n.type._context), null;
    case 22:
    case 23:
      return Gi(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
function kt(e, n) {
  var t = e.ref;
  if (t !== null) if (typeof t === "function") try {
    t(null);
  } catch (r) {
    H(e, n, r);
  } else t.current = null;
}
function ei(e, n, t) {
  try {
    t();
  } catch (r) {
    H(e, n, r);
  }
}
function gv(e, n) {
  if (Wo = Wl, e = kf(), Ei(e)) {
    if ("selectionStart" in e) var t = {
      start: e.selectionStart,
      end: e.selectionEnd
    };else e: {
      t = (t = e.ownerDocument) && t.defaultView || window;
      var r = t.getSelection && t.getSelection();
      if (r && r.rangeCount !== 0) {
        t = r.anchorNode;
        var {
          anchorOffset: l,
          focusNode: u
        } = r;
        r = r.focusOffset;
        try {
          t.nodeType, u.nodeType;
        } catch (k) {
          t = null;
          break e;
        }
        var o = 0,
          c = -1,
          s = -1,
          d = 0,
          m = 0,
          g = e,
          y = null;
        n: for (;;) {
          for (var E;;) {
            if (g !== t || l !== 0 && g.nodeType !== 3 || (c = o + l), g !== u || r !== 0 && g.nodeType !== 3 || (s = o + r), g.nodeType === 3 && (o += g.nodeValue.length), (E = g.firstChild) === null) break;
            y = g, g = E;
          }
          for (;;) {
            if (g === e) break n;
            if (y === t && ++d === l && (c = o), y === u && ++m === r && (s = o), (E = g.nextSibling) !== null) break;
            g = y, y = g.parentNode;
          }
          g = E;
        }
        t = c === -1 || s === -1 ? null : {
          start: c,
          end: s
        };
      } else t = null;
    }
    t = t || {
      start: 0,
      end: 0
    };
  } else t = null;
  Mo = {
    focusedElem: e,
    selectionRange: t
  }, Wl = !1;
  for (z = n; z !== null;) if (n = z, e = n.child, (n.subtreeFlags & 1028) !== 0 && e !== null) e.return = n, z = e;else for (; z !== null;) {
    n = z;
    try {
      var P = n.alternate;
      if ((n.flags & 1024) !== 0) switch (n.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if (P !== null) {
            var {
                memoizedProps: C,
                memoizedState: M
              } = P,
              p = n.stateNode,
              A = p.getSnapshotBeforeUpdate(n.elementType === n.type ? C : Xe(n.type, C), M);
            p.__reactInternalSnapshotBeforeUpdate = A;
          }
          break;
        case 3:
          var v = n.stateNode.containerInfo;
          v.nodeType === 1 ? v.textContent = "" : v.nodeType === 9 && v.documentElement && v.removeChild(v.documentElement);
          break;
        case 5:
        case 6:
        case 4:
        case 17:
          break;
        default:
          throw Error(S(163));
      }
    } catch (k) {
      H(n, n.return, k);
    }
    if (e = n.sibling, e !== null) {
      e.return = n.return, z = e;
      break;
    }
    z = n.return;
  }
  return P = Ec, Ec = !1, P;
}
function yr(e, n, t) {
  var r = n.updateQueue;
  if (r = r !== null ? r.lastEffect : null, r !== null) {
    var l = r = r.next;
    do {
      if ((l.tag & e) === e) {
        var u = l.destroy;
        l.destroy = void 0, u !== void 0 && ei(n, t, u);
      }
      l = l.next;
    } while (l !== r);
  }
}
function fu(e, n) {
  if (n = n.updateQueue, n = n !== null ? n.lastEffect : null, n !== null) {
    var t = n = n.next;
    do {
      if ((t.tag & e) === e) {
        var r = t.create;
        t.destroy = r();
      }
      t = t.next;
    } while (t !== n);
  }
}
function ni(e) {
  var n = e.ref;
  if (n !== null) {
    var t = e.stateNode;
    switch (e.tag) {
      case 5:
        e = t;
        break;
      default:
        e = t;
    }
    typeof n === "function" ? n(e) : n.current = e;
  }
}
function ys(e) {
  var n = e.alternate;
  n !== null && (e.alternate = null, ys(n)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (n = e.stateNode, n !== null && (delete n[be], delete n[Rr], delete n[Zo], delete n[nv], delete n[tv])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
}
function ms(e) {
  return e.tag === 5 || e.tag === 3 || e.tag === 4;
}
function Pc(e) {
  e: for (;;) {
    for (; e.sibling === null;) {
      if (e.return === null || ms(e.return)) return null;
      e = e.return;
    }
    e.sibling.return = e.return;
    for (e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
      if (e.flags & 2) continue e;
      if (e.child === null || e.tag === 4) continue e;else e.child.return = e, e = e.child;
    }
    if (!(e.flags & 2)) return e.stateNode;
  }
}
function ti(e, n, t) {
  var r = e.tag;
  if (r === 5 || r === 6) e = e.stateNode, n ? t.nodeType === 8 ? t.parentNode.insertBefore(e, n) : t.insertBefore(e, n) : (t.nodeType === 8 ? (n = t.parentNode, n.insertBefore(e, t)) : (n = t, n.appendChild(e)), t = t._reactRootContainer, t !== null && t !== void 0 || n.onclick !== null || (n.onclick = Vl));else if (r !== 4 && (e = e.child, e !== null)) for (ti(e, n, t), e = e.sibling; e !== null;) ti(e, n, t), e = e.sibling;
}
function ri(e, n, t) {
  var r = e.tag;
  if (r === 5 || r === 6) e = e.stateNode, n ? t.insertBefore(e, n) : t.appendChild(e);else if (r !== 4 && (e = e.child, e !== null)) for (ri(e, n, t), e = e.sibling; e !== null;) ri(e, n, t), e = e.sibling;
}
function hn(e, n, t) {
  for (t = t.child; t !== null;) hs(e, n, t), t = t.sibling;
}
function hs(e, n, t) {
  if (en && typeof en.onCommitFiberUnmount === "function") try {
    en.onCommitFiberUnmount(tu, t);
  } catch (c) {}
  switch (t.tag) {
    case 5:
      ye || kt(t, n);
    case 6:
      var r = oe,
        l = Fe;
      oe = null, hn(e, n, t), oe = r, Fe = l, oe !== null && (Fe ? (e = oe, t = t.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(t) : e.removeChild(t)) : oe.removeChild(t.stateNode));
      break;
    case 18:
      oe !== null && (Fe ? (e = oe, t = t.stateNode, e.nodeType === 8 ? ro(e.parentNode, t) : e.nodeType === 1 && ro(e, t), Pr(e)) : ro(oe, t.stateNode));
      break;
    case 4:
      r = oe, l = Fe, oe = t.stateNode.containerInfo, Fe = !0, hn(e, n, t), oe = r, Fe = l;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!ye && (r = t.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
        l = r = r.next;
        do {
          var u = l,
            o = u.destroy;
          u = u.tag, o !== void 0 && ((u & 2) !== 0 ? ei(t, n, o) : (u & 4) !== 0 && ei(t, n, o)), l = l.next;
        } while (l !== r);
      }
      hn(e, n, t);
      break;
    case 1:
      if (!ye && (kt(t, n), r = t.stateNode, typeof r.componentWillUnmount === "function")) try {
        r.props = t.memoizedProps, r.state = t.memoizedState, r.componentWillUnmount();
      } catch (c) {
        H(t, n, c);
      }
      hn(e, n, t);
      break;
    case 21:
      hn(e, n, t);
      break;
    case 22:
      t.mode & 1 ? (ye = (r = ye) || t.memoizedState !== null, hn(e, n, t), ye = r) : hn(e, n, t);
      break;
    default:
      hn(e, n, t);
  }
}
function Cc(e) {
  var n = e.updateQueue;
  if (n !== null) {
    e.updateQueue = null;
    var t = e.stateNode;
    t === null && (t = e.stateNode = new hv()), n.forEach(function (r) {
      var l = Tv.bind(null, e, r);
      t.has(r) || (t.add(r), r.then(l, l));
    });
  }
}
function Ke(e, n) {
  var t = n.deletions;
  if (t !== null) for (var r = 0; r < t.length; r++) {
    var l = t[r];
    try {
      var u = e,
        o = n,
        c = o;
      e: for (; c !== null;) {
        switch (c.tag) {
          case 5:
            oe = c.stateNode, Fe = !1;
            break e;
          case 3:
            oe = c.stateNode.containerInfo, Fe = !0;
            break e;
          case 4:
            oe = c.stateNode.containerInfo, Fe = !0;
            break e;
        }
        c = c.return;
      }
      if (oe === null) throw Error(S(160));
      hs(u, o, l), oe = null, Fe = !1;
      var s = l.alternate;
      s !== null && (s.return = null), l.return = null;
    } catch (d) {
      H(l, n, d);
    }
  }
  if (n.subtreeFlags & 12854) for (n = n.child; n !== null;) gs(n, e), n = n.sibling;
}
function gs(e, n) {
  var {
    alternate: t,
    flags: r
  } = e;
  switch (e.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      if (Ke(n, e), xe(e), r & 4) {
        try {
          yr(3, e, e.return), fu(3, e);
        } catch (C) {
          H(e, e.return, C);
        }
        try {
          yr(5, e, e.return);
        } catch (C) {
          H(e, e.return, C);
        }
      }
      break;
    case 1:
      Ke(n, e), xe(e), r & 512 && t !== null && kt(t, t.return);
      break;
    case 5:
      if (Ke(n, e), xe(e), r & 512 && t !== null && kt(t, t.return), e.flags & 32) {
        var l = e.stateNode;
        try {
          kr(l, "");
        } catch (C) {
          H(e, e.return, C);
        }
      }
      if (r & 4 && (l = e.stateNode, l != null)) {
        var u = e.memoizedProps,
          o = t !== null ? t.memoizedProps : u,
          c = e.type,
          s = e.updateQueue;
        if (e.updateQueue = null, s !== null) try {
          c === "input" && u.type === "radio" && u.name != null && Vc(l, u), Co(c, o);
          var d = Co(c, u);
          for (o = 0; o < s.length; o += 2) {
            var m = s[o],
              g = s[o + 1];
            m === "style" ? Gc(l, g) : m === "dangerouslySetInnerHTML" ? Xc(l, g) : m === "children" ? kr(l, g) : fi(l, m, g, d);
          }
          switch (c) {
            case "input":
              ko(l, u);
              break;
            case "textarea":
              Zc(l, u);
              break;
            case "select":
              var y = l._wrapperState.wasMultiple;
              l._wrapperState.wasMultiple = !!u.multiple;
              var E = u.value;
              E != null ? wt(l, !!u.multiple, E, !1) : y !== !!u.multiple && (u.defaultValue != null ? wt(l, !!u.multiple, u.defaultValue, !0) : wt(l, !!u.multiple, u.multiple ? [] : "", !1));
          }
          l[Rr] = u;
        } catch (C) {
          H(e, e.return, C);
        }
      }
      break;
    case 6:
      if (Ke(n, e), xe(e), r & 4) {
        if (e.stateNode === null) throw Error(S(162));
        l = e.stateNode, u = e.memoizedProps;
        try {
          l.nodeValue = u;
        } catch (C) {
          H(e, e.return, C);
        }
      }
      break;
    case 3:
      if (Ke(n, e), xe(e), r & 4 && t !== null && t.memoizedState.isDehydrated) try {
        Pr(n.containerInfo);
      } catch (C) {
        H(e, e.return, C);
      }
      break;
    case 4:
      Ke(n, e), xe(e);
      break;
    case 13:
      Ke(n, e), xe(e), l = e.child, l.flags & 8192 && (u = l.memoizedState !== null, l.stateNode.isHidden = u, !u || l.alternate !== null && l.alternate.memoizedState !== null || (Xi = $())), r & 4 && Cc(e);
      break;
    case 22:
      if (m = t !== null && t.memoizedState !== null, e.mode & 1 ? (ye = (d = ye) || m, Ke(n, e), ye = d) : Ke(n, e), xe(e), r & 8192) {
        if (d = e.memoizedState !== null, (e.stateNode.isHidden = d) && !m && (e.mode & 1) !== 0) for (z = e, m = e.child; m !== null;) {
          for (g = z = m; z !== null;) {
            switch (y = z, E = y.child, y.tag) {
              case 0:
              case 11:
              case 14:
              case 15:
                yr(4, y, y.return);
                break;
              case 1:
                kt(y, y.return);
                var P = y.stateNode;
                if (typeof P.componentWillUnmount === "function") {
                  r = y, t = y.return;
                  try {
                    n = r, P.props = n.memoizedProps, P.state = n.memoizedState, P.componentWillUnmount();
                  } catch (C) {
                    H(r, t, C);
                  }
                }
                break;
              case 5:
                kt(y, y.return);
                break;
              case 22:
                if (y.memoizedState !== null) {
                  Nc(g);
                  continue;
                }
            }
            E !== null ? (E.return = y, z = E) : Nc(g);
          }
          m = m.sibling;
        }
        e: for (m = null, g = e;;) {
          if (g.tag === 5) {
            if (m === null) {
              m = g;
              try {
                l = g.stateNode, d ? (u = l.style, typeof u.setProperty === "function" ? u.setProperty("display", "none", "important") : u.display = "none") : (c = g.stateNode, s = g.memoizedProps.style, o = s !== void 0 && s !== null && s.hasOwnProperty("display") ? s.display : null, c.style.display = Fc("display", o));
              } catch (C) {
                H(e, e.return, C);
              }
            }
          } else if (g.tag === 6) {
            if (m === null) try {
              g.stateNode.nodeValue = d ? "" : g.memoizedProps;
            } catch (C) {
              H(e, e.return, C);
            }
          } else if ((g.tag !== 22 && g.tag !== 23 || g.memoizedState === null || g === e) && g.child !== null) {
            g.child.return = g, g = g.child;
            continue;
          }
          if (g === e) break e;
          for (; g.sibling === null;) {
            if (g.return === null || g.return === e) break e;
            m === g && (m = null), g = g.return;
          }
          m === g && (m = null), g.sibling.return = g.return, g = g.sibling;
        }
      }
      break;
    case 19:
      Ke(n, e), xe(e), r & 4 && Cc(e);
      break;
    case 21:
      break;
    default:
      Ke(n, e), xe(e);
  }
}
function xe(e) {
  var n = e.flags;
  if (n & 2) {
    try {
      e: {
        for (var t = e.return; t !== null;) {
          if (ms(t)) {
            var r = t;
            break e;
          }
          t = t.return;
        }
        throw Error(S(160));
      }
      switch (r.tag) {
        case 5:
          var l = r.stateNode;
          r.flags & 32 && (kr(l, ""), r.flags &= -33);
          var u = Pc(e);
          ri(e, u, l);
          break;
        case 3:
        case 4:
          var o = r.stateNode.containerInfo,
            c = Pc(e);
          ti(e, c, o);
          break;
        default:
          throw Error(S(161));
      }
    } catch (s) {
      H(e, e.return, s);
    }
    e.flags &= -3;
  }
  n & 4096 && (e.flags &= -4097);
}
function kv(e, n, t) {
  z = e, ks(e, n, t);
}
function ks(e, n, t) {
  for (var r = (e.mode & 1) !== 0; z !== null;) {
    var l = z,
      u = l.child;
    if (l.tag === 22 && r) {
      var o = l.memoizedState !== null || gl;
      if (!o) {
        var c = l.alternate,
          s = c !== null && c.memoizedState !== null || ye;
        c = gl;
        var d = ye;
        if (gl = o, (ye = s) && !d) for (z = l; z !== null;) o = z, s = o.child, o.tag === 22 && o.memoizedState !== null ? Tc(l) : s !== null ? (s.return = o, z = s) : Tc(l);
        for (; u !== null;) z = u, ks(u, n, t), u = u.sibling;
        z = l, gl = c, ye = d;
      }
      zc(e, n, t);
    } else (l.subtreeFlags & 8772) !== 0 && u !== null ? (u.return = l, z = u) : zc(e, n, t);
  }
}
function zc(e) {
  for (; z !== null;) {
    var n = z;
    if ((n.flags & 8772) !== 0) {
      var t = n.alternate;
      try {
        if ((n.flags & 8772) !== 0) switch (n.tag) {
          case 0:
          case 11:
          case 15:
            ye || fu(5, n);
            break;
          case 1:
            var r = n.stateNode;
            if (n.flags & 4 && !ye) if (t === null) r.componentDidMount();else {
              var l = n.elementType === n.type ? t.memoizedProps : Xe(n.type, t.memoizedProps);
              r.componentDidUpdate(l, t.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
            }
            var u = n.updateQueue;
            u !== null && fc(n, u, r);
            break;
          case 3:
            var o = n.updateQueue;
            if (o !== null) {
              if (t = null, n.child !== null) switch (n.child.tag) {
                case 5:
                  t = n.child.stateNode;
                  break;
                case 1:
                  t = n.child.stateNode;
              }
              fc(n, o, t);
            }
            break;
          case 5:
            var c = n.stateNode;
            if (t === null && n.flags & 4) {
              t = c;
              var s = n.memoizedProps;
              switch (n.type) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  s.autoFocus && t.focus();
                  break;
                case "img":
                  s.src && (t.src = s.src);
              }
            }
            break;
          case 6:
            break;
          case 4:
            break;
          case 12:
            break;
          case 13:
            if (n.memoizedState === null) {
              var d = n.alternate;
              if (d !== null) {
                var m = d.memoizedState;
                if (m !== null) {
                  var g = m.dehydrated;
                  g !== null && Pr(g);
                }
              }
            }
            break;
          case 19:
          case 17:
          case 21:
          case 22:
          case 23:
          case 25:
            break;
          default:
            throw Error(S(163));
        }
        ye || n.flags & 512 && ni(n);
      } catch (y) {
        H(n, n.return, y);
      }
    }
    if (n === e) {
      z = null;
      break;
    }
    if (t = n.sibling, t !== null) {
      t.return = n.return, z = t;
      break;
    }
    z = n.return;
  }
}
function Nc(e) {
  for (; z !== null;) {
    var n = z;
    if (n === e) {
      z = null;
      break;
    }
    var t = n.sibling;
    if (t !== null) {
      t.return = n.return, z = t;
      break;
    }
    z = n.return;
  }
}
function Tc(e) {
  for (; z !== null;) {
    var n = z;
    try {
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          var t = n.return;
          try {
            fu(4, n);
          } catch (s) {
            H(n, t, s);
          }
          break;
        case 1:
          var r = n.stateNode;
          if (typeof r.componentDidMount === "function") {
            var l = n.return;
            try {
              r.componentDidMount();
            } catch (s) {
              H(n, l, s);
            }
          }
          var u = n.return;
          try {
            ni(n);
          } catch (s) {
            H(n, u, s);
          }
          break;
        case 5:
          var o = n.return;
          try {
            ni(n);
          } catch (s) {
            H(n, o, s);
          }
      }
    } catch (s) {
      H(n, n.return, s);
    }
    if (n === e) {
      z = null;
      break;
    }
    var c = n.sibling;
    if (c !== null) {
      c.return = n.return, z = c;
      break;
    }
    z = n.return;
  }
}
function Se() {
  return (I & 6) !== 0 ? $() : Rl !== -1 ? Rl : Rl = $();
}
function Ln(e) {
  if ((e.mode & 1) === 0) return 1;
  if ((I & 2) !== 0 && ie !== 0) return ie & -ie;
  if (lv.transition !== null) return Ul === 0 && (Ul = rf()), Ul;
  if (e = W, e !== 0) return e;
  return e = window.event, e = e === void 0 ? 16 : sf(e.type), e;
}
function Je(e, n, t, r) {
  if (50 < hr) throw hr = 0, ui = null, Error(S(185));
  if (Ir(e, t, r), (I & 2) === 0 || e !== le) e === le && ((I & 2) === 0 && (su |= t), ee === 4 && wn(e, ie)), Ne(e, r), t === 1 && I === 0 && (n.mode & 1) === 0 && (Bt = $() + 500, iu && Wn());
}
function Ne(e, n) {
  var t = e.callbackNode;
  op(e, n);
  var r = Il(e, e === le ? ie : 0);
  if (r === 0) t !== null && Ma(t), e.callbackNode = null, e.callbackPriority = 0;else if (n = r & -r, e.callbackPriority !== n) {
    if (t != null && Ma(t), n === 1) e.tag === 0 ? rv(Rc.bind(null, e)) : Uf(Rc.bind(null, e)), bp(function () {
      (I & 6) === 0 && Wn();
    }), t = null;else {
      switch (lf(r)) {
        case 1:
          t = vi;
          break;
        case 4:
          t = nf;
          break;
        case 16:
          t = Ql;
          break;
        case 536870912:
          t = tf;
          break;
        default:
          t = Ql;
      }
      t = Ts(t, Ss.bind(null, e));
    }
    e.callbackPriority = n, e.callbackNode = t;
  }
}
function Ss(e, n) {
  if (Rl = -1, Ul = 0, (I & 6) !== 0) throw Error(S(327));
  var t = e.callbackNode;
  if (Nt() && e.callbackNode !== t) return null;
  var r = Il(e, e === le ? ie : 0);
  if (r === 0) return null;
  if ((r & 30) !== 0 || (r & e.expiredLanes) !== 0 || n) n = eu(e, r);else {
    n = r;
    var l = I;
    I |= 2;
    var u = Es();
    if (le !== e || ie !== n) tn = null, Bt = $() + 500, Hn(e, n);
    do try {
      Pv();
      break;
    } catch (c) {
      ws(e, c);
    } while (1);
    Ti(), xl.current = u, I = l, j !== null ? n = 0 : (le = null, ie = 0, n = ee);
  }
  if (n !== 0) {
    if (n === 2 && (l = Uo(e), l !== 0 && (r = l, n = oi(e, l))), n === 1) throw t = Qr, Hn(e, 0), wn(e, r), Ne(e, $()), t;
    if (n === 6) wn(e, r);else {
      if (l = e.current.alternate, (r & 30) === 0 && !wv(l) && (n = eu(e, r), n === 2 && (u = Uo(e), u !== 0 && (r = u, n = oi(e, u))), n === 1)) throw t = Qr, Hn(e, 0), wn(e, r), Ne(e, $()), t;
      switch (e.finishedWork = l, e.finishedLanes = r, n) {
        case 0:
        case 1:
          throw Error(S(345));
        case 2:
          Gn(e, Ee, tn);
          break;
        case 3:
          if (wn(e, r), (r & 130023424) === r && (n = Xi + 500 - $(), 10 < n)) {
            if (Il(e, 0) !== 0) break;
            if (l = e.suspendedLanes, (l & r) !== r) {
              Se(), e.pingedLanes |= e.suspendedLanes & l;
              break;
            }
            e.timeoutHandle = Vo(Gn.bind(null, e, Ee, tn), n);
            break;
          }
          Gn(e, Ee, tn);
          break;
        case 4:
          if (wn(e, r), (r & 4194240) === r) break;
          n = e.eventTimes;
          for (l = -1; 0 < r;) {
            var o = 31 - Ye(r);
            u = 1 << o, o = n[o], o > l && (l = o), r &= ~u;
          }
          if (r = l, r = $() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3000 > r ? 3000 : 4320 > r ? 4320 : 1960 * Sv(r / 1960)) - r, 10 < r) {
            e.timeoutHandle = Vo(Gn.bind(null, e, Ee, tn), r);
            break;
          }
          Gn(e, Ee, tn);
          break;
        case 5:
          Gn(e, Ee, tn);
          break;
        default:
          throw Error(S(329));
      }
    }
  }
  return Ne(e, $()), e.callbackNode === t ? Ss.bind(null, e) : null;
}
function oi(e, n) {
  var t = mr;
  return e.current.memoizedState.isDehydrated && (Hn(e, n).flags |= 256), e = eu(e, n), e !== 2 && (n = Ee, Ee = t, n !== null && ii(n)), e;
}
function ii(e) {
  Ee === null ? Ee = e : Ee.push.apply(Ee, e);
}
function wv(e) {
  for (var n = e;;) {
    if (n.flags & 16384) {
      var t = n.updateQueue;
      if (t !== null && (t = t.stores, t !== null)) for (var r = 0; r < t.length; r++) {
        var l = t[r],
          u = l.getSnapshot;
        l = l.value;
        try {
          if (!qe(u(), l)) return !1;
        } catch (o) {
          return !1;
        }
      }
    }
    if (t = n.child, n.subtreeFlags & 16384 && t !== null) t.return = n, n = t;else {
      if (n === e) break;
      for (; n.sibling === null;) {
        if (n.return === null || n.return === e) return !0;
        n = n.return;
      }
      n.sibling.return = n.return, n = n.sibling;
    }
  }
  return !0;
}
function wn(e, n) {
  n &= ~Ki, n &= ~su, e.suspendedLanes |= n, e.pingedLanes &= ~n;
  for (e = e.expirationTimes; 0 < n;) {
    var t = 31 - Ye(n),
      r = 1 << t;
    e[t] = -1, n &= ~r;
  }
}
function Rc(e) {
  if ((I & 6) !== 0) throw Error(S(327));
  Nt();
  var n = Il(e, 0);
  if ((n & 1) === 0) return Ne(e, $()), null;
  var t = eu(e, n);
  if (e.tag !== 0 && t === 2) {
    var r = Uo(e);
    r !== 0 && (n = r, t = oi(e, r));
  }
  if (t === 1) throw t = Qr, Hn(e, 0), wn(e, n), Ne(e, $()), t;
  if (t === 6) throw Error(S(345));
  return e.finishedWork = e.current.alternate, e.finishedLanes = n, Gn(e, Ee, tn), Ne(e, $()), null;
}
function Fi(e, n) {
  var t = I;
  I |= 1;
  try {
    return e(n);
  } finally {
    I = t, I === 0 && (Bt = $() + 500, iu && Wn());
  }
}
function nt(e) {
  Pn !== null && Pn.tag === 0 && (I & 6) === 0 && Nt();
  var n = I;
  I |= 1;
  var t = We.transition,
    r = W;
  try {
    if (We.transition = null, W = 1, e) return e();
  } finally {
    W = r, We.transition = t, I = n, (I & 6) === 0 && Wn();
  }
}
function Gi() {
  Te = St.current, Z(St);
}
function Hn(e, n) {
  e.finishedWork = null, e.finishedLanes = 0;
  var t = e.timeoutHandle;
  if (t !== -1 && (e.timeoutHandle = -1, jp(t)), j !== null) for (t = j.return; t !== null;) {
    var r = t;
    switch (Ci(r), r.tag) {
      case 1:
        r = r.type.childContextTypes, r !== null && r !== void 0 && Zl();
        break;
      case 3:
        Ot(), Z(Ce), Z(me), Bi();
        break;
      case 5:
        _i(r);
        break;
      case 4:
        Ot();
        break;
      case 13:
        Z(G);
        break;
      case 19:
        Z(G);
        break;
      case 10:
        Ri(r.type._context);
        break;
      case 22:
      case 23:
        Gi();
    }
    t = t.return;
  }
  if (le = e, j = e = On(e.current, null), ie = Te = n, ee = 0, Qr = null, Ki = su = et = 0, Ee = mr = null, Jn !== null) {
    for (n = 0; n < Jn.length; n++) if (t = Jn[n], r = t.interleaved, r !== null) {
      t.interleaved = null;
      var l = r.next,
        u = t.pending;
      if (u !== null) {
        var o = u.next;
        u.next = l, r.next = o;
      }
      t.pending = r;
    }
    Jn = null;
  }
  return e;
}
function ws(e, n) {
  do {
    var t = j;
    try {
      if (Ti(), zl.current = $l, Hl) {
        for (var r = Y.memoizedState; r !== null;) {
          var l = r.queue;
          l !== null && (l.pending = null), r = r.next;
        }
        Hl = !1;
      }
      if (bn = 0, re = b = Y = null, vr = !1, Or = 0, Zi.current = null, t === null || t.return === null) {
        ee = 1, Qr = n, j = null;
        break;
      }
      e: {
        var u = e,
          o = t.return,
          c = t,
          s = n;
        if (n = ie, c.flags |= 32768, s !== null && typeof s === "object" && typeof s.then === "function") {
          var d = s,
            m = c,
            g = m.tag;
          if ((m.mode & 1) === 0 && (g === 0 || g === 11 || g === 15)) {
            var y = m.alternate;
            y ? (m.updateQueue = y.updateQueue, m.memoizedState = y.memoizedState, m.lanes = y.lanes) : (m.updateQueue = null, m.memoizedState = null);
          }
          var E = yc(o);
          if (E !== null) {
            E.flags &= -257, mc(E, o, c, u, n), E.mode & 1 && vc(u, d, n), n = E, s = d;
            var P = n.updateQueue;
            if (P === null) {
              var C = new Set();
              C.add(s), n.updateQueue = C;
            } else P.add(s);
            break e;
          } else {
            if ((n & 1) === 0) {
              vc(u, d, n), Yi();
              break e;
            }
            s = Error(S(426));
          }
        } else if (X && c.mode & 1) {
          var M = yc(o);
          if (M !== null) {
            (M.flags & 65536) === 0 && (M.flags |= 256), mc(M, o, c, u, n), zi(_t(s, c));
            break e;
          }
        }
        u = s = _t(s, c), ee !== 4 && (ee = 2), mr === null ? mr = [u] : mr.push(u), u = o;
        do {
          switch (u.tag) {
            case 3:
              u.flags |= 65536, n &= -n, u.lanes |= n;
              var p = us(u, s, n);
              cc(u, p);
              break e;
            case 1:
              c = s;
              var {
                type: A,
                stateNode: v
              } = u;
              if ((u.flags & 128) === 0 && (typeof A.getDerivedStateFromError === "function" || v !== null && typeof v.componentDidCatch === "function" && (Un === null || !Un.has(v)))) {
                u.flags |= 65536, n &= -n, u.lanes |= n;
                var k = os(u, c, n);
                cc(u, k);
                break e;
              }
          }
          u = u.return;
        } while (u !== null);
      }
      Cs(t);
    } catch (N) {
      n = N, j === t && t !== null && (j = t = t.return);
      continue;
    }
    break;
  } while (1);
}
function Es() {
  var e = xl.current;
  return xl.current = $l, e === null ? $l : e;
}
function Yi() {
  if (ee === 0 || ee === 3 || ee === 2) ee = 4;
  le === null || (et & 268435455) === 0 && (su & 268435455) === 0 || wn(le, ie);
}
function eu(e, n) {
  var t = I;
  I |= 2;
  var r = Es();
  if (le !== e || ie !== n) tn = null, Hn(e, n);
  do try {
    Ev();
    break;
  } catch (l) {
    ws(e, l);
  } while (1);
  if (Ti(), I = t, xl.current = r, j !== null) throw Error(S(261));
  return le = null, ie = 0, ee;
}
function Ev() {
  for (; j !== null;) Ps(j);
}
function Pv() {
  for (; j !== null && !xd();) Ps(j);
}
function Ps(e) {
  var n = Ns(e.alternate, e, Te);
  e.memoizedProps = e.pendingProps, n === null ? Cs(e) : j = n, Zi.current = null;
}
function Cs(e) {
  var n = e;
  do {
    var t = n.alternate;
    if (e = n.return, (n.flags & 32768) === 0) {
      if (t = yv(t, n, Te), t !== null) {
        j = t;
        return;
      }
    } else {
      if (t = mv(t, n), t !== null) {
        t.flags &= 32767, j = t;
        return;
      }
      if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;else {
        ee = 6, j = null;
        return;
      }
    }
    if (n = n.sibling, n !== null) {
      j = n;
      return;
    }
    j = n = e;
  } while (n !== null);
  ee === 0 && (ee = 5);
}
function Gn(e, n, t) {
  var r = W,
    l = We.transition;
  try {
    We.transition = null, W = 1, Cv(e, n, t, r);
  } finally {
    We.transition = l, W = r;
  }
  return null;
}
function Cv(e, n, t, r) {
  do Nt(); while (Pn !== null);
  if ((I & 6) !== 0) throw Error(S(327));
  t = e.finishedWork;
  var l = e.finishedLanes;
  if (t === null) return null;
  if (e.finishedWork = null, e.finishedLanes = 0, t === e.current) throw Error(S(177));
  e.callbackNode = null, e.callbackPriority = 0;
  var u = t.lanes | t.childLanes;
  if (ip(e, u), e === le && (j = le = null, ie = 0), (t.subtreeFlags & 2064) === 0 && (t.flags & 2064) === 0 || kl || (kl = !0, Ts(Ql, function () {
    return Nt(), null;
  })), u = (t.flags & 15990) !== 0, (t.subtreeFlags & 15990) !== 0 || u) {
    u = We.transition, We.transition = null;
    var o = W;
    W = 1;
    var c = I;
    I |= 4, Zi.current = null, gv(e, t), gs(t, e), Jp(Mo), Wl = !!Wo, Mo = Wo = null, e.current = t, kv(t, e, l), jd(), I = c, W = o, We.transition = u;
  } else e.current = t;
  if (kl && (kl = !1, Pn = e, bl = l), u = e.pendingLanes, u === 0 && (Un = null), np(t.stateNode, r), Ne(e, $()), n !== null) for (r = e.onRecoverableError, t = 0; t < n.length; t++) l = n[t], r(l.value, {
    componentStack: l.stack,
    digest: l.digest
  });
  if (jl) throw jl = !1, e = li, li = null, e;
  return (bl & 1) !== 0 && e.tag !== 0 && Nt(), u = e.pendingLanes, (u & 1) !== 0 ? e === ui ? hr++ : (hr = 0, ui = e) : hr = 0, Wn(), null;
}
function Nt() {
  if (Pn !== null) {
    var e = lf(bl),
      n = We.transition,
      t = W;
    try {
      if (We.transition = null, W = 16 > e ? 16 : e, Pn === null) var r = !1;else {
        if (e = Pn, Pn = null, bl = 0, (I & 6) !== 0) throw Error(S(331));
        var l = I;
        I |= 4;
        for (z = e.current; z !== null;) {
          var u = z,
            o = u.child;
          if ((z.flags & 16) !== 0) {
            var c = u.deletions;
            if (c !== null) {
              for (var s = 0; s < c.length; s++) {
                var d = c[s];
                for (z = d; z !== null;) {
                  var m = z;
                  switch (m.tag) {
                    case 0:
                    case 11:
                    case 15:
                      yr(8, m, u);
                  }
                  var g = m.child;
                  if (g !== null) g.return = m, z = g;else for (; z !== null;) {
                    m = z;
                    var {
                      sibling: y,
                      return: E
                    } = m;
                    if (ys(m), m === d) {
                      z = null;
                      break;
                    }
                    if (y !== null) {
                      y.return = E, z = y;
                      break;
                    }
                    z = E;
                  }
                }
              }
              var P = u.alternate;
              if (P !== null) {
                var C = P.child;
                if (C !== null) {
                  P.child = null;
                  do {
                    var M = C.sibling;
                    C.sibling = null, C = M;
                  } while (C !== null);
                }
              }
              z = u;
            }
          }
          if ((u.subtreeFlags & 2064) !== 0 && o !== null) o.return = u, z = o;else e: for (; z !== null;) {
            if (u = z, (u.flags & 2048) !== 0) switch (u.tag) {
              case 0:
              case 11:
              case 15:
                yr(9, u, u.return);
            }
            var p = u.sibling;
            if (p !== null) {
              p.return = u.return, z = p;
              break e;
            }
            z = u.return;
          }
        }
        var A = e.current;
        for (z = A; z !== null;) {
          o = z;
          var v = o.child;
          if ((o.subtreeFlags & 2064) !== 0 && v !== null) v.return = o, z = v;else e: for (o = A; z !== null;) {
            if (c = z, (c.flags & 2048) !== 0) try {
              switch (c.tag) {
                case 0:
                case 11:
                case 15:
                  fu(9, c);
              }
            } catch (N) {
              H(c, c.return, N);
            }
            if (c === o) {
              z = null;
              break e;
            }
            var k = c.sibling;
            if (k !== null) {
              k.return = c.return, z = k;
              break e;
            }
            z = c.return;
          }
        }
        if (I = l, Wn(), en && typeof en.onPostCommitFiberRoot === "function") try {
          en.onPostCommitFiberRoot(tu, e);
        } catch (N) {}
        r = !0;
      }
      return r;
    } finally {
      W = t, We.transition = n;
    }
  }
  return !1;
}
function Uc(e, n, t) {
  n = _t(t, n), n = us(e, n, 1), e = Rn(e, n, 1), n = Se(), e !== null && (Ir(e, 1, n), Ne(e, n));
}
function H(e, n, t) {
  if (e.tag === 3) Uc(e, e, t);else for (; n !== null;) {
    if (n.tag === 3) {
      Uc(n, e, t);
      break;
    } else if (n.tag === 1) {
      var r = n.stateNode;
      if (typeof n.type.getDerivedStateFromError === "function" || typeof r.componentDidCatch === "function" && (Un === null || !Un.has(r))) {
        e = _t(t, e), e = os(n, e, 1), n = Rn(n, e, 1), e = Se(), n !== null && (Ir(n, 1, e), Ne(n, e));
        break;
      }
    }
    n = n.return;
  }
}
function zv(e, n, t) {
  var r = e.pingCache;
  r !== null && r.delete(n), n = Se(), e.pingedLanes |= e.suspendedLanes & t, le === e && (ie & t) === t && (ee === 4 || ee === 3 && (ie & 130023424) === ie && 500 > $() - Xi ? Hn(e, 0) : Ki |= t), Ne(e, n);
}
function zs(e, n) {
  n === 0 && ((e.mode & 1) === 0 ? n = 1 : (n = fl, fl <<= 1, (fl & 130023424) === 0 && (fl = 4194304)));
  var t = Se();
  e = fn(e, n), e !== null && (Ir(e, n, t), Ne(e, t));
}
function Nv(e) {
  var n = e.memoizedState,
    t = 0;
  n !== null && (t = n.retryLane), zs(e, t);
}
function Tv(e, n) {
  var t = 0;
  switch (e.tag) {
    case 13:
      var {
        stateNode: r,
        memoizedState: l
      } = e;
      l !== null && (t = l.retryLane);
      break;
    case 19:
      r = e.stateNode;
      break;
    default:
      throw Error(S(314));
  }
  r !== null && r.delete(n), zs(e, t);
}
function Ts(e, n) {
  return ef(e, n);
}
function Rv(e, n, t, r) {
  this.tag = e, this.key = t, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = n, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
}
function Ie(e, n, t, r) {
  return new Rv(e, n, t, r);
}
function Ji(e) {
  return e = e.prototype, !(!e || !e.isReactComponent);
}
function Uv(e) {
  if (typeof e === "function") return Ji(e) ? 1 : 0;
  if (e !== void 0 && e !== null) {
    if (e = e.$$typeof, e === Ai) return 11;
    if (e === di) return 14;
  }
  return 2;
}
function On(e, n) {
  var t = e.alternate;
  return t === null ? (t = Ie(e.tag, n, e.key, e.mode), t.elementType = e.elementType, t.type = e.type, t.stateNode = e.stateNode, t.alternate = e, e.alternate = t) : (t.pendingProps = n, t.type = e.type, t.flags = 0, t.subtreeFlags = 0, t.deletions = null), t.flags = e.flags & 14680064, t.childLanes = e.childLanes, t.lanes = e.lanes, t.child = e.child, t.memoizedProps = e.memoizedProps, t.memoizedState = e.memoizedState, t.updateQueue = e.updateQueue, n = e.dependencies, t.dependencies = n === null ? null : {
    lanes: n.lanes,
    firstContext: n.firstContext
  }, t.sibling = e.sibling, t.index = e.index, t.ref = e.ref, t;
}
function Ll(e, n, t, r, l, u) {
  var o = 2;
  if (r = e, typeof e === "function") Ji(e) && (o = 1);else if (typeof e === "string") o = 5;else e: switch (e) {
    case st:
      return $n(t.children, l, u, n);
    case si:
      o = 8, l |= 8;
      break;
    case vo:
      return e = Ie(12, t, n, l | 2), e.elementType = vo, e.lanes = u, e;
    case yo:
      return e = Ie(13, t, n, l), e.elementType = yo, e.lanes = u, e;
    case mo:
      return e = Ie(19, t, n, l), e.elementType = mo, e.lanes = u, e;
    case Wc:
      return Au(t, l, u, n);
    default:
      if (typeof e === "object" && e !== null) switch (e.$$typeof) {
        case Qc:
          o = 10;
          break e;
        case Ic:
          o = 9;
          break e;
        case Ai:
          o = 11;
          break e;
        case di:
          o = 14;
          break e;
        case gn:
          o = 16, r = null;
          break e;
      }
      throw Error(S(130, e == null ? e : typeof e, ""));
  }
  return n = Ie(o, t, n, l), n.elementType = e, n.type = r, n.lanes = u, n;
}
function $n(e, n, t, r) {
  return e = Ie(7, e, r, n), e.lanes = t, e;
}
function Au(e, n, t, r) {
  return e = Ie(22, e, r, n), e.elementType = Wc, e.lanes = t, e.stateNode = {
    isHidden: !1
  }, e;
}
function so(e, n, t) {
  return e = Ie(6, e, null, n), e.lanes = t, e;
}
function Ao(e, n, t) {
  return n = Ie(4, e.children !== null ? e.children : [], e.key, n), n.lanes = t, n.stateNode = {
    containerInfo: e.containerInfo,
    pendingChildren: null,
    implementation: e.implementation
  }, n;
}
function Lv(e, n, t, r, l) {
  this.tag = n, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = $u(0), this.expirationTimes = $u(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = $u(0), this.identifierPrefix = r, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
}
function qi(e, n, t, r, l, u, o, c, s) {
  return e = new Lv(e, n, t, c, s), n === 1 ? (n = 1, u === !0 && (n |= 8)) : n = 0, u = Ie(3, null, null, n), e.current = u, u.stateNode = e, u.memoizedState = {
    element: r,
    isDehydrated: t,
    cache: null,
    transitions: null,
    pendingSuspenseBoundaries: null
  }, Li(u), e;
}
function Ov(e, n, t) {
  var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return {
    $$typeof: ft,
    key: r == null ? null : "" + r,
    children: e,
    containerInfo: n,
    implementation: t
  };
}
function Rs(e) {
  if (!e) return Bn;
  e = e._reactInternals;
  e: {
    if (rt(e) !== e || e.tag !== 1) throw Error(S(170));
    var n = e;
    do {
      switch (n.tag) {
        case 3:
          n = n.stateNode.context;
          break e;
        case 1:
          if (ze(n.type)) {
            n = n.stateNode.__reactInternalMemoizedMergedChildContext;
            break e;
          }
      }
      n = n.return;
    } while (n !== null);
    throw Error(S(171));
  }
  if (e.tag === 1) {
    var t = e.type;
    if (ze(t)) return Rf(e, t, n);
  }
  return n;
}
function Us(e, n, t, r, l, u, o, c, s) {
  return e = qi(t, r, !0, e, l, u, o, c, s), e.context = Rs(null), t = e.current, r = Se(), l = Ln(t), u = on(r, l), u.callback = n !== void 0 && n !== null ? n : null, Rn(t, u, l), e.current.lanes = l, Ir(e, l, r), Ne(e, r), e;
}
function du(e, n, t, r) {
  var l = n.current,
    u = Se(),
    o = Ln(l);
  return t = Rs(t), n.context === null ? n.context = t : n.pendingContext = t, n = on(u, o), n.payload = {
    element: e
  }, r = r === void 0 ? null : r, r !== null && (n.callback = r), e = Rn(l, n, o), e !== null && (Je(e, l, o, u), Cl(e, l, o)), o;
}
function nu(e) {
  if (e = e.current, !e.child) return null;
  switch (e.child.tag) {
    case 5:
      return e.child.stateNode;
    default:
      return e.child.stateNode;
  }
}
function Lc(e, n) {
  if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
    var t = e.retryLane;
    e.retryLane = t !== 0 && t < n ? t : n;
  }
}
function Hi(e, n) {
  Lc(e, n), (e = e.alternate) && Lc(e, n);
}
function _v() {
  return null;
}
function $i(e) {
  this._internalRoot = e;
}
function pu(e) {
  this._internalRoot = e;
}
function xi(e) {
  return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
}
function vu(e) {
  return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
}
function Oc() {}
function Bv(e, n, t, r, l) {
  if (l) {
    if (typeof r === "function") {
      var u = r;
      r = function () {
        var d = nu(o);
        u.call(d);
      };
    }
    var o = Us(n, r, e, 0, null, !1, !1, "", Oc);
    return e._reactRootContainer = o, e[cn] = o.current, Nr(e.nodeType === 8 ? e.parentNode : e), nt(), o;
  }
  for (; l = e.lastChild;) e.removeChild(l);
  if (typeof r === "function") {
    var c = r;
    r = function () {
      var d = nu(s);
      c.call(d);
    };
  }
  var s = qi(e, 0, !1, null, null, !1, !1, "", Oc);
  return e._reactRootContainer = s, e[cn] = s.current, Nr(e.nodeType === 8 ? e.parentNode : e), nt(function () {
    du(n, s, t, r);
  }), s;
}
function yu(e, n, t, r, l) {
  var u = t._reactRootContainer;
  if (u) {
    var o = u;
    if (typeof l === "function") {
      var c = l;
      l = function () {
        var s = nu(o);
        c.call(s);
      };
    }
    du(n, o, e, l);
  } else o = Bv(t, n, e, l, r);
  return nu(o);
}
var _c,
  F,
  Bc,
  gr,
  an,
  po,
  Wd,
  Ra,
  Ua,
  ae,
  ai,
  An,
  ol,
  ft,
  st,
  si,
  vo,
  Qc,
  Ic,
  Ai,
  yo,
  mo,
  di,
  gn,
  Wc,
  La,
  J,
  Yu,
  Ju = !1,
  rr,
  al,
  Xc,
  fr,
  Fd,
  Gd,
  zo = null,
  No = null,
  Et = null,
  Pt = null,
  Hu = !1,
  To = !1,
  Xn,
  sr = !1,
  _l = null,
  Bl = !1,
  Ro = null,
  Jd,
  ef,
  Ma,
  xd,
  jd,
  $,
  bd,
  vi,
  nf,
  Ql,
  ep,
  tf,
  tu = null,
  en = null,
  Ye,
  tp,
  rp,
  cl = 64,
  fl = 4194304,
  W = 0,
  uf,
  mi,
  of,
  af,
  cf,
  Lo = !1,
  sl,
  Cn = null,
  zn = null,
  Nn = null,
  wr,
  Er,
  Sn,
  ap,
  Ct,
  Wl = !0,
  Ml = null,
  En = null,
  gi = null,
  wl = null,
  Qt,
  ki,
  Wr,
  dp,
  xu,
  ju,
  jt,
  ru,
  Ka,
  pp,
  vp,
  yp,
  bu,
  mp,
  hp,
  gp,
  kp,
  Sp,
  Xa,
  wp,
  Ep,
  Pp,
  zp,
  Np,
  Tp,
  Fa,
  Rp,
  Up,
  Lp,
  Op,
  _p,
  Bp,
  Qp,
  wi,
  Ar = null,
  Ip,
  df,
  Ga,
  Ya = !1,
  At = !1,
  Dp,
  dr = null,
  Cr = null,
  mf = !1,
  ur,
  or,
  Pl,
  qe,
  qp,
  dt = null,
  _o = null,
  pr = null,
  Bo = !1,
  pt,
  eo,
  Sf,
  wf,
  Ef,
  Pf,
  Cf,
  zf,
  ja,
  ar,
  Qo,
  Io,
  ir,
  cr,
  Hp,
  pl,
  $p,
  xp,
  Wo = null,
  Mo = null,
  Vo,
  jp,
  tc,
  bp,
  It,
  be,
  Rr,
  cn,
  Zo,
  nv,
  tv,
  Ko,
  yt = -1,
  Bn,
  me,
  Ce,
  xn,
  rn = null,
  iu = !1,
  lo = !1,
  mt,
  ht = 0,
  Xl = null,
  Fl = 0,
  Be,
  Qe = 0,
  jn = null,
  ln = 1,
  un = "",
  Ue = null,
  Re = null,
  X = !1,
  Ge = null,
  lv,
  Lt,
  Qf,
  Gl,
  Yl = null,
  gt = null,
  Ni = null,
  Jn = null,
  kn = !1,
  Dr,
  nn,
  Ur,
  Lr,
  G,
  uo,
  zl,
  oo,
  bn = 0,
  Y = null,
  b = null,
  re = null,
  Hl = !1,
  vr = !1,
  Or = 0,
  uv = 0,
  $l,
  cv,
  fv,
  sv,
  cu,
  Av,
  dv,
  Pe = !1,
  xo,
  ds,
  bo,
  ps,
  vs,
  gl = !1,
  ye = !1,
  hv,
  z = null,
  Ec = !1,
  oe = null,
  Fe = !1,
  Sv,
  xl,
  Zi,
  We,
  I = 0,
  le = null,
  j = null,
  ie = 0,
  Te = 0,
  St,
  ee = 0,
  Qr = null,
  et = 0,
  su = 0,
  Ki = 0,
  mr = null,
  Ee = null,
  Xi = 0,
  Bt = 1 / 0,
  tn = null,
  jl = !1,
  li = null,
  Un = null,
  kl = !1,
  Pn = null,
  bl = 0,
  hr = 0,
  ui = null,
  Rl = -1,
  Ul = 0,
  Ns,
  Ls,
  Qv,
  nr,
  Iv,
  ct,
  Os,
  _s = function (e, n) {
    var t = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!xi(n)) throw Error(S(200));
    return Ov(e, n, null, t);
  },
  Bs = function (e, n) {
    if (!xi(e)) throw Error(S(299));
    var t = !1,
      r = "",
      l = Ls;
    return n !== null && n !== void 0 && (n.unstable_strictMode === !0 && (t = !0), n.identifierPrefix !== void 0 && (r = n.identifierPrefix), n.onRecoverableError !== void 0 && (l = n.onRecoverableError)), n = qi(e, 1, !1, null, null, t, !1, r, l), e[cn] = n.current, Nr(e.nodeType === 8 ? e.parentNode : e), new $i(n);
  },
  Qs = function (e) {
    if (e == null) return null;
    if (e.nodeType === 1) return e;
    var n = e._reactInternals;
    if (n === void 0) {
      if (typeof e.render === "function") throw Error(S(188));
      throw e = Object.keys(e).join(","), Error(S(268, e));
    }
    return e = jc(n), e = e === null ? null : e.stateNode, e;
  },
  Is = function (e) {
    return nt(e);
  },
  Ws = function (e, n, t) {
    if (!vu(n)) throw Error(S(200));
    return yu(null, e, n, !0, t);
  },
  Ms = function (e, n, t) {
    if (!xi(e)) throw Error(S(405));
    var r = t != null && t.hydratedSources || null,
      l = !1,
      u = "",
      o = Ls;
    if (t !== null && t !== void 0 && (t.unstable_strictMode === !0 && (l = !0), t.identifierPrefix !== void 0 && (u = t.identifierPrefix), t.onRecoverableError !== void 0 && (o = t.onRecoverableError)), n = Us(n, null, e, 1, t != null ? t : null, l, !1, u, o), e[cn] = n.current, Nr(e), r) for (e = 0; e < r.length; e++) t = r[e], l = t._getVersion, l = l(t._source), n.mutableSourceEagerHydrationData == null ? n.mutableSourceEagerHydrationData = [t, l] : n.mutableSourceEagerHydrationData.push(t, l);
    return new pu(n);
  },
  Ds = function (e, n, t) {
    if (!vu(n)) throw Error(S(200));
    return yu(null, e, n, !1, t);
  },
  Vs = function (e) {
    if (!vu(e)) throw Error(S(40));
    return e._reactRootContainer ? (nt(function () {
      yu(null, null, e, !1, function () {
        e._reactRootContainer = null, e[cn] = null;
      });
    }), !0) : !1;
  },
  Zs,
  Ks = function (e, n, t, r) {
    if (!vu(t)) throw Error(S(200));
    if (e == null || e._reactInternals === void 0) throw Error(S(38));
    return yu(e, n, t, !1, r);
  },
  Xs = "18.3.1-next-f1338f8080-20240426";
var Fs = hA(() => {
  _c = Zn(Gt(), 1), F = Zn(Ta(), 1);
  Bc = new Set(), gr = {};
  an = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), po = Object.prototype.hasOwnProperty, Wd = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, Ra = {}, Ua = {};
  ae = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function (e) {
    ae[e] = new we(e, 0, !1, e, null, !1, !1);
  });
  [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function (e) {
    var n = e[0];
    ae[n] = new we(n, 1, !1, e[1], null, !1, !1);
  });
  ["contentEditable", "draggable", "spellCheck", "value"].forEach(function (e) {
    ae[e] = new we(e, 2, !1, e.toLowerCase(), null, !1, !1);
  });
  ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function (e) {
    ae[e] = new we(e, 2, !1, e, null, !1, !1);
  });
  "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function (e) {
    ae[e] = new we(e, 3, !1, e.toLowerCase(), null, !1, !1);
  });
  ["checked", "multiple", "muted", "selected"].forEach(function (e) {
    ae[e] = new we(e, 3, !0, e, null, !1, !1);
  });
  ["capture", "download"].forEach(function (e) {
    ae[e] = new we(e, 4, !1, e, null, !1, !1);
  });
  ["cols", "rows", "size", "span"].forEach(function (e) {
    ae[e] = new we(e, 6, !1, e, null, !1, !1);
  });
  ["rowSpan", "start"].forEach(function (e) {
    ae[e] = new we(e, 5, !1, e.toLowerCase(), null, !1, !1);
  });
  ai = /[\-:]([a-z])/g;
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function (e) {
    var n = e.replace(ai, ci);
    ae[n] = new we(n, 1, !1, e, null, !1, !1);
  });
  "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function (e) {
    var n = e.replace(ai, ci);
    ae[n] = new we(n, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  });
  ["xml:base", "xml:lang", "xml:space"].forEach(function (e) {
    var n = e.replace(ai, ci);
    ae[n] = new we(n, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  });
  ["tabIndex", "crossOrigin"].forEach(function (e) {
    ae[e] = new we(e, 1, !1, e.toLowerCase(), null, !1, !1);
  });
  ae.xlinkHref = new we("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1);
  ["src", "href", "action", "formAction"].forEach(function (e) {
    ae[e] = new we(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  An = _c.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, ol = Symbol.for("react.element"), ft = Symbol.for("react.portal"), st = Symbol.for("react.fragment"), si = Symbol.for("react.strict_mode"), vo = Symbol.for("react.profiler"), Qc = Symbol.for("react.provider"), Ic = Symbol.for("react.context"), Ai = Symbol.for("react.forward_ref"), yo = Symbol.for("react.suspense"), mo = Symbol.for("react.suspense_list"), di = Symbol.for("react.memo"), gn = Symbol.for("react.lazy"), Wc = Symbol.for("react.offscreen"), La = Symbol.iterator;
  J = Object.assign;
  rr = Array.isArray;
  Xc = function (e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function (n, t, r, l) {
      MSApp.execUnsafeLocalFunction(function () {
        return e(n, t, r, l);
      });
    } : e;
  }(function (e, n) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = n;else {
      al = al || document.createElement("div"), al.innerHTML = "<svg>" + n.valueOf().toString() + "</svg>";
      for (n = al.firstChild; e.firstChild;) e.removeChild(e.firstChild);
      for (; n.firstChild;) e.appendChild(n.firstChild);
    }
  });
  fr = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0
  }, Fd = ["Webkit", "ms", "Moz", "O"];
  Object.keys(fr).forEach(function (e) {
    Fd.forEach(function (n) {
      n = n + e.charAt(0).toUpperCase() + e.substring(1), fr[n] = fr[e];
    });
  });
  Gd = J({
    menuitem: !0
  }, {
    area: !0,
    base: !0,
    br: !0,
    col: !0,
    embed: !0,
    hr: !0,
    img: !0,
    input: !0,
    keygen: !0,
    link: !0,
    meta: !0,
    param: !0,
    source: !0,
    track: !0,
    wbr: !0
  });
  if (an) try {
    Xn = {}, Object.defineProperty(Xn, "passive", {
      get: function () {
        To = !0;
      }
    }), window.addEventListener("test", Xn, Xn), window.removeEventListener("test", Xn, Xn);
  } catch (e) {
    To = !1;
  }
  Jd = {
    onError: function (e) {
      sr = !0, _l = e;
    }
  };
  ef = F.unstable_scheduleCallback, Ma = F.unstable_cancelCallback, xd = F.unstable_shouldYield, jd = F.unstable_requestPaint, $ = F.unstable_now, bd = F.unstable_getCurrentPriorityLevel, vi = F.unstable_ImmediatePriority, nf = F.unstable_UserBlockingPriority, Ql = F.unstable_NormalPriority, ep = F.unstable_LowPriority, tf = F.unstable_IdlePriority;
  Ye = Math.clz32 ? Math.clz32 : lp, tp = Math.log, rp = Math.LN2;
  sl = [], wr = new Map(), Er = new Map(), Sn = [], ap = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  Ct = An.ReactCurrentBatchConfig;
  Qt = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function (e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, ki = Le(Qt), Wr = J({}, Qt, {
    view: 0,
    detail: 0
  }), dp = Le(Wr), ru = J({}, Wr, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: Si,
    button: 0,
    buttons: 0,
    relatedTarget: function (e) {
      return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
    },
    movementX: function (e) {
      if ("movementX" in e) return e.movementX;
      return e !== jt && (jt && e.type === "mousemove" ? (xu = e.screenX - jt.screenX, ju = e.screenY - jt.screenY) : ju = xu = 0, jt = e), xu;
    },
    movementY: function (e) {
      return "movementY" in e ? e.movementY : ju;
    }
  }), Ka = Le(ru), pp = J({}, ru, {
    dataTransfer: 0
  }), vp = Le(pp), yp = J({}, Wr, {
    relatedTarget: 0
  }), bu = Le(yp), mp = J({}, Qt, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), hp = Le(mp), gp = J({}, Qt, {
    clipboardData: function (e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    }
  }), kp = Le(gp), Sp = J({}, Qt, {
    data: 0
  }), Xa = Le(Sp), wp = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, Ep = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, Pp = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  zp = J({}, Wr, {
    key: function (e) {
      if (e.key) {
        var n = wp[e.key] || e.key;
        if (n !== "Unidentified") return n;
      }
      return e.type === "keypress" ? (e = El(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Ep[e.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Si,
    charCode: function (e) {
      return e.type === "keypress" ? El(e) : 0;
    },
    keyCode: function (e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function (e) {
      return e.type === "keypress" ? El(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    }
  }), Np = Le(zp), Tp = J({}, ru, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0
  }), Fa = Le(Tp), Rp = J({}, Wr, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Si
  }), Up = Le(Rp), Lp = J({}, Qt, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Op = Le(Lp), _p = J({}, ru, {
    deltaX: function (e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function (e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Bp = Le(_p), Qp = [9, 13, 27, 32], wi = an && "CompositionEvent" in window;
  an && "documentMode" in document && (Ar = document.documentMode);
  Ip = an && "TextEvent" in window && !Ar, df = an && (!wi || Ar && 8 < Ar && 11 >= Ar), Ga = String.fromCharCode(32);
  Dp = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0
  };
  if (an) {
    if (an) {
      if (or = "oninput" in document, !or) Pl = document.createElement("div"), Pl.setAttribute("oninput", "return;"), or = typeof Pl.oninput === "function";
      ur = or;
    } else ur = !1;
    mf = ur && (!document.documentMode || 9 < document.documentMode);
  }
  qe = typeof Object.is === "function" ? Object.is : Yp;
  qp = an && "documentMode" in document && 11 >= document.documentMode;
  pt = {
    animationend: dl("Animation", "AnimationEnd"),
    animationiteration: dl("Animation", "AnimationIteration"),
    animationstart: dl("Animation", "AnimationStart"),
    transitionend: dl("Transition", "TransitionEnd")
  }, eo = {}, Sf = {};
  an && (Sf = document.createElement("div").style, "AnimationEvent" in window || (delete pt.animationend.animation, delete pt.animationiteration.animation, delete pt.animationstart.animation), "TransitionEvent" in window || delete pt.transitionend.transition);
  wf = uu("animationend"), Ef = uu("animationiteration"), Pf = uu("animationstart"), Cf = uu("transitionend"), zf = new Map(), ja = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  for (ir = 0; ir < ja.length; ir++) ar = ja[ir], Qo = ar.toLowerCase(), Io = ar[0].toUpperCase() + ar.slice(1), Qn(Qo, "on" + Io);
  Qn(wf, "onAnimationEnd");
  Qn(Ef, "onAnimationIteration");
  Qn(Pf, "onAnimationStart");
  Qn("dblclick", "onDoubleClick");
  Qn("focusin", "onFocus");
  Qn("focusout", "onBlur");
  Qn(Cf, "onTransitionEnd");
  Tt("onMouseEnter", ["mouseout", "mouseover"]);
  Tt("onMouseLeave", ["mouseout", "mouseover"]);
  Tt("onPointerEnter", ["pointerout", "pointerover"]);
  Tt("onPointerLeave", ["pointerout", "pointerover"]);
  tt("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
  tt("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
  tt("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
  tt("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
  tt("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
  tt("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  cr = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Hp = new Set("cancel close invalid load scroll toggle".split(" ").concat(cr));
  pl = "_reactListening" + Math.random().toString(36).slice(2);
  $p = /\r\n?/g, xp = /\u0000|\uFFFD/g;
  Vo = typeof setTimeout === "function" ? setTimeout : void 0, jp = typeof clearTimeout === "function" ? clearTimeout : void 0, tc = typeof Promise === "function" ? Promise : void 0, bp = typeof queueMicrotask === "function" ? queueMicrotask : typeof tc < "u" ? function (e) {
    return tc.resolve(null).then(e).catch(ev);
  } : Vo;
  It = Math.random().toString(36).slice(2), be = "__reactFiber$" + It, Rr = "__reactProps$" + It, cn = "__reactContainer$" + It, Zo = "__reactEvents$" + It, nv = "__reactListeners$" + It, tv = "__reactHandles$" + It;
  Ko = [];
  Bn = {}, me = In(Bn), Ce = In(!1), xn = Bn;
  mt = [], Be = [];
  lv = An.ReactCurrentBatchConfig;
  Lt = Bf(!0), Qf = Bf(!1), Gl = In(null);
  Dr = {}, nn = In(Dr), Ur = In(Dr), Lr = In(Dr);
  G = In(0);
  uo = [];
  zl = An.ReactCurrentDispatcher, oo = An.ReactCurrentBatchConfig;
  $l = {
    readContext: Me,
    useCallback: pe,
    useContext: pe,
    useEffect: pe,
    useImperativeHandle: pe,
    useInsertionEffect: pe,
    useLayoutEffect: pe,
    useMemo: pe,
    useReducer: pe,
    useRef: pe,
    useState: pe,
    useDebugValue: pe,
    useDeferredValue: pe,
    useTransition: pe,
    useMutableSource: pe,
    useSyncExternalStore: pe,
    useId: pe,
    unstable_isNewReconciler: !1
  }, cv = {
    readContext: Me,
    useCallback: function (e, n) {
      return je().memoizedState = [e, n === void 0 ? null : n], e;
    },
    useContext: Me,
    useEffect: Ac,
    useImperativeHandle: function (e, n, t) {
      return t = t !== null && t !== void 0 ? t.concat([e]) : null, Nl(4194308, 4, Hf.bind(null, n, e), t);
    },
    useLayoutEffect: function (e, n) {
      return Nl(4194308, 4, e, n);
    },
    useInsertionEffect: function (e, n) {
      return Nl(4, 2, e, n);
    },
    useMemo: function (e, n) {
      var t = je();
      return n = n === void 0 ? null : n, e = e(), t.memoizedState = [e, n], e;
    },
    useReducer: function (e, n, t) {
      var r = je();
      return n = t !== void 0 ? t(n) : n, r.memoizedState = r.baseState = n, e = {
        pending: null,
        interleaved: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: n
      }, r.queue = e, e = e.dispatch = iv.bind(null, Y, e), [r.memoizedState, e];
    },
    useRef: function (e) {
      var n = je();
      return e = {
        current: e
      }, n.memoizedState = e;
    },
    useState: sc,
    useDebugValue: Di,
    useDeferredValue: function (e) {
      return je().memoizedState = e;
    },
    useTransition: function () {
      var e = sc(!1),
        n = e[0];
      return e = ov.bind(null, e[1]), je().memoizedState = e, [n, e];
    },
    useMutableSource: function () {},
    useSyncExternalStore: function (e, n, t) {
      var r = Y,
        l = je();
      if (X) {
        if (t === void 0) throw Error(S(407));
        t = t();
      } else {
        if (t = n(), le === null) throw Error(S(349));
        (bn & 30) !== 0 || Zf(r, n, t);
      }
      l.memoizedState = t;
      var u = {
        value: t,
        getSnapshot: n
      };
      return l.queue = u, Ac(Xf.bind(null, r, u, e), [e]), r.flags |= 2048, Br(9, Kf.bind(null, r, u, t, n), void 0, null), t;
    },
    useId: function () {
      var e = je(),
        n = le.identifierPrefix;
      if (X) {
        var t = un,
          r = ln;
        t = (r & ~(1 << 32 - Ye(r) - 1)).toString(32) + t, n = ":" + n + "R" + t, t = Or++, 0 < t && (n += "H" + t.toString(32)), n += ":";
      } else t = uv++, n = ":" + n + "r" + t.toString(32) + ":";
      return e.memoizedState = n;
    },
    unstable_isNewReconciler: !1
  }, fv = {
    readContext: Me,
    useCallback: xf,
    useContext: Me,
    useEffect: Mi,
    useImperativeHandle: $f,
    useInsertionEffect: Jf,
    useLayoutEffect: qf,
    useMemo: jf,
    useReducer: io,
    useRef: Yf,
    useState: function () {
      return io(_r);
    },
    useDebugValue: Di,
    useDeferredValue: function (e) {
      var n = De();
      return bf(n, b.memoizedState, e);
    },
    useTransition: function () {
      var e = io(_r)[0],
        n = De().memoizedState;
      return [e, n];
    },
    useMutableSource: Df,
    useSyncExternalStore: Vf,
    useId: es,
    unstable_isNewReconciler: !1
  }, sv = {
    readContext: Me,
    useCallback: xf,
    useContext: Me,
    useEffect: Mi,
    useImperativeHandle: $f,
    useInsertionEffect: Jf,
    useLayoutEffect: qf,
    useMemo: jf,
    useReducer: ao,
    useRef: Yf,
    useState: function () {
      return ao(_r);
    },
    useDebugValue: Di,
    useDeferredValue: function (e) {
      var n = De();
      return b === null ? n.memoizedState = e : bf(n, b.memoizedState, e);
    },
    useTransition: function () {
      var e = ao(_r)[0],
        n = De().memoizedState;
      return [e, n];
    },
    useMutableSource: Df,
    useSyncExternalStore: Vf,
    useId: es,
    unstable_isNewReconciler: !1
  };
  cu = {
    isMounted: function (e) {
      return (e = e._reactInternals) ? rt(e) === e : !1;
    },
    enqueueSetState: function (e, n, t) {
      e = e._reactInternals;
      var r = Se(),
        l = Ln(e),
        u = on(r, l);
      u.payload = n, t !== void 0 && t !== null && (u.callback = t), n = Rn(e, u, l), n !== null && (Je(n, e, l, r), Cl(n, e, l));
    },
    enqueueReplaceState: function (e, n, t) {
      e = e._reactInternals;
      var r = Se(),
        l = Ln(e),
        u = on(r, l);
      u.tag = 1, u.payload = n, t !== void 0 && t !== null && (u.callback = t), n = Rn(e, u, l), n !== null && (Je(n, e, l, r), Cl(n, e, l));
    },
    enqueueForceUpdate: function (e, n) {
      e = e._reactInternals;
      var t = Se(),
        r = Ln(e),
        l = on(t, r);
      l.tag = 2, n !== void 0 && n !== null && (l.callback = n), n = Rn(e, l, r), n !== null && (Je(n, e, r, t), Cl(n, e, r));
    }
  };
  Av = typeof WeakMap === "function" ? WeakMap : Map;
  dv = An.ReactCurrentOwner;
  xo = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0
  };
  ds = function (e, n) {
    for (var t = n.child; t !== null;) {
      if (t.tag === 5 || t.tag === 6) e.appendChild(t.stateNode);else if (t.tag !== 4 && t.child !== null) {
        t.child.return = t, t = t.child;
        continue;
      }
      if (t === n) break;
      for (; t.sibling === null;) {
        if (t.return === null || t.return === n) return;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
  };
  bo = function () {};
  ps = function (e, n, t, r) {
    var l = e.memoizedProps;
    if (l !== r) {
      e = n.stateNode, qn(nn.current);
      var u = null;
      switch (t) {
        case "input":
          l = go(e, l), r = go(e, r), u = [];
          break;
        case "select":
          l = J({}, l, {
            value: void 0
          }), r = J({}, r, {
            value: void 0
          }), u = [];
          break;
        case "textarea":
          l = wo(e, l), r = wo(e, r), u = [];
          break;
        default:
          typeof l.onClick !== "function" && typeof r.onClick === "function" && (e.onclick = Vl);
      }
      Po(t, r);
      var o;
      t = null;
      for (d in l) if (!r.hasOwnProperty(d) && l.hasOwnProperty(d) && l[d] != null) if (d === "style") {
        var c = l[d];
        for (o in c) c.hasOwnProperty(o) && (t || (t = {}), t[o] = "");
      } else d !== "dangerouslySetInnerHTML" && d !== "children" && d !== "suppressContentEditableWarning" && d !== "suppressHydrationWarning" && d !== "autoFocus" && (gr.hasOwnProperty(d) ? u || (u = []) : (u = u || []).push(d, null));
      for (d in r) {
        var s = r[d];
        if (c = l != null ? l[d] : void 0, r.hasOwnProperty(d) && s !== c && (s != null || c != null)) if (d === "style") {
          if (c) {
            for (o in c) !c.hasOwnProperty(o) || s && s.hasOwnProperty(o) || (t || (t = {}), t[o] = "");
            for (o in s) s.hasOwnProperty(o) && c[o] !== s[o] && (t || (t = {}), t[o] = s[o]);
          } else t || (u || (u = []), u.push(d, t)), t = s;
        } else d === "dangerouslySetInnerHTML" ? (s = s ? s.__html : void 0, c = c ? c.__html : void 0, s != null && c !== s && (u = u || []).push(d, s)) : d === "children" ? typeof s !== "string" && typeof s !== "number" || (u = u || []).push(d, "" + s) : d !== "suppressContentEditableWarning" && d !== "suppressHydrationWarning" && (gr.hasOwnProperty(d) ? (s != null && d === "onScroll" && V("scroll", e), u || c === s || (u = [])) : (u = u || []).push(d, s));
      }
      t && (u = u || []).push("style", t);
      var d = u;
      if (n.updateQueue = d) n.flags |= 4;
    }
  };
  vs = function (e, n, t, r) {
    t !== r && (n.flags |= 4);
  };
  hv = typeof WeakSet === "function" ? WeakSet : Set;
  Sv = Math.ceil, xl = An.ReactCurrentDispatcher, Zi = An.ReactCurrentOwner, We = An.ReactCurrentBatchConfig, St = In(0);
  Ns = function (e, n, t) {
    if (e !== null) {
      if (e.memoizedProps !== n.pendingProps || Ce.current) Pe = !0;else {
        if ((e.lanes & t) === 0 && (n.flags & 128) === 0) return Pe = !1, vv(e, n, t);
        Pe = (e.flags & 131072) !== 0 ? !0 : !1;
      }
    } else Pe = !1, X && (n.flags & 1048576) !== 0 && Lf(n, Fl, n.index);
    switch (n.lanes = 0, n.tag) {
      case 2:
        var r = n.type;
        Tl(e, n), e = n.pendingProps;
        var l = Rt(n, me.current);
        zt(n, t), l = Ii(null, n, r, e, l, t);
        var u = Wi();
        return n.flags |= 1, typeof l === "object" && l !== null && typeof l.render === "function" && l.$$typeof === void 0 ? (n.tag = 1, n.memoizedState = null, n.updateQueue = null, ze(r) ? (u = !0, Kl(n)) : u = !1, n.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, Li(n), l.updater = cu, n.stateNode = l, l._reactInternals = n, Jo(n, r, e, t), n = $o(null, n, r, !0, u, t)) : (n.tag = 0, X && u && Pi(n), ke(null, n, l, t), n = n.child), n;
      case 16:
        r = n.elementType;
        e: {
          switch (Tl(e, n), e = n.pendingProps, l = r._init, r = l(r._payload), n.type = r, l = n.tag = Uv(r), e = Xe(r, e), l) {
            case 0:
              n = Ho(null, n, r, e, t);
              break e;
            case 1:
              n = kc(null, n, r, e, t);
              break e;
            case 11:
              n = hc(null, n, r, e, t);
              break e;
            case 14:
              n = gc(null, n, r, Xe(r.type, e), t);
              break e;
          }
          throw Error(S(306, r, ""));
        }
        return n;
      case 0:
        return r = n.type, l = n.pendingProps, l = n.elementType === r ? l : Xe(r, l), Ho(e, n, r, l, t);
      case 1:
        return r = n.type, l = n.pendingProps, l = n.elementType === r ? l : Xe(r, l), kc(e, n, r, l, t);
      case 3:
        e: {
          if (fs(n), e === null) throw Error(S(387));
          r = n.pendingProps, u = n.memoizedState, l = u.element, Wf(e, n), Jl(n, r, null, t);
          var o = n.memoizedState;
          if (r = o.element, u.isDehydrated) {
            if (u = {
              element: r,
              isDehydrated: !1,
              cache: o.cache,
              pendingSuspenseBoundaries: o.pendingSuspenseBoundaries,
              transitions: o.transitions
            }, n.updateQueue.baseState = u, n.memoizedState = u, n.flags & 256) {
              l = _t(Error(S(423)), n), n = Sc(e, n, r, t, l);
              break e;
            } else if (r !== l) {
              l = _t(Error(S(424)), n), n = Sc(e, n, r, t, l);
              break e;
            } else for (Re = Tn(n.stateNode.containerInfo.firstChild), Ue = n, X = !0, Ge = null, t = Qf(n, null, r, t), n.child = t; t;) t.flags = t.flags & -3 | 4096, t = t.sibling;
          } else {
            if (Ut(), r === l) {
              n = sn(e, n, t);
              break e;
            }
            ke(e, n, r, t);
          }
          n = n.child;
        }
        return n;
      case 5:
        return Mf(n), e === null && Fo(n), r = n.type, l = n.pendingProps, u = e !== null ? e.memoizedProps : null, o = l.children, Do(r, l) ? o = null : u !== null && Do(r, u) && (n.flags |= 32), cs(e, n), ke(e, n, o, t), n.child;
      case 6:
        return e === null && Fo(n), null;
      case 13:
        return ss(e, n, t);
      case 4:
        return Oi(n, n.stateNode.containerInfo), r = n.pendingProps, e === null ? n.child = Lt(n, null, r, t) : ke(e, n, r, t), n.child;
      case 11:
        return r = n.type, l = n.pendingProps, l = n.elementType === r ? l : Xe(r, l), hc(e, n, r, l, t);
      case 7:
        return ke(e, n, n.pendingProps, t), n.child;
      case 8:
        return ke(e, n, n.pendingProps.children, t), n.child;
      case 12:
        return ke(e, n, n.pendingProps.children, t), n.child;
      case 10:
        e: {
          if (r = n.type._context, l = n.pendingProps, u = n.memoizedProps, o = l.value, D(Gl, r._currentValue), r._currentValue = o, u !== null) if (qe(u.value, o)) {
            if (u.children === l.children && !Ce.current) {
              n = sn(e, n, t);
              break e;
            }
          } else for (u = n.child, u !== null && (u.return = n); u !== null;) {
            var c = u.dependencies;
            if (c !== null) {
              o = u.child;
              for (var s = c.firstContext; s !== null;) {
                if (s.context === r) {
                  if (u.tag === 1) {
                    s = on(-1, t & -t), s.tag = 2;
                    var d = u.updateQueue;
                    if (d !== null) {
                      d = d.shared;
                      var m = d.pending;
                      m === null ? s.next = s : (s.next = m.next, m.next = s), d.pending = s;
                    }
                  }
                  u.lanes |= t, s = u.alternate, s !== null && (s.lanes |= t), Go(u.return, t, n), c.lanes |= t;
                  break;
                }
                s = s.next;
              }
            } else if (u.tag === 10) o = u.type === n.type ? null : u.child;else if (u.tag === 18) {
              if (o = u.return, o === null) throw Error(S(341));
              o.lanes |= t, c = o.alternate, c !== null && (c.lanes |= t), Go(o, t, n), o = u.sibling;
            } else o = u.child;
            if (o !== null) o.return = u;else for (o = u; o !== null;) {
              if (o === n) {
                o = null;
                break;
              }
              if (u = o.sibling, u !== null) {
                u.return = o.return, o = u;
                break;
              }
              o = o.return;
            }
            u = o;
          }
          ke(e, n, l.children, t), n = n.child;
        }
        return n;
      case 9:
        return l = n.type, r = n.pendingProps.children, zt(n, t), l = Me(l), r = r(l), n.flags |= 1, ke(e, n, r, t), n.child;
      case 14:
        return r = n.type, l = Xe(r, n.pendingProps), l = Xe(r.type, l), gc(e, n, r, l, t);
      case 15:
        return is(e, n, n.type, n.pendingProps, t);
      case 17:
        return r = n.type, l = n.pendingProps, l = n.elementType === r ? l : Xe(r, l), Tl(e, n), n.tag = 1, ze(r) ? (e = !0, Kl(n)) : e = !1, zt(n, t), ls(n, r, l), Jo(n, r, l, t), $o(null, n, r, !0, e, t);
      case 19:
        return As(e, n, t);
      case 22:
        return as(e, n, t);
    }
    throw Error(S(156, n.tag));
  };
  Ls = typeof reportError === "function" ? reportError : function (e) {
    console.error(e);
  };
  pu.prototype.render = $i.prototype.render = function (e) {
    var n = this._internalRoot;
    if (n === null) throw Error(S(409));
    du(e, n, null, null);
  };
  pu.prototype.unmount = $i.prototype.unmount = function () {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var n = e.containerInfo;
      nt(function () {
        du(null, e, null, null);
      }), n[cn] = null;
    }
  };
  pu.prototype.unstable_scheduleHydration = function (e) {
    if (e) {
      var n = af();
      e = {
        blockedOn: null,
        target: e,
        priority: n
      };
      for (var t = 0; t < Sn.length && n !== 0 && n < Sn[t].priority; t++);
      Sn.splice(t, 0, e), t === 0 && ff(e);
    }
  };
  uf = function (e) {
    switch (e.tag) {
      case 3:
        var n = e.stateNode;
        if (n.current.memoizedState.isDehydrated) {
          var t = lr(n.pendingLanes);
          t !== 0 && (yi(n, t | 1), Ne(n, $()), (I & 6) === 0 && (Bt = $() + 500, Wn()));
        }
        break;
      case 13:
        nt(function () {
          var r = fn(e, 1);
          if (r !== null) {
            var l = Se();
            Je(r, e, 1, l);
          }
        }), Hi(e, 1);
    }
  };
  mi = function (e) {
    if (e.tag === 13) {
      var n = fn(e, 134217728);
      if (n !== null) {
        var t = Se();
        Je(n, e, 134217728, t);
      }
      Hi(e, 134217728);
    }
  };
  of = function (e) {
    if (e.tag === 13) {
      var n = Ln(e),
        t = fn(e, n);
      if (t !== null) {
        var r = Se();
        Je(t, e, n, r);
      }
      Hi(e, n);
    }
  };
  af = function () {
    return W;
  };
  cf = function (e, n) {
    var t = W;
    try {
      return W = e, n();
    } finally {
      W = t;
    }
  };
  No = function (e, n, t) {
    switch (n) {
      case "input":
        if (ko(e, t), n = t.name, t.type === "radio" && n != null) {
          for (t = e; t.parentNode;) t = t.parentNode;
          t = t.querySelectorAll("input[name=" + JSON.stringify("" + n) + '][type="radio"]');
          for (n = 0; n < t.length; n++) {
            var r = t[n];
            if (r !== e && r.form === e.form) {
              var l = ou(r);
              if (!l) throw Error(S(90));
              Dc(r), ko(r, l);
            }
          }
        }
        break;
      case "textarea":
        Zc(e, t);
        break;
      case "select":
        n = t.value, n != null && wt(e, !!t.multiple, n, !1);
    }
  };
  qc = Fi;
  Hc = nt;
  Qv = {
    usingClientEntryPoint: !1,
    Events: [Mr, vt, ou, Yc, Jc, Fi]
  }, nr = {
    findFiberByHostInstance: Yn,
    bundleType: 0,
    version: "18.3.1",
    rendererPackageName: "react-dom"
  }, Iv = {
    bundleType: nr.bundleType,
    version: nr.version,
    rendererPackageName: nr.rendererPackageName,
    rendererConfig: nr.rendererConfig,
    overrideHookState: null,
    overrideHookStateDeletePath: null,
    overrideHookStateRenamePath: null,
    overrideProps: null,
    overridePropsDeletePath: null,
    overridePropsRenamePath: null,
    setErrorHandler: null,
    setSuspenseHandler: null,
    scheduleUpdate: null,
    currentDispatcherRef: An.ReactCurrentDispatcher,
    findHostInstanceByFiber: function (e) {
      return e = jc(e), e === null ? null : e.stateNode;
    },
    findFiberByHostInstance: nr.findFiberByHostInstance || _v,
    findHostInstancesForRefresh: null,
    scheduleRefresh: null,
    scheduleRoot: null,
    setRefreshHandler: null,
    getCurrentFiber: null,
    reconcilerVersion: "18.3.1-next-f1338f8080-20240426"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    if (ct = __REACT_DEVTOOLS_GLOBAL_HOOK__, !ct.isDisabled && ct.supportsFiber) try {
      tu = ct.inject(Iv), en = ct;
    } catch (e) {}
  }
  Os = Qv, Zs = Fi;
});
var Js = Hr((jv, Ys) => {
  Fs();
  function Gs() {
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") return;
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Gs);
    } catch (e) {
      console.error(e);
    }
  }
  Gs(), Ys.exports = ji;
});
var qs = Hr(Mv => {
  var Vr = Zn(Js(), 1);
  Mv.createRoot = Vr.createRoot, Mv.hydrateRoot = Vr.hydrateRoot;
  var Wv;
});
var bs = Zn(Gt(), 1),
  eA = Zn(qs(), 1);
var U = Zn(Gt(), 1);
var lt = "/icons/logo.webp";
var Hs = Zn(Gt(), 1),
  Dv = Symbol.for("react.element");
var Vv = Object.prototype.hasOwnProperty,
  Zv = Hs.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
  Kv = {
    key: !0,
    ref: !0,
    __self: !0,
    __source: !0
  };
function $s(e, n, t) {
  var r,
    l = {},
    u = null,
    o = null;
  t !== void 0 && (u = "" + t), n.key !== void 0 && (u = "" + n.key), n.ref !== void 0 && (o = n.ref);
  for (r in n) Vv.call(n, r) && !Kv.hasOwnProperty(r) && (l[r] = n[r]);
  if (e && e.defaultProps) for (r in n = e.defaultProps, n) l[r] === void 0 && (l[r] = n[r]);
  return {
    $$typeof: Dv,
    type: e,
    key: u,
    ref: o,
    props: l,
    _owner: Zv.current
  };
}
const MHS_ENTRY_TYPES = {
  checkIn: ["Check-in", "تسجيل إنجاز"],
  manualReward: ["Reward", "مكافأة"],
  manualPenalty: ["Penalty", "خصم"],
  penalty: ["Auto penalty", "خصم تلقائي"],
  autoPenalty: ["Auto penalty", "خصم تلقائي"],
  excuse: ["Excused", "معذور"],
  todoCheckIn: ["Todo Done", "إنجاز مهمة"],
  todoPenalty: ["Todo Missed", "خصم مهمة"]
};
function mhsEntryTypeLabel(type, lang) {
  const known = MHS_ENTRY_TYPES[type];
  if (known) return lang === "ar" ? known[1] : known[0];
  return String(type || "").replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, c => c.toUpperCase());
}
function localizedElement(type, props, key) {
  if (window.MHSLocale === "bn" && props) {
    props = {...props};
    const tr = value => {
      if (typeof value === "number") return value.toLocaleString("bn-BD");
      if (typeof value !== "string") return value;
      if (window.MHSBengali[value]) return window.MHSBengali[value];
      if (/^[\d:.,+%−\- ]+$/.test(value)) return value.replace(/\d/g, digit => "০১২৩৪৫৬৭৮৯"[digit]);
      return value;
    };
    if (Array.isArray(props.children)) props.children = props.children.map(tr);
    else props.children = tr(props.children);
    for (const name of ["placeholder", "aria-label", "title"]) if (props[name]) props[name] = tr(props[name]);
  }
  return $s(type, props, key);
}
var i = localizedElement, f = localizedElement;
var KEY = "muhasabah:data:v1",
  S0 = await (window.MHS ? window.MHS.load() : Promise.resolve(null)).then(function (r) {
    return r && typeof r === "object" ? r : function () {
      try {
        var r = JSON.parse(localStorage.getItem(KEY));
        return r && typeof r === "object" ? r : {};
      } catch (e) {
        return {};
      }
    }();
  });
var xs = {
    en: {
      liveAudit: "Live audit",
      dashboard: "Dashboard",
      executionWindow: "Execution window",
      todayChecklist: "Today's checklist",
      engineRoom: "Engine room",
      controlPanel: "Control panel",
      auditTrail: "Audit trail",
      ledger: "Ledger",
      backupData: "Backup & Data",
      backupTitle: "Data Backup",
      backupSubtitle: "Your data stays on your device. Export to backup, import to restore.",
      openChecklist: "Open today's checklist",
      netBalance: "Net point balance",
      trending: "Trending up",
      streak: "Streak",
      habits: "Habits",
      trades: "Trades",
      pointFlow: "Point flow",
      tapCandle: "Tap any candle to inspect trades behind it",
      daily: "Daily",
      weekly: "Weekly",
      monthly: "Monthly",
      lod: "LOD",
      line: "LINE",
      candle: "CANDLE",
      bullish: "Bullish",
      bearish: "Bearish",
      addReward: "Add reward",
      deductPenalty: "Deduct penalty",
      creditWin: "Credit an unexpected win...",
      debitLoss: "Debit a slip or distraction...",
      yourEngineEmpty: "Your engine room is empty",
      createFirst: "Create your first recurring habit",
      buildHabit: "Build a habit",
      recentTrades: "Recent 5 entries",
      timeline24h: "24h timeline",
      nothingScheduled: "Nothing scheduled for today",
      addHabitHint: "Add a habit to start your execution window",
      goToHabits: "Go to habits",
      pending: "Pending",
      banked: "Banked",
      missed: "Missed",
      everyReward: "Every habit carries its own reward, penalty and deadline",
      createNew: "Create new habit",
      active: "Active",
      paused: "Paused",
      archived: "Archived",
      all: "All",
      gains: "Gains",
      losses: "Losses",
      everyRewardLedger: "Every reward, penalty and check-in, newest first",
      entries: "Entries",
      netPoints: "Net points",
      searchLedger: "Search reason, note...",
      nothingLogged: "Nothing logged here yet",
      checkInHint: "Check in from today checklist or log a manual reward — it lands here with a timestamp.",
      exportData: "Export Data",
      exportSubtitle: "Download all your habits, ledger, and settings as JSON",
      importData: "Import Data",
      importSubtitle: "Restore from a previous export file",
      exportNow: "Export Now",
      importFile: "Import File",
      clearAll: "Clear all data",
      premiumLifetime: "Premium Lifetime $14.99",
      oneTime: "One-time • Lifetime Premium unlock",
      privacyNote: "Serverless • No Backend • Data on Device • No AI anywhere",
      languages: "Languages",
      islamicTime: "Islamic Time Conscious",
      fardLock: "Fard / Farz فرض cannot be deleted",
      productiveBlocks: "Productive blocks",
      hadith: "Life is the sum of time — if you don’t use it properly, it’ll destroy you.",
      dash: "Dash",
      today: "Today",
      backup: "Backup",
      noHabitsYet: "No {status} habits yet",
      defineHabitHint: "Define a habit, weight it with points...",
      noTrades: "No trades logged in this window. Add a reward or let a habit settle to plot your first candle"
    },
    ar: {
      liveAudit: "التدقيق المباشر",
      dashboard: "لوحة القيادة",
      executionWindow: "نافذة التنفيذ",
      todayChecklist: "قائمة اليوم",
      engineRoom: "غرفة المحرك",
      controlPanel: "لوحة التحكم",
      auditTrail: "سجل التدقيق",
      ledger: "السجل",
      backupData: "النسخ الاحتياطي والبيانات",
      backupTitle: "نسخ البيانات",
      backupSubtitle: "بياناتك تبقى على جهازك. صدّر للنسخ الاحتياطي واستورد للاستعادة.",
      openChecklist: "افتح قائمة اليوم",
      netBalance: "صافي النقاط",
      trending: "في ارتفاع",
      streak: "سلسلة",
      habits: "العادات",
      trades: "الصفقات",
      pointFlow: "تدفق النقاط",
      tapCandle: "اضغط على أي شمعة لفحص الصفقات",
      daily: "يومي",
      weekly: "أسبوعي",
      monthly: "شهري",
      lod: "حركات كبرى",
      line: "خط",
      candle: "شموع",
      bullish: "صاعد",
      bearish: "هابط",
      addReward: "إضافة مكافأة",
      deductPenalty: "خصم عقوبة",
      creditWin: "سجل فوزًا غير متوقع...",
      debitLoss: "سجل هفوة أو تشتيت...",
      yourEngineEmpty: "غرفة المحرك فارغة",
      createFirst: "أنشئ أول عادة متكررة",
      buildHabit: "ابنِ عادة",
      recentTrades: "آخر 5 إدخالات",
      timeline24h: "الجدول 24 ساعة",
      nothingScheduled: "لا شيء مجدول اليوم",
      addHabitHint: "أضف عادة لبدء نافذة التنفيذ",
      goToHabits: "اذهب للعادات",
      pending: "معلق",
      banked: "مكتسب",
      missed: "مفقود",
      everyReward: "كل عادة لها مكافأتها وعقوبتها وموعدها",
      createNew: "عادة جديدة",
      active: "نشط",
      paused: "متوقف",
      archived: "مؤرشف",
      all: "الكل",
      gains: "أرباح",
      losses: "خسائر",
      everyRewardLedger: "كل مكافأة وعقوبة وتسجيل، الأحدث أولاً",
      entries: "الإدخالات",
      netPoints: "صافي النقاط",
      searchLedger: "ابحث في السبب، الملاحظة...",
      nothingLogged: "لا شيء مسجل هنا بعد",
      checkInHint: "سجل من قائمة اليوم أو سجل مكافأة يدوية — تظهر هنا مع طابع زمني.",
      exportData: "تصدير البيانات",
      exportSubtitle: "حمّل كل عاداتك وسجلك كـ JSON",
      importData: "استيراد البيانات",
      importSubtitle: "استعادة من ملف تصدير سابق",
      exportNow: "صدّر الآن",
      importFile: "استيراد ملف",
      clearAll: "مسح كل البيانات",
      premiumLifetime: "بريميوم مدى الحياة $14.99",
      oneTime: "دفع مرة واحدة • فتح مميز مدى الحياة",
      privacyNote: "بدون خادم • بدون تتبع • البيانات على الجهاز • بلا ذكاء اصطناعي",
      languages: "اللغات",
      islamicTime: "الوعي بالوقت الإسلامي",
      fardLock: "الفرض لا يمكن حذفه",
      productiveBlocks: "الفترات المنتجة",
      hadith: "الحياة مجموع الوقت — إن لم تستخدمه جيداً فسيدمرك.",
      dash: "لوحة",
      today: "اليوم",
      backup: "نسخ",
      noHabitsYet: "لا توجد عادات {status} بعد",
      defineHabitHint: "حدد عادة، ووزنها بالنقاط...",
      noTrades: "لا توجد صفقات في هذه النافذة. أضف مكافأة أو دع عادة تستقر لرسم أول شمعة"
    }
  },
  ea = Array.isArray(S0.habits) ? S0.habits : [],
  Fv = Array.isArray(S0.ledger) ? S0.ledger : [],
  Mn = e => e.toTimeString().slice(0, 8),
  mu = (e, n) => e.toLocaleDateString(n === "ar" ? "ar-EG" : n === "bn" ? "bn-BD" : "en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  }),
  bi = () => {
    try {
      return new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(new Date());
    } catch {
      return "24 Rajab 1447 هـ";
    }
  },
  Zr = [],
  Gv = ["Fajr Routine", "Dhuhr Guard", "Asr Dhikr", "Maghrib Family", "Isha Witr", "Tahajjud 04:00", "Quran 1 page", "Adhkar Morning", "Adhkar Evening", "Sadaqah Daily", "Water 2L", "No Social 2h", "Deep Work 90m", "Exercise 30m", "Learn Arabic 20m", "Gratitude Journal", "Silat Rahim call", "Early Sleep 22:00", "Sunnah Fast Mon", "Sunnah Fast Thu"],
  Yv = ["\uD83C\uDF19", "☀️", "\uD83D\uDD4C", "\uD83C\uDF07", "✨", "\uD83D\uDCD6", "\uD83C\uDFAF", "\uD83D\uDCA7", "\uD83D\uDD25", "\uD83C\uDF31", "\uD83D\uDCDA", "\uD83D\uDD4B", "\uD83E\uDD32", "⚡️", "\uD83E\uDDE0", "❤️", "\uD83C\uDF1F", "\uD83C\uDFC3", "\uD83E\uDDD8", "\uD83D\uDCA1", "\uD83C\uDF81", "\uD83D\uDEE1️", "⏰", "\uD83D\uDD14", "\uD83D\uDCFF", "\uD83C\uDF3F", "\uD83C\uDF43", "\uD83D\uDC8E", "\uD83D\uDD11", "\uD83D\uDE80", "\uD83C\uDF08", "\uD83D\uDCCC", "\uD83E\uDE9E", "⚖️", "\uD83E\uDDED", "\uD83D\uDD06", "\uD83C\uDF38", "\uD83C\uDF0A", "\uD83C\uDF40", "\uD83C\uDFAF", "\uD83D\uDCC8", "\uD83D\uDCAA", "\uD83D\uDE4F", "\uD83D\uDD6F️", "\uD83D\uDD0B", "\uD83C\uDF1E", "\uD83C\uDF1C", "\uD83E\uDEB4", "\uD83E\uDDE9", "\uD83D\uDCDD"],
  Jv = ["#00C853", "#FF3B30", "#0A84FF", "#FF9500", "#AF52DE", "#FFCC02", "#5E5CE6", "#00C7BE", "#FF375F", "#30D158", "#BF5AF2", "#FF9F0A"];
function LiveClock({
  fmt: e
}) {
  let [t, r] = U.useState(() => new Date());
  U.useEffect(() => {
    let M = () => {
        if (!document.hidden) r(new Date());
      },
      C = setInterval(M, 1000);
    document.addEventListener("visibilitychange", M);
    return () => {
      clearInterval(C);
      document.removeEventListener("visibilitychange", M);
    };
  }, []);
  return e === "l" ? t.toLocaleTimeString() : Mn(t);
}
function mhsDl(b, ref) {
  let n = ref ? new Date(ref) : new Date(),
    pz = window.MHSPrayer && window.MHSPrayer.dl(b, n);
  if (pz) return pz + Math.max(0, Number(b && b.grace) || 0) * 60000;
  let p = String(b && b.deadline || "00:00:00").split(":").map(x => parseInt(x, 10) || 0);
  return new Date(n.getFullYear(), n.getMonth(), n.getDate(), p[0] || 0, p[1] || 0, p[2] || 0, 0).getTime() + Math.max(0, Number(b && b.grace) || 0) * 60000;
}
function mhsT(b, full) {
  let x = window.MHSPrayer && window.MHSPrayer.dl(b),
    v = b && b.deadline || "";
  if (x) {
    let d = new Date(x);
    v = [d.getHours(), d.getMinutes(), d.getSeconds()].map(q => String(q).padStart(2, "0")).join(":");
  }
  return full ? v : v.slice(0, 5);
}
function mhsLeft(b) {
  let d = mhsDl(b) - Date.now();
  return d > 0 ? d : d + 864e5;
}
function js({
  deadline: e,
  compact: n
}) {
  let [t, r] = U.useState(() => new Date());
  U.useEffect(() => {
    let C,
      M = () => {
        if (document.hidden) return;
        r(new Date());
      };
    C = window.setInterval(M, 1000);
    let p = () => {
      if (!document.hidden) M();
    };
    return document.addEventListener("visibilitychange", p), () => {
      if (C) clearInterval(C);
      document.removeEventListener("visibilitychange", p);
    };
  }, []);
  let [l, u, o = 0] = e.split(":").map(Number),
    c = new Date(t);
  if (c.setHours(l, u, o, 0), c.getTime() < t.getTime()) c.setDate(c.getDate() + 1);
  let s = Math.max(0, c.getTime() - t.getTime()),
    d = Math.floor(s / 3600000),
    m = Math.floor(s % 3600000 / 60000),
    g = Math.floor(s % 60000 / 1000),
    y = s < 600000,
    E = s < 3600000;
  return f("span", {
    className: `num tabular-nums ${y ? "text-[#FF3B30] animate-[pulse-amber_1s_ease-in-out_infinite]" : E ? "text-[#FFCC02]" : "text-foreground"} ${n ? "text-[11px]" : "text-xs font-medium"}`,
    children: [String(d).padStart(2, "0"), "h ", String(m).padStart(2, "0"), "m ", String(g).padStart(2, "0"), "s"]
  });
}
xs.bn = Object.fromEntries(Object.entries(xs.en).map(([key,value]) => [key, window.MHSBengali[value] || value]));
function MhsFlowChart({ data, mode, zoom, ma7, ma30, inspect, empty, lang }) {
  const [width, setWidth] = U.useState(600), ref = U.useRef(null);
  U.useEffect(() => {
    const observer = new ResizeObserver(entries => setWidth(Math.max(280, entries[0].contentRect.width)));
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  const count = Math.max(1, Math.ceil(24 / zoom)), offset = Math.max(0, data.length - count), visible = data.slice(offset);
  const averages = size => visible.map((p, j) => window.MHSFlow.average(data, offset + j, size));
  const av7 = averages(7), av30 = averages(30);
  const values = visible.flatMap(p => [p.low, p.high]).concat(ma7 ? av7.filter(v => v !== null) : [], ma30 ? av30.filter(v => v !== null) : []);
  const low = Math.min(...values, 0), high = Math.max(...values, 0), pad = (high - low) * .12 || 10;
  const min = low - pad, max = high + pad;
  const plot = width - 80, step = plot / Math.max(1, visible.length);
  const x = j => 58 + step * (j + .5), y = v => 18 + (max - v) / (max - min) * 200;
  const path = values => values.map((v, j) => v === null ? '' : `${j === 0 || values[j - 1] === null ? 'M' : 'L'} ${x(j)} ${y(v)}`).join(' ');
  const caption = lang === 'bn' ? 'সাম্প্রতিক সময়কাল · বিস্তারিত দেখতে পয়েন্টে চাপুন' : lang === 'ar' ? 'الفترات الأخيرة • اضغط لعرض التفاصيل' : 'Recent periods • Select a point for details';
  return f('div', { ref, className: 'mhs-flow', children: [
    visible.length ? f('svg', { viewBox: `0 0 ${width} 280`, 'aria-label': lang === 'bn' ? 'পয়েন্টের প্রবাহ' : 'Point flow', children: [
      [0,1,2,3,4].map(j => { const v = max - (max - min) * j / 4; return f('g', { children: [
        i('line', { x1: 52, x2: width - 12, y1: y(v), y2: y(v), stroke: 'hsl(var(--border))', strokeDasharray: '4 4' }),
        i('text', { x: 46, y: y(v) + 4, textAnchor: 'end', fill: 'hsl(var(--muted-foreground))', fontSize: 10, children: Math.round(v) })
      ] }, j); }),
      i('line', { x1: 52, x2: width - 12, y1: y(0), y2: y(0), stroke: 'hsl(var(--muted-foreground))', opacity: .5 }),
      mode === 'line' && i('path', { 'data-flow-line': true, d: path(visible.map(p => p.close)), fill: 'none', stroke: 'hsl(var(--primary))', strokeWidth: 2 }),
      [[ma7, av7, '#b58127', 'MA7'], [ma30, av30, '#528fd1', 'MA30']].map(([on, values, color, name]) => on && i('path', { 'data-average': name, d: path(values), fill: 'none', stroke: color, strokeWidth: 2, strokeDasharray: '5 3' }, name)),
      visible.map((p, j) => { const color = p.close >= p.open ? 'hsl(var(--primary))' : '#ed5148', body = Math.min(18, step * .55);
        return f('g', { children: [
          mode === 'candle' ? f('g', { children: [i('line', { x1: x(j), x2: x(j), y1: y(p.high), y2: y(p.low), stroke: color, strokeWidth: 1.5 }), i('rect', { x: x(j) - body / 2, y: Math.min(y(p.open), y(p.close)), width: body, height: Math.max(2, Math.abs(y(p.open) - y(p.close))), fill: color, rx: 2 })] }) : i('circle', { cx: x(j), cy: y(p.close), r: 4, fill: color }),
          i('rect', { x: x(j) - step / 2, y: 10, width: step, height: 226, fill: 'transparent', tabIndex: 0, role: 'button', 'aria-label': `${p.date}: ${p.close}`, onClick: () => inspect(p), onKeyDown: ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); inspect(p); } }, children: i('title', { children: `${p.date} • ${p.open} → ${p.close} • ${p.trades.length}` }) }),
          j % Math.max(1, Math.ceil(visible.length / Math.max(2, Math.floor(width / 90)))) === 0 && i('text', { x: x(j), y: 254, textAnchor: 'middle', fontSize: 10, fill: 'hsl(var(--muted-foreground))', children: p.date.slice(5) })
        ] }, p.key);
      })
    ] }) : i('p', { className: 'mhs-flow-empty', children: empty }),
    visible.length > 0 && i('p', { className: 'mhs-flow-caption', children: `${visible.length}/${data.length} · ${caption}${ma7 || ma30 ? (lang === 'bn' ? ' · MA আঁকতে ৭/৩০টি সময়কাল প্রয়োজন' : ' · MA needs 7/30 periods') : ''}` })
  ] });
}

function MhsPreferences({ lang, setLanguage }) {
  const [theme, setTheme] = U.useState(() => window.MHSTheme?.get() || 'dark'), [status, setStatus] = U.useState('loading');
  const [revision, retry] = U.useState(0);
  const latest = U.useRef({ lang, theme }); latest.current = { lang, theme };
  const text = lang === 'bn' ? { title: 'অ্যাপের পছন্দ', language: 'ভাষা', theme: 'থিম', dark: 'ডার্ক', light: 'লাইট', system: 'ডিভাইস অনুযায়ী', loading: 'সেটিংস লোড হচ্ছে…', saving: 'সংরক্ষণ হচ্ছে…', saved: 'সংরক্ষিত', error: 'সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।', retry: 'আবার চেষ্টা করুন' } : lang === 'ar' ? { title: 'تفضيلات التطبيق', language: 'اللغة', theme: 'المظهر', dark: 'داكن', light: 'فاتح', system: 'حسب الجهاز', loading: 'جارٍ التحميل…', saving: 'جارٍ الحفظ…', saved: 'تم الحفظ', error: 'تعذر الحفظ. أعد المحاولة.', retry: 'إعادة المحاولة' } : { title: 'App preferences', language: 'Language', theme: 'Theme', dark: 'Dark', light: 'Light', system: 'Use device setting', loading: 'Loading settings…', saving: 'Saving…', saved: 'Saved', error: 'Could not save. Please retry.', retry: 'Retry' };
  U.useEffect(() => {
    let active = true;
    fetch('/.netlify/functions/preferences').then(res => { if (!res.ok) throw Error(); return res.json(); }).then(value => {
      if (!active) return;
      if (value) { setLanguage(value.language); setTheme(value.theme); }
      setStatus('ready');
    }).catch(() => { if (active) setStatus('loadError'); });
    return () => { active = false; };
  }, [revision]);
  U.useEffect(() => { window.MHSTheme?.set(theme); }, [theme]);
  // Keep the selected theme active after navigating away from Settings.
  const save = (language, value) => {
    window.dispatchEvent(new Event('mhs:theme-edit'));
    setLanguage(language); setTheme(value); setStatus('saving');
    fetch('/.netlify/functions/preferences', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ language, theme: value }) })
      .then(res => { if (!res.ok) throw Error(); setStatus('saved'); }).catch(() => setStatus('error'));
  };
  const disabled = status === 'loading' || status === 'saving';
  return f('section', { className: 'panel mhs-preferences', children: [
    i('h2', { children: text.title }),
    f('div', { className: 'mhs-preference-grid', children: [
      f('label', { children: [text.language, i('select', { 'aria-label': text.language, value: lang, disabled, onChange: ev => save(ev.target.value, theme), children: [['en','English'],['bn','বাংলা'],['ar','العربية']].map(([value,label]) => i('option', { value, children: label }, value)) })] }),
      f('label', { children: [text.theme, i('select', { 'aria-label': text.theme, value: theme, disabled, onChange: ev => save(lang, ev.target.value), children: ['dark','light','system'].map(value => i('option', { value, children: text[value] }, value)) })] })
    ] }),
    i('p', { role: 'status', children: status === 'loadError' ? (lang === 'bn' ? 'সেটিংস লোড করা যায়নি। আবার চেষ্টা করুন।' : 'Could not load settings. Please retry.') : text[status] || '' }),
    ['error','loadError'].includes(status) && i('button', { type: 'button', onClick: () => status === 'loadError' ? (setStatus('loading'), retry(v => v + 1)) : save(latest.current.lang, latest.current.theme), children: text.retry })
  ] });
}

function na() {
  let [e, n] = U.useState(() => {
      try {
        let q = new URLSearchParams(location.search).get("tab");
        return ["dashboard", "today", "habits", "ledger", "settings"].includes(q) ? q : "dashboard";
      } catch (x) {
        return "dashboard";
      }
    }),
    [t, r] = U.useState(["en", "ar", "bn"].includes(S0.lang) ? S0.lang : "en"),
    l = (window.MHSLocale = t),
    u = xs[l] || xs.en,
    [o, c] = U.useState(ea),
    [s, d] = U.useState(Fv),
    [tw, twS] = U.useState(Array.isArray(S0.todos) ? S0.todos.filter(x => x && x.id) : []),
    [m, g] = U.useState("active"),
    [y, E] = U.useState("all"),
    [P, C] = U.useState(""),
    [M, p] = U.useState(""),
    [A, v] = U.useState("daily"),
    [k, N] = U.useState("candle"),
    [T, R] = U.useState(!1),
    [O, x] = U.useState(!1),
    [Q, Ve] = U.useState(1),
    [Oe, ta] = U.useState(null),
    [hu, gu] = U.useState(!1),
    [ku, Su] = U.useState(!1),
    [wu, Kr] = U.useState(!1),
    [Wt, ra] = U.useState(null),
    [ce, Mt] = U.useState({
      title: "",
      points: 25,
      note: ""
    }),
    [fe, Dt] = U.useState({
      title: "",
      points: 20,
      note: ""
    }),
    [_, se] = U.useState({
      title: "",
      category: "Nafl",
      points: 25,
      deadline: "05:00:00",
      repeat: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      grace: 10,
      autoPenalty: !0,
      icon: "\uD83C\uDF19",
      color: "#00C853",
      focus: "Quran daily"
    }),
    [Eu, nA] = U.useState(!0),
    [Xr, tA] = U.useState(() => new Set(Fv.filter(x => x.type === "checkIn" && new Date(x.ts).toDateString() === new Date().toDateString()).map(x => x.habitId))),
    [rA, la] = U.useState([]),
    [lA, He] = U.useState(!1),
    [uA, oA] = U.useState(!1),
    [dn, ua] = U.useState(() => new Date()),
    [Dn, Fr] = U.useState(null),
    [q, Vt] = U.useState({
      reason: "",
      delta: 0,
      note: "",
      type: "manualReward"
    }),
    [twM, twMf] = U.useState(!1),
    [twFl, twFlS] = U.useState("all"),
    [twQ, twQS] = U.useState(""),
    [twDc, twDcS] = U.useState(null),
    [twF, twFs] = U.useState({
      title: "",
      points: 10,
      penalty: 5,
      deadline: "23:59:00",
      icon: "📌"
    }),
    [twE, twEw] = U.useState(null),
    [Pu, ut] = U.useState(!1),
    [Zt, Cu] = U.useState(null),
    [pn, zu] = U.useState(null),
    [cf, setCf] = U.useState(!1),
    [Gr, vn] = U.useState(null),
    scrollMem = U.useRef({}),
    scrollTab = U.useRef(e),
    qv = a => {
      if (a === e) {
        window.scrollTo({
          top: 0,
          behavior: "auto"
        }), vn(`Already on ${a} • ${new Date().toLocaleTimeString()}`), ua(new Date());
        return;
      }
      scrollMem.current[e] = window.scrollY;
      history.pushState({mhs:true, tab:a}, "", "?tab=" + a), n(a);
    };
  // Each tab remembers its own scroll position; a tab never visited before opens at the top.
  U.useEffect(() => {
    try { history.scrollRestoration = "manual"; } catch (_) {}
    const onScroll = () => { scrollMem.current[scrollTab.current] = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  U.useLayoutEffect(() => {
    if (scrollTab.current === e) return;
    scrollTab.current = e;
    const target = scrollMem.current[e] || 0;
    window.scrollTo({ top: target, behavior: "instant" });
    scrollMem.current[e] = target;
    // Content can still be growing (lazy lists, fonts); keep retrying briefly until the saved spot is reachable.
    let tries = 0, raf = 0, user = false;
    const stop = () => { user = true; };
    const evs = ["wheel", "touchstart", "keydown", "pointerdown"];
    evs.forEach(n => window.addEventListener(n, stop, { passive: true, once: true }));
    const retry = () => {
      if (user || scrollTab.current !== e || Math.abs(window.scrollY - target) < 2 || ++tries > 20) return;
      window.scrollTo({ top: target, behavior: "instant" });
      scrollMem.current[e] = target;
      raf = requestAnimationFrame(retry);
    };
    raf = requestAnimationFrame(retry);
    return () => { cancelAnimationFrame(raf); evs.forEach(n => window.removeEventListener(n, stop)); };
  }, [e]);
  const modalOpen = !!(hu || ku || wu || Oe || Dn || Zt || pn || Eu || twM);
  const navRef = U.useRef({});
  navRef.current = { modalOpen, close: () => { gu(false); Su(false); Kr(false); ta(null); Fr(null); Cu(null); zu(null); twMf(false); nA(false); } };
  U.useEffect(() => {
    history.replaceState({mhs:true, tab:e}, "");
    const back = ev => {
      if (navRef.current.modalOpen) navRef.current.close();
      else n(ev.state?.tab || "dashboard");
    };
    window.addEventListener("popstate", back);
    return () => window.removeEventListener("popstate", back);
  }, []);
  U.useEffect(() => {
    // Keep the current history entry on the visible tab so closing a modal (history.back) returns here.
    if (!history.state?.modal) history.replaceState({...(history.state || {}), mhs:true, tab:e}, "");
  }, [e]);
  U.useEffect(() => {
    if (modalOpen) history.pushState({mhs:true, tab:e, modal:true}, "");
    else if (history.state?.modal) history.back();
  }, [modalOpen]);
  U.useEffect(() => {
    let a = setInterval(() => {
      if (document.hidden) return;
      ua(p => {
        let n = new Date();
        return n.getMinutes() === p.getMinutes() && n.getHours() === p.getHours() && n.getDate() === p.getDate() ? p : n;
      });
    }, 1000);
    return () => clearInterval(a);
  }, []), U.useEffect(() => {
    let a = setTimeout(() => p(P), 300);
    return () => clearTimeout(a);
  }, [P]), U.useEffect(() => {
    if (!Gr) return;
    let a = setTimeout(() => vn(null), 2800);
    return () => clearTimeout(a);
  }, [Gr]), U.useEffect(() => {
    try {
      let d = {
        habits: o,
        todos: tw,
        ledger: s,
        lang: t,
        onboarded: !Eu
      };
      window.MHS ? window.MHS.save(d) : localStorage.setItem(KEY, JSON.stringify(d));
    } catch (e) {}
  }, [o, tw, s, t, Eu]), U.useEffect(() => {
    tA(new Set(s.filter(x => x.type === "checkIn" && new Date(x.ts).toDateString() === dn.toDateString()).map(x => x.habitId)));
  }, [s, dn.toDateString()]), U.useEffect(() => {
    let run = () => {
      let now = new Date(),
        nowT = now.getTime(),
        DW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        add = [],
        SK = "muhasabah:penaltySince",
        t0 = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime(),
        since = 0;
      try {
        since = +localStorage.getItem(SK) || 0;
      } catch (e) {}
      if (!since || since > t0) {
        since = t0;
        try {
          localStorage.setItem(SK, String(t0));
        } catch (e) {}
      }
      add = window.MHSPenalties.reconcile(o, s, now, since, mhsDl);
      if (add.length) {
        d(x => {
          let cur = x || [];
          let n = window.MHSPenalties.reconcile(o, cur, now, since, mhsDl);
          return n.length ? [...n, ...cur].sort((a, b) => b.ts - a.ts) : cur;
        });
        let tot = add.reduce((q, a) => q + a.delta, 0);
        vn((l === "ar" ? "خصم تلقائي: " : l === "bn" ? "স্বয়ংক্রিয় কর্তন: " : "Auto-penalty: ") + tot + (add.length === 1 ? " • " + add[0].reason : " • " + add.length + (l === "ar" ? " مهام فائتة" : " missed")));
      }
      let tad = window.MHSPenalties.reconcileTodos(tw, s, now, since, mhsDl);
      if (tad.length) {
        d(x => {
          let cur = x || [];
          let n = window.MHSPenalties.reconcileTodos(tw, cur, now, since, mhsDl);
          return n.length ? [...n, ...cur].sort((a, b) => b.ts - a.ts) : cur;
        });
        let ttot = tad.reduce((q, a) => q + a.delta, 0);
        vn((l === "ar" ? "خصم تلقائي: " : l === "bn" ? "স্বয়ংক্রিয় কর্তন: " : "Auto-penalty: ") + ttot + (tad.length === 1 ? " • " + tad[0].reason : " • " + tad.length + (l === "ar" ? " مهام فائتة" : l === "bn" ? " টুডু বাকি ছিল" : " todos missed")));
      }
    };
    run();
    let iv = setInterval(() => { if (!document.hidden) run(); }, 15000);
    let onVis = () => {
      if (document.visibilityState === "visible") run();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(iv);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [o, tw, s]), U.useEffect(() => {
    let a = () => oA(!0);
    return window.addEventListener("click", a, {
      once: !0
    }), () => window.removeEventListener("click", a);
  }, []), U.useEffect(() => {
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr", document.documentElement.lang = l;
  }, [l]), U.useEffect(() => {
    try {
      let a = (h, w) => {
        let L = document.querySelector(`link[rel="${h}"]`);
        if (!L) L = document.createElement("link"), L.rel = h, document.head.appendChild(L);
        if (L.href = w, h === "icon") L.type = "image/png";
      };
      a("icon", "/icons/icon-192.png"), a("apple-touch-icon", "/icons/apple-touch-icon.png"), a("shortcut icon", "/icons/icon-192.png");
    } catch {}
  }, []);
  let Nu = U.useMemo(() => s.reduce((a, h) => a + h.delta, 0), [s]),
    oa = U.useMemo(() => s.filter(a => new Date(a.ts).toDateString() === new Date().toDateString()), [s]),
    iA = U.useMemo(() => oa.reduce((a, h) => a + h.delta, 0), [oa]),
    ia = U.useMemo(() => {
      let a = 0,
        h = new Date();
      for (let w = 0; w < 30; w++) {
        if (s.some(B => {
          return new Date(B.ts).toDateString() === h.toDateString() && (B.delta > 0 || B.type === "excuse" && !B.habitId);
        })) a++;else if (w > 0) break;
        h.setDate(h.getDate() - 1);
      }
      return a;
    }, [s]),
    Ae = U.useMemo(() => {
      return window.MHSFlow.periods(s, A);
    }, [s, A]),
    ne = U.useMemo(() => {
      if (Ae.length === 0) return {
        min: 0,
        max: 100
      };
      let a = Math.min(...Ae.map(L => L.low)),
        h = Math.max(...Ae.map(L => L.high)),
        w = (h - a) * 0.2 || 20;
      return {
        min: a - w,
        max: h + w
      };
    }, [Ae]),
    Tu = (a, h) => {
      let w = Date.now() + Math.random(),
        L = Math.random() * 60 - 30,
        B = Math.random() * 40 - 20;
      if (la(K => [...K, {
        id: w,
        x: L,
        y: B,
        text: a,
        color: h
      }]), setTimeout(() => la(K => K.filter(Jr => Jr.id !== w)), 1200), He(!0), setTimeout(() => He(!1), 1200), window.dispatchEvent(new CustomEvent("mhs:points", { detail: { text: a, color: h } })), uA && navigator.vibrate) navigator.vibrate(50);
    },
    aa = a => {
      if (Xr.has(a.id)) return;
      if (Ms.has(a.id) || Date.now() >= mhsDl(a)) {
        vn(l === "ar" ? "انتهى الموعد — تم خصم النقاط" : "Deadline passed — points were deducted");
        return;
      }
      {
        let ws = window.MHSPrayer && window.MHSPrayer.start(a);
        if (ws && Date.now() < ws) {
          vn((l === "ar" ? "لم يدخل الوقت بعد — يبدأ " : "Waqt hasn't started yet — starts at ") + window.MHSPrayer.hm(ws));
          return;
        }
      }
      tA(w => {
        let L = new Set(w);
        return L.add(a.id), L;
      });
      let h = {
        id: "l" + Date.now(),
        ts: Date.now(),
        delta: a.points,
        reason: a.title,
        note: `Exact • ${Mn(new Date())} • On-time`,
        type: "checkIn",
        habitId: a.id
      };
      d(w => [h, ...w]), Tu(`+${a.points}`, "#00C853");
    },
    aA = () => {
      if (ce.title.length < 2 || ce.note.length < 5) return;
      let a = {
        id: "l" + Date.now(),
        ts: Date.now(),
        delta: ce.points,
        reason: ce.title,
        note: ce.note,
        type: "manualReward"
      };
      d(h => [a, ...h]), gu(!1), Mt({
        title: "",
        points: 25,
        note: ""
      }), Tu(`+${a.delta}`, "#00C853");
    },
    cA = () => {
      if (fe.title.length < 2 || fe.note.length < 5) return;
      let a = {
        id: "l" + Date.now(),
        ts: Date.now(),
        delta: -Math.abs(fe.points),
        reason: fe.title,
        note: fe.note,
        type: "manualPenalty"
      };
      d(h => [a, ...h]), Su(!1), Dt({
        title: "",
        points: 20,
        note: ""
      }), Tu(`${a.delta}`, "#FF3B30");
    },
    Ms = U.useMemo(() => new Set(s.filter(x => x.type === "autoPenalty" && new Date(x.ts).toDateString() === dn.toDateString()).map(x => x.habitId)), [s, dn.toDateString()]),
    xD = U.useMemo(() => s.some(x => x.type === "excuse" && !x.habitId && !x.todoId && new Date(x.ts).toDateString() === dn.toDateString()), [s, dn.toDateString()]),
    xS = U.useMemo(() => new Set(s.filter(x => x.type === "excuse" && x.habitId && new Date(x.ts).toDateString() === dn.toDateString()).map(x => x.habitId)), [s, dn.toDateString()]),
    isX = id => xD || xS.has(id),
    xU = e => {
      if (!e || e.type !== "autoPenalty") return;
      d(w => w.map(h => h.id === e.id ? {
        ...h,
        type: "excuse",
        origDelta: h.delta,
        delta: 0,
        note: "Penalty refunded • excused",
        audit: "excused"
      } : h));
      vn((l === "ar" ? "تم استرداد النقاط: +" : "Penalty undone • +") + Math.abs(Number(e.delta) || 0));
    },
    twCheck = a => {
      if (!a || a.status === "done") return;
      let pts = Math.abs(Number(a.points) || 0);
      twS(w => w.map(x => x.id === a.id ? {
        ...x,
        status: "done",
        doneAt: Date.now()
      } : x));
      let h = {
        id: "l" + Date.now(),
        ts: Date.now(),
        delta: pts,
        reason: a.title,
        note: `Todo • ${Mn(new Date())} • On-time`,
        type: "todoCheckIn",
        todoId: a.id
      };
      d(w => [h, ...w]), Tu(`+${pts}`, "#00C853");
    },
    twArm = id => {
      twDcS(id);
      clearTimeout(window.__mhsTwArm);
      window.__mhsTwArm = setTimeout(() => twDcS(x => x === id ? null : x), 3500);
    },
    twNew = () => {
      twEw(null), twFs({
        title: twQ.trim(),
        points: 10,
        penalty: 5,
        deadline: "23:59:00",
        icon: "📌"
      }), twMf(!0);
    },
    twQuick = () => {
      let title = twQ.trim();
      if (title.length < 2) return;
      twS(w => [{
        id: "t" + Date.now() + Math.random(),
        title,
        points: 10,
        penalty: 5,
        deadline: "23:59:00",
        icon: "📌",
        status: "active",
        doneAt: null,
        createdAt: Date.now()
      }, ...w]);
      twQS(""), twFl === "done" && twFlS("all");
      vn(l === "ar" ? "تمت إضافة المهمة" : l === "bn" ? "টুডু যোগ হয়েছে" : "Todo added");
    },
    twSave = () => {
      if ((twF.title || "").trim().length < 2) return;
      let a = {
        id: twE ? twE.id : "t" + Date.now() + Math.random(),
        title: twF.title.trim(),
        points: Math.max(0, Number(twF.points) || 0),
        penalty: Math.max(0, Number(twF.penalty) || 0),
        deadline: twF.deadline || "",
        icon: twF.icon || "📌",
        status: twE && twE.status === "done" ? "done" : "active",
        doneAt: twE && twE.doneAt ? twE.doneAt : null,
        createdAt: twE && twE.createdAt ? twE.createdAt : Date.now()
      };
      if (twE) twS(w => w.map(x => x.id === twE.id ? a : x));else twS(w => [a, ...w]);
      twE || twQS("");
      twMf(!1), vn(l === "ar" ? "تم حفظ المهمة" : l === "bn" ? "টুডু সংরক্ষিত হয়েছে" : "Todo saved");
    },
    twClear = () => {
      if (twDc !== "__done") return twArm("__done");
      let n = tw.filter(x => x.status === "done").length;
      twS(w => w.filter(x => x.status !== "done")), twDcS(null);
      vn((l === "ar" ? "تم مسح المكتملة: " : l === "bn" ? "সম্পন্ন টুডু মুছে ফেলা হয়েছে: " : "Cleared completed: ") + (l === "bn" ? n.toLocaleString("bn-BD") : n));
    },
    twDel = a => {
      if (!a) return;
      if (twDc !== a.id) return twArm(a.id);
      twDcS(null);
      twS(w => w.filter(x => x.id !== a.id));
      vn(l === "ar" ? "تم حذف المهمة" : l === "bn" ? "টুডু মুছে ফেলা হয়েছে" : "Todo deleted");
    },
    twU = e => {
      if (!e || e.type !== "todoPenalty") return;
      d(w => w.map(h => h.id === e.id ? {
        ...h,
        type: "excuse",
        origDelta: h.delta,
        delta: 0,
        note: "Penalty refunded • excused",
        audit: "excused",
        todoId: h.todoId
      } : h));
      vn((l === "ar" ? "تم استرداد نقاط المهمة: +" : l === "bn" ? "টুডু কর্তন বাতিল: +" : "Todo penalty undone • +") + Math.abs(Number(e.delta) || 0));
    },
    xT = () => {
      let td = dn.toDateString(),
        sd = x => new Date(x.ts).toDateString() === td;
      if (xD) {
        d(w => w.filter(x => !(x.type === "excuse" && !x.habitId && sd(x))).map(x => x.exDay && x.type === "excuse" && sd(x) ? {
          ...x,
          type: x.todoId ? "todoPenalty" : "autoPenalty",
          delta: Number(x.origDelta) || 0,
          note: "Auto-penalty • deadline missed",
          audit: "auto",
          exDay: void 0,
          origDelta: void 0
        } : x));
        vn(l === "ar" ? "تم إلغاء عذر اليوم" : "Excuse cancelled • penalties apply again");
      } else {
        d(w => [{
          id: "x" + Date.now(),
          ts: Date.now(),
          delta: 0,
          reason: "Excused day",
          note: "Illness / travel / valid reason • no penalties today",
          type: "excuse",
          habitId: null,
          audit: "excused"
        }, ...w.map(x => (x.type === "autoPenalty" || x.type === "todoPenalty") && sd(x) ? {
          ...x,
          type: "excuse",
          origDelta: x.delta,
          delta: 0,
          note: "Penalty refunded • excused day",
          audit: "excused",
          exDay: 1
        } : x)]);
        vn(l === "ar" ? "يوم معذور • لا خصم اليوم" : "Excused today • no penalties, deducted points refunded");
      }
    },
    Vn = U.useMemo(() => {
      let h = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date().getDay()];
      return o.filter(w => w.status === "active" && (w.repeat.includes(h) || w.repeat.includes("Everyday")));
    }, [o]),
    fA = Vn.filter(w => !Xr.has(w.id) && !Ms.has(w.id) && !xS.has(w.id) && !(xD && Date.now() >= mhsDl(w))).length,
    Yr = Vn.filter(w => Xr.has(w.id)).length,
    sA = () => {
      let a = `muhasabah_export_${new Date().toISOString().slice(0, 10)}.json`,
        h = JSON.stringify({
          habits: o,
          todos: tw,
          ledger: s,
          journal: window.MHS?.current()?.journal || {},
          journalReminder: window.MHS?.current()?.journalReminder || false,
          lang: t,
          exportedAt: new Date().toISOString()
        }, null, 2),
        w = new Blob([h], {
          type: "application/json"
        }),
        L = URL.createObjectURL(w),
        B = document.createElement("a");
      B.href = L, B.download = a, B.click(), URL.revokeObjectURL(L), He(!0), setTimeout(() => He(!1), 1200), vn(`Exported ${a}`);
      try {
        window.dispatchEvent(new Event("mhs:backup"));
      } catch (x) {}
    };
  U.useEffect(() => {
    try {
      navigator.setAppBadge && (fA > 0 ? navigator.setAppBadge(fA) : navigator.clearAppBadge()).catch(() => {});
    } catch (x) {}
  }, [fA]);
  return U.useEffect(() => {
    if (twM || hu || ku || wu || Eu || Oe || Dn || Zt || pn) document.body.style.overflow = "hidden";else document.body.style.overflow = "";
  }, [hu, ku, wu, Eu, Oe, Dn, Zt, pn]), f("div", {
    className: "min-h-screen w-full bg-[hsl(var(--background))] text-[hsl(var(--foreground))] antialiased overflow-x-clip",
    style: {
      paddingTop: "var(--safe-area-inset-top)",
      boxSizing: "border-box"
    },
    children: [lA && i("canvas", {
      className: "fixed inset-0 z-[100] pointer-events-none",
      ref: a => {
        if (!a) return;
        let h = a.getContext("2d");
        if (!h) return;
        a.width = window.innerWidth, a.height = window.innerHeight;
        let w = Array.from({
            length: 80
          }).map(() => ({
            x: window.innerWidth / 2 + (Math.random() * 200 - 100),
            y: window.innerHeight / 2 + (Math.random() * 100 - 50),
            vx: (Math.random() - 0.5) * 12,
            vy: (Math.random() - 0.5) * 12 - Math.random() * 6,
            color: Math.random() > 0.5 ? "#00C853" : "#FFCC02",
            size: Math.random() * 4 + 2
          })),
          L = 0,
          B = () => {
            if (L > 60) {
              h.clearRect(0, 0, a.width, a.height);
              return;
            }
            h.clearRect(0, 0, a.width, a.height), w.forEach(K => {
              K.x += K.vx, K.y += K.vy, K.vy += 0.2, h.fillStyle = K.color, h.fillRect(K.x, K.y, K.size, K.size);
            }), L++, requestAnimationFrame(B);
          };
        B();
      }
    }), rA.map(a => i("div", {
      className: "fixed top-1/2 left-1/2 z-[90] pointer-events-none num text-2xl font-bold",
      style: {
        animation: "flying 1s ease-out forwards",
        transform: `translate(calc(-50% + ${a.x}px), calc(-50% + ${a.y}px))`,
        color: a.color
      },
      children: a.text
    }, a.id)), f("aside", {
      className: "fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-white/[0.06] bg-[hsl(var(--card)/0.40)] px-5 py-7 backdrop-blur-xl lg:flex",
      style: {
        backdropFilter: "blur(20px) saturate(150%)"
      },
      children: [f("div", {
        className: "flex items-center gap-3",
        children: [i("img", {
          src: lt,
          alt: "Muhasabah Logo",
          className: "h-9 w-9 rounded-xl object-cover shadow-sm ring-1 ring-white/10"
        }), f("div", {
          children: [i("div", {
            className: "text-[15px] font-semibold tracking-tight",
            style: {
              fontFamily: "var(--font-display)"
            },
            children: "Muhasabah"
          }), i("div", {
            className: "text-[10px] uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground)/0.70)]",
            children: "Habit tracker"
          })]
        })]
      }), i("nav", {
        className: "mt-8 hidden flex-col gap-1.5",
        children: [{
          k: "dashboard",
          label: u.dashboard,
          icon: "◫"
        }, {
          k: "today",
          label: u.todayChecklist,
          icon: "◪"
        }, {
          k: "habits",
          label: u.habits,
          icon: "⬢"
        }, {
          k: "ledger",
          label: u.ledger,
          icon: "≡"
        }, {
          k: "settings",
          label: l === "bn" ? "সেটিংস" : l === "ar" ? "الإعدادات" : "Settings",
          icon: "⚙"
        }].map(a => f("button", {
          onClick: () => n(a.k),
          className: `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all active:scale-[0.97] ${e === a.k ? "bg-[hsl(var(--primary)/0.10)] text-foreground ring-1 ring-[hsl(var(--primary)/0.25)]" : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-foreground"}`,
          children: [i("span", {
            className: "h-4 w-4 flex items-center justify-center text-xs",
            children: a.icon
          }), a.label]
        }, a.k))
      }), f("div", {
        className: "mt-auto space-y-3",
        children: [f("div", {
          className: "panel p-3",
          children: [f("div", {
            className: "text-[10px] uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))]",
            children: ["Hijri • ", bi()]
          }), i("div", {
            className: "mt-1 text-xs text-muted-foreground",
            children: mu(new Date(), l)
          }), i("div", {
            className: "mt-2 flex gap-1.5 flex-wrap",
            children: o.filter(h => h.status === "active" && h.deadline).slice().sort((a, b) => mhsLeft(a) - mhsLeft(b)).slice(0, 3).map(a => f("span", {
              className: "rounded-full border border-border px-2 py-0.5 text-[10px] num",
              children: [a.icon || "", " ", mhsT(a)]
            }, a.id))
          })]
        }), i("div", {
          className: "text-[10px] text-[hsl(var(--muted-foreground)/0.7)]",
          children: "v1.3.0 • Data on device"
        })]
      })]
    }), f("header", {
      className: "sticky top-0 z-30 flex items-center justify-between border-b border-white/[0.06] bg-[hsl(var(--background)/0.85)] px-4 py-3.5 backdrop-blur-xl lg:hidden",
      style: {
        top: "var(--safe-area-inset-top)",
        backdropFilter: "blur(20px) saturate(150%)"
      },
      children: [f("div", {
        className: "flex items-center gap-2.5",
        children: [i("img", {
          src: lt,
          alt: "Muhasabah Logo",
          className: "h-9 w-9 rounded-xl object-cover shadow-sm ring-1 ring-white/10"
        }), f("div", {
          children: [i("div", {
            className: "text-[15px] font-semibold tracking-tight",
            style: {
              fontFamily: "var(--font-display)"
            },
            children: "Muhasabah"
          }), i("div", {
            className: "text-[10px] uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground)/0.70)]",
            children: "Habit tracker"
          })]
        })]
      }), f("div", {
        className: "flex items-center gap-2",
        children: [i("div", {
          className: "h-2 w-2 rounded-full bg-[#00C853] animate-pulse"
        }), f("span", {
          className: "num text-xs",
          children: [Nu, " pts"]
        }), f("button", {
          onClick: () => r(a => ({en:"bn", bn:"ar", ar:"en"})[a]),
          "aria-label": "Language: English / বাংলা / العربية",
          title: "Switch language",
          className: "mhs-lang-toggle rounded-xl border border-border px-2.5 py-1 text-[11px]",
          children: [" ", l.toUpperCase(), " "]
        })]
      })]
    }), f("main", {
      className: "mx-auto w-full max-w-6xl px-5 sm:px-8 lg:pl-[16rem] xl:pl-60 py-8 lg:py-12 rail-pad flex flex-col gap-8 lg:gap-12",
      style: {
        maxWidth: "72rem"
      },
      children: [e === "dashboard" && f("div", {
        className: "space-y-8",
        children: [f("div", {
          className: "flex flex-wrap items-end justify-between gap-4 lg:gap-6",
          children: [f("div", {
            children: [i("div", {
              className: "text-[10px] uppercase tracking-[0.26em] text-[hsl(var(--primary))]",
              children: u.liveAudit
            }), i("h1", {
              className: "mt-1 text-2xl sm:text-3xl font-semibold tracking-tight",
              style: {
                fontFamily: "var(--font-display)"
              },
              children: u.dashboard
            }), f("div", {
              className: "mt-1 text-xs text-[hsl(var(--muted-foreground))]",
              children: [mu(dn, l), " · Muhasabah: Make Habit, Get Reward"]
            })]
          }), f("button", {
            onClick: () => n("today"),
            className: "rounded-xl border border-border px-3.5 py-2 text-xs text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary)/0.4)] transition-colors",
            children: [u.openChecklist, " →"]
          })]
        }), f("div", {
          className: "panel ticker-glow p-5 sm:p-7 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between",
          children: [f("div", {
            children: [i("div", {
              className: "text-[10px] uppercase tracking-[0.24em] text-[hsl(var(--muted-foreground))]",
              children: u.netBalance
            }), f("div", {
              className: "mt-2 flex items-end gap-2",
              children: [i("div", {
                className: "num text-5xl sm:text-6xl font-semibold tracking-tight",
                children: Nu
              }), i("div", {
                className: "pb-2 text-[11px] uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]",
                children: "pts"
              })]
            }), f("div", {
              className: "mt-4 flex items-center gap-2",
              children: [f("span", {
                className: `inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${iA >= 0 ? "border-[hsl(var(--primary)/0.3)] bg-[hsl(var(--primary)/0.10)] text-[hsl(var(--primary))]" : "border-[#FF3B30]/30 bg-[#FF3B30]/10 text-[#FF3B30]"}`,
                children: [iA >= 0 ? "▲ +" : "▼ ", iA, " Pts"]
              }), f("span", {
                className: "text-[11px] text-[hsl(var(--muted-foreground))]",
                children: [iA >= 0 ? u.trending : l === "ar" ? "في انخفاض" : "Trending down", " • ", i(LiveClock, {
                  fmt: "l"
                })]
              })]
            })]
          }), i("div", {
            className: "mhs-stat-row grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-5 lg:gap-6 border-t border-[hsl(var(--border))] pt-5 sm:border-l sm:border-t-0 sm:pl-7 min-w-0",
            children: [{
              label: u.streak,
              value: `${ia}d`
            }, {
              label: u.habits,
              value: o.length
            }, {
              label: u.trades,
              value: s.length
            }].map(a => f("div", {
              children: [i("div", {
                className: "text-[10px] uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))]",
                children: a.label
              }), i("div", {
                className: "num mt-1 text-xl font-semibold",
                children: a.value
              })]
            }, a.label))
          })]
        }), f("div", {
          className: "panel p-4 sm:p-5 min-w-0 space-y-5",
          children: [f("div", {
            className: "flex flex-col lg:flex-row lg:items-start justify-between gap-4 lg:gap-6",
            children: [f("div", {
              children: [i("div", {
                className: "text-sm font-semibold",
                style: {
                  fontFamily: "var(--font-display)"
                },
                children: u.pointFlow
              }), i("div", {
                className: "text-[11px] text-[hsl(var(--muted-foreground))]",
                children: u.tapCandle
              })]
            }), f("div", {
              className: "flex flex-col gap-3 min-w-0",
              children: [f("div", {
                className: "flex flex-wrap items-center gap-3",
                children: [i("div", {
                  className: "flex gap-1 rounded-xl border border-border bg-[hsl(var(--card)/0.8)] p-1 backdrop-blur",
                  children: ["daily", "weekly", "monthly", "lod"].map(a => i("button", {
                    onClick: () => v(a),
                    className: `rounded-lg px-3.5 py-2 text-[11px] font-medium transition-all active:scale-[0.97] ${A === a ? "bg-[hsl(var(--primary)/0.14)] text-[hsl(var(--primary))] ring-1 ring-[hsl(var(--primary)/0.25)]" : "text-[hsl(var(--muted-foreground))] hover:text-foreground"}`,
                    children: u[a] || a.toUpperCase()
                  }, a))
                }), i("div", {
                  className: "text-[10px] text-[hsl(var(--muted-foreground))] hidden sm:block",
                  children: "• LOD ≥20 pts"
                })]
              }), i("div", {
                className: "h-px bg-[hsl(var(--border)/0.5)] lg:hidden"
              }), f("div", {
                className: "flex flex-wrap items-center gap-3",
                children: [f("div", {
                  className: "flex gap-1 rounded-xl border border-border bg-[hsl(var(--card)/0.8)] p-1",
                  children: [f("button", {
                    onClick: () => N("line"),
                    className: `rounded-lg px-3.5 py-2 text-[11px] font-medium flex items-center gap-1.5 transition-all active:scale-[0.97] ${k === "line" ? "bg-[hsl(var(--primary)/0.12)] text-primary ring-1 ring-[hsl(var(--primary)/0.2)]" : "text-muted-foreground hover:text-foreground"}`,
                    children: ["∿ ", u.line]
                  }), f("button", {
                    onClick: () => N("candle"),
                    className: `rounded-lg px-3.5 py-2 text-[11px] font-medium flex items-center gap-1.5 transition-all active:scale-[0.97] ${k === "candle" ? "bg-[hsl(var(--primary)/0.12)] text-primary ring-1 ring-[hsl(var(--primary)/0.2)]" : "text-muted-foreground hover:text-foreground"}`,
                    children: ["▐ ", u.candle]
                  })]
                }), f("div", {
                  className: "flex gap-2 items-center rounded-xl border border-border bg-[hsl(var(--card)/0.6)] px-3 py-1.5 text-[11px]",
                  children: [f("label", {
                    className: "flex items-center gap-1.5 cursor-pointer hover:text-foreground transition-colors",
                    children: [i("input", {
                      type: "checkbox",
                      checked: T,
                      onChange: a => R(a.target.checked),
                      className: "h-3.5 w-3.5 accent-[#00C853] rounded"
                    }), "MA7"]
                  }), i("span", {
                    className: "h-3 w-px bg-border"
                  }), f("label", {
                    className: "flex items-center gap-1.5 cursor-pointer hover:text-foreground transition-colors",
                    children: [i("input", {
                      type: "checkbox",
                      checked: O,
                      onChange: a => x(a.target.checked),
                      className: "h-3.5 w-3.5 accent-[#00C853] rounded"
                    }), "MA30"]
                  })]
                }), f("div", {
                  className: "flex gap-1 rounded-xl border border-border bg-[hsl(var(--card)/0.6)] p-1",
                  children: [i("button", {
                    onClick: () => Ve(a => Math.max(1, a - 0.5)),
                    "aria-label": "Zoom out",
                    className: "h-8 w-8 rounded-lg border border-transparent hover:border-border flex items-center justify-center text-sm bg-[hsl(var(--muted)/0.5)] active:scale-[0.95]",
                    children: "-"
                  }), i("button", {
                    onClick: () => Ve(a => Math.min(8, a + 0.5)),
                    "aria-label": "Zoom in",
                    className: "h-8 w-8 rounded-lg border border-transparent hover:border-border flex items-center justify-center text-sm bg-[hsl(var(--muted)/0.5)] active:scale-[0.95]",
                    children: "+"
                  })]
                })]
              })]
            })]
          }), i(MhsFlowChart, { data: Ae, mode: k, zoom: Q, ma7: T, ma30: O, inspect: ta, empty: u.noTrades, lang: l
          }), f("div", {
            className: "mt-2 flex items-center gap-4 border-t border-border pt-3 text-[10px] uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]",
            children: [f("span", {
              className: "flex items-center gap-1.5",
              children: [i("span", {
                className: "h-2.5 w-2.5 rounded-[2px] bg-[#00C853]"
              }), u.bullish]
            }), f("span", {
              className: "flex items-center gap-1.5",
              children: [i("span", {
                className: "h-2.5 w-2.5 rounded-[2px] bg-[#FF3B30]"
              }), u.bearish]
            }), f("span", {
              className: "ml-auto normal-case",
              children: [Ae.length, " active periods • ATH ", Math.max(...Ae.map(a => a.high), 0).toFixed(0), " • Win Rate ", Math.round(s.filter(a => a.delta > 0).length / s.length * 100) || 0, "% • Streak ", ia, "d"]
            })]
          })]
        }), f("div", {
          className: "grid gap-4 lg:gap-6 grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] min-w-0",
          children: [f("button", {
            onClick: () => gu(!0),
            className: "panel flex items-center gap-4 p-5 sm:p-6 text-left hover:border-[hsl(var(--primary)/0.4)] transition-colors active:scale-[0.97]",
            children: [i("div", {
              className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))] ring-1 ring-[hsl(var(--primary)/0.25)]",
              children: i("span", {
                className: "text-xl",
                children: "+"
              })
            }), f("div", {
              children: [i("div", {
                className: "text-sm font-medium",
                children: u.addReward
              }), i("div", {
                className: "text-[11px] text-[hsl(var(--muted-foreground))]",
                children: u.creditWin
              })]
            })]
          }), f("button", {
            onClick: () => Su(!0),
            className: "panel flex items-center gap-4 p-5 sm:p-6 text-left hover:border-[hsl(var(--destructive)/0.4)] transition-colors active:scale-[0.97]",
            children: [i("div", {
              className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--destructive)/0.12)] text-[hsl(var(--destructive))] ring-1 ring-[hsl(var(--destructive)/0.25)]",
              children: i("span", {
                className: "text-xl",
                children: "−"
              })
            }), f("div", {
              children: [i("div", {
                className: "text-sm font-medium",
                children: u.deductPenalty
              }), i("div", {
                className: "text-[11px] text-[hsl(var(--muted-foreground))]",
                children: u.debitLoss
              })]
            })]
          })]
        }), o.length === 0 && f("div", {
          className: "panel flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8",
          children: [f("div", {
            children: [i("div", {
              className: "font-medium",
              children: u.yourEngineEmpty
            }), i("div", {
              className: "text-xs text-[hsl(var(--muted-foreground))]",
              children: u.createFirst
            })]
          }), i("button", {
            onClick: () => n("habits"),
            className: "h-11 rounded-xl bg-[hsl(var(--primary))] px-5 text-sm font-medium text-[hsl(var(--primary-foreground))] active:scale-[0.97]",
            children: u.buildHabit
          })]
        }), f("div", {
          className: "grid gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] min-w-0",
          children: [f("div", {
            className: "panel p-5 sm:p-6",
            children: [f("div", {
              className: "flex items-center justify-between",
              children: [i("h3", {
                className: "text-sm font-semibold",
                style: {
                  fontFamily: "var(--font-display)"
                },
                children: u.recentTrades
              }), i("button", {
                type: "button",
                onClick: () => n("ledger"),
                className: "mhs-link-btn text-[11px] text-[hsl(var(--muted-foreground))]",
                children: "View all →"
              })]
            }), i("div", {
              className: "mt-4 space-y-3",
              children: s.slice(0, 5).map(a => f("div", {
                className: "flex justify-between gap-3 rounded-xl border border-transparent p-3 hover:border-border transition-colors",
                children: [f("div", {
                  children: [i("div", {
                    className: "num text-[11px] text-[hsl(var(--muted-foreground))]",
                    children: Mn(new Date(a.ts))
                  }), i("div", {
                    className: "text-xs",
                    children: a.reason
                  })]
                }), f("div", {
                  className: `num text-sm font-semibold ${a.delta > 0 ? "text-[#00C853]" : "text-[#FF3B30]"}`,
                  children: [a.delta > 0 ? "+" : "", a.delta]
                })]
              }, a.id))
            })]
          }), f("div", {
            className: "panel p-5 sm:p-6",
            children: [i("h3", {
              className: "text-sm font-semibold",
              style: {
                fontFamily: "var(--font-display)"
              },
              children: u.timeline24h
            }), f("div", {
              className: "mt-4 relative border-l border-border ml-2 pl-4 space-y-4",
              children: [(o.filter(h => h.status === "active" && h.deadline).length ? o.filter(h => h.status === "active" && h.deadline).slice().sort((a, b) => mhsLeft(a) - mhsLeft(b)).map(h => ({
                name: h.title,
                time: mhsT(h) || "00:00",
                icon: h.icon || "•",
                id: h.id
              })) : [{
                name: "Nothing scheduled for today",
                time: "",
                icon: "·",
                id: "empty"
              }]).map(a => f("div", {
                className: "flex items-center gap-2 text-xs",
                children: [i("span", {
                  children: a.icon
                }), i("span", {
                  className: "num text-[11px]",
                  children: a.time
                }), i("span", {
                  className: "text-[hsl(var(--muted-foreground))]",
                  children: a.name
                })]
              }, a.name + a.time)), f("div", {
                className: "flex items-center gap-2 text-[11px] text-amber-400",
                children: [i("div", {
                  className: "h-2 w-2 rounded-full bg-amber-400 animate-pulse"
                }), u.hadith]
              }), i("div", {
                className: "absolute left-0 top-0 h-full w-px bg-gradient-to-b from-[#00C853]/40 to-transparent"
              }), f("div", {
                className: "sticky top-1/2 -ml-[17px] flex items-center gap-2",
                children: [i("div", {
                  className: "h-3 w-3 rounded-full bg-amber-400 ring-4 ring-amber-400/20"
                }), i("div", {
                  className: "h-px w-12 bg-amber-400/60"
                }), f("span", {
                  className: "num text-[10px] text-amber-400",
                  children: [i(LiveClock, {}), " NOW"]
                })]
              })]
            })]
          })]
        }), i("mhs-insights", { lang: l })]
      }), e === "today" && f("div", {
        className: "space-y-6",
        children: [(() => {
          let twDn = tw.filter(x => x.status === "done"),
            twAc = tw.length - twDn.length,
            twPct = tw.length ? Math.round(twDn.length / tw.length * 100) : 0,
            twPts = twDn.reduce((n, x) => n + Math.abs(Number(x.points) || 0), 0),
            twKey = x => x.deadline ? String(x.deadline) : "99",
            twL = [...tw].filter(x => twFl === "all" || (twFl === "done" ? x.status === "done" : x.status !== "done")).sort((x, y) => (x.status === "done" ? 1 : 0) - (y.status === "done" ? 1 : 0) || (x.status === "done" ? (Number(y.doneAt) || 0) - (Number(x.doneAt) || 0) : twKey(x).localeCompare(twKey(y))));
          return f("section", {
          className: "mhs-todo-panel panel p-5 sm:p-6",
          "aria-label": "Todo List",
          children: [f("div", {
            className: "mhs-todo-head",
            children: [f("div", {
              className: "min-w-0",
              children: [i("h3", {
                className: "text-sm font-semibold",
                style: {
                  fontFamily: "var(--font-display)"
                },
                children: l === "ar" ? "📋 قائمة المهام" : "📋 Todo List"
              }), tw.length ? f("p", {
                className: "mhs-todo-sub",
                children: [i("span", {
                  className: "num",
                  children: twDn.length
                }), i("span", {
                  children: "/"
                }), i("span", {
                  className: "num",
                  children: tw.length
                }), i("span", {
                  children: l === "ar" ? " مكتملة" : " done"
                }), twPts ? i("span", {
                  className: "mhs-todo-pts num",
                  children: "+" + twPts
                }) : null]
              }) : null]
            }), i("button", {
              type: "button",
              onClick: twNew,
              className: "mhs-todo-new h-9 rounded-xl bg-[hsl(var(--primary))] px-4 text-xs font-medium text-[hsl(var(--primary-foreground))] active:scale-[0.97] flex items-center gap-1.5",
              children: l === "ar" ? "＋ مهمة جديدة" : "＋ New Todo"
            })]
          }), tw.length ? i("div", {
            className: "mhs-todo-progress",
            role: "progressbar",
            "aria-valuemin": 0,
            "aria-valuemax": 100,
            "aria-valuenow": twPct,
            "aria-label": "Todo progress",
            children: i("span", {
              style: {
                width: twPct + "%"
              }
            })
          }) : null, f("form", {
            className: "mhs-todo-quick",
            onSubmit: a => {
              a.preventDefault(), twQuick();
            },
            children: [i("input", {
              value: twQ,
              onChange: a => twQS(a.target.value),
              maxLength: 200,
              enterKeyHint: "done",
              "aria-label": "Quick add a todo",
              placeholder: l === "ar" ? "أضف مهمة سريعة… ثم Enter" : "Quick add a task… press Enter"
            }), i("button", {
              type: "submit",
              disabled: twQ.trim().length < 2,
              "aria-label": "Add todo",
              title: "Add todo",
              children: "＋"
            }), i("button", {
              type: "button",
              className: "mhs-todo-more",
              onClick: twNew,
              "aria-label": "More options",
              title: "More options",
              children: "⚙"
            })]
          }), tw.length ? f("div", {
            className: "mhs-todo-filters",
            role: "group",
            "aria-label": "Filter todos",
            children: [["all", l === "ar" ? "الكل" : "All", tw.length], ["active", l === "ar" ? "النشطة" : "Active", twAc], ["done", l === "ar" ? "المكتملة" : "Done", twDn.length]].map(([k, lb, c]) => f("button", {
              type: "button",
              "aria-pressed": twFl === k,
              onClick: () => twFlS(k),
              className: twFl === k ? "is-on" : "",
              children: [i("span", {
                children: lb
              }), i("b", {
                className: "num",
                children: c
              })]
            }, k)).concat(twDn.length ? [i("button", {
              type: "button",
              onClick: twClear,
              className: "mhs-todo-clear" + (twDc === "__done" ? " is-armed" : ""),
              children: twDc === "__done" ? l === "ar" ? "اضغط مجدداً للمسح" : "Tap again to clear" : l === "ar" ? "مسح المكتملة" : "Clear done"
            }, "clr")] : [])
          }) : null, !tw.length ? f("div", {
            className: "mhs-todo-empty",
            children: [i("span", {
              className: "mhs-todo-empty-ic",
              "aria-hidden": "true",
              children: "🌱"
            }), i("b", {
              children: l === "ar" ? "لا مهام بعد" : "No todos yet"
            }), i("p", {
              children: l === "ar" ? "اكتب مهمة أعلاه واضغط Enter، أو افتح الخيارات لتحديد النقاط والموعد." : "Type a task above and press Enter, or open more options to set points and a deadline."
            })]
          }) : !twL.length ? i("div", {
            className: "mhs-todo-empty is-small",
            children: twFl === "done" ? l === "ar" ? "لا مهام مكتملة بعد." : "Nothing completed yet." : l === "ar" ? "كل المهام مكتملة — أحسنت!" : "All tasks done — well done!"
          }) : i("div", {
            className: "space-y-2 mhs-todo-list",
            children: twL.map(a => {
              let done = a.status === "done",
                dl = a.deadline ? mhsDl(a, dn) : 1 / 0,
                past = !done && Date.now() >= dl,
                na = !done && !past && Number(a.createdAt) > dl,
                pen = !done && s.find(x => x.type === "todoPenalty" && x.todoId === a.id && new Date(x.ts).toDateString() === dn.toDateString()),
                exd = !done && s.some(x => x.type === "excuse" && x.todoId === a.id && new Date(x.ts).toDateString() === dn.toDateString()),
                ms = !!pen && !exd;
              return f("div", {
                className: `mhs-todo flex items-center justify-between gap-3 rounded-xl border p-3.5 transition-all ${done ? "is-done border-[hsl(var(--primary)/0.35)] bg-[hsl(var(--primary)/0.06)]" : ms ? "is-missed" : exd ? "is-excused" : "border-border hover:border-[hsl(var(--primary)/0.2)]"}`,
                children: [f("div", {
                  className: "flex items-center gap-3.5 flex-1 min-w-0",
                  children: [i("button", {
                    type: "button",
                    onClick: () => twCheck(a),
                    disabled: done || ms || exd,
                    "aria-label": done ? "Completed" : ms ? "Missed" : exd ? "Excused" : "Mark done",
                    title: done ? "Completed" : ms ? "Missed" : exd ? "Excused" : "Mark done",
                    className: `mhs-todo-check h-11 w-11 min-h-[44px] min-w-[44px] shrink-0 rounded-xl border-2 flex items-center justify-center transition-all active:scale-[0.97] ${done ? "bg-[hsl(var(--primary))] border-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]" : "border-border hover:border-[hsl(var(--primary)/0.4)]"}`,
                    children: done ? "✓" : ms ? "✕" : na ? "🆕" : exd ? "🕊" : ""
                  }), f("div", {
                    className: "min-w-0",
                    children: [f("div", {
                      className: "font-medium text-sm mhs-ttl" + (done ? " line-through opacity-60" : ""),
                      children: [a.icon, " ", a.title]
                    }), f("div", {
                      className: "flex flex-wrap items-center gap-2 mt-2",
                      children: [i("span", {
                        className: "num text-[11px] text-[hsl(var(--muted-foreground))]",
                        children: ["+", a.points]
                      }), a.deadline && i("span", {
                        className: "num text-[11px] font-mono text-[hsl(var(--muted-foreground))]",
                        children: ["⏱ ", String(a.deadline).slice(0, 5)]
                      }), done ? i("span", {
                        className: "mhs-state ok",
                        children: (l === "ar" ? "✓ مكتمل • +" : "✓ Done • +") + a.points
                      }) : ms ? f("span", {
                        className: "mhs-xrow",
                        children: [i("span", {
                          className: "mhs-state bad",
                          children: (l === "ar" ? "✕ فائت • −" : "✕ Missed • −") + Math.abs(Number(pen.delta) || 0) + (l === "ar" ? " خُصمت" : " deducted")
                        }), i("button", {
                          type: "button",
                          className: "mhs-undo",
                          onClick: () => twU(pen),
                          children: l === "ar" ? "↺ تراجع" : "↺ Undo"
                        })]
                      }) : exd ? i("span", {
                        className: "mhs-state ex",
                        children: l === "ar" ? "🕊 معذور • بلا خصم" : "🕊 Excused • no penalty"
                      }) : na ? i("span", {
                        className: "mhs-state ex",
                        children: l === "ar" ? "🆕 أُضيفت بعد الموعد • تبدأ غداً" : "🆕 Added after today's deadline • starts tomorrow"
                      }) : past ? i("span", {
                        className: "mhs-state bad",
                        children: l === "ar" ? "✕ انتهى الوقت" : "✕ Deadline passed"
                      }) : a.deadline && i(js, {
                        deadline: String(a.deadline).slice(0, 8)
                      })]
                    })]
                  })]
                }), f("div", {
                  className: "flex items-center gap-1.5 shrink-0",
                  children: [i("button", {
                    type: "button",
                    onClick: () => {
                      twEw(a), twFs({
                        title: a.title,
                        points: a.points,
                        penalty: a.penalty,
                        deadline: a.deadline ?? "23:59:00",
                        icon: a.icon || "📌"
                      }), twMf(!0);
                    },
                    "aria-label": "Edit todo",
                    title: "Edit todo",
                    className: "mhs-todo-edit h-9 w-9 rounded-lg border border-border flex items-center justify-center text-xs",
                    children: "✎"
                  }), i("button", {
                    type: "button",
                    onClick: () => twDel(a),
                    "aria-label": twDc === a.id ? "Tap again to delete" : "Delete todo",
                    title: twDc === a.id ? "Tap again to delete" : "Delete todo",
                    className: "mhs-todo-del h-9 rounded-lg border border-[#FF3B30]/30 text-[#FF3B30] flex items-center justify-center text-xs" + (twDc === a.id ? " is-armed px-3" : " w-9"),
                    children: twDc === a.id ? l === "ar" ? "احذف؟" : "Delete?" : "🗑"
                  })]
                })]
              }, a.id);
            })
          })]
          });
        })(), f("div", {
          className: "flex flex-wrap items-start justify-between gap-4 lg:gap-6",
          children: [f("div", {
            children: [i("div", {
              className: "text-[10px] uppercase tracking-[0.26em] text-[hsl(var(--primary))]",
              children: u.executionWindow
            }), i("h1", {
              className: "mt-1 text-2xl sm:text-3xl font-semibold tracking-tight",
              style: {
                fontFamily: "var(--font-display)"
              },
              children: u.todayChecklist
            }), f("div", {
              className: "mt-1 text-xs text-[hsl(var(--muted-foreground))] flex flex-wrap gap-2 items-center",
              children: [i("span", {
                children: mu(dn, l)
              }), i("span", {
                className: "rounded-full border border-border px-2 py-0.5 num text-[10px]",
                children: bi()
              }), i("button", {
                type: "button",
                onClick: xT,
                title: l === "ar" ? "مرض أو سفر أو عذر — لا خصم اليوم" : "Illness, travel or another valid reason — no penalties today",
                className: `mhs-xday${xD ? " on" : ""}`,
                children: xD ? l === "ar" ? "🕊 يوم معذور • إلغاء" : "🕊 Excused today • Cancel" : l === "ar" ? "🕊 عذر اليوم" : "🕊 Excuse today"
              }), f("span", {
                className: "rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 text-[10px] text-amber-300 flex items-center gap-1",
                children: [i("span", {
                  className: "h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"
                }), ""]
              })]
            })]
          }), f("div", {
            className: "flex items-center gap-3",
            children: [f("div", {
              className: "relative h-14 w-14",
              children: [f("svg", {
                viewBox: "0 0 36 36",
                className: "h-14 w-14 rotate-[-90deg]",
                children: [i("circle", {
                  cx: "18",
                  cy: "18",
                  r: "16",
                  fill: "none",
                  stroke: "hsl(var(--border))",
                  strokeWidth: "3"
                }), i("circle", {
                  cx: "18",
                  cy: "18",
                  r: "16",
                  fill: "none",
                  stroke: "hsl(var(--primary))",
                  strokeWidth: "3",
                  strokeDasharray: `${Yr / Math.max(1, Vn.length) * 100} 100`,
                  strokeLinecap: "round"
                })]
              }), i("div", {
                className: "absolute inset-0 flex flex-col items-center justify-center",
                children: f("span", {
                  className: "num text-sm font-bold",
                  children: [Vn.length ? Math.round(Yr / Vn.length * 100) : 0, "%"]
                })
              })]
            }), f("div", {
              className: "text-xs text-[hsl(var(--muted-foreground))]",
              children: [Yr, "/", Vn.length, " done"]
            })]
          })]
        }), f("div", {
          className: "mhs-stats3 grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-4 lg:gap-6 min-w-0",
          children: [f("div", {
            className: "panel px-5 py-4",
            children: [i("div", {
              className: "text-[10px] uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))]",
              children: u.pending
            }), i("div", {
              className: "num text-xl mt-1",
              children: fA
            })]
          }), f("div", {
            className: "panel px-5 py-4",
            children: [i("div", {
              className: "text-[10px] uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))]",
              children: u.banked
            }), i("div", {
              className: "num text-xl mt-1 text-[#00C853]",
              children: Yr
            })]
          }), f("div", {
            className: "panel px-5 py-4",
            children: [i("div", {
              className: "text-[10px] uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))]",
              children: u.missed
            }), i("div", {
              className: "num text-xl mt-1 text-[#FF3B30]",
              children: Ms.size
            })]
          })]
        }), Vn.length === 0 ? f("div", {
          className: "panel flex flex-col items-start gap-4 p-6 sm:p-8",
          children: [i("div", {
            className: "text-sm font-medium",
            children: u.nothingScheduled
          }), i("div", {
            className: "text-xs text-[hsl(var(--muted-foreground))]",
            children: u.addHabitHint
          }), i("button", {
            onClick: () => n("habits"),
            className: "h-11 rounded-xl bg-[hsl(var(--primary))] px-5 text-sm font-medium text-[hsl(var(--primary-foreground))] active:scale-[0.97]",
            children: u.goToHabits
          })]
        }) : i("div", {
          className: "space-y-4",
          children: Vn.map(a => {
            let h = Xr.has(a.id),
              dl = mhsDl(a, dn),
              past = Date.now() >= dl,
              na = !h && !Ms.has(a.id) && past && Number(a.createdAt) > dl,
              exd = !h && !Ms.has(a.id) && (na || xS.has(a.id) || xD && past),
              ms = !h && !exd && (Ms.has(a.id) || past);
            return {
              a,
              h,
              ms,
              exd,
              na,
              dl,
              r: h ? 1 : ms ? 2 : exd ? 3 : 0
            };
          }).sort((x, y) => x.r - y.r || x.dl - y.dl).map(({
            a,
            h,
            ms,
            exd,
            na
          }, idx) => {
            let nx = !h && !ms && !exd && idx === 0;
            return f("div", {
              className: `panel mhs-card p-5 sm:p-6 flex items-center justify-between gap-4 group hover:border-[hsl(var(--primary)/0.20)] transition-all ${h ? "is-done border-[hsl(var(--primary)/0.35)] bg-[hsl(var(--primary)/0.06)]" : ""}${ms ? " is-missed" : ""}${exd ? " is-excused" : ""}${nx ? " is-next" : ""}`,
              children: [f("div", {
                className: "flex items-center gap-4 flex-1 min-w-0",
                children: [i("button", {
                  onClick: () => aa(a),
                  disabled: h || ms || exd,
                  "aria-label": h ? "Completed" : ms ? "Missed" : exd ? "Excused" : "Mark done",
                  className: `h-11 w-11 min-h-[44px] min-w-[44px] shrink-0 rounded-xl border-2 flex items-center justify-center transition-all active:scale-[0.97] ${h ? "bg-[hsl(var(--primary))] border-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]" : "border-border hover:border-[hsl(var(--primary)/0.4)]"}`,
                  children: h ? "✓" : ms ? "✕" : na ? "🆕" : exd ? "🕊" : ""
                }), f("div", {
                  className: "min-w-0",
                  children: [f("div", {
                    className: "font-medium text-sm mhs-ttl",
                    children: [a.icon, " ", a.title]
                  }), f("div", {
                    className: "flex flex-wrap items-center gap-2 mt-2",
                    children: [i("span", {
                      className: `rounded-full px-2 py-0.5 text-[10px] border ${a.category === "Fard" ? "bg-[#FF3B30]/15 border-[#FF3B30]/30 text-[#FF8A80]" : a.category === "Sunnah" ? "bg-[#FFCC02]/15 border-[#FFCC02]/30 text-[#FFCC02]" : a.category === "Nafl" ? "bg-[#00C853]/15 border-[#00C853]/30 text-[#6EFF9A]" : "bg-[#0A84FF]/15 border-[#0A84FF]/30 text-[#8AB4FF]"}`,
                      children: a.category
                    }), f("span", {
                      className: "num text-[11px] text-[hsl(var(--muted-foreground))]",
                      children: ["+", a.points]
                    }), i("span", {
                      className: "num text-[11px] font-mono",
                      children: (window.MHSPrayer && window.MHSPrayer.link(a) && window.MHSPrayer.dl(a) ? "🕌 " + window.MHSPrayer.name(window.MHSPrayer.link(a)) + " " + (window.MHSPrayer.start(a) ? window.MHSPrayer.hm(window.MHSPrayer.start(a)) + "–" : "…–") : "") + mhsT(a)
                    }), nx && i("span", {
                      className: "mhs-tag next",
                      children: l === "ar" ? "التالي" : "Next"
                    })]
                  }), i("div", {
                    className: "mt-2",
                    children: h ? i("span", {
                      className: "mhs-state ok",
                      children: (l === "ar" ? "✓ مكتمل • +" : "✓ Completed • +") + a.points
                    }) : ms ? f("span", {
                      className: "mhs-xrow",
                      children: [i("span", {
                        className: "mhs-state bad",
                        children: (l === "ar" ? "✕ فائت • −" : "✕ Missed • −") + Math.abs(a.points) + (l === "ar" ? " خُصمت" : " deducted")
                      }), Ms.has(a.id) && i("button", {
                        type: "button",
                        className: "mhs-undo",
                        title: l === "ar" ? "استرداد النقاط (عذر)" : "Refund these points (valid excuse)",
                        onClick: () => xU(s.find(x => x.type === "autoPenalty" && x.habitId === a.id && new Date(x.ts).toDateString() === dn.toDateString())),
                        children: l === "ar" ? "↺ تراجع" : "↺ Undo"
                      })]
                    }) : exd ? i("span", {
                      className: "mhs-state ex",
                      children: na ? l === "ar" ? "🆕 أُضيفت بعد الموعد • تبدأ غداً" : "🆕 Added after today's deadline • starts tomorrow" : l === "ar" ? "🕊 معذور • بلا خصم" : "🕊 Excused • no penalty"
                    }) : i(js, {
                      deadline: mhsT(a, 1)
                    })
                  })]
                })]
              }), i("button", {
                onClick: () => aa(a),
                disabled: h || ms || exd,
                className: `mhs-done h-11 shrink-0 rounded-xl px-4 text-xs font-medium transition-all active:scale-[0.97] ${h ? "bg-[hsl(var(--primary)/0.2)] text-[hsl(var(--primary))] border border-[hsl(var(--primary)/0.3)]" : ms ? "is-missed-btn" : exd ? "is-excused-btn" : "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"}`,
                children: h ? "✓" : ms ? l === "ar" ? "فائت" : "Missed" : na ? l === "ar" ? "غداً" : "Tomorrow" : exd ? l === "ar" ? "معذور" : "Excused" : l === "ar" ? "تم" : "Done"
              })]
            }, a.id);
          })
        }), f("div", {
          className: "panel p-5 sm:p-6 mt-6",
          children: [f("h3", {
            className: "text-sm font-semibold mb-3",
            style: {
              fontFamily: "var(--font-display)"
            },
            children: ["24h Timeline • ", u.productiveBlocks]
          }), !o.some(x => x.status === "active") ? i("p", {
            className: "text-xs text-[hsl(var(--muted-foreground))]",
            children: "Nothing scheduled yet. Active habits appear here at their start time."
          }) : i("div", {
            className: "relative ml-2 border-l border-border pl-4 space-y-3 max-h-[320px] overflow-y-auto scrollbar-hide",
            ref: el => {
              if (!el || el.dataset.mhsScrolled) return;
              el.dataset.mhsScrolled = "1";
              requestAnimationFrame(() => {
                const now = el.querySelector("[data-now]");
                if (now) el.scrollTop = Math.max(0, now.offsetTop - el.clientHeight / 2 + now.offsetHeight / 2);
              });
            },
            children: Array.from({
              length: 24
            }).map((a, h) => {
              let w = `${String(h).padStart(2, "0")}:00`,
                hh = String(h).padStart(2, "0"),
                hl = o.filter(x => x.status === "active" && mhsT(x).startsWith(hh + ":")),
                hab = hl[0],
                L = hab ? {
                  name: hl.map(x => x.title).join(" · "),
                  time: hl.length > 1 ? "" : mhsT(hab),
                  icon: hab.icon || "•"
                } : null,
                B = dn.getHours() === h;
              return f("div", {
                "data-now": B ? "" : undefined,
                className: `flex items-center gap-3 text-xs py-1.5 ${B ? "bg-amber-500/10 -mx-2 px-2 rounded-lg border border-amber-500/20" : ""}`,
                children: [i("span", {
                  className: "num w-10 text-[11px] text-[hsl(var(--muted-foreground))]",
                  children: w
                }), i("span", {
                  className: "h-px w-6 bg-border"
                }), L ? f("span", {
                  className: "flex items-center gap-1.5 min-w-0 flex-1",
                  children: [i("span", {
                    className: "shrink-0",
                    children: L.icon
                  }), i("span", {
                    className: "min-w-0 truncate",
                    title: L.name,
                    children: L.name + (L.time ? " • " + L.time : "")
                  })]
                }) : i("span", {
                  className: "text-[hsl(var(--muted-foreground)/0.6)]",
                  children: "—"
                }), B && f("span", {
                  className: "ml-auto shrink-0 whitespace-nowrap flex items-center gap-1 text-[10px] text-amber-300",
                  children: [i("span", {
                    className: "h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"
                  }), "NOW ", i(LiveClock, {})]
                })]
              }, h);
            })
          })]
        }), i("div", {
          className: "text-[11px] text-[hsl(var(--muted-foreground))] border-t border-border pt-4",
          children: "Mark Done before the deadline to earn points. If the deadline passes without Done, the same points are deducted automatically."
        }), i("mhs-waqt", {
          lang: l
        })]
      }), e === "habits" && f("div", {
        className: "space-y-6",
        children: [f("div", {
          className: "flex flex-wrap items-end justify-between gap-4 lg:gap-6",
          children: [f("div", {
            children: [i("div", {
              className: "text-[10px] uppercase tracking-[0.26em] text-[hsl(var(--primary))]",
              children: u.engineRoom
            }), i("h1", {
              className: "mt-1 text-2xl sm:text-3xl font-semibold tracking-tight",
              style: {
                fontFamily: "var(--font-display)"
              },
              children: u.controlPanel
            }), i("div", {
              className: "text-xs text-[hsl(var(--muted-foreground))] mt-1",
              children: u.everyReward
            })]
          }), f("button", {
            onClick: () => {
              ra(null), se({
                title: "",
                category: "Nafl",
                points: 25,
                deadline: "05:00:00",
                repeat: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                grace: 10,
                autoPenalty: !0,
                icon: "\uD83C\uDF19",
                color: "#00C853",
                focus: "Quran daily"
              }), Kr(!0);
            },
            className: "h-11 rounded-xl bg-[hsl(var(--primary))] px-5 text-sm font-medium text-[hsl(var(--primary-foreground))] active:scale-[0.97] flex items-center gap-2",
            children: ["+ ", u.createNew]
          })]
        }), i("div", {
          className: "flex flex-wrap gap-3 p-1 rounded-xl border border-border bg-[hsl(var(--card)/0.6)] w-fit",
          children: ["active", "paused", "archived"].map(a => {
            let h = o.filter(w => w.status === a).length;
            return f("button", {
              onClick: () => g(a),
              className: `rounded-lg px-4 py-2 text-[11px] font-medium active:scale-[0.97] transition-all ${m === a ? "bg-[hsl(var(--primary)/0.14)] text-[hsl(var(--primary))] ring-1 ring-[hsl(var(--primary)/0.25)]" : "text-[hsl(var(--muted-foreground))] hover:text-foreground"}`,
              children: [u[a], " ", i("span", {
                className: "num ml-1.5 opacity-60",
                children: h
              })]
            }, a);
          })
        }), f("div", {
          className: "space-y-4",
          children: [o.filter(a => a.status === m).map(a => f("div", {
            className: "panel p-5 sm:p-6 space-y-4 hover:border-[hsl(var(--primary)/0.20)] transition-colors",
            children: [f("div", {
              className: "flex flex-wrap items-start justify-between gap-3",
              children: [f("div", {
                className: "min-w-0",
                children: [f("div", {
                  className: "flex items-center gap-2",
                  children: [i("span", {
                    children: a.icon
                  }), i("span", {
                    className: "font-medium text-sm",
                    children: a.title
                  }), a.category === "Fard" && i("span", {
                    children: "\uD83D\uDD12"
                  })]
                }), f("div", {
                  className: "mt-3 flex flex-wrap gap-2 items-center",
                  children: [i("span", {
                    className: `rounded-full px-2 py-0.5 text-[10px] border ${a.category === "Fard" ? "bg-[#FF3B30]/15 border-[#FF3B30]/30 text-[#FF8A80]" : a.category === "Sunnah" ? "bg-[#FFCC02]/15 border-[#FFCC02]/30 text-[#FFCC02]" : a.category === "Nafl" ? "bg-[#00C853]/15 border-[#00C853]/30 text-[#6EFF9A]" : "bg-[#0A84FF]/15 border-[#0A84FF]/30 text-[#8AB4FF]"}`,
                    children: a.category
                  }), f("span", {
                    className: "num text-[11px]",
                    children: ["+", a.points, " pts"]
                  }), i("span", {
                    className: "num text-[11px] font-mono",
                    children: window.MHSPrayer && window.MHSPrayer.dl(a) ? "🕌 " + window.MHSPrayer.name(window.MHSPrayer.link(a)) + " • " + mhsT(a) + " (auto)" : a.deadline
                  }), a.repeat.map(h => i("span", {
                    className: "rounded-full border border-border px-2 py-0.5 text-[10px]",
                    children: h
                  }, h)), a.reminder && f("span", {
                    className: "rounded-full bg-[hsl(var(--primary)/0.12)] border border-[hsl(var(--primary)/0.2)] px-2 py-0.5 text-[10px] text-[hsl(var(--primary))]",
                    children: ["\uD83D\uDD14 ", a.reminder]
                  })]
                })]
              }), f("div", {
                className: "flex gap-2 flex-wrap",
                children: [i("button", {
                  onClick: () => {
                    ra(a), se(a), Kr(!0);
                  },
                  className: "h-11 min-h-[44px] min-w-[44px] rounded-xl border border-border px-3 text-xs active:scale-[0.97]",
                  children: "Edit"
                }), i("button", {
                  onClick: () => c(h => h.map(w => w.id === a.id ? {
                    ...w,
                    status: w.status === "active" ? "paused" : "active"
                  } : w)),
                  className: "h-11 min-h-[44px] min-w-[44px] rounded-xl border border-border px-3 text-xs active:scale-[0.97]",
                  children: a.status === "active" ? "Pause" : "Resume"
                }), i("button", {
                  onClick: () => c(h => h.map(w => w.id === a.id ? {
                    ...w,
                    status: "archived"
                  } : w)),
                  className: "h-11 min-h-[44px] min-w-[44px] rounded-xl border border-border px-3 text-xs active:scale-[0.97]",
                  children: "Archive"
                }), i("button", {
                  disabled: a.category === "Fard",
                  title: a.category === "Fard" ? u.fardLock : "",
                  onClick: () => {
                    if (a.category === "Fard") return;
                    c(h => h.filter(w => w.id !== a.id));
                  },
                  className: `h-11 min-h-[44px] min-w-[44px] rounded-xl border px-3 text-xs active:scale-[0.97] ${a.category === "Fard" ? "opacity-40 cursor-not-allowed border-border" : "border-[#FF3B30]/30 text-[#FF3B30] hover:bg-[#FF3B30]/10"}`,
                  children: "Delete"
                })]
              })]
            })]
          }, a.id)), o.filter(a => a.status === m).length === 0 && f("div", {
            className: "panel p-8 lg:p-10 text-center",
            children: [f("div", {
              className: "text-sm",
              children: u.noHabitsYet.replace("{status}", (u[m] || m).toLowerCase())
            }), i("div", {
              className: "text-xs text-[hsl(var(--muted-foreground))] mt-1",
              children: u.defineHabitHint
            })]
          })]
        }), o.length < 7 && f("div", {
          className: "panel p-5 sm:p-6 lg:p-8",
          children: [f("div", {
            className: "flex items-center justify-between gap-4",
            children: [i("h3", {
              className: "text-sm font-semibold",
              children: "Islamic Essentials • 7 habits one-tap wizard"
            }), i("button", {
              onClick: () => {
                const tplDL = {
                  "Fajr 2 Sunnah+2 Fard+Quran+Adhkar": ["05:00:00", "🌙", 30],
                  "Dhuhr 4 Fard": ["13:15:00", "☀️", 25],
                  "Asr 4 Fard": ["16:45:00", "🕌", 25],
                  "Maghrib 3 Fard+2 Sunnah": ["18:30:00", "🌅", 25],
                  "Isha 4 Fard+Witr": ["20:15:00", "✨", 25],
                  "Tahajjud 04:00": ["04:00:00", "🌙", 40],
                  "Quran Daily": ["21:00:00", "📖", 20]
                };
                const templates = Object.keys(tplDL);
                const existing = new Set((o || []).map(h => h.title));
                const toAdd = templates.filter(t => !existing.has(t)).map(a => {
                  const m = tplDL[a] || ["05:00:00", "🕌", 25];
                  return {
                    id: "h" + Date.now() + Math.random(),
                    title: a,
                    category: "Fard",
                    points: m[2],
                    deadline: m[0],
                    repeat: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                    grace: 0,
                    autoPenalty: !0,
                    icon: m[1],
                    color: "#00C853",
                    status: "active",
                    createdAt: Date.now()
                  };
                });
                if (toAdd.length) {
                  c(h => [...toAdd, ...h]);
                  vn(l === "ar" ? "تمت إضافة العادات" : "Habits added");
                } else vn(l === "ar" ? "كل العادات موجودة بالفعل" : "All habits already exist");
              },
              className: "h-11 rounded-xl bg-[hsl(var(--primary))] px-4 text-xs font-medium text-[hsl(var(--primary-foreground))] active:scale-[0.97]",
              children: "Add All"
            })]
          }), i("div", {
            className: "mt-4 grid gap-3 grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] min-w-0",
            children: ["Fajr 2 Sunnah+2 Fard+Quran+Adhkar", "Dhuhr 4 Fard", "Asr 4 Fard", "Maghrib 3 Fard+2 Sunnah", "Isha 4 Fard+Witr", "Tahajjud 04:00", "Quran Daily"].map(a => f("div", {
              className: "flex items-center justify-between rounded-xl border border-border p-4 text-xs gap-3",
              children: [i("span", {
                className: "min-w-0",
                children: a
              }), i("button", {
                onClick: () => {
                  const tplDL = {
                    "Fajr 2 Sunnah+2 Fard+Quran+Adhkar": ["05:00:00", "🌙", 30],
                    "Dhuhr 4 Fard": ["13:15:00", "☀️", 25],
                    "Asr 4 Fard": ["16:45:00", "🕌", 25],
                    "Maghrib 3 Fard+2 Sunnah": ["18:30:00", "🌅", 25],
                    "Isha 4 Fard+Witr": ["20:15:00", "✨", 25],
                    "Tahajjud 04:00": ["04:00:00", "🌙", 40],
                    "Quran Daily": ["21:00:00", "📖", 20]
                  };
                  const m = tplDL[a] || ["05:00:00", "🕌", 25];
                  c(h => [...h, {
                    id: "h" + Date.now() + Math.random(),
                    title: a,
                    category: "Fard",
                    points: m[2],
                    deadline: m[0],
                    repeat: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                    grace: 0,
                    autoPenalty: !0,
                    icon: m[1],
                    color: "#00C853",
                    status: "active",
                    createdAt: Date.now()
                  }]);
                },
                className: "h-8 rounded-lg border border-border px-2.5 text-[11px] shrink-0",
                children: "Add"
              })]
            }, a))
          })]
        })]
      }), e === "ledger" && f("div", {
        className: "space-y-6",
        children: [f("div", {
          className: "flex flex-wrap items-end justify-between gap-4 lg:gap-6",
          children: [f("div", {
            children: [i("div", {
              className: "text-[10px] uppercase tracking-[0.26em] text-[hsl(var(--primary))]",
              children: u.auditTrail
            }), i("h1", {
              className: "mt-1 text-2xl sm:text-3xl font-semibold tracking-tight",
              style: {
                fontFamily: "var(--font-display)"
              },
              children: u.ledger
            }), i("div", {
              className: "text-xs text-[hsl(var(--muted-foreground))] mt-1",
              children: u.everyRewardLedger
            })]
          }), i("div", {
            className: "flex gap-1.5 p-1 rounded-xl border border-border bg-[hsl(var(--card)/0.6)]",
            children: ["all", "gains", "losses"].map(a => i("button", {
              onClick: () => E(a),
              className: `rounded-lg px-4 py-2 text-[11px] font-medium active:scale-[0.97] transition-all ${y === a ? "bg-[hsl(var(--primary)/0.14)] text-[hsl(var(--primary))] ring-1 ring-[hsl(var(--primary)/0.25)]" : "text-[hsl(var(--muted-foreground))] hover:text-foreground"}`,
              children: u[a]
            }, a))
          })]
        }), f("div", {
          className: "grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6 min-w-0",
          children: [f("div", {
            className: "panel px-5 py-4",
            children: [i("div", {
              className: "text-[10px] uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]",
              children: u.entries
            }), i("div", {
              className: "num text-xl mt-1",
              children: s.length
            })]
          }), f("div", {
            className: "panel px-5 py-4",
            children: [i("div", {
              className: "text-[10px] uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]",
              children: u.netPoints
            }), i("div", {
              className: `num text-xl mt-1 ${Number(Nu) < 0 ? "text-[#FF3B30]" : "text-[#00C853]"}`,
              children: Number(Nu) > 0 ? "+" + Nu : Nu
            })]
          })]
        }), f("div", {
          className: "flex gap-3 min-w-0",
          children: [i("input", {
            value: P,
            onChange: a => C(a.target.value),
            onKeyDown: a => { if (a.key === "Escape" && P) { a.stopPropagation(); C(""); p(""); } },
            type: "search",
            "aria-label": "Search the ledger",
            placeholder: u.searchLedger,
            className: "flex-1 min-w-0 rounded-xl border border-border bg-[hsl(var(--card)/0.8)] px-5 py-3 text-sm placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary)/0.4)]"
          }), i("button", {
            type: "button",
            onClick: () => { C(""); p(""); },
            disabled: !P,
            "aria-label": "Clear search",
            className: "h-11 rounded-xl border border-border px-5 text-xs shrink-0 disabled:opacity-40 disabled:cursor-default",
            children: "Clear"
          })]
        }), i("div", {
          className: "space-y-4",
          children: (() => {
            let a = [...s].sort((w, L) => L.ts - w.ts || w.id.localeCompare(L.id));
            if (y === "gains") a = a.filter(w => w.delta > 0);
            if (y === "losses") a = a.filter(w => w.delta < 0);
            if (M) a = a.filter(w => [w.reason, w.note, w.type, mhsEntryTypeLabel(w.type, l), window.MHSBengali && window.MHSBengali[mhsEntryTypeLabel(w.type, "en")]].filter(Boolean).join(" ").toLowerCase().includes(M.trim().toLowerCase()));
            if (a.length === 0) return f("div", {
              className: "panel p-8 text-center",
              children: [i("div", {
                className: "text-sm",
                children: u.nothingLogged
              }), i("div", {
                className: "text-xs text-[hsl(var(--muted-foreground))] mt-1",
                children: u.checkInHint
              })]
            });
            let h = {};
            return a.forEach(w => {
              let L = new Date(w.ts).toDateString();
              if (!h[L]) h[L] = [];
              h[L].push(w);
            }), Object.entries(h).map(([w, L]) => f("div", {
              className: "space-y-2",
              children: [i("div", {
                className: "sticky top-[60px] lg:top-0 z-10 -mx-1 bg-[hsl(var(--background)/0.8)] backdrop-blur px-1 py-1 text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]",
                children: w
              }), L.map(B => f("div", {
                className: "panel p-5 flex flex-col sm:flex-row justify-between gap-4 hover:border-[hsl(var(--primary)/0.20)] transition-colors",
                children: [f("div", {
                  className: "min-w-0 flex-1",
                  children: [f("div", {
                    className: "flex items-center gap-2 flex-wrap",
                    children: [i("span", {
                      className: "num text-[11px] font-mono text-[hsl(var(--muted-foreground))]",
                      children: Mn(new Date(B.ts))
                    }), f("span", {
                      className: `num text-[11px] sm:text-xs font-semibold ${B.delta > 0 ? "text-[#00C853]" : "text-[#FF3B30]"}`,
                      children: [B.delta > 0 ? "+" : "", B.delta]
                    }), i("span", {
                      className: "rounded-full border border-border px-2.5 py-1 text-[10px]",
                      children: mhsEntryTypeLabel(B.type, l)
                    }), B.audit && i("span", {
                      className: "rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] text-amber-300",
                      children: B.audit
                    })]
                  }), i("div", {
                    className: "mt-1 text-sm font-medium truncate",
                    children: B.reason
                  }), B.note && i("div", {
                    className: "text-[11px] text-[hsl(var(--muted-foreground))] mt-0.5",
                    children: B.note
                  })]
                }), f("div", {
                  className: "flex gap-1.5 self-start shrink-0",
                  children: [i("button", {
                    title: "Edit entry",
                    "aria-label": "Edit",
                    onClick: () => {
                      Fr(B), Vt({
                        reason: B.reason,
                        delta: B.delta,
                        note: B.note || "",
                        type: B.type
                      });
                    },
                    className: "h-9 w-9 rounded-lg border border-border flex items-center justify-center hover:bg-accent hover:border-[hsl(var(--primary)/0.30)] transition-all active:scale-[0.97]",
                    children: f("svg", {
                      width: "14",
                      height: "14",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      children: [i("path", {
                        d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                      }), i("path", {
                        d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                      })]
                    })
                  }), i("button", {
                    title: "Delete entry",
                    "aria-label": "Delete",
                    onClick: () => Cu(B.id),
                    className: "h-9 w-9 rounded-lg border border-border flex items-center justify-center hover:bg-[#FF3B30]/10 hover:border-[#FF3B30]/30 hover:text-[#FF3B30] transition-all active:scale-[0.97]",
                    children: f("svg", {
                      width: "14",
                      height: "14",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      children: [i("polyline", {
                        points: "3 6 5 6 21 6"
                      }), i("path", {
                        d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                      }), i("line", {
                        x1: "10",
                        y1: "11",
                        x2: "10",
                        y2: "17"
                      }), i("line", {
                        x1: "14",
                        y1: "11",
                        x2: "14",
                        y2: "17"
                      })]
                    })
                  })]
                })]
              }, B.id))]
            }, w));
          })()
        })]
      }), f("div", { className: "space-y-6", style: { display: e === "settings" ? "block" : "none" }, children: [f("div", {
          className: "space-y-2",
          children: [i("div", {
            className: "text-[10px] uppercase tracking-[0.26em] text-[hsl(var(--primary))]",
            children: l === "bn" ? "আপনার অ্যাপ, আপনার পছন্দ" : l === "ar" ? "تفضيلاتك" : "Your app, your preferences"
          }), i("h1", {
            className: "mt-1 text-2xl sm:text-3xl font-semibold tracking-tight",
            style: {
              fontFamily: "var(--font-display)"
            },
            children: l === "bn" ? "সেটিংস" : l === "ar" ? "الإعدادات" : "Settings"
          }), f("div", {
            className: "text-xs text-[hsl(var(--muted-foreground))] mt-1",
            children: l === "bn" ? "ভাষা, থিম, লোকেশন, নোটিফিকেশন ও ব্যাকআপ নিয়ন্ত্রণ করুন।" : l === "ar" ? "إدارة اللغة والمظهر والموقع والإشعارات والنسخ الاحتياطي." : "Manage language, appearance, location, notifications and backups."
          })]
        }), i(MhsPreferences, { lang: l, setLanguage: r })] }), e === "settings" && f("div", {
        className: "space-y-6",
        children: [
        i("mhs-prayer", { lang: l }), i("mhs-remind", { lang: l }), i('section', {className:'panel mhs-preferences', children:f('div', {children:[i('h2',{children:l === 'bn' ? 'দিনলিপির পছন্দ' : l === 'ar' ? 'تفضيلات اليوميات' : 'Journal preferences'}), i('p',{children:l === 'bn' ? 'লেখার আকার, রিমাইন্ডার, দৈনিক লক্ষ্য ও আত্মপর্যালোচনার ধরন।' : l === 'ar' ? 'حجم النص والتذكيرات وأهداف الكتابة.' : 'Text size, reminders, writing goals and reflection prompts.'}), i('button',{type:'button',onClick:()=>window.MHSJournal?.openSettings(),children:l === 'bn' ? 'দিনলিপি কনফিগার করুন' : l === 'ar' ? 'إعداد اليوميات' : 'Configure journal'})]})}), f("div", {
          className: "panel p-6 sm:p-8 lg:p-8 space-y-6",
          children: [f("div", {
            className: "flex items-start gap-5",
            children: [i("div", {
              className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--primary)/0.12)] ring-1 ring-[hsl(var(--primary)/0.25)] text-[hsl(var(--primary))]",
              children: f("svg", {
                width: "20",
                height: "20",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.8",
                children: [i("path", {
                  d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                }), i("polyline", {
                  points: "7 10 12 15 17 10"
                }), i("line", {
                  x1: "12",
                  y1: "15",
                  x2: "12",
                  y2: "3"
                })]
              })
            }), f("div", {
              children: [i("h3", {
                className: "text-[15px] font-semibold tracking-tight",
                style: {
                  fontFamily: "var(--font-display)"
                },
                children: u.backupData
              }), i("div", {
                className: "text-sm text-[hsl(var(--muted-foreground))] mt-1",
                children: "Your data stays on your device. Export to backup, import to restore."
              }), i("div", {
                className: "mt-1 text-[11px] text-[hsl(var(--muted-foreground)/0.7)]",
                children: "Muhasabah v1.3.0 · Make Habit, Get Reward · Saved automatically on this device"
              })]
            })]
          }), f("div", {
            className: "grid gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] min-w-0 pt-3",
            children: [f("button", {
              onClick: sA,
              className: "h-11 rounded-xl bg-[hsl(var(--primary))] px-5 text-sm font-medium text-[hsl(var(--primary-foreground))] active:scale-[0.97] flex items-center justify-center gap-2",
              children: [f("svg", {
                width: "16",
                height: "16",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                children: [i("path", {
                  d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                }), i("polyline", {
                  points: "7 10 12 15 17 10"
                }), i("line", {
                  x1: "12",
                  y1: "15",
                  x2: "12",
                  y2: "3"
                })]
              }), u.exportNow]
            }), f("label", {
              className: "h-11 rounded-xl border border-border px-5 text-sm font-medium flex items-center justify-center gap-2 cursor-pointer active:scale-[0.97] hover:border-[hsl(var(--primary)/0.30)]",
              children: [f("svg", {
                width: "16",
                height: "16",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                children: [i("path", {
                  d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                }), i("polyline", {
                  points: "17 8 12 3 7 8"
                }), i("line", {
                  x1: "12",
                  y1: "3",
                  x2: "12",
                  y2: "15"
                })]
              }), u.importFile, i("input", {
                type: "file",
                accept: ".json",
                className: "hidden",
                onChange: a => {
                  let h = a.target.files?.[0];
                  if (!h) return;
                  if (h.size > 10000000) { vn(l === "bn" ? "ফাইলটি খুব বড় (সর্বোচ্চ ১০ MB)" : "File exceeds 10 MB"); a.target.value = ""; return; }
                  let w = new FileReader();
                  w.onload = () => {
                    try {
                      let L = JSON.parse(w.result);
                      if (!L || typeof L !== 'object' || Array.isArray(L) || (!L.habits && !L.ledger && !L.journal) || ['habits','todos','ledger'].some(key => L[key] !== undefined && (!Array.isArray(L[key]) || L[key].some(item => !item || typeof item !== 'object' || typeof item.id !== 'string'))) || L.habits?.some(item => typeof item.title !== 'string' || !Array.isArray(item.repeat)) || L.todos?.some(item => typeof item.title !== 'string') || L.ledger?.some(item => !Number.isFinite(item.ts) || !Number.isFinite(item.delta)) || (L.journal !== undefined && (!L.journal || typeof L.journal !== 'object' || Array.isArray(L.journal)))) {
                        vn("Invalid file");
                        return;
                      }
                      zu({
                        data: L,
                        fileName: h.name
                      });
                    } catch {
                      vn("Invalid JSON");
                    }
                  }, w.readAsText(h), a.target.value = "";
                }
              })]
            })]
          }), i("button", {
            onClick: () => {
              if (!cf) {
                setCf(!0), setTimeout(() => setCf(!1), 4000);
                return;
              }
              c([]), twS([]), d([]), window.MHSJournal?.restore({}, false), tA(new Set()), setCf(!1), vn(l === "ar" ? "تم مسح كل البيانات" : "All data cleared");
            },
            className: "h-11 rounded-xl border border-[#FF3B30]/30 text-[#FF3B30] px-5 text-sm font-medium active:scale-[0.97] hover:bg-[#FF3B30]/10",
            children: cf ? l === "ar" ? "اضغط مرة أخرى للتأكيد" : "Tap again to confirm" : u.clearAll
          }), f("div", {
            className: "text-[11px] text-[hsl(var(--muted-foreground)/0.7)] border-t border-border pt-4",
            children: ["Export generates dated file ", f("span", {
              className: "num",
              children: ["muhasabah_export_", new Date().toISOString().slice(0, 10), ".json"]
            }), " • Import replaces current data after confirmation • No cloud login required"]
          })]
        }), i("mhs-backup", {
          lang: l
        }), f("div", {
          className: "text-[10px] text-[hsl(var(--muted-foreground)/0.7)]",
          children: ["v1.3.0 • Saved on this device • ", i(LiveClock, {})]
        })]
      })]
    }), i("nav", {
      "aria-label": "Main navigation",
      className: "side-rail",
      style: {
        backdropFilter: "blur(20px) saturate(150%)"
      },
      children: [{
        k: "dashboard",
        label: u.dash,
        icon: "◫"
      }, {
        k: "today",
        label: u.today,
        icon: "◪"
      }, {
        k: "habits",
        label: u.habits,
        icon: "⬢"
      }, {
        k: "ledger",
        label: u.ledger,
        icon: "≡"
      }, {
        k: "settings",
        label: l === "bn" ? "সেটিংস" : l === "ar" ? "الإعدادات" : "Settings",
        icon: "⚙"
      }].map(a => f("button", {
        onClick: () => n(a.k),
        title: a.label,
        "aria-label": a.label,
        "aria-current": e === a.k ? "page" : void 0,
        className: `rail-btn${e === a.k ? " is-active" : ""}`,
        children: [i("span", {
          className: "rail-ico",
          children: a.icon
        }), i("span", {
          className: "rail-lbl",
          children: a.label
        })]
      }, a.k))
    }), hu && i("div", {
      className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur p-4 kb-modal-root",
      children: f("div", {
        className: "panel w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto kb-modal-panel",
        children: [f("div", {
          className: "flex items-center justify-between",
          children: [i("h3", {
            className: "font-semibold",
            children: "Add Reward • Manual"
          }), i("button", {
            onClick: () => gu(!1),
            className: "h-8 w-8 rounded-lg border border-border flex items-center justify-center",
            children: "✕"
          })]
        }), f("div", {
          className: "space-y-3",
          children: [f("div", {
            children: [i("label", {
              className: "text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]",
              children: "Title *"
            }), i("input", {
              value: ce.title,
              onChange: a => Mt({
                ...ce,
                title: a.target.value
              }),
              placeholder: "Unexpected charity, extra dhikr...",
              className: "mt-1 w-full rounded-xl border border-border bg-[hsl(var(--card)/0.8)] px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary)/0.4)]"
            })]
          }), f("div", {
            children: [i("label", {
              className: "text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]",
              children: "Points"
            }), f("div", {
              className: "mt-1 flex gap-1.5",
              children: [[10, 15, 25, 30, 40].map(a => i("button", {
                onClick: () => Mt({
                  ...ce,
                  points: a
                }),
                className: `h-9 rounded-lg border px-3 text-xs ${ce.points === a ? "bg-[hsl(var(--primary)/0.15)] border-[hsl(var(--primary)/0.3)] text-[hsl(var(--primary))]" : "border-border"}`,
                children: a
              }, a)), i("input", {
                type: "number",
                value: ce.points,
                onChange: a => Mt({
                  ...ce,
                  points: Number(a.target.value)
                }),
                className: "ml-2 w-20 rounded-lg border border-border bg-transparent px-3 py-2 text-sm num"
              })]
            })]
          }), f("div", {
            children: [i("label", {
              className: "text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]",
              children: "Note 5+ chars *"
            }), i("textarea", {
              value: ce.note,
              onChange: a => Mt({
                ...ce,
                note: a.target.value
              }),
              placeholder: "Alhamdulillah, exact reason...",
              rows: 4,
              className: "mt-1 w-full rounded-xl border border-border bg-[hsl(var(--card)/0.8)] px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary)/0.4)]"
            })]
          }), f("button", {
            disabled: ce.title.length < 2 || ce.note.length < 5,
            onClick: aA,
            className: "h-11 w-full rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-medium disabled:opacity-40 active:scale-[0.97]",
            children: ["Save +", ce.points]
          })]
        })]
      })
    }), ku && i("div", {
      className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur p-4 kb-modal-root",
      children: f("div", {
        className: "panel w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto kb-modal-panel",
        children: [f("div", {
          className: "flex items-center justify-between",
          children: [i("h3", {
            className: "font-semibold",
            children: "Deduct Penalty • Manual"
          }), i("button", {
            onClick: () => Su(!1),
            className: "h-8 w-8 rounded-lg border border-border flex items-center justify-center",
            children: "✕"
          })]
        }), f("div", {
          className: "space-y-3",
          children: [f("div", {
            children: [i("label", {
              className: "text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]",
              children: "Title *"
            }), i("input", {
              value: fe.title,
              onChange: a => Dt({
                ...fe,
                title: a.target.value
              }),
              placeholder: "Distraction, late wake...",
              className: "mt-1 w-full rounded-xl border border-border bg-[hsl(var(--card)/0.8)] px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF3B30]/40"
            })]
          }), f("div", {
            children: [i("label", {
              className: "text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]",
              children: "Points"
            }), f("div", {
              className: "mt-1 flex gap-1.5",
              children: [[10, 15, 20, 25].map(a => i("button", {
                onClick: () => Dt({
                  ...fe,
                  points: a
                }),
                className: `h-9 rounded-lg border px-3 text-xs ${fe.points === a ? "bg-[#FF3B30]/15 border-[#FF3B30]/30 text-[#FF3B30]" : "border-border"}`,
                children: a
              }, a)), i("input", {
                type: "number",
                value: fe.points,
                onChange: a => Dt({
                  ...fe,
                  points: Number(a.target.value)
                }),
                className: "ml-2 w-20 rounded-lg border border-border bg-transparent px-3 py-2 text-sm num"
              })]
            })]
          }), f("div", {
            children: [i("label", {
              className: "text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]",
              children: "Note 5+ chars *"
            }), i("textarea", {
              value: fe.note,
              onChange: a => Dt({
                ...fe,
                note: a.target.value
              }),
              placeholder: "Audit reason, exact...",
              rows: 4,
              className: "mt-1 w-full rounded-xl border border-border bg-[hsl(var(--card)/0.8)] px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF3B30]/40"
            })]
          }), f("button", {
            disabled: fe.title.length < 2 || fe.note.length < 5,
            onClick: cA,
            className: "h-11 w-full rounded-xl bg-[#FF3B30] text-white text-sm font-medium disabled:opacity-40 active:scale-[0.97]",
            children: ["Save -", fe.points]
          })]
        })]
      })
    }), wu && i("div", {
      className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur p-4 kb-modal-root",
      children: f("div", {
        className: "panel w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4 kb-modal-panel",
        children: [f("div", {
          className: "flex items-center justify-between",
          children: [f("h3", {
            className: "font-semibold",
            children: [Wt ? "Edit Habit" : "Create Habit", " • Engine Room"]
          }), i("button", {
            onClick: () => Kr(!1),
            className: "h-8 w-8 rounded-lg border border-border flex items-center justify-center",
            children: "✕"
          })]
        }), f("div", {
          className: "space-y-3",
          children: [f("div", {
            children: [i("label", {
              className: "text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]",
              children: "Title *"
            }), i("input", {
              value: _.title || "",
              onChange: a => se({
                ..._,
                title: a.target.value
              }),
              className: "mt-1 w-full rounded-xl border border-border bg-[hsl(var(--card)/0.8)] px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary)/0.4)]",
              placeholder: "Fajr • Quran..."
            })]
          }), f("div", {
            children: [i("label", {
              className: "text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]",
              children: "Description"
            }), i("textarea", {
              value: _.desc || "",
              onChange: a => se({
                ..._,
                desc: a.target.value
              }),
              rows: 2,
              className: "mt-1 w-full rounded-xl border border-border bg-[hsl(var(--card)/0.8)] px-4 py-2.5 text-sm"
            })]
          }), f("div", {
            className: "grid grid-cols-2 gap-3",
            children: [f("div", {
              children: [i("label", {
                className: "text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]",
                children: "Category"
              }), f("select", {
                value: _.category,
                onChange: a => se({
                  ..._,
                  category: a.target.value
                }),
                className: "mt-1 w-full rounded-xl border border-border bg-[hsl(var(--card))] px-3 py-2.5 text-sm",
                children: [i("option", {
                  children: "Fard"
                }), i("option", {
                  children: "Sunnah"
                }), i("option", {
                  children: "Nafl"
                }), i("option", {
                  children: "Others"
                })]
              })]
            }), f("div", {
              children: [i("label", {
                className: "text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]",
                children: "Focus Area"
              }), i("input", {
                value: _.focus || "",
                onChange: a => se({
                  ..._,
                  focus: a.target.value
                }),
                className: "mt-1 w-full rounded-xl border border-border bg-[hsl(var(--card)/0.8)] px-3 py-2.5 text-sm",
                placeholder: "Quran daily"
              })]
            })]
          }), f("div", {
            children: [f("label", {
              className: "text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]",
              children: ["Point Weight 1-100 • ", _.points]
            }), f("div", {
              className: "mt-2 flex gap-2 items-center",
              children: [i("input", {
                type: "range",
                min: 1,
                max: 100,
                value: _.points || 25,
                onChange: a => se({
                  ..._,
                  points: Number(a.target.value)
                }),
                className: "flex-1 accent-[#00C853]"
              }), i("span", {
                className: "num text-sm w-10",
                children: _.points
              })]
            }), i("div", {
              className: "mt-1 flex gap-1",
              children: [10, 15, 25, 30, 40].map(a => i("button", {
                onClick: () => se({
                  ..._,
                  points: a
                }),
                className: `h-7 rounded-lg border px-2.5 text-[11px] ${_.points === a ? "bg-[hsl(var(--primary)/0.15)] border-[hsl(var(--primary)/0.3)] text-[hsl(var(--primary))]" : "border-border"}`,
                children: a
              }, a))
            })]
          }), f("div", {
            children: [i("label", {
              className: "text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]",
              children: "Deadline HH:MM:SS"
            }), i("input", {
              type: "time",
              step: 1,
              value: _.deadline || "05:00:00",
              onChange: a => se({
                ..._,
                deadline: a.target.value
              }),
              className: "mt-1 w-full rounded-xl border border-border bg-[hsl(var(--card)/0.8)] px-3 py-2.5 text-sm num"
            }), i("div", {
              className: "mt-1 text-[10px] text-[hsl(var(--muted-foreground))]",
              children: "Done before deadline = +points. Missed = auto -points."
            }), Wt && window.MHSPrayer && window.MHSPrayer.dl(Wt) && i("div", {
              className: "mt-1 text-[10px] text-[#6EFF9A]",
              children: "🕌 Linked to " + window.MHSPrayer.name(window.MHSPrayer.link(Wt)) + " — today's deadline is " + mhsT(Wt) + " from real prayer times. Change in Settings → Prayer times."
            })]
          }), f("div", {
            children: [i("label", {
              className: "text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]",
              children: "Repeat"
            }), f("div", {
              className: "mt-1 flex flex-wrap gap-1.5",
              children: [["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(a => i("button", {
                onClick: () => {
                  let h = _.repeat || [];
                  se({
                    ..._,
                    repeat: h.includes(a) ? h.filter(w => w !== a) : [...h, a]
                  });
                },
                className: `rounded-full border px-3 py-1.5 text-[11px] ${_.repeat?.includes(a) ? "bg-[hsl(var(--primary)/0.12)] border-[hsl(var(--primary)/0.3)] text-[hsl(var(--primary))]" : "border-border"}`,
                children: a
              }, a)), i("button", {
                onClick: () => se({
                  ..._,
                  repeat: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                }),
                className: "rounded-full border border-border px-3 py-1.5 text-[11px]",
                children: "Everyday"
              })]
            })]
          }), f("div", {
            children: [i("label", {
              className: "text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]",
              children: "Icon • 50 emoji"
            }), i("div", {
              className: "mt-2 grid grid-cols-8 gap-1.5 max-h-28 overflow-y-auto",
              children: Yv.map(a => i("button", {
                onClick: () => se({
                  ..._,
                  icon: a
                }),
                className: `h-9 w-9 rounded-xl border flex items-center justify-center text-sm ${_.icon === a ? "bg-[hsl(var(--primary)/0.15)] border-[hsl(var(--primary)/0.35)] ring-1 ring-[hsl(var(--primary)/0.25)]" : "border-border"}`,
                children: a
              }, a))
            })]
          }), f("div", {
            children: [i("label", {
              className: "text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]",
              children: "Color • 12"
            }), i("div", {
              className: "mt-1 flex flex-wrap gap-2",
              children: Jv.map(a => i("button", {
                onClick: () => se({
                  ..._,
                  color: a
                }),
                className: `h-8 w-8 rounded-full border-2 ${_.color === a ? "ring-2 ring-white" : "border-transparent"}`,
                style: {
                  background: a
                }
              }, a))
            })]
          }), f("div", {
            children: [i("label", {
              className: "text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]",
              children: "Templates • 20 Ready one-tap"
            }), i("div", {
              className: "mt-1 flex gap-1.5 overflow-x-auto scrollbar-hide pb-1",
              children: Gv.map(a => i("button", {
                onClick: () => se({
                  ..._,
                  title: a
                }),
                className: "whitespace-nowrap rounded-full border border-border px-3 py-1.5 text-[11px] shrink-0",
                children: a
              }, a))
            })]
          }), f("button", {
            disabled: !_.title || _.title.trim().length < 2,
            onClick: () => {
              let a = {
                ...Wt,
                id: Wt?.id || "h" + Date.now(),
                title: _.title.trim() || "New Habit",
                desc: _.desc,
                category: _.category || "Nafl",
                points: _.points || 25,
                deadline: _.deadline || "05:00:00",
                repeat: _.repeat || ["Mon", "Tue"],
                grace: Math.max(0, Number(_.grace) || 0),
                autoPenalty: _.autoPenalty !== false,
                icon: _.icon || "\uD83C\uDF19",
                color: _.color || "#00C853",
                status: "active",
                focus: _.focus,
                createdAt: Wt && Wt.createdAt ? Wt.createdAt : Date.now()
              };
              if (Wt) c(h => h.map(w => w.id === Wt.id ? {
                ...a,
                status: w.status || "active"
              } : w));else c(h => [a, ...h]);
              Kr(!1);
            },
            className: "h-11 w-full rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-medium disabled:opacity-40 active:scale-[0.97]",
            children: [Wt ? "Save" : "Create", " • Exact HH:MM:SS"]
          })]
        })]
      })
    }), twM && i("div", {
      className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur p-4 kb-modal-root mhs-todo-modal",
      onClick: a => {
        a.target === a.currentTarget && twMf(!1);
      },
      children: f("div", {
        className: "panel w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4 kb-modal-panel",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "mhs-tw-title",
        onKeyDown: a => {
          a.key === "Escape" && (a.stopPropagation(), twMf(!1));
        },
        children: [f("div", {
          className: "flex items-center justify-between",
          children: [f("h3", {
            className: "font-semibold",
            id: "mhs-tw-title",
            children: [twE ? l === "ar" ? "تعديل مهمة • قائمة المهام" : "Edit Todo • Todo List" : l === "ar" ? "مهمة جديدة • قائمة المهام" : "New Todo • Todo List"]
          }), i("button", {
            type: "button",
            onClick: () => twMf(!1),
            "aria-label": "Close",
            className: "h-8 w-8 rounded-lg border border-border flex items-center justify-center",
            children: "✕"
          })]
        }), f("div", {
          className: "space-y-3",
          children: [f("div", {
            children: [i("label", {
              htmlFor: "mhs-tw-name",
              className: "text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]",
              children: l === "ar" ? "العنوان *" : "Title *"
            }), i("input", {
              id: "mhs-tw-name",
              autoFocus: !0,
              maxLength: 200,
              enterKeyHint: "done",
              onKeyDown: a => {
                a.key === "Enter" && !a.nativeEvent.isComposing && (a.preventDefault(), twSave());
              },
              value: twF.title || "",
              onChange: a => twFs({
                ...twF,
                title: a.target.value
              }),
              className: "mt-1 w-full rounded-xl border border-border bg-[hsl(var(--card)/0.8)] px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary)/0.4)]",
              placeholder: l === "ar" ? "مثال: تسديد الفواتير • مكالمة…" : "e.g. Pay bills • Call Ali • Juz memorised"
            })]
          }), f("div", {
            className: "grid grid-cols-2 gap-3",
            children: [f("div", {
              children: [i("label", {
                htmlFor: "mhs-tw-pts",
                className: "text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]",
                children: l === "ar" ? "نقاط المكافأة" : "Reward Points"
              }), i("input", {
                id: "mhs-tw-pts",
                type: "number",
                min: "0",
                value: twF.points,
                onChange: a => twFs({
                  ...twF,
                  points: a.target.value
                }),
                className: "mt-1 w-full rounded-xl border border-border bg-[hsl(var(--card)/0.8)] px-4 py-2.5 text-sm num"
              })]
            }), f("div", {
              children: [i("label", {
                htmlFor: "mhs-tw-pen",
                className: "text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]",
                children: l === "ar" ? "نقاط الخصم" : "Penalty Points"
              }), i("input", {
                id: "mhs-tw-pen",
                type: "number",
                min: "0",
                value: twF.penalty,
                onChange: a => twFs({
                  ...twF,
                  penalty: a.target.value
                }),
                className: "mt-1 w-full rounded-xl border border-border bg-[hsl(var(--card)/0.8)] px-4 py-2.5 text-sm num"
              })]
            })]
          }), f("div", {
            className: "grid grid-cols-2 gap-3",
            children: [f("div", {
              children: [i("label", {
                htmlFor: "mhs-tw-dl",
                className: "text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]",
                children: l === "ar" ? "الموعد النهائي" : "Deadline"
              }), i("input", {
                id: "mhs-tw-dl",
                type: "time",
                step: "60",
                value: String(twF.deadline || "").slice(0, 5),
                onChange: a => twFs({
                  ...twF,
                  deadline: a.target.value ? a.target.value + ":00" : ""
                }),
                className: "mt-1 w-full rounded-xl border border-border bg-[hsl(var(--card)/0.8)] px-4 py-2.5 text-sm num"
              })]
            }), f("div", {
              children: [i("label", {
                htmlFor: "mhs-tw-ic",
                className: "text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]",
                children: l === "ar" ? "الأيقونة" : "Icon"
              }), i("input", {
                id: "mhs-tw-ic",
                value: twF.icon || "",
                maxLength: "32",
                onChange: a => twFs({
                  ...twF,
                  icon: a.target.value
                }),
                className: "mt-1 w-full rounded-xl border border-border bg-[hsl(var(--card)/0.8)] px-4 py-2.5 text-sm text-center"
              })]
            })]
          }), f("div", {
            className: "mhs-tw-presets",
            role: "group",
            "aria-label": "Quick deadline",
            children: [["⏱ 1h", () => {
              let a = new Date(Date.now() + 36e5);
              return a.getDate() !== new Date().getDate() ? "23:59:00" : String(a.getHours()).padStart(2, "0") + ":" + String(a.getMinutes()).padStart(2, "0") + ":00";
            }], ["🌅 12:00", () => "12:00:00"], ["🌇 18:00", () => "18:00:00"], ["🌙 21:00", () => "21:00:00"], ["🕛 23:59", () => "23:59:00"]].map(([lb, fn]) => i("button", {
              type: "button",
              onClick: () => twFs(prev => ({...prev, deadline: fn()})),
              "aria-pressed": lb.length > 4 && String(twF.deadline || "").slice(0, 5) === lb.slice(-5),
              children: lb
            }, lb))
          }), i("div", {
            className: "mhs-icon-picker",
            role: "group",
            "aria-label": l === "bn" ? "আইকন বাছাই করুন" : "Choose icon",
            children: ["📌", "📚", "🕌", "💼", "🏃", "💧", "🌙", "✅", "📞", "✍️", "🎯", "🏠", "🤲", "💰", "🍃", "🧘"].map(icon => i("button", {
              type: "button", "aria-label": icon, "aria-pressed": twF.icon === icon,
              onClick: () => twFs(prev => ({...prev, icon})), children: icon
            }, icon))
          }), i("div", {
            className: "text-[11px] text-[hsl(var(--muted-foreground))] leading-relaxed border-t border-border pt-3",
            children: l === "ar" ? "أكمل قبل الموعد النهائي لتكسب المكافأة. إذا فات الموعد دون إتمام، يُخصم الخصم تلقائياً مرة واحدة." : "Complete before the deadline to earn the reward. If the deadline passes without Done, the penalty is deducted automatically once."
          }), i("button", {
            type: "button",
            onClick: twSave,
            disabled: twF.title.trim().length < 2,
            className: "h-11 w-full rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-medium disabled:opacity-40 active:scale-[0.97]",
            children: [twE ? l === "ar" ? "حفظ التغييرات" : "Save Changes" : l === "ar" ? "إنشاء المهمة" : "Create Todo"]
          })]
        })]
      })
    }), Oe && i("div", {
      className: "fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur p-4",
      children: f("div", {
        className: "panel w-full max-w-lg p-5 space-y-4 max-h-[85vh] overflow-y-auto",
        children: [f("div", {
          className: "flex items-center justify-between",
          children: [f("h3", {
            className: "font-semibold",
            children: ["Candle • ", Oe.date]
          }), i("button", {
            onClick: () => ta(null),
            className: "h-8 w-8 rounded-lg border border-border flex items-center justify-center",
            children: "✕"
          })]
        }), f("div", {
          className: "flex items-center gap-2 text-[11px] text-[hsl(var(--muted-foreground))] border-t border-border pt-3",
          children: [f("span", {
            className: "num",
            children: [Oe.trades.length, " trades"]
          })]
        }), i("div", {
          className: "space-y-2 max-h-64 overflow-y-auto",
          children: Oe.trades.map(a => f("div", {
            className: "flex justify-between gap-2 rounded-xl border border-border p-3 text-xs",
            children: [f("div", {
              children: [i("div", {
                className: "num text-[11px] text-[hsl(var(--muted-foreground))]",
                children: Mn(new Date(a.ts))
              }), i("div", {
                className: "font-medium",
                children: a.reason
              }), i("div", {
                className: "text-[11px] text-[hsl(var(--muted-foreground))]",
                children: a.note
              })]
            }), f("div", {
              className: `num font-bold ${a.delta > 0 ? "text-[#00C853]" : "text-[#FF3B30]"}`,
              children: [a.delta > 0 ? "+" : "", a.delta]
            })]
          }, a.id))
        })]
      })
    }), Eu && i("div", {
      className: "fixed inset-0 z-[100] flex items-center justify-center bg-[hsl(var(--background))] p-4",
      children: f("div", {
        className: "relative max-w-md w-full p-8 sm:p-10 rounded-[1.5rem] border border-white/10 border-t-white/20 bg-gradient-to-br from-white/[0.08] to-white/[0.03] backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36),inset_0_1px_0_0_rgba(255,255,255,0.10)] text-center space-y-6 overflow-hidden",
        style: {
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)"
        },
        children: [i("div", {
          className: "pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(120%_80%_at_0%_0%,rgba(255,255,255,0.10),transparent_60%)]"
        }), i("div", {
          className: "pointer-events-none absolute -top-20 -left-20 h-40 w-40 rounded-full bg-white/[0.06] blur-2xl"
        }), i("div", {
          className: "pointer-events-none absolute top-8 left-1/2 -translate-x-1/2 h-24 w-24 rounded-full bg-gradient-to-br from-violet-500/20 to-blue-500/20 blur-2xl"
        }), f("div", {
          className: "relative flex flex-col items-center gap-5",
          children: [i("img", {
            src: lt,
            alt: "Muhasabah",
            className: "h-16 w-16 rounded-2xl object-cover mx-auto shadow-xl ring-1 ring-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]",
            style: {
              boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 24px rgba(139,92,246,0.4)"
            }
          }), f("div", {
            className: "space-y-2",
            children: [i("div", {
              className: "text-[10px] uppercase tracking-[0.26em] text-[hsl(var(--primary))] font-medium",
              children: "Welcome • Make Habit, Get Reward"
            })]
          }), i("p", {
            className: "italic text-xl sm:text-2xl font-medium leading-relaxed tracking-tight text-foreground text-center",
            style: {
              fontFamily: "var(--font-display)"
            },
            children: "Life is the sum of time — if you don’t use it properly, it’ll destroy you."
          }), i("button", {
            onClick: () => {
              nA(!1), He(!0), setTimeout(() => He(!1), 900);
            },
            className: "rounded-xl px-8 py-3 text-sm font-semibold bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 active:scale-[0.97] shadow-[0_4px_16px_rgba(0,200,83,0.3)] hover:shadow-[0_8px_24px_rgba(0,200,83,0.4)] hover:scale-[1.02] transition-all duration-150",
            children: "Continue"
          })]
        })]
      })
    }), Dn && i("div", {
      className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-md p-4",
      style: {
        backdropFilter: "blur(12px)"
      },
      children: f("div", {
        className: "relative w-full max-w-lg p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 border-t-white/20 bg-gradient-to-br from-white/[0.08] to-white/[0.03] bg-[hsl(var(--card)/0.90)] backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36),inset_0_1px_0_0_rgba(255,255,255,0.10)]",
        style: {
          backdropFilter: "blur(24px) saturate(180%)"
        },
        children: [i("div", {
          className: "pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(120%_80%_at_0%_0%,rgba(255,255,255,0.08),transparent_60%)]"
        }), f("div", {
          className: "relative",
          children: [f("div", {
            className: "flex items-center justify-between",
            children: [f("div", {
              children: [i("h3", {
                className: "font-semibold text-sm",
                style: {
                  fontFamily: "var(--font-display)"
                },
                children: "Edit Entry • Ledger"
              }), f("div", {
                className: "mt-1 flex items-center gap-2",
                children: [i("span", {
                  className: "num text-[10px] text-[hsl(var(--muted-foreground))]",
                  children: Mn(new Date(Dn.ts))
                }), f("span", {
                  className: "rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] text-amber-300",
                  children: ["Exact • ", new Date(Dn.ts).toLocaleDateString()]
                })]
              })]
            }), i("button", {
              onClick: () => {
                Fr(null), ut(!1);
              },
              className: "h-9 w-9 rounded-xl border border-white/10 flex items-center justify-center hover:border-[hsl(var(--primary)/0.3)] active:scale-[0.97] bg-white/[0.04]",
              children: "✕"
            })]
          }), f("div", {
            className: "space-y-4 mt-4",
            children: [f("div", {
              children: [i("label", {
                className: "text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]",
                children: "Reason"
              }), i("input", {
                value: q.reason,
                onChange: a => Vt({
                  ...q,
                  reason: a.target.value
                }),
                className: "mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm px-4 py-3 text-sm focus:outline-none focus:border-[hsl(var(--primary)/0.5)] focus:ring-1 focus:ring-[hsl(var(--primary)/0.2)] focus:bg-white/[0.08] transition-all"
              })]
            }), f("div", {
              className: "grid grid-cols-2 gap-3",
              children: [f("div", {
                children: [i("label", {
                  className: "text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]",
                  children: "Points (delta)"
                }), i("input", {
                  type: "number",
                  value: q.delta,
                  onChange: a => Vt({
                    ...q,
                    delta: Number(a.target.value)
                  }),
                  className: "mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm px-4 py-3 text-sm num focus:outline-none focus:border-[hsl(var(--primary)/0.5)] focus:ring-1 focus:ring-[hsl(var(--primary)/0.2)] focus:bg-white/[0.08] transition-all"
                }), i("div", {
                  className: "mt-1 text-[10px] text-[hsl(var(--muted-foreground))]",
                  children: q.delta > 0 ? "Reward • positive" : q.delta < 0 ? "Penalty • negative" : "Neutral"
                })]
              }), f("div", {
                children: [i("label", {
                  className: "text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]",
                  children: "Type / Category *"
                }), f("div", {
                  className: "relative mt-1.5",
                  children: [f("button", {
                    type: "button",
                    onClick: () => ut(a => !a),
                    className: "w-full rounded-xl border border-white/10 bg-white/[0.06] backdrop-blur-md px-4 py-3 text-sm flex items-center justify-between hover:border-[hsl(var(--primary)/0.30)] focus:border-[hsl(var(--primary)/0.50)] focus:ring-1 focus:ring-[hsl(var(--primary)/0.20)] focus:bg-white/[0.08] transition-all text-left",
                    children: [f("span", {
                      className: "flex items-center gap-2.5",
                      children: [i("span", {
                        className: `h-2.5 w-2.5 rounded-full ${q.type === "manualReward" ? "bg-[#00C853] shadow-[0_0_8px_rgba(0,200,83,0.6)]" : q.type === "checkIn" ? "bg-[hsl(var(--primary))] shadow-[0_0_8px_rgba(0,200,83,0.6)]" : q.type === "manualPenalty" ? "bg-[#FF3B30] shadow-[0_0_8px_rgba(255,59,48,0.6)]" : "bg-[#FF3B30]/60"}`
                      }), i("span", {
                        className: "text-[13px]",
                        children: q.type === "manualReward" ? "Reward" : q.type === "checkIn" ? "Check-in" : q.type === "manualPenalty" ? "Penalty" : "Auto Penalty"
                      }), f("span", {
                        className: "text-[10px] text-[hsl(var(--muted-foreground))] ml-1 hidden sm:inline",
                        children: ["• ", q.type]
                      })]
                    }), i("span", {
                      className: `text-[hsl(var(--muted-foreground))] transition-transform ${Pu ? "rotate-180" : ""}`,
                      children: "▾"
                    })]
                  }), Pu && i("div", {
                    className: "absolute top-full mt-2 left-0 right-0 rounded-xl border border-white/10 bg-[hsl(var(--card)/0.95)] backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] z-50 overflow-hidden",
                    style: {
                      backdropFilter: "blur(20px) saturate(150%)"
                    },
                    children: [{
                      value: "manualReward",
                      label: "Reward",
                      sub: "manualReward",
                      dot: "bg-[#00C853] shadow-[0_0_8px_rgba(0,200,83,0.5)]"
                    }, {
                      value: "checkIn",
                      label: "Check-in",
                      sub: "checkIn",
                      dot: "bg-[hsl(var(--primary))] shadow-[0_0_8px_rgba(0,200,83,0.5)]"
                    }, {
                      value: "manualPenalty",
                      label: "Penalty",
                      sub: "manualPenalty",
                      dot: "bg-[#FF3B30] shadow-[0_0_8px_rgba(255,59,48,0.5)]"
                    }, {
                      value: "autoPenalty",
                      label: "Auto Penalty",
                      sub: "autoPenalty",
                      dot: "bg-[#FF3B30]/60"
                    }].map(a => f("button", {
                      type: "button",
                      onClick: () => {
                        Vt(h => ({
                          ...h,
                          type: a.value
                        })), ut(!1);
                      },
                      className: `w-full text-left px-4 py-3 text-sm flex items-center gap-3 hover:bg-white/[0.06] transition-colors ${q.type === a.value ? "bg-[hsl(var(--primary)/0.10)]" : ""}`,
                      children: [i("span", {
                        className: `h-2.5 w-2.5 rounded-full ${a.dot}`
                      }), f("span", {
                        className: "flex-1",
                        children: [i("span", {
                          className: "text-[13px] font-medium",
                          children: a.label
                        }), f("span", {
                          className: "text-[10px] text-[hsl(var(--muted-foreground))] ml-2",
                          children: ["• ", a.sub]
                        })]
                      }), q.type === a.value && i("span", {
                        className: "text-[hsl(var(--primary))] text-xs",
                        children: "✓"
                      })]
                    }, a.value))
                  })]
                }), Pu && i("div", {
                  className: "fixed inset-0 z-40",
                  onClick: () => ut(!1)
                })]
              })]
            }), f("div", {
              children: [i("label", {
                className: "text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]",
                children: "Note • Audit"
              }), i("textarea", {
                value: q.note,
                onChange: a => Vt({
                  ...q,
                  note: a.target.value
                }),
                rows: 3,
                className: "mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm px-4 py-3 text-sm focus:outline-none focus:border-[hsl(var(--primary)/0.5)] focus:ring-1 focus:ring-[hsl(var(--primary)/0.2)] focus:bg-white/[0.08] transition-all"
              })]
            }), f("div", {
              className: "flex gap-2 pt-1",
              children: [i("button", {
                onClick: () => {
                  Fr(null), ut(!1);
                },
                className: "h-11 flex-1 rounded-xl border border-white/10 text-sm active:scale-[0.97] hover:border-white/20 bg-white/[0.04] hover:bg-white/[0.08] transition-all",
                children: "Cancel"
              }), i("button", {
                onClick: () => {
                  if (!Dn) return;
                  d(a => a.map(h => h.id === Dn.id ? {
                    ...h,
                    reason: q.reason,
                    delta: q.delta,
                    note: q.note,
                    type: q.type
                  } : h)), Fr(null), ut(!1), vn("Entry updated • " + q.type), He(!0), setTimeout(() => He(!1), 800);
                },
                className: "h-11 flex-1 rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-medium active:scale-[0.97] shadow-[0_4px_16px_rgba(0,200,83,0.25)] hover:shadow-[0_8px_24px_rgba(0,200,83,0.35)] hover:scale-[1.02] transition-all duration-150",
                children: "Save changes"
              })]
            })]
          })]
        })]
      })
    }), Zt && i("div", {
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur p-4",
      children: f("div", {
        className: "panel w-full max-w-sm p-6 space-y-4",
        children: [i("div", {
          className: "flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF3B30]/15 ring-1 ring-[#FF3B30]/30 text-[#FF3B30]",
          children: f("svg", {
            width: "20",
            height: "20",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: [i("polyline", {
              points: "3 6 5 6 21 6"
            }), i("path", {
              d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
            })]
          })
        }), f("div", {
          children: [i("h3", {
            className: "font-semibold",
            children: "Delete entry?"
          }), i("p", {
            className: "mt-1 text-sm text-[hsl(var(--muted-foreground))]",
            children: "Are you sure you want to delete this entry? This cannot be undone."
          })]
        }), f("div", {
          className: "flex gap-2 pt-2",
          children: [i("button", {
            onClick: () => Cu(null),
            className: "h-11 flex-1 rounded-xl border border-border text-sm active:scale-[0.97]",
            children: "Cancel"
          }), i("button", {
            onClick: () => {
              if (Zt) d(a => a.filter(h => h.id !== Zt));
              Cu(null), vn("Entry deleted");
            },
            className: "h-11 flex-1 rounded-xl bg-[#FF3B30] text-white text-sm font-medium active:scale-[0.97]",
            children: "Delete"
          })]
        })]
      })
    }), pn && i("div", {
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur p-4",
      children: f("div", {
        className: "panel w-full max-w-sm p-6 space-y-4",
        children: [i("div", {
          className: "flex h-11 w-11 items-center justify-center rounded-xl bg-[hsl(var(--primary)/0.12)] ring-1 ring-[hsl(var(--primary)/0.25)] text-[hsl(var(--primary))]",
          children: f("svg", {
            width: "20",
            height: "20",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "1.8",
            children: [i("path", {
              d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
            }), i("polyline", {
              points: "17 8 12 3 7 8"
            }), i("line", {
              x1: "12",
              y1: "3",
              x2: "12",
              y2: "15"
            })]
          })
        }), f("div", {
          children: [i("h3", {
            className: "font-semibold",
            children: "Import will replace current data. Continue?"
          }), f("p", {
            className: "mt-1 text-xs text-[hsl(var(--muted-foreground))]",
            children: ["File: ", i("span", {
              className: "num",
              children: pn.fileName
            }), " • ", pn.data.todos?.length || 0, " todos • ", pn.data.habits?.length || 0, " habits • ", pn.data.ledger?.length || 0, " entries"]
          })]
        }), f("div", {
          className: "flex gap-2 pt-2",
          children: [i("button", {
            onClick: () => zu(null),
            className: "h-11 flex-1 rounded-xl border border-border text-sm active:scale-[0.97]",
            children: "Cancel"
          }), i("button", {
            onClick: () => {
              let a = pn.data;
              if (a.habits) c(a.habits);
              if (a.todos) twS(Array.isArray(a.todos) ? a.todos.filter(x => x && x.id) : []);
              if (a.ledger) d(a.ledger);
              if (window.MHSJournal && a.journal !== undefined) window.MHSJournal.restore(a.journal, !!a.journalReminder);
              zu(null), vn(`Imported ${pn.fileName}`), He(!0), setTimeout(() => He(!1), 1000);
            },
            className: "h-11 flex-1 rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-medium active:scale-[0.97]",
            children: "Import"
          })]
        })]
      })
    }), Gr && f("div", {
      className: "fixed bottom-28 left-1/2 z-[70] rail-toast -translate-x-1/2 rounded-full bg-[hsl(var(--card))] border border-border px-4 py-2.5 text-xs shadow-xl backdrop-blur flex items-center gap-2",
      children: [i("span", {
        className: "h-1.5 w-1.5 rounded-full bg-[#00C853] animate-pulse"
      }), Gr]
    })]
  });
}
eA.createRoot(document.getElementById("root")).render(i(bs.default.StrictMode, {
  children: i(na, {})
}));