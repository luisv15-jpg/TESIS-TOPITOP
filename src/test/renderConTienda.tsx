import type { ReactElement } from 'react'
import { render } from '@testing-library/react'
import { createMemoryRouter, RouterProvider, type RouteObject } from 'react-router'
import { routes } from '@/app/routes'
import { NotificacionesProvider } from '@/shared/notificaciones/NotificacionesProvider'

type Opciones = {
  /** URL inicial, por ejemplo «/pedidos?codigo=TT-104832». */
  ruta?: string
  /** Patrón de la ruta que muestra el componente, para páginas que leen parámetros. */
  patron?: string
}

/**
 * Renderiza un componente dentro de un router en memoria y del proveedor de avisos, como en la
 * tienda. Devuelve el router para revisar a dónde navegó.
 */
export function renderConTienda(ui: ReactElement, { ruta = '/', patron = '*' }: Opciones = {}) {
  // Igual que StoreLayout: la página vive dentro de <main> y de los avisos.
  const conAvisos = (contenido: ReactElement) => (
    <NotificacionesProvider>
      <main>{contenido}</main>
    </NotificacionesProvider>
  )
  const rutas: RouteObject[] = [{ path: patron, element: conAvisos(ui) }]
  if (patron !== '*') rutas.push({ path: '*', element: conAvisos(<p>Otra página</p>) })

  const router = createMemoryRouter(rutas, { initialEntries: [ruta] })
  return { router, ...render(<RouterProvider router={router} />) }
}

/** Renderiza la tienda completa (encabezado, página y footer) en la ruta indicada. */
export function renderTienda(ruta = '/') {
  const router = createMemoryRouter(routes, { initialEntries: [ruta] })
  return { router, ...render(<RouterProvider router={router} />) }
}
