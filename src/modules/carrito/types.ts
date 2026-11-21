import type { Producto } from '@/modules/catalogo/types'

export type ItemCarrito = {
  productoId: string
  talla: string
  color: string
  cantidad: number
}

export type LineaCarrito = {
  clave: string
  item: ItemCarrito
  producto: Producto
  importe: number
}

/** Reglas de la campaña que afectan al carrito. */
export type CondicionesCarrito = {
  codigoCupon: string
  montoCupon: number
  montoRegalo: number
}

export type ResumenCarrito = {
  lineas: LineaCarrito[]
  cantidad: number
  subtotal: number
  descuento: number
  total: number
  cuponAplicado: string | null
  ganaRegalo: boolean
  faltaParaRegalo: number
  /** Avance hacia el regalo, de 0 a 1. */
  avanceRegalo: number
}
