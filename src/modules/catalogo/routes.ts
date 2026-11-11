import type { RouteObject } from 'react-router'
import { CategoriaPage } from './pages/CategoriaPage/CategoriaPage'

/** Va al final del árbol: /:slug solo atrapa lo que ninguna ruta fija reclamó. */
export const catalogoRoutes: RouteObject[] = [{ path: ':slug', Component: CategoriaPage }]
