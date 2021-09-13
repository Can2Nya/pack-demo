/* SNOWPACK PROCESS POLYFILL (based on https://github.com/calvinmetcalf/node-process-es6) */
function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
var globalContext;
if (typeof window !== 'undefined') {
    globalContext = window;
} else if (typeof self !== 'undefined') {
    globalContext = self;
} else {
    globalContext = {};
}
if (typeof globalContext.setTimeout === 'function') {
    cachedSetTimeout = setTimeout;
}
if (typeof globalContext.clearTimeout === 'function') {
    cachedClearTimeout = clearTimeout;
}

function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
function nextTick(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
}
// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
var title = 'browser';
var platform = 'browser';
var browser = true;
var argv = [];
var version = ''; // empty string to avoid regexp issues
var versions = {};
var release = {};
var config = {};

function noop() {}

var on = noop;
var addListener = noop;
var once = noop;
var off = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = noop;

function binding(name) {
    throw new Error('process.binding is not supported');
}

function cwd () { return '/' }
function chdir (dir) {
    throw new Error('process.chdir is not supported');
}function umask() { return 0; }

// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
var performance$1 = globalContext.performance || {};
var performanceNow =
  performance$1.now        ||
  performance$1.mozNow     ||
  performance$1.msNow      ||
  performance$1.oNow       ||
  performance$1.webkitNow  ||
  function(){ return (new Date()).getTime() };

// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
function hrtime(previousTimestamp){
  var clocktime = performanceNow.call(performance$1)*1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor((clocktime%1)*1e9);
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds<0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [seconds,nanoseconds]
}

var startTime = new Date();
function uptime() {
  var currentTime = new Date();
  var dif = currentTime - startTime;
  return dif / 1000;
}

var process = {
  nextTick: nextTick,
  title: title,
  browser: browser,
  env: {"NODE_ENV":"development"},
  argv: argv,
  version: version,
  versions: versions,
  on: on,
  addListener: addListener,
  once: once,
  off: off,
  removeListener: removeListener,
  removeAllListeners: removeAllListeners,
  emit: emit,
  binding: binding,
  cwd: cwd,
  chdir: chdir,
  umask: umask,
  hrtime: hrtime,
  platform: platform,
  release: release,
  config: config,
  uptime: uptime
};

/*
  @license
	Rollup.js v2.56.3
	Mon, 23 Aug 2021 05:06:39 GMT - commit c41d17ceedfa6c1d7430da70c6c80d86a91e9434


	https://github.com/rollup/rollup

	Released under the MIT License.
*/
for (var t = {}, s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", i = 0; i < s.length; i++) t[s.charCodeAt(i)] = i;

function n(e, t, s) {
  4 === s ? e.push([t[0], t[1], t[2], t[3]]) : 5 === s ? e.push([t[0], t[1], t[2], t[3], t[4]]) : 1 === s && e.push([t[0]]);
}

function r(e) {
  var t = "";
  e = e < 0 ? -e << 1 | 1 : e << 1;

  do {
    var i = 31 & e;
    (e >>>= 5) > 0 && (i |= 32), t += s[i];
  } while (e > 0);

  return t;
}

var a = function e(t) {
  this.bits = t instanceof e ? t.bits.slice() : [];
};

a.prototype.add = function (e) {
  this.bits[e >> 5] |= 1 << (31 & e);
}, a.prototype.has = function (e) {
  return !!(this.bits[e >> 5] & 1 << (31 & e));
};

var o = function (e, t, s) {
  this.start = e, this.end = t, this.original = s, this.intro = "", this.outro = "", this.content = s, this.storeName = !1, this.edited = !1, Object.defineProperties(this, {
    previous: {
      writable: !0,
      value: null
    },
    next: {
      writable: !0,
      value: null
    }
  });
};

o.prototype.appendLeft = function (e) {
  this.outro += e;
}, o.prototype.appendRight = function (e) {
  this.intro = this.intro + e;
}, o.prototype.clone = function () {
  var e = new o(this.start, this.end, this.original);
  return e.intro = this.intro, e.outro = this.outro, e.content = this.content, e.storeName = this.storeName, e.edited = this.edited, e;
}, o.prototype.contains = function (e) {
  return this.start < e && e < this.end;
}, o.prototype.eachNext = function (e) {
  for (var t = this; t;) e(t), t = t.next;
}, o.prototype.eachPrevious = function (e) {
  for (var t = this; t;) e(t), t = t.previous;
}, o.prototype.edit = function (e, t, s) {
  return this.content = e, s || (this.intro = "", this.outro = ""), this.storeName = t, this.edited = !0, this;
}, o.prototype.prependLeft = function (e) {
  this.outro = e + this.outro;
}, o.prototype.prependRight = function (e) {
  this.intro = e + this.intro;
}, o.prototype.split = function (e) {
  var t = e - this.start,
      s = this.original.slice(0, t),
      i = this.original.slice(t);
  this.original = s;
  var n = new o(e, this.end, i);
  return n.outro = this.outro, this.outro = "", this.end = e, this.edited ? (n.edit("", !1), this.content = "") : this.content = s, n.next = this.next, n.next && (n.next.previous = n), n.previous = this, this.next = n, n;
}, o.prototype.toString = function () {
  return this.intro + this.content + this.outro;
}, o.prototype.trimEnd = function (e) {
  if (this.outro = this.outro.replace(e, ""), this.outro.length) return !0;
  var t = this.content.replace(e, "");
  return t.length ? (t !== this.content && this.split(this.start + t.length).edit("", void 0, !0), !0) : (this.edit("", void 0, !0), this.intro = this.intro.replace(e, ""), !!this.intro.length || void 0);
}, o.prototype.trimStart = function (e) {
  if (this.intro = this.intro.replace(e, ""), this.intro.length) return !0;
  var t = this.content.replace(e, "");
  return t.length ? (t !== this.content && (this.split(this.end - t.length), this.edit("", void 0, !0)), !0) : (this.edit("", void 0, !0), this.outro = this.outro.replace(e, ""), !!this.outro.length || void 0);
};

var h = function () {
  throw new Error("Unsupported environment: `window.btoa` or `Buffer` should be supported.");
};

"undefined" != typeof window && "function" == typeof window.btoa ? h = function (e) {
  return window.btoa(unescape(encodeURIComponent(e)));
} : "function" == typeof Buffer && (h = function (e) {
  return Buffer.from(e, "utf-8").toString("base64");
});

var l = function (e) {
  this.version = 3, this.file = e.file, this.sources = e.sources, this.sourcesContent = e.sourcesContent, this.names = e.names, this.mappings = function (e) {
    for (var t = 0, s = 0, i = 0, n = 0, a = "", o = 0; o < e.length; o++) {
      var h = e[o];

      if (o > 0 && (a += ";"), 0 !== h.length) {
        for (var l = 0, c = [], u = 0, d = h; u < d.length; u++) {
          var p = d[u],
              f = r(p[0] - l);
          l = p[0], p.length > 1 && (f += r(p[1] - t) + r(p[2] - s) + r(p[3] - i), t = p[1], s = p[2], i = p[3]), 5 === p.length && (f += r(p[4] - n), n = p[4]), c.push(f);
        }

        a += c.join(",");
      }
    }

    return a;
  }(e.mappings);
};

function c(e) {
  var t = e.split("\n"),
      s = t.filter(function (e) {
    return /^\t+/.test(e);
  }),
      i = t.filter(function (e) {
    return /^ {2,}/.test(e);
  });
  if (0 === s.length && 0 === i.length) return null;
  if (s.length >= i.length) return "\t";
  var n = i.reduce(function (e, t) {
    var s = /^ +/.exec(t)[0].length;
    return Math.min(s, e);
  }, 1 / 0);
  return new Array(n + 1).join(" ");
}

function u(e, t) {
  var s = e.split(/[/\\]/),
      i = t.split(/[/\\]/);

  for (s.pop(); s[0] === i[0];) s.shift(), i.shift();

  if (s.length) for (var n = s.length; n--;) s[n] = "..";
  return s.concat(i).join("/");
}

l.prototype.toString = function () {
  return JSON.stringify(this);
}, l.prototype.toUrl = function () {
  return "data:application/json;charset=utf-8;base64," + h(this.toString());
};
var d = Object.prototype.toString;

function p(e) {
  return "[object Object]" === d.call(e);
}

function f(e) {
  for (var t = e.split("\n"), s = [], i = 0, n = 0; i < t.length; i++) s.push(n), n += t[i].length + 1;

  return function (e) {
    for (var t = 0, i = s.length; t < i;) {
      var n = t + i >> 1;
      e < s[n] ? i = n : t = n + 1;
    }

    var r = t - 1;
    return {
      line: r,
      column: e - s[r]
    };
  };
}

var m = function (e) {
  this.hires = e, this.generatedCodeLine = 0, this.generatedCodeColumn = 0, this.raw = [], this.rawSegments = this.raw[this.generatedCodeLine] = [], this.pending = null;
};

m.prototype.addEdit = function (e, t, s, i) {
  if (t.length) {
    var n = [this.generatedCodeColumn, e, s.line, s.column];
    i >= 0 && n.push(i), this.rawSegments.push(n);
  } else this.pending && this.rawSegments.push(this.pending);

  this.advance(t), this.pending = null;
}, m.prototype.addUneditedChunk = function (e, t, s, i, n) {
  for (var r = t.start, a = !0; r < t.end;) (this.hires || a || n.has(r)) && this.rawSegments.push([this.generatedCodeColumn, e, i.line, i.column]), "\n" === s[r] ? (i.line += 1, i.column = 0, this.generatedCodeLine += 1, this.raw[this.generatedCodeLine] = this.rawSegments = [], this.generatedCodeColumn = 0, a = !0) : (i.column += 1, this.generatedCodeColumn += 1, a = !1), r += 1;

  this.pending = null;
}, m.prototype.advance = function (e) {
  if (e) {
    var t = e.split("\n");

    if (t.length > 1) {
      for (var s = 0; s < t.length - 1; s++) this.generatedCodeLine++, this.raw[this.generatedCodeLine] = this.rawSegments = [];

      this.generatedCodeColumn = 0;
    }

    this.generatedCodeColumn += t[t.length - 1].length;
  }
};

var g = "\n",
    y = {
  insertLeft: !1,
  insertRight: !1,
  storeName: !1
},
    E = function (e, t) {
  void 0 === t && (t = {});
  var s = new o(0, e.length, e);
  Object.defineProperties(this, {
    original: {
      writable: !0,
      value: e
    },
    outro: {
      writable: !0,
      value: ""
    },
    intro: {
      writable: !0,
      value: ""
    },
    firstChunk: {
      writable: !0,
      value: s
    },
    lastChunk: {
      writable: !0,
      value: s
    },
    lastSearchedChunk: {
      writable: !0,
      value: s
    },
    byStart: {
      writable: !0,
      value: {}
    },
    byEnd: {
      writable: !0,
      value: {}
    },
    filename: {
      writable: !0,
      value: t.filename
    },
    indentExclusionRanges: {
      writable: !0,
      value: t.indentExclusionRanges
    },
    sourcemapLocations: {
      writable: !0,
      value: new a()
    },
    storedNames: {
      writable: !0,
      value: {}
    },
    indentStr: {
      writable: !0,
      value: c(e)
    }
  }), this.byStart[0] = s, this.byEnd[e.length] = s;
};

E.prototype.addSourcemapLocation = function (e) {
  this.sourcemapLocations.add(e);
}, E.prototype.append = function (e) {
  if ("string" != typeof e) throw new TypeError("outro content must be a string");
  return this.outro += e, this;
}, E.prototype.appendLeft = function (e, t) {
  if ("string" != typeof t) throw new TypeError("inserted content must be a string");

  this._split(e);

  var s = this.byEnd[e];
  return s ? s.appendLeft(t) : this.intro += t, this;
}, E.prototype.appendRight = function (e, t) {
  if ("string" != typeof t) throw new TypeError("inserted content must be a string");

  this._split(e);

  var s = this.byStart[e];
  return s ? s.appendRight(t) : this.outro += t, this;
}, E.prototype.clone = function () {
  for (var e = new E(this.original, {
    filename: this.filename
  }), t = this.firstChunk, s = e.firstChunk = e.lastSearchedChunk = t.clone(); t;) {
    e.byStart[s.start] = s, e.byEnd[s.end] = s;
    var i = t.next,
        n = i && i.clone();
    n && (s.next = n, n.previous = s, s = n), t = i;
  }

  return e.lastChunk = s, this.indentExclusionRanges && (e.indentExclusionRanges = this.indentExclusionRanges.slice()), e.sourcemapLocations = new a(this.sourcemapLocations), e.intro = this.intro, e.outro = this.outro, e;
}, E.prototype.generateDecodedMap = function (e) {
  var t = this;
  e = e || {};
  var s = Object.keys(this.storedNames),
      i = new m(e.hires),
      n = f(this.original);
  return this.intro && i.advance(this.intro), this.firstChunk.eachNext(function (e) {
    var r = n(e.start);
    e.intro.length && i.advance(e.intro), e.edited ? i.addEdit(0, e.content, r, e.storeName ? s.indexOf(e.original) : -1) : i.addUneditedChunk(0, e, t.original, r, t.sourcemapLocations), e.outro.length && i.advance(e.outro);
  }), {
    file: e.file ? e.file.split(/[/\\]/).pop() : null,
    sources: [e.source ? u(e.file || "", e.source) : null],
    sourcesContent: e.includeContent ? [this.original] : [null],
    names: s,
    mappings: i.raw
  };
}, E.prototype.generateMap = function (e) {
  return new l(this.generateDecodedMap(e));
}, E.prototype.getIndentString = function () {
  return null === this.indentStr ? "\t" : this.indentStr;
}, E.prototype.indent = function (e, t) {
  var s = /^[^\r\n]/gm;
  if (p(e) && (t = e, e = void 0), "" === (e = void 0 !== e ? e : this.indentStr || "\t")) return this;
  var i = {};
  (t = t || {}).exclude && ("number" == typeof t.exclude[0] ? [t.exclude] : t.exclude).forEach(function (e) {
    for (var t = e[0]; t < e[1]; t += 1) i[t] = !0;
  });

  var n = !1 !== t.indentStart,
      r = function (t) {
    return n ? "" + e + t : (n = !0, t);
  };

  this.intro = this.intro.replace(s, r);

  for (var a = 0, o = this.firstChunk; o;) {
    var h = o.end;
    if (o.edited) i[a] || (o.content = o.content.replace(s, r), o.content.length && (n = "\n" === o.content[o.content.length - 1]));else for (a = o.start; a < h;) {
      if (!i[a]) {
        var l = this.original[a];
        "\n" === l ? n = !0 : "\r" !== l && n && (n = !1, a === o.start ? o.prependRight(e) : (this._splitChunk(o, a), (o = o.next).prependRight(e)));
      }

      a += 1;
    }
    a = o.end, o = o.next;
  }

  return this.outro = this.outro.replace(s, r), this;
}, E.prototype.insert = function () {
  throw new Error("magicString.insert(...) is deprecated. Use prependRight(...) or appendLeft(...)");
}, E.prototype.insertLeft = function (e, t) {
  return y.insertLeft || (console.warn("magicString.insertLeft(...) is deprecated. Use magicString.appendLeft(...) instead"), y.insertLeft = !0), this.appendLeft(e, t);
}, E.prototype.insertRight = function (e, t) {
  return y.insertRight || (console.warn("magicString.insertRight(...) is deprecated. Use magicString.prependRight(...) instead"), y.insertRight = !0), this.prependRight(e, t);
}, E.prototype.move = function (e, t, s) {
  if (s >= e && s <= t) throw new Error("Cannot move a selection inside itself");
  this._split(e), this._split(t), this._split(s);
  var i = this.byStart[e],
      n = this.byEnd[t],
      r = i.previous,
      a = n.next,
      o = this.byStart[s];
  if (!o && n === this.lastChunk) return this;
  var h = o ? o.previous : this.lastChunk;
  return r && (r.next = a), a && (a.previous = r), h && (h.next = i), o && (o.previous = n), i.previous || (this.firstChunk = n.next), n.next || (this.lastChunk = i.previous, this.lastChunk.next = null), i.previous = h, n.next = o || null, h || (this.firstChunk = i), o || (this.lastChunk = n), this;
}, E.prototype.overwrite = function (e, t, s, i) {
  if ("string" != typeof s) throw new TypeError("replacement content must be a string");

  for (; e < 0;) e += this.original.length;

  for (; t < 0;) t += this.original.length;

  if (t > this.original.length) throw new Error("end is out of bounds");
  if (e === t) throw new Error("Cannot overwrite a zero-length range – use appendLeft or prependRight instead");
  this._split(e), this._split(t), !0 === i && (y.storeName || (console.warn("The final argument to magicString.overwrite(...) should be an options object. See https://github.com/rich-harris/magic-string"), y.storeName = !0), i = {
    storeName: !0
  });
  var n = void 0 !== i && i.storeName,
      r = void 0 !== i && i.contentOnly;

  if (n) {
    var a = this.original.slice(e, t);
    this.storedNames[a] = !0;
  }

  var h = this.byStart[e],
      l = this.byEnd[t];

  if (h) {
    if (t > h.end && h.next !== this.byStart[h.end]) throw new Error("Cannot overwrite across a split point");

    if (h.edit(s, n, r), h !== l) {
      for (var c = h.next; c !== l;) c.edit("", !1), c = c.next;

      c.edit("", !1);
    }
  } else {
    var u = new o(e, t, "").edit(s, n);
    l.next = u, u.previous = l;
  }

  return this;
}, E.prototype.prepend = function (e) {
  if ("string" != typeof e) throw new TypeError("outro content must be a string");
  return this.intro = e + this.intro, this;
}, E.prototype.prependLeft = function (e, t) {
  if ("string" != typeof t) throw new TypeError("inserted content must be a string");

  this._split(e);

  var s = this.byEnd[e];
  return s ? s.prependLeft(t) : this.intro = t + this.intro, this;
}, E.prototype.prependRight = function (e, t) {
  if ("string" != typeof t) throw new TypeError("inserted content must be a string");

  this._split(e);

  var s = this.byStart[e];
  return s ? s.prependRight(t) : this.outro = t + this.outro, this;
}, E.prototype.remove = function (e, t) {
  for (; e < 0;) e += this.original.length;

  for (; t < 0;) t += this.original.length;

  if (e === t) return this;
  if (e < 0 || t > this.original.length) throw new Error("Character is out of bounds");
  if (e > t) throw new Error("end must be greater than start");
  this._split(e), this._split(t);

  for (var s = this.byStart[e]; s;) s.intro = "", s.outro = "", s.edit(""), s = t > s.end ? this.byStart[s.end] : null;

  return this;
}, E.prototype.lastChar = function () {
  if (this.outro.length) return this.outro[this.outro.length - 1];
  var e = this.lastChunk;

  do {
    if (e.outro.length) return e.outro[e.outro.length - 1];
    if (e.content.length) return e.content[e.content.length - 1];
    if (e.intro.length) return e.intro[e.intro.length - 1];
  } while (e = e.previous);

  return this.intro.length ? this.intro[this.intro.length - 1] : "";
}, E.prototype.lastLine = function () {
  var e = this.outro.lastIndexOf(g);
  if (-1 !== e) return this.outro.substr(e + 1);
  var t = this.outro,
      s = this.lastChunk;

  do {
    if (s.outro.length > 0) {
      if (-1 !== (e = s.outro.lastIndexOf(g))) return s.outro.substr(e + 1) + t;
      t = s.outro + t;
    }

    if (s.content.length > 0) {
      if (-1 !== (e = s.content.lastIndexOf(g))) return s.content.substr(e + 1) + t;
      t = s.content + t;
    }

    if (s.intro.length > 0) {
      if (-1 !== (e = s.intro.lastIndexOf(g))) return s.intro.substr(e + 1) + t;
      t = s.intro + t;
    }
  } while (s = s.previous);

  return -1 !== (e = this.intro.lastIndexOf(g)) ? this.intro.substr(e + 1) + t : this.intro + t;
}, E.prototype.slice = function (e, t) {
  for (void 0 === e && (e = 0), void 0 === t && (t = this.original.length); e < 0;) e += this.original.length;

  for (; t < 0;) t += this.original.length;

  for (var s = "", i = this.firstChunk; i && (i.start > e || i.end <= e);) {
    if (i.start < t && i.end >= t) return s;
    i = i.next;
  }

  if (i && i.edited && i.start !== e) throw new Error("Cannot use replaced character " + e + " as slice start anchor.");

  for (var n = i; i;) {
    !i.intro || n === i && i.start !== e || (s += i.intro);
    var r = i.start < t && i.end >= t;
    if (r && i.edited && i.end !== t) throw new Error("Cannot use replaced character " + t + " as slice end anchor.");
    var a = n === i ? e - i.start : 0,
        o = r ? i.content.length + t - i.end : i.content.length;
    if (s += i.content.slice(a, o), !i.outro || r && i.end !== t || (s += i.outro), r) break;
    i = i.next;
  }

  return s;
}, E.prototype.snip = function (e, t) {
  var s = this.clone();
  return s.remove(0, e), s.remove(t, s.original.length), s;
}, E.prototype._split = function (e) {
  if (!this.byStart[e] && !this.byEnd[e]) for (var t = this.lastSearchedChunk, s = e > t.end; t;) {
    if (t.contains(e)) return this._splitChunk(t, e);
    t = s ? this.byStart[t.end] : this.byEnd[t.start];
  }
}, E.prototype._splitChunk = function (e, t) {
  if (e.edited && e.content.length) {
    var s = f(this.original)(t);
    throw new Error("Cannot split a chunk that has already been edited (" + s.line + ":" + s.column + ' – "' + e.original + '")');
  }

  var i = e.split(t);
  return this.byEnd[t] = e, this.byStart[t] = i, this.byEnd[i.end] = i, e === this.lastChunk && (this.lastChunk = i), this.lastSearchedChunk = e, !0;
}, E.prototype.toString = function () {
  for (var e = this.intro, t = this.firstChunk; t;) e += t.toString(), t = t.next;

  return e + this.outro;
}, E.prototype.isEmpty = function () {
  var e = this.firstChunk;

  do {
    if (e.intro.length && e.intro.trim() || e.content.length && e.content.trim() || e.outro.length && e.outro.trim()) return !1;
  } while (e = e.next);

  return !0;
}, E.prototype.length = function () {
  var e = this.firstChunk,
      t = 0;

  do {
    t += e.intro.length + e.content.length + e.outro.length;
  } while (e = e.next);

  return t;
}, E.prototype.trimLines = function () {
  return this.trim("[\\r\\n]");
}, E.prototype.trim = function (e) {
  return this.trimStart(e).trimEnd(e);
}, E.prototype.trimEndAborted = function (e) {
  var t = new RegExp((e || "\\s") + "+$");
  if (this.outro = this.outro.replace(t, ""), this.outro.length) return !0;
  var s = this.lastChunk;

  do {
    var i = s.end,
        n = s.trimEnd(t);
    if (s.end !== i && (this.lastChunk === s && (this.lastChunk = s.next), this.byEnd[s.end] = s, this.byStart[s.next.start] = s.next, this.byEnd[s.next.end] = s.next), n) return !0;
    s = s.previous;
  } while (s);

  return !1;
}, E.prototype.trimEnd = function (e) {
  return this.trimEndAborted(e), this;
}, E.prototype.trimStartAborted = function (e) {
  var t = new RegExp("^" + (e || "\\s") + "+");
  if (this.intro = this.intro.replace(t, ""), this.intro.length) return !0;
  var s = this.firstChunk;

  do {
    var i = s.end,
        n = s.trimStart(t);
    if (s.end !== i && (s === this.lastChunk && (this.lastChunk = s.next), this.byEnd[s.end] = s, this.byStart[s.next.start] = s.next, this.byEnd[s.next.end] = s.next), n) return !0;
    s = s.next;
  } while (s);

  return !1;
}, E.prototype.trimStart = function (e) {
  return this.trimStartAborted(e), this;
};

var x = Object.prototype.hasOwnProperty,
    v = function (e) {
  void 0 === e && (e = {}), this.intro = e.intro || "", this.separator = void 0 !== e.separator ? e.separator : "\n", this.sources = [], this.uniqueSources = [], this.uniqueSourceIndexByFilename = {};
};

v.prototype.addSource = function (e) {
  if (e instanceof E) return this.addSource({
    content: e,
    filename: e.filename,
    separator: this.separator
  });
  if (!p(e) || !e.content) throw new Error("bundle.addSource() takes an object with a `content` property, which should be an instance of MagicString, and an optional `filename`");
  if (["filename", "indentExclusionRanges", "separator"].forEach(function (t) {
    x.call(e, t) || (e[t] = e.content[t]);
  }), void 0 === e.separator && (e.separator = this.separator), e.filename) if (x.call(this.uniqueSourceIndexByFilename, e.filename)) {
    var t = this.uniqueSources[this.uniqueSourceIndexByFilename[e.filename]];
    if (e.content.original !== t.content) throw new Error("Illegal source: same filename (" + e.filename + "), different contents");
  } else this.uniqueSourceIndexByFilename[e.filename] = this.uniqueSources.length, this.uniqueSources.push({
    filename: e.filename,
    content: e.content.original
  });
  return this.sources.push(e), this;
}, v.prototype.append = function (e, t) {
  return this.addSource({
    content: new E(e),
    separator: t && t.separator || ""
  }), this;
}, v.prototype.clone = function () {
  var e = new v({
    intro: this.intro,
    separator: this.separator
  });
  return this.sources.forEach(function (t) {
    e.addSource({
      filename: t.filename,
      content: t.content.clone(),
      separator: t.separator
    });
  }), e;
}, v.prototype.generateDecodedMap = function (e) {
  var t = this;
  void 0 === e && (e = {});
  var s = [];
  this.sources.forEach(function (e) {
    Object.keys(e.content.storedNames).forEach(function (e) {
      ~s.indexOf(e) || s.push(e);
    });
  });
  var i = new m(e.hires);
  return this.intro && i.advance(this.intro), this.sources.forEach(function (e, n) {
    n > 0 && i.advance(t.separator);
    var r = e.filename ? t.uniqueSourceIndexByFilename[e.filename] : -1,
        a = e.content,
        o = f(a.original);
    a.intro && i.advance(a.intro), a.firstChunk.eachNext(function (t) {
      var n = o(t.start);
      t.intro.length && i.advance(t.intro), e.filename ? t.edited ? i.addEdit(r, t.content, n, t.storeName ? s.indexOf(t.original) : -1) : i.addUneditedChunk(r, t, a.original, n, a.sourcemapLocations) : i.advance(t.content), t.outro.length && i.advance(t.outro);
    }), a.outro && i.advance(a.outro);
  }), {
    file: e.file ? e.file.split(/[/\\]/).pop() : null,
    sources: this.uniqueSources.map(function (t) {
      return e.file ? u(e.file, t.filename) : t.filename;
    }),
    sourcesContent: this.uniqueSources.map(function (t) {
      return e.includeContent ? t.content : null;
    }),
    names: s,
    mappings: i.raw
  };
}, v.prototype.generateMap = function (e) {
  return new l(this.generateDecodedMap(e));
}, v.prototype.getIndentString = function () {
  var e = {};
  return this.sources.forEach(function (t) {
    var s = t.content.indentStr;
    null !== s && (e[s] || (e[s] = 0), e[s] += 1);
  }), Object.keys(e).sort(function (t, s) {
    return e[t] - e[s];
  })[0] || "\t";
}, v.prototype.indent = function (e) {
  var t = this;
  if (arguments.length || (e = this.getIndentString()), "" === e) return this;
  var s = !this.intro || "\n" === this.intro.slice(-1);
  return this.sources.forEach(function (i, n) {
    var r = void 0 !== i.separator ? i.separator : t.separator,
        a = s || n > 0 && /\r?\n$/.test(r);
    i.content.indent(e, {
      exclude: i.indentExclusionRanges,
      indentStart: a
    }), s = "\n" === i.content.lastChar();
  }), this.intro && (this.intro = e + this.intro.replace(/^[^\n]/gm, function (t, s) {
    return s > 0 ? e + t : t;
  })), this;
}, v.prototype.prepend = function (e) {
  return this.intro = e + this.intro, this;
}, v.prototype.toString = function () {
  var e = this,
      t = this.sources.map(function (t, s) {
    var i = void 0 !== t.separator ? t.separator : e.separator;
    return (s > 0 ? i : "") + t.content.toString();
  }).join("");
  return this.intro + t;
}, v.prototype.isEmpty = function () {
  return (!this.intro.length || !this.intro.trim()) && !this.sources.some(function (e) {
    return !e.content.isEmpty();
  });
}, v.prototype.length = function () {
  return this.sources.reduce(function (e, t) {
    return e + t.content.length();
  }, this.intro.length);
}, v.prototype.trimLines = function () {
  return this.trim("[\\r\\n]");
}, v.prototype.trim = function (e) {
  return this.trimStart(e).trimEnd(e);
}, v.prototype.trimStart = function (e) {
  var t = new RegExp("^" + (e || "\\s") + "+");

  if (this.intro = this.intro.replace(t, ""), !this.intro) {
    var s,
        i = 0;

    do {
      if (!(s = this.sources[i++])) break;
    } while (!s.content.trimStartAborted(e));
  }

  return this;
}, v.prototype.trimEnd = function (e) {
  var t,
      s = new RegExp((e || "\\s") + "+$"),
      i = this.sources.length - 1;

  do {
    if (!(t = this.sources[i--])) {
      this.intro = this.intro.replace(s, "");
      break;
    }
  } while (!t.content.trimEndAborted(e));

  return this;
};
var b = E;
const S = /^(?:\/|(?:[A-Za-z]:)?[\\|/])/,
      A = /^\.?\.\//;

function P(e) {
  return S.test(e);
}

function k(e) {
  return A.test(e);
}

function C(e) {
  return e.replace(/\\/g, "/");
}

function w(e) {
  return e.split(/[/\\]/).pop() || "";
}

function I(e) {
  const t = /[/\\][^/\\]*$/.exec(e);
  if (!t) return ".";
  const s = e.slice(0, -t[0].length);
  return s || "/";
}

function N(e) {
  const t = /\.[^.]+$/.exec(w(e));
  return t ? t[0] : "";
}

function _(e, t) {
  const s = e.split(/[/\\]/).filter(Boolean),
        i = t.split(/[/\\]/).filter(Boolean);

  for ("." === s[0] && s.shift(), "." === i[0] && i.shift(); s[0] && i[0] && s[0] === i[0];) s.shift(), i.shift();

  for (; ".." === i[0] && s.length > 0;) i.shift(), s.pop();

  for (; s.pop();) i.unshift("..");

  return i.join("/");
}

function $(...e) {
  const t = e.shift();
  if (!t) return "/";
  let s = t.split(/[/\\]/);

  for (const t of e) if (P(t)) s = t.split(/[/\\]/);else {
    const e = t.split(/[/\\]/);

    for (; "." === e[0] || ".." === e[0];) {
      ".." === e.shift() && s.pop();
    }

    s.push(...e);
  }

  return s.join("/");
}

const T = {
  __proto__: null,
  await: !0,
  break: !0,
  case: !0,
  catch: !0,
  class: !0,
  const: !0,
  continue: !0,
  debugger: !0,
  default: !0,
  delete: !0,
  do: !0,
  else: !0,
  enum: !0,
  eval: !0,
  export: !0,
  extends: !0,
  false: !0,
  finally: !0,
  for: !0,
  function: !0,
  if: !0,
  implements: !0,
  import: !0,
  in: !0,
  instanceof: !0,
  interface: !0,
  let: !0,
  new: !0,
  null: !0,
  package: !0,
  private: !0,
  protected: !0,
  public: !0,
  return: !0,
  static: !0,
  super: !0,
  switch: !0,
  this: !0,
  throw: !0,
  true: !0,
  try: !0,
  typeof: !0,
  undefined: !0,
  var: !0,
  void: !0,
  while: !0,
  with: !0,
  yield: !0
};

function R(e, t, s) {
  const i = e.get(t);
  if (i) return i;
  const n = s();
  return e.set(t, n), n;
}

const M = Symbol("Unknown Key"),
      O = Symbol("Unknown Integer"),
      L = [],
      D = [M],
      V = [O],
      B = Symbol("Entities");

class F {
  constructor() {
    this.entityPaths = Object.create(null, {
      [B]: {
        value: new Set()
      }
    });
  }

  trackEntityAtPathAndGetIfTracked(e, t) {
    const s = this.getEntities(e);
    return !!s.has(t) || (s.add(t), !1);
  }

  withTrackedEntityAtPath(e, t, s, i) {
    const n = this.getEntities(e);
    if (n.has(t)) return i;
    n.add(t);
    const r = s();
    return n.delete(t), r;
  }

  getEntities(e) {
    let t = this.entityPaths;

    for (const s of e) t = t[s] = t[s] || Object.create(null, {
      [B]: {
        value: new Set()
      }
    });

    return t[B];
  }

}

const z = new F();

class W {
  constructor() {
    this.entityPaths = Object.create(null, {
      [B]: {
        value: new Map()
      }
    });
  }

  trackEntityAtPathAndGetIfTracked(e, t, s) {
    let i = this.entityPaths;

    for (const t of e) i = i[t] = i[t] || Object.create(null, {
      [B]: {
        value: new Map()
      }
    });

    const n = R(i[B], t, () => new Set());
    return !!n.has(s) || (n.add(s), !1);
  }

}

const j = Symbol("Unknown Value");

class U {
  constructor() {
    this.included = !1;
  }

  deoptimizePath(e) {}

  deoptimizeThisOnEventAtPath(e, t, s, i) {
    s.deoptimizePath(D);
  }

  getLiteralValueAtPath(e, t, s) {
    return j;
  }

  getReturnExpressionWhenCalledAtPath(e, t, s, i) {
    return G;
  }

  hasEffectsWhenAccessedAtPath(e, t) {
    return !0;
  }

  hasEffectsWhenAssignedAtPath(e, t) {
    return !0;
  }

  hasEffectsWhenCalledAtPath(e, t, s) {
    return !0;
  }

  include(e, t) {
    this.included = !0;
  }

  includeCallArguments(e, t) {
    for (const s of t) s.include(e, !1);
  }

}

const G = new class extends U {}();

class H extends U {
  constructor(e) {
    super(), this.name = e, this.alwaysRendered = !1, this.initReached = !1, this.isId = !1, this.isReassigned = !1, this.kind = null, this.renderBaseName = null, this.renderName = null;
  }

  addReference(e) {}

  getBaseVariableName() {
    return this.renderBaseName || this.renderName || this.name;
  }

  getName() {
    const e = this.renderName || this.name;
    return this.renderBaseName ? `${this.renderBaseName}${T[e] ? `['${e}']` : `.${e}`}` : e;
  }

  hasEffectsWhenAccessedAtPath(e, t) {
    return e.length > 0;
  }

  include() {
    this.included = !0;
  }

  markCalledFromTryStatement() {}

  setRenderNames(e, t) {
    this.renderBaseName = e, this.renderName = t;
  }

}

class q extends H {
  constructor(e, t) {
    super(t), this.module = e, this.isNamespace = "*" === t, this.referenced = !1;
  }

  addReference(e) {
    this.referenced = !0, "default" !== this.name && "*" !== this.name || this.module.suggestName(e.name);
  }

  hasEffectsWhenAccessedAtPath(e) {
    return e.length > (this.isNamespace ? 1 : 0);
  }

  include() {
    this.included || (this.included = !0, this.module.used = !0);
  }

}

const K = Object.freeze(Object.create(null)),
      X = Object.freeze({}),
      Y = Object.freeze([]),
      Q = "break case class catch const continue debugger default delete do else export extends finally for function if import in instanceof let new return super switch this throw try typeof var void while with yield enum await implements package protected static interface private public".split(" "),
      Z = "Infinity NaN undefined null true false eval uneval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Symbol Error EvalError InternalError RangeError ReferenceError SyntaxError TypeError URIError Number Math Date String RegExp Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array Map Set WeakMap WeakSet SIMD ArrayBuffer DataView JSON Promise Generator GeneratorFunction Reflect Proxy Intl".split(" "),
      J = new Set(Q.concat(Z)),
      ee = /[^$_a-zA-Z0-9]/g,
      te = e => /\d/.test(e[0]);

function se(e) {
  return e = e.replace(/-(\w)/g, (e, t) => t.toUpperCase()).replace(ee, "_"), (te(e) || J.has(e)) && (e = `_${e}`), e || "_";
}

function ie(e, t) {
  const s = e.length <= 1,
        i = e.map(e => `"${e}"`);
  let n = s ? i[0] : `${i.slice(0, -1).join(", ")} and ${i.slice(-1)[0]}`;
  return t && (n += ` ${s ? t[0] : t[1]}`), n;
}

function ne(e) {
  const t = w(e);
  return t.substr(0, t.length - N(e).length);
}

function re(e) {
  return P(e) ? _($(), e) : e;
}

function ae(e) {
  return "/" === e[0] || "." === e[0] && ("/" === e[1] || "." === e[1]) || P(e);
}

class oe {
  constructor(e, t, s, i, n) {
    this.options = e, this.id = t, this.renormalizeRenderPath = n, this.defaultVariableName = "", this.dynamicImporters = [], this.importers = [], this.mostCommonSuggestion = 0, this.namespaceVariableName = "", this.reexported = !1, this.renderPath = void 0, this.used = !1, this.variableName = "", this.execIndex = 1 / 0, this.suggestedVariableName = se(t.split(/[\\/]/).pop()), this.nameSuggestions = Object.create(null), this.declarations = Object.create(null), this.exportedVariables = new Map();
    const {
      importers: r,
      dynamicImporters: a
    } = this;
    this.info = {
      ast: null,
      code: null,
      dynamicallyImportedIds: Y,

      get dynamicImporters() {
        return a.sort();
      },

      hasModuleSideEffects: s,
      id: t,
      implicitlyLoadedAfterOneOf: Y,
      implicitlyLoadedBefore: Y,
      importedIds: Y,

      get importers() {
        return r.sort();
      },

      isEntry: !1,
      isExternal: !0,
      meta: i,
      syntheticNamedExports: !1
    };
  }

  getVariableForExportName(e) {
    let t = this.declarations[e];
    return t || (this.declarations[e] = t = new q(this, e), this.exportedVariables.set(t, e), t);
  }

  setRenderPath(e, t) {
    return this.renderPath = "function" == typeof e.paths ? e.paths(this.id) : e.paths[this.id], this.renderPath || (this.renderPath = this.renormalizeRenderPath ? C(_(t, this.id)) : this.id), this.renderPath;
  }

  suggestName(e) {
    this.nameSuggestions[e] || (this.nameSuggestions[e] = 0), this.nameSuggestions[e] += 1, this.nameSuggestions[e] > this.mostCommonSuggestion && (this.mostCommonSuggestion = this.nameSuggestions[e], this.suggestedVariableName = e);
  }

  warnUnusedImports() {
    const e = Object.keys(this.declarations).filter(e => {
      if ("*" === e) return !1;
      const t = this.declarations[e];
      return !t.included && !this.reexported && !t.referenced;
    });
    if (0 === e.length) return;
    const t = new Set();

    for (const s of e) {
      const {
        importers: e
      } = this.declarations[s].module;

      for (const s of e) t.add(s);
    }

    const s = [...t];
    this.options.onwarn({
      code: "UNUSED_EXTERNAL_IMPORT",
      message: `${ie(e, ["is", "are"])} imported from external module "${this.id}" but never used in ${ie(s.map(e => re(e)))}.`,
      names: e,
      source: this.id,
      sources: s
    });
  }

}

function he(e, t, s) {
  if ("number" == typeof s) throw new Error("locate takes a { startIndex, offsetLine, offsetColumn } object as the third argument");
  return function (e, t) {
    void 0 === t && (t = {});
    var s = t.offsetLine || 0,
        i = t.offsetColumn || 0,
        n = e.split("\n"),
        r = 0,
        a = n.map(function (e, t) {
      var s = r + e.length + 1,
          i = {
        start: r,
        end: s,
        line: t
      };
      return r = s, i;
    }),
        o = 0;

    function h(e, t) {
      return e.start <= t && t < e.end;
    }

    function l(e, t) {
      return {
        line: s + e.line,
        column: i + t - e.start,
        character: t
      };
    }

    return function (t, s) {
      "string" == typeof t && (t = e.indexOf(t, s || 0));

      for (var i = a[o], n = t >= i.end ? 1 : -1; i;) {
        if (h(i, t)) return l(i, t);
        i = a[o += n];
      }
    };
  }(e, s)(t, s && s.startIndex);
}

const le = {
  ArrayPattern(e, t) {
    for (const s of t.elements) s && le[s.type](e, s);
  },

  AssignmentPattern(e, t) {
    le[t.left.type](e, t.left);
  },

  Identifier(e, t) {
    e.push(t.name);
  },

  MemberExpression() {},

  ObjectPattern(e, t) {
    for (const s of t.properties) "RestElement" === s.type ? le.RestElement(e, s) : le[s.value.type](e, s.value);
  },

  RestElement(e, t) {
    le[t.argument.type](e, t.argument);
  }

},
      ce = function (e) {
  const t = [];
  return le[e.type](t, e), t;
};

function ue() {
  return {
    brokenFlow: 0,
    includedCallArguments: new Set(),
    includedLabels: new Set()
  };
}

function de() {
  return {
    accessed: new F(),
    assigned: new F(),
    brokenFlow: 0,
    called: new W(),
    ignore: {
      breaks: !1,
      continues: !1,
      labels: new Set(),
      returnYield: !1
    },
    includedLabels: new Set(),
    instantiated: new W(),
    replacedVariableInits: new Map()
  };
}

function pe(e, t, s) {
  s(e, t);
}

function fe(e, t, s) {}

var me = {};
me.Program = me.BlockStatement = function (e, t, s) {
  for (var i = 0, n = e.body; i < n.length; i += 1) {
    s(n[i], t, "Statement");
  }
}, me.Statement = pe, me.EmptyStatement = fe, me.ExpressionStatement = me.ParenthesizedExpression = me.ChainExpression = function (e, t, s) {
  return s(e.expression, t, "Expression");
}, me.IfStatement = function (e, t, s) {
  s(e.test, t, "Expression"), s(e.consequent, t, "Statement"), e.alternate && s(e.alternate, t, "Statement");
}, me.LabeledStatement = function (e, t, s) {
  return s(e.body, t, "Statement");
}, me.BreakStatement = me.ContinueStatement = fe, me.WithStatement = function (e, t, s) {
  s(e.object, t, "Expression"), s(e.body, t, "Statement");
}, me.SwitchStatement = function (e, t, s) {
  s(e.discriminant, t, "Expression");

  for (var i = 0, n = e.cases; i < n.length; i += 1) {
    var r = n[i];
    r.test && s(r.test, t, "Expression");

    for (var a = 0, o = r.consequent; a < o.length; a += 1) {
      s(o[a], t, "Statement");
    }
  }
}, me.SwitchCase = function (e, t, s) {
  e.test && s(e.test, t, "Expression");

  for (var i = 0, n = e.consequent; i < n.length; i += 1) {
    s(n[i], t, "Statement");
  }
}, me.ReturnStatement = me.YieldExpression = me.AwaitExpression = function (e, t, s) {
  e.argument && s(e.argument, t, "Expression");
}, me.ThrowStatement = me.SpreadElement = function (e, t, s) {
  return s(e.argument, t, "Expression");
}, me.TryStatement = function (e, t, s) {
  s(e.block, t, "Statement"), e.handler && s(e.handler, t), e.finalizer && s(e.finalizer, t, "Statement");
}, me.CatchClause = function (e, t, s) {
  e.param && s(e.param, t, "Pattern"), s(e.body, t, "Statement");
}, me.WhileStatement = me.DoWhileStatement = function (e, t, s) {
  s(e.test, t, "Expression"), s(e.body, t, "Statement");
}, me.ForStatement = function (e, t, s) {
  e.init && s(e.init, t, "ForInit"), e.test && s(e.test, t, "Expression"), e.update && s(e.update, t, "Expression"), s(e.body, t, "Statement");
}, me.ForInStatement = me.ForOfStatement = function (e, t, s) {
  s(e.left, t, "ForInit"), s(e.right, t, "Expression"), s(e.body, t, "Statement");
}, me.ForInit = function (e, t, s) {
  "VariableDeclaration" === e.type ? s(e, t) : s(e, t, "Expression");
}, me.DebuggerStatement = fe, me.FunctionDeclaration = function (e, t, s) {
  return s(e, t, "Function");
}, me.VariableDeclaration = function (e, t, s) {
  for (var i = 0, n = e.declarations; i < n.length; i += 1) {
    s(n[i], t);
  }
}, me.VariableDeclarator = function (e, t, s) {
  s(e.id, t, "Pattern"), e.init && s(e.init, t, "Expression");
}, me.Function = function (e, t, s) {
  e.id && s(e.id, t, "Pattern");

  for (var i = 0, n = e.params; i < n.length; i += 1) {
    s(n[i], t, "Pattern");
  }

  s(e.body, t, e.expression ? "Expression" : "Statement");
}, me.Pattern = function (e, t, s) {
  "Identifier" === e.type ? s(e, t, "VariablePattern") : "MemberExpression" === e.type ? s(e, t, "MemberPattern") : s(e, t);
}, me.VariablePattern = fe, me.MemberPattern = pe, me.RestElement = function (e, t, s) {
  return s(e.argument, t, "Pattern");
}, me.ArrayPattern = function (e, t, s) {
  for (var i = 0, n = e.elements; i < n.length; i += 1) {
    var r = n[i];
    r && s(r, t, "Pattern");
  }
}, me.ObjectPattern = function (e, t, s) {
  for (var i = 0, n = e.properties; i < n.length; i += 1) {
    var r = n[i];
    "Property" === r.type ? (r.computed && s(r.key, t, "Expression"), s(r.value, t, "Pattern")) : "RestElement" === r.type && s(r.argument, t, "Pattern");
  }
}, me.Expression = pe, me.ThisExpression = me.Super = me.MetaProperty = fe, me.ArrayExpression = function (e, t, s) {
  for (var i = 0, n = e.elements; i < n.length; i += 1) {
    var r = n[i];
    r && s(r, t, "Expression");
  }
}, me.ObjectExpression = function (e, t, s) {
  for (var i = 0, n = e.properties; i < n.length; i += 1) {
    s(n[i], t);
  }
}, me.FunctionExpression = me.ArrowFunctionExpression = me.FunctionDeclaration, me.SequenceExpression = function (e, t, s) {
  for (var i = 0, n = e.expressions; i < n.length; i += 1) {
    s(n[i], t, "Expression");
  }
}, me.TemplateLiteral = function (e, t, s) {
  for (var i = 0, n = e.quasis; i < n.length; i += 1) {
    s(n[i], t);
  }

  for (var r = 0, a = e.expressions; r < a.length; r += 1) {
    s(a[r], t, "Expression");
  }
}, me.TemplateElement = fe, me.UnaryExpression = me.UpdateExpression = function (e, t, s) {
  s(e.argument, t, "Expression");
}, me.BinaryExpression = me.LogicalExpression = function (e, t, s) {
  s(e.left, t, "Expression"), s(e.right, t, "Expression");
}, me.AssignmentExpression = me.AssignmentPattern = function (e, t, s) {
  s(e.left, t, "Pattern"), s(e.right, t, "Expression");
}, me.ConditionalExpression = function (e, t, s) {
  s(e.test, t, "Expression"), s(e.consequent, t, "Expression"), s(e.alternate, t, "Expression");
}, me.NewExpression = me.CallExpression = function (e, t, s) {
  if (s(e.callee, t, "Expression"), e.arguments) for (var i = 0, n = e.arguments; i < n.length; i += 1) {
    s(n[i], t, "Expression");
  }
}, me.MemberExpression = function (e, t, s) {
  s(e.object, t, "Expression"), e.computed && s(e.property, t, "Expression");
}, me.ExportNamedDeclaration = me.ExportDefaultDeclaration = function (e, t, s) {
  e.declaration && s(e.declaration, t, "ExportNamedDeclaration" === e.type || e.declaration.id ? "Statement" : "Expression"), e.source && s(e.source, t, "Expression");
}, me.ExportAllDeclaration = function (e, t, s) {
  e.exported && s(e.exported, t), s(e.source, t, "Expression");
}, me.ImportDeclaration = function (e, t, s) {
  for (var i = 0, n = e.specifiers; i < n.length; i += 1) {
    s(n[i], t);
  }

  s(e.source, t, "Expression");
}, me.ImportExpression = function (e, t, s) {
  s(e.source, t, "Expression");
}, me.ImportSpecifier = me.ImportDefaultSpecifier = me.ImportNamespaceSpecifier = me.Identifier = me.PrivateIdentifier = me.Literal = fe, me.TaggedTemplateExpression = function (e, t, s) {
  s(e.tag, t, "Expression"), s(e.quasi, t, "Expression");
}, me.ClassDeclaration = me.ClassExpression = function (e, t, s) {
  return s(e, t, "Class");
}, me.Class = function (e, t, s) {
  e.id && s(e.id, t, "Pattern"), e.superClass && s(e.superClass, t, "Expression"), s(e.body, t);
}, me.ClassBody = function (e, t, s) {
  for (var i = 0, n = e.body; i < n.length; i += 1) {
    s(n[i], t);
  }
}, me.MethodDefinition = me.PropertyDefinition = me.Property = function (e, t, s) {
  e.computed && s(e.key, t, "Expression"), e.value && s(e.value, t, "Expression");
};
const ye = new RegExp("^#[ \\f\\r\\t\\v\\u00a0\\u1680\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000\\ufeff]+sourceMappingURL=.+");

me.PropertyDefinition = function (e, t, s) {
  e.computed && s(e.key, t, "Expression"), e.value && s(e.value, t, "Expression");
};

function Ee(e, t, s = e.type) {
  const {
    annotations: i
  } = t;
  let n = i[t.annotationIndex];

  for (; n && e.start >= n.end;) be(e, n, t.code), n = i[++t.annotationIndex];

  if (n && n.end <= e.end) for (me[s](e, t, Ee); (n = i[t.annotationIndex]) && n.end <= e.end;) ++t.annotationIndex, Pe(e, n, !1);
}

const xe = /[^\s(]/g,
      ve = /\S/g;

function be(e, t, s) {
  const i = [];
  let n;

  if (Se(s.slice(t.end, e.start), xe)) {
    const t = e.start;

    for (;;) {
      switch (i.push(e), e.type) {
        case "ExpressionStatement":
        case "ChainExpression":
          e = e.expression;
          continue;

        case "SequenceExpression":
          if (Se(s.slice(t, e.start), ve)) {
            e = e.expressions[0];
            continue;
          }

          n = !0;
          break;

        case "ConditionalExpression":
          if (Se(s.slice(t, e.start), ve)) {
            e = e.test;
            continue;
          }

          n = !0;
          break;

        case "LogicalExpression":
        case "BinaryExpression":
          if (Se(s.slice(t, e.start), ve)) {
            e = e.left;
            continue;
          }

          n = !0;
          break;

        case "CallExpression":
        case "NewExpression":
          break;

        default:
          n = !0;
      }

      break;
    }
  } else n = !0;

  if (n) Pe(e, t, !1);else for (const e of i) Pe(e, t, !0);
}

function Se(e, t) {
  let s;

  for (; null !== (s = t.exec(e));) {
    if ("/" === s[0]) {
      const s = e.charCodeAt(t.lastIndex);

      if (42 === s) {
        t.lastIndex = e.indexOf("*/", t.lastIndex + 1) + 2;
        continue;
      }

      if (47 === s) {
        t.lastIndex = e.indexOf("\n", t.lastIndex + 1) + 1;
        continue;
      }
    }

    return t.lastIndex = 0, !1;
  }

  return !0;
}

const Ae = /[@#]__PURE__/;

function Pe(e, t, s) {
  const i = s ? "_rollupAnnotations" : "_rollupRemoved",
        n = e[i];
  n ? n.push(t) : e[i] = [t];
}

const ke = {
  Literal: [],
  Program: ["body"]
};

class Ce extends U {
  constructor(e, t, s) {
    super(), this.esTreeNode = e, this.keys = ke[e.type] || function (e) {
      return ke[e.type] = Object.keys(e).filter(t => "object" == typeof e[t] && 95 !== t.charCodeAt(0)), ke[e.type];
    }(e), this.parent = t, this.context = t.context, this.createScope(s), this.parseNode(e), this.initialise(), this.context.magicString.addSourcemapLocation(this.start), this.context.magicString.addSourcemapLocation(this.end);
  }

  addExportedVariables(e, t) {}

  bind() {
    for (const e of this.keys) {
      const t = this[e];
      if (null !== t) if (Array.isArray(t)) for (const e of t) null !== e && e.bind();else t.bind();
    }
  }

  createScope(e) {
    this.scope = e;
  }

  hasEffects(e) {
    !1 === this.deoptimized && this.applyDeoptimizations();

    for (const t of this.keys) {
      const s = this[t];
      if (null !== s) if (Array.isArray(s)) {
        for (const t of s) if (null !== t && t.hasEffects(e)) return !0;
      } else if (s.hasEffects(e)) return !0;
    }

    return !1;
  }

  include(e, t) {
    !1 === this.deoptimized && this.applyDeoptimizations(), this.included = !0;

    for (const s of this.keys) {
      const i = this[s];
      if (null !== i) if (Array.isArray(i)) for (const s of i) null !== s && s.include(e, t);else i.include(e, t);
    }
  }

  includeAsSingleStatement(e, t) {
    this.include(e, t);
  }

  initialise() {}

  insertSemicolon(e) {
    ";" !== e.original[this.end - 1] && e.appendLeft(this.end, ";");
  }

  parseNode(e) {
    for (const [t, s] of Object.entries(e)) if (!this.hasOwnProperty(t)) if (95 === t.charCodeAt(0)) {
      if ("_rollupAnnotations" === t) this.annotations = s;else if ("_rollupRemoved" === t) for (const {
        start: e,
        end: t
      } of s) this.context.magicString.remove(e, t);
    } else if ("object" != typeof s || null === s) this[t] = s;else if (Array.isArray(s)) {
      this[t] = [];

      for (const e of s) this[t].push(null === e ? null : new (this.context.nodeConstructors[e.type] || this.context.nodeConstructors.UnknownNode)(e, this, this.scope));
    } else this[t] = new (this.context.nodeConstructors[s.type] || this.context.nodeConstructors.UnknownNode)(s, this, this.scope);
  }

  render(e, t) {
    for (const s of this.keys) {
      const i = this[s];
      if (null !== i) if (Array.isArray(i)) for (const s of i) null !== s && s.render(e, t);else i.render(e, t);
    }
  }

  shouldBeIncluded(e) {
    return this.included || !e.brokenFlow && this.hasEffects(de());
  }

  applyDeoptimizations() {}

}

class we extends Ce {
  hasEffects() {
    return !1;
  }

  initialise() {
    this.context.addExport(this);
  }

  render(e, t, s) {
    e.remove(s.start, s.end);
  }

}

function Ie(e, t, s, i) {
  if (t.remove(s, i), e.annotations) for (const i of e.annotations) {
    if (!(i.start < s)) return;
    t.remove(i.start, i.end);
  }
}

function Ne(e, t) {
  if (e.annotations || "ExpressionStatement" !== e.parent.type || (e = e.parent), e.annotations) for (const s of e.annotations) t.remove(s.start, s.end);
}

we.prototype.needsBoundaries = !0;
const _e = {
  isNoStatement: !0
};

function $e(e, t, s = 0) {
  let i, n;

  for (i = e.indexOf(t, s);;) {
    if (-1 === (s = e.indexOf("/", s)) || s >= i) return i;
    n = e.charCodeAt(++s), ++s, (s = 47 === n ? e.indexOf("\n", s) + 1 : e.indexOf("*/", s) + 2) > i && (i = e.indexOf(t, s));
  }
}

const Te = /\S/g;

function Re(e, t) {
  Te.lastIndex = t;
  return Te.exec(e).index;
}

function Me(e) {
  let t,
      s,
      i = 0;

  for (t = e.indexOf("\n", i);;) {
    if (i = e.indexOf("/", i), -1 === i || i > t) return [t, t + 1];
    if (s = e.charCodeAt(i + 1), 47 === s) return [i, t + 1];
    i = e.indexOf("*/", i + 3) + 2, i > t && (t = e.indexOf("\n", i));
  }
}

function Oe(e, t, s, i, n) {
  let r,
      a,
      o,
      h,
      l = e[0],
      c = !l.included || l.needsBoundaries;
  c && (h = s + Me(t.original.slice(s, l.start))[1]);

  for (let s = 1; s <= e.length; s++) r = l, a = h, o = c, l = e[s], c = void 0 !== l && (!l.included || l.needsBoundaries), o || c ? (h = r.end + Me(t.original.slice(r.end, void 0 === l ? i : l.start))[1], r.included ? o ? r.render(t, n, {
    end: h,
    start: a
  }) : r.render(t, n) : Ie(r, t, a, h)) : r.render(t, n);
}

function Le(e, t, s, i) {
  const n = [];
  let r,
      a,
      o,
      h,
      l,
      c = s - 1;

  for (let i = 0; i < e.length; i++) {
    for (a = e[i], void 0 !== r && (c = r.end + $e(t.original.slice(r.end, a.start), ",")), o = h = c + 1 + Me(t.original.slice(c + 1, a.start))[1]; l = t.original.charCodeAt(o), 32 === l || 9 === l || 10 === l || 13 === l;) o++;

    void 0 !== r && n.push({
      contentEnd: h,
      end: o,
      node: r,
      separator: c,
      start: s
    }), r = a, s = o;
  }

  return n.push({
    contentEnd: i,
    end: i,
    node: r,
    separator: null,
    start: s
  }), n;
}

function De(e, t, s) {
  for (;;) {
    const [i, n] = Me(e.original.slice(t, s));
    if (-1 === i) break;
    e.remove(t + i, t += n);
  }
}

function Ve(e, {
  compact: t,
  exportNamesByVariable: s
}, i = "") {
  const n = t ? "" : " ";

  if (1 === e.length && 1 === s.get(e[0]).length) {
    const t = e[0];
    return `exports('${s.get(t)}',${n}${t.getName()}${i})`;
  }

  return `exports({${n}${e.map(e => s.get(e).map(t => `${t}:${n}${e.getName()}${i}`).join(`,${n}`)).join(`,${n}`)}${n}})`;
}

function Be(e, t, s, i, {
  compact: n,
  exportNamesByVariable: r
}) {
  const a = n ? "" : " ";
  i.prependRight(t, `exports('${r.get(e)}',${a}`), i.appendLeft(s, ")");
}

function Fe(e, t, s, i, n, r) {
  const a = r.compact ? "" : " ";
  n.appendLeft(s, `,${a}${Ve([e], r)},${a}${e.getName()}`), i && (n.prependRight(t, "("), n.appendLeft(s, ")"));
}

function ze(e) {
  let t = "";

  do {
    const s = e % 64;
    e = Math.floor(e / 64), t = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$"[s] + t;
  } while (0 !== e);

  return t;
}

function We(e, t) {
  let s = e,
      i = 1;

  for (; t.has(s) || T[s];) s = `${e}$${ze(i++)}`;

  return t.add(s), s;
}

const je = [];

function Ue(e, t = null) {
  return Object.create(t, e);
}

const Ge = new class extends U {
  getLiteralValueAtPath() {}

}(),
      He = {
  value: {
    callsArgs: null,
    returns: G
  }
},
      qe = new class extends U {
  getReturnExpressionWhenCalledAtPath(e) {
    return 1 === e.length ? nt(et, e[0]) : G;
  }

  hasEffectsWhenAccessedAtPath(e) {
    return e.length > 1;
  }

  hasEffectsWhenCalledAtPath(e, t, s) {
    return 1 !== e.length || it(et, e[0], t, s);
  }

}(),
      Ke = {
  value: {
    callsArgs: null,
    returns: qe
  }
},
      Xe = new class extends U {
  getReturnExpressionWhenCalledAtPath(e) {
    return 1 === e.length ? nt(tt, e[0]) : G;
  }

  hasEffectsWhenAccessedAtPath(e) {
    return e.length > 1;
  }

  hasEffectsWhenCalledAtPath(e, t, s) {
    return 1 !== e.length || it(tt, e[0], t, s);
  }

}(),
      Ye = {
  value: {
    callsArgs: null,
    returns: Xe
  }
},
      Qe = new class extends U {
  getReturnExpressionWhenCalledAtPath(e) {
    return 1 === e.length ? nt(st, e[0]) : G;
  }

  hasEffectsWhenAccessedAtPath(e) {
    return e.length > 1;
  }

  hasEffectsWhenCalledAtPath(e, t, s) {
    return 1 !== e.length || it(st, e[0], t, s);
  }

}(),
      Ze = {
  value: {
    callsArgs: null,
    returns: Qe
  }
},
      Je = Ue({
  hasOwnProperty: Ke,
  isPrototypeOf: Ke,
  propertyIsEnumerable: Ke,
  toLocaleString: Ze,
  toString: Ze,
  valueOf: He
}),
      et = Ue({
  valueOf: Ke
}, Je),
      tt = Ue({
  toExponential: Ze,
  toFixed: Ze,
  toLocaleString: Ze,
  toPrecision: Ze,
  valueOf: Ye
}, Je),
      st = Ue({
  charAt: Ze,
  charCodeAt: Ye,
  codePointAt: Ye,
  concat: Ze,
  endsWith: Ke,
  includes: Ke,
  indexOf: Ye,
  lastIndexOf: Ye,
  localeCompare: Ye,
  match: Ke,
  normalize: Ze,
  padEnd: Ze,
  padStart: Ze,
  repeat: Ze,
  replace: {
    value: {
      callsArgs: [1],
      returns: Qe
    }
  },
  search: Ye,
  slice: Ze,
  split: He,
  startsWith: Ke,
  substr: Ze,
  substring: Ze,
  toLocaleLowerCase: Ze,
  toLocaleUpperCase: Ze,
  toLowerCase: Ze,
  toUpperCase: Ze,
  trim: Ze,
  valueOf: Ze
}, Je);

function it(e, t, s, i) {
  if ("string" != typeof t || !e[t]) return !0;
  if (!e[t].callsArgs) return !1;

  for (const n of e[t].callsArgs) if (s.args[n] && s.args[n].hasEffectsWhenCalledAtPath(L, {
    args: je,
    thisParam: null,
    withNew: !1
  }, i)) return !0;

  return !1;
}

function nt(e, t) {
  return "string" == typeof t && e[t] ? e[t].returns : G;
}

class rt extends H {
  constructor(e, t, s, i) {
    super(e), this.calledFromTryStatement = !1, this.additionalInitializers = null, this.expressionsToBeDeoptimized = [], this.declarations = t ? [t] : [], this.init = s, this.deoptimizationTracker = i.deoptimizationTracker, this.module = i.module;
  }

  addDeclaration(e, t) {
    this.declarations.push(e);
    const s = this.markInitializersForDeoptimization();
    null !== t && s.push(t);
  }

  consolidateInitializers() {
    if (null !== this.additionalInitializers) {
      for (const e of this.additionalInitializers) e.deoptimizePath(D);

      this.additionalInitializers = null;
    }
  }

  deoptimizePath(e) {
    var t, s;
    if (!this.isReassigned && !this.deoptimizationTracker.trackEntityAtPathAndGetIfTracked(e, this)) if (0 === e.length) {
      if (!this.isReassigned) {
        this.isReassigned = !0;
        const e = this.expressionsToBeDeoptimized;
        this.expressionsToBeDeoptimized = [];

        for (const t of e) t.deoptimizeCache();

        null === (t = this.init) || void 0 === t || t.deoptimizePath(D);
      }
    } else null === (s = this.init) || void 0 === s || s.deoptimizePath(e);
  }

  deoptimizeThisOnEventAtPath(e, t, s, i) {
    if (this.isReassigned || !this.init) return s.deoptimizePath(D);
    i.withTrackedEntityAtPath(t, this.init, () => this.init.deoptimizeThisOnEventAtPath(e, t, s, i), void 0);
  }

  getLiteralValueAtPath(e, t, s) {
    return this.isReassigned || !this.init ? j : t.withTrackedEntityAtPath(e, this.init, () => (this.expressionsToBeDeoptimized.push(s), this.init.getLiteralValueAtPath(e, t, s)), j);
  }

  getReturnExpressionWhenCalledAtPath(e, t, s, i) {
    return this.isReassigned || !this.init ? G : s.withTrackedEntityAtPath(e, this.init, () => (this.expressionsToBeDeoptimized.push(i), this.init.getReturnExpressionWhenCalledAtPath(e, t, s, i)), G);
  }

  hasEffectsWhenAccessedAtPath(e, t) {
    return !!this.isReassigned || this.init && !t.accessed.trackEntityAtPathAndGetIfTracked(e, this) && this.init.hasEffectsWhenAccessedAtPath(e, t);
  }

  hasEffectsWhenAssignedAtPath(e, t) {
    return !!this.included || 0 !== e.length && (!!this.isReassigned || this.init && !t.accessed.trackEntityAtPathAndGetIfTracked(e, this) && this.init.hasEffectsWhenAssignedAtPath(e, t));
  }

  hasEffectsWhenCalledAtPath(e, t, s) {
    return !!this.isReassigned || this.init && !(t.withNew ? s.instantiated : s.called).trackEntityAtPathAndGetIfTracked(e, t, this) && this.init.hasEffectsWhenCalledAtPath(e, t, s);
  }

  include() {
    if (!this.included) {
      this.included = !0;

      for (const e of this.declarations) {
        e.included || e.include(ue(), !1);
        let t = e.parent;

        for (; !t.included && (t.included = !0, "Program" !== t.type);) t = t.parent;
      }
    }
  }

  includeCallArguments(e, t) {
    if (this.isReassigned || this.init && e.includedCallArguments.has(this.init)) for (const s of t) s.include(e, !1);else this.init && (e.includedCallArguments.add(this.init), this.init.includeCallArguments(e, t), e.includedCallArguments.delete(this.init));
  }

  markCalledFromTryStatement() {
    this.calledFromTryStatement = !0;
  }

  markInitializersForDeoptimization() {
    return null === this.additionalInitializers && (this.additionalInitializers = null === this.init ? [] : [this.init], this.init = G, this.isReassigned = !0), this.additionalInitializers;
  }

}

class at {
  constructor() {
    this.children = [], this.variables = new Map();
  }

  addDeclaration(e, t, s, i) {
    const n = e.name;
    let r = this.variables.get(n);
    return r ? r.addDeclaration(e, s) : (r = new rt(e.name, e, s || Ge, t), this.variables.set(n, r)), r;
  }

  contains(e) {
    return this.variables.has(e);
  }

  findVariable(e) {
    throw new Error("Internal Error: findVariable needs to be implemented by a subclass");
  }

}

class ot extends at {
  constructor(e) {
    super(), this.accessedOutsideVariables = new Map(), this.parent = e, e.children.push(this);
  }

  addAccessedDynamicImport(e) {
    (this.accessedDynamicImports || (this.accessedDynamicImports = new Set())).add(e), this.parent instanceof ot && this.parent.addAccessedDynamicImport(e);
  }

  addAccessedGlobals(e, t) {
    const s = t.get(this) || new Set();

    for (const t of e) s.add(t);

    t.set(this, s), this.parent instanceof ot && this.parent.addAccessedGlobals(e, t);
  }

  addNamespaceMemberAccess(e, t) {
    this.accessedOutsideVariables.set(e, t), this.parent.addNamespaceMemberAccess(e, t);
  }

  addReturnExpression(e) {
    this.parent instanceof ot && this.parent.addReturnExpression(e);
  }

  addUsedOutsideNames(e, t, s, i) {
    for (const i of this.accessedOutsideVariables.values()) i.included && (e.add(i.getBaseVariableName()), "system" === t && s.has(i) && e.add("exports"));

    const n = i.get(this);
    if (n) for (const t of n) e.add(t);
  }

  contains(e) {
    return this.variables.has(e) || this.parent.contains(e);
  }

  deconflict(e, t, s) {
    const i = new Set();
    if (this.addUsedOutsideNames(i, e, t, s), this.accessedDynamicImports) for (const e of this.accessedDynamicImports) e.inlineNamespace && i.add(e.inlineNamespace.getBaseVariableName());

    for (const [e, t] of this.variables) (t.included || t.alwaysRendered) && t.setRenderNames(null, We(e, i));

    for (const i of this.children) i.deconflict(e, t, s);
  }

  findLexicalBoundary() {
    return this.parent.findLexicalBoundary();
  }

  findVariable(e) {
    const t = this.variables.get(e) || this.accessedOutsideVariables.get(e);
    if (t) return t;
    const s = this.parent.findVariable(e);
    return this.accessedOutsideVariables.set(e, s), s;
  }

}

function ht(e, t) {
  if ("MemberExpression" === e.type) return !e.computed && ht(e.object, e);

  if ("Identifier" === e.type) {
    if (!t) return !0;

    switch (t.type) {
      case "MemberExpression":
        return t.computed || e === t.object;

      case "MethodDefinition":
        return t.computed;

      case "PropertyDefinition":
      case "Property":
        return t.computed || e === t.value;

      case "ExportSpecifier":
      case "ImportSpecifier":
        return e === t.local;

      case "LabeledStatement":
      case "BreakStatement":
      case "ContinueStatement":
        return !1;

      default:
        return !0;
    }
  }

  return !1;
}

const lt = Symbol("Value Properties"),
      ct = {
  pure: !0
},
      ut = {
  pure: !1
},
      dt = {
  __proto__: null,
  [lt]: ut
},
      pt = {
  __proto__: null,
  [lt]: ct
},
      ft = {
  __proto__: null,
  [lt]: ut,
  prototype: dt
},
      mt = {
  __proto__: null,
  [lt]: ct,
  prototype: dt
},
      gt = {
  __proto__: null,
  [lt]: ct,
  from: pt,
  of: pt,
  prototype: dt
},
      yt = {
  __proto__: null,
  [lt]: ct,
  supportedLocalesOf: mt
},
      Et = {
  global: dt,
  globalThis: dt,
  self: dt,
  window: dt,
  __proto__: null,
  [lt]: ut,
  Array: {
    __proto__: null,
    [lt]: ut,
    from: dt,
    isArray: pt,
    of: pt,
    prototype: dt
  },
  ArrayBuffer: {
    __proto__: null,
    [lt]: ct,
    isView: pt,
    prototype: dt
  },
  Atomics: dt,
  BigInt: ft,
  BigInt64Array: ft,
  BigUint64Array: ft,
  Boolean: mt,
  constructor: ft,
  DataView: mt,
  Date: {
    __proto__: null,
    [lt]: ct,
    now: pt,
    parse: pt,
    prototype: dt,
    UTC: pt
  },
  decodeURI: pt,
  decodeURIComponent: pt,
  encodeURI: pt,
  encodeURIComponent: pt,
  Error: mt,
  escape: pt,
  eval: dt,
  EvalError: mt,
  Float32Array: gt,
  Float64Array: gt,
  Function: ft,
  hasOwnProperty: dt,
  Infinity: dt,
  Int16Array: gt,
  Int32Array: gt,
  Int8Array: gt,
  isFinite: pt,
  isNaN: pt,
  isPrototypeOf: dt,
  JSON: dt,
  Map: mt,
  Math: {
    __proto__: null,
    [lt]: ut,
    abs: pt,
    acos: pt,
    acosh: pt,
    asin: pt,
    asinh: pt,
    atan: pt,
    atan2: pt,
    atanh: pt,
    cbrt: pt,
    ceil: pt,
    clz32: pt,
    cos: pt,
    cosh: pt,
    exp: pt,
    expm1: pt,
    floor: pt,
    fround: pt,
    hypot: pt,
    imul: pt,
    log: pt,
    log10: pt,
    log1p: pt,
    log2: pt,
    max: pt,
    min: pt,
    pow: pt,
    random: pt,
    round: pt,
    sign: pt,
    sin: pt,
    sinh: pt,
    sqrt: pt,
    tan: pt,
    tanh: pt,
    trunc: pt
  },
  NaN: dt,
  Number: {
    __proto__: null,
    [lt]: ct,
    isFinite: pt,
    isInteger: pt,
    isNaN: pt,
    isSafeInteger: pt,
    parseFloat: pt,
    parseInt: pt,
    prototype: dt
  },
  Object: {
    __proto__: null,
    [lt]: ct,
    create: pt,
    getNotifier: pt,
    getOwn: pt,
    getOwnPropertyDescriptor: pt,
    getOwnPropertyNames: pt,
    getOwnPropertySymbols: pt,
    getPrototypeOf: pt,
    is: pt,
    isExtensible: pt,
    isFrozen: pt,
    isSealed: pt,
    keys: pt,
    prototype: dt
  },
  parseFloat: pt,
  parseInt: pt,
  Promise: {
    __proto__: null,
    [lt]: ut,
    all: dt,
    prototype: dt,
    race: dt,
    reject: dt,
    resolve: dt
  },
  propertyIsEnumerable: dt,
  Proxy: dt,
  RangeError: mt,
  ReferenceError: mt,
  Reflect: dt,
  RegExp: mt,
  Set: mt,
  SharedArrayBuffer: ft,
  String: {
    __proto__: null,
    [lt]: ct,
    fromCharCode: pt,
    fromCodePoint: pt,
    prototype: dt,
    raw: pt
  },
  Symbol: {
    __proto__: null,
    [lt]: ct,
    for: pt,
    keyFor: pt,
    prototype: dt
  },
  SyntaxError: mt,
  toLocaleString: dt,
  toString: dt,
  TypeError: mt,
  Uint16Array: gt,
  Uint32Array: gt,
  Uint8Array: gt,
  Uint8ClampedArray: gt,
  unescape: pt,
  URIError: mt,
  valueOf: dt,
  WeakMap: mt,
  WeakSet: mt,
  clearInterval: ft,
  clearTimeout: ft,
  console: dt,
  Intl: {
    __proto__: null,
    [lt]: ut,
    Collator: yt,
    DateTimeFormat: yt,
    ListFormat: yt,
    NumberFormat: yt,
    PluralRules: yt,
    RelativeTimeFormat: yt
  },
  setInterval: ft,
  setTimeout: ft,
  TextDecoder: ft,
  TextEncoder: ft,
  URL: ft,
  URLSearchParams: ft,
  AbortController: ft,
  AbortSignal: ft,
  addEventListener: dt,
  alert: dt,
  AnalyserNode: ft,
  Animation: ft,
  AnimationEvent: ft,
  applicationCache: dt,
  ApplicationCache: ft,
  ApplicationCacheErrorEvent: ft,
  atob: dt,
  Attr: ft,
  Audio: ft,
  AudioBuffer: ft,
  AudioBufferSourceNode: ft,
  AudioContext: ft,
  AudioDestinationNode: ft,
  AudioListener: ft,
  AudioNode: ft,
  AudioParam: ft,
  AudioProcessingEvent: ft,
  AudioScheduledSourceNode: ft,
  AudioWorkletNode: ft,
  BarProp: ft,
  BaseAudioContext: ft,
  BatteryManager: ft,
  BeforeUnloadEvent: ft,
  BiquadFilterNode: ft,
  Blob: ft,
  BlobEvent: ft,
  blur: dt,
  BroadcastChannel: ft,
  btoa: dt,
  ByteLengthQueuingStrategy: ft,
  Cache: ft,
  caches: dt,
  CacheStorage: ft,
  cancelAnimationFrame: dt,
  cancelIdleCallback: dt,
  CanvasCaptureMediaStreamTrack: ft,
  CanvasGradient: ft,
  CanvasPattern: ft,
  CanvasRenderingContext2D: ft,
  ChannelMergerNode: ft,
  ChannelSplitterNode: ft,
  CharacterData: ft,
  clientInformation: dt,
  ClipboardEvent: ft,
  close: dt,
  closed: dt,
  CloseEvent: ft,
  Comment: ft,
  CompositionEvent: ft,
  confirm: dt,
  ConstantSourceNode: ft,
  ConvolverNode: ft,
  CountQueuingStrategy: ft,
  createImageBitmap: dt,
  Credential: ft,
  CredentialsContainer: ft,
  crypto: dt,
  Crypto: ft,
  CryptoKey: ft,
  CSS: ft,
  CSSConditionRule: ft,
  CSSFontFaceRule: ft,
  CSSGroupingRule: ft,
  CSSImportRule: ft,
  CSSKeyframeRule: ft,
  CSSKeyframesRule: ft,
  CSSMediaRule: ft,
  CSSNamespaceRule: ft,
  CSSPageRule: ft,
  CSSRule: ft,
  CSSRuleList: ft,
  CSSStyleDeclaration: ft,
  CSSStyleRule: ft,
  CSSStyleSheet: ft,
  CSSSupportsRule: ft,
  CustomElementRegistry: ft,
  customElements: dt,
  CustomEvent: ft,
  DataTransfer: ft,
  DataTransferItem: ft,
  DataTransferItemList: ft,
  defaultstatus: dt,
  defaultStatus: dt,
  DelayNode: ft,
  DeviceMotionEvent: ft,
  DeviceOrientationEvent: ft,
  devicePixelRatio: dt,
  dispatchEvent: dt,
  document: dt,
  Document: ft,
  DocumentFragment: ft,
  DocumentType: ft,
  DOMError: ft,
  DOMException: ft,
  DOMImplementation: ft,
  DOMMatrix: ft,
  DOMMatrixReadOnly: ft,
  DOMParser: ft,
  DOMPoint: ft,
  DOMPointReadOnly: ft,
  DOMQuad: ft,
  DOMRect: ft,
  DOMRectReadOnly: ft,
  DOMStringList: ft,
  DOMStringMap: ft,
  DOMTokenList: ft,
  DragEvent: ft,
  DynamicsCompressorNode: ft,
  Element: ft,
  ErrorEvent: ft,
  Event: ft,
  EventSource: ft,
  EventTarget: ft,
  external: dt,
  fetch: dt,
  File: ft,
  FileList: ft,
  FileReader: ft,
  find: dt,
  focus: dt,
  FocusEvent: ft,
  FontFace: ft,
  FontFaceSetLoadEvent: ft,
  FormData: ft,
  frames: dt,
  GainNode: ft,
  Gamepad: ft,
  GamepadButton: ft,
  GamepadEvent: ft,
  getComputedStyle: dt,
  getSelection: dt,
  HashChangeEvent: ft,
  Headers: ft,
  history: dt,
  History: ft,
  HTMLAllCollection: ft,
  HTMLAnchorElement: ft,
  HTMLAreaElement: ft,
  HTMLAudioElement: ft,
  HTMLBaseElement: ft,
  HTMLBodyElement: ft,
  HTMLBRElement: ft,
  HTMLButtonElement: ft,
  HTMLCanvasElement: ft,
  HTMLCollection: ft,
  HTMLContentElement: ft,
  HTMLDataElement: ft,
  HTMLDataListElement: ft,
  HTMLDetailsElement: ft,
  HTMLDialogElement: ft,
  HTMLDirectoryElement: ft,
  HTMLDivElement: ft,
  HTMLDListElement: ft,
  HTMLDocument: ft,
  HTMLElement: ft,
  HTMLEmbedElement: ft,
  HTMLFieldSetElement: ft,
  HTMLFontElement: ft,
  HTMLFormControlsCollection: ft,
  HTMLFormElement: ft,
  HTMLFrameElement: ft,
  HTMLFrameSetElement: ft,
  HTMLHeadElement: ft,
  HTMLHeadingElement: ft,
  HTMLHRElement: ft,
  HTMLHtmlElement: ft,
  HTMLIFrameElement: ft,
  HTMLImageElement: ft,
  HTMLInputElement: ft,
  HTMLLabelElement: ft,
  HTMLLegendElement: ft,
  HTMLLIElement: ft,
  HTMLLinkElement: ft,
  HTMLMapElement: ft,
  HTMLMarqueeElement: ft,
  HTMLMediaElement: ft,
  HTMLMenuElement: ft,
  HTMLMetaElement: ft,
  HTMLMeterElement: ft,
  HTMLModElement: ft,
  HTMLObjectElement: ft,
  HTMLOListElement: ft,
  HTMLOptGroupElement: ft,
  HTMLOptionElement: ft,
  HTMLOptionsCollection: ft,
  HTMLOutputElement: ft,
  HTMLParagraphElement: ft,
  HTMLParamElement: ft,
  HTMLPictureElement: ft,
  HTMLPreElement: ft,
  HTMLProgressElement: ft,
  HTMLQuoteElement: ft,
  HTMLScriptElement: ft,
  HTMLSelectElement: ft,
  HTMLShadowElement: ft,
  HTMLSlotElement: ft,
  HTMLSourceElement: ft,
  HTMLSpanElement: ft,
  HTMLStyleElement: ft,
  HTMLTableCaptionElement: ft,
  HTMLTableCellElement: ft,
  HTMLTableColElement: ft,
  HTMLTableElement: ft,
  HTMLTableRowElement: ft,
  HTMLTableSectionElement: ft,
  HTMLTemplateElement: ft,
  HTMLTextAreaElement: ft,
  HTMLTimeElement: ft,
  HTMLTitleElement: ft,
  HTMLTrackElement: ft,
  HTMLUListElement: ft,
  HTMLUnknownElement: ft,
  HTMLVideoElement: ft,
  IDBCursor: ft,
  IDBCursorWithValue: ft,
  IDBDatabase: ft,
  IDBFactory: ft,
  IDBIndex: ft,
  IDBKeyRange: ft,
  IDBObjectStore: ft,
  IDBOpenDBRequest: ft,
  IDBRequest: ft,
  IDBTransaction: ft,
  IDBVersionChangeEvent: ft,
  IdleDeadline: ft,
  IIRFilterNode: ft,
  Image: ft,
  ImageBitmap: ft,
  ImageBitmapRenderingContext: ft,
  ImageCapture: ft,
  ImageData: ft,
  indexedDB: dt,
  innerHeight: dt,
  innerWidth: dt,
  InputEvent: ft,
  IntersectionObserver: ft,
  IntersectionObserverEntry: ft,
  isSecureContext: dt,
  KeyboardEvent: ft,
  KeyframeEffect: ft,
  length: dt,
  localStorage: dt,
  location: dt,
  Location: ft,
  locationbar: dt,
  matchMedia: dt,
  MediaDeviceInfo: ft,
  MediaDevices: ft,
  MediaElementAudioSourceNode: ft,
  MediaEncryptedEvent: ft,
  MediaError: ft,
  MediaKeyMessageEvent: ft,
  MediaKeySession: ft,
  MediaKeyStatusMap: ft,
  MediaKeySystemAccess: ft,
  MediaList: ft,
  MediaQueryList: ft,
  MediaQueryListEvent: ft,
  MediaRecorder: ft,
  MediaSettingsRange: ft,
  MediaSource: ft,
  MediaStream: ft,
  MediaStreamAudioDestinationNode: ft,
  MediaStreamAudioSourceNode: ft,
  MediaStreamEvent: ft,
  MediaStreamTrack: ft,
  MediaStreamTrackEvent: ft,
  menubar: dt,
  MessageChannel: ft,
  MessageEvent: ft,
  MessagePort: ft,
  MIDIAccess: ft,
  MIDIConnectionEvent: ft,
  MIDIInput: ft,
  MIDIInputMap: ft,
  MIDIMessageEvent: ft,
  MIDIOutput: ft,
  MIDIOutputMap: ft,
  MIDIPort: ft,
  MimeType: ft,
  MimeTypeArray: ft,
  MouseEvent: ft,
  moveBy: dt,
  moveTo: dt,
  MutationEvent: ft,
  MutationObserver: ft,
  MutationRecord: ft,
  name: dt,
  NamedNodeMap: ft,
  NavigationPreloadManager: ft,
  navigator: dt,
  Navigator: ft,
  NetworkInformation: ft,
  Node: ft,
  NodeFilter: dt,
  NodeIterator: ft,
  NodeList: ft,
  Notification: ft,
  OfflineAudioCompletionEvent: ft,
  OfflineAudioContext: ft,
  offscreenBuffering: dt,
  OffscreenCanvas: ft,
  open: dt,
  openDatabase: dt,
  Option: ft,
  origin: dt,
  OscillatorNode: ft,
  outerHeight: dt,
  outerWidth: dt,
  PageTransitionEvent: ft,
  pageXOffset: dt,
  pageYOffset: dt,
  PannerNode: ft,
  parent: dt,
  Path2D: ft,
  PaymentAddress: ft,
  PaymentRequest: ft,
  PaymentRequestUpdateEvent: ft,
  PaymentResponse: ft,
  performance: dt,
  Performance: ft,
  PerformanceEntry: ft,
  PerformanceLongTaskTiming: ft,
  PerformanceMark: ft,
  PerformanceMeasure: ft,
  PerformanceNavigation: ft,
  PerformanceNavigationTiming: ft,
  PerformanceObserver: ft,
  PerformanceObserverEntryList: ft,
  PerformancePaintTiming: ft,
  PerformanceResourceTiming: ft,
  PerformanceTiming: ft,
  PeriodicWave: ft,
  Permissions: ft,
  PermissionStatus: ft,
  personalbar: dt,
  PhotoCapabilities: ft,
  Plugin: ft,
  PluginArray: ft,
  PointerEvent: ft,
  PopStateEvent: ft,
  postMessage: dt,
  Presentation: ft,
  PresentationAvailability: ft,
  PresentationConnection: ft,
  PresentationConnectionAvailableEvent: ft,
  PresentationConnectionCloseEvent: ft,
  PresentationConnectionList: ft,
  PresentationReceiver: ft,
  PresentationRequest: ft,
  print: dt,
  ProcessingInstruction: ft,
  ProgressEvent: ft,
  PromiseRejectionEvent: ft,
  prompt: dt,
  PushManager: ft,
  PushSubscription: ft,
  PushSubscriptionOptions: ft,
  queueMicrotask: dt,
  RadioNodeList: ft,
  Range: ft,
  ReadableStream: ft,
  RemotePlayback: ft,
  removeEventListener: dt,
  Request: ft,
  requestAnimationFrame: dt,
  requestIdleCallback: dt,
  resizeBy: dt,
  ResizeObserver: ft,
  ResizeObserverEntry: ft,
  resizeTo: dt,
  Response: ft,
  RTCCertificate: ft,
  RTCDataChannel: ft,
  RTCDataChannelEvent: ft,
  RTCDtlsTransport: ft,
  RTCIceCandidate: ft,
  RTCIceTransport: ft,
  RTCPeerConnection: ft,
  RTCPeerConnectionIceEvent: ft,
  RTCRtpReceiver: ft,
  RTCRtpSender: ft,
  RTCSctpTransport: ft,
  RTCSessionDescription: ft,
  RTCStatsReport: ft,
  RTCTrackEvent: ft,
  screen: dt,
  Screen: ft,
  screenLeft: dt,
  ScreenOrientation: ft,
  screenTop: dt,
  screenX: dt,
  screenY: dt,
  ScriptProcessorNode: ft,
  scroll: dt,
  scrollbars: dt,
  scrollBy: dt,
  scrollTo: dt,
  scrollX: dt,
  scrollY: dt,
  SecurityPolicyViolationEvent: ft,
  Selection: ft,
  ServiceWorker: ft,
  ServiceWorkerContainer: ft,
  ServiceWorkerRegistration: ft,
  sessionStorage: dt,
  ShadowRoot: ft,
  SharedWorker: ft,
  SourceBuffer: ft,
  SourceBufferList: ft,
  speechSynthesis: dt,
  SpeechSynthesisEvent: ft,
  SpeechSynthesisUtterance: ft,
  StaticRange: ft,
  status: dt,
  statusbar: dt,
  StereoPannerNode: ft,
  stop: dt,
  Storage: ft,
  StorageEvent: ft,
  StorageManager: ft,
  styleMedia: dt,
  StyleSheet: ft,
  StyleSheetList: ft,
  SubtleCrypto: ft,
  SVGAElement: ft,
  SVGAngle: ft,
  SVGAnimatedAngle: ft,
  SVGAnimatedBoolean: ft,
  SVGAnimatedEnumeration: ft,
  SVGAnimatedInteger: ft,
  SVGAnimatedLength: ft,
  SVGAnimatedLengthList: ft,
  SVGAnimatedNumber: ft,
  SVGAnimatedNumberList: ft,
  SVGAnimatedPreserveAspectRatio: ft,
  SVGAnimatedRect: ft,
  SVGAnimatedString: ft,
  SVGAnimatedTransformList: ft,
  SVGAnimateElement: ft,
  SVGAnimateMotionElement: ft,
  SVGAnimateTransformElement: ft,
  SVGAnimationElement: ft,
  SVGCircleElement: ft,
  SVGClipPathElement: ft,
  SVGComponentTransferFunctionElement: ft,
  SVGDefsElement: ft,
  SVGDescElement: ft,
  SVGDiscardElement: ft,
  SVGElement: ft,
  SVGEllipseElement: ft,
  SVGFEBlendElement: ft,
  SVGFEColorMatrixElement: ft,
  SVGFEComponentTransferElement: ft,
  SVGFECompositeElement: ft,
  SVGFEConvolveMatrixElement: ft,
  SVGFEDiffuseLightingElement: ft,
  SVGFEDisplacementMapElement: ft,
  SVGFEDistantLightElement: ft,
  SVGFEDropShadowElement: ft,
  SVGFEFloodElement: ft,
  SVGFEFuncAElement: ft,
  SVGFEFuncBElement: ft,
  SVGFEFuncGElement: ft,
  SVGFEFuncRElement: ft,
  SVGFEGaussianBlurElement: ft,
  SVGFEImageElement: ft,
  SVGFEMergeElement: ft,
  SVGFEMergeNodeElement: ft,
  SVGFEMorphologyElement: ft,
  SVGFEOffsetElement: ft,
  SVGFEPointLightElement: ft,
  SVGFESpecularLightingElement: ft,
  SVGFESpotLightElement: ft,
  SVGFETileElement: ft,
  SVGFETurbulenceElement: ft,
  SVGFilterElement: ft,
  SVGForeignObjectElement: ft,
  SVGGElement: ft,
  SVGGeometryElement: ft,
  SVGGradientElement: ft,
  SVGGraphicsElement: ft,
  SVGImageElement: ft,
  SVGLength: ft,
  SVGLengthList: ft,
  SVGLinearGradientElement: ft,
  SVGLineElement: ft,
  SVGMarkerElement: ft,
  SVGMaskElement: ft,
  SVGMatrix: ft,
  SVGMetadataElement: ft,
  SVGMPathElement: ft,
  SVGNumber: ft,
  SVGNumberList: ft,
  SVGPathElement: ft,
  SVGPatternElement: ft,
  SVGPoint: ft,
  SVGPointList: ft,
  SVGPolygonElement: ft,
  SVGPolylineElement: ft,
  SVGPreserveAspectRatio: ft,
  SVGRadialGradientElement: ft,
  SVGRect: ft,
  SVGRectElement: ft,
  SVGScriptElement: ft,
  SVGSetElement: ft,
  SVGStopElement: ft,
  SVGStringList: ft,
  SVGStyleElement: ft,
  SVGSVGElement: ft,
  SVGSwitchElement: ft,
  SVGSymbolElement: ft,
  SVGTextContentElement: ft,
  SVGTextElement: ft,
  SVGTextPathElement: ft,
  SVGTextPositioningElement: ft,
  SVGTitleElement: ft,
  SVGTransform: ft,
  SVGTransformList: ft,
  SVGTSpanElement: ft,
  SVGUnitTypes: ft,
  SVGUseElement: ft,
  SVGViewElement: ft,
  TaskAttributionTiming: ft,
  Text: ft,
  TextEvent: ft,
  TextMetrics: ft,
  TextTrack: ft,
  TextTrackCue: ft,
  TextTrackCueList: ft,
  TextTrackList: ft,
  TimeRanges: ft,
  toolbar: dt,
  top: dt,
  Touch: ft,
  TouchEvent: ft,
  TouchList: ft,
  TrackEvent: ft,
  TransitionEvent: ft,
  TreeWalker: ft,
  UIEvent: ft,
  ValidityState: ft,
  visualViewport: dt,
  VisualViewport: ft,
  VTTCue: ft,
  WaveShaperNode: ft,
  WebAssembly: dt,
  WebGL2RenderingContext: ft,
  WebGLActiveInfo: ft,
  WebGLBuffer: ft,
  WebGLContextEvent: ft,
  WebGLFramebuffer: ft,
  WebGLProgram: ft,
  WebGLQuery: ft,
  WebGLRenderbuffer: ft,
  WebGLRenderingContext: ft,
  WebGLSampler: ft,
  WebGLShader: ft,
  WebGLShaderPrecisionFormat: ft,
  WebGLSync: ft,
  WebGLTexture: ft,
  WebGLTransformFeedback: ft,
  WebGLUniformLocation: ft,
  WebGLVertexArrayObject: ft,
  WebSocket: ft,
  WheelEvent: ft,
  Window: ft,
  Worker: ft,
  WritableStream: ft,
  XMLDocument: ft,
  XMLHttpRequest: ft,
  XMLHttpRequestEventTarget: ft,
  XMLHttpRequestUpload: ft,
  XMLSerializer: ft,
  XPathEvaluator: ft,
  XPathExpression: ft,
  XPathResult: ft,
  XSLTProcessor: ft
};

for (const e of ["window", "global", "self", "globalThis"]) Et[e] = Et;

function xt(e) {
  let t = Et;

  for (const s of e) {
    if ("string" != typeof s) return null;
    if (t = t[s], !t) return null;
  }

  return t[lt];
}

class vt extends H {
  constructor() {
    super(...arguments), this.isReassigned = !0;
  }

  hasEffectsWhenAccessedAtPath(e) {
    return !function (e) {
      return 1 === e.length ? "undefined" === e[0] || null !== xt(e) : null !== xt(e.slice(0, -1));
    }([this.name, ...e]);
  }

  hasEffectsWhenCalledAtPath(e) {
    return !function (e) {
      const t = xt(e);
      return null !== t && t.pure;
    }([this.name, ...e]);
  }

}

const bt = {
  __proto__: null,
  class: !0,
  const: !0,
  let: !0,
  var: !0
};

class St extends Ce {
  constructor() {
    super(...arguments), this.variable = null, this.deoptimized = !1, this.isTDZAccess = null;
  }

  addExportedVariables(e, t) {
    null !== this.variable && t.has(this.variable) && e.push(this.variable);
  }

  bind() {
    null === this.variable && ht(this, this.parent) && (this.variable = this.scope.findVariable(this.name), this.variable.addReference(this));
  }

  declare(e, t) {
    let s;
    const {
      treeshake: i
    } = this.context.options;

    switch (e) {
      case "var":
        s = this.scope.addDeclaration(this, this.context, t, !0), i && i.correctVarValueBeforeDeclaration && s.markInitializersForDeoptimization();
        break;

      case "function":
        s = this.scope.addDeclaration(this, this.context, t, !1);
        break;

      case "let":
      case "const":
      case "class":
        s = this.scope.addDeclaration(this, this.context, t, !1);
        break;

      case "parameter":
        s = this.scope.addParameterDeclaration(this);
        break;

      default:
        throw new Error(`Internal Error: Unexpected identifier kind ${e}.`);
    }

    return s.kind = e, [this.variable = s];
  }

  deoptimizePath(e) {
    0 !== e.length || this.scope.contains(this.name) || this.disallowImportReassignment(), this.variable.deoptimizePath(e);
  }

  deoptimizeThisOnEventAtPath(e, t, s, i) {
    this.variable.deoptimizeThisOnEventAtPath(e, t, s, i);
  }

  getLiteralValueAtPath(e, t, s) {
    return this.getVariableRespectingTDZ().getLiteralValueAtPath(e, t, s);
  }

  getReturnExpressionWhenCalledAtPath(e, t, s, i) {
    return this.getVariableRespectingTDZ().getReturnExpressionWhenCalledAtPath(e, t, s, i);
  }

  hasEffects() {
    return this.deoptimized || this.applyDeoptimizations(), !(!this.isPossibleTDZ() || "var" === this.variable.kind) || this.context.options.treeshake.unknownGlobalSideEffects && this.variable instanceof vt && this.variable.hasEffectsWhenAccessedAtPath(L);
  }

  hasEffectsWhenAccessedAtPath(e, t) {
    return null !== this.variable && this.getVariableRespectingTDZ().hasEffectsWhenAccessedAtPath(e, t);
  }

  hasEffectsWhenAssignedAtPath(e, t) {
    return !this.variable || (e.length > 0 ? this.getVariableRespectingTDZ() : this.variable).hasEffectsWhenAssignedAtPath(e, t);
  }

  hasEffectsWhenCalledAtPath(e, t, s) {
    return !this.variable || this.getVariableRespectingTDZ().hasEffectsWhenCalledAtPath(e, t, s);
  }

  include() {
    this.deoptimized || this.applyDeoptimizations(), this.included || (this.included = !0, null !== this.variable && this.context.includeVariableInModule(this.variable));
  }

  includeCallArguments(e, t) {
    this.getVariableRespectingTDZ().includeCallArguments(e, t);
  }

  isPossibleTDZ() {
    if (null !== this.isTDZAccess) return this.isTDZAccess;
    if (!(this.variable instanceof rt && this.variable.kind && this.variable.kind in bt)) return this.isTDZAccess = !1;
    let e;
    return this.variable.declarations && 1 === this.variable.declarations.length && (e = this.variable.declarations[0]) && this.start < e.start && At(this) === At(e) ? this.isTDZAccess = !0 : this.variable.initReached ? this.isTDZAccess = !1 : this.isTDZAccess = !0;
  }

  markDeclarationReached() {
    this.variable.initReached = !0;
  }

  render(e, t, {
    renderedParentType: s,
    isCalleeOfRenderedParent: i,
    isShorthandProperty: n
  } = K) {
    if (this.variable) {
      const t = this.variable.getName();
      t !== this.name && (e.overwrite(this.start, this.end, t, {
        contentOnly: !0,
        storeName: !0
      }), n && e.prependRight(this.start, `${this.name}: `)), "eval" === t && "CallExpression" === s && i && e.appendRight(this.start, "0, ");
    }
  }

  applyDeoptimizations() {
    this.deoptimized = !0, null !== this.variable && this.variable instanceof rt && (this.variable.consolidateInitializers(), this.context.requestTreeshakingPass());
  }

  disallowImportReassignment() {
    return this.context.error({
      code: "ILLEGAL_REASSIGNMENT",
      message: `Illegal reassignment to import '${this.name}'`
    }, this.start);
  }

  getVariableRespectingTDZ() {
    return this.isPossibleTDZ() ? G : this.variable;
  }

}

function At(e) {
  for (; e && !/^Program|Function/.test(e.type);) e = e.parent;

  return e;
}

class Pt extends Ce {
  constructor() {
    super(...arguments), this.accessedValue = null, this.accessorCallOptions = {
      args: je,
      thisParam: null,
      withNew: !1
    };
  }

  deoptimizeCache() {}

  deoptimizePath(e) {
    this.getAccessedValue().deoptimizePath(e);
  }

  deoptimizeThisOnEventAtPath(e, t, s, i) {
    return 0 === e && "get" === this.kind && 0 === t.length || 1 === e && "set" === this.kind && 0 === t.length ? this.value.deoptimizeThisOnEventAtPath(2, L, s, i) : void this.getAccessedValue().deoptimizeThisOnEventAtPath(e, t, s, i);
  }

  getLiteralValueAtPath(e, t, s) {
    return this.getAccessedValue().getLiteralValueAtPath(e, t, s);
  }

  getReturnExpressionWhenCalledAtPath(e, t, s, i) {
    return this.getAccessedValue().getReturnExpressionWhenCalledAtPath(e, t, s, i);
  }

  hasEffects(e) {
    return this.key.hasEffects(e);
  }

  hasEffectsWhenAccessedAtPath(e, t) {
    return "get" === this.kind && 0 === e.length ? this.value.hasEffectsWhenCalledAtPath(L, this.accessorCallOptions, t) : this.getAccessedValue().hasEffectsWhenAccessedAtPath(e, t);
  }

  hasEffectsWhenAssignedAtPath(e, t) {
    return "set" === this.kind ? this.value.hasEffectsWhenCalledAtPath(L, this.accessorCallOptions, t) : this.getAccessedValue().hasEffectsWhenAssignedAtPath(e, t);
  }

  hasEffectsWhenCalledAtPath(e, t, s) {
    return this.getAccessedValue().hasEffectsWhenCalledAtPath(e, t, s);
  }

  getAccessedValue() {
    return null === this.accessedValue ? "get" === this.kind ? (this.accessedValue = G, this.accessedValue = this.value.getReturnExpressionWhenCalledAtPath(L, this.accessorCallOptions, z, this)) : this.accessedValue = this.value : this.accessedValue;
  }

}

class kt extends Pt {}

const Ct = /^\d+$/;

class wt extends U {
  constructor(e, t, s = !1) {
    if (super(), this.prototypeExpression = t, this.immutable = s, this.allProperties = [], this.deoptimizedPaths = Object.create(null), this.expressionsToBeDeoptimizedByKey = Object.create(null), this.gettersByKey = Object.create(null), this.hasUnknownDeoptimizedInteger = !1, this.hasUnknownDeoptimizedProperty = !1, this.propertiesAndGettersByKey = Object.create(null), this.propertiesAndSettersByKey = Object.create(null), this.settersByKey = Object.create(null), this.thisParametersToBeDeoptimized = new Set(), this.unknownIntegerProps = [], this.unmatchableGetters = [], this.unmatchablePropertiesAndGetters = [], this.unmatchableSetters = [], Array.isArray(e)) this.buildPropertyMaps(e);else {
      this.propertiesAndGettersByKey = this.propertiesAndSettersByKey = e;

      for (const t of Object.values(e)) this.allProperties.push(...t);
    }
  }

  deoptimizeAllProperties() {
    var e;

    if (!this.hasUnknownDeoptimizedProperty) {
      this.hasUnknownDeoptimizedProperty = !0;

      for (const e of Object.values(this.propertiesAndGettersByKey).concat(Object.values(this.settersByKey))) for (const t of e) t.deoptimizePath(D);

      null === (e = this.prototypeExpression) || void 0 === e || e.deoptimizePath([M, M]), this.deoptimizeCachedEntities();
    }
  }

  deoptimizeIntegerProperties() {
    if (!this.hasUnknownDeoptimizedProperty && !this.hasUnknownDeoptimizedInteger) {
      this.hasUnknownDeoptimizedInteger = !0;

      for (const [e, t] of Object.entries(this.propertiesAndGettersByKey)) if (Ct.test(e)) for (const e of t) e.deoptimizePath(D);

      this.deoptimizeCachedIntegerEntities();
    }
  }

  deoptimizePath(e) {
    var t;
    if (this.hasUnknownDeoptimizedProperty || this.immutable) return;
    const s = e[0];

    if (1 === e.length) {
      if ("string" != typeof s) return s === O ? this.deoptimizeIntegerProperties() : this.deoptimizeAllProperties();

      if (!this.deoptimizedPaths[s]) {
        this.deoptimizedPaths[s] = !0;
        const e = this.expressionsToBeDeoptimizedByKey[s];
        if (e) for (const t of e) t.deoptimizeCache();
      }
    }

    const i = 1 === e.length ? D : e.slice(1);

    for (const e of "string" == typeof s ? (this.propertiesAndGettersByKey[s] || this.unmatchablePropertiesAndGetters).concat(this.settersByKey[s] || this.unmatchableSetters) : this.allProperties) e.deoptimizePath(i);

    null === (t = this.prototypeExpression) || void 0 === t || t.deoptimizePath(1 === e.length ? [M, M] : e);
  }

  deoptimizeThisOnEventAtPath(e, t, s, i) {
    var n;
    const [r, ...a] = t;
    if (this.hasUnknownDeoptimizedProperty || (2 === e || t.length > 1) && "string" == typeof r && this.deoptimizedPaths[r]) return void s.deoptimizePath(D);
    const [o, h, l] = 2 === e || t.length > 1 ? [this.propertiesAndGettersByKey, this.propertiesAndGettersByKey, this.unmatchablePropertiesAndGetters] : 0 === e ? [this.propertiesAndGettersByKey, this.gettersByKey, this.unmatchableGetters] : [this.propertiesAndSettersByKey, this.settersByKey, this.unmatchableSetters];

    if ("string" == typeof r) {
      if (o[r]) {
        const t = h[r];
        if (t) for (const n of t) n.deoptimizeThisOnEventAtPath(e, a, s, i);
        return void (this.immutable || this.thisParametersToBeDeoptimized.add(s));
      }

      for (const t of l) t.deoptimizeThisOnEventAtPath(e, a, s, i);

      if (Ct.test(r)) for (const t of this.unknownIntegerProps) t.deoptimizeThisOnEventAtPath(e, a, s, i);
    } else {
      for (const t of Object.values(h).concat([l])) for (const n of t) n.deoptimizeThisOnEventAtPath(e, a, s, i);

      for (const t of this.unknownIntegerProps) t.deoptimizeThisOnEventAtPath(e, a, s, i);
    }

    this.immutable || this.thisParametersToBeDeoptimized.add(s), null === (n = this.prototypeExpression) || void 0 === n || n.deoptimizeThisOnEventAtPath(e, t, s, i);
  }

  getLiteralValueAtPath(e, t, s) {
    if (0 === e.length) return j;
    const i = e[0],
          n = this.getMemberExpressionAndTrackDeopt(i, s);
    return n ? n.getLiteralValueAtPath(e.slice(1), t, s) : this.prototypeExpression ? this.prototypeExpression.getLiteralValueAtPath(e, t, s) : 1 !== e.length ? j : void 0;
  }

  getReturnExpressionWhenCalledAtPath(e, t, s, i) {
    if (0 === e.length) return G;
    const n = e[0],
          r = this.getMemberExpressionAndTrackDeopt(n, i);
    return r ? r.getReturnExpressionWhenCalledAtPath(e.slice(1), t, s, i) : this.prototypeExpression ? this.prototypeExpression.getReturnExpressionWhenCalledAtPath(e, t, s, i) : G;
  }

  hasEffectsWhenAccessedAtPath(e, t) {
    const [s, ...i] = e;

    if (e.length > 1) {
      if ("string" != typeof s) return !0;
      const n = this.getMemberExpression(s);
      return n ? n.hasEffectsWhenAccessedAtPath(i, t) : !this.prototypeExpression || this.prototypeExpression.hasEffectsWhenAccessedAtPath(e, t);
    }

    if (this.hasUnknownDeoptimizedProperty) return !0;

    if ("string" == typeof s) {
      if (this.propertiesAndGettersByKey[s]) {
        const e = this.gettersByKey[s];
        if (e) for (const s of e) if (s.hasEffectsWhenAccessedAtPath(i, t)) return !0;
        return !1;
      }

      for (const e of this.unmatchableGetters) if (e.hasEffectsWhenAccessedAtPath(i, t)) return !0;
    } else for (const e of Object.values(this.gettersByKey).concat([this.unmatchableGetters])) for (const s of e) if (s.hasEffectsWhenAccessedAtPath(i, t)) return !0;

    return !!this.prototypeExpression && this.prototypeExpression.hasEffectsWhenAccessedAtPath(e, t);
  }

  hasEffectsWhenAssignedAtPath(e, t) {
    const [s, ...i] = e;

    if (e.length > 1) {
      if ("string" != typeof s) return !0;
      const n = this.getMemberExpression(s);
      return n ? n.hasEffectsWhenAssignedAtPath(i, t) : !this.prototypeExpression || this.prototypeExpression.hasEffectsWhenAssignedAtPath(e, t);
    }

    if (this.hasUnknownDeoptimizedProperty) return !0;

    if ("string" == typeof s) {
      if (this.propertiesAndSettersByKey[s]) {
        const e = this.settersByKey[s];
        if (e) for (const s of e) if (s.hasEffectsWhenAssignedAtPath(i, t)) return !0;
        return !1;
      }

      for (const e of this.unmatchableSetters) if (e.hasEffectsWhenAssignedAtPath(i, t)) return !0;
    }

    return !!this.prototypeExpression && this.prototypeExpression.hasEffectsWhenAssignedAtPath(e, t);
  }

  hasEffectsWhenCalledAtPath(e, t, s) {
    const i = e[0],
          n = this.getMemberExpression(i);
    return n ? n.hasEffectsWhenCalledAtPath(e.slice(1), t, s) : !this.prototypeExpression || this.prototypeExpression.hasEffectsWhenCalledAtPath(e, t, s);
  }

  buildPropertyMaps(e) {
    const {
      allProperties: t,
      propertiesAndGettersByKey: s,
      propertiesAndSettersByKey: i,
      settersByKey: n,
      gettersByKey: r,
      unknownIntegerProps: a,
      unmatchablePropertiesAndGetters: o,
      unmatchableGetters: h,
      unmatchableSetters: l
    } = this,
          c = [];

    for (let u = e.length - 1; u >= 0; u--) {
      const {
        key: d,
        kind: p,
        property: f
      } = e[u];

      if (t.push(f), "string" != typeof d) {
        if (d === O) {
          a.push(f);
          continue;
        }

        "set" === p && l.push(f), "get" === p && h.push(f), "get" !== p && c.push(f), "set" !== p && o.push(f);
      } else "set" === p ? i[d] || (i[d] = [f, ...c], n[d] = [f, ...l]) : "get" === p ? s[d] || (s[d] = [f, ...o], r[d] = [f, ...h]) : (i[d] || (i[d] = [f, ...c]), s[d] || (s[d] = [f, ...o]));
    }
  }

  deoptimizeCachedEntities() {
    for (const e of Object.values(this.expressionsToBeDeoptimizedByKey)) for (const t of e) t.deoptimizeCache();

    for (const e of this.thisParametersToBeDeoptimized) e.deoptimizePath(D);
  }

  deoptimizeCachedIntegerEntities() {
    for (const [e, t] of Object.entries(this.expressionsToBeDeoptimizedByKey)) if (Ct.test(e)) for (const e of t) e.deoptimizeCache();

    for (const e of this.thisParametersToBeDeoptimized) e.deoptimizePath(V);
  }

  getMemberExpression(e) {
    if (this.hasUnknownDeoptimizedProperty || "string" != typeof e || this.hasUnknownDeoptimizedInteger && Ct.test(e) || this.deoptimizedPaths[e]) return G;
    const t = this.propertiesAndGettersByKey[e];
    return 1 === (null == t ? void 0 : t.length) ? t[0] : t || this.unmatchablePropertiesAndGetters.length > 0 || this.unknownIntegerProps.length && Ct.test(e) ? G : null;
  }

  getMemberExpressionAndTrackDeopt(e, t) {
    if ("string" != typeof e) return G;
    const s = this.getMemberExpression(e);

    if (s !== G && !this.immutable) {
      (this.expressionsToBeDeoptimizedByKey[e] = this.expressionsToBeDeoptimizedByKey[e] || []).push(t);
    }

    return s;
  }

}

class It extends U {
  constructor(e, t) {
    super(), this.object = e, this.key = t;
  }

  deoptimizePath(e) {
    this.object.deoptimizePath([this.key, ...e]);
  }

  deoptimizeThisOnEventAtPath(e, t, s, i) {
    this.object.deoptimizeThisOnEventAtPath(e, [this.key, ...t], s, i);
  }

  getLiteralValueAtPath(e, t, s) {
    return this.object.getLiteralValueAtPath([this.key, ...e], t, s);
  }

  getReturnExpressionWhenCalledAtPath(e, t, s, i) {
    return this.object.getReturnExpressionWhenCalledAtPath([this.key, ...e], t, s, i);
  }

  hasEffectsWhenAccessedAtPath(e, t) {
    return 0 !== e.length && this.object.hasEffectsWhenAccessedAtPath([this.key, ...e], t);
  }

  hasEffectsWhenAssignedAtPath(e, t) {
    return this.object.hasEffectsWhenAssignedAtPath([this.key, ...e], t);
  }

  hasEffectsWhenCalledAtPath(e, t, s) {
    return this.object.hasEffectsWhenCalledAtPath([this.key, ...e], t, s);
  }

}

class Nt extends U {
  constructor(e) {
    super(), this.description = e;
  }

  deoptimizeThisOnEventAtPath(e, t, s) {
    2 === e && 0 === t.length && this.description.mutatesSelfAsArray && s.deoptimizePath(V);
  }

  getReturnExpressionWhenCalledAtPath(e, t) {
    return e.length > 0 ? G : this.description.returnsPrimitive || ("self" === this.description.returns ? t.thisParam || G : this.description.returns());
  }

  hasEffectsWhenAccessedAtPath(e) {
    return e.length > 1;
  }

  hasEffectsWhenAssignedAtPath(e) {
    return e.length > 0;
  }

  hasEffectsWhenCalledAtPath(e, t, s) {
    var i, n;
    if (e.length > 0 || !0 === this.description.mutatesSelfAsArray && (null === (i = t.thisParam) || void 0 === i ? void 0 : i.hasEffectsWhenAssignedAtPath(V, s))) return !0;
    if (!this.description.callsArgs) return !1;

    for (const e of this.description.callsArgs) if (null === (n = t.args[e]) || void 0 === n ? void 0 : n.hasEffectsWhenCalledAtPath(L, {
      args: je,
      thisParam: null,
      withNew: !1
    }, s)) return !0;

    return !1;
  }

  includeCallArguments(e, t) {
    for (const s of t) s.include(e, !1);
  }

}

const _t = [new Nt({
  callsArgs: null,
  mutatesSelfAsArray: !1,
  returns: null,
  returnsPrimitive: qe
})],
      $t = [new Nt({
  callsArgs: null,
  mutatesSelfAsArray: !1,
  returns: null,
  returnsPrimitive: Qe
})],
      Tt = [new Nt({
  callsArgs: null,
  mutatesSelfAsArray: !1,
  returns: null,
  returnsPrimitive: Xe
})],
      Rt = [new Nt({
  callsArgs: null,
  mutatesSelfAsArray: !1,
  returns: null,
  returnsPrimitive: G
})],
      Mt = new wt({
  __proto__: null,
  hasOwnProperty: _t,
  isPrototypeOf: _t,
  propertyIsEnumerable: _t,
  toLocaleString: $t,
  toString: $t,
  valueOf: Rt
}, null, !0);

class Ot extends Ce {
  constructor() {
    super(...arguments), this.objectEntity = null;
  }

  createScope(e) {
    this.scope = new ot(e);
  }

  deoptimizeCache() {
    this.getObjectEntity().deoptimizeAllProperties();
  }

  deoptimizePath(e) {
    this.getObjectEntity().deoptimizePath(e);
  }

  deoptimizeThisOnEventAtPath(e, t, s, i) {
    this.getObjectEntity().deoptimizeThisOnEventAtPath(e, t, s, i);
  }

  getLiteralValueAtPath(e, t, s) {
    return this.getObjectEntity().getLiteralValueAtPath(e, t, s);
  }

  getReturnExpressionWhenCalledAtPath(e, t, s, i) {
    return this.getObjectEntity().getReturnExpressionWhenCalledAtPath(e, t, s, i);
  }

  hasEffects(e) {
    var t, s;
    const i = (null === (t = this.superClass) || void 0 === t ? void 0 : t.hasEffects(e)) || this.body.hasEffects(e);
    return null === (s = this.id) || void 0 === s || s.markDeclarationReached(), i || super.hasEffects(e);
  }

  hasEffectsWhenAccessedAtPath(e, t) {
    return this.getObjectEntity().hasEffectsWhenAccessedAtPath(e, t);
  }

  hasEffectsWhenAssignedAtPath(e, t) {
    return this.getObjectEntity().hasEffectsWhenAssignedAtPath(e, t);
  }

  hasEffectsWhenCalledAtPath(e, t, s) {
    return 0 === e.length ? !t.withNew || (null !== this.classConstructor ? this.classConstructor.hasEffectsWhenCalledAtPath(L, t, s) : null !== this.superClass && this.superClass.hasEffectsWhenCalledAtPath(e, t, s)) : this.getObjectEntity().hasEffectsWhenCalledAtPath(e, t, s);
  }

  include(e, t) {
    var s;
    this.included = !0, null === (s = this.superClass) || void 0 === s || s.include(e, t), this.body.include(e, t), this.id && (this.id.markDeclarationReached(), this.id.include());
  }

  initialise() {
    var e;
    null === (e = this.id) || void 0 === e || e.declare("class", this);

    for (const e of this.body.body) if (e instanceof kt && "constructor" === e.kind) return void (this.classConstructor = e);

    this.classConstructor = null;
  }

  getObjectEntity() {
    if (null !== this.objectEntity) return this.objectEntity;
    const e = [],
          t = [];

    for (const s of this.body.body) {
      const i = s.static ? e : t,
            n = s.kind;
      if (i === t && !n) continue;
      const r = "set" === n || "get" === n ? n : "init";
      let a;

      if (s.computed) {
        const e = s.key.getLiteralValueAtPath(L, z, this);

        if (e === j) {
          i.push({
            key: M,
            kind: r,
            property: s
          });
          continue;
        }

        a = String(e);
      } else a = s.key instanceof St ? s.key.name : String(s.key.value);

      i.push({
        key: a,
        kind: r,
        property: s
      });
    }

    return e.unshift({
      key: "prototype",
      kind: "init",
      property: new wt(t, this.superClass ? new It(this.superClass, "prototype") : Mt)
    }), this.objectEntity = new wt(e, this.superClass || Mt);
  }

}

class Lt extends Ot {
  initialise() {
    super.initialise(), null !== this.id && (this.id.variable.isId = !0);
  }

  parseNode(e) {
    null !== e.id && (this.id = new this.context.nodeConstructors.Identifier(e.id, this, this.scope.parent)), super.parseNode(e);
  }

  render(e, t) {
    "system" === t.format && this.id && t.exportNamesByVariable.has(this.id.variable) && e.appendLeft(this.end, `${t.compact ? "" : " "}${Ve([this.id.variable], t)};`), super.render(e, t);
  }

}

class Dt extends rt {
  constructor(e) {
    super("arguments", null, G, e);
  }

  hasEffectsWhenAccessedAtPath(e) {
    return e.length > 1;
  }

  hasEffectsWhenAssignedAtPath() {
    return !0;
  }

  hasEffectsWhenCalledAtPath() {
    return !0;
  }

}

class Vt extends rt {
  constructor(e) {
    super("this", null, null, e), this.deoptimizedPaths = [], this.entitiesToBeDeoptimized = new Set(), this.thisDeoptimizationList = [], this.thisDeoptimizations = new W();
  }

  addEntityToBeDeoptimized(e) {
    for (const t of this.deoptimizedPaths) e.deoptimizePath(t);

    for (const t of this.thisDeoptimizationList) this.applyThisDeoptimizationEvent(e, t);

    this.entitiesToBeDeoptimized.add(e);
  }

  deoptimizePath(e) {
    if (0 !== e.length && !this.deoptimizationTracker.trackEntityAtPathAndGetIfTracked(e, this)) {
      this.deoptimizedPaths.push(e);

      for (const t of this.entitiesToBeDeoptimized) t.deoptimizePath(e);
    }
  }

  deoptimizeThisOnEventAtPath(e, t, s) {
    const i = {
      event: e,
      path: t,
      thisParameter: s
    };

    if (!this.thisDeoptimizations.trackEntityAtPathAndGetIfTracked(t, e, s)) {
      for (const e of this.entitiesToBeDeoptimized) this.applyThisDeoptimizationEvent(e, i);

      this.thisDeoptimizationList.push(i);
    }
  }

  hasEffectsWhenAccessedAtPath(e, t) {
    return this.getInit(t).hasEffectsWhenAccessedAtPath(e, t) || super.hasEffectsWhenAccessedAtPath(e, t);
  }

  hasEffectsWhenAssignedAtPath(e, t) {
    return this.getInit(t).hasEffectsWhenAssignedAtPath(e, t) || super.hasEffectsWhenAssignedAtPath(e, t);
  }

  applyThisDeoptimizationEvent(e, {
    event: t,
    path: s,
    thisParameter: i
  }) {
    e.deoptimizeThisOnEventAtPath(t, s, i === this ? e : i, z);
  }

  getInit(e) {
    return e.replacedVariableInits.get(this) || G;
  }

}

class Bt extends Ce {
  constructor() {
    super(...arguments), this.deoptimized = !1;
  }

  deoptimizeThisOnEventAtPath(e, t, s, i) {
    t.length > 0 && this.argument.deoptimizeThisOnEventAtPath(e, [M, ...t], s, i);
  }

  hasEffects(e) {
    this.deoptimized || this.applyDeoptimizations();
    const {
      propertyReadSideEffects: t
    } = this.context.options.treeshake;
    return this.argument.hasEffects(e) || t && ("always" === t || this.argument.hasEffectsWhenAccessedAtPath(D, e));
  }

  applyDeoptimizations() {
    this.deoptimized = !0, this.argument.deoptimizePath([M, M]), this.context.requestTreeshakingPass();
  }

}

class Ft extends ot {
  constructor(e, t) {
    super(e), this.parameters = [], this.hasRest = !1, this.context = t, this.hoistedBodyVarScope = new ot(this);
  }

  addParameterDeclaration(e) {
    const t = e.name;
    let s = this.hoistedBodyVarScope.variables.get(t);
    return s ? s.addDeclaration(e, null) : s = new rt(t, e, G, this.context), this.variables.set(t, s), s;
  }

  addParameterVariables(e, t) {
    this.parameters = e;

    for (const t of e) for (const e of t) e.alwaysRendered = !0;

    this.hasRest = t;
  }

  includeCallArguments(e, t) {
    let s = !1,
        i = !1;
    const n = this.hasRest && this.parameters[this.parameters.length - 1];

    for (const s of t) if (s instanceof Bt) {
      for (const s of t) s.include(e, !1);

      break;
    }

    for (let r = t.length - 1; r >= 0; r--) {
      const a = this.parameters[r] || n,
            o = t[r];
      if (a) if (s = !1, 0 === a.length) i = !0;else for (const e of a) e.included && (i = !0), e.calledFromTryStatement && (s = !0);
      !i && o.shouldBeIncluded(e) && (i = !0), i && o.include(e, s);
    }
  }

}

class zt extends Ft {
  constructor() {
    super(...arguments), this.returnExpression = null, this.returnExpressions = [];
  }

  addReturnExpression(e) {
    this.returnExpressions.push(e);
  }

  getReturnExpression() {
    return null === this.returnExpression && this.updateReturnExpression(), this.returnExpression;
  }

  updateReturnExpression() {
    if (1 === this.returnExpressions.length) this.returnExpression = this.returnExpressions[0];else {
      this.returnExpression = G;

      for (const e of this.returnExpressions) e.deoptimizePath(D);
    }
  }

}

class Wt extends zt {
  constructor(e, t) {
    super(e, t), this.variables.set("arguments", this.argumentsVariable = new Dt(t)), this.variables.set("this", this.thisVariable = new Vt(t));
  }

  findLexicalBoundary() {
    return this;
  }

  includeCallArguments(e, t) {
    if (super.includeCallArguments(e, t), this.argumentsVariable.included) for (const s of t) s.included || s.include(e, !1);
  }

}

class jt extends Ce {
  constructor() {
    super(...arguments), this.deoptimized = !1, this.declarationInit = null;
  }

  addExportedVariables(e, t) {
    this.argument.addExportedVariables(e, t);
  }

  declare(e, t) {
    return this.declarationInit = t, this.argument.declare(e, G);
  }

  deoptimizePath(e) {
    0 === e.length && this.argument.deoptimizePath(L);
  }

  hasEffectsWhenAssignedAtPath(e, t) {
    return e.length > 0 || this.argument.hasEffectsWhenAssignedAtPath(L, t);
  }

  markDeclarationReached() {
    this.argument.markDeclarationReached();
  }

  applyDeoptimizations() {
    this.deoptimized = !0, null !== this.declarationInit && (this.declarationInit.deoptimizePath([M, M]), this.context.requestTreeshakingPass());
  }

}

class Ut extends Ce {
  constructor() {
    super(...arguments), this.deoptimizedReturn = !1, this.isPrototypeDeoptimized = !1;
  }

  createScope(e) {
    this.scope = new Wt(e, this.context);
  }

  deoptimizePath(e) {
    1 === e.length && ("prototype" === e[0] ? this.isPrototypeDeoptimized = !0 : e[0] === M && (this.isPrototypeDeoptimized = !0, this.scope.getReturnExpression().deoptimizePath(D)));
  }

  deoptimizeThisOnEventAtPath(e, t, s) {
    2 === e && (t.length > 0 ? s.deoptimizePath(D) : this.scope.thisVariable.addEntityToBeDeoptimized(s));
  }

  getReturnExpressionWhenCalledAtPath(e) {
    return 0 !== e.length ? G : this.async ? (this.deoptimizedReturn || (this.deoptimizedReturn = !0, this.scope.getReturnExpression().deoptimizePath(D), this.context.requestTreeshakingPass()), G) : this.scope.getReturnExpression();
  }

  hasEffects() {
    return null !== this.id && this.id.hasEffects();
  }

  hasEffectsWhenAccessedAtPath(e) {
    return !(e.length <= 1) && (e.length > 2 || "prototype" !== e[0] || this.isPrototypeDeoptimized);
  }

  hasEffectsWhenAssignedAtPath(e) {
    return !(e.length <= 1) && (e.length > 2 || "prototype" !== e[0] || this.isPrototypeDeoptimized);
  }

  hasEffectsWhenCalledAtPath(e, t, s) {
    if (e.length > 0) return !0;

    if (this.async) {
      const {
        propertyReadSideEffects: e
      } = this.context.options.treeshake,
            t = this.scope.getReturnExpression();
      if (t.hasEffectsWhenCalledAtPath(["then"], {
        args: je,
        thisParam: null,
        withNew: !1
      }, s) || e && ("always" === e || t.hasEffectsWhenAccessedAtPath(["then"], s))) return !0;
    }

    for (const e of this.params) if (e.hasEffects(s)) return !0;

    const i = s.replacedVariableInits.get(this.scope.thisVariable);
    s.replacedVariableInits.set(this.scope.thisVariable, t.withNew ? new wt(Object.create(null), Mt) : G);
    const {
      brokenFlow: n,
      ignore: r
    } = s;
    return s.ignore = {
      breaks: !1,
      continues: !1,
      labels: new Set(),
      returnYield: !0
    }, !!this.body.hasEffects(s) || (s.brokenFlow = n, i ? s.replacedVariableInits.set(this.scope.thisVariable, i) : s.replacedVariableInits.delete(this.scope.thisVariable), s.ignore = r, !1);
  }

  include(e, t) {
    this.included = !0, this.id && this.id.include();
    const s = this.scope.argumentsVariable.included;

    for (const i of this.params) i instanceof St && !s || i.include(e, t);

    const {
      brokenFlow: i
    } = e;
    e.brokenFlow = 0, this.body.include(e, t), e.brokenFlow = i;
  }

  includeCallArguments(e, t) {
    this.scope.includeCallArguments(e, t);
  }

  initialise() {
    null !== this.id && this.id.declare("function", this), this.scope.addParameterVariables(this.params.map(e => e.declare("parameter", G)), this.params[this.params.length - 1] instanceof jt), this.body.addImplicitReturnExpressionToScope();
  }

  parseNode(e) {
    this.body = new this.context.nodeConstructors.BlockStatement(e.body, this, this.scope.hoistedBodyVarScope), super.parseNode(e);
  }

}

Ut.prototype.preventChildBlockScope = !0;

class Gt extends Ut {
  initialise() {
    super.initialise(), null !== this.id && (this.id.variable.isId = !0);
  }

  parseNode(e) {
    null !== e.id && (this.id = new this.context.nodeConstructors.Identifier(e.id, this, this.scope.parent)), super.parseNode(e);
  }

}

class Ht extends Ce {
  include(e, t) {
    super.include(e, t), t && this.context.includeVariableInModule(this.variable);
  }

  initialise() {
    const e = this.declaration;
    this.declarationName = e.id && e.id.name || this.declaration.name, this.variable = this.scope.addExportDefaultDeclaration(this.declarationName || this.context.getModuleName(), this, this.context), this.context.addExport(this);
  }

  render(e, t, s) {
    const {
      start: i,
      end: n
    } = s,
          r = function (e, t) {
      return Re(e, $e(e, "default", t) + 7);
    }(e.original, this.start);

    if (this.declaration instanceof Gt) this.renderNamedDeclaration(e, r, "function", "(", null === this.declaration.id, t);else if (this.declaration instanceof Lt) this.renderNamedDeclaration(e, r, "class", "{", null === this.declaration.id, t);else {
      if (this.variable.getOriginalVariable() !== this.variable) return void Ie(this, e, i, n);
      if (!this.variable.included) return e.remove(this.start, r), this.declaration.render(e, t, {
        renderedSurroundingElement: "ExpressionStatement"
      }), void (";" !== e.original[this.end - 1] && e.appendLeft(this.end, ";"));
      this.renderVariableDeclaration(e, r, t);
    }
    this.declaration.render(e, t);
  }

  renderNamedDeclaration(e, t, s, i, n, r) {
    const a = this.variable.getName();
    e.remove(this.start, t), n && e.appendLeft(function (e, t, s, i) {
      const n = $e(e, t, i) + t.length;
      e = e.slice(n, $e(e, s, n));
      const r = $e(e, "*");
      return -1 === r ? n : n + r + 1;
    }(e.original, s, i, t), ` ${a}`), "system" === r.format && this.declaration instanceof Lt && r.exportNamesByVariable.has(this.variable) && e.appendLeft(this.end, ` ${Ve([this.variable], r)};`);
  }

  renderVariableDeclaration(e, t, s) {
    const i = 59 === e.original.charCodeAt(this.end - 1),
          n = "system" === s.format && s.exportNamesByVariable.get(this.variable);
    n ? (e.overwrite(this.start, t, `${s.varOrConst} ${this.variable.getName()} = exports('${n[0]}', `), e.appendRight(i ? this.end - 1 : this.end, ")" + (i ? "" : ";"))) : (e.overwrite(this.start, t, `${s.varOrConst} ${this.variable.getName()} = `), i || e.appendLeft(this.end, ";"));
  }

}

Ht.prototype.needsBoundaries = !0;

class qt extends Ce {
  deoptimizeThisOnEventAtPath() {}

  getLiteralValueAtPath(e) {
    return e.length > 0 || null === this.value && 110 !== this.context.code.charCodeAt(this.start) || "bigint" == typeof this.value || 47 === this.context.code.charCodeAt(this.start) ? j : this.value;
  }

  getReturnExpressionWhenCalledAtPath(e) {
    return 1 !== e.length ? G : nt(this.members, e[0]);
  }

  hasEffectsWhenAccessedAtPath(e) {
    return null === this.value ? e.length > 0 : e.length > 1;
  }

  hasEffectsWhenAssignedAtPath(e) {
    return e.length > 0;
  }

  hasEffectsWhenCalledAtPath(e, t, s) {
    return 1 !== e.length || it(this.members, e[0], t, s);
  }

  initialise() {
    this.members = function (e) {
      switch (typeof e) {
        case "boolean":
          return et;

        case "number":
          return tt;

        case "string":
          return st;

        default:
          return Object.create(null);
      }
    }(this.value);
  }

  parseNode(e) {
    this.value = e.value, this.regex = e.regex, super.parseNode(e);
  }

  render(e) {
    "string" == typeof this.value && e.indentExclusionRanges.push([this.start + 1, this.end - 1]);
  }

}

class Kt extends Ce {
  constructor() {
    super(...arguments), this.hasCachedEffect = !1;
  }

  hasEffects(e) {
    if (this.hasCachedEffect) return !0;

    for (const t of this.body) if (t.hasEffects(e)) return this.hasCachedEffect = !0;

    return !1;
  }

  include(e, t) {
    this.included = !0;

    for (const s of this.body) (t || s.shouldBeIncluded(e)) && s.include(e, t);
  }

  render(e, t) {
    this.body.length ? Oe(this.body, e, this.start, this.end, t) : super.render(e, t);
  }

}

class Xt extends Ce {
  getLiteralValueAtPath(e) {
    return e.length > 0 || 1 !== this.quasis.length ? j : this.quasis[0].value.cooked;
  }

  render(e, t) {
    e.indentExclusionRanges.push([this.start, this.end]), super.render(e, t);
  }

}

function Yt(e, t) {
  return null !== e.renderBaseName && t.has(e) && e.isReassigned;
}

class Qt extends Ce {
  deoptimizePath() {
    for (const e of this.declarations) e.deoptimizePath(L);
  }

  hasEffectsWhenAssignedAtPath() {
    return !1;
  }

  include(e, t) {
    this.included = !0;

    for (const s of this.declarations) (t || s.shouldBeIncluded(e)) && s.include(e, t);
  }

  includeAsSingleStatement(e, t) {
    this.included = !0;

    for (const s of this.declarations) (t || s.shouldBeIncluded(e)) && (s.include(e, t), s.id.include(e, t));
  }

  initialise() {
    for (const e of this.declarations) e.declareDeclarator(this.kind);
  }

  render(e, t, s = K) {
    if (function (e, t) {
      for (const s of e) {
        if (!s.id.included) return !1;

        if ("Identifier" === s.id.type) {
          if (t.has(s.id.variable)) return !1;
        } else {
          const e = [];
          if (s.id.addExportedVariables(e, t), e.length > 0) return !1;
        }
      }

      return !0;
    }(this.declarations, t.exportNamesByVariable)) {
      for (const s of this.declarations) s.render(e, t);

      s.isNoStatement || 59 === e.original.charCodeAt(this.end - 1) || e.appendLeft(this.end, ";");
    } else this.renderReplacedDeclarations(e, t, s);
  }

  renderDeclarationEnd(e, t, s, i, n, r, a, o) {
    59 === e.original.charCodeAt(this.end - 1) && e.remove(this.end - 1, this.end), o || (t += ";"), null !== s ? (10 !== e.original.charCodeAt(i - 1) || 10 !== e.original.charCodeAt(this.end) && 13 !== e.original.charCodeAt(this.end) || (i--, 13 === e.original.charCodeAt(i) && i--), i === s + 1 ? e.overwrite(s, n, t) : (e.overwrite(s, s + 1, t), e.remove(i, n))) : e.appendLeft(n, t), r.length > 0 && e.appendLeft(n, ` ${Ve(r, a)};`);
  }

  renderReplacedDeclarations(e, t, {
    isNoStatement: s
  }) {
    const i = Le(this.declarations, e, this.start + this.kind.length, this.end - (59 === e.original.charCodeAt(this.end - 1) ? 1 : 0));
    let n, r;
    r = Re(e.original, this.start + this.kind.length);
    let a = r - 1;
    e.remove(this.start, a);
    let o,
        l = !1,
        c = !1,
        u = "";

    const d = [],
          p = function (e, t, s) {
      var i;
      let n = null;

      if ("system" === t.format) {
        for (const {
          node: r
        } of e) r.id instanceof St && r.init && 0 === s.length && 1 === (null === (i = t.exportNamesByVariable.get(r.id.variable)) || void 0 === i ? void 0 : i.length) ? (n = r.id.variable, s.push(n)) : r.id.addExportedVariables(s, t.exportNamesByVariable);

        s.length > 1 ? n = null : n && (s.length = 0);
      }

      return n;
    }(i, t, d);

    for (const {
      node: s,
      start: d,
      separator: f,
      contentEnd: m,
      end: g
    } of i) if (s.included) {
      if (s.render(e, t), o = "", !s.id.included || s.id instanceof St && Yt(s.id.variable, t.exportNamesByVariable)) c && (u += ";"), l = !1;else {
        if (p && p === s.id.variable) {
          const i = $e(e.original, "=", s.id.end);
          Be(p, Re(e.original, i + 1), null === f ? m : f, e, t);
        }

        l ? u += "," : (c && (u += ";"), o += `${this.kind} `, l = !0);
      }
      r === a + 1 ? e.overwrite(a, r, u + o) : (e.overwrite(a, a + 1, u), e.appendLeft(r, o)), n = m, r = g, c = !0, a = f, u = "";
    } else e.remove(d, g);

    this.renderDeclarationEnd(e, u, a, n, r, d, t, s);
  }

}

const Zt = [{
  key: O,
  kind: "init",
  property: G
}, {
  key: "length",
  kind: "init",
  property: Xe
}],
      Jt = [new Nt({
  callsArgs: [0],
  mutatesSelfAsArray: "deopt-only",
  returns: null,
  returnsPrimitive: qe
})],
      es = [new Nt({
  callsArgs: [0],
  mutatesSelfAsArray: "deopt-only",
  returns: null,
  returnsPrimitive: Xe
})],
      ts = [new Nt({
  callsArgs: null,
  mutatesSelfAsArray: !0,
  returns: () => new wt(Zt, cs),
  returnsPrimitive: null
})],
      ss = [new Nt({
  callsArgs: null,
  mutatesSelfAsArray: "deopt-only",
  returns: () => new wt(Zt, cs),
  returnsPrimitive: null
})],
      is = [new Nt({
  callsArgs: [0],
  mutatesSelfAsArray: "deopt-only",
  returns: () => new wt(Zt, cs),
  returnsPrimitive: null
})],
      ns = [new Nt({
  callsArgs: null,
  mutatesSelfAsArray: !0,
  returns: null,
  returnsPrimitive: Xe
})],
      rs = [new Nt({
  callsArgs: null,
  mutatesSelfAsArray: !0,
  returns: null,
  returnsPrimitive: G
})],
      as = [new Nt({
  callsArgs: null,
  mutatesSelfAsArray: "deopt-only",
  returns: null,
  returnsPrimitive: G
})],
      os = [new Nt({
  callsArgs: [0],
  mutatesSelfAsArray: "deopt-only",
  returns: null,
  returnsPrimitive: G
})],
      hs = [new Nt({
  callsArgs: null,
  mutatesSelfAsArray: !0,
  returns: "self",
  returnsPrimitive: null
})],
      ls = [new Nt({
  callsArgs: [0],
  mutatesSelfAsArray: !0,
  returns: "self",
  returnsPrimitive: null
})],
      cs = new wt({
  __proto__: null,
  at: as,
  concat: ss,
  copyWithin: hs,
  entries: ss,
  every: Jt,
  fill: hs,
  filter: is,
  find: os,
  findIndex: es,
  forEach: os,
  includes: _t,
  indexOf: Tt,
  join: $t,
  keys: Rt,
  lastIndexOf: Tt,
  map: is,
  pop: rs,
  push: ns,
  reduce: os,
  reduceRight: os,
  reverse: hs,
  shift: rs,
  slice: ss,
  some: Jt,
  sort: ls,
  splice: ts,
  unshift: ns,
  values: as
}, Mt, !0);

class us extends ot {
  addDeclaration(e, t, s, i) {
    if (i) {
      const n = this.parent.addDeclaration(e, t, s, i);
      return n.markInitializersForDeoptimization(), n;
    }

    return super.addDeclaration(e, t, s, !1);
  }

}

class ds extends Ce {
  initialise() {
    this.directive && "use strict" !== this.directive && "Program" === this.parent.type && this.context.warn({
      code: "MODULE_LEVEL_DIRECTIVE",
      message: `Module level directives cause errors when bundled, '${this.directive}' was ignored.`
    }, this.start);
  }

  render(e, t) {
    super.render(e, t), this.included && this.insertSemicolon(e);
  }

  shouldBeIncluded(e) {
    return this.directive && "use strict" !== this.directive ? "Program" !== this.parent.type : super.shouldBeIncluded(e);
  }

}

class ps extends Ce {
  constructor() {
    super(...arguments), this.directlyIncluded = !1;
  }

  addImplicitReturnExpressionToScope() {
    const e = this.body[this.body.length - 1];
    e && "ReturnStatement" === e.type || this.scope.addReturnExpression(G);
  }

  createScope(e) {
    this.scope = this.parent.preventChildBlockScope ? e : new us(e);
  }

  hasEffects(e) {
    if (this.deoptimizeBody) return !0;

    for (const t of this.body) {
      if (t.hasEffects(e)) return !0;
      if (e.brokenFlow) break;
    }

    return !1;
  }

  include(e, t) {
    if (!this.deoptimizeBody || !this.directlyIncluded) {
      this.included = !0, this.directlyIncluded = !0, this.deoptimizeBody && (t = !0);

      for (const s of this.body) (t || s.shouldBeIncluded(e)) && s.include(e, t);
    }
  }

  initialise() {
    const e = this.body[0];
    this.deoptimizeBody = e instanceof ds && "use asm" === e.directive;
  }

  render(e, t) {
    this.body.length ? Oe(this.body, e, this.start + 1, this.end - 1, t) : super.render(e, t);
  }

}

class fs extends Ce {
  constructor() {
    super(...arguments), this.deoptimizedReturn = !1;
  }

  createScope(e) {
    this.scope = new zt(e, this.context);
  }

  deoptimizePath(e) {
    1 === e.length && e[0] === M && this.scope.getReturnExpression().deoptimizePath(D);
  }

  deoptimizeThisOnEventAtPath() {}

  getReturnExpressionWhenCalledAtPath(e) {
    return 0 !== e.length ? G : this.async ? (this.deoptimizedReturn || (this.deoptimizedReturn = !0, this.scope.getReturnExpression().deoptimizePath(D), this.context.requestTreeshakingPass()), G) : this.scope.getReturnExpression();
  }

  hasEffects() {
    return !1;
  }

  hasEffectsWhenAccessedAtPath(e) {
    return e.length > 1;
  }

  hasEffectsWhenAssignedAtPath(e) {
    return e.length > 1;
  }

  hasEffectsWhenCalledAtPath(e, t, s) {
    if (e.length > 0) return !0;

    if (this.async) {
      const {
        propertyReadSideEffects: e
      } = this.context.options.treeshake,
            t = this.scope.getReturnExpression();
      if (t.hasEffectsWhenCalledAtPath(["then"], {
        args: je,
        thisParam: null,
        withNew: !1
      }, s) || e && ("always" === e || t.hasEffectsWhenAccessedAtPath(["then"], s))) return !0;
    }

    for (const e of this.params) if (e.hasEffects(s)) return !0;

    const {
      ignore: i,
      brokenFlow: n
    } = s;
    return s.ignore = {
      breaks: !1,
      continues: !1,
      labels: new Set(),
      returnYield: !0
    }, !!this.body.hasEffects(s) || (s.ignore = i, s.brokenFlow = n, !1);
  }

  include(e, t) {
    this.included = !0;

    for (const s of this.params) s instanceof St || s.include(e, t);

    const {
      brokenFlow: s
    } = e;
    e.brokenFlow = 0, this.body.include(e, t), e.brokenFlow = s;
  }

  includeCallArguments(e, t) {
    this.scope.includeCallArguments(e, t);
  }

  initialise() {
    this.scope.addParameterVariables(this.params.map(e => e.declare("parameter", G)), this.params[this.params.length - 1] instanceof jt), this.body instanceof ps ? this.body.addImplicitReturnExpressionToScope() : this.scope.addReturnExpression(this.body);
  }

  parseNode(e) {
    "BlockStatement" === e.body.type && (this.body = new this.context.nodeConstructors.BlockStatement(e.body, this, this.scope.hoistedBodyVarScope)), super.parseNode(e);
  }

}

fs.prototype.preventChildBlockScope = !0;

class ms extends Ce {
  addExportedVariables(e, t) {
    for (const s of this.properties) "Property" === s.type ? s.value.addExportedVariables(e, t) : s.argument.addExportedVariables(e, t);
  }

  declare(e, t) {
    const s = [];

    for (const i of this.properties) s.push(...i.declare(e, t));

    return s;
  }

  deoptimizePath(e) {
    if (0 === e.length) for (const t of this.properties) t.deoptimizePath(e);
  }

  hasEffectsWhenAssignedAtPath(e, t) {
    if (e.length > 0) return !0;

    for (const e of this.properties) if (e.hasEffectsWhenAssignedAtPath(L, t)) return !0;

    return !1;
  }

  markDeclarationReached() {
    for (const e of this.properties) e.markDeclarationReached();
  }

}

class gs extends Ce {
  constructor() {
    super(...arguments), this.deoptimized = !1;
  }

  hasEffects(e) {
    return this.deoptimized || this.applyDeoptimizations(), this.right.hasEffects(e) || this.left.hasEffects(e) || this.left.hasEffectsWhenAssignedAtPath(L, e);
  }

  hasEffectsWhenAccessedAtPath(e, t) {
    return e.length > 0 && this.right.hasEffectsWhenAccessedAtPath(e, t);
  }

  include(e, t) {
    let s;
    this.deoptimized || this.applyDeoptimizations(), this.included = !0, (t || "=" !== this.operator || this.left.included || (s = de(), this.left.hasEffects(s) || this.left.hasEffectsWhenAssignedAtPath(L, s))) && this.left.include(e, t), this.right.include(e, t);
  }

  render(e, t, {
    preventASI: s,
    renderedParentType: i,
    renderedSurroundingElement: n
  } = K) {
    if (this.left.included) this.left.render(e, t), this.right.render(e, t);else {
      const r = Re(e.original, $e(e.original, "=", this.left.end) + 1);
      e.remove(this.start, r), s && De(e, r, this.right.start), this.right.render(e, t, {
        renderedParentType: i || this.parent.type,
        renderedSurroundingElement: n || this.parent.type
      });
    }
    if ("system" === t.format) if (this.left instanceof St) {
      const s = this.left.variable,
            i = t.exportNamesByVariable.get(s);
      if (i) return void (1 === i.length ? Be(s, this.start, this.end, e, t) : Fe(s, this.start, this.end, "ExpressionStatement" !== this.parent.type, e, t));
    } else {
      const s = [];
      if (this.left.addExportedVariables(s, t.exportNamesByVariable), s.length > 0) return void function (e, t, s, i, n, r) {
        const a = r.compact ? "" : " ",
              o = r.compact ? "" : ";";
        n.prependRight(t, `function${a}(v)${a}{${a}return ${Ve(e, r)},${a}v${o}${a}}(`), n.appendLeft(s, ")"), i && (n.prependRight(t, "("), n.appendLeft(s, ")"));
      }(s, this.start, this.end, "ExpressionStatement" === n, e, t);
    }
    this.left.included && this.left instanceof ms && ("ExpressionStatement" === n || "ArrowFunctionExpression" === n) && (e.appendRight(this.start, "("), e.prependLeft(this.end, ")"));
  }

  applyDeoptimizations() {
    this.deoptimized = !0, this.left.deoptimizePath(L), this.right.deoptimizePath(D), this.context.requestTreeshakingPass();
  }

}

const ys = {
  "!=": (e, t) => e != t,
  "!==": (e, t) => e !== t,
  "%": (e, t) => e % t,
  "&": (e, t) => e & t,
  "*": (e, t) => e * t,
  "**": (e, t) => e ** t,
  "+": (e, t) => e + t,
  "-": (e, t) => e - t,
  "/": (e, t) => e / t,
  "<": (e, t) => e < t,
  "<<": (e, t) => e << t,
  "<=": (e, t) => e <= t,
  "==": (e, t) => e == t,
  "===": (e, t) => e === t,
  ">": (e, t) => e > t,
  ">=": (e, t) => e >= t,
  ">>": (e, t) => e >> t,
  ">>>": (e, t) => e >>> t,
  "^": (e, t) => e ^ t,
  in: () => j,
  instanceof: () => j,
  "|": (e, t) => e | t
};

function Es(e) {
  return e.computed ? function (e) {
    if (e instanceof qt) return String(e.value);
    return null;
  }(e.property) : e.property.name;
}

function xs(e) {
  const t = e.propertyKey,
        s = e.object;

  if ("string" == typeof t) {
    if (s instanceof St) return [{
      key: s.name,
      pos: s.start
    }, {
      key: t,
      pos: e.property.start
    }];

    if (s instanceof vs) {
      const i = xs(s);
      return i && [...i, {
        key: t,
        pos: e.property.start
      }];
    }
  }

  return null;
}

class vs extends Ce {
  constructor() {
    super(...arguments), this.variable = null, this.deoptimized = !1, this.bound = !1, this.expressionsToBeDeoptimized = [], this.replacement = null;
  }

  bind() {
    this.bound = !0;
    const e = xs(this),
          t = e && this.scope.findVariable(e[0].key);

    if (t && t.isNamespace) {
      const s = this.resolveNamespaceVariables(t, e.slice(1));
      s ? "string" == typeof s ? this.replacement = s : (this.variable = s, this.scope.addNamespaceMemberAccess(function (e) {
        let t = e[0].key;

        for (let s = 1; s < e.length; s++) t += "." + e[s].key;

        return t;
      }(e), s)) : super.bind();
    } else super.bind();
  }

  deoptimizeCache() {
    const e = this.expressionsToBeDeoptimized;
    this.expressionsToBeDeoptimized = [], this.propertyKey = M, this.object.deoptimizePath(D);

    for (const t of e) t.deoptimizeCache();
  }

  deoptimizePath(e) {
    0 === e.length && this.disallowNamespaceReassignment(), this.variable ? this.variable.deoptimizePath(e) : this.replacement || e.length < 7 && this.object.deoptimizePath([this.getPropertyKey(), ...e]);
  }

  deoptimizeThisOnEventAtPath(e, t, s, i) {
    this.variable ? this.variable.deoptimizeThisOnEventAtPath(e, t, s, i) : this.replacement || (t.length < 7 ? this.object.deoptimizeThisOnEventAtPath(e, [this.getPropertyKey(), ...t], s, i) : s.deoptimizePath(D));
  }

  getLiteralValueAtPath(e, t, s) {
    return null !== this.variable ? this.variable.getLiteralValueAtPath(e, t, s) : this.replacement ? j : (this.expressionsToBeDeoptimized.push(s), e.length < 7 ? this.object.getLiteralValueAtPath([this.getPropertyKey(), ...e], t, s) : j);
  }

  getReturnExpressionWhenCalledAtPath(e, t, s, i) {
    return null !== this.variable ? this.variable.getReturnExpressionWhenCalledAtPath(e, t, s, i) : this.replacement ? G : (this.expressionsToBeDeoptimized.push(i), e.length < 7 ? this.object.getReturnExpressionWhenCalledAtPath([this.getPropertyKey(), ...e], t, s, i) : G);
  }

  hasEffects(e) {
    this.deoptimized || this.applyDeoptimizations();
    const {
      propertyReadSideEffects: t
    } = this.context.options.treeshake;
    return this.property.hasEffects(e) || this.object.hasEffects(e) || !(this.variable || this.replacement || this.parent instanceof gs && "=" === this.parent.operator) && t && ("always" === t || this.object.hasEffectsWhenAccessedAtPath([this.getPropertyKey()], e));
  }

  hasEffectsWhenAccessedAtPath(e, t) {
    return null !== this.variable ? this.variable.hasEffectsWhenAccessedAtPath(e, t) : !!this.replacement || !(e.length < 7) || this.object.hasEffectsWhenAccessedAtPath([this.getPropertyKey(), ...e], t);
  }

  hasEffectsWhenAssignedAtPath(e, t) {
    return null !== this.variable ? this.variable.hasEffectsWhenAssignedAtPath(e, t) : !!this.replacement || !(e.length < 7) || this.object.hasEffectsWhenAssignedAtPath([this.getPropertyKey(), ...e], t);
  }

  hasEffectsWhenCalledAtPath(e, t, s) {
    return null !== this.variable ? this.variable.hasEffectsWhenCalledAtPath(e, t, s) : !!this.replacement || !(e.length < 7) || this.object.hasEffectsWhenCalledAtPath([this.getPropertyKey(), ...e], t, s);
  }

  include(e, t) {
    this.deoptimized || this.applyDeoptimizations(), this.included || (this.included = !0, null !== this.variable && this.context.includeVariableInModule(this.variable)), this.object.include(e, t), this.property.include(e, t);
  }

  includeCallArguments(e, t) {
    this.variable ? this.variable.includeCallArguments(e, t) : super.includeCallArguments(e, t);
  }

  initialise() {
    this.propertyKey = Es(this);
  }

  render(e, t, {
    renderedParentType: s,
    isCalleeOfRenderedParent: i,
    renderedSurroundingElement: n
  } = K) {
    if (this.variable || this.replacement) {
      let t = this.variable ? this.variable.getName() : this.replacement;
      s && i && (t = "0, " + t), e.overwrite(this.start, this.end, t, {
        contentOnly: !0,
        storeName: !0
      });
    } else s && i && e.appendRight(this.start, "0, "), this.object.render(e, t, {
      renderedSurroundingElement: n
    }), this.property.render(e, t);
  }

  applyDeoptimizations() {
    this.deoptimized = !0;
    const {
      propertyReadSideEffects: e
    } = this.context.options.treeshake;
    this.bound && e && !this.variable && !this.replacement && (this.parent instanceof gs && "=" === this.parent.operator || this.object.deoptimizeThisOnEventAtPath(0, [this.propertyKey], this.object, z), this.parent instanceof gs && this.object.deoptimizeThisOnEventAtPath(1, [this.propertyKey], this.object, z), this.context.requestTreeshakingPass());
  }

  disallowNamespaceReassignment() {
    if (this.object instanceof St) {
      this.scope.findVariable(this.object.name).isNamespace && (this.variable && this.context.includeVariableInModule(this.variable), this.context.warn({
        code: "ILLEGAL_NAMESPACE_REASSIGNMENT",
        message: `Illegal reassignment to import '${this.object.name}'`
      }, this.start));
    }
  }

  getPropertyKey() {
    if (null === this.propertyKey) {
      this.propertyKey = M;
      const e = this.property.getLiteralValueAtPath(L, z, this);
      return this.propertyKey = e === j ? M : String(e);
    }

    return this.propertyKey;
  }

  resolveNamespaceVariables(e, t) {
    if (0 === t.length) return e;
    if (!e.isNamespace || e instanceof q) return null;
    const s = t[0].key,
          i = e.context.traceExport(s);

    if (!i) {
      const i = e.context.fileName;
      return this.context.warn({
        code: "MISSING_EXPORT",
        exporter: re(i),
        importer: re(this.context.fileName),
        message: `'${s}' is not exported by '${re(i)}'`,
        missing: s,
        url: "https://rollupjs.org/guide/en/#error-name-is-not-exported-by-module"
      }, t[0].pos), "undefined";
    }

    return this.resolveNamespaceVariables(i, t.slice(1));
  }

}

class bs extends Ft {
  addDeclaration(e, t, s, i) {
    const n = this.variables.get(e.name);
    return n ? (this.parent.addDeclaration(e, t, Ge, i), n.addDeclaration(e, s), n) : this.parent.addDeclaration(e, t, s, i);
  }

}

class Ss extends ot {
  constructor(e, t, s) {
    super(e), this.variables.set("this", this.thisVariable = new rt("this", null, t, s)), this.instanceScope = new ot(this), this.instanceScope.variables.set("this", new Vt(s));
  }

  findLexicalBoundary() {
    return this;
  }

}

class As extends U {
  constructor(e) {
    super(), this.expressions = e, this.included = !1;
  }

  deoptimizePath(e) {
    for (const t of this.expressions) t.deoptimizePath(e);
  }

  getReturnExpressionWhenCalledAtPath(e, t, s, i) {
    return new As(this.expressions.map(n => n.getReturnExpressionWhenCalledAtPath(e, t, s, i)));
  }

  hasEffectsWhenAccessedAtPath(e, t) {
    for (const s of this.expressions) if (s.hasEffectsWhenAccessedAtPath(e, t)) return !0;

    return !1;
  }

  hasEffectsWhenAssignedAtPath(e, t) {
    for (const s of this.expressions) if (s.hasEffectsWhenAssignedAtPath(e, t)) return !0;

    return !1;
  }

  hasEffectsWhenCalledAtPath(e, t, s) {
    for (const i of this.expressions) if (i.hasEffectsWhenCalledAtPath(e, t, s)) return !0;

    return !1;
  }

  include(e, t) {
    for (const s of this.expressions) s.included || s.include(e, t);
  }

}

class Ps extends Ce {
  bind() {
    null !== this.declaration && this.declaration.bind();
  }

  hasEffects(e) {
    return null !== this.declaration && this.declaration.hasEffects(e);
  }

  initialise() {
    this.context.addExport(this);
  }

  render(e, t, s) {
    const {
      start: i,
      end: n
    } = s;
    null === this.declaration ? e.remove(i, n) : (e.remove(this.start, this.declaration.start), this.declaration.render(e, t, {
      end: n,
      start: i
    }));
  }

}

Ps.prototype.needsBoundaries = !0;

class ks extends us {
  constructor() {
    super(...arguments), this.hoistedDeclarations = [];
  }

  addDeclaration(e, t, s, i) {
    return this.hoistedDeclarations.push(e), super.addDeclaration(e, t, s, i);
  }

}

const Cs = Symbol("unset");

class ws extends Ce {
  constructor() {
    super(...arguments), this.testValue = Cs;
  }

  deoptimizeCache() {
    this.testValue = j;
  }

  hasEffects(e) {
    if (this.test.hasEffects(e)) return !0;
    const t = this.getTestValue();

    if (t === j) {
      const {
        brokenFlow: t
      } = e;
      if (this.consequent.hasEffects(e)) return !0;
      const s = e.brokenFlow;
      return e.brokenFlow = t, null === this.alternate ? !1 : !!this.alternate.hasEffects(e) || (e.brokenFlow = e.brokenFlow < s ? e.brokenFlow : s, !1);
    }

    return t ? this.consequent.hasEffects(e) : null !== this.alternate && this.alternate.hasEffects(e);
  }

  include(e, t) {
    if (this.included = !0, t) this.includeRecursively(t, e);else {
      const t = this.getTestValue();
      t === j ? this.includeUnknownTest(e) : this.includeKnownTest(e, t);
    }
  }

  parseNode(e) {
    this.consequentScope = new ks(this.scope), this.consequent = new (this.context.nodeConstructors[e.consequent.type] || this.context.nodeConstructors.UnknownNode)(e.consequent, this, this.consequentScope), e.alternate && (this.alternateScope = new ks(this.scope), this.alternate = new (this.context.nodeConstructors[e.alternate.type] || this.context.nodeConstructors.UnknownNode)(e.alternate, this, this.alternateScope)), super.parseNode(e);
  }

  render(e, t) {
    const s = this.getTestValue(),
          i = [],
          n = this.test.included,
          r = !this.context.options.treeshake;
    n ? this.test.render(e, t) : e.remove(this.start, this.consequent.start), this.consequent.included && (r || s === j || s) ? this.consequent.render(e, t) : (e.overwrite(this.consequent.start, this.consequent.end, n ? ";" : ""), i.push(...this.consequentScope.hoistedDeclarations)), this.alternate && (!this.alternate.included || !r && s !== j && s ? (n && this.shouldKeepAlternateBranch() ? e.overwrite(this.alternate.start, this.end, ";") : e.remove(this.consequent.end, this.end), i.push(...this.alternateScope.hoistedDeclarations)) : (n ? 101 === e.original.charCodeAt(this.alternate.start - 1) && e.prependLeft(this.alternate.start, " ") : e.remove(this.consequent.end, this.alternate.start), this.alternate.render(e, t))), this.renderHoistedDeclarations(i, e);
  }

  getTestValue() {
    return this.testValue === Cs ? this.testValue = this.test.getLiteralValueAtPath(L, z, this) : this.testValue;
  }

  includeKnownTest(e, t) {
    this.test.shouldBeIncluded(e) && this.test.include(e, !1), t && this.consequent.shouldBeIncluded(e) && this.consequent.includeAsSingleStatement(e, !1), null !== this.alternate && !t && this.alternate.shouldBeIncluded(e) && this.alternate.includeAsSingleStatement(e, !1);
  }

  includeRecursively(e, t) {
    this.test.include(t, e), this.consequent.include(t, e), null !== this.alternate && this.alternate.include(t, e);
  }

  includeUnknownTest(e) {
    this.test.include(e, !1);
    const {
      brokenFlow: t
    } = e;
    let s = 0;
    this.consequent.shouldBeIncluded(e) && (this.consequent.includeAsSingleStatement(e, !1), s = e.brokenFlow, e.brokenFlow = t), null !== this.alternate && this.alternate.shouldBeIncluded(e) && (this.alternate.includeAsSingleStatement(e, !1), e.brokenFlow = e.brokenFlow < s ? e.brokenFlow : s);
  }

  renderHoistedDeclarations(e, t) {
    const s = [...new Set(e.map(e => {
      const t = e.variable;
      return t.included ? t.getName() : "";
    }))].filter(Boolean).join(", ");

    if (s) {
      const e = this.parent.type,
            i = "Program" !== e && "BlockStatement" !== e;
      t.prependRight(this.start, `${i ? "{ " : ""}var ${s}; `), i && t.appendLeft(this.end, " }");
    }
  }

  shouldKeepAlternateBranch() {
    let e = this.parent;

    do {
      if (e instanceof ws && e.alternate) return !0;
      if (e instanceof ps) return !1;
      e = e.parent;
    } while (e);

    return !1;
  }

}

class Is extends Ce {
  bind() {}

  hasEffects() {
    return !1;
  }

  initialise() {
    this.context.addImport(this);
  }

  render(e, t, s) {
    e.remove(s.start, s.end);
  }

}

Is.prototype.needsBoundaries = !0;
const Ns = {
  auto: "_interopDefault",
  default: null,
  defaultOnly: null,
  esModule: null,
  false: null,
  true: "_interopDefaultLegacy"
};

function _s(e, t) {
  return "esModule" === e || t && ("auto" === e || "true" === e);
}

const $s = {
  auto: "_interopNamespace",
  default: "_interopNamespaceDefault",
  defaultOnly: "_interopNamespaceDefaultOnly",
  esModule: null,
  false: null,
  true: "_interopNamespace"
};

function Ts(e, t) {
  return _s(e, t) && "_interopDefault" === Ns[e];
}

const Rs = {
  _interopDefaultLegacy: (e, t, s, i, n) => `function _interopDefaultLegacy${e}(e)${e}{${e}return e${e}&&${e}typeof e${e}===${e}'object'${e}&&${e}'default'${e}in e${e}?${e}${n ? Ms(e) : Os(e)}${s}${e}}${t}${t}`,
  _interopDefault: (e, t, s, i, n) => `function _interopDefault${e}(e)${e}{${e}return e${e}&&${e}e.__esModule${e}?${e}${n ? Ms(e) : Os(e)}${s}${e}}${t}${t}`,
  _interopNamespaceDefaultOnly: (e, t, s, i, n, r, a) => `function _interopNamespaceDefaultOnly(e)${e}{${t}${i}return ${Bs(`{__proto__: null,${a ? `${e}[Symbol.toStringTag]:${e}'Module',` : ""}${e}'default':${e}e}`, r)};${t}}${t}${t}`,
  _interopNamespaceDefault: (e, t, s, i, n, r, a) => `function _interopNamespaceDefault(e)${e}{${t}` + Ls(e, t, i, i, n, r, a) + `}${t}${t}`,
  _interopNamespace: (e, t, s, i, n, r, a, o) => `function _interopNamespace(e)${e}{${t}` + (o.has("_interopNamespaceDefault") ? `${i}return e${e}&&${e}e.__esModule${e}?${e}e${e}:${e}_interopNamespaceDefault(e)${s}${t}` : `${i}if${e}(e${e}&&${e}e.__esModule)${e}return e;${t}` + Ls(e, t, i, i, n, r, a)) + `}${t}${t}`
};

function Ms(e) {
  return `e${e}:${e}{${e}'default':${e}e${e}}`;
}

function Os(e) {
  return `e['default']${e}:${e}e`;
}

function Ls(e, t, s, i, n, r, a) {
  return `${i}var n${e}=${e}${a ? `{__proto__:${e}null,${e}[Symbol.toStringTag]:${e}'Module'}` : "Object.create(null)"};${t}${i}if${e}(e)${e}{${t}${i}${s}Object.keys(e).forEach(function${e}(k)${e}{${t}` + (n ? Ds : Vs)(e, t, s, i + s + s) + `${i}${s}});${t}` + `${i}}${t}` + `${i}n['default']${e}=${e}e;${t}` + `${i}return ${Bs("n", r)};${t}`;
}

function Ds(e, t, s, i) {
  return `${i}if${e}(k${e}!==${e}'default')${e}{${t}${i}${s}var d${e}=${e}Object.getOwnPropertyDescriptor(e,${e}k);${t}${i}${s}Object.defineProperty(n,${e}k,${e}d.get${e}?${e}d${e}:${e}{${t}${i}${s}${s}enumerable:${e}true,${t}${i}${s}${s}get:${e}function${e}()${e}{${t}${i}${s}${s}${s}return e[k];${t}${i}${s}${s}}${t}${i}${s}});${t}${i}}${t}`;
}

function Vs(e, t, s, i) {
  return `${i}n[k]${e}=${e}e[k];${t}`;
}

function Bs(e, t) {
  return t ? `Object.freeze(${e})` : e;
}

const Fs = Object.keys(Rs);

function zs(e, t, s) {
  return "external" === t ? $s[String(s(e instanceof oe ? e.id : null))] : "default" === t ? "_interopNamespaceDefaultOnly" : null;
}

const Ws = {
  amd: ["require"],
  cjs: ["require"],
  system: ["module"]
};

function js(e) {
  return e.replace(/^\t+/, e => e.split("\t").join("  "));
}

function Us(e) {
  throw e instanceof Error || (e = Object.assign(new Error(e.message), e)), e;
}

function Gs(e, t, s, i) {
  if ("object" == typeof t) {
    const {
      line: s,
      column: n
    } = t;
    e.loc = {
      column: n,
      file: i,
      line: s
    };
  } else {
    e.pos = t;
    const {
      line: n,
      column: r
    } = he(s, t, {
      offsetLine: 1
    });
    e.loc = {
      column: r,
      file: i,
      line: n
    };
  }

  if (void 0 === e.frame) {
    const {
      line: t,
      column: i
    } = e.loc;

    e.frame = function (e, t, s) {
      let i = e.split("\n");
      const n = Math.max(0, t - 3);
      let r = Math.min(t + 2, i.length);

      for (i = i.slice(n, r); !/\S/.test(i[i.length - 1]);) i.pop(), r -= 1;

      const a = String(r).length;
      return i.map((e, i) => {
        const r = n + i + 1 === t;
        let o = String(i + n + 1);

        for (; o.length < a;) o = ` ${o}`;

        if (r) {
          const t = function (e) {
            let t = "";

            for (; e--;) t += " ";

            return t;
          }(a + 2 + js(e.slice(0, s)).length) + "^";

          return `${o}: ${js(e)}\n${t}`;
        }

        return `${o}: ${js(e)}`;
      }).join("\n");
    }(s, t, i);
  }
}

var Hs;

function qs({
  fileName: e,
  code: t
}, s) {
  const i = {
    code: Hs.CHUNK_INVALID,
    message: `Chunk "${e}" is not valid JavaScript: ${s.message}.`
  };
  return Gs(i, s.loc, t, e), i;
}

function Ks(e, t, s) {
  return {
    code: "INVALID_EXPORT_OPTION",
    message: `"${e}" was specified for "output.exports", but entry module "${re(s)}" has the following exports: ${t.join(", ")}`
  };
}

function Xs(e, t) {
  return {
    code: Hs.INVALID_OPTION,
    message: `Invalid value for option "${e}" - ${t}.`
  };
}

function Ys(e, t, s) {
  return {
    code: Hs.MISSING_EXPORT,
    message: `'${e}' is not exported by ${re(s)}, imported by ${re(t)}`,
    url: "https://rollupjs.org/guide/en/#error-name-is-not-exported-by-module"
  };
}

function Qs(e) {
  const t = Array.from(e.implicitlyLoadedBefore, e => re(e.id)).sort();
  return {
    code: Hs.MISSING_IMPLICIT_DEPENDANT,
    message: `Module "${re(e.id)}" that should be implicitly loaded before ${ie(t)} is not included in the module graph. Either it was not imported by an included module or only via a tree-shaken dynamic import, or no imported bindings were used and it had otherwise no side-effects.`
  };
}

function Zs(e, t, s) {
  return {
    code: Hs.NAMESPACE_CONFLICT,
    message: `Conflicting namespaces: "${re(t.id)}" re-exports "${e}" from both "${re(t.exportsAll[e])}" and "${re(s.exportsAll[e])}" (will be ignored)`,
    name: e,
    reexporter: t.id,
    sources: [t.exportsAll[e], s.exportsAll[e]]
  };
}

function Js(e, t, s, i) {
  return {
    code: Hs.AMBIGUOUS_EXTERNAL_NAMESPACES,
    message: `Ambiguous external namespace resolution: "${re(t)}" re-exports "${e}" from one of the external modules ${ie(i.map(e => re(e)))}, guessing "${re(s)}".`,
    name: e,
    reexporter: t,
    sources: i
  };
}

function ei(e, t, s) {
  const i = s ? "reexport" : "import";
  return {
    code: Hs.UNEXPECTED_NAMED_IMPORT,
    id: e,
    message: `The named export "${t}" was ${i}ed from the external module ${re(e)} even though its interop type is "defaultOnly". Either remove or change this ${i} or change the value of the "output.interop" option.`,
    url: "https://rollupjs.org/guide/en/#outputinterop"
  };
}

function ti(e) {
  return {
    code: Hs.UNEXPECTED_NAMED_IMPORT,
    id: e,
    message: `There was a namespace "*" reexport from the external module ${re(e)} even though its interop type is "defaultOnly". This will be ignored as namespace reexports only reexport named exports. If this is not intended, either remove or change this reexport or change the value of the "output.interop" option.`,
    url: "https://rollupjs.org/guide/en/#outputinterop"
  };
}

function si(e) {
  return {
    code: Hs.VALIDATION_ERROR,
    message: e
  };
}

function ii() {
  return {
    code: Hs.ALREADY_CLOSED,
    message: 'Bundle is already closed, no more calls to "generate" or "write" are allowed.'
  };
}

function ni(e, t, s) {
  ri(e, t, s.onwarn, s.strictDeprecations);
}

function ri(e, t, s, i) {
  if (t || i) {
    const t = function (e) {
      return {
        code: Hs.DEPRECATED_FEATURE,
        ...("string" == typeof e ? {
          message: e
        } : e)
      };
    }(e);

    if (i) return Us(t);
    s(t);
  }
}

!function (e) {
  e.ALREADY_CLOSED = "ALREADY_CLOSED", e.ASSET_NOT_FINALISED = "ASSET_NOT_FINALISED", e.ASSET_NOT_FOUND = "ASSET_NOT_FOUND", e.ASSET_SOURCE_ALREADY_SET = "ASSET_SOURCE_ALREADY_SET", e.ASSET_SOURCE_MISSING = "ASSET_SOURCE_MISSING", e.BAD_LOADER = "BAD_LOADER", e.CANNOT_EMIT_FROM_OPTIONS_HOOK = "CANNOT_EMIT_FROM_OPTIONS_HOOK", e.CHUNK_NOT_GENERATED = "CHUNK_NOT_GENERATED", e.CHUNK_INVALID = "CHUNK_INVALID", e.CIRCULAR_REEXPORT = "CIRCULAR_REEXPORT", e.CYCLIC_CROSS_CHUNK_REEXPORT = "CYCLIC_CROSS_CHUNK_REEXPORT", e.DEPRECATED_FEATURE = "DEPRECATED_FEATURE", e.EXTERNAL_SYNTHETIC_EXPORTS = "EXTERNAL_SYNTHETIC_EXPORTS", e.FILE_NAME_CONFLICT = "FILE_NAME_CONFLICT", e.FILE_NOT_FOUND = "FILE_NOT_FOUND", e.INPUT_HOOK_IN_OUTPUT_PLUGIN = "INPUT_HOOK_IN_OUTPUT_PLUGIN", e.INVALID_CHUNK = "INVALID_CHUNK", e.INVALID_EXPORT_OPTION = "INVALID_EXPORT_OPTION", e.INVALID_EXTERNAL_ID = "INVALID_EXTERNAL_ID", e.INVALID_OPTION = "INVALID_OPTION", e.INVALID_PLUGIN_HOOK = "INVALID_PLUGIN_HOOK", e.INVALID_ROLLUP_PHASE = "INVALID_ROLLUP_PHASE", e.MISSING_EXPORT = "MISSING_EXPORT", e.MISSING_IMPLICIT_DEPENDANT = "MISSING_IMPLICIT_DEPENDANT", e.MIXED_EXPORTS = "MIXED_EXPORTS", e.NAMESPACE_CONFLICT = "NAMESPACE_CONFLICT", e.AMBIGUOUS_EXTERNAL_NAMESPACES = "AMBIGUOUS_EXTERNAL_NAMESPACES", e.NO_TRANSFORM_MAP_OR_AST_WITHOUT_CODE = "NO_TRANSFORM_MAP_OR_AST_WITHOUT_CODE", e.PLUGIN_ERROR = "PLUGIN_ERROR", e.PREFER_NAMED_EXPORTS = "PREFER_NAMED_EXPORTS", e.SYNTHETIC_NAMED_EXPORTS_NEED_NAMESPACE_EXPORT = "SYNTHETIC_NAMED_EXPORTS_NEED_NAMESPACE_EXPORT", e.UNEXPECTED_NAMED_IMPORT = "UNEXPECTED_NAMED_IMPORT", e.UNRESOLVED_ENTRY = "UNRESOLVED_ENTRY", e.UNRESOLVED_IMPORT = "UNRESOLVED_IMPORT", e.VALIDATION_ERROR = "VALIDATION_ERROR";
}(Hs || (Hs = {}));
const ai = "ROLLUP_ASSET_URL_",
      oi = "ROLLUP_FILE_URL_";

const hi = {
  amd: ["document", "module", "URL"],
  cjs: ["document", "require", "URL"],
  es: [],
  iife: ["document", "URL"],
  system: ["module"],
  umd: ["document", "require", "URL"]
},
      li = {
  amd: ["document", "require", "URL"],
  cjs: ["document", "require", "URL"],
  es: [],
  iife: ["document", "URL"],
  system: ["module", "URL"],
  umd: ["document", "require", "URL"]
},
      ci = (e, t = "URL") => `new ${t}(${e}).href`,
      ui = (e, t = !1) => ci(`'${e}', ${t ? "typeof document === 'undefined' ? location.href : " : ""}document.currentScript && document.currentScript.src || document.baseURI`),
      di = e => (t, s) => {
  const i = e(s);
  return null === t ? `({ url: ${i} })` : "url" === t ? i : "undefined";
},
      pi = (e, t = !1) => `${t ? "typeof document === 'undefined' ? location.href : " : ""}(document.currentScript && document.currentScript.src || new URL('${e}', document.baseURI).href)`,
      fi = {
  amd: e => ("." !== e[0] && (e = "./" + e), ci(`require.toUrl('${e}'), document.baseURI`)),
  cjs: e => `(typeof document === 'undefined' ? ${ci(`'file:' + __dirname + '/${e}'`, "(require('u' + 'rl').URL)")} : ${ui(e)})`,
  es: e => ci(`'${e}', import.meta.url`),
  iife: e => ui(e),
  system: e => ci(`'${e}', module.meta.url`),
  umd: e => `(typeof document === 'undefined' && typeof location === 'undefined' ? ${ci(`'file:' + __dirname + '/${e}'`, "(require('u' + 'rl').URL)")} : ${ui(e, !0)})`
},
      mi = {
  amd: di(() => ci("module.uri, document.baseURI")),
  cjs: di(e => `(typeof document === 'undefined' ? ${ci("'file:' + __filename", "(require('u' + 'rl').URL)")} : ${pi(e)})`),
  iife: di(e => pi(e)),
  system: e => null === e ? "module.meta" : `module.meta.${e}`,
  umd: di(e => `(typeof document === 'undefined' && typeof location === 'undefined' ? ${ci("'file:' + __filename", "(require('u' + 'rl').URL)")} : ${pi(e, !0)})`)
};

class gi extends Ce {
  hasEffects(e) {
    if (this.test && this.test.hasEffects(e)) return !0;

    for (const t of this.consequent) {
      if (e.brokenFlow) break;
      if (t.hasEffects(e)) return !0;
    }

    return !1;
  }

  include(e, t) {
    this.included = !0, this.test && this.test.include(e, t);

    for (const s of this.consequent) (t || s.shouldBeIncluded(e)) && s.include(e, t);
  }

  render(e, t, s) {
    if (this.consequent.length) {
      this.test && this.test.render(e, t);
      const i = this.test ? this.test.end : $e(e.original, "default", this.start) + 7,
            n = $e(e.original, ":", i) + 1;
      Oe(this.consequent, e, n, s.end, t);
    } else super.render(e, t);
  }

}

gi.prototype.needsBoundaries = !0;

class yi extends H {
  constructor() {
    super("undefined");
  }

  getLiteralValueAtPath() {}

}

class Ei extends rt {
  constructor(e, t, s) {
    super(e, t, t.declaration, s), this.hasId = !1, this.originalId = null, this.originalVariable = null;
    const i = t.declaration;
    (i instanceof Gt || i instanceof Lt) && i.id ? (this.hasId = !0, this.originalId = i.id) : i instanceof St && (this.originalId = i);
  }

  addReference(e) {
    this.hasId || (this.name = e.name);
  }

  getAssignedVariableName() {
    return this.originalId && this.originalId.name || null;
  }

  getBaseVariableName() {
    const e = this.getOriginalVariable();
    return e === this ? super.getBaseVariableName() : e.getBaseVariableName();
  }

  getDirectOriginalVariable() {
    return !this.originalId || !this.hasId && (this.originalId.isPossibleTDZ() || this.originalId.variable.isReassigned || this.originalId.variable instanceof yi || "syntheticNamespace" in this.originalId.variable) ? null : this.originalId.variable;
  }

  getName() {
    const e = this.getOriginalVariable();
    return e === this ? super.getName() : e.getName();
  }

  getOriginalVariable() {
    if (this.originalVariable) return this.originalVariable;
    let e,
        t = this;
    const s = new Set();

    do {
      s.add(t), e = t, t = e.getDirectOriginalVariable();
    } while (t instanceof Ei && !s.has(t));

    return this.originalVariable = t || e;
  }

}

class xi extends ot {
  constructor(e, t) {
    super(e), this.context = t, this.variables.set("this", new rt("this", null, Ge, t));
  }

  addExportDefaultDeclaration(e, t, s) {
    const i = new Ei(e, t, s);
    return this.variables.set("default", i), i;
  }

  addNamespaceMemberAccess() {}

  deconflict(e, t, s) {
    for (const i of this.children) i.deconflict(e, t, s);
  }

  findLexicalBoundary() {
    return this;
  }

  findVariable(e) {
    const t = this.variables.get(e) || this.accessedOutsideVariables.get(e);
    if (t) return t;
    const s = this.context.traceVariable(e) || this.parent.findVariable(e);
    return s instanceof vt && this.accessedOutsideVariables.set(e, s), s;
  }

}

const vi = {
  "!": e => !e,
  "+": e => +e,
  "-": e => -e,
  delete: () => j,
  typeof: e => typeof e,
  void: () => {},
  "~": e => ~e
};
const bi = {
  ArrayExpression: class extends Ce {
    constructor() {
      super(...arguments), this.objectEntity = null;
    }

    deoptimizePath(e) {
      this.getObjectEntity().deoptimizePath(e);
    }

    deoptimizeThisOnEventAtPath(e, t, s, i) {
      this.getObjectEntity().deoptimizeThisOnEventAtPath(e, t, s, i);
    }

    getLiteralValueAtPath(e, t, s) {
      return this.getObjectEntity().getLiteralValueAtPath(e, t, s);
    }

    getReturnExpressionWhenCalledAtPath(e, t, s, i) {
      return this.getObjectEntity().getReturnExpressionWhenCalledAtPath(e, t, s, i);
    }

    hasEffectsWhenAccessedAtPath(e, t) {
      return this.getObjectEntity().hasEffectsWhenAccessedAtPath(e, t);
    }

    hasEffectsWhenAssignedAtPath(e, t) {
      return this.getObjectEntity().hasEffectsWhenAssignedAtPath(e, t);
    }

    hasEffectsWhenCalledAtPath(e, t, s) {
      return this.getObjectEntity().hasEffectsWhenCalledAtPath(e, t, s);
    }

    getObjectEntity() {
      if (null !== this.objectEntity) return this.objectEntity;
      const e = [{
        key: "length",
        kind: "init",
        property: Xe
      }];
      let t = !1;

      for (let s = 0; s < this.elements.length; s++) {
        const i = this.elements[s];
        i instanceof Bt || t ? i && (t = !0, e.unshift({
          key: O,
          kind: "init",
          property: i
        })) : i ? e.push({
          key: String(s),
          kind: "init",
          property: i
        }) : e.push({
          key: String(s),
          kind: "init",
          property: Ge
        });
      }

      return this.objectEntity = new wt(e, cs);
    }

  },
  ArrayPattern: class extends Ce {
    addExportedVariables(e, t) {
      for (const s of this.elements) null !== s && s.addExportedVariables(e, t);
    }

    declare(e) {
      const t = [];

      for (const s of this.elements) null !== s && t.push(...s.declare(e, G));

      return t;
    }

    deoptimizePath(e) {
      if (0 === e.length) for (const t of this.elements) null !== t && t.deoptimizePath(e);
    }

    hasEffectsWhenAssignedAtPath(e, t) {
      if (e.length > 0) return !0;

      for (const e of this.elements) if (null !== e && e.hasEffectsWhenAssignedAtPath(L, t)) return !0;

      return !1;
    }

    markDeclarationReached() {
      for (const e of this.elements) null !== e && e.markDeclarationReached();
    }

  },
  ArrowFunctionExpression: fs,
  AssignmentExpression: gs,
  AssignmentPattern: class extends Ce {
    constructor() {
      super(...arguments), this.deoptimized = !1;
    }

    addExportedVariables(e, t) {
      this.left.addExportedVariables(e, t);
    }

    declare(e, t) {
      return this.left.declare(e, t);
    }

    deoptimizePath(e) {
      0 === e.length && this.left.deoptimizePath(e);
    }

    hasEffectsWhenAssignedAtPath(e, t) {
      return e.length > 0 || this.left.hasEffectsWhenAssignedAtPath(L, t);
    }

    markDeclarationReached() {
      this.left.markDeclarationReached();
    }

    render(e, t, {
      isShorthandProperty: s
    } = K) {
      this.left.render(e, t, {
        isShorthandProperty: s
      }), this.right.render(e, t);
    }

    applyDeoptimizations() {
      this.deoptimized = !0, this.left.deoptimizePath(L), this.right.deoptimizePath(D), this.context.requestTreeshakingPass();
    }

  },
  AwaitExpression: class extends Ce {
    constructor() {
      super(...arguments), this.deoptimized = !1;
    }

    hasEffects() {
      return this.deoptimized || this.applyDeoptimizations(), !0;
    }

    include(e, t) {
      if (this.deoptimized || this.applyDeoptimizations(), !this.included) {
        this.included = !0;

        e: if (!this.context.usesTopLevelAwait) {
          let e = this.parent;

          do {
            if (e instanceof Ut || e instanceof fs) break e;
          } while (e = e.parent);

          this.context.usesTopLevelAwait = !0;
        }
      }

      this.argument.include(e, t);
    }

    applyDeoptimizations() {
      this.deoptimized = !0, this.argument.deoptimizePath(D), this.context.requestTreeshakingPass();
    }

  },
  BinaryExpression: class extends Ce {
    deoptimizeCache() {}

    getLiteralValueAtPath(e, t, s) {
      if (e.length > 0) return j;
      const i = this.left.getLiteralValueAtPath(L, t, s);
      if (i === j) return j;
      const n = this.right.getLiteralValueAtPath(L, t, s);
      if (n === j) return j;
      const r = ys[this.operator];
      return r ? r(i, n) : j;
    }

    hasEffects(e) {
      return "+" === this.operator && this.parent instanceof ds && "" === this.left.getLiteralValueAtPath(L, z, this) || super.hasEffects(e);
    }

    hasEffectsWhenAccessedAtPath(e) {
      return e.length > 1;
    }

    render(e, t, {
      renderedSurroundingElement: s
    } = K) {
      this.left.render(e, t, {
        renderedSurroundingElement: s
      }), this.right.render(e, t);
    }

  },
  BlockStatement: ps,
  BreakStatement: class extends Ce {
    hasEffects(e) {
      if (this.label) {
        if (!e.ignore.labels.has(this.label.name)) return !0;
        e.includedLabels.add(this.label.name), e.brokenFlow = 2;
      } else {
        if (!e.ignore.breaks) return !0;
        e.brokenFlow = 1;
      }

      return !1;
    }

    include(e) {
      this.included = !0, this.label && (this.label.include(), e.includedLabels.add(this.label.name)), e.brokenFlow = this.label ? 2 : 1;
    }

  },
  CallExpression: class extends Ce {
    constructor() {
      super(...arguments), this.deoptimized = !1, this.deoptimizableDependentExpressions = [], this.expressionsToBeDeoptimized = new Set(), this.returnExpression = null;
    }

    bind() {
      if (super.bind(), this.callee instanceof St) {
        this.scope.findVariable(this.callee.name).isNamespace && this.context.warn({
          code: "CANNOT_CALL_NAMESPACE",
          message: `Cannot call a namespace ('${this.callee.name}')`
        }, this.start), "eval" === this.callee.name && this.context.warn({
          code: "EVAL",
          message: "Use of eval is strongly discouraged, as it poses security risks and may cause issues with minification",
          url: "https://rollupjs.org/guide/en/#avoiding-eval"
        }, this.start);
      }

      this.callOptions = {
        args: this.arguments,
        thisParam: this.callee instanceof vs && !this.callee.variable ? this.callee.object : null,
        withNew: !1
      };
    }

    deoptimizeCache() {
      if (this.returnExpression !== G) {
        this.returnExpression = G;

        for (const e of this.deoptimizableDependentExpressions) e.deoptimizeCache();

        for (const e of this.expressionsToBeDeoptimized) e.deoptimizePath(D);
      }
    }

    deoptimizePath(e) {
      if (0 === e.length || this.context.deoptimizationTracker.trackEntityAtPathAndGetIfTracked(e, this)) return;
      const t = this.getReturnExpression();
      t !== G && t.deoptimizePath(e);
    }

    deoptimizeThisOnEventAtPath(e, t, s, i) {
      const n = this.getReturnExpression(i);
      n === G ? s.deoptimizePath(D) : i.withTrackedEntityAtPath(t, n, () => {
        this.expressionsToBeDeoptimized.add(s), n.deoptimizeThisOnEventAtPath(e, t, s, i);
      }, void 0);
    }

    getLiteralValueAtPath(e, t, s) {
      const i = this.getReturnExpression(t);
      return i === G ? j : t.withTrackedEntityAtPath(e, i, () => (this.deoptimizableDependentExpressions.push(s), i.getLiteralValueAtPath(e, t, s)), j);
    }

    getReturnExpressionWhenCalledAtPath(e, t, s, i) {
      const n = this.getReturnExpression(s);
      return this.returnExpression === G ? G : s.withTrackedEntityAtPath(e, n, () => (this.deoptimizableDependentExpressions.push(i), n.getReturnExpressionWhenCalledAtPath(e, t, s, i)), G);
    }

    hasEffects(e) {
      try {
        for (const t of this.arguments) if (t.hasEffects(e)) return !0;

        return (!this.context.options.treeshake.annotations || !this.annotations) && (this.callee.hasEffects(e) || this.callee.hasEffectsWhenCalledAtPath(L, this.callOptions, e));
      } finally {
        this.deoptimized || this.applyDeoptimizations();
      }
    }

    hasEffectsWhenAccessedAtPath(e, t) {
      return !t.accessed.trackEntityAtPathAndGetIfTracked(e, this) && this.getReturnExpression().hasEffectsWhenAccessedAtPath(e, t);
    }

    hasEffectsWhenAssignedAtPath(e, t) {
      return !t.assigned.trackEntityAtPathAndGetIfTracked(e, this) && this.getReturnExpression().hasEffectsWhenAssignedAtPath(e, t);
    }

    hasEffectsWhenCalledAtPath(e, t, s) {
      return !(t.withNew ? s.instantiated : s.called).trackEntityAtPathAndGetIfTracked(e, t, this) && this.getReturnExpression().hasEffectsWhenCalledAtPath(e, t, s);
    }

    include(e, t) {
      this.deoptimized || this.applyDeoptimizations(), t ? (super.include(e, t), "variables" === t && this.callee instanceof St && this.callee.variable && this.callee.variable.markCalledFromTryStatement()) : (this.included = !0, this.callee.include(e, !1)), this.callee.includeCallArguments(e, this.arguments);
      const s = this.getReturnExpression();
      s.included || s.include(e, !1);
    }

    render(e, t, {
      renderedSurroundingElement: s
    } = K) {
      if (this.callee.render(e, t, {
        isCalleeOfRenderedParent: !0,
        renderedSurroundingElement: s
      }), this.arguments.length > 0) if (this.arguments[this.arguments.length - 1].included) for (const s of this.arguments) s.render(e, t);else {
        let s = this.arguments.length - 2;

        for (; s >= 0 && !this.arguments[s].included;) s--;

        if (s >= 0) {
          for (let i = 0; i <= s; i++) this.arguments[i].render(e, t);

          e.remove($e(e.original, ",", this.arguments[s].end), this.end - 1);
        } else e.remove($e(e.original, "(", this.callee.end) + 1, this.end - 1);
      }
    }

    applyDeoptimizations() {
      this.deoptimized = !0;
      const {
        thisParam: e
      } = this.callOptions;
      e && this.callee.deoptimizeThisOnEventAtPath(2, L, e, z);

      for (const e of this.arguments) e.deoptimizePath(D);

      this.context.requestTreeshakingPass();
    }

    getReturnExpression(e = z) {
      return null === this.returnExpression ? (this.returnExpression = G, this.returnExpression = this.callee.getReturnExpressionWhenCalledAtPath(L, this.callOptions, e, this)) : this.returnExpression;
    }

  },
  CatchClause: class extends Ce {
    createScope(e) {
      this.scope = new bs(e, this.context);
    }

    parseNode(e) {
      const {
        param: t
      } = e;
      t && (this.param = new (this.context.nodeConstructors[t.type] || this.context.nodeConstructors.UnknownNode)(t, this, this.scope), this.param.declare("parameter", G)), super.parseNode(e);
    }

  },
  ChainExpression: class extends Ce {},
  ClassBody: class extends Ce {
    createScope(e) {
      this.scope = new Ss(e, this.parent, this.context);
    }

    include(e, t) {
      this.included = !0, this.context.includeVariableInModule(this.scope.thisVariable);

      for (const s of this.body) s.include(e, t);
    }

    parseNode(e) {
      const t = this.body = [];

      for (const s of e.body) t.push(new this.context.nodeConstructors[s.type](s, this, s.static ? this.scope : this.scope.instanceScope));

      super.parseNode(e);
    }

  },
  ClassDeclaration: Lt,
  ClassExpression: class extends Ot {
    render(e, t, {
      renderedSurroundingElement: s
    } = K) {
      super.render(e, t), "ExpressionStatement" === s && (e.appendRight(this.start, "("), e.prependLeft(this.end, ")"));
    }

  },
  ConditionalExpression: class extends Ce {
    constructor() {
      super(...arguments), this.expressionsToBeDeoptimized = [], this.isBranchResolutionAnalysed = !1, this.usedBranch = null;
    }

    deoptimizeCache() {
      if (null !== this.usedBranch) {
        const e = this.usedBranch === this.consequent ? this.alternate : this.consequent;
        this.usedBranch = null, e.deoptimizePath(D);

        for (const e of this.expressionsToBeDeoptimized) e.deoptimizeCache();
      }
    }

    deoptimizePath(e) {
      const t = this.getUsedBranch();
      null === t ? (this.consequent.deoptimizePath(e), this.alternate.deoptimizePath(e)) : t.deoptimizePath(e);
    }

    deoptimizeThisOnEventAtPath(e, t, s, i) {
      this.consequent.deoptimizeThisOnEventAtPath(e, t, s, i), this.alternate.deoptimizeThisOnEventAtPath(e, t, s, i);
    }

    getLiteralValueAtPath(e, t, s) {
      const i = this.getUsedBranch();
      return null === i ? j : (this.expressionsToBeDeoptimized.push(s), i.getLiteralValueAtPath(e, t, s));
    }

    getReturnExpressionWhenCalledAtPath(e, t, s, i) {
      const n = this.getUsedBranch();
      return null === n ? new As([this.consequent.getReturnExpressionWhenCalledAtPath(e, t, s, i), this.alternate.getReturnExpressionWhenCalledAtPath(e, t, s, i)]) : (this.expressionsToBeDeoptimized.push(i), n.getReturnExpressionWhenCalledAtPath(e, t, s, i));
    }

    hasEffects(e) {
      if (this.test.hasEffects(e)) return !0;
      const t = this.getUsedBranch();
      return null === t ? this.consequent.hasEffects(e) || this.alternate.hasEffects(e) : t.hasEffects(e);
    }

    hasEffectsWhenAccessedAtPath(e, t) {
      const s = this.getUsedBranch();
      return null === s ? this.consequent.hasEffectsWhenAccessedAtPath(e, t) || this.alternate.hasEffectsWhenAccessedAtPath(e, t) : s.hasEffectsWhenAccessedAtPath(e, t);
    }

    hasEffectsWhenAssignedAtPath(e, t) {
      const s = this.getUsedBranch();
      return null === s ? this.consequent.hasEffectsWhenAssignedAtPath(e, t) || this.alternate.hasEffectsWhenAssignedAtPath(e, t) : s.hasEffectsWhenAssignedAtPath(e, t);
    }

    hasEffectsWhenCalledAtPath(e, t, s) {
      const i = this.getUsedBranch();
      return null === i ? this.consequent.hasEffectsWhenCalledAtPath(e, t, s) || this.alternate.hasEffectsWhenCalledAtPath(e, t, s) : i.hasEffectsWhenCalledAtPath(e, t, s);
    }

    include(e, t) {
      this.included = !0;
      const s = this.getUsedBranch();
      t || this.test.shouldBeIncluded(e) || null === s ? (this.test.include(e, t), this.consequent.include(e, t), this.alternate.include(e, t)) : s.include(e, t);
    }

    includeCallArguments(e, t) {
      const s = this.getUsedBranch();
      null === s ? (this.consequent.includeCallArguments(e, t), this.alternate.includeCallArguments(e, t)) : s.includeCallArguments(e, t);
    }

    render(e, t, {
      isCalleeOfRenderedParent: s,
      preventASI: i,
      renderedParentType: n,
      renderedSurroundingElement: r
    } = K) {
      const a = this.getUsedBranch();
      if (this.test.included) this.test.render(e, t, {
        renderedSurroundingElement: r
      }), this.consequent.render(e, t), this.alternate.render(e, t);else {
        const o = $e(e.original, ":", this.consequent.end),
              h = Re(e.original, (this.consequent.included ? $e(e.original, "?", this.test.end) : o) + 1);
        i && De(e, h, a.start), e.remove(this.start, h), this.consequent.included && e.remove(o, this.end), Ne(this, e), a.render(e, t, {
          isCalleeOfRenderedParent: s,
          preventASI: !0,
          renderedParentType: n || this.parent.type,
          renderedSurroundingElement: r || this.parent.type
        });
      }
    }

    getUsedBranch() {
      if (this.isBranchResolutionAnalysed) return this.usedBranch;
      this.isBranchResolutionAnalysed = !0;
      const e = this.test.getLiteralValueAtPath(L, z, this);
      return e === j ? null : this.usedBranch = e ? this.consequent : this.alternate;
    }

  },
  ContinueStatement: class extends Ce {
    hasEffects(e) {
      if (this.label) {
        if (!e.ignore.labels.has(this.label.name)) return !0;
        e.includedLabels.add(this.label.name), e.brokenFlow = 2;
      } else {
        if (!e.ignore.continues) return !0;
        e.brokenFlow = 1;
      }

      return !1;
    }

    include(e) {
      this.included = !0, this.label && (this.label.include(), e.includedLabels.add(this.label.name)), e.brokenFlow = this.label ? 2 : 1;
    }

  },
  DoWhileStatement: class extends Ce {
    hasEffects(e) {
      if (this.test.hasEffects(e)) return !0;
      const {
        brokenFlow: t,
        ignore: {
          breaks: s,
          continues: i
        }
      } = e;
      return e.ignore.breaks = !0, e.ignore.continues = !0, !!this.body.hasEffects(e) || (e.ignore.breaks = s, e.ignore.continues = i, e.brokenFlow = t, !1);
    }

    include(e, t) {
      this.included = !0, this.test.include(e, t);
      const {
        brokenFlow: s
      } = e;
      this.body.includeAsSingleStatement(e, t), e.brokenFlow = s;
    }

  },
  EmptyStatement: class extends Ce {
    hasEffects() {
      return !1;
    }

  },
  ExportAllDeclaration: we,
  ExportDefaultDeclaration: Ht,
  ExportNamedDeclaration: Ps,
  ExportSpecifier: class extends Ce {},
  ExpressionStatement: ds,
  ForInStatement: class extends Ce {
    constructor() {
      super(...arguments), this.deoptimized = !1;
    }

    createScope(e) {
      this.scope = new us(e);
    }

    hasEffects(e) {
      if (this.deoptimized || this.applyDeoptimizations(), this.left && (this.left.hasEffects(e) || this.left.hasEffectsWhenAssignedAtPath(L, e)) || this.right && this.right.hasEffects(e)) return !0;
      const {
        brokenFlow: t,
        ignore: {
          breaks: s,
          continues: i
        }
      } = e;
      return e.ignore.breaks = !0, e.ignore.continues = !0, !!this.body.hasEffects(e) || (e.ignore.breaks = s, e.ignore.continues = i, e.brokenFlow = t, !1);
    }

    include(e, t) {
      this.deoptimized || this.applyDeoptimizations(), this.included = !0, this.left.include(e, t || !0), this.right.include(e, t);
      const {
        brokenFlow: s
      } = e;
      this.body.includeAsSingleStatement(e, t), e.brokenFlow = s;
    }

    render(e, t) {
      this.left.render(e, t, _e), this.right.render(e, t, _e), 110 === e.original.charCodeAt(this.right.start - 1) && e.prependLeft(this.right.start, " "), this.body.render(e, t);
    }

    applyDeoptimizations() {
      this.deoptimized = !0, this.left.deoptimizePath(L), this.context.requestTreeshakingPass();
    }

  },
  ForOfStatement: class extends Ce {
    constructor() {
      super(...arguments), this.deoptimized = !1;
    }

    createScope(e) {
      this.scope = new us(e);
    }

    hasEffects() {
      return this.deoptimized || this.applyDeoptimizations(), !0;
    }

    include(e, t) {
      this.deoptimized || this.applyDeoptimizations(), this.included = !0, this.left.include(e, t || !0), this.right.include(e, t);
      const {
        brokenFlow: s
      } = e;
      this.body.includeAsSingleStatement(e, t), e.brokenFlow = s;
    }

    render(e, t) {
      this.left.render(e, t, _e), this.right.render(e, t, _e), 102 === e.original.charCodeAt(this.right.start - 1) && e.prependLeft(this.right.start, " "), this.body.render(e, t);
    }

    applyDeoptimizations() {
      this.deoptimized = !0, this.left.deoptimizePath(L), this.context.requestTreeshakingPass();
    }

  },
  ForStatement: class extends Ce {
    createScope(e) {
      this.scope = new us(e);
    }

    hasEffects(e) {
      if (this.init && this.init.hasEffects(e) || this.test && this.test.hasEffects(e) || this.update && this.update.hasEffects(e)) return !0;
      const {
        brokenFlow: t,
        ignore: {
          breaks: s,
          continues: i
        }
      } = e;
      return e.ignore.breaks = !0, e.ignore.continues = !0, !!this.body.hasEffects(e) || (e.ignore.breaks = s, e.ignore.continues = i, e.brokenFlow = t, !1);
    }

    include(e, t) {
      this.included = !0, this.init && this.init.includeAsSingleStatement(e, t), this.test && this.test.include(e, t);
      const {
        brokenFlow: s
      } = e;
      this.update && this.update.include(e, t), this.body.includeAsSingleStatement(e, t), e.brokenFlow = s;
    }

    render(e, t) {
      this.init && this.init.render(e, t, _e), this.test && this.test.render(e, t, _e), this.update && this.update.render(e, t, _e), this.body.render(e, t);
    }

  },
  FunctionDeclaration: Gt,
  FunctionExpression: class extends Ut {
    render(e, t, {
      renderedSurroundingElement: s
    } = K) {
      super.render(e, t), "ExpressionStatement" === s && (e.appendRight(this.start, "("), e.prependLeft(this.end, ")"));
    }

  },
  Identifier: St,
  IfStatement: ws,
  ImportDeclaration: Is,
  ImportDefaultSpecifier: class extends Ce {},
  ImportExpression: class extends Ce {
    constructor() {
      super(...arguments), this.inlineNamespace = null, this.mechanism = null, this.resolution = null;
    }

    hasEffects() {
      return !0;
    }

    include(e, t) {
      this.included || (this.included = !0, this.context.includeDynamicImport(this), this.scope.addAccessedDynamicImport(this)), this.source.include(e, t);
    }

    initialise() {
      this.context.addDynamicImport(this);
    }

    render(e, t) {
      if (this.inlineNamespace) {
        const s = t.compact ? "" : " ",
              i = t.compact ? "" : ";";
        e.overwrite(this.start, this.end, `Promise.resolve().then(function${s}()${s}{${s}return ${this.inlineNamespace.getName()}${i}${s}})`, {
          contentOnly: !0
        });
      } else this.mechanism && (e.overwrite(this.start, $e(e.original, "(", this.start + 6) + 1, this.mechanism.left, {
        contentOnly: !0
      }), e.overwrite(this.end - 1, this.end, this.mechanism.right, {
        contentOnly: !0
      })), this.source.render(e, t);
    }

    renderFinalResolution(e, t, s, i) {
      if (e.overwrite(this.source.start, this.source.end, t), s) {
        const t = i.compact ? "" : " ",
              n = i.compact ? "" : ";";
        e.prependLeft(this.end, `.then(function${t}(n)${t}{${t}return n.${s}${n}${t}})`);
      }
    }

    setExternalResolution(e, t, s, i, n) {
      this.resolution = t;
      const r = [...(Ws[s.format] || [])];
      let a;
      ({
        helper: a,
        mechanism: this.mechanism
      } = this.getDynamicImportMechanismAndHelper(t, e, s, i)), a && r.push(a), r.length > 0 && this.scope.addAccessedGlobals(r, n);
    }

    setInternalResolution(e) {
      this.inlineNamespace = e;
    }

    getDynamicImportMechanismAndHelper(e, t, s, i) {
      const n = i.hookFirstSync("renderDynamicImport", [{
        customResolution: "string" == typeof this.resolution ? this.resolution : null,
        format: s.format,
        moduleId: this.context.module.id,
        targetModuleId: this.resolution && "string" != typeof this.resolution ? this.resolution.id : null
      }]);
      if (n) return {
        helper: null,
        mechanism: n
      };

      switch (s.format) {
        case "cjs":
          {
            const i = s.compact ? "" : " ",
                  n = s.compact ? "" : ";",
                  r = `Promise.resolve().then(function${i}()${i}{${i}return`,
                  a = zs(e, t, s.interop);
            return {
              helper: a,
              mechanism: a ? {
                left: `${r} /*#__PURE__*/${a}(require(`,
                right: `))${n}${i}})`
              } : {
                left: `${r} require(`,
                right: `)${n}${i}})`
              }
            };
          }

        case "amd":
          {
            const i = s.compact ? "" : " ",
                  n = s.compact ? "c" : "resolve",
                  r = s.compact ? "e" : "reject",
                  a = zs(e, t, s.interop);
            return {
              helper: a,
              mechanism: {
                left: `new Promise(function${i}(${n},${i}${r})${i}{${i}require([`,
                right: `],${i}${a ? `function${i}(m)${i}{${i}${n}(/*#__PURE__*/${a}(m));${i}}` : n},${i}${r})${i}})`
              }
            };
          }

        case "system":
          return {
            helper: null,
            mechanism: {
              left: "module.import(",
              right: ")"
            }
          };

        case "es":
          if (s.dynamicImportFunction) return {
            helper: null,
            mechanism: {
              left: `${s.dynamicImportFunction}(`,
              right: ")"
            }
          };
      }

      return {
        helper: null,
        mechanism: null
      };
    }

  },
  ImportNamespaceSpecifier: class extends Ce {},
  ImportSpecifier: class extends Ce {},
  LabeledStatement: class extends Ce {
    hasEffects(e) {
      const t = e.brokenFlow;
      return e.ignore.labels.add(this.label.name), !!this.body.hasEffects(e) || (e.ignore.labels.delete(this.label.name), e.includedLabels.has(this.label.name) && (e.includedLabels.delete(this.label.name), e.brokenFlow = t), !1);
    }

    include(e, t) {
      this.included = !0;
      const s = e.brokenFlow;
      this.body.include(e, t), (t || e.includedLabels.has(this.label.name)) && (this.label.include(), e.includedLabels.delete(this.label.name), e.brokenFlow = s);
    }

    render(e, t) {
      this.label.included ? this.label.render(e, t) : e.remove(this.start, Re(e.original, $e(e.original, ":", this.label.end) + 1)), this.body.render(e, t);
    }

  },
  Literal: qt,
  LogicalExpression: class extends Ce {
    constructor() {
      super(...arguments), this.expressionsToBeDeoptimized = [], this.isBranchResolutionAnalysed = !1, this.usedBranch = null;
    }

    deoptimizeCache() {
      if (null !== this.usedBranch) {
        const e = this.usedBranch === this.left ? this.right : this.left;
        this.usedBranch = null, e.deoptimizePath(D);

        for (const e of this.expressionsToBeDeoptimized) e.deoptimizeCache();
      }
    }

    deoptimizePath(e) {
      const t = this.getUsedBranch();
      null === t ? (this.left.deoptimizePath(e), this.right.deoptimizePath(e)) : t.deoptimizePath(e);
    }

    deoptimizeThisOnEventAtPath(e, t, s, i) {
      this.left.deoptimizeThisOnEventAtPath(e, t, s, i), this.right.deoptimizeThisOnEventAtPath(e, t, s, i);
    }

    getLiteralValueAtPath(e, t, s) {
      const i = this.getUsedBranch();
      return null === i ? j : (this.expressionsToBeDeoptimized.push(s), i.getLiteralValueAtPath(e, t, s));
    }

    getReturnExpressionWhenCalledAtPath(e, t, s, i) {
      const n = this.getUsedBranch();
      return null === n ? new As([this.left.getReturnExpressionWhenCalledAtPath(e, t, s, i), this.right.getReturnExpressionWhenCalledAtPath(e, t, s, i)]) : (this.expressionsToBeDeoptimized.push(i), n.getReturnExpressionWhenCalledAtPath(e, t, s, i));
    }

    hasEffects(e) {
      return !!this.left.hasEffects(e) || this.getUsedBranch() !== this.left && this.right.hasEffects(e);
    }

    hasEffectsWhenAccessedAtPath(e, t) {
      const s = this.getUsedBranch();
      return null === s ? this.left.hasEffectsWhenAccessedAtPath(e, t) || this.right.hasEffectsWhenAccessedAtPath(e, t) : s.hasEffectsWhenAccessedAtPath(e, t);
    }

    hasEffectsWhenAssignedAtPath(e, t) {
      const s = this.getUsedBranch();
      return null === s ? this.left.hasEffectsWhenAssignedAtPath(e, t) || this.right.hasEffectsWhenAssignedAtPath(e, t) : s.hasEffectsWhenAssignedAtPath(e, t);
    }

    hasEffectsWhenCalledAtPath(e, t, s) {
      const i = this.getUsedBranch();
      return null === i ? this.left.hasEffectsWhenCalledAtPath(e, t, s) || this.right.hasEffectsWhenCalledAtPath(e, t, s) : i.hasEffectsWhenCalledAtPath(e, t, s);
    }

    include(e, t) {
      this.included = !0;
      const s = this.getUsedBranch();
      t || s === this.right && this.left.shouldBeIncluded(e) || null === s ? (this.left.include(e, t), this.right.include(e, t)) : s.include(e, t);
    }

    render(e, t, {
      isCalleeOfRenderedParent: s,
      preventASI: i,
      renderedParentType: n,
      renderedSurroundingElement: r
    } = K) {
      if (this.left.included && this.right.included) this.left.render(e, t, {
        preventASI: i,
        renderedSurroundingElement: r
      }), this.right.render(e, t);else {
        const a = $e(e.original, this.operator, this.left.end);

        if (this.right.included) {
          const t = Re(e.original, a + 2);
          e.remove(this.start, t), i && De(e, t, this.right.start);
        } else e.remove(a, this.end);

        Ne(this, e), this.getUsedBranch().render(e, t, {
          isCalleeOfRenderedParent: s,
          preventASI: i,
          renderedParentType: n || this.parent.type,
          renderedSurroundingElement: r || this.parent.type
        });
      }
    }

    getUsedBranch() {
      if (!this.isBranchResolutionAnalysed) {
        this.isBranchResolutionAnalysed = !0;
        const e = this.left.getLiteralValueAtPath(L, z, this);
        if (e === j) return null;
        this.usedBranch = "||" === this.operator && e || "&&" === this.operator && !e || "??" === this.operator && null != e ? this.left : this.right;
      }

      return this.usedBranch;
    }

  },
  MemberExpression: vs,
  MetaProperty: class extends Ce {
    addAccessedGlobals(e, t) {
      const s = this.metaProperty,
            i = (s && (s.startsWith(oi) || s.startsWith(ai) || s.startsWith("ROLLUP_CHUNK_URL_")) ? li : hi)[e];
      i.length > 0 && this.scope.addAccessedGlobals(i, t);
    }

    getReferencedFileName(e) {
      const t = this.metaProperty;
      return t && t.startsWith(oi) ? e.getFileName(t.substr(oi.length)) : null;
    }

    hasEffects() {
      return !1;
    }

    hasEffectsWhenAccessedAtPath(e) {
      return e.length > 1;
    }

    include() {
      if (!this.included && (this.included = !0, "import" === this.meta.name)) {
        this.context.addImportMeta(this);
        const e = this.parent;
        this.metaProperty = e instanceof vs && "string" == typeof e.propertyKey ? e.propertyKey : null;
      }
    }

    renderFinalMechanism(e, t, s, i) {
      var n;
      const r = this.parent,
            a = this.metaProperty;

      if (a && (a.startsWith(oi) || a.startsWith(ai) || a.startsWith("ROLLUP_CHUNK_URL_"))) {
        let n,
            o = null,
            h = null,
            l = null;
        a.startsWith(oi) ? (o = a.substr(oi.length), n = i.getFileName(o)) : a.startsWith(ai) ? (ni(`Using the "${ai}" prefix to reference files is deprecated. Use the "${oi}" prefix instead.`, !0, this.context.options), h = a.substr(ai.length), n = i.getFileName(h)) : (ni(`Using the "ROLLUP_CHUNK_URL_" prefix to reference files is deprecated. Use the "${oi}" prefix instead.`, !0, this.context.options), l = a.substr("ROLLUP_CHUNK_URL_".length), n = i.getFileName(l));
        const c = C(_(I(t), n));
        let u;
        return null !== h && (u = i.hookFirstSync("resolveAssetUrl", [{
          assetFileName: n,
          chunkId: t,
          format: s,
          moduleId: this.context.module.id,
          relativeAssetPath: c
        }])), u || (u = i.hookFirstSync("resolveFileUrl", [{
          assetReferenceId: h,
          chunkId: t,
          chunkReferenceId: l,
          fileName: n,
          format: s,
          moduleId: this.context.module.id,
          referenceId: o || h || l,
          relativePath: c
        }]) || fi[s](c)), void e.overwrite(r.start, r.end, u, {
          contentOnly: !0
        });
      }

      const o = i.hookFirstSync("resolveImportMeta", [a, {
        chunkId: t,
        format: s,
        moduleId: this.context.module.id
      }]) || (null === (n = mi[s]) || void 0 === n ? void 0 : n.call(mi, a, t));
      "string" == typeof o && (r instanceof vs ? e.overwrite(r.start, r.end, o, {
        contentOnly: !0
      }) : e.overwrite(this.start, this.end, o, {
        contentOnly: !0
      }));
    }

  },
  MethodDefinition: kt,
  NewExpression: class extends Ce {
    constructor() {
      super(...arguments), this.deoptimized = !1;
    }

    hasEffects(e) {
      this.deoptimized || this.applyDeoptimizations();

      for (const t of this.arguments) if (t.hasEffects(e)) return !0;

      return (!this.context.options.treeshake.annotations || !this.annotations) && (this.callee.hasEffects(e) || this.callee.hasEffectsWhenCalledAtPath(L, this.callOptions, e));
    }

    hasEffectsWhenAccessedAtPath(e) {
      return e.length > 0;
    }

    initialise() {
      this.callOptions = {
        args: this.arguments,
        thisParam: null,
        withNew: !0
      };
    }

    applyDeoptimizations() {
      this.deoptimized = !0;

      for (const e of this.arguments) e.deoptimizePath(D);

      this.context.requestTreeshakingPass();
    }

  },
  ObjectExpression: class extends Ce {
    constructor() {
      super(...arguments), this.objectEntity = null;
    }

    deoptimizeCache() {
      this.getObjectEntity().deoptimizeAllProperties();
    }

    deoptimizePath(e) {
      this.getObjectEntity().deoptimizePath(e);
    }

    deoptimizeThisOnEventAtPath(e, t, s, i) {
      this.getObjectEntity().deoptimizeThisOnEventAtPath(e, t, s, i);
    }

    getLiteralValueAtPath(e, t, s) {
      return this.getObjectEntity().getLiteralValueAtPath(e, t, s);
    }

    getReturnExpressionWhenCalledAtPath(e, t, s, i) {
      return this.getObjectEntity().getReturnExpressionWhenCalledAtPath(e, t, s, i);
    }

    hasEffectsWhenAccessedAtPath(e, t) {
      return this.getObjectEntity().hasEffectsWhenAccessedAtPath(e, t);
    }

    hasEffectsWhenAssignedAtPath(e, t) {
      return this.getObjectEntity().hasEffectsWhenAssignedAtPath(e, t);
    }

    hasEffectsWhenCalledAtPath(e, t, s) {
      return this.getObjectEntity().hasEffectsWhenCalledAtPath(e, t, s);
    }

    render(e, t, {
      renderedSurroundingElement: s
    } = K) {
      super.render(e, t), "ExpressionStatement" !== s && "ArrowFunctionExpression" !== s || (e.appendRight(this.start, "("), e.prependLeft(this.end, ")"));
    }

    getObjectEntity() {
      if (null !== this.objectEntity) return this.objectEntity;
      let e = Mt;
      const t = [];

      for (const s of this.properties) {
        if (s instanceof Bt) {
          t.push({
            key: M,
            kind: "init",
            property: s
          });
          continue;
        }

        let i;

        if (s.computed) {
          const e = s.key.getLiteralValueAtPath(L, z, this);

          if (e === j) {
            t.push({
              key: M,
              kind: s.kind,
              property: s
            });
            continue;
          }

          i = String(e);
        } else if (i = s.key instanceof St ? s.key.name : String(s.key.value), "__proto__" === i && "init" === s.kind) {
          e = s.value instanceof qt && null === s.value.value ? null : s.value;
          continue;
        }

        t.push({
          key: i,
          kind: s.kind,
          property: s
        });
      }

      return this.objectEntity = new wt(t, e);
    }

  },
  ObjectPattern: ms,
  PrivateIdentifier: class extends Ce {},
  Program: Kt,
  Property: class extends Pt {
    constructor() {
      super(...arguments), this.deoptimized = !1, this.declarationInit = null;
    }

    declare(e, t) {
      return this.declarationInit = t, this.value.declare(e, G);
    }

    hasEffects(e) {
      this.deoptimized || this.applyDeoptimizations();
      const t = this.context.options.treeshake.propertyReadSideEffects;
      return "ObjectPattern" === this.parent.type && "always" === t || this.key.hasEffects(e) || this.value.hasEffects(e);
    }

    markDeclarationReached() {
      this.value.markDeclarationReached();
    }

    render(e, t) {
      this.shorthand || this.key.render(e, t), this.value.render(e, t, {
        isShorthandProperty: this.shorthand
      });
    }

    applyDeoptimizations() {
      this.deoptimized = !0, null !== this.declarationInit && (this.declarationInit.deoptimizePath([M, M]), this.context.requestTreeshakingPass());
    }

  },
  PropertyDefinition: class extends Ce {
    deoptimizePath(e) {
      var t;
      null === (t = this.value) || void 0 === t || t.deoptimizePath(e);
    }

    deoptimizeThisOnEventAtPath(e, t, s, i) {
      var n;
      null === (n = this.value) || void 0 === n || n.deoptimizeThisOnEventAtPath(e, t, s, i);
    }

    getLiteralValueAtPath(e, t, s) {
      return this.value ? this.value.getLiteralValueAtPath(e, t, s) : j;
    }

    getReturnExpressionWhenCalledAtPath(e, t, s, i) {
      return this.value ? this.value.getReturnExpressionWhenCalledAtPath(e, t, s, i) : G;
    }

    hasEffects(e) {
      return this.key.hasEffects(e) || this.static && null !== this.value && this.value.hasEffects(e);
    }

    hasEffectsWhenAccessedAtPath(e, t) {
      return !this.value || this.value.hasEffectsWhenAccessedAtPath(e, t);
    }

    hasEffectsWhenAssignedAtPath(e, t) {
      return !this.value || this.value.hasEffectsWhenAssignedAtPath(e, t);
    }

    hasEffectsWhenCalledAtPath(e, t, s) {
      return !this.value || this.value.hasEffectsWhenCalledAtPath(e, t, s);
    }

  },
  RestElement: jt,
  ReturnStatement: class extends Ce {
    hasEffects(e) {
      return !(e.ignore.returnYield && (null === this.argument || !this.argument.hasEffects(e))) || (e.brokenFlow = 2, !1);
    }

    include(e, t) {
      this.included = !0, this.argument && this.argument.include(e, t), e.brokenFlow = 2;
    }

    initialise() {
      this.scope.addReturnExpression(this.argument || G);
    }

    render(e, t) {
      this.argument && (this.argument.render(e, t, {
        preventASI: !0
      }), this.argument.start === this.start + 6 && e.prependLeft(this.start + 6, " "));
    }

  },
  SequenceExpression: class extends Ce {
    deoptimizePath(e) {
      this.expressions[this.expressions.length - 1].deoptimizePath(e);
    }

    deoptimizeThisOnEventAtPath(e, t, s, i) {
      this.expressions[this.expressions.length - 1].deoptimizeThisOnEventAtPath(e, t, s, i);
    }

    getLiteralValueAtPath(e, t, s) {
      return this.expressions[this.expressions.length - 1].getLiteralValueAtPath(e, t, s);
    }

    hasEffects(e) {
      for (const t of this.expressions) if (t.hasEffects(e)) return !0;

      return !1;
    }

    hasEffectsWhenAccessedAtPath(e, t) {
      return e.length > 0 && this.expressions[this.expressions.length - 1].hasEffectsWhenAccessedAtPath(e, t);
    }

    hasEffectsWhenAssignedAtPath(e, t) {
      return this.expressions[this.expressions.length - 1].hasEffectsWhenAssignedAtPath(e, t);
    }

    hasEffectsWhenCalledAtPath(e, t, s) {
      return this.expressions[this.expressions.length - 1].hasEffectsWhenCalledAtPath(e, t, s);
    }

    include(e, t) {
      this.included = !0;
      const s = this.expressions[this.expressions.length - 1];

      for (const i of this.expressions) (t || i === s && !(this.parent instanceof ds) || i.shouldBeIncluded(e)) && i.include(e, t);
    }

    render(e, t, {
      renderedParentType: s,
      isCalleeOfRenderedParent: i,
      preventASI: n
    } = K) {
      let r = 0,
          a = null;
      const o = this.expressions[this.expressions.length - 1];

      for (const {
        node: h,
        separator: l,
        start: c,
        end: u
      } of Le(this.expressions, e, this.start, this.end)) if (h.included) {
        if (r++, a = l, 1 === r && n && De(e, c, h.start), 1 === r) {
          const n = s || this.parent.type;
          h.render(e, t, {
            isCalleeOfRenderedParent: i && h === o,
            renderedParentType: n,
            renderedSurroundingElement: n
          });
        } else h.render(e, t);
      } else Ie(h, e, c, u);

      a && e.remove(a, this.end);
    }

  },
  SpreadElement: Bt,
  Super: class extends Ce {
    bind() {
      this.variable = this.scope.findVariable("this");
    }

    deoptimizePath(e) {
      this.variable.deoptimizePath(e);
    }

    include() {
      this.included || (this.included = !0, this.context.includeVariableInModule(this.variable));
    }

  },
  SwitchCase: gi,
  SwitchStatement: class extends Ce {
    createScope(e) {
      this.scope = new us(e);
    }

    hasEffects(e) {
      if (this.discriminant.hasEffects(e)) return !0;
      const {
        brokenFlow: t,
        ignore: {
          breaks: s
        }
      } = e;
      let i = 1 / 0;
      e.ignore.breaks = !0;

      for (const s of this.cases) {
        if (s.hasEffects(e)) return !0;
        i = e.brokenFlow < i ? e.brokenFlow : i, e.brokenFlow = t;
      }

      return null !== this.defaultCase && 1 !== i && (e.brokenFlow = i), e.ignore.breaks = s, !1;
    }

    include(e, t) {
      this.included = !0, this.discriminant.include(e, t);
      const {
        brokenFlow: s
      } = e;
      let i = 1 / 0,
          n = t || null !== this.defaultCase && this.defaultCase < this.cases.length - 1;

      for (let r = this.cases.length - 1; r >= 0; r--) {
        const a = this.cases[r];

        if (a.included && (n = !0), !n) {
          const e = de();
          e.ignore.breaks = !0, n = a.hasEffects(e);
        }

        n ? (a.include(e, t), i = i < e.brokenFlow ? i : e.brokenFlow, e.brokenFlow = s) : i = s;
      }

      n && null !== this.defaultCase && 1 !== i && (e.brokenFlow = i);
    }

    initialise() {
      for (let e = 0; e < this.cases.length; e++) if (null === this.cases[e].test) return void (this.defaultCase = e);

      this.defaultCase = null;
    }

    render(e, t) {
      this.discriminant.render(e, t), this.cases.length > 0 && Oe(this.cases, e, this.cases[0].start, this.end - 1, t);
    }

  },
  TaggedTemplateExpression: class extends Ce {
    bind() {
      if (super.bind(), "Identifier" === this.tag.type) {
        const e = this.tag.name;
        this.scope.findVariable(e).isNamespace && this.context.warn({
          code: "CANNOT_CALL_NAMESPACE",
          message: `Cannot call a namespace ('${e}')`
        }, this.start);
      }
    }

    hasEffects(e) {
      return super.hasEffects(e) || this.tag.hasEffectsWhenCalledAtPath(L, this.callOptions, e);
    }

    initialise() {
      this.callOptions = {
        args: je,
        thisParam: null,
        withNew: !1
      };
    }

    render(e, t) {
      this.tag.render(e, t, {
        isCalleeOfRenderedParent: !0
      }), this.quasi.render(e, t);
    }

  },
  TemplateElement: class extends Ce {
    bind() {}

    hasEffects() {
      return !1;
    }

    include() {
      this.included = !0;
    }

    parseNode(e) {
      this.value = e.value, super.parseNode(e);
    }

    render() {}

  },
  TemplateLiteral: Xt,
  ThisExpression: class extends Ce {
    bind() {
      this.variable = this.scope.findVariable("this");
    }

    deoptimizePath(e) {
      this.variable.deoptimizePath(e);
    }

    deoptimizeThisOnEventAtPath(e, t, s, i) {
      this.variable.deoptimizeThisOnEventAtPath(e, t, s === this ? this.variable : s, i);
    }

    hasEffectsWhenAccessedAtPath(e, t) {
      return e.length > 0 && this.variable.hasEffectsWhenAccessedAtPath(e, t);
    }

    hasEffectsWhenAssignedAtPath(e, t) {
      return this.variable.hasEffectsWhenAssignedAtPath(e, t);
    }

    include() {
      this.included || (this.included = !0, this.context.includeVariableInModule(this.variable));
    }

    initialise() {
      this.alias = this.scope.findLexicalBoundary() instanceof xi ? this.context.moduleContext : null, "undefined" === this.alias && this.context.warn({
        code: "THIS_IS_UNDEFINED",
        message: "The 'this' keyword is equivalent to 'undefined' at the top level of an ES module, and has been rewritten",
        url: "https://rollupjs.org/guide/en/#error-this-is-undefined"
      }, this.start);
    }

    render(e) {
      null !== this.alias && e.overwrite(this.start, this.end, this.alias, {
        contentOnly: !1,
        storeName: !0
      });
    }

  },
  ThrowStatement: class extends Ce {
    hasEffects() {
      return !0;
    }

    include(e, t) {
      this.included = !0, this.argument.include(e, t), e.brokenFlow = 2;
    }

    render(e, t) {
      this.argument.render(e, t, {
        preventASI: !0
      }), this.argument.start === this.start + 5 && e.prependLeft(this.start + 5, " ");
    }

  },
  TryStatement: class extends Ce {
    constructor() {
      super(...arguments), this.directlyIncluded = !1, this.includedLabelsAfterBlock = null;
    }

    hasEffects(e) {
      return (this.context.options.treeshake.tryCatchDeoptimization ? this.block.body.length > 0 : this.block.hasEffects(e)) || null !== this.finalizer && this.finalizer.hasEffects(e);
    }

    include(e, t) {
      var s;
      const i = null === (s = this.context.options.treeshake) || void 0 === s ? void 0 : s.tryCatchDeoptimization,
            {
        brokenFlow: n
      } = e;

      if (this.directlyIncluded && i) {
        if (this.includedLabelsAfterBlock) for (const t of this.includedLabelsAfterBlock) e.includedLabels.add(t);
      } else this.included = !0, this.directlyIncluded = !0, this.block.include(e, i ? "variables" : t), e.includedLabels.size > 0 && (this.includedLabelsAfterBlock = [...e.includedLabels]), e.brokenFlow = n;

      null !== this.handler && (this.handler.include(e, t), e.brokenFlow = n), null !== this.finalizer && this.finalizer.include(e, t);
    }

  },
  UnaryExpression: class extends Ce {
    constructor() {
      super(...arguments), this.deoptimized = !1;
    }

    getLiteralValueAtPath(e, t, s) {
      if (e.length > 0) return j;
      const i = this.argument.getLiteralValueAtPath(L, t, s);
      return i === j ? j : vi[this.operator](i);
    }

    hasEffects(e) {
      return this.deoptimized || this.applyDeoptimizations(), !("typeof" === this.operator && this.argument instanceof St) && (this.argument.hasEffects(e) || "delete" === this.operator && this.argument.hasEffectsWhenAssignedAtPath(L, e));
    }

    hasEffectsWhenAccessedAtPath(e) {
      return "void" === this.operator ? e.length > 0 : e.length > 1;
    }

    applyDeoptimizations() {
      this.deoptimized = !0, "delete" === this.operator && (this.argument.deoptimizePath(L), this.context.requestTreeshakingPass());
    }

  },
  UnknownNode: class extends Ce {
    hasEffects() {
      return !0;
    }

    include(e) {
      super.include(e, !0);
    }

  },
  UpdateExpression: class extends Ce {
    constructor() {
      super(...arguments), this.deoptimized = !1;
    }

    hasEffects(e) {
      return this.deoptimized || this.applyDeoptimizations(), this.argument.hasEffects(e) || this.argument.hasEffectsWhenAssignedAtPath(L, e);
    }

    hasEffectsWhenAccessedAtPath(e) {
      return e.length > 1;
    }

    render(e, t) {
      if (this.argument.render(e, t), "system" === t.format) {
        const s = this.argument.variable,
              i = t.exportNamesByVariable.get(s);

        if (i) {
          const n = t.compact ? "" : " ";
          if (this.prefix) 1 === i.length ? Be(s, this.start, this.end, e, t) : Fe(s, this.start, this.end, "ExpressionStatement" !== this.parent.type, e, t);else {
            const i = this.operator[0];
            !function (e, t, s, i, n, r, a) {
              const o = r.compact ? "" : " ";
              n.prependRight(t, `${Ve([e], r, a)},${o}`), i && (n.prependRight(t, "("), n.appendLeft(s, ")"));
            }(s, this.start, this.end, "ExpressionStatement" !== this.parent.type, e, t, `${n}${i}${n}1`);
          }
        }
      }
    }

    applyDeoptimizations() {
      if (this.deoptimized = !0, this.argument.deoptimizePath(L), this.argument instanceof St) {
        this.scope.findVariable(this.argument.name).isReassigned = !0;
      }

      this.context.requestTreeshakingPass();
    }

  },
  VariableDeclaration: Qt,
  VariableDeclarator: class extends Ce {
    declareDeclarator(e) {
      this.id.declare(e, this.init || Ge);
    }

    deoptimizePath(e) {
      this.id.deoptimizePath(e);
    }

    hasEffects(e) {
      const t = null !== this.init && this.init.hasEffects(e);
      return this.id.markDeclarationReached(), t || this.id.hasEffects(e);
    }

    include(e, t) {
      this.included = !0, this.init && this.init.include(e, t), this.id.markDeclarationReached(), (t || this.id.shouldBeIncluded(e)) && this.id.include(e, t);
    }

    render(e, t) {
      const s = this.id.included;
      if (s) this.id.render(e, t);else {
        const t = $e(e.original, "=", this.id.end);
        e.remove(this.start, Re(e.original, t + 1));
      }
      if (this.init) this.init.render(e, t, s ? K : {
        renderedSurroundingElement: "ExpressionStatement"
      });else if (this.id instanceof St && Yt(this.id.variable, t.exportNamesByVariable)) {
        const s = t.compact ? "" : " ";
        e.appendLeft(this.end, `${s}=${s}void 0`);
      }
    }

  },
  WhileStatement: class extends Ce {
    hasEffects(e) {
      if (this.test.hasEffects(e)) return !0;
      const {
        brokenFlow: t,
        ignore: {
          breaks: s,
          continues: i
        }
      } = e;
      return e.ignore.breaks = !0, e.ignore.continues = !0, !!this.body.hasEffects(e) || (e.ignore.breaks = s, e.ignore.continues = i, e.brokenFlow = t, !1);
    }

    include(e, t) {
      this.included = !0, this.test.include(e, t);
      const {
        brokenFlow: s
      } = e;
      this.body.includeAsSingleStatement(e, t), e.brokenFlow = s;
    }

  },
  YieldExpression: class extends Ce {
    constructor() {
      super(...arguments), this.deoptimized = !1;
    }

    hasEffects(e) {
      return this.deoptimized || this.applyDeoptimizations(), !e.ignore.returnYield || null !== this.argument && this.argument.hasEffects(e);
    }

    render(e, t) {
      this.argument && (this.argument.render(e, t, {
        preventASI: !0
      }), this.argument.start === this.start + 5 && e.prependLeft(this.start + 5, " "));
    }

    applyDeoptimizations() {
      this.deoptimized = !0;
      const {
        argument: e
      } = this;
      e && (e.deoptimizePath(D), this.context.requestTreeshakingPass());
    }

  }
};

class Si extends H {
  constructor(e) {
    super("_missingExportShim"), this.module = e;
  }

}

class Ai extends H {
  constructor(e, t) {
    super(e.getModuleName()), this.memberVariables = null, this.mergedNamespaces = [], this.referencedEarly = !1, this.references = [], this.context = e, this.module = e.module, this.syntheticNamedExports = t;
  }

  addReference(e) {
    this.references.push(e), this.name = e.name;
  }

  getMemberVariables() {
    if (this.memberVariables) return this.memberVariables;
    const e = Object.create(null);

    for (const t of this.context.getExports().concat(this.context.getReexports())) if ("*" !== t[0] && t !== this.module.info.syntheticNamedExports) {
      const s = this.context.traceExport(t);
      s && (e[t] = s);
    }

    return this.memberVariables = e;
  }

  include() {
    this.included = !0, this.context.includeAllExports();
  }

  prepareNamespace(e) {
    this.mergedNamespaces = e;
    const t = this.context.getModuleExecIndex();

    for (const e of this.references) if (e.context.getModuleExecIndex() <= t) {
      this.referencedEarly = !0;
      break;
    }
  }

  renderBlock(e) {
    const t = e.compact ? "" : " ",
          s = e.compact ? "" : "\n",
          i = e.indent,
          n = this.getMemberVariables(),
          r = Object.entries(n).map(([s, n]) => {
      if (this.referencedEarly || n.isReassigned) return `${i}get ${s}${t}()${t}{${t}return ${n.getName()}${e.compact ? "" : ";"}${t}}`;
      return `${i}${T[s] ? `'${s}'` : s}: ${n.getName()}`;
    });
    e.namespaceToStringTag && r.unshift(`${i}[Symbol.toStringTag]:${t}'Module'`);
    const a = this.mergedNamespaces.length > 0 || this.syntheticNamedExports;
    a || r.unshift(`${i}__proto__:${t}null`);
    let o = `{${s}${r.join(`,${s}`)}${s}}`;

    if (a) {
      const e = ["/*#__PURE__*/Object.create(null)"];
      this.mergedNamespaces.length > 0 && e.push(...this.mergedNamespaces.map(e => e.getName())), this.syntheticNamedExports && e.push(this.module.getSyntheticNamespace().getName()), r.length > 0 && e.push(o), o = `/*#__PURE__*/Object.assign(${e.join(`,${t}`)})`;
    }

    e.freeze && (o = `/*#__PURE__*/Object.freeze(${o})`);
    const h = this.getName();
    return o = `${e.varOrConst} ${h}${t}=${t}${o};`, "system" === e.format && e.exportNamesByVariable.has(this) && (o += `${s}${Ve([this], e)};`), o;
  }

  renderFirst() {
    return this.referencedEarly;
  }

}

Ai.prototype.isNamespace = !0;

class Pi extends H {
  constructor(e, t, s) {
    super(t), this.baseVariable = null, this.context = e, this.module = e.module, this.syntheticNamespace = s;
  }

  getBaseVariable() {
    if (this.baseVariable) return this.baseVariable;
    let e = this.syntheticNamespace;

    for (; e instanceof Ei || e instanceof Pi;) {
      if (e instanceof Ei) {
        const t = e.getOriginalVariable();
        if (t === e) break;
        e = t;
      }

      e instanceof Pi && (e = e.syntheticNamespace);
    }

    return this.baseVariable = e;
  }

  getBaseVariableName() {
    return this.syntheticNamespace.getBaseVariableName();
  }

  getName() {
    const e = this.name;
    return `${this.syntheticNamespace.getName()}${ki(e)}`;
  }

  include() {
    this.included || (this.included = !0, this.context.includeVariableInModule(this.syntheticNamespace));
  }

  setRenderNames(e, t) {
    super.setRenderNames(e, t);
  }

}

const ki = e => !T[e] && /^(?!\d)[\w$]+$/.test(e) ? `.${e}` : `[${JSON.stringify(e)}]`;

function Ci(e) {
  return e.id;
}

const wi = () => {};

let Ii = () => [0, 0],
    Ni = () => 0,
    _i = () => 0,
    $i = {};

function Ti(e, t) {
  switch (t) {
    case 1:
      return `# ${e}`;

    case 2:
      return `## ${e}`;

    case 3:
      return e;

    default:
      return `${"  ".repeat(t - 4)}- ${e}`;
  }
}

function Ri(e, t = 3) {
  e = Ti(e, t), $i.hasOwnProperty(e) || ($i[e] = {
    memory: 0,
    startMemory: void 0,
    startTime: void 0,
    time: 0,
    totalMemory: 0
  });

  const s = _i();

  $i[e].startTime = Ii(), $i[e].startMemory = s;
}

function Mi(e, t = 3) {
  if (e = Ti(e, t), $i.hasOwnProperty(e)) {
    const t = _i();

    $i[e].time += Ni($i[e].startTime), $i[e].totalMemory = Math.max($i[e].totalMemory, t), $i[e].memory += t - $i[e].startMemory;
  }
}

function Oi() {
  const e = {};

  for (const [t, {
    time: s,
    memory: i,
    totalMemory: n
  }] of Object.entries($i)) e[t] = [s, i, n];

  return e;
}

let Li = wi,
    Di = wi;
const Vi = {
  load: !0,
  resolveDynamicImport: !0,
  resolveId: !0,
  transform: !0
};

function Bi(e, t) {
  const s = {};

  for (const i of Object.keys(e)) if (!0 === Vi[i]) {
    let n = `plugin ${t}`;
    e.name && (n += ` (${e.name})`), n += ` - ${i}`, s[i] = function (...t) {
      Li(n, 4);
      let r = e[i].apply(this === s ? e : this, t);
      return Di(n, 4), r && "function" == typeof r.then && (Li(`${n} (async)`, 4), r = r.then(e => (Di(`${n} (async)`, 4), e))), r;
    };
  } else s[i] = e[i];

  return s;
}

function Fi(e) {
  e.perf ? ($i = {}, "undefined" != typeof process && "function" == typeof process.hrtime ? (Ii = process.hrtime.bind(process), Ni = e => {
    return 1e3 * (t = process.hrtime(e))[0] + t[1] / 1e6;
    var t;
  }) : "undefined" != typeof performance && "function" == typeof performance.now && (Ii = () => [performance.now(), 0], Ni = e => performance.now() - e[0]), "undefined" != typeof process && "function" == typeof process.memoryUsage && (_i = () => process.memoryUsage().heapUsed), Li = Ri, Di = Mi, e.plugins = e.plugins.map(Bi)) : (Li = wi, Di = wi);
}

function zi(e) {
  e.isExecuted = !0;
  const t = [e],
        s = new Set();

  for (const e of t) for (const i of [...e.dependencies, ...e.implicitlyLoadedBefore]) i instanceof oe || i.isExecuted || !i.info.hasModuleSideEffects && !e.implicitlyLoadedBefore.has(i) || s.has(i.id) || (i.isExecuted = !0, s.add(i.id), t.push(i));
}

const Wi = {
  identifier: null,
  localName: "_missingExportShim"
};

function ji(e, t, s, i, n = new Map(), r) {
  const a = n.get(t);

  if (a) {
    if (a.has(e)) return i ? null : Us((o = t, h = e.id, {
      code: Hs.CIRCULAR_REEXPORT,
      id: h,
      message: `"${o}" cannot be exported from ${re(h)} as it is a reexport that references itself.`
    }));
    a.add(e);
  } else n.set(t, new Set([e]));

  var o, h;
  return e.getVariableForExportName(t, {
    importerForSideEffects: s,
    isExportAllSearch: i,
    searchedNamesAndModules: n,
    skipExternalNamespaceReexports: r
  });
}

class Ui {
  constructor(e, t, s, i, n, r, a) {
    this.graph = e, this.id = t, this.options = s, this.alternativeReexportModules = new Map(), this.ast = null, this.chunkFileNames = new Set(), this.chunkName = null, this.cycles = new Set(), this.dependencies = new Set(), this.dynamicDependencies = new Set(), this.dynamicImporters = [], this.dynamicImports = [], this.execIndex = 1 / 0, this.exportAllSources = new Set(), this.exports = Object.create(null), this.exportsAll = Object.create(null), this.implicitlyLoadedAfter = new Set(), this.implicitlyLoadedBefore = new Set(), this.importDescriptions = Object.create(null), this.importMetas = [], this.importedFromNotTreeshaken = !1, this.importers = [], this.imports = new Set(), this.includedDynamicImporters = [], this.isExecuted = !1, this.isUserDefinedEntryPoint = !1, this.preserveSignature = this.options.preserveEntrySignatures, this.reexportDescriptions = Object.create(null), this.sideEffectDependenciesByVariable = new Map(), this.sources = new Set(), this.userChunkNames = new Set(), this.usesTopLevelAwait = !1, this.allExportNames = null, this.exportAllModules = [], this.exportNamesByVariable = null, this.exportShimVariable = new Si(this), this.namespaceReexportsByName = Object.create(null), this.relevantDependencies = null, this.syntheticExports = new Map(), this.syntheticNamespace = null, this.transformDependencies = [], this.transitiveReexports = null, this.excludeFromSourcemap = /\0/.test(t), this.context = s.moduleContext(t);
    const o = this;
    this.info = {
      ast: null,
      code: null,

      get dynamicallyImportedIds() {
        const e = [];

        for (const {
          id: t
        } of o.dynamicImports) t && e.push(t);

        return e;
      },

      get dynamicImporters() {
        return o.dynamicImporters.sort();
      },

      hasModuleSideEffects: n,
      id: t,

      get implicitlyLoadedAfterOneOf() {
        return Array.from(o.implicitlyLoadedAfter, Ci);
      },

      get implicitlyLoadedBefore() {
        return Array.from(o.implicitlyLoadedBefore, Ci);
      },

      get importedIds() {
        return Array.from(o.sources, e => o.resolvedIds[e].id);
      },

      get importers() {
        return o.importers.sort();
      },

      isEntry: i,
      isExternal: !1,
      meta: a,
      syntheticNamedExports: r
    };
  }

  basename() {
    const e = w(this.id),
          t = N(this.id);
    return se(t ? e.slice(0, -t.length) : e);
  }

  bindReferences() {
    this.ast.bind();
  }

  error(e, t) {
    return this.addLocationToLogProps(e, t), Us(e);
  }

  getAllExportNames() {
    if (this.allExportNames) return this.allExportNames;
    const e = this.allExportNames = new Set();

    for (const t of Object.keys(this.exports)) e.add(t);

    for (const t of Object.keys(this.reexportDescriptions)) e.add(t);

    for (const t of this.exportAllModules) if (t instanceof oe) e.add(`*${t.id}`);else for (const s of t.getAllExportNames()) "default" !== s && e.add(s);

    return e;
  }

  getDependenciesToBeIncluded() {
    if (this.relevantDependencies) return this.relevantDependencies;
    const e = new Set(),
          t = new Set(),
          s = new Set();
    let i = this.imports.keys();

    if (this.info.isEntry || this.includedDynamicImporters.length > 0 || this.namespace.included || this.implicitlyLoadedAfter.size > 0) {
      i = new Set(i);

      for (const e of [...this.getReexports(), ...this.getExports()]) {
        const t = this.getVariableForExportName(e);
        t && i.add(t);
      }
    }

    for (let e of i) {
      const i = this.sideEffectDependenciesByVariable.get(e);
      if (i) for (const e of i) s.add(e);
      e instanceof Pi ? e = e.getBaseVariable() : e instanceof Ei && (e = e.getOriginalVariable()), t.add(e.module);
    }

    if (this.options.treeshake && "no-treeshake" !== this.info.hasModuleSideEffects) this.addRelevantSideEffectDependencies(e, t, s);else for (const t of this.dependencies) e.add(t);

    for (const s of t) e.add(s);

    return this.relevantDependencies = e;
  }

  getExportNamesByVariable() {
    if (this.exportNamesByVariable) return this.exportNamesByVariable;
    const e = new Map();

    for (const t of this.getAllExportNames()) {
      if (t === this.info.syntheticNamedExports) continue;
      let s = this.getVariableForExportName(t);
      if (s instanceof Ei && (s = s.getOriginalVariable()), !s || !(s.included || s instanceof q)) continue;
      const i = e.get(s);
      i ? i.push(t) : e.set(s, [t]);
    }

    return this.exportNamesByVariable = e;
  }

  getExports() {
    return Object.keys(this.exports);
  }

  getReexports() {
    if (this.transitiveReexports) return this.transitiveReexports;
    this.transitiveReexports = [];
    const e = new Set();

    for (const t in this.reexportDescriptions) e.add(t);

    for (const t of this.exportAllModules) if (t instanceof oe) e.add(`*${t.id}`);else for (const s of [...t.getReexports(), ...t.getExports()]) "default" !== s && e.add(s);

    return this.transitiveReexports = [...e];
  }

  getRenderedExports() {
    const e = [],
          t = [];

    for (const s in this.exports) {
      const i = this.getVariableForExportName(s);
      (i && i.included ? e : t).push(s);
    }

    return {
      removedExports: t,
      renderedExports: e
    };
  }

  getSyntheticNamespace() {
    return null === this.syntheticNamespace && (this.syntheticNamespace = void 0, this.syntheticNamespace = this.getVariableForExportName("string" == typeof this.info.syntheticNamedExports ? this.info.syntheticNamedExports : "default")), this.syntheticNamespace ? this.syntheticNamespace : Us((e = this.id, t = this.info.syntheticNamedExports, {
      code: Hs.SYNTHETIC_NAMED_EXPORTS_NEED_NAMESPACE_EXPORT,
      id: e,
      message: `Module "${re(e)}" that is marked with 'syntheticNamedExports: ${JSON.stringify(t)}' needs ${"string" == typeof t && "default" !== t ? `an export named "${t}"` : "a default export"} that does not reexport an unresolved named export of the same module.`
    }));
    var e, t;
  }

  getVariableForExportName(e, {
    importerForSideEffects: t,
    isExportAllSearch: s,
    searchedNamesAndModules: i,
    skipExternalNamespaceReexports: n
  } = X) {
    if ("*" === e[0]) {
      if (1 === e.length) return this.namespace;
      return this.graph.modulesById.get(e.slice(1)).getVariableForExportName("*");
    }

    const r = this.reexportDescriptions[e];

    if (r) {
      const e = ji(r.module, r.localName, t, !1, i, !1);
      return e ? (t && Gi(e, t, this), e) : this.error(Ys(r.localName, this.id, r.module.id), r.start);
    }

    const a = this.exports[e];

    if (a) {
      if (a === Wi) return this.exportShimVariable;
      const e = a.localName,
            s = this.traceVariable(e, t);
      return t && (R(t.sideEffectDependenciesByVariable, s, () => new Set()).add(this), Gi(s, t, this)), s;
    }

    if ("default" !== e) {
      const s = e in this.namespaceReexportsByName ? this.namespaceReexportsByName[e] : this.getVariableFromNamespaceReexports(e, t, i, n);
      if (n || (this.namespaceReexportsByName[e] = s), s) return s;
    }

    if (this.info.syntheticNamedExports) {
      let t = this.syntheticExports.get(e);

      if (!t) {
        const s = this.getSyntheticNamespace();
        return t = new Pi(this.astContext, e, s), this.syntheticExports.set(e, t), t;
      }

      return t;
    }

    return !s && this.options.shimMissingExports ? (this.shimMissingExport(e), this.exportShimVariable) : null;
  }

  hasEffects() {
    return "no-treeshake" === this.info.hasModuleSideEffects || this.ast.included && this.ast.hasEffects(de());
  }

  include() {
    const e = ue();
    this.ast.shouldBeIncluded(e) && this.ast.include(e, !1);
  }

  includeAllExports(e) {
    this.isExecuted || (zi(this), this.graph.needsTreeshakingPass = !0);

    for (const t of this.getExports()) if (e || t !== this.info.syntheticNamedExports) {
      const e = this.getVariableForExportName(t);
      e.deoptimizePath(D), e.included || this.includeVariable(e);
    }

    for (const e of this.getReexports()) {
      const t = this.getVariableForExportName(e);
      t && (t.deoptimizePath(D), t.included || this.includeVariable(t), t instanceof q && (t.module.reexported = !0));
    }

    e && this.namespace.prepareNamespace(this.includeAndGetAdditionalMergedNamespaces());
  }

  includeAllInBundle() {
    this.ast.include(ue(), !0), this.includeAllExports(!1);
  }

  isIncluded() {
    return this.ast.included || this.namespace.included || this.importedFromNotTreeshaken;
  }

  linkImports() {
    this.addModulesToImportDescriptions(this.importDescriptions), this.addModulesToImportDescriptions(this.reexportDescriptions);

    for (const e in this.exports) "default" !== e && e !== this.info.syntheticNamedExports && (this.exportsAll[e] = this.id);

    const e = [];

    for (const t of this.exportAllSources) {
      const s = this.graph.modulesById.get(this.resolvedIds[t].id);
      if (s instanceof oe) e.push(s);else {
        this.exportAllModules.push(s);

        for (const e in s.exportsAll) e in this.exportsAll ? this.options.onwarn(Zs(e, this, s)) : this.exportsAll[e] = s.exportsAll[e];
      }
    }

    this.exportAllModules.push(...e);
  }

  render(e) {
    const t = this.magicString.clone();
    return this.ast.render(t, e), this.usesTopLevelAwait = this.astContext.usesTopLevelAwait, t;
  }

  setSource({
    ast: e,
    code: t,
    customTransformCache: s,
    originalCode: i,
    originalSourcemap: n,
    resolvedIds: r,
    sourcemapChain: a,
    transformDependencies: o,
    transformFiles: h,
    ...l
  }) {
    this.info.code = t, this.originalCode = i, this.originalSourcemap = n, this.sourcemapChain = a, h && (this.transformFiles = h), this.transformDependencies = o, this.customTransformCache = s, this.updateOptions(l), Li("generate ast", 3), e || (e = this.tryParse()), Di("generate ast", 3), this.resolvedIds = r || Object.create(null);
    const c = this.id;
    this.magicString = new b(t, {
      filename: this.excludeFromSourcemap ? null : c,
      indentExclusionRanges: []
    }), Li("analyse ast", 3), this.astContext = {
      addDynamicImport: this.addDynamicImport.bind(this),
      addExport: this.addExport.bind(this),
      addImport: this.addImport.bind(this),
      addImportMeta: this.addImportMeta.bind(this),
      code: t,
      deoptimizationTracker: this.graph.deoptimizationTracker,
      error: this.error.bind(this),
      fileName: c,
      getExports: this.getExports.bind(this),
      getModuleExecIndex: () => this.execIndex,
      getModuleName: this.basename.bind(this),
      getReexports: this.getReexports.bind(this),
      importDescriptions: this.importDescriptions,
      includeAllExports: () => this.includeAllExports(!0),
      includeDynamicImport: this.includeDynamicImport.bind(this),
      includeVariableInModule: this.includeVariableInModule.bind(this),
      magicString: this.magicString,
      module: this,
      moduleContext: this.context,
      nodeConstructors: bi,
      options: this.options,
      requestTreeshakingPass: () => this.graph.needsTreeshakingPass = !0,
      traceExport: this.getVariableForExportName.bind(this),
      traceVariable: this.traceVariable.bind(this),
      usesTopLevelAwait: !1,
      warn: this.warn.bind(this)
    }, this.scope = new xi(this.graph.scope, this.astContext), this.namespace = new Ai(this.astContext, this.info.syntheticNamedExports), this.ast = new Kt(e, {
      context: this.astContext,
      type: "Module"
    }, this.scope), this.info.ast = e, Di("analyse ast", 3);
  }

  toJSON() {
    return {
      ast: this.ast.esTreeNode,
      code: this.info.code,
      customTransformCache: this.customTransformCache,
      dependencies: Array.from(this.dependencies, Ci),
      id: this.id,
      meta: this.info.meta,
      moduleSideEffects: this.info.hasModuleSideEffects,
      originalCode: this.originalCode,
      originalSourcemap: this.originalSourcemap,
      resolvedIds: this.resolvedIds,
      sourcemapChain: this.sourcemapChain,
      syntheticNamedExports: this.info.syntheticNamedExports,
      transformDependencies: this.transformDependencies,
      transformFiles: this.transformFiles
    };
  }

  traceVariable(e, t) {
    const s = this.scope.variables.get(e);
    if (s) return s;

    if (e in this.importDescriptions) {
      const s = this.importDescriptions[e],
            i = s.module;
      if (i instanceof Ui && "*" === s.name) return i.namespace;
      const n = i.getVariableForExportName(s.name, {
        importerForSideEffects: t || this
      });
      return n || this.error(Ys(s.name, this.id, i.id), s.start);
    }

    return null;
  }

  tryParse() {
    try {
      return this.graph.contextParse(this.info.code);
    } catch (e) {
      let t = e.message.replace(/ \(\d+:\d+\)$/, "");
      return this.id.endsWith(".json") ? t += " (Note that you need @rollup/plugin-json to import JSON files)" : this.id.endsWith(".js") || (t += " (Note that you need plugins to import files that are not JavaScript)"), this.error({
        code: "PARSE_ERROR",
        message: t,
        parserError: e
      }, e.pos);
    }
  }

  updateOptions({
    meta: e,
    moduleSideEffects: t,
    syntheticNamedExports: s
  }) {
    null != t && (this.info.hasModuleSideEffects = t), null != s && (this.info.syntheticNamedExports = s), null != e && (this.info.meta = { ...this.info.meta,
      ...e
    });
  }

  warn(e, t) {
    this.addLocationToLogProps(e, t), this.options.onwarn(e);
  }

  addDynamicImport(e) {
    let t = e.source;
    t instanceof Xt ? 1 === t.quasis.length && t.quasis[0].value.cooked && (t = t.quasis[0].value.cooked) : t instanceof qt && "string" == typeof t.value && (t = t.value), this.dynamicImports.push({
      argument: t,
      id: null,
      node: e,
      resolution: null
    });
  }

  addExport(e) {
    if (e instanceof Ht) this.exports.default = {
      identifier: e.variable.getAssignedVariableName(),
      localName: "default"
    };else if (e instanceof we) {
      const t = e.source.value;

      if (this.sources.add(t), e.exported) {
        const s = e.exported.name;
        this.reexportDescriptions[s] = {
          localName: "*",
          module: null,
          source: t,
          start: e.start
        };
      } else this.exportAllSources.add(t);
    } else if (e.source instanceof qt) {
      const t = e.source.value;
      this.sources.add(t);

      for (const s of e.specifiers) {
        const e = s.exported.name;
        this.reexportDescriptions[e] = {
          localName: s.local.name,
          module: null,
          source: t,
          start: s.start
        };
      }
    } else if (e.declaration) {
      const t = e.declaration;
      if (t instanceof Qt) for (const e of t.declarations) for (const t of ce(e.id)) this.exports[t] = {
        identifier: null,
        localName: t
      };else {
        const e = t.id.name;
        this.exports[e] = {
          identifier: null,
          localName: e
        };
      }
    } else for (const t of e.specifiers) {
      const e = t.local.name,
            s = t.exported.name;
      this.exports[s] = {
        identifier: null,
        localName: e
      };
    }
  }

  addImport(e) {
    const t = e.source.value;
    this.sources.add(t);

    for (const s of e.specifiers) {
      const e = "ImportDefaultSpecifier" === s.type,
            i = "ImportNamespaceSpecifier" === s.type,
            n = e ? "default" : i ? "*" : s.imported.name;
      this.importDescriptions[s.local.name] = {
        module: null,
        name: n,
        source: t,
        start: s.start
      };
    }
  }

  addImportMeta(e) {
    this.importMetas.push(e);
  }

  addLocationToLogProps(e, t) {
    e.id = this.id, e.pos = t;
    let s = this.info.code;
    const i = he(s, t, {
      offsetLine: 1
    });

    if (i) {
      let {
        column: n,
        line: r
      } = i;

      try {
        ({
          column: n,
          line: r
        } = function (e, t) {
          const s = e.filter(e => e.mappings);

          for (; s.length > 0;) {
            const e = s.pop(),
                  i = e.mappings[t.line - 1];
            let n = !1;
            if (void 0 !== i) for (const s of i) if (s[0] >= t.column) {
              if (1 === s.length) break;
              t = {
                column: s[3],
                line: s[2] + 1,
                name: 5 === s.length ? e.names[s[4]] : void 0,
                source: e.sources[s[1]]
              }, n = !0;
              break;
            }
            if (!n) throw new Error("Can't resolve original location of error.");
          }

          return t;
        }(this.sourcemapChain, {
          column: n,
          line: r
        })), s = this.originalCode;
      } catch (e) {
        this.options.onwarn({
          code: "SOURCEMAP_ERROR",
          id: this.id,
          loc: {
            column: n,
            file: this.id,
            line: r
          },
          message: `Error when using sourcemap for reporting an error: ${e.message}`,
          pos: t
        });
      }

      Gs(e, {
        column: n,
        line: r
      }, s, this.id);
    }
  }

  addModulesToImportDescriptions(e) {
    for (const t of Object.values(e)) {
      const e = this.resolvedIds[t.source].id;
      t.module = this.graph.modulesById.get(e);
    }
  }

  addRelevantSideEffectDependencies(e, t, s) {
    const i = new Set(),
          n = r => {
      for (const a of r) i.has(a) || (i.add(a), t.has(a) ? e.add(a) : (a.info.hasModuleSideEffects || s.has(a)) && (a instanceof oe || a.hasEffects() ? e.add(a) : n(a.dependencies)));
    };

    n(this.dependencies), n(s);
  }

  getVariableFromNamespaceReexports(e, t, s, i = !1) {
    let n = null;
    const r = [{
      searchedNamesAndModules: s,
      skipExternalNamespaces: !0
    }];

    if (!i) {
      const e = new Map();

      for (const [t, i] of s || []) e.set(t, new Set(i));

      r.push({
        searchedNamesAndModules: e,
        skipExternalNamespaces: !1
      });
    }

    for (const {
      skipExternalNamespaces: s,
      searchedNamesAndModules: i
    } of r) {
      const r = new Set();

      for (const a of this.exportAllModules) if (a instanceof Ui || !s) {
        const o = ji(a, e, t, !0, i, s);
        o && (o instanceof Pi ? n || (n = o) : r.add(o));
      }

      if (1 === r.size) return [...r][0];

      if (r.size > 1) {
        if (s) return null;
        const t = [...r],
              i = t[0];
        return this.options.onwarn(Js(e, this.id, i.module.id, t.map(e => e.module.id))), i;
      }
    }

    return n || null;
  }

  includeAndGetAdditionalMergedNamespaces() {
    const e = [];

    for (const t of this.exportAllModules) if (t instanceof oe) {
      const s = t.getVariableForExportName("*");
      s.include(), this.imports.add(s), e.push(s);
    } else if (t.info.syntheticNamedExports) {
      const s = t.getSyntheticNamespace();
      s.include(), this.imports.add(s), e.push(s);
    }

    return e;
  }

  includeDynamicImport(e) {
    const t = this.dynamicImports.find(t => t.node === e).resolution;
    t instanceof Ui && (t.includedDynamicImporters.push(this), t.includeAllExports(!0));
  }

  includeVariable(e) {
    if (!e.included) {
      e.include(), this.graph.needsTreeshakingPass = !0;
      const t = e.module;

      if (t && t instanceof Ui && (t.isExecuted || zi(t), t !== this)) {
        const t = function (e, t) {
          const s = R(t.sideEffectDependenciesByVariable, e, () => new Set());
          let i = e;
          const n = new Set([i]);

          for (;;) {
            const e = i.module;
            if (i = i instanceof Ei ? i.getDirectOriginalVariable() : i instanceof Pi ? i.syntheticNamespace : null, !i || n.has(i)) break;
            n.add(i), s.add(e);
            const t = e.sideEffectDependenciesByVariable.get(i);
            if (t) for (const e of t) s.add(e);
          }

          return s;
        }(e, this);

        for (const e of t) e.isExecuted || zi(e);
      }
    }
  }

  includeVariableInModule(e) {
    this.includeVariable(e);
    const t = e.module;
    t && t !== this && this.imports.add(e);
  }

  shimMissingExport(e) {
    this.options.onwarn({
      code: "SHIMMED_EXPORT",
      exporter: re(this.id),
      exportName: e,
      message: `Missing export "${e}" has been shimmed in module ${re(this.id)}.`
    }), this.exports[e] = Wi;
  }

}

function Gi(e, t, s) {
  if (e.module instanceof Ui && e.module !== s) {
    const i = e.module.cycles;

    if (i.size > 0) {
      const n = s.cycles;

      for (const r of n) if (i.has(r)) {
        t.alternativeReexportModules.set(e, s);
        break;
      }
    }
  }
}

function Hi(e) {
  return e.endsWith(".js") ? e.slice(0, -3) : e;
}

function qi(e, t) {
  return e.autoId ? `${e.basePath ? e.basePath + "/" : ""}${Hi(t)}` : e.id || "";
}

function Ki(e, t, s, i, n, r, a, o = "return ") {
  const h = n ? "" : " ",
        l = n ? "" : "\n";
  if (!s) return `${l}${l}${o}${function (e, t, s, i) {
    if (e.length > 0) return e[0].local;

    for (const {
      defaultVariableName: e,
      id: n,
      isChunk: r,
      name: a,
      namedExportsMode: o,
      namespaceVariableName: h,
      reexports: l
    } of t) if (l) return Xi(a, l[0].imported, o, r, e, h, s, n, i);
  }(e, t, i, a)};`;
  let c = "";

  for (const {
    defaultVariableName: e,
    id: n,
    isChunk: o,
    name: u,
    namedExportsMode: d,
    namespaceVariableName: p,
    reexports: f
  } of t) if (f && s) for (const t of f) if ("*" !== t.reexported) {
    const s = Xi(u, t.imported, d, o, e, p, i, n, a);
    c && (c += l), c += "*" !== t.imported && t.needsLiveBinding ? `Object.defineProperty(exports,${h}'${t.reexported}',${h}{${l}${r}enumerable:${h}true,${l}${r}get:${h}function${h}()${h}{${l}${r}${r}return ${s};${l}${r}}${l}});` : `exports.${t.reexported}${h}=${h}${s};`;
  }

  for (const {
    exported: t,
    local: s
  } of e) {
    const e = "exports" + (T[t] ? `['${t}']` : `.${t}`),
          i = s;
    e !== i && (c && (c += l), c += `${e}${h}=${h}${i};`);
  }

  for (const {
    name: e,
    reexports: i
  } of t) if (i && s) for (const t of i) "*" === t.reexported && (c && (c += l), t.needsLiveBinding ? c += `Object.keys(${e}).forEach(function${h}(k)${h}{${l}${r}if${h}(k${h}!==${h}'default'${h}&&${h}!exports.hasOwnProperty(k))${h}Object.defineProperty(exports,${h}k,${h}{${l}${r}${r}enumerable:${h}true,${l}${r}${r}get:${h}function${h}()${h}{${l}${r}${r}${r}return ${e}[k];${l}${r}${r}}${l}${r}});${l}});` : c += `Object.keys(${e}).forEach(function${h}(k)${h}{${l}${r}if${h}(k${h}!==${h}'default'${h}&&${h}!exports.hasOwnProperty(k))${h}exports[k]${h}=${h}${e}[k];${l}});`);

  return c ? `${l}${l}${c}` : "";
}

function Xi(e, t, s, i, n, r, a, o, h) {
  if ("default" === t) {
    if (!i) {
      const t = String(a(o)),
            s = Ns[t] ? n : e;
      return _s(t, h) ? `${s}['default']` : s;
    }

    return s ? `${e}['default']` : e;
  }

  return "*" === t ? (i ? !s : $s[String(a(o))]) ? r : e : `${e}.${t}`;
}

function Yi(e, t, s, i, n) {
  let r = "";
  return e && (t && (r += function (e) {
    return `Object.defineProperty(exports,${e}'__esModule',${e}{${e}value:${e}true${e}});`;
  }(i)), s && (r && (r += n), r += function (e) {
    return `exports[Symbol.toStringTag]${e}=${e}'Module';`;
  }(i))), r;
}

function Qi(e, t, s, i, n, r, a, o, h, l, c) {
  const u = new Set(),
        d = [],
        p = (e, s, i) => {
    u.add(s), d.push(`${t} ${e}${o}=${o}/*#__PURE__*/${s}(${i});`);
  };

  for (const {
    defaultVariableName: t,
    imports: i,
    id: n,
    isChunk: r,
    name: a,
    namedExportsMode: o,
    namespaceVariableName: h,
    reexports: l
  } of e) if (r) {
    for (const {
      imported: e,
      reexported: t
    } of [...(i || []), ...(l || [])]) if ("*" === e && "*" !== t) {
      o || p(h, "_interopNamespaceDefaultOnly", a);
      break;
    }
  } else {
    const e = String(s(n));
    let r = !1,
        o = !1;

    for (const {
      imported: s,
      reexported: n
    } of [...(i || []), ...(l || [])]) {
      let i, l;
      "default" === s ? r || (r = !0, t !== h && (l = t, i = Ns[e])) : "*" === s && "*" !== n && (o || (o = !0, i = $s[e], l = h)), i && p(l, i, a);
    }
  }

  return `${function (e, t, s, i, n, r, a, o, h) {
    return Fs.map(l => e.has(l) || t.has(l) ? Rs[l](s, i, n, r, a, o, h, e) : "").join("");
  }(u, a, o, h, l, c, i, n, r)}${d.length > 0 ? `${d.join(h)}${h}${h}` : ""}`;
}

function Zi(e) {
  return "." === e[0] ? Hi(e) : e;
}

const Ji = {
  assert: !0,
  buffer: !0,
  console: !0,
  constants: !0,
  domain: !0,
  events: !0,
  http: !0,
  https: !0,
  os: !0,
  path: !0,
  process: !0,
  punycode: !0,
  querystring: !0,
  stream: !0,
  string_decoder: !0,
  timers: !0,
  tty: !0,
  url: !0,
  util: !0,
  vm: !0,
  zlib: !0
};

function en(e, t) {
  const s = t.map(({
    id: e
  }) => e).filter(e => e in Ji);
  s.length && e({
    code: "MISSING_NODE_BUILTINS",
    message: `Creating a browser bundle that depends on Node.js built-in modules (${ie(s)}). You might need to include https://github.com/snowpackjs/rollup-plugin-polyfill-node`,
    modules: s
  });
}

const tn = /^[a-zA-Z$_][a-zA-Z0-9$_]*$/;

function sn(e) {
  return tn.test(e) ? `.${e}` : `['${e}']`;
}

function nn(e) {
  return e.split(".").map(sn).join("");
}

function rn(e, t, s, i, n) {
  const r = i ? "" : " ",
        a = e.split(".");
  a[0] = ("function" == typeof s ? s(a[0]) : s[a[0]]) || a[0];
  const o = a.pop();
  let h = t,
      l = a.map(e => (h += sn(e), `${h}${r}=${r}${h}${r}||${r}{}`)).concat(`${h}${sn(o)}`).join(`,${r}`).concat(`${r}=${r}${n}`);
  return a.length > 0 && (l = `(${l})`), l;
}

function an(e) {
  let t = e.length;

  for (; t--;) {
    const {
      imports: s,
      reexports: i
    } = e[t];
    if (s || i) return e.slice(0, t + 1);
  }

  return [];
}

const on$1 = e => `this${nn(e)}`;

function hn({
  dependencies: e,
  exports: t
}) {
  const s = new Set(t.map(e => e.exported));
  s.add("default");

  for (const {
    reexports: t
  } of e) if (t) for (const e of t) "*" !== e.imported && s.add(e.reexported);

  return s;
}

function ln(e, t, s, i) {
  return 0 === e.length ? "" : 1 === e.length ? `${s}${s}${s}exports('${e[0].name}',${t}${e[0].value});${i}${i}` : `${s}${s}${s}exports({${i}` + e.map(({
    name: e,
    value: i
  }) => `${s}${s}${s}${s}${e}:${t}${i}`).join(`,${i}`) + `${i}${s}${s}${s}});${i}${i}`;
}

function cn(e, t) {
  return e ? `${t}${nn(e)}` : "null";
}

var un = {
  amd: function (e, {
    accessedGlobals: t,
    dependencies: s,
    exports: i,
    hasExports: n,
    id: r,
    indentString: a,
    intro: o,
    isEntryFacade: h,
    isModuleFacade: l,
    namedExportsMode: c,
    outro: u,
    varOrConst: d,
    warn: p
  }, {
    amd: f,
    compact: m,
    esModule: g,
    externalLiveBindings: y,
    freeze: E,
    interop: x,
    namespaceToStringTag: v,
    strict: b
  }) {
    en(p, s);
    const S = s.map(e => `'${Zi(e.id)}'`),
          A = s.map(e => e.name),
          P = m ? "" : "\n",
          k = m ? "" : ";",
          C = m ? "" : " ";
    c && n && (A.unshift("exports"), S.unshift("'exports'")), t.has("require") && (A.unshift("require"), S.unshift("'require'")), t.has("module") && (A.unshift("module"), S.unshift("'module'"));
    const w = qi(f, r),
          I = (w ? `'${w}',${C}` : "") + (S.length ? `[${S.join(`,${C}`)}],${C}` : ""),
          N = b ? `${C}'use strict';` : "";
    e.prepend(`${o}${Qi(s, d, x, y, E, v, t, C, P, k, a)}`);

    const _ = Ki(i, s, c, x, m, a, y);

    let $ = Yi(c && n, h && g, l && v, C, P);
    return $ && ($ = P + P + $), e.append(`${_}${$}${u}`), e.indent(a).prepend(`${f.define}(${I}function${C}(${A.join(`,${C}`)})${C}{${N}${P}${P}`).append(`${P}${P}});`);
  },
  cjs: function (e, {
    accessedGlobals: t,
    dependencies: s,
    exports: i,
    hasExports: n,
    indentString: r,
    intro: a,
    isEntryFacade: o,
    isModuleFacade: h,
    namedExportsMode: l,
    outro: c,
    varOrConst: u
  }, {
    compact: d,
    esModule: p,
    externalLiveBindings: f,
    freeze: m,
    interop: g,
    namespaceToStringTag: y,
    strict: E
  }) {
    const x = d ? "" : "\n",
          v = d ? "" : ";",
          b = d ? "" : " ",
          S = E ? `'use strict';${x}${x}` : "";
    let A = Yi(l && n, o && p, h && y, b, x);
    A && (A += x + x);

    const P = function (e, t, s, i, n) {
      let r = "",
          a = !1;

      for (const {
        id: o,
        name: h,
        reexports: l,
        imports: c
      } of e) l || c ? (r += t && a ? "," : `${r ? `;${i}` : ""}${s} `, a = !0, r += `${h}${n}=${n}require('${o}')`) : (r && (r += !t || a ? `;${i}` : ","), a = !1, r += `require('${o}')`);

      if (r) return `${r};${i}${i}`;
      return "";
    }(s, d, u, x, b),
          k = Qi(s, u, g, f, m, y, t, b, x, v, r);

    e.prepend(`${S}${a}${A}${P}${k}`);
    const C = Ki(i, s, l, g, d, r, f, `module.exports${b}=${b}`);
    return e.append(`${C}${c}`);
  },
  es: function (e, {
    intro: t,
    outro: s,
    dependencies: i,
    exports: n,
    varOrConst: r
  }, {
    compact: a
  }) {
    const o = a ? "" : " ",
          h = a ? "" : "\n",
          l = function (e, t) {
      const s = [];

      for (const {
        id: i,
        reexports: n,
        imports: r,
        name: a
      } of e) if (n || r) {
        if (r) {
          let e = null,
              n = null;
          const a = [];

          for (const t of r) "default" === t.imported ? e = t : "*" === t.imported ? n = t : a.push(t);

          n && s.push(`import${t}*${t}as ${n.local} from${t}'${i}';`), e && 0 === a.length ? s.push(`import ${e.local} from${t}'${i}';`) : a.length > 0 && s.push(`import ${e ? `${e.local},${t}` : ""}{${t}${a.map(e => e.imported === e.local ? e.imported : `${e.imported} as ${e.local}`).join(`,${t}`)}${t}}${t}from${t}'${i}';`);
        }

        if (n) {
          let e = null;
          const o = [],
                h = [];

          for (const t of n) "*" === t.reexported ? e = t : "*" === t.imported ? o.push(t) : h.push(t);

          if (e && s.push(`export${t}*${t}from${t}'${i}';`), o.length > 0) {
            r && r.some(e => "*" === e.imported && e.local === a) || s.push(`import${t}*${t}as ${a} from${t}'${i}';`);

            for (const e of o) s.push(`export${t}{${t}${a === e.reexported ? a : `${a} as ${e.reexported}`} };`);
          }

          h.length > 0 && s.push(`export${t}{${t}${h.map(e => e.imported === e.reexported ? e.imported : `${e.imported} as ${e.reexported}`).join(`,${t}`)}${t}}${t}from${t}'${i}';`);
        }
      } else s.push(`import${t}'${i}';`);

      return s;
    }(i, o);

    l.length > 0 && (t += l.join(h) + h + h), t && e.prepend(t);

    const c = function (e, t, s) {
      const i = [],
            n = [];

      for (const r of e) r.expression && i.push(`${s} ${r.local}${t}=${t}${r.expression};`), n.push(r.exported === r.local ? r.local : `${r.local} as ${r.exported}`);

      n.length && i.push(`export${t}{${t}${n.join(`,${t}`)}${t}};`);
      return i;
    }(n, o, r);

    return c.length && e.append(h + h + c.join(h).trim()), s && e.append(s), e.trim();
  },
  iife: function (e, {
    accessedGlobals: t,
    dependencies: s,
    exports: i,
    hasExports: n,
    indentString: r,
    intro: a,
    namedExportsMode: o,
    outro: h,
    varOrConst: l,
    warn: c
  }, {
    compact: u,
    esModule: d,
    extend: p,
    freeze: f,
    externalLiveBindings: m,
    globals: g,
    interop: y,
    name: E,
    namespaceToStringTag: x,
    strict: v
  }) {
    const b = u ? "" : " ",
          S = u ? "" : ";",
          A = u ? "" : "\n",
          P = E && -1 !== E.indexOf("."),
          k = !p && !P;
    if (E && k && (te(C = E) || J.has(C) || ee.test(C))) return Us({
      code: "ILLEGAL_IDENTIFIER_AS_NAME",
      message: `Given name "${E}" is not a legal JS identifier. If you need this, you can try "output.extend: true".`
    });
    var C;
    en(c, s);
    const w = an(s),
          I = w.map(e => e.globalName || "null"),
          N = w.map(e => e.name);
    n && !E && c({
      code: "MISSING_NAME_OPTION_FOR_IIFE_EXPORT",
      message: 'If you do not supply "output.name", you may not be able to access the exports of an IIFE bundle.'
    }), o && n && (p ? (I.unshift(`${on$1(E)}${b}=${b}${on$1(E)}${b}||${b}{}`), N.unshift("exports")) : (I.unshift("{}"), N.unshift("exports")));

    const _ = v ? `${r}'use strict';${A}` : "",
          $ = Qi(s, l, y, m, f, x, t, b, A, S, r);

    e.prepend(`${a}${$}`);
    let T = `(function${b}(${N.join(`,${b}`)})${b}{${A}${_}${A}`;
    n && (!E || p && o || (T = (k ? `${l} ${E}` : on$1(E)) + `${b}=${b}${T}`), P && (T = function (e, t, s, i) {
      const n = i ? "" : " ",
            r = e.split(".");
      r[0] = ("function" == typeof s ? s(r[0]) : s[r[0]]) || r[0], r.pop();
      let a = t;
      return r.map(e => (a += sn(e), `${a}${n}=${n}${a}${n}||${n}{}${i ? "" : ";"}`)).join(i ? "," : "\n") + (i && r.length ? ";" : "\n");
    }(E, "this", g, u) + T));
    let R = `${A}${A}}(${I.join(`,${b}`)}));`;
    n && !p && o && (R = `${A}${A}${r}return exports;${R}`);
    const M = Ki(i, s, o, y, u, r, m);
    let O = Yi(o && n, d, x, b, A);
    return O && (O = A + A + O), e.append(`${M}${O}${h}`), e.indent(r).prepend(T).append(R);
  },
  system: function (e, {
    accessedGlobals: t,
    dependencies: s,
    exports: i,
    hasExports: n,
    indentString: r,
    intro: a,
    outro: o,
    usesTopLevelAwait: h,
    varOrConst: l
  }, c) {
    const u = c.compact ? "" : "\n",
          d = c.compact ? "" : " ",
          p = s.map(e => `'${e.id}'`),
          f = [];
    let m;
    const g = [];

    for (const {
      imports: e,
      reexports: t
    } of s) {
      const n = [];
      if (e) for (const t of e) f.push(t.local), "*" === t.imported ? n.push(`${t.local}${d}=${d}module;`) : n.push(`${t.local}${d}=${d}module.${t.imported};`);

      if (t) {
        let e = !1;

        if (t.length > 1 || 1 === t.length && ("*" === t[0].reexported || "*" === t[0].imported)) {
          for (const a of t) "*" === a.reexported && (m || (m = hn({
            dependencies: s,
            exports: i
          })), e = !0, n.push(`${l} _setter${d}=${d}{};`), n.push(`for${d}(var _$p${d}in${d}module)${d}{`), n.push(`${r}if${d}(!_starExcludes[_$p])${d}_setter[_$p]${d}=${d}module[_$p];`), n.push("}"));

          for (const e of t) "*" === e.imported && "*" !== e.reexported && n.push(`exports('${e.reexported}',${d}module);`);

          for (const s of t) "*" !== s.reexported && "*" !== s.imported && (e || (n.push(`${l} _setter${d}=${d}{};`), e = !0), n.push(`_setter.${s.reexported}${d}=${d}module.${s.imported};`));

          e && n.push("exports(_setter);");
        } else for (const e of t) n.push(`exports('${e.reexported}',${d}module.${e.imported});`);
      }

      g.push(n.join(`${u}${r}${r}${r}`));
    }

    const y = c.name ? `'${c.name}',${d}` : "",
          E = t.has("module") ? `exports,${d}module` : n ? "exports" : "";

    let x = `System.register(${y}[` + p.join(`,${d}`) + `],${d}function${d}(${E})${d}{${u}${r}${c.strict ? "'use strict';" : ""}` + ((e, t, s, i, n) => e ? `${n}${i}${t} _starExcludes${s}=${s}{${s}${[...e].map(e => `${e}:${s}1`).join(`,${s}`)}${s}};` : "")(m, l, d, r, u) + ((e, t, s, i) => e.length ? `${i}${s}var ${e.join(`,${t}`)};` : "")(f, d, r, u) + `${u}${r}return${d}{${g.length ? `${u}${r}${r}setters:${d}[${g.map(e => e ? `function${d}(module)${d}{${u}${r}${r}${r}${e}${u}${r}${r}}` : c.systemNullSetters ? "null" : `function${d}()${d}{}`).join(`,${d}`)}],` : ""}${u}`;

    x += `${r}${r}execute:${d}${h ? `async${d}` : ""}function${d}()${d}{${u}${u}` + ((e, t, s, i) => ln(e.filter(e => e.hoisted).map(e => ({
      name: e.exported,
      value: e.local
    })), t, s, i))(i, d, r, u);

    const v = `${u}${u}` + ((e, t, s, i) => ln(e.filter(e => e.expression).map(e => ({
      name: e.exported,
      value: e.local
    })), t, s, i))(i, d, r, u) + ((e, t, s, i) => ln(e.filter(e => "_missingExportShim" === e.local).map(e => ({
      name: e.exported,
      value: "_missingExportShim"
    })), t, s, i))(i, d, r, u) + `${r}${r}}${u}${r}}${c.compact ? "" : ";"}${u}});`;

    return a && e.prepend(a), o && e.append(o), e.indent(`${r}${r}${r}`).append(v).prepend(x);
  },
  umd: function (e, {
    accessedGlobals: t,
    dependencies: s,
    exports: i,
    hasExports: n,
    id: r,
    indentString: a,
    intro: o,
    namedExportsMode: h,
    outro: l,
    varOrConst: c,
    warn: u
  }, {
    amd: d,
    compact: p,
    esModule: f,
    extend: m,
    externalLiveBindings: g,
    freeze: y,
    interop: E,
    name: x,
    namespaceToStringTag: v,
    globals: b,
    noConflict: S,
    strict: A
  }) {
    const P = p ? "" : " ",
          k = p ? "" : "\n",
          C = p ? "" : ";",
          w = p ? "f" : "factory",
          I = p ? "g" : "global";
    if (n && !x) return Us({
      code: "MISSING_NAME_OPTION_FOR_IIFE_EXPORT",
      message: 'You must supply "output.name" for UMD bundles that have exports so that the exports are accessible in environments without a module loader.'
    });
    en(u, s);

    const N = s.map(e => `'${Zi(e.id)}'`),
          _ = s.map(e => `require('${e.id}')`),
          $ = an(s),
          T = $.map(e => cn(e.globalName, I)),
          R = $.map(e => e.name);

    h && (n || S) && (N.unshift("'exports'"), _.unshift("exports"), T.unshift(rn(x, I, b, p, (m ? `${cn(x, I)}${P}||${P}` : "") + "{}")), R.unshift("exports"));
    const M = qi(d, r),
          O = (M ? `'${M}',${P}` : "") + (N.length ? `[${N.join(`,${P}`)}],${P}` : ""),
          L = d.define,
          D = !h && n ? `module.exports${P}=${P}` : "",
          V = A ? `${P}'use strict';${k}` : "";
    let B;

    if (S) {
      const e = p ? "e" : "exports";
      let t;
      if (!h && n) t = `var ${e}${P}=${P}${rn(x, I, b, p, `${w}(${T.join(`,${P}`)})`)};`;else {
        t = `var ${e}${P}=${P}${T.shift()};${k}${a}${a}${w}(${[e].concat(T).join(`,${P}`)});`;
      }
      B = `(function${P}()${P}{${k}${a}${a}var current${P}=${P}${function (e, t, s) {
        const i = e.split(".");
        let n = t;
        return i.map(e => n += sn(e)).join(`${s}&&${s}`);
      }(x, I, P)};${k}${a}${a}${t}${k}${a}${a}${e}.noConflict${P}=${P}function${P}()${P}{${P}${cn(x, I)}${P}=${P}current;${P}return ${e}${p ? "" : "; "}};${k}${a}}())`;
    } else B = `${w}(${T.join(`,${P}`)})`, !h && n && (B = rn(x, I, b, p, B));

    const F = n || S && h || T.length > 0,
          z = F ? `this,${P}` : "",
          W = F ? `(${I}${P}=${P}typeof globalThis${P}!==${P}'undefined'${P}?${P}globalThis${P}:${P}${I}${P}||${P}self,${P}` : "",
          j = F ? ")" : "",
          U = `(function${P}(${F ? `${I},${P}` : ""}${w})${P}{${k}` + (F ? `${a}typeof exports${P}===${P}'object'${P}&&${P}typeof module${P}!==${P}'undefined'${P}?${P}${D}${w}(${_.join(`,${P}`)})${P}:${k}` : "") + `${a}typeof ${L}${P}===${P}'function'${P}&&${P}${L}.amd${P}?${P}${L}(${O}${w})${P}:${k}` + `${a}${W}${B}${j};${k}` + `}(${z}(function${P}(${R.join(", ")})${P}{${V}${k}`,
          G = k + k + "})));";
    e.prepend(`${o}${Qi(s, c, E, g, y, v, t, P, k, C, a)}`);
    const H = Ki(i, s, h, E, p, a, g);
    let q = Yi(h && n, f, v, P, k);
    return q && (q = k + k + q), e.append(`${H}${q}${l}`), e.trim().indent(a).append(G).prepend(U);
  }
};

class dn {
  constructor(e, t) {
    this.isOriginal = !0, this.filename = e, this.content = t;
  }

  traceSegment(e, t, s) {
    return {
      column: t,
      line: e,
      name: s,
      source: this
    };
  }

}

class pn {
  constructor(e, t) {
    this.sources = t, this.names = e.names, this.mappings = e.mappings;
  }

  traceMappings() {
    const e = [],
          t = [],
          s = [],
          i = new Map(),
          n = [];

    for (const r of this.mappings) {
      const a = [];

      for (const n of r) {
        if (1 == n.length) continue;
        const r = this.sources[n[1]];
        if (!r) continue;
        const o = r.traceSegment(n[2], n[3], 5 === n.length ? this.names[n[4]] : "");

        if (o) {
          let r = e.lastIndexOf(o.source.filename);
          if (-1 === r) r = e.length, e.push(o.source.filename), t[r] = o.source.content;else if (null == t[r]) t[r] = o.source.content;else if (null != o.source.content && t[r] !== o.source.content) return Us({
            message: `Multiple conflicting contents for sourcemap source ${o.source.filename}`
          });
          const h = [n[0], r, o.line, o.column];

          if (o.name) {
            let e = i.get(o.name);
            void 0 === e && (e = s.length, s.push(o.name), i.set(o.name, e)), h[4] = e;
          }

          a.push(h);
        }
      }

      n.push(a);
    }

    return {
      mappings: n,
      names: s,
      sources: e,
      sourcesContent: t
    };
  }

  traceSegment(e, t, s) {
    const i = this.mappings[e];
    if (!i) return null;
    let n = 0,
        r = i.length - 1;

    for (; n <= r;) {
      const e = n + r >> 1,
            a = i[e];

      if (a[0] === t) {
        if (1 == a.length) return null;
        const e = this.sources[a[1]];
        return e ? e.traceSegment(a[2], a[3], 5 === a.length ? this.names[a[4]] : s) : null;
      }

      a[0] > t ? r = e - 1 : n = e + 1;
    }

    return null;
  }

}

function fn(e) {
  return function (t, s) {
    return s.mappings ? new pn(s, [t]) : (e({
      code: "SOURCEMAP_BROKEN",
      message: `Sourcemap is likely to be incorrect: a plugin (${s.plugin}) was used to transform files, but didn't generate a sourcemap for the transformation. Consult the plugin documentation for help`,
      plugin: s.plugin,
      url: "https://rollupjs.org/guide/en/#warning-sourcemap-is-likely-to-be-incorrect"
    }), new pn({
      mappings: [],
      names: []
    }, [t]));
  };
}

function mn(e, t, s, i, n) {
  let r;

  if (s) {
    const t = s.sources,
          i = s.sourcesContent || [],
          n = I(e) || ".",
          a = s.sourceRoot || ".",
          o = t.map((e, t) => new dn($(n, a, e), i[t]));
    r = new pn(s, o);
  } else r = new dn(e, t);

  return i.reduce(n, r);
}

var gn = {},
    yn = En;

function En(e, t) {
  if (!e) throw new Error(t || "Assertion failed");
}

En.equal = function (e, t, s) {
  if (e != t) throw new Error(s || "Assertion failed: " + e + " != " + t);
};

var xn = {
  exports: {}
};
"function" == typeof Object.create ? xn.exports = function (e, t) {
  t && (e.super_ = t, e.prototype = Object.create(t.prototype, {
    constructor: {
      value: e,
      enumerable: !1,
      writable: !0,
      configurable: !0
    }
  }));
} : xn.exports = function (e, t) {
  if (t) {
    e.super_ = t;

    var s = function () {};

    s.prototype = t.prototype, e.prototype = new s(), e.prototype.constructor = e;
  }
};
var vn = yn,
    bn = xn.exports;

function Sn(e, t) {
  return 55296 == (64512 & e.charCodeAt(t)) && !(t < 0 || t + 1 >= e.length) && 56320 == (64512 & e.charCodeAt(t + 1));
}

function An(e) {
  return (e >>> 24 | e >>> 8 & 65280 | e << 8 & 16711680 | (255 & e) << 24) >>> 0;
}

function Pn(e) {
  return 1 === e.length ? "0" + e : e;
}

function kn(e) {
  return 7 === e.length ? "0" + e : 6 === e.length ? "00" + e : 5 === e.length ? "000" + e : 4 === e.length ? "0000" + e : 3 === e.length ? "00000" + e : 2 === e.length ? "000000" + e : 1 === e.length ? "0000000" + e : e;
}

gn.inherits = bn, gn.toArray = function (e, t) {
  if (Array.isArray(e)) return e.slice();
  if (!e) return [];
  var s = [];
  if ("string" == typeof e) {
    if (t) {
      if ("hex" === t) for ((e = e.replace(/[^a-z0-9]+/gi, "")).length % 2 != 0 && (e = "0" + e), n = 0; n < e.length; n += 2) s.push(parseInt(e[n] + e[n + 1], 16));
    } else for (var i = 0, n = 0; n < e.length; n++) {
      var r = e.charCodeAt(n);
      r < 128 ? s[i++] = r : r < 2048 ? (s[i++] = r >> 6 | 192, s[i++] = 63 & r | 128) : Sn(e, n) ? (r = 65536 + ((1023 & r) << 10) + (1023 & e.charCodeAt(++n)), s[i++] = r >> 18 | 240, s[i++] = r >> 12 & 63 | 128, s[i++] = r >> 6 & 63 | 128, s[i++] = 63 & r | 128) : (s[i++] = r >> 12 | 224, s[i++] = r >> 6 & 63 | 128, s[i++] = 63 & r | 128);
    }
  } else for (n = 0; n < e.length; n++) s[n] = 0 | e[n];
  return s;
}, gn.toHex = function (e) {
  for (var t = "", s = 0; s < e.length; s++) t += Pn(e[s].toString(16));

  return t;
}, gn.htonl = An, gn.toHex32 = function (e, t) {
  for (var s = "", i = 0; i < e.length; i++) {
    var n = e[i];
    "little" === t && (n = An(n)), s += kn(n.toString(16));
  }

  return s;
}, gn.zero2 = Pn, gn.zero8 = kn, gn.join32 = function (e, t, s, i) {
  var n = s - t;
  vn(n % 4 == 0);

  for (var r = new Array(n / 4), a = 0, o = t; a < r.length; a++, o += 4) {
    var h;
    h = "big" === i ? e[o] << 24 | e[o + 1] << 16 | e[o + 2] << 8 | e[o + 3] : e[o + 3] << 24 | e[o + 2] << 16 | e[o + 1] << 8 | e[o], r[a] = h >>> 0;
  }

  return r;
}, gn.split32 = function (e, t) {
  for (var s = new Array(4 * e.length), i = 0, n = 0; i < e.length; i++, n += 4) {
    var r = e[i];
    "big" === t ? (s[n] = r >>> 24, s[n + 1] = r >>> 16 & 255, s[n + 2] = r >>> 8 & 255, s[n + 3] = 255 & r) : (s[n + 3] = r >>> 24, s[n + 2] = r >>> 16 & 255, s[n + 1] = r >>> 8 & 255, s[n] = 255 & r);
  }

  return s;
}, gn.rotr32 = function (e, t) {
  return e >>> t | e << 32 - t;
}, gn.rotl32 = function (e, t) {
  return e << t | e >>> 32 - t;
}, gn.sum32 = function (e, t) {
  return e + t >>> 0;
}, gn.sum32_3 = function (e, t, s) {
  return e + t + s >>> 0;
}, gn.sum32_4 = function (e, t, s, i) {
  return e + t + s + i >>> 0;
}, gn.sum32_5 = function (e, t, s, i, n) {
  return e + t + s + i + n >>> 0;
}, gn.sum64 = function (e, t, s, i) {
  var n = e[t],
      r = i + e[t + 1] >>> 0,
      a = (r < i ? 1 : 0) + s + n;
  e[t] = a >>> 0, e[t + 1] = r;
}, gn.sum64_hi = function (e, t, s, i) {
  return (t + i >>> 0 < t ? 1 : 0) + e + s >>> 0;
}, gn.sum64_lo = function (e, t, s, i) {
  return t + i >>> 0;
}, gn.sum64_4_hi = function (e, t, s, i, n, r, a, o) {
  var h = 0,
      l = t;
  return h += (l = l + i >>> 0) < t ? 1 : 0, h += (l = l + r >>> 0) < r ? 1 : 0, e + s + n + a + (h += (l = l + o >>> 0) < o ? 1 : 0) >>> 0;
}, gn.sum64_4_lo = function (e, t, s, i, n, r, a, o) {
  return t + i + r + o >>> 0;
}, gn.sum64_5_hi = function (e, t, s, i, n, r, a, o, h, l) {
  var c = 0,
      u = t;
  return c += (u = u + i >>> 0) < t ? 1 : 0, c += (u = u + r >>> 0) < r ? 1 : 0, c += (u = u + o >>> 0) < o ? 1 : 0, e + s + n + a + h + (c += (u = u + l >>> 0) < l ? 1 : 0) >>> 0;
}, gn.sum64_5_lo = function (e, t, s, i, n, r, a, o, h, l) {
  return t + i + r + o + l >>> 0;
}, gn.rotr64_hi = function (e, t, s) {
  return (t << 32 - s | e >>> s) >>> 0;
}, gn.rotr64_lo = function (e, t, s) {
  return (e << 32 - s | t >>> s) >>> 0;
}, gn.shr64_hi = function (e, t, s) {
  return e >>> s;
}, gn.shr64_lo = function (e, t, s) {
  return (e << 32 - s | t >>> s) >>> 0;
};
var Cn = {},
    wn = gn,
    In = yn;

function Nn() {
  this.pending = null, this.pendingTotal = 0, this.blockSize = this.constructor.blockSize, this.outSize = this.constructor.outSize, this.hmacStrength = this.constructor.hmacStrength, this.padLength = this.constructor.padLength / 8, this.endian = "big", this._delta8 = this.blockSize / 8, this._delta32 = this.blockSize / 32;
}

Cn.BlockHash = Nn, Nn.prototype.update = function (e, t) {
  if (e = wn.toArray(e, t), this.pending ? this.pending = this.pending.concat(e) : this.pending = e, this.pendingTotal += e.length, this.pending.length >= this._delta8) {
    var s = (e = this.pending).length % this._delta8;
    this.pending = e.slice(e.length - s, e.length), 0 === this.pending.length && (this.pending = null), e = wn.join32(e, 0, e.length - s, this.endian);

    for (var i = 0; i < e.length; i += this._delta32) this._update(e, i, i + this._delta32);
  }

  return this;
}, Nn.prototype.digest = function (e) {
  return this.update(this._pad()), In(null === this.pending), this._digest(e);
}, Nn.prototype._pad = function () {
  var e = this.pendingTotal,
      t = this._delta8,
      s = t - (e + this.padLength) % t,
      i = new Array(s + this.padLength);
  i[0] = 128;

  for (var n = 1; n < s; n++) i[n] = 0;

  if (e <<= 3, "big" === this.endian) {
    for (var r = 8; r < this.padLength; r++) i[n++] = 0;

    i[n++] = 0, i[n++] = 0, i[n++] = 0, i[n++] = 0, i[n++] = e >>> 24 & 255, i[n++] = e >>> 16 & 255, i[n++] = e >>> 8 & 255, i[n++] = 255 & e;
  } else for (i[n++] = 255 & e, i[n++] = e >>> 8 & 255, i[n++] = e >>> 16 & 255, i[n++] = e >>> 24 & 255, i[n++] = 0, i[n++] = 0, i[n++] = 0, i[n++] = 0, r = 8; r < this.padLength; r++) i[n++] = 0;

  return i;
};
var _n = {},
    $n = gn.rotr32;

function Tn(e, t, s) {
  return e & t ^ ~e & s;
}

function Rn(e, t, s) {
  return e & t ^ e & s ^ t & s;
}

function Mn(e, t, s) {
  return e ^ t ^ s;
}

_n.ft_1 = function (e, t, s, i) {
  return 0 === e ? Tn(t, s, i) : 1 === e || 3 === e ? Mn(t, s, i) : 2 === e ? Rn(t, s, i) : void 0;
}, _n.ch32 = Tn, _n.maj32 = Rn, _n.p32 = Mn, _n.s0_256 = function (e) {
  return $n(e, 2) ^ $n(e, 13) ^ $n(e, 22);
}, _n.s1_256 = function (e) {
  return $n(e, 6) ^ $n(e, 11) ^ $n(e, 25);
}, _n.g0_256 = function (e) {
  return $n(e, 7) ^ $n(e, 18) ^ e >>> 3;
}, _n.g1_256 = function (e) {
  return $n(e, 17) ^ $n(e, 19) ^ e >>> 10;
};
var On = gn,
    Ln = Cn,
    Dn = _n,
    Vn = yn,
    Bn = On.sum32,
    Fn = On.sum32_4,
    zn = On.sum32_5,
    Wn = Dn.ch32,
    jn = Dn.maj32,
    Un = Dn.s0_256,
    Gn = Dn.s1_256,
    Hn = Dn.g0_256,
    qn = Dn.g1_256,
    Kn = Ln.BlockHash,
    Xn = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298];

function Yn() {
  if (!(this instanceof Yn)) return new Yn();
  Kn.call(this), this.h = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225], this.k = Xn, this.W = new Array(64);
}

On.inherits(Yn, Kn);
var Qn = Yn;
Yn.blockSize = 512, Yn.outSize = 256, Yn.hmacStrength = 192, Yn.padLength = 64, Yn.prototype._update = function (e, t) {
  for (var s = this.W, i = 0; i < 16; i++) s[i] = e[t + i];

  for (; i < s.length; i++) s[i] = Fn(qn(s[i - 2]), s[i - 7], Hn(s[i - 15]), s[i - 16]);

  var n = this.h[0],
      r = this.h[1],
      a = this.h[2],
      o = this.h[3],
      h = this.h[4],
      l = this.h[5],
      c = this.h[6],
      u = this.h[7];

  for (Vn(this.k.length === s.length), i = 0; i < s.length; i++) {
    var d = zn(u, Gn(h), Wn(h, l, c), this.k[i], s[i]),
        p = Bn(Un(n), jn(n, r, a));
    u = c, c = l, l = h, h = Bn(o, d), o = a, a = r, r = n, n = Bn(d, p);
  }

  this.h[0] = Bn(this.h[0], n), this.h[1] = Bn(this.h[1], r), this.h[2] = Bn(this.h[2], a), this.h[3] = Bn(this.h[3], o), this.h[4] = Bn(this.h[4], h), this.h[5] = Bn(this.h[5], l), this.h[6] = Bn(this.h[6], c), this.h[7] = Bn(this.h[7], u);
}, Yn.prototype._digest = function (e) {
  return "hex" === e ? On.toHex32(this.h, "big") : On.split32(this.h, "big");
};
var Zn = Qn;

const Jn = () => Zn(),
      er = {
  amd: ir,
  cjs: ir,
  es: sr,
  iife: ir,
  system: sr,
  umd: ir
};

function tr(e, t, s, i, n, r, a, o, h, l, c, u, d) {
  const p = e.slice().reverse();

  for (const e of p) e.scope.addUsedOutsideNames(i, n, c, u);

  !function (e, t, s) {
    for (const i of t) {
      for (const t of i.scope.variables.values()) t.included && !(t.renderBaseName || t instanceof Ei && t.getOriginalVariable() !== t) && t.setRenderNames(null, We(t.name, e));

      if (s.has(i)) {
        const t = i.namespace;
        t.setRenderNames(null, We(t.name, e));
      }
    }
  }(i, p, d), er[n](i, s, t, r, a, o, h, l);

  for (const e of p) e.scope.deconflict(n, c, u);
}

function sr(e, t, s, i, n, r, a, o) {
  for (const t of s.dependencies) (n || t instanceof oe) && (t.variableName = We(t.suggestedVariableName, e));

  for (const s of t) {
    const t = s.module,
          i = s.name;
    s.isNamespace && (n || t instanceof oe) ? s.setRenderNames(null, (t instanceof oe ? t : a.get(t)).variableName) : t instanceof oe && "default" === i ? s.setRenderNames(null, We([...t.exportedVariables].some(([e, t]) => "*" === t && e.included) ? t.suggestedVariableName + "__default" : t.suggestedVariableName, e)) : s.setRenderNames(null, We(i, e));
  }

  for (const t of o) t.setRenderNames(null, We(t.name, e));
}

function ir(e, t, {
  deconflictedDefault: s,
  deconflictedNamespace: i,
  dependencies: n
}, r, a, o, h) {
  for (const t of n) t.variableName = We(t.suggestedVariableName, e);

  for (const t of i) t.namespaceVariableName = We(`${t.suggestedVariableName}__namespace`, e);

  for (const t of s) i.has(t) && Ts(String(r(t.id)), o) ? t.defaultVariableName = t.namespaceVariableName : t.defaultVariableName = We(`${t.suggestedVariableName}__default`, e);

  for (const e of t) {
    const t = e.module;

    if (t instanceof oe) {
      const s = e.name;

      if ("default" === s) {
        const s = String(r(t.id)),
              i = Ns[s] ? t.defaultVariableName : t.variableName;
        _s(s, o) ? e.setRenderNames(i, "default") : e.setRenderNames(null, i);
      } else "*" === s ? e.setRenderNames(null, $s[String(r(t.id))] ? t.namespaceVariableName : t.variableName) : e.setRenderNames(t.variableName, null);
    } else {
      const s = h.get(t);
      a && e.isNamespace ? e.setRenderNames(null, "default" === s.exportMode ? s.namespaceVariableName : s.variableName) : "default" === s.exportMode ? e.setRenderNames(null, s.variableName) : e.setRenderNames(s.variableName, s.getVariableExportName(e));
    }
  }
}

const nr = /[\\'\r\n\u2028\u2029]/,
      rr = /(['\r\n\u2028\u2029])/g,
      ar = /\\/g;

function or(e) {
  return e.match(nr) ? e.replace(ar, "\\\\").replace(rr, "\\$1") : e;
}

function hr(e, {
  exports: t,
  name: s,
  format: i
}, n, r, a) {
  const o = e.getExportNames();

  if ("default" === t) {
    if (1 !== o.length || "default" !== o[0]) return Us(Ks("default", o, r));
  } else if ("none" === t && o.length) return Us(Ks("none", o, r));

  return "auto" === t && (0 === o.length ? t = "none" : 1 === o.length && "default" === o[0] ? ("cjs" === i && n.has("exports") && a(function (e) {
    const t = re(e);
    return {
      code: Hs.PREFER_NAMED_EXPORTS,
      id: e,
      message: `Entry module "${t}" is implicitly using "default" export mode, which means for CommonJS output that its default export is assigned to "module.exports". For many tools, such CommonJS output will not be interchangeable with the original ES module. If this is intended, explicitly set "output.exports" to either "auto" or "default", otherwise you might want to consider changing the signature of "${t}" to use named exports only.`,
      url: "https://rollupjs.org/guide/en/#outputexports"
    };
  }(r)), t = "default") : ("es" !== i && -1 !== o.indexOf("default") && a(function (e, t) {
    return {
      code: Hs.MIXED_EXPORTS,
      id: e,
      message: `Entry module "${re(e)}" is using named and default exports together. Consumers of your bundle will have to use \`${t || "chunk"}["default"]\` to access the default export, which may not be what you want. Use \`output.exports: "named"\` to disable this warning`,
      url: "https://rollupjs.org/guide/en/#outputexports"
    };
  }(r, s)), t = "named")), t;
}

function lr(e) {
  const t = e.split("\n"),
        s = t.filter(e => /^\t+/.test(e)),
        i = t.filter(e => /^ {2,}/.test(e));
  if (0 === s.length && 0 === i.length) return null;
  if (s.length >= i.length) return "\t";
  const n = i.reduce((e, t) => {
    const s = /^ +/.exec(t)[0].length;
    return Math.min(s, e);
  }, 1 / 0);
  return new Array(n + 1).join(" ");
}

function cr(e, t, s, i, n) {
  const r = e.getDependenciesToBeIncluded();

  for (const e of r) {
    if (e instanceof oe) {
      t.push(e);
      continue;
    }

    const r = n.get(e);
    r === i ? s.has(e) || (s.add(e), cr(e, t, s, i, n)) : t.push(r);
  }
}

function ur(e) {
  if (!e) return null;
  if ("string" == typeof e && (e = JSON.parse(e)), "" === e.mappings) return {
    mappings: [],
    names: [],
    sources: [],
    version: 3
  };
  let s;
  return s = "string" == typeof e.mappings ? function (e) {
    for (var s = [], i = [], r = [0, 0, 0, 0, 0], a = 0, o = 0, h = 0, l = 0; o < e.length; o++) {
      var c = e.charCodeAt(o);
      if (44 === c) n(i, r, a), a = 0;else if (59 === c) n(i, r, a), a = 0, s.push(i), i = [], r[0] = 0;else {
        var u = t[c];
        if (void 0 === u) throw new Error("Invalid character (" + String.fromCharCode(c) + ")");
        var d = 32 & u;
        if (l += (u &= 31) << h, d) h += 5;else {
          var p = 1 & l;
          l >>>= 1, p && (l = 0 === l ? -2147483648 : -l), r[a] += l, a++, l = h = 0;
        }
      }
    }

    return n(i, r, a), s.push(i), s;
  }(e.mappings) : e.mappings, { ...e,
    mappings: s
  };
}

function dr(e, t, s) {
  return ae(e) ? Us(si(`Invalid pattern "${e}" for "${t}", patterns can be neither absolute nor relative paths.`)) : e.replace(/\[(\w+)\]/g, (e, i) => {
    if (!s.hasOwnProperty(i)) return Us(si(`"[${i}]" is not a valid placeholder in "${t}" pattern.`));
    const n = s[i]();
    return ae(n) ? Us(si(`Invalid substitution "${n}" for placeholder "[${i}]" in "${t}" pattern, can be neither absolute nor relative path.`)) : n;
  });
}

function pr(e, t) {
  const s = new Set(Object.keys(t).map(e => e.toLowerCase()));
  if (!s.has(e.toLocaleLowerCase())) return e;
  const i = N(e);
  e = e.substr(0, e.length - i.length);
  let n,
      r = 1;

  for (; s.has((n = e + ++r + i).toLowerCase()););

  return n;
}

const fr = [".js", ".jsx", ".ts", ".tsx"];

function mr(e, t, s, i) {
  const n = "function" == typeof t ? t(e.id) : t[e.id];
  return n || (s ? (i({
    code: "MISSING_GLOBAL_NAME",
    guess: e.variableName,
    message: `No name was provided for external module '${e.id}' in output.globals – guessing '${e.variableName}'`,
    source: e.id
  }), e.variableName) : void 0);
}

class gr {
  constructor(e, t, s, i, n, r, a, o, h, l) {
    this.orderedModules = e, this.inputOptions = t, this.outputOptions = s, this.unsetOptions = i, this.pluginDriver = n, this.modulesById = r, this.chunkByModule = a, this.facadeChunkByModule = o, this.includedNamespaces = h, this.manualChunkAlias = l, this.entryModules = [], this.exportMode = "named", this.facadeModule = null, this.id = null, this.namespaceVariableName = "", this.variableName = "", this.accessedGlobalsByScope = new Map(), this.dependencies = new Set(), this.dynamicDependencies = new Set(), this.dynamicEntryModules = [], this.dynamicName = null, this.exportNamesByVariable = new Map(), this.exports = new Set(), this.exportsByName = Object.create(null), this.fileName = null, this.implicitEntryModules = [], this.implicitlyLoadedBefore = new Set(), this.imports = new Set(), this.indentString = void 0, this.isEmpty = !0, this.name = null, this.needsExportsShim = !1, this.renderedDependencies = null, this.renderedExports = null, this.renderedHash = void 0, this.renderedModuleSources = new Map(), this.renderedModules = Object.create(null), this.renderedSource = null, this.sortedExportNames = null, this.strictFacade = !1, this.usedModules = void 0, this.execIndex = e.length > 0 ? e[0].execIndex : 1 / 0;
    const c = new Set(e);

    for (const t of e) {
      t.namespace.included && h.add(t), this.isEmpty && t.isIncluded() && (this.isEmpty = !1), (t.info.isEntry || s.preserveModules) && this.entryModules.push(t);

      for (const e of t.includedDynamicImporters) c.has(e) || (this.dynamicEntryModules.push(t), t.info.syntheticNamedExports && !s.preserveModules && (h.add(t), this.exports.add(t.namespace)));

      t.implicitlyLoadedAfter.size > 0 && this.implicitEntryModules.push(t);
    }

    this.suggestedVariableName = se(this.generateVariableName());
  }

  static generateFacade(e, t, s, i, n, r, a, o, h, l) {
    const c = new gr([], e, t, s, i, n, r, a, o, null);
    c.assignFacadeName(l, h), a.has(h) || a.set(h, c);

    for (const e of h.getDependenciesToBeIncluded()) c.dependencies.add(e instanceof Ui ? r.get(e) : e);

    return !c.dependencies.has(r.get(h)) && h.info.hasModuleSideEffects && h.hasEffects() && c.dependencies.add(r.get(h)), c.ensureReexportsAreAvailableForModule(h), c.facadeModule = h, c.strictFacade = !0, c;
  }

  canModuleBeFacade(e, t) {
    const s = e.getExportNamesByVariable();

    for (const t of this.exports) if (!s.has(t)) return 0 === s.size && e.isUserDefinedEntryPoint && "strict" === e.preserveSignature && this.unsetOptions.has("preserveEntrySignatures") && this.inputOptions.onwarn({
      code: "EMPTY_FACADE",
      id: e.id,
      message: `To preserve the export signature of the entry module "${re(e.id)}", an empty facade chunk was created. This often happens when creating a bundle for a web app where chunks are placed in script tags and exports are ignored. In this case it is recommended to set "preserveEntrySignatures: false" to avoid this and reduce the number of chunks. Otherwise if this is intentional, set "preserveEntrySignatures: 'strict'" explicitly to silence this warning.`,
      url: "https://rollupjs.org/guide/en/#preserveentrysignatures"
    }), !1;

    for (const i of t) if (!s.has(i) && i.module !== e) return !1;

    return !0;
  }

  generateExports() {
    this.sortedExportNames = null;
    const e = new Set(this.exports);

    if (null !== this.facadeModule && (!1 !== this.facadeModule.preserveSignature || this.strictFacade)) {
      const t = this.facadeModule.getExportNamesByVariable();

      for (const [s, i] of t) {
        this.exportNamesByVariable.set(s, [...i]);

        for (const e of i) this.exportsByName[e] = s;

        e.delete(s);
      }
    }

    this.outputOptions.minifyInternalExports ? function (e, t, s) {
      let i = 0;

      for (const n of e) {
        let e = n.name[0];
        if (t[e]) do {
          e = ze(++i), 49 === e.charCodeAt(0) && (i += 9 * 64 ** (e.length - 1), e = ze(i));
        } while (T[e] || t[e]);
        t[e] = n, s.set(n, [e]);
      }
    }(e, this.exportsByName, this.exportNamesByVariable) : function (e, t, s) {
      for (const i of e) {
        let e = 0,
            n = i.name;

        for (; t[n];) n = i.name + "$" + ++e;

        t[n] = i, s.set(i, [n]);
      }
    }(e, this.exportsByName, this.exportNamesByVariable), (this.outputOptions.preserveModules || this.facadeModule && this.facadeModule.info.isEntry) && (this.exportMode = hr(this, this.outputOptions, this.unsetOptions, this.facadeModule.id, this.inputOptions.onwarn));
  }

  generateFacades() {
    var e;
    const t = [],
          s = new Set([...this.entryModules, ...this.implicitEntryModules]),
          i = new Set(this.dynamicEntryModules.map(e => e.namespace));

    for (const e of s) if (e.preserveSignature) for (const t of e.getExportNamesByVariable().keys()) i.add(t);

    for (const e of s) {
      const s = Array.from(e.userChunkNames, e => ({
        name: e
      }));

      if (0 === s.length && e.isUserDefinedEntryPoint && s.push({}), s.push(...Array.from(e.chunkFileNames, e => ({
        fileName: e
      }))), 0 === s.length && s.push({}), !this.facadeModule) {
        const t = "strict" === e.preserveSignature || "exports-only" === e.preserveSignature && 0 !== e.getExportNamesByVariable().size;
        (!t || this.outputOptions.preserveModules || this.canModuleBeFacade(e, i)) && (this.facadeModule = e, this.facadeChunkByModule.set(e, this), e.preserveSignature && (this.strictFacade = t), this.assignFacadeName(s.shift(), e));
      }

      for (const i of s) t.push(gr.generateFacade(this.inputOptions, this.outputOptions, this.unsetOptions, this.pluginDriver, this.modulesById, this.chunkByModule, this.facadeChunkByModule, this.includedNamespaces, e, i));
    }

    for (const t of this.dynamicEntryModules) t.info.syntheticNamedExports || (!this.facadeModule && this.canModuleBeFacade(t, i) ? (this.facadeModule = t, this.facadeChunkByModule.set(t, this), this.strictFacade = !0, this.dynamicName = yr(t)) : this.facadeModule === t && !this.strictFacade && this.canModuleBeFacade(t, i) ? this.strictFacade = !0 : (null === (e = this.facadeChunkByModule.get(t)) || void 0 === e ? void 0 : e.strictFacade) || (this.includedNamespaces.add(t), this.exports.add(t.namespace)));

    return t;
  }

  generateId(e, t, s, i) {
    if (null !== this.fileName) return this.fileName;
    const [n, r] = this.facadeModule && this.facadeModule.isUserDefinedEntryPoint ? [t.entryFileNames, "output.entryFileNames"] : [t.chunkFileNames, "output.chunkFileNames"];
    return pr(dr("function" == typeof n ? n(this.getChunkInfo()) : n, r, {
      format: () => t.format,
      hash: () => i ? this.computeContentHashWithDependencies(e, t, s) : "[hash]",
      name: () => this.getChunkName()
    }), s);
  }

  generateIdPreserveModules(e, t, s, i) {
    const n = this.orderedModules[0].id,
          r = this.outputOptions.sanitizeFileName(n);
    let a;

    if (P(n)) {
      const s = N(n),
            o = i.has("entryFileNames") ? "[name][assetExtname].js" : t.entryFileNames,
            h = `${I(r)}/${dr("function" == typeof o ? o(this.getChunkInfo()) : o, "output.entryFileNames", {
        assetExtname: () => fr.includes(s) ? "" : s,
        ext: () => s.substr(1),
        extname: () => s,
        format: () => t.format,
        name: () => this.getChunkName()
      })}`,
            {
        preserveModulesRoot: l
      } = t;
      a = l && h.startsWith(l) ? h.slice(l.length).replace(/^[\\/]/, "") : _(e, h);
    } else a = `_virtual/${w(r)}`;

    return pr(C(a), s);
  }

  getChunkInfo() {
    const e = this.facadeModule,
          t = this.getChunkName.bind(this);
    return {
      exports: this.getExportNames(),
      facadeModuleId: e && e.id,
      isDynamicEntry: this.dynamicEntryModules.length > 0,
      isEntry: null !== e && e.info.isEntry,
      isImplicitEntry: this.implicitEntryModules.length > 0,
      modules: this.renderedModules,

      get name() {
        return t();
      },

      type: "chunk"
    };
  }

  getChunkInfoWithFileNames() {
    return Object.assign(this.getChunkInfo(), {
      code: void 0,
      dynamicImports: Array.from(this.dynamicDependencies, Ci),
      fileName: this.id,
      implicitlyLoadedBefore: Array.from(this.implicitlyLoadedBefore, Ci),
      importedBindings: this.getImportedBindingsPerDependency(),
      imports: Array.from(this.dependencies, Ci),
      map: void 0,
      referencedFiles: this.getReferencedFiles()
    });
  }

  getChunkName() {
    return this.name || (this.name = this.outputOptions.sanitizeFileName(this.getFallbackChunkName()));
  }

  getExportNames() {
    return this.sortedExportNames || (this.sortedExportNames = Object.keys(this.exportsByName).sort());
  }

  getRenderedHash() {
    if (this.renderedHash) return this.renderedHash;
    const e = Jn(),
          t = this.pluginDriver.hookReduceValueSync("augmentChunkHash", "", [this.getChunkInfo()], (e, t) => (t && (e += t), e));
    return e.update(t), e.update(this.renderedSource.toString()), e.update(this.getExportNames().map(e => {
      const t = this.exportsByName[e];
      return `${re(t.module.id).replace(/\\/g, "/")}:${t.name}:${e}`;
    }).join(",")), this.renderedHash = e.digest("hex");
  }

  getVariableExportName(e) {
    return this.outputOptions.preserveModules && e instanceof Ai ? "*" : this.exportNamesByVariable.get(e)[0];
  }

  link() {
    this.dependencies = function (e, t, s) {
      const i = [],
            n = new Set();

      for (let r = t.length - 1; r >= 0; r--) {
        const a = t[r];

        if (!n.has(a)) {
          const t = [];
          cr(a, t, n, e, s), i.unshift(t);
        }
      }

      const r = new Set();

      for (const e of i) for (const t of e) r.add(t);

      return r;
    }(this, this.orderedModules, this.chunkByModule);

    for (const e of this.orderedModules) this.addDependenciesToChunk(e.dynamicDependencies, this.dynamicDependencies), this.addDependenciesToChunk(e.implicitlyLoadedBefore, this.implicitlyLoadedBefore), this.setUpChunkImportsAndExportsForModule(e);
  }

  preRender(e, t) {
    const s = new v({
      separator: e.compact ? "" : "\n\n"
    });
    this.usedModules = [], this.indentString = function (e, t) {
      if (!0 !== t.indent) return t.indent;

      for (let t = 0; t < e.length; t++) {
        const s = lr(e[t].originalCode);
        if (null !== s) return s;
      }

      return "\t";
    }(this.orderedModules, e);
    const i = e.compact ? "" : "\n",
          n = e.compact ? "" : " ",
          r = {
      compact: e.compact,
      dynamicImportFunction: e.dynamicImportFunction,
      exportNamesByVariable: this.exportNamesByVariable,
      format: e.format,
      freeze: e.freeze,
      indent: this.indentString,
      namespaceToStringTag: e.namespaceToStringTag,
      outputPluginDriver: this.pluginDriver,
      varOrConst: e.preferConst ? "const" : "var"
    };
    if (e.hoistTransitiveImports && !this.outputOptions.preserveModules && null !== this.facadeModule) for (const e of this.dependencies) e instanceof gr && this.inlineChunkDependencies(e);
    this.prepareDynamicImportsAndImportMetas(), this.setIdentifierRenderResolutions(e);
    let a = "";
    const o = this.renderedModules;

    for (const t of this.orderedModules) {
      let n = 0;

      if (t.isIncluded() || this.includedNamespaces.has(t)) {
        const o = t.render(r).trim();
        n = o.length(), n && (e.compact && -1 !== o.lastLine().indexOf("//") && o.append("\n"), this.renderedModuleSources.set(t, o), s.addSource(o), this.usedModules.push(t));
        const h = t.namespace;

        if (this.includedNamespaces.has(t) && !this.outputOptions.preserveModules) {
          const e = h.renderBlock(r);
          h.renderFirst() ? a += i + e : s.addSource(new b(e));
        }
      }

      const {
        renderedExports: h,
        removedExports: l
      } = t.getRenderedExports(),
            {
        renderedModuleSources: c
      } = this;
      o[t.id] = {
        get code() {
          var e, s;
          return null !== (s = null === (e = c.get(t)) || void 0 === e ? void 0 : e.toString()) && void 0 !== s ? s : null;
        },

        originalLength: t.originalCode.length,
        removedExports: l,
        renderedExports: h,
        renderedLength: n
      };
    }

    if (a && s.prepend(a + i + i), this.needsExportsShim && s.prepend(`${i}${r.varOrConst} _missingExportShim${n}=${n}void 0;${i}${i}`), e.compact ? this.renderedSource = s : this.renderedSource = s.trim(), this.renderedHash = void 0, this.isEmpty && 0 === this.getExportNames().length && 0 === this.dependencies.size) {
      const e = this.getChunkName();
      this.inputOptions.onwarn({
        chunkName: e,
        code: "EMPTY_BUNDLE",
        message: `Generated an empty chunk: "${e}"`
      });
    }

    this.setExternalRenderPaths(e, t), this.renderedDependencies = this.getChunkDependencyDeclarations(e), this.renderedExports = "none" === this.exportMode ? [] : this.getChunkExportDeclarations(e.format);
  }

  async render(e, t, s) {
    Li("render format", 2);
    const i = e.format,
          n = un[i];
    e.dynamicImportFunction && "es" !== i && this.inputOptions.onwarn({
      code: "INVALID_OPTION",
      message: '"output.dynamicImportFunction" is ignored for formats other than "es".'
    });

    for (const e of this.dependencies) {
      const t = this.renderedDependencies.get(e);

      if (e instanceof oe) {
        const s = e.renderPath;
        t.id = or(e.renormalizeRenderPath ? this.getRelativePath(s, !1) : s);
      } else t.namedExportsMode = "default" !== e.exportMode, t.id = or(this.getRelativePath(e.id, !1));
    }

    this.finaliseDynamicImports(e), this.finaliseImportMetas(i);
    const r = 0 !== this.renderedExports.length || [...this.renderedDependencies.values()].some(e => e.reexports && 0 !== e.reexports.length);
    let a = !1;
    const o = new Set();

    for (const e of this.orderedModules) {
      e.usesTopLevelAwait && (a = !0);
      const t = this.accessedGlobalsByScope.get(e.scope);
      if (t) for (const e of t) o.add(e);
    }

    if (a && "es" !== i && "system" !== i) return Us({
      code: "INVALID_TLA_FORMAT",
      message: `Module format ${i} does not support top-level await. Use the "es" or "system" output formats rather.`
    });
    if (!this.id) throw new Error("Internal Error: expecting chunk id");
    const h = n(this.renderedSource, {
      accessedGlobals: o,
      dependencies: [...this.renderedDependencies.values()],
      exports: this.renderedExports,
      hasExports: r,
      id: this.id,
      indentString: this.indentString,
      intro: t.intro,
      isEntryFacade: this.outputOptions.preserveModules || null !== this.facadeModule && this.facadeModule.info.isEntry,
      isModuleFacade: null !== this.facadeModule,
      namedExportsMode: "default" !== this.exportMode,
      outro: t.outro,
      usesTopLevelAwait: a,
      varOrConst: e.preferConst ? "const" : "var",
      warn: this.inputOptions.onwarn
    }, e);
    t.banner && h.prepend(t.banner), t.footer && h.append(t.footer);
    const c = h.toString();
    Di("render format", 2);
    let u = null;
    const d = [];
    let p = await function ({
      code: e,
      options: t,
      outputPluginDriver: s,
      renderChunk: i,
      sourcemapChain: n
    }) {
      return s.hookReduceArg0("renderChunk", [e, i, t], (e, t, s) => {
        if (null == t) return e;

        if ("string" == typeof t && (t = {
          code: t,
          map: void 0
        }), null !== t.map) {
          const e = ur(t.map);
          n.push(e || {
            missing: !0,
            plugin: s.name
          });
        }

        return t.code;
      });
    }({
      code: c,
      options: e,
      outputPluginDriver: this.pluginDriver,
      renderChunk: s,
      sourcemapChain: d
    });

    if (e.sourcemap) {
      let t;
      Li("sourcemap", 2), t = e.file ? $(e.sourcemapFile || e.file) : e.dir ? $(e.dir, this.id) : $(this.id);
      const s = h.generateDecodedMap({});
      u = function (e, t, s, i, n, r) {
        const a = fn(r),
              o = s.filter(e => !e.excludeFromSourcemap).map(e => mn(e.id, e.originalCode, e.originalSourcemap, e.sourcemapChain, a));
        let h = new pn(t, o);
        h = i.reduce(a, h);
        let {
          sources: c,
          sourcesContent: u,
          names: d,
          mappings: p
        } = h.traceMappings();

        if (e) {
          const t = I(e);
          c = c.map(e => _(t, e)), e = w(e);
        }

        return u = n ? null : u, new l({
          file: e,
          mappings: p,
          names: d,
          sources: c,
          sourcesContent: u
        });
      }(t, s, this.usedModules, d, e.sourcemapExcludeSources, this.inputOptions.onwarn), u.sources = u.sources.map(s => {
        const {
          sourcemapPathTransform: i
        } = e;

        if (i) {
          const e = i(s, `${t}.map`);
          return "string" != typeof e && Us(si("sourcemapPathTransform function must return a string.")), e;
        }

        return s;
      }).map(C), Di("sourcemap", 2);
    }

    return e.compact || "\n" === p[p.length - 1] || (p += "\n"), {
      code: p,
      map: u
    };
  }

  addDependenciesToChunk(e, t) {
    for (const s of e) if (s instanceof Ui) {
      const e = this.chunkByModule.get(s);
      e && e !== this && t.add(e);
    } else t.add(s);
  }

  assignFacadeName({
    fileName: e,
    name: t
  }, s) {
    e ? this.fileName = e : this.name = this.outputOptions.sanitizeFileName(t || yr(s));
  }

  checkCircularDependencyImport(e, t) {
    const s = e.module;

    if (s instanceof Ui) {
      const o = this.chunkByModule.get(s);
      let h;

      do {
        if (h = t.alternativeReexportModules.get(e), h) {
          const l = this.chunkByModule.get(h);
          l && l !== o && this.inputOptions.onwarn((i = s.getExportNamesByVariable().get(e)[0], n = s.id, r = h.id, a = t.id, {
            code: Hs.CYCLIC_CROSS_CHUNK_REEXPORT,
            exporter: n,
            importer: a,
            message: `Export "${i}" of module ${re(n)} was reexported through module ${re(r)} while both modules are dependencies of each other and will end up in different chunks by current Rollup settings. This scenario is not well supported at the moment as it will produce a circular dependency between chunks and will likely lead to broken execution order.\nEither change the import in ${re(a)} to point directly to the exporting module or do not use "preserveModules" to ensure these modules end up in the same chunk.`,
            reexporter: r
          })), t = h;
        }
      } while (h);
    }

    var i, n, r, a;
  }

  computeContentHashWithDependencies(e, t, s) {
    const i = Jn();
    i.update([e.intro, e.outro, e.banner, e.footer].map(e => e || "").join(":")), i.update(t.format);
    const n = new Set([this]);

    for (const r of n) if (r instanceof oe ? i.update(":" + r.renderPath) : (i.update(r.getRenderedHash()), i.update(r.generateId(e, t, s, !1))), !(r instanceof oe)) for (const e of [...r.dependencies, ...r.dynamicDependencies]) n.add(e);

    return i.digest("hex").substr(0, 8);
  }

  ensureReexportsAreAvailableForModule(e) {
    const t = e.getExportNamesByVariable();

    for (const s of t.keys()) {
      const t = s instanceof Pi,
            i = t ? s.getBaseVariable() : s;

      if (!(i instanceof Ai && this.outputOptions.preserveModules)) {
        this.checkCircularDependencyImport(i, e);
        const s = i.module;

        if (s instanceof Ui) {
          const e = this.chunkByModule.get(s);
          e && e !== this && (e.exports.add(i), t && this.imports.add(i));
        }
      }
    }
  }

  finaliseDynamicImports(e) {
    const t = "amd" === e.format;

    for (const [s, i] of this.renderedModuleSources) for (const {
      node: n,
      resolution: r
    } of s.dynamicImports) {
      const s = this.chunkByModule.get(r),
            a = this.facadeChunkByModule.get(r);
      if (!r || !n.included || s === this) continue;
      const o = r instanceof Ui ? `'${this.getRelativePath((a || s).id, t)}'` : r instanceof oe ? `'${r.renormalizeRenderPath ? this.getRelativePath(r.renderPath, t) : r.renderPath}'` : r;
      n.renderFinalResolution(i, o, r instanceof Ui && !(null == a ? void 0 : a.strictFacade) && s.exportNamesByVariable.get(r.namespace)[0], e);
    }
  }

  finaliseImportMetas(e) {
    for (const [t, s] of this.renderedModuleSources) for (const i of t.importMetas) i.renderFinalMechanism(s, this.id, e, this.pluginDriver);
  }

  generateVariableName() {
    if (this.manualChunkAlias) return this.manualChunkAlias;
    const e = this.entryModules[0] || this.implicitEntryModules[0] || this.dynamicEntryModules[0] || this.orderedModules[this.orderedModules.length - 1];
    return e ? e.chunkName || ne(e.id) : "chunk";
  }

  getChunkDependencyDeclarations(e) {
    const t = this.getImportSpecifiers(),
          s = this.getReexportSpecifiers(),
          i = new Map();

    for (const n of this.dependencies) {
      const r = t.get(n) || null,
            a = s.get(n) || null,
            o = n instanceof oe || "default" !== n.exportMode;
      i.set(n, {
        defaultVariableName: n.defaultVariableName,
        globalName: n instanceof oe && ("umd" === e.format || "iife" === e.format) && mr(n, e.globals, null !== (r || a), this.inputOptions.onwarn),
        id: void 0,
        imports: r,
        isChunk: n instanceof gr,
        name: n.variableName,
        namedExportsMode: o,
        namespaceVariableName: n.namespaceVariableName,
        reexports: a
      });
    }

    return i;
  }

  getChunkExportDeclarations(e) {
    const t = [];

    for (const s of this.getExportNames()) {
      if ("*" === s[0]) continue;
      const i = this.exportsByName[s];

      if (!(i instanceof Pi)) {
        const e = i.module;
        if (e && this.chunkByModule.get(e) !== this) continue;
      }

      let n = null,
          r = !1,
          a = i.getName();

      if (i instanceof rt) {
        for (const e of i.declarations) if (e.parent instanceof Gt || e instanceof Ht && e.declaration instanceof Gt) {
          r = !0;
          break;
        }
      } else i instanceof Pi && (n = a, "es" === e && (a = i.renderName));

      t.push({
        exported: s,
        expression: n,
        hoisted: r,
        local: a
      });
    }

    return t;
  }

  getDependenciesToBeDeconflicted(e, t, s) {
    const i = new Set(),
          n = new Set(),
          r = new Set();

    for (const t of [...this.exportNamesByVariable.keys(), ...this.imports]) if (e || t.isNamespace) {
      const a = t.module;
      if (a instanceof oe) i.add(a), e && ("default" === t.name ? Ns[String(s(a.id))] && n.add(a) : "*" === t.name && $s[String(s(a.id))] && r.add(a));else {
        const s = this.chunkByModule.get(a);
        s !== this && (i.add(s), e && "default" === s.exportMode && t.isNamespace && r.add(s));
      }
    }

    if (t) for (const e of this.dependencies) i.add(e);
    return {
      deconflictedDefault: n,
      deconflictedNamespace: r,
      dependencies: i
    };
  }

  getFallbackChunkName() {
    return this.manualChunkAlias ? this.manualChunkAlias : this.dynamicName ? this.dynamicName : this.fileName ? ne(this.fileName) : ne(this.orderedModules[this.orderedModules.length - 1].id);
  }

  getImportSpecifiers() {
    const {
      interop: e
    } = this.outputOptions,
          t = new Map();

    for (const s of this.imports) {
      const i = s.module;
      let n, r;

      if (i instanceof oe) {
        if (n = i, r = s.name, "default" !== r && "*" !== r && "defaultOnly" === e(i.id)) return Us(ei(i.id, r, !1));
      } else n = this.chunkByModule.get(i), r = n.getVariableExportName(s);

      R(t, n, () => []).push({
        imported: r,
        local: s.getName()
      });
    }

    return t;
  }

  getImportedBindingsPerDependency() {
    const e = {};

    for (const [t, s] of this.renderedDependencies) {
      const i = new Set();
      if (s.imports) for (const {
        imported: e
      } of s.imports) i.add(e);
      if (s.reexports) for (const {
        imported: e
      } of s.reexports) i.add(e);
      e[t.id] = [...i];
    }

    return e;
  }

  getReexportSpecifiers() {
    const {
      externalLiveBindings: e,
      interop: t
    } = this.outputOptions,
          s = new Map();

    for (let i of this.getExportNames()) {
      let n,
          r,
          a = !1;

      if ("*" === i[0]) {
        const s = i.substr(1);
        "defaultOnly" === t(s) && this.inputOptions.onwarn(ti(s)), a = e, n = this.modulesById.get(s), r = i = "*";
      } else {
        const s = this.exportsByName[i];
        if (s instanceof Pi) continue;
        const o = s.module;

        if (o instanceof Ui) {
          if (n = this.chunkByModule.get(o), n === this) continue;
          r = n.getVariableExportName(s), a = s.isReassigned;
        } else {
          if (n = o, r = s.name, "default" !== r && "*" !== r && "defaultOnly" === t(o.id)) return Us(ei(o.id, r, !0));
          a = e && ("default" !== r || _s(String(t(o.id)), !0));
        }
      }

      R(s, n, () => []).push({
        imported: r,
        needsLiveBinding: a,
        reexported: i
      });
    }

    return s;
  }

  getReferencedFiles() {
    const e = [];

    for (const t of this.orderedModules) for (const s of t.importMetas) {
      const t = s.getReferencedFileName(this.pluginDriver);
      t && e.push(t);
    }

    return e;
  }

  getRelativePath(e, t) {
    let s = C(_(I(this.id), e));
    return t && s.endsWith(".js") && (s = s.slice(0, -3)), ".." === s ? "../../" + w(e) : "" === s ? "../" + w(e) : s.startsWith("../") ? s : "./" + s;
  }

  inlineChunkDependencies(e) {
    for (const t of e.dependencies) this.dependencies.has(t) || (this.dependencies.add(t), t instanceof gr && this.inlineChunkDependencies(t));
  }

  prepareDynamicImportsAndImportMetas() {
    var e;
    const t = this.accessedGlobalsByScope;

    for (const s of this.orderedModules) {
      for (const {
        node: i,
        resolution: n
      } of s.dynamicImports) if (i.included) if (n instanceof Ui) {
        const s = this.chunkByModule.get(n);
        s === this ? i.setInternalResolution(n.namespace) : i.setExternalResolution((null === (e = this.facadeChunkByModule.get(n)) || void 0 === e ? void 0 : e.exportMode) || s.exportMode, n, this.outputOptions, this.pluginDriver, t);
      } else i.setExternalResolution("external", n, this.outputOptions, this.pluginDriver, t);

      for (const e of s.importMetas) e.addAccessedGlobals(this.outputOptions.format, t);
    }
  }

  setExternalRenderPaths(e, t) {
    for (const s of [...this.dependencies, ...this.dynamicDependencies]) s instanceof oe && s.setRenderPath(e, t);
  }

  setIdentifierRenderResolutions({
    format: e,
    interop: t,
    namespaceToStringTag: s
  }) {
    const i = new Set();

    for (const t of this.getExportNames()) {
      const s = this.exportsByName[t];
      s instanceof Si && (this.needsExportsShim = !0), "es" !== e && "system" !== e && s.isReassigned && !s.isId ? s.setRenderNames("exports", t) : s instanceof Pi ? i.add(s) : s.setRenderNames(null, null);
    }

    const n = new Set(["Object", "Promise"]);

    switch (this.needsExportsShim && n.add("_missingExportShim"), s && n.add("Symbol"), e) {
      case "system":
        n.add("module").add("exports");
        break;

      case "es":
        break;

      case "cjs":
        n.add("module").add("require").add("__filename").add("__dirname");

      default:
        n.add("exports");

        for (const e of Fs) n.add(e);

    }

    tr(this.orderedModules, this.getDependenciesToBeDeconflicted("es" !== e && "system" !== e, "amd" === e || "umd" === e || "iife" === e, t), this.imports, n, e, t, this.outputOptions.preserveModules, this.outputOptions.externalLiveBindings, this.chunkByModule, i, this.exportNamesByVariable, this.accessedGlobalsByScope, this.includedNamespaces);
  }

  setUpChunkImportsAndExportsForModule(e) {
    const t = new Set(e.imports);

    if (!this.outputOptions.preserveModules && this.includedNamespaces.has(e)) {
      const s = e.namespace.getMemberVariables();

      for (const e of Object.values(s)) t.add(e);
    }

    for (let s of t) {
      s instanceof Ei && (s = s.getOriginalVariable()), s instanceof Pi && (s = s.getBaseVariable());
      const t = this.chunkByModule.get(s.module);
      t !== this && (this.imports.add(s), !(s instanceof Ai && this.outputOptions.preserveModules) && s.module instanceof Ui && (t.exports.add(s), this.checkCircularDependencyImport(s, e)));
    }

    (this.includedNamespaces.has(e) || e.info.isEntry && !1 !== e.preserveSignature || e.includedDynamicImporters.some(e => this.chunkByModule.get(e) !== this)) && this.ensureReexportsAreAvailableForModule(e);

    for (const {
      node: t,
      resolution: s
    } of e.dynamicImports) t.included && s instanceof Ui && this.chunkByModule.get(s) === this && !this.includedNamespaces.has(s) && (this.includedNamespaces.add(s), this.ensureReexportsAreAvailableForModule(s));
  }

}

function yr(e) {
  return e.chunkName || ne(e.id);
}

var Er;

function xr(e, t, s) {
  e in t && s(function (e) {
    return {
      code: Hs.FILE_NAME_CONFLICT,
      message: `The emitted file "${e}" overwrites a previously emitted file of the same name.`
    };
  }(e)), t[e] = vr;
}

!function (e) {
  e[e.LOAD_AND_PARSE = 0] = "LOAD_AND_PARSE", e[e.ANALYSE = 1] = "ANALYSE", e[e.GENERATE = 2] = "GENERATE";
}(Er || (Er = {}));
const vr = {
  type: "placeholder"
};

function br(e, t, s) {
  if (!("string" == typeof e || e instanceof Uint8Array)) {
    const e = t.fileName || t.name || s;
    return Us(si(`Could not set source for ${"string" == typeof e ? `asset "${e}"` : "unnamed asset"}, asset source needs to be a string, Uint8Array or Buffer.`));
  }

  return e;
}

function Sr(e, t) {
  return "string" != typeof e.fileName ? Us((s = e.name || t, {
    code: Hs.ASSET_NOT_FINALISED,
    message: `Plugin error - Unable to get file name for asset "${s}". Ensure that the source is set and that generate is called first.`
  })) : e.fileName;
  var s;
}

function Ar(e, t) {
  var s;
  const i = e.fileName || e.module && (null === (s = null == t ? void 0 : t.get(e.module)) || void 0 === s ? void 0 : s.id);
  return i || Us((n = e.fileName || e.name, {
    code: Hs.CHUNK_NOT_GENERATED,
    message: `Plugin error - Unable to get file name for chunk "${n}". Ensure that generate is called first.`
  }));
  var n;
}

class Pr {
  constructor(e, t, s) {
    this.graph = e, this.options = t, this.bundle = null, this.facadeChunkByModule = null, this.outputOptions = null, this.assertAssetsFinalized = () => {
      for (const [t, s] of this.filesByReferenceId.entries()) if ("asset" === s.type && "string" != typeof s.fileName) return Us((e = s.name || t, {
        code: Hs.ASSET_SOURCE_MISSING,
        message: `Plugin error creating asset "${e}" - no asset source set.`
      }));

      var e;
    }, this.emitFile = e => function (e) {
      return Boolean(e && ("asset" === e.type || "chunk" === e.type));
    }(e) ? function (e) {
      const t = e.fileName || e.name;
      return !t || "string" == typeof t && !ae(t);
    }(e) ? "chunk" === e.type ? this.emitChunk(e) : this.emitAsset(e) : Us(si(`The "fileName" or "name" properties of emitted files must be strings that are neither absolute nor relative paths, received "${e.fileName || e.name}".`)) : Us(si(`Emitted files must be of type "asset" or "chunk", received "${e && e.type}".`)), this.getFileName = e => {
      const t = this.filesByReferenceId.get(e);
      return t ? "chunk" === t.type ? Ar(t, this.facadeChunkByModule) : Sr(t, e) : Us((s = e, {
        code: Hs.FILE_NOT_FOUND,
        message: `Plugin error - Unable to get file name for unknown file "${s}".`
      }));
      var s;
    }, this.setAssetSource = (e, t) => {
      const s = this.filesByReferenceId.get(e);
      if (!s) return Us((i = e, {
        code: Hs.ASSET_NOT_FOUND,
        message: `Plugin error - Unable to set the source for unknown asset "${i}".`
      }));
      var i, n;
      if ("asset" !== s.type) return Us(si(`Asset sources can only be set for emitted assets but "${e}" is an emitted chunk.`));
      if (void 0 !== s.source) return Us((n = s.name || e, {
        code: Hs.ASSET_SOURCE_ALREADY_SET,
        message: `Unable to set the source for asset "${n}", source already set.`
      }));
      const r = br(t, s, e);
      this.bundle ? this.finalizeAsset(s, r, e, this.bundle) : s.source = r;
    }, this.setOutputBundle = (e, t, s) => {
      this.outputOptions = t, this.bundle = e, this.facadeChunkByModule = s;

      for (const e of this.filesByReferenceId.values()) e.fileName && xr(e.fileName, this.bundle, this.options.onwarn);

      for (const [e, t] of this.filesByReferenceId.entries()) "asset" === t.type && void 0 !== t.source && this.finalizeAsset(t, t.source, e, this.bundle);
    }, this.filesByReferenceId = s ? new Map(s.filesByReferenceId) : new Map();
  }

  assignReferenceId(e, t) {
    let s;

    do {
      const e = Jn();
      s ? e.update(s) : e.update(t), s = e.digest("hex").substr(0, 8);
    } while (this.filesByReferenceId.has(s));

    return this.filesByReferenceId.set(s, e), s;
  }

  emitAsset(e) {
    const t = void 0 !== e.source ? br(e.source, e, null) : void 0,
          s = {
      fileName: e.fileName,
      name: e.name,
      source: t,
      type: "asset"
    },
          i = this.assignReferenceId(s, e.fileName || e.name || e.type);
    return this.bundle && (e.fileName && xr(e.fileName, this.bundle, this.options.onwarn), void 0 !== t && this.finalizeAsset(s, t, i, this.bundle)), i;
  }

  emitChunk(e) {
    if (this.graph.phase > Er.LOAD_AND_PARSE) return Us({
      code: Hs.INVALID_ROLLUP_PHASE,
      message: "Cannot emit chunks after module loading has finished."
    });
    if ("string" != typeof e.id) return Us(si(`Emitted chunks need to have a valid string id, received "${e.id}"`));
    const t = {
      fileName: e.fileName,
      module: null,
      name: e.name || e.id,
      type: "chunk"
    };
    return this.graph.moduleLoader.emitChunk(e).then(e => t.module = e).catch(() => {}), this.assignReferenceId(t, e.id);
  }

  finalizeAsset(e, t, s, i) {
    const n = e.fileName || function (e, t) {
      for (const [s, i] of Object.entries(e)) if ("asset" === i.type && kr(t, i.source)) return s;

      return null;
    }(i, t) || function (e, t, s, i) {
      const n = s.sanitizeFileName(e || "asset");
      return pr(dr("function" == typeof s.assetFileNames ? s.assetFileNames({
        name: e,
        source: t,
        type: "asset"
      }) : s.assetFileNames, "output.assetFileNames", {
        ext: () => N(n).substr(1),
        extname: () => N(n),

        hash() {
          const e = Jn();
          return e.update(n), e.update(":"), e.update(t), e.digest("hex").substr(0, 8);
        },

        name: () => n.substr(0, n.length - N(n).length)
      }), i);
    }(e.name, t, this.outputOptions, i),
          r = { ...e,
      fileName: n,
      source: t
    };

    this.filesByReferenceId.set(s, r);
    const {
      options: a
    } = this;
    i[n] = {
      fileName: n,

      get isAsset() {
        return ni('Accessing "isAsset" on files in the bundle is deprecated, please use "type === \'asset\'" instead', !0, a), !0;
      },

      name: e.name,
      source: t,
      type: "asset"
    };
  }

}

function kr(e, t) {
  if ("string" == typeof e) return e === t;
  if ("string" == typeof t) return !1;
  if ("equals" in e) return e.equals(t);
  if (e.length !== t.length) return !1;

  for (let s = 0; s < e.length; s++) if (e[s] !== t[s]) return !1;

  return !0;
}

const Cr = (e, t) => t ? `${e}\n${t}` : e,
      wr = (e, t) => t ? `${e}\n\n${t}` : e;

function Ir(e, t) {
  const s = [],
        i = new Set(t.keys()),
        n = Object.create(null);

  for (const [e, s] of t) {
    Nr(e, n[s] = n[s] || [], i);
  }

  for (const [e, t] of Object.entries(n)) s.push({
    alias: e,
    modules: t
  });

  const r = new Map(),
        {
    dependentEntryPointsByModule: a,
    dynamicEntryModules: o
  } = function (e) {
    const t = new Set(),
          s = new Map(),
          i = new Set(e);

    for (const e of i) {
      const n = new Set([e]);

      for (const r of n) {
        R(s, r, () => new Set()).add(e);

        for (const e of r.getDependenciesToBeIncluded()) e instanceof oe || n.add(e);

        for (const {
          resolution: e
        } of r.dynamicImports) e instanceof Ui && e.includedDynamicImporters.length > 0 && (t.add(e), i.add(e));

        for (const e of r.implicitlyLoadedBefore) t.add(e), i.add(e);
      }
    }

    return {
      dependentEntryPointsByModule: s,
      dynamicEntryModules: t
    };
  }(e),
        h = function (e, t) {
    const s = new Map();

    for (const i of t) {
      const t = R(s, i, () => new Set());

      for (const s of [...i.includedDynamicImporters, ...i.implicitlyLoadedAfter]) for (const i of e.get(s)) t.add(i);
    }

    return s;
  }(a, o),
        l = new Set(e);

  function c(e, t) {
    const s = new Set([e]);

    for (const n of s) {
      const o = R(r, n, () => new Set());

      if (!t || !u(t, a.get(n))) {
        o.add(e);

        for (const e of n.getDependenciesToBeIncluded()) e instanceof oe || i.has(e) || s.add(e);
      }
    }
  }

  function u(e, t) {
    const s = new Set(e);

    for (const e of s) if (!t.has(e)) {
      if (l.has(e)) return !1;
      const t = h.get(e);

      for (const e of t) s.add(e);
    }

    return !0;
  }

  for (const t of e) i.has(t) || c(t, null);

  for (const e of o) i.has(e) || c(e, h.get(e));

  return s.push(...function (e, t) {
    const s = Object.create(null);

    for (const [i, n] of t) {
      let t = "";

      for (const s of e) t += n.has(s) ? "X" : "_";

      const r = s[t];
      r ? r.push(i) : s[t] = [i];
    }

    return Object.values(s).map(e => ({
      alias: null,
      modules: e
    }));
  }([...e, ...o], r)), s;
}

function Nr(e, t, s) {
  const i = new Set([e]);

  for (const e of i) {
    s.add(e), t.push(e);

    for (const t of e.dependencies) t instanceof oe || s.has(t) || i.add(t);
  }
}

const _r = (e, t) => e.execIndex > t.execIndex ? 1 : -1;

function $r(e, t, s) {
  const i = Symbol(e.id),
        n = [re(e.id)];
  let r = t;

  for (e.cycles.add(i); r !== e;) r.cycles.add(i), n.push(re(r.id)), r = s.get(r);

  return n.push(n[0]), n.reverse(), n;
}

class Tr {
  constructor(e, t, s, i, n) {
    this.outputOptions = e, this.unsetOptions = t, this.inputOptions = s, this.pluginDriver = i, this.graph = n, this.facadeChunkByModule = new Map(), this.includedNamespaces = new Set();
  }

  async generate(e) {
    Li("GENERATE", 1);
    const t = Object.create(null);
    this.pluginDriver.setOutputBundle(t, this.outputOptions, this.facadeChunkByModule);

    try {
      await this.pluginDriver.hookParallel("renderStart", [this.outputOptions, this.inputOptions]), Li("generate chunks", 2);
      const e = await this.generateChunks();
      e.length > 1 && function (e, t) {
        if ("umd" === e.format || "iife" === e.format) return Us({
          code: "INVALID_OPTION",
          message: "UMD and IIFE output formats are not supported for code-splitting builds."
        });
        if ("string" == typeof e.file) return Us({
          code: "INVALID_OPTION",
          message: 'When building multiple chunks, the "output.dir" option must be used, not "output.file". To inline dynamic imports, set the "inlineDynamicImports" option.'
        });
        if (e.sourcemapFile) return Us({
          code: "INVALID_OPTION",
          message: '"output.sourcemapFile" is only supported for single-file builds.'
        });
        !e.amd.autoId && e.amd.id && t({
          code: "INVALID_OPTION",
          message: '"output.amd.id" is only properly supported for single-file builds. Use "output.amd.autoId" and "output.amd.basePath".'
        });
      }(this.outputOptions, this.inputOptions.onwarn);

      const s = function (e) {
        if (0 === e.length) return "/";
        if (1 === e.length) return I(e[0]);
        const t = e.slice(1).reduce((e, t) => {
          const s = t.split(/\/+|\\+/);
          let i;

          for (i = 0; e[i] === s[i] && i < Math.min(e.length, s.length); i++);

          return e.slice(0, i);
        }, e[0].split(/\/+|\\+/));
        return t.length > 1 ? t.join("/") : "/";
      }(function (e) {
        const t = [];

        for (const s of e) for (const e of s.entryModules) P(e.id) && t.push(e.id);

        return t;
      }(e));

      Di("generate chunks", 2), Li("render modules", 2);
      const i = await async function (e, t) {
        try {
          let [s, i, n, r] = await Promise.all([t.hookReduceValue("banner", e.banner(), [], Cr), t.hookReduceValue("footer", e.footer(), [], Cr), t.hookReduceValue("intro", e.intro(), [], wr), t.hookReduceValue("outro", e.outro(), [], wr)]);
          return n && (n += "\n\n"), r && (r = `\n\n${r}`), s.length && (s += "\n"), i.length && (i = "\n" + i), {
            banner: s,
            footer: i,
            intro: n,
            outro: r
          };
        } catch (e) {
          return Us({
            code: "ADDON_ERROR",
            message: `Could not retrieve ${e.hook}. Check configuration of plugin ${e.plugin}.\n\tError Message: ${e.message}`
          });
        }
      }(this.outputOptions, this.pluginDriver);
      this.prerenderChunks(e, s), Di("render modules", 2), await this.addFinalizedChunksToBundle(e, s, i, t);
    } catch (e) {
      throw await this.pluginDriver.hookParallel("renderError", [e]), e;
    }

    return await this.pluginDriver.hookSeq("generateBundle", [this.outputOptions, t, e]), this.finaliseAssets(t), Di("GENERATE", 1), t;
  }

  async addFinalizedChunksToBundle(e, t, s, i) {
    this.assignChunkIds(e, t, s, i);

    for (const t of e) i[t.id] = t.getChunkInfoWithFileNames();

    await Promise.all(e.map(async e => {
      const t = i[e.id];
      Object.assign(t, await e.render(this.outputOptions, s, t));
    }));
  }

  async addManualChunks(e) {
    const t = new Map(),
          s = await Promise.all(Object.entries(e).map(async ([e, t]) => ({
      alias: e,
      entries: await this.graph.moduleLoader.addAdditionalModules(t)
    })));

    for (const {
      alias: e,
      entries: i
    } of s) for (const s of i) Mr(e, s, t);

    return t;
  }

  assignChunkIds(e, t, s, i) {
    const n = [],
          r = [];

    for (const t of e) (t.facadeModule && t.facadeModule.isUserDefinedEntryPoint ? n : r).push(t);

    const a = n.concat(r);

    for (const e of a) this.outputOptions.file ? e.id = w(this.outputOptions.file) : this.outputOptions.preserveModules ? e.id = e.generateIdPreserveModules(t, this.outputOptions, i, this.unsetOptions) : e.id = e.generateId(s, this.outputOptions, i, !0), i[e.id] = vr;
  }

  assignManualChunks(e) {
    const t = new Map(),
          s = {
      getModuleIds: () => this.graph.modulesById.keys(),
      getModuleInfo: this.graph.getModuleInfo
    };

    for (const i of this.graph.modulesById.values()) if (i instanceof Ui) {
      const n = e(i.id, s);
      "string" == typeof n && Mr(n, i, t);
    }

    return t;
  }

  finaliseAssets(e) {
    for (const t of Object.values(e)) if (t.type || (ni('A plugin is directly adding properties to the bundle object in the "generateBundle" hook. This is deprecated and will be removed in a future Rollup version, please use "this.emitFile" instead.', !0, this.inputOptions), t.type = "asset"), this.outputOptions.validate && "string" == typeof t.code) try {
      this.graph.contextParse(t.code, {
        allowHashBang: !0,
        ecmaVersion: "latest"
      });
    } catch (e) {
      this.inputOptions.onwarn(qs(t, e));
    }

    this.pluginDriver.finaliseAssets();
  }

  async generateChunks() {
    const {
      manualChunks: e
    } = this.outputOptions,
          t = "object" == typeof e ? await this.addManualChunks(e) : this.assignManualChunks(e),
          s = [],
          i = new Map();

    for (const {
      alias: e,
      modules: n
    } of this.outputOptions.inlineDynamicImports ? [{
      alias: null,
      modules: Rr(this.graph.modulesById)
    }] : this.outputOptions.preserveModules ? Rr(this.graph.modulesById).map(e => ({
      alias: null,
      modules: [e]
    })) : Ir(this.graph.entryModules, t)) {
      n.sort(_r);
      const t = new gr(n, this.inputOptions, this.outputOptions, this.unsetOptions, this.pluginDriver, this.graph.modulesById, i, this.facadeChunkByModule, this.includedNamespaces, e);
      s.push(t);

      for (const e of n) i.set(e, t);
    }

    for (const e of s) e.link();

    const n = [];

    for (const e of s) n.push(...e.generateFacades());

    return [...s, ...n];
  }

  prerenderChunks(e, t) {
    for (const t of e) t.generateExports();

    for (const s of e) s.preRender(this.outputOptions, t);
  }

}

function Rr(e) {
  return [...e.values()].filter(e => e instanceof Ui && (e.isIncluded() || e.info.isEntry || e.includedDynamicImporters.length > 0));
}

function Mr(e, t, s) {
  const i = s.get(t);
  if ("string" == typeof i && i !== e) return Us((n = t.id, r = e, a = i, {
    code: Hs.INVALID_CHUNK,
    message: `Cannot assign ${re(n)} to the "${r}" chunk as it is already in the "${a}" chunk.`
  }));
  var n, r, a;
  s.set(t, e);
}

var Or = {
  3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",
  5: "class enum extends super const export import",
  6: "enum",
  strict: "implements interface let package private protected public static yield",
  strictBind: "eval arguments"
},
    Lr = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this",
    Dr = {
  5: Lr,
  "5module": Lr + " export import",
  6: Lr + " const class extends export import super"
},
    Vr = /^in(stanceof)?$/,
    Br = "ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽͿΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԯԱ-Ֆՙՠ-ֈא-תׯ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࡠ-ࡪࢠ-ࢴࢶ-ࣇऄ-हऽॐक़-ॡॱ-ঀঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱৼਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡૹଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-హఽౘ-ౚౠౡಀಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೞೠೡೱೲഄ-ഌഎ-ഐഒ-ഺഽൎൔ-ൖൟ-ൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄຆ-ຊຌ-ຣລວ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏽᏸ-ᏽᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛸᜀ-ᜌᜎ-ᜑᜠ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡸᢀ-ᢨᢪᢰ-ᣵᤀ-ᤞᥐ-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭋᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᲀ-ᲈᲐ-ᲺᲽ-Ჿᳩ-ᳬᳮ-ᳳᳵᳶᳺᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕ℘-ℝℤΩℨK-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-Ⱞⰰ-ⱞⱠ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞ々-〇〡-〩〱-〵〸-〼ぁ-ゖ゛-ゟァ-ヺー-ヿㄅ-ㄯㄱ-ㆎㆠ-ㆿㇰ-ㇿ㐀-䶿一-鿼ꀀ-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚝꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-ꞿꟂ-ꟊꟵ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꣽꣾꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꧠ-ꧤꧦ-ꧯꧺ-ꧾꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꩾ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭩꭰ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ",
    Fr = "‌‍·̀-ͯ·҃-֑҇-ׇֽֿׁׂׅׄؐ-ًؚ-٩ٰۖ-ۜ۟-۪ۤۧۨ-ۭ۰-۹ܑܰ-݊ަ-ް߀-߉߫-߽߳ࠖ-࠙ࠛ-ࠣࠥ-ࠧࠩ-࡙࠭-࡛࣓-ࣣ࣡-ःऺ-़ा-ॏ॑-ॗॢॣ०-९ঁ-ঃ়া-ৄেৈো-্ৗৢৣ০-৯৾ਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑ੦-ੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢૣ૦-૯ૺ-૿ଁ-ଃ଼ା-ୄେୈୋ-୍୕-ୗୢୣ୦-୯ஂா-ூெ-ைொ-்ௗ௦-௯ఀ-ఄా-ౄె-ైొ-్ౕౖౢౣ౦-౯ಁ-ಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢೣ೦-೯ഀ-ഃ഻഼ാ-ൄെ-ൈൊ-്ൗൢൣ൦-൯ඁ-ඃ්ා-ුූෘ-ෟ෦-෯ෲෳัิ-ฺ็-๎๐-๙ັິ-ຼ່-ໍ໐-໙༘༙༠-༩༹༵༷༾༿ཱ-྄྆྇ྍ-ྗྙ-ྼ࿆ါ-ှ၀-၉ၖ-ၙၞ-ၠၢ-ၤၧ-ၭၱ-ၴႂ-ႍႏ-ႝ፝-፟፩-፱ᜒ-᜔ᜲ-᜴ᝒᝓᝲᝳ឴-៓៝០-៩᠋-᠍᠐-᠙ᢩᤠ-ᤫᤰ-᤻᥆-᥏᧐-᧚ᨗ-ᨛᩕ-ᩞ᩠-᩿᩼-᪉᪐-᪙᪰-᪽ᪿᫀᬀ-ᬄ᬴-᭄᭐-᭙᭫-᭳ᮀ-ᮂᮡ-ᮭ᮰-᮹᯦-᯳ᰤ-᰷᱀-᱉᱐-᱙᳐-᳔᳒-᳨᳭᳴᳷-᳹᷀-᷹᷻-᷿‿⁀⁔⃐-⃥⃜⃡-⃰⳯-⵿⳱ⷠ-〪ⷿ-゙゚〯꘠-꘩꙯ꙴ-꙽ꚞꚟ꛰꛱ꠂ꠆ꠋꠣ-ꠧ꠬ꢀꢁꢴ-ꣅ꣐-꣙꣠-꣱ꣿ-꤉ꤦ-꤭ꥇ-꥓ꦀ-ꦃ꦳-꧀꧐-꧙ꧥ꧰-꧹ꨩ-ꨶꩃꩌꩍ꩐-꩙ꩻ-ꩽꪰꪲ-ꪴꪷꪸꪾ꪿꫁ꫫ-ꫯꫵ꫶ꯣ-ꯪ꯬꯭꯰-꯹ﬞ︀-️︠-︯︳︴﹍-﹏０-９＿",
    zr = new RegExp("[" + Br + "]"),
    Wr = new RegExp("[" + Br + Fr + "]");
Br = Fr = null;
var jr = [0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4, 48, 48, 31, 14, 29, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 19, 35, 5, 35, 5, 39, 9, 51, 157, 310, 10, 21, 11, 7, 153, 5, 3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 66, 18, 2, 1, 11, 21, 11, 25, 71, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 28, 43, 28, 4, 28, 36, 7, 2, 27, 28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 56, 50, 14, 50, 14, 35, 349, 41, 7, 1, 79, 28, 11, 0, 9, 21, 107, 20, 28, 22, 13, 52, 76, 44, 33, 24, 27, 35, 30, 0, 3, 0, 9, 34, 4, 0, 13, 47, 15, 3, 22, 0, 2, 0, 36, 17, 2, 24, 85, 6, 2, 0, 2, 3, 2, 14, 2, 9, 8, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4, 4, 0, 19, 0, 13, 4, 159, 52, 19, 3, 21, 2, 31, 47, 21, 1, 2, 0, 185, 46, 42, 3, 37, 47, 21, 0, 60, 42, 14, 0, 72, 26, 230, 43, 117, 63, 32, 7, 3, 0, 3, 7, 2, 1, 2, 23, 16, 0, 2, 0, 95, 7, 3, 38, 17, 0, 2, 0, 29, 0, 11, 39, 8, 0, 22, 0, 12, 45, 20, 0, 35, 56, 264, 8, 2, 36, 18, 0, 50, 29, 113, 6, 2, 1, 2, 37, 22, 0, 26, 5, 2, 1, 2, 31, 15, 0, 328, 18, 190, 0, 80, 921, 103, 110, 18, 195, 2749, 1070, 4050, 582, 8634, 568, 8, 30, 114, 29, 19, 47, 17, 3, 32, 20, 6, 18, 689, 63, 129, 74, 6, 0, 67, 12, 65, 1, 2, 0, 29, 6135, 9, 1237, 43, 8, 8952, 286, 50, 2, 18, 3, 9, 395, 2309, 106, 6, 12, 4, 8, 8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3, 7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 2357, 44, 11, 6, 17, 0, 370, 43, 1301, 196, 60, 67, 8, 0, 1205, 3, 2, 26, 2, 1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421, 42717, 35, 4148, 12, 221, 3, 5761, 15, 7472, 3104, 541, 1507, 4938],
    Ur = [509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166, 1, 574, 3, 9, 9, 370, 1, 154, 10, 176, 2, 54, 14, 32, 9, 16, 3, 46, 10, 54, 9, 7, 2, 37, 13, 2, 9, 6, 1, 45, 0, 13, 2, 49, 13, 9, 3, 2, 11, 83, 11, 7, 0, 161, 11, 6, 9, 7, 3, 56, 1, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 193, 17, 10, 9, 5, 0, 82, 19, 13, 9, 214, 6, 3, 8, 28, 1, 83, 16, 16, 9, 82, 12, 9, 9, 84, 14, 5, 9, 243, 14, 166, 9, 71, 5, 2, 1, 3, 3, 2, 0, 2, 1, 13, 9, 120, 6, 3, 6, 4, 0, 29, 9, 41, 6, 2, 3, 9, 0, 10, 10, 47, 15, 406, 7, 2, 7, 17, 9, 57, 21, 2, 13, 123, 5, 4, 0, 2, 1, 2, 6, 2, 0, 9, 9, 49, 4, 2, 1, 2, 4, 9, 9, 330, 3, 19306, 9, 135, 4, 60, 6, 26, 9, 1014, 0, 2, 54, 8, 3, 82, 0, 12, 1, 19628, 1, 5319, 4, 4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 513, 54, 5, 49, 9, 0, 15, 0, 23, 4, 2, 14, 1361, 6, 2, 16, 3, 6, 2, 1, 2, 4, 262, 6, 10, 9, 419, 13, 1495, 6, 110, 6, 6, 9, 4759, 9, 787719, 239];

function Gr(e, t) {
  for (var s = 65536, i = 0; i < t.length; i += 2) {
    if ((s += t[i]) > e) return !1;
    if ((s += t[i + 1]) >= e) return !0;
  }
}

function Hr(e, t) {
  return e < 65 ? 36 === e : e < 91 || (e < 97 ? 95 === e : e < 123 || (e <= 65535 ? e >= 170 && zr.test(String.fromCharCode(e)) : !1 !== t && Gr(e, jr)));
}

function qr(e, t) {
  return e < 48 ? 36 === e : e < 58 || !(e < 65) && (e < 91 || (e < 97 ? 95 === e : e < 123 || (e <= 65535 ? e >= 170 && Wr.test(String.fromCharCode(e)) : !1 !== t && (Gr(e, jr) || Gr(e, Ur)))));
}

var Kr = function (e, t) {
  void 0 === t && (t = {}), this.label = e, this.keyword = t.keyword, this.beforeExpr = !!t.beforeExpr, this.startsExpr = !!t.startsExpr, this.isLoop = !!t.isLoop, this.isAssign = !!t.isAssign, this.prefix = !!t.prefix, this.postfix = !!t.postfix, this.binop = t.binop || null, this.updateContext = null;
};

function Xr(e, t) {
  return new Kr(e, {
    beforeExpr: !0,
    binop: t
  });
}

var Yr = {
  beforeExpr: !0
},
    Qr = {
  startsExpr: !0
},
    Zr = {};

function Jr(e, t) {
  return void 0 === t && (t = {}), t.keyword = e, Zr[e] = new Kr(e, t);
}

var ea = {
  num: new Kr("num", Qr),
  regexp: new Kr("regexp", Qr),
  string: new Kr("string", Qr),
  name: new Kr("name", Qr),
  privateId: new Kr("privateId", Qr),
  eof: new Kr("eof"),
  bracketL: new Kr("[", {
    beforeExpr: !0,
    startsExpr: !0
  }),
  bracketR: new Kr("]"),
  braceL: new Kr("{", {
    beforeExpr: !0,
    startsExpr: !0
  }),
  braceR: new Kr("}"),
  parenL: new Kr("(", {
    beforeExpr: !0,
    startsExpr: !0
  }),
  parenR: new Kr(")"),
  comma: new Kr(",", Yr),
  semi: new Kr(";", Yr),
  colon: new Kr(":", Yr),
  dot: new Kr("."),
  question: new Kr("?", Yr),
  questionDot: new Kr("?."),
  arrow: new Kr("=>", Yr),
  template: new Kr("template"),
  invalidTemplate: new Kr("invalidTemplate"),
  ellipsis: new Kr("...", Yr),
  backQuote: new Kr("`", Qr),
  dollarBraceL: new Kr("${", {
    beforeExpr: !0,
    startsExpr: !0
  }),
  eq: new Kr("=", {
    beforeExpr: !0,
    isAssign: !0
  }),
  assign: new Kr("_=", {
    beforeExpr: !0,
    isAssign: !0
  }),
  incDec: new Kr("++/--", {
    prefix: !0,
    postfix: !0,
    startsExpr: !0
  }),
  prefix: new Kr("!/~", {
    beforeExpr: !0,
    prefix: !0,
    startsExpr: !0
  }),
  logicalOR: Xr("||", 1),
  logicalAND: Xr("&&", 2),
  bitwiseOR: Xr("|", 3),
  bitwiseXOR: Xr("^", 4),
  bitwiseAND: Xr("&", 5),
  equality: Xr("==/!=/===/!==", 6),
  relational: Xr("</>/<=/>=", 7),
  bitShift: Xr("<</>>/>>>", 8),
  plusMin: new Kr("+/-", {
    beforeExpr: !0,
    binop: 9,
    prefix: !0,
    startsExpr: !0
  }),
  modulo: Xr("%", 10),
  star: Xr("*", 10),
  slash: Xr("/", 10),
  starstar: new Kr("**", {
    beforeExpr: !0
  }),
  coalesce: Xr("??", 1),
  _break: Jr("break"),
  _case: Jr("case", Yr),
  _catch: Jr("catch"),
  _continue: Jr("continue"),
  _debugger: Jr("debugger"),
  _default: Jr("default", Yr),
  _do: Jr("do", {
    isLoop: !0,
    beforeExpr: !0
  }),
  _else: Jr("else", Yr),
  _finally: Jr("finally"),
  _for: Jr("for", {
    isLoop: !0
  }),
  _function: Jr("function", Qr),
  _if: Jr("if"),
  _return: Jr("return", Yr),
  _switch: Jr("switch"),
  _throw: Jr("throw", Yr),
  _try: Jr("try"),
  _var: Jr("var"),
  _const: Jr("const"),
  _while: Jr("while", {
    isLoop: !0
  }),
  _with: Jr("with"),
  _new: Jr("new", {
    beforeExpr: !0,
    startsExpr: !0
  }),
  _this: Jr("this", Qr),
  _super: Jr("super", Qr),
  _class: Jr("class", Qr),
  _extends: Jr("extends", Yr),
  _export: Jr("export"),
  _import: Jr("import", Qr),
  _null: Jr("null", Qr),
  _true: Jr("true", Qr),
  _false: Jr("false", Qr),
  _in: Jr("in", {
    beforeExpr: !0,
    binop: 7
  }),
  _instanceof: Jr("instanceof", {
    beforeExpr: !0,
    binop: 7
  }),
  _typeof: Jr("typeof", {
    beforeExpr: !0,
    prefix: !0,
    startsExpr: !0
  }),
  _void: Jr("void", {
    beforeExpr: !0,
    prefix: !0,
    startsExpr: !0
  }),
  _delete: Jr("delete", {
    beforeExpr: !0,
    prefix: !0,
    startsExpr: !0
  })
},
    ta = /\r\n?|\n|\u2028|\u2029/,
    sa = new RegExp(ta.source, "g");

function ia(e, t) {
  return 10 === e || 13 === e || !t && (8232 === e || 8233 === e);
}

var na = /[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/,
    ra = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g,
    aa = Object.prototype,
    oa = aa.hasOwnProperty,
    ha = aa.toString;

function la(e, t) {
  return oa.call(e, t);
}

var ca = Array.isArray || function (e) {
  return "[object Array]" === ha.call(e);
};

function ua(e) {
  return new RegExp("^(?:" + e.replace(/ /g, "|") + ")$");
}

var da = function (e, t) {
  this.line = e, this.column = t;
};

da.prototype.offset = function (e) {
  return new da(this.line, this.column + e);
};

var pa = function (e, t, s) {
  this.start = t, this.end = s, null !== e.sourceFile && (this.source = e.sourceFile);
};

function fa(e, t) {
  for (var s = 1, i = 0;;) {
    sa.lastIndex = i;
    var n = sa.exec(e);
    if (!(n && n.index < t)) return new da(s, t - i);
    ++s, i = n.index + n[0].length;
  }
}

var ma = {
  ecmaVersion: null,
  sourceType: "script",
  onInsertedSemicolon: null,
  onTrailingComma: null,
  allowReserved: null,
  allowReturnOutsideFunction: !1,
  allowImportExportEverywhere: !1,
  allowAwaitOutsideFunction: null,
  allowSuperOutsideMethod: null,
  allowHashBang: !1,
  locations: !1,
  onToken: null,
  onComment: null,
  ranges: !1,
  program: null,
  sourceFile: null,
  directSourceFile: null,
  preserveParens: !1
},
    ga = !1;

function ya(e) {
  var t = {};

  for (var s in ma) t[s] = e && la(e, s) ? e[s] : ma[s];

  if ("latest" === t.ecmaVersion ? t.ecmaVersion = 1e8 : null == t.ecmaVersion ? (!ga && "object" == typeof console && console.warn && (ga = !0, console.warn("Since Acorn 8.0.0, options.ecmaVersion is required.\nDefaulting to 2020, but this will stop working in the future.")), t.ecmaVersion = 11) : t.ecmaVersion >= 2015 && (t.ecmaVersion -= 2009), null == t.allowReserved && (t.allowReserved = t.ecmaVersion < 5), null == t.allowAwaitOutsideFunction && (t.allowAwaitOutsideFunction = t.ecmaVersion >= 13), ca(t.onToken)) {
    var i = t.onToken;

    t.onToken = function (e) {
      return i.push(e);
    };
  }

  return ca(t.onComment) && (t.onComment = function (e, t) {
    return function (s, i, n, r, a, o) {
      var h = {
        type: s ? "Block" : "Line",
        value: i,
        start: n,
        end: r
      };
      e.locations && (h.loc = new pa(this, a, o)), e.ranges && (h.range = [n, r]), t.push(h);
    };
  }(t, t.onComment)), t;
}

function Ea(e, t) {
  return 2 | (e ? 4 : 0) | (t ? 8 : 0);
}

var xa = function (e, t, s) {
  this.options = e = ya(e), this.sourceFile = e.sourceFile, this.keywords = ua(Dr[e.ecmaVersion >= 6 ? 6 : "module" === e.sourceType ? "5module" : 5]);
  var i = "";
  !0 !== e.allowReserved && (i = Or[e.ecmaVersion >= 6 ? 6 : 5 === e.ecmaVersion ? 5 : 3], "module" === e.sourceType && (i += " await")), this.reservedWords = ua(i);
  var n = (i ? i + " " : "") + Or.strict;
  this.reservedWordsStrict = ua(n), this.reservedWordsStrictBind = ua(n + " " + Or.strictBind), this.input = String(t), this.containsEsc = !1, s ? (this.pos = s, this.lineStart = this.input.lastIndexOf("\n", s - 1) + 1, this.curLine = this.input.slice(0, this.lineStart).split(ta).length) : (this.pos = this.lineStart = 0, this.curLine = 1), this.type = ea.eof, this.value = null, this.start = this.end = this.pos, this.startLoc = this.endLoc = this.curPosition(), this.lastTokEndLoc = this.lastTokStartLoc = null, this.lastTokStart = this.lastTokEnd = this.pos, this.context = this.initialContext(), this.exprAllowed = !0, this.inModule = "module" === e.sourceType, this.strict = this.inModule || this.strictDirective(this.pos), this.potentialArrowAt = -1, this.potentialArrowInForAwait = !1, this.yieldPos = this.awaitPos = this.awaitIdentPos = 0, this.labels = [], this.undefinedExports = Object.create(null), 0 === this.pos && e.allowHashBang && "#!" === this.input.slice(0, 2) && this.skipLineComment(2), this.scopeStack = [], this.enterScope(1), this.regexpState = null, this.privateNameStack = [];
},
    va = {
  inFunction: {
    configurable: !0
  },
  inGenerator: {
    configurable: !0
  },
  inAsync: {
    configurable: !0
  },
  allowSuper: {
    configurable: !0
  },
  allowDirectSuper: {
    configurable: !0
  },
  treatFunctionsAsVar: {
    configurable: !0
  },
  inNonArrowFunction: {
    configurable: !0
  }
};

xa.prototype.parse = function () {
  var e = this.options.program || this.startNode();
  return this.nextToken(), this.parseTopLevel(e);
}, va.inFunction.get = function () {
  return (2 & this.currentVarScope().flags) > 0;
}, va.inGenerator.get = function () {
  return (8 & this.currentVarScope().flags) > 0 && !this.currentVarScope().inClassFieldInit;
}, va.inAsync.get = function () {
  return (4 & this.currentVarScope().flags) > 0 && !this.currentVarScope().inClassFieldInit;
}, va.allowSuper.get = function () {
  var e = this.currentThisScope(),
      t = e.flags,
      s = e.inClassFieldInit;
  return (64 & t) > 0 || s || this.options.allowSuperOutsideMethod;
}, va.allowDirectSuper.get = function () {
  return (128 & this.currentThisScope().flags) > 0;
}, va.treatFunctionsAsVar.get = function () {
  return this.treatFunctionsAsVarInScope(this.currentScope());
}, va.inNonArrowFunction.get = function () {
  var e = this.currentThisScope(),
      t = e.flags,
      s = e.inClassFieldInit;
  return (2 & t) > 0 || s;
}, xa.extend = function () {
  for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];

  for (var s = this, i = 0; i < e.length; i++) s = e[i](s);

  return s;
}, xa.parse = function (e, t) {
  return new this(t, e).parse();
}, xa.parseExpressionAt = function (e, t, s) {
  var i = new this(s, e, t);
  return i.nextToken(), i.parseExpression();
}, xa.tokenizer = function (e, t) {
  return new this(t, e);
}, Object.defineProperties(xa.prototype, va);
var ba = xa.prototype,
    Sa = /^(?:'((?:\\.|[^'\\])*?)'|"((?:\\.|[^"\\])*?)")/;

function Aa() {
  this.shorthandAssign = this.trailingComma = this.parenthesizedAssign = this.parenthesizedBind = this.doubleProto = -1;
}

ba.strictDirective = function (e) {
  for (;;) {
    ra.lastIndex = e, e += ra.exec(this.input)[0].length;
    var t = Sa.exec(this.input.slice(e));
    if (!t) return !1;

    if ("use strict" === (t[1] || t[2])) {
      ra.lastIndex = e + t[0].length;
      var s = ra.exec(this.input),
          i = s.index + s[0].length,
          n = this.input.charAt(i);
      return ";" === n || "}" === n || ta.test(s[0]) && !(/[(`.[+\-/*%<>=,?^&]/.test(n) || "!" === n && "=" === this.input.charAt(i + 1));
    }

    e += t[0].length, ra.lastIndex = e, e += ra.exec(this.input)[0].length, ";" === this.input[e] && e++;
  }
}, ba.eat = function (e) {
  return this.type === e && (this.next(), !0);
}, ba.isContextual = function (e) {
  return this.type === ea.name && this.value === e && !this.containsEsc;
}, ba.eatContextual = function (e) {
  return !!this.isContextual(e) && (this.next(), !0);
}, ba.expectContextual = function (e) {
  this.eatContextual(e) || this.unexpected();
}, ba.canInsertSemicolon = function () {
  return this.type === ea.eof || this.type === ea.braceR || ta.test(this.input.slice(this.lastTokEnd, this.start));
}, ba.insertSemicolon = function () {
  if (this.canInsertSemicolon()) return this.options.onInsertedSemicolon && this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc), !0;
}, ba.semicolon = function () {
  this.eat(ea.semi) || this.insertSemicolon() || this.unexpected();
}, ba.afterTrailingComma = function (e, t) {
  if (this.type === e) return this.options.onTrailingComma && this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc), t || this.next(), !0;
}, ba.expect = function (e) {
  this.eat(e) || this.unexpected();
}, ba.unexpected = function (e) {
  this.raise(null != e ? e : this.start, "Unexpected token");
}, ba.checkPatternErrors = function (e, t) {
  if (e) {
    e.trailingComma > -1 && this.raiseRecoverable(e.trailingComma, "Comma is not permitted after the rest element");
    var s = t ? e.parenthesizedAssign : e.parenthesizedBind;
    s > -1 && this.raiseRecoverable(s, "Parenthesized pattern");
  }
}, ba.checkExpressionErrors = function (e, t) {
  if (!e) return !1;
  var s = e.shorthandAssign,
      i = e.doubleProto;
  if (!t) return s >= 0 || i >= 0;
  s >= 0 && this.raise(s, "Shorthand property assignments are valid only in destructuring patterns"), i >= 0 && this.raiseRecoverable(i, "Redefinition of __proto__ property");
}, ba.checkYieldAwaitInDefaultParams = function () {
  this.yieldPos && (!this.awaitPos || this.yieldPos < this.awaitPos) && this.raise(this.yieldPos, "Yield expression cannot be a default value"), this.awaitPos && this.raise(this.awaitPos, "Await expression cannot be a default value");
}, ba.isSimpleAssignTarget = function (e) {
  return "ParenthesizedExpression" === e.type ? this.isSimpleAssignTarget(e.expression) : "Identifier" === e.type || "MemberExpression" === e.type;
};
var Pa = xa.prototype;

Pa.parseTopLevel = function (e) {
  var t = Object.create(null);

  for (e.body || (e.body = []); this.type !== ea.eof;) {
    var s = this.parseStatement(null, !0, t);
    e.body.push(s);
  }

  if (this.inModule) for (var i = 0, n = Object.keys(this.undefinedExports); i < n.length; i += 1) {
    var r = n[i];
    this.raiseRecoverable(this.undefinedExports[r].start, "Export '" + r + "' is not defined");
  }
  return this.adaptDirectivePrologue(e.body), this.next(), e.sourceType = this.options.sourceType, this.finishNode(e, "Program");
};

var ka = {
  kind: "loop"
},
    Ca = {
  kind: "switch"
};
Pa.isLet = function (e) {
  if (this.options.ecmaVersion < 6 || !this.isContextual("let")) return !1;
  ra.lastIndex = this.pos;
  var t = ra.exec(this.input),
      s = this.pos + t[0].length,
      i = this.input.charCodeAt(s);
  if (91 === i || 92 === i || i > 55295 && i < 56320) return !0;
  if (e) return !1;
  if (123 === i) return !0;

  if (Hr(i, !0)) {
    for (var n = s + 1; qr(i = this.input.charCodeAt(n), !0);) ++n;

    if (92 === i || i > 55295 && i < 56320) return !0;
    var r = this.input.slice(s, n);
    if (!Vr.test(r)) return !0;
  }

  return !1;
}, Pa.isAsyncFunction = function () {
  if (this.options.ecmaVersion < 8 || !this.isContextual("async")) return !1;
  ra.lastIndex = this.pos;
  var e,
      t = ra.exec(this.input),
      s = this.pos + t[0].length;
  return !(ta.test(this.input.slice(this.pos, s)) || "function" !== this.input.slice(s, s + 8) || s + 8 !== this.input.length && (qr(e = this.input.charCodeAt(s + 8)) || e > 55295 && e < 56320));
}, Pa.parseStatement = function (e, t, s) {
  var i,
      n = this.type,
      r = this.startNode();

  switch (this.isLet(e) && (n = ea._var, i = "let"), n) {
    case ea._break:
    case ea._continue:
      return this.parseBreakContinueStatement(r, n.keyword);

    case ea._debugger:
      return this.parseDebuggerStatement(r);

    case ea._do:
      return this.parseDoStatement(r);

    case ea._for:
      return this.parseForStatement(r);

    case ea._function:
      return e && (this.strict || "if" !== e && "label" !== e) && this.options.ecmaVersion >= 6 && this.unexpected(), this.parseFunctionStatement(r, !1, !e);

    case ea._class:
      return e && this.unexpected(), this.parseClass(r, !0);

    case ea._if:
      return this.parseIfStatement(r);

    case ea._return:
      return this.parseReturnStatement(r);

    case ea._switch:
      return this.parseSwitchStatement(r);

    case ea._throw:
      return this.parseThrowStatement(r);

    case ea._try:
      return this.parseTryStatement(r);

    case ea._const:
    case ea._var:
      return i = i || this.value, e && "var" !== i && this.unexpected(), this.parseVarStatement(r, i);

    case ea._while:
      return this.parseWhileStatement(r);

    case ea._with:
      return this.parseWithStatement(r);

    case ea.braceL:
      return this.parseBlock(!0, r);

    case ea.semi:
      return this.parseEmptyStatement(r);

    case ea._export:
    case ea._import:
      if (this.options.ecmaVersion > 10 && n === ea._import) {
        ra.lastIndex = this.pos;
        var a = ra.exec(this.input),
            o = this.pos + a[0].length,
            h = this.input.charCodeAt(o);
        if (40 === h || 46 === h) return this.parseExpressionStatement(r, this.parseExpression());
      }

      return this.options.allowImportExportEverywhere || (t || this.raise(this.start, "'import' and 'export' may only appear at the top level"), this.inModule || this.raise(this.start, "'import' and 'export' may appear only with 'sourceType: module'")), n === ea._import ? this.parseImport(r) : this.parseExport(r, s);

    default:
      if (this.isAsyncFunction()) return e && this.unexpected(), this.next(), this.parseFunctionStatement(r, !0, !e);
      var l = this.value,
          c = this.parseExpression();
      return n === ea.name && "Identifier" === c.type && this.eat(ea.colon) ? this.parseLabeledStatement(r, l, c, e) : this.parseExpressionStatement(r, c);
  }
}, Pa.parseBreakContinueStatement = function (e, t) {
  var s = "break" === t;
  this.next(), this.eat(ea.semi) || this.insertSemicolon() ? e.label = null : this.type !== ea.name ? this.unexpected() : (e.label = this.parseIdent(), this.semicolon());

  for (var i = 0; i < this.labels.length; ++i) {
    var n = this.labels[i];

    if (null == e.label || n.name === e.label.name) {
      if (null != n.kind && (s || "loop" === n.kind)) break;
      if (e.label && s) break;
    }
  }

  return i === this.labels.length && this.raise(e.start, "Unsyntactic " + t), this.finishNode(e, s ? "BreakStatement" : "ContinueStatement");
}, Pa.parseDebuggerStatement = function (e) {
  return this.next(), this.semicolon(), this.finishNode(e, "DebuggerStatement");
}, Pa.parseDoStatement = function (e) {
  return this.next(), this.labels.push(ka), e.body = this.parseStatement("do"), this.labels.pop(), this.expect(ea._while), e.test = this.parseParenExpression(), this.options.ecmaVersion >= 6 ? this.eat(ea.semi) : this.semicolon(), this.finishNode(e, "DoWhileStatement");
}, Pa.parseForStatement = function (e) {
  this.next();
  var t = this.options.ecmaVersion >= 9 && (this.inAsync || !this.inFunction && this.options.allowAwaitOutsideFunction) && this.eatContextual("await") ? this.lastTokStart : -1;
  if (this.labels.push(ka), this.enterScope(0), this.expect(ea.parenL), this.type === ea.semi) return t > -1 && this.unexpected(t), this.parseFor(e, null);
  var s = this.isLet();

  if (this.type === ea._var || this.type === ea._const || s) {
    var i = this.startNode(),
        n = s ? "let" : this.value;
    return this.next(), this.parseVar(i, !0, n), this.finishNode(i, "VariableDeclaration"), (this.type === ea._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) && 1 === i.declarations.length ? (this.options.ecmaVersion >= 9 && (this.type === ea._in ? t > -1 && this.unexpected(t) : e.await = t > -1), this.parseForIn(e, i)) : (t > -1 && this.unexpected(t), this.parseFor(e, i));
  }

  var r = new Aa(),
      a = this.parseExpression(!(t > -1) || "await", r);
  return this.type === ea._in || this.options.ecmaVersion >= 6 && this.isContextual("of") ? (this.options.ecmaVersion >= 9 && (this.type === ea._in ? t > -1 && this.unexpected(t) : e.await = t > -1), this.toAssignable(a, !1, r), this.checkLValPattern(a), this.parseForIn(e, a)) : (this.checkExpressionErrors(r, !0), t > -1 && this.unexpected(t), this.parseFor(e, a));
}, Pa.parseFunctionStatement = function (e, t, s) {
  return this.next(), this.parseFunction(e, Ia | (s ? 0 : Na), !1, t);
}, Pa.parseIfStatement = function (e) {
  return this.next(), e.test = this.parseParenExpression(), e.consequent = this.parseStatement("if"), e.alternate = this.eat(ea._else) ? this.parseStatement("if") : null, this.finishNode(e, "IfStatement");
}, Pa.parseReturnStatement = function (e) {
  return this.inFunction || this.options.allowReturnOutsideFunction || this.raise(this.start, "'return' outside of function"), this.next(), this.eat(ea.semi) || this.insertSemicolon() ? e.argument = null : (e.argument = this.parseExpression(), this.semicolon()), this.finishNode(e, "ReturnStatement");
}, Pa.parseSwitchStatement = function (e) {
  var t;
  this.next(), e.discriminant = this.parseParenExpression(), e.cases = [], this.expect(ea.braceL), this.labels.push(Ca), this.enterScope(0);

  for (var s = !1; this.type !== ea.braceR;) if (this.type === ea._case || this.type === ea._default) {
    var i = this.type === ea._case;
    t && this.finishNode(t, "SwitchCase"), e.cases.push(t = this.startNode()), t.consequent = [], this.next(), i ? t.test = this.parseExpression() : (s && this.raiseRecoverable(this.lastTokStart, "Multiple default clauses"), s = !0, t.test = null), this.expect(ea.colon);
  } else t || this.unexpected(), t.consequent.push(this.parseStatement(null));

  return this.exitScope(), t && this.finishNode(t, "SwitchCase"), this.next(), this.labels.pop(), this.finishNode(e, "SwitchStatement");
}, Pa.parseThrowStatement = function (e) {
  return this.next(), ta.test(this.input.slice(this.lastTokEnd, this.start)) && this.raise(this.lastTokEnd, "Illegal newline after throw"), e.argument = this.parseExpression(), this.semicolon(), this.finishNode(e, "ThrowStatement");
};
var wa = [];
Pa.parseTryStatement = function (e) {
  if (this.next(), e.block = this.parseBlock(), e.handler = null, this.type === ea._catch) {
    var t = this.startNode();

    if (this.next(), this.eat(ea.parenL)) {
      t.param = this.parseBindingAtom();
      var s = "Identifier" === t.param.type;
      this.enterScope(s ? 32 : 0), this.checkLValPattern(t.param, s ? 4 : 2), this.expect(ea.parenR);
    } else this.options.ecmaVersion < 10 && this.unexpected(), t.param = null, this.enterScope(0);

    t.body = this.parseBlock(!1), this.exitScope(), e.handler = this.finishNode(t, "CatchClause");
  }

  return e.finalizer = this.eat(ea._finally) ? this.parseBlock() : null, e.handler || e.finalizer || this.raise(e.start, "Missing catch or finally clause"), this.finishNode(e, "TryStatement");
}, Pa.parseVarStatement = function (e, t) {
  return this.next(), this.parseVar(e, !1, t), this.semicolon(), this.finishNode(e, "VariableDeclaration");
}, Pa.parseWhileStatement = function (e) {
  return this.next(), e.test = this.parseParenExpression(), this.labels.push(ka), e.body = this.parseStatement("while"), this.labels.pop(), this.finishNode(e, "WhileStatement");
}, Pa.parseWithStatement = function (e) {
  return this.strict && this.raise(this.start, "'with' in strict mode"), this.next(), e.object = this.parseParenExpression(), e.body = this.parseStatement("with"), this.finishNode(e, "WithStatement");
}, Pa.parseEmptyStatement = function (e) {
  return this.next(), this.finishNode(e, "EmptyStatement");
}, Pa.parseLabeledStatement = function (e, t, s, i) {
  for (var n = 0, r = this.labels; n < r.length; n += 1) {
    r[n].name === t && this.raise(s.start, "Label '" + t + "' is already declared");
  }

  for (var a = this.type.isLoop ? "loop" : this.type === ea._switch ? "switch" : null, o = this.labels.length - 1; o >= 0; o--) {
    var h = this.labels[o];
    if (h.statementStart !== e.start) break;
    h.statementStart = this.start, h.kind = a;
  }

  return this.labels.push({
    name: t,
    kind: a,
    statementStart: this.start
  }), e.body = this.parseStatement(i ? -1 === i.indexOf("label") ? i + "label" : i : "label"), this.labels.pop(), e.label = s, this.finishNode(e, "LabeledStatement");
}, Pa.parseExpressionStatement = function (e, t) {
  return e.expression = t, this.semicolon(), this.finishNode(e, "ExpressionStatement");
}, Pa.parseBlock = function (e, t, s) {
  for (void 0 === e && (e = !0), void 0 === t && (t = this.startNode()), t.body = [], this.expect(ea.braceL), e && this.enterScope(0); this.type !== ea.braceR;) {
    var i = this.parseStatement(null);
    t.body.push(i);
  }

  return s && (this.strict = !1), this.next(), e && this.exitScope(), this.finishNode(t, "BlockStatement");
}, Pa.parseFor = function (e, t) {
  return e.init = t, this.expect(ea.semi), e.test = this.type === ea.semi ? null : this.parseExpression(), this.expect(ea.semi), e.update = this.type === ea.parenR ? null : this.parseExpression(), this.expect(ea.parenR), e.body = this.parseStatement("for"), this.exitScope(), this.labels.pop(), this.finishNode(e, "ForStatement");
}, Pa.parseForIn = function (e, t) {
  var s = this.type === ea._in;
  return this.next(), "VariableDeclaration" === t.type && null != t.declarations[0].init && (!s || this.options.ecmaVersion < 8 || this.strict || "var" !== t.kind || "Identifier" !== t.declarations[0].id.type) && this.raise(t.start, (s ? "for-in" : "for-of") + " loop variable declaration may not have an initializer"), e.left = t, e.right = s ? this.parseExpression() : this.parseMaybeAssign(), this.expect(ea.parenR), e.body = this.parseStatement("for"), this.exitScope(), this.labels.pop(), this.finishNode(e, s ? "ForInStatement" : "ForOfStatement");
}, Pa.parseVar = function (e, t, s) {
  for (e.declarations = [], e.kind = s;;) {
    var i = this.startNode();
    if (this.parseVarId(i, s), this.eat(ea.eq) ? i.init = this.parseMaybeAssign(t) : "const" !== s || this.type === ea._in || this.options.ecmaVersion >= 6 && this.isContextual("of") ? "Identifier" === i.id.type || t && (this.type === ea._in || this.isContextual("of")) ? i.init = null : this.raise(this.lastTokEnd, "Complex binding patterns require an initialization value") : this.unexpected(), e.declarations.push(this.finishNode(i, "VariableDeclarator")), !this.eat(ea.comma)) break;
  }

  return e;
}, Pa.parseVarId = function (e, t) {
  e.id = this.parseBindingAtom(), this.checkLValPattern(e.id, "var" === t ? 1 : 2, !1);
};
var Ia = 1,
    Na = 2;

function _a(e, t) {
  var s = t.key.name,
      i = e[s],
      n = "true";
  return "MethodDefinition" !== t.type || "get" !== t.kind && "set" !== t.kind || (n = (t.static ? "s" : "i") + t.kind), "iget" === i && "iset" === n || "iset" === i && "iget" === n || "sget" === i && "sset" === n || "sset" === i && "sget" === n ? (e[s] = "true", !1) : !!i || (e[s] = n, !1);
}

function $a(e, t) {
  var s = e.computed,
      i = e.key;
  return !s && ("Identifier" === i.type && i.name === t || "Literal" === i.type && i.value === t);
}

Pa.parseFunction = function (e, t, s, i) {
  this.initFunction(e), (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !i) && (this.type === ea.star && t & Na && this.unexpected(), e.generator = this.eat(ea.star)), this.options.ecmaVersion >= 8 && (e.async = !!i), t & Ia && (e.id = 4 & t && this.type !== ea.name ? null : this.parseIdent(), !e.id || t & Na || this.checkLValSimple(e.id, this.strict || e.generator || e.async ? this.treatFunctionsAsVar ? 1 : 2 : 3));
  var n = this.yieldPos,
      r = this.awaitPos,
      a = this.awaitIdentPos;
  return this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, this.enterScope(Ea(e.async, e.generator)), t & Ia || (e.id = this.type === ea.name ? this.parseIdent() : null), this.parseFunctionParams(e), this.parseFunctionBody(e, s, !1), this.yieldPos = n, this.awaitPos = r, this.awaitIdentPos = a, this.finishNode(e, t & Ia ? "FunctionDeclaration" : "FunctionExpression");
}, Pa.parseFunctionParams = function (e) {
  this.expect(ea.parenL), e.params = this.parseBindingList(ea.parenR, !1, this.options.ecmaVersion >= 8), this.checkYieldAwaitInDefaultParams();
}, Pa.parseClass = function (e, t) {
  this.next();
  var s = this.strict;
  this.strict = !0, this.parseClassId(e, t), this.parseClassSuper(e);
  var i = this.enterClassBody(),
      n = this.startNode(),
      r = !1;

  for (n.body = [], this.expect(ea.braceL); this.type !== ea.braceR;) {
    var a = this.parseClassElement(null !== e.superClass);
    a && (n.body.push(a), "MethodDefinition" === a.type && "constructor" === a.kind ? (r && this.raise(a.start, "Duplicate constructor in the same class"), r = !0) : "PrivateIdentifier" === a.key.type && _a(i, a) && this.raiseRecoverable(a.key.start, "Identifier '#" + a.key.name + "' has already been declared"));
  }

  return this.strict = s, this.next(), e.body = this.finishNode(n, "ClassBody"), this.exitClassBody(), this.finishNode(e, t ? "ClassDeclaration" : "ClassExpression");
}, Pa.parseClassElement = function (e) {
  if (this.eat(ea.semi)) return null;
  var t = this.options.ecmaVersion,
      s = this.startNode(),
      i = "",
      n = !1,
      r = !1,
      a = "method";

  if (s.static = !1, this.eatContextual("static") && (this.isClassElementNameStart() || this.type === ea.star ? s.static = !0 : i = "static"), !i && t >= 8 && this.eatContextual("async") && (!this.isClassElementNameStart() && this.type !== ea.star || this.canInsertSemicolon() ? i = "async" : r = !0), !i && (t >= 9 || !r) && this.eat(ea.star) && (n = !0), !i && !r && !n) {
    var o = this.value;
    (this.eatContextual("get") || this.eatContextual("set")) && (this.isClassElementNameStart() ? a = o : i = o);
  }

  if (i ? (s.computed = !1, s.key = this.startNodeAt(this.lastTokStart, this.lastTokStartLoc), s.key.name = i, this.finishNode(s.key, "Identifier")) : this.parseClassElementName(s), t < 13 || this.type === ea.parenL || "method" !== a || n || r) {
    var h = !s.static && $a(s, "constructor"),
        l = h && e;
    h && "method" !== a && this.raise(s.key.start, "Constructor can't have get/set modifier"), s.kind = h ? "constructor" : a, this.parseClassMethod(s, n, r, l);
  } else this.parseClassField(s);

  return s;
}, Pa.isClassElementNameStart = function () {
  return this.type === ea.name || this.type === ea.privateId || this.type === ea.num || this.type === ea.string || this.type === ea.bracketL || this.type.keyword;
}, Pa.parseClassElementName = function (e) {
  this.type === ea.privateId ? ("constructor" === this.value && this.raise(this.start, "Classes can't have an element named '#constructor'"), e.computed = !1, e.key = this.parsePrivateIdent()) : this.parsePropertyName(e);
}, Pa.parseClassMethod = function (e, t, s, i) {
  var n = e.key;
  "constructor" === e.kind ? (t && this.raise(n.start, "Constructor can't be a generator"), s && this.raise(n.start, "Constructor can't be an async method")) : e.static && $a(e, "prototype") && this.raise(n.start, "Classes may not have a static property named prototype");
  var r = e.value = this.parseMethod(t, s, i);
  return "get" === e.kind && 0 !== r.params.length && this.raiseRecoverable(r.start, "getter should have no params"), "set" === e.kind && 1 !== r.params.length && this.raiseRecoverable(r.start, "setter should have exactly one param"), "set" === e.kind && "RestElement" === r.params[0].type && this.raiseRecoverable(r.params[0].start, "Setter cannot use rest params"), this.finishNode(e, "MethodDefinition");
}, Pa.parseClassField = function (e) {
  if ($a(e, "constructor") ? this.raise(e.key.start, "Classes can't have a field named 'constructor'") : e.static && $a(e, "prototype") && this.raise(e.key.start, "Classes can't have a static field named 'prototype'"), this.eat(ea.eq)) {
    var t = this.currentThisScope(),
        s = t.inClassFieldInit;
    t.inClassFieldInit = !0, e.value = this.parseMaybeAssign(), t.inClassFieldInit = s;
  } else e.value = null;

  return this.semicolon(), this.finishNode(e, "PropertyDefinition");
}, Pa.parseClassId = function (e, t) {
  this.type === ea.name ? (e.id = this.parseIdent(), t && this.checkLValSimple(e.id, 2, !1)) : (!0 === t && this.unexpected(), e.id = null);
}, Pa.parseClassSuper = function (e) {
  e.superClass = this.eat(ea._extends) ? this.parseExprSubscripts() : null;
}, Pa.enterClassBody = function () {
  var e = {
    declared: Object.create(null),
    used: []
  };
  return this.privateNameStack.push(e), e.declared;
}, Pa.exitClassBody = function () {
  for (var e = this.privateNameStack.pop(), t = e.declared, s = e.used, i = this.privateNameStack.length, n = 0 === i ? null : this.privateNameStack[i - 1], r = 0; r < s.length; ++r) {
    var a = s[r];
    la(t, a.name) || (n ? n.used.push(a) : this.raiseRecoverable(a.start, "Private field '#" + a.name + "' must be declared in an enclosing class"));
  }
}, Pa.parseExport = function (e, t) {
  if (this.next(), this.eat(ea.star)) return this.options.ecmaVersion >= 11 && (this.eatContextual("as") ? (e.exported = this.parseIdent(!0), this.checkExport(t, e.exported.name, this.lastTokStart)) : e.exported = null), this.expectContextual("from"), this.type !== ea.string && this.unexpected(), e.source = this.parseExprAtom(), this.semicolon(), this.finishNode(e, "ExportAllDeclaration");

  if (this.eat(ea._default)) {
    var s;

    if (this.checkExport(t, "default", this.lastTokStart), this.type === ea._function || (s = this.isAsyncFunction())) {
      var i = this.startNode();
      this.next(), s && this.next(), e.declaration = this.parseFunction(i, 4 | Ia, !1, s);
    } else if (this.type === ea._class) {
      var n = this.startNode();
      e.declaration = this.parseClass(n, "nullableID");
    } else e.declaration = this.parseMaybeAssign(), this.semicolon();

    return this.finishNode(e, "ExportDefaultDeclaration");
  }

  if (this.shouldParseExportStatement()) e.declaration = this.parseStatement(null), "VariableDeclaration" === e.declaration.type ? this.checkVariableExport(t, e.declaration.declarations) : this.checkExport(t, e.declaration.id.name, e.declaration.id.start), e.specifiers = [], e.source = null;else {
    if (e.declaration = null, e.specifiers = this.parseExportSpecifiers(t), this.eatContextual("from")) this.type !== ea.string && this.unexpected(), e.source = this.parseExprAtom();else {
      for (var r = 0, a = e.specifiers; r < a.length; r += 1) {
        var o = a[r];
        this.checkUnreserved(o.local), this.checkLocalExport(o.local);
      }

      e.source = null;
    }
    this.semicolon();
  }
  return this.finishNode(e, "ExportNamedDeclaration");
}, Pa.checkExport = function (e, t, s) {
  e && (la(e, t) && this.raiseRecoverable(s, "Duplicate export '" + t + "'"), e[t] = !0);
}, Pa.checkPatternExport = function (e, t) {
  var s = t.type;
  if ("Identifier" === s) this.checkExport(e, t.name, t.start);else if ("ObjectPattern" === s) for (var i = 0, n = t.properties; i < n.length; i += 1) {
    var r = n[i];
    this.checkPatternExport(e, r);
  } else if ("ArrayPattern" === s) for (var a = 0, o = t.elements; a < o.length; a += 1) {
    var h = o[a];
    h && this.checkPatternExport(e, h);
  } else "Property" === s ? this.checkPatternExport(e, t.value) : "AssignmentPattern" === s ? this.checkPatternExport(e, t.left) : "RestElement" === s ? this.checkPatternExport(e, t.argument) : "ParenthesizedExpression" === s && this.checkPatternExport(e, t.expression);
}, Pa.checkVariableExport = function (e, t) {
  if (e) for (var s = 0, i = t; s < i.length; s += 1) {
    var n = i[s];
    this.checkPatternExport(e, n.id);
  }
}, Pa.shouldParseExportStatement = function () {
  return "var" === this.type.keyword || "const" === this.type.keyword || "class" === this.type.keyword || "function" === this.type.keyword || this.isLet() || this.isAsyncFunction();
}, Pa.parseExportSpecifiers = function (e) {
  var t = [],
      s = !0;

  for (this.expect(ea.braceL); !this.eat(ea.braceR);) {
    if (s) s = !1;else if (this.expect(ea.comma), this.afterTrailingComma(ea.braceR)) break;
    var i = this.startNode();
    i.local = this.parseIdent(!0), i.exported = this.eatContextual("as") ? this.parseIdent(!0) : i.local, this.checkExport(e, i.exported.name, i.exported.start), t.push(this.finishNode(i, "ExportSpecifier"));
  }

  return t;
}, Pa.parseImport = function (e) {
  return this.next(), this.type === ea.string ? (e.specifiers = wa, e.source = this.parseExprAtom()) : (e.specifiers = this.parseImportSpecifiers(), this.expectContextual("from"), e.source = this.type === ea.string ? this.parseExprAtom() : this.unexpected()), this.semicolon(), this.finishNode(e, "ImportDeclaration");
}, Pa.parseImportSpecifiers = function () {
  var e = [],
      t = !0;

  if (this.type === ea.name) {
    var s = this.startNode();
    if (s.local = this.parseIdent(), this.checkLValSimple(s.local, 2), e.push(this.finishNode(s, "ImportDefaultSpecifier")), !this.eat(ea.comma)) return e;
  }

  if (this.type === ea.star) {
    var i = this.startNode();
    return this.next(), this.expectContextual("as"), i.local = this.parseIdent(), this.checkLValSimple(i.local, 2), e.push(this.finishNode(i, "ImportNamespaceSpecifier")), e;
  }

  for (this.expect(ea.braceL); !this.eat(ea.braceR);) {
    if (t) t = !1;else if (this.expect(ea.comma), this.afterTrailingComma(ea.braceR)) break;
    var n = this.startNode();
    n.imported = this.parseIdent(!0), this.eatContextual("as") ? n.local = this.parseIdent() : (this.checkUnreserved(n.imported), n.local = n.imported), this.checkLValSimple(n.local, 2), e.push(this.finishNode(n, "ImportSpecifier"));
  }

  return e;
}, Pa.adaptDirectivePrologue = function (e) {
  for (var t = 0; t < e.length && this.isDirectiveCandidate(e[t]); ++t) e[t].directive = e[t].expression.raw.slice(1, -1);
}, Pa.isDirectiveCandidate = function (e) {
  return "ExpressionStatement" === e.type && "Literal" === e.expression.type && "string" == typeof e.expression.value && ('"' === this.input[e.start] || "'" === this.input[e.start]);
};
var Ta = xa.prototype;
Ta.toAssignable = function (e, t, s) {
  if (this.options.ecmaVersion >= 6 && e) switch (e.type) {
    case "Identifier":
      this.inAsync && "await" === e.name && this.raise(e.start, "Cannot use 'await' as identifier inside an async function");
      break;

    case "ObjectPattern":
    case "ArrayPattern":
    case "AssignmentPattern":
    case "RestElement":
      break;

    case "ObjectExpression":
      e.type = "ObjectPattern", s && this.checkPatternErrors(s, !0);

      for (var i = 0, n = e.properties; i < n.length; i += 1) {
        var r = n[i];
        this.toAssignable(r, t), "RestElement" !== r.type || "ArrayPattern" !== r.argument.type && "ObjectPattern" !== r.argument.type || this.raise(r.argument.start, "Unexpected token");
      }

      break;

    case "Property":
      "init" !== e.kind && this.raise(e.key.start, "Object pattern can't contain getter or setter"), this.toAssignable(e.value, t);
      break;

    case "ArrayExpression":
      e.type = "ArrayPattern", s && this.checkPatternErrors(s, !0), this.toAssignableList(e.elements, t);
      break;

    case "SpreadElement":
      e.type = "RestElement", this.toAssignable(e.argument, t), "AssignmentPattern" === e.argument.type && this.raise(e.argument.start, "Rest elements cannot have a default value");
      break;

    case "AssignmentExpression":
      "=" !== e.operator && this.raise(e.left.end, "Only '=' operator can be used for specifying default value."), e.type = "AssignmentPattern", delete e.operator, this.toAssignable(e.left, t);
      break;

    case "ParenthesizedExpression":
      this.toAssignable(e.expression, t, s);
      break;

    case "ChainExpression":
      this.raiseRecoverable(e.start, "Optional chaining cannot appear in left-hand side");
      break;

    case "MemberExpression":
      if (!t) break;

    default:
      this.raise(e.start, "Assigning to rvalue");
  } else s && this.checkPatternErrors(s, !0);
  return e;
}, Ta.toAssignableList = function (e, t) {
  for (var s = e.length, i = 0; i < s; i++) {
    var n = e[i];
    n && this.toAssignable(n, t);
  }

  if (s) {
    var r = e[s - 1];
    6 === this.options.ecmaVersion && t && r && "RestElement" === r.type && "Identifier" !== r.argument.type && this.unexpected(r.argument.start);
  }

  return e;
}, Ta.parseSpread = function (e) {
  var t = this.startNode();
  return this.next(), t.argument = this.parseMaybeAssign(!1, e), this.finishNode(t, "SpreadElement");
}, Ta.parseRestBinding = function () {
  var e = this.startNode();
  return this.next(), 6 === this.options.ecmaVersion && this.type !== ea.name && this.unexpected(), e.argument = this.parseBindingAtom(), this.finishNode(e, "RestElement");
}, Ta.parseBindingAtom = function () {
  if (this.options.ecmaVersion >= 6) switch (this.type) {
    case ea.bracketL:
      var e = this.startNode();
      return this.next(), e.elements = this.parseBindingList(ea.bracketR, !0, !0), this.finishNode(e, "ArrayPattern");

    case ea.braceL:
      return this.parseObj(!0);
  }
  return this.parseIdent();
}, Ta.parseBindingList = function (e, t, s) {
  for (var i = [], n = !0; !this.eat(e);) if (n ? n = !1 : this.expect(ea.comma), t && this.type === ea.comma) i.push(null);else {
    if (s && this.afterTrailingComma(e)) break;

    if (this.type === ea.ellipsis) {
      var r = this.parseRestBinding();
      this.parseBindingListItem(r), i.push(r), this.type === ea.comma && this.raise(this.start, "Comma is not permitted after the rest element"), this.expect(e);
      break;
    }

    var a = this.parseMaybeDefault(this.start, this.startLoc);
    this.parseBindingListItem(a), i.push(a);
  }

  return i;
}, Ta.parseBindingListItem = function (e) {
  return e;
}, Ta.parseMaybeDefault = function (e, t, s) {
  if (s = s || this.parseBindingAtom(), this.options.ecmaVersion < 6 || !this.eat(ea.eq)) return s;
  var i = this.startNodeAt(e, t);
  return i.left = s, i.right = this.parseMaybeAssign(), this.finishNode(i, "AssignmentPattern");
}, Ta.checkLValSimple = function (e, t, s) {
  void 0 === t && (t = 0);
  var i = 0 !== t;

  switch (e.type) {
    case "Identifier":
      this.strict && this.reservedWordsStrictBind.test(e.name) && this.raiseRecoverable(e.start, (i ? "Binding " : "Assigning to ") + e.name + " in strict mode"), i && (2 === t && "let" === e.name && this.raiseRecoverable(e.start, "let is disallowed as a lexically bound name"), s && (la(s, e.name) && this.raiseRecoverable(e.start, "Argument name clash"), s[e.name] = !0), 5 !== t && this.declareName(e.name, t, e.start));
      break;

    case "ChainExpression":
      this.raiseRecoverable(e.start, "Optional chaining cannot appear in left-hand side");
      break;

    case "MemberExpression":
      i && this.raiseRecoverable(e.start, "Binding member expression");
      break;

    case "ParenthesizedExpression":
      return i && this.raiseRecoverable(e.start, "Binding parenthesized expression"), this.checkLValSimple(e.expression, t, s);

    default:
      this.raise(e.start, (i ? "Binding" : "Assigning to") + " rvalue");
  }
}, Ta.checkLValPattern = function (e, t, s) {
  switch (void 0 === t && (t = 0), e.type) {
    case "ObjectPattern":
      for (var i = 0, n = e.properties; i < n.length; i += 1) {
        var r = n[i];
        this.checkLValInnerPattern(r, t, s);
      }

      break;

    case "ArrayPattern":
      for (var a = 0, o = e.elements; a < o.length; a += 1) {
        var h = o[a];
        h && this.checkLValInnerPattern(h, t, s);
      }

      break;

    default:
      this.checkLValSimple(e, t, s);
  }
}, Ta.checkLValInnerPattern = function (e, t, s) {
  switch (void 0 === t && (t = 0), e.type) {
    case "Property":
      this.checkLValInnerPattern(e.value, t, s);
      break;

    case "AssignmentPattern":
      this.checkLValPattern(e.left, t, s);
      break;

    case "RestElement":
      this.checkLValPattern(e.argument, t, s);
      break;

    default:
      this.checkLValPattern(e, t, s);
  }
};
var Ra = xa.prototype;

function Ma(e) {
  return "MemberExpression" === e.type && "PrivateIdentifier" === e.property.type || "ChainExpression" === e.type && Ma(e.expression);
}

Ra.checkPropClash = function (e, t, s) {
  if (!(this.options.ecmaVersion >= 9 && "SpreadElement" === e.type || this.options.ecmaVersion >= 6 && (e.computed || e.method || e.shorthand))) {
    var i,
        n = e.key;

    switch (n.type) {
      case "Identifier":
        i = n.name;
        break;

      case "Literal":
        i = String(n.value);
        break;

      default:
        return;
    }

    var r = e.kind;
    if (this.options.ecmaVersion >= 6) "__proto__" === i && "init" === r && (t.proto && (s ? s.doubleProto < 0 && (s.doubleProto = n.start) : this.raiseRecoverable(n.start, "Redefinition of __proto__ property")), t.proto = !0);else {
      var a = t[i = "$" + i];
      if (a) ("init" === r ? this.strict && a.init || a.get || a.set : a.init || a[r]) && this.raiseRecoverable(n.start, "Redefinition of property");else a = t[i] = {
        init: !1,
        get: !1,
        set: !1
      };
      a[r] = !0;
    }
  }
}, Ra.parseExpression = function (e, t) {
  var s = this.start,
      i = this.startLoc,
      n = this.parseMaybeAssign(e, t);

  if (this.type === ea.comma) {
    var r = this.startNodeAt(s, i);

    for (r.expressions = [n]; this.eat(ea.comma);) r.expressions.push(this.parseMaybeAssign(e, t));

    return this.finishNode(r, "SequenceExpression");
  }

  return n;
}, Ra.parseMaybeAssign = function (e, t, s) {
  if (this.isContextual("yield")) {
    if (this.inGenerator) return this.parseYield(e);
    this.exprAllowed = !1;
  }

  var i = !1,
      n = -1,
      r = -1;
  t ? (n = t.parenthesizedAssign, r = t.trailingComma, t.parenthesizedAssign = t.trailingComma = -1) : (t = new Aa(), i = !0);
  var a = this.start,
      o = this.startLoc;
  this.type !== ea.parenL && this.type !== ea.name || (this.potentialArrowAt = this.start, this.potentialArrowInForAwait = "await" === e);
  var h = this.parseMaybeConditional(e, t);

  if (s && (h = s.call(this, h, a, o)), this.type.isAssign) {
    var l = this.startNodeAt(a, o);
    return l.operator = this.value, this.type === ea.eq && (h = this.toAssignable(h, !1, t)), i || (t.parenthesizedAssign = t.trailingComma = t.doubleProto = -1), t.shorthandAssign >= h.start && (t.shorthandAssign = -1), this.type === ea.eq ? this.checkLValPattern(h) : this.checkLValSimple(h), l.left = h, this.next(), l.right = this.parseMaybeAssign(e), this.finishNode(l, "AssignmentExpression");
  }

  return i && this.checkExpressionErrors(t, !0), n > -1 && (t.parenthesizedAssign = n), r > -1 && (t.trailingComma = r), h;
}, Ra.parseMaybeConditional = function (e, t) {
  var s = this.start,
      i = this.startLoc,
      n = this.parseExprOps(e, t);
  if (this.checkExpressionErrors(t)) return n;

  if (this.eat(ea.question)) {
    var r = this.startNodeAt(s, i);
    return r.test = n, r.consequent = this.parseMaybeAssign(), this.expect(ea.colon), r.alternate = this.parseMaybeAssign(e), this.finishNode(r, "ConditionalExpression");
  }

  return n;
}, Ra.parseExprOps = function (e, t) {
  var s = this.start,
      i = this.startLoc,
      n = this.parseMaybeUnary(t, !1);
  return this.checkExpressionErrors(t) || n.start === s && "ArrowFunctionExpression" === n.type ? n : this.parseExprOp(n, s, i, -1, e);
}, Ra.parseExprOp = function (e, t, s, i, n) {
  var r = this.type.binop;

  if (null != r && (!n || this.type !== ea._in) && r > i) {
    var a = this.type === ea.logicalOR || this.type === ea.logicalAND,
        o = this.type === ea.coalesce;
    o && (r = ea.logicalAND.binop);
    var h = this.value;
    this.next();
    var l = this.start,
        c = this.startLoc,
        u = this.parseExprOp(this.parseMaybeUnary(null, !1), l, c, r, n),
        d = this.buildBinary(t, s, e, u, h, a || o);
    return (a && this.type === ea.coalesce || o && (this.type === ea.logicalOR || this.type === ea.logicalAND)) && this.raiseRecoverable(this.start, "Logical expressions and coalesce expressions cannot be mixed. Wrap either by parentheses"), this.parseExprOp(d, t, s, i, n);
  }

  return e;
}, Ra.buildBinary = function (e, t, s, i, n, r) {
  var a = this.startNodeAt(e, t);
  return a.left = s, a.operator = n, a.right = i, this.finishNode(a, r ? "LogicalExpression" : "BinaryExpression");
}, Ra.parseMaybeUnary = function (e, t, s) {
  var i,
      n = this.start,
      r = this.startLoc;
  if (this.isContextual("await") && (this.inAsync || !this.inFunction && this.options.allowAwaitOutsideFunction)) i = this.parseAwait(), t = !0;else if (this.type.prefix) {
    var a = this.startNode(),
        o = this.type === ea.incDec;
    a.operator = this.value, a.prefix = !0, this.next(), a.argument = this.parseMaybeUnary(null, !0, o), this.checkExpressionErrors(e, !0), o ? this.checkLValSimple(a.argument) : this.strict && "delete" === a.operator && "Identifier" === a.argument.type ? this.raiseRecoverable(a.start, "Deleting local variable in strict mode") : "delete" === a.operator && Ma(a.argument) ? this.raiseRecoverable(a.start, "Private fields can not be deleted") : t = !0, i = this.finishNode(a, o ? "UpdateExpression" : "UnaryExpression");
  } else {
    if (i = this.parseExprSubscripts(e), this.checkExpressionErrors(e)) return i;

    for (; this.type.postfix && !this.canInsertSemicolon();) {
      var h = this.startNodeAt(n, r);
      h.operator = this.value, h.prefix = !1, h.argument = i, this.checkLValSimple(i), this.next(), i = this.finishNode(h, "UpdateExpression");
    }
  }
  return s || !this.eat(ea.starstar) ? i : t ? void this.unexpected(this.lastTokStart) : this.buildBinary(n, r, i, this.parseMaybeUnary(null, !1), "**", !1);
}, Ra.parseExprSubscripts = function (e) {
  var t = this.start,
      s = this.startLoc,
      i = this.parseExprAtom(e);
  if ("ArrowFunctionExpression" === i.type && ")" !== this.input.slice(this.lastTokStart, this.lastTokEnd)) return i;
  var n = this.parseSubscripts(i, t, s);
  return e && "MemberExpression" === n.type && (e.parenthesizedAssign >= n.start && (e.parenthesizedAssign = -1), e.parenthesizedBind >= n.start && (e.parenthesizedBind = -1), e.trailingComma >= n.start && (e.trailingComma = -1)), n;
}, Ra.parseSubscripts = function (e, t, s, i) {
  for (var n = this.options.ecmaVersion >= 8 && "Identifier" === e.type && "async" === e.name && this.lastTokEnd === e.end && !this.canInsertSemicolon() && e.end - e.start == 5 && this.potentialArrowAt === e.start, r = !1;;) {
    var a = this.parseSubscript(e, t, s, i, n, r);

    if (a.optional && (r = !0), a === e || "ArrowFunctionExpression" === a.type) {
      if (r) {
        var o = this.startNodeAt(t, s);
        o.expression = a, a = this.finishNode(o, "ChainExpression");
      }

      return a;
    }

    e = a;
  }
}, Ra.parseSubscript = function (e, t, s, i, n, r) {
  var a = this.options.ecmaVersion >= 11,
      o = a && this.eat(ea.questionDot);
  i && o && this.raise(this.lastTokStart, "Optional chaining cannot appear in the callee of new expressions");
  var h = this.eat(ea.bracketL);

  if (h || o && this.type !== ea.parenL && this.type !== ea.backQuote || this.eat(ea.dot)) {
    var l = this.startNodeAt(t, s);
    l.object = e, h ? (l.property = this.parseExpression(), this.expect(ea.bracketR)) : this.type === ea.privateId && "Super" !== e.type ? l.property = this.parsePrivateIdent() : l.property = this.parseIdent("never" !== this.options.allowReserved), l.computed = !!h, a && (l.optional = o), e = this.finishNode(l, "MemberExpression");
  } else if (!i && this.eat(ea.parenL)) {
    var c = new Aa(),
        u = this.yieldPos,
        d = this.awaitPos,
        p = this.awaitIdentPos;
    this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0;
    var f = this.parseExprList(ea.parenR, this.options.ecmaVersion >= 8, !1, c);
    if (n && !o && !this.canInsertSemicolon() && this.eat(ea.arrow)) return this.checkPatternErrors(c, !1), this.checkYieldAwaitInDefaultParams(), this.awaitIdentPos > 0 && this.raise(this.awaitIdentPos, "Cannot use 'await' as identifier inside an async function"), this.yieldPos = u, this.awaitPos = d, this.awaitIdentPos = p, this.parseArrowExpression(this.startNodeAt(t, s), f, !0);
    this.checkExpressionErrors(c, !0), this.yieldPos = u || this.yieldPos, this.awaitPos = d || this.awaitPos, this.awaitIdentPos = p || this.awaitIdentPos;
    var m = this.startNodeAt(t, s);
    m.callee = e, m.arguments = f, a && (m.optional = o), e = this.finishNode(m, "CallExpression");
  } else if (this.type === ea.backQuote) {
    (o || r) && this.raise(this.start, "Optional chaining cannot appear in the tag of tagged template expressions");
    var g = this.startNodeAt(t, s);
    g.tag = e, g.quasi = this.parseTemplate({
      isTagged: !0
    }), e = this.finishNode(g, "TaggedTemplateExpression");
  }

  return e;
}, Ra.parseExprAtom = function (e) {
  this.type === ea.slash && this.readRegexp();
  var t,
      s = this.potentialArrowAt === this.start;

  switch (this.type) {
    case ea._super:
      return this.allowSuper || this.raise(this.start, "'super' keyword outside a method"), t = this.startNode(), this.next(), this.type !== ea.parenL || this.allowDirectSuper || this.raise(t.start, "super() call outside constructor of a subclass"), this.type !== ea.dot && this.type !== ea.bracketL && this.type !== ea.parenL && this.unexpected(), this.finishNode(t, "Super");

    case ea._this:
      return t = this.startNode(), this.next(), this.finishNode(t, "ThisExpression");

    case ea.name:
      var i = this.start,
          n = this.startLoc,
          r = this.containsEsc,
          a = this.parseIdent(!1);
      if (this.options.ecmaVersion >= 8 && !r && "async" === a.name && !this.canInsertSemicolon() && this.eat(ea._function)) return this.parseFunction(this.startNodeAt(i, n), 0, !1, !0);

      if (s && !this.canInsertSemicolon()) {
        if (this.eat(ea.arrow)) return this.parseArrowExpression(this.startNodeAt(i, n), [a], !1);
        if (this.options.ecmaVersion >= 8 && "async" === a.name && this.type === ea.name && !r && (!this.potentialArrowInForAwait || "of" !== this.value || this.containsEsc)) return a = this.parseIdent(!1), !this.canInsertSemicolon() && this.eat(ea.arrow) || this.unexpected(), this.parseArrowExpression(this.startNodeAt(i, n), [a], !0);
      }

      return a;

    case ea.regexp:
      var o = this.value;
      return (t = this.parseLiteral(o.value)).regex = {
        pattern: o.pattern,
        flags: o.flags
      }, t;

    case ea.num:
    case ea.string:
      return this.parseLiteral(this.value);

    case ea._null:
    case ea._true:
    case ea._false:
      return (t = this.startNode()).value = this.type === ea._null ? null : this.type === ea._true, t.raw = this.type.keyword, this.next(), this.finishNode(t, "Literal");

    case ea.parenL:
      var h = this.start,
          l = this.parseParenAndDistinguishExpression(s);
      return e && (e.parenthesizedAssign < 0 && !this.isSimpleAssignTarget(l) && (e.parenthesizedAssign = h), e.parenthesizedBind < 0 && (e.parenthesizedBind = h)), l;

    case ea.bracketL:
      return t = this.startNode(), this.next(), t.elements = this.parseExprList(ea.bracketR, !0, !0, e), this.finishNode(t, "ArrayExpression");

    case ea.braceL:
      return this.parseObj(!1, e);

    case ea._function:
      return t = this.startNode(), this.next(), this.parseFunction(t, 0);

    case ea._class:
      return this.parseClass(this.startNode(), !1);

    case ea._new:
      return this.parseNew();

    case ea.backQuote:
      return this.parseTemplate();

    case ea._import:
      return this.options.ecmaVersion >= 11 ? this.parseExprImport() : this.unexpected();

    default:
      this.unexpected();
  }
}, Ra.parseExprImport = function () {
  var e = this.startNode();
  this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword import");
  var t = this.parseIdent(!0);

  switch (this.type) {
    case ea.parenL:
      return this.parseDynamicImport(e);

    case ea.dot:
      return e.meta = t, this.parseImportMeta(e);

    default:
      this.unexpected();
  }
}, Ra.parseDynamicImport = function (e) {
  if (this.next(), e.source = this.parseMaybeAssign(), !this.eat(ea.parenR)) {
    var t = this.start;
    this.eat(ea.comma) && this.eat(ea.parenR) ? this.raiseRecoverable(t, "Trailing comma is not allowed in import()") : this.unexpected(t);
  }

  return this.finishNode(e, "ImportExpression");
}, Ra.parseImportMeta = function (e) {
  this.next();
  var t = this.containsEsc;
  return e.property = this.parseIdent(!0), "meta" !== e.property.name && this.raiseRecoverable(e.property.start, "The only valid meta property for import is 'import.meta'"), t && this.raiseRecoverable(e.start, "'import.meta' must not contain escaped characters"), "module" === this.options.sourceType || this.options.allowImportExportEverywhere || this.raiseRecoverable(e.start, "Cannot use 'import.meta' outside a module"), this.finishNode(e, "MetaProperty");
}, Ra.parseLiteral = function (e) {
  var t = this.startNode();
  return t.value = e, t.raw = this.input.slice(this.start, this.end), 110 === t.raw.charCodeAt(t.raw.length - 1) && (t.bigint = t.raw.slice(0, -1).replace(/_/g, "")), this.next(), this.finishNode(t, "Literal");
}, Ra.parseParenExpression = function () {
  this.expect(ea.parenL);
  var e = this.parseExpression();
  return this.expect(ea.parenR), e;
}, Ra.parseParenAndDistinguishExpression = function (e) {
  var t,
      s = this.start,
      i = this.startLoc,
      n = this.options.ecmaVersion >= 8;

  if (this.options.ecmaVersion >= 6) {
    this.next();
    var r,
        a = this.start,
        o = this.startLoc,
        h = [],
        l = !0,
        c = !1,
        u = new Aa(),
        d = this.yieldPos,
        p = this.awaitPos;

    for (this.yieldPos = 0, this.awaitPos = 0; this.type !== ea.parenR;) {
      if (l ? l = !1 : this.expect(ea.comma), n && this.afterTrailingComma(ea.parenR, !0)) {
        c = !0;
        break;
      }

      if (this.type === ea.ellipsis) {
        r = this.start, h.push(this.parseParenItem(this.parseRestBinding())), this.type === ea.comma && this.raise(this.start, "Comma is not permitted after the rest element");
        break;
      }

      h.push(this.parseMaybeAssign(!1, u, this.parseParenItem));
    }

    var f = this.start,
        m = this.startLoc;
    if (this.expect(ea.parenR), e && !this.canInsertSemicolon() && this.eat(ea.arrow)) return this.checkPatternErrors(u, !1), this.checkYieldAwaitInDefaultParams(), this.yieldPos = d, this.awaitPos = p, this.parseParenArrowList(s, i, h);
    h.length && !c || this.unexpected(this.lastTokStart), r && this.unexpected(r), this.checkExpressionErrors(u, !0), this.yieldPos = d || this.yieldPos, this.awaitPos = p || this.awaitPos, h.length > 1 ? ((t = this.startNodeAt(a, o)).expressions = h, this.finishNodeAt(t, "SequenceExpression", f, m)) : t = h[0];
  } else t = this.parseParenExpression();

  if (this.options.preserveParens) {
    var g = this.startNodeAt(s, i);
    return g.expression = t, this.finishNode(g, "ParenthesizedExpression");
  }

  return t;
}, Ra.parseParenItem = function (e) {
  return e;
}, Ra.parseParenArrowList = function (e, t, s) {
  return this.parseArrowExpression(this.startNodeAt(e, t), s);
};
var Oa = [];
Ra.parseNew = function () {
  this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword new");
  var e = this.startNode(),
      t = this.parseIdent(!0);

  if (this.options.ecmaVersion >= 6 && this.eat(ea.dot)) {
    e.meta = t;
    var s = this.containsEsc;
    return e.property = this.parseIdent(!0), "target" !== e.property.name && this.raiseRecoverable(e.property.start, "The only valid meta property for new is 'new.target'"), s && this.raiseRecoverable(e.start, "'new.target' must not contain escaped characters"), this.inNonArrowFunction || this.raiseRecoverable(e.start, "'new.target' can only be used in functions"), this.finishNode(e, "MetaProperty");
  }

  var i = this.start,
      n = this.startLoc,
      r = this.type === ea._import;
  return e.callee = this.parseSubscripts(this.parseExprAtom(), i, n, !0), r && "ImportExpression" === e.callee.type && this.raise(i, "Cannot use new with import()"), this.eat(ea.parenL) ? e.arguments = this.parseExprList(ea.parenR, this.options.ecmaVersion >= 8, !1) : e.arguments = Oa, this.finishNode(e, "NewExpression");
}, Ra.parseTemplateElement = function (e) {
  var t = e.isTagged,
      s = this.startNode();
  return this.type === ea.invalidTemplate ? (t || this.raiseRecoverable(this.start, "Bad escape sequence in untagged template literal"), s.value = {
    raw: this.value,
    cooked: null
  }) : s.value = {
    raw: this.input.slice(this.start, this.end).replace(/\r\n?/g, "\n"),
    cooked: this.value
  }, this.next(), s.tail = this.type === ea.backQuote, this.finishNode(s, "TemplateElement");
}, Ra.parseTemplate = function (e) {
  void 0 === e && (e = {});
  var t = e.isTagged;
  void 0 === t && (t = !1);
  var s = this.startNode();
  this.next(), s.expressions = [];
  var i = this.parseTemplateElement({
    isTagged: t
  });

  for (s.quasis = [i]; !i.tail;) this.type === ea.eof && this.raise(this.pos, "Unterminated template literal"), this.expect(ea.dollarBraceL), s.expressions.push(this.parseExpression()), this.expect(ea.braceR), s.quasis.push(i = this.parseTemplateElement({
    isTagged: t
  }));

  return this.next(), this.finishNode(s, "TemplateLiteral");
}, Ra.isAsyncProp = function (e) {
  return !e.computed && "Identifier" === e.key.type && "async" === e.key.name && (this.type === ea.name || this.type === ea.num || this.type === ea.string || this.type === ea.bracketL || this.type.keyword || this.options.ecmaVersion >= 9 && this.type === ea.star) && !ta.test(this.input.slice(this.lastTokEnd, this.start));
}, Ra.parseObj = function (e, t) {
  var s = this.startNode(),
      i = !0,
      n = {};

  for (s.properties = [], this.next(); !this.eat(ea.braceR);) {
    if (i) i = !1;else if (this.expect(ea.comma), this.options.ecmaVersion >= 5 && this.afterTrailingComma(ea.braceR)) break;
    var r = this.parseProperty(e, t);
    e || this.checkPropClash(r, n, t), s.properties.push(r);
  }

  return this.finishNode(s, e ? "ObjectPattern" : "ObjectExpression");
}, Ra.parseProperty = function (e, t) {
  var s,
      i,
      n,
      r,
      a = this.startNode();
  if (this.options.ecmaVersion >= 9 && this.eat(ea.ellipsis)) return e ? (a.argument = this.parseIdent(!1), this.type === ea.comma && this.raise(this.start, "Comma is not permitted after the rest element"), this.finishNode(a, "RestElement")) : (this.type === ea.parenL && t && (t.parenthesizedAssign < 0 && (t.parenthesizedAssign = this.start), t.parenthesizedBind < 0 && (t.parenthesizedBind = this.start)), a.argument = this.parseMaybeAssign(!1, t), this.type === ea.comma && t && t.trailingComma < 0 && (t.trailingComma = this.start), this.finishNode(a, "SpreadElement"));
  this.options.ecmaVersion >= 6 && (a.method = !1, a.shorthand = !1, (e || t) && (n = this.start, r = this.startLoc), e || (s = this.eat(ea.star)));
  var o = this.containsEsc;
  return this.parsePropertyName(a), !e && !o && this.options.ecmaVersion >= 8 && !s && this.isAsyncProp(a) ? (i = !0, s = this.options.ecmaVersion >= 9 && this.eat(ea.star), this.parsePropertyName(a, t)) : i = !1, this.parsePropertyValue(a, e, s, i, n, r, t, o), this.finishNode(a, "Property");
}, Ra.parsePropertyValue = function (e, t, s, i, n, r, a, o) {
  if ((s || i) && this.type === ea.colon && this.unexpected(), this.eat(ea.colon)) e.value = t ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(!1, a), e.kind = "init";else if (this.options.ecmaVersion >= 6 && this.type === ea.parenL) t && this.unexpected(), e.kind = "init", e.method = !0, e.value = this.parseMethod(s, i);else if (t || o || !(this.options.ecmaVersion >= 5) || e.computed || "Identifier" !== e.key.type || "get" !== e.key.name && "set" !== e.key.name || this.type === ea.comma || this.type === ea.braceR || this.type === ea.eq) this.options.ecmaVersion >= 6 && !e.computed && "Identifier" === e.key.type ? ((s || i) && this.unexpected(), this.checkUnreserved(e.key), "await" !== e.key.name || this.awaitIdentPos || (this.awaitIdentPos = n), e.kind = "init", t ? e.value = this.parseMaybeDefault(n, r, this.copyNode(e.key)) : this.type === ea.eq && a ? (a.shorthandAssign < 0 && (a.shorthandAssign = this.start), e.value = this.parseMaybeDefault(n, r, this.copyNode(e.key))) : e.value = this.copyNode(e.key), e.shorthand = !0) : this.unexpected();else {
    (s || i) && this.unexpected(), e.kind = e.key.name, this.parsePropertyName(e), e.value = this.parseMethod(!1);
    var h = "get" === e.kind ? 0 : 1;

    if (e.value.params.length !== h) {
      var l = e.value.start;
      "get" === e.kind ? this.raiseRecoverable(l, "getter should have no params") : this.raiseRecoverable(l, "setter should have exactly one param");
    } else "set" === e.kind && "RestElement" === e.value.params[0].type && this.raiseRecoverable(e.value.params[0].start, "Setter cannot use rest params");
  }
}, Ra.parsePropertyName = function (e) {
  if (this.options.ecmaVersion >= 6) {
    if (this.eat(ea.bracketL)) return e.computed = !0, e.key = this.parseMaybeAssign(), this.expect(ea.bracketR), e.key;
    e.computed = !1;
  }

  return e.key = this.type === ea.num || this.type === ea.string ? this.parseExprAtom() : this.parseIdent("never" !== this.options.allowReserved);
}, Ra.initFunction = function (e) {
  e.id = null, this.options.ecmaVersion >= 6 && (e.generator = e.expression = !1), this.options.ecmaVersion >= 8 && (e.async = !1);
}, Ra.parseMethod = function (e, t, s) {
  var i = this.startNode(),
      n = this.yieldPos,
      r = this.awaitPos,
      a = this.awaitIdentPos;
  return this.initFunction(i), this.options.ecmaVersion >= 6 && (i.generator = e), this.options.ecmaVersion >= 8 && (i.async = !!t), this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, this.enterScope(64 | Ea(t, i.generator) | (s ? 128 : 0)), this.expect(ea.parenL), i.params = this.parseBindingList(ea.parenR, !1, this.options.ecmaVersion >= 8), this.checkYieldAwaitInDefaultParams(), this.parseFunctionBody(i, !1, !0), this.yieldPos = n, this.awaitPos = r, this.awaitIdentPos = a, this.finishNode(i, "FunctionExpression");
}, Ra.parseArrowExpression = function (e, t, s) {
  var i = this.yieldPos,
      n = this.awaitPos,
      r = this.awaitIdentPos;
  return this.enterScope(16 | Ea(s, !1)), this.initFunction(e), this.options.ecmaVersion >= 8 && (e.async = !!s), this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, e.params = this.toAssignableList(t, !0), this.parseFunctionBody(e, !0, !1), this.yieldPos = i, this.awaitPos = n, this.awaitIdentPos = r, this.finishNode(e, "ArrowFunctionExpression");
}, Ra.parseFunctionBody = function (e, t, s) {
  var i = t && this.type !== ea.braceL,
      n = this.strict,
      r = !1;
  if (i) e.body = this.parseMaybeAssign(), e.expression = !0, this.checkParams(e, !1);else {
    var a = this.options.ecmaVersion >= 7 && !this.isSimpleParamList(e.params);
    n && !a || (r = this.strictDirective(this.end)) && a && this.raiseRecoverable(e.start, "Illegal 'use strict' directive in function with non-simple parameter list");
    var o = this.labels;
    this.labels = [], r && (this.strict = !0), this.checkParams(e, !n && !r && !t && !s && this.isSimpleParamList(e.params)), this.strict && e.id && this.checkLValSimple(e.id, 5), e.body = this.parseBlock(!1, void 0, r && !n), e.expression = !1, this.adaptDirectivePrologue(e.body.body), this.labels = o;
  }
  this.exitScope();
}, Ra.isSimpleParamList = function (e) {
  for (var t = 0, s = e; t < s.length; t += 1) {
    if ("Identifier" !== s[t].type) return !1;
  }

  return !0;
}, Ra.checkParams = function (e, t) {
  for (var s = Object.create(null), i = 0, n = e.params; i < n.length; i += 1) {
    var r = n[i];
    this.checkLValInnerPattern(r, 1, t ? null : s);
  }
}, Ra.parseExprList = function (e, t, s, i) {
  for (var n = [], r = !0; !this.eat(e);) {
    if (r) r = !1;else if (this.expect(ea.comma), t && this.afterTrailingComma(e)) break;
    var a = void 0;
    s && this.type === ea.comma ? a = null : this.type === ea.ellipsis ? (a = this.parseSpread(i), i && this.type === ea.comma && i.trailingComma < 0 && (i.trailingComma = this.start)) : a = this.parseMaybeAssign(!1, i), n.push(a);
  }

  return n;
}, Ra.checkUnreserved = function (e) {
  var t = e.start,
      s = e.end,
      i = e.name;
  (this.inGenerator && "yield" === i && this.raiseRecoverable(t, "Cannot use 'yield' as identifier inside a generator"), this.inAsync && "await" === i && this.raiseRecoverable(t, "Cannot use 'await' as identifier inside an async function"), this.currentThisScope().inClassFieldInit && "arguments" === i && this.raiseRecoverable(t, "Cannot use 'arguments' in class field initializer"), this.keywords.test(i) && this.raise(t, "Unexpected keyword '" + i + "'"), this.options.ecmaVersion < 6 && -1 !== this.input.slice(t, s).indexOf("\\")) || (this.strict ? this.reservedWordsStrict : this.reservedWords).test(i) && (this.inAsync || "await" !== i || this.raiseRecoverable(t, "Cannot use keyword 'await' outside an async function"), this.raiseRecoverable(t, "The keyword '" + i + "' is reserved"));
}, Ra.parseIdent = function (e, t) {
  var s = this.startNode();
  return this.type === ea.name ? s.name = this.value : this.type.keyword ? (s.name = this.type.keyword, "class" !== s.name && "function" !== s.name || this.lastTokEnd === this.lastTokStart + 1 && 46 === this.input.charCodeAt(this.lastTokStart) || this.context.pop()) : this.unexpected(), this.next(!!e), this.finishNode(s, "Identifier"), e || (this.checkUnreserved(s), "await" !== s.name || this.awaitIdentPos || (this.awaitIdentPos = s.start)), s;
}, Ra.parsePrivateIdent = function () {
  var e = this.startNode();
  return this.type === ea.privateId ? e.name = this.value : this.unexpected(), this.next(), this.finishNode(e, "PrivateIdentifier"), 0 === this.privateNameStack.length ? this.raise(e.start, "Private field '#" + e.name + "' must be declared in an enclosing class") : this.privateNameStack[this.privateNameStack.length - 1].used.push(e), e;
}, Ra.parseYield = function (e) {
  this.yieldPos || (this.yieldPos = this.start);
  var t = this.startNode();
  return this.next(), this.type === ea.semi || this.canInsertSemicolon() || this.type !== ea.star && !this.type.startsExpr ? (t.delegate = !1, t.argument = null) : (t.delegate = this.eat(ea.star), t.argument = this.parseMaybeAssign(e)), this.finishNode(t, "YieldExpression");
}, Ra.parseAwait = function () {
  this.awaitPos || (this.awaitPos = this.start);
  var e = this.startNode();
  return this.next(), e.argument = this.parseMaybeUnary(null, !0), this.finishNode(e, "AwaitExpression");
};
var La = xa.prototype;
La.raise = function (e, t) {
  var s = fa(this.input, e);
  t += " (" + s.line + ":" + s.column + ")";
  var i = new SyntaxError(t);
  throw i.pos = e, i.loc = s, i.raisedAt = this.pos, i;
}, La.raiseRecoverable = La.raise, La.curPosition = function () {
  if (this.options.locations) return new da(this.curLine, this.pos - this.lineStart);
};

var Da = xa.prototype,
    Va = function (e) {
  this.flags = e, this.var = [], this.lexical = [], this.functions = [], this.inClassFieldInit = !1;
};

Da.enterScope = function (e) {
  this.scopeStack.push(new Va(e));
}, Da.exitScope = function () {
  this.scopeStack.pop();
}, Da.treatFunctionsAsVarInScope = function (e) {
  return 2 & e.flags || !this.inModule && 1 & e.flags;
}, Da.declareName = function (e, t, s) {
  var i = !1;

  if (2 === t) {
    var n = this.currentScope();
    i = n.lexical.indexOf(e) > -1 || n.functions.indexOf(e) > -1 || n.var.indexOf(e) > -1, n.lexical.push(e), this.inModule && 1 & n.flags && delete this.undefinedExports[e];
  } else if (4 === t) {
    this.currentScope().lexical.push(e);
  } else if (3 === t) {
    var r = this.currentScope();
    i = this.treatFunctionsAsVar ? r.lexical.indexOf(e) > -1 : r.lexical.indexOf(e) > -1 || r.var.indexOf(e) > -1, r.functions.push(e);
  } else for (var a = this.scopeStack.length - 1; a >= 0; --a) {
    var o = this.scopeStack[a];

    if (o.lexical.indexOf(e) > -1 && !(32 & o.flags && o.lexical[0] === e) || !this.treatFunctionsAsVarInScope(o) && o.functions.indexOf(e) > -1) {
      i = !0;
      break;
    }

    if (o.var.push(e), this.inModule && 1 & o.flags && delete this.undefinedExports[e], 3 & o.flags) break;
  }

  i && this.raiseRecoverable(s, "Identifier '" + e + "' has already been declared");
}, Da.checkLocalExport = function (e) {
  -1 === this.scopeStack[0].lexical.indexOf(e.name) && -1 === this.scopeStack[0].var.indexOf(e.name) && (this.undefinedExports[e.name] = e);
}, Da.currentScope = function () {
  return this.scopeStack[this.scopeStack.length - 1];
}, Da.currentVarScope = function () {
  for (var e = this.scopeStack.length - 1;; e--) {
    var t = this.scopeStack[e];
    if (3 & t.flags) return t;
  }
}, Da.currentThisScope = function () {
  for (var e = this.scopeStack.length - 1;; e--) {
    var t = this.scopeStack[e];
    if (3 & t.flags && !(16 & t.flags)) return t;
  }
};

var Ba = function (e, t, s) {
  this.type = "", this.start = t, this.end = 0, e.options.locations && (this.loc = new pa(e, s)), e.options.directSourceFile && (this.sourceFile = e.options.directSourceFile), e.options.ranges && (this.range = [t, 0]);
},
    Fa = xa.prototype;

function za(e, t, s, i) {
  return e.type = t, e.end = s, this.options.locations && (e.loc.end = i), this.options.ranges && (e.range[1] = s), e;
}

Fa.startNode = function () {
  return new Ba(this, this.start, this.startLoc);
}, Fa.startNodeAt = function (e, t) {
  return new Ba(this, e, t);
}, Fa.finishNode = function (e, t) {
  return za.call(this, e, t, this.lastTokEnd, this.lastTokEndLoc);
}, Fa.finishNodeAt = function (e, t, s, i) {
  return za.call(this, e, t, s, i);
}, Fa.copyNode = function (e) {
  var t = new Ba(this, e.start, this.startLoc);

  for (var s in e) t[s] = e[s];

  return t;
};

var Wa = function (e, t, s, i, n) {
  this.token = e, this.isExpr = !!t, this.preserveSpace = !!s, this.override = i, this.generator = !!n;
},
    ja = {
  b_stat: new Wa("{", !1),
  b_expr: new Wa("{", !0),
  b_tmpl: new Wa("${", !1),
  p_stat: new Wa("(", !1),
  p_expr: new Wa("(", !0),
  q_tmpl: new Wa("`", !0, !0, function (e) {
    return e.tryReadTemplateToken();
  }),
  f_stat: new Wa("function", !1),
  f_expr: new Wa("function", !0),
  f_expr_gen: new Wa("function", !0, !1, null, !0),
  f_gen: new Wa("function", !1, !1, null, !0)
},
    Ua = xa.prototype;

Ua.initialContext = function () {
  return [ja.b_stat];
}, Ua.braceIsBlock = function (e) {
  var t = this.curContext();
  return t === ja.f_expr || t === ja.f_stat || (e !== ea.colon || t !== ja.b_stat && t !== ja.b_expr ? e === ea._return || e === ea.name && this.exprAllowed ? ta.test(this.input.slice(this.lastTokEnd, this.start)) : e === ea._else || e === ea.semi || e === ea.eof || e === ea.parenR || e === ea.arrow || (e === ea.braceL ? t === ja.b_stat : e !== ea._var && e !== ea._const && e !== ea.name && !this.exprAllowed) : !t.isExpr);
}, Ua.inGeneratorContext = function () {
  for (var e = this.context.length - 1; e >= 1; e--) {
    var t = this.context[e];
    if ("function" === t.token) return t.generator;
  }

  return !1;
}, Ua.updateContext = function (e) {
  var t,
      s = this.type;
  s.keyword && e === ea.dot ? this.exprAllowed = !1 : (t = s.updateContext) ? t.call(this, e) : this.exprAllowed = s.beforeExpr;
}, ea.parenR.updateContext = ea.braceR.updateContext = function () {
  if (1 !== this.context.length) {
    var e = this.context.pop();
    e === ja.b_stat && "function" === this.curContext().token && (e = this.context.pop()), this.exprAllowed = !e.isExpr;
  } else this.exprAllowed = !0;
}, ea.braceL.updateContext = function (e) {
  this.context.push(this.braceIsBlock(e) ? ja.b_stat : ja.b_expr), this.exprAllowed = !0;
}, ea.dollarBraceL.updateContext = function () {
  this.context.push(ja.b_tmpl), this.exprAllowed = !0;
}, ea.parenL.updateContext = function (e) {
  var t = e === ea._if || e === ea._for || e === ea._with || e === ea._while;
  this.context.push(t ? ja.p_stat : ja.p_expr), this.exprAllowed = !0;
}, ea.incDec.updateContext = function () {}, ea._function.updateContext = ea._class.updateContext = function (e) {
  !e.beforeExpr || e === ea._else || e === ea.semi && this.curContext() !== ja.p_stat || e === ea._return && ta.test(this.input.slice(this.lastTokEnd, this.start)) || (e === ea.colon || e === ea.braceL) && this.curContext() === ja.b_stat ? this.context.push(ja.f_stat) : this.context.push(ja.f_expr), this.exprAllowed = !1;
}, ea.backQuote.updateContext = function () {
  this.curContext() === ja.q_tmpl ? this.context.pop() : this.context.push(ja.q_tmpl), this.exprAllowed = !1;
}, ea.star.updateContext = function (e) {
  if (e === ea._function) {
    var t = this.context.length - 1;
    this.context[t] === ja.f_expr ? this.context[t] = ja.f_expr_gen : this.context[t] = ja.f_gen;
  }

  this.exprAllowed = !0;
}, ea.name.updateContext = function (e) {
  var t = !1;
  this.options.ecmaVersion >= 6 && e !== ea.dot && ("of" === this.value && !this.exprAllowed || "yield" === this.value && this.inGeneratorContext()) && (t = !0), this.exprAllowed = t;
};
var Ga = "ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS",
    Ha = Ga + " Extended_Pictographic",
    qa = {
  9: Ga,
  10: Ha,
  11: Ha,
  12: "ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS Extended_Pictographic EBase EComp EMod EPres ExtPict"
},
    Ka = "Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu",
    Xa = "Adlam Adlm Ahom Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb",
    Ya = Xa + " Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd",
    Qa = Ya + " Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho",
    Za = {
  9: Xa,
  10: Ya,
  11: Qa,
  12: "Adlam Adlm Ahom Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho Chorasmian Chrs Diak Dives_Akuru Khitan_Small_Script Kits Yezi Yezidi"
},
    Ja = {};

function eo(e) {
  var t = Ja[e] = {
    binary: ua(qa[e] + " " + Ka),
    nonBinary: {
      General_Category: ua(Ka),
      Script: ua(Za[e])
    }
  };
  t.nonBinary.Script_Extensions = t.nonBinary.Script, t.nonBinary.gc = t.nonBinary.General_Category, t.nonBinary.sc = t.nonBinary.Script, t.nonBinary.scx = t.nonBinary.Script_Extensions;
}

eo(9), eo(10), eo(11), eo(12);

var to = xa.prototype,
    so = function (e) {
  this.parser = e, this.validFlags = "gim" + (e.options.ecmaVersion >= 6 ? "uy" : "") + (e.options.ecmaVersion >= 9 ? "s" : "") + (e.options.ecmaVersion >= 13 ? "d" : ""), this.unicodeProperties = Ja[e.options.ecmaVersion >= 12 ? 12 : e.options.ecmaVersion], this.source = "", this.flags = "", this.start = 0, this.switchU = !1, this.switchN = !1, this.pos = 0, this.lastIntValue = 0, this.lastStringValue = "", this.lastAssertionIsQuantifiable = !1, this.numCapturingParens = 0, this.maxBackReference = 0, this.groupNames = [], this.backReferenceNames = [];
};

function io(e) {
  return e <= 65535 ? String.fromCharCode(e) : (e -= 65536, String.fromCharCode(55296 + (e >> 10), 56320 + (1023 & e)));
}

function no(e) {
  return 36 === e || e >= 40 && e <= 43 || 46 === e || 63 === e || e >= 91 && e <= 94 || e >= 123 && e <= 125;
}

function ro(e) {
  return e >= 65 && e <= 90 || e >= 97 && e <= 122;
}

function ao(e) {
  return ro(e) || 95 === e;
}

function oo(e) {
  return ao(e) || ho(e);
}

function ho(e) {
  return e >= 48 && e <= 57;
}

function lo(e) {
  return e >= 48 && e <= 57 || e >= 65 && e <= 70 || e >= 97 && e <= 102;
}

function co(e) {
  return e >= 65 && e <= 70 ? e - 65 + 10 : e >= 97 && e <= 102 ? e - 97 + 10 : e - 48;
}

function uo(e) {
  return e >= 48 && e <= 55;
}

so.prototype.reset = function (e, t, s) {
  var i = -1 !== s.indexOf("u");
  this.start = 0 | e, this.source = t + "", this.flags = s, this.switchU = i && this.parser.options.ecmaVersion >= 6, this.switchN = i && this.parser.options.ecmaVersion >= 9;
}, so.prototype.raise = function (e) {
  this.parser.raiseRecoverable(this.start, "Invalid regular expression: /" + this.source + "/: " + e);
}, so.prototype.at = function (e, t) {
  void 0 === t && (t = !1);
  var s = this.source,
      i = s.length;
  if (e >= i) return -1;
  var n = s.charCodeAt(e);
  if (!t && !this.switchU || n <= 55295 || n >= 57344 || e + 1 >= i) return n;
  var r = s.charCodeAt(e + 1);
  return r >= 56320 && r <= 57343 ? (n << 10) + r - 56613888 : n;
}, so.prototype.nextIndex = function (e, t) {
  void 0 === t && (t = !1);
  var s = this.source,
      i = s.length;
  if (e >= i) return i;
  var n,
      r = s.charCodeAt(e);
  return !t && !this.switchU || r <= 55295 || r >= 57344 || e + 1 >= i || (n = s.charCodeAt(e + 1)) < 56320 || n > 57343 ? e + 1 : e + 2;
}, so.prototype.current = function (e) {
  return void 0 === e && (e = !1), this.at(this.pos, e);
}, so.prototype.lookahead = function (e) {
  return void 0 === e && (e = !1), this.at(this.nextIndex(this.pos, e), e);
}, so.prototype.advance = function (e) {
  void 0 === e && (e = !1), this.pos = this.nextIndex(this.pos, e);
}, so.prototype.eat = function (e, t) {
  return void 0 === t && (t = !1), this.current(t) === e && (this.advance(t), !0);
}, to.validateRegExpFlags = function (e) {
  for (var t = e.validFlags, s = e.flags, i = 0; i < s.length; i++) {
    var n = s.charAt(i);
    -1 === t.indexOf(n) && this.raise(e.start, "Invalid regular expression flag"), s.indexOf(n, i + 1) > -1 && this.raise(e.start, "Duplicate regular expression flag");
  }
}, to.validateRegExpPattern = function (e) {
  this.regexp_pattern(e), !e.switchN && this.options.ecmaVersion >= 9 && e.groupNames.length > 0 && (e.switchN = !0, this.regexp_pattern(e));
}, to.regexp_pattern = function (e) {
  e.pos = 0, e.lastIntValue = 0, e.lastStringValue = "", e.lastAssertionIsQuantifiable = !1, e.numCapturingParens = 0, e.maxBackReference = 0, e.groupNames.length = 0, e.backReferenceNames.length = 0, this.regexp_disjunction(e), e.pos !== e.source.length && (e.eat(41) && e.raise("Unmatched ')'"), (e.eat(93) || e.eat(125)) && e.raise("Lone quantifier brackets")), e.maxBackReference > e.numCapturingParens && e.raise("Invalid escape");

  for (var t = 0, s = e.backReferenceNames; t < s.length; t += 1) {
    var i = s[t];
    -1 === e.groupNames.indexOf(i) && e.raise("Invalid named capture referenced");
  }
}, to.regexp_disjunction = function (e) {
  for (this.regexp_alternative(e); e.eat(124);) this.regexp_alternative(e);

  this.regexp_eatQuantifier(e, !0) && e.raise("Nothing to repeat"), e.eat(123) && e.raise("Lone quantifier brackets");
}, to.regexp_alternative = function (e) {
  for (; e.pos < e.source.length && this.regexp_eatTerm(e););
}, to.regexp_eatTerm = function (e) {
  return this.regexp_eatAssertion(e) ? (e.lastAssertionIsQuantifiable && this.regexp_eatQuantifier(e) && e.switchU && e.raise("Invalid quantifier"), !0) : !!(e.switchU ? this.regexp_eatAtom(e) : this.regexp_eatExtendedAtom(e)) && (this.regexp_eatQuantifier(e), !0);
}, to.regexp_eatAssertion = function (e) {
  var t = e.pos;
  if (e.lastAssertionIsQuantifiable = !1, e.eat(94) || e.eat(36)) return !0;

  if (e.eat(92)) {
    if (e.eat(66) || e.eat(98)) return !0;
    e.pos = t;
  }

  if (e.eat(40) && e.eat(63)) {
    var s = !1;
    if (this.options.ecmaVersion >= 9 && (s = e.eat(60)), e.eat(61) || e.eat(33)) return this.regexp_disjunction(e), e.eat(41) || e.raise("Unterminated group"), e.lastAssertionIsQuantifiable = !s, !0;
  }

  return e.pos = t, !1;
}, to.regexp_eatQuantifier = function (e, t) {
  return void 0 === t && (t = !1), !!this.regexp_eatQuantifierPrefix(e, t) && (e.eat(63), !0);
}, to.regexp_eatQuantifierPrefix = function (e, t) {
  return e.eat(42) || e.eat(43) || e.eat(63) || this.regexp_eatBracedQuantifier(e, t);
}, to.regexp_eatBracedQuantifier = function (e, t) {
  var s = e.pos;

  if (e.eat(123)) {
    var i = 0,
        n = -1;
    if (this.regexp_eatDecimalDigits(e) && (i = e.lastIntValue, e.eat(44) && this.regexp_eatDecimalDigits(e) && (n = e.lastIntValue), e.eat(125))) return -1 !== n && n < i && !t && e.raise("numbers out of order in {} quantifier"), !0;
    e.switchU && !t && e.raise("Incomplete quantifier"), e.pos = s;
  }

  return !1;
}, to.regexp_eatAtom = function (e) {
  return this.regexp_eatPatternCharacters(e) || e.eat(46) || this.regexp_eatReverseSolidusAtomEscape(e) || this.regexp_eatCharacterClass(e) || this.regexp_eatUncapturingGroup(e) || this.regexp_eatCapturingGroup(e);
}, to.regexp_eatReverseSolidusAtomEscape = function (e) {
  var t = e.pos;

  if (e.eat(92)) {
    if (this.regexp_eatAtomEscape(e)) return !0;
    e.pos = t;
  }

  return !1;
}, to.regexp_eatUncapturingGroup = function (e) {
  var t = e.pos;

  if (e.eat(40)) {
    if (e.eat(63) && e.eat(58)) {
      if (this.regexp_disjunction(e), e.eat(41)) return !0;
      e.raise("Unterminated group");
    }

    e.pos = t;
  }

  return !1;
}, to.regexp_eatCapturingGroup = function (e) {
  if (e.eat(40)) {
    if (this.options.ecmaVersion >= 9 ? this.regexp_groupSpecifier(e) : 63 === e.current() && e.raise("Invalid group"), this.regexp_disjunction(e), e.eat(41)) return e.numCapturingParens += 1, !0;
    e.raise("Unterminated group");
  }

  return !1;
}, to.regexp_eatExtendedAtom = function (e) {
  return e.eat(46) || this.regexp_eatReverseSolidusAtomEscape(e) || this.regexp_eatCharacterClass(e) || this.regexp_eatUncapturingGroup(e) || this.regexp_eatCapturingGroup(e) || this.regexp_eatInvalidBracedQuantifier(e) || this.regexp_eatExtendedPatternCharacter(e);
}, to.regexp_eatInvalidBracedQuantifier = function (e) {
  return this.regexp_eatBracedQuantifier(e, !0) && e.raise("Nothing to repeat"), !1;
}, to.regexp_eatSyntaxCharacter = function (e) {
  var t = e.current();
  return !!no(t) && (e.lastIntValue = t, e.advance(), !0);
}, to.regexp_eatPatternCharacters = function (e) {
  for (var t = e.pos, s = 0; -1 !== (s = e.current()) && !no(s);) e.advance();

  return e.pos !== t;
}, to.regexp_eatExtendedPatternCharacter = function (e) {
  var t = e.current();
  return !(-1 === t || 36 === t || t >= 40 && t <= 43 || 46 === t || 63 === t || 91 === t || 94 === t || 124 === t) && (e.advance(), !0);
}, to.regexp_groupSpecifier = function (e) {
  if (e.eat(63)) {
    if (this.regexp_eatGroupName(e)) return -1 !== e.groupNames.indexOf(e.lastStringValue) && e.raise("Duplicate capture group name"), void e.groupNames.push(e.lastStringValue);
    e.raise("Invalid group");
  }
}, to.regexp_eatGroupName = function (e) {
  if (e.lastStringValue = "", e.eat(60)) {
    if (this.regexp_eatRegExpIdentifierName(e) && e.eat(62)) return !0;
    e.raise("Invalid capture group name");
  }

  return !1;
}, to.regexp_eatRegExpIdentifierName = function (e) {
  if (e.lastStringValue = "", this.regexp_eatRegExpIdentifierStart(e)) {
    for (e.lastStringValue += io(e.lastIntValue); this.regexp_eatRegExpIdentifierPart(e);) e.lastStringValue += io(e.lastIntValue);

    return !0;
  }

  return !1;
}, to.regexp_eatRegExpIdentifierStart = function (e) {
  var t = e.pos,
      s = this.options.ecmaVersion >= 11,
      i = e.current(s);
  return e.advance(s), 92 === i && this.regexp_eatRegExpUnicodeEscapeSequence(e, s) && (i = e.lastIntValue), function (e) {
    return Hr(e, !0) || 36 === e || 95 === e;
  }(i) ? (e.lastIntValue = i, !0) : (e.pos = t, !1);
}, to.regexp_eatRegExpIdentifierPart = function (e) {
  var t = e.pos,
      s = this.options.ecmaVersion >= 11,
      i = e.current(s);
  return e.advance(s), 92 === i && this.regexp_eatRegExpUnicodeEscapeSequence(e, s) && (i = e.lastIntValue), function (e) {
    return qr(e, !0) || 36 === e || 95 === e || 8204 === e || 8205 === e;
  }(i) ? (e.lastIntValue = i, !0) : (e.pos = t, !1);
}, to.regexp_eatAtomEscape = function (e) {
  return !!(this.regexp_eatBackReference(e) || this.regexp_eatCharacterClassEscape(e) || this.regexp_eatCharacterEscape(e) || e.switchN && this.regexp_eatKGroupName(e)) || (e.switchU && (99 === e.current() && e.raise("Invalid unicode escape"), e.raise("Invalid escape")), !1);
}, to.regexp_eatBackReference = function (e) {
  var t = e.pos;

  if (this.regexp_eatDecimalEscape(e)) {
    var s = e.lastIntValue;
    if (e.switchU) return s > e.maxBackReference && (e.maxBackReference = s), !0;
    if (s <= e.numCapturingParens) return !0;
    e.pos = t;
  }

  return !1;
}, to.regexp_eatKGroupName = function (e) {
  if (e.eat(107)) {
    if (this.regexp_eatGroupName(e)) return e.backReferenceNames.push(e.lastStringValue), !0;
    e.raise("Invalid named reference");
  }

  return !1;
}, to.regexp_eatCharacterEscape = function (e) {
  return this.regexp_eatControlEscape(e) || this.regexp_eatCControlLetter(e) || this.regexp_eatZero(e) || this.regexp_eatHexEscapeSequence(e) || this.regexp_eatRegExpUnicodeEscapeSequence(e, !1) || !e.switchU && this.regexp_eatLegacyOctalEscapeSequence(e) || this.regexp_eatIdentityEscape(e);
}, to.regexp_eatCControlLetter = function (e) {
  var t = e.pos;

  if (e.eat(99)) {
    if (this.regexp_eatControlLetter(e)) return !0;
    e.pos = t;
  }

  return !1;
}, to.regexp_eatZero = function (e) {
  return 48 === e.current() && !ho(e.lookahead()) && (e.lastIntValue = 0, e.advance(), !0);
}, to.regexp_eatControlEscape = function (e) {
  var t = e.current();
  return 116 === t ? (e.lastIntValue = 9, e.advance(), !0) : 110 === t ? (e.lastIntValue = 10, e.advance(), !0) : 118 === t ? (e.lastIntValue = 11, e.advance(), !0) : 102 === t ? (e.lastIntValue = 12, e.advance(), !0) : 114 === t && (e.lastIntValue = 13, e.advance(), !0);
}, to.regexp_eatControlLetter = function (e) {
  var t = e.current();
  return !!ro(t) && (e.lastIntValue = t % 32, e.advance(), !0);
}, to.regexp_eatRegExpUnicodeEscapeSequence = function (e, t) {
  void 0 === t && (t = !1);
  var s,
      i = e.pos,
      n = t || e.switchU;

  if (e.eat(117)) {
    if (this.regexp_eatFixedHexDigits(e, 4)) {
      var r = e.lastIntValue;

      if (n && r >= 55296 && r <= 56319) {
        var a = e.pos;

        if (e.eat(92) && e.eat(117) && this.regexp_eatFixedHexDigits(e, 4)) {
          var o = e.lastIntValue;
          if (o >= 56320 && o <= 57343) return e.lastIntValue = 1024 * (r - 55296) + (o - 56320) + 65536, !0;
        }

        e.pos = a, e.lastIntValue = r;
      }

      return !0;
    }

    if (n && e.eat(123) && this.regexp_eatHexDigits(e) && e.eat(125) && (s = e.lastIntValue) >= 0 && s <= 1114111) return !0;
    n && e.raise("Invalid unicode escape"), e.pos = i;
  }

  return !1;
}, to.regexp_eatIdentityEscape = function (e) {
  if (e.switchU) return !!this.regexp_eatSyntaxCharacter(e) || !!e.eat(47) && (e.lastIntValue = 47, !0);
  var t = e.current();
  return !(99 === t || e.switchN && 107 === t) && (e.lastIntValue = t, e.advance(), !0);
}, to.regexp_eatDecimalEscape = function (e) {
  e.lastIntValue = 0;
  var t = e.current();

  if (t >= 49 && t <= 57) {
    do {
      e.lastIntValue = 10 * e.lastIntValue + (t - 48), e.advance();
    } while ((t = e.current()) >= 48 && t <= 57);

    return !0;
  }

  return !1;
}, to.regexp_eatCharacterClassEscape = function (e) {
  var t = e.current();
  if (function (e) {
    return 100 === e || 68 === e || 115 === e || 83 === e || 119 === e || 87 === e;
  }(t)) return e.lastIntValue = -1, e.advance(), !0;

  if (e.switchU && this.options.ecmaVersion >= 9 && (80 === t || 112 === t)) {
    if (e.lastIntValue = -1, e.advance(), e.eat(123) && this.regexp_eatUnicodePropertyValueExpression(e) && e.eat(125)) return !0;
    e.raise("Invalid property name");
  }

  return !1;
}, to.regexp_eatUnicodePropertyValueExpression = function (e) {
  var t = e.pos;

  if (this.regexp_eatUnicodePropertyName(e) && e.eat(61)) {
    var s = e.lastStringValue;

    if (this.regexp_eatUnicodePropertyValue(e)) {
      var i = e.lastStringValue;
      return this.regexp_validateUnicodePropertyNameAndValue(e, s, i), !0;
    }
  }

  if (e.pos = t, this.regexp_eatLoneUnicodePropertyNameOrValue(e)) {
    var n = e.lastStringValue;
    return this.regexp_validateUnicodePropertyNameOrValue(e, n), !0;
  }

  return !1;
}, to.regexp_validateUnicodePropertyNameAndValue = function (e, t, s) {
  la(e.unicodeProperties.nonBinary, t) || e.raise("Invalid property name"), e.unicodeProperties.nonBinary[t].test(s) || e.raise("Invalid property value");
}, to.regexp_validateUnicodePropertyNameOrValue = function (e, t) {
  e.unicodeProperties.binary.test(t) || e.raise("Invalid property name");
}, to.regexp_eatUnicodePropertyName = function (e) {
  var t = 0;

  for (e.lastStringValue = ""; ao(t = e.current());) e.lastStringValue += io(t), e.advance();

  return "" !== e.lastStringValue;
}, to.regexp_eatUnicodePropertyValue = function (e) {
  var t = 0;

  for (e.lastStringValue = ""; oo(t = e.current());) e.lastStringValue += io(t), e.advance();

  return "" !== e.lastStringValue;
}, to.regexp_eatLoneUnicodePropertyNameOrValue = function (e) {
  return this.regexp_eatUnicodePropertyValue(e);
}, to.regexp_eatCharacterClass = function (e) {
  if (e.eat(91)) {
    if (e.eat(94), this.regexp_classRanges(e), e.eat(93)) return !0;
    e.raise("Unterminated character class");
  }

  return !1;
}, to.regexp_classRanges = function (e) {
  for (; this.regexp_eatClassAtom(e);) {
    var t = e.lastIntValue;

    if (e.eat(45) && this.regexp_eatClassAtom(e)) {
      var s = e.lastIntValue;
      !e.switchU || -1 !== t && -1 !== s || e.raise("Invalid character class"), -1 !== t && -1 !== s && t > s && e.raise("Range out of order in character class");
    }
  }
}, to.regexp_eatClassAtom = function (e) {
  var t = e.pos;

  if (e.eat(92)) {
    if (this.regexp_eatClassEscape(e)) return !0;

    if (e.switchU) {
      var s = e.current();
      (99 === s || uo(s)) && e.raise("Invalid class escape"), e.raise("Invalid escape");
    }

    e.pos = t;
  }

  var i = e.current();
  return 93 !== i && (e.lastIntValue = i, e.advance(), !0);
}, to.regexp_eatClassEscape = function (e) {
  var t = e.pos;
  if (e.eat(98)) return e.lastIntValue = 8, !0;
  if (e.switchU && e.eat(45)) return e.lastIntValue = 45, !0;

  if (!e.switchU && e.eat(99)) {
    if (this.regexp_eatClassControlLetter(e)) return !0;
    e.pos = t;
  }

  return this.regexp_eatCharacterClassEscape(e) || this.regexp_eatCharacterEscape(e);
}, to.regexp_eatClassControlLetter = function (e) {
  var t = e.current();
  return !(!ho(t) && 95 !== t) && (e.lastIntValue = t % 32, e.advance(), !0);
}, to.regexp_eatHexEscapeSequence = function (e) {
  var t = e.pos;

  if (e.eat(120)) {
    if (this.regexp_eatFixedHexDigits(e, 2)) return !0;
    e.switchU && e.raise("Invalid escape"), e.pos = t;
  }

  return !1;
}, to.regexp_eatDecimalDigits = function (e) {
  var t = e.pos,
      s = 0;

  for (e.lastIntValue = 0; ho(s = e.current());) e.lastIntValue = 10 * e.lastIntValue + (s - 48), e.advance();

  return e.pos !== t;
}, to.regexp_eatHexDigits = function (e) {
  var t = e.pos,
      s = 0;

  for (e.lastIntValue = 0; lo(s = e.current());) e.lastIntValue = 16 * e.lastIntValue + co(s), e.advance();

  return e.pos !== t;
}, to.regexp_eatLegacyOctalEscapeSequence = function (e) {
  if (this.regexp_eatOctalDigit(e)) {
    var t = e.lastIntValue;

    if (this.regexp_eatOctalDigit(e)) {
      var s = e.lastIntValue;
      t <= 3 && this.regexp_eatOctalDigit(e) ? e.lastIntValue = 64 * t + 8 * s + e.lastIntValue : e.lastIntValue = 8 * t + s;
    } else e.lastIntValue = t;

    return !0;
  }

  return !1;
}, to.regexp_eatOctalDigit = function (e) {
  var t = e.current();
  return uo(t) ? (e.lastIntValue = t - 48, e.advance(), !0) : (e.lastIntValue = 0, !1);
}, to.regexp_eatFixedHexDigits = function (e, t) {
  var s = e.pos;
  e.lastIntValue = 0;

  for (var i = 0; i < t; ++i) {
    var n = e.current();
    if (!lo(n)) return e.pos = s, !1;
    e.lastIntValue = 16 * e.lastIntValue + co(n), e.advance();
  }

  return !0;
};

var po = function (e) {
  this.type = e.type, this.value = e.value, this.start = e.start, this.end = e.end, e.options.locations && (this.loc = new pa(e, e.startLoc, e.endLoc)), e.options.ranges && (this.range = [e.start, e.end]);
},
    fo = xa.prototype;

function mo(e) {
  return "function" != typeof BigInt ? null : BigInt(e.replace(/_/g, ""));
}

function go(e) {
  return e <= 65535 ? String.fromCharCode(e) : (e -= 65536, String.fromCharCode(55296 + (e >> 10), 56320 + (1023 & e)));
}

fo.next = function (e) {
  !e && this.type.keyword && this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword " + this.type.keyword), this.options.onToken && this.options.onToken(new po(this)), this.lastTokEnd = this.end, this.lastTokStart = this.start, this.lastTokEndLoc = this.endLoc, this.lastTokStartLoc = this.startLoc, this.nextToken();
}, fo.getToken = function () {
  return this.next(), new po(this);
}, "undefined" != typeof Symbol && (fo[Symbol.iterator] = function () {
  var e = this;
  return {
    next: function () {
      var t = e.getToken();
      return {
        done: t.type === ea.eof,
        value: t
      };
    }
  };
}), fo.curContext = function () {
  return this.context[this.context.length - 1];
}, fo.nextToken = function () {
  var e = this.curContext();
  return e && e.preserveSpace || this.skipSpace(), this.start = this.pos, this.options.locations && (this.startLoc = this.curPosition()), this.pos >= this.input.length ? this.finishToken(ea.eof) : e.override ? e.override(this) : void this.readToken(this.fullCharCodeAtPos());
}, fo.readToken = function (e) {
  return Hr(e, this.options.ecmaVersion >= 6) || 92 === e ? this.readWord() : this.getTokenFromCode(e);
}, fo.fullCharCodeAtPos = function () {
  var e = this.input.charCodeAt(this.pos);
  if (e <= 55295 || e >= 56320) return e;
  var t = this.input.charCodeAt(this.pos + 1);
  return t <= 56319 || t >= 57344 ? e : (e << 10) + t - 56613888;
}, fo.skipBlockComment = function () {
  var e,
      t = this.options.onComment && this.curPosition(),
      s = this.pos,
      i = this.input.indexOf("*/", this.pos += 2);
  if (-1 === i && this.raise(this.pos - 2, "Unterminated comment"), this.pos = i + 2, this.options.locations) for (sa.lastIndex = s; (e = sa.exec(this.input)) && e.index < this.pos;) ++this.curLine, this.lineStart = e.index + e[0].length;
  this.options.onComment && this.options.onComment(!0, this.input.slice(s + 2, i), s, this.pos, t, this.curPosition());
}, fo.skipLineComment = function (e) {
  for (var t = this.pos, s = this.options.onComment && this.curPosition(), i = this.input.charCodeAt(this.pos += e); this.pos < this.input.length && !ia(i);) i = this.input.charCodeAt(++this.pos);

  this.options.onComment && this.options.onComment(!1, this.input.slice(t + e, this.pos), t, this.pos, s, this.curPosition());
}, fo.skipSpace = function () {
  e: for (; this.pos < this.input.length;) {
    var e = this.input.charCodeAt(this.pos);

    switch (e) {
      case 32:
      case 160:
        ++this.pos;
        break;

      case 13:
        10 === this.input.charCodeAt(this.pos + 1) && ++this.pos;

      case 10:
      case 8232:
      case 8233:
        ++this.pos, this.options.locations && (++this.curLine, this.lineStart = this.pos);
        break;

      case 47:
        switch (this.input.charCodeAt(this.pos + 1)) {
          case 42:
            this.skipBlockComment();
            break;

          case 47:
            this.skipLineComment(2);
            break;

          default:
            break e;
        }

        break;

      default:
        if (!(e > 8 && e < 14 || e >= 5760 && na.test(String.fromCharCode(e)))) break e;
        ++this.pos;
    }
  }
}, fo.finishToken = function (e, t) {
  this.end = this.pos, this.options.locations && (this.endLoc = this.curPosition());
  var s = this.type;
  this.type = e, this.value = t, this.updateContext(s);
}, fo.readToken_dot = function () {
  var e = this.input.charCodeAt(this.pos + 1);
  if (e >= 48 && e <= 57) return this.readNumber(!0);
  var t = this.input.charCodeAt(this.pos + 2);
  return this.options.ecmaVersion >= 6 && 46 === e && 46 === t ? (this.pos += 3, this.finishToken(ea.ellipsis)) : (++this.pos, this.finishToken(ea.dot));
}, fo.readToken_slash = function () {
  var e = this.input.charCodeAt(this.pos + 1);
  return this.exprAllowed ? (++this.pos, this.readRegexp()) : 61 === e ? this.finishOp(ea.assign, 2) : this.finishOp(ea.slash, 1);
}, fo.readToken_mult_modulo_exp = function (e) {
  var t = this.input.charCodeAt(this.pos + 1),
      s = 1,
      i = 42 === e ? ea.star : ea.modulo;
  return this.options.ecmaVersion >= 7 && 42 === e && 42 === t && (++s, i = ea.starstar, t = this.input.charCodeAt(this.pos + 2)), 61 === t ? this.finishOp(ea.assign, s + 1) : this.finishOp(i, s);
}, fo.readToken_pipe_amp = function (e) {
  var t = this.input.charCodeAt(this.pos + 1);

  if (t === e) {
    if (this.options.ecmaVersion >= 12) if (61 === this.input.charCodeAt(this.pos + 2)) return this.finishOp(ea.assign, 3);
    return this.finishOp(124 === e ? ea.logicalOR : ea.logicalAND, 2);
  }

  return 61 === t ? this.finishOp(ea.assign, 2) : this.finishOp(124 === e ? ea.bitwiseOR : ea.bitwiseAND, 1);
}, fo.readToken_caret = function () {
  return 61 === this.input.charCodeAt(this.pos + 1) ? this.finishOp(ea.assign, 2) : this.finishOp(ea.bitwiseXOR, 1);
}, fo.readToken_plus_min = function (e) {
  var t = this.input.charCodeAt(this.pos + 1);
  return t === e ? 45 !== t || this.inModule || 62 !== this.input.charCodeAt(this.pos + 2) || 0 !== this.lastTokEnd && !ta.test(this.input.slice(this.lastTokEnd, this.pos)) ? this.finishOp(ea.incDec, 2) : (this.skipLineComment(3), this.skipSpace(), this.nextToken()) : 61 === t ? this.finishOp(ea.assign, 2) : this.finishOp(ea.plusMin, 1);
}, fo.readToken_lt_gt = function (e) {
  var t = this.input.charCodeAt(this.pos + 1),
      s = 1;
  return t === e ? (s = 62 === e && 62 === this.input.charCodeAt(this.pos + 2) ? 3 : 2, 61 === this.input.charCodeAt(this.pos + s) ? this.finishOp(ea.assign, s + 1) : this.finishOp(ea.bitShift, s)) : 33 !== t || 60 !== e || this.inModule || 45 !== this.input.charCodeAt(this.pos + 2) || 45 !== this.input.charCodeAt(this.pos + 3) ? (61 === t && (s = 2), this.finishOp(ea.relational, s)) : (this.skipLineComment(4), this.skipSpace(), this.nextToken());
}, fo.readToken_eq_excl = function (e) {
  var t = this.input.charCodeAt(this.pos + 1);
  return 61 === t ? this.finishOp(ea.equality, 61 === this.input.charCodeAt(this.pos + 2) ? 3 : 2) : 61 === e && 62 === t && this.options.ecmaVersion >= 6 ? (this.pos += 2, this.finishToken(ea.arrow)) : this.finishOp(61 === e ? ea.eq : ea.prefix, 1);
}, fo.readToken_question = function () {
  var e = this.options.ecmaVersion;

  if (e >= 11) {
    var t = this.input.charCodeAt(this.pos + 1);

    if (46 === t) {
      var s = this.input.charCodeAt(this.pos + 2);
      if (s < 48 || s > 57) return this.finishOp(ea.questionDot, 2);
    }

    if (63 === t) {
      if (e >= 12) if (61 === this.input.charCodeAt(this.pos + 2)) return this.finishOp(ea.assign, 3);
      return this.finishOp(ea.coalesce, 2);
    }
  }

  return this.finishOp(ea.question, 1);
}, fo.readToken_numberSign = function () {
  var e = 35;
  if (this.options.ecmaVersion >= 13 && (++this.pos, Hr(e = this.fullCharCodeAtPos(), !0) || 92 === e)) return this.finishToken(ea.privateId, this.readWord1());
  this.raise(this.pos, "Unexpected character '" + go(e) + "'");
}, fo.getTokenFromCode = function (e) {
  switch (e) {
    case 46:
      return this.readToken_dot();

    case 40:
      return ++this.pos, this.finishToken(ea.parenL);

    case 41:
      return ++this.pos, this.finishToken(ea.parenR);

    case 59:
      return ++this.pos, this.finishToken(ea.semi);

    case 44:
      return ++this.pos, this.finishToken(ea.comma);

    case 91:
      return ++this.pos, this.finishToken(ea.bracketL);

    case 93:
      return ++this.pos, this.finishToken(ea.bracketR);

    case 123:
      return ++this.pos, this.finishToken(ea.braceL);

    case 125:
      return ++this.pos, this.finishToken(ea.braceR);

    case 58:
      return ++this.pos, this.finishToken(ea.colon);

    case 96:
      if (this.options.ecmaVersion < 6) break;
      return ++this.pos, this.finishToken(ea.backQuote);

    case 48:
      var t = this.input.charCodeAt(this.pos + 1);
      if (120 === t || 88 === t) return this.readRadixNumber(16);

      if (this.options.ecmaVersion >= 6) {
        if (111 === t || 79 === t) return this.readRadixNumber(8);
        if (98 === t || 66 === t) return this.readRadixNumber(2);
      }

    case 49:
    case 50:
    case 51:
    case 52:
    case 53:
    case 54:
    case 55:
    case 56:
    case 57:
      return this.readNumber(!1);

    case 34:
    case 39:
      return this.readString(e);

    case 47:
      return this.readToken_slash();

    case 37:
    case 42:
      return this.readToken_mult_modulo_exp(e);

    case 124:
    case 38:
      return this.readToken_pipe_amp(e);

    case 94:
      return this.readToken_caret();

    case 43:
    case 45:
      return this.readToken_plus_min(e);

    case 60:
    case 62:
      return this.readToken_lt_gt(e);

    case 61:
    case 33:
      return this.readToken_eq_excl(e);

    case 63:
      return this.readToken_question();

    case 126:
      return this.finishOp(ea.prefix, 1);

    case 35:
      return this.readToken_numberSign();
  }

  this.raise(this.pos, "Unexpected character '" + go(e) + "'");
}, fo.finishOp = function (e, t) {
  var s = this.input.slice(this.pos, this.pos + t);
  return this.pos += t, this.finishToken(e, s);
}, fo.readRegexp = function () {
  for (var e, t, s = this.pos;;) {
    this.pos >= this.input.length && this.raise(s, "Unterminated regular expression");
    var i = this.input.charAt(this.pos);
    if (ta.test(i) && this.raise(s, "Unterminated regular expression"), e) e = !1;else {
      if ("[" === i) t = !0;else if ("]" === i && t) t = !1;else if ("/" === i && !t) break;
      e = "\\" === i;
    }
    ++this.pos;
  }

  var n = this.input.slice(s, this.pos);
  ++this.pos;
  var r = this.pos,
      a = this.readWord1();
  this.containsEsc && this.unexpected(r);
  var o = this.regexpState || (this.regexpState = new so(this));
  o.reset(s, n, a), this.validateRegExpFlags(o), this.validateRegExpPattern(o);
  var h = null;

  try {
    h = new RegExp(n, a);
  } catch (e) {}

  return this.finishToken(ea.regexp, {
    pattern: n,
    flags: a,
    value: h
  });
}, fo.readInt = function (e, t, s) {
  for (var i = this.options.ecmaVersion >= 12 && void 0 === t, n = s && 48 === this.input.charCodeAt(this.pos), r = this.pos, a = 0, o = 0, h = 0, l = null == t ? 1 / 0 : t; h < l; ++h, ++this.pos) {
    var c = this.input.charCodeAt(this.pos),
        u = void 0;
    if (i && 95 === c) n && this.raiseRecoverable(this.pos, "Numeric separator is not allowed in legacy octal numeric literals"), 95 === o && this.raiseRecoverable(this.pos, "Numeric separator must be exactly one underscore"), 0 === h && this.raiseRecoverable(this.pos, "Numeric separator is not allowed at the first of digits"), o = c;else {
      if ((u = c >= 97 ? c - 97 + 10 : c >= 65 ? c - 65 + 10 : c >= 48 && c <= 57 ? c - 48 : 1 / 0) >= e) break;
      o = c, a = a * e + u;
    }
  }

  return i && 95 === o && this.raiseRecoverable(this.pos - 1, "Numeric separator is not allowed at the last of digits"), this.pos === r || null != t && this.pos - r !== t ? null : a;
}, fo.readRadixNumber = function (e) {
  var t = this.pos;
  this.pos += 2;
  var s = this.readInt(e);
  return null == s && this.raise(this.start + 2, "Expected number in radix " + e), this.options.ecmaVersion >= 11 && 110 === this.input.charCodeAt(this.pos) ? (s = mo(this.input.slice(t, this.pos)), ++this.pos) : Hr(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number"), this.finishToken(ea.num, s);
}, fo.readNumber = function (e) {
  var t = this.pos;
  e || null !== this.readInt(10, void 0, !0) || this.raise(t, "Invalid number");
  var s = this.pos - t >= 2 && 48 === this.input.charCodeAt(t);
  s && this.strict && this.raise(t, "Invalid number");
  var i = this.input.charCodeAt(this.pos);

  if (!s && !e && this.options.ecmaVersion >= 11 && 110 === i) {
    var n = mo(this.input.slice(t, this.pos));
    return ++this.pos, Hr(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number"), this.finishToken(ea.num, n);
  }

  s && /[89]/.test(this.input.slice(t, this.pos)) && (s = !1), 46 !== i || s || (++this.pos, this.readInt(10), i = this.input.charCodeAt(this.pos)), 69 !== i && 101 !== i || s || (43 !== (i = this.input.charCodeAt(++this.pos)) && 45 !== i || ++this.pos, null === this.readInt(10) && this.raise(t, "Invalid number")), Hr(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number");
  var r,
      a = (r = this.input.slice(t, this.pos), s ? parseInt(r, 8) : parseFloat(r.replace(/_/g, "")));
  return this.finishToken(ea.num, a);
}, fo.readCodePoint = function () {
  var e;

  if (123 === this.input.charCodeAt(this.pos)) {
    this.options.ecmaVersion < 6 && this.unexpected();
    var t = ++this.pos;
    e = this.readHexChar(this.input.indexOf("}", this.pos) - this.pos), ++this.pos, e > 1114111 && this.invalidStringToken(t, "Code point out of bounds");
  } else e = this.readHexChar(4);

  return e;
}, fo.readString = function (e) {
  for (var t = "", s = ++this.pos;;) {
    this.pos >= this.input.length && this.raise(this.start, "Unterminated string constant");
    var i = this.input.charCodeAt(this.pos);
    if (i === e) break;
    92 === i ? (t += this.input.slice(s, this.pos), t += this.readEscapedChar(!1), s = this.pos) : (ia(i, this.options.ecmaVersion >= 10) && this.raise(this.start, "Unterminated string constant"), ++this.pos);
  }

  return t += this.input.slice(s, this.pos++), this.finishToken(ea.string, t);
};
var yo = {};
fo.tryReadTemplateToken = function () {
  this.inTemplateElement = !0;

  try {
    this.readTmplToken();
  } catch (e) {
    if (e !== yo) throw e;
    this.readInvalidTemplateToken();
  }

  this.inTemplateElement = !1;
}, fo.invalidStringToken = function (e, t) {
  if (this.inTemplateElement && this.options.ecmaVersion >= 9) throw yo;
  this.raise(e, t);
}, fo.readTmplToken = function () {
  for (var e = "", t = this.pos;;) {
    this.pos >= this.input.length && this.raise(this.start, "Unterminated template");
    var s = this.input.charCodeAt(this.pos);
    if (96 === s || 36 === s && 123 === this.input.charCodeAt(this.pos + 1)) return this.pos !== this.start || this.type !== ea.template && this.type !== ea.invalidTemplate ? (e += this.input.slice(t, this.pos), this.finishToken(ea.template, e)) : 36 === s ? (this.pos += 2, this.finishToken(ea.dollarBraceL)) : (++this.pos, this.finishToken(ea.backQuote));
    if (92 === s) e += this.input.slice(t, this.pos), e += this.readEscapedChar(!0), t = this.pos;else if (ia(s)) {
      switch (e += this.input.slice(t, this.pos), ++this.pos, s) {
        case 13:
          10 === this.input.charCodeAt(this.pos) && ++this.pos;

        case 10:
          e += "\n";
          break;

        default:
          e += String.fromCharCode(s);
      }

      this.options.locations && (++this.curLine, this.lineStart = this.pos), t = this.pos;
    } else ++this.pos;
  }
}, fo.readInvalidTemplateToken = function () {
  for (; this.pos < this.input.length; this.pos++) switch (this.input[this.pos]) {
    case "\\":
      ++this.pos;
      break;

    case "$":
      if ("{" !== this.input[this.pos + 1]) break;

    case "`":
      return this.finishToken(ea.invalidTemplate, this.input.slice(this.start, this.pos));
  }

  this.raise(this.start, "Unterminated template");
}, fo.readEscapedChar = function (e) {
  var t = this.input.charCodeAt(++this.pos);

  switch (++this.pos, t) {
    case 110:
      return "\n";

    case 114:
      return "\r";

    case 120:
      return String.fromCharCode(this.readHexChar(2));

    case 117:
      return go(this.readCodePoint());

    case 116:
      return "\t";

    case 98:
      return "\b";

    case 118:
      return "\v";

    case 102:
      return "\f";

    case 13:
      10 === this.input.charCodeAt(this.pos) && ++this.pos;

    case 10:
      return this.options.locations && (this.lineStart = this.pos, ++this.curLine), "";

    case 56:
    case 57:
      if (this.strict && this.invalidStringToken(this.pos - 1, "Invalid escape sequence"), e) {
        var s = this.pos - 1;
        return this.invalidStringToken(s, "Invalid escape sequence in template string"), null;
      }

    default:
      if (t >= 48 && t <= 55) {
        var i = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0],
            n = parseInt(i, 8);
        return n > 255 && (i = i.slice(0, -1), n = parseInt(i, 8)), this.pos += i.length - 1, t = this.input.charCodeAt(this.pos), "0" === i && 56 !== t && 57 !== t || !this.strict && !e || this.invalidStringToken(this.pos - 1 - i.length, e ? "Octal literal in template string" : "Octal literal in strict mode"), String.fromCharCode(n);
      }

      return ia(t) ? "" : String.fromCharCode(t);
  }
}, fo.readHexChar = function (e) {
  var t = this.pos,
      s = this.readInt(16, e);
  return null === s && this.invalidStringToken(t, "Bad character escape sequence"), s;
}, fo.readWord1 = function () {
  this.containsEsc = !1;

  for (var e = "", t = !0, s = this.pos, i = this.options.ecmaVersion >= 6; this.pos < this.input.length;) {
    var n = this.fullCharCodeAtPos();
    if (qr(n, i)) this.pos += n <= 65535 ? 1 : 2;else {
      if (92 !== n) break;
      this.containsEsc = !0, e += this.input.slice(s, this.pos);
      var r = this.pos;
      117 !== this.input.charCodeAt(++this.pos) && this.invalidStringToken(this.pos, "Expecting Unicode escape sequence \\uXXXX"), ++this.pos;
      var a = this.readCodePoint();
      (t ? Hr : qr)(a, i) || this.invalidStringToken(r, "Invalid Unicode escape"), e += go(a), s = this.pos;
    }
    t = !1;
  }

  return e + this.input.slice(s, this.pos);
}, fo.readWord = function () {
  var e = this.readWord1(),
      t = ea.name;
  return this.keywords.test(e) && (t = Zr[e]), this.finishToken(t, e);
};
xa.acorn = {
  Parser: xa,
  version: "8.4.0",
  defaultOptions: ma,
  Position: da,
  SourceLocation: pa,
  getLineInfo: fa,
  Node: Ba,
  TokenType: Kr,
  tokTypes: ea,
  keywordTypes: Zr,
  TokContext: Wa,
  tokContexts: ja,
  isIdentifierChar: qr,
  isIdentifierStart: Hr,
  Token: po,
  isNewLine: ia,
  lineBreak: ta,
  lineBreakG: sa,
  nonASCIIwhitespace: na
};

const Eo = e => () => {
  Us({
    code: "NO_FS_IN_BROWSER",
    message: `Cannot access the file system (via "${e}") when using the browser build of Rollup. Make sure you supply a plugin with custom resolveId and load hooks to Rollup.`,
    url: "https://rollupjs.org/guide/en/#a-simple-example"
  });
},
      xo = Eo("fs.readFile"),
      vo = Eo("fs.writeFile");

class bo {
  constructor(e = 1) {
    this.maxParallel = e, this.queue = new Array(), this.workerCount = 0;
  }

  run(e) {
    return new Promise((t, s) => {
      this.queue.push({
        reject: s,
        resolve: t,
        task: e
      }), this.work();
    });
  }

  async work() {
    if (this.workerCount >= this.maxParallel) return;
    let e;

    for (this.workerCount++; e = this.queue.shift();) {
      const {
        reject: t,
        resolve: s,
        task: i
      } = e;

      try {
        s(await i());
      } catch (e) {
        t(e);
      }
    }

    this.workerCount--;
  }

}

async function So(e, t, s, i, n, r, a) {
  return await function (e, t, s, i, n, r) {
    let a = null,
        o = null;

    if (n) {
      a = new Set();

      for (const s of n) e === s.source && t === s.importer && a.add(s.plugin);

      o = (e, t) => ({ ...e,
        resolve: (e, s, {
          custom: r,
          skipSelf: a
        } = K) => i(e, s, r, a ? [...n, {
          importer: s,
          plugin: t,
          source: e
        }] : n)
      });
    }

    return s.hookFirst("resolveId", [e, t, {
      custom: r
    }], o, a);
  }(e, t, i, n, r, a);
}

function Ao(e, t, {
  hook: s,
  id: i
} = {}) {
  return "string" == typeof e && (e = {
    message: e
  }), e.code && e.code !== Hs.PLUGIN_ERROR && (e.pluginCode = e.code), e.code = Hs.PLUGIN_ERROR, e.plugin = t, s && (e.hook = s), i && (e.id = i), Us(e);
}

const Po = [{
  active: !0,
  deprecated: "resolveAssetUrl",
  replacement: "resolveFileUrl"
}];
const ko = {
  delete: () => !1,

  get() {},

  has: () => !1,

  set() {}

};

function Co(e) {
  return e.startsWith("at position ") || e.startsWith("at output position ") ? Us({
    code: "ANONYMOUS_PLUGIN_CACHE",
    message: "A plugin is trying to use the Rollup cache but is not declaring a plugin name or cacheKey."
  }) : Us({
    code: "DUPLICATE_PLUGIN_NAME",
    message: `The plugin name ${e} is being used twice in the same build. Plugin names must be distinct or provide a cacheKey (please post an issue to the plugin if you are a plugin user).`
  });
}

function wo(e, t, s, i) {
  const n = t.id,
        r = [];
  let a = null === e.map ? null : ur(e.map);
  const o = e.code;
  let h = e.ast;
  const c = [],
        u = [];
  let d = !1;

  const p = () => d = !0;

  let f;
  const m = e.code;
  return s.hookReduceArg0("transform", [m, n], function (e, s, n) {
    let a, o;
    if ("string" == typeof s) a = s;else {
      if (!s || "object" != typeof s) return e;
      if (t.updateOptions(s), null == s.code) return (s.map || s.ast) && i((l = n.name, {
        code: Hs.NO_TRANSFORM_MAP_OR_AST_WITHOUT_CODE,
        message: `The plugin "${l}" returned a "map" or "ast" without returning a "code". This will be ignored.`
      })), e;
      ({
        code: a,
        map: o,
        ast: h
      } = s);
    }
    var l;
    return null !== o && r.push(ur("string" == typeof o ? JSON.parse(o) : o) || {
      missing: !0,
      plugin: n.name
    }), a;
  }, (e, t) => {
    return f = t, { ...e,

      addWatchFile(t) {
        c.push(t), e.addWatchFile(t);
      },

      cache: d ? e.cache : (h = e.cache, g = p, {
        delete: e => (g(), h.delete(e)),
        get: e => (g(), h.get(e)),
        has: e => (g(), h.has(e)),
        set: (e, t) => (g(), h.set(e, t))
      }),
      emitAsset: (t, s) => (u.push({
        name: t,
        source: s,
        type: "asset"
      }), e.emitAsset(t, s)),
      emitChunk: (t, s) => (u.push({
        id: t,
        name: s && s.name,
        type: "chunk"
      }), e.emitChunk(t, s)),
      emitFile: e => (u.push(e), s.emitFile(e)),
      error: (t, s) => ("string" == typeof t && (t = {
        message: t
      }), s && Gs(t, s, m, n), t.id = n, t.hook = "transform", e.error(t)),

      getCombinedSourcemap() {
        const e = function (e, t, s, i, n) {
          return i.length ? {
            version: 3,
            ...mn(e, t, s, i, fn(n)).traceMappings()
          } : s;
        }(n, o, a, r, i);

        if (!e) {
          return new b(o).generateMap({
            hires: !0,
            includeContent: !0,
            source: n
          });
        }

        return a !== e && (a = e, r.length = 0), new l({ ...e,
          file: null,
          sourcesContent: e.sourcesContent
        });
      },

      setAssetSource() {
        return this.error({
          code: "INVALID_SETASSETSOURCE",
          message: "setAssetSource cannot be called in transform for caching reasons. Use emitFile with a source, or call setAssetSource in another hook."
        });
      },

      warn(t, s) {
        "string" == typeof t && (t = {
          message: t
        }), s && Gs(t, s, m, n), t.id = n, t.hook = "transform", e.warn(t);
      }

    };
    var h, g;
  }).catch(e => Ao(e, f.name, {
    hook: "transform",
    id: n
  })).then(e => (d || u.length && (t.transformFiles = u), {
    ast: h,
    code: e,
    customTransformCache: d,
    meta: t.info.meta,
    originalCode: o,
    originalSourcemap: a,
    sourcemapChain: r,
    transformDependencies: c
  }));
}

class Io {
  constructor(e, t, s, i) {
    this.graph = e, this.modulesById = t, this.options = s, this.pluginDriver = i, this.implicitEntryModules = new Set(), this.indexedEntryModules = [], this.latestLoadModulesPromise = Promise.resolve(), this.nextEntryModuleIndex = 0, this.readQueue = new bo(), this.resolveId = async (e, t, s, i = null) => this.addDefaultsToResolvedId(this.getNormalizedResolvedIdWithoutDefaults(!this.options.external(e, t, !1) && (await So(e, t, this.options.preserveSymlinks, this.pluginDriver, this.resolveId, i, s)), t, e)), this.hasModuleSideEffects = s.treeshake ? s.treeshake.moduleSideEffects : () => !0, this.readQueue.maxParallel = s.maxParallelFileReads;
  }

  async addAdditionalModules(e) {
    const t = this.extendLoadModulesPromise(Promise.all(e.map(e => this.loadEntryModule(e, !1, void 0, null))));
    return await this.awaitLoadModulesPromise(), t;
  }

  async addEntryModules(e, t) {
    const s = this.nextEntryModuleIndex;
    this.nextEntryModuleIndex += e.length;
    const i = await this.extendLoadModulesPromise(Promise.all(e.map(({
      id: e,
      importer: t
    }) => this.loadEntryModule(e, !0, t, null))).then(i => {
      let n = s;

      for (let s = 0; s < i.length; s++) {
        const r = i[s];
        r.isUserDefinedEntryPoint = r.isUserDefinedEntryPoint || t, _o(r, e[s], t);
        const a = this.indexedEntryModules.find(e => e.module === r);
        a ? a.index = Math.min(a.index, n) : this.indexedEntryModules.push({
          index: n,
          module: r
        }), n++;
      }

      return this.indexedEntryModules.sort(({
        index: e
      }, {
        index: t
      }) => e > t ? 1 : -1), i;
    }));
    return await this.awaitLoadModulesPromise(), {
      entryModules: this.indexedEntryModules.map(({
        module: e
      }) => e),
      implicitEntryModules: [...this.implicitEntryModules],
      newEntryModules: i
    };
  }

  async emitChunk({
    fileName: e,
    id: t,
    importer: s,
    name: i,
    implicitlyLoadedAfterOneOf: n,
    preserveSignature: r
  }) {
    const a = {
      fileName: e || null,
      id: t,
      importer: s,
      name: i || null
    },
          o = n ? await this.addEntryWithImplicitDependants(a, n) : (await this.addEntryModules([a], !1)).newEntryModules[0];
    return null != r && (o.preserveSignature = r), o;
  }

  addDefaultsToResolvedId(e) {
    var t, s;
    if (!e) return null;
    const i = e.external || !1;
    return {
      external: i,
      id: e.id,
      meta: e.meta || X,
      moduleSideEffects: null !== (t = e.moduleSideEffects) && void 0 !== t ? t : this.hasModuleSideEffects(e.id, !!i),
      syntheticNamedExports: null !== (s = e.syntheticNamedExports) && void 0 !== s && s
    };
  }

  addEntryWithImplicitDependants(e, t) {
    return this.extendLoadModulesPromise(this.loadEntryModule(e.id, !1, e.importer, null).then(async s => {
      if (_o(s, e, !1), !s.info.isEntry) {
        this.implicitEntryModules.add(s);
        const i = await Promise.all(t.map(t => this.loadEntryModule(t, !1, e.importer, s.id)));

        for (const e of i) s.implicitlyLoadedAfter.add(e);

        for (const e of s.implicitlyLoadedAfter) e.implicitlyLoadedBefore.add(s);
      }

      return s;
    }));
  }

  async addModuleSource(e, t, s) {
    let i;
    Li("load modules", 3);

    try {
      i = await this.readQueue.run(async () => {
        var t;
        return null !== (t = await this.pluginDriver.hookFirst("load", [e])) && void 0 !== t ? t : await xo(e);
      });
    } catch (s) {
      Di("load modules", 3);
      let i = `Could not load ${e}`;
      throw t && (i += ` (imported by ${re(t)})`), i += `: ${s.message}`, s.message = i, s;
    }

    Di("load modules", 3);
    const n = "string" == typeof i ? {
      code: i
    } : "object" == typeof i && "string" == typeof i.code ? i : Us(function (e) {
      return {
        code: Hs.BAD_LOADER,
        message: `Error loading ${re(e)}: plugin load hook should return a string, a { code, map } object, or nothing/null`
      };
    }(e)),
          r = this.graph.cachedModules.get(e);

    if (r && !r.customTransformCache && r.originalCode === n.code) {
      if (r.transformFiles) for (const e of r.transformFiles) this.pluginDriver.emitFile(e);
      s.setSource(r);
    } else s.updateOptions(n), s.setSource(await wo(n, s, this.pluginDriver, this.options.onwarn));
  }

  async awaitLoadModulesPromise() {
    let e;

    do {
      e = this.latestLoadModulesPromise, await e;
    } while (e !== this.latestLoadModulesPromise);
  }

  extendLoadModulesPromise(e) {
    return this.latestLoadModulesPromise = Promise.all([e, this.latestLoadModulesPromise]), this.latestLoadModulesPromise.catch(() => {}), e;
  }

  async fetchDynamicDependencies(e, t) {
    const s = await Promise.all(t.map(t => t.then(async ([t, s]) => null === s ? null : "string" == typeof s ? (t.resolution = s, null) : t.resolution = await this.fetchResolvedDependency(re(s.id), e.id, s))));

    for (const t of s) t && (e.dynamicDependencies.add(t), t.dynamicImporters.push(e.id));
  }

  async fetchModule({
    id: e,
    meta: t,
    moduleSideEffects: s,
    syntheticNamedExports: i
  }, n, r) {
    const a = this.modulesById.get(e);

    if (a instanceof Ui) {
      if (r) {
        a.info.isEntry = !0, this.implicitEntryModules.delete(a);

        for (const e of a.implicitlyLoadedAfter) e.implicitlyLoadedBefore.delete(a);

        a.implicitlyLoadedAfter.clear();
      }

      return a;
    }

    const o = new Ui(this.graph, e, this.options, r, s, i, t);
    this.modulesById.set(e, o), this.graph.watchFiles[e] = !0, await this.addModuleSource(e, n, o);
    const h = this.getResolveStaticDependencyPromises(o),
          l = this.getResolveDynamicImportPromises(o);
    return Promise.all([...h, ...l]).then(() => this.pluginDriver.hookParallel("moduleParsed", [o.info])), await Promise.all([this.fetchStaticDependencies(o, h), this.fetchDynamicDependencies(o, l)]), o.linkImports(), o;
  }

  fetchResolvedDependency(e, t, s) {
    if (s.external) {
      const {
        external: i,
        id: n,
        moduleSideEffects: r,
        meta: a
      } = s;
      this.modulesById.has(n) || this.modulesById.set(n, new oe(this.options, n, r, a, "absolute" !== i && P(n)));
      const o = this.modulesById.get(n);
      return o instanceof oe ? Promise.resolve(o) : Us(function (e, t) {
        return {
          code: Hs.INVALID_EXTERNAL_ID,
          message: `'${e}' is imported as an external by ${re(t)}, but is already an existing non-external module id.`
        };
      }(e, t));
    }

    return this.fetchModule(s, t, !1);
  }

  async fetchStaticDependencies(e, t) {
    for (const s of await Promise.all(t.map(t => t.then(([t, s]) => this.fetchResolvedDependency(t, e.id, s))))) e.dependencies.add(s), s.importers.push(e.id);

    if (!this.options.treeshake || "no-treeshake" === e.info.hasModuleSideEffects) for (const t of e.dependencies) t instanceof Ui && (t.importedFromNotTreeshaken = !0);
  }

  getNormalizedResolvedIdWithoutDefaults(e, t, s) {
    const {
      makeAbsoluteExternalsRelative: i
    } = this.options;

    if (e) {
      if ("object" == typeof e) {
        const n = e.external || this.options.external(e.id, t, !0);
        return { ...e,
          external: n && ("relative" === n || !P(e.id) || !0 === n && $o(e.id, s, i) || "absolute")
        };
      }

      const n = this.options.external(e, t, !0);
      return {
        external: n && ($o(e, s, i) || "absolute"),
        id: n && i ? No(e, t) : e
      };
    }

    const n = i ? No(s, t) : s;
    return !1 === e || this.options.external(n, t, !0) ? {
      external: $o(n, s, i) || "absolute",
      id: n
    } : null;
  }

  getResolveDynamicImportPromises(e) {
    return e.dynamicImports.map(async t => {
      const s = await this.resolveDynamicImport(e, "string" == typeof t.argument ? t.argument : t.argument.esTreeNode, e.id);
      return s && "object" == typeof s && (t.id = s.id), [t, s];
    });
  }

  getResolveStaticDependencyPromises(e) {
    return Array.from(e.sources, async t => [t, e.resolvedIds[t] = e.resolvedIds[t] || this.handleResolveId(await this.resolveId(t, e.id, X), t, e.id)]);
  }

  handleResolveId(e, t, s) {
    return null === e ? k(t) ? Us(function (e, t) {
      return {
        code: Hs.UNRESOLVED_IMPORT,
        message: `Could not resolve '${e}' from ${re(t)}`
      };
    }(t, s)) : (this.options.onwarn(function (e, t) {
      return {
        code: Hs.UNRESOLVED_IMPORT,
        importer: re(t),
        message: `'${e}' is imported by ${re(t)}, but could not be resolved – treating it as an external dependency`,
        source: e,
        url: "https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency"
      };
    }(t, s)), {
      external: !0,
      id: t,
      meta: X,
      moduleSideEffects: this.hasModuleSideEffects(t, !0),
      syntheticNamedExports: !1
    }) : (e.external && e.syntheticNamedExports && this.options.onwarn(function (e, t) {
      return {
        code: Hs.EXTERNAL_SYNTHETIC_EXPORTS,
        importer: re(t),
        message: `External '${e}' can not have 'syntheticNamedExports' enabled.`,
        source: e
      };
    }(t, s)), e);
  }

  async loadEntryModule(e, t, s, i) {
    const n = await So(e, s, this.options.preserveSymlinks, this.pluginDriver, this.resolveId, null, X);
    return null == n ? Us(null === i ? function (e) {
      return {
        code: Hs.UNRESOLVED_ENTRY,
        message: `Could not resolve entry module (${re(e)}).`
      };
    }(e) : function (e, t) {
      return {
        code: Hs.MISSING_IMPLICIT_DEPENDANT,
        message: `Module "${re(e)}" that should be implicitly loaded before "${re(t)}" could not be resolved.`
      };
    }(e, i)) : !1 === n || "object" == typeof n && n.external ? Us(null === i ? function (e) {
      return {
        code: Hs.UNRESOLVED_ENTRY,
        message: `Entry module cannot be external (${re(e)}).`
      };
    }(e) : function (e, t) {
      return {
        code: Hs.MISSING_IMPLICIT_DEPENDANT,
        message: `Module "${re(e)}" that should be implicitly loaded before "${re(t)}" cannot be external.`
      };
    }(e, i)) : this.fetchModule(this.addDefaultsToResolvedId("object" == typeof n ? n : {
      id: n
    }), void 0, t);
  }

  async resolveDynamicImport(e, t, s) {
    const i = await this.pluginDriver.hookFirst("resolveDynamicImport", [t, s]);
    return "string" != typeof t ? "string" == typeof i ? i : i ? {
      external: !1,
      moduleSideEffects: !0,
      ...i
    } : null : null == i ? e.resolvedIds[t] = e.resolvedIds[t] || this.handleResolveId(await this.resolveId(t, e.id, X), t, e.id) : this.handleResolveId(this.addDefaultsToResolvedId(this.getNormalizedResolvedIdWithoutDefaults(i, s, t)), t, s);
  }

}

function No(e, t) {
  return k(e) ? t ? $(t, "..", e) : $(e) : e;
}

function _o(e, {
  fileName: t,
  name: s
}, i) {
  null !== t ? e.chunkFileNames.add(t) : null !== s && (null === e.chunkName && (e.chunkName = s), i && e.userChunkNames.add(s));
}

function $o(e, t, s) {
  return !0 === s || "ifRelativeSource" === s && k(t) || !P(e);
}

class To extends at {
  constructor() {
    super(), this.variables.set("undefined", new yi());
  }

  findVariable(e) {
    let t = this.variables.get(e);
    return t || (t = new vt(e), this.variables.set(e, t)), t;
  }

}

function Ro(e, t, s, i, n, r) {
  let a = !1;
  return (...o) => (a || (a = !0, ni({
    message: `The "this.${t}" plugin context function used by plugin ${i} is deprecated. The "this.${s}" plugin context function should be used instead.`,
    plugin: i
  }, n, r)), e(...o));
}

function Mo(e, t, s, i, n, r) {
  let a,
      o = !0;
  if ("string" != typeof e.cacheKey && (e.name.startsWith("at position ") || e.name.startsWith("at output position ") || r.has(e.name) ? o = !1 : r.add(e.name)), t) {
    if (o) {
      const s = e.cacheKey || e.name;
      l = t[s] || (t[s] = Object.create(null)), a = {
        delete: e => delete l[e],

        get(e) {
          const t = l[e];
          if (t) return t[0] = 0, t[1];
        },

        has(e) {
          const t = l[e];
          return !!t && (t[0] = 0, !0);
        },

        set(e, t) {
          l[e] = [0, t];
        }

      };
    } else h = e.name, a = {
      delete: () => Co(h),
      get: () => Co(h),
      has: () => Co(h),
      set: () => Co(h)
    };
  } else a = ko;
  var h, l;
  return {
    addWatchFile(e) {
      if (s.phase >= Er.GENERATE) return this.error({
        code: Hs.INVALID_ROLLUP_PHASE,
        message: "Cannot call addWatchFile after the build has finished."
      });
      s.watchFiles[e] = !0;
    },

    cache: a,
    emitAsset: Ro((e, t) => n.emitFile({
      name: e,
      source: t,
      type: "asset"
    }), "emitAsset", "emitFile", e.name, !0, i),
    emitChunk: Ro((e, t) => n.emitFile({
      id: e,
      name: t && t.name,
      type: "chunk"
    }), "emitChunk", "emitFile", e.name, !0, i),
    emitFile: n.emitFile.bind(n),
    error: t => Ao(t, e.name),
    getAssetFileName: Ro(n.getFileName, "getAssetFileName", "getFileName", e.name, !0, i),
    getChunkFileName: Ro(n.getFileName, "getChunkFileName", "getFileName", e.name, !0, i),
    getFileName: n.getFileName,
    getModuleIds: () => s.modulesById.keys(),
    getModuleInfo: s.getModuleInfo,
    getWatchFiles: () => Object.keys(s.watchFiles),
    isExternal: Ro((e, t, s = !1) => i.external(e, t, s), "isExternal", "resolve", e.name, !0, i),
    meta: {
      rollupVersion: "2.56.3",
      watchMode: s.watchMode
    },

    get moduleIds() {
      const t = s.modulesById.keys();
      return function* () {
        ni({
          message: `Accessing "this.moduleIds" on the plugin context by plugin ${e.name} is deprecated. The "this.getModuleIds" plugin context function should be used instead.`,
          plugin: e.name
        }, !1, i), yield* t;
      }();
    },

    parse: s.contextParse.bind(s),
    resolve: (t, i, {
      custom: n,
      skipSelf: r
    } = K) => s.moduleLoader.resolveId(t, i, n, r ? [{
      importer: i,
      plugin: e,
      source: t
    }] : null),
    resolveId: Ro((e, t) => s.moduleLoader.resolveId(e, t, K).then(e => e && e.id), "resolveId", "resolve", e.name, !0, i),
    setAssetSource: n.setAssetSource,

    warn(t) {
      "string" == typeof t && (t = {
        message: t
      }), t.code && (t.pluginCode = t.code), t.code = "PLUGIN_WARNING", t.plugin = e.name, i.onwarn(t);
    }

  };
}

const Oo = Object.keys({
  buildEnd: 1,
  buildStart: 1,
  closeBundle: 1,
  closeWatcher: 1,
  load: 1,
  moduleParsed: 1,
  options: 1,
  resolveDynamicImport: 1,
  resolveId: 1,
  transform: 1,
  watchChange: 1
});

function Lo(e, t) {
  return Us({
    code: "INVALID_PLUGIN_HOOK",
    message: `Error running plugin hook ${e} for ${t}, expected a function hook.`
  });
}

class Do {
  constructor(e, t, s, i, n) {
    this.graph = e, this.options = t, this.pluginContexts = new Map(), function (e, t) {
      for (const {
        active: s,
        deprecated: i,
        replacement: n
      } of Po) for (const r of e) i in r && ni({
        message: `The "${i}" hook used by plugin ${r.name} is deprecated. The "${n}" hook should be used instead.`,
        plugin: r.name
      }, s, t);
    }(s, t), this.pluginCache = i, this.fileEmitter = new Pr(e, t, n && n.fileEmitter), this.emitFile = this.fileEmitter.emitFile.bind(this.fileEmitter), this.getFileName = this.fileEmitter.getFileName.bind(this.fileEmitter), this.finaliseAssets = this.fileEmitter.assertAssetsFinalized.bind(this.fileEmitter), this.setOutputBundle = this.fileEmitter.setOutputBundle.bind(this.fileEmitter), this.plugins = s.concat(n ? n.plugins : []);
    const r = new Set();

    for (const s of this.plugins) this.pluginContexts.set(s, Mo(s, i, e, t, this.fileEmitter, r));

    if (n) for (const e of s) for (const s of Oo) s in e && t.onwarn((a = e.name, o = s, {
      code: Hs.INPUT_HOOK_IN_OUTPUT_PLUGIN,
      message: `The "${o}" hook used by the output plugin ${a} is a build time hook and will not be run for that plugin. Either this plugin cannot be used as an output plugin, or it should have an option to configure it as an output plugin.`
    }));
    var a, o;
  }

  createOutputPluginDriver(e) {
    return new Do(this.graph, this.options, e, this.pluginCache, this);
  }

  hookFirst(e, t, s, i) {
    let n = Promise.resolve(void 0);

    for (const r of this.plugins) i && i.has(r) || (n = n.then(i => null != i ? i : this.runHook(e, t, r, !1, s)));

    return n;
  }

  hookFirstSync(e, t, s) {
    for (const i of this.plugins) {
      const n = this.runHookSync(e, t, i, s);
      if (null != n) return n;
    }

    return null;
  }

  hookParallel(e, t, s) {
    const i = [];

    for (const n of this.plugins) {
      const r = this.runHook(e, t, n, !1, s);
      r && i.push(r);
    }

    return Promise.all(i).then(() => {});
  }

  hookReduceArg0(e, [t, ...s], i, n) {
    let r = Promise.resolve(t);

    for (const t of this.plugins) r = r.then(r => {
      const a = [r, ...s],
            o = this.runHook(e, a, t, !1, n);
      return o ? o.then(e => i.call(this.pluginContexts.get(t), r, e, t)) : r;
    });

    return r;
  }

  hookReduceArg0Sync(e, [t, ...s], i, n) {
    for (const r of this.plugins) {
      const a = [t, ...s],
            o = this.runHookSync(e, a, r, n);
      t = i.call(this.pluginContexts.get(r), t, o, r);
    }

    return t;
  }

  hookReduceValue(e, t, s, i, n) {
    let r = Promise.resolve(t);

    for (const t of this.plugins) r = r.then(r => {
      const a = this.runHook(e, s, t, !0, n);
      return a ? a.then(e => i.call(this.pluginContexts.get(t), r, e, t)) : r;
    });

    return r;
  }

  hookReduceValueSync(e, t, s, i, n) {
    let r = t;

    for (const t of this.plugins) {
      const a = this.runHookSync(e, s, t, n);
      r = i.call(this.pluginContexts.get(t), r, a, t);
    }

    return r;
  }

  hookSeq(e, t, s) {
    let i = Promise.resolve();

    for (const n of this.plugins) i = i.then(() => this.runHook(e, t, n, !1, s));

    return i;
  }

  hookSeqSync(e, t, s) {
    for (const i of this.plugins) this.runHookSync(e, t, i, s);
  }

  runHook(e, t, s, i, n) {
    const r = s[e];
    if (!r) return;
    let a = this.pluginContexts.get(s);
    return n && (a = n(a, s)), Promise.resolve().then(() => "function" != typeof r ? i ? r : Lo(e, s.name) : r.apply(a, t)).catch(t => Ao(t, s.name, {
      hook: e
    }));
  }

  runHookSync(e, t, s, i) {
    const n = s[e];
    if (!n) return;
    let r = this.pluginContexts.get(s);
    i && (r = i(r, s));

    try {
      return "function" != typeof n ? Lo(e, s.name) : n.apply(r, t);
    } catch (t) {
      return Ao(t, s.name, {
        hook: e
      });
    }
  }

}

class Vo {
  constructor(e, t) {
    var s, i;

    if (this.options = e, this.entryModules = [], this.modulesById = new Map(), this.needsTreeshakingPass = !1, this.phase = Er.LOAD_AND_PARSE, this.watchFiles = Object.create(null), this.watchMode = !1, this.externalModules = [], this.implicitEntryModules = [], this.modules = [], this.getModuleInfo = e => {
      const t = this.modulesById.get(e);
      return t ? t.info : null;
    }, this.deoptimizationTracker = new F(), this.cachedModules = new Map(), !1 !== e.cache) {
      if (null === (s = e.cache) || void 0 === s ? void 0 : s.modules) for (const t of e.cache.modules) this.cachedModules.set(t.id, t);
      this.pluginCache = (null === (i = e.cache) || void 0 === i ? void 0 : i.plugins) || Object.create(null);

      for (const e in this.pluginCache) {
        const t = this.pluginCache[e];

        for (const e of Object.values(t)) e[0]++;
      }
    }

    if (t) {
      this.watchMode = !0;

      const e = (...e) => this.pluginDriver.hookSeqSync("watchChange", e),
            s = () => this.pluginDriver.hookSeqSync("closeWatcher", []);

      t.on("change", e), t.on("close", s), t.once("restart", () => {
        t.removeListener("change", e), t.removeListener("close", s);
      });
    }

    this.pluginDriver = new Do(this, e, e.plugins, this.pluginCache), this.scope = new To(), this.acornParser = xa.extend(...e.acornInjectPlugins), this.moduleLoader = new Io(this, this.modulesById, this.options, this.pluginDriver);
  }

  async build() {
    Li("generate module graph", 2), await this.generateModuleGraph(), Di("generate module graph", 2), Li("sort modules", 2), this.phase = Er.ANALYSE, this.sortModules(), Di("sort modules", 2), Li("mark included statements", 2), this.includeStatements(), Di("mark included statements", 2), this.phase = Er.GENERATE;
  }

  contextParse(e, t = {}) {
    const s = t.onComment,
          i = [];
    t.onComment = s && "function" == typeof s ? (e, n, r, a, ...o) => (i.push({
      end: a,
      start: r,
      type: e ? "Block" : "Line",
      value: n
    }), s.call(t, e, n, r, a, ...o)) : i;
    const n = this.acornParser.parse(e, { ...this.options.acorn,
      ...t
    });
    return "object" == typeof s && s.push(...i), t.onComment = s, function (e, t, s) {
      const i = [],
            n = [];

      for (const t of e) Ae.test(t.value) ? i.push(t) : ye.test(t.value) && n.push(t);

      for (const e of n) Pe(t, e, !1);

      Ee(t, {
        annotationIndex: 0,
        annotations: i,
        code: s
      });
    }(i, n, e), n;
  }

  getCache() {
    for (const e in this.pluginCache) {
      const t = this.pluginCache[e];
      let s = !0;

      for (const [e, i] of Object.entries(t)) i[0] >= this.options.experimentalCacheExpiry ? delete t[e] : s = !1;

      s && delete this.pluginCache[e];
    }

    return {
      modules: this.modules.map(e => e.toJSON()),
      plugins: this.pluginCache
    };
  }

  async generateModuleGraph() {
    var e;
    if (({
      entryModules: this.entryModules,
      implicitEntryModules: this.implicitEntryModules
    } = await this.moduleLoader.addEntryModules((e = this.options.input, Array.isArray(e) ? e.map(e => ({
      fileName: null,
      id: e,
      implicitlyLoadedAfter: [],
      importer: void 0,
      name: null
    })) : Object.entries(e).map(([e, t]) => ({
      fileName: null,
      id: t,
      implicitlyLoadedAfter: [],
      importer: void 0,
      name: e
    }))), !0)), 0 === this.entryModules.length) throw new Error("You must supply options.input to rollup");

    for (const e of this.modulesById.values()) e instanceof Ui ? this.modules.push(e) : this.externalModules.push(e);
  }

  includeStatements() {
    for (const e of [...this.entryModules, ...this.implicitEntryModules]) zi(e);

    if (this.options.treeshake) {
      let e = 1;

      do {
        Li(`treeshaking pass ${e}`, 3), this.needsTreeshakingPass = !1;

        for (const e of this.modules) e.isExecuted && ("no-treeshake" === e.info.hasModuleSideEffects ? e.includeAllInBundle() : e.include());

        if (1 === e) for (const e of [...this.entryModules, ...this.implicitEntryModules]) !1 !== e.preserveSignature && (e.includeAllExports(!1), this.needsTreeshakingPass = !0);
        Di("treeshaking pass " + e++, 3);
      } while (this.needsTreeshakingPass);
    } else for (const e of this.modules) e.includeAllInBundle();

    for (const e of this.externalModules) e.warnUnusedImports();

    for (const e of this.implicitEntryModules) for (const t of e.implicitlyLoadedAfter) t.info.isEntry || t.isIncluded() || Us(Qs(t));
  }

  sortModules() {
    const {
      orderedModules: e,
      cyclePaths: t
    } = function (e) {
      let t = 0;

      const s = [],
            i = new Set(),
            n = new Set(),
            r = new Map(),
            a = [],
            o = e => {
        if (e instanceof Ui) {
          for (const t of e.dependencies) r.has(t) ? i.has(t) || s.push($r(t, e, r)) : (r.set(t, e), o(t));

          for (const t of e.implicitlyLoadedBefore) n.add(t);

          for (const {
            resolution: t
          } of e.dynamicImports) t instanceof Ui && n.add(t);

          a.push(e);
        }

        e.execIndex = t++, i.add(e);
      };

      for (const t of e) r.has(t) || (r.set(t, null), o(t));

      for (const e of n) r.has(e) || (r.set(e, null), o(e));

      return {
        cyclePaths: s,
        orderedModules: a
      };
    }(this.entryModules);

    for (const e of t) this.options.onwarn({
      code: "CIRCULAR_DEPENDENCY",
      cycle: e,
      importer: e[0],
      message: `Circular dependency: ${e.join(" -> ")}`
    });

    this.modules = e;

    for (const e of this.modules) e.bindReferences();

    this.warnForMissingExports();
  }

  warnForMissingExports() {
    for (const e of this.modules) for (const t of Object.values(e.importDescriptions)) "*" === t.name || t.module.getVariableForExportName(t.name) || e.warn({
      code: "NON_EXISTENT_EXPORT",
      message: `Non-existent export '${t.name}' is imported from ${re(t.module.id)}`,
      name: t.name,
      source: t.module.id
    }, t.start);
  }

}

function Bo(e) {
  return Array.isArray(e) ? e.filter(Boolean) : e ? [e] : [];
}

const Fo = e => console.warn(e.message || e);

function zo(e, t, s, i, n = /$./) {
  const r = new Set(t),
        a = Object.keys(e).filter(e => !(r.has(e) || n.test(e)));
  a.length > 0 && i({
    code: "UNKNOWN_OPTION",
    message: `Unknown ${s}: ${a.join(", ")}. Allowed options: ${[...r].sort().join(", ")}`
  });
}

const Wo = {
  recommended: {
    annotations: !0,
    correctVarValueBeforeDeclaration: !1,
    moduleSideEffects: () => !0,
    propertyReadSideEffects: !0,
    tryCatchDeoptimization: !0,
    unknownGlobalSideEffects: !1
  },
  safest: {
    annotations: !0,
    correctVarValueBeforeDeclaration: !0,
    moduleSideEffects: () => !0,
    propertyReadSideEffects: !0,
    tryCatchDeoptimization: !0,
    unknownGlobalSideEffects: !0
  },
  smallest: {
    annotations: !0,
    correctVarValueBeforeDeclaration: !1,
    moduleSideEffects: () => !1,
    propertyReadSideEffects: !1,
    tryCatchDeoptimization: !1,
    unknownGlobalSideEffects: !1
  }
};

const jo = e => {
  const {
    onwarn: t
  } = e;
  return t ? e => {
    e.toString = () => {
      let t = "";
      return e.plugin && (t += `(${e.plugin} plugin) `), e.loc && (t += `${re(e.loc.file)} (${e.loc.line}:${e.loc.column}) `), t += e.message, t;
    }, t(e, Fo);
  } : Fo;
},
      Uo = e => ({
  allowAwaitOutsideFunction: !0,
  ecmaVersion: "latest",
  preserveParens: !1,
  sourceType: "module",
  ...e.acorn
}),
      Go = e => Bo(e.acornInjectPlugins),
      Ho = e => {
  var t;
  return (null === (t = e.cache) || void 0 === t ? void 0 : t.cache) || e.cache;
},
      qo = e => {
  if (!0 === e) return () => !0;
  if ("function" == typeof e) return (t, ...s) => !t.startsWith("\0") && e(t, ...s) || !1;

  if (e) {
    const t = new Set(),
          s = [];

    for (const i of Bo(e)) i instanceof RegExp ? s.push(i) : t.add(i);

    return (e, ...i) => t.has(e) || s.some(t => t.test(e));
  }

  return () => !1;
},
      Ko = (e, t, s) => {
  const i = e.inlineDynamicImports;
  return i && ri('The "inlineDynamicImports" option is deprecated. Use the "output.inlineDynamicImports" option instead.', !1, t, s), i;
},
      Xo = e => {
  const t = e.input;
  return null == t ? [] : "string" == typeof t ? [t] : t;
},
      Yo = (e, t, s) => {
  const i = e.manualChunks;
  return i && ri('The "manualChunks" option is deprecated. Use the "output.manualChunks" option instead.', !1, t, s), i;
},
      Qo = e => {
  const t = e.maxParallelFileReads;
  return "number" == typeof t ? t <= 0 ? 1 / 0 : t : 20;
},
      Zo = (e, t) => {
  const s = e.moduleContext;
  if ("function" == typeof s) return e => {
    var i;
    return null !== (i = s(e)) && void 0 !== i ? i : t;
  };

  if (s) {
    const e = Object.create(null);

    for (const [t, i] of Object.entries(s)) e[$(t)] = i;

    return s => e[s] || t;
  }

  return () => t;
},
      Jo = (e, t) => {
  const s = e.preserveEntrySignatures;
  return null == s && t.add("preserveEntrySignatures"), null != s ? s : "strict";
},
      eh = (e, t, s) => {
  const i = e.preserveModules;
  return i && ri('The "preserveModules" option is deprecated. Use the "output.preserveModules" option instead.', !1, t, s), i;
},
      th = (e, t, s) => {
  const i = e.treeshake;
  if (!1 === i) return !1;

  if ("string" == typeof i) {
    const e = Wo[i];
    if (e) return e;
    Us(Xs("treeshake", `valid values are false, true, ${ie(Object.keys(Wo))}. You can also supply an object for more fine-grained control`));
  }

  let n = {};

  if ("object" == typeof i) {
    void 0 !== i.pureExternalModules && ri('The "treeshake.pureExternalModules" option is deprecated. The "treeshake.moduleSideEffects" option should be used instead. "treeshake.pureExternalModules: true" is equivalent to "treeshake.moduleSideEffects: \'no-external\'"', !0, t, s), n = i;
    const e = i.preset;

    if (e) {
      const t = Wo[e];
      t ? n = { ...t,
        ...i
      } : Us(Xs("treeshake.preset", `valid values are ${ie(Object.keys(Wo))}`));
    }
  }

  return {
    annotations: !1 !== n.annotations,
    correctVarValueBeforeDeclaration: !0 === n.correctVarValueBeforeDeclaration,
    moduleSideEffects: "object" == typeof i && i.pureExternalModules ? sh(i.moduleSideEffects, i.pureExternalModules) : sh(n.moduleSideEffects, void 0),
    propertyReadSideEffects: "always" === n.propertyReadSideEffects ? "always" : !1 !== n.propertyReadSideEffects,
    tryCatchDeoptimization: !1 !== n.tryCatchDeoptimization,
    unknownGlobalSideEffects: !1 !== n.unknownGlobalSideEffects
  };
},
      sh = (e, t) => {
  if ("boolean" == typeof e) return () => e;
  if ("no-external" === e) return (e, t) => !t;
  if ("function" == typeof e) return (t, s) => !!t.startsWith("\0") || !1 !== e(t, s);

  if (Array.isArray(e)) {
    const t = new Set(e);
    return e => t.has(e);
  }

  e && Us(Xs("treeshake.moduleSideEffects", 'please use one of false, "no-external", a function or an array'));
  const s = qo(t);
  return (e, t) => !(t && s(e));
};

function ih(e) {
  const t = /^[a-z]:/i.exec(e),
        s = t ? t[0] : "";
  return s + e.substr(s.length).replace(/[\0?*:]/g, "_");
}

const nh = (e, t, s) => {
  const {
    file: i
  } = e;

  if ("string" == typeof i) {
    if (t) return Us({
      code: "INVALID_OPTION",
      message: 'You must set "output.dir" instead of "output.file" when using the "output.preserveModules" option.'
    });
    if (!Array.isArray(s.input)) return Us({
      code: "INVALID_OPTION",
      message: 'You must set "output.dir" instead of "output.file" when providing named inputs.'
    });
  }

  return i;
},
      rh = e => {
  const t = e.format;

  switch (t) {
    case void 0:
    case "es":
    case "esm":
    case "module":
      return "es";

    case "cjs":
    case "commonjs":
      return "cjs";

    case "system":
    case "systemjs":
      return "system";

    case "amd":
    case "iife":
    case "umd":
      return t;

    default:
      return Us({
        message: 'You must specify "output.format", which can be one of "amd", "cjs", "system", "es", "iife" or "umd".',
        url: "https://rollupjs.org/guide/en/#outputformat"
      });
  }
},
      ah = (e, t) => {
  var s;
  const i = (null !== (s = e.inlineDynamicImports) && void 0 !== s ? s : t.inlineDynamicImports) || !1,
        {
    input: n
  } = t;
  return i && (Array.isArray(n) ? n : Object.keys(n)).length > 1 ? Us({
    code: "INVALID_OPTION",
    message: 'Multiple inputs are not supported for "output.inlineDynamicImports".'
  }) : i;
},
      oh = (e, t, s) => {
  var i;
  const n = (null !== (i = e.preserveModules) && void 0 !== i ? i : s.preserveModules) || !1;

  if (n) {
    if (t) return Us({
      code: "INVALID_OPTION",
      message: 'The "output.inlineDynamicImports" option is not supported for "output.preserveModules".'
    });
    if (!1 === s.preserveEntrySignatures) return Us({
      code: "INVALID_OPTION",
      message: 'Setting "preserveEntrySignatures" to "false" is not supported for "output.preserveModules".'
    });
  }

  return n;
},
      hh = e => {
  const {
    preserveModulesRoot: t
  } = e;
  if (null != t) return $(t);
},
      lh = e => {
  const t = {
    autoId: !1,
    basePath: "",
    define: "define",
    ...e.amd
  };
  if ((t.autoId || t.basePath) && t.id) return Us({
    code: "INVALID_OPTION",
    message: '"output.amd.autoId"/"output.amd.basePath" and "output.amd.id" cannot be used together.'
  });
  if (t.basePath && !t.autoId) return Us({
    code: "INVALID_OPTION",
    message: '"output.amd.basePath" only works with "output.amd.autoId".'
  });
  let s;
  return s = t.autoId ? {
    autoId: !0,
    basePath: t.basePath,
    define: t.define
  } : {
    autoId: !1,
    define: t.define,
    id: t.id
  }, s;
},
      ch = (e, t) => {
  const s = e[t];
  return "function" == typeof s ? s : () => s || "";
},
      uh = (e, t) => {
  const {
    dir: s
  } = e;
  return "string" == typeof s && "string" == typeof t ? Us({
    code: "INVALID_OPTION",
    message: 'You must set either "output.file" for a single-file build or "output.dir" when generating multiple chunks.'
  }) : s;
},
      dh = (e, t) => {
  const s = e.dynamicImportFunction;
  return s && ni('The "output.dynamicImportFunction" option is deprecated. Use the "renderDynamicImport" plugin hook instead.', !1, t), s;
},
      ph = (e, t) => {
  const s = e.entryFileNames;
  return null == s && t.add("entryFileNames"), null != s ? s : "[name].js";
};

function fh(e, t) {
  const s = e.exports;
  if (null == s) t.add("exports");else if (!["default", "named", "none", "auto"].includes(s)) return Us((i = s, {
    code: Hs.INVALID_EXPORT_OPTION,
    message: `"output.exports" must be "default", "named", "none", "auto", or left unspecified (defaults to "auto"), received "${i}"`,
    url: "https://rollupjs.org/guide/en/#outputexports"
  }));
  var i;
  return s || "auto";
}

const mh = (e, t) => {
  if (t) return "";
  const s = e.indent;
  return !1 === s ? "" : null == s || s;
},
      gh = new Set(["auto", "esModule", "default", "defaultOnly", !0, !1]),
      yh = (e, t) => {
  const s = e.interop,
        i = new Set(),
        n = e => {
    if (!i.has(e)) {
      if (i.add(e), !gh.has(e)) return Us({
        code: "INVALID_OPTION",
        message: `The value ${JSON.stringify(e)} is not supported for "output.interop". Use one of ${Array.from(gh.values(), e => JSON.stringify(e)).join(", ")} instead.`,
        url: "https://rollupjs.org/guide/en/#outputinterop"
      });
      "boolean" == typeof e && ni({
        message: `The boolean value "${e}" for the "output.interop" option is deprecated. Use ${e ? '"auto"' : '"esModule", "default" or "defaultOnly"'} instead.`,
        url: "https://rollupjs.org/guide/en/#outputinterop"
      }, !1, t);
    }

    return e;
  };

  if ("function" == typeof s) {
    const e = Object.create(null);
    let t = null;
    return i => null === i ? t || n(t = s(i)) : i in e ? e[i] : n(e[i] = s(i));
  }

  return void 0 === s ? () => !0 : () => n(s);
},
      Eh = (e, t, s, i) => {
  const n = e.manualChunks || i.manualChunks;

  if (n) {
    if (t) return Us({
      code: "INVALID_OPTION",
      message: 'The "output.manualChunks" option is not supported for "output.inlineDynamicImports".'
    });
    if (s) return Us({
      code: "INVALID_OPTION",
      message: 'The "output.manualChunks" option is not supported for "output.preserveModules".'
    });
  }

  return n || {};
},
      xh = (e, t, s) => {
  var i;
  return null !== (i = e.minifyInternalExports) && void 0 !== i ? i : s || "es" === t || "system" === t;
};

function vh(e) {
  return async function (e, t) {
    const {
      options: s,
      unsetOptions: i
    } = await async function (e, t) {
      if (!e) throw new Error("You must supply an options object to rollup");

      const s = Bo(e.plugins),
            {
        options: i,
        unsetOptions: n
      } = function (e) {
        var t, s, i;
        const n = new Set(),
              r = null !== (t = e.context) && void 0 !== t ? t : "undefined",
              a = jo(e),
              o = e.strictDeprecations || !1,
              h = {
          acorn: Uo(e),
          acornInjectPlugins: Go(e),
          cache: Ho(e),
          context: r,
          experimentalCacheExpiry: null !== (s = e.experimentalCacheExpiry) && void 0 !== s ? s : 10,
          external: qo(e.external),
          inlineDynamicImports: Ko(e, a, o),
          input: Xo(e),
          makeAbsoluteExternalsRelative: null === (i = e.makeAbsoluteExternalsRelative) || void 0 === i || i,
          manualChunks: Yo(e, a, o),
          maxParallelFileReads: Qo(e),
          moduleContext: Zo(e, r),
          onwarn: a,
          perf: e.perf || !1,
          plugins: Bo(e.plugins),
          preserveEntrySignatures: Jo(e, n),
          preserveModules: eh(e, a, o),
          preserveSymlinks: e.preserveSymlinks || !1,
          shimMissingExports: e.shimMissingExports || !1,
          strictDeprecations: o,
          treeshake: th(e, a, o)
        };
        return zo(e, [...Object.keys(h), "watch"], "input options", h.onwarn, /^(output)$/), {
          options: h,
          unsetOptions: n
        };
      }(await s.reduce(function (e) {
        return async (t, s) => s.options && (await s.options.call({
          meta: {
            rollupVersion: "2.56.3",
            watchMode: e
          }
        }, await t)) || t;
      }(t), Promise.resolve(e)));

      return bh(i.plugins, "at position "), {
        options: i,
        unsetOptions: n
      };
    }(e, null !== t);
    Fi(s);
    const n = new Vo(s, t),
          r = !1 !== e.cache;
    delete s.cache, delete e.cache, Li("BUILD", 1);

    try {
      await n.pluginDriver.hookParallel("buildStart", [s]), await n.build();
    } catch (e) {
      const t = Object.keys(n.watchFiles);
      throw t.length > 0 && (e.watchFiles = t), await n.pluginDriver.hookParallel("buildEnd", [e]), await n.pluginDriver.hookParallel("closeBundle", []), e;
    }

    await n.pluginDriver.hookParallel("buildEnd", []), Di("BUILD", 1);
    const a = {
      cache: r ? n.getCache() : void 0,

      async close() {
        a.closed || (a.closed = !0, await n.pluginDriver.hookParallel("closeBundle", []));
      },

      closed: !1,
      generate: async e => a.closed ? Us(ii()) : Sh(!1, s, i, e, n),
      watchFiles: Object.keys(n.watchFiles),
      write: async e => a.closed ? Us(ii()) : Sh(!0, s, i, e, n)
    };
    s.perf && (a.getTimings = Oi);
    return a;
  }(e, null);
}

function bh(e, t) {
  for (let s = 0; s < e.length; s++) {
    const i = e[s];
    i.name || (i.name = `${t}${s + 1}`);
  }
}

async function Sh(e, t, s, i, n) {
  const {
    options: r,
    outputPluginDriver: a,
    unsetOptions: o
  } = function (e, t, s, i) {
    if (!e) throw new Error("You must supply an options object");
    const n = Bo(e.plugins);
    bh(n, "at output position ");
    const r = t.createOutputPluginDriver(n);
    return { ...Ah(s, i, e, r),
      outputPluginDriver: r
    };
  }(i, n.pluginDriver, t, s),
        h = new Tr(r, o, t, a, n),
        l = await h.generate(e);

  if (e) {
    if (!r.dir && !r.file) return Us({
      code: "MISSING_OPTION",
      message: 'You must specify "output.file" or "output.dir" for the build.'
    });
    await Promise.all(Object.values(l).map(e => function (e, t) {
      const s = $(t.dir || I(t.file), e.fileName);
      let i, n;
      if ("asset" === e.type) n = e.source;else if (n = e.code, t.sourcemap && e.map) {
        let r;
        "inline" === t.sourcemap ? r = e.map.toUrl() : (r = `${w(e.fileName)}.map`, i = vo(`${s}.map`, e.map.toString())), "hidden" !== t.sourcemap && (n += `//# sourceMappingURL=${r}\n`);
      }
      return Promise.all([vo(s, n), i]);
    }(e, r))), await a.hookParallel("writeBundle", [r, l]);
  }

  return c = l, {
    output: Object.values(c).filter(e => Object.keys(e).length > 0).sort((e, t) => {
      const s = kh(e),
            i = kh(t);
      return s === i ? 0 : s < i ? -1 : 1;
    })
  };
  var c;
}

function Ah(e, t, s, i) {
  return function (e, t, s) {
    var i, n, r, a, o, h, l;
    const c = new Set(s),
          u = e.compact || !1,
          d = rh(e),
          p = ah(e, t),
          f = oh(e, p, t),
          m = nh(e, f, t),
          g = {
      amd: lh(e),
      assetFileNames: null !== (i = e.assetFileNames) && void 0 !== i ? i : "assets/[name]-[hash][extname]",
      banner: ch(e, "banner"),
      chunkFileNames: null !== (n = e.chunkFileNames) && void 0 !== n ? n : "[name]-[hash].js",
      compact: u,
      dir: uh(e, m),
      dynamicImportFunction: dh(e, t),
      entryFileNames: ph(e, c),
      esModule: null === (r = e.esModule) || void 0 === r || r,
      exports: fh(e, c),
      extend: e.extend || !1,
      externalLiveBindings: null === (a = e.externalLiveBindings) || void 0 === a || a,
      file: m,
      footer: ch(e, "footer"),
      format: d,
      freeze: null === (o = e.freeze) || void 0 === o || o,
      globals: e.globals || {},
      hoistTransitiveImports: null === (h = e.hoistTransitiveImports) || void 0 === h || h,
      indent: mh(e, u),
      inlineDynamicImports: p,
      interop: yh(e, t),
      intro: ch(e, "intro"),
      manualChunks: Eh(e, p, f, t),
      minifyInternalExports: xh(e, d, u),
      name: e.name,
      namespaceToStringTag: e.namespaceToStringTag || !1,
      noConflict: e.noConflict || !1,
      outro: ch(e, "outro"),
      paths: e.paths || {},
      plugins: Bo(e.plugins),
      preferConst: e.preferConst || !1,
      preserveModules: f,
      preserveModulesRoot: hh(e),
      sanitizeFileName: "function" == typeof e.sanitizeFileName ? e.sanitizeFileName : !1 === e.sanitizeFileName ? e => e : ih,
      sourcemap: e.sourcemap || !1,
      sourcemapExcludeSources: e.sourcemapExcludeSources || !1,
      sourcemapFile: e.sourcemapFile,
      sourcemapPathTransform: e.sourcemapPathTransform,
      strict: null === (l = e.strict) || void 0 === l || l,
      systemNullSetters: e.systemNullSetters || !1,
      validate: e.validate || !1
    };
    return zo(e, Object.keys(g), "output options", t.onwarn), {
      options: g,
      unsetOptions: c
    };
  }(i.hookReduceArg0Sync("outputOptions", [s.output || s], (e, t) => t || e, e => {
    const t = () => e.error({
      code: Hs.CANNOT_EMIT_FROM_OPTIONS_HOOK,
      message: 'Cannot emit files or set asset sources in the "outputOptions" hook, use the "renderStart" hook instead.'
    });

    return { ...e,
      emitFile: t,
      setAssetSource: t
    };
  }), e, t);
}

var Ph;

function kh(e) {
  return "asset" === e.type ? Ph.ASSET : e.isEntry ? Ph.ENTRY_CHUNK : Ph.SECONDARY_CHUNK;
}

!function (e) {
  e[e.ENTRY_CHUNK = 0] = "ENTRY_CHUNK", e[e.SECONDARY_CHUNK = 1] = "SECONDARY_CHUNK", e[e.ASSET = 2] = "ASSET";
}(Ph || (Ph = {}));

export { vh as rollup };
