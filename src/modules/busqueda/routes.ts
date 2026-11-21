import type { RouteObject } from 'react-router'

/** La página se descarga al entrar a la ruta: no pesa en la carga de la portada. */
export const busquedaRoutes: RouteObject[] = [
  {
    path: 'buscar',
    lazy: async () => {
      const { BusquedaPage } = await import('./pages/BusquedaPage/BusquedaPage')
      return { Component: BusquedaPage }
    },
  },
]
