'use strict';
const mt = require('./index.js');

function* baseTest(T) {
    for (var k = 0; k < 3; k++) {
        testResult.push('' + T.tid + ',' + k)
        if (T.tid === 0) setTimeout(() => {
            testResult.push('c' + T.tid + ',' + k);
        }, 0);
        yield;
    }
    if (T.tid === 0) yield 'asdf';
    else yield;

    for (var k = 0; k < 3; k++) {
        testResult.push('' + T.tid + ',' + k);
        yield;
    }
    if (T.tid === 1) T.sched.trigger('asdf');
    if (T.tid === 0) T.sched.trigger('callbackTest');
}

var sched = new mt.sched(mt.sched.fcfs);

function* callbackTest(T) {
    yield 'callbackTest';
    checkTest(testResult, 'base');
    var result = [];
    yield;
    var a = 0;
    setTimeout(() => {
        a = 'callback';
        T.sched.trigger('callback');
    }, 500);
    yield 'callback';
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
            expect = ['0,0', 'c0,0', '1,0', '0,1', 'c0,1', '1,1', '0,2', 'c0,2', '1,2', '1,0', '1,1', '1,2', '0,0', '0,1', '0,2'];
            break;
        case 'callback':
            expect = ['callback'];
            break;
        default:
            expect = [];
            break;
    }
    JSON.stringify(result) == JSON.stringify(expect) ?
        console.log('\ntest', test, 'pass\n') :
        console.log('\ntest', test, 'failed\n\nexpect\n', expect, '\nresult\n', result);

}