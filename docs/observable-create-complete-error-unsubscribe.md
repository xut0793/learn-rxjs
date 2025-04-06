# Observable

Observable 是包含多个值，具有惰性推送（lazy push）特征的数据集合。

在[观察者模式](./observer-iterator-pattern.md)中，Observable 是一个被观察的对象。

```
                          订阅
+---------------+       subscribe        +-----------+
|               | <--------------------+ |           |
| 可被观察的对象  |                        | 观察者     |
| Observable    |                        | Observer  |
|               | +--------------------> |           |
+---------------+  next/complete/error   +-----------+
                         通知
```

以设计模式中的“分而治之”的思想来看，对存在一对多的依赖关系的问题中，在逻辑上将耦合的部分，拆分成被观察对象（Observable）和观察者（Observer），其中:

- 被观察对象只管负责发布事件，并通知所有已订阅的观察者，而不用去关心这些观察者如何处理这些事件。
- 相对的，观察者通过订阅某个对象，只管接收到事件，然后进行处理，而不关心这些事件是如何产生的。

“分”了之后（解耦了），又如何“治”呢？即被观察者（Observable）和观察者（Observer）如何建立起联系呢？

这里就有如下约定：

- 被观察者（Observable）必须实现一个 `subscribe` 方法，用于观察者（Observer）进行订阅。并且该方法调用之后返回一个 Subscription 对象，它有一个用于取消订阅的方法 `unsubscribe`。
- 观察者（Observer）必须实现 `next / complete / error` 方法。
  - next: 当 Observable 内部要推送一个值时，会调用这个方法。
  - error: 当 Observable 内部发生错误时，会调用这个方法。
  - complete: 当 Observable 内部完成时，会调用这个方法。

基本示例：

```js
import { Observable } from "rxjs"

// 创建一个 Observable 对象，入参为一个函数，该函数会被作为订阅者的回调函数，接收一个 Observer 对象
const observable = new Observable((observer) => {
  // 省略产生数据的逻辑
  observer.next(1) // 推送一个值
  observer.next(2) // 推送一个值
  observer.next(3) // 推送一个值

  // 或者完成
  observer.complete() // 完成

  // 或者出错
  observer.error(new Error("Something went wrong"))
})

// 声明一个观察者对象，需要实现 next / complete / error 方法
const observer = {
  next: (value) => {
    console.log(value) // 1 2 3
  },
  complete: () => {
    console.log("complete")
  },
  error: (error) => {
    console.error(error) // Error: Something went wrong
  },
}

// 订阅 Observable 对象
const subscription = observable.subscribe(observer)

// 取消订阅
subscription.unsubscribe()
```

我们可以源码中 `of` 的实现来对比下 Observable 的创建过程：

```ts
/**
 * @example
 * const source$ = of(1, 2, 3)
 * source$.subscribe(console.log)
 */
export function of<T>(...values: T[]): Observable<T> {
  return new Observable<T>((subscriber) => {
    const length = array.length
    for (let i = 0; i < length; i++) {
      if (subscriber.closed) {
        return
      }
      subscriber.next(array[i]!)
    }
    subscriber.complete()
  })
}
```

这里 `subscriber` 是 rxjs 内部实现的一个对象，它对外部订阅时(`subscribe`)传入的 `observer` 进行了安全的封装，在这里可以简单理解为同一个对象。

## observer 的简单形式

为了代码更简洁，`subscribe` 方法也可以直接接受函数入参，第一个参数当作 next，第二个参数当作 error，第三参数是 complete。

```js
source$.subscribe(
  (value) => {
    console.log(value)
  },
  (error) => {
    console.error(error)
  },
  () => {
    console.log("complete")
  }
)
```

如果不关心某些事件，可以不传入对应的参数。比如只是一个简单的产生递增整数的序列，也没必要提供 error 方法。并且对一个永远不会结束的 Observable 进行订阅，也不需要提供 complete 方法。

```js
const source$ = new Observable((subscriber) => {
  let i = 0
  setInterval(() => {
    subscriber.next(i++)
  }, 1000)
})
source$.subscribe((value) => {
  console.log(value)
})
```

上述代码中，`setInterval` 会一直执行，不会停止，所以不会调用 `complete` 方法。所以在订阅时也不需要提供 complete 方法。只传入第一个参数 next 函数接收数据即可。

上述定时输出的代码，也可以用 `interval` 方法来实现：

```js
import { interval } from "rxjs"
const source$ = interval(1000)
source$.subscribe((value) => {
  console.log(value)
})
```

## Hot Observable 和 Cold Observable

Observable 对象就是一个数据流，可以在一个时间范围内吐出一系列数据，如果只存在一个 Observer，一切都很简单，但是对于存在多个 Observer 的场景，情况就变得复杂了。、

假设有这样的场景，一个 Observable 对象有两个 Observer 对象来订阅，而且这两个 Observer 对象并不是同时订阅，第一个 Observer 对象订阅 N 秒钟之后，第二个 Observer 对象才订阅同一个 Observable 对象，而且，在这 N 秒钟之内，Observable 对象已经吐出了一些数据。现在问题来了，后来订阅上的 Observer，是不是应该接收到“错过”的那些数据呢？

- 选择 A：错过就错过了，只需要接受从订阅那一刻开始 Observable 产生的数据就行。
- 选择 B：不能错过，需要获取 Observable 之前产生的数据。

应该选 A 还是选 B，没有定论，针对不同的应用场景，完全会有不同的期望结果。非常现实的例子，电视台的任何一个频道的节目如果看作是一个 Observable 对象，那么每一台电视机就是一个 Observer，当你打开电视切换到一个频道的时候，相当于 subscribe 上了对应频道的 Observable，毫无疑问，切换到某个频道，你所看到的节目内容就是从那一刻开始的，不包含之前的内容，所以，对于电视这个场景，恰当的答案是选择 A。
这世界上还有一些视频点播网站，可供点播的每一个剧集看作一个 Observable 对象，那么你观看的浏览器就是 Observer。当你在浏览器中打开某个电视剧的某一集，就是从这一集的第一秒钟开始播放，另一个用户在另一个时间另一台电脑上打开同样的剧集，也是从第一秒钟开始播放，互相没有影响，这就是选择 B。

实际上，RxJS 已经考虑到了这两种不同场景的特点，让 Observable 支持这两种不同的需求，对应于选择 A，称这样的 Observable 为`Hot Observable`，对于选择 B，称之为`ColdObservable`。

- `Hot Observable` 相当于我们观看直播视频，不管什么时候开始看，视频都是按自己的节奏播放的。
- `Cold Observable` 相当于我们观看回放的视频，不管什么时候开始看，视频都是从第一秒钟开始播放的。

Cold Observable 对象，有代表性比如：

- interval，每隔指定时间吐出递增整数数据，从上面的例子我们也领教到了，对 interval 产生的 Observable 对象每 subscribe 一次，都会产生一个全新的递增整数序列。
- range，这个比较容易理解，因为 range 是一次同步吐出一个范围内的数值，每次被 subscribe 都生成全新的序列。

Hot Observable 对象，有代表性比如：

- fromEvent，监听 DOM 事件，每次订阅接收到的是当前及之后的点击数据。
- fromPromise，监听 Promise 对象，每次订阅接收到的是当前及之后的 Promise 对象结果。
- fromEventPattern，监听自定义事件，每次订阅接收到的是当前及之后的自定义事件。
- fromWebSocket，监听 WebSocket 连接，每次订阅接收到的是最新 WebSocket 推送的数据。
- fromFetch，监听 Fetch 请求，每次订阅接收到的是当前 Fetch 请求响应的数据。
- fromGenerator，监听 Generator 函数，每次订阅接收到的是当前及之后的 Generator 函数。

## 与 Promise 的比较

对比下 Promise 方式推送数据：

```js
const promise = new Promise((resolve, reject) => {
  // 省略产生数据的逻辑
  // 或者完成
  resolve() // 完成
  // 或者出错
  reject(new Error("Something went wrong"))
})

promise
  .then((value) => {
    console.log(value) // 1
  })
  .catch((error) => {
    console.error(error) // Error: Something went wrong
  })
```

Promise 与 Observable 都可以用于异步编程：

- Observable 可以推送多个值，而 Promise 只能推送一个值。
- Promise 有三种状态：pending、fulfilled、rejected，并且一旦状态改变，就不能再改变。
- Observable 也有三种状态：next、complete、error。并且同样的，一旦数据状态变为 complete 或 error，就不再推送 next。
- Promise 是立即执行的，而 Observable 是惰性执行的。
