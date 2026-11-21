import type { FechasEnvio } from '../lib/navidad'

/*
  Datos de prueba de la portada navideña. Las fotos son de stock (Unsplash) y reemplazan a las
  de la campaña de Topitop: ver docs/creditos-fotos.md.
*/

type Imagen = { src: string; srcset: string; alt: string }

const GRANDES = import.meta.glob<string>(['../assets/*.webp', '!../assets/*-sm.webp'], { eager: true, import: 'default' })
const CHICAS = import.meta.glob<string>('../assets/*-sm.webp', { eager: true, import: 'default' })

/** Foto con su versión chica (la mitad de ancho) para celulares. */
function foto(archivo: string, ancho: number, anchoChica: number, alt: string): Imagen {
  const src = GRANDES[`../assets/${archivo}.webp`]
  const chica = CHICAS[`../assets/${archivo}-sm.webp`]
  if (!src || !chica) throw new Error(`Falta la foto de portada «${archivo}»`)
  return { src, srcset: `${chica} ${anchoChica}w, ${src} ${ancho}w`, alt }
}

export type Destinatario = {
  id: string
  titulo: string
  detalle: string
  /** Slug de la categoría a la que lleva. */
  categoria: string
  imagen: Imagen
}

export type PasoRegalo = {
  id: string
  titulo: string
  texto: string
  imagen: Imagen
}

export const DESTINATARIOS: readonly Destinatario[] = Object.freeze([
  {
    id: 'ella',
    titulo: 'Para ella',
    detalle: 'Vestidos, blusas y pijamas',
    categoria: 'mujer',
    imagen: foto('para-ella', 900, 450, 'Mujer sonriente con blazer rojo sentada en un sillón crema junto al árbol de Navidad'),
  },
  {
    id: 'el',
    titulo: 'Para él',
    detalle: 'Polos tejidos, camisas y chompas',
    categoria: 'hombre',
    imagen: foto('para-el', 900, 450, 'Hombre con chompa roja de cuello en V sentado junto a un árbol de luces doradas'),
  },
  {
    id: 'peques',
    titulo: 'Para los peques',
    detalle: 'Pijamas, vestidos y chompas',
    categoria: 'infantil',
    imagen: foto('para-peques', 900, 450, 'Niña y bebé sonrientes con pijamas navideñas iguales, sentados junto al árbol'),
  },
])

export const EDITORIAL_PIJAMAS = Object.freeze({
  antetitulo: 'Nochebuena en casa',
  titulo: 'Pijamas para toda la familia',
  texto: 'Cuadros rojos en tallas de papá, mamá y los peques: la foto de medianoche ya tiene uniforme.',
  puntos: ['Algodón suave que no pica', 'Tallas de 2 años a XL', 'Juego de polo y pantalón'],
  ruta: '/buscar?q=pijama',
  accion: 'Ver pijamas',
  imagen: foto('pijamas-familia', 1400, 700, 'Familia de tres con pijamas iguales de cuadros rojos y crema abriendo regalos junto al árbol'),
  detalle: foto('pijamas-detalle', 800, 400, 'Manos con una taza sobre una pijama de cuadros rojos y una rama de pino'),
})

export const FECHAS_ENVIO: FechasEnvio = Object.freeze({
  provincias: { mes: 12, dia: 17 },
  lima: { mes: 12, dia: 21 },
})

export const PASOS_REGALO: readonly PasoRegalo[] = Object.freeze([
  {
    id: 'envoltura',
    titulo: 'Lo envolvemos gratis',
    texto: 'Marca «Envolver para regalo» en tu carrito: papel kraft, cinta roja y ningún precio a la vista.',
    imagen: foto('paso-envoltura', 1200, 600, 'Manos atando un lazo de cordón rojo y blanco sobre regalos envueltos en papel kraft'),
  },
  {
    id: 'dedicatoria',
    titulo: 'Escribe tu dedicatoria',
    texto: 'Deja un mensaje de hasta 120 caracteres y lo imprimimos en una tarjeta dentro del paquete.',
    imagen: foto('paso-tarjeta', 1200, 600, 'Manos escribiendo una tarjeta junto a una taza de té y una vela'),
  },
  {
    id: 'entrega',
    titulo: 'Llega antes de Nochebuena',
    texto: `Pide hasta el ${FECHAS_ENVIO.lima.dia} de diciembre en Lima o el ${FECHAS_ENVIO.provincias.dia} en provincias. Si la talla no le queda, la cambia hasta el 31 de enero.`,
    imagen: foto('paso-entrega', 1200, 600, 'Una mujer entrega a un niño un regalo en papel kraft con cinta dorada'),
  },
])
