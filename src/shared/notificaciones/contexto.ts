import { createContext, useContext } from 'react'

export type TipoNotificacion = 'exito' | 'info' | 'aviso' | 'error'

export type Notificacion = {
  tipo: TipoNotificacion
  titulo: string
  detalle?: string
  /** Enlace dentro del aviso, por ejemplo «Ver carrito». */
  accion?: { etiqueta: string; ruta: string }
  /** true: reemplaza los avisos visibles en vez de apilarse (clics repetidos). */
  reemplazar?: boolean
}

export type Notificar = (notificacion: Notificacion) => void

export const NotificacionesContext = createContext<Notificar | null>(null)

/** Muestra avisos de la tienda. Debe usarse dentro de <NotificacionesProvider>. */
export function useNotificar(): Notificar {
  const notificar = useContext(NotificacionesContext)
  if (!notificar) {
    throw new Error('useNotificar debe usarse dentro de <NotificacionesProvider>')
  }
  return notificar
}
