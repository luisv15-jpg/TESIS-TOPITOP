import type { RouteObject } from 'react-router'

/** La página se descarga al entrar a la ruta: no pesa en la carga de la portada. */
export const ayudaRoutes: RouteObject[] = [
  {
    path: 'ayuda/:tema',
    lazy: async () => {
      const { AyudaPage } = await import('./pages/AyudaPage/AyudaPage')
      return { Component: AyudaPage }
    },
  },
]
