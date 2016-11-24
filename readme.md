threadify.js
===========

a **non-preemptive** multi-threading model for nodejs based on ES6 generator APIs.

to initialize, and add and start the threads, 
````
const mt = require('./index.js');
var sched = new mt.sched(sched);
sched.newThread(ThreadFunc);
...
sched.start();
````
The **Thread Function** should be a ES6 generator defined with **`function*`**, the first argument handed to the generator is the newly created thread object.

Theards can suspend by **`yield;`**. All the callbacks already in the event loop *should* run before the next time the scheduler runs.

the scheduler **usually** choose another thread other than the thread just yielded.
````
function* ThreadFunc(Thread) {
    ...
    yield;
    ...
}
````

a thread can prevent itself from being scheduled by waiting for a signal, **`yield signal;`**, where signal *should* be a string or a number.

You can wake up all the threads waiting for a signal by **`sched.trigger(signal)`**.

There is **no preemption** support in the package, which means a thread may only be interrupted by calling yield by itself.

Which means, A thread will not be interrupted by outer worlds, instead, it will only be interrupted by itself.

Here is an example where a thread waits for a callback.


````
function* callbackTest(T) {
    var a = 0;
    setTimeout(()=>{a = 1;T.sched.trigger('callback');}, 100);
    yield 'callback';
    console.log('a=', a);
}
````
the output will be a=1.