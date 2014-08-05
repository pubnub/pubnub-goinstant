goinstant2.BaseClasses.key = stampit().enclose(function () {

    var _context, _pubnub, _room, _syncObject, _path, _syncData;

    var _syncInitiated = false;
    var _syncInitialized = false;
    var _syncReady = false;
    var _syncPromise = Q.defer();

    var _initialOperations = [];
    var _deferredOperations = [];
    var _promiseChain = [];

    // Public API
    return stampit.mixIn(this, {
        syncObject: function(value){
            if (value) {
                _syncObject = value;
                return this;
            }
            return _syncObject;
        },
        path: function (value, onResult) {
            var self = this;
            if (value) {
                _path = value.replace(/\//g, ".");
                INFO("implement path hierarchy", "Key", "TODO - get");
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
        startSync: function(){
            var self = this;

            // Only want to do this once
            if (!_syncInitiated) {
                _syncInitiated = true;

                LOG_GROUP("Key: startSync() initiated");
                LOG("initiated", "Key", "startSync");
                LOG(_syncObject, "Key", "key.objectID");
                LOG(_path, "Key", "key.path");
                LOG_GROUP_END();

                // Begin the syncing process
                _syncData = _pubnub.get_synced_object({
                    object_id: _syncObject,
                    path: _path,
                    connect: function (objectID) {

                        LOG_GROUP("Key: " + _syncObject + " - connect() complete");
                        LOG(_syncObject, "Key", "key.object_id");
                        LOG(_path, "Key", "key.path");
                        LOG(_syncData.data, "Key", "key.get");
                        LOG_GROUP_END();

                        // Execute any initialOperations Now that we are synced
                        // these are provided before calling syncStart()/_syncInitiated
                        // cannot be added once it has been started
                        LOG_GROUP("Key: " + _syncObject + " - initializeData()");
                        LOG(_syncObject, "Key", "key.object_id");
                        LOG(_path, "Key", "key.path");
                        LOG(_initialOperations, "Key", "startSync - initialOperations");

                        var initializeChain = _.map(_initialOperations, function (d) {

                            if (d.action === "set") {
                                return self.set(d.value, { initializeOverride: true });
                            }
                            else if (d.action === "merge") {
                                LOG("execute merge() - promise", "Room", "startSync - initialOperations");
                                return self.merge(d.value, { initializeOverride: true });
                            }
                            else if (d.action === "add") {
                                return self.add(d.value, { initializeOverride: true });
                            }
                            else if (d.action === "remove") {
                                return self.remove({ initializeOverride: true });
                            }
                        });

                        // When initialOperations are completed, execute deferredOperations
                        // in order
                        Q.allSettled(initializeChain).then(function(){

                            LOG_GROUP_END();
                            // Empty the collection, now that they are fulfilled
                            _initialOperations = [];

                            // Now that we have Initiated, and Initialized, set to true
                            // new operations will not be added to deferred
                            _syncInitialized = true;

                            INFO("might need to add a deferred promise, to stop adding deferred operations");

                            LOG_GROUP("Key: " + _syncObject + " - deferredOperations()");
                            LOG(_syncObject, "Key", "key.object_id");
                            LOG(_path, "Key", "key.path");
                            LOG(_deferredOperations, "Room", "startSync - deferredOperations");

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

                                LOG_GROUP_END();

                                _deferredOperations = [];
                                _syncReady = true;

                                LOG_GROUP("Key: " + _syncObject + " - startSync() promise resolved");
                                LOG(_syncObject, "Key", "key.object_id");
                                LOG(_path, "Key", "key.path");
                                LOG(_syncData.data, "Key", "key.get");
                                LOG_GROUP_END();

                                _syncPromise.resolve({
                                    err: null,
                                    value: _syncData.data,
                                    context: _context
                                });
                            });
                        });

                    },
                    callback: function (actions) {
                        LOG_GROUP("Key: " + _syncObject + " - get_synced_object - callback (updates)");
                        LOG(_syncObject, "Key", "key.object_id");
                        LOG(_path, "Key", "key.path");
                        for (var i = 0; i < actions.length; i++) {
                            LOG(actions[i], "Key", "path - get_synced_object - callback");
                        }
                        LOG(_syncData.data, "Key", "key.get");
                        LOG_GROUP_END();
                    },
                    error: function (m) {
                        LOG("Key: " + _syncObject + "." + _path + " - startSync promise rejected", "Key", "startSync");
                        ERROR(m, "get_synced_object", "Key", "path - get_synced_object - error");
                        _syncPromise.reject(new Error(m));
                    }
                });
                return _syncPromise.promise;
            }
            else {
                return _syncPromise.promise;
            }
        },
        room: function(value){
            if (value) {
                _room = value;
                return this;
            }
            return _room;
        },
        context: function(value){
            if (value) {
                _context = value;
                _pubnub = _context.pubnub;
                return this;
            }
            return _context;
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
        info: function() {
            INFO("SyncObject: " + _syncObject + " Path: " + _path, "Key", "info")
        },
        get: function(a) {

            var hasCallback = false;
            var usePromise = false;

            var callback;

            if (hasValue(a)) {
                hasCallback = true;
                callback = a;
            }
            else {
                usePromise = true;
            }

            if (!_syncInitialized) {
                LOG(_syncObject + "." + _path + " - get() deferred");

                var deferredOp = {
                    action: "get",
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

                    var returnObject = {
                        err: null,
                        value: _syncData.data,
                        context: _context
                    };

                    defer.resolve(returnObject);

                    return defer.promise
                }
                else {
                    LOG("get successful - callback", "Key", "get");
                    var returnArray = [null, _syncData.data, _context];
                    callback.apply(this, returnArray);
                }
            }
            return this;
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

                var generatedKey = _path + "." + _pubnub.uuid();
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
                            context: _.merge(_context, { addedKey: generatedKey })
                        });
                        LOG("add successful - promise", "Key", "add");
                    };

                    params.error = function (m) {
                        ERROR(m, "add error - promise", "Key", "add");
                        defer.reject(new Error(m));
                    };

                    _pubnub.merge(params);
                    return defer.promise
                }
                else {
                    params.callback = function (m) {
                        LOG("add successful - callback", "Key", "add");
                        var returnArray = [null, value, _.merge(_context, { addedKey: generatedKey })];
                        callback.apply(this, returnArray);
                    };

                    params.error = function (m) {
                        ERROR(m, "add error - callback", "Key", "add");
                        var returnArray = [m, null, _context];
                        callback.apply(this, returnArray);
                    };

                }
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
                    var lastValue = _syncData.data;
                    INFO("add lastValue as option(default true right now)", "Key", "TODO - remove");

                    params.callback = function (m) {
                        defer.resolve({
                            err: null,
                            value: lastValue,
                            context: _context
                        });
                        LOG("remove successful - promise", "Key", "remove");
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

                var generatedKey = _path + "." + _pubnub.uuid();
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
                            context: _.merge(_context, { addedKey: generatedKey })
                        });
                        LOG("set successful - promise", "Key", "set");
                    };

                    params.error = function (m) {
                        ERROR(m, "set error - promise", "Key", "set");
                        defer.reject(new Error(m));
                    };

                    _pubnub.merge(params);
                    return defer.promise
                }
                else {
                    params.callback = function (m) {
                        LOG("set successful - callback", "Key", "set");
                        var returnArray = [null, value, _context];
                        callback.apply(this, returnArray);
                    };

                    params.error = function (m) {
                        ERROR(m, "set error - callback", "Key", "set");
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

                    LOG("merge promise created", "Key", "merge");

                    params.callback = function (m) {
                        defer.resolve({
                            err: null,
                            value: _syncData.data,
                            context: _context
                        });
                        LOG("merge successful - promise resolved", "Key", "merge");
                        LOG(value, "Key", "merge");
                        LOG(_syncData.data, "Key", "merge")
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
                        var returnArray = [null, _syncData.data, _context];
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
        }
    });
});