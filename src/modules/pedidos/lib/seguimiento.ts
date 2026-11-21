import { PASOS_PEDIDO, type EstadoPedido } from '../types'

/** Forma del código que entrega la tienda al comprar: TT- y 6 cifras. */
const PATRON_CODIGO = /^TT-\d{6}$/

export function esCodigoPedidoValido(codigo: string): boolean {
  return PATRON_CODIGO.test(codigo)
}

export type EstadoPaso = 'hecho' | 'actual' | 'pendiente'

/** Cada paso del seguimiento marcado como hecho, actual o pendiente según el estado del pedido. */
export function pasosDelPedido(estado: EstadoPedido): { titulo: string; estado: EstadoPaso }[] {
  const indiceActual = PASOS_PEDIDO.findIndex((paso) => paso.estado === estado)
  return PASOS_PEDIDO.map((paso, indice) => ({
    titulo: paso.titulo,
    estado: indice < indiceActual ? 'hecho' : indice === indiceActual ? 'actual' : 'pendiente',
  }))
}

const FORMATO_FECHA = new Intl.DateTimeFormat('es-PE', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'America/Lima',
})

/** «7 de noviembre de 2026», en hora de Lima. */
export function formatearFechaPedido(fechaIso: string): string {
  return FORMATO_FECHA.format(new Date(fechaIso))
}
