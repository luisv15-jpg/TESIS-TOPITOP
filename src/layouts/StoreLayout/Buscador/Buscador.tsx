import { useId, type FormEvent } from 'react'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputText } from 'primereact/inputtext'
import { useLocation, useNavigate, useSearchParams } from 'react-router'
import { useValorExterno } from '@/shared/lib/useValorExterno'
import './Buscador.css'

type Props = {
  className?: string
  /** Se llama después de navegar a los resultados (el menú móvil se cierra con esto). */
  onBuscar?: () => void
}

const RUTA_BUSQUEDA = '/buscar'
const LARGO_MAXIMO = 80

export function Buscador({ className, onBuscar }: Props) {
  const navigate = useNavigate()
  const inputId = useId()
  const { pathname } = useLocation()
  const [parametros] = useSearchParams()
  // En /buscar el campo muestra la consulta de la URL; en otras páginas arranca vacío.
  const consultaActual = pathname === RUTA_BUSQUEDA ? (parametros.get('q') ?? '') : ''
  const campoRef = useValorExterno(consultaActual)

  function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const consulta = String(new FormData(evento.currentTarget).get('q') ?? '').trim()
    if (!consulta) return
    navigate(`${RUTA_BUSQUEDA}?q=${encodeURIComponent(consulta)}`)
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
          ref={campoRef}
          id={inputId}
          type="search"
          name="q"
          defaultValue={consultaActual}
          maxLength={LARGO_MAXIMO}
          placeholder="Buscar productos..."
          autoComplete="off"
          enterKeyHint="search"
          className="buscador__input"
        />
      </IconField>
    </form>
  )
}
