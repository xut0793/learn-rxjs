/*
 * @Date         : 2025-04-06 10:14:20 星期0
 * @Author       : xut
 * @Description  :
//  */
// function add(a, b) {
//   return a + b
// }

// const sum = add(1, 2)
// console.log("add(1,2)=%s", sum)

// const sum1 = add.call(null, 1, 2)
// console.log("add.call(null, 1, 2)=%s", sum1)
// const sum2 = add.apply(null, [1, 2])
// console.log("add.apply(null, [1,2])=%s", sum2)

// function* add1(a, b) {
//   yield a + b
//   yield a * 2 + b * 2
//   yield a * 3 + b * 3
// }
// // 调用 add 函数，返回一个迭代器对象
// const iterator = add1(1, 2)
// // 连续调用迭代器对象的 next 方法，返回一个对象
// const result1 = iterator.next() // { value: 3, done: false }
// console.log("🚀 ~ result1:", result1)
// const result2 = iterator.next() // { value: 6, done: false }
// console.log("🚀 ~ result2:", result2)
// const result3 = iterator.next() // { value: 9, done: false }
// console.log("🚀 ~ result3:", result3)
// const result4 = iterator.next() // { value: undefined, done: true }
// console.log("🚀 ~ result4:", result4)

import { interval } from "rxjs"
const source$ = interval(1000)
const intervalSubscription = source$.subscribe(function (value) {
  console.log(value)
})

setTimeout(() => {
  intervalSubscription.unsubscribe() // 取消订阅，停止了 interval 的执行
  console.log("取消订阅，停止了 interval 的执行")
}, 5000)
