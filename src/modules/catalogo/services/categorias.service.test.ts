import { describe, expect, it } from 'vitest'
import { buscarCategoria, listarCategorias } from './categorias.service'

describe('categorias.service', () => {
  it('lista las seis categorías del menú en el orden del diseño', () => {
    expect(listarCategorias().map((c) => c.nombre)).toEqual([
      'Mujer',
      'Hombre',
      'Infantil',
      'Denim',
      'Básico',
      'Outlet',
    ])
  })

  it('usa slugs sin tildes para las rutas', () => {
    expect(listarCategorias().map((c) => c.slug)).toContain('basico')
  })

  it('encuentra una categoría por su slug, sin importar mayúsculas', () => {
    expect(buscarCategoria('denim')?.nombre).toBe('Denim')
    expect(buscarCategoria('MUJER')?.nombre).toBe('Mujer')
  })

  it('devuelve undefined cuando el slug no existe', () => {
    expect(buscarCategoria('zapatillas')).toBeUndefined()
    expect(buscarCategoria(undefined)).toBeUndefined()
  })
})
