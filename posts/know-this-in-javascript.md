


很多人分不清this的指向问题，mdn是描述如下：

> 在绝大多数情况下，函数的调用方式决定了this的值。this不能在执行期间被赋值，在每次函数被调用时this的值也可能会不同。ES5引入了bind方法来设置函数的this值，而不用考虑函数如何被调用的。

所以早起补功课，简单讲讲在实际开发中this的指向问题。

#### #作为对象方法调用

```
var obj = {
  n: 'ued',
  fn: function () {    
    console.log(this.n) 
  }
}

// 作为对象方法调用
obj.fn() // ued
```

#### #作为普通函数调用

```
var n = 'insta360'
var obj = {
  n: 'ued',
  fn: function () {    
    console.log(this.n) 
  }
}

// 作为方法来执行，指向window
// 其实这里遵循引用里的描述，指向运行时的对象，这里是window
var fn = obj.fn
fn() // insta360
```

#### #作为构造器方法调用

```
// 构造器
var CLS = function(){
  this.n = 'ued'

  // 加了下面这句，就是显式返回了，n当然就是返回对象中的n
  // return {
  //   n: 'insta360'
  // }
}

var cls = new CLS()
console.log(cls.n) // ued 或者 insta360
```

#### #call/apply中使用

```
var obj = {
  n: 'ued',
  fn: function () {    
    console.log(this.n) 
  }
}

var ojbNew = {
  n: 'thonatos'
}

// call/apply都能够动态改变传入函数的this，所以这里this指向objNew
obj.fn.call(objNew) // thonatos
obj.fn.apply(objNew, []) // thonatos

```