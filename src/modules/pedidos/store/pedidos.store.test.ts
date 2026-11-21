import { describe, expect, it } from 'vitest'
import { buscarPedido, normalizarCodigo } from '../services/pedidos.service'
import { generarCodigo, sanearPedidos, usePedidos } from './pedidos.store'

describe('generarCodigo', () => {
  it('arma TT- con 6 cifras', () => {
    expect(generarCodigo([], () => 0.0421)).toBe('TT-042100')
  })

  it('vuelve a sortear si el código ya existe', () => {
    const sorteos = [0.1048325, 0.5]
    expect(generarCodigo(['TT-104832'], () => sorteos.shift() ?? 0)).toBe('TT-500000')
  })
})

describe('normalizarCodigo', () => {
  it('quita espacios y pasa a mayúsculas', () => {
    expect(normalizarCodigo('  tt- 104832 ')).toBe('TT-104832')
  })
})

describe('buscarPedido', () => {
  it('encuentra los pedidos de demostración', () => {
    expect(buscarPedido('tt-104832', [])?.estado).toBe('en-camino')
  })

  it('encuentra los pedidos hechos en el navegador', () => {
    const propio = { codigo: 'TT-777777', fecha: '2026-11-11T10:00:00Z', unidades: 1, total: 29.9, estado: 'confirmado' as const }
    expect(buscarPedido('TT-777777', [propio])).toBe(propio)
  })

  it('devuelve undefined si no existe', () => {
    expect(buscarPedido('TT-000001', [])).toBeUndefined()
  })
})

describe('usePedidos', () => {
  it('registra un pedido confirmado al inicio de la lista sin modificar la anterior', () => {
    const antes = usePedidos.getState().pedidos

    const pedido = usePedidos.getState().registrar({ unidades: 2, total: 89.8 })

    expect(pedido).toMatchObject({ unidades: 2, total: 89.8, estado: 'confirmado' })
    expect(pedido.codigo).toMatch(/^TT-\d{6}$/)
    expect(usePedidos.getState().pedidos[0]).toBe(pedido)
    expect(antes).toEqual([])
  })

  it('guarda la envoltura de regalo y la valida al leerla del navegador', () => {
    const pedido = usePedidos.getState().registrar({ unidades: 1, total: 29.9, regalo: { dedicatoria: 'Para Ana' } })

    expect(pedido.regalo).toEqual({ dedicatoria: 'Para Ana' })
    const guardado = { pedidos: [{ ...pedido }, { ...pedido, codigo: 'TT-000002', regalo: { dedicatoria: 42 } }] }
    expect(sanearPedidos(guardado).map((p) => p.regalo)).toEqual([{ dedicatoria: 'Para Ana' }, undefined])
  })
})
