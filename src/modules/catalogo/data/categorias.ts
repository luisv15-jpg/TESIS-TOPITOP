import type { Categoria } from '../types'

/** Datos de prueba: hacen las veces de la respuesta del backend. */
export const CATEGORIAS: readonly Categoria[] = Object.freeze([
  {
    slug: 'mujer',
    nombre: 'Mujer',
    titular: 'Regalos para ella',
    descripcion: 'Vestidos para la cena de Nochebuena, blusas satinadas y pijamas de cuadros.',
  },
  {
    slug: 'hombre',
    nombre: 'Hombre',
    titular: 'Regalos para él',
    descripcion: 'Polos tejidos, camisas de lino y la chompa navideña que se pone cada diciembre.',
  },
  {
    slug: 'infantil',
    nombre: 'Infantil',
    titular: 'Regalos para los peques',
    descripcion: 'Pijamas, vestidos de fiesta y chompas para abrir regalos a medianoche.',
  },
  {
    slug: 'denim',
    nombre: 'Denim',
    titular: 'Denim para regalar',
    descripcion: 'Jeans de tiro alto, clásicos y casacas que combinan con todo el verano.',
  },
  {
    slug: 'basico',
    nombre: 'Básico',
    titular: 'Básicos que siempre quedan',
    descripcion: 'Polos y poleras en packs: el regalo seguro cuando no sabes la talla de moda.',
  },
  {
    slug: 'outlet',
    nombre: 'Outlet',
    titular: 'Outlet de Navidad',
    descripcion: 'Prendas con precio rebajado por temporada, hasta agotar stock.',
  },
])
