# canvas-barcode

在 Canvas 上绘制 **EAN-13** 与 **Code128（A / B / C）** 条码。

[![npm](https://img.shields.io/npm/v/canvas-barcode.svg)](https://www.npmjs.com/package/canvas-barcode)

## 安装

```bash
npm install canvas-barcode
```

## 用法

### ESM（推荐）

```js
import { EAN13, code128 } from 'canvas-barcode'

new EAN13('590123412345').draw('canvas', 2, 100)
new code128('SH125896').draw('canvas', 2, 100)
new code128('123456').draw('canvas', 2, 40) // Code C
```

也支持默认导入：

```js
import barcode from 'canvas-barcode'
new barcode.EAN13('590123412345').draw('canvas', 2, 100)
```

### CommonJS

```js
const { EAN13, code128 } = require('canvas-barcode')
```

### 浏览器标签引入

使用构建产物 `dist/canvas-barcode.min.js`（挂载 `window.EAN13` / `window.code128`，同时提供 `window.CanvasBarcode`）：

```html
<script src="dist/canvas-barcode.min.js"></script>
<canvas id="EAN" width="500" height="120"></canvas>
<canvas id="code" width="500" height="120"></canvas>
<script>
  new EAN13('590123412345').draw('EAN', 2, 100)
  new code128('SH125896').draw('code', 2, 100)
</script>
```

CDN 示例（版本号按需替换）：

```html
<script src="https://cdn.jsdelivr.net/npm/canvas-barcode@1.2.1/dist/canvas-barcode.min.js"></script>
```

> 旧的 `js/EAN13_b.js` / `js/code128.js` 已弃用，请改用上述单文件。

## API

`draw(target, moduleWidth, height)`：

| 参数 | 说明 |
|------|------|
| `target` | canvas 元素的 `id`，或 canvas DOM 节点 |
| `moduleWidth` | 单个条模块宽度（像素） |
| `height` | 条码高度（像素） |

仅编码、不绘制：

```js
const ean = new EAN13('590123412345')
ean.encode()        // '0'/'1' 二进制串
ean.checkDigit      // 7

const c128 = new code128('abc')
c128.encode()       // 'b'/'s' 黑白模式串
c128.setName        // 'B'
```

### `EAN13`

| 方法 | 说明 |
|------|------|
| `format(code)` | 校验并取前 12 位；非法返回 `false` |
| `checkCode(code)` | 计算校验位 `0–9` |
| `encode()` / `init()` | 返回含空白区的二进制串 |
| `draw(id, width, height)` | 绘制到 canvas |

### `code128`

| 方法 | 说明 |
|------|------|
| `encode()` | 返回 `b`/`s` 模式串，并设置 `setName` 为 `A`/`B`/`C` |
| `draw(id, width, height)` | 绘制到 canvas（可重复调用，内部会重置状态） |

Code128 自动选择编码集：含小写 → B；纯偶数位数字 → C；其它 → A。

## 开发

```bash
npm install
npm test          # 先 build 再跑测试
npm run build     # 输出 dist/canvas-barcode.{mjs,cjs,min.js}
```

## License

ISC
