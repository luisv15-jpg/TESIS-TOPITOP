import { formatearSoles } from '@/shared/lib/formato'
import './TicketDescuento.css'

type Props = {
  monto: number
}

/*
  Silueta del ticket del diseño (187 x 92): bordes laterales ondulados con tres
  salientes y esquinas recogidas hacia dentro.
*/
const SILUETA =
  'M15 0H172C181 0 187 10 187 21C187 28 179 28 179 34.5C179 41 187 41 187 48C187 55 179 55 179 61.5' +
  'C179 68 187 68 187 75C187 86 181 92 172 92H15C6 92 0 86 0 75C0 68 8 68 8 61.5C8 55 0 55 0 48' +
  'C0 41 8 41 8 34.5C8 28 0 28 0 21C0 10 6 0 15 0Z'

export function TicketDescuento({ monto }: Props) {
  return (
    <p className="ticket-descuento">
      <svg className="ticket-descuento__silueta" viewBox="0 0 187 92" aria-hidden="true" focusable="false">
        <path d={SILUETA} />
      </svg>
      <strong className="ticket-descuento__monto">{formatearSoles(monto)}</strong>
      <span className="ticket-descuento__texto">de descuento</span>
    </p>
  )
}
