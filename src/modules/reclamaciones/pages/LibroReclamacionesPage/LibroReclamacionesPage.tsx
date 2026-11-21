import { useId, useState } from 'react'
import { flushSync } from 'react-dom'
import { BookOpenTextIcon, CheckCircleIcon } from '@phosphor-icons/react'
import { PaginaTienda } from '@/shared/components/PaginaTienda/PaginaTienda'
import { useNotificar } from '@/shared/notificaciones/contexto'
import { FormularioReclamo } from '../../components/FormularioReclamo/FormularioReclamo'
import { PLAZO_RESPUESTA_DIAS_HABILES, registrarReclamo } from '../../services/reclamos.service'
import type { DatosReclamo, ReclamoRegistrado } from '../../types'
import './LibroReclamacionesPage.css'

/** Al aparecer la confirmación, el foco pasa a su título (el formulario ya no existe). */
function enfocar(nodo: HTMLElement | null) {
  nodo?.focus()
}

export function LibroReclamacionesPage() {
  const notificar = useNotificar()
  const [registrado, setRegistrado] = useState<(ReclamoRegistrado & { email: string }) | null>(null)
  // Cambia la key del formulario para empezar una hoja nueva y vacía.
  const [hoja, setHoja] = useState(0)
  const confirmacionId = useId()

  function handleEnviar(datos: DatosReclamo) {
    const registro = registrarReclamo(datos.tipo)
    setRegistrado({ ...registro, email: datos.email })
    notificar({
      tipo: 'exito',
      titulo: `Hoja ${registro.codigo} registrada`,
      detalle: `Te responderemos a ${datos.email} en un máximo de ${PLAZO_RESPUESTA_DIAS_HABILES} días hábiles.`,
    })
  }

  function handleErrores(cantidad: number) {
    notificar({
      tipo: 'error',
      titulo: 'Faltan datos en la hoja',
      detalle: cantidad === 1 ? 'Revisa el campo marcado en rojo.' : `Revisa los ${cantidad} campos marcados en rojo.`,
      reemplazar: true,
    })
  }

  function handleNuevaHoja() {
    flushSync(() => {
      setRegistrado(null)
      setHoja((actual) => actual + 1)
    })
    // La confirmación desaparece: el foco pasa al primer campo de la hoja nueva.
    document.querySelector<HTMLInputElement>('main [name="nombre"]')?.focus()
  }

  return (
    <>
      <title>Topitop | Libro de Reclamaciones</title>
      <PaginaTienda
        etiqueta="Libro de Reclamaciones"
        titulo="Hoja de reclamación virtual"
        bajada={`Conforme al Código de Protección y Defensa del Consumidor, respondemos en un máximo de ${PLAZO_RESPUESTA_DIAS_HABILES} días hábiles.`}
        ancho="angosto"
      >
        <p className="reclamo__aviso">
          <BookOpenTextIcon aria-hidden="true" />
          <span>
            Demostración del proyecto de tesis: la hoja no se envía a ningún servidor y tus datos personales no se
            guardan.
          </span>
        </p>

        {registrado ? (
          <section className="reclamo__confirmacion tarjeta-blanca" aria-labelledby={confirmacionId}>
            <CheckCircleIcon weight="fill" className="reclamo__check" aria-hidden="true" />
            <h2 id={confirmacionId} ref={enfocar} tabIndex={-1} className="reclamo__codigo">
              Hoja {registrado.codigo} registrada
            </h2>
            <p>
              Registramos tu {registrado.tipo}. Te enviaremos la respuesta a <strong>{registrado.email}</strong> en un
              máximo de {PLAZO_RESPUESTA_DIAS_HABILES} días hábiles. Guarda el código para cualquier consulta.
            </p>
            <button type="button" className="boton-secundario" onClick={handleNuevaHoja}>
              Registrar otra hoja
            </button>
          </section>
        ) : (
          <FormularioReclamo key={hoja} onEnviar={handleEnviar} onErrores={handleErrores} />
        )}
      </PaginaTienda>
    </>
  )
}
