# Why use Rxjs?

在编程的世界中，程序中的数据，站在数据消费者的角度描述，无排就是两种方式，要么我主动获取，要么你主动推给我，就是所谓的**拉 pull**或者**推 push**的方式。

> 正式一点解释就是：拉取和推送是两种不同的协议，用来描述数据生产者 (Producer)如何与数据消费者 (Consumer)进行通信的。

## 什么是拉取 Pull？

在拉取体系中，由消费者来决定何时从生产者那里接收数据。生产者本身不知道数据是何时交付到消费者手中的。

比如在 JavaScript 语言中，函数（Function）属于拉取体系。函数是数据的生产者，通过对函数进行调用“取出”一个返回值来对该数据进行消费。

但是，function 只能返回一个值，一旦 return 之后，即使再次调用，获取到的仍是相同的值。

```js
function add(a, b) {
  return a + b
  return a * 2 + b * 2 // 永远不会执行
}

// 调用 add 函数，返回一个值
const result = add(1, 2)
// 另一种调用方式
const result = add.call(null, 1, 2)
```

ES2015 引入了 generator 生成器函数 (function\*)，这是另外一种类型的拉取方式。调用后返回一个迭代器对象 iterator，可以多次调用它的 next 方法`iterator.next()`，“取出”多个返回值进行消费。

```js
function* add(a, b) {
  yield a + b
  yield a * 2 + b * 2
  yield a * 3 + b * 3
}
// 调用 add 函数，返回一个迭代器对象
const iterator = add(1, 2)
// 连续调用迭代器对象的 next 方法，返回一个对象
const result1 = iterator.next() // { value: 3, done: false }
const result2 = iterator.next() // { value: 6, done: false }
const result3 = iterator.next() // { value: 9, done: false }
const result4 = iterator.next() // { value: undefined, done: true }
```

## 什么是推送 Push？

在推送体系中，由生产者来决定何时把数据发送给消费者。消费者本身不知道何时会接收到数据。

在现代 JavaScript 语言中，Promises 属于推送体系类型。Promise(生产者) 将一个解析过的值传递给已注册的回调函数(消费者)，但不同于函数的是，由 Promise 来决定何时把值“推送”给回调函数。

但是，Promise 只能推送一个值，一旦一个 Promise 被 fulfilled 或者 rejected 之后，即使再次调用（then），获取到的仍是相同的值。

```js
const promise = new Promise((resolve, reject) => {
  resolve(1)
  // 这后面不会生效，因为已经 fulfilled 了
  resolve(2)
  resolve(3)
})

promise
  .then((value) => {
    console.log(value) // 1
  })
  .then((value) => {
    console.log(value) // 1
  })
```

所以在 JavaScript 语言中，缺少一个机制能够实现“推送”多个值，所以 Rxjs 应运而生，在 Rxjs 实现中引入了 Observable，一个新的 JavaScript 推送体系。Observable 是多个值的发布者，负责将值逐个推送给观察者(消费者)。

```js
import { Observable } from "rxjs"
const observable = new Observable((observer) => {
  observer.next(1)
  observer.next(2)
  observer.next(3)
})
observable.subscribe((value) => {
  console.log(value) // 1 2 3
})
```

## 总结

| 数据 data | 单个值   | 多个值               |
| --------- | -------- | -------------------- |
| 拉取 pull | Function | Generator / Iterator |
| 推送 push | Promise  | Observable           |

- Function 是惰性计算，调用时会同步地返回一个单一值。
- Generator 是惰性计算，调用时会同步地返回零到(有可能的)无限多个值。
- Promise 是立即计算，最终可能返回单个值，也可能不返回任何值。
- Observable 是惰性计算，它可以从它被调用的时刻起同步或异步地返回零到(有可能的)无限多个值。

> 惰性计算：指的是如果你不调用，它就不会执行。比如函数 Function 是在调用时才会执行计算，而不是在创建时就立即执行。Promise 就正好相反，它是在创建时就立即执行计算，而不是在调用时才执行。

## 应用场景

Rx（包括 RxJS）擅长处理异步操作，因为它对数据采用“推”的处理方式，当一个数据产生的时候，被推送给对应的处理函数，这个处理函数不用关心数据是同步产生的还是异步产生的，这样就把开发者从命令式异步处理的枷锁中解放了出来。

以前端领域的网页应用为例，网页 DOM 的事件，比如按钮的点击事件可以看作是一个无限的数据流，每点击一次会推送一个数据（事件对象）；通过 WebSocket 获得的服务器端推送消息可以看作是数据流；同样，通过 AJAX 获得服务器端的数据也可以看作是数据流，虽然这个数据流中可能只有一个数据；网页的动画显示当然更可以看作是一个数据流。正因为网页应用中众多问题其实就是数据流的问题，所以用 RxJS 来解决才如此得心应手。

但并不表示 Rx 不适合同步的数据处理，实际上，使用 RxJS 之后大部分代码不需要关心自己是被同步执行还是异步执行，所以处理起来会更加简单。

> 其实，RxJS 并不是专门用来解决异步问题的，它的出现只是为了更好地解决异步问题。RxJS 是一种响应式编程的库，它的核心思想是：把数据看作是一个可以被观察的序列或者数据流，其中数据的变化会被自动传播到所有依赖它的地方。

比如下面使用原生事件监听器实现的代码和使用 Rxjs 实现的代码，它们的功能是一样的，都是监听按钮的点击事件，进行计数。

```js
// 原生事件监听器
const btn = document.getElementById("btn")
let count = 0
btn.addEventListener("click", () => {
  count++
  console.log(count)
})

// Rxjs
import { fromEvent } from "rxjs"
const btn = document.getElementById("btn")
const count$ = fromEvent(btn, "click").pipe(scan((acc, _) => acc + 1, 0))
count$.subscribe((count) => console.log(count))
```

> 代表“流”的变量标示符，都是用`$`符号结尾，这是 RxJS 编程中普遍使用的风格，被称为“芬兰式命名法”​（FinnishNotation）​。

上面关于 rxjs 的代码，也许你现在还是一头雾水，但我们暂时可以不用纠结代码细节，仅阅读上面的 RxJS 代码，可以观察到一个有趣的现象：在使用原生事件监听器的实现中，我们有全局访问的变量`count`​，稍有不慎就会引发 bug；但是在 RxJS 实现中，没有这样存在隐患的变量，变量都收敛在单个处理函数的局部作用域中。
