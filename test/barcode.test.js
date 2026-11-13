import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { EAN13, code128 } from '../src/index.js'
import defaultExport from '../src/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)

function createMockCanvas() {
	const calls = []
	const ctx = {
		fillStyle: '',
		fillRect(x, y, w, h) {
			calls.push({ fillStyle: this.fillStyle, x, y, w, h })
		},
	}
	return {
		getContext() {
			return ctx
		},
		calls,
	}
}

describe('ESM named exports', () => {
	it('exposes EAN13 and code128', () => {
		assert.equal(typeof EAN13, 'function')
		assert.equal(typeof code128, 'function')
		assert.equal(defaultExport.EAN13, EAN13)
		assert.equal(defaultExport.code128, code128)
	})
})

describe('CJS require', () => {
	it('supports require("..") style named props', () => {
		const cjs = require('../dist/canvas-barcode.cjs')
		assert.equal(typeof cjs.EAN13, 'function')
		assert.equal(typeof cjs.code128, 'function')
		assert.equal(new cjs.EAN13('590123412345').checkCode('590123412345'), 7)
	})
})

describe('IIFE globals', () => {
	it('attaches EAN13 and code128 on globalThis', () => {
		const code = readFileSync(join(__dirname, '../dist/canvas-barcode.min.js'), 'utf8')
		const sandbox = { globalThis: {} }
		sandbox.window = sandbox.globalThis
		const fn = new Function('globalThis', 'window', code + '\nreturn globalThis;')
		const g = fn(sandbox.globalThis, sandbox.globalThis)
		assert.equal(typeof g.EAN13, 'function')
		assert.equal(typeof g.code128, 'function')
		assert.equal(typeof g.CanvasBarcode.EAN13, 'function')
		assert.equal(new g.EAN13('590123412345').checkCode('590123412345'), 7)
	})
})

describe('EAN13', () => {
	it('format accepts 12/13 digits only', () => {
		assert.equal(new EAN13('123456789012').format('123456789012'), '123456789012')
		assert.equal(new EAN13('x').format('1234567890123'), '123456789012')
		assert.equal(new EAN13('x').format('123'), false)
		assert.equal(new EAN13('x').format('abcdefghijkl'), false)
	})

	it('checkCode matches known EAN-13 examples', () => {
		assert.equal(new EAN13('590123412345').checkCode('590123412345'), 7)
		assert.equal(new EAN13('400638133393').checkCode('400638133393'), 1)
		assert.equal(new EAN13('535350244626').checkCode('535350244626'), 1)
		assert.equal(new EAN13('978014103614').checkCode('978014103614'), 4)
	})

	it('encode returns binary with start/mid/end and quiet zones', () => {
		const ean = new EAN13('590123412345')
		const bin = ean.encode()
		assert.match(bin, /^0{11}101/)
		assert.match(bin, /1010{11}$/)
		assert.ok(bin.includes('01010'))
		assert.equal(bin.length, 11 + 3 + 42 + 5 + 35 + 7 + 3 + 11)
		assert.equal(ean.checkDigit, 7)
	})

	it('encode throws on invalid input', () => {
		assert.throws(() => new EAN13('abc').encode(), /12 or 13 digits/)
	})

	it('draw paints bars on canvas', () => {
		const canvas = createMockCanvas()
		globalThis.document = {
			getElementById() {
				return canvas
			},
		}
		const ean = new EAN13('590123412345')
		ean.draw('c', 2, 100)
		assert.ok(canvas.calls.length > 50)
		assert.ok(canvas.calls.every((c) => c.fillStyle === 'white' || c.fillStyle === 'black'))
		assert.equal(canvas.calls[0].w, 2)
		assert.equal(canvas.calls[0].h, 100)
	})

	it('draw accepts canvas element directly', () => {
		const canvas = createMockCanvas()
		new EAN13('590123412345').draw(canvas, 1, 40)
		assert.ok(canvas.calls.length > 0)
	})
})

describe('code128', () => {
	it('selects Code B for lowercase', () => {
		const b = new code128('abc')
		const pattern = b.encode()
		assert.equal(b.setName, 'B')
		assert.match(pattern, /^b+s/)
		assert.ok(pattern.length > 20)
	})

	it('selects Code A for uppercase / digits (odd length)', () => {
		const a = new code128('ABC')
		a.encode()
		assert.equal(a.setName, 'A')
		const d = new code128('123')
		d.encode()
		assert.equal(d.setName, 'A')
	})

	it('selects Code C for even-length pure digits', () => {
		const c = new code128('123456')
		const pattern = c.encode()
		assert.equal(c.setName, 'C')
		assert.deepEqual(c.bancodeIndex, [12, 34, 56])
		assert.ok(pattern.includes('b') && pattern.includes('s'))
	})

	it('checksum is stable and encode is idempotent', () => {
		const first = new code128('SH125896')
		const p1 = first.encode()
		const p2 = first.encode()
		assert.equal(p1, p2)
		assert.equal(first.setName, 'A')
	})

	it('draw paints bars and resets between calls', () => {
		const canvas = createMockCanvas()
		globalThis.document = {
			getElementById() {
				return canvas
			},
		}
		const barcode = new code128('6903')
		barcode.draw('canvas', 2, 100)
		const n1 = canvas.calls.length
		barcode.draw('canvas', 2, 100)
		assert.equal(canvas.calls.length, n1 * 2)
	})

	it('throws on empty / unsupported characters for A/B', () => {
		assert.throws(() => new code128('').encode(), /empty/)
		assert.throws(() => new code128('你好').encode(), /unsupported/)
	})
})
