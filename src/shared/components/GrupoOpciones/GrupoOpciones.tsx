import { useId } from 'react'

type Opcion = { valor: string; etiqueta: string }

type Props = {
  leyenda: string
  nombre: string
  opciones: readonly Opcion[]
  valorInicial: string
  /** Texto bajo la leyenda que explica las opciones. */
  ayuda?: string
  onCambio?: (valor: string) => void
}

/** Radios nativos agrupados con fieldset y legend. Usa las clases .campo de PaginaTienda. */
export function GrupoOpciones({ leyenda, nombre, opciones, valorInicial, ayuda, onCambio }: Props) {
  const ayudaId = useId()
  return (
    <fieldset className="campo campo__grupo campo__grupo--opciones" aria-describedby={ayuda ? ayudaId : undefined}>
      <legend className="campo__etiqueta">{leyenda}</legend>
      {ayuda && (
        <p id={ayudaId} className="campo__ayuda">
          {ayuda}
        </p>
      )}
      <div className="campo__opciones">
        {opciones.map((opcion) => (
          <label key={opcion.valor} className="campo__opcion">
            <input
              type="radio"
              name={nombre}
              value={opcion.valor}
              defaultChecked={opcion.valor === valorInicial}
              onChange={onCambio ? () => onCambio(opcion.valor) : undefined}
            />
            {opcion.etiqueta}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
