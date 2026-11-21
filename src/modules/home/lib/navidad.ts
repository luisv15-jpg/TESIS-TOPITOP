/** Fechas de la campaña: el último día para pedir y recibir antes de Nochebuena. */
export type FechasEnvio = {
  /** Mes (1-12) y día del último pedido con envío a provincias. */
  provincias: { mes: number; dia: number }
  /** Último pedido con envío en Lima. */
  lima: { mes: number; dia: number }
}

const MS_POR_DIA = 24 * 60 * 60 * 1000
const DICIEMBRE = 11

/** Medianoche local del día, para contar días de calendario y no horas. */
function soloFecha(fecha: Date): number {
  return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()).getTime()
}

/** Días que faltan para el 25 de diciembre (0 el mismo día). Pasada la Navidad, cuenta la del año siguiente. */
export function diasParaNavidad(hoy: Date): number {
  let navidad = new Date(hoy.getFullYear(), DICIEMBRE, 25)
  if (soloFecha(hoy) > navidad.getTime()) navidad = new Date(hoy.getFullYear() + 1, DICIEMBRE, 25)
  return Math.round((navidad.getTime() - soloFecha(hoy)) / MS_POR_DIA)
}

export type EtapaEnvio = 'a-tiempo' | 'solo-lima' | 'recojo' | 'despues'

/**
 * En qué momento de la temporada estamos:
 * - «a-tiempo»: aún llega a todo el país;
 * - «solo-lima»: ya no llega a provincias, pero sí a Lima;
 * - «recojo»: ya no llega por envío; queda recoger en tienda hasta el 24;
 * - «despues»: del 25 al 31 de diciembre.
 */
export function etapaEnvio(hoy: Date, fechas: FechasEnvio): EtapaEnvio {
  const anio = hoy.getFullYear()
  const dia = soloFecha(hoy)
  const limite = ({ mes, dia: d }: { mes: number; dia: number }) => new Date(anio, mes - 1, d).getTime()
  if (hoy.getMonth() === DICIEMBRE && hoy.getDate() >= 25) return 'despues'
  if (dia <= limite(fechas.provincias)) return 'a-tiempo'
  if (dia <= limite(fechas.lima)) return 'solo-lima'
  return 'recojo'
}
