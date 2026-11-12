# canvas-barcode

在 Canvas 上绘制 **EAN-13** 与 **Code128（A / B / C）** 条码。

[![npm](https://img.shields.io/npm/v/canvas-barcode.svg)](https://www.npmjs.com/package/canvas-barcode)

## 安装

```bash
npm install canvas-barcode
```

## 用法（Node / 打包器）

```js
const barcode = require('canvas-barcode')

// EAN-13：传入 12 位数字，校验位自动计算；也可传 13 位
new barcode.EAN13('590123412345').draw('canvas', 2, 100)

// Code128：自动选择编码集
// - 含小写字母 → B
// - 纯偶数位数字 → C
// - 其它 → A
new barcode.code128('SH125896').draw('canvas', 2, 100)
new barcode.code128('123456').draw('canvas', 2, 40) // Code C
```

`draw(target, moduleWidth, height)`：

| 参数 | 说明 |
|------|------|
| `target` | canvas 元素的 `id`，或 canvas DOM 节点 |
| `moduleWidth` | 单个条模块宽度（像素） |
| `height` | 条码高度（像素） |

仅需二进制 / 条空模式、不绘制时：

```js
const ean = new barcode.EAN13('590123412345')
ean.encode()        // '0'/'1' 二进制串
ean.checkDigit      // 7

const c128 = new barcode.code128('abc')
c128.encode()       // 'b'/'s' 黑白模式串
c128.setName        // 'B'
```

## 浏览器直接引入

```html
<script src="js/EAN13_b.js"></script>
<script src="js/code128.js"></script>
<canvas id="EAN" width="500" height="120"></canvas>
<canvas id="code" width="500" height="120"></canvas>
<script>
  new EAN13('590123412345').draw('EAN', 2, 100)
  new code128('SH125896').draw('code', 2, 100)
</script>
```

## API

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

## 开发

```bash
npm test
```

## License

ISC
