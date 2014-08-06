var hasValue = function(v) {
    return (!!(typeof v !== 'undefined' && v !== null));
};

var isFunction = function(fn) {
    return (!!(typeof fn !== 'undefined' && fn !== null && typeof fn === 'function'));
};

var isObject = function(v) {
    return (!!(typeof v === 'object' && v !== null));
};

/* **********************************************
     Begin stampit_0.7.1.js
********************************************** */

!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.stampit=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var forIn = _dereq_('mout/object/forIn');

function copyProp(val, key){
    this[key] = val;
}

module.exports = function mixInChain(target, objects){
    var i = 0,
        n = arguments.length,
        obj;
    while(++i < n){
        obj = arguments[i];
        if (obj != null) {
            forIn(obj, copyProp, target);
        }
    }
    return target;
};

},{"mout/object/forIn":14}],2:[function(_dereq_,module,exports){


    /**
     * Array forEach
     */
    function forEach(arr, callback, thisObj) {
        if (arr == null) {
            return;
        }
        var i = -1,
            len = arr.length;
        while (++i < len) {
            // we iterate over sparse items since there is no way to make it
            // work properly on IE 7-8. see #64
            if ( callback.call(thisObj, arr[i], i, arr) === false ) {
                break;
            }
        }
    }

    module.exports = forEach;



},{}],3:[function(_dereq_,module,exports){
var forEach = _dereq_('./forEach');
var makeIterator = _dereq_('../function/makeIterator_');

    /**
     * Array map
     */
    function map(arr, callback, thisObj) {
        callback = makeIterator(callback, thisObj);
        var results = [];
        if (arr == null){
            return results;
        }

        var i = -1, len = arr.length;
        while (++i < len) {
            results[i] = callback(arr[i], i, arr);
        }

        return results;
    }

     module.exports = map;


},{"../function/makeIterator_":4,"./forEach":2}],4:[function(_dereq_,module,exports){
var prop = _dereq_('./prop');
var deepMatches = _dereq_('../object/deepMatches');

    /**
     * Converts argument into a valid iterator.
     * Used internally on most array/object/collection methods that receives a
     * callback/iterator providing a shortcut syntax.
     */
    function makeIterator(src, thisObj){
        switch(typeof src) {
            case 'object':
                // typeof null == "object"
                return (src != null)? function(val, key, target){
                    return deepMatches(val, src);
                } : src;
            case 'string':
            case 'number':
                return prop(src);
            case 'function':
                if (typeof thisObj === 'undefined') {
                    return src;
                } else {
                    return function(val, i, arr){
                        return src.call(thisObj, val, i, arr);
                    };
                }
            default:
                return src;
        }
    }

    module.exports = makeIterator;



},{"../object/deepMatches":13,"./prop":5}],5:[function(_dereq_,module,exports){


    /**
     * Returns a function that gets a property of the passed object
     */
    function prop(name){
        return function(obj){
            return obj[name];
        };
    }

    module.exports = prop;



},{}],6:[function(_dereq_,module,exports){
var kindOf = _dereq_('./kindOf');
var isPlainObject = _dereq_('./isPlainObject');
var mixIn = _dereq_('../object/mixIn');

    /**
     * Clone native types.
     */
    function clone(val){
        switch (kindOf(val)) {
            case 'Object':
                return cloneObject(val);
            case 'Array':
                return cloneArray(val);
            case 'RegExp':
                return cloneRegExp(val);
            case 'Date':
                return cloneDate(val);
            default:
                return val;
        }
    }

    function cloneObject(source) {
        if (isPlainObject(source)) {
            return mixIn({}, source);
        } else {
            return source;
        }
    }

    function cloneRegExp(r) {
        var flags = '';
        flags += r.multiline ? 'm' : '';
        flags += r.global ? 'g' : '';
        flags += r.ignorecase ? 'i' : '';
        return new RegExp(r.source, flags);
    }

    function cloneDate(date) {
        return new Date(+date);
    }

    function cloneArray(arr) {
        return arr.slice();
    }

    module.exports = clone;



},{"../object/mixIn":18,"./isPlainObject":11,"./kindOf":12}],7:[function(_dereq_,module,exports){
var clone = _dereq_('./clone');
var forOwn = _dereq_('../object/forOwn');
var kindOf = _dereq_('./kindOf');
var isPlainObject = _dereq_('./isPlainObject');

    /**
     * Recursively clone native types.
     */
    function deepClone(val, instanceClone) {
        switch ( kindOf(val) ) {
            case 'Object':
                return cloneObject(val, instanceClone);
            case 'Array':
                return cloneArray(val, instanceClone);
            default:
                return clone(val);
        }
    }

    function cloneObject(source, instanceClone) {
        if (isPlainObject(source)) {
            var out = {};
            forOwn(source, function(val, key) {
                this[key] = deepClone(val, instanceClone);
            }, out);
            return out;
        } else if (instanceClone) {
            return instanceClone(source);
        } else {
            return source;
        }
    }

    function cloneArray(arr, instanceClone) {
        var out = [],
            i = -1,
            n = arr.length,
            val;
        while (++i < n) {
            out[i] = deepClone(arr[i], instanceClone);
        }
        return out;
    }

    module.exports = deepClone;




},{"../object/forOwn":15,"./clone":6,"./isPlainObject":11,"./kindOf":12}],8:[function(_dereq_,module,exports){
var isKind = _dereq_('./isKind');
    /**
     */
    var isArray = Array.isArray || function (val) {
        return isKind(val, 'Array');
    };
    module.exports = isArray;


},{"./isKind":9}],9:[function(_dereq_,module,exports){
var kindOf = _dereq_('./kindOf');
    /**
     * Check if value is from a specific "kind".
     */
    function isKind(val, kind){
        return kindOf(val) === kind;
    }
    module.exports = isKind;


},{"./kindOf":12}],10:[function(_dereq_,module,exports){
var isKind = _dereq_('./isKind');
    /**
     */
    function isObject(val) {
        return isKind(val, 'Object');
    }
    module.exports = isObject;


},{"./isKind":9}],11:[function(_dereq_,module,exports){


    /**
     * Checks if the value is created by the `Object` constructor.
     */
    function isPlainObject(value) {
        return (!!value
            && typeof value === 'object'
            && value.constructor === Object);
    }

    module.exports = isPlainObject;



},{}],12:[function(_dereq_,module,exports){


    var _rKind = /^\[object (.*)\]$/,
        _toString = Object.prototype.toString,
        UNDEF;

    /**
     * Gets the "kind" of value. (e.g. "String", "Number", etc)
     */
    function kindOf(val) {
        if (val === null) {
            return 'Null';
        } else if (val === UNDEF) {
            return 'Undefined';
        } else {
            return _rKind.exec( _toString.call(val) )[1];
        }
    }
    module.exports = kindOf;


},{}],13:[function(_dereq_,module,exports){
var forOwn = _dereq_('./forOwn');
var isArray = _dereq_('../lang/isArray');

    function containsMatch(array, pattern) {
        var i = -1, length = array.length;
        while (++i < length) {
            if (deepMatches(array[i], pattern)) {
                return true;
            }
        }

        return false;
    }

    function matchArray(target, pattern) {
        var i = -1, patternLength = pattern.length;
        while (++i < patternLength) {
            if (!containsMatch(target, pattern[i])) {
                return false;
            }
        }

        return true;
    }

    function matchObject(target, pattern) {
        var result = true;
        forOwn(pattern, function(val, key) {
            if (!deepMatches(target[key], val)) {
                // Return false to break out of forOwn early
                return (result = false);
            }
        });

        return result;
    }

    /**
     * Recursively check if the objects match.
     */
    function deepMatches(target, pattern){
        if (target && typeof target === 'object') {
            if (isArray(target) && isArray(pattern)) {
                return matchArray(target, pattern);
            } else {
                return matchObject(target, pattern);
            }
        } else {
            return target === pattern;
        }
    }

    module.exports = deepMatches;



},{"../lang/isArray":8,"./forOwn":15}],14:[function(_dereq_,module,exports){


    var _hasDontEnumBug,
        _dontEnums;

    function checkDontEnum(){
        _dontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ];

        _hasDontEnumBug = true;

        for (var key in {'toString': null}) {
            _hasDontEnumBug = false;
        }
    }

    /**
     * Similar to Array/forEach but works over object properties and fixes Don't
     * Enum bug on IE.
     * based on: http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
     */
    function forIn(obj, fn, thisObj){
        var key, i = 0;
        // no need to check if argument is a real object that way we can use
        // it for arrays, functions, date, etc.

        //post-pone check till needed
        if (_hasDontEnumBug == null) checkDontEnum();

        for (key in obj) {
            if (exec(fn, obj, key, thisObj) === false) {
                break;
            }
        }

        if (_hasDontEnumBug) {
            while (key = _dontEnums[i++]) {
                // since we aren't using hasOwn check we need to make sure the
                // property was overwritten
                if (obj[key] !== Object.prototype[key]) {
                    if (exec(fn, obj, key, thisObj) === false) {
                        break;
                    }
                }
            }
        }
    }

    function exec(fn, obj, key, thisObj){
        return fn.call(thisObj, obj[key], key, obj);
    }

    module.exports = forIn;



},{}],15:[function(_dereq_,module,exports){
var hasOwn = _dereq_('./hasOwn');
var forIn = _dereq_('./forIn');

    /**
     * Similar to Array/forEach but works over object properties and fixes Don't
     * Enum bug on IE.
     * based on: http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
     */
    function forOwn(obj, fn, thisObj){
        forIn(obj, function(val, key){
            if (hasOwn(obj, key)) {
                return fn.call(thisObj, obj[key], key, obj);
            }
        });
    }

    module.exports = forOwn;



},{"./forIn":14,"./hasOwn":16}],16:[function(_dereq_,module,exports){


    /**
     * Safer Object.hasOwnProperty
     */
     function hasOwn(obj, prop){
         return Object.prototype.hasOwnProperty.call(obj, prop);
     }

     module.exports = hasOwn;



},{}],17:[function(_dereq_,module,exports){
var hasOwn = _dereq_('./hasOwn');
var deepClone = _dereq_('../lang/deepClone');
var isObject = _dereq_('../lang/isObject');

    /**
     * Deep merge objects.
     */
    function merge() {
        var i = 1,
            key, val, obj, target;

        // make sure we don't modify source element and it's properties
        // objects are passed by reference
        target = deepClone( arguments[0] );

        while (obj = arguments[i++]) {
            for (key in obj) {
                if ( ! hasOwn(obj, key) ) {
                    continue;
                }

                val = obj[key];

                if ( isObject(val) && isObject(target[key]) ){
                    // inception, deep merge objects
                    target[key] = merge(target[key], val);
                } else {
                    // make sure arrays, regexp, date, objects are cloned
                    target[key] = deepClone(val);
                }

            }
        }

        return target;
    }

    module.exports = merge;



},{"../lang/deepClone":7,"../lang/isObject":10,"./hasOwn":16}],18:[function(_dereq_,module,exports){
var forOwn = _dereq_('./forOwn');

    /**
    * Combine properties from all the objects into first one.
    * - This method affects target object in place, if you want to create a new Object pass an empty object as first param.
    * @param {object} target    Target Object
    * @param {...object} objects    Objects to be combined (0...n objects).
    * @return {object} Target Object.
    */
    function mixIn(target, objects){
        var i = 0,
            n = arguments.length,
            obj;
        while(++i < n){
            obj = arguments[i];
            if (obj != null) {
                forOwn(obj, copyProp, target);
            }
        }
        return target;
    }

    function copyProp(val, key){
        this[key] = val;
    }

    module.exports = mixIn;


},{"./forOwn":15}],19:[function(_dereq_,module,exports){
/**
 * Stampit
 **
 * Create objects from reusable, composable behaviors.
 **
 * Copyright (c) 2013 Eric Elliott
 * http://opensource.org/licenses/MIT
 **/
'use strict';
var forEach = _dereq_('mout/array/forEach');
var mixIn = _dereq_('mout/object/mixIn');
var merge = _dereq_('mout/object/merge');
var map = _dereq_('mout/array/map');
var forOwn = _dereq_('mout/object/forOwn');
var mixInChain = _dereq_('./mixinchain.js');
var slice = [].slice;

var create = function (o) {
  if (arguments.length > 1) {
    throw new Error('Object.create implementation only accepts the first parameter.');
  }
  function F() {}
  F.prototype = o;
  return new F();
};

if(!Array.isArray) {
  Array.isArray = function (vArg) {
    return Object.prototype.toString.call(vArg) === "[object Array]";
  };
}

var extractFunctions = function extractFunctions(arg) {
  var arr = [],
    args = [].slice.call(arguments);

  if (typeof arg === 'function') {
    arr = map(args, function (fn) {
      if (typeof fn === 'function') {
        return fn;
      }
    });
  } else if (typeof arg === 'object') {
    forEach(args, function (obj) {
      forOwn(obj, function (fn) {
        arr.push(fn);
      });
    });
  } else if ( Array.isArray(arg) ) {
    forEach(arg, function (fn) {
      arr.push(fn);
    });
  }
  return arr;
};

/**
 * Return a factory function that will produce new objects using the
 * prototypes that are passed in or composed.
 *
 * @param  {Object} [methods] A map of method names and bodies for delegation.
 * @param  {Object} [state]   A map of property names and values to clone for each new object.
 * @param  {Function} [enclose] A closure (function) used to create private data and privileged methods.
 * @return {Function} factory A factory to produce objects using the given prototypes.
 * @return {Function} factory.create Just like calling the factory function.
 * @return {Object} factory.fixed An object map containing the fixed prototypes.
 * @return {Function} factory.methods Add methods to the methods prototype. Chainable.
 * @return {Function} factory.state Add properties to the state prototype. Chainable.
 * @return {Function} factory.enclose Add or replace the closure prototype. Not chainable.
 */
var stampit = function stampit(methods, state, enclose) {
  var fixed = {
      methods: methods || {},
      state: state,
      enclose: extractFunctions(enclose)
    },

    factory = function factory(properties) {
      var state = merge({}, fixed.state),
        instance = mixIn(create(fixed.methods || {}),
          state, properties),
        closures = fixed.enclose,
        args = slice.call(arguments, 1);

      forEach(closures, function (fn) {
        if (typeof fn === 'function') {
          instance = fn.apply(instance, args) || instance;
        }
      });

      return instance;
    };

  return mixIn(factory, {
    create: factory,
    fixed: fixed,
    /**
     * Take n objects and add them to the methods prototype.
     * @return {Object} stamp  The factory in question (`this`).
     */
    methods: function stampMethods() {
      var obj = fixed.methods || {},
        args = [obj].concat([].slice.call(arguments));
      fixed.methods = mixInChain.apply(this, args);
      return this;
    },
    /**
     * Take n objects and add them to the state prototype.
     * @return {Object} stamp  The factory in question (`this`).
     */
    state: function stampState() {
      var obj = fixed.state || {},
        args = [obj].concat([].slice.call(arguments));
      fixed.state = mixIn.apply(this, args);
      return this;
    },
    /**
     * Take n functions, an array of functions, or n objects and add
     * the functions to the enclose prototype.
     * @return {Object} stamp  The factory in question (`this`).
     */
    enclose: function stampEnclose() {
      fixed.enclose = fixed.enclose
        .concat( extractFunctions.apply(null, arguments) );
      return this;
    }
  });
};

/**
 * Take two or more factories produced from stampit() and
 * combine them to produce a new factory. Combining overrides
 * properties with last-in priority.
 *
 * @param {...Function} factory A factory produced by stampit().
 * @return {Function} A new stampit factory composed from arguments.
 */
var compose = function compose() {
  var args = [].slice.call(arguments),
    obj = stampit();

  forEach(args, function (source) {
    if (source) {
      if (source.fixed.methods) {
        obj.fixed.methods = mixInChain({}, obj.fixed.methods,
          source.fixed.methods);
      }

      if (source.fixed.state) {
        obj.fixed.state = mixIn({}, obj.fixed.state,
          source.fixed.state);
      }

      if (source.fixed.enclose) {
        obj.fixed.enclose = obj.fixed.enclose
          .concat(source.fixed.enclose);
      }
    }
  });

  return stampit(obj.fixed.methods, obj.fixed.state,
    obj.fixed.enclose);
};

/**
 * Take an old-fashioned JS constructor and return a stampit stamp
 * that you can freely compose with other stamps.
 * @param  {Function} Constructor 
 * @return {Function}             A composable stampit factory
 *                                (aka stamp).
 */
var convertConstructor = function convertConstructor(Constructor) {
  return stampit().methods(Constructor.prototype).enclose(Constructor);
};

module.exports = mixIn(stampit, {
  compose: compose,
  /**
   * Alias for mixIn
   */
  extend: mixIn,
  /**
   * Take a destination object followed by one or more source objects,
   * and copy the source object properties to the destination object,
   * with last in priority overrides.
   * @param {Object} destination An object to copy properties to.
   * @param {...Object} source An object to copy properties from.
   * @returns {Object}
   */
  mixIn: mixIn,

  convertConstructor: convertConstructor
});

},{"./mixinchain.js":1,"mout/array/forEach":2,"mout/array/map":3,"mout/object/forOwn":15,"mout/object/merge":17,"mout/object/mixIn":18}]},{},[19])
(19)
});

/* **********************************************
     Begin q-1.0.1.js
********************************************** */

// vim:ts=4:sts=4:sw=4:
/*!
 *
 * Copyright 2009-2012 Kris Kowal under the terms of the MIT
 * license found at http://github.com/kriskowal/q/raw/master/LICENSE
 *
 * With parts by Tyler Close
 * Copyright 2007-2009 Tyler Close under the terms of the MIT X license found
 * at http://www.opensource.org/licenses/mit-license.html
 * Forked at ref_send.js version: 2009-05-11
 *
 * With parts by Mark Miller
 * Copyright (C) 2011 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

(function (definition) {
    // Turn off strict mode for this function so we can assign to global.Q
    /* jshint strict: false */

    // This file will function properly as a <script> tag, or a module
    // using CommonJS and NodeJS or RequireJS module formats.  In
    // Common/Node/RequireJS, the module exports the Q API and when
    // executed as a simple <script>, it creates a Q global instead.

    // Montage Require
    if (typeof bootstrap === "function") {
        bootstrap("promise", definition);

    // CommonJS
    } else if (typeof exports === "object") {
        module.exports = definition();

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
        define(definition);

    // SES (Secure EcmaScript)
    } else if (typeof ses !== "undefined") {
        if (!ses.ok()) {
            return;
        } else {
            ses.makeQ = definition;
        }

    // <script>
    } else {
        Q = definition();
    }

})(function () {
"use strict";

var hasStacks = false;
try {
    throw new Error();
} catch (e) {
    hasStacks = !!e.stack;
}

// All code after this point will be filtered from stack traces reported
// by Q.
var qStartingLine = captureLine();
var qFileName;

// shims

// used for fallback in "allResolved"
var noop = function () {};

// Use the fastest possible means to execute a task in a future turn
// of the event loop.
var nextTick =(function () {
    // linked list of tasks (single, with head node)
    var head = {task: void 0, next: null};
    var tail = head;
    var flushing = false;
    var requestTick = void 0;
    var isNodeJS = false;

    function flush() {
        /* jshint loopfunc: true */

        while (head.next) {
            head = head.next;
            var task = head.task;
            head.task = void 0;
            var domain = head.domain;

            if (domain) {
                head.domain = void 0;
                domain.enter();
            }

            try {
                task();

            } catch (e) {
                if (isNodeJS) {
                    // In node, uncaught exceptions are considered fatal errors.
                    // Re-throw them synchronously to interrupt flushing!

                    // Ensure continuation if the uncaught exception is suppressed
                    // listening "uncaughtException" events (as domains does).
                    // Continue in next event to avoid tick recursion.
                    if (domain) {
                        domain.exit();
                    }
                    setTimeout(flush, 0);
                    if (domain) {
                        domain.enter();
                    }

                    throw e;

                } else {
                    // In browsers, uncaught exceptions are not fatal.
                    // Re-throw them asynchronously to avoid slow-downs.
                    setTimeout(function() {
                       throw e;
                    }, 0);
                }
            }

            if (domain) {
                domain.exit();
            }
        }

        flushing = false;
    }

    nextTick = function (task) {
        tail = tail.next = {
            task: task,
            domain: isNodeJS && process.domain,
            next: null
        };

        if (!flushing) {
            flushing = true;
            requestTick();
        }
    };

    if (typeof process !== "undefined" && process.nextTick) {
        // Node.js before 0.9. Note that some fake-Node environments, like the
        // Mocha test runner, introduce a `process` global without a `nextTick`.
        isNodeJS = true;

        requestTick = function () {
            process.nextTick(flush);
        };

    } else if (typeof setImmediate === "function") {
        // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
        if (typeof window !== "undefined") {
            requestTick = setImmediate.bind(window, flush);
        } else {
            requestTick = function () {
                setImmediate(flush);
            };
        }

    } else if (typeof MessageChannel !== "undefined") {
        // modern browsers
        // http://www.nonblocking.io/2011/06/windownexttick.html
        var channel = new MessageChannel();
        // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
        // working message ports the first time a page loads.
        channel.port1.onmessage = function () {
            requestTick = requestPortTick;
            channel.port1.onmessage = flush;
            flush();
        };
        var requestPortTick = function () {
            // Opera requires us to provide a message payload, regardless of
            // whether we use it.
            channel.port2.postMessage(0);
        };
        requestTick = function () {
            setTimeout(flush, 0);
            requestPortTick();
        };

    } else {
        // old browsers
        requestTick = function () {
            setTimeout(flush, 0);
        };
    }

    return nextTick;
})();

// Attempt to make generics safe in the face of downstream
// modifications.
// There is no situation where this is necessary.
// If you need a security guarantee, these primordials need to be
// deeply frozen anyway, and if you don’t need a security guarantee,
// this is just plain paranoid.
// However, this **might** have the nice side-effect of reducing the size of
// the minified code by reducing x.call() to merely x()
// See Mark Miller’s explanation of what this does.
// http://wiki.ecmascript.org/doku.php?id=conventions:safe_meta_programming
var call = Function.call;
function uncurryThis(f) {
    return function () {
        return call.apply(f, arguments);
    };
}
// This is equivalent, but slower:
// uncurryThis = Function_bind.bind(Function_bind.call);
// http://jsperf.com/uncurrythis

var array_slice = uncurryThis(Array.prototype.slice);

var array_reduce = uncurryThis(
    Array.prototype.reduce || function (callback, basis) {
        var index = 0,
            length = this.length;
        // concerning the initial value, if one is not provided
        if (arguments.length === 1) {
            // seek to the first value in the array, accounting
            // for the possibility that is is a sparse array
            do {
                if (index in this) {
                    basis = this[index++];
                    break;
                }
                if (++index >= length) {
                    throw new TypeError();
                }
            } while (1);
        }
        // reduce
        for (; index < length; index++) {
            // account for the possibility that the array is sparse
            if (index in this) {
                basis = callback(basis, this[index], index);
            }
        }
        return basis;
    }
);

var array_indexOf = uncurryThis(
    Array.prototype.indexOf || function (value) {
        // not a very good shim, but good enough for our one use of it
        for (var i = 0; i < this.length; i++) {
            if (this[i] === value) {
                return i;
            }
        }
        return -1;
    }
);

var array_map = uncurryThis(
    Array.prototype.map || function (callback, thisp) {
        var self = this;
        var collect = [];
        array_reduce(self, function (undefined, value, index) {
            collect.push(callback.call(thisp, value, index, self));
        }, void 0);
        return collect;
    }
);

var object_create = Object.create || function (prototype) {
    function Type() { }
    Type.prototype = prototype;
    return new Type();
};

var object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);

var object_keys = Object.keys || function (object) {
    var keys = [];
    for (var key in object) {
        if (object_hasOwnProperty(object, key)) {
            keys.push(key);
        }
    }
    return keys;
};

var object_toString = uncurryThis(Object.prototype.toString);

function isObject(value) {
    return value === Object(value);
}

// generator related shims

// FIXME: Remove this function once ES6 generators are in SpiderMonkey.
function isStopIteration(exception) {
    return (
        object_toString(exception) === "[object StopIteration]" ||
        exception instanceof QReturnValue
    );
}

// FIXME: Remove this helper and Q.return once ES6 generators are in
// SpiderMonkey.
var QReturnValue;
if (typeof ReturnValue !== "undefined") {
    QReturnValue = ReturnValue;
} else {
    QReturnValue = function (value) {
        this.value = value;
    };
}

// long stack traces

var STACK_JUMP_SEPARATOR = "From previous event:";

function makeStackTraceLong(error, promise) {
    // If possible, transform the error stack trace by removing Node and Q
    // cruft, then concatenating with the stack trace of `promise`. See #57.
    if (hasStacks &&
        promise.stack &&
        typeof error === "object" &&
        error !== null &&
        error.stack &&
        error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1
    ) {
        var stacks = [];
        for (var p = promise; !!p; p = p.source) {
            if (p.stack) {
                stacks.unshift(p.stack);
            }
        }
        stacks.unshift(error.stack);

        var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");
        error.stack = filterStackString(concatedStacks);
    }
}

function filterStackString(stackString) {
    var lines = stackString.split("\n");
    var desiredLines = [];
    for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];

        if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
            desiredLines.push(line);
        }
    }
    return desiredLines.join("\n");
}

function isNodeFrame(stackLine) {
    return stackLine.indexOf("(module.js:") !== -1 ||
           stackLine.indexOf("(node.js:") !== -1;
}

function getFileNameAndLineNumber(stackLine) {
    // Named functions: "at functionName (filename:lineNumber:columnNumber)"
    // In IE10 function name can have spaces ("Anonymous function") O_o
    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
    if (attempt1) {
        return [attempt1[1], Number(attempt1[2])];
    }

    // Anonymous functions: "at filename:lineNumber:columnNumber"
    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
    if (attempt2) {
        return [attempt2[1], Number(attempt2[2])];
    }

    // Firefox style: "function@filename:lineNumber or @filename:lineNumber"
    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
    if (attempt3) {
        return [attempt3[1], Number(attempt3[2])];
    }
}

function isInternalFrame(stackLine) {
    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);

    if (!fileNameAndLineNumber) {
        return false;
    }

    var fileName = fileNameAndLineNumber[0];
    var lineNumber = fileNameAndLineNumber[1];

    return fileName === qFileName &&
        lineNumber >= qStartingLine &&
        lineNumber <= qEndingLine;
}

// discover own file name and line number range for filtering stack
// traces
function captureLine() {
    if (!hasStacks) {
        return;
    }

    try {
        throw new Error();
    } catch (e) {
        var lines = e.stack.split("\n");
        var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
        var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
        if (!fileNameAndLineNumber) {
            return;
        }

        qFileName = fileNameAndLineNumber[0];
        return fileNameAndLineNumber[1];
    }
}

function deprecate(callback, name, alternative) {
    return function () {
        if (typeof console !== "undefined" &&
            typeof console.warn === "function") {
            console.warn(name + " is deprecated, use " + alternative +
                         " instead.", new Error("").stack);
        }
        return callback.apply(callback, arguments);
    };
}

// end of shims
// beginning of real work

/**
 * Constructs a promise for an immediate reference, passes promises through, or
 * coerces promises from different systems.
 * @param value immediate reference or promise
 */
function Q(value) {
    // If the object is already a Promise, return it directly.  This enables
    // the resolve function to both be used to created references from objects,
    // but to tolerably coerce non-promises to promises.
    if (isPromise(value)) {
        return value;
    }

    // assimilate thenables
    if (isPromiseAlike(value)) {
        return coerce(value);
    } else {
        return fulfill(value);
    }
}
Q.resolve = Q;

/**
 * Performs a task in a future turn of the event loop.
 * @param {Function} task
 */
Q.nextTick = nextTick;

/**
 * Controls whether or not long stack traces will be on
 */
Q.longStackSupport = false;

/**
 * Constructs a {promise, resolve, reject} object.
 *
 * `resolve` is a callback to invoke with a more resolved value for the
 * promise. To fulfill the promise, invoke `resolve` with any value that is
 * not a thenable. To reject the promise, invoke `resolve` with a rejected
 * thenable, or invoke `reject` with the reason directly. To resolve the
 * promise to another thenable, thus putting it in the same state, invoke
 * `resolve` with that other thenable.
 */
Q.defer = defer;
function defer() {
    // if "messages" is an "Array", that indicates that the promise has not yet
    // been resolved.  If it is "undefined", it has been resolved.  Each
    // element of the messages array is itself an array of complete arguments to
    // forward to the resolved promise.  We coerce the resolution value to a
    // promise using the `resolve` function because it handles both fully
    // non-thenable values and other thenables gracefully.
    var messages = [], progressListeners = [], resolvedPromise;

    var deferred = object_create(defer.prototype);
    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, operands) {
        var args = array_slice(arguments);
        if (messages) {
            messages.push(args);
            if (op === "when" && operands[1]) { // progress operand
                progressListeners.push(operands[1]);
            }
        } else {
            nextTick(function () {
                resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
            });
        }
    };

    // XXX deprecated
    promise.valueOf = function () {
        if (messages) {
            return promise;
        }
        var nearerValue = nearer(resolvedPromise);
        if (isPromise(nearerValue)) {
            resolvedPromise = nearerValue; // shorten chain
        }
        return nearerValue;
    };

    promise.inspect = function () {
        if (!resolvedPromise) {
            return { state: "pending" };
        }
        return resolvedPromise.inspect();
    };

    if (Q.longStackSupport && hasStacks) {
        try {
            throw new Error();
        } catch (e) {
            // NOTE: don't try to use `Error.captureStackTrace` or transfer the
            // accessor around; that causes memory leaks as per GH-111. Just
            // reify the stack trace as a string ASAP.
            //
            // At the same time, cut off the first line; it's always just
            // "[object Promise]\n", as per the `toString`.
            promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1);
        }
    }

    // NOTE: we do the checks for `resolvedPromise` in each method, instead of
    // consolidating them into `become`, since otherwise we'd create new
    // promises with the lines `become(whatever(value))`. See e.g. GH-252.

    function become(newPromise) {
        resolvedPromise = newPromise;
        promise.source = newPromise;

        array_reduce(messages, function (undefined, message) {
            nextTick(function () {
                newPromise.promiseDispatch.apply(newPromise, message);
            });
        }, void 0);

        messages = void 0;
        progressListeners = void 0;
    }

    deferred.promise = promise;
    deferred.resolve = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(Q(value));
    };

    deferred.fulfill = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(fulfill(value));
    };
    deferred.reject = function (reason) {
        if (resolvedPromise) {
            return;
        }

        become(reject(reason));
    };
    deferred.notify = function (progress) {
        if (resolvedPromise) {
            return;
        }

        array_reduce(progressListeners, function (undefined, progressListener) {
            nextTick(function () {
                progressListener(progress);
            });
        }, void 0);
    };

    return deferred;
}

/**
 * Creates a Node-style callback that will resolve or reject the deferred
 * promise.
 * @returns a nodeback
 */
defer.prototype.makeNodeResolver = function () {
    var self = this;
    return function (error, value) {
        if (error) {
            self.reject(error);
        } else if (arguments.length > 2) {
            self.resolve(array_slice(arguments, 1));
        } else {
            self.resolve(value);
        }
    };
};

/**
 * @param resolver {Function} a function that returns nothing and accepts
 * the resolve, reject, and notify functions for a deferred.
 * @returns a promise that may be resolved with the given resolve and reject
 * functions, or rejected by a thrown exception in resolver
 */
Q.Promise = promise; // ES6
Q.promise = promise;
function promise(resolver) {
    if (typeof resolver !== "function") {
        throw new TypeError("resolver must be a function.");
    }
    var deferred = defer();
    try {
        resolver(deferred.resolve, deferred.reject, deferred.notify);
    } catch (reason) {
        deferred.reject(reason);
    }
    return deferred.promise;
}

promise.race = race; // ES6
promise.all = all; // ES6
promise.reject = reject; // ES6
promise.resolve = Q; // ES6

// XXX experimental.  This method is a way to denote that a local value is
// serializable and should be immediately dispatched to a remote upon request,
// instead of passing a reference.
Q.passByCopy = function (object) {
    //freeze(object);
    //passByCopies.set(object, true);
    return object;
};

Promise.prototype.passByCopy = function () {
    //freeze(object);
    //passByCopies.set(object, true);
    return this;
};

/**
 * If two promises eventually fulfill to the same value, promises that value,
 * but otherwise rejects.
 * @param x {Any*}
 * @param y {Any*}
 * @returns {Any*} a promise for x and y if they are the same, but a rejection
 * otherwise.
 *
 */
Q.join = function (x, y) {
    return Q(x).join(y);
};

Promise.prototype.join = function (that) {
    return Q([this, that]).spread(function (x, y) {
        if (x === y) {
            // TODO: "===" should be Object.is or equiv
            return x;
        } else {
            throw new Error("Can't join: not the same: " + x + " " + y);
        }
    });
};

/**
 * Returns a promise for the first of an array of promises to become fulfilled.
 * @param answers {Array[Any*]} promises to race
 * @returns {Any*} the first promise to be fulfilled
 */
Q.race = race;
function race(answerPs) {
    return promise(function(resolve, reject) {
        // Switch to this once we can assume at least ES5
        // answerPs.forEach(function(answerP) {
        //     Q(answerP).then(resolve, reject);
        // });
        // Use this in the meantime
        for (var i = 0, len = answerPs.length; i < len; i++) {
            Q(answerPs[i]).then(resolve, reject);
        }
    });
}

Promise.prototype.race = function () {
    return this.then(Q.race);
};

/**
 * Constructs a Promise with a promise descriptor object and optional fallback
 * function.  The descriptor contains methods like when(rejected), get(name),
 * set(name, value), post(name, args), and delete(name), which all
 * return either a value, a promise for a value, or a rejection.  The fallback
 * accepts the operation name, a resolver, and any further arguments that would
 * have been forwarded to the appropriate method above had a method been
 * provided with the proper name.  The API makes no guarantees about the nature
 * of the returned object, apart from that it is usable whereever promises are
 * bought and sold.
 */
Q.makePromise = Promise;
function Promise(descriptor, fallback, inspect) {
    if (fallback === void 0) {
        fallback = function (op) {
            return reject(new Error(
                "Promise does not support operation: " + op
            ));
        };
    }
    if (inspect === void 0) {
        inspect = function () {
            return {state: "unknown"};
        };
    }

    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, args) {
        var result;
        try {
            if (descriptor[op]) {
                result = descriptor[op].apply(promise, args);
            } else {
                result = fallback.call(promise, op, args);
            }
        } catch (exception) {
            result = reject(exception);
        }
        if (resolve) {
            resolve(result);
        }
    };

    promise.inspect = inspect;

    // XXX deprecated `valueOf` and `exception` support
    if (inspect) {
        var inspected = inspect();
        if (inspected.state === "rejected") {
            promise.exception = inspected.reason;
        }

        promise.valueOf = function () {
            var inspected = inspect();
            if (inspected.state === "pending" ||
                inspected.state === "rejected") {
                return promise;
            }
            return inspected.value;
        };
    }

    return promise;
}

Promise.prototype.toString = function () {
    return "[object Promise]";
};

Promise.prototype.then = function (fulfilled, rejected, progressed) {
    var self = this;
    var deferred = defer();
    var done = false;   // ensure the untrusted promise makes at most a
                        // single call to one of the callbacks

    function _fulfilled(value) {
        try {
            return typeof fulfilled === "function" ? fulfilled(value) : value;
        } catch (exception) {
            return reject(exception);
        }
    }

    function _rejected(exception) {
        if (typeof rejected === "function") {
            makeStackTraceLong(exception, self);
            try {
                return rejected(exception);
            } catch (newException) {
                return reject(newException);
            }
        }
        return reject(exception);
    }

    function _progressed(value) {
        return typeof progressed === "function" ? progressed(value) : value;
    }

    nextTick(function () {
        self.promiseDispatch(function (value) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_fulfilled(value));
        }, "when", [function (exception) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_rejected(exception));
        }]);
    });

    // Progress propagator need to be attached in the current tick.
    self.promiseDispatch(void 0, "when", [void 0, function (value) {
        var newValue;
        var threw = false;
        try {
            newValue = _progressed(value);
        } catch (e) {
            threw = true;
            if (Q.onerror) {
                Q.onerror(e);
            } else {
                throw e;
            }
        }

        if (!threw) {
            deferred.notify(newValue);
        }
    }]);

    return deferred.promise;
};

/**
 * Registers an observer on a promise.
 *
 * Guarantees:
 *
 * 1. that fulfilled and rejected will be called only once.
 * 2. that either the fulfilled callback or the rejected callback will be
 *    called, but not both.
 * 3. that fulfilled and rejected will not be called in this turn.
 *
 * @param value      promise or immediate reference to observe
 * @param fulfilled  function to be called with the fulfilled value
 * @param rejected   function to be called with the rejection exception
 * @param progressed function to be called on any progress notifications
 * @return promise for the return value from the invoked callback
 */
Q.when = when;
function when(value, fulfilled, rejected, progressed) {
    return Q(value).then(fulfilled, rejected, progressed);
}

Promise.prototype.thenResolve = function (value) {
    return this.then(function () { return value; });
};

Q.thenResolve = function (promise, value) {
    return Q(promise).thenResolve(value);
};

Promise.prototype.thenReject = function (reason) {
    return this.then(function () { throw reason; });
};

Q.thenReject = function (promise, reason) {
    return Q(promise).thenReject(reason);
};

/**
 * If an object is not a promise, it is as "near" as possible.
 * If a promise is rejected, it is as "near" as possible too.
 * If it’s a fulfilled promise, the fulfillment value is nearer.
 * If it’s a deferred promise and the deferred has been resolved, the
 * resolution is "nearer".
 * @param object
 * @returns most resolved (nearest) form of the object
 */

// XXX should we re-do this?
Q.nearer = nearer;
function nearer(value) {
    if (isPromise(value)) {
        var inspected = value.inspect();
        if (inspected.state === "fulfilled") {
            return inspected.value;
        }
    }
    return value;
}

/**
 * @returns whether the given object is a promise.
 * Otherwise it is a fulfilled value.
 */
Q.isPromise = isPromise;
function isPromise(object) {
    return isObject(object) &&
        typeof object.promiseDispatch === "function" &&
        typeof object.inspect === "function";
}

Q.isPromiseAlike = isPromiseAlike;
function isPromiseAlike(object) {
    return isObject(object) && typeof object.then === "function";
}

/**
 * @returns whether the given object is a pending promise, meaning not
 * fulfilled or rejected.
 */
Q.isPending = isPending;
function isPending(object) {
    return isPromise(object) && object.inspect().state === "pending";
}

Promise.prototype.isPending = function () {
    return this.inspect().state === "pending";
};

/**
 * @returns whether the given object is a value or fulfilled
 * promise.
 */
Q.isFulfilled = isFulfilled;
function isFulfilled(object) {
    return !isPromise(object) || object.inspect().state === "fulfilled";
}

Promise.prototype.isFulfilled = function () {
    return this.inspect().state === "fulfilled";
};

/**
 * @returns whether the given object is a rejected promise.
 */
Q.isRejected = isRejected;
function isRejected(object) {
    return isPromise(object) && object.inspect().state === "rejected";
}

Promise.prototype.isRejected = function () {
    return this.inspect().state === "rejected";
};

//// BEGIN UNHANDLED REJECTION TRACKING

// This promise library consumes exceptions thrown in handlers so they can be
// handled by a subsequent promise.  The exceptions get added to this array when
// they are created, and removed when they are handled.  Note that in ES6 or
// shimmed environments, this would naturally be a `Set`.
var unhandledReasons = [];
var unhandledRejections = [];
var trackUnhandledRejections = true;

function resetUnhandledRejections() {
    unhandledReasons.length = 0;
    unhandledRejections.length = 0;

    if (!trackUnhandledRejections) {
        trackUnhandledRejections = true;
    }
}

function trackRejection(promise, reason) {
    if (!trackUnhandledRejections) {
        return;
    }

    unhandledRejections.push(promise);
    if (reason && typeof reason.stack !== "undefined") {
        unhandledReasons.push(reason.stack);
    } else {
        unhandledReasons.push("(no stack) " + reason);
    }
}

function untrackRejection(promise) {
    if (!trackUnhandledRejections) {
        return;
    }

    var at = array_indexOf(unhandledRejections, promise);
    if (at !== -1) {
        unhandledRejections.splice(at, 1);
        unhandledReasons.splice(at, 1);
    }
}

Q.resetUnhandledRejections = resetUnhandledRejections;

Q.getUnhandledReasons = function () {
    // Make a copy so that consumers can't interfere with our internal state.
    return unhandledReasons.slice();
};

Q.stopUnhandledRejectionTracking = function () {
    resetUnhandledRejections();
    trackUnhandledRejections = false;
};

resetUnhandledRejections();

//// END UNHANDLED REJECTION TRACKING

/**
 * Constructs a rejected promise.
 * @param reason value describing the failure
 */
Q.reject = reject;
function reject(reason) {
    var rejection = Promise({
        "when": function (rejected) {
            // note that the error has been handled
            if (rejected) {
                untrackRejection(this);
            }
            return rejected ? rejected(reason) : this;
        }
    }, function fallback() {
        return this;
    }, function inspect() {
        return { state: "rejected", reason: reason };
    });

    // Note that the reason has not been handled.
    trackRejection(rejection, reason);

    return rejection;
}

/**
 * Constructs a fulfilled promise for an immediate reference.
 * @param value immediate reference
 */
Q.fulfill = fulfill;
function fulfill(value) {
    return Promise({
        "when": function () {
            return value;
        },
        "get": function (name) {
            return value[name];
        },
        "set": function (name, rhs) {
            value[name] = rhs;
        },
        "delete": function (name) {
            delete value[name];
        },
        "post": function (name, args) {
            // Mark Miller proposes that post with no name should apply a
            // promised function.
            if (name === null || name === void 0) {
                return value.apply(void 0, args);
            } else {
                return value[name].apply(value, args);
            }
        },
        "apply": function (thisp, args) {
            return value.apply(thisp, args);
        },
        "keys": function () {
            return object_keys(value);
        }
    }, void 0, function inspect() {
        return { state: "fulfilled", value: value };
    });
}

/**
 * Converts thenables to Q promises.
 * @param promise thenable promise
 * @returns a Q promise
 */
function coerce(promise) {
    var deferred = defer();
    nextTick(function () {
        try {
            promise.then(deferred.resolve, deferred.reject, deferred.notify);
        } catch (exception) {
            deferred.reject(exception);
        }
    });
    return deferred.promise;
}

/**
 * Annotates an object such that it will never be
 * transferred away from this process over any promise
 * communication channel.
 * @param object
 * @returns promise a wrapping of that object that
 * additionally responds to the "isDef" message
 * without a rejection.
 */
Q.master = master;
function master(object) {
    return Promise({
        "isDef": function () {}
    }, function fallback(op, args) {
        return dispatch(object, op, args);
    }, function () {
        return Q(object).inspect();
    });
}

/**
 * Spreads the values of a promised array of arguments into the
 * fulfillment callback.
 * @param fulfilled callback that receives variadic arguments from the
 * promised array
 * @param rejected callback that receives the exception if the promise
 * is rejected.
 * @returns a promise for the return value or thrown exception of
 * either callback.
 */
Q.spread = spread;
function spread(value, fulfilled, rejected) {
    return Q(value).spread(fulfilled, rejected);
}

Promise.prototype.spread = function (fulfilled, rejected) {
    return this.all().then(function (array) {
        return fulfilled.apply(void 0, array);
    }, rejected);
};

/**
 * The async function is a decorator for generator functions, turning
 * them into asynchronous generators.  Although generators are only part
 * of the newest ECMAScript 6 drafts, this code does not cause syntax
 * errors in older engines.  This code should continue to work and will
 * in fact improve over time as the language improves.
 *
 * ES6 generators are currently part of V8 version 3.19 with the
 * --harmony-generators runtime flag enabled.  SpiderMonkey has had them
 * for longer, but under an older Python-inspired form.  This function
 * works on both kinds of generators.
 *
 * Decorates a generator function such that:
 *  - it may yield promises
 *  - execution will continue when that promise is fulfilled
 *  - the value of the yield expression will be the fulfilled value
 *  - it returns a promise for the return value (when the generator
 *    stops iterating)
 *  - the decorated function returns a promise for the return value
 *    of the generator or the first rejected promise among those
 *    yielded.
 *  - if an error is thrown in the generator, it propagates through
 *    every following yield until it is caught, or until it escapes
 *    the generator function altogether, and is translated into a
 *    rejection for the promise returned by the decorated generator.
 */
Q.async = async;
function async(makeGenerator) {
    return function () {
        // when verb is "send", arg is a value
        // when verb is "throw", arg is an exception
        function continuer(verb, arg) {
            var result;

            // Until V8 3.19 / Chromium 29 is released, SpiderMonkey is the only
            // engine that has a deployed base of browsers that support generators.
            // However, SM's generators use the Python-inspired semantics of
            // outdated ES6 drafts.  We would like to support ES6, but we'd also
            // like to make it possible to use generators in deployed browsers, so
            // we also support Python-style generators.  At some point we can remove
            // this block.

            if (typeof StopIteration === "undefined") {
                // ES6 Generators
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    return reject(exception);
                }
                if (result.done) {
                    return result.value;
                } else {
                    return when(result.value, callback, errback);
                }
            } else {
                // SpiderMonkey Generators
                // FIXME: Remove this case when SM does ES6 generators.
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    if (isStopIteration(exception)) {
                        return exception.value;
                    } else {
                        return reject(exception);
                    }
                }
                return when(result, callback, errback);
            }
        }
        var generator = makeGenerator.apply(this, arguments);
        var callback = continuer.bind(continuer, "next");
        var errback = continuer.bind(continuer, "throw");
        return callback();
    };
}

/**
 * The spawn function is a small wrapper around async that immediately
 * calls the generator and also ends the promise chain, so that any
 * unhandled errors are thrown instead of forwarded to the error
 * handler. This is useful because it's extremely common to run
 * generators at the top-level to work with libraries.
 */
Q.spawn = spawn;
function spawn(makeGenerator) {
    Q.done(Q.async(makeGenerator)());
}

// FIXME: Remove this interface once ES6 generators are in SpiderMonkey.
/**
 * Throws a ReturnValue exception to stop an asynchronous generator.
 *
 * This interface is a stop-gap measure to support generator return
 * values in older Firefox/SpiderMonkey.  In browsers that support ES6
 * generators like Chromium 29, just use "return" in your generator
 * functions.
 *
 * @param value the return value for the surrounding generator
 * @throws ReturnValue exception with the value.
 * @example
 * // ES6 style
 * Q.async(function* () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      return foo + bar;
 * })
 * // Older SpiderMonkey style
 * Q.async(function () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      Q.return(foo + bar);
 * })
 */
Q["return"] = _return;
function _return(value) {
    throw new QReturnValue(value);
}

/**
 * The promised function decorator ensures that any promise arguments
 * are settled and passed as values (`this` is also settled and passed
 * as a value).  It will also ensure that the result of a function is
 * always a promise.
 *
 * @example
 * var add = Q.promised(function (a, b) {
 *     return a + b;
 * });
 * add(Q(a), Q(B));
 *
 * @param {function} callback The function to decorate
 * @returns {function} a function that has been decorated.
 */
Q.promised = promised;
function promised(callback) {
    return function () {
        return spread([this, all(arguments)], function (self, args) {
            return callback.apply(self, args);
        });
    };
}

/**
 * sends a message to a value in a future turn
 * @param object* the recipient
 * @param op the name of the message operation, e.g., "when",
 * @param args further arguments to be forwarded to the operation
 * @returns result {Promise} a promise for the result of the operation
 */
Q.dispatch = dispatch;
function dispatch(object, op, args) {
    return Q(object).dispatch(op, args);
}

Promise.prototype.dispatch = function (op, args) {
    var self = this;
    var deferred = defer();
    nextTick(function () {
        self.promiseDispatch(deferred.resolve, op, args);
    });
    return deferred.promise;
};

/**
 * Gets the value of a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to get
 * @return promise for the property value
 */
Q.get = function (object, key) {
    return Q(object).dispatch("get", [key]);
};

Promise.prototype.get = function (key) {
    return this.dispatch("get", [key]);
};

/**
 * Sets the value of a property in a future turn.
 * @param object    promise or immediate reference for object object
 * @param name      name of property to set
 * @param value     new value of property
 * @return promise for the return value
 */
Q.set = function (object, key, value) {
    return Q(object).dispatch("set", [key, value]);
};

Promise.prototype.set = function (key, value) {
    return this.dispatch("set", [key, value]);
};

/**
 * Deletes a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to delete
 * @return promise for the return value
 */
Q.del = // XXX legacy
Q["delete"] = function (object, key) {
    return Q(object).dispatch("delete", [key]);
};

Promise.prototype.del = // XXX legacy
Promise.prototype["delete"] = function (key) {
    return this.dispatch("delete", [key]);
};

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param value     a value to post, typically an array of
 *                  invocation arguments for promises that
 *                  are ultimately backed with `resolve` values,
 *                  as opposed to those backed with URLs
 *                  wherein the posted value can be any
 *                  JSON serializable object.
 * @return promise for the return value
 */
// bound locally because it is used by other methods
Q.mapply = // XXX As proposed by "Redsandro"
Q.post = function (object, name, args) {
    return Q(object).dispatch("post", [name, args]);
};

Promise.prototype.mapply = // XXX As proposed by "Redsandro"
Promise.prototype.post = function (name, args) {
    return this.dispatch("post", [name, args]);
};

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param ...args   array of invocation arguments
 * @return promise for the return value
 */
Q.send = // XXX Mark Miller's proposed parlance
Q.mcall = // XXX As proposed by "Redsandro"
Q.invoke = function (object, name /*...args*/) {
    return Q(object).dispatch("post", [name, array_slice(arguments, 2)]);
};

Promise.prototype.send = // XXX Mark Miller's proposed parlance
Promise.prototype.mcall = // XXX As proposed by "Redsandro"
Promise.prototype.invoke = function (name /*...args*/) {
    return this.dispatch("post", [name, array_slice(arguments, 1)]);
};

/**
 * Applies the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param args      array of application arguments
 */
Q.fapply = function (object, args) {
    return Q(object).dispatch("apply", [void 0, args]);
};

Promise.prototype.fapply = function (args) {
    return this.dispatch("apply", [void 0, args]);
};

/**
 * Calls the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q["try"] =
Q.fcall = function (object /* ...args*/) {
    return Q(object).dispatch("apply", [void 0, array_slice(arguments, 1)]);
};

Promise.prototype.fcall = function (/*...args*/) {
    return this.dispatch("apply", [void 0, array_slice(arguments)]);
};

/**
 * Binds the promised function, transforming return values into a fulfilled
 * promise and thrown errors into a rejected one.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q.fbind = function (object /*...args*/) {
    var promise = Q(object);
    var args = array_slice(arguments, 1);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};
Promise.prototype.fbind = function (/*...args*/) {
    var promise = this;
    var args = array_slice(arguments);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};

/**
 * Requests the names of the owned properties of a promised
 * object in a future turn.
 * @param object    promise or immediate reference for target object
 * @return promise for the keys of the eventually settled object
 */
Q.keys = function (object) {
    return Q(object).dispatch("keys", []);
};

Promise.prototype.keys = function () {
    return this.dispatch("keys", []);
};

/**
 * Turns an array of promises into a promise for an array.  If any of
 * the promises gets rejected, the whole array is rejected immediately.
 * @param {Array*} an array (or promise for an array) of values (or
 * promises for values)
 * @returns a promise for an array of the corresponding values
 */
// By Mark Miller
// http://wiki.ecmascript.org/doku.php?id=strawman:concurrency&rev=1308776521#allfulfilled
Q.all = all;
function all(promises) {
    return when(promises, function (promises) {
        var countDown = 0;
        var deferred = defer();
        array_reduce(promises, function (undefined, promise, index) {
            var snapshot;
            if (
                isPromise(promise) &&
                (snapshot = promise.inspect()).state === "fulfilled"
            ) {
                promises[index] = snapshot.value;
            } else {
                ++countDown;
                when(
                    promise,
                    function (value) {
                        promises[index] = value;
                        if (--countDown === 0) {
                            deferred.resolve(promises);
                        }
                    },
                    deferred.reject,
                    function (progress) {
                        deferred.notify({ index: index, value: progress });
                    }
                );
            }
        }, void 0);
        if (countDown === 0) {
            deferred.resolve(promises);
        }
        return deferred.promise;
    });
}

Promise.prototype.all = function () {
    return all(this);
};

/**
 * Waits for all promises to be settled, either fulfilled or
 * rejected.  This is distinct from `all` since that would stop
 * waiting at the first rejection.  The promise returned by
 * `allResolved` will never be rejected.
 * @param promises a promise for an array (or an array) of promises
 * (or values)
 * @return a promise for an array of promises
 */
Q.allResolved = deprecate(allResolved, "allResolved", "allSettled");
function allResolved(promises) {
    return when(promises, function (promises) {
        promises = array_map(promises, Q);
        return when(all(array_map(promises, function (promise) {
            return when(promise, noop, noop);
        })), function () {
            return promises;
        });
    });
}

Promise.prototype.allResolved = function () {
    return allResolved(this);
};

/**
 * @see Promise#allSettled
 */
Q.allSettled = allSettled;
function allSettled(promises) {
    return Q(promises).allSettled();
}

/**
 * Turns an array of promises into a promise for an array of their states (as
 * returned by `inspect`) when they have all settled.
 * @param {Array[Any*]} values an array (or promise for an array) of values (or
 * promises for values)
 * @returns {Array[State]} an array of states for the respective values.
 */
Promise.prototype.allSettled = function () {
    return this.then(function (promises) {
        return all(array_map(promises, function (promise) {
            promise = Q(promise);
            function regardless() {
                return promise.inspect();
            }
            return promise.then(regardless, regardless);
        }));
    });
};

/**
 * Captures the failure of a promise, giving an oportunity to recover
 * with a callback.  If the given promise is fulfilled, the returned
 * promise is fulfilled.
 * @param {Any*} promise for something
 * @param {Function} callback to fulfill the returned promise if the
 * given promise is rejected
 * @returns a promise for the return value of the callback
 */
Q.fail = // XXX legacy
Q["catch"] = function (object, rejected) {
    return Q(object).then(void 0, rejected);
};

Promise.prototype.fail = // XXX legacy
Promise.prototype["catch"] = function (rejected) {
    return this.then(void 0, rejected);
};

/**
 * Attaches a listener that can respond to progress notifications from a
 * promise's originating deferred. This listener receives the exact arguments
 * passed to ``deferred.notify``.
 * @param {Any*} promise for something
 * @param {Function} callback to receive any progress notifications
 * @returns the given promise, unchanged
 */
Q.progress = progress;
function progress(object, progressed) {
    return Q(object).then(void 0, void 0, progressed);
}

Promise.prototype.progress = function (progressed) {
    return this.then(void 0, void 0, progressed);
};

/**
 * Provides an opportunity to observe the settling of a promise,
 * regardless of whether the promise is fulfilled or rejected.  Forwards
 * the resolution to the returned promise when the callback is done.
 * The callback can return a promise to defer completion.
 * @param {Any*} promise
 * @param {Function} callback to observe the resolution of the given
 * promise, takes no arguments.
 * @returns a promise for the resolution of the given promise when
 * ``fin`` is done.
 */
Q.fin = // XXX legacy
Q["finally"] = function (object, callback) {
    return Q(object)["finally"](callback);
};

Promise.prototype.fin = // XXX legacy
Promise.prototype["finally"] = function (callback) {
    callback = Q(callback);
    return this.then(function (value) {
        return callback.fcall().then(function () {
            return value;
        });
    }, function (reason) {
        // TODO attempt to recycle the rejection with "this".
        return callback.fcall().then(function () {
            throw reason;
        });
    });
};

/**
 * Terminates a chain of promises, forcing rejections to be
 * thrown as exceptions.
 * @param {Any*} promise at the end of a chain of promises
 * @returns nothing
 */
Q.done = function (object, fulfilled, rejected, progress) {
    return Q(object).done(fulfilled, rejected, progress);
};

Promise.prototype.done = function (fulfilled, rejected, progress) {
    var onUnhandledError = function (error) {
        // forward to a future turn so that ``when``
        // does not catch it and turn it into a rejection.
        nextTick(function () {
            makeStackTraceLong(error, promise);
            if (Q.onerror) {
                Q.onerror(error);
            } else {
                throw error;
            }
        });
    };

    // Avoid unnecessary `nextTick`ing via an unnecessary `when`.
    var promise = fulfilled || rejected || progress ?
        this.then(fulfilled, rejected, progress) :
        this;

    if (typeof process === "object" && process && process.domain) {
        onUnhandledError = process.domain.bind(onUnhandledError);
    }

    promise.then(void 0, onUnhandledError);
};

/**
 * Causes a promise to be rejected if it does not get fulfilled before
 * some milliseconds time out.
 * @param {Any*} promise
 * @param {Number} milliseconds timeout
 * @param {String} custom error message (optional)
 * @returns a promise for the resolution of the given promise if it is
 * fulfilled before the timeout, otherwise rejected.
 */
Q.timeout = function (object, ms, message) {
    return Q(object).timeout(ms, message);
};

Promise.prototype.timeout = function (ms, message) {
    var deferred = defer();
    var timeoutId = setTimeout(function () {
        deferred.reject(new Error(message || "Timed out after " + ms + " ms"));
    }, ms);

    this.then(function (value) {
        clearTimeout(timeoutId);
        deferred.resolve(value);
    }, function (exception) {
        clearTimeout(timeoutId);
        deferred.reject(exception);
    }, deferred.notify);

    return deferred.promise;
};

/**
 * Returns a promise for the given value (or promised value), some
 * milliseconds after it resolved. Passes rejections immediately.
 * @param {Any*} promise
 * @param {Number} milliseconds
 * @returns a promise for the resolution of the given promise after milliseconds
 * time has elapsed since the resolution of the given promise.
 * If the given promise rejects, that is passed immediately.
 */
Q.delay = function (object, timeout) {
    if (timeout === void 0) {
        timeout = object;
        object = void 0;
    }
    return Q(object).delay(timeout);
};

Promise.prototype.delay = function (timeout) {
    return this.then(function (value) {
        var deferred = defer();
        setTimeout(function () {
            deferred.resolve(value);
        }, timeout);
        return deferred.promise;
    });
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided as an array, and returns a promise.
 *
 *      Q.nfapply(FS.readFile, [__filename])
 *      .then(function (content) {
 *      })
 *
 */
Q.nfapply = function (callback, args) {
    return Q(callback).nfapply(args);
};

Promise.prototype.nfapply = function (args) {
    var deferred = defer();
    var nodeArgs = array_slice(args);
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided individually, and returns a promise.
 * @example
 * Q.nfcall(FS.readFile, __filename)
 * .then(function (content) {
 * })
 *
 */
Q.nfcall = function (callback /*...args*/) {
    var args = array_slice(arguments, 1);
    return Q(callback).nfapply(args);
};

Promise.prototype.nfcall = function (/*...args*/) {
    var nodeArgs = array_slice(arguments);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Wraps a NodeJS continuation passing function and returns an equivalent
 * version that returns a promise.
 * @example
 * Q.nfbind(FS.readFile, __filename)("utf-8")
 * .then(console.log)
 * .done()
 */
Q.nfbind =
Q.denodeify = function (callback /*...args*/) {
    var baseArgs = array_slice(arguments, 1);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        Q(callback).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nfbind =
Promise.prototype.denodeify = function (/*...args*/) {
    var args = array_slice(arguments);
    args.unshift(this);
    return Q.denodeify.apply(void 0, args);
};

Q.nbind = function (callback, thisp /*...args*/) {
    var baseArgs = array_slice(arguments, 2);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        function bound() {
            return callback.apply(thisp, arguments);
        }
        Q(bound).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nbind = function (/*thisp, ...args*/) {
    var args = array_slice(arguments, 0);
    args.unshift(this);
    return Q.nbind.apply(void 0, args);
};

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback with a given array of arguments, plus a provided callback.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param {Array} args arguments to pass to the method; the callback
 * will be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nmapply = // XXX As proposed by "Redsandro"
Q.npost = function (object, name, args) {
    return Q(object).npost(name, args);
};

Promise.prototype.nmapply = // XXX As proposed by "Redsandro"
Promise.prototype.npost = function (name, args) {
    var nodeArgs = array_slice(args || []);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback, forwarding the given variadic arguments, plus a provided
 * callback argument.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param ...args arguments to pass to the method; the callback will
 * be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nsend = // XXX Based on Mark Miller's proposed "send"
Q.nmcall = // XXX Based on "Redsandro's" proposal
Q.ninvoke = function (object, name /*...args*/) {
    var nodeArgs = array_slice(arguments, 2);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    Q(object).dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

Promise.prototype.nsend = // XXX Based on Mark Miller's proposed "send"
Promise.prototype.nmcall = // XXX Based on "Redsandro's" proposal
Promise.prototype.ninvoke = function (name /*...args*/) {
    var nodeArgs = array_slice(arguments, 1);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

/**
 * If a function would like to support both Node continuation-passing-style and
 * promise-returning-style, it can end its internal promise chain with
 * `nodeify(nodeback)`, forwarding the optional nodeback argument.  If the user
 * elects to use a nodeback, the result will be sent there.  If they do not
 * pass a nodeback, they will receive the result promise.
 * @param object a result (or a promise for a result)
 * @param {Function} nodeback a Node.js-style callback
 * @returns either the promise or nothing
 */
Q.nodeify = nodeify;
function nodeify(object, nodeback) {
    return Q(object).nodeify(nodeback);
}

Promise.prototype.nodeify = function (nodeback) {
    if (nodeback) {
        this.then(function (value) {
            nextTick(function () {
                nodeback(null, value);
            });
        }, function (error) {
            nextTick(function () {
                nodeback(error);
            });
        });
    } else {
        return this;
    }
};

// All code before this point will be filtered from stack traces.
var qEndingLine = captureLine();

return Q;

});


/* **********************************************
     Begin goinstant2.js
********************************************** */

window.goinstant2 = {};
window.goinstant2.BaseClasses = {};

goinstant2.BaseClasses.logger = stampit().enclose(function () {

    var _useLogging = false;
    var _useInfo = false;

    // Public API
    return stampit.mixIn(this, {

        debug: function(indents, classname, method, id, text, obj) {
            if (_useLogging){
                var out = "";
                _.times(indents, function(n) { out += "\t"; });

                out += classname;
                out += "::" + method + "()";
                out += " (" + id + ") ";
                out += text;
                if (obj && hasValue(obj)) {
                    console.debug(out, obj);
                }
                else {
                    console.debug(out);
                }
            }
        },
        log: function (indents, classname, method, a, b) {
            if (_useLogging) {

                var out = "";
                _.times(indents, function(n) { out += "\t"; });

                out += classname;
                out += "::" + method + "() ";


                if (hasValue(a) && isObject(b)) {
                    console.log(out + a.toString(), b);
                }
                else if (isObject(a) && hasValue(a)) {
                    console.log(out, a);
                }
                else if (hasValue(a)) {
                    console.log(out + " " + a.toString());
                }
                else {
                    console.log(out);
                }

            }
        },
        info: function (text, prefix, method) {
            if (_useLogging && _useInfo) {

                var out = "";
                out += hasValue(prefix) ? prefix + ": " : "";
                out += hasValue(method) ? method + "() - " : "";

                if (isObject(text)) {
                    console.info(out, "%O", text);
                }
                else {
                    out += text;
                    console.info(out);
                }
            }
        },
        error: function (classname, method, errorObject) {
            if (_useLogging) {

                var out = "";
                out += hasValue(classname) ? classname + "::" : "";
                out += hasValue(method) ? method + "() " : "";
                console.error(out, errorObject);
            }
        },
        useLogging: function (use) {
            if (use) {
                _useLogging = use;
                return this;
            }
            return _useLogging;
        }

    });
});

goinstant2.App = new goinstant2.BaseClasses.logger();
goinstant2.App.useLogging(true);

LOG = goinstant2.App.log;
INFO = goinstant2.App.info;
ERROR = goinstant2.App.error;
DEBUG = goinstant2.App.debug;

LOG_GROUP = function(value) {
    if (goinstant2.App.useLogging()) {
        console.group(value);
    }
};

LOG_GROUP_END = function() {
    if (goinstant2.App.useLogging()) {
        console.groupEnd();
    }
};

/* **********************************************
     Begin connection.js
********************************************** */

goinstant2.Connection = function(url) {
    return new goinstant2.BaseClasses.connection().url(url);
};

goinstant2.connect = function(url, a, b){
    return new goinstant2.Connection(url).connect(a,b);
};


goinstant2.BaseClasses.connection = stampit().enclose(function () {

    var _user = null;
    var _isGuest = false;
    var _pubnub = null;

    var _url, _publishKey, _subscribeKey, _secretKey;

    var _context = {
        connection: this,
        user: null,
        rooms: [],
        pubnub: null,
        keys: {}
    };

    function _processURL () {
        var keys = _url.slice(15).split("/");

        _context.keys = {
            publish_key: keys[0],
            subscribe_key: keys[1],
            secret_key: keys[2],
            origin: "pubsub-beta.pubnub.com"
        };

        _pubnub = PUBNUB.init({});
    }

    function _createPubnub() {
        // Create PUBNUB object with the appropriate keys
        _pubnub = PUBNUB.init(_context.keys);

        // Store in Context
        _context.pubnub = _pubnub;
    }

    // Public API
    return stampit.mixIn(this, {
        url: function(value) {
            if (value) {
                _url = value;
                _processURL();
                return this;
            }
            return _url;
        },
        context: function() {
            return _context;
        },
        connect: function(a,b) {
            //LOG(name, "Connection", "connect");
            var hasOptions = false;
            var hasCallback = false;
            var usePromise = false;

            var options, callback, deferred;

            var connectToRooms = [];

            // If a and b provided, they are options and callback
            // Else if only a is provided, it's either options + promise (object) OR callback (function)
            // Else nothing provided, so use Promise
            if (hasValue(a) && hasValue(b)) {
                hasOptions = true;
                hasCallback = true;
                options = a;
                callback = b;
            }
            else if (isFunction(a)) {
                hasCallback = true;
                callback = a;
            }
            else if (isObject(a)) {
                hasOptions = true;
                usePromise = true;
                options = a;

                DEBUG(0, "Connection", "connect", "", "promise created");
                deferred = Q.defer();
            }
            else {
                usePromise = true;
                DEBUG(0, "Connection", "connect", "", "promise created");
                deferred = Q.defer();
            }

            if (hasOptions) {
                LOG(options, "Connection", "connect - hasOptions");

                if (_.has(options, 'user') && hasValue(options.user)) {
                    _user = options.user;
                    if (_.has(options.user, 'token')) {
                        _user.id = user.token;
                    }
                }
                else {
                    _user = null;
                }

                if (_.has(options, "room")) {
                    connectToRooms.push(options.room);
                }
                else if (_.has(options, "rooms")) {
                    _.forEach(options.rooms, function(r){
                        connectToRooms.push(r);
                    });
                }

                if (_.has(options, "visible")) {
                    if (options.visible) {
                        console.warn("#goinstant2.connect option 'visible: false' not available in this SDK");
                    }
                }
            }

            if (!hasValue(_user)) {

                _user = {};

                // Add Randomized Guest Name if none provided
                if (!hasValue(_user.displayName)) {
                    _user.displayName = "Guest " + Math.floor((Math.random() * 100000) + 10000).toString();
                }

                // Add Random UserID if none provided
                if (!hasValue(_user.id)){
                    _user.id = _pubnub.uuid();
                }

            }

            _context.user = _user;
            _context.keys.state = _user;
            _createPubnub();

            // If no rooms are specified, connect to the 'lobby' room by default
            if (connectToRooms.length == 0) {
                connectToRooms.push('lobby');
            }

            // ***********************************************************************
            // RETURN RESULTS (callback and Q Promise)
            // ***********************************************************************

            DEBUG(0, "Connection", "connect", "", "connecting rooms", connectToRooms);

            // Connect to all the rooms via Promises
            var roomJoinChain = _.map(connectToRooms, function(name){

                var room = new goinstant2.BaseClasses.room();

                room.context(_context).name(name);

                if (hasValue(_user)) {
                    room.setUser(_user);
                }

                return room.join();
            });


            // If we are using a Q Promise, alter the subscribe params and defer resolution
            if (usePromise) {

                var resultObject = {
                    connection: this,
                    rooms: [],
                    context: _context
                };

                Q.allSettled(roomJoinChain).then(function(result){
                    INFO("check for errors on room joins", "Connection", "TODO - connect");

                    _.forEach(result, function(room){
                        _context.rooms.push(room.value.room);
                    });

                    resultObject.rooms = _context.rooms;

                    DEBUG(0, "Connection", "connect", "", "complete - promise", result);
                    deferred.resolve(resultObject);
                });

                return deferred.promise

            }
            else {

                var err = null;
                var resultsArray = [err];

                // Add this Connection Object to the results array
                resultsArray.push(this);

                INFO("Connection Errors are only generated from Room objects", "Connection", "connect");

                // Connect to Each Room specified
                Q.allSettled(roomJoinChain).then(function(result){

                    INFO("check for errors on room joins", "Connection", "TODO - connect");

                    _.forEach(connectToRooms, function(r){
                        resultsArray.push(r);
                    });


                    DEBUG(0, "Connection", "connect", "", "complete - callback");
                    // Execute Callback, with resultsArray as the function params
                    callback.apply(this, resultsArray);
                });

                return this;

            }
        },
        room: function(name) {
            _.forEach(_context.rooms, function(r){

                if (r.name === name) {
                    DEBUG(0, "Connection", "room", name, "room already joined");
                    return r;
                }
            });

            DEBUG(0, "Connection", "room", name, "join room");
            var room = new goinstant2.BaseClasses.room();

            room.context(_context).name(name);

            if (hasValue(_user)) {
                room.setUser(_user);
            }

            var promise = room.join();

            promise.then(function(result) {
                _context.rooms.push(room);
            });

            return promise;
        },
        rooms: function() {
            return _context.rooms;
        },
        isGuest: function() {
            return _isGuest;
        },
        user: function() {
            //LOG(_user, "Connection", "user");
            return _user;
        }

    });
});



/* **********************************************
     Begin room.js
********************************************** */

goinstant2.BaseClasses.room = stampit().enclose(function () {


    var _context, _pubnub, _roomName, _pnRoomName, _user, _selfKey, _syncObject;

    var _onEvents = {
        join: null,
        leave: null,
        joinLocal: null,
        leaveLocal: null
    };

    var _joined = false;


    function _presence(msg) {
        DEBUG(1, "Room", "_presence[" + _pnRoomName + "]", "", "", msg);

        if (msg.action === 'join') {
            if (typeof _onEvents.join === 'function') {
                _onEvents.join({ user: msg.uuid });
            }
        }
        else if (msg.action === 'leave' || msg.action === 'timeout') {
            if (typeof _onEvents.leave === 'function') {
                _onEvents.leave({ user: msg.uuid })
            }
        }
    }

    // Since we are simulating the GoInstant Room (which has only presence)
    // we will ignore any incoming messages
    function _message(msg, env, channel) {
        // Ignore messages on this channel
    }


    // Public API
    return stampit.mixIn(this, {

        name: function (value) {
            if (value) {
                _roomName = value;
                _pnRoomName = "ROOM:::" + value;
                return this;
            }
            return _roomName;
        },
        context: function(value){
            if (value) {
                _context = value;
                _pubnub = _context.pubnub;
                return this;
            }
            return _context;
        },
        joined: function () {
            return _joined;
        },
        self: function () {
            INFO("return data sync info (KEY) for user with userID", "Room", "TODO - user");
            return _selfKey;
        },
        setUser: function(userObject) {
            _user = userObject;
        },
        user: function (userID) {
            LOG(userID, "Room", "user");
            INFO("return data sync info (KEY) for user with userID", "Room", "TODO - user");
            if (_user && hasValue(_user.id) && userID === _user.id) {
                return _selfKey;
            }
            else {
                return _key("'.users'" + "." + _userID);
            }
        },
        users: function (empty) {
            LOG("users collection", "Room", "users");
            var users = new goinstant2.BaseClasses.key();

            var usersPath = "'.users'";
            users.room(this).context(_context).syncObject(_syncObject).path(usersPath);

            users.startSync().then(function(){
                LOG("sync ready", "Room", "users");
                users.info();

                if (empty) {
                    users.remove().then(function(){
                        users.info();
                    });
                }
            });

            return users;
        },
        key: function (name) {

            var k = new goinstant2.BaseClasses.key();
            k.room(this).context(_context).syncObject(_syncObject).path(name);

            DEBUG(1, "Room", "key", name, "sync object initialize");

            k.sync(function(){
                DEBUG(1, "Room", "key", k.fullPath(), "sync object ready");
            });

            return k;
        },
        join: function (a,b,c) {

            var self = this;
            var hasUser = false;
            var hasOptions = false;
            var hasCallback = false;
            var usePromise = false;
            var deferred;

            var options, callback;

            // *** Anaylze Parameters

            if (hasValue(a) && hasValue(b) && hasValue(c)) {
                hasUser = true;
                hasOptions = true;
                hasCallback = true;
                _user = a;
                options = b;
                callback = c;
            }
            else if (hasValue(a) && hasValue(b)) {
                hasUser = true;
                hasCallback = true;
                _user = a;
                callback = b;
            }
            else if (hasValue(a)) {
                hasCallback = true;
                callback = a;
            }
            else {
                usePromise = true;
                deferred = Q.defer();
                DEBUG(1, "Room", "join", _pnRoomName, "promise created");
            }

            _context.room = _roomName;

            DEBUG(1, "Room", "join", _roomName, "start join process");

            // *** Handle User Object settings

            // If no user provided, but was set explicitly
            if (!hasUser && hasValue(_user)) {
                hasUser = true;
            }
            else {
                _user = {};
                hasUser = true;
            }

            // Add Randomized Guest Name if none provided
            if (!hasValue(_user.displayName)) {
                _user.displayName = "Guest " + Math.floor((Math.random() * 100000) + 10000).toString();
            }

            // Add Random UserID if none provided
            if (!hasValue(_user.id)){
                _user.id = _pubnub.uuid();
            }

            // *** Get Sync Object for this user


            _syncObject = _pnRoomName;

            DEBUG(1, "Room", "join", _pnRoomName, "create this user sync object", { object_id: ".'.users'/" + _user.id, user: _user} );
            _selfKey = new goinstant2.BaseClasses.key();

            var userPath = "'.users'" + "." + _user.id;
            _selfKey.room(this).context(_context).syncObject(_syncObject).path(userPath).initializeData({
                action: "merge",
                value: _user
            });

            DEBUG(1, "Room", "join", _pnRoomName, "sync initiate");

            _selfKey.sync(function(){

                DEBUG(1, "Room", "join", _roomName, "sync complete");

                // *** Configure PUBNUB Subscription
                var subscribeInfo = {
                    channel: _pnRoomName,
                    presence: function (msg) {
                        _presence(msg);
                    },
                    message: function (msg, env, ch) {
                        _message(msg, env, ch);
                    },
                    connect: function () {
                        LOG("PUBNUB connected to " + _pnRoomName, "Room", "join._pubnub.subscribe.connect");
                        _joined = true;
                    },
                    disconnect: function () {
                        LOG("PUBNUB disconnected " + _pnRoomName, "Room", "join._pubnub.subscribe.disconnect");
                        _joined = false;
                        console.log(_state);
                    }
                };


                // Set the PUBNUB state object to the user object
                subscribeInfo.state = _user;


                // *** Return Q Promise or execute callback


                // If we are using a Q Promise, alter the subscribe params and defer resolution
                if (usePromise) {

                    // Redefine the connect to be when the promise is resolved
                    subscribeInfo.connect = function() {
                        _joined = true;
                        var resultObject = {
                            err: null,
                            room: self,
                            user: _user
                        };
                        DEBUG(1, "Room", "join", _pnRoomName, "promise resolved");
                        deferred.resolve(resultObject);
                    };

                    subscribeInfo.error = function(e) {
                        ERROR("promise rejected", "Room", "join");
                        deferred.reject(new Error(e));
                    };

                    // Now do the subscribe
                    DEBUG(1, "Room", "join", _pnRoomName, "PUBNUB subscribe for presence");
                    _pubnub.subscribe(subscribeInfo);

                    return deferred.promise
                }
                else {
                    LOG("callback pending", "Room", "join");
                    INFO("callback", "Room", "TODO - join");
                    return this;
                }

            });

            if (usePromise) {
                return deferred.promise;
            }
        },
        leave: function (callback) {
            LOG("PUBNUB unsubscribe to " + _roomName, "Room", "leave");
            _pubnub.unsubscribe({
                channel: _pnRoomName
            });
            if (isFunction(callback)) {
                callback({ err: null });
            }
            return this;
        },
        on: function (eventName, a, b) {
            LOG(eventName, "Room", "on");

            var hasOptions = false;
            var hasCallback = false;
            var options = null;
            var callback = null;


            if (typeof a !== 'undefined' && typeof b !== 'undefined') {
                hasOptions = true;
                hasCallback = true;
                options = a;
                callback = b;
            }
            else if (typeof a === 'object') {
                hasOptions = true;
                options = a;
            }
            else if (typeof a === 'function') {
                hasCallback = true;
                callback = a;
            }


            if (eventName === 'join') {
                _onEvents.join = callback;
            }
            else if (eventName === 'leave') {
                _onEvents.leave = callback;
            }
        },
        off: function (eventName, a, b) {
            LOG(eventName, "Room", "off");

            var hasEventName = false;
            var hasOptions = false;
            var hasCallback = false;

            var options = null;
            var callback = null;

            if (typeof eventName !== 'undefined' || eventName != null) {
                hasEventName = true;
            }

            if (typeof a !== 'undefined' && typeof b !== 'undefined') {
                hasOptions = true;
                hasCallback = true;
                options = a;
                callback = b;
            }
            else if (typeof a === 'object') {
                hasOptions = true;
                options = a;
            }
            else if (typeof a === 'function') {
                hasCallback = true;
                callback = a;
            }

            // EventName is Specified
            if (hasEventName && hasOptions && hasCallback) {

            }
            else if (hasEventName && hasOptions) {

            }
            else if (hasEventName && hasCallback) {

            }

            // EventName is Null
            if (!hasEventName && !hasOptions && !hasCallback) {
                // De-Register all events
                _onEvents.join = null;
                _onEvents.leave = null;
            }
            else if (!hasEventName && hasOptions && hasCallback) {

            }
            else if (!hasEventName && hasCallback) {

            }

        }
    });
});





/* **********************************************
     Begin channel.js
********************************************** */

goinstant2.Channel = function Channel(context, name){

    var _context = context;
    var _pubnub = _context.pubnub;
    var _name = name;

    var _state = {
        joined: false
    };

    var _onEvents = {
        message: null
    };

    (function init() {
        var subscribeInfo = {
            channel: _name,
            message: function (msg, env, ch) {
                _message(msg, env, ch);
            },
            connect: function() {
                this._state.joined = true;
            },
            disconnect: function() {
                this._state.joined = false;
            }
        };

        if (_user.displayName !== 'undefined') {
            subscribeInfo.state =  { id: _user.id, displayName: _user.displayName }
        }

        _pubnub.subscribe(subscribeInfo);

    })();

    function _message(msg, env, channel) {
        if (isFunction(_onEvents.message)){
            message(msg);
        }
    }

    function _publish(msg, errorCallback){
        var callbackValues = {
            err: null
        };

        var error = function error(err) {
            if (err !== null && typeof err !== 'undefined') {
                callbackValues.err = err;
            }
        };

        _pubnub.publish({
            channel: _name,
            message: msg,
            error: error
        });

        if (isFunction(errorCallback)) {
            errorCallback(callbackValues);
        }
    }


    return {
        message: function(msg, errorCallback) {
            _publish(msg, errorCallback);
        },
        on: function(eventName, receiveCallback){
            if (hasValue(eventName) && eventName === 'message') {
                if (isFunction(receiveCallback)) {
                    _onEvents.message = receiveCallback;
                }
            }
        }
    }
};

/* **********************************************
     Begin key.js
********************************************** */

goinstant2.BaseClasses.key = stampit().enclose(function () {

    var _self, _context, _pubnub, _room, _syncObject, _path, _fullPath, _syncData;

    var _syncData;

    var _syncInitiated = false;
    var _syncInitialized = false;

    var _syncReady = false;
    var _syncReadyCallbacks = [];


    var _initialOperations = [];
    var _deferredOperations = [];
    var _promiseChain = [];

    var _onEvents = {
        set: [],
        add: [],
        remove: [],
        setLocal: [],
        addLocal: [],
        removeLocal: []
    };

    function _initialize(callback) {

        var initializeChain = _.map(_initialOperations, function (d) {

            if (d.action === "set") {
                return _self.set(d.value, { initializeOverride: true });
            }
            else if (d.action === "merge") {
                return _self.merge(d.value, { initializeOverride: true });
            }
            else if (d.action === "add") {
                return _self.add(d.value, { initializeOverride: true });
            }
            else if (d.action === "remove") {
                return _self.remove({ initializeOverride: true });
            }
        });

        // When initialOperations are completed, execute deferredOperations
        // in order
        Q.allSettled(initializeChain).then(function() {

            DEBUG(2, "Key", "_initialize", _syncObject, "initializeData complete");

            // Empty the collection, now that they are fulfilled
            _initialOperations = [];

            // Now that we have Initiated, and Initialized, set to true
            // new operations will not be added to deferred
            _syncInitialized = true;

            callback();

        });
    }

    function _deferred(callback) {

        var deferredChain = _.map(_deferredOperations, function (d) {

            if (d.action === "get"){
                if (d.usePromise) {
                    LOG("execute get() - promise", "Room", "startSync - deferredOperations");
                    self.get(function(err, value, context){
                        var returnObject = {
                            err: err,
                            value: value,
                            context: context
                        };
                        console.log(returnObject);
                        d.defer.resolve(returnObject);
                    });
                    return d.defer;
                }
                else {
                    return self.get().then(function(result){
                        var returnArray = [null, value, _context];
                        d.callback.apply(this, returnArray);
                    });
                }

            }
            else if (d.action === "set") {
                LOG("execute set()", "Room", "startSync - deferredOperations")
                if (d.usePromise) {
                    return self.set(d.value).then(function(result){
                        d.defer.resolve(result);
                    });
                }
                return self.set(d.value).then(function(result){
                    var returnArray = [null, value, _context];
                    d.callback.apply(this, returnArray);
                });
            }
            else if (d.action === "add") {
                LOG("execute add()", "Room", "startSync - deferredOperations")
                if (d.usePromise) {
                    return self.add(d.value).then(function(result){
                        d.defer.resolve(result);
                    });
                }
                return self.add(d.value).then(function(result){
                    var returnArray = [null, value, _context];
                    d.callback.apply(this, returnArray);
                });
            }
            else if (d.action === "merge") {
                LOG("execute merge()", "Room", "startSync - deferredOperations")
                if (d.usePromise) {
                    return self.merge(d.value).then(function(result){
                        d.defer.resolve(result);
                    });
                }
                return self.merge(d.value).then(function(result){
                    var returnArray = [null, value, _context];
                    d.callback.apply(this, returnArray);
                });
            }
            else if (d.action === "remove") {
                LOG("execute remove()", "Room", "startSync - deferredOperations")
                if (d.usePromise) {
                    return self.remove().then(function(result){
                        d.defer.resolve(result);
                    });
                }
                return self.remove().then(function(result){
                    var returnArray = [null, value, _context];
                    d.callback.apply(this, returnArray);
                });
            }
        });

        // Now we are ready to go
        Q.allSettled(deferredChain).then(function(){

            DEBUG(2, "Key", "_deferred", _fullPath, "deferred complete");

            _deferredOperations = [];
            _syncReady = true;

//            LOG_GROUP("Key: " + _syncObject + " - startSync() promise resolved");
//            LOG(_syncObject, "Key", "key.object_id");
//            LOG(_path, "Key", "key.path");
//            LOG(_syncData.content.data, "Key", "key.get");
//            LOG_GROUP_END();

            callback();

        }).catch(function(e){
            ERROR("KEY", "_initializeData", e);
        });
    }

    // Public API
    return stampit.mixIn(this, {
        context: function(value){
            _self = this;
            if (value) {
                _context = value;
                _pubnub = _context.pubnub;
                return this;
            }
            return _context;
        },
        room: function(value){
            if (value) {
                _room = value;
                return this;
            }
            return _room;
        },
        key: function(name) {
            var k = new goinstant2.BaseClasses.key();
            k.room(this).context(_context).roomName(_roomName).name(name).parent(this);
            return k;
        },
        parent: function(){
            if (value){
                _parent = value;
                return this;
            }
            return _parent;
        },
        fullPath: function() {
            return _fullPath;
        },
        info: function() {
            LOG_GROUP("Key: INFO()");
            LOG(_syncObject, "Key", "key.objectID");
            LOG(_path, "Key", "key.path");
            LOG(_syncData.get(), "Key", "key.value");
            LOG_GROUP_END();
        },
        syncObject: function(value){
            if (value) {
                _syncObject = value;
                _fullPath = _syncObject + "." + _path;
                return this;
            }
            return _syncObject;
        },
        path: function (value, onResult) {
            //INFO("implement path hierarchy", "Key", "TODO - get");
            if (value) {
                _path = value.replace(/\//g, ".");
                _fullPath = _syncObject + "." + _path;
                return this;
            }
            return _path;
        },
        isSynced: function() {
            return _syncReady;
        },
        initializeData: function(operation) {
            if (!_syncInitiated) {
                if (operation) {
                    _initialOperations.push(operation);
                    return this;
                }
            }
            return _initialOperations;
        },
        sync: function(callback) {
            DEBUG(2, "Key", "sync", _fullPath, "sync initiate");

            _syncData = _pubnub.sync(_fullPath);

            _syncData.on.ready(function(){
                var val = _syncData.get();
                DEBUG(2, "Key", "sync", _fullPath, "sync ready");
                //DEBUG(2, "Key", "sync", _fullPath, "value", val);
                DEBUG(2, "Key", "sync", _fullPath, "initializeData");
                _initialize(function(){
                    DEBUG(2, "Key", "sync", _fullPath, "initializeData complete");
                    _syncReady = true;
                    _deferred(function(){
                        DEBUG(2, "Key", "sync", _fullPath, "deferred complete");

                        DEBUG(2, "Key", "sync", _fullPath, "execute callbacks", _syncReadyCallbacks);
                        _.forEach(_syncReadyCallbacks, function(c){
                            DEBUG(2, "Key", "sync", _fullPath, "execute callbacks", { type: c.operation + "()" });
                            c.callback.apply(this, c.params);
                        });

                        callback();
                    });
                });
            });

            _syncData.on.update(function(params){
                DEBUG(2, "Key", "sync.on.update", _fullPath, "received", params);

                var value, parent;

                _.forEach(params.location, function(loc){
                    parent = loc.replace(_fullPath, "").split(".");
                    //console.log(parent);
                    var child = parent.pop();
                    parent = parent.pop();
                    //console.log(parent);
                    value = _syncData.get()[parent];
                });

                DEBUG(2, "Key", "sync.on.update", _fullPath, "value", value);
                DEBUG(2, "Key", "sync.on.update", _fullPath, "context", _context);

                _.forEach(_onEvents.add, function(listener){
                    listener(value, value.context);
                });

            });
            _syncData.on.set(function(params){
                DEBUG(2, "Key", "sync.on.set", _fullPath, "received", params);
                _.forEach(_onEvents.set, function(listener){

                    //listener()
                });
            });
        },
        get: function(a) {
            DEBUG(2, "Key", "get", _fullPath, "");

            var self = this;

            var hasCallback = false;
            var usePromise = false;

            var callback, deferred;

            if (hasValue(a)) {
                hasCallback = true;
                callback = a;
            }
            else {
                usePromise = true;
                deferred = Q.defer();
            }


            var handleGet = function (inner, withPromise) {

                var usePromise = false;
                var hasCallback = false;

                var callback, deferred;

                if (hasValue(withPromise) && withPromise) {
                    usePromise = true;
                    deferred = inner;
                }
                else if (hasValue(inner) && isFunction(inner)) {
                    hasCallback = true;
                    callback = inner;
                }
                else {
                    usePromise = true;
                    deferred = Q.defer();
                }

                if (usePromise) {

                    var returnObject = {
                        err: null,
                        value: _syncData.get(),
                        context: _context
                    };

                    deferred.resolve(returnObject);

                    return deferred.promise;

                }
                else {
                    LOG(2, "Key", "get", "get successful - callback");
                    var returnArray = [null, _syncData.get(), _context];
                    callback.apply(this, returnArray);
                }

                return self;
            };


            if (!_syncReady) {

                var params = (hasCallback ? [a] : [deferred, usePromise]);

                var callbackInfo = {
                    operation: "get",
                    callback: handleGet,
                    params: params,
                    self: self
                };

                _syncReadyCallbacks.push(callbackInfo);

                LOG(2, "Key", "get", "not ready for get() operations", callbackInfo);

                if (usePromise) {
                    return deferred.promise;
                }
                else {
                    return self;
                }
            }

            return handleGet(a);

        },
        add: function(value, a, b){

            var hasOptions = false;
            var hasCallback = false;
            var usePromise = false;

            var options, callback;

            if (hasValue(a) && hasValue(b)) {
                hasOptions = true;
                hasCallback = true;
                options = a;
                callback = b;
            }
            else if (hasValue(a)) {
                if (isFunction(a)) {
                    hasCallback = true;
                    callback = a;
                }
                else {
                    hasOptions = true;
                    usePromise = true;
                    options = a;
                }
            }
            else {
                usePromise = true;
            }


            var initializeComplete = _syncInitialized;

            if (hasOptions) {
                if (_.has(options, 'initializeOverride')) {
                    initializeComplete = true;
                }
            }

            if (!initializeComplete) {
                LOG(_syncObject + "." + _path + " - add() deferred");

                var deferredOp = {
                    action: "add",
                        value: value,
                    hasCallback: hasCallback,
                    usePromise: usePromise
                };

                if (usePromise) {
                    deferredOp.defer = Q.defer();
                    _deferredOperations.push(deferredOp);
                    return deferredOp.defer.promise;
                }
                else {
                    deferredOp.callback = callback;
                    _deferredOperations.push(deferredOp);
                }
            }
            else {

                var generatedKey = _path + ".";

                _pubnub.time(function(currentTime){

                    generatedKey += currentTime;

                    var context = {
                        addedKey: "/" + _path + "/" + generatedKey,
                        currentKey: "/" + _path,
                        targetKey: "/" + _path,
                        userId: _context.user.id,
                        command: "ADD",
                        value: JSON.parse(JSON.stringify(value)),
                        room: _context.room
                    };

                    value.context = context;


                    var params = {
                        object_id: _syncObject,
                        path: generatedKey,
                        data: value
                    };

                    if (usePromise){
                        var defer = Q.defer();

                        params.callback = function (m) {
                            defer.resolve({
                                err: null,
                                newValue: value,
                                context: value.context
                            });
                            DEBUG(2, "Key", "add", _fullPath, "completed - promise");
                        };

                        params.error = function (m) {
                            ERROR(m, "add error - promise", "Key", "add");
                            defer.reject(new Error(m));
                        };

                        _pubnub.set(params);

                        return defer.promise
                    }
                    else {
                        params.callback = function (m) {
                            DEBUG(2, "Key", "add", _fullPath, "completed - callback");
                            var returnArray = [null, value, _.merge(_context, { addedKey: generatedKey })];
                            callback.apply(this, returnArray);
                        };

                        params.error = function (m) {
                            ERROR(m, "add error - callback", "Key", "add");
                            var returnArray = [m, null, _context];
                            callback.apply(this, returnArray);
                        };

                        _pubnub.set(params);

                    }
                });
            }
            return this;
        },
        remove: function(a,b){

            var hasOptions = false;
            var hasCallback = false;
            var usePromise = false;

            var options, callback;

            if (hasValue(a) && hasValue(b)) {
                hasOptions = true;
                hasCallback = true;
                options = a;
                callback = b;
            }
            else if (hasValue(a)) {
                if (isFunction(a)) {
                    hasCallback = true;
                    callback = a;
                }
                else {
                    hasOptions = true;
                    usePromise = true;
                    options = a;
                }
            }
            else {
                usePromise = true;
            }


            var initializeComplete = _syncInitialized;

            if (hasOptions) {
                if (_.has(options, 'initializeOverride')) {
                    initializeComplete = true;
                }
            }

            if (!initializeComplete) {
                LOG(_syncObject + "." + _path + " - remove() deferred");

                var deferredOp = {
                    action: "remove",
                    hasCallback: hasCallback,
                    usePromise: usePromise
                };

                if (usePromise) {
                    deferredOp.defer = Q.defer();
                    _deferredOperations.push(deferredOp);
                    return deferredOp.defer.promise;
                }
                else {
                    deferredOp.callback = callback;
                    _deferredOperations.push(deferredOp);
                }
            }
            else {
                var params = {
                    object_id: _syncObject,
                    path: _path
                };

                if (usePromise){
                    var defer = Q.defer();
                    var lastValue = _syncData.content.data;
                    INFO("add lastValue as option(default true right now)", "Key", "TODO - remove");
                    LOG("remove promise created", "Key", "remove");

                    params.callback = function (m) {
                        defer.resolve({
                            err: null,
                            value: lastValue,
                            context: _context
                        });
                        LOG("remove promise resolved", "Key", "remove");
                    };

                    params.error = function (m) {
                        ERROR(m, "remove error - promise", "Key", "remove");
                        defer.reject(new Error(m));
                    };

                    _pubnub.remove(params);
                    return defer.promise
                }
                else {
                    params.callback = function (m) {
                        LOG("remove successful - callback", "Key", "remove");
                        var returnArray = [null, value, _.merge(_context, { lastValue: lastValue })];
                        callback.apply(this, returnArray);
                    };

                    params.error = function (m) {
                        ERROR(m, "remove error - callback", "Key", "remove");
                        var returnArray = [m, null, _context];
                        callback.apply(this, returnArray);
                    };

                }
            }
            return this;
        },
        set: function(value, a, b){

            var hasOptions = false;
            var hasCallback = false;
            var usePromise = false;

            var options, callback;

            if (hasValue(a) && hasValue(b)) {
                hasOptions = true;
                hasCallback = true;
                options = a;
                callback = b;
            }
            else if (hasValue(a)) {
                if (isFunction(a)) {
                    hasCallback = true;
                    callback = a;
                }
                else {
                    hasOptions = true;
                    usePromise = true;
                    options = a;
                }
            }
            else {
                usePromise = true;
            }

            var initializeComplete = _syncInitialized;

            if (hasOptions) {
                if (_.has(options, 'initializeOverride')) {
                    initializeComplete = true;
                }
            }

            if (!initializeComplete) {
                LOG(_syncObject + "." + _path + " - set() deferred");

                var deferredOp = {
                    action: "set",
                    value: value,
                    hasCallback: hasCallback,
                    usePromise: usePromise
                };

                if (usePromise) {
                    deferredOp.defer = Q.defer();
                    _deferredOperations.push(deferredOp);
                    return deferredOp.defer.promise;
                }
                else {
                    deferredOp.callback = callback;
                    _deferredOperations.push(deferredOp);
                }
            }
            else {

                var params = {
                    object_id: _syncObject,
                    path: _path,
                    data: value
                };

                if (usePromise){
                    var defer = Q.defer();

                    LOG("set promise created", "Key", "set");

                    params.callback = function (m) {
                        defer.resolve({
                            err: null,
                            value: value,
                            context: _context
                        });
                        LOG("set promise resolved", "Key", "set");
                    };

                    params.error = function (m) {
                        ERROR(m, "set error - promise", "Key", "set");
                        defer.reject(new Error(m));
                    };

                    _pubnub.set(params);
                    return defer.promise
                }
                else {
                    params.callback = function (m) {
                        LOG("set success - callback executed", "Key", "set");
                        var returnArray = [null, value, _context];
                        callback.apply(this, returnArray);
                    };

                    params.error = function (m) {
                        ERROR(m, "set error - callback executed", "Key", "set");
                        var returnArray = [m, null, _context];
                        callback.apply(this, returnArray);
                    };

                }
            }
            return this;
        },
        merge: function(value, a, b){

            var hasOptions = false;
            var hasCallback = false;
            var usePromise = false;

            var options, callback;

            if (hasValue(a) && hasValue(b)) {
                hasOptions = true;
                hasCallback = true;
                options = a;
                callback = b;
            }
            else if (hasValue(a)) {
                if (isFunction(a)) {
                    hasCallback = true;
                    callback = a;
                }
                else {
                    hasOptions = true;
                    usePromise = true;
                    options = a;
                }
            }
            else {
                usePromise = true;
            }


            var initializeComplete = _syncInitialized;

            if (hasOptions) {
                if (_.has(options, 'initializeOverride')) {
                    initializeComplete = true;
                }
            }


            if (!initializeComplete) {
                LOG(_syncObject + "." + _path + " - merge() deferred");

                var deferredOp = {
                    action: "merge",
                    value: value,
                    hasCallback: hasCallback,
                    usePromise: usePromise
                };

                if (usePromise) {
                    deferredOp.defer = Q.defer();
                    _deferredOperations.push(deferredOp);
                    return deferredOp.defer.promise;
                }
                else {
                    deferredOp.callback = callback;
                    _deferredOperations.push(deferredOp);
                }
            }
            else {

                var params = {
                    object_id: _syncObject,
                    path: _path,
                    data: value
                };

                if (usePromise){
                    var defer = Q.defer();

                    DEBUG(2, "Key", "merge", _syncObject, "promise created", value);

                    params.callback = function (m) {
                        defer.resolve({
                            err: null,
                            value: _syncData.content.data,
                            context: _context
                        });
                        DEBUG(2, "Key", "merge", _syncObject, "promise resolved");
                        DEBUG(2, "Key", "merge", "value", "", value);
                        DEBUG(2, "Key", "merge", "syncData", "", _syncData.get());
                    };

                    params.error = function (m) {
                        ERROR(m, "merge error - promise", "Key", "merge");
                        defer.reject(new Error(m));
                    };

                    _pubnub.merge(params);
                    return defer.promise
                }
                else {
                    params.callback = function (m) {
                        LOG("merge successful - callback", "Key", "merge");
                        var returnArray = [null, _syncData.content.data, _context];
                        callback.apply(this, returnArray);
                    };

                    params.error = function (m) {
                        ERROR(m, "merge error - callback", "Key", "merge");
                        var returnArray = [m, null, _context];
                        callback.apply(this, returnArray);
                    };

                }
            }
            return this;
        },
        on: function(eventName, a, b) {

            DEBUG(2, "Key", "on", _fullPath, eventName);

            var hasOptions = false;
            var hasCallback = false;
            var options, callback;

            if (isObject(a)) {
                hasOptions = true;
                hasCallback  = true;
                options = a;
                callback = b;
            }
            else {
                hasOptions = false;
                hasCallback = true;
                callback = a;
            }

            if (!isFunction(callback)) {
                throw new Error("Listener is not a valid function");
            }

            if (eventName === 'add') {
                _onEvents.add.push(callback);
            }
            else if (eventName === 'set'){
                _onEvents.set.push(callback);
            }
            else if (eventName === 'remove') {
                _onEvents.remove.push(callback);
            }

            return this;
        },
        off: function(eventName, a, b) {
            var hasEventName = false;
            var hasOptions = false;
            var hasCallback = false;

            var options = null;
            var callback = null;

            if (typeof eventName !== 'undefined' || eventName != null) {
                hasEventName = true;
            }

            if (typeof a !== 'undefined' && typeof b !== 'undefined') {
                hasOptions = true;
                hasCallback = true;
                options = a;
                callback = b;
            }
            else if (typeof a === 'object') {
                hasOptions = true;
                options = a;
            }
            else if (typeof a === 'function') {
                hasCallback = true;
                callback = a;
            }

            // EventName is Specified
            if (hasEventName && hasOptions && hasCallback) {

            }
            else if (hasEventName && hasOptions) {

            }
            else if (hasEventName && hasCallback) {

            }

            // EventName is Null
            if (!hasEventName && !hasOptions && !hasCallback) {
                // De-Register all events
                _onEvents.join = null;
                _onEvents.leave = null;
            }
            else if (!hasEventName && hasOptions && hasCallback) {

            }
            else if (!hasEventName && hasCallback) {

            }
        }
    });
});

/* **********************************************
     Begin compiled.js
********************************************** */

/* Compilation: File for CodeKit to compile all the classes together */
