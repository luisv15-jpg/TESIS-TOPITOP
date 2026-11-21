import { useId, type ReactNode } from 'react'
import './PaginaTienda.css'

type Props = {
  titulo: string
  /** Texto corto bajo el título. */
  bajada?: ReactNode
  /** Rótulo pequeño sobre el título. */
  etiqueta?: string
  children: ReactNode
  /** Ancho del contenido: «angosto» para formularios. */
  ancho?: 'normal' | 'angosto'
}

/** Página clara de la tienda: franja oscura bajo el encabezado y contenido sobre blanco. */
export function PaginaTienda({ titulo, bajada, etiqueta, children, ancho = 'normal' }: Props) {
  const tituloId = useId()
  return (
    <section className={`pagina-tienda pagina-tienda--${ancho}`} aria-labelledby={tituloId}>
      <div className="pagina-tienda__contenido">
        <header className="pagina-tienda__cabecera">
          {etiqueta && <p className="pagina-tienda__etiqueta">{etiqueta}</p>}
          <h1 id={tituloId} className="pagina-tienda__titulo" tabIndex={-1}>
            {titulo}
          </h1>
          {bajada && <p className="pagina-tienda__bajada">{bajada}</p>}
        </header>
        {children}
      </div>
    </section>
  )
}
