import { describe, expect, it } from 'vitest'
import type { Producto } from '../types'
import { buscarRango, esOrden, filtrarPorPresupuesto, ordenarProductos, RANGOS_PRESUPUESTO } from './presupuesto'

function producto(id: string, precio: number): Producto {
  return {
    id,
    nombre: id,
    titular: id,
    categorias: ['mujer'],
    precio,
    colores: [{ nombre: 'Rojo', hex: '#c00' }],
    tallas: ['M'],
    imagen: { src: `/${id}.webp`, srcset: '', alt: id },
  }
}

const PRODUCTOS = [producto('b', 59.9), producto('a', 29.9), producto('c', 49.95), producto('d', 99.95), producto('e', 100)]

describe('presupuesto', () => {
  it('reparte los precios en tramos sin huecos ni cruces, aunque no terminen en ,90', () => {
    const [hasta49, de50, desde100] = RANGOS_PRESUPUESTO

    expect(filtrarPorPresupuesto(PRODUCTOS, hasta49).map((p) => p.id)).toEqual(['a', 'c'])
    expect(filtrarPorPresupuesto(PRODUCTOS, de50).map((p) => p.id)).toEqual(['b', 'd'])
    expect(filtrarPorPresupuesto(PRODUCTOS, desde100).map((p) => p.id)).toEqual(['e'])
  })

  it('encuentra un tramo por su id y rechaza uno desconocido', () => {
    expect(buscarRango('desde-100')?.etiqueta).toBe('S/. 100 a más')
    expect(buscarRango('gratis')).toBeUndefined()
    expect(buscarRango(null)).toBeUndefined()
  })

  it('ordena por precio sin tocar la lista original', () => {
    const original = [...PRODUCTOS]

    expect(ordenarProductos(PRODUCTOS, 'menor-precio').map((p) => p.id)).toEqual(['a', 'c', 'b', 'd', 'e'])
    expect(ordenarProductos(PRODUCTOS, 'mayor-precio').map((p) => p.id)).toEqual(['e', 'd', 'b', 'c', 'a'])
    expect(ordenarProductos(PRODUCTOS, 'recomendados')).toEqual(original)
    expect(PRODUCTOS).toEqual(original)
  })

  it('reconoce solo los órdenes que existen', () => {
    expect(esOrden('mayor-precio')).toBe(true)
    expect(esOrden('alfabetico')).toBe(false)
    expect(esOrden(null)).toBe(false)
  })
})
