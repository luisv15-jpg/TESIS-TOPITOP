import banda from '../assets/cyber-banda.webp'
import banda2x from '../assets/cyber-banda@2x.webp'
import hero from '../assets/cyber-hero.webp'
import hero2x from '../assets/cyber-hero@2x.webp'
import type { Campania } from '../types'

/** Datos de prueba de campañas: hacen las veces de la respuesta del backend. */
export const CAMPANIAS: readonly Campania[] = Object.freeze([
  {
    id: 'cyber-top',
    titulo: ['Cyber', 'Top'],
    destacada: true,
    hero: {
      src: hero,
      src2x: hero2x,
      ancho: 1300,
      alto: 658,
      alt: 'Pareja de modelos con casacas negras, chompa guinda y jeans azules bajo un foco de luz',
    },
    banda: { src: banda, src2x: banda2x, ancho: 1300, alto: 173 },
    regalo: { montoMinimo: 250, texto: 'Llévate de regalo' },
    descuento: { monto: 30 },
    cupon: { codigo: 'CYBERTOP30' },
    legal: '*Aplican términos y condiciones*',
  },
])
