import { FacebookLogoIcon, InstagramLogoIcon, TiktokLogoIcon, YoutubeLogoIcon, type Icon } from '@phosphor-icons/react'
import amex from '@/shared/assets/pagos/amex.svg'
import dinersclub from '@/shared/assets/pagos/dinersclub.svg'
import mastercard from '@/shared/assets/pagos/mastercard.svg'
import visa from '@/shared/assets/pagos/visa.svg'

export type EnlaceFooter = { etiqueta: string; ruta: string }
export type ColumnaFooter = { titulo: string; enlaces: readonly EnlaceFooter[] }

/** Columnas de ayuda y empresa; la de compra se arma con las categorías del catálogo. */
export const COLUMNAS_FOOTER: readonly ColumnaFooter[] = Object.freeze([
  {
    titulo: 'Ayuda',
    enlaces: [
      { etiqueta: 'Seguir mi pedido', ruta: '/pedidos' },
      { etiqueta: 'Preguntas frecuentes', ruta: '/ayuda/preguntas-frecuentes' },
      { etiqueta: 'Cambios y devoluciones', ruta: '/ayuda/cambios-y-devoluciones' },
      { etiqueta: 'Mi cuenta', ruta: '/cuenta' },
    ],
  },
  {
    titulo: 'Legal',
    enlaces: [
      { etiqueta: 'Términos y condiciones', ruta: '/ayuda/terminos-y-condiciones' },
      { etiqueta: 'Política de privacidad', ruta: '/ayuda/politica-de-privacidad' },
      { etiqueta: 'Libro de Reclamaciones', ruta: '/libro-de-reclamaciones' },
    ],
  },
])

export type RedSocial = { nombre: string; url: string; Icono: Icon }

/** Perfiles oficiales enlazados desde topitop.pe. */
export const REDES_SOCIALES: readonly RedSocial[] = Object.freeze([
  { nombre: 'Instagram', url: 'https://www.instagram.com/topitop_pe/', Icono: InstagramLogoIcon },
  { nombre: 'Facebook', url: 'https://www.facebook.com/Topitop.peru/', Icono: FacebookLogoIcon },
  { nombre: 'TikTok', url: 'https://www.tiktok.com/@topitop.pe', Icono: TiktokLogoIcon },
  { nombre: 'YouTube', url: 'https://www.youtube.com/user/TopiTopPeru', Icono: YoutubeLogoIcon },
])

/** Logos reales a color (Gil Barbara, CC0), servidos desde el propio sitio. ancho: a 24 px de alto. */
export const MEDIOS_DE_PAGO = Object.freeze([
  { nombre: 'Visa', src: visa, ancho: 74 },
  { nombre: 'Mastercard', src: mastercard, ancho: 31 },
  { nombre: 'American Express', src: amex, ancho: 24 },
  { nombre: 'Diners Club', src: dinersclub, ancho: 92 },
])
