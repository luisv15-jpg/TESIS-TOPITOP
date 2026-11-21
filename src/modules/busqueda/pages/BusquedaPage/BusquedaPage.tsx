import { useId } from 'react'
import { Link, useSearchParams } from 'react-router'
import { buscarProductos, listarIdeasRegalo } from '@/modules/catalogo/services/productos.service'
import { GrillaProductos } from '@/modules/compra/components/GrillaProductos/GrillaProductos'
import { PaginaTienda } from '@/shared/components/PaginaTienda/PaginaTienda'
import './BusquedaPage.css'

/** Búsquedas sugeridas que siempre devuelven prendas del catálogo de prueba. */
const SUGERENCIAS_BUSQUEDA = Object.freeze(['Pijama', 'Vestido', 'Chompa', 'Jean', 'Polo'])

export function BusquedaPage() {
  const [parametros] = useSearchParams()
  const consulta = parametros.get('q')?.trim() ?? ''
  const sugerenciasId = useId()

  const resultados = consulta ? buscarProductos(consulta) : []
  const titulo = consulta ? `Resultados para «${consulta}»` : 'Busca una prenda'
  const conteo = resultados.length === 1 ? '1 prenda encontrada.' : `${resultados.length} prendas encontradas.`
  const bajada = consulta ? conteo : 'Escribe en el buscador de arriba o prueba con una de estas búsquedas.'

  const sugerencias = (
    <nav className="busqueda__sugerencias" aria-labelledby={sugerenciasId}>
      <h2 id={sugerenciasId} className="busqueda__subtitulo">
        Prueba con
      </h2>
      <ul className="busqueda__chips">
        {SUGERENCIAS_BUSQUEDA.map((sugerencia) => (
          <li key={sugerencia}>
            <Link to={`/buscar?q=${encodeURIComponent(sugerencia.toLowerCase())}`} className="busqueda__chip">
              {sugerencia}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )

  return (
    <>
      <title>{consulta ? `Topitop | Buscar ${consulta}` : 'Topitop | Buscar'}</title>
      <PaginaTienda etiqueta="Búsqueda" titulo={titulo} bajada={bajada}>
        {resultados.length > 0 && <GrillaProductos productos={resultados} etiqueta={`Resultados para ${consulta}`} />}

        {consulta && resultados.length === 0 && (
          <div className="busqueda__vacio">
            <p className="busqueda__mensaje">
              No hay prendas con «{consulta}» en el catálogo de prueba. Revisa la palabra o usa una más corta.
            </p>
            {sugerencias}
            <h2 className="busqueda__subtitulo">Ideas de regalo</h2>
            <GrillaProductos productos={listarIdeasRegalo().slice(0, 4)} etiqueta="Ideas de regalo" />
          </div>
        )}

        {!consulta && sugerencias}
      </PaginaTienda>
    </>
  )
}
