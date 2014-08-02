function sortNumber(a,b) {
    console.log(a);
    console.log(b);
    return (+a) -(+b);
}
  
var room, listKey, items;
  var connectUrl = "https://goinstant.net/heroku-YXBwMjE3MjMxMzlAaGVyb2t1LmNvbQ/application";
  pubnub = PUBNUB.init({
    publish_key: "pub-c-b79d8c74-314a-4312-8852-a61ca49a5fd2",
    subscribe_key: "sub-c-4745b1e4-19ba-11e4-bbbf-02ee2ddab7fe",
    origin: "pubsub-beta.pubnub.com"
  });

  // Initialize our homemade view
 // var todoList = new TodoList({
 //   list: $("#list"),
 //   form: $("form[name=todos]")
 // });

  todo = pubnub.get_synced_object({
    object_id: "todo-list",
    callback: function (m) {
        keys = _.keys(todo.data);
        size = keys.length;
        for (var i = 0; i < m.length; i++) {
            var msg = m[i];
            console.log(msg);
            if (msg.action === "update") {
                insertItem(_.last(msg.location.split(".")), msg.value);
            }
            else if (msg.action === "delete") {
                $("#" + _.last(msg.location.split("."))).fadeOut(function () {
                    $(this).remove();
                });
            }
        }
    },
  });

  var keys;
  var size = 0;

  var z = setInterval(function() {
    if (!todo.pn_ds_meta.stale) {
        keys = _.keys(todo.data);
        keys.sort(sortNumber);

        for (var i=0; i < keys.length; i++) {
            insertItem(keys[i], todo.data[keys[i]]); 
        }
        clearInterval(z);
    }
  }, 200);
 
var insertItem = function(id, text) {
   $("#list").append("<li id='" + id  + "'> <input type=checkbox id='" + id  + "box'>" + text + "</li>"); 
   $("#" + id + "box").click(function() {

     pubnub.remove({
        object_id: "todo-list",
        callback: function () {},
        path: id
     });
   });
};


var publish = function(e) {
    if (e.which === 13 && $("#todos").val().length) {
        pubnub.merge({
            object_id: "todo-list",
            path: size + '',
            data: $("#todos").val(),
            callback: function() {}
        });
        size++;
        $("#todos").val('');
    }
}

var throttled = _.throttle(publish, 300);

$("#todos").keypress(throttled);

