import luces1 from '../assets/navidad/luces-1.webp'
import luces2 from '../assets/navidad/luces-2.webp'
import luces3 from '../assets/navidad/luces-3.webp'
import hero from '../assets/navidad/navidad-hero.webp'
import type { Campania } from '../types'

/*
  Datos de prueba de campañas: hacen las veces de la respuesta del backend.
  La foto del hero es la original de la campaña, sin textos ni botones (docs/hero-navidad/).
*/
export const CAMPANIAS: readonly Campania[] = Object.freeze([
  {
    id: 'navidad-top',
    titulo: 'Navidad Top',
    subtitulo: 'Regala momentos',
    destacada: true,
    hero: {
      src: hero,
      ancho: 1376,
      alto: 768,
      alt: 'Mujer con vestido celeste sentada en un sillón y hombre con polo azul marino junto a un árbol de Navidad, en una sala cálida con bolsas de regalo de Topitop',
    },
    luces: {
      capas: [luces1, luces2, luces3],
      caja: { x: 1212, y: 80, ancho: 164, alto: 446 },
    },
    regalo: { montoMinimo: 199, texto: 'Te regalamos un pack de medias navideñas' },
    descuento: { monto: 30 },
    cupon: { codigo: 'NAVIDADTOP' },
    beneficios: [
      { id: 'envoltura', texto: 'Envoltura de regalo gratis' },
      { id: 'cambios', texto: 'Cambios hasta el 31 de enero' },
    ],
    legal: 'Válido hasta el 25 de diciembre de 2026 o hasta agotar stock. Aplican términos y condiciones.',
  },
])
