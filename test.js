'use strict';
const mt = require('./index.js');

var i = 0;

function* baseTest(T) {
    let j = i; i++;
    for(var k = 0; k < 3; k++) {
        console.log(j, k);
        if(j==0)setTimeout(()=>{console.log('timeout', j, k);}, 0);        
        yield;
    }
    console.log('');
    if(j == 0)T.wait('asdf');
    yield;

    for(var k = 0; k < 3; k++) {
        console.log(j, k);
        yield;
    }
    if(j == 1)T.sched.trigger('asdf');
    if(j == 0)T.sched.trigger('callbackTest');
    console.log('');
}

var sched = new mt.sched(mt.sched.fcfs);

function* callbackTest(T) {
    T.wait('callbackTest');
    yield;
    var a = 0;
    setTimeout(()=>{a = 'value from callback';T.sched.trigger('callback');}, 100);
    T.wait('callback');
    yield;
    console.log(a);
}
sched.newThread(baseTest);
sched.newThread(baseTest);
sched.newThread(callbackTest);
// sched.newThread(testThread);

sched.start();