/**
 * Browser build: Code128 A/B/C
 * Prefer: npm package `canvas-barcode` / js/barcode.js
 */
;(function (global) {
	'use strict'

	function code128(code) {
		this.code = String(code == null ? '' : code)
		this.BARS = [
			212222, 222122, 222221, 121223, 121322, 131222, 122213, 122312, 132212, 221213, 221312,
			231212, 112232, 122132, 122231, 113222, 123122, 123221, 223211, 221132, 221231, 213212,
			223112, 312131, 311222, 321122, 321221, 312212, 322112, 322211, 212123, 212321, 232121,
			111323, 131123, 131321, 112313, 132113, 132311, 211313, 231113, 231311, 112133, 112331,
			132131, 113123, 113321, 133121, 313121, 211331, 231131, 213113, 213311, 213131, 311123,
			311321, 331121, 312113, 312311, 332111, 314111, 221411, 431111, 111224, 111422, 121124,
			121421, 141122, 141221, 112214, 112412, 122114, 122411, 142112, 142211, 241211, 221114,
			413111, 241112, 134111, 111242, 121142, 121241, 114212, 124112, 124211, 411212, 421112,
			421211, 212141, 214121, 412121, 111143, 111341, 131141, 114113, 114311, 411113, 411311,
			113141, 114131, 311141, 411131, 211412, 211214, 211232, 2331112,
		]
		this.STARTA = 103
		this.STARTB = 104
		this.STARTC = 105
		this.STOP = 106
		this.bancodeIndex = []
		this.resData = ''
		this.startType = ''
		this.setName = ''
	}

	code128.prototype.bs = function (bandCode) {
		bandCode = String(bandCode)
		var y, t
		for (y = 0; y < bandCode.length; y++) {
			var count = parseInt(bandCode[y], 10)
			for (t = 0; t < count; t++) this.resData += y % 2 === 0 ? 'b' : 's'
		}
	}

	code128.prototype.checkCode = function () {
		var sum = 0
		switch (this.startType) {
			case this.BARS[this.STARTA] + '': sum = 103; break
			case this.BARS[this.STARTB] + '': sum = 104; break
			case this.BARS[this.STARTC] + '': sum = 105; break
			default: throw new Error('code128: startType not set')
		}
		var i
		for (i = 0; i < this.bancodeIndex.length; i++) sum += (i + 1) * this.bancodeIndex[i]
		return this.BARS[sum % 103]
	}

	code128.prototype._reset = function () {
		this.bancodeIndex = []
		this.resData = ''
		this.startType = ''
		this.setName = ''
	}

	code128.prototype.encode = function () {
		this._reset()
		var code = this.code
		if (!code) throw new Error('code128: empty code')
		var useC = /^\d+$/.test(code) && code.length % 2 === 0
		var offset = 32
		if (useC) {
			this.startType = this.BARS[this.STARTC] + ''
			this.setName = 'C'
		} else if (/[a-z]/.test(code)) {
			this.startType = this.BARS[this.STARTB] + ''
			this.setName = 'B'
		} else {
			this.startType = this.BARS[this.STARTA] + ''
			this.setName = 'A'
		}
		this.bs(this.startType)
		var i
		if (useC) {
			for (i = 0; i < code.length; i += 2) {
				var val = parseInt(code.substr(i, 2), 10)
				this.bancodeIndex.push(val)
				this.bs(this.BARS[val] + '')
			}
		} else {
			for (i = 0; i < code.length; i++) {
				var idx = code.charCodeAt(i) - offset
				if (idx < 0 || idx > 94) throw new Error('code128: unsupported character "' + code[i] + '"')
				this.bancodeIndex.push(idx)
				this.bs(this.BARS[idx] + '')
			}
		}
		this.bs(this.checkCode() + '')
		this.bs(this.BARS[this.STOP] + '')
		return this.resData
	}

	code128.prototype.draw = function (id, width, height) {
		var canvas = typeof id === 'string' ? document.getElementById(id) : id
		if (!canvas || typeof canvas.getContext !== 'function') throw new Error('code128.draw: canvas not found')
		var ctx = canvas.getContext('2d'), pattern = this.encode(), num = 0, i
		for (i = 0; i < pattern.length; i++) {
			ctx.fillStyle = pattern[i] === 's' ? 'white' : 'black'
			ctx.fillRect(num * width, 0, width, height)
			num++
		}
		return this
	}

	global.code128 = code128
})(typeof window !== 'undefined' ? window : globalThis)
