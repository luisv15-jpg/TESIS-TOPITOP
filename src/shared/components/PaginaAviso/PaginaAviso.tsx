import type { ReactNode } from 'react'
import { Link } from 'react-router'
import './PaginaAviso.css'

type Props = {
  /** Texto pequeño sobre el título (la sección o el código de error). */
  etiqueta: string
  titulo: string
  children: ReactNode
}

/** Página corta de la tienda para secciones que aún no existen o rutas sin destino. */
export function PaginaAviso({ etiqueta, titulo, children }: Props) {
  return (
    <section className="pagina-aviso" aria-labelledby="pagina-aviso-titulo">
      <div className="pagina-aviso__contenido">
        <p className="pagina-aviso__etiqueta">{etiqueta}</p>
        <h1 id="pagina-aviso-titulo" className="pagina-aviso__titulo">
          {titulo}
        </h1>
        <div className="pagina-aviso__texto">{children}</div>
        <Link to="/" className="pagina-aviso__accion">
          Volver a Cyber Top
        </Link>
      </div>
    </section>
  )
}
