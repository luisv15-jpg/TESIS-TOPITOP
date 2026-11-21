import { beforeEach, describe, expect, it } from 'vitest'
import { useCarrito } from './carrito.store'

const POLO = { productoId: 'polo-sports-negro', talla: 'M', color: 'Negro' }

describe('useCarrito', () => {
  beforeEach(() => {
    localStorage.clear()
    useCarrito.getState().vaciar()
  })

  it('agrega una prenda y suma unidades si se repite la misma talla y color', () => {
    useCarrito.getState().agregar(POLO)
    useCarrito.getState().agregar(POLO, 2)

    expect(useCarrito.getState().items).toEqual([{ ...POLO, cantidad: 3 }])
  })

  it('separa la misma prenda en otra talla', () => {
    useCarrito.getState().agregar(POLO)
    useCarrito.getState().agregar({ ...POLO, talla: 'L' })

    expect(useCarrito.getState().items).toHaveLength(2)
  })

  it('no modifica el arreglo anterior al agregar', () => {
    useCarrito.getState().agregar(POLO)
    const antes = useCarrito.getState().items

    useCarrito.getState().agregar(POLO)

    expect(antes[0].cantidad).toBe(1)
    expect(useCarrito.getState().items).not.toBe(antes)
  })

  it('limita la cantidad entre 1 y 10', () => {
    expect(useCarrito.getState().agregar(POLO, 50)).toBe(true)
    expect(useCarrito.getState().items[0].cantidad).toBe(10)

    // En el máximo ya no suma: lo informa para no anunciar un falso «agregado».
    expect(useCarrito.getState().agregar(POLO)).toBe(false)
    expect(useCarrito.getState().items[0].cantidad).toBe(10)

    useCarrito.getState().cambiarCantidad('polo-sports-negro|M|Negro', 0)
    expect(useCarrito.getState().items[0].cantidad).toBe(1)
  })

  it('quita una línea por su clave', () => {
    useCarrito.getState().agregar(POLO)
    useCarrito.getState().quitar('polo-sports-negro|M|Negro')

    expect(useCarrito.getState().items).toEqual([])
  })

  it('guarda el cupón en mayúsculas y lo quita', () => {
    useCarrito.getState().aplicarCupon(' navidadtop ')
    expect(useCarrito.getState().cupon).toBe('NAVIDADTOP')

    useCarrito.getState().quitarCupon()
    expect(useCarrito.getState().cupon).toBeNull()
  })

  it('persiste en localStorage', () => {
    useCarrito.getState().agregar(POLO)

    expect(localStorage.getItem('topitop-carrito')).toContain('polo-sports-negro')
  })
})
