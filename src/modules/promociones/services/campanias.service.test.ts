import { describe, expect, it } from 'vitest'
import { CAMPANIAS } from '../data/campanias'
import type { Campania } from '../types'
import { buscarCampaniaDestacada, obtenerCampaniaDestacada } from './campanias.service'

describe('obtenerCampaniaDestacada', () => {
  it('devuelve la campaña Navidad Top con sus condiciones', () => {
    const campania = obtenerCampaniaDestacada()

    expect(campania.titulo).toBe('Navidad Top')
    expect(campania.subtitulo).toBe('Regala momentos')
    expect(campania.regalo.montoMinimo).toBe(199)
    expect(campania.descuento.monto).toBe(30)
    expect(campania.cupon.codigo).toBe('NAVIDADTOP')
    expect(campania.luces?.capas).toHaveLength(3)
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

describe('buscarCampaniaDestacada', () => {
  it('devuelve la destacada o undefined, sin lanzar', () => {
    expect(buscarCampaniaDestacada()?.id).toBe('navidad-top')
    expect(buscarCampaniaDestacada([{ ...CAMPANIAS[0], destacada: false }])).toBeUndefined()
  })
})
