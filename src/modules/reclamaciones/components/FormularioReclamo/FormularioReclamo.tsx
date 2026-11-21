import { useId, useState, type FormEvent } from 'react'
import { flushSync } from 'react-dom'
import { CampoTexto } from '@/shared/components/CampoTexto/CampoTexto'
import { GrupoOpciones } from '@/shared/components/GrupoOpciones/GrupoOpciones'
import { LIMITES_RECLAMO, leerReclamo, primerCampoConError, validarReclamo } from '../../lib/reclamo'
import type { DatosReclamo, ErroresReclamo, TipoDocumento } from '../../types'

type Props = {
  /** Se llama solo con una hoja válida. */
  onEnviar: (datos: DatosReclamo) => void
  /** Se llama cuando la hoja tiene errores, con la cantidad encontrada. */
  onErrores: (cantidad: number) => void
}

const DOCUMENTOS = [
  { valor: 'DNI', etiqueta: 'DNI' },
  { valor: 'CE', etiqueta: 'Carné de extranjería' },
] as const

/** Las cuatro secciones de la hoja de reclamación virtual. */
export function FormularioReclamo({ onEnviar, onErrores }: Props) {
  const [errores, setErrores] = useState<ErroresReclamo>({})
  const [esMenor, setEsMenor] = useState(false)
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento>('DNI')
  const aceptaErrorId = useId()

  function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const formulario = evento.currentTarget
    const datos = leerReclamo(new FormData(formulario))
    const encontrados = validarReclamo(datos)
    // flushSync: el campo ya tiene aria-invalid y su error enlazado cuando recibe el foco.
    flushSync(() => setErrores(encontrados))

    const primero = primerCampoConError(encontrados)
    if (primero) {
      formulario.querySelector<HTMLElement>(`[name="${primero}"]`)?.focus()
      onErrores(Object.keys(encontrados).length)
      return
    }
    onEnviar(datos)
  }

  return (
    <form className="reclamo__formulario" onSubmit={handleSubmit} noValidate>
      <fieldset className="campo__grupo tarjeta-blanca">
        <legend className="campo__leyenda">1. Tus datos</legend>
        <CampoTexto etiqueta="Nombre completo" nombre="nombre" autoComplete="name" maxLength={120} requerido error={errores.nombre} />
        <CampoTexto etiqueta="Domicilio" nombre="domicilio" autoComplete="street-address" maxLength={160} requerido error={errores.domicilio} />
        <GrupoOpciones
          leyenda="Documento de identidad"
          nombre="tipoDocumento"
          opciones={DOCUMENTOS}
          valorInicial="DNI"
          onCambio={(valor) => setTipoDocumento(valor === 'CE' ? 'CE' : 'DNI')}
        />
        <CampoTexto
          etiqueta={tipoDocumento === 'DNI' ? 'Número de DNI' : 'Número de carné de extranjería'}
          nombre="numeroDocumento"
          inputMode={tipoDocumento === 'DNI' ? 'numeric' : 'text'}
          maxLength={12}
          requerido
          error={errores.numeroDocumento}
        />
        <div className="reclamo__par">
          <CampoTexto etiqueta="Celular" nombre="celular" tipo="tel" inputMode="tel" autoComplete="tel-national" maxLength={11} requerido error={errores.celular} />
          <CampoTexto etiqueta="Correo" nombre="email" tipo="email" inputMode="email" autoComplete="email" maxLength={120} requerido error={errores.email} />
        </div>
        <label className="campo__opcion">
          <input type="checkbox" name="esMenor" value="si" checked={esMenor} onChange={(evento) => setEsMenor(evento.target.checked)} />
          Soy menor de edad
        </label>
        {esMenor && (
          <CampoTexto etiqueta="Nombre de tu padre, madre o apoderado" nombre="apoderado" maxLength={120} requerido error={errores.apoderado} />
        )}
      </fieldset>

      <fieldset className="campo__grupo tarjeta-blanca">
        <legend className="campo__leyenda">2. Lo que compraste</legend>
        <GrupoOpciones
          leyenda="¿Es un producto o un servicio?"
          nombre="tipoBien"
          opciones={[
            { valor: 'producto', etiqueta: 'Producto' },
            { valor: 'servicio', etiqueta: 'Servicio' },
          ]}
          valorInicial="producto"
        />
        <div className="reclamo__par">
          <CampoTexto etiqueta="Código de pedido" nombre="codigoPedido" autoComplete="off" maxLength={12} ayuda="Opcional. Ejemplo: TT-104832." />
          <CampoTexto etiqueta="Monto reclamado (S/.)" nombre="monto" inputMode="decimal" maxLength={9} ayuda="Opcional." error={errores.monto} />
        </div>
        <CampoTexto etiqueta="Descripción del producto o servicio" nombre="descripcionBien" maxLength={160} requerido error={errores.descripcionBien} />
      </fieldset>

      <fieldset className="campo__grupo tarjeta-blanca">
        <legend className="campo__leyenda">3. Tu reclamo</legend>
        <GrupoOpciones
          leyenda="Tipo"
          nombre="tipo"
          ayuda="Reclamo: no estás conforme con el producto o servicio. Queja: no estás conforme con la atención."
          opciones={[
            { valor: 'reclamo', etiqueta: 'Reclamo' },
            { valor: 'queja', etiqueta: 'Queja' },
          ]}
          valorInicial="reclamo"
        />
        <CampoTexto etiqueta="¿Qué pasó?" nombre="detalle" multilinea maxLength={LIMITES_RECLAMO.detalleMax} requerido error={errores.detalle} />
        <CampoTexto etiqueta="¿Qué solución esperas?" nombre="pedido" multilinea maxLength={LIMITES_RECLAMO.pedidoMax} requerido error={errores.pedido} />
      </fieldset>

      <div className="reclamo__envio tarjeta-blanca">
        <label className="campo__opcion reclamo__acepta">
          <input
            type="checkbox"
            name="acepta"
            value="si"
            aria-invalid={errores.acepta ? true : undefined}
            aria-describedby={errores.acepta ? aceptaErrorId : undefined}
          />
          Declaro que los datos de esta hoja son verdaderos.
        </label>
        {errores.acepta && (
          <p id={aceptaErrorId} className="campo__error">
            {errores.acepta}
          </p>
        )}
        <button type="submit" className="boton-primario">
          Enviar hoja de reclamación
        </button>
      </div>
    </form>
  )
}
