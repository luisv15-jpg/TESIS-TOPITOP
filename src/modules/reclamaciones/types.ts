export type TipoDocumento = 'DNI' | 'CE'
export type TipoBien = 'producto' | 'servicio'
/** Reclamo: sobre el producto o servicio. Queja: sobre la atención recibida. */
export type TipoReclamacion = 'reclamo' | 'queja'

/** Hoja del Libro de Reclamaciones virtual (secciones del Anexo I del reglamento). */
export type DatosReclamo = {
  nombre: string
  domicilio: string
  tipoDocumento: TipoDocumento
  numeroDocumento: string
  celular: string
  email: string
  esMenor: boolean
  apoderado: string
  tipoBien: TipoBien
  codigoPedido: string
  monto: string
  descripcionBien: string
  tipo: TipoReclamacion
  detalle: string
  pedido: string
  acepta: boolean
}

export type CampoReclamo = keyof DatosReclamo
export type ErroresReclamo = Partial<Record<CampoReclamo, string>>

/** Lo único que se guarda: el código y la fecha, nunca los datos personales. */
export type ReclamoRegistrado = {
  codigo: string
  fecha: string
  tipo: TipoReclamacion
}
