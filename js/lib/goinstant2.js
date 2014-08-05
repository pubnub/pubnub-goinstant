window.goinstant2 = {};
window.goinstant2.BaseClasses = {};

goinstant2.App = function App(){
    var instance;

    function init() {

        // Private Members
        var _useLogging = false;

        // Private API


        return {

            // Public Members

            // Public API

            log: function(text, prefix, method) {
                if (_useLogging) {

                    var out = "";
                    out += hasValue(prefix) ? prefix + ": " : "";
                    out += hasValue(method) ? method + "() - " : "";

                    if (isObject(text)) {
                        console.log(out, text);
                    }
                    else {
                        out += text;
                        console.log(out);
                    }
                }
            },
            info: function(text, prefix, method) {
                if (_useLogging) {

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
            error: function(errorObject, text, prefix, method) {
                if (_useLogging) {

                    var out = "";
                    out += hasValue(prefix) ? prefix + ": " : "";
                    out += hasValue(method) ? method + "() - " : "";
                    out += text;
                    console.error(out, errorObject);

                }
            },
            logging: function(trueFalse) {
                _useLogging = trueFalse;
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

}();

window.goinstant2.App = goinstant2.App.getInstance();

goinstant2.App.logging(true);
LOG = goinstant2.App.log;
INFO = goinstant2.App.info;
ERROR = goinstant2.App.error;
LOG_GROUP = function(value) {
    console.group(value)
};
LOG_GROUP_END = function() {
    console.groupEnd();
}