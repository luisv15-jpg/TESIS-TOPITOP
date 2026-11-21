import { describe, expect, it } from 'vitest'
import { useFavoritos } from './favoritos.store'

describe('useFavoritos', () => {
  it('guarda y quita un producto, e informa cómo quedó', () => {
    expect(useFavoritos.getState().alternar('polo-clasico-blanco')).toBe(true)
    expect(useFavoritos.getState().ids).toEqual(['polo-clasico-blanco'])

    expect(useFavoritos.getState().alternar('polo-clasico-blanco')).toBe(false)
    expect(useFavoritos.getState().ids).toEqual([])
  })

  it('no modifica el arreglo anterior', () => {
    useFavoritos.getState().alternar('a')
    const antes = useFavoritos.getState().ids

    useFavoritos.getState().alternar('b')

    expect(antes).toEqual(['a'])
    expect(useFavoritos.getState().ids).toEqual(['a', 'b'])
  })
})
