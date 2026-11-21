import type { RouteObject } from 'react-router'

/** La página se descarga al entrar a la ruta: no pesa en la carga de la portada. */
export const cuentaRoutes: RouteObject[] = [
  {
    path: 'cuenta',
    lazy: async () => {
      const { CuentaPage } = await import('./pages/CuentaPage/CuentaPage')
      return { Component: CuentaPage }
    },
  },
]
