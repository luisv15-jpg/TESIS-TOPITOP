import { beforeEach, describe, expect, it } from 'vitest'
import { huellaCorreo, suscribir } from './suscripcion.service'

const CLAVE = 'topitop-suscripciones'

describe('suscribir', () => {
  beforeEach(() => localStorage.clear())

  it('guarda una huella del correo, nunca el correo', () => {
    suscribir('  Ana@Correo.PE ')

    const guardado = localStorage.getItem(CLAVE) ?? ''
    expect(guardado).not.toContain('ana')
    expect(JSON.parse(guardado)).toEqual([huellaCorreo('ana@correo.pe')])
  })

  it('no duplica un correo ya suscrito, aunque cambien mayúsculas o espacios', () => {
    suscribir('ana@correo.pe')
    suscribir(' ANA@correo.pe')

    expect(JSON.parse(localStorage.getItem(CLAVE) ?? '')).toHaveLength(1)
  })

  it('tolera datos dañados en el almacenamiento', () => {
    localStorage.setItem(CLAVE, '{no es json')

    suscribir('luis@correo.pe')

    expect(JSON.parse(localStorage.getItem(CLAVE) ?? '')).toEqual([huellaCorreo('luis@correo.pe')])
  })
})

describe('huellaCorreo', () => {
  it('da 8 caracteres hexadecimales y distingue correos distintos', () => {
    expect(huellaCorreo('ana@correo.pe')).toMatch(/^[0-9a-f]{8}$/)
    expect(huellaCorreo('ana@correo.pe')).not.toBe(huellaCorreo('ana@correo.com'))
  })
})
