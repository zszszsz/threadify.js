'use strict';
class Sched {
    constructor(sch) {
        this.ready = [];
        this.signals = {};
        this.idle = true;
        this.schedFunction = sch;
    }

    newThread(T) {
        if ((!(T instanceof Thread)) && (T instanceof Function)) {
            T = new Thread(T, this);
        }
        if (T instanceof Thread) {
            T.scheduler = this;
            this.ready.push(T);
            if (this.idle) {
                this.idle = false;
                setTimeout(() => {this.start();}, 0);
            }
            return true;
        }
        return false;

    }

    isReady(T) {
        this.ready.find((e) => {
            return e === T;
        });
    }

    trigger(sig) {
        if(!this.signals[sig])return;
        this.ready = this.ready.concat(this.signals[sig]);
        delete this.signals[sig];
        if(this.idle) {
            this.idle = false;
            setTimeout(() => {this.start();}, 0);
        }
    }

    start() {
        if (this.ready.length === 0) {
            this.idle = true;
            return;
        }
        var T = this.schedFunction(this.ready);
        var yieldCall = T.runnable.next();

        this.ready.splice(this.ready.indexOf(T), 1);
        if(yieldCall.value) {
            var sig = yieldCall.value;
            if (!this.signals[sig]) this.signals[sig] = [];
            this.signals[sig].push(T);
        }
        else if(!yieldCall.done) {
            this.ready.push(T);
        }
        setTimeout(() => {this.start();}, 0);
    }

    static fcfs(ready) {
        return ready[0];
    }

    staric schedulers () {
        return {
            'fcfs': fcfs
        };
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
}

var scheduler = new Sched(Sched.fcfs);

module.exports = (T) => {
    scheduler.addThread(T);
};

module.exports.schedulers = Sched.schedulers();

module.exports.setSched = (F) => {
    scheduler.schedFunction = F;
};
