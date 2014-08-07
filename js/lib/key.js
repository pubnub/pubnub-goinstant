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
                DEBUG(2, "Key", "sync", _fullPath, "initializeData start");
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

                    LOG(2, "Key", "get", "get successful - promise", returnObject);

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

            DEBUG(2, "Key", "add", _fullPath, "");

            var self = this;

            var hasOptions = false;
            var hasCallback = false;
            var usePromise = false;
            var overrideSyncReady = false;

            var options, callback, deferred;

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
                    deferred = Q.defer();
                }
            }
            else {
                usePromise = true;
                deferred = Q.defer();
            }


            var handleAdd = function (innerValue, callback, promise, innerOptions, withPromise) {

                var usePromise = false;
                var hasCallback = false;
                var hasOptions = false;

                var callback, options, deferred;

                if (hasValue(withPromise) && withPromise) {
                    usePromise = true;
                    deferred = promise;
                }
                else {
                    hasCallback = true;
                    callback = callback;
                }

                if (hasValue(innerOptions)){
                    hasOptions = true;
                    options = innerOptions;
                }


                if (usePromise) {

                    var generatedKey = _path + ".";

                    _pubnub.time(function(currentTime) {

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

                        if (usePromise) {

                            params.callback = function (m) {
                                deferred.resolve({
                                    err: null,
                                    newValue: value,
                                    context: value.context
                                });
                                DEBUG(2, "Key", "add", _fullPath, "completed - promise");
                            };

                            params.error = function (m) {
                                ERROR(m, "add error - promise", "Key", "add");
                                deferred.reject(new Error(m));
                            };

                            _pubnub.set(params);

                            return deferred.promise
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
                else {
                    LOG(2, "Key", "add", "add successful - callback");
                    var returnArray = [null, _syncData.get(), _context];
                    callback.apply(this, returnArray);
                }

                return self;
            };

            var params = [value, callback, deferred, options, usePromise];

            if (hasOptions) {
                if (_.has(options, 'initializeOverride')) {
                    overrideSyncReady = true;
                }
            }

            if (!_syncReady && !overrideSyncReady) {

                var callbackInfo = {
                    operation: "add",
                    callback: handleAdd,
                    params: params,
                    self: self
                };

                _syncReadyCallbacks.push(callbackInfo);

                LOG(2, "Key", "add", "not ready for add() operations", callbackInfo);

                if (usePromise) {
                    return deferred.promise;
                }
                else {
                    return self;
                }
            }

            return handleAdd.apply(this, params);

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
                LOG(_syncObject + "." + _fullPath + " - merge() deferred");

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

                    DEBUG(2, "Key", "merge", _fullPath, "promise created", value);

                    params.callback = function (m) {
                        defer.resolve({
                            err: null,
                            value: _syncData.content.data,
                            context: _context
                        });
                        DEBUG(2, "Key", "merge", _fullPath, "promise resolved");
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