import { describe, expect, it } from 'vitest'
import type { Producto } from '@/modules/catalogo/types'
import type { CondicionesCarrito, ItemCarrito } from '../types'
import { calcularResumen, claveItem, esCuponValido, MAX_POR_LINEA, redondear } from './resumen'

const CONDICIONES: CondicionesCarrito = { codigoCupon: 'NAVIDADTOP', montoCupon: 30, montoRegalo: 250 }

function producto(id: string, precio: number): Producto {
  return {
    id,
    nombre: id,
    titular: id,
    categorias: [],
    precio,
    colores: [{ nombre: 'Negro', hex: '#000' }],
    tallas: ['M'],
    imagen: { src: '', srcset: '', alt: '' },
  }
}

const CATALOGO = [producto('polo', 39.9), producto('jean', 99.9), producto('pack', 59.9)]
const buscar = (id: string) => CATALOGO.find((p) => p.id === id)

function item(productoId: string, cantidad = 1): ItemCarrito {
  return { productoId, talla: 'M', color: 'Negro', cantidad }
}

describe('redondear', () => {
  it('evita errores de coma flotante en soles', () => {
    expect(redondear(0.1 + 0.2)).toBe(0.3)
    expect(redondear(39.9 * 3)).toBe(119.7)
  })
})

describe('claveItem', () => {
  it('distingue el mismo producto en otra talla o color', () => {
    expect(claveItem(item('polo'))).toBe('polo|M|Negro')
    expect(claveItem({ ...item('polo'), talla: 'L' })).not.toBe(claveItem(item('polo')))
  })
})

describe('esCuponValido', () => {
  it('acepta el código sin importar mayúsculas ni espacios', () => {
    expect(esCuponValido(' navidadtop ', CONDICIONES)).toBe(true)
    expect(esCuponValido('NAVIDADTOP20', CONDICIONES)).toBe(false)
    expect(esCuponValido('', CONDICIONES)).toBe(false)
  })
})

describe('calcularResumen', () => {
  it('devuelve un carrito vacío en cero', () => {
    const resumen = calcularResumen([], null, CONDICIONES, buscar)

    expect(resumen).toMatchObject({ cantidad: 0, subtotal: 0, descuento: 0, total: 0, ganaRegalo: false })
    expect(resumen.faltaParaRegalo).toBe(250)
    expect(resumen.avanceRegalo).toBe(0)
  })

  it('suma importes y cantidades', () => {
    const resumen = calcularResumen([item('polo', 2), item('jean')], null, CONDICIONES, buscar)

    expect(resumen.cantidad).toBe(3)
    expect(resumen.subtotal).toBe(179.7)
    expect(resumen.lineas.map((l) => l.importe)).toEqual([79.8, 99.9])
    expect(resumen.total).toBe(179.7)
  })

  it('descuenta S/. 30 con el cupón vigente', () => {
    const resumen = calcularResumen([item('jean')], 'NAVIDADTOP', CONDICIONES, buscar)

    expect(resumen.descuento).toBe(30)
    expect(resumen.total).toBe(69.9)
    expect(resumen.cuponAplicado).toBe('NAVIDADTOP')
  })

  it('nunca deja el total por debajo de cero', () => {
    const barato = [producto('media', 9.9)]
    const resumen = calcularResumen([item('media')], 'NAVIDADTOP', CONDICIONES, (id) => barato.find((p) => p.id === id))

    expect(resumen.descuento).toBe(9.9)
    expect(resumen.total).toBe(0)
  })

  it('ignora un cupón que ya no es válido', () => {
    const resumen = calcularResumen([item('jean')], 'VIEJO10', CONDICIONES, buscar)

    expect(resumen.descuento).toBe(0)
    expect(resumen.cuponAplicado).toBeNull()
  })

  it('gana el regalo desde S/. 250 de subtotal y mide el avance', () => {
    const casi = calcularResumen([item('jean', 2)], null, CONDICIONES, buscar)
    expect(casi.ganaRegalo).toBe(false)
    expect(casi.faltaParaRegalo).toBe(50.2)
    expect(casi.avanceRegalo).toBeCloseTo(0.7992)

    const listo = calcularResumen([item('jean', 2), item('pack')], null, CONDICIONES, buscar)
    expect(listo.ganaRegalo).toBe(true)
    expect(listo.faltaParaRegalo).toBe(0)
    expect(listo.avanceRegalo).toBe(1)
  })

  it('descarta productos que ya no existen en el catálogo', () => {
    const resumen = calcularResumen([item('descontinuado'), item('polo')], null, CONDICIONES, buscar)

    expect(resumen.lineas).toHaveLength(1)
    expect(resumen.cantidad).toBe(1)
  })

  it('expone el máximo de unidades por línea', () => {
    expect(MAX_POR_LINEA).toBe(10)
  })
})
