import { useId, type HTMLInputTypeAttribute, type ReactNode, type Ref } from 'react'

type Props = {
  etiqueta: string
  /** Nombre del campo en el FormData del formulario. */
  nombre: string
  error?: string
  ayuda?: ReactNode
  tipo?: HTMLInputTypeAttribute
  autoComplete?: string
  inputMode?: 'text' | 'email' | 'tel' | 'numeric' | 'decimal'
  maxLength?: number
  requerido?: boolean
  multilinea?: boolean
  valorInicial?: string
  /** Contenido a la derecha del control, por ejemplo «Mostrar contraseña». */
  extra?: ReactNode
  /** true en formularios de un solo campo: el error se anuncia apenas aparece. */
  errorAnunciado?: boolean
  /** Referencia al input (no aplica a multilinea). */
  ref?: Ref<HTMLInputElement>
}

/**
 * Campo de texto con etiqueta visible, ayuda y error enlazados por aria-describedby.
 * No controlado: el formulario lee el valor con FormData. Usa las clases .campo de PaginaTienda.
 */
export function CampoTexto({
  etiqueta,
  nombre,
  error,
  ayuda,
  tipo = 'text',
  autoComplete,
  inputMode,
  maxLength,
  requerido = false,
  multilinea = false,
  valorInicial,
  extra,
  errorAnunciado = false,
  ref,
}: Props) {
  const id = useId()
  const ayudaId = `${id}-ayuda`
  const errorId = `${id}-error`
  const describedBy = [ayuda ? ayudaId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined

  const comunes = {
    id,
    name: nombre,
    className: 'campo__control',
    autoComplete,
    maxLength,
    defaultValue: valorInicial,
    'aria-required': requerido || undefined,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
  }

  return (
    <div className="campo">
      <label htmlFor={id} className="campo__etiqueta">
        {etiqueta}
        {requerido && (
          <span className="campo__requerido" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {ayuda && (
        <p id={ayudaId} className="campo__ayuda">
          {ayuda}
        </p>
      )}
      <div className="campo__fila">
        {multilinea ? <textarea {...comunes} rows={5} /> : <input {...comunes} ref={ref} type={tipo} inputMode={inputMode} />}
        {extra}
      </div>
      {error && (
        <p id={errorId} className="campo__error" role={errorAnunciado ? 'alert' : undefined}>
          {error}
        </p>
      )}
    </div>
  )
}
