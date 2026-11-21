import { describe, expect, it } from 'vitest'
import { lineaDeProducto, porcentajeDescuento } from './ficha'

describe('lineaDeProducto', () => {
  it('nombra la línea de Topitop según para quién es la prenda', () => {
    expect(lineaDeProducto({ categorias: ['mujer', 'outlet'] })).toBe('Topitop Mujer')
    expect(lineaDeProducto({ categorias: ['hombre', 'basico'] })).toBe('Topitop Hombre')
    expect(lineaDeProducto({ categorias: ['infantil', 'basico'] })).toBe('Topitop Kids')
  })

  it('una prenda de mujer y hombre es unisex, y sin persona queda la marca sola', () => {
    expect(lineaDeProducto({ categorias: ['hombre', 'mujer', 'denim'] })).toBe('Topitop Unisex')
    expect(lineaDeProducto({ categorias: ['denim'] })).toBe('Topitop')
  })
})

describe('porcentajeDescuento', () => {
  it('redondea el ahorro al entero más cercano', () => {
    expect(porcentajeDescuento(79.9, 149.9)).toBe(47)
    expect(porcentajeDescuento(59.9, 89.9)).toBe(33)
  })

  it('no hay descuento sin precio anterior, o si no es mayor que el actual', () => {
    expect(porcentajeDescuento(59.9)).toBeNull()
    expect(porcentajeDescuento(59.9, 59.9)).toBeNull()
    expect(porcentajeDescuento(59.9, 40)).toBeNull()
    expect(porcentajeDescuento(59.9, 0)).toBeNull()
  })

  it('una rebaja de céntimos no se anuncia como 0 %', () => {
    expect(porcentajeDescuento(99.8, 99.9)).toBeNull()
  })
})
