import { obtenerCampaniaDestacada } from '@/modules/promociones/services/campanias.service'
import { crearTemas } from '../data/temas'
import type { TemaAyuda } from '../types'

export function listarTemasAyuda(): readonly TemaAyuda[] {
  return crearTemas(obtenerCampaniaDestacada())
}

export function buscarTemaAyuda(slug: string | undefined): TemaAyuda | undefined {
  if (!slug) return undefined
  return listarTemasAyuda().find((tema) => tema.slug === slug)
}
