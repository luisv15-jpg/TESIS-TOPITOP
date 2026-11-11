import { useSearchParams } from 'react-router'
import { PaginaAviso } from '@/shared/components/PaginaAviso/PaginaAviso'

export function BusquedaPage() {
  const [parametros] = useSearchParams()
  const consulta = parametros.get('q')?.trim() ?? ''
  const titulo = consulta ? `Resultados para «${consulta}»` : 'Busca una prenda'

  return (
    <>
      <title>{consulta ? `Topitop | Buscar ${consulta}` : 'Topitop | Buscar'}</title>
      <PaginaAviso etiqueta="Búsqueda" titulo={titulo}>
        <p>Los resultados se muestran cuando el catálogo de prendas esté cargado.</p>
      </PaginaAviso>
    </>
  )
}
