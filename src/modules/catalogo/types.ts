export interface Categoria {
  /** Segmento de la URL: /mujer, /basico… */
  slug: string
  /** Texto del menú. */
  nombre: string
  /** Rótulo de la página de la categoría en la campaña («Regalos para ella»). */
  titular: string
  /** Frase bajo el título de la página. */
  descripcion: string
}

export type ColorProducto = {
  nombre: string
  /** Muestra del color en la ficha. */
  hex: string
}

export interface Producto {
  id: string
  nombre: string
  /** Rótulo grande de la tarjeta del carrusel, al estilo del afiche del diseño. */
  titular: string
  /** Slugs de las categorías donde aparece: hombre, mujer, basico, denim… */
  categorias: readonly string[]
  precio: number
  /** Precio tachado cuando hay rebaja. */
  precioAntes?: number
  colores: readonly ColorProducto[]
  tallas: readonly string[]
  /** srcset con la versión chica (400 px) y la grande, para que la tarjeta baje solo lo que muestra. */
  imagen: { src: string; srcset: string; alt: string }
  /** Sello corto: «Pack x3», «Nuevo». */
  etiqueta?: string
  /** Aparece en «Regalos por presupuesto» de la portada. */
  ideaRegalo?: boolean
}
