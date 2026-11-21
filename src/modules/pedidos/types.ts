export type EstadoPedido = 'confirmado' | 'preparando' | 'en-camino' | 'entregado'

export const PASOS_PEDIDO: readonly { estado: EstadoPedido; titulo: string }[] = Object.freeze([
  { estado: 'confirmado', titulo: 'Pedido confirmado' },
  { estado: 'preparando', titulo: 'Preparando tu pedido' },
  { estado: 'en-camino', titulo: 'En camino' },
  { estado: 'entregado', titulo: 'Entregado' },
])

export type Pedido = {
  codigo: string
  /** Fecha ISO de la compra. */
  fecha: string
  unidades: number
  total: number
  estado: EstadoPedido
  /** Solo si se pidió envolver para regalo; la dedicatoria puede estar vacía. */
  regalo?: { dedicatoria: string }
}
