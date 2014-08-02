App.log = function(text, prefix){
    if (typeof prefix !== 'undefined' && prefix !== "") {
        console.log("\t" + prefix + ": " + text);
    }
    else {
        console.log(text);
    }
};
App.jslog = function(text) {
    App.log(text, "JS");
};
App.csslog = function(text) {
    App.log(text, "CSS");
};


var load_css = function(complete) {
    App.log("LOAD: CSS Libraries");
    head.load({css_bootstrap: "//maxcdn.bootstrapcdn.com/bootswatch/3.2.0/darkly/bootstrap.min.css"}, function () {
        App.csslog("Bootstrap Darkly 3.2.0 loaded");

        head.load({css_fontawesome: "//maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css"}, function(){
            App.csslog("Font Awesome 4.1.0 loaded");
            complete();
        });
    });
};

var load_jslibraries = function(complete) {
    App.log("LOAD: JS Libraries");
    head.load({js_goinstant: "//cdn.goinstant.net/v1/platform.min.js"}, function () {
        App.jslog("GoInstant v1 loaded");

        head.load({js_pubnub: "//rawgit.com/pubnub/javascript/feature-pt74838232/web/pubnub.min.js"}, function(){
            App.jslog("Pubnub 3.6.7 loaded")

            head.load({js_jquery: "//code.jquery.com/jquery-2.1.1.min.js"}, function(){
                App.jslog("JQuery 2.1.1 loaded")

                head.load({js_bootstrap: "//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"}, function () {
                    App.jslog("Bootstrap 3.2.0 loaded");
                    complete();
                });
            });

            head.load({js_jquery: "//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min.js"}, function(){
                App.jslog("Lodash 2.4.1 loaded");
            });

        });
    });
};

var load_jscode = function(complete) {
    head.load({js_pubnub_goinstant: "js/pubnub-goinstant.js"}, function () {
        App.jslog("Pubnub-GoInstant loaded")
        complete();
    });
};


load_css(function(){
   load_jslibraries(function(){
       App.log("COMPLETE: PRE-REQUISITE LIBRARIES");
       load_jscode(function(){
           App.log("(ready)");
           head.load([{js_dev1: "js/dev_gi.js"}, {js_dev2: "js/dev_pn.js"}], function () {
           });
       });
   });
});





