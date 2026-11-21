import type { Producto } from '@/modules/catalogo/types'
import { comoObjeto, esNumero, esTexto } from '@/shared/lib/persistencia'
import type { ItemCarrito } from '../types'
import { claveItem, MAX_POR_LINEA } from './resumen'

/** Largo máximo de la dedicatoria que va impresa en la tarjeta del regalo. */
export const MAX_DEDICATORIA = 120

export type CarritoGuardado = { items: ItemCarrito[]; cupon: string | null; envolver: boolean; dedicatoria: string }

/** Deja como mucho una línea en blanco seguida y recorta al largo de la tarjeta sin partir un emoji. */
export function limpiarDedicatoria(texto: string): string {
  return Array.from(texto.replace(/\n{3,}/g, '\n\n'))
    .slice(0, MAX_DEDICATORIA)
    .join('')
}

export function limitarCantidad(cantidad: number): number {
  return Math.max(1, Math.min(MAX_POR_LINEA, Math.round(cantidad)))
}

/** Una línea guardada es válida si la prenda existe y tiene esa talla y ese color. */
function sanearItem(crudo: unknown, buscar: (id: string) => Producto | undefined): ItemCarrito | null {
  const { productoId, talla, color, cantidad } = comoObjeto(crudo)
  if (!esTexto(productoId) || !esTexto(talla) || !esTexto(color) || !esNumero(cantidad)) return null
  const producto = buscar(productoId)
  if (!producto?.tallas.includes(talla) || !producto.colores.some((opcion) => opcion.nombre === color)) return null
  return { productoId, talla, color, cantidad: limitarCantidad(cantidad) }
}

/** Junta las líneas repetidas (misma prenda, talla y color) sumando cantidades, sin pasar el máximo. */
function juntarRepetidos(items: readonly ItemCarrito[]): ItemCarrito[] {
  const porClave = new Map<string, ItemCarrito>()
  for (const item of items) {
    const previo = porClave.get(claveItem(item))
    porClave.set(claveItem(item), previo ? { ...previo, cantidad: limitarCantidad(previo.cantidad + item.cantidad) } : item)
  }
  return [...porClave.values()]
}

/**
 * Valida el carrito leído del navegador: descarta prendas que ya no existen, tallas o colores que la
 * prenda no tiene y datos rotos; junta líneas repetidas y deja cada cantidad entre 1 y el máximo.
 * Así un dato viejo o editado a mano no rompe la página.
 */
export function sanearCarrito(guardado: unknown, buscar: (id: string) => Producto | undefined): CarritoGuardado {
  const datos = comoObjeto(guardado)
  const crudos = Array.isArray(datos.items) ? datos.items : []
  const items = juntarRepetidos(crudos.flatMap((crudo) => sanearItem(crudo, buscar) ?? []))
  return {
    items,
    cupon: esTexto(datos.cupon) ? datos.cupon : null,
    envolver: datos.envolver === true,
    dedicatoria: typeof datos.dedicatoria === 'string' ? limpiarDedicatoria(datos.dedicatoria) : '',
  }
}
