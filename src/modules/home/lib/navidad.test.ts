import { describe, expect, it } from 'vitest'
import { diasParaNavidad, etapaEnvio, type FechasEnvio } from './navidad'

const FECHAS: FechasEnvio = { provincias: { mes: 12, dia: 17 }, lima: { mes: 12, dia: 21 } }

describe('diasParaNavidad', () => {
  it('cuenta días de calendario hasta el 25 de diciembre, sin importar la hora', () => {
    expect(diasParaNavidad(new Date(2026, 10, 20, 9, 30))).toBe(35)
    expect(diasParaNavidad(new Date(2026, 10, 20, 23, 59))).toBe(35)
    expect(diasParaNavidad(new Date(2026, 11, 24, 8))).toBe(1)
  })

  it('da 0 el día de Navidad y pasa al año siguiente desde el 26', () => {
    expect(diasParaNavidad(new Date(2026, 11, 25, 18))).toBe(0)
    expect(diasParaNavidad(new Date(2026, 11, 26))).toBe(364)
  })
})

describe('etapaEnvio', () => {
  it('llega a todo el país hasta el último día de provincias', () => {
    expect(etapaEnvio(new Date(2026, 10, 20), FECHAS)).toBe('a-tiempo')
    expect(etapaEnvio(new Date(2026, 11, 17, 22), FECHAS)).toBe('a-tiempo')
  })

  it('después solo llega en Lima, luego queda el recojo en tienda', () => {
    expect(etapaEnvio(new Date(2026, 11, 18), FECHAS)).toBe('solo-lima')
    expect(etapaEnvio(new Date(2026, 11, 21), FECHAS)).toBe('solo-lima')
    expect(etapaEnvio(new Date(2026, 11, 22), FECHAS)).toBe('recojo')
    expect(etapaEnvio(new Date(2026, 11, 24), FECHAS)).toBe('recojo')
  })

  it('desde el 25 la campaña ya pasó', () => {
    expect(etapaEnvio(new Date(2026, 11, 25), FECHAS)).toBe('despues')
    expect(etapaEnvio(new Date(2026, 11, 31), FECHAS)).toBe('despues')
  })
})
