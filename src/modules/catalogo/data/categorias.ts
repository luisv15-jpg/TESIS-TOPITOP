import type { Categoria } from '../types'

/** Datos de prueba: hacen las veces de la respuesta del backend. */
export const CATEGORIAS: readonly Categoria[] = Object.freeze([
  { slug: 'mujer', nombre: 'Mujer' },
  { slug: 'hombre', nombre: 'Hombre' },
  { slug: 'infantil', nombre: 'Infantil' },
  { slug: 'denim', nombre: 'Denim' },
  { slug: 'basico', nombre: 'Básico' },
  { slug: 'outlet', nombre: 'Outlet' },
])
