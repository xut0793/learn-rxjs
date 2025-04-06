# Deep understanding Rxjs

## Rxjs 的实现基础

Rxjs 是基于观察者模式和迭代器模式实现的。所以先理解下这两种设计模式。

> 设计模式，指的都是解决某一个特定类型问题的套路和方法。

现实世界的问题复杂多变，往往不是靠单独一种模式能够解决的，更需要的是多种模式的组合，RxJS 实现的就是观察者模式和迭代器模式的组合。

> 设计模式的基本思想是：分而治之的思想，就是把一个复杂的问题分解成多个简单的问题，然后再把多个简单的问题组合起来解决复杂的问题。把耦合的代码解耦，让代码更加灵活、可扩展、可维护。通常“分”很容易，关键是“治”（如何治理，让已分开的各部分保持联系）。

### 什么是观察者模式？

观察者模式，也可以称为发布订阅模式。

> 宽泛来说，两者可以认为是同一个概念，更严格来讲，两者有些区别。[理解【观察者模式】和【发布订阅】的区别](https://juejin.cn/post/6978728619782701087)

它解决的是存在一对多的依赖关系的问题，在逻辑上将耦合的部分分成发布者（Publisher）和观察者（Observer），其中:

- 发布者只管负责产生事件，并通知所有已订阅的观察者，而不用去关心这些观察者如何处理这些事件。
- 相对的，观察者通过订阅某个发布者，只管接收到事件，然后进行处理，而不关心这些事件是如何产生的。

这样就把发布者和观察者分开了，但又通过订阅和发布的方式建立起了联系。体现了“分而治之”的思想。

```
                   订阅
+-----------+     subscribe    +-----------+
|           | <--------------+ |           |
| 发布者     |                  | 观察者     |
| Publisher |                  | Observer  |
|           | +--------------> |           |
+-----------+     publish      +-----------+
                   发布
```

简单示例

```js
// 定义发布者类
class Publisher {
  constructor() {
    // 存储所有订阅者的数组
    this.observers = []
  }

  // 订阅方法，用于添加观察者到订阅者列表
  subscribe(observer) {
    this.observers.push(observer)
  }

  // 取消订阅方法，用于从订阅者列表中移除观察者
  unsubscribe(observer) {
    this.observers = this.observers.filter((obs) => obs !== observer)
  }

  // 发布通知方法，用于通知所有订阅者
  notify(data) {
    this.observers.forEach((observer) => observer.receive(data))
  }
}

// 定义观察者类
class Observer {
  constructor(name) {
    // 观察者的名称
    this.name = name
  }

  // 接收发布者的通知并处理数据
  receive(data) {
    console.log(`${this.name} 接收到数据: ${data}`)
  }
}

// 使用示例
const publisher = new Publisher()

// 创建两个观察者实例
const observer1 = new Observer("观察者1")
const observer2 = new Observer("观察者2")

// 观察者订阅发布者
publisher.subscribe(observer1)
publisher.subscribe(observer2)

// 发布者发布通知
publisher.notify("新消息")

// 观察者1取消订阅
publisher.unsubscribe(observer1)

// 发布者再次发布通知
publisher.notify("另一条新消息")
```

### 什么是迭代器？

迭代器模式的主要思想是：把聚合对象的遍历操作从聚合对象中分离出来，放到一个迭代器对象中，使得聚合对象可以独立于迭代操作进行变化。这也是“分而治之”的思想。

数据集合的实现方式很多，可以是一个数组，也可以是一个树形结构，也可以是一个单向链表等等。而迭代器的作用就是约定一个通用的接口，可以顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示，也让使用者完全不用关心这个数据集合的具体实现方式。

迭代者（Iterator，也称为“迭代器”​）指的是能够遍历一个数据集合的对象，它提供了一种顺序访问数据集合元素的方式，比如调用 `iterator.next()`方法获取值。

迭代器的实现方式很多，但不管对应函数如何命名，通常都会包含实现以下功能的方法：

- `next()`：返回一个对象，包含两个属性：`value`和`done`，`value`是当前迭代的值，`done`是一个布尔值，表示是否还有更多的元素可以迭代。
- `hasNext()`：返回一个布尔值，表示是否还有更多的元素可以迭代。
- `current()`：返回当前迭代的值。

```
+-------------+
|  聚合对象    |
+-------------+
        |
        v
+--------------+
|  迭代器对象   |
+--------------+
```

简单示例

```js
// 定义迭代器类
class Iterator {
  constructor(data) {
    // 存储要迭代的数据
    this.data = data
    // 当前迭代的索引
    this.index = 0
  }
  // 检查是否还有下一个元素

  hasNext() {
    return this.index < this.data.length
  }
  // 获取下一个元素
  next() {
    if (this.hasNext()) {
      return { value: this.data[this.index++], done: false }
    }
    return { value: null, done: true }
  },
  // 获取当前元素
  current() {
    return this.data[this.index]
  }
}
// 使用示例
const data = [1, 2, 3, 4, 5]
const iterator = new Iterator(data)
while (iterator.hasNext()) {
  iterator.next()
  console.log(iterator.current())
}
// 输出：1 2 3 4 5
```

## 总结

Reactive Extension 结合了 观察者模式、迭代器模式， 以及使用函数式和声明式的编程，来解决异步事件管理的语言扩展库。
