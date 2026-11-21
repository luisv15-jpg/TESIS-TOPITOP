import { describe, expect, it } from 'vitest'
import type { Producto } from '@/modules/catalogo/types'
import { limitarCantidad, limpiarDedicatoria, MAX_DEDICATORIA, sanearCarrito } from './persistencia'

const JEAN = {
  id: 'jean-clasico-azul',
  tallas: ['28', '30', '32'],
  colores: [{ nombre: 'Azul', hex: '#4a6f9c' }],
} as unknown as Producto
const buscar = (id: string) => (id === JEAN.id ? JEAN : undefined)
const VACIO = { items: [], cupon: null, envolver: false, dedicatoria: '' }

describe('sanearCarrito', () => {
  it('conserva las prendas válidas, el cupón y la envoltura', () => {
    const guardado = {
      items: [{ productoId: 'jean-clasico-azul', talla: '30', color: 'Azul', cantidad: 2 }],
      cupon: 'NAVIDADTOP',
      envolver: true,
      dedicatoria: '¡Feliz Navidad, mamá!',
    }

    expect(sanearCarrito(guardado, buscar)).toEqual(guardado)
  })

  it('recorta una dedicatoria demasiado larga y descarta una envoltura que no es booleana', () => {
    const guardado = { items: [], envolver: 'sí', dedicatoria: 'x'.repeat(300) }

    const saneado = sanearCarrito(guardado, buscar)

    expect(saneado.envolver).toBe(false)
    expect(saneado.dedicatoria).toHaveLength(MAX_DEDICATORIA)
  })

  it('descarta prendas que ya no existen o con datos rotos', () => {
    const guardado = {
      items: [
        { productoId: 'producto-retirado', talla: 'M', color: 'Rojo', cantidad: 1 },
        { productoId: 'jean-clasico-azul', talla: '', color: 'Azul', cantidad: 1 },
        { productoId: 'jean-clasico-azul', talla: '30', color: 'Azul', cantidad: 'dos' },
        null,
        'texto',
      ],
      cupon: 42,
    }

    expect(sanearCarrito(guardado, buscar)).toEqual(VACIO)
  })

  it('descarta tallas o colores que la prenda no tiene', () => {
    const guardado = {
      items: [
        { productoId: 'jean-clasico-azul', talla: 'XXL', color: 'Azul', cantidad: 1 },
        { productoId: 'jean-clasico-azul', talla: '30', color: 'Fucsia', cantidad: 1 },
      ],
    }

    expect(sanearCarrito(guardado, buscar).items).toEqual([])
  })

  it('junta las líneas repetidas sumando cantidades hasta el máximo', () => {
    const linea = { productoId: 'jean-clasico-azul', talla: '30', color: 'Azul' }
    const guardado = { items: [{ ...linea, cantidad: 6 }, { ...linea, cantidad: 7 }, { ...linea, talla: '32', cantidad: 1 }] }

    expect(sanearCarrito(guardado, buscar).items).toEqual([
      { ...linea, cantidad: 10 },
      { ...linea, talla: '32', cantidad: 1 },
    ])
  })

  it('deja cada cantidad entre 1 y el máximo', () => {
    const guardado = {
      items: [
        { productoId: 'jean-clasico-azul', talla: '30', color: 'Azul', cantidad: -4 },
        { productoId: 'jean-clasico-azul', talla: '32', color: 'Azul', cantidad: 99 },
      ],
    }

    expect(sanearCarrito(guardado, buscar).items.map((item) => item.cantidad)).toEqual([1, 10])
  })

  it('devuelve un carrito vacío si lo guardado no es un objeto', () => {
    expect(sanearCarrito('roto', buscar)).toEqual(VACIO)
    expect(sanearCarrito(undefined, buscar)).toEqual(VACIO)
  })
})

describe('limpiarDedicatoria', () => {
  it('recorta por caracteres sin partir un emoji', () => {
    const texto = `${'a'.repeat(MAX_DEDICATORIA - 1)}🎄🎁`

    expect(Array.from(limpiarDedicatoria(texto))).toHaveLength(MAX_DEDICATORIA)
    expect(limpiarDedicatoria(texto).endsWith('🎄')).toBe(true)
  })

  it('deja como mucho una línea en blanco seguida', () => {
    expect(limpiarDedicatoria('Feliz\n\n\n\nNavidad')).toBe('Feliz\n\nNavidad')
  })
})

describe('limitarCantidad', () => {
  it('redondea y limita', () => {
    expect(limitarCantidad(2.6)).toBe(3)
    expect(limitarCantidad(0)).toBe(1)
    expect(limitarCantidad(11)).toBe(10)
  })
})
