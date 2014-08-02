
function PNGI_Room = function(){

}

var pubnub_goinstant = (function () {
    var instance;

    function init() {

        // **********************************************************************
        // Private Members
        // **********************************************************************
        var _pubnub = null;
        var _user = null;

        // **********************************************************************
        // Private API
        // **********************************************************************
        function _connect() {

        }
        return {

            // **********************************************************************
            // Public Members
            // **********************************************************************


            // **********************************************************************
            // Public API
            // **********************************************************************
            // goinstant.connect(url);
            // goinstant.connect(url, optionsObject);
            // goinstant.connect(url, callback(errorObject, connectionObject, roomObject))
            // goinstant.connect(url, optionsObject, callback(errorObject, connectionObject, roomObject...))
            //
            // PubNub Apps aren't connected to directly, because they can have multiple keys
            // instead, you connect to a specific app-key-set
            //
            // Convert url to pubnub version: https://pubnub/publishkey/subscribekey/secretkey
            //
            Connection: function (url, a, b){

                var keys = url.slice(15).split("/");
                var hasOptions = false;
                var hasCallback = false;
                var options = null;
                var callback = null;


                if (typeof a !== 'undefined' && typeof b !== 'undefined') {
                    hasOptions = true;
                    hasCallback = true;
                    options = a;
                }
                else if (typeof a === 'object') {
                    hasOptions = true;
                    options = a;
                }
                else if (typeof a === 'function') {
                    hasCallback = true;
                    callback = a;
                }

                if (hasOptions) {
                    if (_.has(options, 'user')) {
                        _user = options.user;
                        console.log(_user);
                    }
                }


                _pubnub = PUBNUB.init({
                    publish_key: keys[0],
                    subscribe_key: keys[1],
                    secret_key: keys[2]
                });
                return _pubnub;
            },
            room: function(){

            }
        };
    }

    return {

        // Get the Singleton instance if one exists
        // or create one if it doesn't
        getInstance: function () {
            if ( !instance ) {
                instance = init();
            }
            return instance;
        }

    };

})();

var goinstant2 = pubnub_goinstant.getInstance();