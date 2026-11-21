import type { RouteObject } from 'react-router'

/**
 * /:slug solo atrapa lo que ninguna ruta fija reclama: react-router prioriza las rutas fijas.
 * La página de categoría vive en «compra» porque junta el catálogo con la compra rápida.
 */
export const compraRoutes: RouteObject[] = [
  {
    path: ':slug',
    lazy: async () => {
      const { CategoriaPage } = await import('./pages/CategoriaPage/CategoriaPage')
      return { Component: CategoriaPage }
    },
  },
]
