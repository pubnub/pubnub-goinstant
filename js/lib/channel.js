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