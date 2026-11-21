import type { Producto } from '../types'

/**
 * Línea de la marca que va sobre el nombre en la ficha, como en topitop.pe («TOPITOP HOMBRE»).
 * Sale de las categorías de la prenda: para quién es.
 */
export function lineaDeProducto({ categorias }: Pick<Producto, 'categorias'>): string {
  if (categorias.includes('infantil')) return 'Topitop Kids'
  const esMujer = categorias.includes('mujer')
  const esHombre = categorias.includes('hombre')
  if (esMujer && esHombre) return 'Topitop Unisex'
  if (esMujer) return 'Topitop Mujer'
  if (esHombre) return 'Topitop Hombre'
  return 'Topitop'
}

/**
 * Porcentaje de rebaja para el sello negro de la ficha («-47%»), redondeado.
 * null si no hay rebaja que anunciar: sin precio anterior, uno que no es mayor o un ahorro menor al 1 %.
 */
export function porcentajeDescuento(precio: number, precioAntes?: number): number | null {
  if (precioAntes === undefined || !(precioAntes > precio) || precioAntes <= 0) return null
  const porcentaje = Math.round((1 - precio / precioAntes) * 100)
  return porcentaje >= 1 ? porcentaje : null
}
