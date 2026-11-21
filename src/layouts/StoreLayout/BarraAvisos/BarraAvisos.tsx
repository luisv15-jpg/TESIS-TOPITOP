import { GiftIcon } from '@phosphor-icons/react'
import { Link } from 'react-router'
import { buscarCampaniaDestacada } from '@/modules/promociones/services/campanias.service'
import type { Campania } from '@/modules/promociones/types'
import { formatearSoles } from '@/shared/lib/formato'
import './BarraAvisos.css'

/** Accesos de atención al cliente a la derecha de la barra, como en topitop.pe. */
const ENLACES_AYUDA = Object.freeze([
  { ruta: '/pedidos', texto: 'Sigue tu pedido' },
  { ruta: '/ayuda/preguntas-frecuentes', texto: 'Ayuda' },
])

/** Sin campaña (datos rotos) la barra no cae: queda la frase de la marca y la ayuda. */
const MENSAJE_SIN_CAMPANIA = 'Moda peruana para todos los días'

type Props = {
  /** Para pruebas; por omisión, la campaña destacada. */
  campania?: Campania | null
}

/**
 * Barra negra sobre el encabezado, como la de topitop.pe: el beneficio de la campaña al centro y,
 * en escritorio, los accesos de ayuda a la derecha. El cupón se oculta en pantallas angostas;
 * la banda bajo el hero lo muestra completo.
 */
export function BarraAvisos({ campania = buscarCampaniaDestacada() ?? null }: Props) {
  return (
    <div className="barra-avisos">
      <p className="barra-avisos__mensaje">
        <GiftIcon className="barra-avisos__icono" weight="fill" aria-hidden="true" />
        {campania ? <MensajeCampania campania={campania} /> : <span>{MENSAJE_SIN_CAMPANIA}</span>}
      </p>
      <nav className="barra-avisos__ayuda" aria-label="Atención al cliente">
        <ul>
          {ENLACES_AYUDA.map(({ ruta, texto }) => (
            <li key={ruta}>
              <Link to={ruta}>{texto}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

function MensajeCampania({ campania }: { campania: Campania }) {
  const { beneficios, descuento, cupon } = campania
  const principal = beneficios[0]?.texto
  const textoCupon = `${formatearSoles(descuento.monto)} de descuento con ${cupon.codigo}`

  if (!principal) return <span>{textoCupon}</span>
  return (
    <>
      <span>{principal}</span>
      <span className="barra-avisos__extra">· {textoCupon}</span>
    </>
  )
}
