import { CATEGORIAS } from '../data/categorias'
import type { Categoria } from '../types'

/*
  Punto único de acceso a las categorías. Hoy lee los datos de prueba;
  cuando exista backend, solo cambia este archivo.
*/

export function listarCategorias(): readonly Categoria[] {
  return CATEGORIAS
}

export function buscarCategoria(slug: string | undefined): Categoria | undefined {
  if (!slug) return undefined
  const buscado = slug.toLowerCase()
  return CATEGORIAS.find((categoria) => categoria.slug === buscado)
}
