import { CheckIcon } from '@phosphor-icons/react'
import { formatearSoles } from '@/shared/lib/formato'
import { formatearFechaPedido, pasosDelPedido } from '../../lib/seguimiento'
import type { Pedido } from '../../types'
import './DetallePedido.css'

type Props = {
  pedido: Pedido
}

const TEXTO_PASO = { hecho: 'completado', actual: 'paso actual', pendiente: 'pendiente' } as const

/** Ficha del pedido con la línea de pasos: hechos en negro, el actual en rojo. */
export function DetallePedido({ pedido }: Props) {
  const pasos = pasosDelPedido(pedido.estado)

  return (
    <article className="detalle-pedido tarjeta-blanca" aria-label={`Pedido ${pedido.codigo}`}>
      <header className="detalle-pedido__cabecera">
        <h2 className="detalle-pedido__codigo">{pedido.codigo}</h2>
        <p className="detalle-pedido__fecha">Comprado el {formatearFechaPedido(pedido.fecha)}</p>
      </header>

      <ol className="detalle-pedido__pasos">
        {pasos.map((paso, indice) => (
          <li
            key={paso.titulo}
            className={`detalle-pedido__paso detalle-pedido__paso--${paso.estado}`}
            aria-current={paso.estado === 'actual' ? 'step' : undefined}
          >
            <span className="detalle-pedido__marca" aria-hidden="true">
              {paso.estado === 'hecho' ? <CheckIcon weight="bold" /> : indice + 1}
            </span>
            <span className="detalle-pedido__texto">
              {paso.titulo}
              <span className="sr-only"> ({TEXTO_PASO[paso.estado]})</span>
            </span>
          </li>
        ))}
      </ol>

      <dl className="detalle-pedido__datos">
        <div>
          <dt>Prendas</dt>
          <dd>{pedido.unidades}</dd>
        </div>
        <div>
          <dt>Total pagado</dt>
          <dd>{formatearSoles(pedido.total)}</dd>
        </div>
        {pedido.regalo && (
          <div>
            <dt>Para regalo</dt>
            <dd>{pedido.regalo.dedicatoria ? `Envuelto, con la tarjeta «${pedido.regalo.dedicatoria}»` : 'Envuelto, sin tarjeta'}</dd>
          </div>
        )}
      </dl>
    </article>
  )
}
