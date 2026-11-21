import { useId } from 'react'
import { ArrowsCounterClockwiseIcon, CopySimpleIcon, GiftIcon, SockIcon, TruckIcon, type Icon } from '@phosphor-icons/react'
import { formatearSoles } from '@/shared/lib/formato'
import { useNotificar } from '@/shared/notificaciones/contexto'
import type { Beneficio, Campania } from '../../types'
import './BandaCupon.css'

type Props = {
  campania: Campania
  id: string
}

const ICONOS: Record<Beneficio['id'], Icon> = {
  envoltura: GiftIcon,
  cambios: ArrowsCounterClockwiseIcon,
  envio: TruckIcon,
}

/** Franja de beneficios bajo el hero: el cupón como etiqueta de regalo, el regalo por monto y los extras. */
export function BandaCupon({ campania, id }: Props) {
  const notificar = useNotificar()
  const tituloId = useId()
  const { regalo, descuento, cupon, beneficios, legal } = campania

  async function handleCopiarCupon() {
    try {
      await navigator.clipboard.writeText(cupon.codigo)
      // reemplazar: varios clics dejan un solo aviso, no una pila que se anuncia varias veces
      notificar({
        tipo: 'exito',
        titulo: 'Cupón copiado',
        detalle: `Pega ${cupon.codigo} en tu carrito de compras.`,
        accion: { etiqueta: 'Ir al carrito', ruta: '/carrito' },
        reemplazar: true,
      })
    } catch {
      notificar({
        tipo: 'aviso',
        titulo: 'No pudimos copiarlo',
        detalle: `Escribe ${cupon.codigo} en tu carrito de compras.`,
        reemplazar: true,
      })
    }
  }

  return (
    <section id={id} className="banda-cupon" aria-labelledby={tituloId} tabIndex={-1}>
      <h2 id={tituloId} className="sr-only">
        Beneficios de {campania.titulo}
      </h2>
      <div className="banda-cupon__contenido">
        <div className="banda-cupon__cupon">
          <p className="banda-cupon__descuento">
            <strong className="banda-cupon__monto">{formatearSoles(descuento.monto)}</strong>
            <span>de descuento con el cupón</span>
          </p>
          <button
            type="button"
            className="banda-cupon__etiqueta"
            onClick={handleCopiarCupon}
            aria-label={`${cupon.codigo}, copiar cupón`}
          >
            {/* El papel lleva el recorte de etiqueta; el botón queda rectangular para que se vea el foco */}
            <span className="banda-cupon__papel">
              <span className="banda-cupon__codigo">{cupon.codigo}</span>
              <span className="banda-cupon__copiar" aria-hidden="true">
                <CopySimpleIcon weight="bold" />
                Copiar
              </span>
            </span>
          </button>
        </div>

        <p className="banda-cupon__regalo">
          <SockIcon className="banda-cupon__icono" weight="duotone" aria-hidden="true" />
          <span>
            <strong>Por compras desde {formatearSoles(regalo.montoMinimo)}</strong>
            {regalo.texto}
          </span>
        </p>

        <ul className="banda-cupon__extras">
          {beneficios.map(({ id: clave, texto }) => {
            const Icono = ICONOS[clave]
            return (
              <li key={clave}>
                <Icono className="banda-cupon__icono" weight="duotone" aria-hidden="true" />
                {texto}
              </li>
            )
          })}
        </ul>
      </div>
      <p className="banda-cupon__legal">{legal}</p>
    </section>
  )
}
