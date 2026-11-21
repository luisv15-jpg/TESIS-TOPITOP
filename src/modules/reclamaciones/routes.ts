import type { RouteObject } from 'react-router'

/** La página se descarga al entrar a la ruta: no pesa en la carga de la portada. */
export const reclamacionesRoutes: RouteObject[] = [
  {
    path: 'libro-de-reclamaciones',
    lazy: async () => {
      const { LibroReclamacionesPage } = await import('./pages/LibroReclamacionesPage/LibroReclamacionesPage')
      return { Component: LibroReclamacionesPage }
    },
  },
]
