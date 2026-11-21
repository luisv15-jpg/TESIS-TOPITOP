import type { RouteObject } from 'react-router'
import { StoreLayout } from '@/layouts/StoreLayout/StoreLayout'
import { ayudaRoutes } from '@/modules/ayuda/routes'
import { busquedaRoutes } from '@/modules/busqueda/routes'
import { carritoRoutes } from '@/modules/carrito/routes'
import { compraRoutes } from '@/modules/compra/routes'
import { cuentaRoutes } from '@/modules/cuenta/routes'
import { homeRoutes } from '@/modules/home/routes'
import { pedidosRoutes } from '@/modules/pedidos/routes'
import { reclamacionesRoutes } from '@/modules/reclamaciones/routes'
import { NoEncontrado } from '@/shared/components/NoEncontrado/NoEncontrado'
import { ErrorPage } from './ErrorPage'

/** Mientras llega la página pedida en la primera carga (rutas diferidas), no se pinta nada: el fondo crema ya está pintado. */
function CargaInicial() {
  return null
}

/** Cada módulo declara sus rutas; aquí solo se juntan bajo el marco de la tienda. */
export const routes: RouteObject[] = [
  {
    Component: StoreLayout,
    HydrateFallback: CargaInicial,
    // Respaldo si falla el propio marco.
    ErrorBoundary: ErrorPage,
    children: [
      {
        // Un error en una página se muestra dentro del marco: el encabezado sigue ahí.
        ErrorBoundary: ErrorPage,
        children: [
          ...homeRoutes,
          ...busquedaRoutes,
          ...pedidosRoutes,
          ...cuentaRoutes,
          ...carritoRoutes,
          ...ayudaRoutes,
          ...reclamacionesRoutes,
          ...compraRoutes,
          { path: '*', Component: NoEncontrado },
        ],
      },
    ],
  },
]
