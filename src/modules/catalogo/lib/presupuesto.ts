import type { Producto } from '../types'

export type RangoPresupuesto = {
  id: 'menos-de-50' | 'de-50-a-99' | 'desde-100'
  etiqueta: string
  /** Precio mínimo, incluido. */
  desde: number
  /** Precio tope, excluido (el tramo siguiente empieza ahí); Infinity si no tiene tope. */
  hasta: number
}

/** Tramos de precio del buscador de regalos: semiabiertos, sin huecos ni cruces entre ellos. */
export const RANGOS_PRESUPUESTO: readonly RangoPresupuesto[] = Object.freeze([
  { id: 'menos-de-50', etiqueta: 'Menos de S/. 50', desde: 0, hasta: 50 },
  { id: 'de-50-a-99', etiqueta: 'S/. 50 a S/. 99', desde: 50, hasta: 100 },
  { id: 'desde-100', etiqueta: 'S/. 100 a más', desde: 100, hasta: Number.POSITIVE_INFINITY },
])

export function buscarRango(id: string | null | undefined): RangoPresupuesto | undefined {
  return RANGOS_PRESUPUESTO.find((rango) => rango.id === id)
}

export function enPresupuesto(producto: Producto, rango: RangoPresupuesto): boolean {
  return producto.precio >= rango.desde && producto.precio < rango.hasta
}

/** Productos cuyo precio actual cae en el tramo, del más barato al más caro. */
export function filtrarPorPresupuesto(productos: readonly Producto[], rango: RangoPresupuesto): Producto[] {
  return ordenarProductos(
    productos.filter((producto) => enPresupuesto(producto, rango)),
    'menor-precio',
  )
}

export type OrdenProductos = 'recomendados' | 'menor-precio' | 'mayor-precio'

export const ORDENES: readonly { id: OrdenProductos; etiqueta: string }[] = Object.freeze([
  { id: 'recomendados', etiqueta: 'Recomendados' },
  { id: 'menor-precio', etiqueta: 'Menor precio' },
  { id: 'mayor-precio', etiqueta: 'Mayor precio' },
])

export function esOrden(valor: string | null): valor is OrdenProductos {
  return ORDENES.some((orden) => orden.id === valor)
}

/** Devuelve una copia ordenada; «recomendados» respeta el orden del catálogo. */
export function ordenarProductos(productos: readonly Producto[], orden: OrdenProductos): Producto[] {
  const copia = [...productos]
  if (orden === 'menor-precio') return copia.sort((a, b) => a.precio - b.precio)
  if (orden === 'mayor-precio') return copia.sort((a, b) => b.precio - a.precio)
  return copia
}
