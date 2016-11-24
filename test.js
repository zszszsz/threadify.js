'use strict';
const mt = require('./index.js');

function* baseTest(T) {
    for(var k = 0; k < 3; k++) {
        testResult.push(''+T.tid+','+k)
        if(T.tid == 0)setTimeout(()=>{testResult.push('c'+T.tid+','+k);}, 0);        
        yield;
        yield;
    }

    if(T.tid == 0)T.wait('asdf');
    yield;

    for(var k = 0; k < 3; k++) {
        testResult.push(''+T.tid+','+k);
        yield;
    }
    if(T.tid == 1)T.sched.trigger('asdf');
    if(T.tid == 0)T.sched.trigger('callbackTest');
}

var sched = new mt.sched(mt.sched.fcfs);

function* callbackTest(T) {
    T.wait('callbackTest');
    checkTest(testResult, 'base');  
    var result = [];  
    yield;
    var a = 0;
    setTimeout(()=>{a = 'callback';T.sched.trigger('callback');}, 500);
    T.wait('callback');
    yield;
    result.push(a);
    checkTest(result, 'callback');    
    
}

sched.newThread(baseTest);
sched.newThread(baseTest);
sched.newThread(callbackTest);
// sched.newThread(testThread);
var testResult = [];
sched.start();

function checkTest(result, test) {
    var expect = [];    
    switch (test) {
        case 'base':
            expect = ['0,0','c0,0','0,1','c0,1','0,2','c0,2','1,0','1,1','1,2','1,0','1,1','1,2'];
            break;
        case 'callback':
            expect = ['callback'];
            break;
        default:
            expect = [];
            break;
    }
    console.log(test,'test',JSON.stringify(result) == JSON.stringify(expect)?'pass':'fail');
    
}