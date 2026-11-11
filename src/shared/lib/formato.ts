const numeroPeru = new Intl.NumberFormat('es-PE', { maximumFractionDigits: 2 })

/** Monto en soles con el prefijo «S/.» que usan las piezas de campaña. */
export function formatearSoles(monto: number): string {
  if (!Number.isFinite(monto) || monto < 0) {
    throw new RangeError(`Monto inválido: ${monto}`)
  }
  return `S/. ${numeroPeru.format(monto)}`
}
