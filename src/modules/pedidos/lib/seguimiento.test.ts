import { describe, expect, it } from 'vitest'
import { esCodigoPedidoValido, formatearFechaPedido, pasosDelPedido } from './seguimiento'

describe('esCodigoPedidoValido', () => {
  it('acepta TT- con 6 cifras', () => {
    expect(esCodigoPedidoValido('TT-104832')).toBe(true)
  })

  it.each(['TT-10483', 'TT104832', 'XX-104832', 'tt-104832'])('rechaza %s', (codigo) => {
    expect(esCodigoPedidoValido(codigo)).toBe(false)
  })
})

describe('pasosDelPedido', () => {
  it('marca los pasos anteriores como hechos y el estado del pedido como actual', () => {
    expect(pasosDelPedido('en-camino').map((paso) => paso.estado)).toEqual(['hecho', 'hecho', 'actual', 'pendiente'])
  })

  it('deja todo pendiente salvo el primero en un pedido recién confirmado', () => {
    expect(pasosDelPedido('confirmado').map((paso) => paso.estado)).toEqual([
      'actual',
      'pendiente',
      'pendiente',
      'pendiente',
    ])
  })
})

describe('formatearFechaPedido', () => {
  it('escribe la fecha en español con la hora de Lima', () => {
    // 2 a. m. en Lima del día 8 sigue siendo el día 8, aunque en UTC ya sea otro.
    expect(formatearFechaPedido('2026-11-08T02:00:00-05:00')).toBe('8 de noviembre de 2026')
  })
})
