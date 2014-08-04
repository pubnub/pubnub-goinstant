goinstant2.BaseClasses.key = stampit().enclose(function () {

    var _context, _pubnub, _room, _syncObject, _path, _syncData;

    var _syncedDataReady = false;
    var _deferredOperations = [];

    // Public API
    return stampit.mixIn(this, {
        syncObject: function(value){
            if (value) {
                _syncObject = value;
                return this;
            }
            return _syncObject;
        },
        path: function (value, onReady) {
            var self = this;
            if (value) {
                _path = value.replace(/\//g, ".");
                INFO("implement path hierarchy", "Key", "TODO - get");

                LOG("get synced object for SyncObject: " + _syncObject + " Path: " + _path, "Key", "path");
                _syncData = _pubnub.get_synced_object({
                    object_id: _syncObject,
                    path: _path,
                    connect: function(objectID) {
                        LOG("synced object data has been retrieved for SyncObject: " + _syncObject + " Path: " + _path, "Key", "path - get_synced_object - connect");
                        _syncedDataReady = true;
                        _.forEach(_deferredOperations, function(d){
                            if (d.action === "set") {
                                this.set(d.value);
                            }
                            else if (d.action === "merge") {
                                this.add(d.value);
                            }
                            else if (d.action === "remove") {
                                this.remove();
                            }
                        });
                        if (isFunction(onReady)){
                            onReady();
                        }
                    },
                    callback: function(actions) {
                        for (var i = 0; i < actions.length; i++) {
                            LOG(actions[i], "Key", "path - get_synced_object - callback");
                        }
                    },
                    error: function(m) { ERROR(m, "get_synced_object", "Key", "path - get_synced_object - error"); }
                });

                return this;
            }
            return _path;
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
        get: function(fn) {
            LOG("", "Key", "get");

            var returnValues = {
                err: null,
                value: _syncData,
                context: null
            };
            return returnValues;
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
        add: function(value,a,b){
            LOG(value, "Key", "add");
            INFO("promise & callback", "Key", "TODO - add");
            var generatedKey = _path + "." + _pubnub.uuid();

            if (value && _syncedDataReady) {
                _pubnub.merge({
                    object_id: _syncObject,
                    path: generatedKey,
                    data: value,
                    callback  : function(m) { LOG("Set successful", "Key", "add"); },
                    error     : function(m) { ERROR(m, "Set error", "Key", "add"); }
                });
            }
            else if (value && !_syncedDataReady) {
                _deferredOperations.push({
                    action: "merge",
                    value: value
                })
            }
            return this;
        },
        remove: function(a,b){
            LOG("", "Key", "remove");
            INFO("options, promise & callback", "Key", "TODO - remove");
            if (value && _syncedDataReady) {
                _pubnub.remove({
                    object_id: _syncObject,
                    path: _path,
                    callback  : function(m) { LOG("Set successful", "Key", "remove"); },
                    error     : function(m) { ERROR(m, "Set error", "Key", "remove"); }
                });
            }
            else if (value && !_syncedDataReady) {
                _deferredOperations.push({
                    action: "remove",
                    value: value
                })
            }
            return this;
        },
        set: function(value, a, b){
            LOG("value", "Key", "set");
            INFO("options, promise & callback", "Key", "TODO - set");
            if (value && _syncedDataReady) {
                _pubnub.set({
                    object_id: _syncObject,
                    path: _path,
                    data: value,
                    callback  : function(m) { LOG("Set successful", "Key", "set"); },
                    error     : function(m) { ERROR(m, "Set error", "Key", "set"); }
                });
            }
            else if (value && !_syncedDataReady) {
                _deferredOperations.push({
                    action: "set",
                    value: value
                })
            }
            return this;
        }
    });
});