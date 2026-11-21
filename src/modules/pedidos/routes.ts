import type { RouteObject } from 'react-router'

/** La página se descarga al entrar a la ruta: no pesa en la carga de la portada. */
export const pedidosRoutes: RouteObject[] = [
  {
    path: 'pedidos',
    lazy: async () => {
      const { PedidosPage } = await import('./pages/PedidosPage/PedidosPage')
      return { Component: PedidosPage }
    },
  },
]
