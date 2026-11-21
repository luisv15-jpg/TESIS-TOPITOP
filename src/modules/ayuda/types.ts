export type PreguntaFrecuente = { pregunta: string; respuesta: string }
export type SeccionAyuda = { titulo: string; parrafos: readonly string[] }

/** Página de ayuda: preguntas desplegables o secciones de texto. */
export type TemaAyuda = {
  slug: string
  titulo: string
  bajada: string
  preguntas?: readonly PreguntaFrecuente[]
  secciones?: readonly SeccionAyuda[]
}
