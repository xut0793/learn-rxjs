# 下载安装

我们可以通过 npm 来安装。

```bash
npm install rxjs
```

目前最新的版本是 7.8.2。

如果是在浏览器中使用，我们可以通过 cdn 来引入。

```html
<script src="URL_ADDRESS
<script src="https://unpkg.com/rxjs@7.8.2/bundles/rxjs.umd.min.js"></script>
```

## 导入方式

```js
// 导入整个库
import * as Rx from "rxjs"
// 导入特定的类或函数
import { Observable, of } from "rxjs"
// 导入操作符
import { map, filter } from "rxjs/operators"
```

## 版本差异

Rxjs 的几个大版本 v4 / v5 / v6 / v7 在导入方式上都有区别。

### v4

原本 RxJ S 的代码库是 [https://github.com/Reactive-Extensions/RxJS](https://github.com/Reactive-Extensions/RxJS)，它包含了 v4 版本的代码。

```sh
# 安装 v4 版本
npm install rx
```

只支持 commonjs 方式导入，操作符都是挂载在原型对象上的方法。使用方式如下：

```js
const Rx = require("rx")
const source$ = Rx.Observable.of(1, 2, 3).map((x) => x * 2)
source$.subscribe(function (x) {
  console.log(x)
})
```

后来，考虑到架构的巨大差别，另起炉灶，使用了另一个代码库 [https://github.com/ReactiveX/rxjs](https://github.com/ReactiveX/rxjs)，它包含了 V5 及以上版本的代码。

### v5

```js
// 导入整个库
import Rx from "rxjs/Rx"
const source$ = Rx.Observable.of(1, 2, 3).map((x) => x * 2)
source$.subscribe(function (x) {
  console.log(x)
})

// 如果仅需导入特定的类或函数
import { Observable } from "rxjs"
import "rxjs/add/observable/of"
import "rxjs/add/operator/map"
const source$ = Observable.of(1, 2, 3).pipe(map((x) => x * 2))
source$.subscribe(function (x) {
  console.log(x)
})
```

### v6

v6 区分了操作符，并且实现了 `pipe` 方法来组合操作符。

```js
import { of } from "rxjs"
import { map, filter } from "rxjs/operators"

of(1, 2, 3, 4, 5)
  .pipe(
    filter((x) => x % 2 === 1),
    map((x) => x + x)
  )
  .subscribe((x) => console.log(x))
```

### v7

v7 版本是 Rxjs 7 目前最新的发布版本，它是一个完全重写的版本，并且支持了 TypeScript 的类型定义。

在 RxJS v7 中，大多数运算符已移至 'rxjs' 导出站点。这意味着导入运算符的首选方式是从 'rxjs' 导入，而 'rxjs/operators' 导出站点已被弃用。

```js
import { of, map, filter } from "rxjs"
of(1, 2, 3, 4, 5)
  .pipe(
    filter((x) => x % 2 === 1),
    map((x) => x + x)
  )
  .subscribe((x) => console.log(x))
```

RxJS v7 目前有 6 个不同的位置的导出，您可以从中导入所需的位置。这些是：

- 'rxjs' - 例如：`import { of } from 'rxjs';`
- 'rxjs/operators' - 例如：`import { map } from 'rxjs/operators';`此方式将被弃用，建议使用 'rxjs' 导入运算符。
- 'rxjs/ajax' - 例如：`import { ajax } from 'rxjs/ajax';`
- 'rxjs/fetch' - 例如：`import { fromFetch } from 'rxjs/fetch';`
- 'rxjs/webSocket' - 例如：`import { webSocket } from 'rxjs/webSocket';`
- 'rxjs/testing' - 例如：`import { TestScheduler } from 'rxjs/testing';`
