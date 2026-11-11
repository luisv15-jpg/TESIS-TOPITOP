import { HandbagIcon, PackageIcon, UserIcon, type Icon } from '@phosphor-icons/react'

export type AccesoTienda = {
  id: 'pedidos' | 'cuenta' | 'carrito'
  ruta: string
  etiqueta: string
  Icono: Icon
}

/** Accesos de la derecha del encabezado, en el orden del diseño. */
export const ACCESOS_TIENDA: readonly AccesoTienda[] = Object.freeze([
  { id: 'pedidos', ruta: '/pedidos', etiqueta: 'Seguir mi pedido', Icono: PackageIcon },
  { id: 'cuenta', ruta: '/cuenta', etiqueta: 'Mi cuenta', Icono: UserIcon },
  { id: 'carrito', ruta: '/carrito', etiqueta: 'Carrito de compras', Icono: HandbagIcon },
])
