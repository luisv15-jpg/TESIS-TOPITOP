import type { RouteObject } from 'react-router'

/** La página se descarga al entrar a la ruta: no pesa en la carga de la portada. */
export const carritoRoutes: RouteObject[] = [
  {
    path: 'carrito',
    lazy: async () => {
      const { CarritoPage } = await import('./pages/CarritoPage/CarritoPage')
      return { Component: CarritoPage }
    },
  },
]
