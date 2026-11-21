import { useId } from 'react'
import { PrecioProducto } from '@/modules/catalogo/components/PrecioProducto/PrecioProducto'
import { lineaDeProducto, porcentajeDescuento } from '@/modules/catalogo/lib/ficha'
import type { Producto } from '@/modules/catalogo/types'
import { BotonFavorito } from '@/modules/favoritos/components/BotonFavorito/BotonFavorito'
import { CompraRapida } from '../CompraRapida/CompraRapida'
import './TarjetaCompra.css'

type Props = {
  producto: Producto
}

/** Ancho que ocupa la foto según la grilla: 2 columnas en celular, 3 en tablet, 4 en escritorio. */
const TAMANIOS_FOTO = '(min-width: 1280px) 300px, (min-width: 1100px) 25vw, (min-width: 840px) 33vw, 50vw'

/**
 * Ficha de producto para listados (portada, búsqueda, categorías), con el orden de topitop.pe:
 * la foto sobre gris con el sello negro del descuento, la línea de la marca, el nombre y los
 * precios a la derecha. Abajo, la compra rápida de la tienda.
 */
export function TarjetaCompra({ producto }: Props) {
  const nombreId = useId()
  const descuento = porcentajeDescuento(producto.precio, producto.precioAntes)
  // El tachado solo acompaña a una rebaja real: con datos inconsistentes no aparece suelto
  const precioAntes = descuento !== null ? producto.precioAntes : undefined
  const textoDescuento = descuento !== null ? `${descuento} % de descuento` : null
  const sellosEnPalabras = [textoDescuento, producto.etiqueta].filter(Boolean).join('. ')

  return (
    <article className="tarjeta-compra" aria-labelledby={nombreId}>
      <div className="tarjeta-compra__foto">
        <img
          src={producto.imagen.src}
          srcSet={producto.imagen.srcset}
          sizes={TAMANIOS_FOTO}
          alt={producto.imagen.alt}
          loading="lazy"
          width={800}
          height={1000}
        />
        {/* Sellos visuales; el lector de pantalla los oye después del precio */}
        {sellosEnPalabras && (
          <p className="tarjeta-compra__sellos" aria-hidden="true">
            {descuento !== null && <span className="tarjeta-compra__descuento">-{descuento}%</span>}
            {producto.etiqueta && <span className="tarjeta-compra__sello">{producto.etiqueta}</span>}
          </p>
        )}
        <BotonFavorito producto={producto} className="tarjeta-compra__favorito" />
      </div>
      <div className="tarjeta-compra__cuerpo">
        <div className="tarjeta-compra__cabeza">
          <p className="tarjeta-compra__linea">{lineaDeProducto(producto)}</p>
          <h3 id={nombreId} className="tarjeta-compra__nombre">
            {producto.nombre}
          </h3>
          <PrecioProducto precio={producto.precio} precioAntes={precioAntes} className="tarjeta-compra__precio" />
        </div>
        {sellosEnPalabras && <p className="sr-only">{sellosEnPalabras}</p>}
        <CompraRapida producto={producto} variante="compacta" />
      </div>
    </article>
  )
}
