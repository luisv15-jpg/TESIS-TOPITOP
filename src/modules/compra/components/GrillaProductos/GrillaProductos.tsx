import type { Producto } from '@/modules/catalogo/types'
import { TarjetaCompra } from '../TarjetaCompra/TarjetaCompra'
import './GrillaProductos.css'

type Props = {
  productos: readonly Producto[]
  /** Nombre de la lista para lectores de pantalla, por ejemplo «Resultados». */
  etiqueta: string
}

/** Grilla de tarjetas con compra rápida: búsqueda, favoritos y, luego, categorías. */
export function GrillaProductos({ productos, etiqueta }: Props) {
  return (
    <ul className="grilla-productos" aria-label={etiqueta}>
      {productos.map((producto) => (
        <li key={producto.id} className="grilla-productos__item">
          <TarjetaCompra producto={producto} />
        </li>
      ))}
    </ul>
  )
}
