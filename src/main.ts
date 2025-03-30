/*
 * @Date         : 2025-03-23 13:32:51 星期0
 * @Author       : xut
 * @Description  :
 */
import { of, map, fromEvent, take, scan, Observable } from "rxjs"

/**
 * demo1
 */
const data$ = of(1, 2, 3, 4, 5).pipe(
  map((val) => {
    return val * 2
  })
)

data$.subscribe((val) => {
  console.log(val)
})

/**
 * demo2
 */
fromEvent(window, "DOMContentLoaded").subscribe(() => {
  const btnCounter = document.querySelector(".btn-counter")

  if (btnCounter) {
    const click$ = fromEvent(btnCounter, "click")
    const take$ = click$.pipe(
      scan((count) => count + 1, 0),
      take(5)
    )
    take$.subscribe({
      next: (count) => {
        btnCounter.innerHTML = `点击了${count}次`
      },
      complete: () => {
        console.log("complete")
      },
    })

    // 保留原有的取消订阅逻辑
    // setTimeout(() => {
    //   subscription.unsubscribe()
    // }, 5000)
  }
})

/**
 * demo3
 */
const ob$ = new Observable(function subscribe(observer) {
  observer.next(1)
  observer.next(2)
  observer.next(3)
  observer.complete()

  return function unsubscribe() {
    console.log("unsubscribe")
  }
})

// observer 观察者
const observer = {
  next: (val: any) => {
    console.log(val)
  },
  complete: () => {
    console.log("complete")
  },
  error: (err: any) => {
    console.log(err)
  },
}

const subscription = ob$.subscribe(observer)

subscription.unsubscribe()
