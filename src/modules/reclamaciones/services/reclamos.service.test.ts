import { describe, expect, it } from 'vitest'
import { formatearCodigoReclamo, registrarReclamo } from './reclamos.service'

function almacenEnMemoria(inicial: Record<string, string> = {}) {
  const datos = new Map(Object.entries(inicial))
  return {
    getItem: (clave: string) => datos.get(clave) ?? null,
    setItem: (clave: string, valor: string) => void datos.set(clave, valor),
    datos,
  }
}

const AHORA = new Date('2026-11-11T15:00:00-05:00')

describe('registrarReclamo', () => {
  it('numera las hojas de forma correlativa por año', () => {
    const almacen = almacenEnMemoria()

    expect(registrarReclamo('reclamo', almacen, AHORA).codigo).toBe('LR-2026-000001')
    expect(registrarReclamo('queja', almacen, AHORA).codigo).toBe('LR-2026-000002')
  })

  it('guarda solo el código, la fecha y el tipo', () => {
    const almacen = almacenEnMemoria()

    registrarReclamo('queja', almacen, AHORA)

    expect(JSON.parse(almacen.datos.get('topitop-reclamos') ?? '')).toEqual([
      { codigo: 'LR-2026-000001', fecha: AHORA.toISOString(), tipo: 'queja' },
    ])
  })

  it('empieza de cero si lo guardado está dañado', () => {
    const almacen = almacenEnMemoria({ 'topitop-reclamos': '{roto' })

    expect(registrarReclamo('reclamo', almacen, AHORA).codigo).toBe('LR-2026-000001')
  })

  it('ignora registros con forma inválida', () => {
    const almacen = almacenEnMemoria({ 'topitop-reclamos': JSON.stringify([{ codigo: 1 }, 'x', null]) })

    expect(registrarReclamo('reclamo', almacen, AHORA).codigo).toBe('LR-2026-000001')
  })

  it('confirma la hoja aunque el navegador no deje guardar', () => {
    const almacen = {
      getItem: () => null,
      setItem: () => {
        throw new Error('QuotaExceededError')
      },
    }

    expect(registrarReclamo('reclamo', almacen, AHORA).codigo).toBe('LR-2026-000001')
  })
})

describe('formatearCodigoReclamo', () => {
  it('rellena con ceros hasta 6 cifras', () => {
    expect(formatearCodigoReclamo(2027, 42)).toBe('LR-2027-000042')
  })
})
