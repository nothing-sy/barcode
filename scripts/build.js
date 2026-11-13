import * as esbuild from 'esbuild'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const entry = join(root, 'src/index.js')
const outdir = join(root, 'dist')

mkdirSync(outdir, { recursive: true })

await esbuild.build({
	entryPoints: [entry],
	outfile: join(outdir, 'canvas-barcode.mjs'),
	bundle: true,
	format: 'esm',
	platform: 'neutral',
	target: ['es2018'],
})

await esbuild.build({
	entryPoints: [entry],
	outfile: join(outdir, 'canvas-barcode.cjs'),
	bundle: true,
	format: 'cjs',
	platform: 'node',
	target: ['es2018'],
})

await esbuild.build({
	entryPoints: [entry],
	outfile: join(outdir, 'canvas-barcode.min.js'),
	bundle: true,
	format: 'iife',
	globalName: 'CanvasBarcode',
	platform: 'browser',
	target: ['es2015'],
	minify: true,
	footer: {
		js: [
			';(function (g, ns) {',
			'  if (!g || !ns) return;',
			'  g.CanvasBarcode = ns;',
			'  g.EAN13 = ns.EAN13;',
			'  g.code128 = ns.code128;',
			'})(typeof globalThis !== "undefined" ? globalThis : (typeof window !== "undefined" ? window : this), CanvasBarcode);',
		].join(''),
	},
})

console.log('built dist/canvas-barcode.{mjs,cjs,min.js}')
