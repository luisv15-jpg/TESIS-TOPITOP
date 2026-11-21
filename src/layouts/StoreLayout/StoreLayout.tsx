import { Outlet, ScrollRestoration } from 'react-router'
import { NotificacionesProvider } from '@/shared/notificaciones/NotificacionesProvider'
import { BarraAvisos } from './BarraAvisos/BarraAvisos'
import { SiteFooter } from './SiteFooter/SiteFooter'
import { SiteHeader } from './SiteHeader/SiteHeader'

/** Marco de todas las páginas de la tienda: salto al contenido, barra de avisos, encabezado, página, footer y avisos. */
export function StoreLayout() {
  return (
    <NotificacionesProvider>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <BarraAvisos />
      <SiteHeader />
      <main id="contenido" tabIndex={-1}>
        <Outlet />
      </main>
      <SiteFooter />
      <ScrollRestoration />
    </NotificacionesProvider>
  )
}
