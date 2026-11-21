import { useId } from 'react'
import { Link } from 'react-router'
import { listarPorCategoria } from '@/modules/catalogo/services/productos.service'
import { listarDestinatarios } from '../../services/portada.service'
import './ParaQuien.css'

/**
 * «¿Para quién es el regalo?»: tres fotos a todo el ancho que llevan a Mujer, Hombre e Infantil,
 * con el nombre al centro y el botón «Ver todo» con borde, como los banners de topitop.pe.
 */
export function ParaQuien() {
  const tituloId = useId()
  const destinatarios = listarDestinatarios()

  return (
    <section className="seccion para-quien" aria-labelledby={tituloId}>
      <div className="seccion__caja">
        <div className="seccion__cabecera">
          <p className="seccion__antetitulo">Regala por persona</p>
          <h2 id={tituloId} className="seccion__titulo">
            ¿Para quién es el regalo?
          </h2>
        </div>
      </div>

      <ul className="para-quien__lista">
        {destinatarios.map(({ id, titulo, detalle, categoria, imagen }) => {
          const cantidad = listarPorCategoria(categoria).length
          return (
            <li key={id}>
              <Link to={`/${categoria}`} className="para-quien__banner">
                <img
                  className="para-quien__foto"
                  src={imagen.src}
                  srcSet={imagen.srcset}
                  sizes="(min-width: 640px) 34vw, 100vw"
                  // Decorativa: el texto del banner ya nombra el destino del enlace
                  alt=""
                  width={900}
                  height={1200}
                  loading="lazy"
                />
                <span className="para-quien__texto">
                  <span className="para-quien__titulo">{titulo}</span>
                  <span className="para-quien__detalle">
                    {detalle} · {cantidad} {cantidad === 1 ? 'prenda' : 'prendas'}
                  </span>
                  {/* Todo el banner es el enlace: el botón es solo la señal visual */}
                  <span className="para-quien__boton" aria-hidden="true">
                    Ver todo
                  </span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
