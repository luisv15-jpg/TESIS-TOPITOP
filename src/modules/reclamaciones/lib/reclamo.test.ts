import { describe, expect, it } from 'vitest'
import type { DatosReclamo } from '../types'
import { leerReclamo, primerCampoConError, validarReclamo } from './reclamo'

const VALIDO: DatosReclamo = {
  nombre: 'Ana Pérez Quispe',
  domicilio: 'Av. Gamarra, La Victoria',
  tipoDocumento: 'DNI',
  numeroDocumento: '45678912',
  celular: '987654321',
  email: 'ana@correo.pe',
  esMenor: false,
  apoderado: '',
  tipoBien: 'producto',
  codigoPedido: 'TT-104832',
  monto: '79.90',
  descripcionBien: 'Polera con capucha rosa, talla M',
  tipo: 'reclamo',
  detalle: 'La polera llegó con una costura abierta en la manga.',
  pedido: 'Cambio por otra igual.',
  acepta: true,
}

function formulario(campos: Record<string, string>): FormData {
  const datos = new FormData()
  for (const [campo, valor] of Object.entries(campos)) datos.set(campo, valor)
  return datos
}

describe('leerReclamo', () => {
  it('limpia espacios, pasa el código a mayúsculas y lee las casillas', () => {
    const datos = leerReclamo(
      formulario({ nombre: '  Ana  ', codigoPedido: 'tt-104832', esMenor: 'si', acepta: 'si', tipo: 'queja' }),
    )

    expect(datos.nombre).toBe('Ana')
    expect(datos.codigoPedido).toBe('TT-104832')
    expect(datos.esMenor).toBe(true)
    expect(datos.acepta).toBe(true)
    expect(datos.tipo).toBe('queja')
  })

  it('usa los valores por defecto ante opciones desconocidas o casillas sin marcar', () => {
    const datos = leerReclamo(formulario({ tipoDocumento: 'PASAPORTE', tipoBien: 'otro', tipo: 'x' }))

    expect(datos).toMatchObject({ tipoDocumento: 'DNI', tipoBien: 'producto', tipo: 'reclamo', esMenor: false, acepta: false })
  })
})

describe('validarReclamo', () => {
  it('acepta una hoja completa', () => {
    expect(validarReclamo(VALIDO)).toEqual({})
  })

  it('marca los obligatorios de una hoja vacía', () => {
    const vacia = leerReclamo(new FormData())

    expect(Object.keys(validarReclamo(vacia)).sort()).toEqual(
      ['acepta', 'celular', 'descripcionBien', 'detalle', 'domicilio', 'email', 'nombre', 'numeroDocumento', 'pedido'].sort(),
    )
  })

  it('valida el documento según su tipo', () => {
    expect(validarReclamo({ ...VALIDO, numeroDocumento: '1234567' }).numeroDocumento).toBe('El DNI tiene 8 cifras.')
    expect(validarReclamo({ ...VALIDO, tipoDocumento: 'CE', numeroDocumento: '45678912' }).numeroDocumento).toMatch(
      /carné de extranjería/,
    )
  })

  it('pide al apoderado solo si es menor de edad', () => {
    expect(validarReclamo({ ...VALIDO, esMenor: true }).apoderado).toBeDefined()
    expect(validarReclamo({ ...VALIDO, esMenor: true, apoderado: 'Rosa Quispe' })).toEqual({})
  })

  it('revisa el monto opcional y los largos del detalle y del pedido', () => {
    expect(validarReclamo({ ...VALIDO, monto: '' })).toEqual({})
    expect(validarReclamo({ ...VALIDO, monto: '79,90' }).monto).toMatch(/solo con números/)
    expect(validarReclamo({ ...VALIDO, monto: '100000' }).monto).toMatch(/demasiado alto/)
    expect(validarReclamo({ ...VALIDO, detalle: 'Muy corto' }).detalle).toMatch(/al menos 20/)
    expect(validarReclamo({ ...VALIDO, detalle: 'x'.repeat(1001) }).detalle).toMatch(/1000/)
    expect(validarReclamo({ ...VALIDO, pedido: 'x'.repeat(501) }).pedido).toMatch(/500/)
  })
})

describe('primerCampoConError', () => {
  it('sigue el orden de la pantalla', () => {
    expect(primerCampoConError({ acepta: 'x', email: 'y', detalle: 'z' })).toBe('email')
    expect(primerCampoConError({})).toBeUndefined()
  })
})
