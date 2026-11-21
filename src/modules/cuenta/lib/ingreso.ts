import { esEmailValido } from '@/shared/lib/validacion'

export const MIN_CONTRASENIA = 6

export type ErroresIngreso = Partial<Record<'email' | 'contrasenia', string>>

/** Reglas del ingreso simulado. Devuelve un objeto vacío si todo está bien. */
export function validarIngreso(email: string, contrasenia: string): ErroresIngreso {
  const errores: ErroresIngreso = {}
  if (!email.trim()) errores.email = 'Escribe tu correo.'
  else if (!esEmailValido(email)) errores.email = 'Revisa el correo: debe tener la forma nombre@correo.com.'

  if (!contrasenia) errores.contrasenia = 'Escribe tu contraseña.'
  else if (contrasenia.length < MIN_CONTRASENIA)
    errores.contrasenia = `La contraseña tiene al menos ${MIN_CONTRASENIA} caracteres.`

  return errores
}
