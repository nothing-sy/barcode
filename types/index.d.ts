export class EAN13 {
  code: string
  checkDigit?: number
  constructor(code: string | number)
  format(code: string | number): string | false
  checkCode(code: string | number): number
  encode(): string
  /** @deprecated use encode() */
  init(): string
  draw(id: string | { getContext(type: '2d'): CanvasRenderingContext2D }, width: number, height: number): this
}

export class code128 {
  code: string
  BARS: number[]
  STARTA: number
  STARTB: number
  STARTC: number
  STOP: number
  bancodeIndex: number[]
  resData: string
  startType: string
  setName: '' | 'A' | 'B' | 'C'
  constructor(code: string | number)
  bs(bandCode: string | number): void
  checkCode(): number
  encode(): string
  draw(id: string | { getContext(type: '2d'): CanvasRenderingContext2D }, width: number, height: number): this
}

declare const barcode: {
  EAN13: typeof EAN13
  code128: typeof code128
}

export = barcode
