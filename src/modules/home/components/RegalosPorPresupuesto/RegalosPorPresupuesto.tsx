import { useId, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { FiltroPresupuesto } from '@/modules/catalogo/components/FiltroPresupuesto/FiltroPresupuesto'
import {
  buscarRango,
  filtrarPorPresupuesto,
  RANGOS_PRESUPUESTO,
  type RangoPresupuesto,
} from '@/modules/catalogo/lib/presupuesto'
import { listarIdeasRegalo } from '@/modules/catalogo/services/productos.service'
import { GrillaProductos } from '@/modules/compra/components/GrillaProductos/GrillaProductos'
import './RegalosPorPresupuesto.css'

type Props = {
  id: string
}

/** Cuántas ideas se muestran por tramo: dos filas en escritorio. */
const MAXIMO = 8
const TRAMO_INICIAL: RangoPresupuesto['id'] = 'de-50-a-99'

/** «Regalos por presupuesto»: se elige un tramo de precio y aparecen las ideas con compra rápida. */
export function RegalosPorPresupuesto({ id }: Props) {
  const tituloId = useId()
  const [tramoId, setTramoId] = useState<RangoPresupuesto['id']>(TRAMO_INICIAL)
  const [verTodas, setVerTodas] = useState(false)
  const grillaRef = useRef<HTMLDivElement>(null)
  const tramo = buscarRango(tramoId) ?? RANGOS_PRESUPUESTO[0]
  const todas = filtrarPorPresupuesto(listarIdeasRegalo(), tramo)
  const ideas = verTodas ? todas : todas.slice(0, MAXIMO)
  const conteo = `${todas.length} ${todas.length === 1 ? 'idea' : 'ideas'} de regalo · ${tramo.etiqueta}`

  function handleTramo(valor: RangoPresupuesto['id'] | null) {
    setTramoId(valor ?? TRAMO_INICIAL)
    setVerTodas(false)
  }

  /** El botón desaparece al abrir la lista: el foco pasa a la primera prenda nueva. */
  function handleVerTodas() {
    flushSync(() => setVerTodas(true))
    grillaRef.current?.querySelectorAll('article')[MAXIMO]?.querySelector<HTMLElement>('button, input')?.focus()
  }

  return (
    <section id={id} className="seccion regalos" aria-labelledby={tituloId}>
      <div className="seccion__caja">
        <header className="regalos__cabecera">
          <div className="seccion__cabecera">
            <p className="seccion__antetitulo">Lo más top</p>
            <h2 id={tituloId} className="seccion__titulo">
              Regalos por presupuesto
            </h2>
            <p className="seccion__bajada">
              Dinos cuánto quieres gastar y te mostramos lo más pedido de la temporada, listo para agregar al carrito.
            </p>
          </div>

          <FiltroPresupuesto
            valor={tramoId}
            onCambiar={handleTramo}
            leyenda="Presupuesto del regalo"
          />
        </header>

        <p className="regalos__conteo" role="status">
          {conteo}
        </p>
        <div ref={grillaRef}>
          <GrillaProductos productos={ideas} etiqueta={`Regalos ${tramo.etiqueta}`} />
        </div>
        {todas.length > ideas.length && (
          <button type="button" className="regalos__mas" onClick={handleVerTodas}>
            Ver las {todas.length} ideas
          </button>
        )}
      </div>
    </section>
  )
}
