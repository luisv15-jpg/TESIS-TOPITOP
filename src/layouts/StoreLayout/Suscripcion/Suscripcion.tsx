import { useId, useState, type FormEvent } from 'react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { suscribir } from '@/modules/novedades/services/suscripcion.service'
import { esEmailValido } from '@/shared/lib/validacion'
import { useNotificar } from '@/shared/notificaciones/contexto'
import './Suscripcion.css'

/** Formulario del footer: valida el correo y confirma con un aviso. */
export function Suscripcion() {
  const notificar = useNotificar()
  const campoId = useId()
  const errorId = useId()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (!esEmailValido(email)) {
      setError('Escribe un correo válido, por ejemplo nombre@correo.com.')
      return
    }
    setError(null)
    try {
      suscribir(email)
      notificar({ tipo: 'exito', titulo: 'Te suscribiste', detalle: `Enviaremos cupones y novedades a ${email.trim()}.` })
      setEmail('')
    } catch {
      notificar({ tipo: 'error', titulo: 'No pudimos guardar tu correo', detalle: 'Inténtalo de nuevo en un momento.' })
    }
  }

  return (
    <form className="suscripcion" onSubmit={handleSubmit} noValidate>
      <label htmlFor={campoId} className="suscripcion__etiqueta">
        Tu correo
      </label>
      <div className="suscripcion__fila">
        <InputText
          id={campoId}
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(evento) => setEmail(evento.target.value)}
          placeholder="nombre@correo.com"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="suscripcion__campo"
        />
        <Button type="submit" label="Suscribirme" className="suscripcion__boton" />
      </div>
      {error && (
        <p id={errorId} className="suscripcion__error" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}
