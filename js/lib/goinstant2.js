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