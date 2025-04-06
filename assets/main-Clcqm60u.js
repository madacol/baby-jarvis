const scriptRel = /* @__PURE__ */ function detectScriptRel() {
  const relList = typeof document !== "undefined" && document.createElement("link").relList;
  return relList && relList.supports && relList.supports("modulepreload") ? "modulepreload" : "preload";
}();
const assetsURL = function(dep, importerUrl) {
  return new URL(dep, importerUrl).href;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (deps && deps.length > 0) {
    const links = document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector(
      "meta[property=csp-nonce]"
    );
    const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
    promise = Promise.allSettled(
      deps.map((dep) => {
        dep = assetsURL(dep, importerUrl);
        if (dep in seen) return;
        seen[dep] = true;
        const isCss = dep.endsWith(".css");
        const cssSelector = isCss ? '[rel="stylesheet"]' : "";
        const isBaseRelative = !!importerUrl;
        if (isBaseRelative) {
          for (let i2 = links.length - 1; i2 >= 0; i2--) {
            const link2 = links[i2];
            if (link2.href === dep && (!isCss || link2.rel === "stylesheet")) {
              return;
            }
          }
        } else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
          return;
        }
        const link = document.createElement("link");
        link.rel = isCss ? "stylesheet" : scriptRel;
        if (!isCss) {
          link.as = "script";
        }
        link.crossOrigin = "";
        link.href = dep;
        if (cspNonce) {
          link.setAttribute("nonce", cspNonce);
        }
        document.head.appendChild(link);
        if (isCss) {
          return new Promise((res, rej) => {
            link.addEventListener("load", res);
            link.addEventListener(
              "error",
              () => rej(new Error(`Unable to preload CSS for ${dep}`))
            );
          });
        }
      })
    );
  }
  function handlePreloadError(err2) {
    const e = new Event("vite:preloadError", {
      cancelable: true
    });
    e.payload = err2;
    window.dispatchEvent(e);
    if (!e.defaultPrevented) {
      throw err2;
    }
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};
var p = Object.create;
var i = Object.defineProperty;
var c = Object.getOwnPropertyDescriptor;
var f = Object.getOwnPropertyNames;
var l$2 = Object.getPrototypeOf, s$1 = Object.prototype.hasOwnProperty;
var a = (t) => {
  throw TypeError(t);
};
var _$1 = (t, e, o2) => e in t ? i(t, e, { enumerable: true, configurable: true, writable: true, value: o2 }) : t[e] = o2;
var d = (t, e) => () => (t && (e = t(t = 0)), e);
var D$1 = (t, e) => () => (e || t((e = { exports: {} }).exports, e), e.exports), F$1 = (t, e) => {
  for (var o2 in e) i(t, o2, { get: e[o2], enumerable: true });
}, g$4 = (t, e, o2, m2) => {
  if (e && typeof e == "object" || typeof e == "function") for (let r2 of f(e)) !s$1.call(t, r2) && r2 !== o2 && i(t, r2, { get: () => e[r2], enumerable: !(m2 = c(e, r2)) || m2.enumerable });
  return t;
};
var L$2 = (t, e, o2) => (o2 = t != null ? p(l$2(t)) : {}, g$4(i(o2, "default", { value: t, enumerable: true }), t));
var P$1 = (t, e, o2) => _$1(t, typeof e != "symbol" ? e + "" : e, o2), n = (t, e, o2) => e.has(t) || a("Cannot " + o2);
var h$1 = (t, e, o2) => (n(t, e, "read from private field"), o2 ? o2.call(t) : e.get(t)), R$2 = (t, e, o2) => e.has(t) ? a("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, o2), x$2 = (t, e, o2, m2) => (n(t, e, "write to private field"), e.set(t, o2), o2), T = (t, e, o2) => (n(t, e, "access private method"), o2);
var U$1 = (t, e, o2, m2) => ({ set _(r2) {
  x$2(t, e, r2);
}, get _() {
  return h$1(t, e, m2);
} });
var u$1 = d(() => {
});
var hn = {};
F$1(hn, { ABSTIME: () => Et, ACLITEM: () => Vt, BIT: () => Wt, BOOL: () => be, BPCHAR: () => _e$1, BYTEA: () => ge$1, CHAR: () => gt, CID: () => St, CIDR: () => Tt, CIRCLE: () => Ut, DATE: () => He$1, FLOAT4: () => je$1, FLOAT8: () => Qe$1, GTSVECTOR: () => rn, INET: () => kt, INT2: () => ve, INT4: () => Ge, INT8: () => we, INTERVAL: () => vt, JSON: () => Ae$1, JSONB: () => Ye, MACADDR: () => Ot, MACADDR8: () => Nt, MONEY: () => Lt, NUMERIC: () => Qt, OID: () => We$1, PATH: () => Mt, PG_DEPENDENCIES: () => en, PG_LSN: () => Xt, PG_NDISTINCT: () => Zt, PG_NODE_TREE: () => Bt, POLYGON: () => Rt, REFCURSOR: () => _t, REGCLASS: () => Yt, REGCONFIG: () => sn, REGDICTIONARY: () => an, REGNAMESPACE: () => on, REGOPER: () => Ht, REGOPERATOR: () => qt, REGPROC: () => wt, REGPROCEDURE: () => zt, REGROLE: () => un, REGTYPE: () => $t, RELTIME: () => Ct, SMGR: () => It, TEXT: () => F, TID: () => At, TIME: () => Ft, TIMESTAMP: () => qe$1, TIMESTAMPTZ: () => xe, TIMETZ: () => Gt, TINTERVAL: () => Pt, TSQUERY: () => nn, TSVECTOR: () => tn, TXID_SNAPSHOT: () => Jt, UUID: () => Kt, VARBIT: () => jt, VARCHAR: () => ze, XID: () => xt, XML: () => Dt, arrayParser: () => yn, arraySerializer: () => Ke$1, parseType: () => ue, parsers: () => ln, serializers: () => cn, types: () => $e });
u$1();
var ht = globalThis.JSON.parse, bt = globalThis.JSON.stringify, be = 16, ge$1 = 17, gt = 18, we = 20, ve = 21, Ge = 23, wt = 24, F = 25, We$1 = 26, At = 27, xt = 28, St = 29, Ae$1 = 114, Dt = 142, Bt = 194, It = 210, Mt = 602, Rt = 604, Tt = 650, je$1 = 700, Qe$1 = 701, Et = 702, Ct = 703, Pt = 704, Ut = 718, Nt = 774, Lt = 790, Ot = 829, kt = 869, Vt = 1033, _e$1 = 1042, ze = 1043, He$1 = 1082, Ft = 1083, qe$1 = 1114, xe = 1184, vt = 1186, Gt = 1266, Wt = 1560, jt = 1562, Qt = 1700, _t = 1790, zt = 2202, Ht = 2203, qt = 2204, Yt = 2205, $t = 2206, Kt = 2950, Jt = 2970, Xt = 3220, Zt = 3361, en = 3402, tn = 3614, nn = 3615, rn = 3642, sn = 3734, an = 3769, Ye = 3802, on = 4089, un = 4096, $e = { string: { to: F, from: [F, ze, _e$1], serialize: (e) => {
  if (typeof e == "string") return e;
  if (typeof e == "number") return e.toString();
  throw new Error("Invalid input for string type");
}, parse: (e) => e }, number: { to: 0, from: [ve, Ge, We$1, je$1, Qe$1], serialize: (e) => e.toString(), parse: (e) => +e }, bigint: { to: we, from: [we], serialize: (e) => e.toString(), parse: (e) => {
  let t = BigInt(e);
  return t < Number.MIN_SAFE_INTEGER || t > Number.MAX_SAFE_INTEGER ? t : Number(t);
} }, json: { to: Ae$1, from: [Ae$1, Ye], serialize: (e) => typeof e == "string" ? e : bt(e), parse: (e) => ht(e) }, boolean: { to: be, from: [be], serialize: (e) => {
  if (typeof e != "boolean") throw new Error("Invalid input for boolean type");
  return e ? "t" : "f";
}, parse: (e) => e === "t" }, date: { to: xe, from: [He$1, qe$1, xe], serialize: (e) => {
  if (typeof e == "string") return e;
  if (typeof e == "number") return new Date(e).toISOString();
  if (e instanceof Date) return e.toISOString();
  throw new Error("Invalid input for date type");
}, parse: (e) => new Date(e) }, bytea: { to: ge$1, from: [ge$1], serialize: (e) => {
  if (!(e instanceof Uint8Array)) throw new Error("Invalid input for bytea type");
  return "\\x" + Array.from(e).map((t) => t.toString(16).padStart(2, "0")).join("");
}, parse: (e) => {
  let t = e.slice(2);
  return Uint8Array.from({ length: t.length / 2 }, (n2, r2) => parseInt(t.substring(r2 * 2, (r2 + 1) * 2), 16));
} } }, Se = pn($e), ln = Se.parsers, cn = Se.serializers;
function ue(e, t, n2) {
  if (e === null) return null;
  let r2 = n2?.[t] ?? Se.parsers[t];
  return r2 ? r2(e, t) : e;
}
function pn(e) {
  return Object.keys(e).reduce(({ parsers: t, serializers: n2 }, r2) => {
    let { to: i2, from: a2, serialize: u2, parse: d2 } = e[r2];
    return n2[i2] = u2, n2[r2] = u2, t[r2] = d2, Array.isArray(a2) ? a2.forEach((c2) => {
      t[c2] = d2, n2[c2] = u2;
    }) : (t[a2] = d2, n2[a2] = u2), { parsers: t, serializers: n2 };
  }, { parsers: {}, serializers: {} });
}
var dn = /\\/g, fn = /"/g;
function mn(e) {
  return e.replace(dn, "\\\\").replace(fn, '\\"');
}
function Ke$1(e, t, n2) {
  if (Array.isArray(e) === false) return e;
  if (!e.length) return "{}";
  let r2 = e[0], i2 = n2 === 1020 ? ";" : ",";
  return Array.isArray(r2) ? `{${e.map((a2) => Ke$1(a2, t, n2)).join(i2)}}` : `{${e.map((a2) => (a2 === void 0 && (a2 = null), a2 === null ? "null" : '"' + mn(t ? t(a2) : a2.toString()) + '"')).join(i2)}}`;
}
var he = { i: 0, char: null, str: "", quoted: false, last: 0, p: null };
function yn(e, t, n2) {
  return he.i = he.last = 0, Je(he, e, t, n2)[0];
}
function Je(e, t, n2, r2) {
  let i2 = [], a2 = r2 === 1020 ? ";" : ",";
  for (; e.i < t.length; e.i++) {
    if (e.char = t[e.i], e.quoted) e.char === "\\" ? e.str += t[++e.i] : e.char === '"' ? (i2.push(n2 ? n2(e.str) : e.str), e.str = "", e.quoted = t[e.i + 1] === '"', e.last = e.i + 2) : e.str += e.char;
    else if (e.char === '"') e.quoted = true;
    else if (e.char === "{") e.last = ++e.i, i2.push(Je(e, t, n2, r2));
    else if (e.char === "}") {
      e.quoted = false, e.last < e.i && i2.push(n2 ? n2(t.slice(e.last, e.i)) : t.slice(e.last, e.i)), e.last = e.i + 1;
      break;
    } else e.char === a2 && e.p !== "}" && e.p !== '"' && (i2.push(n2 ? n2(t.slice(e.last, e.i)) : t.slice(e.last, e.i)), e.last = e.i + 1);
    e.p = e.char;
  }
  return e.last < e.i && i2.push(n2 ? n2(t.slice(e.last, e.i + 1)) : t.slice(e.last, e.i + 1)), i2;
}
var wn = {};
F$1(wn, { parseDescribeStatementResults: () => De, parseResults: () => bn });
u$1();
function bn(e, t, n2, r2) {
  let i2 = [], a2 = { rows: [], fields: [] }, u2 = 0, d2 = { ...t, ...n2?.parsers };
  return e.forEach((c2) => {
    switch (c2.name) {
      case "rowDescription": {
        let V2 = c2;
        a2.fields = V2.fields.map((T2) => ({ name: T2.name, dataTypeID: T2.dataTypeID }));
        break;
      }
      case "dataRow": {
        if (!a2) break;
        let V2 = c2;
        n2?.rowMode === "array" ? a2.rows.push(V2.fields.map((T2, ie2) => ue(T2, a2.fields[ie2].dataTypeID, d2))) : a2.rows.push(Object.fromEntries(V2.fields.map((T2, ie2) => [a2.fields[ie2].name, ue(T2, a2.fields[ie2].dataTypeID, d2)])));
        break;
      }
      case "commandComplete": {
        u2 += gn(c2), i2.push({ ...a2, affectedRows: u2, ...r2 ? { blob: r2 } : {} }), a2 = { rows: [], fields: [] };
        break;
      }
    }
  }), i2.length === 0 && i2.push({ affectedRows: 0, rows: [], fields: [] }), i2;
}
function gn(e) {
  let t = e.text.split(" ");
  switch (t[0]) {
    case "INSERT":
      return parseInt(t[2], 10);
    case "UPDATE":
    case "DELETE":
    case "COPY":
      return parseInt(t[1], 10);
    default:
      return 0;
  }
}
function De(e) {
  let t = e.find((n2) => n2.name === "parameterDescription");
  return t ? t.dataTypeIDs : [];
}
var Ue$1 = {};
F$1(Ue$1, { AuthenticationCleartextPassword: () => G$1, AuthenticationMD5Password: () => W$1, AuthenticationOk: () => v, AuthenticationSASL: () => j$1, AuthenticationSASLContinue: () => Q, AuthenticationSASLFinal: () => _, BackendKeyDataMessage: () => J$1, CommandCompleteMessage: () => ee$1, CopyDataMessage: () => z$1, CopyResponse: () => H$2, DataRowMessage: () => te$1, DatabaseError: () => E, Field: () => q, NoticeMessage: () => ne, NotificationResponseMessage: () => X, ParameterDescriptionMessage: () => $$1, ParameterStatusMessage: () => K$1, ReadyForQueryMessage: () => Z$1, RowDescriptionMessage: () => Y$1, bindComplete: () => Ie$1, closeComplete: () => Me, copyDone: () => Pe$1, emptyQuery: () => Ce, noData: () => Re, parseComplete: () => Be, portalSuspended: () => Te$1, replicationStart: () => Ee });
u$1();
var Be = { name: "parseComplete", length: 5 }, Ie$1 = { name: "bindComplete", length: 5 }, Me = { name: "closeComplete", length: 5 }, Re = { name: "noData", length: 5 }, Te$1 = { name: "portalSuspended", length: 5 }, Ee = { name: "replicationStart", length: 4 }, Ce = { name: "emptyQuery", length: 4 }, Pe$1 = { name: "copyDone", length: 4 }, v = class {
  constructor(t) {
    this.length = t;
    this.name = "authenticationOk";
  }
}, G$1 = class G2 {
  constructor(t) {
    this.length = t;
    this.name = "authenticationCleartextPassword";
  }
}, W$1 = class W2 {
  constructor(t, n2) {
    this.length = t;
    this.salt = n2;
    this.name = "authenticationMD5Password";
  }
}, j$1 = class j2 {
  constructor(t, n2) {
    this.length = t;
    this.mechanisms = n2;
    this.name = "authenticationSASL";
  }
}, Q = class {
  constructor(t, n2) {
    this.length = t;
    this.data = n2;
    this.name = "authenticationSASLContinue";
  }
}, _ = class {
  constructor(t, n2) {
    this.length = t;
    this.data = n2;
    this.name = "authenticationSASLFinal";
  }
}, E = class extends Error {
  constructor(n2, r2, i2) {
    super(n2);
    this.length = r2;
    this.name = i2;
  }
}, z$1 = class z2 {
  constructor(t, n2) {
    this.length = t;
    this.chunk = n2;
    this.name = "copyData";
  }
}, H$2 = class H2 {
  constructor(t, n2, r2, i2) {
    this.length = t;
    this.name = n2;
    this.binary = r2;
    this.columnTypes = new Array(i2);
  }
}, q = class {
  constructor(t, n2, r2, i2, a2, u2, d2) {
    this.name = t;
    this.tableID = n2;
    this.columnID = r2;
    this.dataTypeID = i2;
    this.dataTypeSize = a2;
    this.dataTypeModifier = u2;
    this.format = d2;
  }
}, Y$1 = class Y2 {
  constructor(t, n2) {
    this.length = t;
    this.fieldCount = n2;
    this.name = "rowDescription";
    this.fields = new Array(this.fieldCount);
  }
}, $$1 = class $2 {
  constructor(t, n2) {
    this.length = t;
    this.parameterCount = n2;
    this.name = "parameterDescription";
    this.dataTypeIDs = new Array(this.parameterCount);
  }
}, K$1 = class K2 {
  constructor(t, n2, r2) {
    this.length = t;
    this.parameterName = n2;
    this.parameterValue = r2;
    this.name = "parameterStatus";
  }
}, J$1 = class J2 {
  constructor(t, n2, r2) {
    this.length = t;
    this.processID = n2;
    this.secretKey = r2;
    this.name = "backendKeyData";
  }
}, X = class {
  constructor(t, n2, r2, i2) {
    this.length = t;
    this.processId = n2;
    this.channel = r2;
    this.payload = i2;
    this.name = "notification";
  }
}, Z$1 = class Z2 {
  constructor(t, n2) {
    this.length = t;
    this.status = n2;
    this.name = "readyForQuery";
  }
}, ee$1 = class ee2 {
  constructor(t, n2) {
    this.length = t;
    this.text = n2;
    this.name = "commandComplete";
  }
}, te$1 = class te2 {
  constructor(t, n2) {
    this.length = t;
    this.fields = n2;
    this.name = "dataRow";
    this.fieldCount = n2.length;
  }
}, ne = class {
  constructor(t, n2) {
    this.length = t;
    this.message = n2;
    this.name = "notice";
  }
};
var zn = {};
F$1(zn, { Parser: () => ye, messages: () => Ue$1, serialize: () => O$1 });
u$1();
u$1();
u$1();
u$1();
function C$1(e) {
  let t = e.length;
  for (let n2 = e.length - 1; n2 >= 0; n2--) {
    let r2 = e.charCodeAt(n2);
    r2 > 127 && r2 <= 2047 ? t++ : r2 > 2047 && r2 <= 65535 && (t += 2), r2 >= 56320 && r2 <= 57343 && n2--;
  }
  return t;
}
var b$1, g$3, U, ce$2, N, x$1, le, P, Xe, R$1 = class R2 {
  constructor(t = 256) {
    this.size = t;
    R$2(this, x$1);
    R$2(this, b$1);
    R$2(this, g$3, 5);
    R$2(this, U, false);
    R$2(this, ce$2, new TextEncoder());
    R$2(this, N, 0);
    x$2(this, b$1, T(this, x$1, le).call(this, t));
  }
  addInt32(t) {
    return T(this, x$1, P).call(this, 4), h$1(this, b$1).setInt32(h$1(this, g$3), t, h$1(this, U)), x$2(this, g$3, h$1(this, g$3) + 4), this;
  }
  addInt16(t) {
    return T(this, x$1, P).call(this, 2), h$1(this, b$1).setInt16(h$1(this, g$3), t, h$1(this, U)), x$2(this, g$3, h$1(this, g$3) + 2), this;
  }
  addCString(t) {
    return t && this.addString(t), T(this, x$1, P).call(this, 1), h$1(this, b$1).setUint8(h$1(this, g$3), 0), U$1(this, g$3)._++, this;
  }
  addString(t = "") {
    let n2 = C$1(t);
    return T(this, x$1, P).call(this, n2), h$1(this, ce$2).encodeInto(t, new Uint8Array(h$1(this, b$1).buffer, h$1(this, g$3))), x$2(this, g$3, h$1(this, g$3) + n2), this;
  }
  add(t) {
    return T(this, x$1, P).call(this, t.byteLength), new Uint8Array(h$1(this, b$1).buffer).set(new Uint8Array(t), h$1(this, g$3)), x$2(this, g$3, h$1(this, g$3) + t.byteLength), this;
  }
  flush(t) {
    let n2 = T(this, x$1, Xe).call(this, t);
    return x$2(this, g$3, 5), x$2(this, b$1, T(this, x$1, le).call(this, this.size)), new Uint8Array(n2);
  }
};
b$1 = /* @__PURE__ */ new WeakMap(), g$3 = /* @__PURE__ */ new WeakMap(), U = /* @__PURE__ */ new WeakMap(), ce$2 = /* @__PURE__ */ new WeakMap(), N = /* @__PURE__ */ new WeakMap(), x$1 = /* @__PURE__ */ new WeakSet(), le = function(t) {
  return new DataView(new ArrayBuffer(t));
}, P = function(t) {
  if (h$1(this, b$1).byteLength - h$1(this, g$3) < t) {
    let r2 = h$1(this, b$1).buffer, i2 = r2.byteLength + (r2.byteLength >> 1) + t;
    x$2(this, b$1, T(this, x$1, le).call(this, i2)), new Uint8Array(h$1(this, b$1).buffer).set(new Uint8Array(r2));
  }
}, Xe = function(t) {
  if (t) {
    h$1(this, b$1).setUint8(h$1(this, N), t);
    let n2 = h$1(this, g$3) - (h$1(this, N) + 1);
    h$1(this, b$1).setInt32(h$1(this, N) + 1, n2, h$1(this, U));
  }
  return h$1(this, b$1).buffer.slice(t ? 0 : 5, h$1(this, g$3));
};
var m = new R$1(), An = (e) => {
  m.addInt16(3).addInt16(0);
  for (let r2 of Object.keys(e)) m.addCString(r2).addCString(e[r2]);
  m.addCString("client_encoding").addCString("UTF8");
  let t = m.addCString("").flush(), n2 = t.byteLength + 4;
  return new R$1().addInt32(n2).add(t).flush();
}, xn = () => {
  let e = new DataView(new ArrayBuffer(8));
  return e.setInt32(0, 8, false), e.setInt32(4, 80877103, false), new Uint8Array(e.buffer);
}, Sn = (e) => m.addCString(e).flush(112), Dn = (e, t) => (m.addCString(e).addInt32(C$1(t)).addString(t), m.flush(112)), Bn = (e) => m.addString(e).flush(112), In = (e) => m.addCString(e).flush(81), Mn = [], Rn = (e) => {
  let t = e.name ?? "";
  t.length > 63 && (console.error("Warning! Postgres only supports 63 characters for query names."), console.error("You supplied %s (%s)", t, t.length), console.error("This can cause conflicts and silent errors executing queries"));
  let n2 = m.addCString(t).addCString(e.text).addInt16(e.types?.length ?? 0);
  return e.types?.forEach((r2) => n2.addInt32(r2)), m.flush(80);
}, L$1 = new R$1();
var Tn = (e, t) => {
  for (let n2 = 0; n2 < e.length; n2++) {
    let r2 = t ? t(e[n2], n2) : e[n2];
    if (r2 === null) m.addInt16(0), L$1.addInt32(-1);
    else if (r2 instanceof ArrayBuffer || ArrayBuffer.isView(r2)) {
      let i2 = ArrayBuffer.isView(r2) ? r2.buffer.slice(r2.byteOffset, r2.byteOffset + r2.byteLength) : r2;
      m.addInt16(1), L$1.addInt32(i2.byteLength), L$1.add(i2);
    } else m.addInt16(0), L$1.addInt32(C$1(r2)), L$1.addString(r2);
  }
}, En = (e = {}) => {
  let t = e.portal ?? "", n2 = e.statement ?? "", r2 = e.binary ?? false, i2 = e.values ?? Mn, a2 = i2.length;
  return m.addCString(t).addCString(n2), m.addInt16(a2), Tn(i2, e.valueMapper), m.addInt16(a2), m.add(L$1.flush()), m.addInt16(r2 ? 1 : 0), m.flush(66);
}, Cn = new Uint8Array([69, 0, 0, 0, 9, 0, 0, 0, 0, 0]), Pn = (e) => {
  if (!e || !e.portal && !e.rows) return Cn;
  let t = e.portal ?? "", n2 = e.rows ?? 0, r2 = C$1(t), i2 = 4 + r2 + 1 + 4, a2 = new DataView(new ArrayBuffer(1 + i2));
  return a2.setUint8(0, 69), a2.setInt32(1, i2, false), new TextEncoder().encodeInto(t, new Uint8Array(a2.buffer, 5)), a2.setUint8(r2 + 5, 0), a2.setUint32(a2.byteLength - 4, n2, false), new Uint8Array(a2.buffer);
}, Un = (e, t) => {
  let n2 = new DataView(new ArrayBuffer(16));
  return n2.setInt32(0, 16, false), n2.setInt16(4, 1234, false), n2.setInt16(6, 5678, false), n2.setInt32(8, e, false), n2.setInt32(12, t, false), new Uint8Array(n2.buffer);
}, Ne = (e, t) => {
  let n2 = new R$1();
  return n2.addCString(t), n2.flush(e);
}, Nn = m.addCString("P").flush(68), Ln = m.addCString("S").flush(68), On = (e) => e.name ? Ne(68, `${e.type}${e.name ?? ""}`) : e.type === "P" ? Nn : Ln, kn = (e) => {
  let t = `${e.type}${e.name ?? ""}`;
  return Ne(67, t);
}, Vn = (e) => m.add(e).flush(100), Fn = (e) => Ne(102, e), pe$1 = (e) => new Uint8Array([e, 0, 0, 0, 4]), vn = pe$1(72), Gn = pe$1(83), Wn = pe$1(88), jn = pe$1(99), O$1 = { startup: An, password: Sn, requestSsl: xn, sendSASLInitialResponseMessage: Dn, sendSCRAMClientFinalMessage: Bn, query: In, parse: Rn, bind: En, execute: Pn, describe: On, close: kn, flush: () => vn, sync: () => Gn, end: () => Wn, copyData: Vn, copyDone: () => jn, copyFail: Fn, cancel: Un };
u$1();
u$1();
var Le = { text: 0, binary: 1 };
u$1();
var Qn = new ArrayBuffer(0), M, w$1, fe, me$1, re$1, de = class {
  constructor(t = 0) {
    R$2(this, M, new DataView(Qn));
    R$2(this, w$1);
    R$2(this, fe, "utf-8");
    R$2(this, me$1, new TextDecoder(h$1(this, fe)));
    R$2(this, re$1, false);
    x$2(this, w$1, t);
  }
  setBuffer(t, n2) {
    x$2(this, w$1, t), x$2(this, M, new DataView(n2));
  }
  int16() {
    let t = h$1(this, M).getInt16(h$1(this, w$1), h$1(this, re$1));
    return x$2(this, w$1, h$1(this, w$1) + 2), t;
  }
  byte() {
    let t = h$1(this, M).getUint8(h$1(this, w$1));
    return U$1(this, w$1)._++, t;
  }
  int32() {
    let t = h$1(this, M).getInt32(h$1(this, w$1), h$1(this, re$1));
    return x$2(this, w$1, h$1(this, w$1) + 4), t;
  }
  string(t) {
    return h$1(this, me$1).decode(this.bytes(t));
  }
  cstring() {
    let t = h$1(this, w$1), n2 = t;
    for (; h$1(this, M).getUint8(n2++) !== 0; ) ;
    let r2 = this.string(n2 - t - 1);
    return x$2(this, w$1, n2), r2;
  }
  bytes(t) {
    let n2 = h$1(this, M).buffer.slice(h$1(this, w$1), h$1(this, w$1) + t);
    return x$2(this, w$1, h$1(this, w$1) + t), new Uint8Array(n2);
  }
};
M = /* @__PURE__ */ new WeakMap(), w$1 = /* @__PURE__ */ new WeakMap(), fe = /* @__PURE__ */ new WeakMap(), me$1 = /* @__PURE__ */ new WeakMap(), re$1 = /* @__PURE__ */ new WeakMap();
var Oe = 1, _n = 4, Ze = Oe + _n, et = new ArrayBuffer(0);
var A, S, D, o$1, l$1, tt, nt, rt, st, it, at, ot, ke$1, ut, lt, ct, pt, dt, ft, mt, yt, Ve$1, ye = class {
  constructor() {
    R$2(this, l$1);
    R$2(this, A, new DataView(et));
    R$2(this, S, 0);
    R$2(this, D, 0);
    R$2(this, o$1, new de());
  }
  parse(t, n2) {
    T(this, l$1, tt).call(this, ArrayBuffer.isView(t) ? t.buffer.slice(t.byteOffset, t.byteOffset + t.byteLength) : t);
    let r2 = h$1(this, D) + h$1(this, S), i2 = h$1(this, D);
    for (; i2 + Ze <= r2; ) {
      let a2 = h$1(this, A).getUint8(i2), u2 = h$1(this, A).getUint32(i2 + Oe, false), d2 = Oe + u2;
      if (d2 + i2 <= r2) {
        let c2 = T(this, l$1, nt).call(this, i2 + Ze, a2, u2, h$1(this, A).buffer);
        n2(c2), i2 += d2;
      } else break;
    }
    i2 === r2 ? (x$2(this, A, new DataView(et)), x$2(this, S, 0), x$2(this, D, 0)) : (x$2(this, S, r2 - i2), x$2(this, D, i2));
  }
};
A = /* @__PURE__ */ new WeakMap(), S = /* @__PURE__ */ new WeakMap(), D = /* @__PURE__ */ new WeakMap(), o$1 = /* @__PURE__ */ new WeakMap(), l$1 = /* @__PURE__ */ new WeakSet(), tt = function(t) {
  if (h$1(this, S) > 0) {
    let n2 = h$1(this, S) + t.byteLength;
    if (n2 + h$1(this, D) > h$1(this, A).byteLength) {
      let i2;
      if (n2 <= h$1(this, A).byteLength && h$1(this, D) >= h$1(this, S)) i2 = h$1(this, A).buffer;
      else {
        let a2 = h$1(this, A).byteLength * 2;
        for (; n2 >= a2; ) a2 *= 2;
        i2 = new ArrayBuffer(a2);
      }
      new Uint8Array(i2).set(new Uint8Array(h$1(this, A).buffer, h$1(this, D), h$1(this, S))), x$2(this, A, new DataView(i2)), x$2(this, D, 0);
    }
    new Uint8Array(h$1(this, A).buffer).set(new Uint8Array(t), h$1(this, D) + h$1(this, S)), x$2(this, S, n2);
  } else x$2(this, A, new DataView(t)), x$2(this, D, 0), x$2(this, S, t.byteLength);
}, nt = function(t, n2, r2, i2) {
  switch (n2) {
    case 50:
      return Ie$1;
    case 49:
      return Be;
    case 51:
      return Me;
    case 110:
      return Re;
    case 115:
      return Te$1;
    case 99:
      return Pe$1;
    case 87:
      return Ee;
    case 73:
      return Ce;
    case 68:
      return T(this, l$1, dt).call(this, t, r2, i2);
    case 67:
      return T(this, l$1, st).call(this, t, r2, i2);
    case 90:
      return T(this, l$1, rt).call(this, t, r2, i2);
    case 65:
      return T(this, l$1, ut).call(this, t, r2, i2);
    case 82:
      return T(this, l$1, yt).call(this, t, r2, i2);
    case 83:
      return T(this, l$1, ft).call(this, t, r2, i2);
    case 75:
      return T(this, l$1, mt).call(this, t, r2, i2);
    case 69:
      return T(this, l$1, Ve$1).call(this, t, r2, i2, "error");
    case 78:
      return T(this, l$1, Ve$1).call(this, t, r2, i2, "notice");
    case 84:
      return T(this, l$1, lt).call(this, t, r2, i2);
    case 116:
      return T(this, l$1, pt).call(this, t, r2, i2);
    case 71:
      return T(this, l$1, at).call(this, t, r2, i2);
    case 72:
      return T(this, l$1, ot).call(this, t, r2, i2);
    case 100:
      return T(this, l$1, it).call(this, t, r2, i2);
    default:
      return new E("received invalid response: " + n2.toString(16), r2, "error");
  }
}, rt = function(t, n2, r2) {
  h$1(this, o$1).setBuffer(t, r2);
  let i2 = h$1(this, o$1).string(1);
  return new Z$1(n2, i2);
}, st = function(t, n2, r2) {
  h$1(this, o$1).setBuffer(t, r2);
  let i2 = h$1(this, o$1).cstring();
  return new ee$1(n2, i2);
}, it = function(t, n2, r2) {
  let i2 = r2.slice(t, t + (n2 - 4));
  return new z$1(n2, new Uint8Array(i2));
}, at = function(t, n2, r2) {
  return T(this, l$1, ke$1).call(this, t, n2, r2, "copyInResponse");
}, ot = function(t, n2, r2) {
  return T(this, l$1, ke$1).call(this, t, n2, r2, "copyOutResponse");
}, ke$1 = function(t, n2, r2, i2) {
  h$1(this, o$1).setBuffer(t, r2);
  let a2 = h$1(this, o$1).byte() !== 0, u2 = h$1(this, o$1).int16(), d2 = new H$2(n2, i2, a2, u2);
  for (let c2 = 0; c2 < u2; c2++) d2.columnTypes[c2] = h$1(this, o$1).int16();
  return d2;
}, ut = function(t, n2, r2) {
  h$1(this, o$1).setBuffer(t, r2);
  let i2 = h$1(this, o$1).int32(), a2 = h$1(this, o$1).cstring(), u2 = h$1(this, o$1).cstring();
  return new X(n2, i2, a2, u2);
}, lt = function(t, n2, r2) {
  h$1(this, o$1).setBuffer(t, r2);
  let i2 = h$1(this, o$1).int16(), a2 = new Y$1(n2, i2);
  for (let u2 = 0; u2 < i2; u2++) a2.fields[u2] = T(this, l$1, ct).call(this);
  return a2;
}, ct = function() {
  let t = h$1(this, o$1).cstring(), n2 = h$1(this, o$1).int32(), r2 = h$1(this, o$1).int16(), i2 = h$1(this, o$1).int32(), a2 = h$1(this, o$1).int16(), u2 = h$1(this, o$1).int32(), d2 = h$1(this, o$1).int16() === 0 ? Le.text : Le.binary;
  return new q(t, n2, r2, i2, a2, u2, d2);
}, pt = function(t, n2, r2) {
  h$1(this, o$1).setBuffer(t, r2);
  let i2 = h$1(this, o$1).int16(), a2 = new $$1(n2, i2);
  for (let u2 = 0; u2 < i2; u2++) a2.dataTypeIDs[u2] = h$1(this, o$1).int32();
  return a2;
}, dt = function(t, n2, r2) {
  h$1(this, o$1).setBuffer(t, r2);
  let i2 = h$1(this, o$1).int16(), a2 = new Array(i2);
  for (let u2 = 0; u2 < i2; u2++) {
    let d2 = h$1(this, o$1).int32();
    a2[u2] = d2 === -1 ? null : h$1(this, o$1).string(d2);
  }
  return new te$1(n2, a2);
}, ft = function(t, n2, r2) {
  h$1(this, o$1).setBuffer(t, r2);
  let i2 = h$1(this, o$1).cstring(), a2 = h$1(this, o$1).cstring();
  return new K$1(n2, i2, a2);
}, mt = function(t, n2, r2) {
  h$1(this, o$1).setBuffer(t, r2);
  let i2 = h$1(this, o$1).int32(), a2 = h$1(this, o$1).int32();
  return new J$1(n2, i2, a2);
}, yt = function(t, n2, r2) {
  h$1(this, o$1).setBuffer(t, r2);
  let i2 = h$1(this, o$1).int32();
  switch (i2) {
    case 0:
      return new v(n2);
    case 3:
      return new G$1(n2);
    case 5:
      return new W$1(n2, h$1(this, o$1).bytes(4));
    case 10: {
      let a2 = [];
      for (; ; ) {
        let u2 = h$1(this, o$1).cstring();
        if (u2.length === 0) return new j$1(n2, a2);
        a2.push(u2);
      }
    }
    case 11:
      return new Q(n2, h$1(this, o$1).string(n2 - 8));
    case 12:
      return new _(n2, h$1(this, o$1).string(n2 - 8));
    default:
      throw new Error("Unknown authenticationOk message type " + i2);
  }
}, Ve$1 = function(t, n2, r2, i2) {
  h$1(this, o$1).setBuffer(t, r2);
  let a2 = {}, u2 = h$1(this, o$1).string(1);
  for (; u2 !== "\0"; ) a2[u2] = h$1(this, o$1).cstring(), u2 = h$1(this, o$1).string(1);
  let d2 = a2.M, c2 = i2 === "notice" ? new ne(n2, d2) : new E(d2, n2, i2);
  return c2.severity = a2.S, c2.code = a2.C, c2.detail = a2.D, c2.hint = a2.H, c2.position = a2.P, c2.internalPosition = a2.p, c2.internalQuery = a2.q, c2.where = a2.W, c2.schema = a2.s, c2.table = a2.t, c2.column = a2.c, c2.dataType = a2.d, c2.constraint = a2.n, c2.file = a2.F, c2.line = a2.L, c2.routine = a2.R, c2;
};
u$1();
var Fe$1 = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string", se$1;
async function Rr() {
  if (Fe$1 || se$1) return;
  let e = new URL("" + new URL("postgres-CyuUVpXN.wasm", import.meta.url).href, import.meta.url);
  se$1 = fetch(e);
}
var k$1;
async function Tr(e, t) {
  if (t || k$1) return WebAssembly.instantiate(t || k$1, e), { instance: await WebAssembly.instantiate(t || k$1, e), module: t || k$1 };
  let n2 = new URL("" + new URL("postgres-CyuUVpXN.wasm", import.meta.url).href, import.meta.url);
  if (Fe$1) {
    let i2 = await (await __vitePreload(async () => {
      const { readFile } = await import("./__vite-browser-external-2Ng8QIWW.js");
      return { readFile };
    }, true ? [] : void 0, import.meta.url)).readFile(n2), { module: a2, instance: u2 } = await WebAssembly.instantiate(i2, e);
    return k$1 = a2, { instance: u2, module: a2 };
  } else {
    se$1 || (se$1 = fetch(n2));
    let r2 = await se$1, { module: i2, instance: a2 } = await WebAssembly.instantiateStreaming(r2, e);
    return k$1 = i2, { instance: a2, module: i2 };
  }
}
async function Er() {
  let e = new URL("" + new URL("postgres-CkP7QCDB.data", import.meta.url).href, import.meta.url);
  return Fe$1 ? (await (await __vitePreload(async () => {
    const { readFile } = await import("./__vite-browser-external-2Ng8QIWW.js");
    return { readFile };
  }, true ? [] : void 0, import.meta.url)).readFile(e)).buffer : (await fetch(e)).arrayBuffer();
}
function Nr(e) {
  let t;
  return e.startsWith('"') && e.endsWith('"') ? t = e.substring(1, e.length - 1) : t = e.toLowerCase(), t;
}
u$1();
var o = { part: "part", container: "container" };
function s(t, r2, ...e) {
  let a2 = t.length - 1, p2 = e.length - 1;
  if (p2 !== -1) {
    if (p2 === 0) {
      t[a2] = t[a2] + e[0] + r2;
      return;
    }
    t[a2] = t[a2] + e[0], t.push(...e.slice(1, p2)), t.push(e[p2] + r2);
  }
}
function y(t, ...r2) {
  let e = [t[0]];
  e.raw = [t.raw[0]];
  let a2 = [];
  for (let p2 = 0; p2 < r2.length; p2++) {
    let n2 = r2[p2], i2 = p2 + 1;
    if (n2?._templateType === o.part) {
      s(e, t[i2], n2.str), s(e.raw, t.raw[i2], n2.str);
      continue;
    }
    if (n2?._templateType === o.container) {
      s(e, t[i2], ...n2.strings), s(e.raw, t.raw[i2], ...n2.strings.raw), a2.push(...n2.values);
      continue;
    }
    e.push(t[i2]), e.raw.push(t.raw[i2]), a2.push(n2);
  }
  return { _templateType: "container", strings: e, values: a2 };
}
function g$2(t, ...r2) {
  let { strings: e, values: a2 } = y(t, ...r2);
  return { query: [e[0], ...a2.flatMap((p2, n2) => [`$${n2 + 1}`, e[n2 + 1]])].join(""), params: a2 };
}
u$1();
var b, u, r, l, g$1, h, R, z = class {
  constructor() {
    R$2(this, r);
    this.serializers = { ...cn };
    this.parsers = { ...ln };
    R$2(this, b, false);
    R$2(this, u, false);
  }
  async _initArrayTypes({ force: t = false } = {}) {
    if (h$1(this, b) && !t) return;
    x$2(this, b, true);
    let e = await this.query(`
      SELECT b.oid, b.typarray
      FROM pg_catalog.pg_type a
      LEFT JOIN pg_catalog.pg_type b ON b.oid = a.typelem
      WHERE a.typcategory = 'A'
      GROUP BY b.oid, b.typarray
      ORDER BY b.oid
    `);
    for (let s2 of e.rows) this.serializers[s2.typarray] = (i2) => Ke$1(i2, this.serializers[s2.oid], s2.typarray), this.parsers[s2.typarray] = (i2) => yn(i2, this.parsers[s2.oid], s2.typarray);
  }
  async refreshArrayTypes() {
    await this._initArrayTypes({ force: true });
  }
  async query(t, e, s2) {
    return await this._checkReady(), await this._runExclusiveTransaction(async () => await T(this, r, g$1).call(this, t, e, s2));
  }
  async sql(t, ...e) {
    let { query: s2, params: i2 } = g$2(t, ...e);
    return await this.query(s2, i2);
  }
  async exec(t, e) {
    return await this._checkReady(), await this._runExclusiveTransaction(async () => await T(this, r, h).call(this, t, e));
  }
  async describeQuery(t, e) {
    try {
      await T(this, r, l).call(this, O$1.parse({ text: t, types: e?.paramTypes }), e);
      let s2 = await T(this, r, l).call(this, O$1.describe({ type: "S" }), e), i2 = s2.messages.find((n2) => n2.name === "parameterDescription"), c2 = s2.messages.find((n2) => n2.name === "rowDescription"), y2 = i2?.dataTypeIDs.map((n2) => ({ dataTypeID: n2, serializer: this.serializers[n2] })) ?? [], m2 = c2?.fields.map((n2) => ({ name: n2.name, dataTypeID: n2.dataTypeID, parser: this.parsers[n2.dataTypeID] })) ?? [];
      return { queryParams: y2, resultFields: m2 };
    } finally {
      await T(this, r, l).call(this, O$1.sync(), e);
    }
  }
  async transaction(t) {
    return await this._checkReady(), await this._runExclusiveTransaction(async () => {
      await T(this, r, h).call(this, "BEGIN"), x$2(this, u, true);
      let e = false, s2 = () => {
        if (e) throw new Error("Transaction is closed");
      }, i2 = { query: async (c2, y2, m2) => (s2(), await T(this, r, g$1).call(this, c2, y2, m2)), sql: async (c2, ...y2) => {
        let { query: m2, params: n2 } = g$2(c2, ...y2);
        return await T(this, r, g$1).call(this, m2, n2);
      }, exec: async (c2, y2) => (s2(), await T(this, r, h).call(this, c2, y2)), rollback: async () => {
        s2(), await T(this, r, h).call(this, "ROLLBACK"), e = true;
      }, get closed() {
        return e;
      } };
      try {
        let c2 = await t(i2);
        return e || (e = true, await T(this, r, h).call(this, "COMMIT")), x$2(this, u, false), c2;
      } catch (c2) {
        throw e || await T(this, r, h).call(this, "ROLLBACK"), x$2(this, u, false), c2;
      }
    });
  }
  async runExclusive(t) {
    return await this._runExclusiveQuery(t);
  }
};
b = /* @__PURE__ */ new WeakMap(), u = /* @__PURE__ */ new WeakMap(), r = /* @__PURE__ */ new WeakSet(), l = async function(t, e = {}) {
  return await this.execProtocol(t, { ...e, syncToFs: false });
}, g$1 = async function(t, e = [], s2) {
  return await this._runExclusiveQuery(async () => {
    T(this, r, R).call(this, "runQuery", t, e, s2), await this._handleBlob(s2?.blob);
    let i2;
    try {
      let { messages: y2 } = await T(this, r, l).call(this, O$1.parse({ text: t, types: s2?.paramTypes }), s2), m2 = De((await T(this, r, l).call(this, O$1.describe({ type: "S" }), s2)).messages), n2 = e.map((T2, B) => {
        let x2 = m2[B];
        if (T2 == null) return null;
        let _2 = s2?.serializers?.[x2] ?? this.serializers[x2];
        return _2 ? _2(T2) : T2.toString();
      });
      i2 = [...y2, ...(await T(this, r, l).call(this, O$1.bind({ values: n2 }), s2)).messages, ...(await T(this, r, l).call(this, O$1.describe({ type: "P" }), s2)).messages, ...(await T(this, r, l).call(this, O$1.execute({}), s2)).messages];
    } finally {
      await T(this, r, l).call(this, O$1.sync(), s2);
    }
    await this._cleanupBlob(), h$1(this, u) || await this.syncToFs();
    let c2 = await this._getWrittenBlob();
    return bn(i2, this.parsers, s2, c2)[0];
  });
}, h = async function(t, e) {
  return await this._runExclusiveQuery(async () => {
    T(this, r, R).call(this, "runExec", t, e), await this._handleBlob(e?.blob);
    let s2;
    try {
      s2 = (await T(this, r, l).call(this, O$1.query(t), e)).messages;
    } finally {
      await T(this, r, l).call(this, O$1.sync(), e);
    }
    this._cleanupBlob(), h$1(this, u) || await this.syncToFs();
    let i2 = await this._getWrittenBlob();
    return bn(s2, this.parsers, e, i2);
  });
}, R = function(...t) {
  this.debug > 0 && console.log(...t);
};
var w = D$1(($r, l2) => {
  u$1();
  var j3 = 9007199254740991, B = /* @__PURE__ */ function(r2) {
    return r2;
  }();
  function mr(r2) {
    return r2 === B;
  }
  function q2(r2) {
    return typeof r2 == "string" || Object.prototype.toString.call(r2) == "[object String]";
  }
  function lr(r2) {
    return Object.prototype.toString.call(r2) == "[object Date]";
  }
  function N2(r2) {
    return r2 !== null && typeof r2 == "object";
  }
  function U2(r2) {
    return typeof r2 == "function";
  }
  function fr(r2) {
    return typeof r2 == "number" && r2 > -1 && r2 % 1 == 0 && r2 <= j3;
  }
  function yr(r2) {
    return Object.prototype.toString.call(r2) == "[object Array]";
  }
  function Y3(r2) {
    return N2(r2) && !U2(r2) && fr(r2.length);
  }
  function D2(r2) {
    return Object.prototype.toString.call(r2) == "[object ArrayBuffer]";
  }
  function gr(r2, e) {
    return Array.prototype.map.call(r2, e);
  }
  function hr(r2, e) {
    var t = B;
    return U2(e) && Array.prototype.every.call(r2, function(s2, a2, n2) {
      var o2 = e(s2, a2, n2);
      return o2 && (t = s2), !o2;
    }), t;
  }
  function Sr(r2) {
    return Object.assign.apply(null, arguments);
  }
  function W3(r2) {
    var e, t, s2;
    if (q2(r2)) {
      for (t = r2.length, s2 = new Uint8Array(t), e = 0; e < t; e++) s2[e] = r2.charCodeAt(e) & 255;
      return s2;
    }
    return D2(r2) ? new Uint8Array(r2) : N2(r2) && D2(r2.buffer) ? new Uint8Array(r2.buffer) : Y3(r2) ? new Uint8Array(r2) : N2(r2) && U2(r2.toString) ? W3(r2.toString()) : new Uint8Array();
  }
  l2.exports.MAX_SAFE_INTEGER = j3;
  l2.exports.isUndefined = mr;
  l2.exports.isString = q2;
  l2.exports.isObject = N2;
  l2.exports.isDateTime = lr;
  l2.exports.isFunction = U2;
  l2.exports.isArray = yr;
  l2.exports.isArrayLike = Y3;
  l2.exports.isArrayBuffer = D2;
  l2.exports.map = gr;
  l2.exports.find = hr;
  l2.exports.extend = Sr;
  l2.exports.toUint8Array = W3;
});
var x = D$1((Qr, X2) => {
  u$1();
  var M2 = "\0";
  X2.exports = { NULL_CHAR: M2, TMAGIC: "ustar" + M2 + "00", OLDGNU_MAGIC: "ustar  " + M2, REGTYPE: 0, LNKTYPE: 1, SYMTYPE: 2, CHRTYPE: 3, BLKTYPE: 4, DIRTYPE: 5, FIFOTYPE: 6, CONTTYPE: 7, TSUID: parseInt("4000", 8), TSGID: parseInt("2000", 8), TSVTX: parseInt("1000", 8), TUREAD: parseInt("0400", 8), TUWRITE: parseInt("0200", 8), TUEXEC: parseInt("0100", 8), TGREAD: parseInt("0040", 8), TGWRITE: parseInt("0020", 8), TGEXEC: parseInt("0010", 8), TOREAD: parseInt("0004", 8), TOWRITE: parseInt("0002", 8), TOEXEC: parseInt("0001", 8), TPERMALL: parseInt("0777", 8), TPERMMASK: parseInt("0777", 8) };
});
var L = D$1((ee3, f2) => {
  u$1();
  var K3 = w(), p2 = x(), Fr = 512, I = p2.TPERMALL, V2 = 0, Z3 = 0, _2 = [["name", 100, 0, function(r2, e) {
    return v2(r2[e[0]], e[1]);
  }, function(r2, e, t) {
    return A2(r2.slice(e, e + t[1]));
  }], ["mode", 8, 100, function(r2, e) {
    var t = r2[e[0]] || I;
    return t = t & p2.TPERMMASK, P2(t, e[1], I);
  }, function(r2, e, t) {
    var s2 = S2(r2.slice(e, e + t[1]));
    return s2 &= p2.TPERMMASK, s2;
  }], ["uid", 8, 108, function(r2, e) {
    return P2(r2[e[0]], e[1], V2);
  }, function(r2, e, t) {
    return S2(r2.slice(e, e + t[1]));
  }], ["gid", 8, 116, function(r2, e) {
    return P2(r2[e[0]], e[1], Z3);
  }, function(r2, e, t) {
    return S2(r2.slice(e, e + t[1]));
  }], ["size", 12, 124, function(r2, e) {
    return P2(r2.data.length, e[1]);
  }, function(r2, e, t) {
    return S2(r2.slice(e, e + t[1]));
  }], ["modifyTime", 12, 136, function(r2, e) {
    return k2(r2[e[0]], e[1]);
  }, function(r2, e, t) {
    return z3(r2.slice(e, e + t[1]));
  }], ["checksum", 8, 148, function(r2, e) {
    return "        ";
  }, function(r2, e, t) {
    return S2(r2.slice(e, e + t[1]));
  }], ["type", 1, 156, function(r2, e) {
    return "" + (parseInt(r2[e[0]], 10) || 0) % 8;
  }, function(r2, e, t) {
    return (parseInt(String.fromCharCode(r2[e]), 10) || 0) % 8;
  }], ["linkName", 100, 157, function(r2, e) {
    return "";
  }, function(r2, e, t) {
    return A2(r2.slice(e, e + t[1]));
  }], ["ustar", 8, 257, function(r2, e) {
    return p2.TMAGIC;
  }, function(r2, e, t) {
    return br(A2(r2.slice(e, e + t[1]), true));
  }, function(r2, e) {
    return r2[e[0]] == p2.TMAGIC || r2[e[0]] == p2.OLDGNU_MAGIC;
  }], ["owner", 32, 265, function(r2, e) {
    return v2(r2[e[0]], e[1]);
  }, function(r2, e, t) {
    return A2(r2.slice(e, e + t[1]));
  }], ["group", 32, 297, function(r2, e) {
    return v2(r2[e[0]], e[1]);
  }, function(r2, e, t) {
    return A2(r2.slice(e, e + t[1]));
  }], ["majorNumber", 8, 329, function(r2, e) {
    return "";
  }, function(r2, e, t) {
    return S2(r2.slice(e, e + t[1]));
  }], ["minorNumber", 8, 337, function(r2, e) {
    return "";
  }, function(r2, e, t) {
    return S2(r2.slice(e, e + t[1]));
  }], ["prefix", 131, 345, function(r2, e) {
    return v2(r2[e[0]], e[1]);
  }, function(r2, e, t) {
    return A2(r2.slice(e, e + t[1]));
  }], ["accessTime", 12, 476, function(r2, e) {
    return k2(r2[e[0]], e[1]);
  }, function(r2, e, t) {
    return z3(r2.slice(e, e + t[1]));
  }], ["createTime", 12, 488, function(r2, e) {
    return k2(r2[e[0]], e[1]);
  }, function(r2, e, t) {
    return z3(r2.slice(e, e + t[1]));
  }]], $3 = function(r2) {
    var e = r2[r2.length - 1];
    return e[2] + e[1];
  }(_2);
  function br(r2) {
    if (r2.length == 8) {
      var e = r2.split("");
      if (e[5] == p2.NULL_CHAR) return (e[6] == " " || e[6] == p2.NULL_CHAR) && (e[6] = "0"), (e[7] == " " || e[7] == p2.NULL_CHAR) && (e[7] = "0"), e = e.join(""), e == p2.TMAGIC ? e : r2;
      if (e[7] == p2.NULL_CHAR) return e[5] == p2.NULL_CHAR && (e[5] = " "), e[6] == p2.NULL_CHAR && (e[6] = " "), e == p2.OLDGNU_MAGIC ? e : r2;
    }
    return r2;
  }
  function v2(r2, e) {
    return e -= 1, K3.isUndefined(r2) && (r2 = ""), r2 = ("" + r2).substr(0, e), r2 + p2.NULL_CHAR;
  }
  function P2(r2, e, t) {
    for (t = parseInt(t) || 0, e -= 1, r2 = (parseInt(r2) || t).toString(8).substr(-e, e); r2.length < e; ) r2 = "0" + r2;
    return r2 + p2.NULL_CHAR;
  }
  function k2(r2, e) {
    if (K3.isDateTime(r2)) r2 = Math.floor(1 * r2 / 1e3);
    else if (r2 = parseInt(r2, 10), isFinite(r2)) {
      if (r2 <= 0) return "";
    } else r2 = Math.floor(1 * /* @__PURE__ */ new Date() / 1e3);
    return P2(r2, e, 0);
  }
  function A2(r2, e) {
    var t = String.fromCharCode.apply(null, r2);
    if (e) return t;
    var s2 = t.indexOf(p2.NULL_CHAR);
    return s2 >= 0 ? t.substr(0, s2) : t;
  }
  function S2(r2) {
    var e = String.fromCharCode.apply(null, r2);
    return parseInt(e.replace(/^0+$/g, ""), 8) || 0;
  }
  function z3(r2) {
    return r2.length == 0 || r2[0] == 0 ? null : new Date(1e3 * S2(r2));
  }
  function Tr2(r2, e, t) {
    var s2 = parseInt(e, 10) || 0, a2 = Math.min(s2 + $3, r2.length), n2 = 0, o2 = 0, i2 = 0;
    t && _2.every(function(y2) {
      return y2[0] == "checksum" ? (o2 = s2 + y2[2], i2 = o2 + y2[1], false) : true;
    });
    for (var u2 = 32, c2 = s2; c2 < a2; c2++) {
      var m2 = c2 >= o2 && c2 < i2 ? u2 : r2[c2];
      n2 = (n2 + m2) % 262144;
    }
    return n2;
  }
  f2.exports.recordSize = Fr;
  f2.exports.defaultFileMode = I;
  f2.exports.defaultUid = V2;
  f2.exports.defaultGid = Z3;
  f2.exports.posixHeader = _2;
  f2.exports.effectiveHeaderSize = $3;
  f2.exports.calculateChecksum = Tr2;
  f2.exports.formatTarString = v2;
  f2.exports.formatTarNumber = P2;
  f2.exports.formatTarDateTime = k2;
  f2.exports.parseTarString = A2;
  f2.exports.parseTarNumber = S2;
  f2.exports.parseTarDateTime = z3;
});
var er = D$1((ne2, rr) => {
  u$1();
  var Ar = x(), O2 = w(), F2 = L();
  function J3(r2) {
    return F2.recordSize;
  }
  function Q2(r2) {
    return Math.ceil(r2.data.length / F2.recordSize) * F2.recordSize;
  }
  function Er2(r2) {
    var e = 0;
    return r2.forEach(function(t) {
      e += J3() + Q2(t);
    }), e += F2.recordSize * 2, new Uint8Array(e);
  }
  function Pr(r2, e, t) {
    t = parseInt(t) || 0;
    var s2 = t;
    F2.posixHeader.forEach(function(u2) {
      for (var c2 = u2[3](e, u2), m2 = c2.length, y2 = 0; y2 < m2; y2 += 1) r2[s2 + y2] = c2.charCodeAt(y2) & 255;
      s2 += u2[1];
    });
    var a2 = O2.find(F2.posixHeader, function(u2) {
      return u2[0] == "checksum";
    });
    if (a2) {
      var n2 = F2.calculateChecksum(r2, t, true), o2 = F2.formatTarNumber(n2, a2[1] - 2) + Ar.NULL_CHAR + " ";
      s2 = t + a2[2];
      for (var i2 = 0; i2 < o2.length; i2 += 1) r2[s2] = o2.charCodeAt(i2) & 255, s2++;
    }
    return t + J3();
  }
  function wr(r2, e, t) {
    return t = parseInt(t, 10) || 0, r2.set(e.data, t), t + Q2(e);
  }
  function xr(r2) {
    r2 = O2.map(r2, function(s2) {
      return O2.extend({}, s2, { data: O2.toUint8Array(s2.data) });
    });
    var e = Er2(r2), t = 0;
    return r2.forEach(function(s2) {
      t = Pr(e, s2, t), t = wr(e, s2, t);
    }), e;
  }
  rr.exports.tar = xr;
});
var nr = D$1((oe2, tr) => {
  u$1();
  var vr = x(), G3 = w(), h2 = L(), Nr2 = { extractData: true, checkHeader: true, checkChecksum: true, checkFileSize: true }, Ur = { size: true, checksum: true, ustar: true }, R3 = { unexpectedEndOfFile: "Unexpected end of file.", fileCorrupted: "File is corrupted.", checksumCheckFailed: "Checksum check failed." };
  function kr(r2) {
    return h2.recordSize;
  }
  function zr(r2) {
    return Math.ceil(r2 / h2.recordSize) * h2.recordSize;
  }
  function Or(r2, e) {
    for (var t = e, s2 = Math.min(r2.length, e + h2.recordSize * 2), a2 = t; a2 < s2; a2++) if (r2[a2] != 0) return false;
    return true;
  }
  function Cr(r2, e, t) {
    if (r2.length - e < h2.recordSize) {
      if (t.checkFileSize) throw new Error(R3.unexpectedEndOfFile);
      return null;
    }
    e = parseInt(e) || 0;
    var s2 = {}, a2 = e;
    if (h2.posixHeader.forEach(function(i2) {
      s2[i2[0]] = i2[4](r2, a2, i2), a2 += i2[1];
    }), s2.type != 0 && (s2.size = 0), t.checkHeader && h2.posixHeader.forEach(function(i2) {
      if (G3.isFunction(i2[5]) && !i2[5](s2, i2)) {
        var u2 = new Error(R3.fileCorrupted);
        throw u2.data = { offset: e + i2[2], field: i2[0] }, u2;
      }
    }), t.checkChecksum) {
      var n2 = h2.calculateChecksum(r2, e, true);
      if (n2 != s2.checksum) {
        var o2 = new Error(R3.checksumCheckFailed);
        throw o2.data = { offset: e, header: s2, checksum: n2 }, o2;
      }
    }
    return s2;
  }
  function Dr(r2, e, t, s2) {
    return s2.extractData ? t.size <= 0 ? new Uint8Array() : r2.slice(e, e + t.size) : null;
  }
  function Mr(r2, e) {
    var t = {};
    return h2.posixHeader.forEach(function(s2) {
      var a2 = s2[0];
      Ur[a2] || (t[a2] = r2[a2]);
    }), t.isOldGNUFormat = r2.ustar == vr.OLDGNU_MAGIC, e && (t.data = e), t;
  }
  function Ir(r2, e) {
    e = G3.extend({}, Nr2, e);
    for (var t = [], s2 = 0, a2 = r2.length; a2 - s2 >= h2.recordSize; ) {
      r2 = G3.toUint8Array(r2);
      var n2 = Cr(r2, s2, e);
      if (!n2) break;
      s2 += kr();
      var o2 = Dr(r2, s2, n2, e);
      if (t.push(Mr(n2, o2)), s2 += zr(n2.size), Or(r2, s2)) break;
    }
    return t;
  }
  tr.exports.untar = Ir;
});
var or = D$1((se2, ir) => {
  u$1();
  var _r = w(), Lr = x(), Rr2 = er(), Gr = nr();
  _r.extend(ir.exports, Rr2, Gr, Lr);
});
u$1();
u$1();
var g = L$2(or());
async function H$1(r2, e, t = "pgdata", s2 = "auto") {
  let a2 = Br(r2, e), [n2, o2] = await qr(a2, s2), i2 = t + (o2 ? ".tar.gz" : ".tar"), u2 = o2 ? "application/x-gzip" : "application/x-tar";
  return typeof File < "u" ? new File([n2], i2, { type: u2 }) : new Blob([n2], { type: u2 });
}
var Hr = ["application/x-gtar", "application/x-tar+gzip", "application/x-gzip", "application/gzip"];
async function ce$1(r2, e, t) {
  let s2 = new Uint8Array(await e.arrayBuffer()), a2 = typeof File < "u" && e instanceof File ? e.name : void 0;
  (Hr.includes(e.type) || a2?.endsWith(".tgz") || a2?.endsWith(".tar.gz")) && (s2 = await ar(s2));
  let o2;
  try {
    o2 = (0, g.untar)(s2);
  } catch (i2) {
    if (i2 instanceof Error && i2.message.includes("File is corrupted")) s2 = await ar(s2), o2 = (0, g.untar)(s2);
    else throw i2;
  }
  for (let i2 of o2) {
    let u2 = t + i2.name, c2 = u2.split("/").slice(0, -1);
    for (let m2 = 1; m2 <= c2.length; m2++) {
      let y2 = c2.slice(0, m2).join("/");
      r2.analyzePath(y2).exists || r2.mkdir(y2);
    }
    i2.type === g.REGTYPE ? (r2.writeFile(u2, i2.data), r2.utime(u2, sr(i2.modifyTime), sr(i2.modifyTime))) : i2.type === g.DIRTYPE && r2.mkdir(u2);
  }
}
function jr(r2, e) {
  let t = [], s2 = (a2) => {
    r2.readdir(a2).forEach((o2) => {
      if (o2 === "." || o2 === "..") return;
      let i2 = a2 + "/" + o2, u2 = r2.stat(i2), c2 = r2.isFile(u2.mode) ? r2.readFile(i2, { encoding: "binary" }) : new Uint8Array(0);
      t.push({ name: i2.substring(e.length), mode: u2.mode, size: u2.size, type: r2.isFile(u2.mode) ? g.REGTYPE : g.DIRTYPE, modifyTime: u2.mtime, data: c2 }), r2.isDir(u2.mode) && s2(i2);
    });
  };
  return s2(e), t;
}
function Br(r2, e) {
  let t = jr(r2, e);
  return (0, g.tar)(t);
}
async function qr(r2, e = "auto") {
  if (e === "none") return [r2, false];
  if (typeof CompressionStream < "u") return [await Yr(r2), true];
  if (typeof process < "u" && process.versions && process.versions.node) return [await Wr(r2), true];
  if (e === "auto") return [r2, false];
  throw new Error("Compression not supported in this environment");
}
async function Yr(r2) {
  let e = new CompressionStream("gzip"), t = e.writable.getWriter(), s2 = e.readable.getReader();
  t.write(r2), t.close();
  let a2 = [];
  for (; ; ) {
    let { value: i2, done: u2 } = await s2.read();
    if (u2) break;
    i2 && a2.push(i2);
  }
  let n2 = new Uint8Array(a2.reduce((i2, u2) => i2 + u2.length, 0)), o2 = 0;
  return a2.forEach((i2) => {
    n2.set(i2, o2), o2 += i2.length;
  }), n2;
}
async function Wr(r2) {
  let { promisify: e } = await __vitePreload(() => import("./__vite-browser-external-2Ng8QIWW.js"), true ? [] : void 0, import.meta.url), { gzip: t } = await __vitePreload(async () => {
    const { gzip: t2 } = await import("./__vite-browser-external-2Ng8QIWW.js");
    return { gzip: t2 };
  }, true ? [] : void 0, import.meta.url);
  return await e(t)(r2);
}
async function ar(r2) {
  if (typeof CompressionStream < "u") return await Xr(r2);
  if (typeof process < "u" && process.versions && process.versions.node) return await Kr(r2);
  throw new Error("Unsupported environment for decompression");
}
async function Xr(r2) {
  let e = new DecompressionStream("gzip"), t = e.writable.getWriter(), s2 = e.readable.getReader();
  t.write(r2), t.close();
  let a2 = [];
  for (; ; ) {
    let { value: i2, done: u2 } = await s2.read();
    if (u2) break;
    i2 && a2.push(i2);
  }
  let n2 = new Uint8Array(a2.reduce((i2, u2) => i2 + u2.length, 0)), o2 = 0;
  return a2.forEach((i2) => {
    n2.set(i2, o2), o2 += i2.length;
  }), n2;
}
async function Kr(r2) {
  let { promisify: e } = await __vitePreload(() => import("./__vite-browser-external-2Ng8QIWW.js"), true ? [] : void 0, import.meta.url), { gunzip: t } = await __vitePreload(async () => {
    const { gunzip: t2 } = await import("./__vite-browser-external-2Ng8QIWW.js");
    return { gunzip: t2 };
  }, true ? [] : void 0, import.meta.url);
  return await e(t)(r2);
}
function sr(r2) {
  return r2 ? typeof r2 == "number" ? r2 : Math.floor(r2.getTime() / 1e3) : Math.floor(Date.now() / 1e3);
}
var Vr = "/tmp/pglite", C = Vr + "/base", ur = class {
  constructor(e) {
    this.dataDir = e;
  }
  async init(e, t) {
    return this.pg = e, { emscriptenOpts: t };
  }
  async syncToFs(e) {
  }
  async initialSyncFs() {
  }
  async closeFs() {
  }
  async dumpTar(e, t) {
    return H$1(this.pg.Module.FS, C, e, t);
  }
}, cr = class {
  constructor(e, { debug: t = false } = {}) {
    this.dataDir = e, this.debug = t;
  }
  async syncToFs(e) {
  }
  async initialSyncFs() {
  }
  async closeFs() {
  }
  async dumpTar(e, t) {
    return H$1(this.pg.Module.FS, C, e, t);
  }
  async init(e, t) {
    return this.pg = e, { emscriptenOpts: { ...t, preRun: [...t.preRun || [], (a2) => {
      let n2 = Zr(a2, this);
      a2.FS.mkdir(C), a2.FS.mount(n2, {}, C);
    }] } };
  }
}, pr = { EBADF: 8, EBADFD: 127, EEXIST: 20, EINVAL: 28, EISDIR: 31, ENODEV: 43, ENOENT: 44, ENOTDIR: 54, ENOTEMPTY: 55 }, Zr = (r2, e) => {
  let t = r2.FS, s2 = e.debug ? console.log : null, a2 = { tryFSOperation(n2) {
    try {
      return n2();
    } catch (o2) {
      throw o2.code ? o2.code === "UNKNOWN" ? new t.ErrnoError(pr.EINVAL) : new t.ErrnoError(o2.code) : o2;
    }
  }, mount(n2) {
    return a2.createNode(null, "/", 16895, 0);
  }, syncfs(n2, o2, i2) {
  }, createNode(n2, o2, i2, u2) {
    if (!t.isDir(i2) && !t.isFile(i2)) throw new t.ErrnoError(28);
    let c2 = t.createNode(n2, o2, i2);
    return c2.node_ops = a2.node_ops, c2.stream_ops = a2.stream_ops, c2;
  }, getMode: function(n2) {
    return s2?.("getMode", n2), a2.tryFSOperation(() => e.lstat(n2).mode);
  }, realPath: function(n2) {
    let o2 = [];
    for (; n2.parent !== n2; ) o2.push(n2.name), n2 = n2.parent;
    return o2.push(n2.mount.opts.root), o2.reverse(), o2.join("/");
  }, node_ops: { getattr(n2) {
    s2?.("getattr", a2.realPath(n2));
    let o2 = a2.realPath(n2);
    return a2.tryFSOperation(() => {
      let i2 = e.lstat(o2);
      return { ...i2, dev: 0, ino: n2.id, nlink: 1, rdev: n2.rdev, atime: new Date(i2.atime), mtime: new Date(i2.mtime), ctime: new Date(i2.ctime) };
    });
  }, setattr(n2, o2) {
    s2?.("setattr", a2.realPath(n2), o2);
    let i2 = a2.realPath(n2);
    a2.tryFSOperation(() => {
      o2.mode !== void 0 && e.chmod(i2, o2.mode), o2.size !== void 0 && e.truncate(i2, o2.size), o2.timestamp !== void 0 && e.utimes(i2, o2.timestamp, o2.timestamp), o2.size !== void 0 && e.truncate(i2, o2.size);
    });
  }, lookup(n2, o2) {
    s2?.("lookup", a2.realPath(n2), o2);
    let i2 = [a2.realPath(n2), o2].join("/"), u2 = a2.getMode(i2);
    return a2.createNode(n2, o2, u2);
  }, mknod(n2, o2, i2, u2) {
    s2?.("mknod", a2.realPath(n2), o2, i2, u2);
    let c2 = a2.createNode(n2, o2, i2, u2), m2 = a2.realPath(c2);
    return a2.tryFSOperation(() => (t.isDir(c2.mode) ? e.mkdir(m2, { mode: i2 }) : e.writeFile(m2, "", { mode: i2 }), c2));
  }, rename(n2, o2, i2) {
    s2?.("rename", a2.realPath(n2), a2.realPath(o2), i2);
    let u2 = a2.realPath(n2), c2 = [a2.realPath(o2), i2].join("/");
    a2.tryFSOperation(() => {
      e.rename(u2, c2);
    }), n2.name = i2;
  }, unlink(n2, o2) {
    s2?.("unlink", a2.realPath(n2), o2);
    let i2 = [a2.realPath(n2), o2].join("/");
    try {
      e.unlink(i2);
    } catch {
    }
  }, rmdir(n2, o2) {
    s2?.("rmdir", a2.realPath(n2), o2);
    let i2 = [a2.realPath(n2), o2].join("/");
    return a2.tryFSOperation(() => {
      e.rmdir(i2);
    });
  }, readdir(n2) {
    s2?.("readdir", a2.realPath(n2));
    let o2 = a2.realPath(n2);
    return a2.tryFSOperation(() => e.readdir(o2));
  }, symlink(n2, o2, i2) {
    throw s2?.("symlink", a2.realPath(n2), o2, i2), new t.ErrnoError(63);
  }, readlink(n2) {
    throw s2?.("readlink", a2.realPath(n2)), new t.ErrnoError(63);
  } }, stream_ops: { open(n2) {
    s2?.("open stream", a2.realPath(n2.node));
    let o2 = a2.realPath(n2.node);
    return a2.tryFSOperation(() => {
      t.isFile(n2.node.mode) && (n2.shared.refcount = 1, n2.nfd = e.open(o2));
    });
  }, close(n2) {
    return s2?.("close stream", a2.realPath(n2.node)), a2.tryFSOperation(() => {
      t.isFile(n2.node.mode) && n2.nfd && --n2.shared.refcount === 0 && e.close(n2.nfd);
    });
  }, dup(n2) {
    s2?.("dup stream", a2.realPath(n2.node)), n2.shared.refcount++;
  }, read(n2, o2, i2, u2, c2) {
    return s2?.("read stream", a2.realPath(n2.node), i2, u2, c2), u2 === 0 ? 0 : a2.tryFSOperation(() => e.read(n2.nfd, o2, i2, u2, c2));
  }, write(n2, o2, i2, u2, c2) {
    return s2?.("write stream", a2.realPath(n2.node), i2, u2, c2), a2.tryFSOperation(() => e.write(n2.nfd, o2.buffer, i2, u2, c2));
  }, llseek(n2, o2, i2) {
    s2?.("llseek stream", a2.realPath(n2.node), o2, i2);
    let u2 = o2;
    if (i2 === 1 ? u2 += n2.position : i2 === 2 && t.isFile(n2.node.mode) && a2.tryFSOperation(() => {
      let c2 = e.fstat(n2.nfd);
      u2 += c2.size;
    }), u2 < 0) throw new t.ErrnoError(28);
    return u2;
  }, mmap(n2, o2, i2, u2, c2) {
    if (s2?.("mmap stream", a2.realPath(n2.node), o2, i2, u2, c2), !t.isFile(n2.node.mode)) throw new t.ErrnoError(pr.ENODEV);
    let m2 = r2.mmapAlloc(o2);
    return a2.stream_ops.read(n2, r2.HEAP8, m2, o2, i2), { ptr: m2, allocated: true };
  }, msync(n2, o2, i2, u2, c2) {
    return s2?.("msync stream", a2.realPath(n2.node), i2, u2, c2), a2.stream_ops.write(n2, o2, 0, u2, i2), 0;
  } } };
  return a2;
};
u$1();
u$1();
u$1();
var He = new Error("request for lock canceled"), We = function(e, t, r2, a2) {
  function o2(s2) {
    return s2 instanceof r2 ? s2 : new r2(function(l2) {
      l2(s2);
    });
  }
  return new (r2 || (r2 = Promise))(function(s2, l2) {
    function n2(p2) {
      try {
        m2(a2.next(p2));
      } catch (d2) {
        l2(d2);
      }
    }
    function _2(p2) {
      try {
        m2(a2.throw(p2));
      } catch (d2) {
        l2(d2);
      }
    }
    function m2(p2) {
      p2.done ? s2(p2.value) : o2(p2.value).then(n2, _2);
    }
    m2((a2 = a2.apply(e, [])).next());
  });
}, ce = class {
  constructor(t, r2 = He) {
    this._value = t, this._cancelError = r2, this._weightedQueues = [], this._weightedWaiters = [];
  }
  acquire(t = 1) {
    if (t <= 0) throw new Error(`invalid weight ${t}: must be positive`);
    return new Promise((r2, a2) => {
      this._weightedQueues[t - 1] || (this._weightedQueues[t - 1] = []), this._weightedQueues[t - 1].push({ resolve: r2, reject: a2 }), this._dispatch();
    });
  }
  runExclusive(t, r2 = 1) {
    return We(this, void 0, void 0, function* () {
      let [a2, o2] = yield this.acquire(r2);
      try {
        return yield t(a2);
      } finally {
        o2();
      }
    });
  }
  waitForUnlock(t = 1) {
    if (t <= 0) throw new Error(`invalid weight ${t}: must be positive`);
    return new Promise((r2) => {
      this._weightedWaiters[t - 1] || (this._weightedWaiters[t - 1] = []), this._weightedWaiters[t - 1].push(r2), this._dispatch();
    });
  }
  isLocked() {
    return this._value <= 0;
  }
  getValue() {
    return this._value;
  }
  setValue(t) {
    this._value = t, this._dispatch();
  }
  release(t = 1) {
    if (t <= 0) throw new Error(`invalid weight ${t}: must be positive`);
    this._value += t, this._dispatch();
  }
  cancel() {
    this._weightedQueues.forEach((t) => t.forEach((r2) => r2.reject(this._cancelError))), this._weightedQueues = [];
  }
  _dispatch() {
    var t;
    for (let r2 = this._value; r2 > 0; r2--) {
      let a2 = (t = this._weightedQueues[r2 - 1]) === null || t === void 0 ? void 0 : t.shift();
      if (!a2) continue;
      let o2 = this._value, s2 = r2;
      this._value -= r2, r2 = this._value + 1, a2.resolve([o2, this._newReleaser(s2)]);
    }
    this._drainUnlockWaiters();
  }
  _newReleaser(t) {
    let r2 = false;
    return () => {
      r2 || (r2 = true, this.release(t));
    };
  }
  _drainUnlockWaiters() {
    for (let t = this._value; t > 0; t--) this._weightedWaiters[t - 1] && (this._weightedWaiters[t - 1].forEach((r2) => r2()), this._weightedWaiters[t - 1] = []);
  }
}, je = function(e, t, r2, a2) {
  function o2(s2) {
    return s2 instanceof r2 ? s2 : new r2(function(l2) {
      l2(s2);
    });
  }
  return new (r2 || (r2 = Promise))(function(s2, l2) {
    function n2(p2) {
      try {
        m2(a2.next(p2));
      } catch (d2) {
        l2(d2);
      }
    }
    function _2(p2) {
      try {
        m2(a2.throw(p2));
      } catch (d2) {
        l2(d2);
      }
    }
    function m2(p2) {
      p2.done ? s2(p2.value) : o2(p2.value).then(n2, _2);
    }
    m2((a2 = a2.apply(e, [])).next());
  });
}, H = class {
  constructor(t) {
    this._semaphore = new ce(1, t);
  }
  acquire() {
    return je(this, void 0, void 0, function* () {
      let [, t] = yield this._semaphore.acquire();
      return t;
    });
  }
  runExclusive(t) {
    return this._semaphore.runExclusive(() => t());
  }
  isLocked() {
    return this._semaphore.isLocked();
  }
  waitForUnlock() {
    return this._semaphore.waitForUnlock();
  }
  release() {
    this._semaphore.isLocked() && this._semaphore.release();
  }
  cancel() {
    return this._semaphore.cancel();
  }
};
u$1();
var Ie = L$2(or());
async function ge(e) {
  if (Fe$1) {
    let t = await __vitePreload(() => import("./__vite-browser-external-2Ng8QIWW.js"), true ? [] : void 0, import.meta.url), r2 = await __vitePreload(() => import("./__vite-browser-external-2Ng8QIWW.js"), true ? [] : void 0, import.meta.url), { Writable: a2 } = await __vitePreload(async () => {
      const { Writable: a3 } = await import("./__vite-browser-external-2Ng8QIWW.js");
      return { Writable: a3 };
    }, true ? [] : void 0, import.meta.url), { pipeline: o2 } = await __vitePreload(async () => {
      const { pipeline: o3 } = await import("./__vite-browser-external-2Ng8QIWW.js");
      return { pipeline: o3 };
    }, true ? [] : void 0, import.meta.url);
    if (!t.existsSync(e)) throw new Error(`Extension bundle not found: ${e}`);
    let s2 = r2.createGunzip(), l2 = [];
    return await o2(t.createReadStream(e), s2, new a2({ write(n2, _2, m2) {
      l2.push(n2), m2();
    } })), new Blob(l2);
  } else {
    let t = await fetch(e.toString());
    if (!t.ok || !t.body) return null;
    if (t.headers.get("Content-Encoding") === "gzip") return t.blob();
    {
      let r2 = new DecompressionStream("gzip");
      return new Response(t.body.pipeThrough(r2)).blob();
    }
  }
}
async function Pe(e, t) {
  for (let r2 in e.pg_extensions) {
    let a2;
    try {
      a2 = await e.pg_extensions[r2];
    } catch (o2) {
      console.error("Failed to fetch extension:", r2, o2);
      continue;
    }
    if (a2) {
      let o2 = new Uint8Array(await a2.arrayBuffer());
      Ve(e, r2, o2, t);
    } else console.error("Could not get binary data for extension:", r2);
  }
}
function Ve(e, t, r2, a2) {
  Ie.default.untar(r2).forEach((s2) => {
    if (!s2.name.startsWith(".")) {
      let l2 = e.WASM_PREFIX + "/" + s2.name;
      if (s2.name.endsWith(".so")) {
        let n2 = (...m2) => {
          a2("pgfs:ext OK", l2, m2);
        }, _2 = (...m2) => {
          a2("pgfs:ext FAIL", l2, m2);
        };
        e.FS.createPreloadedFile(Ke(l2), s2.name.split("/").pop().slice(0, -3), s2.data, true, true, n2, _2, false);
      } else e.FS.writeFile(l2, s2.data);
    }
  });
}
function Ke(e) {
  let t = e.lastIndexOf("/");
  return t > 0 ? e.slice(0, t) : e;
}
u$1();
u$1();
var ee = class extends ur {
  async init(t, r2) {
    return this.pg = t, { emscriptenOpts: { ...r2, preRun: [...r2.preRun || [], (o2) => {
      let s2 = o2.FS.filesystems.IDBFS;
      o2.FS.mkdir("/pglite"), o2.FS.mkdir(`/pglite/${this.dataDir}`), o2.FS.mount(s2, {}, `/pglite/${this.dataDir}`), o2.FS.symlink(`/pglite/${this.dataDir}`, C);
    }] } };
  }
  initialSyncFs() {
    return new Promise((t, r2) => {
      this.pg.Module.FS.syncfs(true, (a2) => {
        a2 ? r2(a2) : t();
      });
    });
  }
  syncToFs(t) {
    return new Promise((r2, a2) => {
      this.pg.Module.FS.syncfs(false, (o2) => {
        o2 ? a2(o2) : r2();
      });
    });
  }
  async closeFs() {
    let t = this.pg.Module.FS.filesystems.IDBFS.dbs[this.dataDir];
    t && t.close(), this.pg.Module.FS.quit();
  }
};
u$1();
var te = class extends ur {
  async closeFs() {
    this.pg.Module.FS.quit();
  }
};
function Fe(e) {
  let t;
  if (e?.startsWith("file://")) {
    if (e = e.slice(7), !e) throw new Error("Invalid dataDir, must be a valid path");
    t = "nodefs";
  } else e?.startsWith("idb://") ? (e = e.slice(6), t = "idbfs") : e?.startsWith("opfs-ahp://") ? (e = e.slice(11), t = "opfs-ahp") : !e || e?.startsWith("memory://") ? t = "memoryfs" : t = "nodefs";
  return { dataDir: e, fsType: t };
}
async function Ae(e, t) {
  let r2;
  if (e && t === "nodefs") {
    let { NodeFS: a2 } = await __vitePreload(() => import("./nodefs-BFAPeoIz.js"), true ? [] : void 0, import.meta.url);
    r2 = new a2(e);
  } else if (e && t === "idbfs") r2 = new ee(e);
  else if (e && t === "opfs-ahp") {
    let { OpfsAhpFS: a2 } = await __vitePreload(() => import("./opfs-ahp-fBC2UjMN.js"), true ? [] : void 0, import.meta.url);
    r2 = new a2(e);
  } else r2 = new te();
  return r2;
}
u$1();
u$1();
var Qe = (() => {
  var _scriptName = import.meta.url;
  return async function(moduleArg = {}) {
    var moduleRtn, Module = moduleArg, readyPromiseResolve, readyPromiseReject, readyPromise = new Promise((e, t) => {
      readyPromiseResolve = e, readyPromiseReject = t;
    }), ENVIRONMENT_IS_WEB = typeof window == "object", ENVIRONMENT_IS_WORKER = typeof WorkerGlobalScope < "u", ENVIRONMENT_IS_NODE = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string" && process.type != "renderer";
    if (ENVIRONMENT_IS_NODE) {
      let { createRequire: e } = await __vitePreload(() => import("./__vite-browser-external-2Ng8QIWW.js"), true ? [] : void 0, import.meta.url), t = import.meta.url;
      t.startsWith("data:") && (t = "/");
      var require = e(t);
    }
    Module.expectedDataFileDownloads ?? (Module.expectedDataFileDownloads = 0), Module.expectedDataFileDownloads++, (() => {
      var e = typeof ENVIRONMENT_IS_PTHREAD < "u" && ENVIRONMENT_IS_PTHREAD, t = typeof ENVIRONMENT_IS_WASM_WORKER < "u" && ENVIRONMENT_IS_WASM_WORKER;
      if (e || t) return;
      var r2 = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string";
      function a2(o2) {
        typeof window == "object" ? window.encodeURIComponent(window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/")) + "/") : typeof process > "u" && typeof location < "u" && encodeURIComponent(location.pathname.substring(0, location.pathname.lastIndexOf("/")) + "/");
        var l2 = "postgres.data", n2 = "postgres.data", _2 = Module.locateFile ? Module.locateFile(n2, "") : n2, m2 = o2.remote_package_size;
        function p2(u2, w2, h2, S2) {
          if (r2) {
            require("fs").readFile(u2, (M2, y2) => {
              M2 ? S2(M2) : h2(y2.buffer);
            });
            return;
          }
          Module.dataFileDownloads ?? (Module.dataFileDownloads = {}), fetch(u2).catch((M2) => Promise.reject(new Error(`Network Error: ${u2}`, { cause: M2 }))).then((M2) => {
            if (!M2.ok) return Promise.reject(new Error(`${M2.status}: ${M2.url}`));
            if (!M2.body && M2.arrayBuffer) return M2.arrayBuffer().then(h2);
            let y2 = M2.body.getReader(), x2 = () => y2.read().then(X2).catch((R3) => Promise.reject(new Error(`Unexpected error while handling : ${M2.url} ${R3}`, { cause: R3 }))), E2 = [], b2 = M2.headers, T2 = Number(b2.get("Content-Length") ?? w2), D2 = 0, X2 = ({ done: R3, value: z3 }) => {
              if (R3) {
                let P2 = new Uint8Array(E2.map((A2) => A2.length).reduce((A2, Re2) => A2 + Re2, 0)), U2 = 0;
                for (let A2 of E2) P2.set(A2, U2), U2 += A2.length;
                h2(P2.buffer);
              } else {
                E2.push(z3), D2 += z3.length, Module.dataFileDownloads[u2] = { loaded: D2, total: T2 };
                let P2 = 0, U2 = 0;
                for (let A2 of Object.values(Module.dataFileDownloads)) P2 += A2.loaded, U2 += A2.total;
                return Module.setStatus?.(`Downloading data... (${P2}/${U2})`), x2();
              }
            };
            return Module.setStatus?.("Downloading data..."), x2();
          });
        }
        function d2(u2) {
          console.error("package error:", u2);
        }
        var g2 = null, c2 = Module.getPreloadedPackage ? Module.getPreloadedPackage(_2, m2) : null;
        c2 || p2(_2, m2, (u2) => {
          g2 ? (g2(u2), g2 = null) : c2 = u2;
        }, d2);
        function f2(u2) {
          function w2(x2, E2) {
            if (!x2) throw E2 + new Error().stack;
          }
          u2.FS_createPath("/", "home", true, true), u2.FS_createPath("/home", "web_user", true, true), u2.FS_createPath("/", "tmp", true, true), u2.FS_createPath("/tmp", "pglite", true, true), u2.FS_createPath("/tmp/pglite", "bin", true, true), u2.FS_createPath("/tmp/pglite", "lib", true, true), u2.FS_createPath("/tmp/pglite/lib", "postgresql", true, true), u2.FS_createPath("/tmp/pglite/lib/postgresql", "pgxs", true, true), u2.FS_createPath("/tmp/pglite/lib/postgresql/pgxs", "config", true, true), u2.FS_createPath("/tmp/pglite/lib/postgresql/pgxs", "src", true, true), u2.FS_createPath("/tmp/pglite/lib/postgresql/pgxs/src", "makefiles", true, true), u2.FS_createPath("/tmp/pglite/lib/postgresql/pgxs/src", "test", true, true), u2.FS_createPath("/tmp/pglite/lib/postgresql/pgxs/src/test", "isolation", true, true), u2.FS_createPath("/tmp/pglite/lib/postgresql/pgxs/src/test", "regress", true, true), u2.FS_createPath("/tmp/pglite", "share", true, true), u2.FS_createPath("/tmp/pglite/share", "postgresql", true, true), u2.FS_createPath("/tmp/pglite/share/postgresql", "extension", true, true), u2.FS_createPath("/tmp/pglite/share/postgresql", "timezone", true, true), u2.FS_createPath("/tmp/pglite/share/postgresql/timezone", "Africa", true, true), u2.FS_createPath("/tmp/pglite/share/postgresql/timezone", "America", true, true), u2.FS_createPath("/tmp/pglite/share/postgresql/timezone/America", "Argentina", true, true), u2.FS_createPath("/tmp/pglite/share/postgresql/timezone/America", "Indiana", true, true), u2.FS_createPath("/tmp/pglite/share/postgresql/timezone/America", "Kentucky", true, true), u2.FS_createPath("/tmp/pglite/share/postgresql/timezone/America", "North_Dakota", true, true), u2.FS_createPath("/tmp/pglite/share/postgresql/timezone", "Antarctica", true, true), u2.FS_createPath("/tmp/pglite/share/postgresql/timezone", "Arctic", true, true), u2.FS_createPath("/tmp/pglite/share/postgresql/timezone", "Asia", true, true), u2.FS_createPath("/tmp/pglite/share/postgresql/timezone", "Atlantic", true, true), u2.FS_createPath("/tmp/pglite/share/postgresql/timezone", "Australia", true, true), u2.FS_createPath("/tmp/pglite/share/postgresql/timezone", "Brazil", true, true), u2.FS_createPath("/tmp/pglite/share/postgresql/timezone", "Canada", true, true), u2.FS_createPath("/tmp/pglite/share/postgresql/timezone", "Chile", true, true), u2.FS_createPath("/tmp/pglite/share/postgresql/timezone", "Etc", true, true), u2.FS_createPath("/tmp/pglite/share/postgresql/timezone", "Europe", true, true), u2.FS_createPath("/tmp/pglite/share/postgresql/timezone", "Indian", true, true), u2.FS_createPath("/tmp/pglite/share/postgresql/timezone", "Mexico", true, true), u2.FS_createPath("/tmp/pglite/share/postgresql/timezone", "Pacific", true, true), u2.FS_createPath("/tmp/pglite/share/postgresql/timezone", "US", true, true), u2.FS_createPath("/tmp/pglite/share/postgresql", "timezonesets", true, true), u2.FS_createPath("/tmp/pglite/share/postgresql", "tsearch_data", true, true);
          function h2(x2, E2, b2) {
            this.start = x2, this.end = E2, this.audio = b2;
          }
          h2.prototype = { requests: {}, open: function(x2, E2) {
            this.name = E2, this.requests[E2] = this, u2.addRunDependency(`fp ${this.name}`);
          }, send: function() {
          }, onload: function() {
            var x2 = this.byteArray.subarray(this.start, this.end);
            this.finish(x2);
          }, finish: function(x2) {
            var E2 = this;
            u2.FS_createDataFile(this.name, null, x2, true, true, true), u2.removeRunDependency(`fp ${E2.name}`), this.requests[this.name] = null;
          } };
          for (var S2 = o2.files, M2 = 0; M2 < S2.length; ++M2) new h2(S2[M2].start, S2[M2].end, S2[M2].audio || 0).open("GET", S2[M2].filename);
          function y2(x2) {
            w2(x2, "Loading data file failed."), w2(x2.constructor.name === ArrayBuffer.name, "bad input to processPackageData");
            var E2 = new Uint8Array(x2);
            h2.prototype.byteArray = E2;
            for (var b2 = o2.files, T2 = 0; T2 < b2.length; ++T2) h2.prototype.requests[b2[T2].filename].onload();
            u2.removeRunDependency("datafile_postgres.data");
          }
          u2.addRunDependency("datafile_postgres.data"), u2.preloadResults ?? (u2.preloadResults = {}), u2.preloadResults[l2] = { fromCache: false }, c2 ? (y2(c2), c2 = null) : g2 = y2;
        }
        Module.calledRun ? f2(Module) : (Module.preRun ?? (Module.preRun = [])).push(f2);
      }
      a2({ files: [{ filename: "/home/web_user/.pgpass", start: 0, end: 204 }, { filename: "/tmp/pglite/bin/initdb", start: 204, end: 216 }, { filename: "/tmp/pglite/bin/postgres", start: 216, end: 228 }, { filename: "/tmp/pglite/lib/postgresql/cyrillic_and_mic.so", start: 228, end: 20397 }, { filename: "/tmp/pglite/lib/postgresql/dict_snowball.so", start: 20397, end: 1581299 }, { filename: "/tmp/pglite/lib/postgresql/euc2004_sjis2004.so", start: 1581299, end: 1592382 }, { filename: "/tmp/pglite/lib/postgresql/euc_cn_and_mic.so", start: 1592382, end: 1599256 }, { filename: "/tmp/pglite/lib/postgresql/euc_jp_and_sjis.so", start: 1599256, end: 1622931 }, { filename: "/tmp/pglite/lib/postgresql/euc_kr_and_mic.so", start: 1622931, end: 1630057 }, { filename: "/tmp/pglite/lib/postgresql/euc_tw_and_big5.so", start: 1630057, end: 1651566 }, { filename: "/tmp/pglite/lib/postgresql/latin2_and_win1250.so", start: 1651566, end: 1660345 }, { filename: "/tmp/pglite/lib/postgresql/latin_and_mic.so", start: 1660345, end: 1668272 }, { filename: "/tmp/pglite/lib/postgresql/libpqwalreceiver.so", start: 1668272, end: 2186522 }, { filename: "/tmp/pglite/lib/postgresql/pgoutput.so", start: 2186522, end: 2303364 }, { filename: "/tmp/pglite/lib/postgresql/pgxs/config/install-sh", start: 2303364, end: 2317361 }, { filename: "/tmp/pglite/lib/postgresql/pgxs/config/missing", start: 2317361, end: 2318709 }, { filename: "/tmp/pglite/lib/postgresql/pgxs/src/Makefile.global", start: 2318709, end: 2354956 }, { filename: "/tmp/pglite/lib/postgresql/pgxs/src/Makefile.port", start: 2354956, end: 2355232 }, { filename: "/tmp/pglite/lib/postgresql/pgxs/src/Makefile.shlib", start: 2355232, end: 2371270 }, { filename: "/tmp/pglite/lib/postgresql/pgxs/src/makefiles/pgxs.mk", start: 2371270, end: 2386198 }, { filename: "/tmp/pglite/lib/postgresql/pgxs/src/nls-global.mk", start: 2386198, end: 2393083 }, { filename: "/tmp/pglite/lib/postgresql/pgxs/src/test/isolation/isolationtester.cjs", start: 2393083, end: 2589770 }, { filename: "/tmp/pglite/lib/postgresql/pgxs/src/test/isolation/pg_isolation_regress.cjs", start: 2589770, end: 2742128 }, { filename: "/tmp/pglite/lib/postgresql/pgxs/src/test/regress/pg_regress.cjs", start: 2742128, end: 2894476 }, { filename: "/tmp/pglite/lib/postgresql/plpgsql.so", start: 2894476, end: 3653241 }, { filename: "/tmp/pglite/password", start: 3653241, end: 3653250 }, { filename: "/tmp/pglite/share/postgresql/errcodes.txt", start: 3653250, end: 3686708 }, { filename: "/tmp/pglite/share/postgresql/extension/plpgsql--1.0.sql", start: 3686708, end: 3687366 }, { filename: "/tmp/pglite/share/postgresql/extension/plpgsql.control", start: 3687366, end: 3687559 }, { filename: "/tmp/pglite/share/postgresql/fix-CVE-2024-4317.sql", start: 3687559, end: 3693324 }, { filename: "/tmp/pglite/share/postgresql/information_schema.sql", start: 3693324, end: 3808299 }, { filename: "/tmp/pglite/share/postgresql/pg_hba.conf.sample", start: 3808299, end: 3813924 }, { filename: "/tmp/pglite/share/postgresql/pg_ident.conf.sample", start: 3813924, end: 3816564 }, { filename: "/tmp/pglite/share/postgresql/pg_service.conf.sample", start: 3816564, end: 3817168 }, { filename: "/tmp/pglite/share/postgresql/postgres.bki", start: 3817168, end: 4761272 }, { filename: "/tmp/pglite/share/postgresql/postgresql.conf.sample", start: 4761272, end: 4790919 }, { filename: "/tmp/pglite/share/postgresql/psqlrc.sample", start: 4790919, end: 4791197 }, { filename: "/tmp/pglite/share/postgresql/snowball_create.sql", start: 4791197, end: 4835373 }, { filename: "/tmp/pglite/share/postgresql/sql_features.txt", start: 4835373, end: 4871054 }, { filename: "/tmp/pglite/share/postgresql/system_constraints.sql", start: 4871054, end: 4879949 }, { filename: "/tmp/pglite/share/postgresql/system_functions.sql", start: 4879949, end: 4903264 }, { filename: "/tmp/pglite/share/postgresql/system_views.sql", start: 4903264, end: 4953537 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Abidjan", start: 4953537, end: 4953667 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Accra", start: 4953667, end: 4953797 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Addis_Ababa", start: 4953797, end: 4953988 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Algiers", start: 4953988, end: 4954458 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Asmara", start: 4954458, end: 4954649 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Asmera", start: 4954649, end: 4954840 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Bamako", start: 4954840, end: 4954970 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Bangui", start: 4954970, end: 4955150 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Banjul", start: 4955150, end: 4955280 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Bissau", start: 4955280, end: 4955429 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Blantyre", start: 4955429, end: 4955560 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Brazzaville", start: 4955560, end: 4955740 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Bujumbura", start: 4955740, end: 4955871 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Cairo", start: 4955871, end: 4957180 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Casablanca", start: 4957180, end: 4959099 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Ceuta", start: 4959099, end: 4959661 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Conakry", start: 4959661, end: 4959791 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Dakar", start: 4959791, end: 4959921 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Dar_es_Salaam", start: 4959921, end: 4960112 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Djibouti", start: 4960112, end: 4960303 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Douala", start: 4960303, end: 4960483 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/El_Aaiun", start: 4960483, end: 4962313 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Freetown", start: 4962313, end: 4962443 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Gaborone", start: 4962443, end: 4962574 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Harare", start: 4962574, end: 4962705 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Johannesburg", start: 4962705, end: 4962895 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Juba", start: 4962895, end: 4963353 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Kampala", start: 4963353, end: 4963544 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Khartoum", start: 4963544, end: 4964002 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Kigali", start: 4964002, end: 4964133 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Kinshasa", start: 4964133, end: 4964313 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Lagos", start: 4964313, end: 4964493 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Libreville", start: 4964493, end: 4964673 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Lome", start: 4964673, end: 4964803 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Luanda", start: 4964803, end: 4964983 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Lubumbashi", start: 4964983, end: 4965114 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Lusaka", start: 4965114, end: 4965245 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Malabo", start: 4965245, end: 4965425 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Maputo", start: 4965425, end: 4965556 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Maseru", start: 4965556, end: 4965746 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Mbabane", start: 4965746, end: 4965936 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Mogadishu", start: 4965936, end: 4966127 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Monrovia", start: 4966127, end: 4966291 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Nairobi", start: 4966291, end: 4966482 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Ndjamena", start: 4966482, end: 4966642 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Niamey", start: 4966642, end: 4966822 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Nouakchott", start: 4966822, end: 4966952 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Ouagadougou", start: 4966952, end: 4967082 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Porto-Novo", start: 4967082, end: 4967262 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Sao_Tome", start: 4967262, end: 4967435 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Timbuktu", start: 4967435, end: 4967565 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Tripoli", start: 4967565, end: 4967996 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Tunis", start: 4967996, end: 4968445 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Windhoek", start: 4968445, end: 4969083 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Adak", start: 4969083, end: 4970052 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Anchorage", start: 4970052, end: 4971029 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Anguilla", start: 4971029, end: 4971206 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Antigua", start: 4971206, end: 4971383 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Araguaina", start: 4971383, end: 4971975 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Argentina/Buenos_Aires", start: 4971975, end: 4972683 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Argentina/Catamarca", start: 4972683, end: 4973391 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Argentina/ComodRivadavia", start: 4973391, end: 4974099 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Argentina/Cordoba", start: 4974099, end: 4974807 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Argentina/Jujuy", start: 4974807, end: 4975497 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Argentina/La_Rioja", start: 4975497, end: 4976214 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Argentina/Mendoza", start: 4976214, end: 4976922 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Argentina/Rio_Gallegos", start: 4976922, end: 4977630 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Argentina/Salta", start: 4977630, end: 4978320 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Argentina/San_Juan", start: 4978320, end: 4979037 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Argentina/San_Luis", start: 4979037, end: 4979754 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Argentina/Tucuman", start: 4979754, end: 4980480 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Argentina/Ushuaia", start: 4980480, end: 4981188 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Aruba", start: 4981188, end: 4981365 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Asuncion", start: 4981365, end: 4982249 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Atikokan", start: 4982249, end: 4982398 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Atka", start: 4982398, end: 4983367 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Bahia", start: 4983367, end: 4984049 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Bahia_Banderas", start: 4984049, end: 4984777 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Barbados", start: 4984777, end: 4985055 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Belem", start: 4985055, end: 4985449 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Belize", start: 4985449, end: 4986494 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Blanc-Sablon", start: 4986494, end: 4986671 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Boa_Vista", start: 4986671, end: 4987101 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Bogota", start: 4987101, end: 4987280 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Boise", start: 4987280, end: 4988279 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Buenos_Aires", start: 4988279, end: 4988987 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Cambridge_Bay", start: 4988987, end: 4989870 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Campo_Grande", start: 4989870, end: 4990822 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Cancun", start: 4990822, end: 4991351 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Caracas", start: 4991351, end: 4991541 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Catamarca", start: 4991541, end: 4992249 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Cayenne", start: 4992249, end: 4992400 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Cayman", start: 4992400, end: 4992549 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Chicago", start: 4992549, end: 4994303 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Chihuahua", start: 4994303, end: 4994994 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Ciudad_Juarez", start: 4994994, end: 4995712 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Coral_Harbour", start: 4995712, end: 4995861 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Cordoba", start: 4995861, end: 4996569 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Costa_Rica", start: 4996569, end: 4996801 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Creston", start: 4996801, end: 4997041 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Cuiaba", start: 4997041, end: 4997975 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Curacao", start: 4997975, end: 4998152 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Danmarkshavn", start: 4998152, end: 4998599 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Dawson", start: 4998599, end: 4999628 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Dawson_Creek", start: 4999628, end: 5000311 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Denver", start: 5000311, end: 5001353 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Detroit", start: 5001353, end: 5002252 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Dominica", start: 5002252, end: 5002429 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Edmonton", start: 5002429, end: 5003399 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Eirunepe", start: 5003399, end: 5003835 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/El_Salvador", start: 5003835, end: 5004011 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Ensenada", start: 5004011, end: 5005036 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Fort_Nelson", start: 5005036, end: 5006484 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Fort_Wayne", start: 5006484, end: 5007015 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Fortaleza", start: 5007015, end: 5007499 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Glace_Bay", start: 5007499, end: 5008379 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Godthab", start: 5008379, end: 5009344 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Goose_Bay", start: 5009344, end: 5010924 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Grand_Turk", start: 5010924, end: 5011777 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Grenada", start: 5011777, end: 5011954 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Guadeloupe", start: 5011954, end: 5012131 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Guatemala", start: 5012131, end: 5012343 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Guayaquil", start: 5012343, end: 5012522 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Guyana", start: 5012522, end: 5012703 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Halifax", start: 5012703, end: 5014375 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Havana", start: 5014375, end: 5015492 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Hermosillo", start: 5015492, end: 5015778 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Indiana/Indianapolis", start: 5015778, end: 5016309 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Indiana/Knox", start: 5016309, end: 5017325 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Indiana/Marengo", start: 5017325, end: 5017892 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Indiana/Petersburg", start: 5017892, end: 5018575 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Indiana/Tell_City", start: 5018575, end: 5019097 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Indiana/Vevay", start: 5019097, end: 5019466 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Indiana/Vincennes", start: 5019466, end: 5020024 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Indiana/Winamac", start: 5020024, end: 5020636 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Indianapolis", start: 5020636, end: 5021167 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Inuvik", start: 5021167, end: 5021984 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Iqaluit", start: 5021984, end: 5022839 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Jamaica", start: 5022839, end: 5023178 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Jujuy", start: 5023178, end: 5023868 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Juneau", start: 5023868, end: 5024834 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Kentucky/Louisville", start: 5024834, end: 5026076 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Kentucky/Monticello", start: 5026076, end: 5027048 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Knox_IN", start: 5027048, end: 5028064 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Kralendijk", start: 5028064, end: 5028241 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/La_Paz", start: 5028241, end: 5028411 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Lima", start: 5028411, end: 5028694 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Los_Angeles", start: 5028694, end: 5029988 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Louisville", start: 5029988, end: 5031230 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Lower_Princes", start: 5031230, end: 5031407 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Maceio", start: 5031407, end: 5031909 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Managua", start: 5031909, end: 5032204 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Manaus", start: 5032204, end: 5032616 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Marigot", start: 5032616, end: 5032793 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Martinique", start: 5032793, end: 5032971 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Matamoros", start: 5032971, end: 5033408 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Mazatlan", start: 5033408, end: 5034126 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Mendoza", start: 5034126, end: 5034834 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Menominee", start: 5034834, end: 5035751 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Merida", start: 5035751, end: 5036405 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Metlakatla", start: 5036405, end: 5037e3 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Mexico_City", start: 5037e3, end: 5037773 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Miquelon", start: 5037773, end: 5038323 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Moncton", start: 5038323, end: 5039816 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Monterrey", start: 5039816, end: 5040460 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Montevideo", start: 5040460, end: 5041429 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Montreal", start: 5041429, end: 5043146 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Montserrat", start: 5043146, end: 5043323 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Nassau", start: 5043323, end: 5045040 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/New_York", start: 5045040, end: 5046784 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Nipigon", start: 5046784, end: 5048501 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Nome", start: 5048501, end: 5049476 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Noronha", start: 5049476, end: 5049960 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/North_Dakota/Beulah", start: 5049960, end: 5051003 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/North_Dakota/Center", start: 5051003, end: 5051993 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/North_Dakota/New_Salem", start: 5051993, end: 5052983 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Nuuk", start: 5052983, end: 5053948 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Ojinaga", start: 5053948, end: 5054657 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Panama", start: 5054657, end: 5054806 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Pangnirtung", start: 5054806, end: 5055661 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Paramaribo", start: 5055661, end: 5055848 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Phoenix", start: 5055848, end: 5056088 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Port-au-Prince", start: 5056088, end: 5056653 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Port_of_Spain", start: 5056653, end: 5056830 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Porto_Acre", start: 5056830, end: 5057248 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Porto_Velho", start: 5057248, end: 5057642 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Puerto_Rico", start: 5057642, end: 5057819 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Punta_Arenas", start: 5057819, end: 5059037 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Rainy_River", start: 5059037, end: 5060331 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Rankin_Inlet", start: 5060331, end: 5061138 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Recife", start: 5061138, end: 5061622 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Regina", start: 5061622, end: 5062260 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Resolute", start: 5062260, end: 5063067 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Rio_Branco", start: 5063067, end: 5063485 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Rosario", start: 5063485, end: 5064193 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Santa_Isabel", start: 5064193, end: 5065218 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Santarem", start: 5065218, end: 5065627 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Santiago", start: 5065627, end: 5066981 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Santo_Domingo", start: 5066981, end: 5067298 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Sao_Paulo", start: 5067298, end: 5068250 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Scoresbysund", start: 5068250, end: 5069234 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Shiprock", start: 5069234, end: 5070276 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Sitka", start: 5070276, end: 5071232 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/St_Barthelemy", start: 5071232, end: 5071409 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/St_Johns", start: 5071409, end: 5073287 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/St_Kitts", start: 5073287, end: 5073464 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/St_Lucia", start: 5073464, end: 5073641 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/St_Thomas", start: 5073641, end: 5073818 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/St_Vincent", start: 5073818, end: 5073995 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Swift_Current", start: 5073995, end: 5074363 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Tegucigalpa", start: 5074363, end: 5074557 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Thule", start: 5074557, end: 5075012 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Thunder_Bay", start: 5075012, end: 5076729 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Tijuana", start: 5076729, end: 5077754 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Toronto", start: 5077754, end: 5079471 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Tortola", start: 5079471, end: 5079648 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Vancouver", start: 5079648, end: 5080978 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Virgin", start: 5080978, end: 5081155 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Whitehorse", start: 5081155, end: 5082184 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Winnipeg", start: 5082184, end: 5083478 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Yakutat", start: 5083478, end: 5084424 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Yellowknife", start: 5084424, end: 5085394 }, { filename: "/tmp/pglite/share/postgresql/timezone/Antarctica/Casey", start: 5085394, end: 5085681 }, { filename: "/tmp/pglite/share/postgresql/timezone/Antarctica/Davis", start: 5085681, end: 5085878 }, { filename: "/tmp/pglite/share/postgresql/timezone/Antarctica/DumontDUrville", start: 5085878, end: 5086032 }, { filename: "/tmp/pglite/share/postgresql/timezone/Antarctica/Macquarie", start: 5086032, end: 5087008 }, { filename: "/tmp/pglite/share/postgresql/timezone/Antarctica/Mawson", start: 5087008, end: 5087160 }, { filename: "/tmp/pglite/share/postgresql/timezone/Antarctica/McMurdo", start: 5087160, end: 5088203 }, { filename: "/tmp/pglite/share/postgresql/timezone/Antarctica/Palmer", start: 5088203, end: 5089090 }, { filename: "/tmp/pglite/share/postgresql/timezone/Antarctica/Rothera", start: 5089090, end: 5089222 }, { filename: "/tmp/pglite/share/postgresql/timezone/Antarctica/South_Pole", start: 5089222, end: 5090265 }, { filename: "/tmp/pglite/share/postgresql/timezone/Antarctica/Syowa", start: 5090265, end: 5090398 }, { filename: "/tmp/pglite/share/postgresql/timezone/Antarctica/Troll", start: 5090398, end: 5090575 }, { filename: "/tmp/pglite/share/postgresql/timezone/Antarctica/Vostok", start: 5090575, end: 5090745 }, { filename: "/tmp/pglite/share/postgresql/timezone/Arctic/Longyearbyen", start: 5090745, end: 5091450 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Aden", start: 5091450, end: 5091583 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Almaty", start: 5091583, end: 5092201 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Amman", start: 5092201, end: 5093129 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Anadyr", start: 5093129, end: 5093872 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Aqtau", start: 5093872, end: 5094478 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Aqtobe", start: 5094478, end: 5095093 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Ashgabat", start: 5095093, end: 5095468 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Ashkhabad", start: 5095468, end: 5095843 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Atyrau", start: 5095843, end: 5096459 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Baghdad", start: 5096459, end: 5097089 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Bahrain", start: 5097089, end: 5097241 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Baku", start: 5097241, end: 5097985 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Bangkok", start: 5097985, end: 5098137 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Barnaul", start: 5098137, end: 5098890 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Beirut", start: 5098890, end: 5099622 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Bishkek", start: 5099622, end: 5100240 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Brunei", start: 5100240, end: 5100560 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Calcutta", start: 5100560, end: 5100780 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Chita", start: 5100780, end: 5101530 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Choibalsan", start: 5101530, end: 5102149 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Chongqing", start: 5102149, end: 5102542 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Chungking", start: 5102542, end: 5102935 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Colombo", start: 5102935, end: 5103182 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Dacca", start: 5103182, end: 5103413 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Damascus", start: 5103413, end: 5104647 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Dhaka", start: 5104647, end: 5104878 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Dili", start: 5104878, end: 5105048 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Dubai", start: 5105048, end: 5105181 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Dushanbe", start: 5105181, end: 5105547 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Famagusta", start: 5105547, end: 5106487 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Gaza", start: 5106487, end: 5108933 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Harbin", start: 5108933, end: 5109326 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Hebron", start: 5109326, end: 5111790 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Ho_Chi_Minh", start: 5111790, end: 5112026 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Hong_Kong", start: 5112026, end: 5112801 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Hovd", start: 5112801, end: 5113395 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Irkutsk", start: 5113395, end: 5114155 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Istanbul", start: 5114155, end: 5115355 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Jakarta", start: 5115355, end: 5115603 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Jayapura", start: 5115603, end: 5115774 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Jerusalem", start: 5115774, end: 5116848 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Kabul", start: 5116848, end: 5117007 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Kamchatka", start: 5117007, end: 5117734 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Karachi", start: 5117734, end: 5118e3 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Kashgar", start: 5118e3, end: 5118133 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Kathmandu", start: 5118133, end: 5118294 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Katmandu", start: 5118294, end: 5118455 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Khandyga", start: 5118455, end: 5119230 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Kolkata", start: 5119230, end: 5119450 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Krasnoyarsk", start: 5119450, end: 5120191 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Kuala_Lumpur", start: 5120191, end: 5120447 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Kuching", start: 5120447, end: 5120767 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Kuwait", start: 5120767, end: 5120900 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Macao", start: 5120900, end: 5121691 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Macau", start: 5121691, end: 5122482 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Magadan", start: 5122482, end: 5123233 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Makassar", start: 5123233, end: 5123423 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Manila", start: 5123423, end: 5123661 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Muscat", start: 5123661, end: 5123794 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Nicosia", start: 5123794, end: 5124391 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Novokuznetsk", start: 5124391, end: 5125117 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Novosibirsk", start: 5125117, end: 5125870 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Omsk", start: 5125870, end: 5126611 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Oral", start: 5126611, end: 5127236 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Phnom_Penh", start: 5127236, end: 5127388 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Pontianak", start: 5127388, end: 5127635 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Pyongyang", start: 5127635, end: 5127818 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Qatar", start: 5127818, end: 5127970 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Qostanay", start: 5127970, end: 5128594 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Qyzylorda", start: 5128594, end: 5129218 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Rangoon", start: 5129218, end: 5129405 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Riyadh", start: 5129405, end: 5129538 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Saigon", start: 5129538, end: 5129774 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Sakhalin", start: 5129774, end: 5130529 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Samarkand", start: 5130529, end: 5130895 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Seoul", start: 5130895, end: 5131310 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Shanghai", start: 5131310, end: 5131703 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Singapore", start: 5131703, end: 5131959 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Srednekolymsk", start: 5131959, end: 5132701 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Taipei", start: 5132701, end: 5133212 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Tashkent", start: 5133212, end: 5133578 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Tbilisi", start: 5133578, end: 5134207 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Tehran", start: 5134207, end: 5135019 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Tel_Aviv", start: 5135019, end: 5136093 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Thimbu", start: 5136093, end: 5136247 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Thimphu", start: 5136247, end: 5136401 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Tokyo", start: 5136401, end: 5136614 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Tomsk", start: 5136614, end: 5137367 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Ujung_Pandang", start: 5137367, end: 5137557 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Ulaanbaatar", start: 5137557, end: 5138151 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Ulan_Bator", start: 5138151, end: 5138745 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Urumqi", start: 5138745, end: 5138878 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Ust-Nera", start: 5138878, end: 5139649 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Vientiane", start: 5139649, end: 5139801 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Vladivostok", start: 5139801, end: 5140543 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Yakutsk", start: 5140543, end: 5141284 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Yangon", start: 5141284, end: 5141471 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Yekaterinburg", start: 5141471, end: 5142231 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Yerevan", start: 5142231, end: 5142939 }, { filename: "/tmp/pglite/share/postgresql/timezone/Atlantic/Azores", start: 5142939, end: 5144392 }, { filename: "/tmp/pglite/share/postgresql/timezone/Atlantic/Bermuda", start: 5144392, end: 5145416 }, { filename: "/tmp/pglite/share/postgresql/timezone/Atlantic/Canary", start: 5145416, end: 5145894 }, { filename: "/tmp/pglite/share/postgresql/timezone/Atlantic/Cape_Verde", start: 5145894, end: 5146069 }, { filename: "/tmp/pglite/share/postgresql/timezone/Atlantic/Faeroe", start: 5146069, end: 5146510 }, { filename: "/tmp/pglite/share/postgresql/timezone/Atlantic/Faroe", start: 5146510, end: 5146951 }, { filename: "/tmp/pglite/share/postgresql/timezone/Atlantic/Jan_Mayen", start: 5146951, end: 5147656 }, { filename: "/tmp/pglite/share/postgresql/timezone/Atlantic/Madeira", start: 5147656, end: 5149109 }, { filename: "/tmp/pglite/share/postgresql/timezone/Atlantic/Reykjavik", start: 5149109, end: 5149239 }, { filename: "/tmp/pglite/share/postgresql/timezone/Atlantic/South_Georgia", start: 5149239, end: 5149371 }, { filename: "/tmp/pglite/share/postgresql/timezone/Atlantic/St_Helena", start: 5149371, end: 5149501 }, { filename: "/tmp/pglite/share/postgresql/timezone/Atlantic/Stanley", start: 5149501, end: 5150290 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/ACT", start: 5150290, end: 5151194 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/Adelaide", start: 5151194, end: 5152115 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/Brisbane", start: 5152115, end: 5152404 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/Broken_Hill", start: 5152404, end: 5153345 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/Canberra", start: 5153345, end: 5154249 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/Currie", start: 5154249, end: 5155252 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/Darwin", start: 5155252, end: 5155486 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/Eucla", start: 5155486, end: 5155800 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/Hobart", start: 5155800, end: 5156803 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/LHI", start: 5156803, end: 5157495 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/Lindeman", start: 5157495, end: 5157820 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/Lord_Howe", start: 5157820, end: 5158512 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/Melbourne", start: 5158512, end: 5159416 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/NSW", start: 5159416, end: 5160320 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/North", start: 5160320, end: 5160554 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/Perth", start: 5160554, end: 5160860 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/Queensland", start: 5160860, end: 5161149 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/South", start: 5161149, end: 5162070 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/Sydney", start: 5162070, end: 5162974 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/Tasmania", start: 5162974, end: 5163977 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/Victoria", start: 5163977, end: 5164881 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/West", start: 5164881, end: 5165187 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/Yancowinna", start: 5165187, end: 5166128 }, { filename: "/tmp/pglite/share/postgresql/timezone/Brazil/Acre", start: 5166128, end: 5166546 }, { filename: "/tmp/pglite/share/postgresql/timezone/Brazil/DeNoronha", start: 5166546, end: 5167030 }, { filename: "/tmp/pglite/share/postgresql/timezone/Brazil/East", start: 5167030, end: 5167982 }, { filename: "/tmp/pglite/share/postgresql/timezone/Brazil/West", start: 5167982, end: 5168394 }, { filename: "/tmp/pglite/share/postgresql/timezone/CET", start: 5168394, end: 5169015 }, { filename: "/tmp/pglite/share/postgresql/timezone/CST6CDT", start: 5169015, end: 5169966 }, { filename: "/tmp/pglite/share/postgresql/timezone/Canada/Atlantic", start: 5169966, end: 5171638 }, { filename: "/tmp/pglite/share/postgresql/timezone/Canada/Central", start: 5171638, end: 5172932 }, { filename: "/tmp/pglite/share/postgresql/timezone/Canada/Eastern", start: 5172932, end: 5174649 }, { filename: "/tmp/pglite/share/postgresql/timezone/Canada/Mountain", start: 5174649, end: 5175619 }, { filename: "/tmp/pglite/share/postgresql/timezone/Canada/Newfoundland", start: 5175619, end: 5177497 }, { filename: "/tmp/pglite/share/postgresql/timezone/Canada/Pacific", start: 5177497, end: 5178827 }, { filename: "/tmp/pglite/share/postgresql/timezone/Canada/Saskatchewan", start: 5178827, end: 5179465 }, { filename: "/tmp/pglite/share/postgresql/timezone/Canada/Yukon", start: 5179465, end: 5180494 }, { filename: "/tmp/pglite/share/postgresql/timezone/Chile/Continental", start: 5180494, end: 5181848 }, { filename: "/tmp/pglite/share/postgresql/timezone/Chile/EasterIsland", start: 5181848, end: 5183022 }, { filename: "/tmp/pglite/share/postgresql/timezone/Cuba", start: 5183022, end: 5184139 }, { filename: "/tmp/pglite/share/postgresql/timezone/EET", start: 5184139, end: 5184636 }, { filename: "/tmp/pglite/share/postgresql/timezone/EST", start: 5184636, end: 5184747 }, { filename: "/tmp/pglite/share/postgresql/timezone/EST5EDT", start: 5184747, end: 5185698 }, { filename: "/tmp/pglite/share/postgresql/timezone/Egypt", start: 5185698, end: 5187007 }, { filename: "/tmp/pglite/share/postgresql/timezone/Eire", start: 5187007, end: 5188503 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT", start: 5188503, end: 5188614 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT+0", start: 5188614, end: 5188725 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT+1", start: 5188725, end: 5188838 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT+10", start: 5188838, end: 5188952 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT+11", start: 5188952, end: 5189066 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT+12", start: 5189066, end: 5189180 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT+2", start: 5189180, end: 5189293 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT+3", start: 5189293, end: 5189406 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT+4", start: 5189406, end: 5189519 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT+5", start: 5189519, end: 5189632 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT+6", start: 5189632, end: 5189745 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT+7", start: 5189745, end: 5189858 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT+8", start: 5189858, end: 5189971 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT+9", start: 5189971, end: 5190084 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT-0", start: 5190084, end: 5190195 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT-1", start: 5190195, end: 5190309 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT-10", start: 5190309, end: 5190424 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT-11", start: 5190424, end: 5190539 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT-12", start: 5190539, end: 5190654 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT-13", start: 5190654, end: 5190769 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT-14", start: 5190769, end: 5190884 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT-2", start: 5190884, end: 5190998 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT-3", start: 5190998, end: 5191112 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT-4", start: 5191112, end: 5191226 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT-5", start: 5191226, end: 5191340 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT-6", start: 5191340, end: 5191454 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT-7", start: 5191454, end: 5191568 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT-8", start: 5191568, end: 5191682 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT-9", start: 5191682, end: 5191796 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT0", start: 5191796, end: 5191907 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/Greenwich", start: 5191907, end: 5192018 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/UCT", start: 5192018, end: 5192129 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/UTC", start: 5192129, end: 5192240 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/Universal", start: 5192240, end: 5192351 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/Zulu", start: 5192351, end: 5192462 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Amsterdam", start: 5192462, end: 5193565 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Andorra", start: 5193565, end: 5193954 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Astrakhan", start: 5193954, end: 5194680 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Athens", start: 5194680, end: 5195362 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Belfast", start: 5195362, end: 5196961 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Belgrade", start: 5196961, end: 5197439 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Berlin", start: 5197439, end: 5198144 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Bratislava", start: 5198144, end: 5198867 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Brussels", start: 5198867, end: 5199970 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Bucharest", start: 5199970, end: 5200631 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Budapest", start: 5200631, end: 5201397 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Busingen", start: 5201397, end: 5201894 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Chisinau", start: 5201894, end: 5202649 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Copenhagen", start: 5202649, end: 5203354 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Dublin", start: 5203354, end: 5204850 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Gibraltar", start: 5204850, end: 5206070 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Guernsey", start: 5206070, end: 5207669 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Helsinki", start: 5207669, end: 5208150 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Isle_of_Man", start: 5208150, end: 5209749 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Istanbul", start: 5209749, end: 5210949 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Jersey", start: 5210949, end: 5212548 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Kaliningrad", start: 5212548, end: 5213452 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Kiev", start: 5213452, end: 5214010 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Kirov", start: 5214010, end: 5214745 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Kyiv", start: 5214745, end: 5215303 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Lisbon", start: 5215303, end: 5216757 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Ljubljana", start: 5216757, end: 5217235 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/London", start: 5217235, end: 5218834 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Luxembourg", start: 5218834, end: 5219937 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Madrid", start: 5219937, end: 5220834 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Malta", start: 5220834, end: 5221762 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Mariehamn", start: 5221762, end: 5222243 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Minsk", start: 5222243, end: 5223051 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Monaco", start: 5223051, end: 5224156 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Moscow", start: 5224156, end: 5225064 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Nicosia", start: 5225064, end: 5225661 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Oslo", start: 5225661, end: 5226366 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Paris", start: 5226366, end: 5227471 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Podgorica", start: 5227471, end: 5227949 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Prague", start: 5227949, end: 5228672 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Riga", start: 5228672, end: 5229366 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Rome", start: 5229366, end: 5230313 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Samara", start: 5230313, end: 5231045 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/San_Marino", start: 5231045, end: 5231992 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Sarajevo", start: 5231992, end: 5232470 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Saratov", start: 5232470, end: 5233196 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Simferopol", start: 5233196, end: 5234061 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Skopje", start: 5234061, end: 5234539 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Sofia", start: 5234539, end: 5235131 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Stockholm", start: 5235131, end: 5235836 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Tallinn", start: 5235836, end: 5236511 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Tirane", start: 5236511, end: 5237115 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Tiraspol", start: 5237115, end: 5237870 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Ulyanovsk", start: 5237870, end: 5238630 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Uzhgorod", start: 5238630, end: 5239188 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Vaduz", start: 5239188, end: 5239685 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Vatican", start: 5239685, end: 5240632 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Vienna", start: 5240632, end: 5241290 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Vilnius", start: 5241290, end: 5241966 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Volgograd", start: 5241966, end: 5242719 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Warsaw", start: 5242719, end: 5243642 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Zagreb", start: 5243642, end: 5244120 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Zaporozhye", start: 5244120, end: 5244678 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Zurich", start: 5244678, end: 5245175 }, { filename: "/tmp/pglite/share/postgresql/timezone/Factory", start: 5245175, end: 5245288 }, { filename: "/tmp/pglite/share/postgresql/timezone/GB", start: 5245288, end: 5246887 }, { filename: "/tmp/pglite/share/postgresql/timezone/GB-Eire", start: 5246887, end: 5248486 }, { filename: "/tmp/pglite/share/postgresql/timezone/GMT", start: 5248486, end: 5248597 }, { filename: "/tmp/pglite/share/postgresql/timezone/GMT+0", start: 5248597, end: 5248708 }, { filename: "/tmp/pglite/share/postgresql/timezone/GMT-0", start: 5248708, end: 5248819 }, { filename: "/tmp/pglite/share/postgresql/timezone/GMT0", start: 5248819, end: 5248930 }, { filename: "/tmp/pglite/share/postgresql/timezone/Greenwich", start: 5248930, end: 5249041 }, { filename: "/tmp/pglite/share/postgresql/timezone/HST", start: 5249041, end: 5249153 }, { filename: "/tmp/pglite/share/postgresql/timezone/Hongkong", start: 5249153, end: 5249928 }, { filename: "/tmp/pglite/share/postgresql/timezone/Iceland", start: 5249928, end: 5250058 }, { filename: "/tmp/pglite/share/postgresql/timezone/Indian/Antananarivo", start: 5250058, end: 5250249 }, { filename: "/tmp/pglite/share/postgresql/timezone/Indian/Chagos", start: 5250249, end: 5250401 }, { filename: "/tmp/pglite/share/postgresql/timezone/Indian/Christmas", start: 5250401, end: 5250553 }, { filename: "/tmp/pglite/share/postgresql/timezone/Indian/Cocos", start: 5250553, end: 5250740 }, { filename: "/tmp/pglite/share/postgresql/timezone/Indian/Comoro", start: 5250740, end: 5250931 }, { filename: "/tmp/pglite/share/postgresql/timezone/Indian/Kerguelen", start: 5250931, end: 5251083 }, { filename: "/tmp/pglite/share/postgresql/timezone/Indian/Mahe", start: 5251083, end: 5251216 }, { filename: "/tmp/pglite/share/postgresql/timezone/Indian/Maldives", start: 5251216, end: 5251368 }, { filename: "/tmp/pglite/share/postgresql/timezone/Indian/Mauritius", start: 5251368, end: 5251547 }, { filename: "/tmp/pglite/share/postgresql/timezone/Indian/Mayotte", start: 5251547, end: 5251738 }, { filename: "/tmp/pglite/share/postgresql/timezone/Indian/Reunion", start: 5251738, end: 5251871 }, { filename: "/tmp/pglite/share/postgresql/timezone/Iran", start: 5251871, end: 5252683 }, { filename: "/tmp/pglite/share/postgresql/timezone/Israel", start: 5252683, end: 5253757 }, { filename: "/tmp/pglite/share/postgresql/timezone/Jamaica", start: 5253757, end: 5254096 }, { filename: "/tmp/pglite/share/postgresql/timezone/Japan", start: 5254096, end: 5254309 }, { filename: "/tmp/pglite/share/postgresql/timezone/Kwajalein", start: 5254309, end: 5254528 }, { filename: "/tmp/pglite/share/postgresql/timezone/Libya", start: 5254528, end: 5254959 }, { filename: "/tmp/pglite/share/postgresql/timezone/MET", start: 5254959, end: 5255580 }, { filename: "/tmp/pglite/share/postgresql/timezone/MST", start: 5255580, end: 5255691 }, { filename: "/tmp/pglite/share/postgresql/timezone/MST7MDT", start: 5255691, end: 5256642 }, { filename: "/tmp/pglite/share/postgresql/timezone/Mexico/BajaNorte", start: 5256642, end: 5257667 }, { filename: "/tmp/pglite/share/postgresql/timezone/Mexico/BajaSur", start: 5257667, end: 5258385 }, { filename: "/tmp/pglite/share/postgresql/timezone/Mexico/General", start: 5258385, end: 5259158 }, { filename: "/tmp/pglite/share/postgresql/timezone/NZ", start: 5259158, end: 5260201 }, { filename: "/tmp/pglite/share/postgresql/timezone/NZ-CHAT", start: 5260201, end: 5261009 }, { filename: "/tmp/pglite/share/postgresql/timezone/Navajo", start: 5261009, end: 5262051 }, { filename: "/tmp/pglite/share/postgresql/timezone/PRC", start: 5262051, end: 5262444 }, { filename: "/tmp/pglite/share/postgresql/timezone/PST8PDT", start: 5262444, end: 5263395 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Apia", start: 5263395, end: 5263802 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Auckland", start: 5263802, end: 5264845 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Bougainville", start: 5264845, end: 5265046 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Chatham", start: 5265046, end: 5265854 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Chuuk", start: 5265854, end: 5266008 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Easter", start: 5266008, end: 5267182 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Efate", start: 5267182, end: 5267524 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Enderbury", start: 5267524, end: 5267696 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Fakaofo", start: 5267696, end: 5267849 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Fiji", start: 5267849, end: 5268245 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Funafuti", start: 5268245, end: 5268379 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Galapagos", start: 5268379, end: 5268554 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Gambier", start: 5268554, end: 5268686 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Guadalcanal", start: 5268686, end: 5268820 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Guam", start: 5268820, end: 5269170 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Honolulu", start: 5269170, end: 5269391 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Johnston", start: 5269391, end: 5269612 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Kanton", start: 5269612, end: 5269784 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Kiritimati", start: 5269784, end: 5269958 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Kosrae", start: 5269958, end: 5270200 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Kwajalein", start: 5270200, end: 5270419 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Majuro", start: 5270419, end: 5270553 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Marquesas", start: 5270553, end: 5270692 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Midway", start: 5270692, end: 5270838 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Nauru", start: 5270838, end: 5271021 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Niue", start: 5271021, end: 5271175 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Norfolk", start: 5271175, end: 5271422 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Noumea", start: 5271422, end: 5271620 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Pago_Pago", start: 5271620, end: 5271766 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Palau", start: 5271766, end: 5271914 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Pitcairn", start: 5271914, end: 5272067 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Pohnpei", start: 5272067, end: 5272201 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Ponape", start: 5272201, end: 5272335 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Port_Moresby", start: 5272335, end: 5272489 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Rarotonga", start: 5272489, end: 5272895 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Saipan", start: 5272895, end: 5273245 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Samoa", start: 5273245, end: 5273391 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Tahiti", start: 5273391, end: 5273524 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Tarawa", start: 5273524, end: 5273658 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Tongatapu", start: 5273658, end: 5273895 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Truk", start: 5273895, end: 5274049 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Wake", start: 5274049, end: 5274183 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Wallis", start: 5274183, end: 5274317 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Yap", start: 5274317, end: 5274471 }, { filename: "/tmp/pglite/share/postgresql/timezone/Poland", start: 5274471, end: 5275394 }, { filename: "/tmp/pglite/share/postgresql/timezone/Portugal", start: 5275394, end: 5276848 }, { filename: "/tmp/pglite/share/postgresql/timezone/ROC", start: 5276848, end: 5277359 }, { filename: "/tmp/pglite/share/postgresql/timezone/ROK", start: 5277359, end: 5277774 }, { filename: "/tmp/pglite/share/postgresql/timezone/Singapore", start: 5277774, end: 5278030 }, { filename: "/tmp/pglite/share/postgresql/timezone/Turkey", start: 5278030, end: 5279230 }, { filename: "/tmp/pglite/share/postgresql/timezone/UCT", start: 5279230, end: 5279341 }, { filename: "/tmp/pglite/share/postgresql/timezone/US/Alaska", start: 5279341, end: 5280318 }, { filename: "/tmp/pglite/share/postgresql/timezone/US/Aleutian", start: 5280318, end: 5281287 }, { filename: "/tmp/pglite/share/postgresql/timezone/US/Arizona", start: 5281287, end: 5281527 }, { filename: "/tmp/pglite/share/postgresql/timezone/US/Central", start: 5281527, end: 5283281 }, { filename: "/tmp/pglite/share/postgresql/timezone/US/East-Indiana", start: 5283281, end: 5283812 }, { filename: "/tmp/pglite/share/postgresql/timezone/US/Eastern", start: 5283812, end: 5285556 }, { filename: "/tmp/pglite/share/postgresql/timezone/US/Hawaii", start: 5285556, end: 5285777 }, { filename: "/tmp/pglite/share/postgresql/timezone/US/Indiana-Starke", start: 5285777, end: 5286793 }, { filename: "/tmp/pglite/share/postgresql/timezone/US/Michigan", start: 5286793, end: 5287692 }, { filename: "/tmp/pglite/share/postgresql/timezone/US/Mountain", start: 5287692, end: 5288734 }, { filename: "/tmp/pglite/share/postgresql/timezone/US/Pacific", start: 5288734, end: 5290028 }, { filename: "/tmp/pglite/share/postgresql/timezone/US/Samoa", start: 5290028, end: 5290174 }, { filename: "/tmp/pglite/share/postgresql/timezone/UTC", start: 5290174, end: 5290285 }, { filename: "/tmp/pglite/share/postgresql/timezone/Universal", start: 5290285, end: 5290396 }, { filename: "/tmp/pglite/share/postgresql/timezone/W-SU", start: 5290396, end: 5291304 }, { filename: "/tmp/pglite/share/postgresql/timezone/WET", start: 5291304, end: 5291798 }, { filename: "/tmp/pglite/share/postgresql/timezone/Zulu", start: 5291798, end: 5291909 }, { filename: "/tmp/pglite/share/postgresql/timezonesets/Africa.txt", start: 5291909, end: 5298882 }, { filename: "/tmp/pglite/share/postgresql/timezonesets/America.txt", start: 5298882, end: 5309889 }, { filename: "/tmp/pglite/share/postgresql/timezonesets/Antarctica.txt", start: 5309889, end: 5311023 }, { filename: "/tmp/pglite/share/postgresql/timezonesets/Asia.txt", start: 5311023, end: 5319334 }, { filename: "/tmp/pglite/share/postgresql/timezonesets/Atlantic.txt", start: 5319334, end: 5322867 }, { filename: "/tmp/pglite/share/postgresql/timezonesets/Australia", start: 5322867, end: 5324002 }, { filename: "/tmp/pglite/share/postgresql/timezonesets/Australia.txt", start: 5324002, end: 5327386 }, { filename: "/tmp/pglite/share/postgresql/timezonesets/Default", start: 5327386, end: 5354636 }, { filename: "/tmp/pglite/share/postgresql/timezonesets/Etc.txt", start: 5354636, end: 5355886 }, { filename: "/tmp/pglite/share/postgresql/timezonesets/Europe.txt", start: 5355886, end: 5364668 }, { filename: "/tmp/pglite/share/postgresql/timezonesets/India", start: 5364668, end: 5365261 }, { filename: "/tmp/pglite/share/postgresql/timezonesets/Indian.txt", start: 5365261, end: 5366522 }, { filename: "/tmp/pglite/share/postgresql/timezonesets/Pacific.txt", start: 5366522, end: 5370290 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/danish.stop", start: 5370290, end: 5370714 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/dutch.stop", start: 5370714, end: 5371167 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/english.stop", start: 5371167, end: 5371789 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/finnish.stop", start: 5371789, end: 5373368 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/french.stop", start: 5373368, end: 5374173 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/german.stop", start: 5374173, end: 5375522 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/hungarian.stop", start: 5375522, end: 5376749 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/hunspell_sample.affix", start: 5376749, end: 5376992 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/hunspell_sample_long.affix", start: 5376992, end: 5377625 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/hunspell_sample_long.dict", start: 5377625, end: 5377723 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/hunspell_sample_num.affix", start: 5377723, end: 5378185 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/hunspell_sample_num.dict", start: 5378185, end: 5378314 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/ispell_sample.affix", start: 5378314, end: 5378779 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/ispell_sample.dict", start: 5378779, end: 5378860 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/italian.stop", start: 5378860, end: 5380514 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/nepali.stop", start: 5380514, end: 5384775 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/norwegian.stop", start: 5384775, end: 5385626 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/portuguese.stop", start: 5385626, end: 5386893 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/russian.stop", start: 5386893, end: 5388128 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/spanish.stop", start: 5388128, end: 5390306 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/swedish.stop", start: 5390306, end: 5390865 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/synonym_sample.syn", start: 5390865, end: 5390938 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/thesaurus_sample.ths", start: 5390938, end: 5391411 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/turkish.stop", start: 5391411, end: 5391671 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/unaccent.rules", start: 5391671, end: 5401610 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/xsyn_sample.rules", start: 5401610, end: 5401749 }], remote_package_size: 5401749 });
    })();
    var moduleOverrides = Object.assign({}, Module), arguments_ = [], thisProgram = "./this.program", quit_ = (e, t) => {
      throw t;
    }, scriptDirectory = "";
    function locateFile(e) {
      return Module.locateFile ? Module.locateFile(e, scriptDirectory) : scriptDirectory + e;
    }
    var readAsync, readBinary;
    if (ENVIRONMENT_IS_NODE) {
      var fs = require("fs"), nodePath = require("path");
      import.meta.url.startsWith("data:") || (scriptDirectory = nodePath.dirname(require("url").fileURLToPath(import.meta.url)) + "/"), readBinary = (e) => {
        e = isFileURI(e) ? new URL(e) : e;
        var t = fs.readFileSync(e);
        return t;
      }, readAsync = async (e, t = true) => {
        e = isFileURI(e) ? new URL(e) : e;
        var r2 = fs.readFileSync(e, t ? void 0 : "utf8");
        return r2;
      }, !Module.thisProgram && process.argv.length > 1 && (thisProgram = process.argv[1].replace(/\\/g, "/")), arguments_ = process.argv.slice(2), quit_ = (e, t) => {
        throw process.exitCode = e, t;
      };
    } else (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && (ENVIRONMENT_IS_WORKER ? scriptDirectory = self.location.href : typeof document < "u" && document.currentScript && (scriptDirectory = document.currentScript.src), _scriptName && (scriptDirectory = _scriptName), scriptDirectory.startsWith("blob:") ? scriptDirectory = "" : scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1), readAsync = async (e) => {
      var t = await fetch(e, { credentials: "same-origin" });
      if (t.ok) return t.arrayBuffer();
      throw new Error(t.status + " : " + t.url);
    });
    var out = Module.print || console.log.bind(console), err = Module.printErr || console.error.bind(console);
    Object.assign(Module, moduleOverrides), moduleOverrides = null, Module.arguments && (arguments_ = Module.arguments), Module.thisProgram && (thisProgram = Module.thisProgram);
    var dynamicLibraries = Module.dynamicLibraries || [], wasmBinary = Module.wasmBinary;
    var wasmMemory, ABORT = false, EXITSTATUS;
    function assert(e, t) {
      e || abort(t);
    }
    var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAP64, HEAPF64;
    function updateMemoryViews() {
      var e = wasmMemory.buffer;
      Module.HEAP8 = HEAP8 = new Int8Array(e), Module.HEAP16 = HEAP16 = new Int16Array(e), Module.HEAPU8 = HEAPU8 = new Uint8Array(e), Module.HEAPU16 = HEAPU16 = new Uint16Array(e), Module.HEAP32 = HEAP32 = new Int32Array(e), Module.HEAPU32 = HEAPU32 = new Uint32Array(e), Module.HEAPF32 = HEAPF32 = new Float32Array(e), Module.HEAPF64 = HEAPF64 = new Float64Array(e), Module.HEAP64 = HEAP64 = new BigInt64Array(e), Module.HEAPU64 = new BigUint64Array(e);
    }
    if (Module.wasmMemory) wasmMemory = Module.wasmMemory;
    else {
      var INITIAL_MEMORY = Module.INITIAL_MEMORY || 134217728;
      wasmMemory = new WebAssembly.Memory({ initial: INITIAL_MEMORY / 65536, maximum: 32768 });
    }
    updateMemoryViews();
    var __ATPRERUN__ = [], __ATINIT__ = [], __ATMAIN__ = [], __ATPOSTRUN__ = [], __RELOC_FUNCS__ = [], runtimeInitialized = false;
    function preRun() {
      if (Module.preRun) for (typeof Module.preRun == "function" && (Module.preRun = [Module.preRun]); Module.preRun.length; ) addOnPreRun(Module.preRun.shift());
      callRuntimeCallbacks(__ATPRERUN__);
    }
    function initRuntime() {
      runtimeInitialized = true, callRuntimeCallbacks(__RELOC_FUNCS__), !Module.noFSInit && !FS.initialized && FS.init(), FS.ignorePermissions = false, SOCKFS.root = FS.mount(SOCKFS, {}, null), PIPEFS.root = FS.mount(PIPEFS, {}, null), callRuntimeCallbacks(__ATINIT__);
    }
    function preMain() {
      callRuntimeCallbacks(__ATMAIN__);
    }
    function postRun() {
      if (Module.postRun) for (typeof Module.postRun == "function" && (Module.postRun = [Module.postRun]); Module.postRun.length; ) addOnPostRun(Module.postRun.shift());
      callRuntimeCallbacks(__ATPOSTRUN__);
    }
    function addOnPreRun(e) {
      __ATPRERUN__.unshift(e);
    }
    function addOnInit(e) {
      __ATINIT__.unshift(e);
    }
    function addOnPostRun(e) {
      __ATPOSTRUN__.unshift(e);
    }
    var runDependencies = 0, dependenciesFulfilled = null;
    function addRunDependency(e) {
      runDependencies++, Module.monitorRunDependencies?.(runDependencies);
    }
    function removeRunDependency(e) {
      if (runDependencies--, Module.monitorRunDependencies?.(runDependencies), runDependencies == 0 && dependenciesFulfilled) {
        var t = dependenciesFulfilled;
        dependenciesFulfilled = null, t();
      }
    }
    function abort(e) {
      Module.onAbort?.(e), e = "Aborted(" + e + ")", err(e), ABORT = true, e += ". Build with -sASSERTIONS for more info.";
      var t = new WebAssembly.RuntimeError(e);
      throw readyPromiseReject(t), t;
    }
    var dataURIPrefix = "data:application/octet-stream;base64,", isDataURI = (e) => e.startsWith(dataURIPrefix), isFileURI = (e) => e.startsWith("file://");
    function findWasmBinary() {
      if (Module.locateFile) {
        var e = "postgres.wasm";
        return isDataURI(e) ? e : locateFile(e);
      }
      return new URL("" + new URL("postgres-CyuUVpXN.wasm", import.meta.url).href, import.meta.url).href;
    }
    var wasmBinaryFile;
    function getBinarySync(e) {
      if (e == wasmBinaryFile && wasmBinary) return new Uint8Array(wasmBinary);
      if (readBinary) return readBinary(e);
      throw "both async and sync fetching of the wasm failed";
    }
    async function getWasmBinary(e) {
      if (!wasmBinary) try {
        var t = await readAsync(e);
        return new Uint8Array(t);
      } catch {
      }
      return getBinarySync(e);
    }
    async function instantiateArrayBuffer(e, t) {
      try {
        var r2 = await getWasmBinary(e), a2 = await WebAssembly.instantiate(r2, t);
        return a2;
      } catch (o2) {
        err(`failed to asynchronously prepare wasm: ${o2}`), abort(o2);
      }
    }
    async function instantiateAsync(e, t, r2) {
      if (!e && typeof WebAssembly.instantiateStreaming == "function" && !isDataURI(t) && !ENVIRONMENT_IS_NODE && typeof fetch == "function") try {
        var a2 = fetch(t, { credentials: "same-origin" }), o2 = await WebAssembly.instantiateStreaming(a2, r2);
        return o2;
      } catch (s2) {
        err(`wasm streaming compile failed: ${s2}`), err("falling back to ArrayBuffer instantiation");
      }
      return instantiateArrayBuffer(t, r2);
    }
    function getWasmImports() {
      return { env: wasmImports, wasi_snapshot_preview1: wasmImports, "GOT.mem": new Proxy(wasmImports, GOTHandler), "GOT.func": new Proxy(wasmImports, GOTHandler) };
    }
    async function createWasm() {
      function e(o2, s2) {
        wasmExports = o2.exports, wasmExports = relocateExports(wasmExports, 16777216);
        var l2 = getDylinkMetadata(s2);
        return l2.neededDynlibs && (dynamicLibraries = l2.neededDynlibs.concat(dynamicLibraries)), mergeLibSymbols(wasmExports), LDSO.init(), loadDylibs(), addOnInit(wasmExports.__wasm_call_ctors), __RELOC_FUNCS__.push(wasmExports.__wasm_apply_data_relocs), removeRunDependency(), wasmExports;
      }
      addRunDependency();
      function t(o2) {
        e(o2.instance, o2.module);
      }
      var r2 = getWasmImports();
      if (Module.instantiateWasm) try {
        return Module.instantiateWasm(r2, e);
      } catch (o2) {
        err(`Module.instantiateWasm callback failed with error: ${o2}`), readyPromiseReject(o2);
      }
      wasmBinaryFile ?? (wasmBinaryFile = findWasmBinary());
      try {
        var a2 = await instantiateAsync(wasmBinary, wasmBinaryFile, r2);
        return t(a2), a2;
      } catch (o2) {
        readyPromiseReject(o2);
        return;
      }
    }
    var ASM_CONSTS = { 18792944: (e) => {
      Module.is_worker = typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope, Module.FD_BUFFER_MAX = e, Module.emscripten_copy_to = console.warn;
    }, 18793117: () => {
      Module.postMessage = function(t) {
        console.log("# 1252: onCustomMessage:", __FILE__, t);
      };
    }, 18793242: () => {
      if (Module.is_worker) {
        let t = function(r2) {
          console.log("onCustomMessage:", r2);
        };
        Module.onCustomMessage = t;
      } else Module.postMessage = function(r2) {
        switch (r2.type) {
          case "raw": {
            stringToUTF8(r2.data, shm_rawinput, Module.FD_BUFFER_MAX);
            break;
          }
          case "stdin": {
            stringToUTF8(r2.data, 1, Module.FD_BUFFER_MAX);
            break;
          }
          case "rcon": {
            stringToUTF8(r2.data, shm_rcon, Module.FD_BUFFER_MAX);
            break;
          }
          default:
            console.warn("custom_postMessage?", r2);
        }
      };
    } };
    function is_web_env() {
      try {
        if (window) return 1;
      } catch {
        return 0;
      }
    }
    is_web_env.sig = "i";
    class ExitStatus {
      constructor(t) {
        P$1(this, "name", "ExitStatus");
        this.message = `Program terminated with exit(${t})`, this.status = t;
      }
    }
    var GOT = {}, currentModuleWeakSymbols = /* @__PURE__ */ new Set([]), GOTHandler = { get(e, t) {
      var r2 = GOT[t];
      return r2 || (r2 = GOT[t] = new WebAssembly.Global({ value: "i32", mutable: true })), currentModuleWeakSymbols.has(t) || (r2.required = true), r2;
    } }, callRuntimeCallbacks = (e) => {
      for (; e.length > 0; ) e.shift()(Module);
    }, UTF8Decoder = typeof TextDecoder < "u" ? new TextDecoder() : void 0, UTF8ArrayToString = (e, t = 0, r2 = NaN) => {
      for (var a2 = t + r2, o2 = t; e[o2] && !(o2 >= a2); ) ++o2;
      if (o2 - t > 16 && e.buffer && UTF8Decoder) return UTF8Decoder.decode(e.subarray(t, o2));
      for (var s2 = ""; t < o2; ) {
        var l2 = e[t++];
        if (!(l2 & 128)) {
          s2 += String.fromCharCode(l2);
          continue;
        }
        var n2 = e[t++] & 63;
        if ((l2 & 224) == 192) {
          s2 += String.fromCharCode((l2 & 31) << 6 | n2);
          continue;
        }
        var _2 = e[t++] & 63;
        if ((l2 & 240) == 224 ? l2 = (l2 & 15) << 12 | n2 << 6 | _2 : l2 = (l2 & 7) << 18 | n2 << 12 | _2 << 6 | e[t++] & 63, l2 < 65536) s2 += String.fromCharCode(l2);
        else {
          var m2 = l2 - 65536;
          s2 += String.fromCharCode(55296 | m2 >> 10, 56320 | m2 & 1023);
        }
      }
      return s2;
    }, getDylinkMetadata = (e) => {
      var t = 0, r2 = 0;
      function a2() {
        return e[t++];
      }
      function o2() {
        for (var P2 = 0, U2 = 1; ; ) {
          var A2 = e[t++];
          if (P2 += (A2 & 127) * U2, U2 *= 128, !(A2 & 128)) break;
        }
        return P2;
      }
      function s2() {
        var P2 = o2();
        return t += P2, UTF8ArrayToString(e, t - P2, P2);
      }
      function l2(P2, U2) {
        if (P2) throw new Error(U2);
      }
      var n2 = "dylink.0";
      if (e instanceof WebAssembly.Module) {
        var _2 = WebAssembly.Module.customSections(e, n2);
        _2.length === 0 && (n2 = "dylink", _2 = WebAssembly.Module.customSections(e, n2)), l2(_2.length === 0, "need dylink section"), e = new Uint8Array(_2[0]), r2 = e.length;
      } else {
        var m2 = new Uint32Array(new Uint8Array(e.subarray(0, 24)).buffer), p2 = m2[0] == 1836278016;
        l2(!p2, "need to see wasm magic number"), l2(e[8] !== 0, "need the dylink section to be first"), t = 9;
        var d2 = o2();
        r2 = t + d2, n2 = s2();
      }
      var g2 = { neededDynlibs: [], tlsExports: /* @__PURE__ */ new Set(), weakImports: /* @__PURE__ */ new Set() };
      if (n2 == "dylink") {
        g2.memorySize = o2(), g2.memoryAlign = o2(), g2.tableSize = o2(), g2.tableAlign = o2();
        for (var c2 = o2(), f2 = 0; f2 < c2; ++f2) {
          var u2 = s2();
          g2.neededDynlibs.push(u2);
        }
      } else {
        l2(n2 !== "dylink.0");
        for (var w2 = 1, h2 = 2, S2 = 3, M2 = 4, y2 = 256, x2 = 3, E2 = 1; t < r2; ) {
          var b2 = a2(), T2 = o2();
          if (b2 === w2) g2.memorySize = o2(), g2.memoryAlign = o2(), g2.tableSize = o2(), g2.tableAlign = o2();
          else if (b2 === h2) for (var c2 = o2(), f2 = 0; f2 < c2; ++f2) u2 = s2(), g2.neededDynlibs.push(u2);
          else if (b2 === S2) for (var D2 = o2(); D2--; ) {
            var X2 = s2(), R3 = o2();
            R3 & y2 && g2.tlsExports.add(X2);
          }
          else if (b2 === M2) for (var D2 = o2(); D2--; ) {
            s2();
            var X2 = s2(), R3 = o2();
            (R3 & x2) == E2 && g2.weakImports.add(X2);
          }
          else t += T2;
        }
      }
      return g2;
    };
    function getValue(e, t = "i8") {
      switch (t.endsWith("*") && (t = "*"), t) {
        case "i1":
          return HEAP8[e];
        case "i8":
          return HEAP8[e];
        case "i16":
          return HEAP16[e >> 1];
        case "i32":
          return HEAP32[e >> 2];
        case "i64":
          return HEAP64[e >> 3];
        case "float":
          return HEAPF32[e >> 2];
        case "double":
          return HEAPF64[e >> 3];
        case "*":
          return HEAPU32[e >> 2];
        default:
          abort(`invalid type for getValue: ${t}`);
      }
    }
    var newDSO = (e, t, r2) => {
      var a2 = { refcount: 1 / 0, name: e, exports: r2, global: true };
      return LDSO.loadedLibsByName[e] = a2, t != null && (LDSO.loadedLibsByHandle[t] = a2), a2;
    }, LDSO = { loadedLibsByName: {}, loadedLibsByHandle: {}, init() {
      newDSO("__main__", 0, wasmImports);
    } }, ___heap_base = 23144432, alignMemory = (e, t) => Math.ceil(e / t) * t, getMemory = (e) => {
      if (runtimeInitialized) return _calloc(e, 1);
      var t = ___heap_base, r2 = t + alignMemory(e, 16);
      return ___heap_base = r2, GOT.__heap_base.value = r2, t;
    }, isInternalSym = (e) => ["__cpp_exception", "__c_longjmp", "__wasm_apply_data_relocs", "__dso_handle", "__tls_size", "__tls_align", "__set_stack_limits", "_emscripten_tls_init", "__wasm_init_tls", "__wasm_call_ctors", "__start_em_asm", "__stop_em_asm", "__start_em_js", "__stop_em_js"].includes(e) || e.startsWith("__em_js__"), uleb128Encode = (e, t) => {
      e < 128 ? t.push(e) : t.push(e % 128 | 128, e >> 7);
    }, sigToWasmTypes = (e) => {
      for (var t = { i: "i32", j: "i64", f: "f32", d: "f64", e: "externref", p: "i32" }, r2 = { parameters: [], results: e[0] == "v" ? [] : [t[e[0]]] }, a2 = 1; a2 < e.length; ++a2) r2.parameters.push(t[e[a2]]);
      return r2;
    }, generateFuncType = (e, t) => {
      var r2 = e.slice(0, 1), a2 = e.slice(1), o2 = { i: 127, p: 127, j: 126, f: 125, d: 124, e: 111 };
      t.push(96), uleb128Encode(a2.length, t);
      for (var s2 = 0; s2 < a2.length; ++s2) t.push(o2[a2[s2]]);
      r2 == "v" ? t.push(0) : t.push(1, o2[r2]);
    }, convertJsFunctionToWasm = (e, t) => {
      if (typeof WebAssembly.Function == "function") return new WebAssembly.Function(sigToWasmTypes(t), e);
      var r2 = [1];
      generateFuncType(t, r2);
      var a2 = [0, 97, 115, 109, 1, 0, 0, 0, 1];
      uleb128Encode(r2.length, a2), a2.push(...r2), a2.push(2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0);
      var o2 = new WebAssembly.Module(new Uint8Array(a2)), s2 = new WebAssembly.Instance(o2, { e: { f: e } }), l2 = s2.exports.f;
      return l2;
    }, wasmTableMirror = [], wasmTable = new WebAssembly.Table({ initial: 5360, element: "anyfunc" }), getWasmTableEntry = (e) => {
      var t = wasmTableMirror[e];
      return t || (e >= wasmTableMirror.length && (wasmTableMirror.length = e + 1), wasmTableMirror[e] = t = wasmTable.get(e)), t;
    }, updateTableMap = (e, t) => {
      if (functionsInTableMap) for (var r2 = e; r2 < e + t; r2++) {
        var a2 = getWasmTableEntry(r2);
        a2 && functionsInTableMap.set(a2, r2);
      }
    }, functionsInTableMap, getFunctionAddress = (e) => (functionsInTableMap || (functionsInTableMap = /* @__PURE__ */ new WeakMap(), updateTableMap(0, wasmTable.length)), functionsInTableMap.get(e) || 0), freeTableIndexes = [], getEmptyTableSlot = () => {
      if (freeTableIndexes.length) return freeTableIndexes.pop();
      try {
        wasmTable.grow(1);
      } catch (e) {
        throw e instanceof RangeError ? "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH." : e;
      }
      return wasmTable.length - 1;
    }, setWasmTableEntry = (e, t) => {
      wasmTable.set(e, t), wasmTableMirror[e] = wasmTable.get(e);
    }, addFunction = (e, t) => {
      var r2 = getFunctionAddress(e);
      if (r2) return r2;
      var a2 = getEmptyTableSlot();
      try {
        setWasmTableEntry(a2, e);
      } catch (s2) {
        if (!(s2 instanceof TypeError)) throw s2;
        var o2 = convertJsFunctionToWasm(e, t);
        setWasmTableEntry(a2, o2);
      }
      return functionsInTableMap.set(e, a2), a2;
    }, updateGOT = (e, t) => {
      for (var r2 in e) if (!isInternalSym(r2)) {
        var a2 = e[r2];
        GOT[r2] || (GOT[r2] = new WebAssembly.Global({ value: "i32", mutable: true })), GOT[r2].value == 0 && (typeof a2 == "function" ? GOT[r2].value = addFunction(a2) : typeof a2 == "number" ? GOT[r2].value = a2 : err(`unhandled export type for '${r2}': ${typeof a2}`));
      }
    }, relocateExports = (e, t, r2) => {
      var a2 = {};
      for (var o2 in e) {
        var s2 = e[o2];
        typeof s2 == "object" && (s2 = s2.value), typeof s2 == "number" && (s2 += t), a2[o2] = s2;
      }
      return updateGOT(a2), a2;
    }, isSymbolDefined = (e) => {
      var t = wasmImports[e];
      return !(!t || t.stub);
    }, dynCall = (e, t, r2 = []) => {
      var a2 = getWasmTableEntry(t)(...r2);
      return a2;
    }, stackSave = () => _emscripten_stack_get_current(), stackRestore = (e) => __emscripten_stack_restore(e), createInvokeFunction = (e) => (t, ...r2) => {
      var a2 = stackSave();
      try {
        return dynCall(e, t, r2);
      } catch (o2) {
        if (stackRestore(a2), o2 !== o2 + 0) throw o2;
        if (_setThrew(1, 0), e[0] == "j") return 0n;
      }
    }, resolveGlobalSymbol = (e, t = false) => {
      var r2;
      return isSymbolDefined(e) ? r2 = wasmImports[e] : e.startsWith("invoke_") && (r2 = wasmImports[e] = createInvokeFunction(e.split("_")[1])), { sym: r2, name: e };
    }, UTF8ToString = (e, t) => e ? UTF8ArrayToString(HEAPU8, e, t) : "", loadWebAssemblyModule = (binary, flags, libName, localScope, handle) => {
      var metadata = getDylinkMetadata(binary);
      currentModuleWeakSymbols = metadata.weakImports;
      function loadModule() {
        var firstLoad = !handle || !HEAP8[handle + 8];
        if (firstLoad) {
          var memAlign = Math.pow(2, metadata.memoryAlign), memoryBase = metadata.memorySize ? alignMemory(getMemory(metadata.memorySize + memAlign), memAlign) : 0, tableBase = metadata.tableSize ? wasmTable.length : 0;
          handle && (HEAP8[handle + 8] = 1, HEAPU32[handle + 12 >> 2] = memoryBase, HEAP32[handle + 16 >> 2] = metadata.memorySize, HEAPU32[handle + 20 >> 2] = tableBase, HEAP32[handle + 24 >> 2] = metadata.tableSize);
        } else memoryBase = HEAPU32[handle + 12 >> 2], tableBase = HEAPU32[handle + 20 >> 2];
        var tableGrowthNeeded = tableBase + metadata.tableSize - wasmTable.length;
        tableGrowthNeeded > 0 && wasmTable.grow(tableGrowthNeeded);
        var moduleExports;
        function resolveSymbol(e) {
          var t = resolveGlobalSymbol(e).sym;
          return !t && localScope && (t = localScope[e]), t || (t = moduleExports[e]), t;
        }
        var proxyHandler = { get(e, t) {
          switch (t) {
            case "__memory_base":
              return memoryBase;
            case "__table_base":
              return tableBase;
          }
          if (t in wasmImports && !wasmImports[t].stub) return wasmImports[t];
          if (!(t in e)) {
            var r2;
            e[t] = (...a2) => (r2 || (r2 = resolveSymbol(t)), r2(...a2));
          }
          return e[t];
        } }, proxy = new Proxy({}, proxyHandler), info = { "GOT.mem": new Proxy({}, GOTHandler), "GOT.func": new Proxy({}, GOTHandler), env: proxy, wasi_snapshot_preview1: proxy };
        function postInstantiation(module, instance) {
          updateTableMap(tableBase, metadata.tableSize), moduleExports = relocateExports(instance.exports, memoryBase), flags.allowUndefined || reportUndefinedSymbols();
          function addEmAsm(addr, body) {
            for (var args = [], arity = 0; arity < 16 && body.indexOf("$" + arity) != -1; arity++) args.push("$" + arity);
            args = args.join(",");
            var func = `(${args}) => { ${body} };`;
            ASM_CONSTS[start] = eval(func);
          }
          if ("__start_em_asm" in moduleExports) for (var start = moduleExports.__start_em_asm, stop = moduleExports.__stop_em_asm; start < stop; ) {
            var jsString = UTF8ToString(start);
            addEmAsm(start, jsString), start = HEAPU8.indexOf(0, start) + 1;
          }
          function addEmJs(name, cSig, body) {
            var jsArgs = [];
            if (cSig = cSig.slice(1, -1), cSig != "void") {
              cSig = cSig.split(",");
              for (var i in cSig) {
                var jsArg = cSig[i].split(" ").pop();
                jsArgs.push(jsArg.replaceAll("*", ""));
              }
            }
            var func = `(${jsArgs}) => ${body};`;
            moduleExports[name] = eval(func);
          }
          for (var name in moduleExports) if (name.startsWith("__em_js__")) {
            var start = moduleExports[name], jsString = UTF8ToString(start), parts = jsString.split("<::>");
            addEmJs(name.replace("__em_js__", ""), parts[0], parts[1]), delete moduleExports[name];
          }
          var applyRelocs = moduleExports.__wasm_apply_data_relocs;
          applyRelocs && (runtimeInitialized ? applyRelocs() : __RELOC_FUNCS__.push(applyRelocs));
          var init = moduleExports.__wasm_call_ctors;
          return init && (runtimeInitialized ? init() : __ATINIT__.push(init)), moduleExports;
        }
        if (flags.loadAsync) {
          if (binary instanceof WebAssembly.Module) {
            var instance = new WebAssembly.Instance(binary, info);
            return Promise.resolve(postInstantiation(binary, instance));
          }
          return WebAssembly.instantiate(binary, info).then((e) => postInstantiation(e.module, e.instance));
        }
        var module = binary instanceof WebAssembly.Module ? binary : new WebAssembly.Module(binary), instance = new WebAssembly.Instance(module, info);
        return postInstantiation(module, instance);
      }
      return flags.loadAsync ? metadata.neededDynlibs.reduce((e, t) => e.then(() => loadDynamicLibrary(t, flags, localScope)), Promise.resolve()).then(loadModule) : (metadata.neededDynlibs.forEach((e) => loadDynamicLibrary(e, flags, localScope)), loadModule());
    }, mergeLibSymbols = (e, t) => {
      for (var [r2, a2] of Object.entries(e)) {
        let o2 = (l2) => {
          isSymbolDefined(l2) || (wasmImports[l2] = a2);
        };
        o2(r2);
        let s2 = "__main_argc_argv";
        r2 == "main" && o2(s2), r2 == s2 && o2("main");
      }
    }, asyncLoad = async (e) => {
      var t = await readAsync(e);
      return new Uint8Array(t);
    }, preloadPlugins = Module.preloadPlugins || [], registerWasmPlugin = () => {
      var e = { promiseChainEnd: Promise.resolve(), canHandle: (t) => !Module.noWasmDecoding && t.endsWith(".so"), handle: (t, r2, a2, o2) => {
        e.promiseChainEnd = e.promiseChainEnd.then(() => loadWebAssemblyModule(t, { loadAsync: true, nodelete: true }, r2, {})).then((s2) => {
          preloadedWasm[r2] = s2, a2(t);
        }, (s2) => {
          err(`failed to instantiate wasm: ${r2}: ${s2}`), o2();
        });
      } };
      preloadPlugins.push(e);
    }, preloadedWasm = {};
    function loadDynamicLibrary(e, t = { global: true, nodelete: true }, r2, a2) {
      var o2 = LDSO.loadedLibsByName[e];
      if (o2) return t.global ? o2.global || (o2.global = true, mergeLibSymbols(o2.exports)) : r2 && Object.assign(r2, o2.exports), t.nodelete && o2.refcount !== 1 / 0 && (o2.refcount = 1 / 0), o2.refcount++, a2 && (LDSO.loadedLibsByHandle[a2] = o2), t.loadAsync ? Promise.resolve(true) : true;
      o2 = newDSO(e, a2, "loading"), o2.refcount = t.nodelete ? 1 / 0 : 1, o2.global = t.global;
      function s2() {
        if (a2) {
          var _2 = HEAPU32[a2 + 28 >> 2], m2 = HEAPU32[a2 + 32 >> 2];
          if (_2 && m2) {
            var p2 = HEAP8.slice(_2, _2 + m2);
            return t.loadAsync ? Promise.resolve(p2) : p2;
          }
        }
        var d2 = locateFile(e);
        if (t.loadAsync) return asyncLoad(d2);
        if (!readBinary) throw new Error(`${d2}: file not found, and synchronous loading of external files is not available`);
        return readBinary(d2);
      }
      function l2() {
        var _2 = preloadedWasm[e];
        return _2 ? t.loadAsync ? Promise.resolve(_2) : _2 : t.loadAsync ? s2().then((m2) => loadWebAssemblyModule(m2, t, e, r2, a2)) : loadWebAssemblyModule(s2(), t, e, r2, a2);
      }
      function n2(_2) {
        o2.global ? mergeLibSymbols(_2) : r2 && Object.assign(r2, _2), o2.exports = _2;
      }
      return t.loadAsync ? l2().then((_2) => (n2(_2), true)) : (n2(l2()), true);
    }
    var reportUndefinedSymbols = () => {
      for (var [e, t] of Object.entries(GOT)) if (t.value == 0) {
        var r2 = resolveGlobalSymbol(e, true).sym;
        if (!r2 && !t.required) continue;
        if (typeof r2 == "function") t.value = addFunction(r2, r2.sig);
        else if (typeof r2 == "number") t.value = r2;
        else throw new Error(`bad export type for '${e}': ${typeof r2}`);
      }
    }, loadDylibs = () => {
      if (!dynamicLibraries.length) {
        reportUndefinedSymbols();
        return;
      }
      addRunDependency(), dynamicLibraries.reduce((e, t) => e.then(() => loadDynamicLibrary(t, { loadAsync: true, global: true, nodelete: true, allowUndefined: true })), Promise.resolve()).then(() => {
        reportUndefinedSymbols(), removeRunDependency();
      });
    }, noExitRuntime = Module.noExitRuntime || true;
    function setValue(e, t, r2 = "i8") {
      switch (r2.endsWith("*") && (r2 = "*"), r2) {
        case "i1":
          HEAP8[e] = t;
          break;
        case "i8":
          HEAP8[e] = t;
          break;
        case "i16":
          HEAP16[e >> 1] = t;
          break;
        case "i32":
          HEAP32[e >> 2] = t;
          break;
        case "i64":
          HEAP64[e >> 3] = BigInt(t);
          break;
        case "float":
          HEAPF32[e >> 2] = t;
          break;
        case "double":
          HEAPF64[e >> 3] = t;
          break;
        case "*":
          HEAPU32[e >> 2] = t;
          break;
        default:
          abort(`invalid type for setValue: ${r2}`);
      }
    }
    var ___assert_fail = (e, t, r2, a2) => abort(`Assertion failed: ${UTF8ToString(e)}, at: ` + [t ? UTF8ToString(t) : "unknown filename", r2, a2 ? UTF8ToString(a2) : "unknown function"]);
    ___assert_fail.sig = "vppip";
    var ___call_sighandler = (e, t) => getWasmTableEntry(e)(t);
    ___call_sighandler.sig = "vpi";
    var ___memory_base = new WebAssembly.Global({ value: "i32", mutable: false }, 16777216), ___stack_pointer = new WebAssembly.Global({ value: "i32", mutable: true }, 23144432), PATH = { isAbs: (e) => e.charAt(0) === "/", splitPath: (e) => {
      var t = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
      return t.exec(e).slice(1);
    }, normalizeArray: (e, t) => {
      for (var r2 = 0, a2 = e.length - 1; a2 >= 0; a2--) {
        var o2 = e[a2];
        o2 === "." ? e.splice(a2, 1) : o2 === ".." ? (e.splice(a2, 1), r2++) : r2 && (e.splice(a2, 1), r2--);
      }
      if (t) for (; r2; r2--) e.unshift("..");
      return e;
    }, normalize: (e) => {
      var t = PATH.isAbs(e), r2 = e.substr(-1) === "/";
      return e = PATH.normalizeArray(e.split("/").filter((a2) => !!a2), !t).join("/"), !e && !t && (e = "."), e && r2 && (e += "/"), (t ? "/" : "") + e;
    }, dirname: (e) => {
      var t = PATH.splitPath(e), r2 = t[0], a2 = t[1];
      return !r2 && !a2 ? "." : (a2 && (a2 = a2.substr(0, a2.length - 1)), r2 + a2);
    }, basename: (e) => {
      if (e === "/") return "/";
      e = PATH.normalize(e), e = e.replace(/\/$/, "");
      var t = e.lastIndexOf("/");
      return t === -1 ? e : e.substr(t + 1);
    }, join: (...e) => PATH.normalize(e.join("/")), join2: (e, t) => PATH.normalize(e + "/" + t) }, initRandomFill = () => {
      if (typeof crypto == "object" && typeof crypto.getRandomValues == "function") return (a2) => crypto.getRandomValues(a2);
      if (ENVIRONMENT_IS_NODE) try {
        var e = require("crypto"), t = e.randomFillSync;
        if (t) return (a2) => e.randomFillSync(a2);
        var r2 = e.randomBytes;
        return (a2) => (a2.set(r2(a2.byteLength)), a2);
      } catch {
      }
      abort("initRandomDevice");
    }, randomFill = (e) => (randomFill = initRandomFill())(e), PATH_FS = { resolve: (...e) => {
      for (var t = "", r2 = false, a2 = e.length - 1; a2 >= -1 && !r2; a2--) {
        var o2 = a2 >= 0 ? e[a2] : FS.cwd();
        if (typeof o2 != "string") throw new TypeError("Arguments to path.resolve must be strings");
        if (!o2) return "";
        t = o2 + "/" + t, r2 = PATH.isAbs(o2);
      }
      return t = PATH.normalizeArray(t.split("/").filter((s2) => !!s2), !r2).join("/"), (r2 ? "/" : "") + t || ".";
    }, relative: (e, t) => {
      e = PATH_FS.resolve(e).substr(1), t = PATH_FS.resolve(t).substr(1);
      function r2(m2) {
        for (var p2 = 0; p2 < m2.length && m2[p2] === ""; p2++) ;
        for (var d2 = m2.length - 1; d2 >= 0 && m2[d2] === ""; d2--) ;
        return p2 > d2 ? [] : m2.slice(p2, d2 - p2 + 1);
      }
      for (var a2 = r2(e.split("/")), o2 = r2(t.split("/")), s2 = Math.min(a2.length, o2.length), l2 = s2, n2 = 0; n2 < s2; n2++) if (a2[n2] !== o2[n2]) {
        l2 = n2;
        break;
      }
      for (var _2 = [], n2 = l2; n2 < a2.length; n2++) _2.push("..");
      return _2 = _2.concat(o2.slice(l2)), _2.join("/");
    } }, FS_stdin_getChar_buffer = [], lengthBytesUTF8 = (e) => {
      for (var t = 0, r2 = 0; r2 < e.length; ++r2) {
        var a2 = e.charCodeAt(r2);
        a2 <= 127 ? t++ : a2 <= 2047 ? t += 2 : a2 >= 55296 && a2 <= 57343 ? (t += 4, ++r2) : t += 3;
      }
      return t;
    }, stringToUTF8Array = (e, t, r2, a2) => {
      if (!(a2 > 0)) return 0;
      for (var o2 = r2, s2 = r2 + a2 - 1, l2 = 0; l2 < e.length; ++l2) {
        var n2 = e.charCodeAt(l2);
        if (n2 >= 55296 && n2 <= 57343) {
          var _2 = e.charCodeAt(++l2);
          n2 = 65536 + ((n2 & 1023) << 10) | _2 & 1023;
        }
        if (n2 <= 127) {
          if (r2 >= s2) break;
          t[r2++] = n2;
        } else if (n2 <= 2047) {
          if (r2 + 1 >= s2) break;
          t[r2++] = 192 | n2 >> 6, t[r2++] = 128 | n2 & 63;
        } else if (n2 <= 65535) {
          if (r2 + 2 >= s2) break;
          t[r2++] = 224 | n2 >> 12, t[r2++] = 128 | n2 >> 6 & 63, t[r2++] = 128 | n2 & 63;
        } else {
          if (r2 + 3 >= s2) break;
          t[r2++] = 240 | n2 >> 18, t[r2++] = 128 | n2 >> 12 & 63, t[r2++] = 128 | n2 >> 6 & 63, t[r2++] = 128 | n2 & 63;
        }
      }
      return t[r2] = 0, r2 - o2;
    };
    function intArrayFromString(e, t, r2) {
      var a2 = lengthBytesUTF8(e) + 1, o2 = new Array(a2), s2 = stringToUTF8Array(e, o2, 0, o2.length);
      return o2.length = s2, o2;
    }
    var FS_stdin_getChar = () => {
      if (!FS_stdin_getChar_buffer.length) {
        var e = null;
        if (ENVIRONMENT_IS_NODE) {
          var t = 256, r2 = Buffer.alloc(t), a2 = 0, o2 = process.stdin.fd;
          try {
            a2 = fs.readSync(o2, r2, 0, t);
          } catch (s2) {
            if (s2.toString().includes("EOF")) a2 = 0;
            else throw s2;
          }
          a2 > 0 && (e = r2.slice(0, a2).toString("utf-8"));
        } else typeof window < "u" && typeof window.prompt == "function" && (e = window.prompt("Input: "), e !== null && (e += `
`));
        if (!e) return null;
        FS_stdin_getChar_buffer = intArrayFromString(e);
      }
      return FS_stdin_getChar_buffer.shift();
    }, TTY = { ttys: [], init() {
    }, shutdown() {
    }, register(e, t) {
      TTY.ttys[e] = { input: [], output: [], ops: t }, FS.registerDevice(e, TTY.stream_ops);
    }, stream_ops: { open(e) {
      var t = TTY.ttys[e.node.rdev];
      if (!t) throw new FS.ErrnoError(43);
      e.tty = t, e.seekable = false;
    }, close(e) {
      e.tty.ops.fsync(e.tty);
    }, fsync(e) {
      e.tty.ops.fsync(e.tty);
    }, read(e, t, r2, a2, o2) {
      if (!e.tty || !e.tty.ops.get_char) throw new FS.ErrnoError(60);
      for (var s2 = 0, l2 = 0; l2 < a2; l2++) {
        var n2;
        try {
          n2 = e.tty.ops.get_char(e.tty);
        } catch {
          throw new FS.ErrnoError(29);
        }
        if (n2 === void 0 && s2 === 0) throw new FS.ErrnoError(6);
        if (n2 == null) break;
        s2++, t[r2 + l2] = n2;
      }
      return s2 && (e.node.atime = Date.now()), s2;
    }, write(e, t, r2, a2, o2) {
      if (!e.tty || !e.tty.ops.put_char) throw new FS.ErrnoError(60);
      try {
        for (var s2 = 0; s2 < a2; s2++) e.tty.ops.put_char(e.tty, t[r2 + s2]);
      } catch {
        throw new FS.ErrnoError(29);
      }
      return a2 && (e.node.mtime = e.node.ctime = Date.now()), s2;
    } }, default_tty_ops: { get_char(e) {
      return FS_stdin_getChar();
    }, put_char(e, t) {
      t === null || t === 10 ? (out(UTF8ArrayToString(e.output)), e.output = []) : t != 0 && e.output.push(t);
    }, fsync(e) {
      e.output && e.output.length > 0 && (out(UTF8ArrayToString(e.output)), e.output = []);
    }, ioctl_tcgets(e) {
      return { c_iflag: 25856, c_oflag: 5, c_cflag: 191, c_lflag: 35387, c_cc: [3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] };
    }, ioctl_tcsets(e, t, r2) {
      return 0;
    }, ioctl_tiocgwinsz(e) {
      return [24, 80];
    } }, default_tty1_ops: { put_char(e, t) {
      t === null || t === 10 ? (err(UTF8ArrayToString(e.output)), e.output = []) : t != 0 && e.output.push(t);
    }, fsync(e) {
      e.output && e.output.length > 0 && (err(UTF8ArrayToString(e.output)), e.output = []);
    } } }, zeroMemory = (e, t) => {
      HEAPU8.fill(0, e, e + t);
    }, mmapAlloc = (e) => {
      e = alignMemory(e, 65536);
      var t = _emscripten_builtin_memalign(65536, e);
      return t && zeroMemory(t, e), t;
    }, MEMFS = { ops_table: null, mount(e) {
      return MEMFS.createNode(null, "/", 16895, 0);
    }, createNode(e, t, r2, a2) {
      if (FS.isBlkdev(r2) || FS.isFIFO(r2)) throw new FS.ErrnoError(63);
      MEMFS.ops_table || (MEMFS.ops_table = { dir: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr, lookup: MEMFS.node_ops.lookup, mknod: MEMFS.node_ops.mknod, rename: MEMFS.node_ops.rename, unlink: MEMFS.node_ops.unlink, rmdir: MEMFS.node_ops.rmdir, readdir: MEMFS.node_ops.readdir, symlink: MEMFS.node_ops.symlink }, stream: { llseek: MEMFS.stream_ops.llseek } }, file: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr }, stream: { llseek: MEMFS.stream_ops.llseek, read: MEMFS.stream_ops.read, write: MEMFS.stream_ops.write, allocate: MEMFS.stream_ops.allocate, mmap: MEMFS.stream_ops.mmap, msync: MEMFS.stream_ops.msync } }, link: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr, readlink: MEMFS.node_ops.readlink }, stream: {} }, chrdev: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr }, stream: FS.chrdev_stream_ops } });
      var o2 = FS.createNode(e, t, r2, a2);
      return FS.isDir(o2.mode) ? (o2.node_ops = MEMFS.ops_table.dir.node, o2.stream_ops = MEMFS.ops_table.dir.stream, o2.contents = {}) : FS.isFile(o2.mode) ? (o2.node_ops = MEMFS.ops_table.file.node, o2.stream_ops = MEMFS.ops_table.file.stream, o2.usedBytes = 0, o2.contents = null) : FS.isLink(o2.mode) ? (o2.node_ops = MEMFS.ops_table.link.node, o2.stream_ops = MEMFS.ops_table.link.stream) : FS.isChrdev(o2.mode) && (o2.node_ops = MEMFS.ops_table.chrdev.node, o2.stream_ops = MEMFS.ops_table.chrdev.stream), o2.atime = o2.mtime = o2.ctime = Date.now(), e && (e.contents[t] = o2, e.atime = e.mtime = e.ctime = o2.atime), o2;
    }, getFileDataAsTypedArray(e) {
      return e.contents ? e.contents.subarray ? e.contents.subarray(0, e.usedBytes) : new Uint8Array(e.contents) : new Uint8Array(0);
    }, expandFileStorage(e, t) {
      var r2 = e.contents ? e.contents.length : 0;
      if (!(r2 >= t)) {
        var a2 = 1024 * 1024;
        t = Math.max(t, r2 * (r2 < a2 ? 2 : 1.125) >>> 0), r2 != 0 && (t = Math.max(t, 256));
        var o2 = e.contents;
        e.contents = new Uint8Array(t), e.usedBytes > 0 && e.contents.set(o2.subarray(0, e.usedBytes), 0);
      }
    }, resizeFileStorage(e, t) {
      if (e.usedBytes != t) if (t == 0) e.contents = null, e.usedBytes = 0;
      else {
        var r2 = e.contents;
        e.contents = new Uint8Array(t), r2 && e.contents.set(r2.subarray(0, Math.min(t, e.usedBytes))), e.usedBytes = t;
      }
    }, node_ops: { getattr(e) {
      var t = {};
      return t.dev = FS.isChrdev(e.mode) ? e.id : 1, t.ino = e.id, t.mode = e.mode, t.nlink = 1, t.uid = 0, t.gid = 0, t.rdev = e.rdev, FS.isDir(e.mode) ? t.size = 4096 : FS.isFile(e.mode) ? t.size = e.usedBytes : FS.isLink(e.mode) ? t.size = e.link.length : t.size = 0, t.atime = new Date(e.atime), t.mtime = new Date(e.mtime), t.ctime = new Date(e.ctime), t.blksize = 4096, t.blocks = Math.ceil(t.size / t.blksize), t;
    }, setattr(e, t) {
      for (let r2 of ["mode", "atime", "mtime", "ctime"]) t[r2] && (e[r2] = t[r2]);
      t.size !== void 0 && MEMFS.resizeFileStorage(e, t.size);
    }, lookup(e, t) {
      throw MEMFS.doesNotExistError;
    }, mknod(e, t, r2, a2) {
      return MEMFS.createNode(e, t, r2, a2);
    }, rename(e, t, r2) {
      var a2;
      try {
        a2 = FS.lookupNode(t, r2);
      } catch {
      }
      if (a2) {
        if (FS.isDir(e.mode)) for (var o2 in a2.contents) throw new FS.ErrnoError(55);
        FS.hashRemoveNode(a2);
      }
      delete e.parent.contents[e.name], t.contents[r2] = e, e.name = r2, t.ctime = t.mtime = e.parent.ctime = e.parent.mtime = Date.now();
    }, unlink(e, t) {
      delete e.contents[t], e.ctime = e.mtime = Date.now();
    }, rmdir(e, t) {
      var r2 = FS.lookupNode(e, t);
      for (var a2 in r2.contents) throw new FS.ErrnoError(55);
      delete e.contents[t], e.ctime = e.mtime = Date.now();
    }, readdir(e) {
      return [".", "..", ...Object.keys(e.contents)];
    }, symlink(e, t, r2) {
      var a2 = MEMFS.createNode(e, t, 41471, 0);
      return a2.link = r2, a2;
    }, readlink(e) {
      if (!FS.isLink(e.mode)) throw new FS.ErrnoError(28);
      return e.link;
    } }, stream_ops: { read(e, t, r2, a2, o2) {
      var s2 = e.node.contents;
      if (o2 >= e.node.usedBytes) return 0;
      var l2 = Math.min(e.node.usedBytes - o2, a2);
      if (l2 > 8 && s2.subarray) t.set(s2.subarray(o2, o2 + l2), r2);
      else for (var n2 = 0; n2 < l2; n2++) t[r2 + n2] = s2[o2 + n2];
      return l2;
    }, write(e, t, r2, a2, o2, s2) {
      if (t.buffer === HEAP8.buffer && (s2 = false), !a2) return 0;
      var l2 = e.node;
      if (l2.mtime = l2.ctime = Date.now(), t.subarray && (!l2.contents || l2.contents.subarray)) {
        if (s2) return l2.contents = t.subarray(r2, r2 + a2), l2.usedBytes = a2, a2;
        if (l2.usedBytes === 0 && o2 === 0) return l2.contents = t.slice(r2, r2 + a2), l2.usedBytes = a2, a2;
        if (o2 + a2 <= l2.usedBytes) return l2.contents.set(t.subarray(r2, r2 + a2), o2), a2;
      }
      if (MEMFS.expandFileStorage(l2, o2 + a2), l2.contents.subarray && t.subarray) l2.contents.set(t.subarray(r2, r2 + a2), o2);
      else for (var n2 = 0; n2 < a2; n2++) l2.contents[o2 + n2] = t[r2 + n2];
      return l2.usedBytes = Math.max(l2.usedBytes, o2 + a2), a2;
    }, llseek(e, t, r2) {
      var a2 = t;
      if (r2 === 1 ? a2 += e.position : r2 === 2 && FS.isFile(e.node.mode) && (a2 += e.node.usedBytes), a2 < 0) throw new FS.ErrnoError(28);
      return a2;
    }, allocate(e, t, r2) {
      MEMFS.expandFileStorage(e.node, t + r2), e.node.usedBytes = Math.max(e.node.usedBytes, t + r2);
    }, mmap(e, t, r2, a2, o2) {
      if (!FS.isFile(e.node.mode)) throw new FS.ErrnoError(43);
      var s2, l2, n2 = e.node.contents;
      if (!(o2 & 2) && n2 && n2.buffer === HEAP8.buffer) l2 = false, s2 = n2.byteOffset;
      else {
        if (l2 = true, s2 = mmapAlloc(t), !s2) throw new FS.ErrnoError(48);
        n2 && ((r2 > 0 || r2 + t < n2.length) && (n2.subarray ? n2 = n2.subarray(r2, r2 + t) : n2 = Array.prototype.slice.call(n2, r2, r2 + t)), HEAP8.set(n2, s2));
      }
      return { ptr: s2, allocated: l2 };
    }, msync(e, t, r2, a2, o2) {
      return MEMFS.stream_ops.write(e, t, 0, a2, r2, false), 0;
    } } }, FS_createDataFile = (e, t, r2, a2, o2, s2) => {
      FS.createDataFile(e, t, r2, a2, o2, s2);
    }, FS_handledByPreloadPlugin = (e, t, r2, a2) => {
      typeof Browser < "u" && Browser.init();
      var o2 = false;
      return preloadPlugins.forEach((s2) => {
        o2 || s2.canHandle(t) && (s2.handle(e, t, r2, a2), o2 = true);
      }), o2;
    }, FS_createPreloadedFile = (e, t, r2, a2, o2, s2, l2, n2, _2, m2) => {
      var p2 = t ? PATH_FS.resolve(PATH.join2(e, t)) : e;
      function g2(c2) {
        function f2(u2) {
          m2?.(), n2 || FS_createDataFile(e, t, u2, a2, o2, _2), s2?.(), removeRunDependency();
        }
        FS_handledByPreloadPlugin(c2, p2, f2, () => {
          l2?.(), removeRunDependency();
        }) || f2(c2);
      }
      addRunDependency(), typeof r2 == "string" ? asyncLoad(r2).then(g2, l2) : g2(r2);
    }, FS_modeStringToFlags = (e) => {
      var t = { r: 0, "r+": 2, w: 577, "w+": 578, a: 1089, "a+": 1090 }, r2 = t[e];
      if (typeof r2 > "u") throw new Error(`Unknown file open mode: ${e}`);
      return r2;
    }, FS_getMode = (e, t) => {
      var r2 = 0;
      return e && (r2 |= 365), t && (r2 |= 146), r2;
    }, IDBFS = { dbs: {}, indexedDB: () => {
      if (typeof indexedDB < "u") return indexedDB;
      var e = null;
      return typeof window == "object" && (e = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB), e;
    }, DB_VERSION: 21, DB_STORE_NAME: "FILE_DATA", queuePersist: (e) => {
      function t() {
        e.idbPersistState === "again" ? r2() : e.idbPersistState = 0;
      }
      function r2() {
        e.idbPersistState = "idb", IDBFS.syncfs(e, false, t);
      }
      e.idbPersistState ? e.idbPersistState === "idb" && (e.idbPersistState = "again") : e.idbPersistState = setTimeout(r2, 0);
    }, mount: (e) => {
      var t = MEMFS.mount(e);
      if (e?.opts?.autoPersist) {
        t.idbPersistState = 0;
        var r2 = t.node_ops;
        t.node_ops = Object.assign({}, t.node_ops), t.node_ops.mknod = (a2, o2, s2, l2) => {
          var n2 = r2.mknod(a2, o2, s2, l2);
          return n2.node_ops = t.node_ops, n2.idbfs_mount = t.mount, n2.memfs_stream_ops = n2.stream_ops, n2.stream_ops = Object.assign({}, n2.stream_ops), n2.stream_ops.write = (_2, m2, p2, d2, g2, c2) => (_2.node.isModified = true, n2.memfs_stream_ops.write(_2, m2, p2, d2, g2, c2)), n2.stream_ops.close = (_2) => {
            var m2 = _2.node;
            if (m2.isModified && (IDBFS.queuePersist(m2.idbfs_mount), m2.isModified = false), m2.memfs_stream_ops.close) return m2.memfs_stream_ops.close(_2);
          }, n2;
        }, t.node_ops.mkdir = (...a2) => (IDBFS.queuePersist(t.mount), r2.mkdir(...a2)), t.node_ops.rmdir = (...a2) => (IDBFS.queuePersist(t.mount), r2.rmdir(...a2)), t.node_ops.symlink = (...a2) => (IDBFS.queuePersist(t.mount), r2.symlink(...a2)), t.node_ops.unlink = (...a2) => (IDBFS.queuePersist(t.mount), r2.unlink(...a2)), t.node_ops.rename = (...a2) => (IDBFS.queuePersist(t.mount), r2.rename(...a2));
      }
      return t;
    }, syncfs: (e, t, r2) => {
      IDBFS.getLocalSet(e, (a2, o2) => {
        if (a2) return r2(a2);
        IDBFS.getRemoteSet(e, (s2, l2) => {
          if (s2) return r2(s2);
          var n2 = t ? l2 : o2, _2 = t ? o2 : l2;
          IDBFS.reconcile(n2, _2, r2);
        });
      });
    }, quit: () => {
      Object.values(IDBFS.dbs).forEach((e) => e.close()), IDBFS.dbs = {};
    }, getDB: (e, t) => {
      var r2 = IDBFS.dbs[e];
      if (r2) return t(null, r2);
      var a2;
      try {
        a2 = IDBFS.indexedDB().open(e, IDBFS.DB_VERSION);
      } catch (o2) {
        return t(o2);
      }
      if (!a2) return t("Unable to connect to IndexedDB");
      a2.onupgradeneeded = (o2) => {
        var s2 = o2.target.result, l2 = o2.target.transaction, n2;
        s2.objectStoreNames.contains(IDBFS.DB_STORE_NAME) ? n2 = l2.objectStore(IDBFS.DB_STORE_NAME) : n2 = s2.createObjectStore(IDBFS.DB_STORE_NAME), n2.indexNames.contains("timestamp") || n2.createIndex("timestamp", "timestamp", { unique: false });
      }, a2.onsuccess = () => {
        r2 = a2.result, IDBFS.dbs[e] = r2, t(null, r2);
      }, a2.onerror = (o2) => {
        t(o2.target.error), o2.preventDefault();
      };
    }, getLocalSet: (e, t) => {
      var r2 = {};
      function a2(_2) {
        return _2 !== "." && _2 !== "..";
      }
      function o2(_2) {
        return (m2) => PATH.join2(_2, m2);
      }
      for (var s2 = FS.readdir(e.mountpoint).filter(a2).map(o2(e.mountpoint)); s2.length; ) {
        var l2 = s2.pop(), n2;
        try {
          n2 = FS.stat(l2);
        } catch (_2) {
          return t(_2);
        }
        FS.isDir(n2.mode) && s2.push(...FS.readdir(l2).filter(a2).map(o2(l2))), r2[l2] = { timestamp: n2.mtime };
      }
      return t(null, { type: "local", entries: r2 });
    }, getRemoteSet: (e, t) => {
      var r2 = {};
      IDBFS.getDB(e.mountpoint, (a2, o2) => {
        if (a2) return t(a2);
        try {
          var s2 = o2.transaction([IDBFS.DB_STORE_NAME], "readonly");
          s2.onerror = (_2) => {
            t(_2.target.error), _2.preventDefault();
          };
          var l2 = s2.objectStore(IDBFS.DB_STORE_NAME), n2 = l2.index("timestamp");
          n2.openKeyCursor().onsuccess = (_2) => {
            var m2 = _2.target.result;
            if (!m2) return t(null, { type: "remote", db: o2, entries: r2 });
            r2[m2.primaryKey] = { timestamp: m2.key }, m2.continue();
          };
        } catch (_2) {
          return t(_2);
        }
      });
    }, loadLocalEntry: (e, t) => {
      var r2, a2;
      try {
        var o2 = FS.lookupPath(e);
        a2 = o2.node, r2 = FS.stat(e);
      } catch (s2) {
        return t(s2);
      }
      return FS.isDir(r2.mode) ? t(null, { timestamp: r2.mtime, mode: r2.mode }) : FS.isFile(r2.mode) ? (a2.contents = MEMFS.getFileDataAsTypedArray(a2), t(null, { timestamp: r2.mtime, mode: r2.mode, contents: a2.contents })) : t(new Error("node type not supported"));
    }, storeLocalEntry: (e, t, r2) => {
      try {
        if (FS.isDir(t.mode)) FS.mkdirTree(e, t.mode);
        else if (FS.isFile(t.mode)) FS.writeFile(e, t.contents, { canOwn: true });
        else return r2(new Error("node type not supported"));
        FS.chmod(e, t.mode), FS.utime(e, t.timestamp, t.timestamp);
      } catch (a2) {
        return r2(a2);
      }
      r2(null);
    }, removeLocalEntry: (e, t) => {
      try {
        var r2 = FS.stat(e);
        FS.isDir(r2.mode) ? FS.rmdir(e) : FS.isFile(r2.mode) && FS.unlink(e);
      } catch (a2) {
        return t(a2);
      }
      t(null);
    }, loadRemoteEntry: (e, t, r2) => {
      var a2 = e.get(t);
      a2.onsuccess = (o2) => r2(null, o2.target.result), a2.onerror = (o2) => {
        r2(o2.target.error), o2.preventDefault();
      };
    }, storeRemoteEntry: (e, t, r2, a2) => {
      try {
        var o2 = e.put(r2, t);
      } catch (s2) {
        a2(s2);
        return;
      }
      o2.onsuccess = (s2) => a2(), o2.onerror = (s2) => {
        a2(s2.target.error), s2.preventDefault();
      };
    }, removeRemoteEntry: (e, t, r2) => {
      var a2 = e.delete(t);
      a2.onsuccess = (o2) => r2(), a2.onerror = (o2) => {
        r2(o2.target.error), o2.preventDefault();
      };
    }, reconcile: (e, t, r2) => {
      var a2 = 0, o2 = [];
      Object.keys(e.entries).forEach((d2) => {
        var g2 = e.entries[d2], c2 = t.entries[d2];
        (!c2 || g2.timestamp.getTime() != c2.timestamp.getTime()) && (o2.push(d2), a2++);
      });
      var s2 = [];
      if (Object.keys(t.entries).forEach((d2) => {
        e.entries[d2] || (s2.push(d2), a2++);
      }), !a2) return r2(null);
      var l2 = false, n2 = e.type === "remote" ? e.db : t.db, _2 = n2.transaction([IDBFS.DB_STORE_NAME], "readwrite"), m2 = _2.objectStore(IDBFS.DB_STORE_NAME);
      function p2(d2) {
        if (d2 && !l2) return l2 = true, r2(d2);
      }
      _2.onerror = _2.onabort = (d2) => {
        p2(d2.target.error), d2.preventDefault();
      }, _2.oncomplete = (d2) => {
        l2 || r2(null);
      }, o2.sort().forEach((d2) => {
        t.type === "local" ? IDBFS.loadRemoteEntry(m2, d2, (g2, c2) => {
          if (g2) return p2(g2);
          IDBFS.storeLocalEntry(d2, c2, p2);
        }) : IDBFS.loadLocalEntry(d2, (g2, c2) => {
          if (g2) return p2(g2);
          IDBFS.storeRemoteEntry(m2, d2, c2, p2);
        });
      }), s2.sort().reverse().forEach((d2) => {
        t.type === "local" ? IDBFS.removeLocalEntry(d2, p2) : IDBFS.removeRemoteEntry(m2, d2, p2);
      });
    } }, ERRNO_CODES = { EPERM: 63, ENOENT: 44, ESRCH: 71, EINTR: 27, EIO: 29, ENXIO: 60, E2BIG: 1, ENOEXEC: 45, EBADF: 8, ECHILD: 12, EAGAIN: 6, EWOULDBLOCK: 6, ENOMEM: 48, EACCES: 2, EFAULT: 21, ENOTBLK: 105, EBUSY: 10, EEXIST: 20, EXDEV: 75, ENODEV: 43, ENOTDIR: 54, EISDIR: 31, EINVAL: 28, ENFILE: 41, EMFILE: 33, ENOTTY: 59, ETXTBSY: 74, EFBIG: 22, ENOSPC: 51, ESPIPE: 70, EROFS: 69, EMLINK: 34, EPIPE: 64, EDOM: 18, ERANGE: 68, ENOMSG: 49, EIDRM: 24, ECHRNG: 106, EL2NSYNC: 156, EL3HLT: 107, EL3RST: 108, ELNRNG: 109, EUNATCH: 110, ENOCSI: 111, EL2HLT: 112, EDEADLK: 16, ENOLCK: 46, EBADE: 113, EBADR: 114, EXFULL: 115, ENOANO: 104, EBADRQC: 103, EBADSLT: 102, EDEADLOCK: 16, EBFONT: 101, ENOSTR: 100, ENODATA: 116, ETIME: 117, ENOSR: 118, ENONET: 119, ENOPKG: 120, EREMOTE: 121, ENOLINK: 47, EADV: 122, ESRMNT: 123, ECOMM: 124, EPROTO: 65, EMULTIHOP: 36, EDOTDOT: 125, EBADMSG: 9, ENOTUNIQ: 126, EBADFD: 127, EREMCHG: 128, ELIBACC: 129, ELIBBAD: 130, ELIBSCN: 131, ELIBMAX: 132, ELIBEXEC: 133, ENOSYS: 52, ENOTEMPTY: 55, ENAMETOOLONG: 37, ELOOP: 32, EOPNOTSUPP: 138, EPFNOSUPPORT: 139, ECONNRESET: 15, ENOBUFS: 42, EAFNOSUPPORT: 5, EPROTOTYPE: 67, ENOTSOCK: 57, ENOPROTOOPT: 50, ESHUTDOWN: 140, ECONNREFUSED: 14, EADDRINUSE: 3, ECONNABORTED: 13, ENETUNREACH: 40, ENETDOWN: 38, ETIMEDOUT: 73, EHOSTDOWN: 142, EHOSTUNREACH: 23, EINPROGRESS: 26, EALREADY: 7, EDESTADDRREQ: 17, EMSGSIZE: 35, EPROTONOSUPPORT: 66, ESOCKTNOSUPPORT: 137, EADDRNOTAVAIL: 4, ENETRESET: 39, EISCONN: 30, ENOTCONN: 53, ETOOMANYREFS: 141, EUSERS: 136, EDQUOT: 19, ESTALE: 72, ENOTSUP: 138, ENOMEDIUM: 148, EILSEQ: 25, EOVERFLOW: 61, ECANCELED: 11, ENOTRECOVERABLE: 56, EOWNERDEAD: 62, ESTRPIPE: 135 }, NODEFS = { isWindows: false, staticInit() {
      NODEFS.isWindows = !!process.platform.match(/^win/);
      var e = process.binding("constants");
      e.fs && (e = e.fs), NODEFS.flagsForNodeMap = { 1024: e.O_APPEND, 64: e.O_CREAT, 128: e.O_EXCL, 256: e.O_NOCTTY, 0: e.O_RDONLY, 2: e.O_RDWR, 4096: e.O_SYNC, 512: e.O_TRUNC, 1: e.O_WRONLY, 131072: e.O_NOFOLLOW };
    }, convertNodeCode(e) {
      var t = e.code;
      return ERRNO_CODES[t];
    }, tryFSOperation(e) {
      try {
        return e();
      } catch (t) {
        throw t.code ? t.code === "UNKNOWN" ? new FS.ErrnoError(28) : new FS.ErrnoError(NODEFS.convertNodeCode(t)) : t;
      }
    }, mount(e) {
      return NODEFS.createNode(null, "/", NODEFS.getMode(e.opts.root), 0);
    }, createNode(e, t, r2, a2) {
      if (!FS.isDir(r2) && !FS.isFile(r2) && !FS.isLink(r2)) throw new FS.ErrnoError(28);
      var o2 = FS.createNode(e, t, r2);
      return o2.node_ops = NODEFS.node_ops, o2.stream_ops = NODEFS.stream_ops, o2;
    }, getMode(e) {
      return NODEFS.tryFSOperation(() => {
        var t = fs.lstatSync(e).mode;
        return NODEFS.isWindows && (t |= (t & 292) >> 2), t;
      });
    }, realPath(e) {
      for (var t = []; e.parent !== e; ) t.push(e.name), e = e.parent;
      return t.push(e.mount.opts.root), t.reverse(), PATH.join(...t);
    }, flagsForNode(e) {
      e &= -2097153, e &= -2049, e &= -32769, e &= -524289, e &= -65537;
      var t = 0;
      for (var r2 in NODEFS.flagsForNodeMap) e & r2 && (t |= NODEFS.flagsForNodeMap[r2], e ^= r2);
      if (e) throw new FS.ErrnoError(28);
      return t;
    }, node_ops: { getattr(e) {
      var t = NODEFS.realPath(e), r2;
      return NODEFS.tryFSOperation(() => r2 = fs.lstatSync(t)), NODEFS.isWindows && (r2.blksize || (r2.blksize = 4096), r2.blocks || (r2.blocks = (r2.size + r2.blksize - 1) / r2.blksize | 0), r2.mode |= (r2.mode & 292) >> 2), { dev: r2.dev, ino: r2.ino, mode: r2.mode, nlink: r2.nlink, uid: r2.uid, gid: r2.gid, rdev: r2.rdev, size: r2.size, atime: r2.atime, mtime: r2.mtime, ctime: r2.ctime, blksize: r2.blksize, blocks: r2.blocks };
    }, setattr(e, t) {
      var r2 = NODEFS.realPath(e);
      NODEFS.tryFSOperation(() => {
        if (t.mode !== void 0) {
          var a2 = t.mode;
          NODEFS.isWindows && (a2 &= 384), fs.chmodSync(r2, a2), e.mode = t.mode;
        }
        if (t.atime || t.mtime) {
          var o2 = t.atime && new Date(t.atime), s2 = t.mtime && new Date(t.mtime);
          fs.utimesSync(r2, o2, s2);
        }
        t.size !== void 0 && fs.truncateSync(r2, t.size);
      });
    }, lookup(e, t) {
      var r2 = PATH.join2(NODEFS.realPath(e), t), a2 = NODEFS.getMode(r2);
      return NODEFS.createNode(e, t, a2);
    }, mknod(e, t, r2, a2) {
      var o2 = NODEFS.createNode(e, t, r2, a2), s2 = NODEFS.realPath(o2);
      return NODEFS.tryFSOperation(() => {
        FS.isDir(o2.mode) ? fs.mkdirSync(s2, o2.mode) : fs.writeFileSync(s2, "", { mode: o2.mode });
      }), o2;
    }, rename(e, t, r2) {
      var a2 = NODEFS.realPath(e), o2 = PATH.join2(NODEFS.realPath(t), r2);
      try {
        FS.unlink(o2);
      } catch {
      }
      NODEFS.tryFSOperation(() => fs.renameSync(a2, o2)), e.name = r2;
    }, unlink(e, t) {
      var r2 = PATH.join2(NODEFS.realPath(e), t);
      NODEFS.tryFSOperation(() => fs.unlinkSync(r2));
    }, rmdir(e, t) {
      var r2 = PATH.join2(NODEFS.realPath(e), t);
      NODEFS.tryFSOperation(() => fs.rmdirSync(r2));
    }, readdir(e) {
      var t = NODEFS.realPath(e);
      return NODEFS.tryFSOperation(() => fs.readdirSync(t));
    }, symlink(e, t, r2) {
      var a2 = PATH.join2(NODEFS.realPath(e), t);
      NODEFS.tryFSOperation(() => fs.symlinkSync(r2, a2));
    }, readlink(e) {
      var t = NODEFS.realPath(e);
      return NODEFS.tryFSOperation(() => fs.readlinkSync(t));
    }, statfs(e) {
      var t = NODEFS.tryFSOperation(() => fs.statfsSync(e));
      return t.frsize = t.bsize, t;
    } }, stream_ops: { open(e) {
      var t = NODEFS.realPath(e.node);
      NODEFS.tryFSOperation(() => {
        FS.isFile(e.node.mode) && (e.shared.refcount = 1, e.nfd = fs.openSync(t, NODEFS.flagsForNode(e.flags)));
      });
    }, close(e) {
      NODEFS.tryFSOperation(() => {
        FS.isFile(e.node.mode) && e.nfd && --e.shared.refcount === 0 && fs.closeSync(e.nfd);
      });
    }, dup(e) {
      e.shared.refcount++;
    }, read(e, t, r2, a2, o2) {
      return a2 === 0 ? 0 : NODEFS.tryFSOperation(() => fs.readSync(e.nfd, new Int8Array(t.buffer, r2, a2), 0, a2, o2));
    }, write(e, t, r2, a2, o2) {
      return NODEFS.tryFSOperation(() => fs.writeSync(e.nfd, new Int8Array(t.buffer, r2, a2), 0, a2, o2));
    }, llseek(e, t, r2) {
      var a2 = t;
      if (r2 === 1 ? a2 += e.position : r2 === 2 && FS.isFile(e.node.mode) && NODEFS.tryFSOperation(() => {
        var o2 = fs.fstatSync(e.nfd);
        a2 += o2.size;
      }), a2 < 0) throw new FS.ErrnoError(28);
      return a2;
    }, mmap(e, t, r2, a2, o2) {
      if (!FS.isFile(e.node.mode)) throw new FS.ErrnoError(43);
      var s2 = mmapAlloc(t);
      return NODEFS.stream_ops.read(e, HEAP8, s2, t, r2), { ptr: s2, allocated: true };
    }, msync(e, t, r2, a2, o2) {
      return NODEFS.stream_ops.write(e, t, 0, a2, r2, false), 0;
    } } }, FS = { root: null, mounts: [], devices: {}, streams: [], nextInode: 1, nameTable: null, currentPath: "/", initialized: false, ignorePermissions: true, ErrnoError: class {
      constructor(e) {
        P$1(this, "name", "ErrnoError");
        this.errno = e;
      }
    }, filesystems: null, syncFSRequests: 0, readFiles: {}, FSStream: class {
      constructor() {
        P$1(this, "shared", {});
      }
      get object() {
        return this.node;
      }
      set object(e) {
        this.node = e;
      }
      get isRead() {
        return (this.flags & 2097155) !== 1;
      }
      get isWrite() {
        return (this.flags & 2097155) !== 0;
      }
      get isAppend() {
        return this.flags & 1024;
      }
      get flags() {
        return this.shared.flags;
      }
      set flags(e) {
        this.shared.flags = e;
      }
      get position() {
        return this.shared.position;
      }
      set position(e) {
        this.shared.position = e;
      }
    }, FSNode: class {
      constructor(e, t, r2, a2) {
        P$1(this, "node_ops", {});
        P$1(this, "stream_ops", {});
        P$1(this, "readMode", 365);
        P$1(this, "writeMode", 146);
        P$1(this, "mounted", null);
        e || (e = this), this.parent = e, this.mount = e.mount, this.id = FS.nextInode++, this.name = t, this.mode = r2, this.rdev = a2, this.atime = this.mtime = this.ctime = Date.now();
      }
      get read() {
        return (this.mode & this.readMode) === this.readMode;
      }
      set read(e) {
        e ? this.mode |= this.readMode : this.mode &= ~this.readMode;
      }
      get write() {
        return (this.mode & this.writeMode) === this.writeMode;
      }
      set write(e) {
        e ? this.mode |= this.writeMode : this.mode &= ~this.writeMode;
      }
      get isFolder() {
        return FS.isDir(this.mode);
      }
      get isDevice() {
        return FS.isChrdev(this.mode);
      }
    }, lookupPath(e, t = {}) {
      if (!e) return { path: "", node: null };
      t.follow_mount ?? (t.follow_mount = true), PATH.isAbs(e) || (e = FS.cwd() + "/" + e);
      e: for (var r2 = 0; r2 < 40; r2++) {
        for (var a2 = e.split("/").filter((m2) => !!m2 && m2 !== "."), o2 = FS.root, s2 = "/", l2 = 0; l2 < a2.length; l2++) {
          var n2 = l2 === a2.length - 1;
          if (n2 && t.parent) break;
          if (a2[l2] === "..") {
            s2 = PATH.dirname(s2), o2 = o2.parent;
            continue;
          }
          s2 = PATH.join2(s2, a2[l2]);
          try {
            o2 = FS.lookupNode(o2, a2[l2]);
          } catch (m2) {
            if (m2?.errno === 44 && n2 && t.noent_okay) return { path: s2 };
            throw m2;
          }
          if (FS.isMountpoint(o2) && (!n2 || t.follow_mount) && (o2 = o2.mounted.root), FS.isLink(o2.mode) && (!n2 || t.follow)) {
            if (!o2.node_ops.readlink) throw new FS.ErrnoError(52);
            var _2 = o2.node_ops.readlink(o2);
            PATH.isAbs(_2) || (_2 = PATH.dirname(s2) + "/" + _2), e = _2 + "/" + a2.slice(l2 + 1).join("/");
            continue e;
          }
        }
        return { path: s2, node: o2 };
      }
      throw new FS.ErrnoError(32);
    }, getPath(e) {
      for (var t; ; ) {
        if (FS.isRoot(e)) {
          var r2 = e.mount.mountpoint;
          return t ? r2[r2.length - 1] !== "/" ? `${r2}/${t}` : r2 + t : r2;
        }
        t = t ? `${e.name}/${t}` : e.name, e = e.parent;
      }
    }, hashName(e, t) {
      for (var r2 = 0, a2 = 0; a2 < t.length; a2++) r2 = (r2 << 5) - r2 + t.charCodeAt(a2) | 0;
      return (e + r2 >>> 0) % FS.nameTable.length;
    }, hashAddNode(e) {
      var t = FS.hashName(e.parent.id, e.name);
      e.name_next = FS.nameTable[t], FS.nameTable[t] = e;
    }, hashRemoveNode(e) {
      var t = FS.hashName(e.parent.id, e.name);
      if (FS.nameTable[t] === e) FS.nameTable[t] = e.name_next;
      else for (var r2 = FS.nameTable[t]; r2; ) {
        if (r2.name_next === e) {
          r2.name_next = e.name_next;
          break;
        }
        r2 = r2.name_next;
      }
    }, lookupNode(e, t) {
      var r2 = FS.mayLookup(e);
      if (r2) throw new FS.ErrnoError(r2);
      for (var a2 = FS.hashName(e.id, t), o2 = FS.nameTable[a2]; o2; o2 = o2.name_next) {
        var s2 = o2.name;
        if (o2.parent.id === e.id && s2 === t) return o2;
      }
      return FS.lookup(e, t);
    }, createNode(e, t, r2, a2) {
      var o2 = new FS.FSNode(e, t, r2, a2);
      return FS.hashAddNode(o2), o2;
    }, destroyNode(e) {
      FS.hashRemoveNode(e);
    }, isRoot(e) {
      return e === e.parent;
    }, isMountpoint(e) {
      return !!e.mounted;
    }, isFile(e) {
      return (e & 61440) === 32768;
    }, isDir(e) {
      return (e & 61440) === 16384;
    }, isLink(e) {
      return (e & 61440) === 40960;
    }, isChrdev(e) {
      return (e & 61440) === 8192;
    }, isBlkdev(e) {
      return (e & 61440) === 24576;
    }, isFIFO(e) {
      return (e & 61440) === 4096;
    }, isSocket(e) {
      return (e & 49152) === 49152;
    }, flagsToPermissionString(e) {
      var t = ["r", "w", "rw"][e & 3];
      return e & 512 && (t += "w"), t;
    }, nodePermissions(e, t) {
      return FS.ignorePermissions ? 0 : t.includes("r") && !(e.mode & 292) || t.includes("w") && !(e.mode & 146) || t.includes("x") && !(e.mode & 73) ? 2 : 0;
    }, mayLookup(e) {
      if (!FS.isDir(e.mode)) return 54;
      var t = FS.nodePermissions(e, "x");
      return t || (e.node_ops.lookup ? 0 : 2);
    }, mayCreate(e, t) {
      if (!FS.isDir(e.mode)) return 54;
      try {
        var r2 = FS.lookupNode(e, t);
        return 20;
      } catch {
      }
      return FS.nodePermissions(e, "wx");
    }, mayDelete(e, t, r2) {
      var a2;
      try {
        a2 = FS.lookupNode(e, t);
      } catch (s2) {
        return s2.errno;
      }
      var o2 = FS.nodePermissions(e, "wx");
      if (o2) return o2;
      if (r2) {
        if (!FS.isDir(a2.mode)) return 54;
        if (FS.isRoot(a2) || FS.getPath(a2) === FS.cwd()) return 10;
      } else if (FS.isDir(a2.mode)) return 31;
      return 0;
    }, mayOpen(e, t) {
      return e ? FS.isLink(e.mode) ? 32 : FS.isDir(e.mode) && (FS.flagsToPermissionString(t) !== "r" || t & 512) ? 31 : FS.nodePermissions(e, FS.flagsToPermissionString(t)) : 44;
    }, MAX_OPEN_FDS: 4096, nextfd() {
      for (var e = 0; e <= FS.MAX_OPEN_FDS; e++) if (!FS.streams[e]) return e;
      throw new FS.ErrnoError(33);
    }, getStreamChecked(e) {
      var t = FS.getStream(e);
      if (!t) throw new FS.ErrnoError(8);
      return t;
    }, getStream: (e) => FS.streams[e], createStream(e, t = -1) {
      return e = Object.assign(new FS.FSStream(), e), t == -1 && (t = FS.nextfd()), e.fd = t, FS.streams[t] = e, e;
    }, closeStream(e) {
      FS.streams[e] = null;
    }, dupStream(e, t = -1) {
      var r2 = FS.createStream(e, t);
      return r2.stream_ops?.dup?.(r2), r2;
    }, chrdev_stream_ops: { open(e) {
      var t = FS.getDevice(e.node.rdev);
      e.stream_ops = t.stream_ops, e.stream_ops.open?.(e);
    }, llseek() {
      throw new FS.ErrnoError(70);
    } }, major: (e) => e >> 8, minor: (e) => e & 255, makedev: (e, t) => e << 8 | t, registerDevice(e, t) {
      FS.devices[e] = { stream_ops: t };
    }, getDevice: (e) => FS.devices[e], getMounts(e) {
      for (var t = [], r2 = [e]; r2.length; ) {
        var a2 = r2.pop();
        t.push(a2), r2.push(...a2.mounts);
      }
      return t;
    }, syncfs(e, t) {
      typeof e == "function" && (t = e, e = false), FS.syncFSRequests++, FS.syncFSRequests > 1 && err(`warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
      var r2 = FS.getMounts(FS.root.mount), a2 = 0;
      function o2(l2) {
        return FS.syncFSRequests--, t(l2);
      }
      function s2(l2) {
        if (l2) return s2.errored ? void 0 : (s2.errored = true, o2(l2));
        ++a2 >= r2.length && o2(null);
      }
      r2.forEach((l2) => {
        if (!l2.type.syncfs) return s2(null);
        l2.type.syncfs(l2, e, s2);
      });
    }, mount(e, t, r2) {
      var a2 = r2 === "/", o2 = !r2, s2;
      if (a2 && FS.root) throw new FS.ErrnoError(10);
      if (!a2 && !o2) {
        var l2 = FS.lookupPath(r2, { follow_mount: false });
        if (r2 = l2.path, s2 = l2.node, FS.isMountpoint(s2)) throw new FS.ErrnoError(10);
        if (!FS.isDir(s2.mode)) throw new FS.ErrnoError(54);
      }
      var n2 = { type: e, opts: t, mountpoint: r2, mounts: [] }, _2 = e.mount(n2);
      return _2.mount = n2, n2.root = _2, a2 ? FS.root = _2 : s2 && (s2.mounted = n2, s2.mount && s2.mount.mounts.push(n2)), _2;
    }, unmount(e) {
      var t = FS.lookupPath(e, { follow_mount: false });
      if (!FS.isMountpoint(t.node)) throw new FS.ErrnoError(28);
      var r2 = t.node, a2 = r2.mounted, o2 = FS.getMounts(a2);
      Object.keys(FS.nameTable).forEach((l2) => {
        for (var n2 = FS.nameTable[l2]; n2; ) {
          var _2 = n2.name_next;
          o2.includes(n2.mount) && FS.destroyNode(n2), n2 = _2;
        }
      }), r2.mounted = null;
      var s2 = r2.mount.mounts.indexOf(a2);
      r2.mount.mounts.splice(s2, 1);
    }, lookup(e, t) {
      return e.node_ops.lookup(e, t);
    }, mknod(e, t, r2) {
      var a2 = FS.lookupPath(e, { parent: true }), o2 = a2.node, s2 = PATH.basename(e);
      if (!s2 || s2 === "." || s2 === "..") throw new FS.ErrnoError(28);
      var l2 = FS.mayCreate(o2, s2);
      if (l2) throw new FS.ErrnoError(l2);
      if (!o2.node_ops.mknod) throw new FS.ErrnoError(63);
      return o2.node_ops.mknod(o2, s2, t, r2);
    }, statfs(e) {
      var t = { bsize: 4096, frsize: 4096, blocks: 1e6, bfree: 5e5, bavail: 5e5, files: FS.nextInode, ffree: FS.nextInode - 1, fsid: 42, flags: 2, namelen: 255 }, r2 = FS.lookupPath(e, { follow: true }).node;
      return r2?.node_ops.statfs && Object.assign(t, r2.node_ops.statfs(r2.mount.opts.root)), t;
    }, create(e, t = 438) {
      return t &= 4095, t |= 32768, FS.mknod(e, t, 0);
    }, mkdir(e, t = 511) {
      return t &= 1023, t |= 16384, FS.mknod(e, t, 0);
    }, mkdirTree(e, t) {
      for (var r2 = e.split("/"), a2 = "", o2 = 0; o2 < r2.length; ++o2) if (r2[o2]) {
        a2 += "/" + r2[o2];
        try {
          FS.mkdir(a2, t);
        } catch (s2) {
          if (s2.errno != 20) throw s2;
        }
      }
    }, mkdev(e, t, r2) {
      return typeof r2 > "u" && (r2 = t, t = 438), t |= 8192, FS.mknod(e, t, r2);
    }, symlink(e, t) {
      if (!PATH_FS.resolve(e)) throw new FS.ErrnoError(44);
      var r2 = FS.lookupPath(t, { parent: true }), a2 = r2.node;
      if (!a2) throw new FS.ErrnoError(44);
      var o2 = PATH.basename(t), s2 = FS.mayCreate(a2, o2);
      if (s2) throw new FS.ErrnoError(s2);
      if (!a2.node_ops.symlink) throw new FS.ErrnoError(63);
      return a2.node_ops.symlink(a2, o2, e);
    }, rename(e, t) {
      var r2 = PATH.dirname(e), a2 = PATH.dirname(t), o2 = PATH.basename(e), s2 = PATH.basename(t), l2, n2, _2;
      if (l2 = FS.lookupPath(e, { parent: true }), n2 = l2.node, l2 = FS.lookupPath(t, { parent: true }), _2 = l2.node, !n2 || !_2) throw new FS.ErrnoError(44);
      if (n2.mount !== _2.mount) throw new FS.ErrnoError(75);
      var m2 = FS.lookupNode(n2, o2), p2 = PATH_FS.relative(e, a2);
      if (p2.charAt(0) !== ".") throw new FS.ErrnoError(28);
      if (p2 = PATH_FS.relative(t, r2), p2.charAt(0) !== ".") throw new FS.ErrnoError(55);
      var d2;
      try {
        d2 = FS.lookupNode(_2, s2);
      } catch {
      }
      if (m2 !== d2) {
        var g2 = FS.isDir(m2.mode), c2 = FS.mayDelete(n2, o2, g2);
        if (c2) throw new FS.ErrnoError(c2);
        if (c2 = d2 ? FS.mayDelete(_2, s2, g2) : FS.mayCreate(_2, s2), c2) throw new FS.ErrnoError(c2);
        if (!n2.node_ops.rename) throw new FS.ErrnoError(63);
        if (FS.isMountpoint(m2) || d2 && FS.isMountpoint(d2)) throw new FS.ErrnoError(10);
        if (_2 !== n2 && (c2 = FS.nodePermissions(n2, "w"), c2)) throw new FS.ErrnoError(c2);
        FS.hashRemoveNode(m2);
        try {
          n2.node_ops.rename(m2, _2, s2), m2.parent = _2;
        } catch (f2) {
          throw f2;
        } finally {
          FS.hashAddNode(m2);
        }
      }
    }, rmdir(e) {
      var t = FS.lookupPath(e, { parent: true }), r2 = t.node, a2 = PATH.basename(e), o2 = FS.lookupNode(r2, a2), s2 = FS.mayDelete(r2, a2, true);
      if (s2) throw new FS.ErrnoError(s2);
      if (!r2.node_ops.rmdir) throw new FS.ErrnoError(63);
      if (FS.isMountpoint(o2)) throw new FS.ErrnoError(10);
      r2.node_ops.rmdir(r2, a2), FS.destroyNode(o2);
    }, readdir(e) {
      var t = FS.lookupPath(e, { follow: true }), r2 = t.node;
      if (!r2.node_ops.readdir) throw new FS.ErrnoError(54);
      return r2.node_ops.readdir(r2);
    }, unlink(e) {
      var t = FS.lookupPath(e, { parent: true }), r2 = t.node;
      if (!r2) throw new FS.ErrnoError(44);
      var a2 = PATH.basename(e), o2 = FS.lookupNode(r2, a2), s2 = FS.mayDelete(r2, a2, false);
      if (s2) throw new FS.ErrnoError(s2);
      if (!r2.node_ops.unlink) throw new FS.ErrnoError(63);
      if (FS.isMountpoint(o2)) throw new FS.ErrnoError(10);
      r2.node_ops.unlink(r2, a2), FS.destroyNode(o2);
    }, readlink(e) {
      var t = FS.lookupPath(e), r2 = t.node;
      if (!r2) throw new FS.ErrnoError(44);
      if (!r2.node_ops.readlink) throw new FS.ErrnoError(28);
      return r2.node_ops.readlink(r2);
    }, stat(e, t) {
      var r2 = FS.lookupPath(e, { follow: !t }), a2 = r2.node;
      if (!a2) throw new FS.ErrnoError(44);
      if (!a2.node_ops.getattr) throw new FS.ErrnoError(63);
      return a2.node_ops.getattr(a2);
    }, lstat(e) {
      return FS.stat(e, true);
    }, chmod(e, t, r2) {
      var a2;
      if (typeof e == "string") {
        var o2 = FS.lookupPath(e, { follow: !r2 });
        a2 = o2.node;
      } else a2 = e;
      if (!a2.node_ops.setattr) throw new FS.ErrnoError(63);
      a2.node_ops.setattr(a2, { mode: t & 4095 | a2.mode & -4096, ctime: Date.now() });
    }, lchmod(e, t) {
      FS.chmod(e, t, true);
    }, fchmod(e, t) {
      var r2 = FS.getStreamChecked(e);
      FS.chmod(r2.node, t);
    }, chown(e, t, r2, a2) {
      var o2;
      if (typeof e == "string") {
        var s2 = FS.lookupPath(e, { follow: !a2 });
        o2 = s2.node;
      } else o2 = e;
      if (!o2.node_ops.setattr) throw new FS.ErrnoError(63);
      o2.node_ops.setattr(o2, { timestamp: Date.now() });
    }, lchown(e, t, r2) {
      FS.chown(e, t, r2, true);
    }, fchown(e, t, r2) {
      var a2 = FS.getStreamChecked(e);
      FS.chown(a2.node, t, r2);
    }, truncate(e, t) {
      if (t < 0) throw new FS.ErrnoError(28);
      var r2;
      if (typeof e == "string") {
        var a2 = FS.lookupPath(e, { follow: true });
        r2 = a2.node;
      } else r2 = e;
      if (!r2.node_ops.setattr) throw new FS.ErrnoError(63);
      if (FS.isDir(r2.mode)) throw new FS.ErrnoError(31);
      if (!FS.isFile(r2.mode)) throw new FS.ErrnoError(28);
      var o2 = FS.nodePermissions(r2, "w");
      if (o2) throw new FS.ErrnoError(o2);
      r2.node_ops.setattr(r2, { size: t, timestamp: Date.now() });
    }, ftruncate(e, t) {
      var r2 = FS.getStreamChecked(e);
      if (!(r2.flags & 2097155)) throw new FS.ErrnoError(28);
      FS.truncate(r2.node, t);
    }, utime(e, t, r2) {
      var a2 = FS.lookupPath(e, { follow: true }), o2 = a2.node;
      o2.node_ops.setattr(o2, { atime: t, mtime: r2 });
    }, open(e, t, r2 = 438) {
      if (e === "") throw new FS.ErrnoError(44);
      t = typeof t == "string" ? FS_modeStringToFlags(t) : t, t & 64 ? r2 = r2 & 4095 | 32768 : r2 = 0;
      var a2;
      if (typeof e == "object") a2 = e;
      else {
        var o2 = FS.lookupPath(e, { follow: !(t & 131072), noent_okay: true });
        a2 = o2.node, e = o2.path;
      }
      var s2 = false;
      if (t & 64) if (a2) {
        if (t & 128) throw new FS.ErrnoError(20);
      } else a2 = FS.mknod(e, r2, 0), s2 = true;
      if (!a2) throw new FS.ErrnoError(44);
      if (FS.isChrdev(a2.mode) && (t &= -513), t & 65536 && !FS.isDir(a2.mode)) throw new FS.ErrnoError(54);
      if (!s2) {
        var l2 = FS.mayOpen(a2, t);
        if (l2) throw new FS.ErrnoError(l2);
      }
      t & 512 && !s2 && FS.truncate(a2, 0), t &= -131713;
      var n2 = FS.createStream({ node: a2, path: FS.getPath(a2), flags: t, seekable: true, position: 0, stream_ops: a2.stream_ops, ungotten: [], error: false });
      return n2.stream_ops.open && n2.stream_ops.open(n2), Module.logReadFiles && !(t & 1) && (e in FS.readFiles || (FS.readFiles[e] = 1)), n2;
    }, close(e) {
      if (FS.isClosed(e)) throw new FS.ErrnoError(8);
      e.getdents && (e.getdents = null);
      try {
        e.stream_ops.close && e.stream_ops.close(e);
      } catch (t) {
        throw t;
      } finally {
        FS.closeStream(e.fd);
      }
      e.fd = null;
    }, isClosed(e) {
      return e.fd === null;
    }, llseek(e, t, r2) {
      if (FS.isClosed(e)) throw new FS.ErrnoError(8);
      if (!e.seekable || !e.stream_ops.llseek) throw new FS.ErrnoError(70);
      if (r2 != 0 && r2 != 1 && r2 != 2) throw new FS.ErrnoError(28);
      return e.position = e.stream_ops.llseek(e, t, r2), e.ungotten = [], e.position;
    }, read(e, t, r2, a2, o2) {
      if (a2 < 0 || o2 < 0) throw new FS.ErrnoError(28);
      if (FS.isClosed(e)) throw new FS.ErrnoError(8);
      if ((e.flags & 2097155) === 1) throw new FS.ErrnoError(8);
      if (FS.isDir(e.node.mode)) throw new FS.ErrnoError(31);
      if (!e.stream_ops.read) throw new FS.ErrnoError(28);
      var s2 = typeof o2 < "u";
      if (!s2) o2 = e.position;
      else if (!e.seekable) throw new FS.ErrnoError(70);
      var l2 = e.stream_ops.read(e, t, r2, a2, o2);
      return s2 || (e.position += l2), l2;
    }, write(e, t, r2, a2, o2, s2) {
      if (a2 < 0 || o2 < 0) throw new FS.ErrnoError(28);
      if (FS.isClosed(e)) throw new FS.ErrnoError(8);
      if (!(e.flags & 2097155)) throw new FS.ErrnoError(8);
      if (FS.isDir(e.node.mode)) throw new FS.ErrnoError(31);
      if (!e.stream_ops.write) throw new FS.ErrnoError(28);
      e.seekable && e.flags & 1024 && FS.llseek(e, 0, 2);
      var l2 = typeof o2 < "u";
      if (!l2) o2 = e.position;
      else if (!e.seekable) throw new FS.ErrnoError(70);
      var n2 = e.stream_ops.write(e, t, r2, a2, o2, s2);
      return l2 || (e.position += n2), n2;
    }, allocate(e, t, r2) {
      if (FS.isClosed(e)) throw new FS.ErrnoError(8);
      if (t < 0 || r2 <= 0) throw new FS.ErrnoError(28);
      if (!(e.flags & 2097155)) throw new FS.ErrnoError(8);
      if (!FS.isFile(e.node.mode) && !FS.isDir(e.node.mode)) throw new FS.ErrnoError(43);
      if (!e.stream_ops.allocate) throw new FS.ErrnoError(138);
      e.stream_ops.allocate(e, t, r2);
    }, mmap(e, t, r2, a2, o2) {
      if (a2 & 2 && !(o2 & 2) && (e.flags & 2097155) !== 2) throw new FS.ErrnoError(2);
      if ((e.flags & 2097155) === 1) throw new FS.ErrnoError(2);
      if (!e.stream_ops.mmap) throw new FS.ErrnoError(43);
      if (!t) throw new FS.ErrnoError(28);
      return e.stream_ops.mmap(e, t, r2, a2, o2);
    }, msync(e, t, r2, a2, o2) {
      return e.stream_ops.msync ? e.stream_ops.msync(e, t, r2, a2, o2) : 0;
    }, ioctl(e, t, r2) {
      if (!e.stream_ops.ioctl) throw new FS.ErrnoError(59);
      return e.stream_ops.ioctl(e, t, r2);
    }, readFile(e, t = {}) {
      if (t.flags = t.flags || 0, t.encoding = t.encoding || "binary", t.encoding !== "utf8" && t.encoding !== "binary") throw new Error(`Invalid encoding type "${t.encoding}"`);
      var r2, a2 = FS.open(e, t.flags), o2 = FS.stat(e), s2 = o2.size, l2 = new Uint8Array(s2);
      return FS.read(a2, l2, 0, s2, 0), t.encoding === "utf8" ? r2 = UTF8ArrayToString(l2) : t.encoding === "binary" && (r2 = l2), FS.close(a2), r2;
    }, writeFile(e, t, r2 = {}) {
      r2.flags = r2.flags || 577;
      var a2 = FS.open(e, r2.flags, r2.mode);
      if (typeof t == "string") {
        var o2 = new Uint8Array(lengthBytesUTF8(t) + 1), s2 = stringToUTF8Array(t, o2, 0, o2.length);
        FS.write(a2, o2, 0, s2, void 0, r2.canOwn);
      } else if (ArrayBuffer.isView(t)) FS.write(a2, t, 0, t.byteLength, void 0, r2.canOwn);
      else throw new Error("Unsupported data type");
      FS.close(a2);
    }, cwd: () => FS.currentPath, chdir(e) {
      var t = FS.lookupPath(e, { follow: true });
      if (t.node === null) throw new FS.ErrnoError(44);
      if (!FS.isDir(t.node.mode)) throw new FS.ErrnoError(54);
      var r2 = FS.nodePermissions(t.node, "x");
      if (r2) throw new FS.ErrnoError(r2);
      FS.currentPath = t.path;
    }, createDefaultDirectories() {
      FS.mkdir("/tmp"), FS.mkdir("/home"), FS.mkdir("/home/web_user");
    }, createDefaultDevices() {
      FS.mkdir("/dev"), FS.registerDevice(FS.makedev(1, 3), { read: () => 0, write: (a2, o2, s2, l2, n2) => l2, llseek: () => 0 }), FS.mkdev("/dev/null", FS.makedev(1, 3)), TTY.register(FS.makedev(5, 0), TTY.default_tty_ops), TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops), FS.mkdev("/dev/tty", FS.makedev(5, 0)), FS.mkdev("/dev/tty1", FS.makedev(6, 0));
      var e = new Uint8Array(1024), t = 0, r2 = () => (t === 0 && (t = randomFill(e).byteLength), e[--t]);
      FS.createDevice("/dev", "random", r2), FS.createDevice("/dev", "urandom", r2), FS.mkdir("/dev/shm"), FS.mkdir("/dev/shm/tmp");
    }, createSpecialDirectories() {
      FS.mkdir("/proc");
      var e = FS.mkdir("/proc/self");
      FS.mkdir("/proc/self/fd"), FS.mount({ mount() {
        var t = FS.createNode(e, "fd", 16895, 73);
        return t.stream_ops = { llseek: MEMFS.stream_ops.llseek }, t.node_ops = { lookup(r2, a2) {
          var o2 = +a2, s2 = FS.getStreamChecked(o2), l2 = { parent: null, mount: { mountpoint: "fake" }, node_ops: { readlink: () => s2.path }, id: o2 + 1 };
          return l2.parent = l2, l2;
        }, readdir() {
          return Array.from(FS.streams.entries()).filter(([r2, a2]) => a2).map(([r2, a2]) => r2.toString());
        } }, t;
      } }, {}, "/proc/self/fd");
    }, createStandardStreams(e, t, r2) {
      e ? FS.createDevice("/dev", "stdin", e) : FS.symlink("/dev/tty", "/dev/stdin"), t ? FS.createDevice("/dev", "stdout", null, t) : FS.symlink("/dev/tty", "/dev/stdout"), r2 ? FS.createDevice("/dev", "stderr", null, r2) : FS.symlink("/dev/tty1", "/dev/stderr");
      FS.open("/dev/stdin", 0);
      FS.open("/dev/stdout", 1);
      FS.open("/dev/stderr", 1);
    }, staticInit() {
      FS.nameTable = new Array(4096), FS.mount(MEMFS, {}, "/"), FS.createDefaultDirectories(), FS.createDefaultDevices(), FS.createSpecialDirectories(), FS.filesystems = { MEMFS, IDBFS, NODEFS };
    }, init(e, t, r2) {
      FS.initialized = true, e ?? (e = Module.stdin), t ?? (t = Module.stdout), r2 ?? (r2 = Module.stderr), FS.createStandardStreams(e, t, r2);
    }, quit() {
      FS.initialized = false, _fflush(0);
      for (var e = 0; e < FS.streams.length; e++) {
        var t = FS.streams[e];
        t && FS.close(t);
      }
    }, findObject(e, t) {
      var r2 = FS.analyzePath(e, t);
      return r2.exists ? r2.object : null;
    }, analyzePath(e, t) {
      try {
        var r2 = FS.lookupPath(e, { follow: !t });
        e = r2.path;
      } catch {
      }
      var a2 = { isRoot: false, exists: false, error: 0, name: null, path: null, object: null, parentExists: false, parentPath: null, parentObject: null };
      try {
        var r2 = FS.lookupPath(e, { parent: true });
        a2.parentExists = true, a2.parentPath = r2.path, a2.parentObject = r2.node, a2.name = PATH.basename(e), r2 = FS.lookupPath(e, { follow: !t }), a2.exists = true, a2.path = r2.path, a2.object = r2.node, a2.name = r2.node.name, a2.isRoot = r2.path === "/";
      } catch (o2) {
        a2.error = o2.errno;
      }
      return a2;
    }, createPath(e, t, r2, a2) {
      e = typeof e == "string" ? e : FS.getPath(e);
      for (var o2 = t.split("/").reverse(); o2.length; ) {
        var s2 = o2.pop();
        if (s2) {
          var l2 = PATH.join2(e, s2);
          try {
            FS.mkdir(l2);
          } catch {
          }
          e = l2;
        }
      }
      return l2;
    }, createFile(e, t, r2, a2, o2) {
      var s2 = PATH.join2(typeof e == "string" ? e : FS.getPath(e), t), l2 = FS_getMode(a2, o2);
      return FS.create(s2, l2);
    }, createDataFile(e, t, r2, a2, o2, s2) {
      var l2 = t;
      e && (e = typeof e == "string" ? e : FS.getPath(e), l2 = t ? PATH.join2(e, t) : e);
      var n2 = FS_getMode(a2, o2), _2 = FS.create(l2, n2);
      if (r2) {
        if (typeof r2 == "string") {
          for (var m2 = new Array(r2.length), p2 = 0, d2 = r2.length; p2 < d2; ++p2) m2[p2] = r2.charCodeAt(p2);
          r2 = m2;
        }
        FS.chmod(_2, n2 | 146);
        var g2 = FS.open(_2, 577);
        FS.write(g2, r2, 0, r2.length, 0, s2), FS.close(g2), FS.chmod(_2, n2);
      }
    }, createDevice(e, t, r2, a2) {
      var n2;
      var o2 = PATH.join2(typeof e == "string" ? e : FS.getPath(e), t), s2 = FS_getMode(!!r2, !!a2);
      (n2 = FS.createDevice).major ?? (n2.major = 64);
      var l2 = FS.makedev(FS.createDevice.major++, 0);
      return FS.registerDevice(l2, { open(_2) {
        _2.seekable = false;
      }, close(_2) {
        a2?.buffer?.length && a2(10);
      }, read(_2, m2, p2, d2, g2) {
        for (var c2 = 0, f2 = 0; f2 < d2; f2++) {
          var u2;
          try {
            u2 = r2();
          } catch {
            throw new FS.ErrnoError(29);
          }
          if (u2 === void 0 && c2 === 0) throw new FS.ErrnoError(6);
          if (u2 == null) break;
          c2++, m2[p2 + f2] = u2;
        }
        return c2 && (_2.node.atime = Date.now()), c2;
      }, write(_2, m2, p2, d2, g2) {
        for (var c2 = 0; c2 < d2; c2++) try {
          a2(m2[p2 + c2]);
        } catch {
          throw new FS.ErrnoError(29);
        }
        return d2 && (_2.node.mtime = _2.node.ctime = Date.now()), c2;
      } }), FS.mkdev(o2, s2, l2);
    }, forceLoadFile(e) {
      if (e.isDevice || e.isFolder || e.link || e.contents) return true;
      if (typeof XMLHttpRequest < "u") throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
      try {
        e.contents = readBinary(e.url), e.usedBytes = e.contents.length;
      } catch {
        throw new FS.ErrnoError(29);
      }
    }, createLazyFile(e, t, r2, a2, o2) {
      class s2 {
        constructor() {
          P$1(this, "lengthKnown", false);
          P$1(this, "chunks", []);
        }
        get(c2) {
          if (!(c2 > this.length - 1 || c2 < 0)) {
            var f2 = c2 % this.chunkSize, u2 = c2 / this.chunkSize | 0;
            return this.getter(u2)[f2];
          }
        }
        setDataGetter(c2) {
          this.getter = c2;
        }
        cacheLength() {
          var c2 = new XMLHttpRequest();
          if (c2.open("HEAD", r2, false), c2.send(null), !(c2.status >= 200 && c2.status < 300 || c2.status === 304)) throw new Error("Couldn't load " + r2 + ". Status: " + c2.status);
          var f2 = Number(c2.getResponseHeader("Content-length")), u2, w2 = (u2 = c2.getResponseHeader("Accept-Ranges")) && u2 === "bytes", h2 = (u2 = c2.getResponseHeader("Content-Encoding")) && u2 === "gzip", S2 = 1024 * 1024;
          w2 || (S2 = f2);
          var M2 = (x2, E2) => {
            if (x2 > E2) throw new Error("invalid range (" + x2 + ", " + E2 + ") or no bytes requested!");
            if (E2 > f2 - 1) throw new Error("only " + f2 + " bytes available! programmer error!");
            var b2 = new XMLHttpRequest();
            if (b2.open("GET", r2, false), f2 !== S2 && b2.setRequestHeader("Range", "bytes=" + x2 + "-" + E2), b2.responseType = "arraybuffer", b2.overrideMimeType && b2.overrideMimeType("text/plain; charset=x-user-defined"), b2.send(null), !(b2.status >= 200 && b2.status < 300 || b2.status === 304)) throw new Error("Couldn't load " + r2 + ". Status: " + b2.status);
            return b2.response !== void 0 ? new Uint8Array(b2.response || []) : intArrayFromString(b2.responseText || "");
          }, y2 = this;
          y2.setDataGetter((x2) => {
            var E2 = x2 * S2, b2 = (x2 + 1) * S2 - 1;
            if (b2 = Math.min(b2, f2 - 1), typeof y2.chunks[x2] > "u" && (y2.chunks[x2] = M2(E2, b2)), typeof y2.chunks[x2] > "u") throw new Error("doXHR failed!");
            return y2.chunks[x2];
          }), (h2 || !f2) && (S2 = f2 = 1, f2 = this.getter(0).length, S2 = f2, out("LazyFiles on gzip forces download of the whole file when length is accessed")), this._length = f2, this._chunkSize = S2, this.lengthKnown = true;
        }
        get length() {
          return this.lengthKnown || this.cacheLength(), this._length;
        }
        get chunkSize() {
          return this.lengthKnown || this.cacheLength(), this._chunkSize;
        }
      }
      if (typeof XMLHttpRequest < "u") {
        if (!ENVIRONMENT_IS_WORKER) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
        var l2 = new s2(), n2 = { isDevice: false, contents: l2 };
      } else var n2 = { isDevice: false, url: r2 };
      var _2 = FS.createFile(e, t, n2, a2, o2);
      n2.contents ? _2.contents = n2.contents : n2.url && (_2.contents = null, _2.url = n2.url), Object.defineProperties(_2, { usedBytes: { get: function() {
        return this.contents.length;
      } } });
      var m2 = {}, p2 = Object.keys(_2.stream_ops);
      p2.forEach((g2) => {
        var c2 = _2.stream_ops[g2];
        m2[g2] = (...f2) => (FS.forceLoadFile(_2), c2(...f2));
      });
      function d2(g2, c2, f2, u2, w2) {
        var h2 = g2.node.contents;
        if (w2 >= h2.length) return 0;
        var S2 = Math.min(h2.length - w2, u2);
        if (h2.slice) for (var M2 = 0; M2 < S2; M2++) c2[f2 + M2] = h2[w2 + M2];
        else for (var M2 = 0; M2 < S2; M2++) c2[f2 + M2] = h2.get(w2 + M2);
        return S2;
      }
      return m2.read = (g2, c2, f2, u2, w2) => (FS.forceLoadFile(_2), d2(g2, c2, f2, u2, w2)), m2.mmap = (g2, c2, f2, u2, w2) => {
        FS.forceLoadFile(_2);
        var h2 = mmapAlloc(c2);
        if (!h2) throw new FS.ErrnoError(48);
        return d2(g2, HEAP8, h2, c2, f2), { ptr: h2, allocated: true };
      }, _2.stream_ops = m2, _2;
    } }, SYSCALLS = { DEFAULT_POLLMASK: 5, calculateAt(e, t, r2) {
      if (PATH.isAbs(t)) return t;
      var a2;
      if (e === -100) a2 = FS.cwd();
      else {
        var o2 = SYSCALLS.getStreamFromFD(e);
        a2 = o2.path;
      }
      if (t.length == 0) {
        if (!r2) throw new FS.ErrnoError(44);
        return a2;
      }
      return a2 + "/" + t;
    }, doStat(e, t, r2) {
      var a2 = e(t);
      HEAP32[r2 >> 2] = a2.dev, HEAP32[r2 + 4 >> 2] = a2.mode, HEAPU32[r2 + 8 >> 2] = a2.nlink, HEAP32[r2 + 12 >> 2] = a2.uid, HEAP32[r2 + 16 >> 2] = a2.gid, HEAP32[r2 + 20 >> 2] = a2.rdev, HEAP64[r2 + 24 >> 3] = BigInt(a2.size), HEAP32[r2 + 32 >> 2] = 4096, HEAP32[r2 + 36 >> 2] = a2.blocks;
      var o2 = a2.atime.getTime(), s2 = a2.mtime.getTime(), l2 = a2.ctime.getTime();
      return HEAP64[r2 + 40 >> 3] = BigInt(Math.floor(o2 / 1e3)), HEAPU32[r2 + 48 >> 2] = o2 % 1e3 * 1e3 * 1e3, HEAP64[r2 + 56 >> 3] = BigInt(Math.floor(s2 / 1e3)), HEAPU32[r2 + 64 >> 2] = s2 % 1e3 * 1e3 * 1e3, HEAP64[r2 + 72 >> 3] = BigInt(Math.floor(l2 / 1e3)), HEAPU32[r2 + 80 >> 2] = l2 % 1e3 * 1e3 * 1e3, HEAP64[r2 + 88 >> 3] = BigInt(a2.ino), 0;
    }, doMsync(e, t, r2, a2, o2) {
      if (!FS.isFile(t.node.mode)) throw new FS.ErrnoError(43);
      if (a2 & 2) return 0;
      var s2 = HEAPU8.slice(e, e + r2);
      FS.msync(t, s2, o2, r2, a2);
    }, getStreamFromFD(e) {
      var t = FS.getStreamChecked(e);
      return t;
    }, varargs: void 0, getStr(e) {
      var t = UTF8ToString(e);
      return t;
    } }, ___syscall__newselect = function(e, t, r2, a2, o2) {
      try {
        for (var s2 = 0, l2 = t ? HEAP32[t >> 2] : 0, n2 = t ? HEAP32[t + 4 >> 2] : 0, _2 = r2 ? HEAP32[r2 >> 2] : 0, m2 = r2 ? HEAP32[r2 + 4 >> 2] : 0, p2 = a2 ? HEAP32[a2 >> 2] : 0, d2 = a2 ? HEAP32[a2 + 4 >> 2] : 0, g2 = 0, c2 = 0, f2 = 0, u2 = 0, w2 = 0, h2 = 0, S2 = (t ? HEAP32[t >> 2] : 0) | (r2 ? HEAP32[r2 >> 2] : 0) | (a2 ? HEAP32[a2 >> 2] : 0), M2 = (t ? HEAP32[t + 4 >> 2] : 0) | (r2 ? HEAP32[r2 + 4 >> 2] : 0) | (a2 ? HEAP32[a2 + 4 >> 2] : 0), y2 = (z3, P2, U2, A2) => z3 < 32 ? P2 & A2 : U2 & A2, x2 = 0; x2 < e; x2++) {
          var E2 = 1 << x2 % 32;
          if (y2(x2, S2, M2, E2)) {
            var b2 = SYSCALLS.getStreamFromFD(x2), T2 = SYSCALLS.DEFAULT_POLLMASK;
            if (b2.stream_ops.poll) {
              var D2 = -1;
              if (o2) {
                var X2 = t ? HEAP32[o2 >> 2] : 0, R3 = t ? HEAP32[o2 + 4 >> 2] : 0;
                D2 = (X2 + R3 / 1e6) * 1e3;
              }
              T2 = b2.stream_ops.poll(b2, D2);
            }
            T2 & 1 && y2(x2, l2, n2, E2) && (x2 < 32 ? g2 = g2 | E2 : c2 = c2 | E2, s2++), T2 & 4 && y2(x2, _2, m2, E2) && (x2 < 32 ? f2 = f2 | E2 : u2 = u2 | E2, s2++), T2 & 2 && y2(x2, p2, d2, E2) && (x2 < 32 ? w2 = w2 | E2 : h2 = h2 | E2, s2++);
          }
        }
        return t && (HEAP32[t >> 2] = g2, HEAP32[t + 4 >> 2] = c2), r2 && (HEAP32[r2 >> 2] = f2, HEAP32[r2 + 4 >> 2] = u2), a2 && (HEAP32[a2 >> 2] = w2, HEAP32[a2 + 4 >> 2] = h2), s2;
      } catch (z3) {
        if (typeof FS > "u" || z3.name !== "ErrnoError") throw z3;
        return -z3.errno;
      }
    };
    ___syscall__newselect.sig = "iipppp";
    var SOCKFS = { websocketArgs: {}, callbacks: {}, on(e, t) {
      SOCKFS.callbacks[e] = t;
    }, emit(e, t) {
      SOCKFS.callbacks[e]?.(t);
    }, mount(e) {
      return SOCKFS.websocketArgs = Module.websocket || {}, (Module.websocket ?? (Module.websocket = {})).on = SOCKFS.on, FS.createNode(null, "/", 16895, 0);
    }, createSocket(e, t, r2) {
      t &= -526337;
      var a2 = t == 1;
      if (a2 && r2 && r2 != 6) throw new FS.ErrnoError(66);
      var o2 = { family: e, type: t, protocol: r2, server: null, error: null, peers: {}, pending: [], recv_queue: [], sock_ops: SOCKFS.websocket_sock_ops }, s2 = SOCKFS.nextname(), l2 = FS.createNode(SOCKFS.root, s2, 49152, 0);
      l2.sock = o2;
      var n2 = FS.createStream({ path: s2, node: l2, flags: 2, seekable: false, stream_ops: SOCKFS.stream_ops });
      return o2.stream = n2, o2;
    }, getSocket(e) {
      var t = FS.getStream(e);
      return !t || !FS.isSocket(t.node.mode) ? null : t.node.sock;
    }, stream_ops: { poll(e) {
      var t = e.node.sock;
      return t.sock_ops.poll(t);
    }, ioctl(e, t, r2) {
      var a2 = e.node.sock;
      return a2.sock_ops.ioctl(a2, t, r2);
    }, read(e, t, r2, a2, o2) {
      var s2 = e.node.sock, l2 = s2.sock_ops.recvmsg(s2, a2);
      return l2 ? (t.set(l2.buffer, r2), l2.buffer.length) : 0;
    }, write(e, t, r2, a2, o2) {
      var s2 = e.node.sock;
      return s2.sock_ops.sendmsg(s2, t, r2, a2);
    }, close(e) {
      var t = e.node.sock;
      t.sock_ops.close(t);
    } }, nextname() {
      return SOCKFS.nextname.current || (SOCKFS.nextname.current = 0), `socket[${SOCKFS.nextname.current++}]`;
    }, websocket_sock_ops: { createPeer(e, t, r2) {
      var a2;
      if (typeof t == "object" && (a2 = t, t = null, r2 = null), a2) if (a2._socket) t = a2._socket.remoteAddress, r2 = a2._socket.remotePort;
      else {
        var o2 = /ws[s]?:\/\/([^:]+):(\d+)/.exec(a2.url);
        if (!o2) throw new Error("WebSocket URL must be in the format ws(s)://address:port");
        t = o2[1], r2 = parseInt(o2[2], 10);
      }
      else try {
        var s2 = "ws:#".replace("#", "//"), l2 = "binary", n2 = void 0;
        if (SOCKFS.websocketArgs.url && (s2 = SOCKFS.websocketArgs.url), SOCKFS.websocketArgs.subprotocol ? l2 = SOCKFS.websocketArgs.subprotocol : SOCKFS.websocketArgs.subprotocol === null && (l2 = "null"), s2 === "ws://" || s2 === "wss://") {
          var _2 = t.split("/");
          s2 = s2 + _2[0] + ":" + r2 + "/" + _2.slice(1).join("/");
        }
        l2 !== "null" && (l2 = l2.replace(/^ +| +$/g, "").split(/ *, */), n2 = l2);
        var m2;
        ENVIRONMENT_IS_NODE ? m2 = require("ws") : m2 = WebSocket, a2 = new m2(s2, n2), a2.binaryType = "arraybuffer";
      } catch {
        throw new FS.ErrnoError(23);
      }
      var p2 = { addr: t, port: r2, socket: a2, msg_send_queue: [] };
      return SOCKFS.websocket_sock_ops.addPeer(e, p2), SOCKFS.websocket_sock_ops.handlePeerEvents(e, p2), e.type === 2 && typeof e.sport < "u" && p2.msg_send_queue.push(new Uint8Array([255, 255, 255, 255, 112, 111, 114, 116, (e.sport & 65280) >> 8, e.sport & 255])), p2;
    }, getPeer(e, t, r2) {
      return e.peers[t + ":" + r2];
    }, addPeer(e, t) {
      e.peers[t.addr + ":" + t.port] = t;
    }, removePeer(e, t) {
      delete e.peers[t.addr + ":" + t.port];
    }, handlePeerEvents(e, t) {
      var r2 = true, a2 = function() {
        e.connecting = false, SOCKFS.emit("open", e.stream.fd);
        try {
          for (var s2 = t.msg_send_queue.shift(); s2; ) t.socket.send(s2), s2 = t.msg_send_queue.shift();
        } catch {
          t.socket.close();
        }
      };
      function o2(s2) {
        if (typeof s2 == "string") {
          var l2 = new TextEncoder();
          s2 = l2.encode(s2);
        } else {
          if (assert(s2.byteLength !== void 0), s2.byteLength == 0) return;
          s2 = new Uint8Array(s2);
        }
        var n2 = r2;
        if (r2 = false, n2 && s2.length === 10 && s2[0] === 255 && s2[1] === 255 && s2[2] === 255 && s2[3] === 255 && s2[4] === 112 && s2[5] === 111 && s2[6] === 114 && s2[7] === 116) {
          var _2 = s2[8] << 8 | s2[9];
          SOCKFS.websocket_sock_ops.removePeer(e, t), t.port = _2, SOCKFS.websocket_sock_ops.addPeer(e, t);
          return;
        }
        e.recv_queue.push({ addr: t.addr, port: t.port, data: s2 }), SOCKFS.emit("message", e.stream.fd);
      }
      ENVIRONMENT_IS_NODE ? (t.socket.on("open", a2), t.socket.on("message", function(s2, l2) {
        l2 && o2(new Uint8Array(s2).buffer);
      }), t.socket.on("close", function() {
        SOCKFS.emit("close", e.stream.fd);
      }), t.socket.on("error", function(s2) {
        e.error = 14, SOCKFS.emit("error", [e.stream.fd, e.error, "ECONNREFUSED: Connection refused"]);
      })) : (t.socket.onopen = a2, t.socket.onclose = function() {
        SOCKFS.emit("close", e.stream.fd);
      }, t.socket.onmessage = function(l2) {
        o2(l2.data);
      }, t.socket.onerror = function(s2) {
        e.error = 14, SOCKFS.emit("error", [e.stream.fd, e.error, "ECONNREFUSED: Connection refused"]);
      });
    }, poll(e) {
      if (e.type === 1 && e.server) return e.pending.length ? 65 : 0;
      var t = 0, r2 = e.type === 1 ? SOCKFS.websocket_sock_ops.getPeer(e, e.daddr, e.dport) : null;
      return (e.recv_queue.length || !r2 || r2 && r2.socket.readyState === r2.socket.CLOSING || r2 && r2.socket.readyState === r2.socket.CLOSED) && (t |= 65), (!r2 || r2 && r2.socket.readyState === r2.socket.OPEN) && (t |= 4), (r2 && r2.socket.readyState === r2.socket.CLOSING || r2 && r2.socket.readyState === r2.socket.CLOSED) && (e.connecting ? t |= 4 : t |= 16), t;
    }, ioctl(e, t, r2) {
      switch (t) {
        case 21531:
          var a2 = 0;
          return e.recv_queue.length && (a2 = e.recv_queue[0].data.length), HEAP32[r2 >> 2] = a2, 0;
        default:
          return 28;
      }
    }, close(e) {
      if (e.server) {
        try {
          e.server.close();
        } catch {
        }
        e.server = null;
      }
      for (var t = Object.keys(e.peers), r2 = 0; r2 < t.length; r2++) {
        var a2 = e.peers[t[r2]];
        try {
          a2.socket.close();
        } catch {
        }
        SOCKFS.websocket_sock_ops.removePeer(e, a2);
      }
      return 0;
    }, bind(e, t, r2) {
      if (typeof e.saddr < "u" || typeof e.sport < "u") throw new FS.ErrnoError(28);
      if (e.saddr = t, e.sport = r2, e.type === 2) {
        e.server && (e.server.close(), e.server = null);
        try {
          e.sock_ops.listen(e, 0);
        } catch (a2) {
          if (a2.name !== "ErrnoError" || a2.errno !== 138) throw a2;
        }
      }
    }, connect(e, t, r2) {
      if (e.server) throw new FS.ErrnoError(138);
      if (typeof e.daddr < "u" && typeof e.dport < "u") {
        var a2 = SOCKFS.websocket_sock_ops.getPeer(e, e.daddr, e.dport);
        if (a2) throw a2.socket.readyState === a2.socket.CONNECTING ? new FS.ErrnoError(7) : new FS.ErrnoError(30);
      }
      var o2 = SOCKFS.websocket_sock_ops.createPeer(e, t, r2);
      e.daddr = o2.addr, e.dport = o2.port, e.connecting = true;
    }, listen(e, t) {
      if (!ENVIRONMENT_IS_NODE) throw new FS.ErrnoError(138);
      if (e.server) throw new FS.ErrnoError(28);
      var r2 = require("ws").Server, a2 = e.saddr;
      e.server = new r2({ host: a2, port: e.sport }), SOCKFS.emit("listen", e.stream.fd), e.server.on("connection", function(o2) {
        if (e.type === 1) {
          var s2 = SOCKFS.createSocket(e.family, e.type, e.protocol), l2 = SOCKFS.websocket_sock_ops.createPeer(s2, o2);
          s2.daddr = l2.addr, s2.dport = l2.port, e.pending.push(s2), SOCKFS.emit("connection", s2.stream.fd);
        } else SOCKFS.websocket_sock_ops.createPeer(e, o2), SOCKFS.emit("connection", e.stream.fd);
      }), e.server.on("close", function() {
        SOCKFS.emit("close", e.stream.fd), e.server = null;
      }), e.server.on("error", function(o2) {
        e.error = 23, SOCKFS.emit("error", [e.stream.fd, e.error, "EHOSTUNREACH: Host is unreachable"]);
      });
    }, accept(e) {
      if (!e.server || !e.pending.length) throw new FS.ErrnoError(28);
      var t = e.pending.shift();
      return t.stream.flags = e.stream.flags, t;
    }, getname(e, t) {
      var r2, a2;
      if (t) {
        if (e.daddr === void 0 || e.dport === void 0) throw new FS.ErrnoError(53);
        r2 = e.daddr, a2 = e.dport;
      } else r2 = e.saddr || 0, a2 = e.sport || 0;
      return { addr: r2, port: a2 };
    }, sendmsg(e, t, r2, a2, o2, s2) {
      if (e.type === 2) {
        if ((o2 === void 0 || s2 === void 0) && (o2 = e.daddr, s2 = e.dport), o2 === void 0 || s2 === void 0) throw new FS.ErrnoError(17);
      } else o2 = e.daddr, s2 = e.dport;
      var l2 = SOCKFS.websocket_sock_ops.getPeer(e, o2, s2);
      if (e.type === 1 && (!l2 || l2.socket.readyState === l2.socket.CLOSING || l2.socket.readyState === l2.socket.CLOSED)) throw new FS.ErrnoError(53);
      ArrayBuffer.isView(t) && (r2 += t.byteOffset, t = t.buffer);
      var n2 = t.slice(r2, r2 + a2);
      if (!l2 || l2.socket.readyState !== l2.socket.OPEN) return e.type === 2 && (!l2 || l2.socket.readyState === l2.socket.CLOSING || l2.socket.readyState === l2.socket.CLOSED) && (l2 = SOCKFS.websocket_sock_ops.createPeer(e, o2, s2)), l2.msg_send_queue.push(n2), a2;
      try {
        return l2.socket.send(n2), a2;
      } catch {
        throw new FS.ErrnoError(28);
      }
    }, recvmsg(e, t) {
      if (e.type === 1 && e.server) throw new FS.ErrnoError(53);
      var r2 = e.recv_queue.shift();
      if (!r2) {
        if (e.type === 1) {
          var a2 = SOCKFS.websocket_sock_ops.getPeer(e, e.daddr, e.dport);
          if (!a2) throw new FS.ErrnoError(53);
          if (a2.socket.readyState === a2.socket.CLOSING || a2.socket.readyState === a2.socket.CLOSED) return null;
          throw new FS.ErrnoError(6);
        }
        throw new FS.ErrnoError(6);
      }
      var o2 = r2.data.byteLength || r2.data.length, s2 = r2.data.byteOffset || 0, l2 = r2.data.buffer || r2.data, n2 = Math.min(t, o2), _2 = { buffer: new Uint8Array(l2, s2, n2), addr: r2.addr, port: r2.port };
      if (e.type === 1 && n2 < o2) {
        var m2 = o2 - n2;
        r2.data = new Uint8Array(l2, s2 + n2, m2), e.recv_queue.unshift(r2);
      }
      return _2;
    } } }, getSocketFromFD = (e) => {
      var t = SOCKFS.getSocket(e);
      if (!t) throw new FS.ErrnoError(8);
      return t;
    }, inetNtop4 = (e) => (e & 255) + "." + (e >> 8 & 255) + "." + (e >> 16 & 255) + "." + (e >> 24 & 255), inetNtop6 = (e) => {
      var t = "", r2 = 0, a2 = 0, o2 = 0, s2 = 0, l2 = 0, n2 = 0, _2 = [e[0] & 65535, e[0] >> 16, e[1] & 65535, e[1] >> 16, e[2] & 65535, e[2] >> 16, e[3] & 65535, e[3] >> 16], m2 = true, p2 = "";
      for (n2 = 0; n2 < 5; n2++) if (_2[n2] !== 0) {
        m2 = false;
        break;
      }
      if (m2) {
        if (p2 = inetNtop4(_2[6] | _2[7] << 16), _2[5] === -1) return t = "::ffff:", t += p2, t;
        if (_2[5] === 0) return t = "::", p2 === "0.0.0.0" && (p2 = ""), p2 === "0.0.0.1" && (p2 = "1"), t += p2, t;
      }
      for (r2 = 0; r2 < 8; r2++) _2[r2] === 0 && (r2 - o2 > 1 && (l2 = 0), o2 = r2, l2++), l2 > a2 && (a2 = l2, s2 = r2 - a2 + 1);
      for (r2 = 0; r2 < 8; r2++) {
        if (a2 > 1 && _2[r2] === 0 && r2 >= s2 && r2 < s2 + a2) {
          r2 === s2 && (t += ":", s2 === 0 && (t += ":"));
          continue;
        }
        t += Number(_ntohs(_2[r2] & 65535)).toString(16), t += r2 < 7 ? ":" : "";
      }
      return t;
    }, readSockaddr = (e, t) => {
      var r2 = HEAP16[e >> 1], a2 = _ntohs(HEAPU16[e + 2 >> 1]), o2;
      switch (r2) {
        case 2:
          if (t !== 16) return { errno: 28 };
          o2 = HEAP32[e + 4 >> 2], o2 = inetNtop4(o2);
          break;
        case 10:
          if (t !== 28) return { errno: 28 };
          o2 = [HEAP32[e + 8 >> 2], HEAP32[e + 12 >> 2], HEAP32[e + 16 >> 2], HEAP32[e + 20 >> 2]], o2 = inetNtop6(o2);
          break;
        default:
          return { errno: 5 };
      }
      return { family: r2, addr: o2, port: a2 };
    }, inetPton4 = (e) => {
      for (var t = e.split("."), r2 = 0; r2 < 4; r2++) {
        var a2 = Number(t[r2]);
        if (isNaN(a2)) return null;
        t[r2] = a2;
      }
      return (t[0] | t[1] << 8 | t[2] << 16 | t[3] << 24) >>> 0;
    }, jstoi_q = (e) => parseInt(e), inetPton6 = (e) => {
      var t, r2, a2, o2, s2 = /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i, l2 = [];
      if (!s2.test(e)) return null;
      if (e === "::") return [0, 0, 0, 0, 0, 0, 0, 0];
      for (e.startsWith("::") ? e = e.replace("::", "Z:") : e = e.replace("::", ":Z:"), e.indexOf(".") > 0 ? (e = e.replace(new RegExp("[.]", "g"), ":"), t = e.split(":"), t[t.length - 4] = jstoi_q(t[t.length - 4]) + jstoi_q(t[t.length - 3]) * 256, t[t.length - 3] = jstoi_q(t[t.length - 2]) + jstoi_q(t[t.length - 1]) * 256, t = t.slice(0, t.length - 2)) : t = e.split(":"), a2 = 0, o2 = 0, r2 = 0; r2 < t.length; r2++) if (typeof t[r2] == "string") if (t[r2] === "Z") {
        for (o2 = 0; o2 < 8 - t.length + 1; o2++) l2[r2 + o2] = 0;
        a2 = o2 - 1;
      } else l2[r2 + a2] = _htons(parseInt(t[r2], 16));
      else l2[r2 + a2] = t[r2];
      return [l2[1] << 16 | l2[0], l2[3] << 16 | l2[2], l2[5] << 16 | l2[4], l2[7] << 16 | l2[6]];
    }, DNS = { address_map: { id: 1, addrs: {}, names: {} }, lookup_name(e) {
      var t = inetPton4(e);
      if (t !== null || (t = inetPton6(e), t !== null)) return e;
      var r2;
      if (DNS.address_map.addrs[e]) r2 = DNS.address_map.addrs[e];
      else {
        var a2 = DNS.address_map.id++;
        assert(a2 < 65535, "exceeded max address mappings of 65535"), r2 = "172.29." + (a2 & 255) + "." + (a2 & 65280), DNS.address_map.names[r2] = e, DNS.address_map.addrs[e] = r2;
      }
      return r2;
    }, lookup_addr(e) {
      return DNS.address_map.names[e] ? DNS.address_map.names[e] : null;
    } }, getSocketAddress = (e, t) => {
      var r2 = readSockaddr(e, t);
      if (r2.errno) throw new FS.ErrnoError(r2.errno);
      return r2.addr = DNS.lookup_addr(r2.addr) || r2.addr, r2;
    };
    function ___syscall_bind(e, t, r2, a2, o2, s2) {
      try {
        var l2 = getSocketFromFD(e), n2 = getSocketAddress(t, r2);
        return l2.sock_ops.bind(l2, n2.addr, n2.port), 0;
      } catch (_2) {
        if (typeof FS > "u" || _2.name !== "ErrnoError") throw _2;
        return -_2.errno;
      }
    }
    ___syscall_bind.sig = "iippiii";
    function ___syscall_chdir(e) {
      try {
        return e = SYSCALLS.getStr(e), FS.chdir(e), 0;
      } catch (t) {
        if (typeof FS > "u" || t.name !== "ErrnoError") throw t;
        return -t.errno;
      }
    }
    ___syscall_chdir.sig = "ip";
    function ___syscall_chmod(e, t) {
      try {
        return e = SYSCALLS.getStr(e), FS.chmod(e, t), 0;
      } catch (r2) {
        if (typeof FS > "u" || r2.name !== "ErrnoError") throw r2;
        return -r2.errno;
      }
    }
    ___syscall_chmod.sig = "ipi";
    function ___syscall_connect(e, t, r2, a2, o2, s2) {
      try {
        var l2 = getSocketFromFD(e), n2 = getSocketAddress(t, r2);
        return l2.sock_ops.connect(l2, n2.addr, n2.port), 0;
      } catch (_2) {
        if (typeof FS > "u" || _2.name !== "ErrnoError") throw _2;
        return -_2.errno;
      }
    }
    ___syscall_connect.sig = "iippiii";
    function ___syscall_dup(e) {
      try {
        var t = SYSCALLS.getStreamFromFD(e);
        return FS.dupStream(t).fd;
      } catch (r2) {
        if (typeof FS > "u" || r2.name !== "ErrnoError") throw r2;
        return -r2.errno;
      }
    }
    ___syscall_dup.sig = "ii";
    function ___syscall_dup3(e, t, r2) {
      try {
        var a2 = SYSCALLS.getStreamFromFD(e);
        if (a2.fd === t) return -28;
        if (t < 0 || t >= FS.MAX_OPEN_FDS) return -8;
        var o2 = FS.getStream(t);
        return o2 && FS.close(o2), FS.dupStream(a2, t).fd;
      } catch (s2) {
        if (typeof FS > "u" || s2.name !== "ErrnoError") throw s2;
        return -s2.errno;
      }
    }
    ___syscall_dup3.sig = "iiii";
    function ___syscall_faccessat(e, t, r2, a2) {
      try {
        if (t = SYSCALLS.getStr(t), t = SYSCALLS.calculateAt(e, t), r2 & -8) return -28;
        var o2 = FS.lookupPath(t, { follow: true }), s2 = o2.node;
        if (!s2) return -44;
        var l2 = "";
        return r2 & 4 && (l2 += "r"), r2 & 2 && (l2 += "w"), r2 & 1 && (l2 += "x"), l2 && FS.nodePermissions(s2, l2) ? -2 : 0;
      } catch (n2) {
        if (typeof FS > "u" || n2.name !== "ErrnoError") throw n2;
        return -n2.errno;
      }
    }
    ___syscall_faccessat.sig = "iipii";
    var ___syscall_fadvise64 = (e, t, r2, a2) => 0;
    ___syscall_fadvise64.sig = "iijji";
    var INT53_MAX = 9007199254740992, INT53_MIN = -9007199254740992, bigintToI53Checked = (e) => e < INT53_MIN || e > INT53_MAX ? NaN : Number(e);
    function ___syscall_fallocate(e, t, r2, a2) {
      r2 = bigintToI53Checked(r2), a2 = bigintToI53Checked(a2);
      try {
        if (isNaN(r2)) return 61;
        var o2 = SYSCALLS.getStreamFromFD(e);
        return FS.allocate(o2, r2, a2), 0;
      } catch (s2) {
        if (typeof FS > "u" || s2.name !== "ErrnoError") throw s2;
        return -s2.errno;
      }
    }
    ___syscall_fallocate.sig = "iiijj";
    var syscallGetVarargI = () => {
      var e = HEAP32[+SYSCALLS.varargs >> 2];
      return SYSCALLS.varargs += 4, e;
    }, syscallGetVarargP = syscallGetVarargI;
    function ___syscall_fcntl64(e, t, r2) {
      SYSCALLS.varargs = r2;
      try {
        var a2 = SYSCALLS.getStreamFromFD(e);
        switch (t) {
          case 0: {
            var o2 = syscallGetVarargI();
            if (o2 < 0) return -28;
            for (; FS.streams[o2]; ) o2++;
            var s2;
            return s2 = FS.dupStream(a2, o2), s2.fd;
          }
          case 1:
          case 2:
            return 0;
          case 3:
            return a2.flags;
          case 4: {
            var o2 = syscallGetVarargI();
            return a2.flags |= o2, 0;
          }
          case 12: {
            var o2 = syscallGetVarargP(), l2 = 0;
            return HEAP16[o2 + l2 >> 1] = 2, 0;
          }
          case 13:
          case 14:
            return 0;
        }
        return -28;
      } catch (n2) {
        if (typeof FS > "u" || n2.name !== "ErrnoError") throw n2;
        return -n2.errno;
      }
    }
    ___syscall_fcntl64.sig = "iiip";
    function ___syscall_fdatasync(e) {
      try {
        var t = SYSCALLS.getStreamFromFD(e);
        return 0;
      } catch (r2) {
        if (typeof FS > "u" || r2.name !== "ErrnoError") throw r2;
        return -r2.errno;
      }
    }
    ___syscall_fdatasync.sig = "ii";
    function ___syscall_fstat64(e, t) {
      try {
        var r2 = SYSCALLS.getStreamFromFD(e);
        return SYSCALLS.doStat(FS.stat, r2.path, t);
      } catch (a2) {
        if (typeof FS > "u" || a2.name !== "ErrnoError") throw a2;
        return -a2.errno;
      }
    }
    ___syscall_fstat64.sig = "iip";
    function ___syscall_ftruncate64(e, t) {
      t = bigintToI53Checked(t);
      try {
        return isNaN(t) ? 61 : (FS.ftruncate(e, t), 0);
      } catch (r2) {
        if (typeof FS > "u" || r2.name !== "ErrnoError") throw r2;
        return -r2.errno;
      }
    }
    ___syscall_ftruncate64.sig = "iij";
    var stringToUTF8 = (e, t, r2) => stringToUTF8Array(e, HEAPU8, t, r2);
    function ___syscall_getcwd(e, t) {
      try {
        if (t === 0) return -28;
        var r2 = FS.cwd(), a2 = lengthBytesUTF8(r2) + 1;
        return t < a2 ? -68 : (stringToUTF8(r2, e, t), a2);
      } catch (o2) {
        if (typeof FS > "u" || o2.name !== "ErrnoError") throw o2;
        return -o2.errno;
      }
    }
    ___syscall_getcwd.sig = "ipp";
    function ___syscall_getdents64(e, t, r2) {
      try {
        var a2 = SYSCALLS.getStreamFromFD(e);
        a2.getdents || (a2.getdents = FS.readdir(a2.path));
        for (var o2 = 280, s2 = 0, l2 = FS.llseek(a2, 0, 1), n2 = Math.floor(l2 / o2), _2 = Math.min(a2.getdents.length, n2 + Math.floor(r2 / o2)), m2 = n2; m2 < _2; m2++) {
          var p2, d2, g2 = a2.getdents[m2];
          if (g2 === ".") p2 = a2.node.id, d2 = 4;
          else if (g2 === "..") {
            var c2 = FS.lookupPath(a2.path, { parent: true });
            p2 = c2.node.id, d2 = 4;
          } else {
            var f2;
            try {
              f2 = FS.lookupNode(a2.node, g2);
            } catch (u2) {
              if (u2?.errno === 28) continue;
              throw u2;
            }
            p2 = f2.id, d2 = FS.isChrdev(f2.mode) ? 2 : FS.isDir(f2.mode) ? 4 : FS.isLink(f2.mode) ? 10 : 8;
          }
          HEAP64[t + s2 >> 3] = BigInt(p2), HEAP64[t + s2 + 8 >> 3] = BigInt((m2 + 1) * o2), HEAP16[t + s2 + 16 >> 1] = 280, HEAP8[t + s2 + 18] = d2, stringToUTF8(g2, t + s2 + 19, 256), s2 += o2;
        }
        return FS.llseek(a2, m2 * o2, 0), s2;
      } catch (u2) {
        if (typeof FS > "u" || u2.name !== "ErrnoError") throw u2;
        return -u2.errno;
      }
    }
    ___syscall_getdents64.sig = "iipp";
    var writeSockaddr = (e, t, r2, a2, o2) => {
      switch (t) {
        case 2:
          r2 = inetPton4(r2), zeroMemory(e, 16), o2 && (HEAP32[o2 >> 2] = 16), HEAP16[e >> 1] = t, HEAP32[e + 4 >> 2] = r2, HEAP16[e + 2 >> 1] = _htons(a2);
          break;
        case 10:
          r2 = inetPton6(r2), zeroMemory(e, 28), o2 && (HEAP32[o2 >> 2] = 28), HEAP32[e >> 2] = t, HEAP32[e + 8 >> 2] = r2[0], HEAP32[e + 12 >> 2] = r2[1], HEAP32[e + 16 >> 2] = r2[2], HEAP32[e + 20 >> 2] = r2[3], HEAP16[e + 2 >> 1] = _htons(a2);
          break;
        default:
          return 5;
      }
      return 0;
    };
    function ___syscall_getsockname(e, t, r2, a2, o2, s2) {
      try {
        var l2 = getSocketFromFD(e), n2 = writeSockaddr(t, l2.family, DNS.lookup_name(l2.saddr || "0.0.0.0"), l2.sport, r2);
        return 0;
      } catch (_2) {
        if (typeof FS > "u" || _2.name !== "ErrnoError") throw _2;
        return -_2.errno;
      }
    }
    ___syscall_getsockname.sig = "iippiii";
    function ___syscall_getsockopt(e, t, r2, a2, o2, s2) {
      try {
        var l2 = getSocketFromFD(e);
        return t === 1 && r2 === 4 ? (HEAP32[a2 >> 2] = l2.error, HEAP32[o2 >> 2] = 4, l2.error = null, 0) : -50;
      } catch (n2) {
        if (typeof FS > "u" || n2.name !== "ErrnoError") throw n2;
        return -n2.errno;
      }
    }
    ___syscall_getsockopt.sig = "iiiippi";
    function ___syscall_ioctl(e, t, r2) {
      SYSCALLS.varargs = r2;
      try {
        var a2 = SYSCALLS.getStreamFromFD(e);
        switch (t) {
          case 21509:
            return a2.tty ? 0 : -59;
          case 21505: {
            if (!a2.tty) return -59;
            if (a2.tty.ops.ioctl_tcgets) {
              var o2 = a2.tty.ops.ioctl_tcgets(a2), s2 = syscallGetVarargP();
              HEAP32[s2 >> 2] = o2.c_iflag || 0, HEAP32[s2 + 4 >> 2] = o2.c_oflag || 0, HEAP32[s2 + 8 >> 2] = o2.c_cflag || 0, HEAP32[s2 + 12 >> 2] = o2.c_lflag || 0;
              for (var l2 = 0; l2 < 32; l2++) HEAP8[s2 + l2 + 17] = o2.c_cc[l2] || 0;
              return 0;
            }
            return 0;
          }
          case 21510:
          case 21511:
          case 21512:
            return a2.tty ? 0 : -59;
          case 21506:
          case 21507:
          case 21508: {
            if (!a2.tty) return -59;
            if (a2.tty.ops.ioctl_tcsets) {
              for (var s2 = syscallGetVarargP(), n2 = HEAP32[s2 >> 2], _2 = HEAP32[s2 + 4 >> 2], m2 = HEAP32[s2 + 8 >> 2], p2 = HEAP32[s2 + 12 >> 2], d2 = [], l2 = 0; l2 < 32; l2++) d2.push(HEAP8[s2 + l2 + 17]);
              return a2.tty.ops.ioctl_tcsets(a2.tty, t, { c_iflag: n2, c_oflag: _2, c_cflag: m2, c_lflag: p2, c_cc: d2 });
            }
            return 0;
          }
          case 21519: {
            if (!a2.tty) return -59;
            var s2 = syscallGetVarargP();
            return HEAP32[s2 >> 2] = 0, 0;
          }
          case 21520:
            return a2.tty ? -28 : -59;
          case 21531: {
            var s2 = syscallGetVarargP();
            return FS.ioctl(a2, t, s2);
          }
          case 21523: {
            if (!a2.tty) return -59;
            if (a2.tty.ops.ioctl_tiocgwinsz) {
              var g2 = a2.tty.ops.ioctl_tiocgwinsz(a2.tty), s2 = syscallGetVarargP();
              HEAP16[s2 >> 1] = g2[0], HEAP16[s2 + 2 >> 1] = g2[1];
            }
            return 0;
          }
          case 21524:
            return a2.tty ? 0 : -59;
          case 21515:
            return a2.tty ? 0 : -59;
          default:
            return -28;
        }
      } catch (c2) {
        if (typeof FS > "u" || c2.name !== "ErrnoError") throw c2;
        return -c2.errno;
      }
    }
    ___syscall_ioctl.sig = "iiip";
    function ___syscall_lstat64(e, t) {
      try {
        return e = SYSCALLS.getStr(e), SYSCALLS.doStat(FS.lstat, e, t);
      } catch (r2) {
        if (typeof FS > "u" || r2.name !== "ErrnoError") throw r2;
        return -r2.errno;
      }
    }
    ___syscall_lstat64.sig = "ipp";
    function ___syscall_mkdirat(e, t, r2) {
      try {
        return t = SYSCALLS.getStr(t), t = SYSCALLS.calculateAt(e, t), FS.mkdir(t, r2, 0), 0;
      } catch (a2) {
        if (typeof FS > "u" || a2.name !== "ErrnoError") throw a2;
        return -a2.errno;
      }
    }
    ___syscall_mkdirat.sig = "iipi";
    function ___syscall_newfstatat(e, t, r2, a2) {
      try {
        t = SYSCALLS.getStr(t);
        var o2 = a2 & 256, s2 = a2 & 4096;
        return a2 = a2 & -6401, t = SYSCALLS.calculateAt(e, t, s2), SYSCALLS.doStat(o2 ? FS.lstat : FS.stat, t, r2);
      } catch (l2) {
        if (typeof FS > "u" || l2.name !== "ErrnoError") throw l2;
        return -l2.errno;
      }
    }
    ___syscall_newfstatat.sig = "iippi";
    function ___syscall_openat(e, t, r2, a2) {
      SYSCALLS.varargs = a2;
      try {
        t = SYSCALLS.getStr(t), t = SYSCALLS.calculateAt(e, t);
        var o2 = a2 ? syscallGetVarargI() : 0;
        return FS.open(t, r2, o2).fd;
      } catch (s2) {
        if (typeof FS > "u" || s2.name !== "ErrnoError") throw s2;
        return -s2.errno;
      }
    }
    ___syscall_openat.sig = "iipip";
    var PIPEFS = { BUCKET_BUFFER_SIZE: 8192, mount(e) {
      return FS.createNode(null, "/", 16895, 0);
    }, createPipe() {
      var e = { buckets: [], refcnt: 2 };
      e.buckets.push({ buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE), offset: 0, roffset: 0 });
      var t = PIPEFS.nextname(), r2 = PIPEFS.nextname(), a2 = FS.createNode(PIPEFS.root, t, 4096, 0), o2 = FS.createNode(PIPEFS.root, r2, 4096, 0);
      a2.pipe = e, o2.pipe = e;
      var s2 = FS.createStream({ path: t, node: a2, flags: 0, seekable: false, stream_ops: PIPEFS.stream_ops });
      a2.stream = s2;
      var l2 = FS.createStream({ path: r2, node: o2, flags: 1, seekable: false, stream_ops: PIPEFS.stream_ops });
      return o2.stream = l2, { readable_fd: s2.fd, writable_fd: l2.fd };
    }, stream_ops: { poll(e) {
      var t = e.node.pipe;
      if ((e.flags & 2097155) === 1) return 260;
      if (t.buckets.length > 0) for (var r2 = 0; r2 < t.buckets.length; r2++) {
        var a2 = t.buckets[r2];
        if (a2.offset - a2.roffset > 0) return 65;
      }
      return 0;
    }, ioctl(e, t, r2) {
      return 28;
    }, fsync(e) {
      return 28;
    }, read(e, t, r2, a2, o2) {
      for (var s2 = e.node.pipe, l2 = 0, n2 = 0; n2 < s2.buckets.length; n2++) {
        var _2 = s2.buckets[n2];
        l2 += _2.offset - _2.roffset;
      }
      var m2 = t.subarray(r2, r2 + a2);
      if (a2 <= 0) return 0;
      if (l2 == 0) throw new FS.ErrnoError(6);
      for (var p2 = Math.min(l2, a2), d2 = p2, g2 = 0, n2 = 0; n2 < s2.buckets.length; n2++) {
        var c2 = s2.buckets[n2], f2 = c2.offset - c2.roffset;
        if (p2 <= f2) {
          var u2 = c2.buffer.subarray(c2.roffset, c2.offset);
          p2 < f2 ? (u2 = u2.subarray(0, p2), c2.roffset += p2) : g2++, m2.set(u2);
          break;
        } else {
          var u2 = c2.buffer.subarray(c2.roffset, c2.offset);
          m2.set(u2), m2 = m2.subarray(u2.byteLength), p2 -= u2.byteLength, g2++;
        }
      }
      return g2 && g2 == s2.buckets.length && (g2--, s2.buckets[g2].offset = 0, s2.buckets[g2].roffset = 0), s2.buckets.splice(0, g2), d2;
    }, write(e, t, r2, a2, o2) {
      var s2 = e.node.pipe, l2 = t.subarray(r2, r2 + a2), n2 = l2.byteLength;
      if (n2 <= 0) return 0;
      var _2 = null;
      s2.buckets.length == 0 ? (_2 = { buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE), offset: 0, roffset: 0 }, s2.buckets.push(_2)) : _2 = s2.buckets[s2.buckets.length - 1], assert(_2.offset <= PIPEFS.BUCKET_BUFFER_SIZE);
      var m2 = PIPEFS.BUCKET_BUFFER_SIZE - _2.offset;
      if (m2 >= n2) return _2.buffer.set(l2, _2.offset), _2.offset += n2, n2;
      m2 > 0 && (_2.buffer.set(l2.subarray(0, m2), _2.offset), _2.offset += m2, l2 = l2.subarray(m2, l2.byteLength));
      for (var p2 = l2.byteLength / PIPEFS.BUCKET_BUFFER_SIZE | 0, d2 = l2.byteLength % PIPEFS.BUCKET_BUFFER_SIZE, g2 = 0; g2 < p2; g2++) {
        var c2 = { buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE), offset: PIPEFS.BUCKET_BUFFER_SIZE, roffset: 0 };
        s2.buckets.push(c2), c2.buffer.set(l2.subarray(0, PIPEFS.BUCKET_BUFFER_SIZE)), l2 = l2.subarray(PIPEFS.BUCKET_BUFFER_SIZE, l2.byteLength);
      }
      if (d2 > 0) {
        var c2 = { buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE), offset: l2.byteLength, roffset: 0 };
        s2.buckets.push(c2), c2.buffer.set(l2);
      }
      return n2;
    }, close(e) {
      var t = e.node.pipe;
      t.refcnt--, t.refcnt === 0 && (t.buckets = null);
    } }, nextname() {
      return PIPEFS.nextname.current || (PIPEFS.nextname.current = 0), "pipe[" + PIPEFS.nextname.current++ + "]";
    } };
    function ___syscall_pipe(e) {
      try {
        if (e == 0) throw new FS.ErrnoError(21);
        var t = PIPEFS.createPipe();
        return HEAP32[e >> 2] = t.readable_fd, HEAP32[e + 4 >> 2] = t.writable_fd, 0;
      } catch (r2) {
        if (typeof FS > "u" || r2.name !== "ErrnoError") throw r2;
        return -r2.errno;
      }
    }
    ___syscall_pipe.sig = "ip";
    function ___syscall_poll(e, t, r2) {
      try {
        for (var a2 = 0, o2 = 0; o2 < t; o2++) {
          var s2 = e + 8 * o2, l2 = HEAP32[s2 >> 2], n2 = HEAP16[s2 + 4 >> 1], _2 = 32, m2 = FS.getStream(l2);
          m2 && (_2 = SYSCALLS.DEFAULT_POLLMASK, m2.stream_ops.poll && (_2 = m2.stream_ops.poll(m2, -1))), _2 &= n2 | 8 | 16, _2 && a2++, HEAP16[s2 + 6 >> 1] = _2;
        }
        return a2;
      } catch (p2) {
        if (typeof FS > "u" || p2.name !== "ErrnoError") throw p2;
        return -p2.errno;
      }
    }
    ___syscall_poll.sig = "ipii";
    function ___syscall_readlinkat(e, t, r2, a2) {
      try {
        if (t = SYSCALLS.getStr(t), t = SYSCALLS.calculateAt(e, t), a2 <= 0) return -28;
        var o2 = FS.readlink(t), s2 = Math.min(a2, lengthBytesUTF8(o2)), l2 = HEAP8[r2 + s2];
        return stringToUTF8(o2, r2, a2 + 1), HEAP8[r2 + s2] = l2, s2;
      } catch (n2) {
        if (typeof FS > "u" || n2.name !== "ErrnoError") throw n2;
        return -n2.errno;
      }
    }
    ___syscall_readlinkat.sig = "iippp";
    function ___syscall_recvfrom(e, t, r2, a2, o2, s2) {
      try {
        var l2 = getSocketFromFD(e), n2 = l2.sock_ops.recvmsg(l2, r2);
        if (!n2) return 0;
        if (o2) var _2 = writeSockaddr(o2, l2.family, DNS.lookup_name(n2.addr), n2.port, s2);
        return HEAPU8.set(n2.buffer, t), n2.buffer.byteLength;
      } catch (m2) {
        if (typeof FS > "u" || m2.name !== "ErrnoError") throw m2;
        return -m2.errno;
      }
    }
    ___syscall_recvfrom.sig = "iippipp";
    function ___syscall_renameat(e, t, r2, a2) {
      try {
        return t = SYSCALLS.getStr(t), a2 = SYSCALLS.getStr(a2), t = SYSCALLS.calculateAt(e, t), a2 = SYSCALLS.calculateAt(r2, a2), FS.rename(t, a2), 0;
      } catch (o2) {
        if (typeof FS > "u" || o2.name !== "ErrnoError") throw o2;
        return -o2.errno;
      }
    }
    ___syscall_renameat.sig = "iipip";
    function ___syscall_rmdir(e) {
      try {
        return e = SYSCALLS.getStr(e), FS.rmdir(e), 0;
      } catch (t) {
        if (typeof FS > "u" || t.name !== "ErrnoError") throw t;
        return -t.errno;
      }
    }
    ___syscall_rmdir.sig = "ip";
    function ___syscall_sendto(e, t, r2, a2, o2, s2) {
      try {
        var l2 = getSocketFromFD(e);
        if (!o2) return FS.write(l2.stream, HEAP8, t, r2);
        var n2 = getSocketAddress(o2, s2);
        return l2.sock_ops.sendmsg(l2, HEAP8, t, r2, n2.addr, n2.port);
      } catch (_2) {
        if (typeof FS > "u" || _2.name !== "ErrnoError") throw _2;
        return -_2.errno;
      }
    }
    ___syscall_sendto.sig = "iippipp";
    function ___syscall_socket(e, t, r2) {
      try {
        var a2 = SOCKFS.createSocket(e, t, r2);
        return a2.stream.fd;
      } catch (o2) {
        if (typeof FS > "u" || o2.name !== "ErrnoError") throw o2;
        return -o2.errno;
      }
    }
    ___syscall_socket.sig = "iiiiiii";
    function ___syscall_stat64(e, t) {
      try {
        return e = SYSCALLS.getStr(e), SYSCALLS.doStat(FS.stat, e, t);
      } catch (r2) {
        if (typeof FS > "u" || r2.name !== "ErrnoError") throw r2;
        return -r2.errno;
      }
    }
    ___syscall_stat64.sig = "ipp";
    function ___syscall_symlinkat(e, t, r2) {
      try {
        return e = SYSCALLS.getStr(e), r2 = SYSCALLS.getStr(r2), r2 = SYSCALLS.calculateAt(t, r2), FS.symlink(e, r2), 0;
      } catch (a2) {
        if (typeof FS > "u" || a2.name !== "ErrnoError") throw a2;
        return -a2.errno;
      }
    }
    ___syscall_symlinkat.sig = "ipip";
    function ___syscall_truncate64(e, t) {
      t = bigintToI53Checked(t);
      try {
        return isNaN(t) ? 61 : (e = SYSCALLS.getStr(e), FS.truncate(e, t), 0);
      } catch (r2) {
        if (typeof FS > "u" || r2.name !== "ErrnoError") throw r2;
        return -r2.errno;
      }
    }
    ___syscall_truncate64.sig = "ipj";
    function ___syscall_unlinkat(e, t, r2) {
      try {
        return t = SYSCALLS.getStr(t), t = SYSCALLS.calculateAt(e, t), r2 === 0 ? FS.unlink(t) : r2 === 512 ? FS.rmdir(t) : abort("Invalid flags passed to unlinkat"), 0;
      } catch (a2) {
        if (typeof FS > "u" || a2.name !== "ErrnoError") throw a2;
        return -a2.errno;
      }
    }
    ___syscall_unlinkat.sig = "iipi";
    var ___table_base = new WebAssembly.Global({ value: "i32", mutable: false }, 1), __abort_js = () => abort("");
    __abort_js.sig = "v";
    var ENV = {}, stackAlloc = (e) => __emscripten_stack_alloc(e), stringToUTF8OnStack = (e) => {
      var t = lengthBytesUTF8(e) + 1, r2 = stackAlloc(t);
      return stringToUTF8(e, r2, t), r2;
    }, dlSetError = (e) => {
      var t = stackSave(), r2 = stringToUTF8OnStack(e);
      ___dl_seterr(r2, 0), stackRestore(t);
    }, dlopenInternal = (e, t) => {
      var r2 = UTF8ToString(e + 36), a2 = HEAP32[e + 4 >> 2];
      r2 = PATH.normalize(r2);
      var o2 = !!(a2 & 256), s2 = o2 ? null : {}, l2 = { global: o2, nodelete: !!(a2 & 4096), loadAsync: t.loadAsync };
      try {
        return loadDynamicLibrary(r2, l2, s2, e);
      } catch (n2) {
        return dlSetError(`Could not load dynamic lib: ${r2}
${n2}`), 0;
      }
    }, __dlopen_js = (e) => dlopenInternal(e, { loadAsync: false });
    __dlopen_js.sig = "pp";
    var __dlsym_js = (e, t, r2) => {
      t = UTF8ToString(t);
      var a2, o2, s2 = LDSO.loadedLibsByHandle[e];
      if (!s2.exports.hasOwnProperty(t) || s2.exports[t].stub) return dlSetError(`Tried to lookup unknown symbol "${t}" in dynamic lib: ${s2.name}`), 0;
      if (o2 = Object.keys(s2.exports).indexOf(t), a2 = s2.exports[t], typeof a2 == "function") {
        var l2 = getFunctionAddress(a2);
        l2 ? a2 = l2 : (a2 = addFunction(a2, a2.sig), HEAPU32[r2 >> 2] = o2);
      }
      return a2;
    };
    __dlsym_js.sig = "pppp";
    var __emscripten_memcpy_js = (e, t, r2) => HEAPU8.copyWithin(e, t, t + r2);
    __emscripten_memcpy_js.sig = "vppp";
    var runtimeKeepaliveCounter = 0, __emscripten_runtime_keepalive_clear = () => {
      noExitRuntime = false, runtimeKeepaliveCounter = 0;
    };
    __emscripten_runtime_keepalive_clear.sig = "v";
    var __emscripten_system = (e) => {
      if (ENVIRONMENT_IS_NODE) {
        if (!e) return 1;
        var t = UTF8ToString(e);
        if (!t.length) return 0;
        var r2 = require("child_process"), a2 = r2.spawnSync(t, [], { shell: true, stdio: "inherit" }), o2 = (l2, n2) => l2 << 8 | n2;
        if (a2.status === null) {
          var s2 = (l2) => {
            switch (l2) {
              case "SIGHUP":
                return 1;
              case "SIGQUIT":
                return 3;
              case "SIGFPE":
                return 8;
              case "SIGKILL":
                return 9;
              case "SIGALRM":
                return 14;
              case "SIGTERM":
                return 15;
              default:
                return 2;
            }
          };
          return o2(0, s2(a2.signal));
        }
        return o2(a2.status, 0);
      }
      return e ? -52 : 0;
    };
    __emscripten_system.sig = "ip";
    var __emscripten_throw_longjmp = () => {
      throw 1 / 0;
    };
    __emscripten_throw_longjmp.sig = "v";
    function __gmtime_js(e, t) {
      e = bigintToI53Checked(e);
      var r2 = new Date(e * 1e3);
      HEAP32[t >> 2] = r2.getUTCSeconds(), HEAP32[t + 4 >> 2] = r2.getUTCMinutes(), HEAP32[t + 8 >> 2] = r2.getUTCHours(), HEAP32[t + 12 >> 2] = r2.getUTCDate(), HEAP32[t + 16 >> 2] = r2.getUTCMonth(), HEAP32[t + 20 >> 2] = r2.getUTCFullYear() - 1900, HEAP32[t + 24 >> 2] = r2.getUTCDay();
      var a2 = Date.UTC(r2.getUTCFullYear(), 0, 1, 0, 0, 0, 0), o2 = (r2.getTime() - a2) / (1e3 * 60 * 60 * 24) | 0;
      HEAP32[t + 28 >> 2] = o2;
    }
    __gmtime_js.sig = "vjp";
    var isLeapYear = (e) => e % 4 === 0 && (e % 100 !== 0 || e % 400 === 0), MONTH_DAYS_LEAP_CUMULATIVE = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335], MONTH_DAYS_REGULAR_CUMULATIVE = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334], ydayFromDate = (e) => {
      var t = isLeapYear(e.getFullYear()), r2 = t ? MONTH_DAYS_LEAP_CUMULATIVE : MONTH_DAYS_REGULAR_CUMULATIVE, a2 = r2[e.getMonth()] + e.getDate() - 1;
      return a2;
    };
    function __localtime_js(e, t) {
      e = bigintToI53Checked(e);
      var r2 = new Date(e * 1e3);
      HEAP32[t >> 2] = r2.getSeconds(), HEAP32[t + 4 >> 2] = r2.getMinutes(), HEAP32[t + 8 >> 2] = r2.getHours(), HEAP32[t + 12 >> 2] = r2.getDate(), HEAP32[t + 16 >> 2] = r2.getMonth(), HEAP32[t + 20 >> 2] = r2.getFullYear() - 1900, HEAP32[t + 24 >> 2] = r2.getDay();
      var a2 = ydayFromDate(r2) | 0;
      HEAP32[t + 28 >> 2] = a2, HEAP32[t + 36 >> 2] = -(r2.getTimezoneOffset() * 60);
      var o2 = new Date(r2.getFullYear(), 0, 1), s2 = new Date(r2.getFullYear(), 6, 1).getTimezoneOffset(), l2 = o2.getTimezoneOffset(), n2 = (s2 != l2 && r2.getTimezoneOffset() == Math.min(l2, s2)) | 0;
      HEAP32[t + 32 >> 2] = n2;
    }
    __localtime_js.sig = "vjp";
    function __mmap_js(e, t, r2, a2, o2, s2, l2) {
      o2 = bigintToI53Checked(o2);
      try {
        if (isNaN(o2)) return 61;
        var n2 = SYSCALLS.getStreamFromFD(a2), _2 = FS.mmap(n2, e, o2, t, r2), m2 = _2.ptr;
        return HEAP32[s2 >> 2] = _2.allocated, HEAPU32[l2 >> 2] = m2, 0;
      } catch (p2) {
        if (typeof FS > "u" || p2.name !== "ErrnoError") throw p2;
        return -p2.errno;
      }
    }
    __mmap_js.sig = "ipiiijpp";
    function __munmap_js(e, t, r2, a2, o2, s2) {
      s2 = bigintToI53Checked(s2);
      try {
        var l2 = SYSCALLS.getStreamFromFD(o2);
        r2 & 2 && SYSCALLS.doMsync(e, l2, t, a2, s2);
      } catch (n2) {
        if (typeof FS > "u" || n2.name !== "ErrnoError") throw n2;
        return -n2.errno;
      }
    }
    __munmap_js.sig = "ippiiij";
    var timers = {}, handleException = (e) => {
      if (e instanceof ExitStatus || e == "unwind") return EXITSTATUS;
      quit_(1, e);
    }, keepRuntimeAlive = () => noExitRuntime || runtimeKeepaliveCounter > 0, _proc_exit = (e) => {
      EXITSTATUS = e, keepRuntimeAlive() || (Module.onExit?.(e), ABORT = true), quit_(e, new ExitStatus(e));
    };
    _proc_exit.sig = "vi";
    var exitJS = (e, t) => {
      EXITSTATUS = e, _proc_exit(e);
    }, _exit = exitJS;
    _exit.sig = "vi";
    var maybeExit = () => {
      if (!keepRuntimeAlive()) try {
        _exit(EXITSTATUS);
      } catch (e) {
        handleException(e);
      }
    }, callUserCallback = (e) => {
      if (!ABORT) try {
        e(), maybeExit();
      } catch (t) {
        handleException(t);
      }
    }, _emscripten_get_now = () => performance.now();
    _emscripten_get_now.sig = "d";
    var __setitimer_js = (e, t) => {
      if (timers[e] && (clearTimeout(timers[e].id), delete timers[e]), !t) return 0;
      var r2 = setTimeout(() => {
        delete timers[e], callUserCallback(() => __emscripten_timeout(e, _emscripten_get_now()));
      }, t);
      return timers[e] = { id: r2, timeout_ms: t }, 0;
    };
    __setitimer_js.sig = "iid";
    var __tzset_js = (e, t, r2, a2) => {
      var o2 = (/* @__PURE__ */ new Date()).getFullYear(), s2 = new Date(o2, 0, 1), l2 = new Date(o2, 6, 1), n2 = s2.getTimezoneOffset(), _2 = l2.getTimezoneOffset(), m2 = Math.max(n2, _2);
      HEAPU32[e >> 2] = m2 * 60, HEAP32[t >> 2] = +(n2 != _2);
      var p2 = (c2) => {
        var f2 = c2 >= 0 ? "-" : "+", u2 = Math.abs(c2), w2 = String(Math.floor(u2 / 60)).padStart(2, "0"), h2 = String(u2 % 60).padStart(2, "0");
        return `UTC${f2}${w2}${h2}`;
      }, d2 = p2(n2), g2 = p2(_2);
      _2 < n2 ? (stringToUTF8(d2, r2, 17), stringToUTF8(g2, a2, 17)) : (stringToUTF8(d2, a2, 17), stringToUTF8(g2, r2, 17));
    };
    __tzset_js.sig = "vpppp";
    var _emscripten_date_now = () => Date.now();
    _emscripten_date_now.sig = "d";
    var checkWasiClock = (e) => e >= 0 && e <= 3;
    function _clock_time_get(e, t, r2) {
      if (!checkWasiClock(e)) return 28;
      var a2;
      if (e === 0) a2 = _emscripten_date_now();
      else a2 = _emscripten_get_now();
      var o2 = Math.round(a2 * 1e3 * 1e3);
      return HEAP64[r2 >> 3] = BigInt(o2), 0;
    }
    _clock_time_get.sig = "iijp";
    var readEmAsmArgsArray = [], readEmAsmArgs = (e, t) => {
      readEmAsmArgsArray.length = 0;
      for (var r2; r2 = HEAPU8[e++]; ) {
        var a2 = r2 != 105;
        a2 &= r2 != 112, t += a2 && t % 8 ? 4 : 0, readEmAsmArgsArray.push(r2 == 112 ? HEAPU32[t >> 2] : r2 == 106 ? HEAP64[t >> 3] : r2 == 105 ? HEAP32[t >> 2] : HEAPF64[t >> 3]), t += a2 ? 8 : 4;
      }
      return readEmAsmArgsArray;
    }, runEmAsmFunction = (e, t, r2) => {
      var a2 = readEmAsmArgs(t, r2);
      return ASM_CONSTS[e](...a2);
    }, _emscripten_asm_const_int = (e, t, r2) => runEmAsmFunction(e, t, r2);
    _emscripten_asm_const_int.sig = "ippp";
    var _emscripten_force_exit = (e) => {
      __emscripten_runtime_keepalive_clear(), _exit(e);
    };
    _emscripten_force_exit.sig = "vi";
    var getHeapMax = () => 2147483648, growMemory = (e) => {
      var t = wasmMemory.buffer, r2 = (e - t.byteLength + 65535) / 65536 | 0;
      try {
        return wasmMemory.grow(r2), updateMemoryViews(), 1;
      } catch {
      }
    }, _emscripten_resize_heap = (e) => {
      var t = HEAPU8.length;
      e >>>= 0;
      var r2 = getHeapMax();
      if (e > r2) return false;
      for (var a2 = 1; a2 <= 4; a2 *= 2) {
        var o2 = t * (1 + 0.2 / a2);
        o2 = Math.min(o2, e + 100663296);
        var s2 = Math.min(r2, alignMemory(Math.max(e, o2), 65536)), l2 = growMemory(s2);
        if (l2) return true;
      }
      return false;
    };
    _emscripten_resize_heap.sig = "ip";
    var _emscripten_set_main_loop_timing = (e, t) => {
      if (MainLoop.timingMode = e, MainLoop.timingValue = t, !MainLoop.func) return 1;
      if (MainLoop.running || (MainLoop.running = true), e == 0) MainLoop.scheduler = function() {
        var l2 = Math.max(0, MainLoop.tickStartTime + t - _emscripten_get_now()) | 0;
        setTimeout(MainLoop.runner, l2);
      }, MainLoop.method = "timeout";
      else if (e == 1) MainLoop.scheduler = function() {
        MainLoop.requestAnimationFrame(MainLoop.runner);
      }, MainLoop.method = "rAF";
      else if (e == 2) {
        if (typeof MainLoop.setImmediate > "u") if (typeof setImmediate > "u") {
          var r2 = [], a2 = "setimmediate", o2 = (s2) => {
            (s2.data === a2 || s2.data.target === a2) && (s2.stopPropagation(), r2.shift()());
          };
          addEventListener("message", o2, true), MainLoop.setImmediate = (s2) => {
            r2.push(s2), ENVIRONMENT_IS_WORKER ? (Module.setImmediates ?? (Module.setImmediates = []), Module.setImmediates.push(s2), postMessage({ target: a2 })) : postMessage(a2, "*");
          };
        } else MainLoop.setImmediate = setImmediate;
        MainLoop.scheduler = function() {
          MainLoop.setImmediate(MainLoop.runner);
        }, MainLoop.method = "immediate";
      }
      return 0;
    };
    _emscripten_set_main_loop_timing.sig = "iii";
    var MainLoop = { running: false, scheduler: null, method: "", currentlyRunningMainloop: 0, func: null, arg: 0, timingMode: 0, timingValue: 0, currentFrameNumber: 0, queue: [], preMainLoop: [], postMainLoop: [], pause() {
      MainLoop.scheduler = null, MainLoop.currentlyRunningMainloop++;
    }, resume() {
      MainLoop.currentlyRunningMainloop++;
      var e = MainLoop.timingMode, t = MainLoop.timingValue, r2 = MainLoop.func;
      MainLoop.func = null, setMainLoop(r2, 0, false, MainLoop.arg, true), _emscripten_set_main_loop_timing(e, t), MainLoop.scheduler();
    }, updateStatus() {
      if (Module.setStatus) {
        var e = Module.statusMessage || "Please wait...", t = MainLoop.remainingBlockers ?? 0, r2 = MainLoop.expectedBlockers ?? 0;
        t ? t < r2 ? Module.setStatus("{message} ({expected - remaining}/{expected})") : Module.setStatus(e) : Module.setStatus("");
      }
    }, init() {
      Module.preMainLoop && MainLoop.preMainLoop.push(Module.preMainLoop), Module.postMainLoop && MainLoop.postMainLoop.push(Module.postMainLoop);
    }, runIter(e) {
      if (!ABORT) {
        for (var t of MainLoop.preMainLoop) if (t() === false) return;
        callUserCallback(e);
        for (var r2 of MainLoop.postMainLoop) r2();
      }
    }, nextRAF: 0, fakeRequestAnimationFrame(e) {
      var t = Date.now();
      if (MainLoop.nextRAF === 0) MainLoop.nextRAF = t + 1e3 / 60;
      else for (; t + 2 >= MainLoop.nextRAF; ) MainLoop.nextRAF += 1e3 / 60;
      var r2 = Math.max(MainLoop.nextRAF - t, 0);
      setTimeout(e, r2);
    }, requestAnimationFrame(e) {
      if (typeof requestAnimationFrame == "function") {
        requestAnimationFrame(e);
        return;
      }
      var t = MainLoop.fakeRequestAnimationFrame;
      t(e);
    } }, setMainLoop = (e, t, r2, a2, o2) => {
      MainLoop.func = e, MainLoop.arg = a2;
      var s2 = MainLoop.currentlyRunningMainloop;
      function l2() {
        return s2 < MainLoop.currentlyRunningMainloop ? (maybeExit(), false) : true;
      }
      if (MainLoop.running = false, MainLoop.runner = function() {
        if (!ABORT) {
          if (MainLoop.queue.length > 0) {
            var m2 = MainLoop.queue.shift();
            if (m2.func(m2.arg), MainLoop.remainingBlockers) {
              var p2 = MainLoop.remainingBlockers, d2 = p2 % 1 == 0 ? p2 - 1 : Math.floor(p2);
              m2.counted ? MainLoop.remainingBlockers = d2 : (d2 = d2 + 0.5, MainLoop.remainingBlockers = (8 * p2 + d2) / 9);
            }
            if (MainLoop.updateStatus(), !l2()) return;
            setTimeout(MainLoop.runner, 0);
            return;
          }
          if (l2()) {
            if (MainLoop.currentFrameNumber = MainLoop.currentFrameNumber + 1 | 0, MainLoop.timingMode == 1 && MainLoop.timingValue > 1 && MainLoop.currentFrameNumber % MainLoop.timingValue != 0) {
              MainLoop.scheduler();
              return;
            } else MainLoop.timingMode == 0 && (MainLoop.tickStartTime = _emscripten_get_now());
            MainLoop.runIter(e), l2() && MainLoop.scheduler();
          }
        }
      }, o2 || (t && t > 0 ? _emscripten_set_main_loop_timing(0, 1e3 / t) : _emscripten_set_main_loop_timing(1, 1), MainLoop.scheduler()), r2) throw "unwind";
    }, _emscripten_set_main_loop = (e, t, r2) => {
      var a2 = getWasmTableEntry(e);
      setMainLoop(a2, t, r2);
    };
    _emscripten_set_main_loop.sig = "vpii";
    var getExecutableName = () => thisProgram || "./this.program", getEnvStrings = () => {
      if (!getEnvStrings.strings) {
        var e = (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8", t = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: e, _: getExecutableName() };
        for (var r2 in ENV) ENV[r2] === void 0 ? delete t[r2] : t[r2] = ENV[r2];
        var a2 = [];
        for (var r2 in t) a2.push(`${r2}=${t[r2]}`);
        getEnvStrings.strings = a2;
      }
      return getEnvStrings.strings;
    }, stringToAscii = (e, t) => {
      for (var r2 = 0; r2 < e.length; ++r2) HEAP8[t++] = e.charCodeAt(r2);
      HEAP8[t] = 0;
    }, _environ_get = (e, t) => {
      var r2 = 0;
      return getEnvStrings().forEach((a2, o2) => {
        var s2 = t + r2;
        HEAPU32[e + o2 * 4 >> 2] = s2, stringToAscii(a2, s2), r2 += a2.length + 1;
      }), 0;
    };
    _environ_get.sig = "ipp";
    var _environ_sizes_get = (e, t) => {
      var r2 = getEnvStrings();
      HEAPU32[e >> 2] = r2.length;
      var a2 = 0;
      return r2.forEach((o2) => a2 += o2.length + 1), HEAPU32[t >> 2] = a2, 0;
    };
    _environ_sizes_get.sig = "ipp";
    function _fd_close(e) {
      try {
        var t = SYSCALLS.getStreamFromFD(e);
        return FS.close(t), 0;
      } catch (r2) {
        if (typeof FS > "u" || r2.name !== "ErrnoError") throw r2;
        return r2.errno;
      }
    }
    _fd_close.sig = "ii";
    function _fd_fdstat_get(e, t) {
      try {
        var r2 = 0, a2 = 0, o2 = 0, s2 = SYSCALLS.getStreamFromFD(e), l2 = s2.tty ? 2 : FS.isDir(s2.mode) ? 3 : FS.isLink(s2.mode) ? 7 : 4;
        return HEAP8[t] = l2, HEAP16[t + 2 >> 1] = o2, HEAP64[t + 8 >> 3] = BigInt(r2), HEAP64[t + 16 >> 3] = BigInt(a2), 0;
      } catch (n2) {
        if (typeof FS > "u" || n2.name !== "ErrnoError") throw n2;
        return n2.errno;
      }
    }
    _fd_fdstat_get.sig = "iip";
    var doReadv = (e, t, r2, a2) => {
      for (var o2 = 0, s2 = 0; s2 < r2; s2++) {
        var l2 = HEAPU32[t >> 2], n2 = HEAPU32[t + 4 >> 2];
        t += 8;
        var _2 = FS.read(e, HEAP8, l2, n2, a2);
        if (_2 < 0) return -1;
        if (o2 += _2, _2 < n2) break;
        typeof a2 < "u" && (a2 += _2);
      }
      return o2;
    };
    function _fd_pread(e, t, r2, a2, o2) {
      a2 = bigintToI53Checked(a2);
      try {
        if (isNaN(a2)) return 61;
        var s2 = SYSCALLS.getStreamFromFD(e), l2 = doReadv(s2, t, r2, a2);
        return HEAPU32[o2 >> 2] = l2, 0;
      } catch (n2) {
        if (typeof FS > "u" || n2.name !== "ErrnoError") throw n2;
        return n2.errno;
      }
    }
    _fd_pread.sig = "iippjp";
    var doWritev = (e, t, r2, a2) => {
      for (var o2 = 0, s2 = 0; s2 < r2; s2++) {
        var l2 = HEAPU32[t >> 2], n2 = HEAPU32[t + 4 >> 2];
        t += 8;
        var _2 = FS.write(e, HEAP8, l2, n2, a2);
        if (_2 < 0) return -1;
        if (o2 += _2, _2 < n2) break;
        typeof a2 < "u" && (a2 += _2);
      }
      return o2;
    };
    function _fd_pwrite(e, t, r2, a2, o2) {
      a2 = bigintToI53Checked(a2);
      try {
        if (isNaN(a2)) return 61;
        var s2 = SYSCALLS.getStreamFromFD(e), l2 = doWritev(s2, t, r2, a2);
        return HEAPU32[o2 >> 2] = l2, 0;
      } catch (n2) {
        if (typeof FS > "u" || n2.name !== "ErrnoError") throw n2;
        return n2.errno;
      }
    }
    _fd_pwrite.sig = "iippjp";
    function _fd_read(e, t, r2, a2) {
      try {
        var o2 = SYSCALLS.getStreamFromFD(e), s2 = doReadv(o2, t, r2);
        return HEAPU32[a2 >> 2] = s2, 0;
      } catch (l2) {
        if (typeof FS > "u" || l2.name !== "ErrnoError") throw l2;
        return l2.errno;
      }
    }
    _fd_read.sig = "iippp";
    function _fd_seek(e, t, r2, a2) {
      t = bigintToI53Checked(t);
      try {
        if (isNaN(t)) return 61;
        var o2 = SYSCALLS.getStreamFromFD(e);
        return FS.llseek(o2, t, r2), HEAP64[a2 >> 3] = BigInt(o2.position), o2.getdents && t === 0 && r2 === 0 && (o2.getdents = null), 0;
      } catch (s2) {
        if (typeof FS > "u" || s2.name !== "ErrnoError") throw s2;
        return s2.errno;
      }
    }
    _fd_seek.sig = "iijip";
    function _fd_sync(e) {
      try {
        var t = SYSCALLS.getStreamFromFD(e);
        return t.stream_ops?.fsync ? t.stream_ops.fsync(t) : 0;
      } catch (r2) {
        if (typeof FS > "u" || r2.name !== "ErrnoError") throw r2;
        return r2.errno;
      }
    }
    _fd_sync.sig = "ii";
    function _fd_write(e, t, r2, a2) {
      try {
        var o2 = SYSCALLS.getStreamFromFD(e), s2 = doWritev(o2, t, r2);
        return HEAPU32[a2 >> 2] = s2, 0;
      } catch (l2) {
        if (typeof FS > "u" || l2.name !== "ErrnoError") throw l2;
        return l2.errno;
      }
    }
    _fd_write.sig = "iippp";
    var _getaddrinfo = (e, t, r2, a2) => {
      var o2 = 0, s2 = 0, l2 = 0, n2 = 0, _2 = 0, m2 = 0, p2;
      function d2(g2, c2, f2, u2, w2, h2) {
        var S2, M2, y2, x2;
        return M2 = g2 === 10 ? 28 : 16, w2 = g2 === 10 ? inetNtop6(w2) : inetNtop4(w2), S2 = _malloc(M2), x2 = writeSockaddr(S2, g2, w2, h2), assert(!x2), y2 = _malloc(32), HEAP32[y2 + 4 >> 2] = g2, HEAP32[y2 + 8 >> 2] = c2, HEAP32[y2 + 12 >> 2] = f2, HEAPU32[y2 + 24 >> 2] = u2, HEAPU32[y2 + 20 >> 2] = S2, g2 === 10 ? HEAP32[y2 + 16 >> 2] = 28 : HEAP32[y2 + 16 >> 2] = 16, HEAP32[y2 + 28 >> 2] = 0, y2;
      }
      if (r2 && (l2 = HEAP32[r2 >> 2], n2 = HEAP32[r2 + 4 >> 2], _2 = HEAP32[r2 + 8 >> 2], m2 = HEAP32[r2 + 12 >> 2]), _2 && !m2 && (m2 = _2 === 2 ? 17 : 6), !_2 && m2 && (_2 = m2 === 17 ? 2 : 1), m2 === 0 && (m2 = 6), _2 === 0 && (_2 = 1), !e && !t) return -2;
      if (l2 & -1088 || r2 !== 0 && HEAP32[r2 >> 2] & 2 && !e) return -1;
      if (l2 & 32) return -2;
      if (_2 !== 0 && _2 !== 1 && _2 !== 2) return -7;
      if (n2 !== 0 && n2 !== 2 && n2 !== 10) return -6;
      if (t && (t = UTF8ToString(t), s2 = parseInt(t, 10), isNaN(s2))) return l2 & 1024 ? -2 : -8;
      if (!e) return n2 === 0 && (n2 = 2), l2 & 1 || (n2 === 2 ? o2 = _htonl(2130706433) : o2 = [0, 0, 0, _htonl(1)]), p2 = d2(n2, _2, m2, null, o2, s2), HEAPU32[a2 >> 2] = p2, 0;
      if (e = UTF8ToString(e), o2 = inetPton4(e), o2 !== null) if (n2 === 0 || n2 === 2) n2 = 2;
      else if (n2 === 10 && l2 & 8) o2 = [0, 0, _htonl(65535), o2], n2 = 10;
      else return -2;
      else if (o2 = inetPton6(e), o2 !== null) if (n2 === 0 || n2 === 10) n2 = 10;
      else return -2;
      return o2 != null ? (p2 = d2(n2, _2, m2, e, o2, s2), HEAPU32[a2 >> 2] = p2, 0) : l2 & 4 ? -2 : (e = DNS.lookup_name(e), o2 = inetPton4(e), n2 === 0 ? n2 = 2 : n2 === 10 && (o2 = [0, 0, _htonl(65535), o2]), p2 = d2(n2, _2, m2, null, o2, s2), HEAPU32[a2 >> 2] = p2, 0);
    };
    _getaddrinfo.sig = "ipppp";
    var _getnameinfo = (e, t, r2, a2, o2, s2, l2) => {
      var n2 = readSockaddr(e, t);
      if (n2.errno) return -6;
      var _2 = n2.port, m2 = n2.addr, p2 = false;
      if (r2 && a2) {
        var d2;
        if (l2 & 1 || !(d2 = DNS.lookup_addr(m2))) {
          if (l2 & 8) return -2;
        } else m2 = d2;
        var g2 = stringToUTF8(m2, r2, a2);
        g2 + 1 >= a2 && (p2 = true);
      }
      if (o2 && s2) {
        _2 = "" + _2;
        var g2 = stringToUTF8(_2, o2, s2);
        g2 + 1 >= s2 && (p2 = true);
      }
      return p2 ? -12 : 0;
    };
    _getnameinfo.sig = "ipipipii";
    var stringToNewUTF8 = (e) => {
      var t = lengthBytesUTF8(e) + 1, r2 = _malloc(t);
      return r2 && stringToUTF8(e, r2, t), r2;
    }, getCFunc = (e) => {
      var t = Module["_" + e];
      return t;
    }, writeArrayToMemory = (e, t) => {
      HEAP8.set(e, t);
    }, ccall = (e, t, r2, a2, o2) => {
      var s2 = { string: (f2) => {
        var u2 = 0;
        return f2 != null && f2 !== 0 && (u2 = stringToUTF8OnStack(f2)), u2;
      }, array: (f2) => {
        var u2 = stackAlloc(f2.length);
        return writeArrayToMemory(f2, u2), u2;
      } };
      function l2(f2) {
        return t === "string" ? UTF8ToString(f2) : t === "boolean" ? !!f2 : f2;
      }
      var n2 = getCFunc(e), _2 = [], m2 = 0;
      if (a2) for (var p2 = 0; p2 < a2.length; p2++) {
        var d2 = s2[r2[p2]];
        d2 ? (m2 === 0 && (m2 = stackSave()), _2[p2] = d2(a2[p2])) : _2[p2] = a2[p2];
      }
      var g2 = n2(..._2);
      function c2(f2) {
        return m2 !== 0 && stackRestore(m2), l2(f2);
      }
      return g2 = c2(g2), g2;
    }, cwrap = (e, t, r2, a2) => {
      var o2 = !r2 || r2.every((l2) => l2 === "number" || l2 === "boolean"), s2 = t !== "string";
      return s2 && o2 && !a2 ? getCFunc(e) : (...l2) => ccall(e, t, r2, l2);
    }, FS_createPath = FS.createPath, FS_unlink = (e) => FS.unlink(e), FS_createLazyFile = FS.createLazyFile, FS_createDevice = FS.createDevice, setTempRet0 = (e) => __emscripten_tempret_set(e), _setTempRet0 = setTempRet0;
    Module._setTempRet0 = _setTempRet0;
    var getTempRet0 = (e) => __emscripten_tempret_get(), _getTempRet0 = getTempRet0;
    Module._getTempRet0 = _getTempRet0, registerWasmPlugin(), FS.createPreloadedFile = FS_createPreloadedFile, FS.staticInit(), Module.FS_createPath = FS.createPath, Module.FS_createDataFile = FS.createDataFile, Module.FS_createPreloadedFile = FS.createPreloadedFile, Module.FS_unlink = FS.unlink, Module.FS_createLazyFile = FS.createLazyFile, Module.FS_createDevice = FS.createDevice, MEMFS.doesNotExistError = new FS.ErrnoError(44), MEMFS.doesNotExistError.stack = "<generic error, no stack>", ENVIRONMENT_IS_NODE && NODEFS.staticInit(), Module.requestAnimationFrame = MainLoop.requestAnimationFrame, Module.pauseMainLoop = MainLoop.pause, Module.resumeMainLoop = MainLoop.resume, MainLoop.init();
    var wasmImports = { __assert_fail: ___assert_fail, __call_sighandler: ___call_sighandler, __heap_base: ___heap_base, __indirect_function_table: wasmTable, __memory_base: ___memory_base, __stack_pointer: ___stack_pointer, __syscall__newselect: ___syscall__newselect, __syscall_bind: ___syscall_bind, __syscall_chdir: ___syscall_chdir, __syscall_chmod: ___syscall_chmod, __syscall_connect: ___syscall_connect, __syscall_dup: ___syscall_dup, __syscall_dup3: ___syscall_dup3, __syscall_faccessat: ___syscall_faccessat, __syscall_fadvise64: ___syscall_fadvise64, __syscall_fallocate: ___syscall_fallocate, __syscall_fcntl64: ___syscall_fcntl64, __syscall_fdatasync: ___syscall_fdatasync, __syscall_fstat64: ___syscall_fstat64, __syscall_ftruncate64: ___syscall_ftruncate64, __syscall_getcwd: ___syscall_getcwd, __syscall_getdents64: ___syscall_getdents64, __syscall_getsockname: ___syscall_getsockname, __syscall_getsockopt: ___syscall_getsockopt, __syscall_ioctl: ___syscall_ioctl, __syscall_lstat64: ___syscall_lstat64, __syscall_mkdirat: ___syscall_mkdirat, __syscall_newfstatat: ___syscall_newfstatat, __syscall_openat: ___syscall_openat, __syscall_pipe: ___syscall_pipe, __syscall_poll: ___syscall_poll, __syscall_readlinkat: ___syscall_readlinkat, __syscall_recvfrom: ___syscall_recvfrom, __syscall_renameat: ___syscall_renameat, __syscall_rmdir: ___syscall_rmdir, __syscall_sendto: ___syscall_sendto, __syscall_socket: ___syscall_socket, __syscall_stat64: ___syscall_stat64, __syscall_symlinkat: ___syscall_symlinkat, __syscall_truncate64: ___syscall_truncate64, __syscall_unlinkat: ___syscall_unlinkat, __table_base: ___table_base, _abort_js: __abort_js, _dlopen_js: __dlopen_js, _dlsym_js: __dlsym_js, _emscripten_memcpy_js: __emscripten_memcpy_js, _emscripten_runtime_keepalive_clear: __emscripten_runtime_keepalive_clear, _emscripten_system: __emscripten_system, _emscripten_throw_longjmp: __emscripten_throw_longjmp, _gmtime_js: __gmtime_js, _localtime_js: __localtime_js, _mmap_js: __mmap_js, _munmap_js: __munmap_js, _setitimer_js: __setitimer_js, _tzset_js: __tzset_js, clock_time_get: _clock_time_get, emscripten_asm_const_int: _emscripten_asm_const_int, emscripten_date_now: _emscripten_date_now, emscripten_force_exit: _emscripten_force_exit, emscripten_get_now: _emscripten_get_now, emscripten_resize_heap: _emscripten_resize_heap, emscripten_set_main_loop: _emscripten_set_main_loop, environ_get: _environ_get, environ_sizes_get: _environ_sizes_get, exit: _exit, fd_close: _fd_close, fd_fdstat_get: _fd_fdstat_get, fd_pread: _fd_pread, fd_pwrite: _fd_pwrite, fd_read: _fd_read, fd_seek: _fd_seek, fd_sync: _fd_sync, fd_write: _fd_write, getTempRet0: _getTempRet0, getaddrinfo: _getaddrinfo, getnameinfo: _getnameinfo, invoke_di, invoke_i, invoke_id, invoke_ii, invoke_iii, invoke_iiii, invoke_iiiii, invoke_iiiiii, invoke_iiiiiii, invoke_iiiiiiii, invoke_iiiiiiiii, invoke_iiiiiiiiii, invoke_iiiiiiiiiiiiiiiii, invoke_iiiiiji, invoke_iiiij, invoke_iiiijii, invoke_iiij, invoke_iiji, invoke_ij, invoke_ijiiiii, invoke_ijiiiiii, invoke_ji, invoke_jii, invoke_jiiii, invoke_jiiiii, invoke_jiiiiiiii, invoke_v, invoke_vi, invoke_vid, invoke_vii, invoke_viii, invoke_viiii, invoke_viiiii, invoke_viiiiii, invoke_viiiiiii, invoke_viiiiiiii, invoke_viiiiiiiii, invoke_viiiiiiiiiiii, invoke_viiij, invoke_viij, invoke_viiji, invoke_viijii, invoke_viijiiii, invoke_vij, invoke_viji, invoke_vijiji, invoke_vj, invoke_vji, is_web_env, memory: wasmMemory, proc_exit: _proc_exit, setTempRet0: _setTempRet0 }, wasmExports;
    createWasm();
    Module._ScanKeywordLookup = (e, t) => (Module._ScanKeywordLookup = wasmExports.ScanKeywordLookup)(e, t);
    Module._pg_snprintf = (e, t, r2, a2) => (Module._pg_snprintf = wasmExports.pg_snprintf)(e, t, r2, a2);
    Module._strlen = (e) => (Module._strlen = wasmExports.strlen)(e);
    Module._memset = (e, t, r2) => (Module._memset = wasmExports.memset)(e, t, r2);
    Module._strchr = (e, t) => (Module._strchr = wasmExports.strchr)(e, t);
    Module._PQserverVersion = (e) => (Module._PQserverVersion = wasmExports.PQserverVersion)(e);
    Module._strstr = (e, t) => (Module._strstr = wasmExports.strstr)(e, t);
    Module._pg_fprintf = (e, t, r2) => (Module._pg_fprintf = wasmExports.pg_fprintf)(e, t, r2);
    Module._strspn = (e, t) => (Module._strspn = wasmExports.strspn)(e, t);
    var _malloc = Module._malloc = (e) => (_malloc = Module._malloc = wasmExports.malloc)(e);
    Module._pg_strcasecmp = (e, t) => (Module._pg_strcasecmp = wasmExports.pg_strcasecmp)(e, t);
    Module._strcmp = (e, t) => (Module._strcmp = wasmExports.strcmp)(e, t);
    Module._free = (e) => (Module._free = wasmExports.free)(e);
    Module._pg_tolower = (e) => (Module._pg_tolower = wasmExports.pg_tolower)(e);
    Module._memchr = (e, t, r2) => (Module._memchr = wasmExports.memchr)(e, t, r2);
    Module._getenv = (e) => (Module._getenv = wasmExports.getenv)(e);
    Module._fileno = (e) => (Module._fileno = wasmExports.fileno)(e);
    Module._isatty = (e) => (Module._isatty = wasmExports.isatty)(e);
    Module._strdup = (e) => (Module._strdup = wasmExports.strdup)(e);
    Module.___errno_location = () => (Module.___errno_location = wasmExports.__errno_location)();
    var _fflush = Module._fflush = (e) => (_fflush = Module._fflush = wasmExports.fflush)(e);
    Module._pg_vsnprintf = (e, t, r2, a2) => (Module._pg_vsnprintf = wasmExports.pg_vsnprintf)(e, t, r2, a2);
    Module._pg_malloc_extended = (e, t) => (Module._pg_malloc_extended = wasmExports.pg_malloc_extended)(e, t);
    Module._PageInit = (e, t, r2) => (Module._PageInit = wasmExports.PageInit)(e, t, r2);
    Module._pg_checksum_page = (e, t) => (Module._pg_checksum_page = wasmExports.pg_checksum_page)(e, t);
    Module._errstart = (e, t) => (Module._errstart = wasmExports.errstart)(e, t);
    Module._errcode = (e) => (Module._errcode = wasmExports.errcode)(e);
    Module._errmsg = (e, t) => (Module._errmsg = wasmExports.errmsg)(e, t);
    Module._errfinish = (e, t, r2) => (Module._errfinish = wasmExports.errfinish)(e, t, r2);
    Module._PageAddItemExtended = (e, t, r2, a2, o2) => (Module._PageAddItemExtended = wasmExports.PageAddItemExtended)(e, t, r2, a2, o2);
    Module._errstart_cold = (e, t) => (Module._errstart_cold = wasmExports.errstart_cold)(e, t);
    Module._puts = (e) => (Module._puts = wasmExports.puts)(e);
    Module._errmsg_internal = (e, t) => (Module._errmsg_internal = wasmExports.errmsg_internal)(e, t);
    Module._memmove = (e, t, r2) => (Module._memmove = wasmExports.memmove)(e, t, r2);
    Module._memcpy = (e, t, r2) => (Module._memcpy = wasmExports.memcpy)(e, t, r2);
    Module._palloc = (e) => (Module._palloc = wasmExports.palloc)(e);
    Module._pfree = (e) => (Module._pfree = wasmExports.pfree)(e);
    Module._PageGetFreeSpace = (e) => (Module._PageGetFreeSpace = wasmExports.PageGetFreeSpace)(e);
    Module._PageGetExactFreeSpace = (e) => (Module._PageGetExactFreeSpace = wasmExports.PageGetExactFreeSpace)(e);
    Module._PageGetHeapFreeSpace = (e) => (Module._PageGetHeapFreeSpace = wasmExports.PageGetHeapFreeSpace)(e);
    Module._PageIndexMultiDelete = (e, t, r2) => (Module._PageIndexMultiDelete = wasmExports.PageIndexMultiDelete)(e, t, r2);
    Module._PageIndexTupleOverwrite = (e, t, r2, a2) => (Module._PageIndexTupleOverwrite = wasmExports.PageIndexTupleOverwrite)(e, t, r2, a2);
    Module._ItemPointerEquals = (e, t) => (Module._ItemPointerEquals = wasmExports.ItemPointerEquals)(e, t);
    Module._ItemPointerCompare = (e, t) => (Module._ItemPointerCompare = wasmExports.ItemPointerCompare)(e, t);
    Module._add_size = (e, t) => (Module._add_size = wasmExports.add_size)(e, t);
    Module._ShmemInitStruct = (e, t, r2) => (Module._ShmemInitStruct = wasmExports.ShmemInitStruct)(e, t, r2);
    Module._s_init_lock_sema = (e, t) => (Module._s_init_lock_sema = wasmExports.s_init_lock_sema)(e, t);
    Module._LWLockAcquire = (e, t) => (Module._LWLockAcquire = wasmExports.LWLockAcquire)(e, t);
    Module._LWLockRelease = (e) => (Module._LWLockRelease = wasmExports.LWLockRelease)(e);
    Module._on_shmem_exit = (e, t) => (Module._on_shmem_exit = wasmExports.on_shmem_exit)(e, t);
    Module._tas_sema = (e) => (Module._tas_sema = wasmExports.tas_sema)(e);
    Module._s_lock = (e, t, r2, a2) => (Module._s_lock = wasmExports.s_lock)(e, t, r2, a2);
    Module._s_unlock_sema = (e) => (Module._s_unlock_sema = wasmExports.s_unlock_sema)(e);
    Module._StartTransactionCommand = () => (Module._StartTransactionCommand = wasmExports.StartTransactionCommand)();
    Module._CommitTransactionCommand = () => (Module._CommitTransactionCommand = wasmExports.CommitTransactionCommand)();
    Module._WaitLatch = (e, t, r2, a2) => (Module._WaitLatch = wasmExports.WaitLatch)(e, t, r2, a2);
    Module._ResetLatch = (e) => (Module._ResetLatch = wasmExports.ResetLatch)(e);
    Module._ProcessInterrupts = () => (Module._ProcessInterrupts = wasmExports.ProcessInterrupts)();
    Module._MemoryContextAlloc = (e, t) => (Module._MemoryContextAlloc = wasmExports.MemoryContextAlloc)(e, t);
    Module._AllocateDir = (e) => (Module._AllocateDir = wasmExports.AllocateDir)(e);
    Module._ReadDir = (e, t) => (Module._ReadDir = wasmExports.ReadDir)(e, t);
    Module._strncmp = (e, t, r2) => (Module._strncmp = wasmExports.strncmp)(e, t, r2);
    Module._unlink = (e) => (Module._unlink = wasmExports.unlink)(e);
    Module._errcode_for_file_access = () => (Module._errcode_for_file_access = wasmExports.errcode_for_file_access)();
    Module._FreeDir = (e) => (Module._FreeDir = wasmExports.FreeDir)(e);
    Module._pg_prng_uint32 = (e) => (Module._pg_prng_uint32 = wasmExports.pg_prng_uint32)(e);
    Module._dsm_create = (e, t) => (Module._dsm_create = wasmExports.dsm_create)(e, t);
    Module._dsm_attach = (e) => (Module._dsm_attach = wasmExports.dsm_attach)(e);
    Module._dsm_detach = (e) => (Module._dsm_detach = wasmExports.dsm_detach)(e);
    Module._dsm_segment_address = (e) => (Module._dsm_segment_address = wasmExports.dsm_segment_address)(e);
    Module._dsm_segment_handle = (e) => (Module._dsm_segment_handle = wasmExports.dsm_segment_handle)(e);
    Module._MemoryContextAllocZero = (e, t) => (Module._MemoryContextAllocZero = wasmExports.MemoryContextAllocZero)(e, t);
    Module._read = (e, t, r2) => (Module._read = wasmExports.read)(e, t, r2);
    Module._hash_create = (e, t, r2, a2) => (Module._hash_create = wasmExports.hash_create)(e, t, r2, a2);
    Module._hash_destroy = (e) => (Module._hash_destroy = wasmExports.hash_destroy)(e);
    Module._hash_seq_init = (e, t) => (Module._hash_seq_init = wasmExports.hash_seq_init)(e, t);
    Module._hash_seq_search = (e) => (Module._hash_seq_search = wasmExports.hash_seq_search)(e);
    Module._hash_search = (e, t, r2, a2) => (Module._hash_search = wasmExports.hash_search)(e, t, r2, a2);
    Module._initStringInfo = (e) => (Module._initStringInfo = wasmExports.initStringInfo)(e);
    Module._appendStringInfo = (e, t, r2) => (Module._appendStringInfo = wasmExports.appendStringInfo)(e, t, r2);
    Module._GetCurrentTimestamp = () => (Module._GetCurrentTimestamp = wasmExports.GetCurrentTimestamp)();
    Module._pg_usleep = (e) => (Module._pg_usleep = wasmExports.pg_usleep)(e);
    Module._errdetail = (e, t) => (Module._errdetail = wasmExports.errdetail)(e, t);
    Module._TransactionIdDidCommit = (e) => (Module._TransactionIdDidCommit = wasmExports.TransactionIdDidCommit)(e);
    Module._TransactionIdPrecedes = (e, t) => (Module._TransactionIdPrecedes = wasmExports.TransactionIdPrecedes)(e, t);
    Module._XLogBeginInsert = () => (Module._XLogBeginInsert = wasmExports.XLogBeginInsert)();
    Module._XLogRegisterData = (e, t) => (Module._XLogRegisterData = wasmExports.XLogRegisterData)(e, t);
    Module._XLogInsert = (e, t) => (Module._XLogInsert = wasmExports.XLogInsert)(e, t);
    Module._ConditionVariableInit = (e) => (Module._ConditionVariableInit = wasmExports.ConditionVariableInit)(e);
    Module._ConditionVariableCancelSleep = () => (Module._ConditionVariableCancelSleep = wasmExports.ConditionVariableCancelSleep)();
    Module._ConditionVariableSleep = (e, t) => (Module._ConditionVariableSleep = wasmExports.ConditionVariableSleep)(e, t);
    Module.___wasm_setjmp = (e, t, r2) => (Module.___wasm_setjmp = wasmExports.__wasm_setjmp)(e, t, r2);
    Module.___wasm_setjmp_test = (e, t) => (Module.___wasm_setjmp_test = wasmExports.__wasm_setjmp_test)(e, t);
    Module._pg_re_throw = () => (Module._pg_re_throw = wasmExports.pg_re_throw)();
    Module._emscripten_longjmp = (e, t) => (Module._emscripten_longjmp = wasmExports.emscripten_longjmp)(e, t);
    Module._procsignal_sigusr1_handler = (e) => (Module._procsignal_sigusr1_handler = wasmExports.procsignal_sigusr1_handler)(e);
    Module._close = (e) => (Module._close = wasmExports.close)(e);
    Module._ReleaseExternalFD = () => (Module._ReleaseExternalFD = wasmExports.ReleaseExternalFD)();
    Module._fcntl = (e, t, r2) => (Module._fcntl = wasmExports.fcntl)(e, t, r2);
    Module._pqsignal = (e, t) => (Module._pqsignal = wasmExports.pqsignal)(e, t);
    Module._write = (e, t, r2) => (Module._write = wasmExports.write)(e, t, r2);
    Module._AddWaitEventToSet = (e, t, r2, a2, o2) => (Module._AddWaitEventToSet = wasmExports.AddWaitEventToSet)(e, t, r2, a2, o2);
    Module._clock_gettime = (e, t) => (Module._clock_gettime = wasmExports.clock_gettime)(e, t);
    Module._poll = (e, t, r2) => (Module._poll = wasmExports.poll)(e, t, r2);
    Module._WaitLatchOrSocket = (e, t, r2, a2, o2) => (Module._WaitLatchOrSocket = wasmExports.WaitLatchOrSocket)(e, t, r2, a2, o2);
    Module._GetNumRegisteredWaitEvents = (e) => (Module._GetNumRegisteredWaitEvents = wasmExports.GetNumRegisteredWaitEvents)(e);
    Module._ShmemInitHash = (e, t, r2, a2, o2) => (Module._ShmemInitHash = wasmExports.ShmemInitHash)(e, t, r2, a2, o2);
    Module._InitMaterializedSRF = (e, t) => (Module._InitMaterializedSRF = wasmExports.InitMaterializedSRF)(e, t);
    Module._cstring_to_text = (e) => (Module._cstring_to_text = wasmExports.cstring_to_text)(e);
    Module._Int64GetDatum = (e) => (Module._Int64GetDatum = wasmExports.Int64GetDatum)(e);
    Module._tuplestore_putvalues = (e, t, r2, a2) => (Module._tuplestore_putvalues = wasmExports.tuplestore_putvalues)(e, t, r2, a2);
    Module._shm_toc_allocate = (e, t) => (Module._shm_toc_allocate = wasmExports.shm_toc_allocate)(e, t);
    Module._shm_toc_insert = (e, t, r2) => (Module._shm_toc_insert = wasmExports.shm_toc_insert)(e, t, r2);
    Module._shm_toc_lookup = (e, t, r2) => (Module._shm_toc_lookup = wasmExports.shm_toc_lookup)(e, t, r2);
    Module._superuser_arg = (e) => (Module._superuser_arg = wasmExports.superuser_arg)(e);
    Module._superuser = () => (Module._superuser = wasmExports.superuser)();
    Module._GetUserId = () => (Module._GetUserId = wasmExports.GetUserId)();
    Module._has_privs_of_role = (e, t) => (Module._has_privs_of_role = wasmExports.has_privs_of_role)(e, t);
    Module._errmsg_plural = (e, t, r2, a2) => (Module._errmsg_plural = wasmExports.errmsg_plural)(e, t, r2, a2);
    Module._errhint = (e, t) => (Module._errhint = wasmExports.errhint)(e, t);
    Module._fstat = (e, t) => (Module._fstat = wasmExports.fstat)(e, t);
    Module._ftruncate = (e, t) => (Module._ftruncate = wasmExports.ftruncate)(e, t);
    Module._RequestAddinShmemSpace = (e) => (Module._RequestAddinShmemSpace = wasmExports.RequestAddinShmemSpace)(e);
    Module._hash_estimate_size = (e, t) => (Module._hash_estimate_size = wasmExports.hash_estimate_size)(e, t);
    Module._pg_sprintf = (e, t, r2) => (Module._pg_sprintf = wasmExports.pg_sprintf)(e, t, r2);
    Module._SetConfigOption = (e, t, r2, a2) => (Module._SetConfigOption = wasmExports.SetConfigOption)(e, t, r2, a2);
    Module._pg_printf = (e, t) => (Module._pg_printf = wasmExports.pg_printf)(e, t);
    Module._before_shmem_exit = (e, t) => (Module._before_shmem_exit = wasmExports.before_shmem_exit)(e, t);
    Module._cancel_before_shmem_exit = (e, t) => (Module._cancel_before_shmem_exit = wasmExports.cancel_before_shmem_exit)(e, t);
    Module._pg_qsort = (e, t, r2, a2) => (Module._pg_qsort = wasmExports.pg_qsort)(e, t, r2, a2);
    Module._TransactionIdIsInProgress = (e) => (Module._TransactionIdIsInProgress = wasmExports.TransactionIdIsInProgress)(e);
    Module._TransactionIdIsCurrentTransactionId = (e) => (Module._TransactionIdIsCurrentTransactionId = wasmExports.TransactionIdIsCurrentTransactionId)(e);
    Module._RecoveryInProgress = () => (Module._RecoveryInProgress = wasmExports.RecoveryInProgress)();
    Module._GetOldestNonRemovableTransactionId = (e) => (Module._GetOldestNonRemovableTransactionId = wasmExports.GetOldestNonRemovableTransactionId)(e);
    Module._GetCurrentCommandId = (e) => (Module._GetCurrentCommandId = wasmExports.GetCurrentCommandId)(e);
    Module._BackendXidGetPid = (e) => (Module._BackendXidGetPid = wasmExports.BackendXidGetPid)(e);
    Module._lappend_int = (e, t) => (Module._lappend_int = wasmExports.lappend_int)(e, t);
    Module._index_close = (e, t) => (Module._index_close = wasmExports.index_close)(e, t);
    Module._table_close = (e, t) => (Module._table_close = wasmExports.table_close)(e, t);
    Module._CommandCounterIncrement = () => (Module._CommandCounterIncrement = wasmExports.CommandCounterIncrement)();
    Module._GetActiveSnapshot = () => (Module._GetActiveSnapshot = wasmExports.GetActiveSnapshot)();
    Module._ScanKeyInit = (e, t, r2, a2, o2) => (Module._ScanKeyInit = wasmExports.ScanKeyInit)(e, t, r2, a2, o2);
    Module._table_open = (e, t) => (Module._table_open = wasmExports.table_open)(e, t);
    Module._systable_beginscan = (e, t, r2, a2, o2, s2) => (Module._systable_beginscan = wasmExports.systable_beginscan)(e, t, r2, a2, o2, s2);
    Module._systable_getnext = (e) => (Module._systable_getnext = wasmExports.systable_getnext)(e);
    Module._systable_endscan = (e) => (Module._systable_endscan = wasmExports.systable_endscan)(e);
    Module._index_open = (e, t) => (Module._index_open = wasmExports.index_open)(e, t);
    Module._systable_beginscan_ordered = (e, t, r2, a2, o2) => (Module._systable_beginscan_ordered = wasmExports.systable_beginscan_ordered)(e, t, r2, a2, o2);
    Module._systable_getnext_ordered = (e, t) => (Module._systable_getnext_ordered = wasmExports.systable_getnext_ordered)(e, t);
    Module._systable_endscan_ordered = (e) => (Module._systable_endscan_ordered = wasmExports.systable_endscan_ordered)(e);
    Module._heap_form_tuple = (e, t, r2) => (Module._heap_form_tuple = wasmExports.heap_form_tuple)(e, t, r2);
    Module._heap_freetuple = (e) => (Module._heap_freetuple = wasmExports.heap_freetuple)(e);
    Module._AllocSetContextCreateInternal = (e, t, r2, a2, o2) => (Module._AllocSetContextCreateInternal = wasmExports.AllocSetContextCreateInternal)(e, t, r2, a2, o2);
    Module._list_free_deep = (e) => (Module._list_free_deep = wasmExports.list_free_deep)(e);
    Module._lappend = (e, t) => (Module._lappend = wasmExports.lappend)(e, t);
    Module._LockBuffer = (e, t) => (Module._LockBuffer = wasmExports.LockBuffer)(e, t);
    Module._GetFreeIndexPage = (e) => (Module._GetFreeIndexPage = wasmExports.GetFreeIndexPage)(e);
    Module._RecordFreeIndexPage = (e, t) => (Module._RecordFreeIndexPage = wasmExports.RecordFreeIndexPage)(e, t);
    Module._IndexFreeSpaceMapVacuum = (e) => (Module._IndexFreeSpaceMapVacuum = wasmExports.IndexFreeSpaceMapVacuum)(e);
    Module._UnlockReleaseBuffer = (e) => (Module._UnlockReleaseBuffer = wasmExports.UnlockReleaseBuffer)(e);
    Module._smgropen = (e, t) => (Module._smgropen = wasmExports.smgropen)(e, t);
    Module._smgrsetowner = (e, t) => (Module._smgrsetowner = wasmExports.smgrsetowner)(e, t);
    Module._RelationGetNumberOfBlocksInFork = (e, t) => (Module._RelationGetNumberOfBlocksInFork = wasmExports.RelationGetNumberOfBlocksInFork)(e, t);
    Module._ReleaseBuffer = (e) => (Module._ReleaseBuffer = wasmExports.ReleaseBuffer)(e);
    Module._GetRecordedFreeSpace = (e, t) => (Module._GetRecordedFreeSpace = wasmExports.GetRecordedFreeSpace)(e, t);
    Module._smgrexists = (e, t) => (Module._smgrexists = wasmExports.smgrexists)(e, t);
    Module._ReadBufferExtended = (e, t, r2, a2, o2) => (Module._ReadBufferExtended = wasmExports.ReadBufferExtended)(e, t, r2, a2, o2);
    Module._MarkBufferDirty = (e) => (Module._MarkBufferDirty = wasmExports.MarkBufferDirty)(e);
    Module._log_newpage_buffer = (e, t) => (Module._log_newpage_buffer = wasmExports.log_newpage_buffer)(e, t);
    Module._copy_file = (e, t) => (Module._copy_file = wasmExports.copy_file)(e, t);
    Module._fd_fsync_fname = (e, t) => (Module._fd_fsync_fname = wasmExports.fd_fsync_fname)(e, t);
    Module._OpenTransientFile = (e, t) => (Module._OpenTransientFile = wasmExports.OpenTransientFile)(e, t);
    Module._CloseTransientFile = (e) => (Module._CloseTransientFile = wasmExports.CloseTransientFile)(e);
    Module._hash_bytes = (e, t) => (Module._hash_bytes = wasmExports.hash_bytes)(e, t);
    Module._pstrdup = (e) => (Module._pstrdup = wasmExports.pstrdup)(e);
    Module._repalloc = (e, t) => (Module._repalloc = wasmExports.repalloc)(e, t);
    Module._wasm_OpenPipeStream = (e, t) => (Module._wasm_OpenPipeStream = wasmExports.wasm_OpenPipeStream)(e, t);
    Module._access = (e, t) => (Module._access = wasmExports.access)(e, t);
    Module._fopen = (e, t) => (Module._fopen = wasmExports.fopen)(e, t);
    Module._fiprintf = (e, t, r2) => (Module._fiprintf = wasmExports.fiprintf)(e, t, r2);
    Module._fclose = (e) => (Module._fclose = wasmExports.fclose)(e);
    Module._fsync_fname_ext = (e, t, r2, a2) => (Module._fsync_fname_ext = wasmExports.fsync_fname_ext)(e, t, r2, a2);
    Module._fd_durable_rename = (e, t, r2) => (Module._fd_durable_rename = wasmExports.fd_durable_rename)(e, t, r2);
    Module._rename = (e, t) => (Module._rename = wasmExports.rename)(e, t);
    Module._strlcpy = (e, t, r2) => (Module._strlcpy = wasmExports.strlcpy)(e, t, r2);
    Module._dup = (e) => (Module._dup = wasmExports.dup)(e);
    Module._open = (e, t, r2) => (Module._open = wasmExports.open)(e, t, r2);
    Module._AcquireExternalFD = () => (Module._AcquireExternalFD = wasmExports.AcquireExternalFD)();
    Module._realloc = (e, t) => (Module._realloc = wasmExports.realloc)(e, t);
    Module._stat = (e, t) => (Module._stat = wasmExports.stat)(e, t);
    Module._pwrite = (e, t, r2, a2) => (Module._pwrite = wasmExports.pwrite)(e, t, r2, a2);
    Module._lseek = (e, t, r2) => (Module._lseek = wasmExports.lseek)(e, t, r2);
    Module._AllocateFile = (e, t) => (Module._AllocateFile = wasmExports.AllocateFile)(e, t);
    Module._GetCurrentSubTransactionId = () => (Module._GetCurrentSubTransactionId = wasmExports.GetCurrentSubTransactionId)();
    Module._FreeFile = (e) => (Module._FreeFile = wasmExports.FreeFile)(e);
    Module._pclose = (e) => (Module._pclose = wasmExports.pclose)(e);
    Module._ClosePipeStream = (e) => (Module._ClosePipeStream = wasmExports.ClosePipeStream)(e);
    Module._pg_prng_uint64_range = (e, t, r2) => (Module._pg_prng_uint64_range = wasmExports.pg_prng_uint64_range)(e, t, r2);
    Module._AtEOSubXact_Files = (e, t, r2) => (Module._AtEOSubXact_Files = wasmExports.AtEOSubXact_Files)(e, t, r2);
    Module._pre_format_elog_string = (e, t) => (Module._pre_format_elog_string = wasmExports.pre_format_elog_string)(e, t);
    Module._format_elog_string = (e, t) => (Module._format_elog_string = wasmExports.format_elog_string)(e, t);
    Module._list_free = (e) => (Module._list_free = wasmExports.list_free)(e);
    Module._guc_malloc = (e, t) => (Module._guc_malloc = wasmExports.guc_malloc)(e, t);
    Module._MemoryContextDelete = (e) => (Module._MemoryContextDelete = wasmExports.MemoryContextDelete)(e);
    Module._strtoul = (e, t, r2) => (Module._strtoul = wasmExports.strtoul)(e, t, r2);
    Module._hash_get_num_entries = (e) => (Module._hash_get_num_entries = wasmExports.hash_get_num_entries)(e);
    Module._LWLockInitialize = (e, t) => (Module._LWLockInitialize = wasmExports.LWLockInitialize)(e, t);
    Module._PrefetchBuffer = (e, t, r2, a2) => (Module._PrefetchBuffer = wasmExports.PrefetchBuffer)(e, t, r2, a2);
    Module._LockBufHdr = (e) => (Module._LockBufHdr = wasmExports.LockBufHdr)(e);
    Module._ReadBuffer = (e, t) => (Module._ReadBuffer = wasmExports.ReadBuffer)(e, t);
    Module._pgstat_assoc_relation = (e) => (Module._pgstat_assoc_relation = wasmExports.pgstat_assoc_relation)(e);
    Module._ExtendBufferedRel = (e, t, r2, a2) => (Module._ExtendBufferedRel = wasmExports.ExtendBufferedRel)(e, t, r2, a2);
    Module._LockBufferForCleanup = (e) => (Module._LockBufferForCleanup = wasmExports.LockBufferForCleanup)(e);
    Module._smgrread = (e, t, r2, a2) => (Module._smgrread = wasmExports.smgrread)(e, t, r2, a2);
    Module._LockRelationForExtension = (e, t) => (Module._LockRelationForExtension = wasmExports.LockRelationForExtension)(e, t);
    Module._UnlockRelationForExtension = (e, t) => (Module._UnlockRelationForExtension = wasmExports.UnlockRelationForExtension)(e, t);
    Module._BufferGetBlockNumber = (e) => (Module._BufferGetBlockNumber = wasmExports.BufferGetBlockNumber)(e);
    Module._bsearch = (e, t, r2, a2, o2) => (Module._bsearch = wasmExports.bsearch)(e, t, r2, a2, o2);
    Module._set_errcontext_domain = (e) => (Module._set_errcontext_domain = wasmExports.set_errcontext_domain)(e);
    Module._errcontext_msg = (e, t) => (Module._errcontext_msg = wasmExports.errcontext_msg)(e, t);
    Module._GetAccessStrategy = (e) => (Module._GetAccessStrategy = wasmExports.GetAccessStrategy)(e);
    Module._FreeAccessStrategy = (e) => (Module._FreeAccessStrategy = wasmExports.FreeAccessStrategy)(e);
    Module._ConditionalLockBuffer = (e) => (Module._ConditionalLockBuffer = wasmExports.ConditionalLockBuffer)(e);
    Module._TestForOldSnapshot_impl = (e, t) => (Module._TestForOldSnapshot_impl = wasmExports.TestForOldSnapshot_impl)(e, t);
    var _calloc = Module._calloc = (e, t) => (_calloc = Module._calloc = wasmExports.calloc)(e, t);
    Module._have_free_buffer = () => (Module._have_free_buffer = wasmExports.have_free_buffer)();
    Module._palloc0 = (e) => (Module._palloc0 = wasmExports.palloc0)(e);
    Module._resetStringInfo = (e) => (Module._resetStringInfo = wasmExports.resetStringInfo)(e);
    Module._appendStringInfoChar = (e, t) => (Module._appendStringInfoChar = wasmExports.appendStringInfoChar)(e, t);
    Module._appendBinaryStringInfo = (e, t, r2) => (Module._appendBinaryStringInfo = wasmExports.appendBinaryStringInfo)(e, t, r2);
    Module._errdetail_internal = (e, t) => (Module._errdetail_internal = wasmExports.errdetail_internal)(e, t);
    Module._strcpy = (e, t) => (Module._strcpy = wasmExports.strcpy)(e, t);
    Module._LWLockRegisterTranche = (e, t) => (Module._LWLockRegisterTranche = wasmExports.LWLockRegisterTranche)(e, t);
    Module._GetNamedLWLockTranche = (e) => (Module._GetNamedLWLockTranche = wasmExports.GetNamedLWLockTranche)(e);
    Module._LWLockNewTrancheId = () => (Module._LWLockNewTrancheId = wasmExports.LWLockNewTrancheId)();
    Module._RequestNamedLWLockTranche = (e, t) => (Module._RequestNamedLWLockTranche = wasmExports.RequestNamedLWLockTranche)(e, t);
    Module._pg_prng_double = (e) => (Module._pg_prng_double = wasmExports.pg_prng_double)(e);
    Module._getpid = () => (Module._getpid = wasmExports.getpid)();
    Module._GetTransactionSnapshot = () => (Module._GetTransactionSnapshot = wasmExports.GetTransactionSnapshot)();
    Module._ConditionVariableSignal = (e) => (Module._ConditionVariableSignal = wasmExports.ConditionVariableSignal)(e);
    Module._LockPage = (e, t, r2) => (Module._LockPage = wasmExports.LockPage)(e, t, r2);
    Module._UnlockPage = (e, t, r2) => (Module._UnlockPage = wasmExports.UnlockPage)(e, t, r2);
    Module._pgstat_progress_update_param = (e, t) => (Module._pgstat_progress_update_param = wasmExports.pgstat_progress_update_param)(e, t);
    Module._list_make1_impl = (e, t) => (Module._list_make1_impl = wasmExports.list_make1_impl)(e, t);
    Module._psprintf = (e, t) => (Module._psprintf = wasmExports.psprintf)(e, t);
    Module._smgrtruncate = (e, t, r2, a2) => (Module._smgrtruncate = wasmExports.smgrtruncate)(e, t, r2, a2);
    Module._log = (e) => (Module._log = wasmExports.log)(e);
    Module._pairingheap_allocate = (e, t) => (Module._pairingheap_allocate = wasmExports.pairingheap_allocate)(e, t);
    Module._pairingheap_add = (e, t) => (Module._pairingheap_add = wasmExports.pairingheap_add)(e, t);
    Module._pairingheap_first = (e) => (Module._pairingheap_first = wasmExports.pairingheap_first)(e);
    Module._pairingheap_remove_first = (e) => (Module._pairingheap_remove_first = wasmExports.pairingheap_remove_first)(e);
    Module._bloom_create = (e, t, r2) => (Module._bloom_create = wasmExports.bloom_create)(e, t, r2);
    Module._bloom_free = (e) => (Module._bloom_free = wasmExports.bloom_free)(e);
    Module._bloom_add_element = (e, t, r2) => (Module._bloom_add_element = wasmExports.bloom_add_element)(e, t, r2);
    Module._hash_bytes_extended = (e, t, r2) => (Module._hash_bytes_extended = wasmExports.hash_bytes_extended)(e, t, r2);
    Module._bloom_lacks_element = (e, t, r2) => (Module._bloom_lacks_element = wasmExports.bloom_lacks_element)(e, t, r2);
    Module._bloom_prop_bits_set = (e) => (Module._bloom_prop_bits_set = wasmExports.bloom_prop_bits_set)(e);
    Module._pg_popcount = (e, t) => (Module._pg_popcount = wasmExports.pg_popcount)(e, t);
    Module._memcmp = (e, t, r2) => (Module._memcmp = wasmExports.memcmp)(e, t, r2);
    Module._bms_make_singleton = (e) => (Module._bms_make_singleton = wasmExports.bms_make_singleton)(e);
    Module._bms_add_members = (e, t) => (Module._bms_add_members = wasmExports.bms_add_members)(e, t);
    Module._bms_add_member = (e, t) => (Module._bms_add_member = wasmExports.bms_add_member)(e, t);
    Module._bms_del_member = (e, t) => (Module._bms_del_member = wasmExports.bms_del_member)(e, t);
    Module._check_stack_depth = () => (Module._check_stack_depth = wasmExports.check_stack_depth)();
    Module._parser_errposition = (e, t) => (Module._parser_errposition = wasmExports.parser_errposition)(e, t);
    Module._makeVar = (e, t, r2, a2, o2, s2) => (Module._makeVar = wasmExports.makeVar)(e, t, r2, a2, o2, s2);
    Module._bms_union = (e, t) => (Module._bms_union = wasmExports.bms_union)(e, t);
    Module._varstr_levenshtein_less_equal = (e, t, r2, a2, o2, s2, l2, n2, _2) => (Module._varstr_levenshtein_less_equal = wasmExports.varstr_levenshtein_less_equal)(e, t, r2, a2, o2, s2, l2, n2, _2);
    Module._SearchSysCacheExists = (e, t, r2, a2, o2) => (Module._SearchSysCacheExists = wasmExports.SearchSysCacheExists)(e, t, r2, a2, o2);
    Module._MemoryContextAllocZeroAligned = (e, t) => (Module._MemoryContextAllocZeroAligned = wasmExports.MemoryContextAllocZeroAligned)(e, t);
    Module._makeString = (e) => (Module._makeString = wasmExports.makeString)(e);
    Module._addRTEPermissionInfo = (e, t) => (Module._addRTEPermissionInfo = wasmExports.addRTEPermissionInfo)(e, t);
    Module._copyObjectImpl = (e) => (Module._copyObjectImpl = wasmExports.copyObjectImpl)(e);
    Module._exprType = (e) => (Module._exprType = wasmExports.exprType)(e);
    Module._lappend_oid = (e, t) => (Module._lappend_oid = wasmExports.lappend_oid)(e, t);
    Module._exprTypmod = (e) => (Module._exprTypmod = wasmExports.exprTypmod)(e);
    Module._exprLocation = (e) => (Module._exprLocation = wasmExports.exprLocation)(e);
    Module._CreateTemplateTupleDesc = (e) => (Module._CreateTemplateTupleDesc = wasmExports.CreateTemplateTupleDesc)(e);
    Module._TupleDescInitEntry = (e, t, r2, a2, o2, s2) => (Module._TupleDescInitEntry = wasmExports.TupleDescInitEntry)(e, t, r2, a2, o2, s2);
    Module._TupleDescInitEntryCollation = (e, t, r2) => (Module._TupleDescInitEntryCollation = wasmExports.TupleDescInitEntryCollation)(e, t, r2);
    Module._typenameTypeIdAndMod = (e, t, r2, a2) => (Module._typenameTypeIdAndMod = wasmExports.typenameTypeIdAndMod)(e, t, r2, a2);
    Module._format_type_be = (e) => (Module._format_type_be = wasmExports.format_type_be)(e);
    Module._list_concat = (e, t) => (Module._list_concat = wasmExports.list_concat)(e, t);
    Module._list_copy = (e) => (Module._list_copy = wasmExports.list_copy)(e);
    Module._relation_open = (e, t) => (Module._relation_open = wasmExports.relation_open)(e, t);
    Module._relation_close = (e, t) => (Module._relation_close = wasmExports.relation_close)(e, t);
    Module._makeTargetEntry = (e, t, r2, a2) => (Module._makeTargetEntry = wasmExports.makeTargetEntry)(e, t, r2, a2);
    Module._get_attname = (e, t, r2) => (Module._get_attname = wasmExports.get_attname)(e, t, r2);
    Module._SearchSysCache2 = (e, t, r2) => (Module._SearchSysCache2 = wasmExports.SearchSysCache2)(e, t, r2);
    Module._ReleaseSysCache = (e) => (Module._ReleaseSysCache = wasmExports.ReleaseSysCache)(e);
    Module._RangeVarGetRelidExtended = (e, t, r2, a2, o2) => (Module._RangeVarGetRelidExtended = wasmExports.RangeVarGetRelidExtended)(e, t, r2, a2, o2);
    Module._pg_mbstrlen_with_len = (e, t) => (Module._pg_mbstrlen_with_len = wasmExports.pg_mbstrlen_with_len)(e, t);
    Module._errposition = (e) => (Module._errposition = wasmExports.errposition)(e);
    Module._numeric_in = (e) => (Module._numeric_in = wasmExports.numeric_in)(e);
    Module._DirectFunctionCall3Coll = (e, t, r2, a2, o2) => (Module._DirectFunctionCall3Coll = wasmExports.DirectFunctionCall3Coll)(e, t, r2, a2, o2);
    Module._bit_in = (e) => (Module._bit_in = wasmExports.bit_in)(e);
    Module._NameListToString = (e) => (Module._NameListToString = wasmExports.NameListToString)(e);
    Module._appendStringInfoString = (e, t) => (Module._appendStringInfoString = wasmExports.appendStringInfoString)(e, t);
    Module._lookup_type_cache = (e, t) => (Module._lookup_type_cache = wasmExports.lookup_type_cache)(e, t);
    Module._CacheRegisterSyscacheCallback = (e, t, r2) => (Module._CacheRegisterSyscacheCallback = wasmExports.CacheRegisterSyscacheCallback)(e, t, r2);
    Module._SearchSysCache1 = (e, t) => (Module._SearchSysCache1 = wasmExports.SearchSysCache1)(e, t);
    Module._list_make2_impl = (e, t, r2) => (Module._list_make2_impl = wasmExports.list_make2_impl)(e, t, r2);
    Module._get_base_element_type = (e) => (Module._get_base_element_type = wasmExports.get_base_element_type)(e);
    Module._downcase_truncate_identifier = (e, t, r2) => (Module._downcase_truncate_identifier = wasmExports.downcase_truncate_identifier)(e, t, r2);
    Module._pg_database_encoding_max_length = () => (Module._pg_database_encoding_max_length = wasmExports.pg_database_encoding_max_length)();
    Module._truncate_identifier = (e, t, r2) => (Module._truncate_identifier = wasmExports.truncate_identifier)(e, t, r2);
    Module._scanner_isspace = (e) => (Module._scanner_isspace = wasmExports.scanner_isspace)(e);
    Module._get_typcollation = (e) => (Module._get_typcollation = wasmExports.get_typcollation)(e);
    Module._list_delete_cell = (e, t) => (Module._list_delete_cell = wasmExports.list_delete_cell)(e, t);
    Module._makeTypeNameFromNameList = (e) => (Module._makeTypeNameFromNameList = wasmExports.makeTypeNameFromNameList)(e);
    Module._SysCacheGetAttrNotNull = (e, t, r2) => (Module._SysCacheGetAttrNotNull = wasmExports.SysCacheGetAttrNotNull)(e, t, r2);
    Module._text_to_cstring = (e) => (Module._text_to_cstring = wasmExports.text_to_cstring)(e);
    Module._stringToNode = (e) => (Module._stringToNode = wasmExports.stringToNode)(e);
    Module._bms_is_member = (e, t) => (Module._bms_is_member = wasmExports.bms_is_member)(e, t);
    Module._bms_free = (e) => (Module._bms_free = wasmExports.bms_free)(e);
    Module._core_yylex = (e, t, r2) => (Module._core_yylex = wasmExports.core_yylex)(e, t, r2);
    Module._getc = (e) => (Module._getc = wasmExports.getc)(e);
    Module._ferror = (e) => (Module._ferror = wasmExports.ferror)(e);
    Module._fread = (e, t, r2, a2) => (Module._fread = wasmExports.fread)(e, t, r2, a2);
    Module._clearerr = (e) => (Module._clearerr = wasmExports.clearerr)(e);
    Module._scanner_init = (e, t, r2, a2) => (Module._scanner_init = wasmExports.scanner_init)(e, t, r2, a2);
    Module._scanner_finish = (e) => (Module._scanner_finish = wasmExports.scanner_finish)(e);
    Module._get_namespace_name = (e) => (Module._get_namespace_name = wasmExports.get_namespace_name)(e);
    Module._lookup_rowtype_tupdesc = (e, t) => (Module._lookup_rowtype_tupdesc = wasmExports.lookup_rowtype_tupdesc)(e, t);
    Module._DecrTupleDescRefCount = (e) => (Module._DecrTupleDescRefCount = wasmExports.DecrTupleDescRefCount)(e);
    Module._relation_openrv = (e, t) => (Module._relation_openrv = wasmExports.relation_openrv)(e, t);
    Module._errdetail_relkind_not_supported = (e) => (Module._errdetail_relkind_not_supported = wasmExports.errdetail_relkind_not_supported)(e);
    Module._object_aclcheck = (e, t, r2, a2) => (Module._object_aclcheck = wasmExports.object_aclcheck)(e, t, r2, a2);
    Module._aclcheck_error = (e, t, r2) => (Module._aclcheck_error = wasmExports.aclcheck_error)(e, t, r2);
    Module._pg_class_aclcheck = (e, t, r2) => (Module._pg_class_aclcheck = wasmExports.pg_class_aclcheck)(e, t, r2);
    Module._get_relkind_objtype = (e) => (Module._get_relkind_objtype = wasmExports.get_relkind_objtype)(e);
    Module._list_make3_impl = (e, t, r2, a2) => (Module._list_make3_impl = wasmExports.list_make3_impl)(e, t, r2, a2);
    Module._quote_qualified_identifier = (e, t) => (Module._quote_qualified_identifier = wasmExports.quote_qualified_identifier)(e, t);
    Module._table_openrv = (e, t) => (Module._table_openrv = wasmExports.table_openrv)(e, t);
    Module._equal = (e, t) => (Module._equal = wasmExports.equal)(e, t);
    Module._RelationGetIndexList = (e) => (Module._RelationGetIndexList = wasmExports.RelationGetIndexList)(e);
    Module._pg_detoast_datum = (e) => (Module._pg_detoast_datum = wasmExports.pg_detoast_datum)(e);
    Module._SysCacheGetAttr = (e, t, r2, a2) => (Module._SysCacheGetAttr = wasmExports.SysCacheGetAttr)(e, t, r2, a2);
    Module._deconstruct_array_builtin = (e, t, r2, a2, o2) => (Module._deconstruct_array_builtin = wasmExports.deconstruct_array_builtin)(e, t, r2, a2, o2);
    Module._untransformRelOptions = (e) => (Module._untransformRelOptions = wasmExports.untransformRelOptions)(e);
    Module._transformExpr = (e, t, r2) => (Module._transformExpr = wasmExports.transformExpr)(e, t, r2);
    Module._get_rel_namespace = (e) => (Module._get_rel_namespace = wasmExports.get_rel_namespace)(e);
    Module._get_rel_name = (e) => (Module._get_rel_name = wasmExports.get_rel_name)(e);
    Module._makeRangeVar = (e, t, r2) => (Module._makeRangeVar = wasmExports.makeRangeVar)(e, t, r2);
    Module._makeDefElem = (e, t, r2) => (Module._makeDefElem = wasmExports.makeDefElem)(e, t, r2);
    Module._makeRangeVarFromNameList = (e) => (Module._makeRangeVarFromNameList = wasmExports.makeRangeVarFromNameList)(e);
    Module._coerce_to_target_type = (e, t, r2, a2, o2, s2, l2, n2) => (Module._coerce_to_target_type = wasmExports.coerce_to_target_type)(e, t, r2, a2, o2, s2, l2, n2);
    Module._LookupTypeName = (e, t, r2, a2) => (Module._LookupTypeName = wasmExports.LookupTypeName)(e, t, r2, a2);
    Module._GetSysCacheOid = (e, t, r2, a2, o2, s2) => (Module._GetSysCacheOid = wasmExports.GetSysCacheOid)(e, t, r2, a2, o2, s2);
    Module._construct_array_builtin = (e, t, r2) => (Module._construct_array_builtin = wasmExports.construct_array_builtin)(e, t, r2);
    Module._get_collation_oid = (e, t) => (Module._get_collation_oid = wasmExports.get_collation_oid)(e, t);
    Module._typeStringToTypeName = (e, t) => (Module._typeStringToTypeName = wasmExports.typeStringToTypeName)(e, t);
    Module._raw_parser = (e, t) => (Module._raw_parser = wasmExports.raw_parser)(e, t);
    Module._errsave_start = (e, t) => (Module._errsave_start = wasmExports.errsave_start)(e, t);
    Module._errsave_finish = (e, t, r2, a2) => (Module._errsave_finish = wasmExports.errsave_finish)(e, t, r2, a2);
    Module._defGetBoolean = (e) => (Module._defGetBoolean = wasmExports.defGetBoolean)(e);
    Module._list_delete_last = (e) => (Module._list_delete_last = wasmExports.list_delete_last)(e);
    Module._format_type_with_typemod = (e, t) => (Module._format_type_with_typemod = wasmExports.format_type_with_typemod)(e, t);
    Module._list_member = (e, t) => (Module._list_member = wasmExports.list_member)(e, t);
    Module._list_member_int = (e, t) => (Module._list_member_int = wasmExports.list_member_int)(e, t);
    Module._list_sort = (e, t) => (Module._list_sort = wasmExports.list_sort)(e, t);
    Module._get_element_type = (e) => (Module._get_element_type = wasmExports.get_element_type)(e);
    Module._makeBoolean = (e) => (Module._makeBoolean = wasmExports.makeBoolean)(e);
    Module._makeInteger = (e) => (Module._makeInteger = wasmExports.makeInteger)(e);
    Module._makeTypeName = (e) => (Module._makeTypeName = wasmExports.makeTypeName)(e);
    Module._list_make4_impl = (e, t, r2, a2, o2) => (Module._list_make4_impl = wasmExports.list_make4_impl)(e, t, r2, a2, o2);
    Module._isxdigit = (e) => (Module._isxdigit = wasmExports.isxdigit)(e);
    Module._strip_implicit_coercions = (e) => (Module._strip_implicit_coercions = wasmExports.strip_implicit_coercions)(e);
    Module._SearchSysCacheList = (e, t, r2, a2, o2) => (Module._SearchSysCacheList = wasmExports.SearchSysCacheList)(e, t, r2, a2, o2);
    Module._ReleaseCatCacheList = (e) => (Module._ReleaseCatCacheList = wasmExports.ReleaseCatCacheList)(e);
    Module._get_sortgroupref_tle = (e, t) => (Module._get_sortgroupref_tle = wasmExports.get_sortgroupref_tle)(e, t);
    Module._type_is_rowtype = (e) => (Module._type_is_rowtype = wasmExports.type_is_rowtype)(e);
    Module._bms_next_member = (e, t) => (Module._bms_next_member = wasmExports.bms_next_member)(e, t);
    Module._MemoryContextReset = (e) => (Module._MemoryContextReset = wasmExports.MemoryContextReset)(e);
    Module._abort = () => (Module._abort = wasmExports.abort)();
    Module._heap_getnext = (e, t) => (Module._heap_getnext = wasmExports.heap_getnext)(e, t);
    Module._OidOutputFunctionCall = (e, t) => (Module._OidOutputFunctionCall = wasmExports.OidOutputFunctionCall)(e, t);
    Module._atoi = (e) => (Module._atoi = wasmExports.atoi)(e);
    Module._GetConfigOption = (e, t, r2) => (Module._GetConfigOption = wasmExports.GetConfigOption)(e, t, r2);
    Module._pg_strong_random = (e, t) => (Module._pg_strong_random = wasmExports.pg_strong_random)(e, t);
    Module._pg_prng_seed_check = (e) => (Module._pg_prng_seed_check = wasmExports.pg_prng_seed_check)(e);
    Module._pg_prng_seed = (e, t) => (Module._pg_prng_seed = wasmExports.pg_prng_seed)(e, t);
    Module._fputc = (e, t) => (Module._fputc = wasmExports.fputc)(e, t);
    Module._time = (e) => (Module._time = wasmExports.time)(e);
    Module._TimestampDifferenceMilliseconds = (e, t) => (Module._TimestampDifferenceMilliseconds = wasmExports.TimestampDifferenceMilliseconds)(e, t);
    Module._ProcessConfigFile = (e) => (Module._ProcessConfigFile = wasmExports.ProcessConfigFile)(e);
    Module._send = (e, t, r2, a2) => (Module._send = wasmExports.send)(e, t, r2, a2);
    Module._parse_bool = (e, t) => (Module._parse_bool = wasmExports.parse_bool)(e, t);
    Module._enlargeStringInfo = (e, t) => (Module._enlargeStringInfo = wasmExports.enlargeStringInfo)(e, t);
    Module._BackgroundWorkerInitializeConnectionByOid = (e, t, r2) => (Module._BackgroundWorkerInitializeConnectionByOid = wasmExports.BackgroundWorkerInitializeConnectionByOid)(e, t, r2);
    Module._BackgroundWorkerUnblockSignals = () => (Module._BackgroundWorkerUnblockSignals = wasmExports.BackgroundWorkerUnblockSignals)();
    Module._pg_getnameinfo_all = (e, t, r2, a2, o2, s2, l2) => (Module._pg_getnameinfo_all = wasmExports.pg_getnameinfo_all)(e, t, r2, a2, o2, s2, l2);
    Module._gai_strerror = (e) => (Module._gai_strerror = wasmExports.gai_strerror)(e);
    Module._SignalHandlerForConfigReload = (e) => (Module._SignalHandlerForConfigReload = wasmExports.SignalHandlerForConfigReload)(e);
    Module._fwrite = (e, t, r2, a2) => (Module._fwrite = wasmExports.fwrite)(e, t, r2, a2);
    Module._SignalHandlerForShutdownRequest = (e) => (Module._SignalHandlerForShutdownRequest = wasmExports.SignalHandlerForShutdownRequest)(e);
    Module._EmitErrorReport = () => (Module._EmitErrorReport = wasmExports.EmitErrorReport)();
    Module._FlushErrorState = () => (Module._FlushErrorState = wasmExports.FlushErrorState)();
    Module._die = (e) => (Module._die = wasmExports.die)(e);
    Module._MultiXactIdPrecedes = (e, t) => (Module._MultiXactIdPrecedes = wasmExports.MultiXactIdPrecedes)(e, t);
    Module._CreateTupleDescCopy = (e) => (Module._CreateTupleDescCopy = wasmExports.CreateTupleDescCopy)(e);
    Module._pgstat_report_activity = (e, t) => (Module._pgstat_report_activity = wasmExports.pgstat_report_activity)(e, t);
    Module._DirectFunctionCall2Coll = (e, t, r2, a2) => (Module._DirectFunctionCall2Coll = wasmExports.DirectFunctionCall2Coll)(e, t, r2, a2);
    Module._RegisterBackgroundWorker = (e) => (Module._RegisterBackgroundWorker = wasmExports.RegisterBackgroundWorker)(e);
    Module._RegisterDynamicBackgroundWorker = (e, t) => (Module._RegisterDynamicBackgroundWorker = wasmExports.RegisterDynamicBackgroundWorker)(e, t);
    Module._WaitForBackgroundWorkerStartup = (e, t) => (Module._WaitForBackgroundWorkerStartup = wasmExports.WaitForBackgroundWorkerStartup)(e, t);
    Module._WaitForBackgroundWorkerShutdown = (e) => (Module._WaitForBackgroundWorkerShutdown = wasmExports.WaitForBackgroundWorkerShutdown)(e);
    Module._GetXLogReplayRecPtr = (e) => (Module._GetXLogReplayRecPtr = wasmExports.GetXLogReplayRecPtr)(e);
    Module._gettimeofday = (e, t) => (Module._gettimeofday = wasmExports.gettimeofday)(e, t);
    Module._sscanf = (e, t, r2) => (Module._sscanf = wasmExports.sscanf)(e, t, r2);
    Module._get_call_result_type = (e, t, r2) => (Module._get_call_result_type = wasmExports.get_call_result_type)(e, t, r2);
    Module._HeapTupleHeaderGetDatum = (e) => (Module._HeapTupleHeaderGetDatum = wasmExports.HeapTupleHeaderGetDatum)(e);
    Module._wal_segment_close = (e) => (Module._wal_segment_close = wasmExports.wal_segment_close)(e);
    Module._wal_segment_open = (e, t, r2) => (Module._wal_segment_open = wasmExports.wal_segment_open)(e, t, r2);
    Module._GetFlushRecPtr = (e) => (Module._GetFlushRecPtr = wasmExports.GetFlushRecPtr)(e);
    Module._XLogReadRecord = (e, t) => (Module._XLogReadRecord = wasmExports.XLogReadRecord)(e, t);
    Module._RmgrNotFound = (e) => (Module._RmgrNotFound = wasmExports.RmgrNotFound)(e);
    Module._CacheRegisterRelcacheCallback = (e, t) => (Module._CacheRegisterRelcacheCallback = wasmExports.CacheRegisterRelcacheCallback)(e, t);
    Module._free_attrmap = (e) => (Module._free_attrmap = wasmExports.free_attrmap)(e);
    Module._BuildIndexInfo = (e) => (Module._BuildIndexInfo = wasmExports.BuildIndexInfo)(e);
    Module._hash_seq_term = (e) => (Module._hash_seq_term = wasmExports.hash_seq_term)(e);
    Module._PushActiveSnapshot = (e) => (Module._PushActiveSnapshot = wasmExports.PushActiveSnapshot)(e);
    Module._PopActiveSnapshot = () => (Module._PopActiveSnapshot = wasmExports.PopActiveSnapshot)();
    Module._MakePerTupleExprContext = (e) => (Module._MakePerTupleExprContext = wasmExports.MakePerTupleExprContext)(e);
    Module._ExecInitExpr = (e, t) => (Module._ExecInitExpr = wasmExports.ExecInitExpr)(e, t);
    Module._FreeExecutorState = (e) => (Module._FreeExecutorState = wasmExports.FreeExecutorState)(e);
    Module._list_member_oid = (e, t) => (Module._list_member_oid = wasmExports.list_member_oid)(e, t);
    Module._MemoryContextStrdup = (e, t) => (Module._MemoryContextStrdup = wasmExports.MemoryContextStrdup)(e, t);
    Module._pq_getmsgint = (e, t) => (Module._pq_getmsgint = wasmExports.pq_getmsgint)(e, t);
    Module._CreateExecutorState = () => (Module._CreateExecutorState = wasmExports.CreateExecutorState)();
    Module._ExecInitRangeTable = (e, t, r2) => (Module._ExecInitRangeTable = wasmExports.ExecInitRangeTable)(e, t, r2);
    Module._getTypeInputInfo = (e, t, r2) => (Module._getTypeInputInfo = wasmExports.getTypeInputInfo)(e, t, r2);
    Module._ExecStoreVirtualTuple = (e) => (Module._ExecStoreVirtualTuple = wasmExports.ExecStoreVirtualTuple)(e);
    Module._execute_attr_map_slot = (e, t, r2) => (Module._execute_attr_map_slot = wasmExports.execute_attr_map_slot)(e, t, r2);
    Module._slot_getsomeattrs_int = (e, t) => (Module._slot_getsomeattrs_int = wasmExports.slot_getsomeattrs_int)(e, t);
    Module._GetUserNameFromId = (e, t) => (Module._GetUserNameFromId = wasmExports.GetUserNameFromId)(e, t);
    Module._makeStringInfo = () => (Module._makeStringInfo = wasmExports.makeStringInfo)();
    Module._list_member_xid = (e, t) => (Module._list_member_xid = wasmExports.list_member_xid)(e, t);
    Module._lappend_xid = (e, t) => (Module._lappend_xid = wasmExports.lappend_xid)(e, t);
    Module._tuplestore_end = (e) => (Module._tuplestore_end = wasmExports.tuplestore_end)(e);
    Module._quote_literal_cstr = (e) => (Module._quote_literal_cstr = wasmExports.quote_literal_cstr)(e);
    Module._MakeSingleTupleTableSlot = (e, t) => (Module._MakeSingleTupleTableSlot = wasmExports.MakeSingleTupleTableSlot)(e, t);
    Module._ExecDropSingleTupleTableSlot = (e) => (Module._ExecDropSingleTupleTableSlot = wasmExports.ExecDropSingleTupleTableSlot)(e);
    Module._tuplestore_tuple_count = (e) => (Module._tuplestore_tuple_count = wasmExports.tuplestore_tuple_count)(e);
    Module._quote_identifier = (e) => (Module._quote_identifier = wasmExports.quote_identifier)(e);
    Module._BeginCopyFrom = (e, t, r2, a2, o2, s2, l2, n2) => (Module._BeginCopyFrom = wasmExports.BeginCopyFrom)(e, t, r2, a2, o2, s2, l2, n2);
    Module._array_contains_nulls = (e) => (Module._array_contains_nulls = wasmExports.array_contains_nulls)(e);
    Module._format_procedure = (e) => (Module._format_procedure = wasmExports.format_procedure)(e);
    Module._pg_detoast_datum_packed = (e) => (Module._pg_detoast_datum_packed = wasmExports.pg_detoast_datum_packed)(e);
    Module._cstring_to_text_with_len = (e, t) => (Module._cstring_to_text_with_len = wasmExports.cstring_to_text_with_len)(e, t);
    Module._GenerationContextCreate = (e, t, r2, a2, o2) => (Module._GenerationContextCreate = wasmExports.GenerationContextCreate)(e, t, r2, a2, o2);
    Module._BeginInternalSubTransaction = (e) => (Module._BeginInternalSubTransaction = wasmExports.BeginInternalSubTransaction)(e);
    Module._RollbackAndReleaseCurrentSubTransaction = () => (Module._RollbackAndReleaseCurrentSubTransaction = wasmExports.RollbackAndReleaseCurrentSubTransaction)();
    Module._CopyErrorData = () => (Module._CopyErrorData = wasmExports.CopyErrorData)();
    Module._FreeErrorData = (e) => (Module._FreeErrorData = wasmExports.FreeErrorData)(e);
    Module._RelidByRelfilenumber = (e, t) => (Module._RelidByRelfilenumber = wasmExports.RelidByRelfilenumber)(e, t);
    Module._RelationIdGetRelation = (e) => (Module._RelationIdGetRelation = wasmExports.RelationIdGetRelation)(e);
    Module._heap_deform_tuple = (e, t, r2, a2) => (Module._heap_deform_tuple = wasmExports.heap_deform_tuple)(e, t, r2, a2);
    Module._RelationClose = (e) => (Module._RelationClose = wasmExports.RelationClose)(e);
    Module._nocachegetattr = (e, t, r2) => (Module._nocachegetattr = wasmExports.nocachegetattr)(e, t, r2);
    Module._XLogReaderAllocate = (e, t, r2, a2) => (Module._XLogReaderAllocate = wasmExports.XLogReaderAllocate)(e, t, r2, a2);
    Module._XLogReaderFree = (e) => (Module._XLogReaderFree = wasmExports.XLogReaderFree)(e);
    Module._OutputPluginPrepareWrite = (e, t) => (Module._OutputPluginPrepareWrite = wasmExports.OutputPluginPrepareWrite)(e, t);
    Module._OutputPluginWrite = (e, t) => (Module._OutputPluginWrite = wasmExports.OutputPluginWrite)(e, t);
    Module._OutputPluginUpdateProgress = (e, t) => (Module._OutputPluginUpdateProgress = wasmExports.OutputPluginUpdateProgress)(e, t);
    Module._replorigin_by_oid = (e, t, r2) => (Module._replorigin_by_oid = wasmExports.replorigin_by_oid)(e, t, r2);
    Module._logicalrep_write_begin = (e, t) => (Module._logicalrep_write_begin = wasmExports.logicalrep_write_begin)(e, t);
    Module._logicalrep_write_commit = (e, t, r2) => (Module._logicalrep_write_commit = wasmExports.logicalrep_write_commit)(e, t, r2);
    Module._logicalrep_write_begin_prepare = (e, t) => (Module._logicalrep_write_begin_prepare = wasmExports.logicalrep_write_begin_prepare)(e, t);
    Module._logicalrep_write_prepare = (e, t, r2) => (Module._logicalrep_write_prepare = wasmExports.logicalrep_write_prepare)(e, t, r2);
    Module._logicalrep_write_commit_prepared = (e, t, r2) => (Module._logicalrep_write_commit_prepared = wasmExports.logicalrep_write_commit_prepared)(e, t, r2);
    Module._logicalrep_write_rollback_prepared = (e, t, r2, a2) => (Module._logicalrep_write_rollback_prepared = wasmExports.logicalrep_write_rollback_prepared)(e, t, r2, a2);
    Module._logicalrep_write_stream_prepare = (e, t, r2) => (Module._logicalrep_write_stream_prepare = wasmExports.logicalrep_write_stream_prepare)(e, t, r2);
    Module._logicalrep_write_origin = (e, t, r2) => (Module._logicalrep_write_origin = wasmExports.logicalrep_write_origin)(e, t, r2);
    Module._logicalrep_write_insert = (e, t, r2, a2, o2, s2) => (Module._logicalrep_write_insert = wasmExports.logicalrep_write_insert)(e, t, r2, a2, o2, s2);
    Module._logicalrep_write_update = (e, t, r2, a2, o2, s2, l2) => (Module._logicalrep_write_update = wasmExports.logicalrep_write_update)(e, t, r2, a2, o2, s2, l2);
    Module._logicalrep_write_delete = (e, t, r2, a2, o2, s2) => (Module._logicalrep_write_delete = wasmExports.logicalrep_write_delete)(e, t, r2, a2, o2, s2);
    Module._logicalrep_write_truncate = (e, t, r2, a2, o2, s2) => (Module._logicalrep_write_truncate = wasmExports.logicalrep_write_truncate)(e, t, r2, a2, o2, s2);
    Module._logicalrep_write_message = (e, t, r2, a2, o2, s2, l2) => (Module._logicalrep_write_message = wasmExports.logicalrep_write_message)(e, t, r2, a2, o2, s2, l2);
    Module._logicalrep_write_rel = (e, t, r2, a2) => (Module._logicalrep_write_rel = wasmExports.logicalrep_write_rel)(e, t, r2, a2);
    Module._logicalrep_write_typ = (e, t, r2) => (Module._logicalrep_write_typ = wasmExports.logicalrep_write_typ)(e, t, r2);
    Module._logicalrep_write_stream_start = (e, t, r2) => (Module._logicalrep_write_stream_start = wasmExports.logicalrep_write_stream_start)(e, t, r2);
    Module._logicalrep_write_stream_stop = (e) => (Module._logicalrep_write_stream_stop = wasmExports.logicalrep_write_stream_stop)(e);
    Module._logicalrep_write_stream_commit = (e, t, r2) => (Module._logicalrep_write_stream_commit = wasmExports.logicalrep_write_stream_commit)(e, t, r2);
    Module._logicalrep_write_stream_abort = (e, t, r2, a2, o2, s2) => (Module._logicalrep_write_stream_abort = wasmExports.logicalrep_write_stream_abort)(e, t, r2, a2, o2, s2);
    Module._ProcessWalRcvInterrupts = () => (Module._ProcessWalRcvInterrupts = wasmExports.ProcessWalRcvInterrupts)();
    Module._timestamptz_to_str = (e) => (Module._timestamptz_to_str = wasmExports.timestamptz_to_str)(e);
    Module._GetDatabaseEncodingName = () => (Module._GetDatabaseEncodingName = wasmExports.GetDatabaseEncodingName)();
    Module._PQconnectStartParams = (e, t, r2) => (Module._PQconnectStartParams = wasmExports.PQconnectStartParams)(e, t, r2);
    Module._PQstatus = (e) => (Module._PQstatus = wasmExports.PQstatus)(e);
    Module._PQsocket = (e) => (Module._PQsocket = wasmExports.PQsocket)(e);
    Module._PQconnectPoll = (e) => (Module._PQconnectPoll = wasmExports.PQconnectPoll)(e);
    Module._PQconnectionUsedPassword = (e) => (Module._PQconnectionUsedPassword = wasmExports.PQconnectionUsedPassword)(e);
    Module._PQfinish = (e) => (Module._PQfinish = wasmExports.PQfinish)(e);
    Module._PQresultStatus = (e) => (Module._PQresultStatus = wasmExports.PQresultStatus)(e);
    Module._PQclear = (e) => (Module._PQclear = wasmExports.PQclear)(e);
    Module._PQerrorMessage = (e) => (Module._PQerrorMessage = wasmExports.PQerrorMessage)(e);
    Module._pchomp = (e) => (Module._pchomp = wasmExports.pchomp)(e);
    Module._PQnfields = (e) => (Module._PQnfields = wasmExports.PQnfields)(e);
    Module._PQntuples = (e) => (Module._PQntuples = wasmExports.PQntuples)(e);
    Module._PQgetvalue = (e, t, r2) => (Module._PQgetvalue = wasmExports.PQgetvalue)(e, t, r2);
    Module._pg_strtoint32 = (e) => (Module._pg_strtoint32 = wasmExports.pg_strtoint32)(e);
    Module._PQconsumeInput = (e) => (Module._PQconsumeInput = wasmExports.PQconsumeInput)(e);
    Module._pg_lsn_in = (e) => (Module._pg_lsn_in = wasmExports.pg_lsn_in)(e);
    Module._DirectFunctionCall1Coll = (e, t, r2) => (Module._DirectFunctionCall1Coll = wasmExports.DirectFunctionCall1Coll)(e, t, r2);
    Module._PQgetisnull = (e, t, r2) => (Module._PQgetisnull = wasmExports.PQgetisnull)(e, t, r2);
    Module._tuplestore_begin_heap = (e, t, r2) => (Module._tuplestore_begin_heap = wasmExports.tuplestore_begin_heap)(e, t, r2);
    Module._TupleDescGetAttInMetadata = (e) => (Module._TupleDescGetAttInMetadata = wasmExports.TupleDescGetAttInMetadata)(e);
    Module._BuildTupleFromCStrings = (e, t) => (Module._BuildTupleFromCStrings = wasmExports.BuildTupleFromCStrings)(e, t);
    Module._tuplestore_puttuple = (e, t) => (Module._tuplestore_puttuple = wasmExports.tuplestore_puttuple)(e, t);
    Module._PQresultErrorField = (e, t) => (Module._PQresultErrorField = wasmExports.PQresultErrorField)(e, t);
    Module._PQsendQuery = (e, t) => (Module._PQsendQuery = wasmExports.PQsendQuery)(e, t);
    Module._PQisBusy = (e) => (Module._PQisBusy = wasmExports.PQisBusy)(e);
    Module._PQgetResult = (e) => (Module._PQgetResult = wasmExports.PQgetResult)(e);
    Module._ResourceOwnerDelete = (e) => (Module._ResourceOwnerDelete = wasmExports.ResourceOwnerDelete)(e);
    Module._CreateDestReceiver = (e) => (Module._CreateDestReceiver = wasmExports.CreateDestReceiver)(e);
    Module._defGetString = (e) => (Module._defGetString = wasmExports.defGetString)(e);
    Module._pg_md5_encrypt = (e, t, r2, a2, o2) => (Module._pg_md5_encrypt = wasmExports.pg_md5_encrypt)(e, t, r2, a2, o2);
    Module._plain_crypt_verify = (e, t, r2, a2) => (Module._plain_crypt_verify = wasmExports.plain_crypt_verify)(e, t, r2, a2);
    Module._pg_b64_enc_len = (e) => (Module._pg_b64_enc_len = wasmExports.pg_b64_enc_len)(e);
    Module._pg_b64_encode = (e, t, r2, a2) => (Module._pg_b64_encode = wasmExports.pg_b64_encode)(e, t, r2, a2);
    Module._pg_b64_dec_len = (e) => (Module._pg_b64_dec_len = wasmExports.pg_b64_dec_len)(e);
    Module._pg_b64_decode = (e, t, r2, a2) => (Module._pg_b64_decode = wasmExports.pg_b64_decode)(e, t, r2, a2);
    Module._pg_hmac_create = (e) => (Module._pg_hmac_create = wasmExports.pg_hmac_create)(e);
    Module._pg_hmac_init = (e, t, r2) => (Module._pg_hmac_init = wasmExports.pg_hmac_init)(e, t, r2);
    Module._pg_hmac_update = (e, t, r2) => (Module._pg_hmac_update = wasmExports.pg_hmac_update)(e, t, r2);
    Module._pg_hmac_final = (e, t, r2) => (Module._pg_hmac_final = wasmExports.pg_hmac_final)(e, t, r2);
    Module._pg_hmac_error = (e) => (Module._pg_hmac_error = wasmExports.pg_hmac_error)(e);
    Module._pg_hmac_free = (e) => (Module._pg_hmac_free = wasmExports.pg_hmac_free)(e);
    Module._scram_H = (e, t, r2, a2, o2) => (Module._scram_H = wasmExports.scram_H)(e, t, r2, a2, o2);
    Module._pg_saslprep = (e, t) => (Module._pg_saslprep = wasmExports.pg_saslprep)(e, t);
    Module._scram_build_secret = (e, t, r2, a2, o2, s2, l2) => (Module._scram_build_secret = wasmExports.scram_build_secret)(e, t, r2, a2, o2, s2, l2);
    Module._scram_SaltedPassword = (e, t, r2, a2, o2, s2, l2, n2) => (Module._scram_SaltedPassword = wasmExports.scram_SaltedPassword)(e, t, r2, a2, o2, s2, l2, n2);
    Module._scram_ServerKey = (e, t, r2, a2, o2) => (Module._scram_ServerKey = wasmExports.scram_ServerKey)(e, t, r2, a2, o2);
    Module._strtol = (e, t, r2) => (Module._strtol = wasmExports.strtol)(e, t, r2);
    Module._replace_percent_placeholders = (e, t, r2, a2) => (Module._replace_percent_placeholders = wasmExports.replace_percent_placeholders)(e, t, r2, a2);
    Module._fgets = (e, t, r2) => (Module._fgets = wasmExports.fgets)(e, t, r2);
    Module._explicit_bzero = (e, t) => (Module._explicit_bzero = wasmExports.explicit_bzero)(e, t);
    Module._wait_result_to_str = (e) => (Module._wait_result_to_str = wasmExports.wait_result_to_str)(e);
    Module._pg_strip_crlf = (e) => (Module._pg_strip_crlf = wasmExports.pg_strip_crlf)(e);
    Module._geteuid = () => (Module._geteuid = wasmExports.geteuid)();
    Module._getpeereid = (e, t, r2) => (Module._getpeereid = wasmExports.getpeereid)(e, t, r2);
    Module._pg_getaddrinfo_all = (e, t, r2, a2) => (Module._pg_getaddrinfo_all = wasmExports.pg_getaddrinfo_all)(e, t, r2, a2);
    Module._socket = (e, t, r2) => (Module._socket = wasmExports.socket)(e, t, r2);
    Module._connect = (e, t, r2) => (Module._connect = wasmExports.connect)(e, t, r2);
    Module._recv = (e, t, r2, a2) => (Module._recv = wasmExports.recv)(e, t, r2, a2);
    Module._pg_freeaddrinfo_all = (e, t) => (Module._pg_freeaddrinfo_all = wasmExports.pg_freeaddrinfo_all)(e, t);
    Module._pq_sendtext = (e, t, r2) => (Module._pq_sendtext = wasmExports.pq_sendtext)(e, t, r2);
    Module._pq_sendfloat4 = (e, t) => (Module._pq_sendfloat4 = wasmExports.pq_sendfloat4)(e, t);
    Module._pq_sendfloat8 = (e, t) => (Module._pq_sendfloat8 = wasmExports.pq_sendfloat8)(e, t);
    Module._pq_begintypsend = (e) => (Module._pq_begintypsend = wasmExports.pq_begintypsend)(e);
    Module._pq_endtypsend = (e) => (Module._pq_endtypsend = wasmExports.pq_endtypsend)(e);
    Module._pq_getmsgfloat4 = (e) => (Module._pq_getmsgfloat4 = wasmExports.pq_getmsgfloat4)(e);
    Module._pq_getmsgfloat8 = (e) => (Module._pq_getmsgfloat8 = wasmExports.pq_getmsgfloat8)(e);
    Module._pq_getmsgtext = (e, t, r2) => (Module._pq_getmsgtext = wasmExports.pq_getmsgtext)(e, t, r2);
    Module._feof = (e) => (Module._feof = wasmExports.feof)(e);
    Module._pg_mb2wchar_with_len = (e, t, r2) => (Module._pg_mb2wchar_with_len = wasmExports.pg_mb2wchar_with_len)(e, t, r2);
    Module._pg_regcomp = (e, t, r2, a2, o2) => (Module._pg_regcomp = wasmExports.pg_regcomp)(e, t, r2, a2, o2);
    Module._pg_regerror = (e, t, r2, a2) => (Module._pg_regerror = wasmExports.pg_regerror)(e, t, r2, a2);
    Module._get_role_oid = (e, t) => (Module._get_role_oid = wasmExports.get_role_oid)(e, t);
    Module._strcat = (e, t) => (Module._strcat = wasmExports.strcat)(e, t);
    Module._sigemptyset = (e) => (Module._sigemptyset = wasmExports.sigemptyset)(e);
    Module._be_lo_unlink = (e) => (Module._be_lo_unlink = wasmExports.be_lo_unlink)(e);
    Module._object_ownercheck = (e, t, r2) => (Module._object_ownercheck = wasmExports.object_ownercheck)(e, t, r2);
    Module._text_to_cstring_buffer = (e, t, r2) => (Module._text_to_cstring_buffer = wasmExports.text_to_cstring_buffer)(e, t, r2);
    Module._setsockopt = (e, t, r2, a2, o2) => (Module._setsockopt = wasmExports.setsockopt)(e, t, r2, a2, o2);
    Module._getsockname = (e, t, r2) => (Module._getsockname = wasmExports.getsockname)(e, t, r2);
    Module._pq_recvbuf_fill = (e, t) => (Module._pq_recvbuf_fill = wasmExports.pq_recvbuf_fill)(e, t);
    Module._getsockopt = (e, t, r2, a2, o2) => (Module._getsockopt = wasmExports.getsockopt)(e, t, r2, a2, o2);
    Module._getmissingattr = (e, t, r2) => (Module._getmissingattr = wasmExports.getmissingattr)(e, t, r2);
    Module._get_rel_relkind = (e) => (Module._get_rel_relkind = wasmExports.get_rel_relkind)(e);
    Module._MemoryContextSetIdentifier = (e, t) => (Module._MemoryContextSetIdentifier = wasmExports.MemoryContextSetIdentifier)(e, t);
    Module._MemoryContextSetParent = (e, t) => (Module._MemoryContextSetParent = wasmExports.MemoryContextSetParent)(e, t);
    Module._find_base_rel = (e, t) => (Module._find_base_rel = wasmExports.find_base_rel)(e, t);
    Module._bms_equal = (e, t) => (Module._bms_equal = wasmExports.bms_equal)(e, t);
    Module._bms_num_members = (e) => (Module._bms_num_members = wasmExports.bms_num_members)(e);
    Module._fmgr_info_copy = (e, t, r2) => (Module._fmgr_info_copy = wasmExports.fmgr_info_copy)(e, t, r2);
    Module._fmgr_info_cxt = (e, t, r2) => (Module._fmgr_info_cxt = wasmExports.fmgr_info_cxt)(e, t, r2);
    Module._get_typlenbyvalalign = (e, t, r2, a2) => (Module._get_typlenbyvalalign = wasmExports.get_typlenbyvalalign)(e, t, r2, a2);
    Module._deconstruct_array = (e, t, r2, a2, o2, s2, l2, n2) => (Module._deconstruct_array = wasmExports.deconstruct_array)(e, t, r2, a2, o2, s2, l2, n2);
    Module._datumCopy = (e, t, r2) => (Module._datumCopy = wasmExports.datumCopy)(e, t, r2);
    Module._qsort_arg = (e, t, r2, a2, o2) => (Module._qsort_arg = wasmExports.qsort_arg)(e, t, r2, a2, o2);
    Module._FunctionCall2Coll = (e, t, r2, a2) => (Module._FunctionCall2Coll = wasmExports.FunctionCall2Coll)(e, t, r2, a2);
    Module._datumIsEqual = (e, t, r2, a2) => (Module._datumIsEqual = wasmExports.datumIsEqual)(e, t, r2, a2);
    Module._bms_overlap = (e, t) => (Module._bms_overlap = wasmExports.bms_overlap)(e, t);
    Module._ExecPrepareExpr = (e, t) => (Module._ExecPrepareExpr = wasmExports.ExecPrepareExpr)(e, t);
    Module._RegisterSnapshot = (e) => (Module._RegisterSnapshot = wasmExports.RegisterSnapshot)(e);
    Module._UnregisterSnapshot = (e) => (Module._UnregisterSnapshot = wasmExports.UnregisterSnapshot)(e);
    Module._get_fn_expr_argtype = (e, t) => (Module._get_fn_expr_argtype = wasmExports.get_fn_expr_argtype)(e, t);
    Module._get_opfamily_member = (e, t, r2, a2) => (Module._get_opfamily_member = wasmExports.get_opfamily_member)(e, t, r2, a2);
    Module._init_MultiFuncCall = (e) => (Module._init_MultiFuncCall = wasmExports.init_MultiFuncCall)(e);
    Module._per_MultiFuncCall = (e) => (Module._per_MultiFuncCall = wasmExports.per_MultiFuncCall)(e);
    Module._end_MultiFuncCall = (e, t) => (Module._end_MultiFuncCall = wasmExports.end_MultiFuncCall)(e, t);
    Module._textToQualifiedNameList = (e) => (Module._textToQualifiedNameList = wasmExports.textToQualifiedNameList)(e);
    Module._FunctionCall1Coll = (e, t, r2) => (Module._FunctionCall1Coll = wasmExports.FunctionCall1Coll)(e, t, r2);
    Module._DirectFunctionCall4Coll = (e, t, r2, a2, o2, s2) => (Module._DirectFunctionCall4Coll = wasmExports.DirectFunctionCall4Coll)(e, t, r2, a2, o2, s2);
    Module._pg_mblen = (e) => (Module._pg_mblen = wasmExports.pg_mblen)(e);
    Module._tsearch_readline_begin = (e, t) => (Module._tsearch_readline_begin = wasmExports.tsearch_readline_begin)(e, t);
    Module._tsearch_readline = (e) => (Module._tsearch_readline = wasmExports.tsearch_readline)(e);
    Module._t_isspace = (e) => (Module._t_isspace = wasmExports.t_isspace)(e);
    Module._lowerstr = (e) => (Module._lowerstr = wasmExports.lowerstr)(e);
    Module._tsearch_readline_end = (e) => (Module._tsearch_readline_end = wasmExports.tsearch_readline_end)(e);
    Module._t_isdigit = (e) => (Module._t_isdigit = wasmExports.t_isdigit)(e);
    Module._pnstrdup = (e, t) => (Module._pnstrdup = wasmExports.pnstrdup)(e, t);
    Module._get_tsearch_config_filename = (e, t) => (Module._get_tsearch_config_filename = wasmExports.get_tsearch_config_filename)(e, t);
    Module._lookup_ts_dictionary_cache = (e) => (Module._lookup_ts_dictionary_cache = wasmExports.lookup_ts_dictionary_cache)(e);
    Module._FunctionCall4Coll = (e, t, r2, a2, o2, s2) => (Module._FunctionCall4Coll = wasmExports.FunctionCall4Coll)(e, t, r2, a2, o2, s2);
    Module._t_isalnum = (e) => (Module._t_isalnum = wasmExports.t_isalnum)(e);
    Module._isalnum = (e) => (Module._isalnum = wasmExports.isalnum)(e);
    Module._pg_any_to_server = (e, t, r2) => (Module._pg_any_to_server = wasmExports.pg_any_to_server)(e, t, r2);
    Module._lowerstr_with_len = (e, t) => (Module._lowerstr_with_len = wasmExports.lowerstr_with_len)(e, t);
    Module._tolower = (e) => (Module._tolower = wasmExports.tolower)(e);
    Module._readstoplist = (e, t, r2) => (Module._readstoplist = wasmExports.readstoplist)(e, t, r2);
    Module._searchstoplist = (e, t) => (Module._searchstoplist = wasmExports.searchstoplist)(e, t);
    Module._GetDatabaseEncoding = () => (Module._GetDatabaseEncoding = wasmExports.GetDatabaseEncoding)();
    Module._vacuum_delay_point = () => (Module._vacuum_delay_point = wasmExports.vacuum_delay_point)();
    Module._get_restriction_variable = (e, t, r2, a2, o2, s2) => (Module._get_restriction_variable = wasmExports.get_restriction_variable)(e, t, r2, a2, o2, s2);
    Module._get_attstatsslot = (e, t, r2, a2, o2) => (Module._get_attstatsslot = wasmExports.get_attstatsslot)(e, t, r2, a2, o2);
    Module._free_attstatsslot = (e) => (Module._free_attstatsslot = wasmExports.free_attstatsslot)(e);
    Module._Float8GetDatum = (e) => (Module._Float8GetDatum = wasmExports.Float8GetDatum)(e);
    Module._ExecReScan = (e) => (Module._ExecReScan = wasmExports.ExecReScan)(e);
    Module._ExecAsyncResponse = (e) => (Module._ExecAsyncResponse = wasmExports.ExecAsyncResponse)(e);
    Module._ExecAsyncRequestDone = (e, t) => (Module._ExecAsyncRequestDone = wasmExports.ExecAsyncRequestDone)(e, t);
    Module._ExecAsyncRequestPending = (e) => (Module._ExecAsyncRequestPending = wasmExports.ExecAsyncRequestPending)(e);
    Module._tuplesort_end = (e) => (Module._tuplesort_end = wasmExports.tuplesort_end)(e);
    Module._ExecInitExprList = (e, t) => (Module._ExecInitExprList = wasmExports.ExecInitExprList)(e, t);
    Module._fmgr_info = (e, t) => (Module._fmgr_info = wasmExports.fmgr_info)(e, t);
    Module._get_typlenbyval = (e, t, r2) => (Module._get_typlenbyval = wasmExports.get_typlenbyval)(e, t, r2);
    Module._ExecForceStoreHeapTuple = (e, t, r2) => (Module._ExecForceStoreHeapTuple = wasmExports.ExecForceStoreHeapTuple)(e, t, r2);
    Module._tuplesort_performsort = (e) => (Module._tuplesort_performsort = wasmExports.tuplesort_performsort)(e);
    Module._tuplesort_begin_heap = (e, t, r2, a2, o2, s2, l2, n2, _2) => (Module._tuplesort_begin_heap = wasmExports.tuplesort_begin_heap)(e, t, r2, a2, o2, s2, l2, n2, _2);
    Module._MemoryContextMemAllocated = (e, t) => (Module._MemoryContextMemAllocated = wasmExports.MemoryContextMemAllocated)(e, t);
    Module._tuplesort_gettupleslot = (e, t, r2, a2, o2) => (Module._tuplesort_gettupleslot = wasmExports.tuplesort_gettupleslot)(e, t, r2, a2, o2);
    Module._tuplesort_puttupleslot = (e, t) => (Module._tuplesort_puttupleslot = wasmExports.tuplesort_puttupleslot)(e, t);
    Module._ExecStoreAllNullTuple = (e) => (Module._ExecStoreAllNullTuple = wasmExports.ExecStoreAllNullTuple)(e);
    Module._MakeExpandedObjectReadOnlyInternal = (e) => (Module._MakeExpandedObjectReadOnlyInternal = wasmExports.MakeExpandedObjectReadOnlyInternal)(e);
    Module._BlessTupleDesc = (e) => (Module._BlessTupleDesc = wasmExports.BlessTupleDesc)(e);
    Module._pg_detoast_datum_copy = (e) => (Module._pg_detoast_datum_copy = wasmExports.pg_detoast_datum_copy)(e);
    Module._construct_md_array = (e, t, r2, a2, o2, s2, l2, n2, _2) => (Module._construct_md_array = wasmExports.construct_md_array)(e, t, r2, a2, o2, s2, l2, n2, _2);
    Module._ArrayGetNItems = (e, t) => (Module._ArrayGetNItems = wasmExports.ArrayGetNItems)(e, t);
    Module._construct_empty_array = (e) => (Module._construct_empty_array = wasmExports.construct_empty_array)(e);
    Module._DatumGetEOHP = (e) => (Module._DatumGetEOHP = wasmExports.DatumGetEOHP)(e);
    Module._expanded_record_fetch_tupdesc = (e) => (Module._expanded_record_fetch_tupdesc = wasmExports.expanded_record_fetch_tupdesc)(e);
    Module._expanded_record_fetch_field = (e, t, r2) => (Module._expanded_record_fetch_field = wasmExports.expanded_record_fetch_field)(e, t, r2);
    Module._execute_attr_map_tuple = (e, t) => (Module._execute_attr_map_tuple = wasmExports.execute_attr_map_tuple)(e, t);
    Module._MemoryContextAllocExtended = (e, t, r2) => (Module._MemoryContextAllocExtended = wasmExports.MemoryContextAllocExtended)(e, t, r2);
    Module._lookup_rowtype_tupdesc_domain = (e, t, r2) => (Module._lookup_rowtype_tupdesc_domain = wasmExports.lookup_rowtype_tupdesc_domain)(e, t, r2);
    Module._MemoryContextGetParent = (e) => (Module._MemoryContextGetParent = wasmExports.MemoryContextGetParent)(e);
    Module._DeleteExpandedObject = (e) => (Module._DeleteExpandedObject = wasmExports.DeleteExpandedObject)(e);
    Module._InstrAlloc = (e, t, r2) => (Module._InstrAlloc = wasmExports.InstrAlloc)(e, t, r2);
    Module._ExprEvalPushStep = (e, t) => (Module._ExprEvalPushStep = wasmExports.ExprEvalPushStep)(e, t);
    Module._getTypeOutputInfo = (e, t, r2) => (Module._getTypeOutputInfo = wasmExports.getTypeOutputInfo)(e, t, r2);
    Module._ExecInitExprWithParams = (e, t) => (Module._ExecInitExprWithParams = wasmExports.ExecInitExprWithParams)(e, t);
    Module._ExecOpenScanRelation = (e, t, r2) => (Module._ExecOpenScanRelation = wasmExports.ExecOpenScanRelation)(e, t, r2);
    Module._FreeExprContext = (e, t) => (Module._FreeExprContext = wasmExports.FreeExprContext)(e, t);
    Module._CreateExprContext = (e) => (Module._CreateExprContext = wasmExports.CreateExprContext)(e);
    Module._ExecGetReturningSlot = (e, t) => (Module._ExecGetReturningSlot = wasmExports.ExecGetReturningSlot)(e, t);
    Module._build_attrmap_by_name_if_req = (e, t, r2) => (Module._build_attrmap_by_name_if_req = wasmExports.build_attrmap_by_name_if_req)(e, t, r2);
    Module._ExecGetResultRelCheckAsUser = (e, t) => (Module._ExecGetResultRelCheckAsUser = wasmExports.ExecGetResultRelCheckAsUser)(e, t);
    Module._InstrEndLoop = (e) => (Module._InstrEndLoop = wasmExports.InstrEndLoop)(e);
    Module._ExecStoreHeapTuple = (e, t, r2) => (Module._ExecStoreHeapTuple = wasmExports.ExecStoreHeapTuple)(e, t, r2);
    Module._get_partition_ancestors = (e) => (Module._get_partition_ancestors = wasmExports.get_partition_ancestors)(e);
    Module._pull_varattnos = (e, t, r2) => (Module._pull_varattnos = wasmExports.pull_varattnos)(e, t, r2);
    Module._ExecFindJunkAttributeInTlist = (e, t) => (Module._ExecFindJunkAttributeInTlist = wasmExports.ExecFindJunkAttributeInTlist)(e, t);
    Module._visibilitymap_get_status = (e, t, r2) => (Module._visibilitymap_get_status = wasmExports.visibilitymap_get_status)(e, t, r2);
    Module._index_deform_tuple = (e, t, r2, a2) => (Module._index_deform_tuple = wasmExports.index_deform_tuple)(e, t, r2, a2);
    Module._LaunchParallelWorkers = (e) => (Module._LaunchParallelWorkers = wasmExports.LaunchParallelWorkers)(e);
    Module._standard_ExecutorStart = (e, t) => (Module._standard_ExecutorStart = wasmExports.standard_ExecutorStart)(e, t);
    Module._GetCommandTagName = (e) => (Module._GetCommandTagName = wasmExports.GetCommandTagName)(e);
    Module._standard_ExecutorRun = (e, t, r2, a2) => (Module._standard_ExecutorRun = wasmExports.standard_ExecutorRun)(e, t, r2, a2);
    Module._EnterParallelMode = () => (Module._EnterParallelMode = wasmExports.EnterParallelMode)();
    Module._ExitParallelMode = () => (Module._ExitParallelMode = wasmExports.ExitParallelMode)();
    Module._standard_ExecutorFinish = (e) => (Module._standard_ExecutorFinish = wasmExports.standard_ExecutorFinish)(e);
    Module._standard_ExecutorEnd = (e) => (Module._standard_ExecutorEnd = wasmExports.standard_ExecutorEnd)(e);
    Module._MakeTupleTableSlot = (e, t) => (Module._MakeTupleTableSlot = wasmExports.MakeTupleTableSlot)(e, t);
    Module._CreateParallelContext = (e, t, r2) => (Module._CreateParallelContext = wasmExports.CreateParallelContext)(e, t, r2);
    Module._InitializeParallelDSM = (e) => (Module._InitializeParallelDSM = wasmExports.InitializeParallelDSM)(e);
    Module._WaitForParallelWorkersToFinish = (e) => (Module._WaitForParallelWorkersToFinish = wasmExports.WaitForParallelWorkersToFinish)(e);
    Module._DestroyParallelContext = (e) => (Module._DestroyParallelContext = wasmExports.DestroyParallelContext)(e);
    Module._SPI_connect = () => (Module._SPI_connect = wasmExports.SPI_connect)();
    Module._SPI_connect_ext = (e) => (Module._SPI_connect_ext = wasmExports.SPI_connect_ext)(e);
    Module._SPI_finish = () => (Module._SPI_finish = wasmExports.SPI_finish)();
    Module._SPI_commit = () => (Module._SPI_commit = wasmExports.SPI_commit)();
    Module._ReThrowError = (e) => (Module._ReThrowError = wasmExports.ReThrowError)(e);
    Module._SPI_commit_and_chain = () => (Module._SPI_commit_and_chain = wasmExports.SPI_commit_and_chain)();
    Module._SPI_rollback = () => (Module._SPI_rollback = wasmExports.SPI_rollback)();
    Module._SPI_rollback_and_chain = () => (Module._SPI_rollback_and_chain = wasmExports.SPI_rollback_and_chain)();
    Module._SPI_execute = (e, t, r2) => (Module._SPI_execute = wasmExports.SPI_execute)(e, t, r2);
    Module._EnsurePortalSnapshotExists = () => (Module._EnsurePortalSnapshotExists = wasmExports.EnsurePortalSnapshotExists)();
    Module._SPI_freetuptable = (e) => (Module._SPI_freetuptable = wasmExports.SPI_freetuptable)(e);
    Module._ReleaseCachedPlan = (e, t) => (Module._ReleaseCachedPlan = wasmExports.ReleaseCachedPlan)(e, t);
    Module._SPI_exec = (e, t) => (Module._SPI_exec = wasmExports.SPI_exec)(e, t);
    Module._SPI_execute_extended = (e, t) => (Module._SPI_execute_extended = wasmExports.SPI_execute_extended)(e, t);
    Module._makeParamList = (e) => (Module._makeParamList = wasmExports.makeParamList)(e);
    Module._SPI_execp = (e, t, r2, a2) => (Module._SPI_execp = wasmExports.SPI_execp)(e, t, r2, a2);
    Module._SPI_execute_plan_extended = (e, t) => (Module._SPI_execute_plan_extended = wasmExports.SPI_execute_plan_extended)(e, t);
    Module._SPI_execute_plan_with_paramlist = (e, t, r2, a2) => (Module._SPI_execute_plan_with_paramlist = wasmExports.SPI_execute_plan_with_paramlist)(e, t, r2, a2);
    Module._SPI_prepare = (e, t, r2) => (Module._SPI_prepare = wasmExports.SPI_prepare)(e, t, r2);
    Module._SPI_prepare_extended = (e, t) => (Module._SPI_prepare_extended = wasmExports.SPI_prepare_extended)(e, t);
    Module._SPI_keepplan = (e) => (Module._SPI_keepplan = wasmExports.SPI_keepplan)(e);
    Module._SPI_freeplan = (e) => (Module._SPI_freeplan = wasmExports.SPI_freeplan)(e);
    Module._SPI_copytuple = (e) => (Module._SPI_copytuple = wasmExports.SPI_copytuple)(e);
    Module._SPI_returntuple = (e, t) => (Module._SPI_returntuple = wasmExports.SPI_returntuple)(e, t);
    Module._SPI_fnumber = (e, t) => (Module._SPI_fnumber = wasmExports.SPI_fnumber)(e, t);
    Module._SPI_fname = (e, t) => (Module._SPI_fname = wasmExports.SPI_fname)(e, t);
    Module._SPI_getvalue = (e, t, r2) => (Module._SPI_getvalue = wasmExports.SPI_getvalue)(e, t, r2);
    Module._SPI_getbinval = (e, t, r2, a2) => (Module._SPI_getbinval = wasmExports.SPI_getbinval)(e, t, r2, a2);
    Module._SPI_gettype = (e, t) => (Module._SPI_gettype = wasmExports.SPI_gettype)(e, t);
    Module._SPI_gettypeid = (e, t) => (Module._SPI_gettypeid = wasmExports.SPI_gettypeid)(e, t);
    Module._SPI_getrelname = (e) => (Module._SPI_getrelname = wasmExports.SPI_getrelname)(e);
    Module._SPI_palloc = (e) => (Module._SPI_palloc = wasmExports.SPI_palloc)(e);
    Module._SPI_datumTransfer = (e, t, r2) => (Module._SPI_datumTransfer = wasmExports.SPI_datumTransfer)(e, t, r2);
    Module._datumTransfer = (e, t, r2) => (Module._datumTransfer = wasmExports.datumTransfer)(e, t, r2);
    Module._SPI_cursor_open_with_paramlist = (e, t, r2, a2) => (Module._SPI_cursor_open_with_paramlist = wasmExports.SPI_cursor_open_with_paramlist)(e, t, r2, a2);
    Module._SPI_cursor_parse_open = (e, t, r2) => (Module._SPI_cursor_parse_open = wasmExports.SPI_cursor_parse_open)(e, t, r2);
    Module._SPI_cursor_find = (e) => (Module._SPI_cursor_find = wasmExports.SPI_cursor_find)(e);
    Module._SPI_cursor_fetch = (e, t, r2) => (Module._SPI_cursor_fetch = wasmExports.SPI_cursor_fetch)(e, t, r2);
    Module._SPI_scroll_cursor_fetch = (e, t, r2) => (Module._SPI_scroll_cursor_fetch = wasmExports.SPI_scroll_cursor_fetch)(e, t, r2);
    Module._SPI_scroll_cursor_move = (e, t, r2) => (Module._SPI_scroll_cursor_move = wasmExports.SPI_scroll_cursor_move)(e, t, r2);
    Module._SPI_cursor_close = (e) => (Module._SPI_cursor_close = wasmExports.SPI_cursor_close)(e);
    Module._SPI_result_code_string = (e) => (Module._SPI_result_code_string = wasmExports.SPI_result_code_string)(e);
    Module._SPI_plan_get_plan_sources = (e) => (Module._SPI_plan_get_plan_sources = wasmExports.SPI_plan_get_plan_sources)(e);
    Module._SPI_plan_get_cached_plan = (e) => (Module._SPI_plan_get_cached_plan = wasmExports.SPI_plan_get_cached_plan)(e);
    Module._geterrposition = () => (Module._geterrposition = wasmExports.geterrposition)();
    Module._internalerrposition = (e) => (Module._internalerrposition = wasmExports.internalerrposition)(e);
    Module._internalerrquery = (e) => (Module._internalerrquery = wasmExports.internalerrquery)(e);
    Module._SPI_register_trigger_data = (e) => (Module._SPI_register_trigger_data = wasmExports.SPI_register_trigger_data)(e);
    Module._EOH_get_flat_size = (e) => (Module._EOH_get_flat_size = wasmExports.EOH_get_flat_size)(e);
    Module._EOH_flatten_into = (e, t, r2) => (Module._EOH_flatten_into = wasmExports.EOH_flatten_into)(e, t, r2);
    Module._ExecFetchSlotHeapTuple = (e, t, r2) => (Module._ExecFetchSlotHeapTuple = wasmExports.ExecFetchSlotHeapTuple)(e, t, r2);
    Module._InputFunctionCall = (e, t, r2, a2) => (Module._InputFunctionCall = wasmExports.InputFunctionCall)(e, t, r2, a2);
    Module._convert_tuples_by_position = (e, t, r2) => (Module._convert_tuples_by_position = wasmExports.convert_tuples_by_position)(e, t, r2);
    Module._SetTuplestoreDestReceiverParams = (e, t, r2, a2, o2, s2) => (Module._SetTuplestoreDestReceiverParams = wasmExports.SetTuplestoreDestReceiverParams)(e, t, r2, a2, o2, s2);
    Module._detoast_external_attr = (e) => (Module._detoast_external_attr = wasmExports.detoast_external_attr)(e);
    Module._bms_nonempty_difference = (e, t) => (Module._bms_nonempty_difference = wasmExports.bms_nonempty_difference)(e, t);
    Module._table_parallelscan_estimate = (e, t) => (Module._table_parallelscan_estimate = wasmExports.table_parallelscan_estimate)(e, t);
    Module._table_parallelscan_initialize = (e, t, r2) => (Module._table_parallelscan_initialize = wasmExports.table_parallelscan_initialize)(e, t, r2);
    Module._table_beginscan_parallel = (e, t) => (Module._table_beginscan_parallel = wasmExports.table_beginscan_parallel)(e, t);
    Module._BufferUsageAccumDiff = (e, t, r2) => (Module._BufferUsageAccumDiff = wasmExports.BufferUsageAccumDiff)(e, t, r2);
    Module._WalUsageAccumDiff = (e, t, r2) => (Module._WalUsageAccumDiff = wasmExports.WalUsageAccumDiff)(e, t, r2);
    Module._InstrUpdateTupleCount = (e, t) => (Module._InstrUpdateTupleCount = wasmExports.InstrUpdateTupleCount)(e, t);
    Module._tuplesort_reset = (e) => (Module._tuplesort_reset = wasmExports.tuplesort_reset)(e);
    Module._get_call_expr_argtype = (e, t) => (Module._get_call_expr_argtype = wasmExports.get_call_expr_argtype)(e, t);
    Module._get_typtype = (e) => (Module._get_typtype = wasmExports.get_typtype)(e);
    Module._pull_var_clause = (e, t) => (Module._pull_var_clause = wasmExports.pull_var_clause)(e, t);
    Module._bms_is_subset = (e, t) => (Module._bms_is_subset = wasmExports.bms_is_subset)(e, t);
    Module._bms_membership = (e) => (Module._bms_membership = wasmExports.bms_membership)(e);
    Module._make_restrictinfo = (e, t, r2, a2, o2, s2, l2, n2, _2, m2) => (Module._make_restrictinfo = wasmExports.make_restrictinfo)(e, t, r2, a2, o2, s2, l2, n2, _2, m2);
    Module._GetSysCacheHashValue = (e, t, r2, a2, o2) => (Module._GetSysCacheHashValue = wasmExports.GetSysCacheHashValue)(e, t, r2, a2, o2);
    Module._tlist_member = (e, t) => (Module._tlist_member = wasmExports.tlist_member)(e, t);
    Module._add_path = (e, t) => (Module._add_path = wasmExports.add_path)(e, t);
    Module._contain_mutable_functions = (e) => (Module._contain_mutable_functions = wasmExports.contain_mutable_functions)(e);
    Module._make_orclause = (e) => (Module._make_orclause = wasmExports.make_orclause)(e);
    Module._extract_actual_clauses = (e, t) => (Module._extract_actual_clauses = wasmExports.extract_actual_clauses)(e, t);
    Module._cost_sort = (e, t, r2, a2, o2, s2, l2, n2, _2) => (Module._cost_sort = wasmExports.cost_sort)(e, t, r2, a2, o2, s2, l2, n2, _2);
    Module._pathkeys_contained_in = (e, t) => (Module._pathkeys_contained_in = wasmExports.pathkeys_contained_in)(e, t);
    Module._change_plan_targetlist = (e, t, r2) => (Module._change_plan_targetlist = wasmExports.change_plan_targetlist)(e, t, r2);
    Module._make_foreignscan = (e, t, r2, a2, o2, s2, l2, n2) => (Module._make_foreignscan = wasmExports.make_foreignscan)(e, t, r2, a2, o2, s2, l2, n2);
    Module._list_member_ptr = (e, t) => (Module._list_member_ptr = wasmExports.list_member_ptr)(e, t);
    Module._clamp_row_est = (e) => (Module._clamp_row_est = wasmExports.clamp_row_est)(e);
    Module._standard_planner = (e, t, r2, a2) => (Module._standard_planner = wasmExports.standard_planner)(e, t, r2, a2);
    Module._estimate_expression_value = (e, t) => (Module._estimate_expression_value = wasmExports.estimate_expression_value)(e, t);
    Module._add_new_columns_to_pathtarget = (e, t) => (Module._add_new_columns_to_pathtarget = wasmExports.add_new_columns_to_pathtarget)(e, t);
    Module._get_sortgroupref_clause_noerr = (e, t) => (Module._get_sortgroupref_clause_noerr = wasmExports.get_sortgroupref_clause_noerr)(e, t);
    Module._get_agg_clause_costs = (e, t, r2) => (Module._get_agg_clause_costs = wasmExports.get_agg_clause_costs)(e, t, r2);
    Module._grouping_is_sortable = (e) => (Module._grouping_is_sortable = wasmExports.grouping_is_sortable)(e);
    Module._create_sort_path = (e, t, r2, a2, o2) => (Module._create_sort_path = wasmExports.create_sort_path)(e, t, r2, a2, o2);
    Module._copy_pathtarget = (e) => (Module._copy_pathtarget = wasmExports.copy_pathtarget)(e);
    Module._get_sortgrouplist_exprs = (e, t) => (Module._get_sortgrouplist_exprs = wasmExports.get_sortgrouplist_exprs)(e, t);
    Module._estimate_num_groups = (e, t, r2, a2, o2) => (Module._estimate_num_groups = wasmExports.estimate_num_groups)(e, t, r2, a2, o2);
    Module._cost_qual_eval = (e, t, r2) => (Module._cost_qual_eval = wasmExports.cost_qual_eval)(e, t, r2);
    Module._plan_create_index_workers = (e, t) => (Module._plan_create_index_workers = wasmExports.plan_create_index_workers)(e, t);
    Module._create_projection_path = (e, t, r2, a2) => (Module._create_projection_path = wasmExports.create_projection_path)(e, t, r2, a2);
    Module._get_plan_rowmark = (e, t) => (Module._get_plan_rowmark = wasmExports.get_plan_rowmark)(e, t);
    Module._find_join_rel = (e, t) => (Module._find_join_rel = wasmExports.find_join_rel)(e, t);
    Module._make_canonical_pathkey = (e, t, r2, a2, o2) => (Module._make_canonical_pathkey = wasmExports.make_canonical_pathkey)(e, t, r2, a2, o2);
    Module._eclass_useful_for_merging = (e, t, r2) => (Module._eclass_useful_for_merging = wasmExports.eclass_useful_for_merging)(e, t, r2);
    Module._update_mergeclause_eclasses = (e, t) => (Module._update_mergeclause_eclasses = wasmExports.update_mergeclause_eclasses)(e, t);
    Module._clauselist_selectivity = (e, t, r2, a2, o2) => (Module._clauselist_selectivity = wasmExports.clauselist_selectivity)(e, t, r2, a2, o2);
    Module._join_clause_is_movable_to = (e, t) => (Module._join_clause_is_movable_to = wasmExports.join_clause_is_movable_to)(e, t);
    Module._generate_implied_equalities_for_column = (e, t, r2, a2, o2) => (Module._generate_implied_equalities_for_column = wasmExports.generate_implied_equalities_for_column)(e, t, r2, a2, o2);
    Module._get_tablespace_page_costs = (e, t, r2) => (Module._get_tablespace_page_costs = wasmExports.get_tablespace_page_costs)(e, t, r2);
    Module._set_baserel_size_estimates = (e, t) => (Module._set_baserel_size_estimates = wasmExports.set_baserel_size_estimates)(e, t);
    Module._add_to_flat_tlist = (e, t) => (Module._add_to_flat_tlist = wasmExports.add_to_flat_tlist)(e, t);
    Module._get_baserel_parampathinfo = (e, t, r2) => (Module._get_baserel_parampathinfo = wasmExports.get_baserel_parampathinfo)(e, t, r2);
    Module._create_foreignscan_path = (e, t, r2, a2, o2, s2, l2, n2, _2, m2) => (Module._create_foreignscan_path = wasmExports.create_foreignscan_path)(e, t, r2, a2, o2, s2, l2, n2, _2, m2);
    Module._create_foreign_join_path = (e, t, r2, a2, o2, s2, l2, n2, _2, m2) => (Module._create_foreign_join_path = wasmExports.create_foreign_join_path)(e, t, r2, a2, o2, s2, l2, n2, _2, m2);
    Module._create_foreign_upper_path = (e, t, r2, a2, o2, s2, l2, n2, _2) => (Module._create_foreign_upper_path = wasmExports.create_foreign_upper_path)(e, t, r2, a2, o2, s2, l2, n2, _2);
    Module._adjust_limit_rows_costs = (e, t, r2, a2, o2) => (Module._adjust_limit_rows_costs = wasmExports.adjust_limit_rows_costs)(e, t, r2, a2, o2);
    Module._SearchSysCacheAttName = (e, t) => (Module._SearchSysCacheAttName = wasmExports.SearchSysCacheAttName)(e, t);
    Module._get_translated_update_targetlist = (e, t, r2, a2) => (Module._get_translated_update_targetlist = wasmExports.get_translated_update_targetlist)(e, t, r2, a2);
    Module._add_row_identity_var = (e, t, r2, a2) => (Module._add_row_identity_var = wasmExports.add_row_identity_var)(e, t, r2, a2);
    Module._get_rel_all_updated_cols = (e, t) => (Module._get_rel_all_updated_cols = wasmExports.get_rel_all_updated_cols)(e, t);
    Module._list_append_unique_ptr = (e, t) => (Module._list_append_unique_ptr = wasmExports.list_append_unique_ptr)(e, t);
    Module._palloc_extended = (e, t) => (Module._palloc_extended = wasmExports.palloc_extended)(e, t);
    Module._pg_reg_getinitialstate = (e) => (Module._pg_reg_getinitialstate = wasmExports.pg_reg_getinitialstate)(e);
    Module._pg_reg_getfinalstate = (e) => (Module._pg_reg_getfinalstate = wasmExports.pg_reg_getfinalstate)(e);
    Module._pg_reg_getnumoutarcs = (e, t) => (Module._pg_reg_getnumoutarcs = wasmExports.pg_reg_getnumoutarcs)(e, t);
    Module._pg_reg_getoutarcs = (e, t, r2, a2) => (Module._pg_reg_getoutarcs = wasmExports.pg_reg_getoutarcs)(e, t, r2, a2);
    Module._pg_reg_getnumcolors = (e) => (Module._pg_reg_getnumcolors = wasmExports.pg_reg_getnumcolors)(e);
    Module._pg_reg_colorisbegin = (e, t) => (Module._pg_reg_colorisbegin = wasmExports.pg_reg_colorisbegin)(e, t);
    Module._pg_reg_colorisend = (e, t) => (Module._pg_reg_colorisend = wasmExports.pg_reg_colorisend)(e, t);
    Module._pg_reg_getnumcharacters = (e, t) => (Module._pg_reg_getnumcharacters = wasmExports.pg_reg_getnumcharacters)(e, t);
    Module._pg_reg_getcharacters = (e, t, r2, a2) => (Module._pg_reg_getcharacters = wasmExports.pg_reg_getcharacters)(e, t, r2, a2);
    Module._toupper = (e) => (Module._toupper = wasmExports.toupper)(e);
    Module._pg_initdb = () => (Module._pg_initdb = wasmExports.pg_initdb)();
    Module._pg_initdb_main = () => (Module._pg_initdb_main = wasmExports.pg_initdb_main)();
    Module.___cxa_throw = (e, t, r2) => (Module.___cxa_throw = wasmExports.__cxa_throw)(e, t, r2);
    Module._main_repl = () => (Module._main_repl = wasmExports.main_repl)();
    Module._main = (e, t) => (Module._main = wasmExports.__main_argc_argv)(e, t);
    Module._setenv = (e, t, r2) => (Module._setenv = wasmExports.setenv)(e, t, r2);
    Module._pg_repl_raf = () => (Module._pg_repl_raf = wasmExports.pg_repl_raf)();
    Module._GetForeignDataWrapper = (e) => (Module._GetForeignDataWrapper = wasmExports.GetForeignDataWrapper)(e);
    Module._GetForeignServer = (e) => (Module._GetForeignServer = wasmExports.GetForeignServer)(e);
    Module._GetForeignServerExtended = (e, t) => (Module._GetForeignServerExtended = wasmExports.GetForeignServerExtended)(e, t);
    Module._GetForeignServerByName = (e, t) => (Module._GetForeignServerByName = wasmExports.GetForeignServerByName)(e, t);
    Module._GetUserMapping = (e, t) => (Module._GetUserMapping = wasmExports.GetUserMapping)(e, t);
    Module._GetForeignTable = (e) => (Module._GetForeignTable = wasmExports.GetForeignTable)(e);
    Module._GetForeignColumnOptions = (e, t) => (Module._GetForeignColumnOptions = wasmExports.GetForeignColumnOptions)(e, t);
    Module._initClosestMatch = (e, t, r2) => (Module._initClosestMatch = wasmExports.initClosestMatch)(e, t, r2);
    Module._updateClosestMatch = (e, t) => (Module._updateClosestMatch = wasmExports.updateClosestMatch)(e, t);
    Module._getClosestMatch = (e) => (Module._getClosestMatch = wasmExports.getClosestMatch)(e);
    Module._GetExistingLocalJoinPath = (e) => (Module._GetExistingLocalJoinPath = wasmExports.GetExistingLocalJoinPath)(e);
    Module._BaseBackupAddTarget = (e, t, r2) => (Module._BaseBackupAddTarget = wasmExports.BaseBackupAddTarget)(e, t, r2);
    Module._bbsink_forward_begin_backup = (e) => (Module._bbsink_forward_begin_backup = wasmExports.bbsink_forward_begin_backup)(e);
    Module._bbsink_forward_archive_contents = (e, t) => (Module._bbsink_forward_archive_contents = wasmExports.bbsink_forward_archive_contents)(e, t);
    Module._bbsink_forward_end_archive = (e) => (Module._bbsink_forward_end_archive = wasmExports.bbsink_forward_end_archive)(e);
    Module._bbsink_forward_begin_archive = (e, t) => (Module._bbsink_forward_begin_archive = wasmExports.bbsink_forward_begin_archive)(e, t);
    Module._bbsink_forward_begin_manifest = (e) => (Module._bbsink_forward_begin_manifest = wasmExports.bbsink_forward_begin_manifest)(e);
    Module._bbsink_forward_manifest_contents = (e, t) => (Module._bbsink_forward_manifest_contents = wasmExports.bbsink_forward_manifest_contents)(e, t);
    Module._bbsink_forward_end_manifest = (e) => (Module._bbsink_forward_end_manifest = wasmExports.bbsink_forward_end_manifest)(e);
    Module._bbsink_forward_end_backup = (e, t, r2) => (Module._bbsink_forward_end_backup = wasmExports.bbsink_forward_end_backup)(e, t, r2);
    Module._bbsink_forward_cleanup = (e) => (Module._bbsink_forward_cleanup = wasmExports.bbsink_forward_cleanup)(e);
    Module._ResourceOwnerCreate = (e, t) => (Module._ResourceOwnerCreate = wasmExports.ResourceOwnerCreate)(e, t);
    Module._escape_json = (e, t) => (Module._escape_json = wasmExports.escape_json)(e, t);
    Module._exprIsLengthCoercion = (e, t) => (Module._exprIsLengthCoercion = wasmExports.exprIsLengthCoercion)(e, t);
    Module._tbm_add_tuples = (e, t, r2, a2) => (Module._tbm_add_tuples = wasmExports.tbm_add_tuples)(e, t, r2, a2);
    Module._appendStringInfoStringQuoted = (e, t, r2) => (Module._appendStringInfoStringQuoted = wasmExports.appendStringInfoStringQuoted)(e, t, r2);
    Module._list_make5_impl = (e, t, r2, a2, o2, s2) => (Module._list_make5_impl = wasmExports.list_make5_impl)(e, t, r2, a2, o2, s2);
    Module._list_delete = (e, t) => (Module._list_delete = wasmExports.list_delete)(e, t);
    Module._CleanQuerytext = (e, t, r2) => (Module._CleanQuerytext = wasmExports.CleanQuerytext)(e, t, r2);
    Module._EnableQueryId = () => (Module._EnableQueryId = wasmExports.EnableQueryId)();
    Module._get_rel_type_id = (e) => (Module._get_rel_type_id = wasmExports.get_rel_type_id)(e);
    Module._set_config_option = (e, t, r2, a2, o2, s2, l2, n2) => (Module._set_config_option = wasmExports.set_config_option)(e, t, r2, a2, o2, s2, l2, n2);
    Module._NewGUCNestLevel = () => (Module._NewGUCNestLevel = wasmExports.NewGUCNestLevel)();
    Module._AtEOXact_GUC = (e, t) => (Module._AtEOXact_GUC = wasmExports.AtEOXact_GUC)(e, t);
    Module._parse_int = (e, t, r2, a2) => (Module._parse_int = wasmExports.parse_int)(e, t, r2, a2);
    Module._strtod = (e, t) => (Module._strtod = wasmExports.strtod)(e, t);
    Module._parse_real = (e, t, r2, a2) => (Module._parse_real = wasmExports.parse_real)(e, t, r2, a2);
    Module._DefineCustomBoolVariable = (e, t, r2, a2, o2, s2, l2, n2, _2, m2) => (Module._DefineCustomBoolVariable = wasmExports.DefineCustomBoolVariable)(e, t, r2, a2, o2, s2, l2, n2, _2, m2);
    Module._DefineCustomIntVariable = (e, t, r2, a2, o2, s2, l2, n2, _2, m2, p2, d2) => (Module._DefineCustomIntVariable = wasmExports.DefineCustomIntVariable)(e, t, r2, a2, o2, s2, l2, n2, _2, m2, p2, d2);
    Module._DefineCustomRealVariable = (e, t, r2, a2, o2, s2, l2, n2, _2, m2, p2, d2) => (Module._DefineCustomRealVariable = wasmExports.DefineCustomRealVariable)(e, t, r2, a2, o2, s2, l2, n2, _2, m2, p2, d2);
    Module._DefineCustomStringVariable = (e, t, r2, a2, o2, s2, l2, n2, _2, m2) => (Module._DefineCustomStringVariable = wasmExports.DefineCustomStringVariable)(e, t, r2, a2, o2, s2, l2, n2, _2, m2);
    Module._DefineCustomEnumVariable = (e, t, r2, a2, o2, s2, l2, n2, _2, m2, p2) => (Module._DefineCustomEnumVariable = wasmExports.DefineCustomEnumVariable)(e, t, r2, a2, o2, s2, l2, n2, _2, m2, p2);
    Module._MarkGUCPrefixReserved = (e) => (Module._MarkGUCPrefixReserved = wasmExports.MarkGUCPrefixReserved)(e);
    Module._strcspn = (e, t) => (Module._strcspn = wasmExports.strcspn)(e, t);
    Module._BlockSampler_Init = (e, t, r2, a2) => (Module._BlockSampler_Init = wasmExports.BlockSampler_Init)(e, t, r2, a2);
    Module._sampler_random_init_state = (e, t) => (Module._sampler_random_init_state = wasmExports.sampler_random_init_state)(e, t);
    Module._BlockSampler_HasMore = (e) => (Module._BlockSampler_HasMore = wasmExports.BlockSampler_HasMore)(e);
    Module._BlockSampler_Next = (e) => (Module._BlockSampler_Next = wasmExports.BlockSampler_Next)(e);
    Module._sampler_random_fract = (e) => (Module._sampler_random_fract = wasmExports.sampler_random_fract)(e);
    Module._reservoir_init_selection_state = (e, t) => (Module._reservoir_init_selection_state = wasmExports.reservoir_init_selection_state)(e, t);
    Module._reservoir_get_next_S = (e, t, r2) => (Module._reservoir_get_next_S = wasmExports.reservoir_get_next_S)(e, t, r2);
    Module._canonicalize_path = (e) => (Module._canonicalize_path = wasmExports.canonicalize_path)(e);
    Module.__bt_mkscankey = (e, t) => (Module.__bt_mkscankey = wasmExports._bt_mkscankey)(e, t);
    Module._nocache_index_getattr = (e, t, r2) => (Module._nocache_index_getattr = wasmExports.nocache_index_getattr)(e, t, r2);
    Module._tuplesort_estimate_shared = (e) => (Module._tuplesort_estimate_shared = wasmExports.tuplesort_estimate_shared)(e);
    Module._tuplesort_initialize_shared = (e, t, r2) => (Module._tuplesort_initialize_shared = wasmExports.tuplesort_initialize_shared)(e, t, r2);
    Module._tuplesort_attach_shared = (e, t) => (Module._tuplesort_attach_shared = wasmExports.tuplesort_attach_shared)(e, t);
    Module._GetCurrentTransactionNestLevel = () => (Module._GetCurrentTransactionNestLevel = wasmExports.GetCurrentTransactionNestLevel)();
    Module._in_error_recursion_trouble = () => (Module._in_error_recursion_trouble = wasmExports.in_error_recursion_trouble)();
    Module._strrchr = (e, t) => (Module._strrchr = wasmExports.strrchr)(e, t);
    Module._errhidestmt = (e) => (Module._errhidestmt = wasmExports.errhidestmt)(e);
    Module._err_generic_string = (e, t) => (Module._err_generic_string = wasmExports.err_generic_string)(e, t);
    Module._getinternalerrposition = () => (Module._getinternalerrposition = wasmExports.getinternalerrposition)();
    Module._GetErrorContextStack = () => (Module._GetErrorContextStack = wasmExports.GetErrorContextStack)();
    Module._SplitIdentifierString = (e, t, r2) => (Module._SplitIdentifierString = wasmExports.SplitIdentifierString)(e, t, r2);
    Module._appendStringInfoSpaces = (e, t) => (Module._appendStringInfoSpaces = wasmExports.appendStringInfoSpaces)(e, t);
    Module._unpack_sql_state = (e) => (Module._unpack_sql_state = wasmExports.unpack_sql_state)(e);
    Module._CreateTupleDescCopyConstr = (e) => (Module._CreateTupleDescCopyConstr = wasmExports.CreateTupleDescCopyConstr)(e);
    Module._CachedPlanAllowsSimpleValidityCheck = (e, t, r2) => (Module._CachedPlanAllowsSimpleValidityCheck = wasmExports.CachedPlanAllowsSimpleValidityCheck)(e, t, r2);
    Module._CachedPlanIsSimplyValid = (e, t, r2) => (Module._CachedPlanIsSimplyValid = wasmExports.CachedPlanIsSimplyValid)(e, t, r2);
    Module._GetCachedExpression = (e) => (Module._GetCachedExpression = wasmExports.GetCachedExpression)(e);
    Module._FreeCachedExpression = (e) => (Module._FreeCachedExpression = wasmExports.FreeCachedExpression)(e);
    Module._MemoryContextDeleteChildren = (e) => (Module._MemoryContextDeleteChildren = wasmExports.MemoryContextDeleteChildren)(e);
    Module._is_publishable_relation = (e) => (Module._is_publishable_relation = wasmExports.is_publishable_relation)(e);
    Module._GetRelationPublications = (e) => (Module._GetRelationPublications = wasmExports.GetRelationPublications)(e);
    Module._GetSchemaPublications = (e) => (Module._GetSchemaPublications = wasmExports.GetSchemaPublications)(e);
    Module._index_getprocid = (e, t, r2) => (Module._index_getprocid = wasmExports.index_getprocid)(e, t, r2);
    Module._get_rel_relispartition = (e) => (Module._get_rel_relispartition = wasmExports.get_rel_relispartition)(e);
    Module._get_func_namespace = (e) => (Module._get_func_namespace = wasmExports.get_func_namespace)(e);
    Module._get_typsubscript = (e, t) => (Module._get_typsubscript = wasmExports.get_typsubscript)(e, t);
    Module._get_namespace_name_or_temp = (e) => (Module._get_namespace_name_or_temp = wasmExports.get_namespace_name_or_temp)(e);
    Module._texteq = (e) => (Module._texteq = wasmExports.texteq)(e);
    Module._GetUserIdAndSecContext = (e, t) => (Module._GetUserIdAndSecContext = wasmExports.GetUserIdAndSecContext)(e, t);
    Module._SetUserIdAndSecContext = (e, t) => (Module._SetUserIdAndSecContext = wasmExports.SetUserIdAndSecContext)(e, t);
    Module._DirectFunctionCall5Coll = (e, t, r2, a2, o2, s2, l2) => (Module._DirectFunctionCall5Coll = wasmExports.DirectFunctionCall5Coll)(e, t, r2, a2, o2, s2, l2);
    Module._CallerFInfoFunctionCall2 = (e, t, r2, a2, o2) => (Module._CallerFInfoFunctionCall2 = wasmExports.CallerFInfoFunctionCall2)(e, t, r2, a2, o2);
    Module._FunctionCall0Coll = (e, t) => (Module._FunctionCall0Coll = wasmExports.FunctionCall0Coll)(e, t);
    Module._OutputFunctionCall = (e, t) => (Module._OutputFunctionCall = wasmExports.OutputFunctionCall)(e, t);
    Module._get_fn_expr_rettype = (e) => (Module._get_fn_expr_rettype = wasmExports.get_fn_expr_rettype)(e);
    Module._has_fn_opclass_options = (e) => (Module._has_fn_opclass_options = wasmExports.has_fn_opclass_options)(e);
    Module._get_fn_opclass_options = (e) => (Module._get_fn_opclass_options = wasmExports.get_fn_opclass_options)(e);
    Module._CheckFunctionValidatorAccess = (e, t) => (Module._CheckFunctionValidatorAccess = wasmExports.CheckFunctionValidatorAccess)(e, t);
    Module._resolve_polymorphic_argtypes = (e, t, r2, a2) => (Module._resolve_polymorphic_argtypes = wasmExports.resolve_polymorphic_argtypes)(e, t, r2, a2);
    Module._get_func_arg_info = (e, t, r2, a2) => (Module._get_func_arg_info = wasmExports.get_func_arg_info)(e, t, r2, a2);
    Module._dlsym = (e, t) => (Module._dlsym = wasmExports.dlsym)(e, t);
    Module._dlopen = (e, t) => (Module._dlopen = wasmExports.dlopen)(e, t);
    Module._dlerror = () => (Module._dlerror = wasmExports.dlerror)();
    Module._dlclose = (e) => (Module._dlclose = wasmExports.dlclose)(e);
    Module._find_rendezvous_variable = (e) => (Module._find_rendezvous_variable = wasmExports.find_rendezvous_variable)(e);
    Module._fscanf = (e, t, r2) => (Module._fscanf = wasmExports.fscanf)(e, t, r2);
    Module._strlcat = (e, t, r2) => (Module._strlcat = wasmExports.strlcat)(e, t, r2);
    Module._pg_bindtextdomain = (e) => (Module._pg_bindtextdomain = wasmExports.pg_bindtextdomain)(e);
    Module._pg_do_encoding_conversion = (e, t, r2, a2) => (Module._pg_do_encoding_conversion = wasmExports.pg_do_encoding_conversion)(e, t, r2, a2);
    Module._report_invalid_encoding = (e, t, r2) => (Module._report_invalid_encoding = wasmExports.report_invalid_encoding)(e, t, r2);
    Module._pg_encoding_to_char_private = (e) => (Module._pg_encoding_to_char_private = wasmExports.pg_encoding_to_char_private)(e);
    Module._MemoryContextAllocHuge = (e, t) => (Module._MemoryContextAllocHuge = wasmExports.MemoryContextAllocHuge)(e, t);
    Module._namein = (e) => (Module._namein = wasmExports.namein)(e);
    Module._pg_char_to_encoding_private = (e) => (Module._pg_char_to_encoding_private = wasmExports.pg_char_to_encoding_private)(e);
    Module._pg_encoding_max_length = (e) => (Module._pg_encoding_max_length = wasmExports.pg_encoding_max_length)(e);
    Module._pg_server_to_any = (e, t, r2) => (Module._pg_server_to_any = wasmExports.pg_server_to_any)(e, t, r2);
    Module._pg_utf_mblen = (e) => (Module._pg_utf_mblen = wasmExports.pg_utf_mblen)(e);
    Module._pg_wchar2mb_with_len = (e, t, r2) => (Module._pg_wchar2mb_with_len = wasmExports.pg_wchar2mb_with_len)(e, t, r2);
    Module._pg_encoding_mblen = (e, t) => (Module._pg_encoding_mblen = wasmExports.pg_encoding_mblen)(e, t);
    Module._check_encoding_conversion_args = (e, t, r2, a2, o2) => (Module._check_encoding_conversion_args = wasmExports.check_encoding_conversion_args)(e, t, r2, a2, o2);
    Module._report_untranslatable_char = (e, t, r2, a2) => (Module._report_untranslatable_char = wasmExports.report_untranslatable_char)(e, t, r2, a2);
    Module._local2local = (e, t, r2, a2, o2, s2, l2) => (Module._local2local = wasmExports.local2local)(e, t, r2, a2, o2, s2, l2);
    Module._latin2mic = (e, t, r2, a2, o2, s2) => (Module._latin2mic = wasmExports.latin2mic)(e, t, r2, a2, o2, s2);
    Module._mic2latin = (e, t, r2, a2, o2, s2) => (Module._mic2latin = wasmExports.mic2latin)(e, t, r2, a2, o2, s2);
    Module._latin2mic_with_table = (e, t, r2, a2, o2, s2, l2) => (Module._latin2mic_with_table = wasmExports.latin2mic_with_table)(e, t, r2, a2, o2, s2, l2);
    Module._mic2latin_with_table = (e, t, r2, a2, o2, s2, l2) => (Module._mic2latin_with_table = wasmExports.mic2latin_with_table)(e, t, r2, a2, o2, s2, l2);
    Module._pg_encoding_verifymbchar = (e, t, r2) => (Module._pg_encoding_verifymbchar = wasmExports.pg_encoding_verifymbchar)(e, t, r2);
    Module._float_overflow_error = () => (Module._float_overflow_error = wasmExports.float_overflow_error)();
    Module._float_underflow_error = () => (Module._float_underflow_error = wasmExports.float_underflow_error)();
    Module._float4in_internal = (e, t, r2, a2, o2) => (Module._float4in_internal = wasmExports.float4in_internal)(e, t, r2, a2, o2);
    Module._strtof = (e, t) => (Module._strtof = wasmExports.strtof)(e, t);
    Module._float_to_shortest_decimal_buf = (e, t) => (Module._float_to_shortest_decimal_buf = wasmExports.float_to_shortest_decimal_buf)(e, t);
    Module._float8in_internal = (e, t, r2, a2, o2) => (Module._float8in_internal = wasmExports.float8in_internal)(e, t, r2, a2, o2);
    Module._float8out_internal = (e) => (Module._float8out_internal = wasmExports.float8out_internal)(e);
    Module._btfloat4cmp = (e) => (Module._btfloat4cmp = wasmExports.btfloat4cmp)(e);
    Module._btfloat8cmp = (e) => (Module._btfloat8cmp = wasmExports.btfloat8cmp)(e);
    Module._pow = (e, t) => (Module._pow = wasmExports.pow)(e, t);
    Module._log10 = (e) => (Module._log10 = wasmExports.log10)(e);
    Module._acos = (e) => (Module._acos = wasmExports.acos)(e);
    Module._asin = (e) => (Module._asin = wasmExports.asin)(e);
    Module._cos = (e) => (Module._cos = wasmExports.cos)(e);
    Module._sin = (e) => (Module._sin = wasmExports.sin)(e);
    Module._fmod = (e, t) => (Module._fmod = wasmExports.fmod)(e, t);
    Module._construct_array = (e, t, r2, a2, o2, s2) => (Module._construct_array = wasmExports.construct_array)(e, t, r2, a2, o2, s2);
    Module._try_relation_open = (e, t) => (Module._try_relation_open = wasmExports.try_relation_open)(e, t);
    Module._forkname_to_number = (e) => (Module._forkname_to_number = wasmExports.forkname_to_number)(e);
    Module._numeric_lt = (e) => (Module._numeric_lt = wasmExports.numeric_lt)(e);
    Module._int64_to_numeric = (e) => (Module._int64_to_numeric = wasmExports.int64_to_numeric)(e);
    Module._numeric_sub = (e) => (Module._numeric_sub = wasmExports.numeric_sub)(e);
    Module._numeric_ge = (e) => (Module._numeric_ge = wasmExports.numeric_ge)(e);
    Module._inet_in = (e) => (Module._inet_in = wasmExports.inet_in)(e);
    Module._format_operator = (e) => (Module._format_operator = wasmExports.format_operator)(e);
    Module._RelationIsVisible = (e) => (Module._RelationIsVisible = wasmExports.RelationIsVisible)(e);
    Module._pg_get_indexdef_columns_extended = (e, t) => (Module._pg_get_indexdef_columns_extended = wasmExports.pg_get_indexdef_columns_extended)(e, t);
    Module._accumArrayResult = (e, t, r2, a2, o2) => (Module._accumArrayResult = wasmExports.accumArrayResult)(e, t, r2, a2, o2);
    Module._makeArrayResult = (e, t) => (Module._makeArrayResult = wasmExports.makeArrayResult)(e, t);
    Module._init_local_reloptions = (e, t) => (Module._init_local_reloptions = wasmExports.init_local_reloptions)(e, t);
    Module._add_local_int_reloption = (e, t, r2, a2, o2, s2, l2) => (Module._add_local_int_reloption = wasmExports.add_local_int_reloption)(e, t, r2, a2, o2, s2, l2);
    Module._pg_inet_net_ntop = (e, t, r2, a2, o2) => (Module._pg_inet_net_ntop = wasmExports.pg_inet_net_ntop)(e, t, r2, a2, o2);
    Module._network_cmp = (e) => (Module._network_cmp = wasmExports.network_cmp)(e);
    Module._convert_network_to_scalar = (e, t, r2) => (Module._convert_network_to_scalar = wasmExports.convert_network_to_scalar)(e, t, r2);
    Module._JsonbValueToJsonb = (e) => (Module._JsonbValueToJsonb = wasmExports.JsonbValueToJsonb)(e);
    Module._pushJsonbValue = (e, t, r2) => (Module._pushJsonbValue = wasmExports.pushJsonbValue)(e, t, r2);
    Module._numeric_cmp = (e) => (Module._numeric_cmp = wasmExports.numeric_cmp)(e);
    Module._timetz_cmp = (e) => (Module._timetz_cmp = wasmExports.timetz_cmp)(e);
    Module._date_cmp = (e) => (Module._date_cmp = wasmExports.date_cmp)(e);
    Module._time_cmp = (e) => (Module._time_cmp = wasmExports.time_cmp)(e);
    Module._timestamp_cmp = (e) => (Module._timestamp_cmp = wasmExports.timestamp_cmp)(e);
    Module._domain_check = (e, t, r2, a2, o2) => (Module._domain_check = wasmExports.domain_check)(e, t, r2, a2, o2);
    Module._initArrayResult = (e, t, r2) => (Module._initArrayResult = wasmExports.initArrayResult)(e, t, r2);
    Module._path_is_prefix_of_path = (e, t) => (Module._path_is_prefix_of_path = wasmExports.path_is_prefix_of_path)(e, t);
    Module._path_is_relative_and_below_cwd = (e) => (Module._path_is_relative_and_below_cwd = wasmExports.path_is_relative_and_below_cwd)(e);
    Module._ArrayGetIntegerTypmods = (e, t) => (Module._ArrayGetIntegerTypmods = wasmExports.ArrayGetIntegerTypmods)(e, t);
    Module._bpchareq = (e) => (Module._bpchareq = wasmExports.bpchareq)(e);
    Module._varstr_cmp = (e, t, r2, a2, o2) => (Module._varstr_cmp = wasmExports.varstr_cmp)(e, t, r2, a2, o2);
    Module._bpcharlt = (e) => (Module._bpcharlt = wasmExports.bpcharlt)(e);
    Module._bpcharle = (e) => (Module._bpcharle = wasmExports.bpcharle)(e);
    Module._bpchargt = (e) => (Module._bpchargt = wasmExports.bpchargt)(e);
    Module._bpcharge = (e) => (Module._bpcharge = wasmExports.bpcharge)(e);
    Module._bpcharcmp = (e) => (Module._bpcharcmp = wasmExports.bpcharcmp)(e);
    Module._current_query = (e) => (Module._current_query = wasmExports.current_query)(e);
    Module._str_tolower = (e, t, r2) => (Module._str_tolower = wasmExports.str_tolower)(e, t, r2);
    Module._TransferExpandedObject = (e, t) => (Module._TransferExpandedObject = wasmExports.TransferExpandedObject)(e, t);
    Module._macaddr_cmp = (e) => (Module._macaddr_cmp = wasmExports.macaddr_cmp)(e);
    Module._macaddr_lt = (e) => (Module._macaddr_lt = wasmExports.macaddr_lt)(e);
    Module._macaddr_le = (e) => (Module._macaddr_le = wasmExports.macaddr_le)(e);
    Module._macaddr_eq = (e) => (Module._macaddr_eq = wasmExports.macaddr_eq)(e);
    Module._macaddr_ge = (e) => (Module._macaddr_ge = wasmExports.macaddr_ge)(e);
    Module._macaddr_gt = (e) => (Module._macaddr_gt = wasmExports.macaddr_gt)(e);
    Module._quote_ident = (e) => (Module._quote_ident = wasmExports.quote_ident)(e);
    Module._timestamp_in = (e) => (Module._timestamp_in = wasmExports.timestamp_in)(e);
    Module._ParseDateTime = (e, t, r2, a2, o2, s2, l2) => (Module._ParseDateTime = wasmExports.ParseDateTime)(e, t, r2, a2, o2, s2, l2);
    Module._DecodeDateTime = (e, t, r2, a2, o2, s2, l2, n2) => (Module._DecodeDateTime = wasmExports.DecodeDateTime)(e, t, r2, a2, o2, s2, l2, n2);
    Module.___multi3 = (e, t, r2, a2, o2) => (Module.___multi3 = wasmExports.__multi3)(e, t, r2, a2, o2);
    Module._timestamptz_in = (e) => (Module._timestamptz_in = wasmExports.timestamptz_in)(e);
    Module._timestamp_eq = (e) => (Module._timestamp_eq = wasmExports.timestamp_eq)(e);
    Module._timestamp_lt = (e) => (Module._timestamp_lt = wasmExports.timestamp_lt)(e);
    Module._timestamp_gt = (e) => (Module._timestamp_gt = wasmExports.timestamp_gt)(e);
    Module._timestamp_le = (e) => (Module._timestamp_le = wasmExports.timestamp_le)(e);
    Module._timestamp_ge = (e) => (Module._timestamp_ge = wasmExports.timestamp_ge)(e);
    Module._interval_eq = (e) => (Module._interval_eq = wasmExports.interval_eq)(e);
    Module._interval_lt = (e) => (Module._interval_lt = wasmExports.interval_lt)(e);
    Module._interval_gt = (e) => (Module._interval_gt = wasmExports.interval_gt)(e);
    Module._interval_le = (e) => (Module._interval_le = wasmExports.interval_le)(e);
    Module._interval_ge = (e) => (Module._interval_ge = wasmExports.interval_ge)(e);
    Module._interval_cmp = (e) => (Module._interval_cmp = wasmExports.interval_cmp)(e);
    Module._timestamp_mi = (e) => (Module._timestamp_mi = wasmExports.timestamp_mi)(e);
    Module._interval_um = (e) => (Module._interval_um = wasmExports.interval_um)(e);
    Module._interval_mi = (e) => (Module._interval_mi = wasmExports.interval_mi)(e);
    Module._IsValidJsonNumber = (e, t) => (Module._IsValidJsonNumber = wasmExports.IsValidJsonNumber)(e, t);
    Module._btnamecmp = (e) => (Module._btnamecmp = wasmExports.btnamecmp)(e);
    Module._strncpy = (e, t, r2) => (Module._strncpy = wasmExports.strncpy)(e, t, r2);
    Module._expand_array = (e, t, r2) => (Module._expand_array = wasmExports.expand_array)(e, t, r2);
    Module._pg_get_encoding_from_locale = (e, t) => (Module._pg_get_encoding_from_locale = wasmExports.pg_get_encoding_from_locale)(e, t);
    Module._localtime = (e) => (Module._localtime = wasmExports.localtime)(e);
    Module._strftime = (e, t, r2, a2) => (Module._strftime = wasmExports.strftime)(e, t, r2, a2);
    Module._numeric_is_nan = (e) => (Module._numeric_is_nan = wasmExports.numeric_is_nan)(e);
    Module._numeric_eq = (e) => (Module._numeric_eq = wasmExports.numeric_eq)(e);
    Module._numeric_gt = (e) => (Module._numeric_gt = wasmExports.numeric_gt)(e);
    Module._numeric_le = (e) => (Module._numeric_le = wasmExports.numeric_le)(e);
    Module._numeric_div = (e) => (Module._numeric_div = wasmExports.numeric_div)(e);
    Module._numeric_float8_no_overflow = (e) => (Module._numeric_float8_no_overflow = wasmExports.numeric_float8_no_overflow)(e);
    Module._numeric_float4 = (e) => (Module._numeric_float4 = wasmExports.numeric_float4)(e);
    Module._date_eq = (e) => (Module._date_eq = wasmExports.date_eq)(e);
    Module._date_lt = (e) => (Module._date_lt = wasmExports.date_lt)(e);
    Module._date_le = (e) => (Module._date_le = wasmExports.date_le)(e);
    Module._date_gt = (e) => (Module._date_gt = wasmExports.date_gt)(e);
    Module._date_ge = (e) => (Module._date_ge = wasmExports.date_ge)(e);
    Module._date_mi = (e) => (Module._date_mi = wasmExports.date_mi)(e);
    Module._time_eq = (e) => (Module._time_eq = wasmExports.time_eq)(e);
    Module._time_lt = (e) => (Module._time_lt = wasmExports.time_lt)(e);
    Module._time_le = (e) => (Module._time_le = wasmExports.time_le)(e);
    Module._time_gt = (e) => (Module._time_gt = wasmExports.time_gt)(e);
    Module._time_ge = (e) => (Module._time_ge = wasmExports.time_ge)(e);
    Module._time_mi_time = (e) => (Module._time_mi_time = wasmExports.time_mi_time)(e);
    Module._get_extension_oid = (e, t) => (Module._get_extension_oid = wasmExports.get_extension_oid)(e, t);
    Module._pg_ltoa = (e, t) => (Module._pg_ltoa = wasmExports.pg_ltoa)(e, t);
    Module._varbit_in = (e) => (Module._varbit_in = wasmExports.varbit_in)(e);
    Module._biteq = (e) => (Module._biteq = wasmExports.biteq)(e);
    Module._bitlt = (e) => (Module._bitlt = wasmExports.bitlt)(e);
    Module._bitle = (e) => (Module._bitle = wasmExports.bitle)(e);
    Module._bitgt = (e) => (Module._bitgt = wasmExports.bitgt)(e);
    Module._bitge = (e) => (Module._bitge = wasmExports.bitge)(e);
    Module._bitcmp = (e) => (Module._bitcmp = wasmExports.bitcmp)(e);
    Module._tidin = (e) => (Module._tidin = wasmExports.tidin)(e);
    Module._tidout = (e) => (Module._tidout = wasmExports.tidout)(e);
    Module._cash_cmp = (e) => (Module._cash_cmp = wasmExports.cash_cmp)(e);
    Module._arraycontsel = (e) => (Module._arraycontsel = wasmExports.arraycontsel)(e);
    Module._arraycontjoinsel = (e) => (Module._arraycontjoinsel = wasmExports.arraycontjoinsel)(e);
    Module._text_lt = (e) => (Module._text_lt = wasmExports.text_lt)(e);
    Module._text_le = (e) => (Module._text_le = wasmExports.text_le)(e);
    Module._text_gt = (e) => (Module._text_gt = wasmExports.text_gt)(e);
    Module._text_ge = (e) => (Module._text_ge = wasmExports.text_ge)(e);
    Module._bttextcmp = (e) => (Module._bttextcmp = wasmExports.bttextcmp)(e);
    Module._byteaeq = (e) => (Module._byteaeq = wasmExports.byteaeq)(e);
    Module._bytealt = (e) => (Module._bytealt = wasmExports.bytealt)(e);
    Module._byteale = (e) => (Module._byteale = wasmExports.byteale)(e);
    Module._byteagt = (e) => (Module._byteagt = wasmExports.byteagt)(e);
    Module._byteage = (e) => (Module._byteage = wasmExports.byteage)(e);
    Module._byteacmp = (e) => (Module._byteacmp = wasmExports.byteacmp)(e);
    Module._to_hex32 = (e) => (Module._to_hex32 = wasmExports.to_hex32)(e);
    Module._varstr_levenshtein = (e, t, r2, a2, o2, s2, l2, n2) => (Module._varstr_levenshtein = wasmExports.varstr_levenshtein)(e, t, r2, a2, o2, s2, l2, n2);
    Module._utf8_to_unicode = (e) => (Module._utf8_to_unicode = wasmExports.utf8_to_unicode)(e);
    Module._format_type_extended = (e, t, r2) => (Module._format_type_extended = wasmExports.format_type_extended)(e, t, r2);
    Module._array_create_iterator = (e, t, r2) => (Module._array_create_iterator = wasmExports.array_create_iterator)(e, t, r2);
    Module._array_iterate = (e, t, r2) => (Module._array_iterate = wasmExports.array_iterate)(e, t, r2);
    Module._make_expanded_record_from_typeid = (e, t, r2) => (Module._make_expanded_record_from_typeid = wasmExports.make_expanded_record_from_typeid)(e, t, r2);
    Module._make_expanded_record_from_tupdesc = (e, t) => (Module._make_expanded_record_from_tupdesc = wasmExports.make_expanded_record_from_tupdesc)(e, t);
    Module._make_expanded_record_from_exprecord = (e, t) => (Module._make_expanded_record_from_exprecord = wasmExports.make_expanded_record_from_exprecord)(e, t);
    Module._expanded_record_set_tuple = (e, t, r2, a2) => (Module._expanded_record_set_tuple = wasmExports.expanded_record_set_tuple)(e, t, r2, a2);
    Module._expanded_record_get_tuple = (e) => (Module._expanded_record_get_tuple = wasmExports.expanded_record_get_tuple)(e);
    Module._deconstruct_expanded_record = (e) => (Module._deconstruct_expanded_record = wasmExports.deconstruct_expanded_record)(e);
    Module._expanded_record_lookup_field = (e, t, r2) => (Module._expanded_record_lookup_field = wasmExports.expanded_record_lookup_field)(e, t, r2);
    Module._expanded_record_set_field_internal = (e, t, r2, a2, o2, s2) => (Module._expanded_record_set_field_internal = wasmExports.expanded_record_set_field_internal)(e, t, r2, a2, o2, s2);
    Module._expanded_record_set_fields = (e, t, r2, a2) => (Module._expanded_record_set_fields = wasmExports.expanded_record_set_fields)(e, t, r2, a2);
    Module._macaddr8_cmp = (e) => (Module._macaddr8_cmp = wasmExports.macaddr8_cmp)(e);
    Module._macaddr8_lt = (e) => (Module._macaddr8_lt = wasmExports.macaddr8_lt)(e);
    Module._macaddr8_le = (e) => (Module._macaddr8_le = wasmExports.macaddr8_le)(e);
    Module._macaddr8_eq = (e) => (Module._macaddr8_eq = wasmExports.macaddr8_eq)(e);
    Module._macaddr8_ge = (e) => (Module._macaddr8_ge = wasmExports.macaddr8_ge)(e);
    Module._macaddr8_gt = (e) => (Module._macaddr8_gt = wasmExports.macaddr8_gt)(e);
    Module._enum_lt = (e) => (Module._enum_lt = wasmExports.enum_lt)(e);
    Module._enum_le = (e) => (Module._enum_le = wasmExports.enum_le)(e);
    Module._enum_ge = (e) => (Module._enum_ge = wasmExports.enum_ge)(e);
    Module._enum_gt = (e) => (Module._enum_gt = wasmExports.enum_gt)(e);
    Module._enum_cmp = (e) => (Module._enum_cmp = wasmExports.enum_cmp)(e);
    Module._uuid_in = (e) => (Module._uuid_in = wasmExports.uuid_in)(e);
    Module._uuid_out = (e) => (Module._uuid_out = wasmExports.uuid_out)(e);
    Module._uuid_cmp = (e) => (Module._uuid_cmp = wasmExports.uuid_cmp)(e);
    Module._gen_random_uuid = (e) => (Module._gen_random_uuid = wasmExports.gen_random_uuid)(e);
    Module._generic_restriction_selectivity = (e, t, r2, a2, o2, s2) => (Module._generic_restriction_selectivity = wasmExports.generic_restriction_selectivity)(e, t, r2, a2, o2, s2);
    Module._genericcostestimate = (e, t, r2, a2) => (Module._genericcostestimate = wasmExports.genericcostestimate)(e, t, r2, a2);
    Module._pg_xml_init = (e) => (Module._pg_xml_init = wasmExports.pg_xml_init)(e);
    Module._xmlInitParser = () => (Module._xmlInitParser = wasmExports.xmlInitParser)();
    Module._xml_ereport = (e, t, r2, a2) => (Module._xml_ereport = wasmExports.xml_ereport)(e, t, r2, a2);
    Module._pg_xml_done = (e, t) => (Module._pg_xml_done = wasmExports.pg_xml_done)(e, t);
    Module._xmlXPathNewContext = (e) => (Module._xmlXPathNewContext = wasmExports.xmlXPathNewContext)(e);
    Module._xmlXPathFreeContext = (e) => (Module._xmlXPathFreeContext = wasmExports.xmlXPathFreeContext)(e);
    Module._xmlFreeDoc = (e) => (Module._xmlFreeDoc = wasmExports.xmlFreeDoc)(e);
    Module._xmlXPathCompile = (e) => (Module._xmlXPathCompile = wasmExports.xmlXPathCompile)(e);
    Module._xmlXPathCompiledEval = (e, t) => (Module._xmlXPathCompiledEval = wasmExports.xmlXPathCompiledEval)(e, t);
    Module._xmlXPathFreeCompExpr = (e) => (Module._xmlXPathFreeCompExpr = wasmExports.xmlXPathFreeCompExpr)(e);
    Module._xmlStrdup = (e) => (Module._xmlStrdup = wasmExports.xmlStrdup)(e);
    Module._strnlen = (e, t) => (Module._strnlen = wasmExports.strnlen)(e, t);
    Module._xmlXPathCastNodeToString = (e) => (Module._xmlXPathCastNodeToString = wasmExports.xmlXPathCastNodeToString)(e);
    Module._heap_modify_tuple_by_cols = (e, t, r2, a2, o2, s2) => (Module._heap_modify_tuple_by_cols = wasmExports.heap_modify_tuple_by_cols)(e, t, r2, a2, o2, s2);
    Module._ResourceOwnerReleaseAllPlanCacheRefs = (e) => (Module._ResourceOwnerReleaseAllPlanCacheRefs = wasmExports.ResourceOwnerReleaseAllPlanCacheRefs)(e);
    Module._RegisterResourceReleaseCallback = (e, t) => (Module._RegisterResourceReleaseCallback = wasmExports.RegisterResourceReleaseCallback)(e, t);
    Module._PinPortal = (e) => (Module._PinPortal = wasmExports.PinPortal)(e);
    Module._UnpinPortal = (e) => (Module._UnpinPortal = wasmExports.UnpinPortal)(e);
    Module._btint2cmp = (e) => (Module._btint2cmp = wasmExports.btint2cmp)(e);
    Module._btint4cmp = (e) => (Module._btint4cmp = wasmExports.btint4cmp)(e);
    Module._btoidcmp = (e) => (Module._btoidcmp = wasmExports.btoidcmp)(e);
    Module._btcharcmp = (e) => (Module._btcharcmp = wasmExports.btcharcmp)(e);
    Module._btint8cmp = (e) => (Module._btint8cmp = wasmExports.btint8cmp)(e);
    Module._btboolcmp = (e) => (Module._btboolcmp = wasmExports.btboolcmp)(e);
    Module._GetPublicationByName = (e, t) => (Module._GetPublicationByName = wasmExports.GetPublicationByName)(e, t);
    Module._GetTopMostAncestorInPublication = (e, t, r2) => (Module._GetTopMostAncestorInPublication = wasmExports.GetTopMostAncestorInPublication)(e, t, r2);
    Module._pub_collist_to_bitmapset = (e, t, r2) => (Module._pub_collist_to_bitmapset = wasmExports.pub_collist_to_bitmapset)(e, t, r2);
    Module._getExtensionOfObject = (e, t) => (Module._getExtensionOfObject = wasmExports.getExtensionOfObject)(e, t);
    Module._visibilitymap_prepare_truncate = (e, t) => (Module._visibilitymap_prepare_truncate = wasmExports.visibilitymap_prepare_truncate)(e, t);
    Module._log_newpage_range = (e, t, r2, a2, o2) => (Module._log_newpage_range = wasmExports.log_newpage_range)(e, t, r2, a2, o2);
    Module._function_parse_error_transpose = (e) => (Module._function_parse_error_transpose = wasmExports.function_parse_error_transpose)(e);
    Module._IndexGetRelation = (e, t) => (Module._IndexGetRelation = wasmExports.IndexGetRelation)(e, t);
    Module._RelnameGetRelid = (e) => (Module._RelnameGetRelid = wasmExports.RelnameGetRelid)(e);
    Module._standard_ProcessUtility = (e, t, r2, a2, o2, s2, l2, n2) => (Module._standard_ProcessUtility = wasmExports.standard_ProcessUtility)(e, t, r2, a2, o2, s2, l2, n2);
    Module._Async_Notify = (e, t) => (Module._Async_Notify = wasmExports.Async_Notify)(e, t);
    Module._sigaddset = (e, t) => (Module._sigaddset = wasmExports.sigaddset)(e, t);
    Module._fsync_pgdata = (e, t) => (Module._fsync_pgdata = wasmExports.fsync_pgdata)(e, t);
    Module._get_restricted_token = () => (Module._get_restricted_token = wasmExports.get_restricted_token)();
    Module._pg_malloc = (e) => (Module._pg_malloc = wasmExports.pg_malloc)(e);
    Module._pg_realloc = (e, t) => (Module._pg_realloc = wasmExports.pg_realloc)(e, t);
    Module._pg_strdup = (e) => (Module._pg_strdup = wasmExports.pg_strdup)(e);
    Module._simple_prompt = (e, t) => (Module._simple_prompt = wasmExports.simple_prompt)(e, t);
    Module._interactive_file = () => (Module._interactive_file = wasmExports.interactive_file)();
    Module._interactive_one = () => (Module._interactive_one = wasmExports.interactive_one)();
    Module._pg_shutdown = () => (Module._pg_shutdown = wasmExports.pg_shutdown)();
    Module._interactive_write = (e) => (Module._interactive_write = wasmExports.interactive_write)(e);
    Module._interactive_read = () => (Module._interactive_read = wasmExports.interactive_read)();
    Module._visibilitymap_pin = (e, t, r2) => (Module._visibilitymap_pin = wasmExports.visibilitymap_pin)(e, t, r2);
    Module._HeapTupleSatisfiesVacuum = (e, t, r2) => (Module._HeapTupleSatisfiesVacuum = wasmExports.HeapTupleSatisfiesVacuum)(e, t, r2);
    Module._visibilitymap_clear = (e, t, r2, a2) => (Module._visibilitymap_clear = wasmExports.visibilitymap_clear)(e, t, r2, a2);
    Module._vac_estimate_reltuples = (e, t, r2, a2) => (Module._vac_estimate_reltuples = wasmExports.vac_estimate_reltuples)(e, t, r2, a2);
    Module._heap_tuple_needs_eventual_freeze = (e) => (Module._heap_tuple_needs_eventual_freeze = wasmExports.heap_tuple_needs_eventual_freeze)(e);
    Module._HeapTupleSatisfiesUpdate = (e, t, r2) => (Module._HeapTupleSatisfiesUpdate = wasmExports.HeapTupleSatisfiesUpdate)(e, t, r2);
    Module._HeapTupleGetUpdateXid = (e) => (Module._HeapTupleGetUpdateXid = wasmExports.HeapTupleGetUpdateXid)(e);
    Module._HeapTupleSatisfiesVisibility = (e, t, r2) => (Module._HeapTupleSatisfiesVisibility = wasmExports.HeapTupleSatisfiesVisibility)(e, t, r2);
    Module._GetMultiXactIdMembers = (e, t, r2, a2) => (Module._GetMultiXactIdMembers = wasmExports.GetMultiXactIdMembers)(e, t, r2, a2);
    Module._XLogRecGetBlockTagExtended = (e, t, r2, a2, o2, s2) => (Module._XLogRecGetBlockTagExtended = wasmExports.XLogRecGetBlockTagExtended)(e, t, r2, a2, o2, s2);
    Module._toast_open_indexes = (e, t, r2, a2) => (Module._toast_open_indexes = wasmExports.toast_open_indexes)(e, t, r2, a2);
    Module._init_toast_snapshot = (e) => (Module._init_toast_snapshot = wasmExports.init_toast_snapshot)(e);
    Module._toast_close_indexes = (e, t, r2) => (Module._toast_close_indexes = wasmExports.toast_close_indexes)(e, t, r2);
    Module._index_getprocinfo = (e, t, r2) => (Module._index_getprocinfo = wasmExports.index_getprocinfo)(e, t, r2);
    Module._identify_opfamily_groups = (e, t) => (Module._identify_opfamily_groups = wasmExports.identify_opfamily_groups)(e, t);
    Module._check_amproc_signature = (e, t, r2, a2, o2, s2) => (Module._check_amproc_signature = wasmExports.check_amproc_signature)(e, t, r2, a2, o2, s2);
    Module._check_amoptsproc_signature = (e) => (Module._check_amoptsproc_signature = wasmExports.check_amoptsproc_signature)(e);
    Module._check_amop_signature = (e, t, r2, a2) => (Module._check_amop_signature = wasmExports.check_amop_signature)(e, t, r2, a2);
    Module._RelationGetIndexScan = (e, t, r2) => (Module._RelationGetIndexScan = wasmExports.RelationGetIndexScan)(e, t, r2);
    Module.__hash_get_indextuple_hashkey = (e) => (Module.__hash_get_indextuple_hashkey = wasmExports._hash_get_indextuple_hashkey)(e);
    Module.__hash_getbuf = (e, t, r2, a2) => (Module.__hash_getbuf = wasmExports._hash_getbuf)(e, t, r2, a2);
    Module.__hash_relbuf = (e, t) => (Module.__hash_relbuf = wasmExports._hash_relbuf)(e, t);
    Module.__hash_getbuf_with_strategy = (e, t, r2, a2, o2) => (Module.__hash_getbuf_with_strategy = wasmExports._hash_getbuf_with_strategy)(e, t, r2, a2, o2);
    Module._build_reloptions = (e, t, r2, a2, o2, s2) => (Module._build_reloptions = wasmExports.build_reloptions)(e, t, r2, a2, o2, s2);
    Module._index_form_tuple = (e, t, r2) => (Module._index_form_tuple = wasmExports.index_form_tuple)(e, t, r2);
    Module.__hash_ovflblkno_to_bitno = (e, t) => (Module.__hash_ovflblkno_to_bitno = wasmExports._hash_ovflblkno_to_bitno)(e, t);
    Module._brin_build_desc = (e) => (Module._brin_build_desc = wasmExports.brin_build_desc)(e);
    Module._brin_deform_tuple = (e, t, r2) => (Module._brin_deform_tuple = wasmExports.brin_deform_tuple)(e, t, r2);
    Module._brin_free_desc = (e) => (Module._brin_free_desc = wasmExports.brin_free_desc)(e);
    Module._XLogRecGetBlockRefInfo = (e, t, r2, a2, o2) => (Module._XLogRecGetBlockRefInfo = wasmExports.XLogRecGetBlockRefInfo)(e, t, r2, a2, o2);
    Module._ginPostingListDecode = (e, t) => (Module._ginPostingListDecode = wasmExports.ginPostingListDecode)(e, t);
    Module._add_reloption_kind = () => (Module._add_reloption_kind = wasmExports.add_reloption_kind)();
    Module._register_reloptions_validator = (e, t) => (Module._register_reloptions_validator = wasmExports.register_reloptions_validator)(e, t);
    Module._add_int_reloption = (e, t, r2, a2, o2, s2, l2) => (Module._add_int_reloption = wasmExports.add_int_reloption)(e, t, r2, a2, o2, s2, l2);
    Module._XLogFindNextRecord = (e, t) => (Module._XLogFindNextRecord = wasmExports.XLogFindNextRecord)(e, t);
    Module._RestoreBlockImage = (e, t, r2) => (Module._RestoreBlockImage = wasmExports.RestoreBlockImage)(e, t, r2);
    Module._GenericXLogStart = (e) => (Module._GenericXLogStart = wasmExports.GenericXLogStart)(e);
    Module._GenericXLogRegisterBuffer = (e, t, r2) => (Module._GenericXLogRegisterBuffer = wasmExports.GenericXLogRegisterBuffer)(e, t, r2);
    Module._GenericXLogFinish = (e) => (Module._GenericXLogFinish = wasmExports.GenericXLogFinish)(e);
    Module._GenericXLogAbort = (e) => (Module._GenericXLogAbort = wasmExports.GenericXLogAbort)(e);
    Module._read_local_xlog_page_no_wait = (e, t, r2, a2, o2) => (Module._read_local_xlog_page_no_wait = wasmExports.read_local_xlog_page_no_wait)(e, t, r2, a2, o2);
    Module._XLogRecStoreStats = (e, t) => (Module._XLogRecStoreStats = wasmExports.XLogRecStoreStats)(e, t);
    Module._ReadMultiXactIdRange = (e, t) => (Module._ReadMultiXactIdRange = wasmExports.ReadMultiXactIdRange)(e, t);
    Module._MultiXactIdPrecedesOrEquals = (e, t) => (Module._MultiXactIdPrecedesOrEquals = wasmExports.MultiXactIdPrecedesOrEquals)(e, t);
    Module._RegisterXactCallback = (e, t) => (Module._RegisterXactCallback = wasmExports.RegisterXactCallback)(e, t);
    Module._RegisterSubXactCallback = (e, t) => (Module._RegisterSubXactCallback = wasmExports.RegisterSubXactCallback)(e, t);
    Module._ReleaseCurrentSubTransaction = () => (Module._ReleaseCurrentSubTransaction = wasmExports.ReleaseCurrentSubTransaction)();
    Module._WaitForParallelWorkersToAttach = (e) => (Module._WaitForParallelWorkersToAttach = wasmExports.WaitForParallelWorkersToAttach)(e);
    Module.__bt_allequalimage = (e, t) => (Module.__bt_allequalimage = wasmExports._bt_allequalimage)(e, t);
    Module.__bt_checkpage = (e, t) => (Module.__bt_checkpage = wasmExports._bt_checkpage)(e, t);
    Module.__bt_relbuf = (e, t) => (Module.__bt_relbuf = wasmExports._bt_relbuf)(e, t);
    Module.__bt_metaversion = (e, t, r2) => (Module.__bt_metaversion = wasmExports._bt_metaversion)(e, t, r2);
    Module.__bt_search = (e, t, r2, a2, o2, s2) => (Module.__bt_search = wasmExports._bt_search)(e, t, r2, a2, o2, s2);
    Module.__bt_compare = (e, t, r2, a2) => (Module.__bt_compare = wasmExports._bt_compare)(e, t, r2, a2);
    Module.__bt_binsrch_insert = (e, t) => (Module.__bt_binsrch_insert = wasmExports._bt_binsrch_insert)(e, t);
    Module.__bt_freestack = (e) => (Module.__bt_freestack = wasmExports._bt_freestack)(e);
    Module.__bt_form_posting = (e, t, r2) => (Module.__bt_form_posting = wasmExports._bt_form_posting)(e, t, r2);
    Module.__bt_check_natts = (e, t, r2, a2) => (Module.__bt_check_natts = wasmExports._bt_check_natts)(e, t, r2, a2);
    Module._gistcheckpage = (e, t) => (Module._gistcheckpage = wasmExports.gistcheckpage)(e, t);
    Module._EndCopyFrom = (e) => (Module._EndCopyFrom = wasmExports.EndCopyFrom)(e);
    Module._ProcessCopyOptions = (e, t, r2, a2) => (Module._ProcessCopyOptions = wasmExports.ProcessCopyOptions)(e, t, r2, a2);
    Module._CopyFromErrorCallback = (e) => (Module._CopyFromErrorCallback = wasmExports.CopyFromErrorCallback)(e);
    Module._NextCopyFrom = (e, t, r2, a2) => (Module._NextCopyFrom = wasmExports.NextCopyFrom)(e, t, r2, a2);
    Module._nextval = (e) => (Module._nextval = wasmExports.nextval)(e);
    Module._defGetStreamingMode = (e) => (Module._defGetStreamingMode = wasmExports.defGetStreamingMode)(e);
    Module._ExplainBeginOutput = (e) => (Module._ExplainBeginOutput = wasmExports.ExplainBeginOutput)(e);
    Module._NewExplainState = () => (Module._NewExplainState = wasmExports.NewExplainState)();
    Module._ExplainEndOutput = (e) => (Module._ExplainEndOutput = wasmExports.ExplainEndOutput)(e);
    Module._ExplainPrintPlan = (e, t) => (Module._ExplainPrintPlan = wasmExports.ExplainPrintPlan)(e, t);
    Module._ExplainPrintTriggers = (e, t) => (Module._ExplainPrintTriggers = wasmExports.ExplainPrintTriggers)(e, t);
    Module._ExplainPrintJITSummary = (e, t) => (Module._ExplainPrintJITSummary = wasmExports.ExplainPrintJITSummary)(e, t);
    Module._ExplainPropertyInteger = (e, t, r2, a2) => (Module._ExplainPropertyInteger = wasmExports.ExplainPropertyInteger)(e, t, r2, a2);
    Module._ExplainQueryText = (e, t) => (Module._ExplainQueryText = wasmExports.ExplainQueryText)(e, t);
    Module._ExplainPropertyText = (e, t, r2) => (Module._ExplainPropertyText = wasmExports.ExplainPropertyText)(e, t, r2);
    Module._ExplainQueryParameters = (e, t, r2) => (Module._ExplainQueryParameters = wasmExports.ExplainQueryParameters)(e, t, r2);
    Module._pg_is_ascii = (e) => (Module._pg_is_ascii = wasmExports.pg_is_ascii)(e);
    Module._fputs = (e, t) => (Module._fputs = wasmExports.fputs)(e, t);
    Module._popen = (e, t) => (Module._popen = wasmExports.popen)(e, t);
    Module._float_to_shortest_decimal_bufn = (e, t) => (Module._float_to_shortest_decimal_bufn = wasmExports.float_to_shortest_decimal_bufn)(e, t);
    Module._pg_prng_uint64 = (e) => (Module._pg_prng_uint64 = wasmExports.pg_prng_uint64)(e);
    Module._scram_ClientKey = (e, t, r2, a2, o2) => (Module._scram_ClientKey = wasmExports.scram_ClientKey)(e, t, r2, a2, o2);
    Module._pg_encoding_dsplen = (e, t) => (Module._pg_encoding_dsplen = wasmExports.pg_encoding_dsplen)(e, t);
    Module._getcwd = (e, t) => (Module._getcwd = wasmExports.getcwd)(e, t);
    Module._pg_get_user_home_dir = (e, t, r2) => (Module._pg_get_user_home_dir = wasmExports.pg_get_user_home_dir)(e, t, r2);
    Module._nanosleep = (e, t) => (Module._nanosleep = wasmExports.nanosleep)(e, t);
    Module._snprintf = (e, t, r2, a2) => (Module._snprintf = wasmExports.snprintf)(e, t, r2, a2);
    Module._pg_strerror_r = (e, t, r2) => (Module._pg_strerror_r = wasmExports.pg_strerror_r)(e, t, r2);
    Module._pthread_mutex_lock = (e) => (Module._pthread_mutex_lock = wasmExports.pthread_mutex_lock)(e);
    Module._pthread_mutex_unlock = (e) => (Module._pthread_mutex_unlock = wasmExports.pthread_mutex_unlock)(e);
    Module._strncat = (e, t, r2) => (Module._strncat = wasmExports.strncat)(e, t, r2);
    Module._PQexec = (e, t) => (Module._PQexec = wasmExports.PQexec)(e, t);
    Module._PQsetSingleRowMode = (e) => (Module._PQsetSingleRowMode = wasmExports.PQsetSingleRowMode)(e);
    Module._PQcmdStatus = (e) => (Module._PQcmdStatus = wasmExports.PQcmdStatus)(e);
    Module._pthread_sigmask = (e, t, r2) => (Module._pthread_sigmask = wasmExports.pthread_sigmask)(e, t, r2);
    Module._sigismember = (e, t) => (Module._sigismember = wasmExports.sigismember)(e, t);
    Module._sigpending = (e) => (Module._sigpending = wasmExports.sigpending)(e);
    Module._sigwait = (e, t) => (Module._sigwait = wasmExports.sigwait)(e, t);
    Module._isolat1ToUTF8 = (e, t, r2, a2) => (Module._isolat1ToUTF8 = wasmExports.isolat1ToUTF8)(e, t, r2, a2);
    Module._UTF8Toisolat1 = (e, t, r2, a2) => (Module._UTF8Toisolat1 = wasmExports.UTF8Toisolat1)(e, t, r2, a2);
    Module._vfprintf = (e, t, r2) => (Module._vfprintf = wasmExports.vfprintf)(e, t, r2);
    Module._vsnprintf = (e, t, r2, a2) => (Module._vsnprintf = wasmExports.vsnprintf)(e, t, r2, a2);
    Module._xmlParserValidityWarning = (e, t, r2) => (Module._xmlParserValidityWarning = wasmExports.xmlParserValidityWarning)(e, t, r2);
    Module._xmlParserValidityError = (e, t, r2) => (Module._xmlParserValidityError = wasmExports.xmlParserValidityError)(e, t, r2);
    Module._xmlParserError = (e, t, r2) => (Module._xmlParserError = wasmExports.xmlParserError)(e, t, r2);
    Module._xmlParserWarning = (e, t, r2) => (Module._xmlParserWarning = wasmExports.xmlParserWarning)(e, t, r2);
    Module._fprintf = (e, t, r2) => (Module._fprintf = wasmExports.fprintf)(e, t, r2);
    Module.___xmlParserInputBufferCreateFilename = (e, t) => (Module.___xmlParserInputBufferCreateFilename = wasmExports.__xmlParserInputBufferCreateFilename)(e, t);
    Module.___xmlOutputBufferCreateFilename = (e, t, r2) => (Module.___xmlOutputBufferCreateFilename = wasmExports.__xmlOutputBufferCreateFilename)(e, t, r2);
    Module._xmlSAX2InternalSubset = (e, t, r2, a2) => (Module._xmlSAX2InternalSubset = wasmExports.xmlSAX2InternalSubset)(e, t, r2, a2);
    Module._xmlSAX2IsStandalone = (e) => (Module._xmlSAX2IsStandalone = wasmExports.xmlSAX2IsStandalone)(e);
    Module._xmlSAX2HasInternalSubset = (e) => (Module._xmlSAX2HasInternalSubset = wasmExports.xmlSAX2HasInternalSubset)(e);
    Module._xmlSAX2HasExternalSubset = (e) => (Module._xmlSAX2HasExternalSubset = wasmExports.xmlSAX2HasExternalSubset)(e);
    Module._xmlSAX2ResolveEntity = (e, t, r2) => (Module._xmlSAX2ResolveEntity = wasmExports.xmlSAX2ResolveEntity)(e, t, r2);
    Module._xmlSAX2GetEntity = (e, t) => (Module._xmlSAX2GetEntity = wasmExports.xmlSAX2GetEntity)(e, t);
    Module._xmlSAX2EntityDecl = (e, t, r2, a2, o2, s2) => (Module._xmlSAX2EntityDecl = wasmExports.xmlSAX2EntityDecl)(e, t, r2, a2, o2, s2);
    Module._xmlSAX2NotationDecl = (e, t, r2, a2) => (Module._xmlSAX2NotationDecl = wasmExports.xmlSAX2NotationDecl)(e, t, r2, a2);
    Module._xmlSAX2AttributeDecl = (e, t, r2, a2, o2, s2, l2) => (Module._xmlSAX2AttributeDecl = wasmExports.xmlSAX2AttributeDecl)(e, t, r2, a2, o2, s2, l2);
    Module._xmlSAX2ElementDecl = (e, t, r2, a2) => (Module._xmlSAX2ElementDecl = wasmExports.xmlSAX2ElementDecl)(e, t, r2, a2);
    Module._xmlSAX2UnparsedEntityDecl = (e, t, r2, a2, o2) => (Module._xmlSAX2UnparsedEntityDecl = wasmExports.xmlSAX2UnparsedEntityDecl)(e, t, r2, a2, o2);
    Module._xmlSAX2SetDocumentLocator = (e, t) => (Module._xmlSAX2SetDocumentLocator = wasmExports.xmlSAX2SetDocumentLocator)(e, t);
    Module._xmlSAX2StartDocument = (e) => (Module._xmlSAX2StartDocument = wasmExports.xmlSAX2StartDocument)(e);
    Module._xmlSAX2EndDocument = (e) => (Module._xmlSAX2EndDocument = wasmExports.xmlSAX2EndDocument)(e);
    Module._xmlSAX2StartElement = (e, t, r2) => (Module._xmlSAX2StartElement = wasmExports.xmlSAX2StartElement)(e, t, r2);
    Module._xmlSAX2EndElement = (e, t) => (Module._xmlSAX2EndElement = wasmExports.xmlSAX2EndElement)(e, t);
    Module._xmlSAX2Reference = (e, t) => (Module._xmlSAX2Reference = wasmExports.xmlSAX2Reference)(e, t);
    Module._xmlSAX2Characters = (e, t, r2) => (Module._xmlSAX2Characters = wasmExports.xmlSAX2Characters)(e, t, r2);
    Module._xmlSAX2ProcessingInstruction = (e, t, r2) => (Module._xmlSAX2ProcessingInstruction = wasmExports.xmlSAX2ProcessingInstruction)(e, t, r2);
    Module._xmlSAX2Comment = (e, t) => (Module._xmlSAX2Comment = wasmExports.xmlSAX2Comment)(e, t);
    Module._xmlSAX2GetParameterEntity = (e, t) => (Module._xmlSAX2GetParameterEntity = wasmExports.xmlSAX2GetParameterEntity)(e, t);
    Module._xmlSAX2CDataBlock = (e, t, r2) => (Module._xmlSAX2CDataBlock = wasmExports.xmlSAX2CDataBlock)(e, t, r2);
    Module._xmlSAX2ExternalSubset = (e, t, r2, a2) => (Module._xmlSAX2ExternalSubset = wasmExports.xmlSAX2ExternalSubset)(e, t, r2, a2);
    Module._xmlSAX2GetPublicId = (e) => (Module._xmlSAX2GetPublicId = wasmExports.xmlSAX2GetPublicId)(e);
    Module._xmlSAX2GetSystemId = (e) => (Module._xmlSAX2GetSystemId = wasmExports.xmlSAX2GetSystemId)(e);
    Module._xmlSAX2GetLineNumber = (e) => (Module._xmlSAX2GetLineNumber = wasmExports.xmlSAX2GetLineNumber)(e);
    Module._xmlSAX2GetColumnNumber = (e) => (Module._xmlSAX2GetColumnNumber = wasmExports.xmlSAX2GetColumnNumber)(e);
    Module._xmlSAX2IgnorableWhitespace = (e, t, r2) => (Module._xmlSAX2IgnorableWhitespace = wasmExports.xmlSAX2IgnorableWhitespace)(e, t, r2);
    Module._xmlHashDefaultDeallocator = (e, t) => (Module._xmlHashDefaultDeallocator = wasmExports.xmlHashDefaultDeallocator)(e, t);
    Module._iconv_open = (e, t) => (Module._iconv_open = wasmExports.iconv_open)(e, t);
    Module._iconv_close = (e) => (Module._iconv_close = wasmExports.iconv_close)(e);
    Module._iconv = (e, t, r2, a2, o2) => (Module._iconv = wasmExports.iconv)(e, t, r2, a2, o2);
    Module._UTF8ToHtml = (e, t, r2, a2) => (Module._UTF8ToHtml = wasmExports.UTF8ToHtml)(e, t, r2, a2);
    Module._xmlReadMemory = (e, t, r2, a2, o2) => (Module._xmlReadMemory = wasmExports.xmlReadMemory)(e, t, r2, a2, o2);
    Module._xmlSAX2StartElementNs = (e, t, r2, a2, o2, s2, l2, n2, _2) => (Module._xmlSAX2StartElementNs = wasmExports.xmlSAX2StartElementNs)(e, t, r2, a2, o2, s2, l2, n2, _2);
    Module._xmlSAX2EndElementNs = (e, t, r2, a2) => (Module._xmlSAX2EndElementNs = wasmExports.xmlSAX2EndElementNs)(e, t, r2, a2);
    Module.___cxa_atexit = (e, t, r2) => (Module.___cxa_atexit = wasmExports.__cxa_atexit)(e, t, r2);
    Module._xmlDocGetRootElement = (e) => (Module._xmlDocGetRootElement = wasmExports.xmlDocGetRootElement)(e);
    Module._xmlFileMatch = (e) => (Module._xmlFileMatch = wasmExports.xmlFileMatch)(e);
    Module._xmlFileOpen = (e) => (Module._xmlFileOpen = wasmExports.xmlFileOpen)(e);
    Module._xmlFileRead = (e, t, r2) => (Module._xmlFileRead = wasmExports.xmlFileRead)(e, t, r2);
    Module._xmlFileClose = (e) => (Module._xmlFileClose = wasmExports.xmlFileClose)(e);
    Module._gzread = (e, t, r2) => (Module._gzread = wasmExports.gzread)(e, t, r2);
    Module._gzclose = (e) => (Module._gzclose = wasmExports.gzclose)(e);
    Module._gzdirect = (e) => (Module._gzdirect = wasmExports.gzdirect)(e);
    Module._gzdopen = (e, t) => (Module._gzdopen = wasmExports.gzdopen)(e, t);
    Module._gzopen = (e, t) => (Module._gzopen = wasmExports.gzopen)(e, t);
    Module._gzwrite = (e, t, r2) => (Module._gzwrite = wasmExports.gzwrite)(e, t, r2);
    Module._xmlUCSIsCatNd = (e) => (Module._xmlUCSIsCatNd = wasmExports.xmlUCSIsCatNd)(e);
    Module._xmlUCSIsCatP = (e) => (Module._xmlUCSIsCatP = wasmExports.xmlUCSIsCatP)(e);
    Module._xmlUCSIsCatZ = (e) => (Module._xmlUCSIsCatZ = wasmExports.xmlUCSIsCatZ)(e);
    Module._xmlUCSIsCatC = (e) => (Module._xmlUCSIsCatC = wasmExports.xmlUCSIsCatC)(e);
    Module._xmlUCSIsCatL = (e) => (Module._xmlUCSIsCatL = wasmExports.xmlUCSIsCatL)(e);
    Module._xmlUCSIsCatLu = (e) => (Module._xmlUCSIsCatLu = wasmExports.xmlUCSIsCatLu)(e);
    Module._xmlUCSIsCatLl = (e) => (Module._xmlUCSIsCatLl = wasmExports.xmlUCSIsCatLl)(e);
    Module._xmlUCSIsCatLt = (e) => (Module._xmlUCSIsCatLt = wasmExports.xmlUCSIsCatLt)(e);
    Module._xmlUCSIsCatLm = (e) => (Module._xmlUCSIsCatLm = wasmExports.xmlUCSIsCatLm)(e);
    Module._xmlUCSIsCatLo = (e) => (Module._xmlUCSIsCatLo = wasmExports.xmlUCSIsCatLo)(e);
    Module._xmlUCSIsCatM = (e) => (Module._xmlUCSIsCatM = wasmExports.xmlUCSIsCatM)(e);
    Module._xmlUCSIsCatMn = (e) => (Module._xmlUCSIsCatMn = wasmExports.xmlUCSIsCatMn)(e);
    Module._xmlUCSIsCatMc = (e) => (Module._xmlUCSIsCatMc = wasmExports.xmlUCSIsCatMc)(e);
    Module._xmlUCSIsCatMe = (e) => (Module._xmlUCSIsCatMe = wasmExports.xmlUCSIsCatMe)(e);
    Module._xmlUCSIsCatN = (e) => (Module._xmlUCSIsCatN = wasmExports.xmlUCSIsCatN)(e);
    Module._xmlUCSIsCatNl = (e) => (Module._xmlUCSIsCatNl = wasmExports.xmlUCSIsCatNl)(e);
    Module._xmlUCSIsCatNo = (e) => (Module._xmlUCSIsCatNo = wasmExports.xmlUCSIsCatNo)(e);
    Module._xmlUCSIsCatPc = (e) => (Module._xmlUCSIsCatPc = wasmExports.xmlUCSIsCatPc)(e);
    Module._xmlUCSIsCatPd = (e) => (Module._xmlUCSIsCatPd = wasmExports.xmlUCSIsCatPd)(e);
    Module._xmlUCSIsCatPs = (e) => (Module._xmlUCSIsCatPs = wasmExports.xmlUCSIsCatPs)(e);
    Module._xmlUCSIsCatPe = (e) => (Module._xmlUCSIsCatPe = wasmExports.xmlUCSIsCatPe)(e);
    Module._xmlUCSIsCatPi = (e) => (Module._xmlUCSIsCatPi = wasmExports.xmlUCSIsCatPi)(e);
    Module._xmlUCSIsCatPf = (e) => (Module._xmlUCSIsCatPf = wasmExports.xmlUCSIsCatPf)(e);
    Module._xmlUCSIsCatPo = (e) => (Module._xmlUCSIsCatPo = wasmExports.xmlUCSIsCatPo)(e);
    Module._xmlUCSIsCatZs = (e) => (Module._xmlUCSIsCatZs = wasmExports.xmlUCSIsCatZs)(e);
    Module._xmlUCSIsCatZl = (e) => (Module._xmlUCSIsCatZl = wasmExports.xmlUCSIsCatZl)(e);
    Module._xmlUCSIsCatZp = (e) => (Module._xmlUCSIsCatZp = wasmExports.xmlUCSIsCatZp)(e);
    Module._xmlUCSIsCatS = (e) => (Module._xmlUCSIsCatS = wasmExports.xmlUCSIsCatS)(e);
    Module._xmlUCSIsCatSm = (e) => (Module._xmlUCSIsCatSm = wasmExports.xmlUCSIsCatSm)(e);
    Module._xmlUCSIsCatSc = (e) => (Module._xmlUCSIsCatSc = wasmExports.xmlUCSIsCatSc)(e);
    Module._xmlUCSIsCatSk = (e) => (Module._xmlUCSIsCatSk = wasmExports.xmlUCSIsCatSk)(e);
    Module._xmlUCSIsCatSo = (e) => (Module._xmlUCSIsCatSo = wasmExports.xmlUCSIsCatSo)(e);
    Module._xmlUCSIsCatCc = (e) => (Module._xmlUCSIsCatCc = wasmExports.xmlUCSIsCatCc)(e);
    Module._xmlUCSIsCatCf = (e) => (Module._xmlUCSIsCatCf = wasmExports.xmlUCSIsCatCf)(e);
    Module._xmlUCSIsCatCo = (e) => (Module._xmlUCSIsCatCo = wasmExports.xmlUCSIsCatCo)(e);
    Module._xmlUCSIsAegeanNumbers = (e) => (Module._xmlUCSIsAegeanNumbers = wasmExports.xmlUCSIsAegeanNumbers)(e);
    Module._xmlUCSIsAlphabeticPresentationForms = (e) => (Module._xmlUCSIsAlphabeticPresentationForms = wasmExports.xmlUCSIsAlphabeticPresentationForms)(e);
    Module._xmlUCSIsArabic = (e) => (Module._xmlUCSIsArabic = wasmExports.xmlUCSIsArabic)(e);
    Module._xmlUCSIsArabicPresentationFormsA = (e) => (Module._xmlUCSIsArabicPresentationFormsA = wasmExports.xmlUCSIsArabicPresentationFormsA)(e);
    Module._xmlUCSIsArabicPresentationFormsB = (e) => (Module._xmlUCSIsArabicPresentationFormsB = wasmExports.xmlUCSIsArabicPresentationFormsB)(e);
    Module._xmlUCSIsArmenian = (e) => (Module._xmlUCSIsArmenian = wasmExports.xmlUCSIsArmenian)(e);
    Module._xmlUCSIsArrows = (e) => (Module._xmlUCSIsArrows = wasmExports.xmlUCSIsArrows)(e);
    Module._xmlUCSIsBasicLatin = (e) => (Module._xmlUCSIsBasicLatin = wasmExports.xmlUCSIsBasicLatin)(e);
    Module._xmlUCSIsBengali = (e) => (Module._xmlUCSIsBengali = wasmExports.xmlUCSIsBengali)(e);
    Module._xmlUCSIsBlockElements = (e) => (Module._xmlUCSIsBlockElements = wasmExports.xmlUCSIsBlockElements)(e);
    Module._xmlUCSIsBopomofo = (e) => (Module._xmlUCSIsBopomofo = wasmExports.xmlUCSIsBopomofo)(e);
    Module._xmlUCSIsBopomofoExtended = (e) => (Module._xmlUCSIsBopomofoExtended = wasmExports.xmlUCSIsBopomofoExtended)(e);
    Module._xmlUCSIsBoxDrawing = (e) => (Module._xmlUCSIsBoxDrawing = wasmExports.xmlUCSIsBoxDrawing)(e);
    Module._xmlUCSIsBraillePatterns = (e) => (Module._xmlUCSIsBraillePatterns = wasmExports.xmlUCSIsBraillePatterns)(e);
    Module._xmlUCSIsBuhid = (e) => (Module._xmlUCSIsBuhid = wasmExports.xmlUCSIsBuhid)(e);
    Module._xmlUCSIsByzantineMusicalSymbols = (e) => (Module._xmlUCSIsByzantineMusicalSymbols = wasmExports.xmlUCSIsByzantineMusicalSymbols)(e);
    Module._xmlUCSIsCJKCompatibility = (e) => (Module._xmlUCSIsCJKCompatibility = wasmExports.xmlUCSIsCJKCompatibility)(e);
    Module._xmlUCSIsCJKCompatibilityForms = (e) => (Module._xmlUCSIsCJKCompatibilityForms = wasmExports.xmlUCSIsCJKCompatibilityForms)(e);
    Module._xmlUCSIsCJKCompatibilityIdeographs = (e) => (Module._xmlUCSIsCJKCompatibilityIdeographs = wasmExports.xmlUCSIsCJKCompatibilityIdeographs)(e);
    Module._xmlUCSIsCJKCompatibilityIdeographsSupplement = (e) => (Module._xmlUCSIsCJKCompatibilityIdeographsSupplement = wasmExports.xmlUCSIsCJKCompatibilityIdeographsSupplement)(e);
    Module._xmlUCSIsCJKRadicalsSupplement = (e) => (Module._xmlUCSIsCJKRadicalsSupplement = wasmExports.xmlUCSIsCJKRadicalsSupplement)(e);
    Module._xmlUCSIsCJKSymbolsandPunctuation = (e) => (Module._xmlUCSIsCJKSymbolsandPunctuation = wasmExports.xmlUCSIsCJKSymbolsandPunctuation)(e);
    Module._xmlUCSIsCJKUnifiedIdeographs = (e) => (Module._xmlUCSIsCJKUnifiedIdeographs = wasmExports.xmlUCSIsCJKUnifiedIdeographs)(e);
    Module._xmlUCSIsCJKUnifiedIdeographsExtensionA = (e) => (Module._xmlUCSIsCJKUnifiedIdeographsExtensionA = wasmExports.xmlUCSIsCJKUnifiedIdeographsExtensionA)(e);
    Module._xmlUCSIsCJKUnifiedIdeographsExtensionB = (e) => (Module._xmlUCSIsCJKUnifiedIdeographsExtensionB = wasmExports.xmlUCSIsCJKUnifiedIdeographsExtensionB)(e);
    Module._xmlUCSIsCherokee = (e) => (Module._xmlUCSIsCherokee = wasmExports.xmlUCSIsCherokee)(e);
    Module._xmlUCSIsCombiningDiacriticalMarks = (e) => (Module._xmlUCSIsCombiningDiacriticalMarks = wasmExports.xmlUCSIsCombiningDiacriticalMarks)(e);
    Module._xmlUCSIsCombiningDiacriticalMarksforSymbols = (e) => (Module._xmlUCSIsCombiningDiacriticalMarksforSymbols = wasmExports.xmlUCSIsCombiningDiacriticalMarksforSymbols)(e);
    Module._xmlUCSIsCombiningHalfMarks = (e) => (Module._xmlUCSIsCombiningHalfMarks = wasmExports.xmlUCSIsCombiningHalfMarks)(e);
    Module._xmlUCSIsCombiningMarksforSymbols = (e) => (Module._xmlUCSIsCombiningMarksforSymbols = wasmExports.xmlUCSIsCombiningMarksforSymbols)(e);
    Module._xmlUCSIsControlPictures = (e) => (Module._xmlUCSIsControlPictures = wasmExports.xmlUCSIsControlPictures)(e);
    Module._xmlUCSIsCurrencySymbols = (e) => (Module._xmlUCSIsCurrencySymbols = wasmExports.xmlUCSIsCurrencySymbols)(e);
    Module._xmlUCSIsCypriotSyllabary = (e) => (Module._xmlUCSIsCypriotSyllabary = wasmExports.xmlUCSIsCypriotSyllabary)(e);
    Module._xmlUCSIsCyrillic = (e) => (Module._xmlUCSIsCyrillic = wasmExports.xmlUCSIsCyrillic)(e);
    Module._xmlUCSIsCyrillicSupplement = (e) => (Module._xmlUCSIsCyrillicSupplement = wasmExports.xmlUCSIsCyrillicSupplement)(e);
    Module._xmlUCSIsDeseret = (e) => (Module._xmlUCSIsDeseret = wasmExports.xmlUCSIsDeseret)(e);
    Module._xmlUCSIsDevanagari = (e) => (Module._xmlUCSIsDevanagari = wasmExports.xmlUCSIsDevanagari)(e);
    Module._xmlUCSIsDingbats = (e) => (Module._xmlUCSIsDingbats = wasmExports.xmlUCSIsDingbats)(e);
    Module._xmlUCSIsEnclosedAlphanumerics = (e) => (Module._xmlUCSIsEnclosedAlphanumerics = wasmExports.xmlUCSIsEnclosedAlphanumerics)(e);
    Module._xmlUCSIsEnclosedCJKLettersandMonths = (e) => (Module._xmlUCSIsEnclosedCJKLettersandMonths = wasmExports.xmlUCSIsEnclosedCJKLettersandMonths)(e);
    Module._xmlUCSIsEthiopic = (e) => (Module._xmlUCSIsEthiopic = wasmExports.xmlUCSIsEthiopic)(e);
    Module._xmlUCSIsGeneralPunctuation = (e) => (Module._xmlUCSIsGeneralPunctuation = wasmExports.xmlUCSIsGeneralPunctuation)(e);
    Module._xmlUCSIsGeometricShapes = (e) => (Module._xmlUCSIsGeometricShapes = wasmExports.xmlUCSIsGeometricShapes)(e);
    Module._xmlUCSIsGeorgian = (e) => (Module._xmlUCSIsGeorgian = wasmExports.xmlUCSIsGeorgian)(e);
    Module._xmlUCSIsGothic = (e) => (Module._xmlUCSIsGothic = wasmExports.xmlUCSIsGothic)(e);
    Module._xmlUCSIsGreek = (e) => (Module._xmlUCSIsGreek = wasmExports.xmlUCSIsGreek)(e);
    Module._xmlUCSIsGreekExtended = (e) => (Module._xmlUCSIsGreekExtended = wasmExports.xmlUCSIsGreekExtended)(e);
    Module._xmlUCSIsGreekandCoptic = (e) => (Module._xmlUCSIsGreekandCoptic = wasmExports.xmlUCSIsGreekandCoptic)(e);
    Module._xmlUCSIsGujarati = (e) => (Module._xmlUCSIsGujarati = wasmExports.xmlUCSIsGujarati)(e);
    Module._xmlUCSIsGurmukhi = (e) => (Module._xmlUCSIsGurmukhi = wasmExports.xmlUCSIsGurmukhi)(e);
    Module._xmlUCSIsHalfwidthandFullwidthForms = (e) => (Module._xmlUCSIsHalfwidthandFullwidthForms = wasmExports.xmlUCSIsHalfwidthandFullwidthForms)(e);
    Module._xmlUCSIsHangulCompatibilityJamo = (e) => (Module._xmlUCSIsHangulCompatibilityJamo = wasmExports.xmlUCSIsHangulCompatibilityJamo)(e);
    Module._xmlUCSIsHangulJamo = (e) => (Module._xmlUCSIsHangulJamo = wasmExports.xmlUCSIsHangulJamo)(e);
    Module._xmlUCSIsHangulSyllables = (e) => (Module._xmlUCSIsHangulSyllables = wasmExports.xmlUCSIsHangulSyllables)(e);
    Module._xmlUCSIsHanunoo = (e) => (Module._xmlUCSIsHanunoo = wasmExports.xmlUCSIsHanunoo)(e);
    Module._xmlUCSIsHebrew = (e) => (Module._xmlUCSIsHebrew = wasmExports.xmlUCSIsHebrew)(e);
    Module._xmlUCSIsHighPrivateUseSurrogates = (e) => (Module._xmlUCSIsHighPrivateUseSurrogates = wasmExports.xmlUCSIsHighPrivateUseSurrogates)(e);
    Module._xmlUCSIsHighSurrogates = (e) => (Module._xmlUCSIsHighSurrogates = wasmExports.xmlUCSIsHighSurrogates)(e);
    Module._xmlUCSIsHiragana = (e) => (Module._xmlUCSIsHiragana = wasmExports.xmlUCSIsHiragana)(e);
    Module._xmlUCSIsIPAExtensions = (e) => (Module._xmlUCSIsIPAExtensions = wasmExports.xmlUCSIsIPAExtensions)(e);
    Module._xmlUCSIsIdeographicDescriptionCharacters = (e) => (Module._xmlUCSIsIdeographicDescriptionCharacters = wasmExports.xmlUCSIsIdeographicDescriptionCharacters)(e);
    Module._xmlUCSIsKanbun = (e) => (Module._xmlUCSIsKanbun = wasmExports.xmlUCSIsKanbun)(e);
    Module._xmlUCSIsKangxiRadicals = (e) => (Module._xmlUCSIsKangxiRadicals = wasmExports.xmlUCSIsKangxiRadicals)(e);
    Module._xmlUCSIsKannada = (e) => (Module._xmlUCSIsKannada = wasmExports.xmlUCSIsKannada)(e);
    Module._xmlUCSIsKatakana = (e) => (Module._xmlUCSIsKatakana = wasmExports.xmlUCSIsKatakana)(e);
    Module._xmlUCSIsKatakanaPhoneticExtensions = (e) => (Module._xmlUCSIsKatakanaPhoneticExtensions = wasmExports.xmlUCSIsKatakanaPhoneticExtensions)(e);
    Module._xmlUCSIsKhmer = (e) => (Module._xmlUCSIsKhmer = wasmExports.xmlUCSIsKhmer)(e);
    Module._xmlUCSIsKhmerSymbols = (e) => (Module._xmlUCSIsKhmerSymbols = wasmExports.xmlUCSIsKhmerSymbols)(e);
    Module._xmlUCSIsLao = (e) => (Module._xmlUCSIsLao = wasmExports.xmlUCSIsLao)(e);
    Module._xmlUCSIsLatin1Supplement = (e) => (Module._xmlUCSIsLatin1Supplement = wasmExports.xmlUCSIsLatin1Supplement)(e);
    Module._xmlUCSIsLatinExtendedA = (e) => (Module._xmlUCSIsLatinExtendedA = wasmExports.xmlUCSIsLatinExtendedA)(e);
    Module._xmlUCSIsLatinExtendedB = (e) => (Module._xmlUCSIsLatinExtendedB = wasmExports.xmlUCSIsLatinExtendedB)(e);
    Module._xmlUCSIsLatinExtendedAdditional = (e) => (Module._xmlUCSIsLatinExtendedAdditional = wasmExports.xmlUCSIsLatinExtendedAdditional)(e);
    Module._xmlUCSIsLetterlikeSymbols = (e) => (Module._xmlUCSIsLetterlikeSymbols = wasmExports.xmlUCSIsLetterlikeSymbols)(e);
    Module._xmlUCSIsLimbu = (e) => (Module._xmlUCSIsLimbu = wasmExports.xmlUCSIsLimbu)(e);
    Module._xmlUCSIsLinearBIdeograms = (e) => (Module._xmlUCSIsLinearBIdeograms = wasmExports.xmlUCSIsLinearBIdeograms)(e);
    Module._xmlUCSIsLinearBSyllabary = (e) => (Module._xmlUCSIsLinearBSyllabary = wasmExports.xmlUCSIsLinearBSyllabary)(e);
    Module._xmlUCSIsLowSurrogates = (e) => (Module._xmlUCSIsLowSurrogates = wasmExports.xmlUCSIsLowSurrogates)(e);
    Module._xmlUCSIsMalayalam = (e) => (Module._xmlUCSIsMalayalam = wasmExports.xmlUCSIsMalayalam)(e);
    Module._xmlUCSIsMathematicalAlphanumericSymbols = (e) => (Module._xmlUCSIsMathematicalAlphanumericSymbols = wasmExports.xmlUCSIsMathematicalAlphanumericSymbols)(e);
    Module._xmlUCSIsMathematicalOperators = (e) => (Module._xmlUCSIsMathematicalOperators = wasmExports.xmlUCSIsMathematicalOperators)(e);
    Module._xmlUCSIsMiscellaneousMathematicalSymbolsA = (e) => (Module._xmlUCSIsMiscellaneousMathematicalSymbolsA = wasmExports.xmlUCSIsMiscellaneousMathematicalSymbolsA)(e);
    Module._xmlUCSIsMiscellaneousMathematicalSymbolsB = (e) => (Module._xmlUCSIsMiscellaneousMathematicalSymbolsB = wasmExports.xmlUCSIsMiscellaneousMathematicalSymbolsB)(e);
    Module._xmlUCSIsMiscellaneousSymbols = (e) => (Module._xmlUCSIsMiscellaneousSymbols = wasmExports.xmlUCSIsMiscellaneousSymbols)(e);
    Module._xmlUCSIsMiscellaneousSymbolsandArrows = (e) => (Module._xmlUCSIsMiscellaneousSymbolsandArrows = wasmExports.xmlUCSIsMiscellaneousSymbolsandArrows)(e);
    Module._xmlUCSIsMiscellaneousTechnical = (e) => (Module._xmlUCSIsMiscellaneousTechnical = wasmExports.xmlUCSIsMiscellaneousTechnical)(e);
    Module._xmlUCSIsMongolian = (e) => (Module._xmlUCSIsMongolian = wasmExports.xmlUCSIsMongolian)(e);
    Module._xmlUCSIsMusicalSymbols = (e) => (Module._xmlUCSIsMusicalSymbols = wasmExports.xmlUCSIsMusicalSymbols)(e);
    Module._xmlUCSIsMyanmar = (e) => (Module._xmlUCSIsMyanmar = wasmExports.xmlUCSIsMyanmar)(e);
    Module._xmlUCSIsNumberForms = (e) => (Module._xmlUCSIsNumberForms = wasmExports.xmlUCSIsNumberForms)(e);
    Module._xmlUCSIsOgham = (e) => (Module._xmlUCSIsOgham = wasmExports.xmlUCSIsOgham)(e);
    Module._xmlUCSIsOldItalic = (e) => (Module._xmlUCSIsOldItalic = wasmExports.xmlUCSIsOldItalic)(e);
    Module._xmlUCSIsOpticalCharacterRecognition = (e) => (Module._xmlUCSIsOpticalCharacterRecognition = wasmExports.xmlUCSIsOpticalCharacterRecognition)(e);
    Module._xmlUCSIsOriya = (e) => (Module._xmlUCSIsOriya = wasmExports.xmlUCSIsOriya)(e);
    Module._xmlUCSIsOsmanya = (e) => (Module._xmlUCSIsOsmanya = wasmExports.xmlUCSIsOsmanya)(e);
    Module._xmlUCSIsPhoneticExtensions = (e) => (Module._xmlUCSIsPhoneticExtensions = wasmExports.xmlUCSIsPhoneticExtensions)(e);
    Module._xmlUCSIsPrivateUse = (e) => (Module._xmlUCSIsPrivateUse = wasmExports.xmlUCSIsPrivateUse)(e);
    Module._xmlUCSIsPrivateUseArea = (e) => (Module._xmlUCSIsPrivateUseArea = wasmExports.xmlUCSIsPrivateUseArea)(e);
    Module._xmlUCSIsRunic = (e) => (Module._xmlUCSIsRunic = wasmExports.xmlUCSIsRunic)(e);
    Module._xmlUCSIsShavian = (e) => (Module._xmlUCSIsShavian = wasmExports.xmlUCSIsShavian)(e);
    Module._xmlUCSIsSinhala = (e) => (Module._xmlUCSIsSinhala = wasmExports.xmlUCSIsSinhala)(e);
    Module._xmlUCSIsSmallFormVariants = (e) => (Module._xmlUCSIsSmallFormVariants = wasmExports.xmlUCSIsSmallFormVariants)(e);
    Module._xmlUCSIsSpacingModifierLetters = (e) => (Module._xmlUCSIsSpacingModifierLetters = wasmExports.xmlUCSIsSpacingModifierLetters)(e);
    Module._xmlUCSIsSpecials = (e) => (Module._xmlUCSIsSpecials = wasmExports.xmlUCSIsSpecials)(e);
    Module._xmlUCSIsSuperscriptsandSubscripts = (e) => (Module._xmlUCSIsSuperscriptsandSubscripts = wasmExports.xmlUCSIsSuperscriptsandSubscripts)(e);
    Module._xmlUCSIsSupplementalArrowsA = (e) => (Module._xmlUCSIsSupplementalArrowsA = wasmExports.xmlUCSIsSupplementalArrowsA)(e);
    Module._xmlUCSIsSupplementalArrowsB = (e) => (Module._xmlUCSIsSupplementalArrowsB = wasmExports.xmlUCSIsSupplementalArrowsB)(e);
    Module._xmlUCSIsSupplementalMathematicalOperators = (e) => (Module._xmlUCSIsSupplementalMathematicalOperators = wasmExports.xmlUCSIsSupplementalMathematicalOperators)(e);
    Module._xmlUCSIsSupplementaryPrivateUseAreaA = (e) => (Module._xmlUCSIsSupplementaryPrivateUseAreaA = wasmExports.xmlUCSIsSupplementaryPrivateUseAreaA)(e);
    Module._xmlUCSIsSupplementaryPrivateUseAreaB = (e) => (Module._xmlUCSIsSupplementaryPrivateUseAreaB = wasmExports.xmlUCSIsSupplementaryPrivateUseAreaB)(e);
    Module._xmlUCSIsSyriac = (e) => (Module._xmlUCSIsSyriac = wasmExports.xmlUCSIsSyriac)(e);
    Module._xmlUCSIsTagalog = (e) => (Module._xmlUCSIsTagalog = wasmExports.xmlUCSIsTagalog)(e);
    Module._xmlUCSIsTagbanwa = (e) => (Module._xmlUCSIsTagbanwa = wasmExports.xmlUCSIsTagbanwa)(e);
    Module._xmlUCSIsTags = (e) => (Module._xmlUCSIsTags = wasmExports.xmlUCSIsTags)(e);
    Module._xmlUCSIsTaiLe = (e) => (Module._xmlUCSIsTaiLe = wasmExports.xmlUCSIsTaiLe)(e);
    Module._xmlUCSIsTaiXuanJingSymbols = (e) => (Module._xmlUCSIsTaiXuanJingSymbols = wasmExports.xmlUCSIsTaiXuanJingSymbols)(e);
    Module._xmlUCSIsTamil = (e) => (Module._xmlUCSIsTamil = wasmExports.xmlUCSIsTamil)(e);
    Module._xmlUCSIsTelugu = (e) => (Module._xmlUCSIsTelugu = wasmExports.xmlUCSIsTelugu)(e);
    Module._xmlUCSIsThaana = (e) => (Module._xmlUCSIsThaana = wasmExports.xmlUCSIsThaana)(e);
    Module._xmlUCSIsThai = (e) => (Module._xmlUCSIsThai = wasmExports.xmlUCSIsThai)(e);
    Module._xmlUCSIsTibetan = (e) => (Module._xmlUCSIsTibetan = wasmExports.xmlUCSIsTibetan)(e);
    Module._xmlUCSIsUgaritic = (e) => (Module._xmlUCSIsUgaritic = wasmExports.xmlUCSIsUgaritic)(e);
    Module._xmlUCSIsUnifiedCanadianAboriginalSyllabics = (e) => (Module._xmlUCSIsUnifiedCanadianAboriginalSyllabics = wasmExports.xmlUCSIsUnifiedCanadianAboriginalSyllabics)(e);
    Module._xmlUCSIsVariationSelectors = (e) => (Module._xmlUCSIsVariationSelectors = wasmExports.xmlUCSIsVariationSelectors)(e);
    Module._xmlUCSIsVariationSelectorsSupplement = (e) => (Module._xmlUCSIsVariationSelectorsSupplement = wasmExports.xmlUCSIsVariationSelectorsSupplement)(e);
    Module._xmlUCSIsYiRadicals = (e) => (Module._xmlUCSIsYiRadicals = wasmExports.xmlUCSIsYiRadicals)(e);
    Module._xmlUCSIsYiSyllables = (e) => (Module._xmlUCSIsYiSyllables = wasmExports.xmlUCSIsYiSyllables)(e);
    Module._xmlUCSIsYijingHexagramSymbols = (e) => (Module._xmlUCSIsYijingHexagramSymbols = wasmExports.xmlUCSIsYijingHexagramSymbols)(e);
    Module._xmlUCSIsCatCs = (e) => (Module._xmlUCSIsCatCs = wasmExports.xmlUCSIsCatCs)(e);
    Module.___small_fprintf = (e, t, r2) => (Module.___small_fprintf = wasmExports.__small_fprintf)(e, t, r2);
    Module._xmlXPathBooleanFunction = (e, t) => (Module._xmlXPathBooleanFunction = wasmExports.xmlXPathBooleanFunction)(e, t);
    Module._xmlXPathCeilingFunction = (e, t) => (Module._xmlXPathCeilingFunction = wasmExports.xmlXPathCeilingFunction)(e, t);
    Module._xmlXPathCountFunction = (e, t) => (Module._xmlXPathCountFunction = wasmExports.xmlXPathCountFunction)(e, t);
    Module._xmlXPathConcatFunction = (e, t) => (Module._xmlXPathConcatFunction = wasmExports.xmlXPathConcatFunction)(e, t);
    Module._xmlXPathContainsFunction = (e, t) => (Module._xmlXPathContainsFunction = wasmExports.xmlXPathContainsFunction)(e, t);
    Module._xmlXPathIdFunction = (e, t) => (Module._xmlXPathIdFunction = wasmExports.xmlXPathIdFunction)(e, t);
    Module._xmlXPathFalseFunction = (e, t) => (Module._xmlXPathFalseFunction = wasmExports.xmlXPathFalseFunction)(e, t);
    Module._xmlXPathFloorFunction = (e, t) => (Module._xmlXPathFloorFunction = wasmExports.xmlXPathFloorFunction)(e, t);
    Module._xmlXPathLastFunction = (e, t) => (Module._xmlXPathLastFunction = wasmExports.xmlXPathLastFunction)(e, t);
    Module._xmlXPathLangFunction = (e, t) => (Module._xmlXPathLangFunction = wasmExports.xmlXPathLangFunction)(e, t);
    Module._xmlXPathLocalNameFunction = (e, t) => (Module._xmlXPathLocalNameFunction = wasmExports.xmlXPathLocalNameFunction)(e, t);
    Module._xmlXPathNotFunction = (e, t) => (Module._xmlXPathNotFunction = wasmExports.xmlXPathNotFunction)(e, t);
    Module._xmlXPathNamespaceURIFunction = (e, t) => (Module._xmlXPathNamespaceURIFunction = wasmExports.xmlXPathNamespaceURIFunction)(e, t);
    Module._xmlXPathNormalizeFunction = (e, t) => (Module._xmlXPathNormalizeFunction = wasmExports.xmlXPathNormalizeFunction)(e, t);
    Module._xmlXPathNumberFunction = (e, t) => (Module._xmlXPathNumberFunction = wasmExports.xmlXPathNumberFunction)(e, t);
    Module._xmlXPathPositionFunction = (e, t) => (Module._xmlXPathPositionFunction = wasmExports.xmlXPathPositionFunction)(e, t);
    Module._xmlXPathRoundFunction = (e, t) => (Module._xmlXPathRoundFunction = wasmExports.xmlXPathRoundFunction)(e, t);
    Module._xmlXPathStringFunction = (e, t) => (Module._xmlXPathStringFunction = wasmExports.xmlXPathStringFunction)(e, t);
    Module._xmlXPathStringLengthFunction = (e, t) => (Module._xmlXPathStringLengthFunction = wasmExports.xmlXPathStringLengthFunction)(e, t);
    Module._xmlXPathStartsWithFunction = (e, t) => (Module._xmlXPathStartsWithFunction = wasmExports.xmlXPathStartsWithFunction)(e, t);
    Module._xmlXPathSubstringFunction = (e, t) => (Module._xmlXPathSubstringFunction = wasmExports.xmlXPathSubstringFunction)(e, t);
    Module._xmlXPathSubstringBeforeFunction = (e, t) => (Module._xmlXPathSubstringBeforeFunction = wasmExports.xmlXPathSubstringBeforeFunction)(e, t);
    Module._xmlXPathSubstringAfterFunction = (e, t) => (Module._xmlXPathSubstringAfterFunction = wasmExports.xmlXPathSubstringAfterFunction)(e, t);
    Module._xmlXPathSumFunction = (e, t) => (Module._xmlXPathSumFunction = wasmExports.xmlXPathSumFunction)(e, t);
    Module._xmlXPathTrueFunction = (e, t) => (Module._xmlXPathTrueFunction = wasmExports.xmlXPathTrueFunction)(e, t);
    Module._xmlXPathTranslateFunction = (e, t) => (Module._xmlXPathTranslateFunction = wasmExports.xmlXPathTranslateFunction)(e, t);
    Module._xmlXPathNextSelf = (e, t) => (Module._xmlXPathNextSelf = wasmExports.xmlXPathNextSelf)(e, t);
    Module._xmlXPathNextChild = (e, t) => (Module._xmlXPathNextChild = wasmExports.xmlXPathNextChild)(e, t);
    Module._xmlXPathNextDescendant = (e, t) => (Module._xmlXPathNextDescendant = wasmExports.xmlXPathNextDescendant)(e, t);
    Module._xmlXPathNextDescendantOrSelf = (e, t) => (Module._xmlXPathNextDescendantOrSelf = wasmExports.xmlXPathNextDescendantOrSelf)(e, t);
    Module._xmlXPathNextParent = (e, t) => (Module._xmlXPathNextParent = wasmExports.xmlXPathNextParent)(e, t);
    Module._xmlXPathNextAncestor = (e, t) => (Module._xmlXPathNextAncestor = wasmExports.xmlXPathNextAncestor)(e, t);
    Module._xmlXPathNextAncestorOrSelf = (e, t) => (Module._xmlXPathNextAncestorOrSelf = wasmExports.xmlXPathNextAncestorOrSelf)(e, t);
    Module._xmlXPathNextFollowingSibling = (e, t) => (Module._xmlXPathNextFollowingSibling = wasmExports.xmlXPathNextFollowingSibling)(e, t);
    Module._xmlXPathNextPrecedingSibling = (e, t) => (Module._xmlXPathNextPrecedingSibling = wasmExports.xmlXPathNextPrecedingSibling)(e, t);
    Module._xmlXPathNextFollowing = (e, t) => (Module._xmlXPathNextFollowing = wasmExports.xmlXPathNextFollowing)(e, t);
    Module._xmlXPathNextNamespace = (e, t) => (Module._xmlXPathNextNamespace = wasmExports.xmlXPathNextNamespace)(e, t);
    Module._xmlXPathNextAttribute = (e, t) => (Module._xmlXPathNextAttribute = wasmExports.xmlXPathNextAttribute)(e, t);
    Module._zcalloc = (e, t, r2) => (Module._zcalloc = wasmExports.zcalloc)(e, t, r2);
    Module._zcfree = (e, t) => (Module._zcfree = wasmExports.zcfree)(e, t);
    Module._strerror = (e) => (Module._strerror = wasmExports.strerror)(e);
    var ___dl_seterr = (e, t) => (___dl_seterr = wasmExports.__dl_seterr)(e, t);
    Module._putc = (e, t) => (Module._putc = wasmExports.putc)(e, t);
    Module._gmtime = (e) => (Module._gmtime = wasmExports.gmtime)(e);
    var _htonl = (e) => (_htonl = wasmExports.htonl)(e), _htons = (e) => (_htons = wasmExports.htons)(e);
    Module._ioctl = (e, t, r2) => (Module._ioctl = wasmExports.ioctl)(e, t, r2);
    var _emscripten_builtin_memalign = (e, t) => (_emscripten_builtin_memalign = wasmExports.emscripten_builtin_memalign)(e, t), _ntohs = (e) => (_ntohs = wasmExports.ntohs)(e);
    Module._srand = (e) => (Module._srand = wasmExports.srand)(e);
    Module._rand = () => (Module._rand = wasmExports.rand)();
    var __emscripten_timeout = (e, t) => (__emscripten_timeout = wasmExports._emscripten_timeout)(e, t);
    Module.___floatsitf = (e, t) => (Module.___floatsitf = wasmExports.__floatsitf)(e, t);
    Module.___multf3 = (e, t, r2, a2, o2) => (Module.___multf3 = wasmExports.__multf3)(e, t, r2, a2, o2);
    Module.___extenddftf2 = (e, t) => (Module.___extenddftf2 = wasmExports.__extenddftf2)(e, t);
    Module.___getf2 = (e, t, r2, a2) => (Module.___getf2 = wasmExports.__getf2)(e, t, r2, a2);
    Module.___subtf3 = (e, t, r2, a2, o2) => (Module.___subtf3 = wasmExports.__subtf3)(e, t, r2, a2, o2);
    Module.___letf2 = (e, t, r2, a2) => (Module.___letf2 = wasmExports.__letf2)(e, t, r2, a2);
    Module.___lttf2 = (e, t, r2, a2) => (Module.___lttf2 = wasmExports.__lttf2)(e, t, r2, a2);
    var _setThrew = (e, t) => (_setThrew = wasmExports.setThrew)(e, t), __emscripten_tempret_set = (e) => (__emscripten_tempret_set = wasmExports._emscripten_tempret_set)(e), __emscripten_tempret_get = () => (__emscripten_tempret_get = wasmExports._emscripten_tempret_get)();
    Module.___fixtfsi = (e, t) => (Module.___fixtfsi = wasmExports.__fixtfsi)(e, t);
    var __emscripten_stack_restore = (e) => (__emscripten_stack_restore = wasmExports._emscripten_stack_restore)(e), __emscripten_stack_alloc = (e) => (__emscripten_stack_alloc = wasmExports._emscripten_stack_alloc)(e), _emscripten_stack_get_current = () => (_emscripten_stack_get_current = wasmExports.emscripten_stack_get_current)();
    Module._ScanKeywords = 18770052;
    Module._stderr = 18792480;
    Module._stdout = 18792784;
    Module._TopMemoryContext = 18830716;
    Module._MainLWLockArray = 18800668;
    Module._MyProc = 18802328;
    Module._MyProcPid = 18824228;
    Module._MyLatch = 18824260;
    Module._CurrentMemoryContext = 18830712;
    Module._InterruptPending = 18824092;
    Module._pg_global_prng_state = 18936304;
    Module._CurrentResourceOwner = 18830692;
    Module._InterruptHoldoffCount = 18824132;
    Module._IsUnderPostmaster = 18824165;
    Module._wal_level = 18758340;
    Module._MyDatabaseId = 18824148;
    Module._error_context_stack = 18816816;
    Module._PG_exception_stack = 18816820;
    Module.___THREW__ = 18950052;
    Module.___threwValue = 18950056;
    Module._ShmemVariableCache = 18849760;
    Module._shmem_startup_hook = 18794508;
    Module._debug_query_string = 18848300;
    Module._CritSectionCount = 18824140;
    Module._old_snapshot_threshold = 18823756;
    Module._TopTransactionResourceOwner = 18830700;
    Module._LocalBufferBlockPointers = 18800556;
    Module._BufferBlocks = 18795304;
    Module._pgBufferUsage = 18813728;
    Module._GUC_check_errdetail_string = 18814680;
    Module._NBuffers = 18690456;
    Module._BufferDescriptors = 18795300;
    Module._ParallelWorkerNumber = 18767008;
    Module._stdin = 18792632;
    Module._ScanKeywordTokens = 17487664;
    Module._post_parse_analyze_hook = 18802584;
    Module._progname = 18848060;
    Module._DataDir = 18824144;
    Module._MyStartTime = 18824232;
    Module._MyProcPort = 18824248;
    Module._Log_directory = 18803120;
    Module._Log_filename = 18803124;
    Module._ConfigReloadPending = 18803272;
    Module._ShutdownRequestPending = 18803276;
    Module._process_shared_preload_libraries_in_progress = 18824080;
    Module._wal_segment_size = 18758360;
    Module._application_name = 18815988;
    Module._XactIsoLevel = 18758700;
    Module._RmgrTable = 18758816;
    Module._CacheMemoryContext = 18830728;
    Module._TopTransactionContext = 18830736;
    Module._TTSOpsVirtual = 18638668;
    Module._WalReceiverFunctions = 18803712;
    Module._TTSOpsMinimalTuple = 18638764;
    Module._cluster_name = 18640444;
    Module._work_mem = 18690432;
    Module._ClientAuthentication_hook = 18804032;
    Module._cma_rsize = 18848108;
    Module._SOCKET_DATA = 18854312;
    Module._SOCKET_FILE = 18854308;
    Module._TTSOpsHeapTuple = 18638716;
    Module._SnapshotAnyData = 18690240;
    Module._ExecutorStart_hook = 18813600;
    Module._ExecutorRun_hook = 18813604;
    Module._ExecutorFinish_hook = 18813608;
    Module._ExecutorEnd_hook = 18813612;
    Module._SPI_processed = 18813624;
    Module._SPI_tuptable = 18813632;
    Module._SPI_result = 18813636;
    Module._pgWalUsage = 18813840;
    Module._cpu_operator_cost = 18638912;
    Module._planner_hook = 18813876;
    Module._maintenance_work_mem = 18690448;
    Module._max_parallel_maintenance_workers = 18690452;
    Module._cpu_tuple_cost = 18638896;
    Module._seq_page_cost = 18638880;
    Module._check_function_bodies = 18640389;
    Module._quote_all_identifiers = 18848065;
    Module._extra_float_digits = 18692128;
    Module._IntervalStyle = 18824172;
    Module._pg_crc32_table = 18115504;
    Module._oldSnapshotControl = 18823760;
    Module._shmem_request_hook = 18824084;
    Module._DateStyle = 18690420;
    Module._pg_number_of_ones = 18433360;
    Module._xmlStructuredError = 18936668;
    Module._xmlStructuredErrorContext = 18936676;
    Module._xmlGenericErrorContext = 18936672;
    Module._xmlGenericError = 18774356;
    Module._xmlIsBaseCharGroup = 18774120;
    Module._xmlIsDigitGroup = 18774152;
    Module._xmlIsCombiningGroup = 18774136;
    Module._xmlIsExtenderGroup = 18774168;
    Module._xmlFree = 18774320;
    Module._ProcessUtility_hook = 18848012;
    Module._single_mode_feed = 18848076;
    Module._cma_wsize = 18848116;
    Module._check_password_hook = 18850784;
    Module._IDB_STAGE = 18854320;
    Module._IDB_PIPE_FP = 18854316;
    Module._pg_scram_mech = 18774064;
    Module._pg_g_threadlock = 18772168;
    Module._pgresStatus = 18773856;
    Module._xmlIsPubidChar_tab = 18433648;
    Module._xmlGetWarningsDefaultValue = 18774348;
    Module._xmlMalloc = 18774324;
    Module._xmlRealloc = 18774332;
    Module._xmlLastError = 18936688;
    Module._xmlMallocAtomic = 18774328;
    Module._xmlMemStrdup = 18774336;
    Module._xmlBufferAllocScheme = 18774340;
    Module._xmlDefaultBufferSize = 18774344;
    Module._xmlParserDebugEntities = 18936628;
    Module._xmlDoValidityCheckingDefaultValue = 18936632;
    Module._xmlLoadExtDtdDefaultValue = 18936636;
    Module._xmlPedanticParserDefaultValue = 18936640;
    Module._xmlLineNumbersDefaultValue = 18936644;
    Module._xmlKeepBlanksDefaultValue = 18774352;
    Module._xmlSubstituteEntitiesDefaultValue = 18936648;
    Module._xmlRegisterNodeDefaultValue = 18936652;
    Module._xmlDeregisterNodeDefaultValue = 18936656;
    Module._xmlParserInputBufferCreateFilenameValue = 18936660;
    Module._xmlOutputBufferCreateFilenameValue = 18936664;
    Module._xmlIndentTreeOutput = 18774360;
    Module._xmlTreeIndentString = 18774364;
    Module._xmlSaveNoEmptyTags = 18936680;
    Module._xmlDefaultSAXHandler = 18774368;
    Module._xmlDefaultSAXLocator = 18774480;
    Module._xmlParserMaxDepth = 18775140;
    Module._xmlStringText = 18435456;
    Module._xmlStringComment = 18435471;
    Module._xmlStringTextNoenc = 18435461;
    Module._xmlXPathNAN = 18937352;
    Module._xmlXPathNINF = 18937368;
    Module._xmlXPathPINF = 18937360;
    Module._z_errmsg = 18791696;
    Module.__length_code = 18455120;
    Module.__dist_code = 18454608;
    function invoke_i(e) {
      var t = stackSave();
      try {
        return getWasmTableEntry(e)();
      } catch (r2) {
        if (stackRestore(t), r2 !== r2 + 0) throw r2;
        _setThrew(1, 0);
      }
    }
    function invoke_v(e) {
      var t = stackSave();
      try {
        getWasmTableEntry(e)();
      } catch (r2) {
        if (stackRestore(t), r2 !== r2 + 0) throw r2;
        _setThrew(1, 0);
      }
    }
    function invoke_vi(e, t) {
      var r2 = stackSave();
      try {
        getWasmTableEntry(e)(t);
      } catch (a2) {
        if (stackRestore(r2), a2 !== a2 + 0) throw a2;
        _setThrew(1, 0);
      }
    }
    function invoke_iii(e, t, r2) {
      var a2 = stackSave();
      try {
        return getWasmTableEntry(e)(t, r2);
      } catch (o2) {
        if (stackRestore(a2), o2 !== o2 + 0) throw o2;
        _setThrew(1, 0);
      }
    }
    function invoke_iiiiii(e, t, r2, a2, o2, s2) {
      var l2 = stackSave();
      try {
        return getWasmTableEntry(e)(t, r2, a2, o2, s2);
      } catch (n2) {
        if (stackRestore(l2), n2 !== n2 + 0) throw n2;
        _setThrew(1, 0);
      }
    }
    function invoke_viii(e, t, r2, a2) {
      var o2 = stackSave();
      try {
        getWasmTableEntry(e)(t, r2, a2);
      } catch (s2) {
        if (stackRestore(o2), s2 !== s2 + 0) throw s2;
        _setThrew(1, 0);
      }
    }
    function invoke_viiiiiii(e, t, r2, a2, o2, s2, l2, n2) {
      var _2 = stackSave();
      try {
        getWasmTableEntry(e)(t, r2, a2, o2, s2, l2, n2);
      } catch (m2) {
        if (stackRestore(_2), m2 !== m2 + 0) throw m2;
        _setThrew(1, 0);
      }
    }
    function invoke_iiii(e, t, r2, a2) {
      var o2 = stackSave();
      try {
        return getWasmTableEntry(e)(t, r2, a2);
      } catch (s2) {
        if (stackRestore(o2), s2 !== s2 + 0) throw s2;
        _setThrew(1, 0);
      }
    }
    function invoke_viiii(e, t, r2, a2, o2) {
      var s2 = stackSave();
      try {
        getWasmTableEntry(e)(t, r2, a2, o2);
      } catch (l2) {
        if (stackRestore(s2), l2 !== l2 + 0) throw l2;
        _setThrew(1, 0);
      }
    }
    function invoke_iiiii(e, t, r2, a2, o2) {
      var s2 = stackSave();
      try {
        return getWasmTableEntry(e)(t, r2, a2, o2);
      } catch (l2) {
        if (stackRestore(s2), l2 !== l2 + 0) throw l2;
        _setThrew(1, 0);
      }
    }
    function invoke_vii(e, t, r2) {
      var a2 = stackSave();
      try {
        getWasmTableEntry(e)(t, r2);
      } catch (o2) {
        if (stackRestore(a2), o2 !== o2 + 0) throw o2;
        _setThrew(1, 0);
      }
    }
    function invoke_ii(e, t) {
      var r2 = stackSave();
      try {
        return getWasmTableEntry(e)(t);
      } catch (a2) {
        if (stackRestore(r2), a2 !== a2 + 0) throw a2;
        _setThrew(1, 0);
      }
    }
    function invoke_viiiiiiii(e, t, r2, a2, o2, s2, l2, n2, _2) {
      var m2 = stackSave();
      try {
        getWasmTableEntry(e)(t, r2, a2, o2, s2, l2, n2, _2);
      } catch (p2) {
        if (stackRestore(m2), p2 !== p2 + 0) throw p2;
        _setThrew(1, 0);
      }
    }
    function invoke_viiiii(e, t, r2, a2, o2, s2) {
      var l2 = stackSave();
      try {
        getWasmTableEntry(e)(t, r2, a2, o2, s2);
      } catch (n2) {
        if (stackRestore(l2), n2 !== n2 + 0) throw n2;
        _setThrew(1, 0);
      }
    }
    function invoke_ij(e, t) {
      var r2 = stackSave();
      try {
        return getWasmTableEntry(e)(t);
      } catch (a2) {
        if (stackRestore(r2), a2 !== a2 + 0) throw a2;
        _setThrew(1, 0);
      }
    }
    function invoke_ji(e, t) {
      var r2 = stackSave();
      try {
        return getWasmTableEntry(e)(t);
      } catch (a2) {
        if (stackRestore(r2), a2 !== a2 + 0) throw a2;
        return _setThrew(1, 0), 0n;
      }
    }
    function invoke_ijiiiiii(e, t, r2, a2, o2, s2, l2, n2) {
      var _2 = stackSave();
      try {
        return getWasmTableEntry(e)(t, r2, a2, o2, s2, l2, n2);
      } catch (m2) {
        if (stackRestore(_2), m2 !== m2 + 0) throw m2;
        _setThrew(1, 0);
      }
    }
    function invoke_vij(e, t, r2) {
      var a2 = stackSave();
      try {
        getWasmTableEntry(e)(t, r2);
      } catch (o2) {
        if (stackRestore(a2), o2 !== o2 + 0) throw o2;
        _setThrew(1, 0);
      }
    }
    function invoke_vj(e, t) {
      var r2 = stackSave();
      try {
        getWasmTableEntry(e)(t);
      } catch (a2) {
        if (stackRestore(r2), a2 !== a2 + 0) throw a2;
        _setThrew(1, 0);
      }
    }
    function invoke_viijii(e, t, r2, a2, o2, s2) {
      var l2 = stackSave();
      try {
        getWasmTableEntry(e)(t, r2, a2, o2, s2);
      } catch (n2) {
        if (stackRestore(l2), n2 !== n2 + 0) throw n2;
        _setThrew(1, 0);
      }
    }
    function invoke_iiiiiji(e, t, r2, a2, o2, s2, l2) {
      var n2 = stackSave();
      try {
        return getWasmTableEntry(e)(t, r2, a2, o2, s2, l2);
      } catch (_2) {
        if (stackRestore(n2), _2 !== _2 + 0) throw _2;
        _setThrew(1, 0);
      }
    }
    function invoke_viijiiii(e, t, r2, a2, o2, s2, l2, n2) {
      var _2 = stackSave();
      try {
        getWasmTableEntry(e)(t, r2, a2, o2, s2, l2, n2);
      } catch (m2) {
        if (stackRestore(_2), m2 !== m2 + 0) throw m2;
        _setThrew(1, 0);
      }
    }
    function invoke_viij(e, t, r2, a2) {
      var o2 = stackSave();
      try {
        getWasmTableEntry(e)(t, r2, a2);
      } catch (s2) {
        if (stackRestore(o2), s2 !== s2 + 0) throw s2;
        _setThrew(1, 0);
      }
    }
    function invoke_jiiiiiiii(e, t, r2, a2, o2, s2, l2, n2, _2) {
      var m2 = stackSave();
      try {
        return getWasmTableEntry(e)(t, r2, a2, o2, s2, l2, n2, _2);
      } catch (p2) {
        if (stackRestore(m2), p2 !== p2 + 0) throw p2;
        return _setThrew(1, 0), 0n;
      }
    }
    function invoke_jiiiii(e, t, r2, a2, o2, s2) {
      var l2 = stackSave();
      try {
        return getWasmTableEntry(e)(t, r2, a2, o2, s2);
      } catch (n2) {
        if (stackRestore(l2), n2 !== n2 + 0) throw n2;
        return _setThrew(1, 0), 0n;
      }
    }
    function invoke_iiiiiiiii(e, t, r2, a2, o2, s2, l2, n2, _2) {
      var m2 = stackSave();
      try {
        return getWasmTableEntry(e)(t, r2, a2, o2, s2, l2, n2, _2);
      } catch (p2) {
        if (stackRestore(m2), p2 !== p2 + 0) throw p2;
        _setThrew(1, 0);
      }
    }
    function invoke_vji(e, t, r2) {
      var a2 = stackSave();
      try {
        getWasmTableEntry(e)(t, r2);
      } catch (o2) {
        if (stackRestore(a2), o2 !== o2 + 0) throw o2;
        _setThrew(1, 0);
      }
    }
    function invoke_iiiijii(e, t, r2, a2, o2, s2, l2) {
      var n2 = stackSave();
      try {
        return getWasmTableEntry(e)(t, r2, a2, o2, s2, l2);
      } catch (_2) {
        if (stackRestore(n2), _2 !== _2 + 0) throw _2;
        _setThrew(1, 0);
      }
    }
    function invoke_vijiji(e, t, r2, a2, o2, s2) {
      var l2 = stackSave();
      try {
        getWasmTableEntry(e)(t, r2, a2, o2, s2);
      } catch (n2) {
        if (stackRestore(l2), n2 !== n2 + 0) throw n2;
        _setThrew(1, 0);
      }
    }
    function invoke_viji(e, t, r2, a2) {
      var o2 = stackSave();
      try {
        getWasmTableEntry(e)(t, r2, a2);
      } catch (s2) {
        if (stackRestore(o2), s2 !== s2 + 0) throw s2;
        _setThrew(1, 0);
      }
    }
    function invoke_iiij(e, t, r2, a2) {
      var o2 = stackSave();
      try {
        return getWasmTableEntry(e)(t, r2, a2);
      } catch (s2) {
        if (stackRestore(o2), s2 !== s2 + 0) throw s2;
        _setThrew(1, 0);
      }
    }
    function invoke_iiiiiiii(e, t, r2, a2, o2, s2, l2, n2) {
      var _2 = stackSave();
      try {
        return getWasmTableEntry(e)(t, r2, a2, o2, s2, l2, n2);
      } catch (m2) {
        if (stackRestore(_2), m2 !== m2 + 0) throw m2;
        _setThrew(1, 0);
      }
    }
    function invoke_iiiiiii(e, t, r2, a2, o2, s2, l2) {
      var n2 = stackSave();
      try {
        return getWasmTableEntry(e)(t, r2, a2, o2, s2, l2);
      } catch (_2) {
        if (stackRestore(n2), _2 !== _2 + 0) throw _2;
        _setThrew(1, 0);
      }
    }
    function invoke_di(e, t) {
      var r2 = stackSave();
      try {
        return getWasmTableEntry(e)(t);
      } catch (a2) {
        if (stackRestore(r2), a2 !== a2 + 0) throw a2;
        _setThrew(1, 0);
      }
    }
    function invoke_id(e, t) {
      var r2 = stackSave();
      try {
        return getWasmTableEntry(e)(t);
      } catch (a2) {
        if (stackRestore(r2), a2 !== a2 + 0) throw a2;
        _setThrew(1, 0);
      }
    }
    function invoke_ijiiiii(e, t, r2, a2, o2, s2, l2) {
      var n2 = stackSave();
      try {
        return getWasmTableEntry(e)(t, r2, a2, o2, s2, l2);
      } catch (_2) {
        if (stackRestore(n2), _2 !== _2 + 0) throw _2;
        _setThrew(1, 0);
      }
    }
    function invoke_jiiii(e, t, r2, a2, o2) {
      var s2 = stackSave();
      try {
        return getWasmTableEntry(e)(t, r2, a2, o2);
      } catch (l2) {
        if (stackRestore(s2), l2 !== l2 + 0) throw l2;
        return _setThrew(1, 0), 0n;
      }
    }
    function invoke_viiiiii(e, t, r2, a2, o2, s2, l2) {
      var n2 = stackSave();
      try {
        getWasmTableEntry(e)(t, r2, a2, o2, s2, l2);
      } catch (_2) {
        if (stackRestore(n2), _2 !== _2 + 0) throw _2;
        _setThrew(1, 0);
      }
    }
    function invoke_viiiiiiiiiiii(e, t, r2, a2, o2, s2, l2, n2, _2, m2, p2, d2, g2) {
      var c2 = stackSave();
      try {
        getWasmTableEntry(e)(t, r2, a2, o2, s2, l2, n2, _2, m2, p2, d2, g2);
      } catch (f2) {
        if (stackRestore(c2), f2 !== f2 + 0) throw f2;
        _setThrew(1, 0);
      }
    }
    function invoke_jii(e, t, r2) {
      var a2 = stackSave();
      try {
        return getWasmTableEntry(e)(t, r2);
      } catch (o2) {
        if (stackRestore(a2), o2 !== o2 + 0) throw o2;
        return _setThrew(1, 0), 0n;
      }
    }
    function invoke_iiiij(e, t, r2, a2, o2) {
      var s2 = stackSave();
      try {
        return getWasmTableEntry(e)(t, r2, a2, o2);
      } catch (l2) {
        if (stackRestore(s2), l2 !== l2 + 0) throw l2;
        _setThrew(1, 0);
      }
    }
    function invoke_iiiiiiiiii(e, t, r2, a2, o2, s2, l2, n2, _2, m2) {
      var p2 = stackSave();
      try {
        return getWasmTableEntry(e)(t, r2, a2, o2, s2, l2, n2, _2, m2);
      } catch (d2) {
        if (stackRestore(p2), d2 !== d2 + 0) throw d2;
        _setThrew(1, 0);
      }
    }
    function invoke_viiji(e, t, r2, a2, o2) {
      var s2 = stackSave();
      try {
        getWasmTableEntry(e)(t, r2, a2, o2);
      } catch (l2) {
        if (stackRestore(s2), l2 !== l2 + 0) throw l2;
        _setThrew(1, 0);
      }
    }
    function invoke_iiji(e, t, r2, a2) {
      var o2 = stackSave();
      try {
        return getWasmTableEntry(e)(t, r2, a2);
      } catch (s2) {
        if (stackRestore(o2), s2 !== s2 + 0) throw s2;
        _setThrew(1, 0);
      }
    }
    function invoke_vid(e, t, r2) {
      var a2 = stackSave();
      try {
        getWasmTableEntry(e)(t, r2);
      } catch (o2) {
        if (stackRestore(a2), o2 !== o2 + 0) throw o2;
        _setThrew(1, 0);
      }
    }
    function invoke_viiiiiiiii(e, t, r2, a2, o2, s2, l2, n2, _2, m2) {
      var p2 = stackSave();
      try {
        getWasmTableEntry(e)(t, r2, a2, o2, s2, l2, n2, _2, m2);
      } catch (d2) {
        if (stackRestore(p2), d2 !== d2 + 0) throw d2;
        _setThrew(1, 0);
      }
    }
    function invoke_viiij(e, t, r2, a2, o2) {
      var s2 = stackSave();
      try {
        getWasmTableEntry(e)(t, r2, a2, o2);
      } catch (l2) {
        if (stackRestore(s2), l2 !== l2 + 0) throw l2;
        _setThrew(1, 0);
      }
    }
    function invoke_iiiiiiiiiiiiiiiii(e, t, r2, a2, o2, s2, l2, n2, _2, m2, p2, d2, g2, c2, f2, u2, w2) {
      var h2 = stackSave();
      try {
        return getWasmTableEntry(e)(t, r2, a2, o2, s2, l2, n2, _2, m2, p2, d2, g2, c2, f2, u2, w2);
      } catch (S2) {
        if (stackRestore(h2), S2 !== S2 + 0) throw S2;
        _setThrew(1, 0);
      }
    }
    Module.addRunDependency = addRunDependency, Module.removeRunDependency = removeRunDependency, Module.callMain = callMain, Module.ccall = ccall, Module.cwrap = cwrap, Module.setValue = setValue, Module.getValue = getValue, Module.UTF8ToString = UTF8ToString, Module.stringToNewUTF8 = stringToNewUTF8, Module.stringToUTF8OnStack = stringToUTF8OnStack, Module.FS_createPreloadedFile = FS_createPreloadedFile, Module.FS_unlink = FS_unlink, Module.FS_createPath = FS_createPath, Module.FS_createDevice = FS_createDevice, Module.FS = FS, Module.FS_createDataFile = FS_createDataFile, Module.FS_createLazyFile = FS_createLazyFile;
    var calledRun;
    dependenciesFulfilled = function e() {
      calledRun || run(), calledRun || (dependenciesFulfilled = e);
    };
    function callMain(e = []) {
      var t = resolveGlobalSymbol("main").sym;
      if (t) {
        e.unshift(thisProgram);
        var r2 = e.length, a2 = stackAlloc((r2 + 1) * 4), o2 = a2;
        e.forEach((l2) => {
          HEAPU32[o2 >> 2] = stringToUTF8OnStack(l2), o2 += 4;
        }), HEAPU32[o2 >> 2] = 0;
        try {
          var s2 = t(r2, a2);
          return exitJS(s2, true), s2;
        } catch (l2) {
          return handleException(l2);
        }
      }
    }
    function run(e = arguments_) {
      if (runDependencies > 0 || (preRun(), runDependencies > 0)) return;
      function t() {
        calledRun || (calledRun = true, Module.calledRun = true, !ABORT && (initRuntime(), preMain(), readyPromiseResolve(Module), Module.onRuntimeInitialized?.(), shouldRunNow && callMain(e), postRun()));
      }
      Module.setStatus ? (Module.setStatus("Running..."), setTimeout(() => {
        setTimeout(() => Module.setStatus(""), 1), t();
      }, 1)) : t();
    }
    if (Module.preInit) for (typeof Module.preInit == "function" && (Module.preInit = [Module.preInit]); Module.preInit.length > 0; ) Module.preInit.pop()();
    var shouldRunNow = true;
    return Module.noInitialRun && (shouldRunNow = false), run(), moduleRtn = readyPromise, moduleRtn;
  };
})(), ke = Qe;
var Te = ke;
var Y, W, j, J, $, _e, ie, me, Z, ae, oe, se, V, G, k, K, O, qe, re, pe = class pe2 extends z {
  constructor(r2 = {}, a2 = {}) {
    super();
    R$2(this, O);
    R$2(this, Y, false);
    R$2(this, W, false);
    R$2(this, j, false);
    R$2(this, J, false);
    R$2(this, $, false);
    R$2(this, _e, new H());
    R$2(this, ie, new H());
    R$2(this, me, new H());
    R$2(this, Z, false);
    this.debug = 0;
    R$2(this, ae);
    R$2(this, oe, []);
    R$2(this, se, new ye());
    R$2(this, V);
    R$2(this, G);
    R$2(this, k, /* @__PURE__ */ new Map());
    R$2(this, K, /* @__PURE__ */ new Set());
    typeof r2 == "string" ? a2 = { dataDir: r2, ...a2 } : a2 = r2, this.dataDir = a2.dataDir, a2.parsers !== void 0 && (this.parsers = { ...this.parsers, ...a2.parsers }), a2.serializers !== void 0 && (this.serializers = { ...this.serializers, ...a2.serializers }), a2?.debug !== void 0 && (this.debug = a2.debug), a2?.relaxedDurability !== void 0 && x$2(this, $, a2.relaxedDurability), x$2(this, ae, a2.extensions ?? {}), this.waitReady = T(this, O, qe).call(this, a2 ?? {});
  }
  static async create(r2, a2) {
    let o2 = typeof r2 == "string" ? { dataDir: r2, ...a2 ?? {} } : r2 ?? {}, s2 = new pe2(o2);
    return await s2.waitReady, s2;
  }
  get Module() {
    return this.mod;
  }
  get ready() {
    return h$1(this, Y) && !h$1(this, W) && !h$1(this, j);
  }
  get closed() {
    return h$1(this, j);
  }
  async close() {
    await this._checkReady(), x$2(this, W, true);
    for (let r2 of h$1(this, oe)) await r2();
    try {
      await this.execProtocol(O$1.end()), this.mod._pg_shutdown();
    } catch (r2) {
      let a2 = r2;
      if (!(a2.name === "ExitStatus" && a2.status === 0)) throw r2;
    }
    await this.fs.closeFs(), x$2(this, j, true), x$2(this, W, false);
  }
  async [Symbol.asyncDispose]() {
    await this.close();
  }
  async _handleBlob(r2) {
    x$2(this, V, r2 ? await r2.arrayBuffer() : void 0);
  }
  async _cleanupBlob() {
    x$2(this, V, void 0);
  }
  async _getWrittenBlob() {
    if (!h$1(this, G)) return;
    let r2 = new Blob(h$1(this, G));
    return x$2(this, G, void 0), r2;
  }
  async _checkReady() {
    if (h$1(this, W)) throw new Error("PGlite is closing");
    if (h$1(this, j)) throw new Error("PGlite is closed");
    h$1(this, Y) || await this.waitReady;
  }
  execProtocolRawSync(r2) {
    let a2 = r2.length, o2 = this.mod;
    o2._interactive_write(a2), o2.HEAPU8.set(r2, 1), o2._interactive_one();
    let s2 = a2 + 2, l2 = s2 + o2._interactive_read();
    return o2.HEAPU8.subarray(s2, l2);
  }
  async execProtocolRaw(r2, { syncToFs: a2 = true } = {}) {
    let o2 = r2.length, s2 = this.mod;
    s2._interactive_write(o2), s2.HEAPU8.set(r2, 1), s2._interactive_one();
    let l2 = o2 + 2, n2 = l2 + s2._interactive_read(), _2 = s2.HEAPU8.subarray(l2, n2);
    return a2 && await this.syncToFs(), _2;
  }
  async execProtocol(r2, { syncToFs: a2 = true, throwOnError: o2 = true, onNotice: s2 } = {}) {
    let l2 = await this.execProtocolRaw(r2, { syncToFs: a2 }), n2 = [];
    return h$1(this, se).parse(l2, (_2) => {
      if (_2 instanceof E) {
        if (x$2(this, se, new ye()), o2) throw _2;
      } else if (_2 instanceof ne) this.debug > 0 && console.warn(_2), s2 && s2(_2);
      else if (_2 instanceof ee$1) switch (_2.text) {
        case "BEGIN":
          x$2(this, J, true);
          break;
        case "COMMIT":
        case "ROLLBACK":
          x$2(this, J, false);
          break;
      }
      else if (_2 instanceof X) {
        let m2 = h$1(this, k).get(_2.channel);
        m2 && m2.forEach((p2) => {
          queueMicrotask(() => p2(_2.payload));
        }), h$1(this, K).forEach((p2) => {
          queueMicrotask(() => p2(_2.channel, _2.payload));
        });
      }
      n2.push(_2);
    }), { messages: n2, data: l2 };
  }
  isInTransaction() {
    return h$1(this, J);
  }
  async syncToFs() {
    if (h$1(this, Z)) return;
    x$2(this, Z, true);
    let r2 = async () => {
      await h$1(this, me).runExclusive(async () => {
        x$2(this, Z, false), await this.fs.syncToFs(h$1(this, $));
      });
    };
    h$1(this, $) ? r2() : await r2();
  }
  async listen(r2, a2) {
    let o2 = Nr(r2);
    h$1(this, k).has(o2) || h$1(this, k).set(o2, /* @__PURE__ */ new Set()), h$1(this, k).get(o2).add(a2);
    try {
      await this.exec(`LISTEN ${r2}`);
    } catch (s2) {
      throw h$1(this, k).get(o2).delete(a2), h$1(this, k).get(o2)?.size === 0 && h$1(this, k).delete(o2), s2;
    }
    return async () => {
      await this.unlisten(o2, a2);
    };
  }
  async unlisten(r2, a2) {
    let o2 = Nr(r2);
    a2 ? (h$1(this, k).get(o2)?.delete(a2), h$1(this, k).get(o2)?.size === 0 && (await this.exec(`UNLISTEN ${r2}`), h$1(this, k).delete(o2))) : (await this.exec(`UNLISTEN ${r2}`), h$1(this, k).delete(o2));
  }
  onNotification(r2) {
    return h$1(this, K).add(r2), () => {
      h$1(this, K).delete(r2);
    };
  }
  offNotification(r2) {
    h$1(this, K).delete(r2);
  }
  async dumpDataDir(r2) {
    let a2 = this.dataDir?.split("/").pop() ?? "pgdata";
    return this.fs.dumpTar(a2, r2);
  }
  _runExclusiveQuery(r2) {
    return h$1(this, _e).runExclusive(r2);
  }
  _runExclusiveTransaction(r2) {
    return h$1(this, ie).runExclusive(r2);
  }
  async clone() {
    let r2 = await this.dumpDataDir("none");
    return new pe2({ loadDataDir: r2 });
  }
};
Y = /* @__PURE__ */ new WeakMap(), W = /* @__PURE__ */ new WeakMap(), j = /* @__PURE__ */ new WeakMap(), J = /* @__PURE__ */ new WeakMap(), $ = /* @__PURE__ */ new WeakMap(), _e = /* @__PURE__ */ new WeakMap(), ie = /* @__PURE__ */ new WeakMap(), me = /* @__PURE__ */ new WeakMap(), Z = /* @__PURE__ */ new WeakMap(), ae = /* @__PURE__ */ new WeakMap(), oe = /* @__PURE__ */ new WeakMap(), se = /* @__PURE__ */ new WeakMap(), V = /* @__PURE__ */ new WeakMap(), G = /* @__PURE__ */ new WeakMap(), k = /* @__PURE__ */ new WeakMap(), K = /* @__PURE__ */ new WeakMap(), O = /* @__PURE__ */ new WeakSet(), qe = async function(r2) {
  if (r2.fs) this.fs = r2.fs;
  else {
    let { dataDir: d2, fsType: g2 } = Fe(r2.dataDir);
    this.fs = await Ae(d2, g2);
  }
  let a2 = {}, o2 = [], s2 = [`PGDATA=${C}`, `PREFIX=${Vr}`, `PGUSER=${r2.username ?? "postgres"}`, `PGDATABASE=${r2.database ?? "template1"}`, "MODE=REACT", "REPL=N", ...this.debug ? ["-d", this.debug.toString()] : []];
  r2.wasmModule || Rr();
  let l2 = r2.fsBundle ? r2.fsBundle.arrayBuffer() : Er(), n2;
  l2.then((d2) => {
    n2 = d2;
  });
  let _2 = { WASM_PREFIX: Vr, arguments: s2, INITIAL_MEMORY: r2.initialMemory, noExitRuntime: true, ...this.debug > 0 ? { print: console.info, printErr: console.error } : { print: () => {
  }, printErr: () => {
  } }, instantiateWasm: (d2, g2) => (Tr(d2, r2.wasmModule).then(({ instance: c2, module: f2 }) => {
    g2(c2, f2);
  }), {}), getPreloadedPackage: (d2, g2) => {
    if (d2 === "postgres.data") {
      if (n2.byteLength !== g2) throw new Error(`Invalid FS bundle size: ${n2.byteLength} !== ${g2}`);
      return n2;
    }
    throw new Error(`Unknown package: ${d2}`);
  }, preRun: [(d2) => {
    let g2 = d2.FS.makedev(64, 0), c2 = { open: (f2) => {
    }, close: (f2) => {
    }, read: (f2, u2, w2, h2, S2) => {
      let M2 = h$1(this, V);
      if (!M2) throw new Error("No /dev/blob File or Blob provided to read from");
      let y2 = new Uint8Array(M2);
      if (S2 >= y2.length) return 0;
      let x2 = Math.min(y2.length - S2, h2);
      for (let E2 = 0; E2 < x2; E2++) u2[w2 + E2] = y2[S2 + E2];
      return x2;
    }, write: (f2, u2, w2, h2, S2) => (h$1(this, G) ?? x$2(this, G, []), h$1(this, G).push(u2.slice(w2, w2 + h2)), h2), llseek: (f2, u2, w2) => {
      let h2 = h$1(this, V);
      if (!h2) throw new Error("No /dev/blob File or Blob provided to llseek");
      let S2 = u2;
      if (w2 === 1 ? S2 += f2.position : w2 === 2 && (S2 = new Uint8Array(h2).length), S2 < 0) throw new d2.FS.ErrnoError(28);
      return S2;
    } };
    d2.FS.registerDevice(g2, c2), d2.FS.mkdev("/dev/blob", g2);
  }] }, { emscriptenOpts: m2 } = await this.fs.init(this, _2);
  _2 = m2;
  for (let [d2, g2] of Object.entries(h$1(this, ae))) if (g2 instanceof URL) a2[d2] = ge(g2);
  else {
    let c2 = await g2.setup(this, _2);
    if (c2.emscriptenOpts && (_2 = c2.emscriptenOpts), c2.namespaceObj) {
      let f2 = this;
      f2[d2] = c2.namespaceObj;
    }
    c2.bundlePath && (a2[d2] = ge(c2.bundlePath)), c2.init && o2.push(c2.init), c2.close && h$1(this, oe).push(c2.close);
  }
  if (_2.pg_extensions = a2, await l2, this.mod = await Te(_2), await this.fs.initialSyncFs(), r2.loadDataDir) {
    if (this.mod.FS.analyzePath(C + "/PG_VERSION").exists) throw new Error("Database already exists, cannot load from tarball");
    T(this, O, re).call(this, "pglite: loading data from tarball"), await ce$1(this.mod.FS, r2.loadDataDir, C);
  }
  this.mod.FS.analyzePath(C + "/PG_VERSION").exists ? T(this, O, re).call(this, "pglite: found DB, resuming") : T(this, O, re).call(this, "pglite: no db"), await Pe(this.mod, (...d2) => T(this, O, re).call(this, ...d2));
  let p2 = this.mod._pg_initdb();
  if (!p2) throw new Error("INITDB failed to return value");
  if (p2 & 1) throw new Error("INITDB failed");
  if (p2 & 2) {
    let d2 = r2.username ?? "postgres", g2 = r2.database ?? "template1";
    if (p2 & 4) {
      if (!(p2 & 12)) throw new Error("Invalid db/user combination");
    } else if (g2 !== "template1" && d2 !== "postgres") throw new Error("INITDB created a new datadir, but an alternative db/user was requested");
  }
  await this.syncToFs(), x$2(this, Y, true), await this.exec("SET search_path TO public;"), await this._initArrayTypes();
  for (let d2 of o2) await d2();
}, re = function(...r2) {
  this.debug > 0 && console.log(...r2);
};
var Ue = pe;
u$1();
const DB_NAME = "baby-jarvis-db";
const DB_VERSION = 1;
const STORE_NAME = "app-settings";
const DIR_HANDLE_KEY = "directoryHandle";
const USING_OPFS_KEY = "usingOPFS";
let isUsingOPFS = false;
async function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = (event) => {
      const target = event.target;
      if (target instanceof IDBOpenDBRequest) {
        reject(target.error);
      } else {
        reject(new Error("Unknown IndexedDB error"));
      }
    };
    request.onsuccess = (event) => {
      const target = event.target;
      if (target instanceof IDBOpenDBRequest) {
        resolve(target.result);
      } else {
        reject(new Error("Unknown IndexedDB error"));
      }
    };
    request.onupgradeneeded = (event) => {
      const target = event.target;
      if (target instanceof IDBOpenDBRequest) {
        const db = target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      }
    };
  });
}
async function isOPFSAvailable() {
  try {
    return typeof navigator?.storage?.getDirectory === "function";
  } catch (e) {
    return false;
  }
}
async function getOPFSRoot() {
  if (!await isOPFSAvailable()) {
    throw new Error("Origin Private File System is not available in this browser");
  }
  try {
    return await navigator.storage.getDirectory();
  } catch (error) {
    if (error.name === "SecurityError") {
      throw new Error("OPFS is not available in this browser");
    }
    throw new Error("Failed to get OPFS root directory handle");
  }
}
async function createOPFSWrapper() {
  const root = await getOPFSRoot();
  let appRoot;
  try {
    appRoot = await root.getDirectoryHandle("baby-jarvis", { create: true });
  } catch (error) {
    console.error("Failed to create baby-jarvis directory in OPFS:", error);
    throw error;
  }
  const db = await openDatabase();
  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);
  await new Promise((resolve, reject) => {
    const request = store.put(true, USING_OPFS_KEY);
    request.onsuccess = resolve;
    request.onerror = reject;
  });
  isUsingOPFS = true;
  return appRoot;
}
async function saveDirectoryHandle(handle2) {
  try {
    if (!isUsingOPFS && handle2.requestPermission) {
      const permission = await handle2.requestPermission({ mode: "readwrite" });
      if (permission !== "granted") {
        return;
      }
    }
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(handle2, DIR_HANDLE_KEY);
      request.onerror = (event) => {
        const target = event.target;
        if (target instanceof IDBRequest) {
          reject(target.error);
        } else {
          reject(new Error("Unknown IndexedDB error"));
        }
      };
      request.onsuccess = () => {
        resolve();
      };
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    throw error;
  }
}
async function getSavedDirectoryHandle() {
  try {
    const db = await openDatabase();
    const isUsingOPFSStored = await new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(USING_OPFS_KEY);
      request.onsuccess = (event) => {
        const target = event.target;
        if (target instanceof IDBRequest) {
          resolve(target.result || false);
        } else {
          resolve(false);
        }
      };
      request.onerror = () => resolve(false);
    });
    if (isUsingOPFSStored) {
      isUsingOPFS = true;
      return await getOPFSRoot().then(
        (root) => root.getDirectoryHandle("baby-jarvis", { create: false })
      ).catch(() => null);
    }
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(DIR_HANDLE_KEY);
      request.onerror = (event) => {
        const target = event.target;
        if (target instanceof IDBRequest) {
          reject(target.error);
        } else {
          reject(new Error("Unknown IndexedDB error"));
        }
      };
      request.onsuccess = (event) => {
        const target = event.target;
        if (target instanceof IDBRequest) {
          resolve(target.result || null);
        } else {
          resolve(null);
        }
      };
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    return null;
  }
}
async function ensureDefaultActionsExist(directoryHandle2) {
  let actionsHandle;
  try {
    actionsHandle = await directoryHandle2.getDirectoryHandle("actions", { create: true });
  } catch (error) {
    console.error("Error creating actions directory:", error);
    return;
  }
  const defaultActions = [
    "createAction.js",
    "updateAction.js",
    "readAction.js",
    "runJavascript.js",
    "openActionEditor.js",
    "showHackerNews.js"
  ];
  for (const actionFile of defaultActions) {
    try {
      await actionsHandle.getFileHandle(actionFile);
      continue;
    } catch (error) {
      const response = await fetch(`./js/defaultActions/actions/${actionFile}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${actionFile}`);
      }
      const sourceCode = await response.text();
      const fileHandle = await actionsHandle.getFileHandle(actionFile, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(sourceCode);
      await writable.close();
      console.log(`Created ${actionFile} in the selected directory`);
    }
  }
}
async function initializeDirectoryHandle(forceSelect = false) {
  const hasFileSystemAccess = "showDirectoryPicker" in window;
  const hasOPFS = await isOPFSAvailable();
  if (!hasFileSystemAccess && !hasOPFS) {
    throw new Error("Neither File System Access API nor Origin Private File System are supported in this browser");
  }
  if (!forceSelect) {
    const savedHandle = await getSavedDirectoryHandle();
    if (savedHandle) {
      try {
        if (!isUsingOPFS && savedHandle.requestPermission) {
          await savedHandle.requestPermission({ mode: "readwrite" });
        }
        await ensureDefaultActionsExist(savedHandle);
        return savedHandle;
      } catch (error) {
      }
    }
  }
  let directoryHandle2;
  if (hasFileSystemAccess && !isUsingOPFS) {
    directoryHandle2 = await window.showDirectoryPicker();
  } else if (hasOPFS) {
    console.log("Using Origin Private File System as fallback");
    directoryHandle2 = await createOPFSWrapper();
  } else {
    throw new Error("Neither File System Access API nor Origin Private File System are supported in this browser");
  }
  await saveDirectoryHandle(directoryHandle2);
  await ensureDefaultActionsExist(directoryHandle2);
  return directoryHandle2;
}
const currentSessionDb = new Ue("memory://");
async function executeAction(actionName, input) {
  const action = await getAction(actionName);
  if (!action) {
    throw new Error(`Action "${actionName}" not found`);
  }
  const context = {
    db: action.permissions?.persistDb ? new Ue(`idb://${actionName}`) : currentSessionDb,
    log,
    directoryHandle,
    getActions
  };
  if (action.permissions?.autoExecute) {
    try {
      return {
        result: await action.action_fn(context, input),
        permissions: action.permissions
      };
    } catch (error) {
      console.error(`Error executing action ${actionName}:`, error);
      throw error;
    }
  }
  return await new Promise((resolve, reject) => {
    const chatContainer2 = document.getElementById("chat-container");
    if (!chatContainer2) {
      console.error("Chat container not found");
      reject(new Error("Chat container not found"));
      return;
    }
    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "action-buttons";
    buttonsContainer.style.marginTop = "10px";
    const confirmBtn = document.createElement("button");
    confirmBtn.textContent = "Confirm";
    confirmBtn.onclick = async () => {
      if (buttonsContainer.parentNode) {
        buttonsContainer.parentNode.removeChild(buttonsContainer);
      }
      try {
        resolve({
          result: await action.action_fn(context, input),
          permissions: action.permissions
        });
      } catch (error) {
        console.error(`Error executing action ${actionName}:`, error);
        reject(error);
      }
    };
    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.onclick = async () => {
      if (buttonsContainer.parentNode) {
        buttonsContainer.parentNode.removeChild(buttonsContainer);
      }
      reject(new Error("Execution cancelled by user"));
    };
    confirmBtn.style.marginRight = "10px";
    confirmBtn.style.padding = "5px 10px";
    cancelBtn.style.padding = "5px 10px";
    buttonsContainer.appendChild(confirmBtn);
    buttonsContainer.appendChild(cancelBtn);
    chatContainer2.appendChild(buttonsContainer);
  });
}
function log(...args2) {
  const message = args2.join(" ");
  console.log(...args2);
  try {
    const chatContainer2 = document.getElementById("chat-container");
    if (chatContainer2) {
      const logElement = document.createElement("div");
      logElement.className = "log-message";
      logElement.textContent = message;
      chatContainer2.appendChild(logElement);
    }
  } catch (e) {
    console.error("Error displaying log in UI:", e);
  }
  return message;
}
let directoryHandle;
async function getActions() {
  if (!directoryHandle) {
    directoryHandle = await initializeDirectoryHandle();
  }
  const defaultActionsHandle = await directoryHandle.getDirectoryHandle("actions");
  const entries = [];
  for await (const entry of defaultActionsHandle.values()) {
    if (entry.kind === "file" && entry.name.endsWith(".js")) {
      entries.push(entry);
    }
  }
  actions = (await Promise.all(
    entries.map(async (entry) => {
      const fileHandle = await defaultActionsHandle.getFileHandle(entry.name);
      const file = await fileHandle.getFile();
      const content = await file.text();
      const blob = new Blob([content], { type: "application/javascript" });
      const blobURL = URL.createObjectURL(blob);
      try {
        const module2 = await import(
          /* @vite-ignore */
          blobURL
        );
        if (module2.default) {
          return {
            ...module2.default,
            fileName: entry.name,
            app_name: ""
          };
        }
        console.error(`Action ${entry.name} has no default export`);
        return null;
      } catch (importError) {
        console.error(`Error importing action ${entry.name}:`, importError);
        return null;
      } finally {
        URL.revokeObjectURL(blobURL);
      }
    })
  )).filter((action) => action !== null);
  return actions;
}
let actions;
async function getAction(actionName) {
  if (!directoryHandle) {
    directoryHandle = await initializeDirectoryHandle();
  }
  try {
    const defaultActionsHandle = await directoryHandle.getDirectoryHandle("actions");
    const fileName = actions.find((action) => action.name === actionName)?.fileName;
    if (!fileName) {
      throw new Error(`Action "${actionName}" not found`);
    }
    try {
      const fileHandle = await defaultActionsHandle.getFileHandle(fileName);
      const file = await fileHandle.getFile();
      const content = await file.text();
      const blob = new Blob([content], { type: "application/javascript" });
      const blobURL = URL.createObjectURL(blob);
      try {
        const module2 = await import(
          /* @vite-ignore */
          blobURL
        );
        const action = module2.default;
        if (action) {
          return {
            ...action,
            app_name: "",
            fileName
          };
        }
        console.error(`Action ${fileName} has no default export`);
        return null;
      } finally {
        URL.revokeObjectURL(blobURL);
      }
    } catch (fileError) {
      console.error(`Could not find action file for ${actionName}:`, fileError);
      return null;
    }
  } catch (error) {
    console.error(`Error retrieving action ${actionName}:`, error);
    throw error;
  }
}
const API_CONFIG = {
  baseUrl: "https://api.anthropic.com/v1/messages",
  model: "claude-3-5-haiku-latest",
  // model: 'claude-3-7-sonnet-latest',
  // model: 'claude-3-5-sonnet-latest',
  maxTokens: 4e3
};
function saveApiKey(apiKey2) {
  localStorage.setItem("anthropic_api_key", apiKey2);
  return true;
}
function getApiKey() {
  const hashParams = new URLSearchParams(window.location.hash.slice(1));
  const hashApiKey = hashParams.get("anthropic_api_key");
  return hashApiKey || localStorage.getItem("anthropic_api_key");
}
async function sendMessage({ messages, systemPrompt: systemPrompt2, actions: actions2, onEvent }) {
  const apiKey2 = getApiKey();
  const tools = actions2.map((action) => ({
    name: action.name,
    description: action.description,
    input_schema: action.parameters
  }));
  if (!apiKey2) {
    throw new Error("API key not found. Please set your Anthropic API key.");
  }
  const claudeMessages = messages.map((message) => {
    return {
      role: message.role === "tool" ? "user" : message.role,
      content: message.content.map((content) => {
        switch (content.type) {
          case "text":
            return {
              type: "text",
              text: content.text
            };
          case "tool":
            if (!content.input) throw new Error("Tool content must have an input");
            return {
              type: "tool_use",
              id: content.id,
              name: content.name,
              input: content.input
            };
          case "tool_result":
            return {
              type: "tool_result",
              tool_use_id: content.tool_use_id,
              content: content.content,
              is_error: content.is_error
            };
          default:
            throw new Error(`Unknown message content type: ${content.type}`);
        }
      })
    };
  });
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const requestBody = {
      model: API_CONFIG.model,
      messages: claudeMessages,
      max_tokens: API_CONFIG.maxTokens,
      system: systemPrompt2,
      tools,
      tool_choice: { type: "auto" },
      stream: true
    };
    const response = await fetch(API_CONFIG.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey2,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify(requestBody),
      signal
    });
    if (!response?.ok) {
      const errorData = await response.json();
      throw new Error(`API error: ${errorData.error?.message || response.statusText}`);
    }
    if (!response.body) throw new Error("No response body");
    console.log("Starting streaming process...");
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const processStream = async () => {
      const { done, value } = await reader.read();
      if (done) return;
      const chunk = decoder.decode(value, { stream: true });
      try {
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonData = line.slice(6);
            if (jsonData === "[DONE]") {
              continue;
            }
            const data = JSON.parse(jsonData);
            switch (data.type) {
              case "message_start":
                break;
              case "content_block_start":
                switch (data.content_block.type) {
                  case "tool_use":
                    onEvent({
                      type: "tool_start",
                      index: data.index,
                      content: {
                        id: data.content_block.id,
                        name: data.content_block.name
                      }
                    });
                    break;
                  case "text":
                    onEvent({
                      type: "text_start",
                      index: data.index,
                      content: { text: "" }
                    });
                    break;
                }
                break;
              case "content_block_delta":
                switch (data.delta.type) {
                  case "text_delta":
                    onEvent({
                      type: "text_delta",
                      index: data.index,
                      content: { text: data.delta.text }
                    });
                    break;
                  case "input_json_delta":
                    onEvent({
                      type: "tool_delta",
                      index: data.index,
                      content: { input: data.delta.partial_json }
                    });
                    break;
                }
                break;
              case "content_block_stop":
                onEvent({
                  type: "content_block_stop",
                  index: data.index
                });
                break;
              case "error":
                throw new Error(data.error.message);
            }
          }
        }
      } catch (e) {
        reader.cancel();
        throw e;
      }
      return processStream();
    };
    return processStream();
  } catch (error) {
    console.error("Error calling Claude API:", error);
    throw error;
  }
}
const chatContainer = (
  /** @type {HTMLDivElement} */
  document.getElementById("chat-container")
);
const userInput = (
  /** @type {HTMLTextAreaElement} */
  document.getElementById("user-input")
);
const sendButton = (
  /** @type {HTMLButtonElement} */
  document.getElementById("send-button")
);
const apiKeyInput = (
  /** @type {HTMLInputElement} */
  document.getElementById("api-key")
);
const saveKeyButton = (
  /** @type {HTMLButtonElement} */
  document.getElementById("save-key")
);
let messageHistory = [];
const autoScroll = (() => {
  const threshold = 10;
  let shouldAutoScroll = true;
  document.addEventListener("scroll", () => {
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
    shouldAutoScroll = scrollHeight - scrollTop - clientHeight < threshold;
  });
  return () => {
    if (shouldAutoScroll) {
      document.documentElement.scrollTop = document.documentElement.scrollHeight;
    }
  };
})();
function addMessageToUI(message, isUser, messageClasses = []) {
  const messageElement = document.createElement("div");
  messageElement.className = isUser ? "user-message" : "ai-message";
  messageClasses.forEach((className) => {
    messageElement.classList.add(className);
  });
  if (typeof message === "string") {
    messageElement.textContent = message;
  } else if (Array.isArray(message?.content)) {
    message.content.forEach((block) => {
      if (block.type === "text") {
        const textElement = document.createElement("div");
        textElement.textContent = block.text;
        messageElement.appendChild(textElement);
      }
    });
  }
  chatContainer.appendChild(messageElement);
  autoScroll();
  return messageElement;
}
function updateTextBlock(messageElement, text, blockIndex) {
  let textBlockElement;
  if (blockIndex < messageElement.childElementCount) {
    textBlockElement = messageElement.children[blockIndex];
  } else {
    textBlockElement = document.createElement("div");
    messageElement.appendChild(textBlockElement);
  }
  textBlockElement.textContent = text;
  autoScroll();
  return textBlockElement;
}
function addToolUseToUI(toolUse) {
  const toolElement = document.createElement("div");
  toolElement.className = "tool-use";
  toolElement.innerHTML = /*html*/
  `
    <div class="tool-header">Using tool: <span class="tool-name">${toolUse.name}</span></div>
    <div class="tool-params">Parameters: ...</div>
    <div class="tool-loading">Executing...</div>
  `;
  chatContainer.appendChild(toolElement);
  autoScroll();
  return toolElement;
}
function updateToolWithResult(toolElement, result, success) {
  const loadingElement = toolElement.querySelector(".tool-loading");
  if (loadingElement && success) {
    loadingElement.textContent = `Result: ${JSON.stringify(result, null, 2)}`;
    loadingElement.className = "tool-result";
  } else if (loadingElement) {
    loadingElement.textContent = `Error: ${result || "Unknown error"}`;
    loadingElement.className = "tool-error";
  }
  autoScroll();
}
function updateToolParams(toolElement, input) {
  const paramsElement = toolElement.querySelector(".tool-params");
  if (!paramsElement) {
    throw new Error("No params element found");
  }
  try {
    const params = JSON.parse(input);
    if (params.code) {
      paramsElement.textContent = params.code;
    } else {
      paramsElement.textContent = JSON.stringify(params, null, 2);
    }
  } catch (e) {
    paramsElement.textContent = `Parameters: ${input}`;
  }
  autoScroll();
}
const systemPrompt = `You are Baby Jarvis, a helpful AI assistant that can execute javascript code.
Use the \`runJavascript\` action for any new task.
All Javascript code runs in the browser and is typechecked using JSDoc.

When I ask you to demonstrate something, never create an action immediately. Instead:
1. First, use \`runJavascript\` to show the implementation
2. Only create an action if I explicitly say 'create an action for this' or 'make this an action'

IMPORTANT: 
When writing JavaScript code, you MUST always use arrow functions that receive a context parameter, that context parameter has the following properties:
- context.log: A function to add messages to the UI for the user to see.
- context.db: A PGlite (Postgres in WASM) database instance, use \`db.sql\`...\`\` to execute queries. Each action can be configured to use either:
  - A shared ephemeral database that is cleared when the session ends (default)
  - A persistent isolated database that persists across browser refreshes
- context.directoryHandle: Access a user-selected directory where you can read and write files.
- context.getActions: A function to get all actions that have been created.

Example of correct code:
\`\`\`javascript
async ({log, db, directoryHandle, getActions}, params) => {
  log('Starting task...');
  const {rows: users} = await db.sql\`SELECT * FROM users WHERE id = \${params.userId}\`;
  const fileHandle = await directoryHandle.getFileHandle('users.txt', { create: true });
  const writer = await fileHandle.createWritable();
  await writer.write(users);
  return {
    users,
    actions: await getActions()
  }
}
\`\`\`

This format is strictly required for all JavaScript code execution.`;
async function sendMessageToAI(message) {
  try {
    addMessageToUI(message, true);
    messageHistory.push({ role: "user", content: [{ type: "text", text: message }] });
    await sendMessage({
      messages: messageHistory,
      systemPrompt,
      actions: await getActions(),
      onEvent: handleStreamEvent
    });
    console.log("Updated message history:", messageHistory);
  } catch (error) {
    console.error("Error sending message:", error);
    addMessageToUI(`Error: ${error.message}`, false, ["error"]);
  }
}
const content_blocks = /* @__PURE__ */ new Map();
async function handleStreamEvent(event) {
  switch (event.type) {
    case "text_start": {
      const element = addMessageToUI("", false);
      content_blocks.set(event.index, {
        type: "text",
        text: "",
        element
      });
      break;
    }
    case "text_delta": {
      const { index, content } = event;
      const content_block = (
        /** @type {TextContentBlock} */
        content_blocks.get(index)
      );
      content_block.text += content.text;
      updateTextBlock(content_block.element, content_block.text, index);
      break;
    }
    case "text_stop": {
      const textBlock = (
        /** @type {TextContentBlock} */
        content_blocks.get(event.index)
      );
      AddTextBlockToHistory(event.index, textBlock);
      content_blocks.delete(event.index);
      break;
    }
    case "tool_start": {
      const { index, content: { id, name: name2 } } = event;
      content_blocks.set(index, {
        type: "tool",
        id,
        name: name2,
        input_string: "",
        element: addToolUseToUI({ name: name2 })
      });
      break;
    }
    case "tool_delta": {
      const content_block = (
        /** @type {ToolContentBlock} */
        content_blocks.get(event.index)
      );
      content_block.input_string += event.content.input;
      updateToolParams(content_block.element, content_block.input_string);
      break;
    }
    case "tool_stop": {
      const toolContent = (
        /** @type {ToolContentBlock} */
        content_blocks.get(event.index)
      );
      content_blocks.delete(event.index);
      const lastMessage = messageHistory.at(-1);
      if (!lastMessage) throw new Error("No last message found");
      if (lastMessage.role !== "assistant") {
        messageHistory.push({ role: "assistant", content: [toolContent] });
      } else {
        lastMessage.content[event.index] = toolContent;
      }
      let parsedInput = {};
      if (toolContent.input_string) {
        try {
          parsedInput = JSON.parse(toolContent.input_string);
        } catch (e) {
          console.error("Error parsing input:", e);
          console.log({ input_string: toolContent.input_string });
          updateToolWithResult(toolContent.element, e.message, false);
          AddToolToHistory(event.index, toolContent);
          messageHistory.push({ role: "tool", content: [{ type: "tool_result", tool_use_id: toolContent.id, content: e.message, is_error: true }] });
          break;
        }
      }
      toolContent.input = parsedInput;
      AddToolToHistory(event.index, toolContent);
      let shouldLLMInterpretResult = false;
      try {
        const { result, permissions } = await executeAction(toolContent.name, parsedInput);
        shouldLLMInterpretResult = !!permissions?.autoContinue;
        updateToolWithResult(toolContent.element, result, true);
        messageHistory.push({ role: "tool", content: [{ type: "tool_result", tool_use_id: toolContent.id, content: JSON.stringify(result) }] });
      } catch (e) {
        shouldLLMInterpretResult = true;
        console.error("Error executing action:", e);
        updateToolWithResult(toolContent.element, e.message, false);
        messageHistory.push({ role: "tool", content: [{ type: "tool_result", tool_use_id: toolContent.id, content: e.message, is_error: true }] });
      }
      if (shouldLLMInterpretResult) {
        sendMessage({
          messages: messageHistory,
          systemPrompt,
          actions: await getActions(),
          onEvent: handleStreamEvent
        });
      }
      break;
    }
    case "content_block_stop": {
      const content_block = content_blocks.get(event.index);
      if (!content_block) throw new Error("No content block found");
      switch (content_block.type) {
        case "text":
          await handleStreamEvent({
            type: "text_stop",
            index: event.index
          });
          break;
        case "tool":
          await handleStreamEvent({
            type: "tool_stop",
            index: event.index
          });
          break;
      }
      break;
    }
  }
}
function AddTextBlockToHistory(index, textContent) {
  const lastMessage = messageHistory.at(-1);
  if (!lastMessage || lastMessage.role !== "assistant") {
    messageHistory.push({
      role: "assistant",
      content: [textContent]
    });
  } else {
    const current_content = lastMessage.content[index];
    if (current_content?.type === "text") {
      current_content.text = textContent.text;
    } else {
      console.error("Error: current_content is not a text block", { current_content, textContent });
    }
  }
}
function AddToolToHistory(index, toolContent) {
  const lastMessage = messageHistory.at(-1);
  if (lastMessage?.role !== "assistant") {
    messageHistory.push({ role: "assistant", content: [toolContent] });
  } else {
    const current_content = lastMessage.content[index];
    if (current_content?.type === "tool") {
      current_content.id = toolContent.id;
      current_content.name = toolContent.name;
      current_content.input = toolContent.input;
    } else {
      console.error("Error: current_content is not type tool", { current_content, toolContent });
    }
  }
}
saveKeyButton.addEventListener("click", () => {
  const apiKey2 = apiKeyInput.value.trim();
  if (apiKey2) {
    saveApiKey(apiKey2);
    alert("API key saved successfully!");
  } else {
    alert("Please enter a valid API key");
  }
});
sendButton.addEventListener("click", () => {
  const message = userInput.value.trim();
  if (message) {
    sendMessageToAI(message);
    userInput.value = "";
  }
});
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendButton.click();
  }
});
document.getElementById("change-directory").addEventListener("click", async (event) => {
  event.preventDefault();
  await initializeDirectoryHandle(true);
});
const apiKey = getApiKey();
if (apiKey) {
  apiKeyInput.value = "••••••••••••••••••••••••••••••••••••••••";
}
const hamburgerIcon = document.querySelector(".hamburger-icon");
const menuContent = document.querySelector(".menu-content");
if (hamburgerIcon && menuContent) {
  hamburgerIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    menuContent.classList.toggle("menu-active");
    hamburgerIcon.classList.toggle("hamburger-active");
  });
  document.addEventListener("click", () => {
    if (menuContent.classList.contains("menu-active")) {
      menuContent.classList.remove("menu-active");
      hamburgerIcon.classList.remove("hamburger-active");
    }
  });
}
addMessageToUI("Welcome to Baby Jarvis! I can help you with tasks by generating JavaScript and running it in your browser.", false);
export {
  C,
  R$2 as R,
  T,
  U$1 as U,
  u$1 as a,
  cr as c,
  h$1 as h,
  pr as p,
  ur as u,
  x$2 as x
};
