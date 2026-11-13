/*!
 * @deprecated 请改用 dist/canvas-barcode.min.js
 * <script src="dist/canvas-barcode.min.js"></script>
 */
;(function (g) {
	'use strict'
	if (typeof g.code128 === 'undefined') {
		console.error(
			'[canvas-barcode] js/code128.js 已弃用。请引入 dist/canvas-barcode.min.js（会提供全局 EAN13 / code128）。'
		)
	}
})(typeof globalThis !== 'undefined' ? globalThis : window)
