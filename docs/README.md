# Rxjs

## What is Rxjs? 它是什么？

Rxjs 全称是 Reactive Extensions for JavaScript。

拆解下，关键部分是 Reactive 和 Extensions。其中：

- Reactive 指的是 Reactive Programming 响应式编程;
- Extensions 指它是一种扩展机制。

### What is Reactive Programming? 什么是响应式编程？

Reactive Programming 响应式编程是一种编程范式，或者是一种编程风格，或者是一种编程思想。不要被“响应式”这个词吓到,其实这个概念并没有那么难理解。

如果你使用过 Excel 的公式功能，你就已经应用过响应式编程。下图演示使用 Excel 来统计多个格子中数据之和的功能，在 Excel 表格中，选中 C9 这个格子，在公式部分输入`=SUM(C2:C8)`，之后，无论我在 C2 到 C8 中填写什么数字，C9 这个格子里的数值都会自动更新为 C2 到 C8 所有格子的数值之和，换句话说，C9 能够对这些格子的数值变化作出“响应”​。

<img alt="reactive-programming-excel.jpg" src="./images/reactive-programming-excel.jpg" width="300" >

在这个 Excel 表格中，输入就是用户在 C2 到 C8 格子中填充的数值，用户这个填充动作是完全不可预料的，可能先填 C2，也可能先填 C5，用户还可能反复修改 C4 格子里的数值；用户可能每天填一个数字，也可能到星期天把 7 个格子一次填完……无论用户用何种方式操作，可以把操作看作是基于时间的一个动作序列，每次的操作动作都会产生一个数据，整个操作序列连续起来，像是会产生一个数据流，这个流中的一个元素，是对某个格子修改的的数值，然后不管你是顺序修改，还是隔天修改，或者间隔修改，这个程序都一视同仁，遵循同样的方式响应给 C9。

这个例子展示了响应式编程中的核心思想，就是把程序中的数据看作是一个可以被观察的序列，也可以称为数据流，其中数据的变化会被自动传播到所有依赖它的地方。

### What is Extensions? 什么是扩展机制？

目前社区中的各种编程语言，比如 `.Net / Java / C++ / Ruby / Python / JavaScript` 等等，并没有天生支持响应式编程，所以需要为这些语言增加一些功能扩展（Extension）来支持响应式编程。

Rx 的概念最初由微软公司实现并开源，也就是 Rx.NET，因为 Rx 带来的编程方式大大改进了异步编程模型，在.NET 之后，众多开发者在其他平台和语言上也实现了 Rx 的类库。可见，Rx 其实是一个大家族，在这个大家族中，还有用 Java 实现的 RxJava，用 C++实现的 RxCpp，用 Ruby 实现的 Rx.rb，用 Python 实现的 RxPy。包括这里介绍的 RxJS，就是 JavaScript 语言实现响应式编程的功能扩展库。

## Why Rxjs? 为什么要用 Rxjs？

在编程的世界中，程序中的数据，站在数据消费者的角度描述，无排就是两种方式，要么我主动获取，要么你主动推给我，就是所谓的**拉(pull)**或者**推(push)**。

> 正式一点解释就是：拉取和推送是两种不同的协议，用来描述数据生产者 (Producer)如何与数据消费者 (Consumer)进行通信的。

### 什么是拉取？

在拉取体系中，由消费者来决定何时从生产者那里接收数据。生产者本身不知道数据是何时交付到消费者手中的。

比如在 JavaScript 语言中，函数（Function）属于拉取体系。函数是数据的生产者，通过对函数进行调用“取出”一个返回值来对该数据进行消费。

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

### 什么是推送？

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

所以在 JavaScript 语言中，缺少一个机制能够实现“推送”多个值，所以 Rxjs 应运而生，在 Rxjs 实现中 RxJS 引入了 Observable，一个新的 JavaScript 推送体系。Observable 是多个值的发布者，负责将值“推送”逐个推送给观察者(消费者)。

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

### 总结

| 数据 data | 单个值   | 多个值               |
| --------- | -------- | -------------------- |
| 拉取 pull | Function | Generator / Iterator |
| 推送 push | Promise  | Observable           |

- Function 是惰性计算，调用时会同步地返回一个单一值。
- Generator 是惰性计算，调用时会同步地返回零到(有可能的)无限多个值。
- Promise 是立即计算，最终可能返回单个值，也可能不返回任何值。
- Observable 是惰性计算，它可以从它被调用的时刻起同步或异步地返回零到(有可能的)无限多个值。

> 惰性计算：指的是如果你不调用，它就不会执行。比如函数 Function 是在调用时才会执行计算，而不是在创建时就立即执行。Promise 就正好相反，它是在创建时就立即执行计算，而不是在调用时才执行。

### 应用场景

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

## Rxjs 的概念

- rxjs 的概念，Observable Observer subscription subject operator scheduler
- 函数式编程和响应式编程是 Rxjs 的两大核心思想。
- 观察者模式和迭代器模式是 Rxjs 的实现基础。

## How to use Rxjs? 怎么使用 Rxjs？

- 创建、订阅、取消订阅
- 操作符、管道、调度器、错误处理、调试和测试

## Deep Rxjs? 深入 Rxjs？

- Rxjs 库的源码
