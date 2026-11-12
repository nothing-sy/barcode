/**
 * Browser build: EAN-13
 * Prefer: npm package `canvas-barcode` / js/barcode.js
 */
;(function (global) {
	'use strict'
	var mod = typeof module !== 'undefined' && module.exports
		? null
		: null

	function load() {
		if (typeof require === 'function') {
			try {
				return require('./barcode.js').EAN13
			} catch (e) {
				/* browser without bundler */
			}
		}
		return null
	}

	var EAN13 = load()
	if (!EAN13) {
		// Inline fallback kept for bare <script> usage without Node require
		EAN13 = function (code) {
			this.code = String(code == null ? '' : code)
		}
		EAN13.prototype.format = function (code) {
			code = String(code == null ? '' : code)
			if (!/^\d{12,13}$/.test(code)) return false
			return code.slice(0, 12)
		}
		EAN13.prototype.checkCode = function (code) {
			code = this.format(code)
			if (code === false) throw new Error('EAN13: code must be 12 or 13 digits')
			var c1 = 0, c2 = 0, i
			for (i = 0; i < code.length; i++) {
				if (i % 2 === 0) c1 += parseInt(code[i], 10)
				else c2 += parseInt(code[i], 10)
			}
			return (10 - ((c1 + c2 * 3) % 10)) % 10
		}
		EAN13.prototype.encode = function () {
			var code = this.format(this.code)
			if (code === false) throw new Error('EAN13: code must be 12 or 13 digits')
			var charset = {
				0: [0, 0, 0, 0, 0, 0], 1: [0, 0, 1, 0, 1, 1], 2: [0, 0, 1, 1, 0, 1],
				3: [0, 0, 1, 1, 1, 0], 4: [0, 1, 0, 0, 1, 1], 5: [0, 1, 1, 0, 0, 1],
				6: [0, 1, 1, 1, 0, 0], 7: [0, 1, 0, 1, 0, 1], 8: [0, 1, 0, 1, 1, 0],
				9: [0, 1, 1, 0, 1, 0],
			}
			var map = {
				0: ['0001101', '0100111', '1110010'], 1: ['0011001', '0110011', '1100110'],
				2: ['0010011', '0011011', '1101100'], 3: ['0111101', '0100001', '1000010'],
				4: ['0100011', '0011101', '1011100'], 5: ['0110001', '0111001', '1001110'],
				6: ['0101111', '0000101', '1010000'], 7: ['0111011', '0010001', '1000100'],
				8: ['0110111', '0001001', '1001000'], 9: ['0001011', '0010111', '1110100'],
			}
			var front = code.substr(0, 1), left = code.substr(1, 6), right = code.substr(7)
			var _charset = charset[front], leftB = '', rightB = '', i
			for (i = 0; i < left.length; i++) leftB += map[left[i]][_charset[i]]
			for (i = 0; i < right.length; i++) rightB += map[right[i]][2]
			var checkDigit = this.checkCode(code)
			this.checkDigit = checkDigit
			return '00000000000' + '101' + leftB + '01010' + rightB + map[checkDigit][2] + '101' + '00000000000'
		}
		EAN13.prototype.init = function () { return this.encode() }
		EAN13.prototype.draw = function (id, width, height) {
			var canvas = typeof id === 'string' ? document.getElementById(id) : id
			if (!canvas || typeof canvas.getContext !== 'function') throw new Error('EAN13.draw: canvas not found')
			var ctx = canvas.getContext('2d'), binary = this.encode(), num = 0, i
			for (i = 0; i < binary.length; i++) {
				ctx.fillStyle = binary[i] === '0' ? 'white' : 'black'
				ctx.fillRect(num * width, 0, width, height)
				num++
			}
			return this
		}
	}

	global.EAN13 = EAN13
})(typeof window !== 'undefined' ? window : globalThis)
