#How to Build a Realtime Todo App

##Connect to PubNub

Connecting to PubNub gives you access to store data for your application.

    var pubnub = PUBNUB.init({
         publish_key : 'demo',
         subscribe_key : 'demo'
     });
    
##Setup Data Sync

PubNub Data Sync stores data as standard JSON objects. To get a Data Sync object, we simply call pubnub.sync("object_name").

    var list = pubnub.sync("todo-list");
 
##Fetch existing tasks
 
After getting our Data Sync object we can populate our list with the existing tasks. The `on.ready` function executes a callback when the Data Sync object is ready. The `get` method actually returns the data we store inside the Data Sync object.

    list.on.ready(function() {
        insertTasks(list.get());
    });

##Inserting New Tasks

We can insert new tasks with the `merge` method.              
    
    pubnub.merge({
        object_id: "todo-list",
        path: id,
        data: "Profit"
    });
    
This call will 

When someone inserts a new task, we can tell 

##Deleting Completed Tasks

Deleting completed tasks is simple too. We just use the `remove` method.

Similar to how we can detect whenever a user inserts new data, we can provide a callback to the `on.remove` method. 
