export interface ImagenHero {
  src: string
  /** Medidas reales del archivo: el CSS reproduce su recorte con ellas. */
  ancho: number
  alto: number
  alt: string
}

/**
 * Luces del árbol para la entrada del hero: capas transparentes que se encienden sobre la foto.
 * Todas cubren la misma caja, medida en píxeles de la foto.
 */
export interface LucesHero {
  capas: readonly string[]
  caja: { x: number; y: number; ancho: number; alto: number }
}

export type Beneficio = {
  id: 'envoltura' | 'cambios' | 'envio'
  texto: string
}

export interface Campania {
  id: string
  /** Título del hero (h1). */
  titulo: string
  /** Línea bajo el título. */
  subtitulo: string
  destacada: boolean
  hero: ImagenHero
  luces?: LucesHero
  regalo: { montoMinimo: number; texto: string }
  descuento: { monto: number }
  cupon: { codigo: string }
  /** Beneficios que se suman a la compra, en frases cortas. */
  beneficios: readonly Beneficio[]
  legal: string
}
