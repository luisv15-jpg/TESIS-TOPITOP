import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { buscarProducto } from '@/modules/catalogo/services/productos.service'
import type { Producto } from '@/modules/catalogo/types'
import { formatearSoles } from '@/shared/lib/formato'
import { renderConTienda } from '@/test/renderConTienda'
import { TarjetaCompra } from './TarjetaCompra'

function producto(id: string): Producto {
  const encontrado = buscarProducto(id)
  if (!encontrado) throw new Error(`Falta el producto de prueba ${id}`)
  return encontrado
}

const vestido = producto('vestido-rojo-fiesta')
const polo = producto('polo-tejido-azul')

describe('TarjetaCompra', () => {
  it('muestra la línea de la marca, el nombre y los dos precios de una rebaja', () => {
    renderConTienda(<TarjetaCompra producto={vestido} />)
    const ficha = screen.getByRole('article', { name: vestido.nombre })

    expect(within(ficha).getByText('Topitop Mujer')).toBeInTheDocument()
    expect(within(ficha).getByRole('heading', { level: 3, name: vestido.nombre })).toBeInTheDocument()
    expect(within(ficha).getByText(formatearSoles(vestido.precio))).toBeInTheDocument()
    expect(within(ficha).getByText(formatearSoles(vestido.precioAntes ?? 0))).toBeInTheDocument()
  })

  it('dice el descuento y el sello en palabras, después del precio', () => {
    renderConTienda(<TarjetaCompra producto={vestido} />)
    const ficha = screen.getByRole('article', { name: vestido.nombre })

    const enPalabras = within(ficha).getByText(/^\d+ % de descuento\. Nochebuena$/)
    const precio = within(ficha).getByText(formatearSoles(vestido.precio))
    expect(precio.compareDocumentPosition(enPalabras) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('sin rebaja ni sello, la foto va limpia y no hay precio tachado', () => {
    renderConTienda(<TarjetaCompra producto={polo} />)
    const ficha = screen.getByRole('article', { name: polo.nombre })

    expect(within(ficha).queryByText(/% de descuento/)).not.toBeInTheDocument()
    expect(within(ficha).queryByText(/^-\d+%$/)).not.toBeInTheDocument()
    expect(within(ficha).queryByText('Antes')).not.toBeInTheDocument()
    expect(within(ficha).getByText('Topitop Hombre')).toBeInTheDocument()
  })

  it('un precio anterior que no es mayor no se muestra tachado', () => {
    renderConTienda(<TarjetaCompra producto={{ ...polo, precioAntes: polo.precio }} />)
    const ficha = screen.getByRole('article', { name: polo.nombre })

    expect(within(ficha).getAllByText(formatearSoles(polo.precio))).toHaveLength(1)
    expect(within(ficha).queryByText(/% de descuento/)).not.toBeInTheDocument()
  })
})
