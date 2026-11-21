import type { FechasEnvio } from '../lib/navidad'
import {
  DESTINATARIOS,
  EDITORIAL_PIJAMAS,
  FECHAS_ENVIO,
  PASOS_REGALO,
  type Destinatario,
  type PasoRegalo,
} from '../data/portada'

/*
  Punto único de acceso a los bloques de la portada. Hoy lee los datos de prueba;
  cuando exista un gestor de contenidos, solo cambia este archivo.
*/

export function listarDestinatarios(): readonly Destinatario[] {
  return DESTINATARIOS
}

export function obtenerEditorialPijamas(): typeof EDITORIAL_PIJAMAS {
  return EDITORIAL_PIJAMAS
}

export function listarPasosRegalo(): readonly PasoRegalo[] {
  return PASOS_REGALO
}

export function obtenerFechasEnvio(): FechasEnvio {
  return FECHAS_ENVIO
}
