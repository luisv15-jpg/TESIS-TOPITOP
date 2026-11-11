import { Outlet, ScrollRestoration } from 'react-router'
import { SiteHeader } from './SiteHeader/SiteHeader'

/** Marco de todas las páginas de la tienda: salto al contenido, encabezado y página. */
export function StoreLayout() {
  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <SiteHeader />
      <main id="contenido" tabIndex={-1}>
        <Outlet />
      </main>
      <ScrollRestoration />
    </>
  )
}
