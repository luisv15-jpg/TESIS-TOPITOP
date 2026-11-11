import { useId, useState, type FormEvent } from 'react'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputText } from 'primereact/inputtext'
import { useNavigate } from 'react-router'
import './Buscador.css'

type Props = {
  className?: string
  /** Se llama después de navegar a los resultados (el menú móvil se cierra con esto). */
  onBuscar?: () => void
}

export function Buscador({ className, onBuscar }: Props) {
  const navigate = useNavigate()
  const inputId = useId()
  const [texto, setTexto] = useState('')

  function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const consulta = texto.trim()
    if (!consulta) return
    navigate(`/buscar?q=${encodeURIComponent(consulta)}`)
    onBuscar?.()
  }

  const clases = ['buscador', className].filter(Boolean).join(' ')

  return (
    <form role="search" className={clases} onSubmit={handleSubmit}>
      <label htmlFor={inputId} className="sr-only">
        Buscar productos
      </label>
      <IconField iconPosition="left" className="buscador__campo">
        <InputIcon className="buscador__icono">
          <MagnifyingGlassIcon weight="bold" aria-hidden="true" />
        </InputIcon>
        <InputText
          id={inputId}
          type="search"
          name="q"
          value={texto}
          onChange={(evento) => setTexto(evento.target.value)}
          placeholder="Buscar productos..."
          autoComplete="off"
          enterKeyHint="search"
          className="buscador__input"
        />
      </IconField>
    </form>
  )
}
