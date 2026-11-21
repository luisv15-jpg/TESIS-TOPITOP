import { useId } from 'react'
import { useNotificar } from '@/shared/notificaciones/contexto'
import { MAX_DEDICATORIA } from '../../lib/persistencia'
import { useCarrito } from '../../store/carrito.store'
import './EnvolturaRegalo.css'

/** «Envolver para regalo» (gratis) y, si se marca, la dedicatoria que va impresa en la tarjeta. */
export function EnvolturaRegalo() {
  const envolver = useCarrito((estado) => estado.envolver)
  const dedicatoria = useCarrito((estado) => estado.dedicatoria)
  const cambiarEnvoltura = useCarrito((estado) => estado.cambiarEnvoltura)
  const cambiarDedicatoria = useCarrito((estado) => estado.cambiarDedicatoria)
  const notificar = useNotificar()
  const dedicatoriaId = useId()
  const ayudaId = useId()
  // Se cuentan caracteres reales: un emoji cuenta como uno, igual que al recortar
  const quedan = MAX_DEDICATORIA - Array.from(dedicatoria).length

  function handleEnvoltura(activa: boolean) {
    cambiarEnvoltura(activa)
    notificar(
      activa
        ? {
            tipo: 'exito',
            titulo: 'Lo envolvemos para regalo',
            detalle: 'Sin costo. Si quieres, escribe una dedicatoria para la tarjeta.',
            reemplazar: true,
          }
        : { tipo: 'info', titulo: 'Sin envoltura de regalo', reemplazar: true },
    )
  }

  return (
    <div className="envoltura-regalo">
      <label className="envoltura-regalo__opcion">
        <input type="checkbox" checked={envolver} onChange={(evento) => handleEnvoltura(evento.target.checked)} />
        <span>
          <strong>Envolver para regalo</strong>
          Gratis: papel kraft, cinta roja y sin precio a la vista.
        </span>
      </label>
      {envolver && (
        <div className="campo">
          <label htmlFor={dedicatoriaId} className="campo__etiqueta">
            Dedicatoria para la tarjeta (opcional)
          </label>
          <textarea
            id={dedicatoriaId}
            className="campo__control envoltura-regalo__dedicatoria"
            value={dedicatoria}
            rows={3}
            onChange={(evento) => cambiarDedicatoria(evento.target.value)}
            aria-describedby={ayudaId}
          />
          <p id={ayudaId} className="campo__ayuda">
            {quedan === 1 ? 'Queda 1 carácter' : `Quedan ${quedan} caracteres`}
          </p>
        </div>
      )}
    </div>
  )
}
