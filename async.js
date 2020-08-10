// async是ES7的关键字，我们没有办法模拟关键字，所以采用函数的方式来实现
// 对于async函数来讲，主要是碰到await的时候，需要等待await后面的函数有了结果，才会再接着向下执行
// 所以这里有个关键的地方，就是如何打断函数的执行，如何恢复函数的执行
// 打断再执行，我们能够想到的就是generator函数
// 而generator函数的执行控制，就是我们myAsync函数所做的功能
// 所以对于myAsync我们期望接收一个generator函数，然后控制这个generator函数的执行
// 在遇到yield返回的是个异步(通常是Promise)时，我们会等待这个异步执行完成，然后再继续往下执行。
// 当然，我们的myAsync函数还不能阻碍myAsync函数下面的代码执行
// 所以我们还要使用promise来产生异步
// 所以我们可以看出，async和await是generator和promise的语法糖
function myAsync(generatorFn) {
    const iterator = generatorFn();
    // 走到第一个wait点
    // 执行完后，需要交程序的执行权交给myAsync下面的代码
    function handler(promiseResult) {
        const {value, done} = iterator.next(promiseResult);
        if (!done) {
            Promise.resolve()
                .then(function() {
                    if (value.then) {
                        // 返回的是个promise
                        value.then(function(promiseResult) {
                            handler(promiseResult);
                        }, function(error) {
                            throw new Error(error);
                        })
                    } else {
                        // 直接使用yield得到的结果
                        handler(value)
                    }
                })
        } else {
            return value;
        }
    }
    return handler();
}


function b() {
    return Promise.resolve(4444);
}

myAsync(function* () {
    const result = yield b();
    console.log(result);
})