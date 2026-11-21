import { useId } from 'react'
import { SelectButton } from 'primereact/selectbutton'
import './SelectorTalla.css'

type Props = {
  tallas: readonly string[]
  valor: string | null
  onCambiar: (talla: string | null) => void
  /** Texto visible del grupo; por defecto «Talla». */
  etiqueta?: string
}

/** Grupo de botones de talla (PrimeReact SelectButton: botones con aria-pressed y foco con flechas). */
export function SelectorTalla({ tallas, valor, onCambiar, etiqueta = 'Talla' }: Props) {
  const etiquetaId = useId()
  return (
    <div className="selector-talla">
      <span id={etiquetaId} className="selector-talla__etiqueta">
        {etiqueta}
      </span>
      <SelectButton
        value={valor}
        options={[...tallas]}
        onChange={(evento) => onCambiar((evento.value as string | null) ?? null)}
        ariaLabelledBy={etiquetaId}
        className="selector-talla__opciones"
      />
    </div>
  )
}
