/*
  Suscripción a novedades SIN backend. En el navegador no se guarda el correo, solo una huella
  (hash) para no repetirlo: en un equipo compartido nadie puede leer qué correos se usaron.
  Cuando exista una API, solo cambia este archivo.
*/

const CLAVE = 'topitop-suscripciones'

/** Huella FNV-1a de 32 bits en hexadecimal. Basta para no duplicar; no es cifrado. */
export function huellaCorreo(email: string): string {
  let hash = 0x811c9dc5
  for (const caracter of email.trim().toLowerCase()) {
    hash ^= caracter.codePointAt(0) ?? 0
    hash = Math.imul(hash, 0x01000193) >>> 0
  }
  return hash.toString(16).padStart(8, '0')
}

function leer(almacen: Storage): string[] {
  try {
    const guardado = JSON.parse(almacen.getItem(CLAVE) ?? '[]') as unknown
    return Array.isArray(guardado) ? guardado.filter((valor): valor is string => typeof valor === 'string') : []
  } catch {
    return []
  }
}

/**
 * Registra la suscripción. Repetir un correo no cambia nada ni se informa distinto, para no
 * revelar si ese correo ya estaba suscrito. Lanza error si el navegador no deja guardar.
 */
export function suscribir(email: string, almacen: Storage = localStorage): void {
  const huella = huellaCorreo(email)
  const actuales = leer(almacen)
  if (actuales.includes(huella)) return
  almacen.setItem(CLAVE, JSON.stringify([...actuales, huella]))
}
