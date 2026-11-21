import { describe, expect, it, vi } from 'vitest'
import { useCarrito } from '@/modules/carrito/store/carrito.store'
import { useSesion } from '@/modules/cuenta/store/sesion.store'
import { useFavoritos } from '@/modules/favoritos/store/favoritos.store'
import { sanearPedidos, usePedidos } from '@/modules/pedidos/store/pedidos.store'
import { comoObjeto, esNumero, esTexto } from './persistencia'

/** Simula que otra pestaña escribió la clave: el navegador avisa con el evento storage. */
function escribirDesdeOtraPestana(clave: string, valor: unknown) {
  localStorage.setItem(clave, JSON.stringify(valor))
  window.dispatchEvent(new StorageEvent('storage', { key: clave }))
}

describe('sincronización entre pestañas', () => {
  it('relee el carrito cuando otra pestaña lo cambia', async () => {
    escribirDesdeOtraPestana('topitop-carrito', {
      state: { items: [{ productoId: 'jean-clasico-azul', talla: '30', color: 'Azul medio', cantidad: 2 }], cupon: null },
      version: 1,
    })

    await vi.waitFor(() => expect(useCarrito.getState().items).toHaveLength(1))
  })

  it('relee los pedidos para no pisar los de otra pestaña', async () => {
    const pedido = { codigo: 'TT-555555', fecha: '2026-11-11T10:00:00Z', unidades: 1, total: 29.9, estado: 'confirmado' }
    escribirDesdeOtraPestana('topitop-pedidos', { state: { pedidos: [pedido] }, version: 1 })

    await vi.waitFor(() => expect(usePedidos.getState().pedidos).toEqual([pedido]))
    usePedidos.getState().registrar({ unidades: 1, total: 49.9 })
    expect(usePedidos.getState().pedidos).toHaveLength(2)
  })

  it('ignora otras claves', () => {
    escribirDesdeOtraPestana('otra-app', { state: { items: [1] } })

    expect(useCarrito.getState().items).toEqual([])
  })
})

describe('validación de lo guardado', () => {
  it('descarta favoritos repetidos o que no son texto', async () => {
    escribirDesdeOtraPestana('topitop-favoritos', { state: { ids: ['a', 'a', 3, null, 'b'] }, version: 1 })

    await vi.waitFor(() => expect(useFavoritos.getState().ids).toEqual(['a', 'b']))
  })

  it('cierra la sesión si el usuario guardado está incompleto', async () => {
    useSesion.getState().iniciar('ana@correo.pe')
    escribirDesdeOtraPestana('topitop-sesion', { state: { usuario: { nombre: 'Ana' } }, version: 1 })

    await vi.waitFor(() => expect(useSesion.getState().usuario).toBeNull())
  })

  it('descarta pedidos con montos, fechas o estados inválidos', () => {
    const valido = { codigo: 'TT-111111', fecha: '2026-11-11T10:00:00Z', unidades: 1, total: 10, estado: 'entregado' }

    expect(
      sanearPedidos({
        pedidos: [
          valido,
          { ...valido, total: -5 },
          { ...valido, unidades: 0 },
          { ...valido, estado: 'perdido' },
          { ...valido, fecha: 'ayer' },
          'x',
        ],
      }),
    ).toEqual([valido])
    expect(sanearPedidos(null)).toEqual([])
  })
})

describe('guardas de tipos', () => {
  it('reconocen objetos, textos y números', () => {
    expect(comoObjeto([1])).toEqual({})
    expect(comoObjeto({ a: 1 })).toEqual({ a: 1 })
    expect(esTexto('')).toBe(false)
    expect(esNumero(Number.NaN)).toBe(false)
    expect(esNumero(3)).toBe(true)
  })
})
