# Reference 

Learn more about moving from GoInstant to PubNub: 

**Summary**

http://www.pubnub.com/goinstant/


**Tools**

http://www.pubnub.com/blog/pubnub-welcomes-goinstant-developers-migration-tools/


**Conceptual Guide**

http://www.pubnub.com/blog/goinstant-pubnub-conceptual-translation-guide-migrating-developers/




## Summary of Differences between PubNub-GoInstant and GoInstant libraries

* Connection to Platform happens at the Room level, room.get() specifically
* When Key's are created room.key(name), we initiate a retrieval of current state of that object, any operations on that (get/add/set/remove) are deferred until that operation completes
* (more writeup coming)





## TODO (by method)




### Testing

* Add QUnit tests for each class




### connect()

* (complete)




    
### Connection Class


###### connect()

* **todo** argument object for connection (as opposed to url)
* **todo** add state information for user in pubnub object by uuid

###### disconnect() 

* **todo** implement callback & promise
* **todo** should disconnect all rooms
* **todo** should free up any data sync objects

###### isGuest()

* complete

###### loginUrl()

* TBD

###### logoutUrl()

* TBD

###### on() events

* connect
* disconnect
* error
* **todo** Since connections are made on "rooms" in PubNub, have to bubble these up
* **todo** Create Listener Arrays
    
###### off() 

* **todo** implement event deregister

###### room()

* **todo** remove promise style, return object
* **todo** initiates sync
* **todo** all connection activity happens on get()

###### rooms()

* currently returns connected rooms
* **todo** passed in array should connect new rooms (Room collection object)

###### rooms.get() (TBD)

* **todo** implement a Room collection object that  
* **todo** implement callback & promise for whole collection
 
 
 
 
    
### Room Class

###### channel()

* add once Channel object factory is ready

###### connection()

* (complete) returns _context.connection

###### equals()

* **todo** implementation

###### join()

* implement callback

###### joined()

* complete

###### key()

* **todo** add key path parsing and nested keys
    
###### leave()

* **todo** disconnect all keys and unsubscribe all channels
    
###### on() 

* **todo** change to array of listeners instead of single listener
* **todo** join return context with pubnub.state info for uuid
* **todo** leave return context with pubnub.state info for uuid
    
###### off()

* **todo** remove listeners on match
* **todo** remove all listeners (clear array)

###### self()

* complete

###### user()

* complete

###### users()

* complete

        
        
        
        
### Context Class

* **todo** create object factory
* **todo** should have methods for each context type (per class/operation)
    
### Key Class

* **todo** Match "add" operations to received updates (via context)

###### remove()

* change to inner function (like get()/add())
* add deferred callbacks

###### parent()

* create parent keys when needed (TBD)

###### merge()

* change to inner function (like get()/add())

###### on()

* add support for options { local: true }
* add support for options { bubble: true }

###### off()

* implement removal of listeners
    
### Channel Class

* Create object factory

###### message()

* implement

###### on()

* message (message received)

###### off()
    
* implement




### Authentication/Permissions

* **TBD** how to match it up with PubNub PAM 





### User

* Create object factory class

    
    
    
### OT

* **TBD**
    
    
    
    
    
### Query

* **TBD**
