export interface ImagenResponsiva {
  /** Versión 1x (lienzo de 1300 px de ancho). */
  src: string
  /** Versión 2x para pantallas densas o anchas. */
  src2x: string
  ancho: number
  alto: number
}

export interface Campania {
  id: string
  /** Líneas del título del hero, en el orden en que se apilan. */
  titulo: readonly string[]
  destacada: boolean
  hero: ImagenResponsiva & { alt: string }
  /** Fondo de la banda del cupón (fotos y textura, sin texto). */
  banda: ImagenResponsiva
  regalo: { montoMinimo: number; texto: string }
  descuento: { monto: number }
  cupon: { codigo: string }
  legal: string
}
