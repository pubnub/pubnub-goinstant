App.pubnubSettings = {
    publish: "pub-c-b79d8c74-314a-4312-8852-a61ca49a5fd2",
    subscribe: "sub-c-4745b1e4-19ba-11e4-bbbf-02ee2ddab7fe",
    secret: "sec-c-OTY5NGI0ODgtMGRkNy00MDkyLWIxODQtN2NmNjhjNzQ4NmEz"
};

App.goinstantSettings = {
    url: "https://goinstant.net/Testjasldkfjklasd/Jasdeep"
};

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

        head.load({js_pubnub: "//rawgit.com/pubnub/javascript/feature-pt74838232-2/web/pubnub.min.js"}, function(){
            App.jslog("Pubnub 3.6.7 loaded")

            head.load({js_jquery: "//code.jquery.com/jquery-2.1.1.min.js"}, function(){
                App.jslog("JQuery 2.1.1 loaded")

                head.load({js_bootstrap: "//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"}, function () {
                    App.jslog("Bootstrap 3.2.0 loaded");
                    complete();
                });
            });

        });
    });
};

var load_jscode = function(complete) {
    head.load({js_pubnub_goinstant: "js/pubnub-goinstant.js"}, function () {
        App.jslog("Pubnub-GoInstant loaded")

        head.load({js_dev: "js/dev.js"}, function () {
            App.jslog("Dev.js loaded")
            App.log("COMPLETE: Development Code loaded");
            complete();
        });
    });
};


load_css(function(){
   load_jslibraries(function(){
       App.log("COMPLETE: PRE-REQUISITE LIBRARIES");
       load_jscode(function(){
           App.log("(ready)");
       });
   });
});





