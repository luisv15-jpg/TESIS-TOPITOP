import { CAMPANIAS } from '../data/campanias'
import type { Campania } from '../types'

/*
  Punto único de acceso a las campañas. Hoy lee los datos de prueba;
  cuando exista backend, solo cambia este archivo.
*/

export function obtenerCampaniaDestacada(campanias: readonly Campania[] = CAMPANIAS): Campania {
  const destacada = campanias.find((campania) => campania.destacada)
  if (!destacada) {
    throw new Error('No hay ninguna campaña destacada en los datos de prueba')
  }
  return destacada
}
