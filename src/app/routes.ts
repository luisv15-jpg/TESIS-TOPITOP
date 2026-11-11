import type { RouteObject } from 'react-router'
import { StoreLayout } from '@/layouts/StoreLayout/StoreLayout'
import { busquedaRoutes } from '@/modules/busqueda/routes'
import { carritoRoutes } from '@/modules/carrito/routes'
import { catalogoRoutes } from '@/modules/catalogo/routes'
import { cuentaRoutes } from '@/modules/cuenta/routes'
import { homeRoutes } from '@/modules/home/routes'
import { pedidosRoutes } from '@/modules/pedidos/routes'
import { NoEncontrado } from '@/shared/components/NoEncontrado/NoEncontrado'
import { ErrorPage } from './ErrorPage'

/** Cada módulo declara sus rutas; aquí solo se juntan bajo el marco de la tienda. */
export const routes: RouteObject[] = [
  {
    Component: StoreLayout,
    ErrorBoundary: ErrorPage,
    children: [
      ...homeRoutes,
      ...busquedaRoutes,
      ...pedidosRoutes,
      ...cuentaRoutes,
      ...carritoRoutes,
      ...catalogoRoutes,
      { path: '*', Component: NoEncontrado },
    ],
  },
]
