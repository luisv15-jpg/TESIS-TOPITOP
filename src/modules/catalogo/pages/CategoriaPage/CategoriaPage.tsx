import { useParams } from 'react-router'
import { NoEncontrado } from '@/shared/components/NoEncontrado/NoEncontrado'
import { PaginaAviso } from '@/shared/components/PaginaAviso/PaginaAviso'
import { buscarCategoria } from '../../services/categorias.service'

export function CategoriaPage() {
  const { slug } = useParams()
  const categoria = buscarCategoria(slug)

  if (!categoria) return <NoEncontrado />

  return (
    <>
      <title>{`Topitop | ${categoria.nombre}`}</title>
      <PaginaAviso etiqueta={categoria.nombre} titulo={`Estamos armando el catálogo de ${categoria.nombre}`}>
        <p>Muy pronto vas a ver aquí las prendas de esta línea, con tallas y colores.</p>
      </PaginaAviso>
    </>
  )
}
