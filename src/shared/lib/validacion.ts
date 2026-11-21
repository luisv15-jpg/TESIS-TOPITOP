/** Correo con forma usuario@dominio.ext; suficiente para un formulario de prueba. */
const PATRON_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function esEmailValido(email: string): boolean {
  return PATRON_EMAIL.test(email.trim())
}

/** DNI peruano: 8 cifras. Carné de extranjería: 9 a 12 caracteres alfanuméricos. */
export function esDocumentoValido(tipo: 'DNI' | 'CE', numero: string): boolean {
  const valor = numero.trim()
  return tipo === 'DNI' ? /^\d{8}$/.test(valor) : /^[A-Za-z0-9]{9,12}$/.test(valor)
}

/** Celular peruano: 9 cifras que empiezan con 9. */
export function esCelularValido(numero: string): boolean {
  return /^9\d{8}$/.test(numero.replace(/\s+/g, ''))
}
