import { useRef } from 'react'
import { Toast } from 'primereact/toast'
import { formatearSoles } from '@/shared/lib/formato'
import type { Campania } from '../../types'
import { TicketDescuento } from '../TicketDescuento/TicketDescuento'
import './BandaCupon.css'

type Props = {
  campania: Campania
  id: string
}

const DURACION_AVISO_MS = 3500

export function BandaCupon({ campania, id }: Props) {
  const toast = useRef<Toast>(null)
  const { banda, regalo, descuento, cupon, legal } = campania

  async function handleCopiarCupon() {
    try {
      await navigator.clipboard.writeText(cupon.codigo)
      toast.current?.show({
        severity: 'success',
        summary: 'Cupón copiado',
        detail: `Pega ${cupon.codigo} en tu carrito de compras.`,
        life: DURACION_AVISO_MS,
      })
    } catch {
      toast.current?.show({
        severity: 'warn',
        summary: 'No pudimos copiarlo',
        detail: `Escribe ${cupon.codigo} en tu carrito de compras.`,
        life: DURACION_AVISO_MS,
      })
    }
  }

  return (
    <section id={id} className="banda-cupon" aria-labelledby="banda-cupon-titulo" tabIndex={-1}>
      <h2 id="banda-cupon-titulo" className="sr-only">
        Beneficios de la campaña
      </h2>
      <img
        className="banda-cupon__fondo"
        src={banda.src}
        srcSet={`${banda.src} ${banda.ancho}w, ${banda.src2x} ${banda.ancho * 2}w`}
        sizes="100vw"
        width={banda.ancho}
        height={banda.alto}
        alt=""
      />
      <div className="banda-cupon__contenido">
        <p className="banda-cupon__regalo">
          <span className="banda-cupon__antetitulo">Por compras mayores a</span>
          <strong className="banda-cupon__monto">{formatearSoles(regalo.montoMinimo)}</strong>
          <span className="banda-cupon__beneficio">{regalo.texto}</span>
        </p>

        <span className="banda-cupon__divisor" aria-hidden="true" />
        <TicketDescuento monto={descuento.monto} />
        <span className="banda-cupon__divisor" aria-hidden="true" />

        <div className="banda-cupon__cupon">
          <p className="banda-cupon__antetitulo">Ingresa el cupón:</p>
          <button
            type="button"
            className="banda-cupon__codigo"
            onClick={handleCopiarCupon}
            aria-label={`Copiar el cupón ${cupon.codigo}`}
            title="Copiar cupón"
          >
            {cupon.codigo}
          </button>
          <p className="banda-cupon__destino">En tu carrito de compras</p>
          <p className="banda-cupon__legal">{legal}</p>
        </div>
      </div>
      <Toast ref={toast} position="bottom-center" className="aviso-tienda" />
    </section>
  )
}
