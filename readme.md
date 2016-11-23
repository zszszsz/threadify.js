threadify.js
===========

a cooperative multithread model for nodejs.

to add initialize, 
````
const mt = require('./index.js');
var sched = new mt.sched(_your__Scheduler__Function_);
sched.newThread(_your__Thread__Generator__Function_);

sched.start();
````
The Thread Generator Function should use **`function*`**, the first argument of the generator is the newly created thread object.

Theard can stop rununing temporarily by **`yield;`**
````
function* ThreadFunc(Thread) {
    ...
    yield;
    ...
}
````

a thread can prevent itself from being scheduled by calling **`Thread.wait(signal);yield;`**, where signal should be a string.

You can wake up all the threads waiting for a signal by **`sched.trigger(signal)`**, where signal should be the string same as the former string.

Here is an example where a thread waits for a callback.
````
function* callbackTest(T) {
    var a = 0;
    setTimeout(()=>{a = 1;T.sched.trigger('callback');}, 100);
    T.wait('callback');
    yield;
    console.log('a=', a);
}
````
the output will be a=1.