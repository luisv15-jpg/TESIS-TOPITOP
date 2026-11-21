import { useId, useState } from 'react'
import { ArrowUpIcon } from '@phosphor-icons/react'
import { diasParaNavidad, etapaEnvio, type EtapaEnvio, type FechasEnvio } from '../../lib/navidad'
import { obtenerFechasEnvio } from '../../services/portada.service'
import './CuentaRegresiva.css'

type Props = {
  /** id de la sección de regalos a la que lleva el botón. */
  idRegalos: string
}

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

const fechaLarga = ({ mes, dia }: { mes: number; dia: number }) => `${dia} de ${MESES[mes - 1]}`

function mensaje(etapa: EtapaEnvio, fechas: FechasEnvio): string {
  switch (etapa) {
    case 'a-tiempo':
      return `Pide hasta el ${fechaLarga(fechas.provincias)} en provincias y hasta el ${fechaLarga(fechas.lima)} en Lima: tu regalo llega antes de Nochebuena.`
    case 'solo-lima':
      return `En Lima todavía llega a tiempo: pide hasta el ${fechaLarga(fechas.lima)}.`
    case 'recojo':
      return 'Ya no llegamos por envío, pero puedes recoger tu pedido en tienda hasta el 24 de diciembre.'
    case 'despues':
      return 'Gracias por regalar con Topitop. Los cambios van hasta el 31 de enero.'
  }
}

/** Cierre de la portada: los días que faltan para Navidad, en grande, y hasta cuándo llega el envío. */
export function CuentaRegresiva({ idRegalos }: Props) {
  const tituloId = useId()
  // La fecha se fija al montar: la cifra no cambia mientras la persona mira la página
  const [hoy] = useState(() => new Date())
  const fechas = obtenerFechasEnvio()
  const dias = diasParaNavidad(hoy)

  return (
    <section className="cuenta-regresiva" aria-labelledby={tituloId}>
      <div className="cuenta-regresiva__caja">
        <h2 id={tituloId} className="cuenta-regresiva__titulo">
          {dias === 0 ? (
            <span className="cuenta-regresiva__texto">¡Feliz Navidad!</span>
          ) : (
            <>
              <span className="cuenta-regresiva__numero">{dias}</span>{' '}
              <span className="cuenta-regresiva__texto">
                {dias === 1 ? 'día' : 'días'} para Navidad
              </span>
            </>
          )}
        </h2>
        <div className="cuenta-regresiva__pie">
          <p className="cuenta-regresiva__mensaje">{mensaje(etapaEnvio(hoy, fechas), fechas)}</p>
          <a href={`#${idRegalos}`} className="cuenta-regresiva__accion">
            Elegir un regalo
            <ArrowUpIcon weight="bold" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
