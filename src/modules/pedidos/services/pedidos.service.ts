import { PEDIDOS_DEMO } from '../data/pedidosDemo'
import type { Pedido } from '../types'

/*
  Punto único de acceso a los pedidos de demostración. Hoy lee los datos de prueba;
  cuando exista backend, solo cambia este archivo.
*/

export function listarPedidosDemo(): readonly Pedido[] {
  return PEDIDOS_DEMO
}

export function normalizarCodigo(codigo: string): string {
  return codigo.trim().toUpperCase().replace(/\s+/g, '')
}

/** Busca entre los pedidos hechos en este navegador y los de demostración. */
export function buscarPedido(codigo: string, propios: readonly Pedido[]): Pedido | undefined {
  const buscado = normalizarCodigo(codigo)
  return [...propios, ...PEDIDOS_DEMO].find((pedido) => pedido.codigo === buscado)
}
