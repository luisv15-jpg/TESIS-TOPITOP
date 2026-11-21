import type { Campania } from '@/modules/promociones/types'
import { formatearSoles } from '@/shared/lib/formato'
import type { TemaAyuda } from '../types'

/*
  Textos de DEMOSTRACIÓN para el proyecto de tesis: no son las políticas reales de Topitop.
  Las cifras de la campaña salen de la campaña destacada para no repetirlas a mano.
*/
export function crearTemas(campania: Campania): readonly TemaAyuda[] {
  const cupon = campania.cupon.codigo
  const descuento = formatearSoles(campania.descuento.monto)
  const minimoRegalo = formatearSoles(campania.regalo.montoMinimo)

  return [
    {
      slug: 'preguntas-frecuentes',
      titulo: 'Preguntas frecuentes',
      bajada: 'Lo que más nos preguntan sobre compras, cupones y envíos.',
      preguntas: [
        {
          pregunta: `¿Cómo uso el cupón ${cupon}?`,
          respuesta: `Agrega tus prendas al carrito, escribe ${cupon} en «Cupón de descuento» y toca «Aplicar». Se descuentan ${descuento} del total.`,
        },
        {
          pregunta: '¿Cómo gano el regalo de la campaña?',
          respuesta: `Con compras desde ${minimoRegalo}. ${campania.regalo.texto}. En el carrito verás una barra que te dice cuánto te falta para ganarlo.`,
        },
        {
          pregunta: '¿Pueden envolverlo para regalo?',
          respuesta:
            'Sí, gratis. Marca «Envolver para regalo» en tu carrito y, si quieres, escribe una dedicatoria de hasta 120 caracteres para la tarjeta.',
        },
        {
          pregunta: '¿Cómo sigo mi pedido?',
          respuesta:
            'Al finalizar la compra te damos un código como TT-104832. Escríbelo en «Seguir mi pedido» y verás en qué paso va.',
        },
        {
          pregunta: '¿Cuánto demora el envío?',
          respuesta:
            'En Lima, de 2 a 4 días hábiles. En provincias, de 4 a 7 días hábiles desde que confirmamos el pago. Para que llegue antes de Nochebuena, pide hasta el 21 de diciembre en Lima o el 17 en provincias.',
        },
        {
          pregunta: '¿Qué medios de pago aceptan?',
          respuesta: 'Tarjetas Visa, Mastercard, American Express y Diners Club. En esta demostración no se cobra nada.',
        },
        {
          pregunta: '¿Dónde veo mis prendas favoritas?',
          respuesta: 'Toca el corazón de una prenda y luego entra a «Mi cuenta». Tus favoritos se guardan en este navegador.',
        },
      ],
    },
    {
      slug: 'cambios-y-devoluciones',
      titulo: 'Cambios y devoluciones',
      bajada: 'Si la talla no te quedó, la cambiamos.',
      secciones: [
        {
          titulo: 'Plazo',
          parrafos: [
            'Tienes 30 días calendario desde que recibes tu pedido para pedir un cambio o una devolución.',
            'Lo que compres para Navidad se puede cambiar hasta el 31 de enero, aunque hayan pasado más de 30 días.',
          ],
        },
        {
          titulo: 'Condiciones',
          parrafos: [
            'La prenda debe estar sin uso, con sus etiquetas y con el comprobante de compra.',
            'Por higiene, la ropa interior y los accesorios de baño no tienen cambio.',
          ],
        },
        {
          titulo: 'Cómo pedirlo',
          parrafos: [
            'Acércate a cualquier tienda Topitop con la prenda y tu código de pedido, o escríbenos desde el Libro de Reclamaciones si tuviste un problema con tu compra.',
          ],
        },
      ],
    },
    {
      slug: 'terminos-y-condiciones',
      titulo: 'Términos y condiciones',
      bajada: 'Reglas de uso de la tienda virtual.',
      secciones: [
        {
          titulo: 'Precios y promociones',
          parrafos: [
            'Los precios incluyen IGV. Las promociones tienen vigencia y stock limitados, y no se acumulan salvo que se indique.',
            `El cupón ${cupon} descuenta ${descuento} y se puede usar una vez por compra.`,
          ],
        },
        {
          titulo: 'Pedidos',
          parrafos: ['El pedido se confirma cuando validamos el pago. Te avisamos de cada cambio de estado.'],
        },
      ],
    },
    {
      slug: 'politica-de-privacidad',
      titulo: 'Política de privacidad',
      bajada: 'Cómo cuidamos tus datos.',
      secciones: [
        {
          titulo: 'En esta demostración',
          parrafos: [
            'No hay servidor: el carrito, los favoritos, los pedidos y la sesión de prueba se guardan solo en tu navegador.',
            'El Libro de Reclamaciones guarda únicamente el código de la hoja, no tus datos personales.',
            'La suscripción a cupones guarda una huella del correo para no repetirlo, no el correo.',
          ],
        },
        {
          titulo: 'Tus derechos',
          parrafos: [
            'Conforme a la Ley N.° 29733, de Protección de Datos Personales, puedes pedir acceso, rectificación, cancelación u oposición sobre tus datos.',
          ],
        },
      ],
    },
  ]
}
