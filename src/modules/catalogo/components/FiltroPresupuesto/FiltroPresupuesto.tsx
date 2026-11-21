import { useId } from 'react'
import { RANGOS_PRESUPUESTO, type RangoPresupuesto } from '../../lib/presupuesto'
import './FiltroPresupuesto.css'

type Props = {
  /** Tramo elegido; null es «Todos» (solo si se ofrece). */
  valor: RangoPresupuesto['id'] | null
  onCambiar: (valor: RangoPresupuesto['id'] | null) => void
  /** Agrega la opción «Todos» al inicio. */
  conTodos?: boolean
  leyenda?: string
}

const TODOS = 'todos'

/** Pestañas de tramos de precio. Radios nativos: Tab entra al grupo y las flechas cambian de tramo. */
export function FiltroPresupuesto({ valor, onCambiar, conTodos = false, leyenda = 'Presupuesto' }: Props) {
  const grupo = useId()
  const opciones = [
    ...(conTodos ? [{ id: TODOS, etiqueta: 'Todos' }] : []),
    ...RANGOS_PRESUPUESTO.map(({ id, etiqueta }) => ({ id, etiqueta })),
  ]

  return (
    <fieldset className="filtro-presupuesto">
      <legend className="sr-only">{leyenda}</legend>
      {opciones.map((opcion) => (
        <label key={opcion.id} className="filtro-presupuesto__opcion">
          <input
            type="radio"
            name={grupo}
            value={opcion.id}
            checked={(valor ?? TODOS) === opcion.id}
            onChange={() => onCambiar(opcion.id === TODOS ? null : (opcion.id as RangoPresupuesto['id']))}
            className="filtro-presupuesto__radio"
          />
          {opcion.etiqueta}
        </label>
      ))}
    </fieldset>
  )
}
