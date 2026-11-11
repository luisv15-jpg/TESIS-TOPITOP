import { describe, expect, it } from 'vitest'
import { CAMPANIAS } from '../data/campanias'
import type { Campania } from '../types'
import { obtenerCampaniaDestacada } from './campanias.service'

describe('obtenerCampaniaDestacada', () => {
  it('devuelve la campaña Cyber Top con sus condiciones', () => {
    const campania = obtenerCampaniaDestacada()

    expect(campania.titulo).toEqual(['Cyber', 'Top'])
    expect(campania.regalo.montoMinimo).toBe(250)
    expect(campania.descuento.monto).toBe(30)
    expect(campania.cupon.codigo).toBe('CYBERTOP30')
  })

  it('elige la campaña marcada como destacada', () => {
    const otra: Campania = { ...CAMPANIAS[0], id: 'otra', destacada: true }
    const lista = [{ ...CAMPANIAS[0], destacada: false }, otra]

    expect(obtenerCampaniaDestacada(lista).id).toBe('otra')
  })

  it('falla con un mensaje claro si ninguna campaña está destacada', () => {
    const lista = [{ ...CAMPANIAS[0], destacada: false }]

    expect(() => obtenerCampaniaDestacada(lista)).toThrow(/destacada/)
  })
})
