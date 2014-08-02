#How to Build a Realtime Todo App

##Connect to PubNub

Connecting to GoInstant gives you access to store data for your application.

var url = 'https://goinstant.net/ACCOUNT/APP'
var connect = goinstant.connect(url);
Storage Setup

GoInstant stores data as standard JSON using what we call keys and rooms. A key is the path to a value and a room groups these keys together.

For our todo list we want to group tasks under a specific user, so we add the user's ID as a suffix to the key path:

var room, listKey, items;
connect.then(function(res) {
  room = res.rooms[0];
  listKey = room.key('/todo-list');
Synchronize Data
There are two essential parts to synchronizing messages across all users.

Fetch existing tasks

In order to display tasks created prior to loading the page we have to ask GoInstant for the data. If there are no tasks it will simply skip this step.

  return listKey.get();
});
The get command resolves a promise which contains a value property. We take this value which contains our messages and append them to our view.

items = res.value || [];
_.each(items, _loadItem);
Event Listeners

The todo app will require four listeners which will perform actions based on local page events, and remote data-driven events.

We register a submit event listener on the form element, which will call _handleForm when triggered. This function formats the task title and stores the data in GoInstant when Enter is pressed. We also register a click event listener on the checkbox inputs which will call _handleComplete when triggered. This function identifies which task is completed and removes it from the data stored in GoInstant.

todoList.submit(_handleForm);
todoList.markComplete(_handleComplete);
We register an add event listener to the listKey which will call _handleAdd when a task has been added to the dataset. Notice that we pass the option local as true; this ensures that we call _handleAdd for tasks that we have added locally.

The final event listener we add is remove on the listKey which calls _handleRemove when a task has been removed from the dataset. Notice that in addition to the local option we pass bubble as true; this ensures taht we call our handler when any child item (task) of the listKey is removed.

listKey.on('add', { local: true }, _handleAdd);
listKey.on('remove', { local: true, bubble: true }, _handleRemove);
You're done!

You can build this app right now, and customize it too.
Click the button below to sign up and get started.