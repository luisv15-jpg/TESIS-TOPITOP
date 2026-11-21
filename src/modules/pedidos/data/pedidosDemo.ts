import type { Pedido } from '../types'

/** Pedidos de demostración para probar el seguimiento sin haber comprado antes. */
export const PEDIDOS_DEMO: readonly Pedido[] = Object.freeze([
  { codigo: 'TT-104832', fecha: '2026-11-07T15:20:00-05:00', unidades: 3, total: 189.7, estado: 'en-camino' },
  { codigo: 'TT-209415', fecha: '2026-11-02T10:05:00-05:00', unidades: 1, total: 79.9, estado: 'entregado' },
  { codigo: 'TT-318806', fecha: '2026-11-10T19:42:00-05:00', unidades: 2, total: 129.8, estado: 'preparando' },
])
