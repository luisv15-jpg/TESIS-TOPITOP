import { useId, useState, type CSSProperties } from 'react'
import { HandbagIcon } from '@phosphor-icons/react'
import { Button } from 'primereact/button'
import { useAgregarAlCarrito } from '@/modules/carrito/hooks/useAgregarAlCarrito'
import { SelectorTalla } from '@/modules/catalogo/components/SelectorTalla/SelectorTalla'
import type { Producto } from '@/modules/catalogo/types'
import './CompraRapida.css'

type Props = {
  producto: Producto
  /** compacta: tarjetas de listado; amplia: el producto activo del carrusel. */
  variante?: 'compacta' | 'amplia'
}

/** Color, talla y «Agregar al carrito» de un producto. */
export function CompraRapida({ producto, variante = 'amplia' }: Props) {
  const agregarAlCarrito = useAgregarAlCarrito()
  const grupoColor = useId()
  const [talla, setTalla] = useState<string | null>(null)
  const [color, setColor] = useState(producto.colores[0].nombre)

  function handleAgregar() {
    if (agregarAlCarrito(producto, { talla, color })) setTalla(null)
  }

  return (
    <div className={`compra-rapida compra-rapida--${variante}`}>
      {producto.colores.length > 1 ? (
        // Radios nativos: Tab entra al grupo y las flechas cambian el color.
        <fieldset className="compra-rapida__colores">
          <legend className="compra-rapida__etiqueta">
            Color: <strong>{color}</strong>
          </legend>
          <div className="compra-rapida__muestras">
            {producto.colores.map((opcion) => (
              <label
                key={opcion.nombre}
                className="compra-rapida__muestra"
                style={{ '--muestra': opcion.hex } as CSSProperties}
              >
                <input
                  type="radio"
                  name={grupoColor}
                  value={opcion.nombre}
                  checked={opcion.nombre === color}
                  onChange={() => setColor(opcion.nombre)}
                  className="compra-rapida__radio"
                />
                <span className="sr-only">{opcion.nombre}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : (
        <p className="compra-rapida__etiqueta">
          Color: <strong>{color}</strong>
        </p>
      )}

      <SelectorTalla tallas={producto.tallas} valor={talla} onCambiar={setTalla} />

      <Button
        type="button"
        className="compra-rapida__agregar"
        icon={<HandbagIcon weight="bold" aria-hidden="true" />}
        onClick={handleAgregar}
      >
        {/* En tarjetas angostas «al carrito» se oculta a la vista, no a los lectores de pantalla. */}
        <span className="compra-rapida__texto">
          Agregar <span className="compra-rapida__texto-extra">al carrito</span>
        </span>
      </Button>
    </div>
  )
}
