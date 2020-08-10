Function.prototype.Mybind = function() {
    const self = this;
    const argumentsArr = Array.from(arguments);
    const context = argumentsArr.shift();
    console.log('context', context);
    return function() {
        self.apply(context, argumentsArr.concat(Array.from(arguments)));
    }
}

const obj1 = {
    a: 1,
    fn: function() {
        console.log(this.a);
    },
}

const obj2 = {
    a: 2,
    fn: function() {
        console.log(this.a);
    },
}
const b = obj1.fn.Mybind(obj2);
b();