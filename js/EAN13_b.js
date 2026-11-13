/*!
 * @deprecated 请改用 dist/canvas-barcode.min.js
 * <script src="dist/canvas-barcode.min.js"></script>
 */
;(function (g) {
	'use strict'
	if (typeof g.EAN13 === 'undefined') {
		console.error(
			'[canvas-barcode] js/EAN13_b.js 已弃用。请引入 dist/canvas-barcode.min.js（会提供全局 EAN13 / code128）。'
		)
	}
})(typeof globalThis !== 'undefined' ? globalThis : window)
