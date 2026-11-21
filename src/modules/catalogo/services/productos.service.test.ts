import { describe, expect, it } from 'vitest'
import {
  buscarProducto,
  buscarProductos,
  listarIdeasRegalo,
  listarPorCategoria,
  listarProductos,
  normalizar,
} from './productos.service'

describe('productos.service', () => {
  it('normaliza tildes, mayúsculas y espacios', () => {
    expect(normalizar('  Básico JEAN ')).toBe('basico jean')
  })

  it('tiene ids únicos y precios positivos', () => {
    const productos = listarProductos()
    expect(new Set(productos.map((p) => p.id)).size).toBe(productos.length)
    expect(productos.every((p) => p.precio > 0 && p.tallas.length > 0 && p.colores.length > 0)).toBe(true)
  })

  it('marca rebajas solo cuando el precio anterior es mayor', () => {
    const conRebaja = listarProductos().filter((p) => p.precioAntes !== undefined)
    expect(conRebaja.length).toBeGreaterThan(0)
    expect(conRebaja.every((p) => (p.precioAntes ?? 0) > p.precio)).toBe(true)
  })

  it('encuentra un producto por id', () => {
    expect(buscarProducto('jean-clasico-azul')?.nombre).toBe('Jean clásico azul')
    expect(buscarProducto('no-existe')).toBeUndefined()
  })

  it('lista las ideas de regalo de la portada en los tres tramos de precio', () => {
    const ideas = listarIdeasRegalo()
    expect(ideas.some((p) => p.precio < 50)).toBe(true)
    expect(ideas.some((p) => p.precio >= 50 && p.precio < 100)).toBe(true)
    expect(ideas.some((p) => p.precio >= 100)).toBe(true)
  })

  it('filtra por categoría sin importar mayúsculas ni tildes', () => {
    const denim = listarPorCategoria('DENIM')
    expect(denim.map((p) => p.id)).toContain('jean-clasico-azul')
    expect(listarPorCategoria('Básico').length).toBeGreaterThan(0)
  })

  it('busca por todas las palabras, sin tildes', () => {
    expect(buscarProductos('polo blanco').map((p) => p.id)).toEqual(['polo-clasico-blanco'])
    expect(buscarProductos('POLERA rosa').map((p) => p.id)).toEqual(['polera-capucha-rosa'])
    expect(buscarProductos('basico').length).toBeGreaterThan(3)
  })

  it('devuelve una lista vacía para consultas vacías o sin coincidencias', () => {
    expect(buscarProductos('   ')).toEqual([])
    expect(buscarProductos('zapatillas')).toEqual([])
  })
})
