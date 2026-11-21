import { describe, expect, it } from 'vitest'
import { useSesion, nombreDesdeEmail } from '../store/sesion.store'
import { validarIngreso } from './ingreso'

describe('validarIngreso', () => {
  it('no devuelve errores con un correo y una contraseña válidos', () => {
    expect(validarIngreso('ana@correo.pe', 'secreto')).toEqual({})
  })

  it('pide ambos datos cuando faltan', () => {
    expect(validarIngreso('', '')).toEqual({
      email: 'Escribe tu correo.',
      contrasenia: 'Escribe tu contraseña.',
    })
  })

  it('explica el formato del correo y el largo de la contraseña', () => {
    const errores = validarIngreso('ana@', '123')
    expect(errores.email).toMatch(/nombre@correo\.com/)
    expect(errores.contrasenia).toMatch(/al menos 6/)
  })
})

describe('sesión simulada', () => {
  it('saca el nombre del correo', () => {
    expect(nombreDesdeEmail('ana.perez@correo.pe')).toBe('Ana')
    expect(nombreDesdeEmail('LUIS_r@correo.pe')).toBe('Luis')
    expect(nombreDesdeEmail('@correo.pe')).toBe('Cliente')
  })

  it('inicia con el correo normalizado y cierra la sesión', () => {
    const usuario = useSesion.getState().iniciar('  Ana.Perez@Correo.pe ')

    expect(usuario).toEqual({ email: 'ana.perez@correo.pe', nombre: 'Ana' })
    expect(useSesion.getState().usuario).toEqual(usuario)

    useSesion.getState().cerrar()
    expect(useSesion.getState().usuario).toBeNull()
  })
})
