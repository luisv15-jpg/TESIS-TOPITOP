import { useState, type FormEvent } from 'react'
import { flushSync } from 'react-dom'
import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react'
import { CampoTexto } from '@/shared/components/CampoTexto/CampoTexto'
import { enfocarTituloPagina } from '@/shared/lib/dom'
import { useNotificar } from '@/shared/notificaciones/contexto'
import { MIN_CONTRASENIA, validarIngreso, type ErroresIngreso } from '../../lib/ingreso'
import { useSesion } from '../../store/sesion.store'

/** Ingreso SIMULADO: valida la forma de los datos y guarda solo el correo en el navegador. */
export function FormularioIngreso() {
  const iniciar = useSesion((estado) => estado.iniciar)
  const notificar = useNotificar()
  const [errores, setErrores] = useState<ErroresIngreso>({})
  const [verContrasenia, setVerContrasenia] = useState(false)

  function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const formulario = evento.currentTarget
    const datos = new FormData(formulario)
    const email = String(datos.get('email') ?? '')
    const contrasenia = String(datos.get('contrasenia') ?? '')

    const encontrados = validarIngreso(email, contrasenia)
    // flushSync: el campo ya tiene aria-invalid y su error enlazado cuando recibe el foco.
    flushSync(() => setErrores(encontrados))
    const primero = Object.keys(encontrados)[0]
    if (primero) {
      const campo = formulario.querySelector<HTMLInputElement>(`[name="${primero}"]`)
      // Si ya tenía el foco, se lo saca y devuelve para que el lector anuncie el error.
      if (campo === document.activeElement) campo?.blur()
      campo?.focus()
      return
    }

    // El formulario se cambia por el panel de la cuenta: el foco pasa al saludo.
    const usuario = flushSync(() => iniciar(email))
    enfocarTituloPagina()
    notificar({
      tipo: 'exito',
      titulo: `Hola, ${usuario.nombre}`,
      detalle: 'Ingresaste a tu cuenta de prueba. Tu contraseña no se guarda.',
      reemplazar: true,
    })
  }

  const IconoVer = verContrasenia ? EyeSlashIcon : EyeIcon

  return (
    <form className="cuenta__ingreso tarjeta-blanca" onSubmit={handleSubmit} noValidate>
      <CampoTexto
        etiqueta="Correo"
        nombre="email"
        tipo="email"
        inputMode="email"
        autoComplete="email"
        maxLength={120}
        requerido
        error={errores.email}
      />
      <CampoTexto
        etiqueta="Contraseña"
        nombre="contrasenia"
        tipo={verContrasenia ? 'text' : 'password'}
        autoComplete="current-password"
        maxLength={64}
        requerido
        ayuda={`Al menos ${MIN_CONTRASENIA} caracteres.`}
        error={errores.contrasenia}
        extra={
          <button
            type="button"
            className="boton-secundario cuenta__ver"
            aria-label={verContrasenia ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            onClick={() => setVerContrasenia((actual) => !actual)}
          >
            <IconoVer aria-hidden="true" />
            {verContrasenia ? 'Ocultar' : 'Mostrar'}
          </button>
        }
      />
      <button type="submit" className="boton-primario">
        Ingresar
      </button>
      <p className="cuenta__nota">
        Cuenta de prueba: entra con cualquier correo. No hay servidor y la contraseña no se guarda.
      </p>
    </form>
  )
}
