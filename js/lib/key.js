goinstant2.Key = function Key(context, roomName, keyName, pubnubConnection){

    var _context = context;
    var _pubnub = pubnubConnection;
    var _roomID = roomName;
    var _keyID = keyName;

    var _key = _roomID + "/" + keyName;
    var _value = null;

    function _getValue() {
        console.log("TODO: Key._getValue(" + key + ")");
    }

    return {
        get: function(fn) {

            var returnValues = {
                err: null,
                value: _value,
                context: null
            };
            return returnValues;
        },
        key: function(keyName) {
            return new goinstant2.Key(_roomID, _keyID + "/" + keyName, _pubnub);
        },
        parent: function(){
            console.log("TODO: return parent key");
        }
    };
};