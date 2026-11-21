import type { ReclamoRegistrado, TipoReclamacion } from '../types'

const CLAVE = 'topitop-reclamos'
const DIGITOS = 6

/** Plazo legal de respuesta del proveedor (Código de Protección y Defensa del Consumidor). */
export const PLAZO_RESPUESTA_DIAS_HABILES = 15

type Almacen = Pick<Storage, 'getItem' | 'setItem'>

function esRegistro(valor: unknown): valor is ReclamoRegistrado {
  if (typeof valor !== 'object' || valor === null) return false
  const posible = valor as Record<string, unknown>
  return typeof posible.codigo === 'string' && typeof posible.fecha === 'string'
}

function leer(almacen: Almacen): ReclamoRegistrado[] {
  try {
    const guardado: unknown = JSON.parse(almacen.getItem(CLAVE) ?? '[]')
    return Array.isArray(guardado) ? guardado.filter(esRegistro) : []
  } catch {
    // Dato dañado en el navegador: se empieza de cero en vez de romper el formulario.
    return []
  }
}

/** «LR-2026-000001»: año de la hoja y número correlativo de este navegador. */
export function formatearCodigoReclamo(anio: number, numero: number): string {
  return `LR-${anio}-${String(numero).padStart(DIGITOS, '0')}`
}

/**
 * Registra la hoja de forma SIMULADA. Solo guarda el código, la fecha y el tipo;
 * los datos personales no salen del formulario.
 */
export function registrarReclamo(
  tipo: TipoReclamacion,
  almacen: Almacen = localStorage,
  ahora: Date = new Date(),
): ReclamoRegistrado {
  const previos = leer(almacen)
  const registro: ReclamoRegistrado = {
    codigo: formatearCodigoReclamo(ahora.getFullYear(), previos.length + 1),
    fecha: ahora.toISOString(),
    tipo,
  }
  try {
    almacen.setItem(CLAVE, JSON.stringify([...previos, registro]))
  } catch {
    // Sin espacio o almacenamiento bloqueado: la hoja se confirma igual en pantalla.
  }
  return registro
}
