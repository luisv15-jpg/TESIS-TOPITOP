import { useId } from 'react'
import { listarPasosRegalo } from '../../services/portada.service'
import { usePasoFijo } from './usePasoFijo'
import './ComoRegalar.css'

/**
 * «Tu regalo, listo para entregar» (capítulos fijos): en escritorio la sección mide dos pantallas;
 * mientras se baja, queda fija, cada paso abre su texto y la foto de la derecha cambia con un
 * fundido. En celulares, con pantallas bajas o con menos movimiento, cada paso va con su foto debajo.
 */
export function ComoRegalar() {
  const tituloId = useId()
  const pasos = listarPasosRegalo()
  const { seccionRef, fija, activo } = usePasoFijo(pasos.length)

  return (
    <section
      ref={seccionRef}
      className="seccion como-regalar"
      data-fija={fija ? 'true' : undefined}
      aria-labelledby={tituloId}
    >
      <div className="seccion__caja como-regalar__escenario">
        <div className="como-regalar__texto">
          <div className="seccion__cabecera">
            <p className="seccion__antetitulo">Servicio de regalo</p>
            <h2 id={tituloId} className="seccion__titulo">
              Tu regalo, listo para entregar
            </h2>
          </div>
          <ol className="como-regalar__pasos">
            {pasos.map((paso, indice) => {
              const esActivo = fija && indice === activo
              return (
                <li
                  key={paso.id}
                  className="como-regalar__paso"
                  data-activo={esActivo ? 'true' : undefined}
                  aria-current={esActivo ? 'step' : undefined}
                >
                  <h3 className="como-regalar__titulo-paso">
                    <span className="como-regalar__numero" aria-hidden="true">
                      {String(indice + 1).padStart(2, '0')}
                    </span>
                    {paso.titulo}
                  </h3>
                  <p className="como-regalar__detalle">
                    <span>{paso.texto}</span>
                  </p>
                  {!fija && (
                    <figure className="como-regalar__visual">
                      <img
                        src={paso.imagen.src}
                        srcSet={paso.imagen.srcset}
                        sizes="(min-width: 640px) 50vw, 100vw"
                        alt={paso.imagen.alt}
                        width={1200}
                        height={900}
                        loading="lazy"
                      />
                    </figure>
                  )}
                </li>
              )
            })}
          </ol>
        </div>

        {fija && (
          <div className="como-regalar__marco">
            {pasos.map((paso, indice) => (
              <img
                key={paso.id}
                src={paso.imagen.src}
                srcSet={paso.imagen.srcset}
                sizes="600px"
                alt={paso.imagen.alt}
                width={1200}
                height={900}
                loading="lazy"
                className="como-regalar__foto"
                data-estado={indice === activo ? 'activa' : indice < activo ? 'pasada' : undefined}
                aria-hidden={indice === activo ? undefined : true}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
