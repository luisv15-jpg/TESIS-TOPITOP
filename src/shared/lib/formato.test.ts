import { describe, expect, it } from 'vitest'
import { formatearSoles } from './formato'

describe('formatearSoles', () => {
  it('escribe el monto con el prefijo S/. como en la campaña', () => {
    expect(formatearSoles(250)).toBe('S/. 250')
    expect(formatearSoles(30)).toBe('S/. 30')
  })

  it('agrupa miles y muestra hasta dos decimales al estilo es-PE', () => {
    expect(formatearSoles(1250)).toBe('S/. 1,250')
    expect(formatearSoles(19.9)).toBe('S/. 19.9')
    expect(formatearSoles(0)).toBe('S/. 0')
  })

  it('rechaza montos negativos o que no son números', () => {
    expect(() => formatearSoles(-1)).toThrow(RangeError)
    expect(() => formatearSoles(Number.NaN)).toThrow(RangeError)
    expect(() => formatearSoles(Number.POSITIVE_INFINITY)).toThrow(RangeError)
  })
})
