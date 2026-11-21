import { esCelularValido, esDocumentoValido, esEmailValido } from '@/shared/lib/validacion'
import type { DatosReclamo, ErroresReclamo, TipoBien, TipoDocumento, TipoReclamacion } from '../types'

export const LIMITES_RECLAMO = Object.freeze({
  detalleMin: 20,
  detalleMax: 1000,
  pedidoMax: 500,
  montoMax: 99999,
})

/** Orden de los campos en pantalla: el foco va al primero con error. */
export const ORDEN_CAMPOS: readonly (keyof DatosReclamo)[] = Object.freeze([
  'nombre',
  'domicilio',
  'numeroDocumento',
  'celular',
  'email',
  'apoderado',
  'descripcionBien',
  'monto',
  'detalle',
  'pedido',
  'acepta',
])

function texto(datos: FormData, campo: string): string {
  return String(datos.get(campo) ?? '').trim()
}

function opcion<T extends string>(valor: string, permitidas: readonly T[], porDefecto: T): T {
  return (permitidas as readonly string[]).includes(valor) ? (valor as T) : porDefecto
}

/** Convierte el formulario en datos tipados; las opciones desconocidas toman el valor por defecto. */
export function leerReclamo(datos: FormData): DatosReclamo {
  return {
    nombre: texto(datos, 'nombre'),
    domicilio: texto(datos, 'domicilio'),
    tipoDocumento: opcion<TipoDocumento>(texto(datos, 'tipoDocumento'), ['DNI', 'CE'], 'DNI'),
    numeroDocumento: texto(datos, 'numeroDocumento'),
    celular: texto(datos, 'celular'),
    email: texto(datos, 'email'),
    esMenor: datos.get('esMenor') === 'si',
    apoderado: texto(datos, 'apoderado'),
    tipoBien: opcion<TipoBien>(texto(datos, 'tipoBien'), ['producto', 'servicio'], 'producto'),
    codigoPedido: texto(datos, 'codigoPedido').toUpperCase(),
    monto: texto(datos, 'monto'),
    descripcionBien: texto(datos, 'descripcionBien'),
    tipo: opcion<TipoReclamacion>(texto(datos, 'tipo'), ['reclamo', 'queja'], 'reclamo'),
    detalle: texto(datos, 'detalle'),
    pedido: texto(datos, 'pedido'),
    acepta: datos.get('acepta') === 'si',
  }
}

function validarMonto(monto: string): string | undefined {
  if (!monto) return undefined
  if (!/^\d+(\.\d{1,2})?$/.test(monto)) return 'Escribe el monto solo con números, por ejemplo 79.90.'
  if (Number(monto) > LIMITES_RECLAMO.montoMax) return 'Revisa el monto: parece demasiado alto.'
  return undefined
}

function validarDetalle(detalle: string): string | undefined {
  if (!detalle) return 'Cuéntanos qué pasó.'
  if (detalle.length < LIMITES_RECLAMO.detalleMin)
    return `Danos un poco más de detalle (al menos ${LIMITES_RECLAMO.detalleMin} caracteres).`
  if (detalle.length > LIMITES_RECLAMO.detalleMax) return `Usa como máximo ${LIMITES_RECLAMO.detalleMax} caracteres.`
  return undefined
}

/** Reglas del formulario. Devuelve un objeto vacío si la hoja está completa. */
export function validarReclamo(datos: DatosReclamo): ErroresReclamo {
  const documento =
    datos.tipoDocumento === 'DNI' ? 'El DNI tiene 8 cifras.' : 'El carné de extranjería tiene de 9 a 12 caracteres.'

  const errores: ErroresReclamo = {
    nombre: datos.nombre.length < 3 ? 'Escribe tu nombre completo.' : undefined,
    domicilio: datos.domicilio.length < 5 ? 'Escribe tu domicilio.' : undefined,
    numeroDocumento: esDocumentoValido(datos.tipoDocumento, datos.numeroDocumento) ? undefined : documento,
    celular: esCelularValido(datos.celular) ? undefined : 'El celular tiene 9 cifras y empieza con 9.',
    email: esEmailValido(datos.email) ? undefined : 'Revisa el correo: ahí te enviaremos la respuesta.',
    apoderado:
      datos.esMenor && datos.apoderado.length < 3 ? 'Escribe el nombre de tu padre, madre o apoderado.' : undefined,
    descripcionBien: datos.descripcionBien ? undefined : 'Indica qué producto o servicio reclamas.',
    monto: validarMonto(datos.monto),
    detalle: validarDetalle(datos.detalle),
    pedido:
      datos.pedido.length === 0
        ? 'Indica qué solución esperas.'
        : datos.pedido.length > LIMITES_RECLAMO.pedidoMax
          ? `Usa como máximo ${LIMITES_RECLAMO.pedidoMax} caracteres.`
          : undefined,
    acepta: datos.acepta ? undefined : 'Confirma que los datos son verdaderos para enviar la hoja.',
  }

  return Object.fromEntries(Object.entries(errores).filter(([, mensaje]) => mensaje)) as ErroresReclamo
}

/** Primer campo con error según el orden visual, para llevarle el foco. */
export function primerCampoConError(errores: ErroresReclamo): keyof DatosReclamo | undefined {
  return ORDEN_CAMPOS.find((campo) => errores[campo])
}
