import { describe, expect, it } from 'vitest'
import { esCelularValido, esDocumentoValido, esEmailValido } from './validacion'

describe('esEmailValido', () => {
  it.each(['ana@correo.pe', ' luis.perez@empresa.com.pe ', 'a+b@x.io'])('acepta %s', (email) => {
    expect(esEmailValido(email)).toBe(true)
  })

  it.each(['', 'ana', 'ana@', 'ana@correo', 'ana @correo.pe', 'ana@correo.p'])('rechaza «%s»', (email) => {
    expect(esEmailValido(email)).toBe(false)
  })
})

describe('esDocumentoValido', () => {
  it('pide 8 cifras para el DNI', () => {
    expect(esDocumentoValido('DNI', '45678912')).toBe(true)
    expect(esDocumentoValido('DNI', '4567891')).toBe(false)
    expect(esDocumentoValido('DNI', '4567891A')).toBe(false)
  })

  it('acepta de 9 a 12 caracteres alfanuméricos en el carné de extranjería', () => {
    expect(esDocumentoValido('CE', '001234567')).toBe(true)
    expect(esDocumentoValido('CE', 'AB1234567890')).toBe(true)
    expect(esDocumentoValido('CE', '12345678')).toBe(false)
    expect(esDocumentoValido('CE', 'AB12-345678')).toBe(false)
  })
})

describe('esCelularValido', () => {
  it('acepta 9 cifras que empiezan con 9, con o sin espacios', () => {
    expect(esCelularValido('987654321')).toBe(true)
    expect(esCelularValido('987 654 321')).toBe(true)
  })

  it('rechaza fijos y números cortos', () => {
    expect(esCelularValido('014567890')).toBe(false)
    expect(esCelularValido('98765432')).toBe(false)
  })
})
