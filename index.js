'use strict';
class Sched {
    constructor(sch) {
        this.threads = [];
        this.ready = [];
        this.signals = {};
        this.schedFunction = sch;
    }

    newThread(T) {
        if ((!(T instanceof Thread)) && (T instanceof Function)) {
            T = new Thread(T, this);
        }
        if (T instanceof Thread) {
            T.scheduler = this;
            this.threads.push(T);
            this.ready.push(T);
            return true;
        }
        return false;

    }

    set schedFunction(sch) {
        if (sch instanceof Function) this.do_sched = sch;
    }

    get schedFunction() {
        return this.do_sched;
    }

    isReady(T) {
        this.ready.find((e) => {
            return e === T;
        });
    }

    wait(T, sig) {
        if (!this.signals[sig]) this.signals[sig] = [];
        this.signals[sig].push(T);
        this.ready.splice(this.ready.indexOf(T), 1);

    }

    trigger(sig) {
        if(!this.signals[sig])return;
        this.ready = this.ready.concat(this.signals[sig]);
        delete this.signals[sig];
        setTimeout(() =>{this.start();}, 0);
    }

    start() {
        if (this.ready.length == 0)return;
        var T = this.do_sched(this.ready);
        if (T.runnable.next().done) {
            this.ready.splice(this.ready.indexOf(T), 1);
        }
        setTimeout(() =>{this.start();}, 0);
    }

    static fcfs(ready) {
        return ready[0];
    }
}

var currentTid = 0;

class Thread {
    constructor(gen, sch) {
        this.tid = currentTid;
        currentTid ++;
        this.sched = sch;
        this.runnable = gen(this);
    }
    get ready() {
        return this.sched.isReady(this);
    }

    wait(sig) {
        this.sched.wait(this, sig);
    }
}

module.exports = {
    'sched' : Sched,
    'thread' : Thread
}