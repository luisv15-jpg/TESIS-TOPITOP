import { CAMPANIAS } from '../data/campanias'
import type { Campania } from '../types'

/*
  Punto único de acceso a las campañas. Hoy lee los datos de prueba;
  cuando exista backend, solo cambia este archivo.
*/

/** La campaña destacada, o undefined si no hay: para piezas del marco que no deben tumbar la página. */
export function buscarCampaniaDestacada(campanias: readonly Campania[] = CAMPANIAS): Campania | undefined {
  return campanias.find((campania) => campania.destacada)
}

/** La campaña destacada; sin ella la portada no tiene qué mostrar, así que falla con un mensaje claro. */
export function obtenerCampaniaDestacada(campanias: readonly Campania[] = CAMPANIAS): Campania {
  const destacada = buscarCampaniaDestacada(campanias)
  if (!destacada) {
    throw new Error('No hay ninguna campaña destacada en los datos de prueba')
  }
  return destacada
}
