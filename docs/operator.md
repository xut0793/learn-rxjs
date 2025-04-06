# Operator 操作符

任何一种 Reactive Extension 的实现，都包含一个操作符的集合，这是 Reactive Extension 的重要组成部分，RxJS 作为 JavaScript 语言的 Reactive Extension 实现，当然也不例外。

## What is operator?

一个 Observable 对象代表的是一个数据流，对于现实中复杂的问题，并不会创造一个数据流之后就马上通过 subscribe 方法进行订阅，往往需要对这个数据流做一系列处理，然后才交给 Observer。

而操作符则是对这个数据流进行操作的函数，操作符可以对数据流进行过滤、映射、合并等操作，从而实现对数据流的处理。

所以，操作符是一个把上游数据转化为下游数据的函数，它接受一个 Observable 作为输入，并返回一个新的 Observable。

## Why use operator?

在 RxJS 的世界中，每个操作符专注于解决通用的简单功能，但通过 Pipe 方法，这些小功能可以组合在一起，用来解决复杂的问题。

使用和组合操作符是 RxJS 编程的重要部分，毫不夸张地说，对操作符使用的熟练程度决定对 RxJS 的掌握程度。

RxJS 提供了大量的操作符(V5 版本自带了 60 多个操作符)，这些操作符根据不同的维度，也有不同的分类。

一、按照使用方式，操作符可以分为：

- Pipeable operators：主要用于 pipe 方法，用于对 Observable 进行转换、过滤、组合等操作。比如 map / filter 等。
- Creation operators：用于创建不同类型的 Observable 对象，提供 pipe 方法。比如 of / from / interval / timer / ajax / webSocket 等。

```js
import { of, map, filter } from "rxjs"
const source$ = of(1, 2, 3, 4, 5)
const result$ = source$.pipe(
  map((x) => x * 2),
  filter((x) => x > 4)
)
result$.subscribe(console.log)
```

二、按照功能，操作符可以分为：

- Creation operators 创建类操作符：实际场景中，产生 Observable 对象并不是每次都通过直接调用 Observable 构造函数来创造数据流对象。RxJS 提供了一系列的创建操作符，用于创建不同类型的 Observable 对象。
- Transformation operators 转化类操作符：用于对 Observable 对象进行转换，比如 map、filter、flatMap、concatMap、mergeMap、switchMap 等。
- Filtering operators 过滤类操作符：用于对 Observable 对象进行过滤，比如 filter、take、takeWhile、takeUntil、skip、skipWhile、skipUntil、debounce、throttle、distinct、distinctUntilChanged 等。
- Combination operators 组合类操作符：用于对多个 Observable 对象进行组合，比如 concat、merge、combineLatest、zip、forkJoin、race 等。
- Multicasting operators 多播类操作符：用于对 Observable 对象进行多播，比如 share、publish、publishLast、publishBehavior、publishReplay、multicast 等。
- Error handling operators 错误处理类操作符：用于对 Observable 对象进行错误处理，比如 catchError、retry、retryWhen、throwError 等。
- Conditional and boolean operators 条件和布尔类操作符：用于对 Observable 对象进行条件判断，比如 if、else、switch、when、defaultIfEmpty、isEmpty、iif 等。
- Mathematical and aggregate operators 数学和聚合类操作符：用于对 Observable 对象进行数学计算和聚合操作，比如 reduce、scan、min、max、average、count、sum 等。
- Time and timing operators 时间和定时类操作符：用于对 Observable 对象进行时间和定时操作，比如 delay、delayWhen、throttleTime、debounceTime、timeout、timeoutWith、interval、timer、range、date 等。
- Utility operators 实用类操作符：用于对 Observable 对象进行实用操作，比如 tap、do、let、dematerialize、materialize、timeInterval、timestamp、audit、auditTime、dematerialize、materialize、toArray、toPromise、toAsync 等。
- Connectable observable operators 可连接的 Observable 类操作符：用于对 Observable 对象进行可连接操作，比如 publish、refCount、share、shareReplay、multicast 等。
- Deprecation warnings operators 弃用警告类操作符：用于对 Observable 对象进行弃用警告操作，比如 doOnNext、doOnCompleted、doOnError、doOnSubscribe、doOnUnsubscribe、doOnDispose 等。
- WebSocket support operators WebSocket 支持类操作符：用于对 WebSocket 对象进行操作，比如 webSocket、webSocketSubject、webSocketSend、webSocketReceive 等。

## How to use operator?

要想真正掌握操作符，就要将操作符放到某个问题场景中去理解其应用模式，有时候，一个问题可以用不同的操作符来解决，不同操作符各有什么优势，什么样的具体场景需要选择什么操作符。

在 RxJS V7 版本中，基于上所有操作符都从 rxjs 库中统一导出。

```js
import { of, map, filter } from "rxjs"
const source$ = of(1, 2, 3, 4, 5)
const result$ = source$.pipe(
  map((x) => x * 2),
  filter((x) => x > 4)
)
result$.subscribe(console.log)
```

## How to implement operator?

有两种方式创建操作符：

- 第一种：使用 `pipe` 方法，通过 `pipe` 方法可以将多个操作符组合在一起，形成一个新的操作符。

```js
import { pipe, filter, map } from "rxjs"

// 实现丢弃奇数值并将偶数值加倍
function discardOddDoubleEven() {
  return pipe(
    filter((v) => !(v % 2)),
    map((v) => v + v)
  )
}

// 使用 discardOddDoubleEven 操作符
const source$ = of(1, 2, 3, 4, 5)
const result$ = source$.pipe(discardOddDoubleEven())
result$.subscribe(console.log) // 输出 4, 8
```

- 第二种：创建全新的操作符

如果不能由现有运算符组合实现功能（这种情况很少见），可以使用 Observable 构建函数从头创建一个操作符。

创建一个全新的操作符，必须实现以下几点：

- 在订阅输入 Observable 对象时传入的 observer 对象，要实现 next、error 和 complete 方法。
- 实现一个 “finalization” 函数，在 Observable 完成时进行清理（在本例中，通过取消订阅并清除任何挂起的超时）。
- 从传递给 Observable 构造函数的函数返回该终结函数。

先回顾下利用 Observable 构建函数创建一个 Observable 对象的代码

```js
const observable = new Observable((subscriber) => {
  // This function will be called each time this 这个函数每次都会被调用
  // Observable is subscribed to.  订阅时传入的被包装过的 Observer 对象
  subscriber.next(1)
  subscriber.next(2) // 推送值
  subscriber.next(3)
  subscriber.complete() // 完成上游的 Observable
})
// 订阅上游的 Observable
const subscription = observable.subscribe({
  next: (value) => console.log(value),
  error: (err) => console.log("error: " + err),
  complete: () => console.log("complete"),
})

// 取消订阅
subscription.unsubscribe()
// 输出
// 1
// 2
// 3
// complete
```

下面只是一个例子，因为 `delay` 运算符已存在

```ts
import { Observable, of } from "rxjs"

/**
 * 创建一个延迟操作符，用于延迟 Observable 发出值的时间。
 *
 * @param delayInMillis - 延迟的毫秒数。
 * @returns 一个高阶函数，接受一个 Observable 并返回一个新的 Observable，该 Observable 会延迟发出值。
 */
function delay<T>(delayInMillis: number) {
  return (observable: Observable<T>) =>
    new Observable<T>((subscriber) => {
      // this function will be called each time this 这个函数每次都会被调用
      // Observable is subscribed to.  订阅上游的 Observable
      const allTimerIDs = new Set()
      let hasCompleted = false
      const subscription = observable.subscribe({
        next(value) {
          // Start a timer to delay the next value 启动一个定时器来延迟下一个值
          // from being pushed.
          const timerID = setTimeout(() => {
            subscriber.next(value)
            // after we push the value, we need to clean up the timer timerID
            // 在推送值之后，我们需要清理定时器 timerID
            allTimerIDs.delete(timerID)
            // If the source has completed, and there are no more timers running,
            // 如果源 Observable 已经完成，并且没有更多的定时器在运行，
            // we can complete the resulting observable.
            // 我们可以完成结果 Observable。
            if (hasCompleted && allTimerIDs.size === 0) {
              subscriber.complete()
            }
          }, delayInMillis)

          allTimerIDs.add(timerID)
        },
        error(err) {
          // We need to make sure we're propagating our errors through.
          // 我们需要确保将错误传播下去。
          subscriber.error(err)
        },
        complete() {
          hasCompleted = true
          // If we still have timers running, we don't want to complete yet.
          // 如果我们还有定时器在运行，我们还不想完成。
          if (allTimerIDs.size === 0) {
            subscriber.complete()
          }
        },
      })

      // Return the finalization logic. This will be invoked when
      // 返回清理逻辑。当结果 Observable 出错、完成或被取消订阅时，将调用此逻辑。
      // the result errors, completes, or is unsubscribed.
      return () => {
        subscription.unsubscribe()
        // Clean up our timers.
        // 清理我们的定时器。
        for (const timerID of allTimerIDs) {
          clearTimeout(timerID)
        }
      }
    })
}

// Try it out!
// 试试吧！
of(1, 2, 3).pipe(delay(1000)).subscribe(console.log)
```

## Backpressure control 背压控制

“回压”​（Backpressure）也称为“背压”​，是一个源自于传统工程中的概念，在一个传输管道中，液体或者气体应该朝某一个方向流动，但是前方管道口径变小，这时候液体或者气体就会在管道中淤积，产生一个和流动方向相反的压力，因为这个压力的方向是往回走的，所以称为回压。

在 RxJS 的世界中，数据管道就像是现实世界中的管道，数据就像是现实中的液体或者气体，如果数据管道中某一个环节处理数据的速度跟不上数据涌入的速度，上游无法把数据推送给下游，就会在缓冲区中积压数据，这就相当于对上游施加了压力，这就是 RxJS 世界中的“回压”​。

这个时候，有两种方式来处理这种情况：

- 第一种：既然处理不过来，干脆就舍弃掉一些涌入的数据，这种方式称为“有损回压控制”​（LossyBackpressure Control）​，通过损失掉一些数据让流入和处理的速度平衡，剩下来的问题就是决定舍弃掉哪些数据？以明白另一组的功能，区别只在于传给下游的数据集合形式。
  - throttle、debounce、audit、sample
  - 以 time 结尾：throttleTime、debounceTime、auditTime、sampleTime
  - 以 last 结尾：throttleLast、debounceLast、auditLast、sampleLast
  - 以 toggle 结尾：throttleToggle、debounceToggle、auditToggle、sampleToggle
  - 以 toggleLast 结尾：throttleToggleLast、debounceToggleLast、auditToggleLast、sampleToggleLast。
- 第二种：把多个上游数据缓存起来放到一个“数据集合”，当时机合适时，把缓存的数据一次性传给下游，这种方式称为“无损回压控制”（Loseless BackpressureControl）​。这里所说的“数据集合”​，可以是一个数组，也可以是一个 Observable 对象。这两组操作符完全意义对应，所以只要理解了其中一组，就可以明白另一组的功能，区别只在于传给下游的数据集合形式。
  - 支持用数组来缓存的操作符以 buffer 开头：buffer、bufferCount、bufferTime、bufferToggle、bufferWhen、bufferToggle。
  - 支持用对象来缓存的操作符以以 window 开头：window、windowCount、windowTime、windowToggle、windowWhen、windowToggle。
