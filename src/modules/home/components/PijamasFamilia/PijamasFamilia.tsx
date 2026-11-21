import { useId, useRef } from 'react'
import { ArrowRightIcon, CheckIcon } from '@phosphor-icons/react'
import { Link } from 'react-router'
import { useRevelarFoto } from '@/shared/lib/useRevelarFoto'
import { obtenerEditorialPijamas } from '../../services/portada.service'
import './PijamasFamilia.css'

/** Bloque editorial «Pijamas para toda la familia»: la foto grande se revela al llegar. */
export function PijamasFamilia() {
  const tituloId = useId()
  const marcoRef = useRef<HTMLDivElement>(null)
  const { antetitulo, titulo, texto, puntos, ruta, accion, imagen, detalle } = obtenerEditorialPijamas()
  useRevelarFoto(marcoRef)

  return (
    <section className="seccion pijamas" aria-labelledby={tituloId}>
      <div className="seccion__caja pijamas__grilla">
        <div className="pijamas__fotos">
          <div className="pijamas__foto" ref={marcoRef}>
            <img
              src={imagen.src}
              srcSet={imagen.srcset}
              sizes="(min-width: 1024px) 700px, 100vw"
              alt={imagen.alt}
              width={1400}
              height={933}
              loading="lazy"
            />
          </div>
          <div className="pijamas__detalle">
            <img
              src={detalle.src}
              srcSet={detalle.srcset}
              sizes="(min-width: 1024px) 230px, 30vw"
              alt={detalle.alt}
              width={800}
              height={1000}
              loading="lazy"
            />
          </div>
        </div>

        <div className="pijamas__texto">
          <p className="seccion__antetitulo">{antetitulo}</p>
          <h2 id={tituloId} className="seccion__titulo">
            {titulo}
          </h2>
          <p className="seccion__bajada">{texto}</p>
          <ul className="pijamas__puntos">
            {puntos.map((punto) => (
              <li key={punto}>
                <CheckIcon weight="bold" aria-hidden="true" />
                {punto}
              </li>
            ))}
          </ul>
          <Link to={ruta} className="boton-campania">
            {accion}
            <ArrowRightIcon weight="bold" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
