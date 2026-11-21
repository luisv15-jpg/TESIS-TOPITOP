import type { Producto } from '@/modules/catalogo/types'
import type { CondicionesCarrito, ItemCarrito, LineaCarrito, ResumenCarrito } from '../types'

/** Unidades máximas de una misma prenda, talla y color. */
export const MAX_POR_LINEA = 10

/** Soles con dos decimales, sin arrastrar errores de coma flotante. */
export function redondear(monto: number): number {
  return Math.round(monto * 100) / 100
}

export function claveItem(item: Pick<ItemCarrito, 'productoId' | 'talla' | 'color'>): string {
  return `${item.productoId}|${item.talla}|${item.color}`
}

/**
 * En la demo el cupón no vence: así sigue funcionando en la sustentación aunque pase el 25 de
 * diciembre. Con backend, la vigencia la decidiría el servidor.
 */
export function esCuponValido(codigo: string, condiciones: CondicionesCarrito): boolean {
  return codigo.trim().toUpperCase() === condiciones.codigoCupon.toUpperCase()
}

/** Calcula importes, cupón y avance hacia el regalo. No modifica nada. */
export function calcularResumen(
  items: readonly ItemCarrito[],
  cupon: string | null,
  condiciones: CondicionesCarrito,
  buscar: (id: string) => Producto | undefined,
): ResumenCarrito {
  const lineas: LineaCarrito[] = items.flatMap((item) => {
    const producto = buscar(item.productoId)
    if (!producto) return []
    return [{ clave: claveItem(item), item, producto, importe: redondear(producto.precio * item.cantidad) }]
  })

  const subtotal = redondear(lineas.reduce((suma, linea) => suma + linea.importe, 0))
  const cantidad = lineas.reduce((suma, linea) => suma + linea.item.cantidad, 0)
  const cuponAplicado = cupon && esCuponValido(cupon, condiciones) ? condiciones.codigoCupon : null
  const descuento = cuponAplicado ? redondear(Math.min(condiciones.montoCupon, subtotal)) : 0
  const ganaRegalo = subtotal >= condiciones.montoRegalo

  return {
    lineas,
    cantidad,
    subtotal,
    descuento,
    total: redondear(subtotal - descuento),
    cuponAplicado,
    ganaRegalo,
    faltaParaRegalo: ganaRegalo ? 0 : redondear(condiciones.montoRegalo - subtotal),
    avanceRegalo: Math.min(1, subtotal / condiciones.montoRegalo),
  }
}
