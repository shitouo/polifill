// Promise的实现还是比较简单的。
// 主要是考虑下一个promise只能有一种完成状态
// 以及要注意，defaultResolve在调用所有的resolveListeners时，要实现成异步的。reject也同理。

class MyPromise {
    constructor(fn) {
        this.state = 'pending';
        this.resolveListeners = [];
        this.rejectListener = null;
        this.defaultResolve = this.defaultResolve.bind(this);
        this.defaultReject = this.defaultReject.bind(this);
        fn(this.defaultResolve, this.defaultReject);
    }
    defaultResolve(value) {
        // 这里要实现成异步的
        setTimeout(() => {
            if (this.state !== 'pending') {
                return;
            }
            this.state = 'fullfiled';
            try {
                let result = value;
                this.resolveListeners.forEach(listener => {
                    result = listener(result);
                })
            } catch(err) {
                this.rejectListener && this.rejectListener(err);
            }
        }, 0);
    }
    defaultReject(error) {
        setTimeout(() => {
            if (this.state !== 'pending') {
                return;
            }
            this.state = 'rejected';
            this.rejectListener && this.rejectListener(error);
        }, 0);
    }
    then(resolveHandler, rejectHandler) {
        if (resolveHandler) {
            this.resolveListeners.push(resolveHandler);
        }
        if (!this.rejectListener && rejectHandler) {
            this.rejectListener = rejectHandler
        }
        return this;
    }
    catch(rejectHandler) {
        if (!this.rejectListener && rejectHandler) {
            this.rejectListener = rejectHandler
        }
        return this;
    }
}

new MyPromise(function(resolve, reject) {
    resolve(111);
    console.log('hahahah');
}).then(function(value) {
    console.log('the first value: ', value);
    return 222;
}, function(err) {
    console.log(err);
}).then(function(value) {
    console.log('the second value: ', value);
})