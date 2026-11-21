import { useCallback, useRef, type ReactNode } from 'react'
import { CheckCircleIcon, InfoIcon, WarningIcon, XCircleIcon, type Icon } from '@phosphor-icons/react'
import { Toast, type ToastMessage } from 'primereact/toast'
import { Link } from 'react-router'
import { NotificacionesContext, type Notificacion, type Notificar, type TipoNotificacion } from './contexto'
import './NotificacionesProvider.css'

const DURACION_MS = 3800
/** Un aviso con enlace dura más: da tiempo a llegar a él con el teclado (WCAG 2.2.1). */
const DURACION_CON_ACCION_MS = 9000

const ICONOS: Record<TipoNotificacion, Icon> = {
  exito: CheckCircleIcon,
  info: InfoIcon,
  aviso: WarningIcon,
  error: XCircleIcon,
}

const SEVERIDAD: Record<TipoNotificacion, ToastMessage['severity']> = {
  exito: 'success',
  info: 'info',
  aviso: 'warn',
  error: 'error',
}

/** PrimeReact fija top/right en línea; el aviso va bajo el encabezado, junto al carrito. */
const POSICION = { top: 'calc(var(--header-h) + 8px)', right: '16px' }

function CuerpoAviso({ tipo, titulo, detalle, accion }: Notificacion) {
  const Icono = ICONOS[tipo]
  return (
    <div className={`aviso-tienda__cuerpo aviso-tienda__cuerpo--${tipo}`}>
      <Icono className="aviso-tienda__icono" weight="fill" aria-hidden="true" />
      <div className="aviso-tienda__texto">
        <strong className="aviso-tienda__titulo">{titulo}</strong>
        {detalle && <p className="aviso-tienda__detalle">{detalle}</p>}
        {accion && (
          <Link to={accion.ruta} className="aviso-tienda__accion">
            {accion.etiqueta}
          </Link>
        )}
      </div>
    </div>
  )
}

/** Un solo Toast para toda la tienda. Va dentro del router para que los avisos lleven enlaces. */
export function NotificacionesProvider({ children }: { children: ReactNode }) {
  const toast = useRef<Toast>(null)

  const notificar = useCallback<Notificar>((notificacion) => {
    const mensaje: ToastMessage = {
      severity: SEVERIDAD[notificacion.tipo],
      summary: notificacion.titulo,
      detail: notificacion.detalle,
      life: notificacion.accion ? DURACION_CON_ACCION_MS : DURACION_MS,
      content: () => <CuerpoAviso {...notificacion} />,
    }
    if (notificacion.reemplazar) toast.current?.replace(mensaje)
    else toast.current?.show(mensaje)
  }, [])

  return (
    <NotificacionesContext value={notificar}>
      {children}
      <Toast
        ref={toast}
        position="top-right"
        className="aviso-tienda"
        pt={{ root: { style: POSICION }, closeButton: { 'aria-label': 'Cerrar aviso' } }}
      />
    </NotificacionesContext>
  )
}
