import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { usePedidos } from '@/modules/pedidos/store/pedidos.store'
import { renderConTienda } from '@/test/renderConTienda'
import { useCarrito } from '../../store/carrito.store'
import { CarritoPage } from './CarritoPage'

const JEAN = { productoId: 'jean-clasico-azul', talla: '30', color: 'Azul' }
const POLO = { productoId: 'polo-clasico-blanco', talla: 'M', color: 'Blanco' }

function totales() {
  return within(screen.getByRole('complementary', { name: 'Resumen de compra' }))
}

describe('CarritoPage', () => {
  it('invita a comprar cuando el carrito está vacío', () => {
    renderConTienda(<CarritoPage />)

    expect(screen.getByRole('heading', { name: 'Tu carrito está vacío' })).toBeInTheDocument()
    expect(screen.getByText('Elige un regalo en la portada y aplica el cupón NAVIDADTOP aquí.')).toBeInTheDocument()
  })

  it('envuelve para regalo con una dedicatoria y lo confirma con un aviso', async () => {
    const usuario = userEvent.setup()
    useCarrito.getState().agregar(POLO)
    renderConTienda(<CarritoPage />)

    expect(screen.queryByRole('textbox', { name: /Dedicatoria/ })).not.toBeInTheDocument()
    await usuario.click(screen.getByRole('checkbox', { name: /Envolver para regalo/ }))

    expect(await screen.findByText('Lo envolvemos para regalo')).toBeInTheDocument()
    const dedicatoria = screen.getByRole('textbox', { name: 'Dedicatoria para la tarjeta (opcional)' })
    await usuario.type(dedicatoria, 'Feliz Navidad')

    expect(useCarrito.getState()).toMatchObject({ envolver: true, dedicatoria: 'Feliz Navidad' })
    expect(screen.getByText('Quedan 107 caracteres')).toBeInTheDocument()
    expect(dedicatoria).toHaveAccessibleDescription('Quedan 107 caracteres')

    await usuario.click(screen.getByRole('checkbox', { name: /Envolver para regalo/ }))
    expect(await screen.findByText('Sin envoltura de regalo')).toBeInTheDocument()
    expect(screen.queryByRole('textbox', { name: /Dedicatoria/ })).not.toBeInTheDocument()
  })

  it('cambia cantidades dentro de los límites y recalcula el total', async () => {
    const usuario = userEvent.setup()
    useCarrito.getState().agregar(POLO)
    renderConTienda(<CarritoPage />)

    const cantidad = screen.getByRole('group', { name: 'Cantidad de Polo clásico blanco' })
    const menos = within(cantidad).getByRole('button', { name: 'Quitar una unidad' })
    expect(menos).toHaveAttribute('aria-disabled', 'true')

    // En el límite no hace nada, pero conserva el foco (aria-disabled en vez de disabled).
    await usuario.click(menos)
    expect(within(cantidad).getByText('1')).toBeInTheDocument()
    expect(menos).toHaveFocus()

    await usuario.click(within(cantidad).getByRole('button', { name: 'Agregar una unidad' }))

    expect(within(cantidad).getByText('2')).toBeInTheDocument()
    expect(totales().getByText('Subtotal (2 prendas)')).toBeInTheDocument()
    expect(totales().getAllByText('S/. 59.8')).toHaveLength(2)
  })

  it('muestra cuánto falta para el regalo y celebra al alcanzarlo', () => {
    useCarrito.getState().agregar(POLO)
    const { unmount } = renderConTienda(<CarritoPage />)
    expect(screen.getByText('Te faltan S/. 169.1 para llevarte un regalo.')).toBeInTheDocument()
    unmount()

    useCarrito.getState().agregar(JEAN, 3)
    renderConTienda(<CarritoPage />)
    expect(screen.getByText('Ya ganaste el regalo de la campaña.')).toBeInTheDocument()
  })

  it('rechaza un cupón desconocido y aplica NAVIDADTOP', async () => {
    const usuario = userEvent.setup()
    useCarrito.getState().agregar(JEAN)
    renderConTienda(<CarritoPage />)
    const cupon = screen.getByRole('textbox', { name: 'Cupón de descuento' })

    await usuario.type(cupon, 'GRATIS')
    await usuario.click(screen.getByRole('button', { name: 'Aplicar' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Ese cupón no existe o ya venció')
    expect(cupon).toHaveAttribute('aria-invalid', 'true')

    expect(cupon).toHaveFocus()

    await usuario.clear(cupon)
    await usuario.type(cupon, 'navidadtop')
    await usuario.click(screen.getByRole('button', { name: 'Aplicar' }))
    expect(screen.getByRole('button', { name: 'Quitar cupón' })).toHaveFocus()

    expect(await screen.findByText('Cupón aplicado', { selector: 'strong' })).toBeInTheDocument()
    expect(screen.getByText('NAVIDADTOP', { selector: 'strong' })).toBeInTheDocument()
    expect(totales().getByText('− S/. 30')).toBeInTheDocument()
    expect(totales().getByText('S/. 69.9')).toBeInTheDocument()

    await usuario.click(screen.getByRole('button', { name: 'Quitar cupón' }))
    expect(screen.getByRole('textbox', { name: 'Cupón de descuento' })).toHaveFocus()
  })

  it('quita una prenda y lo avisa', async () => {
    const usuario = userEvent.setup()
    useCarrito.getState().agregar(POLO)
    useCarrito.getState().agregar(JEAN)
    renderConTienda(<CarritoPage />)

    await usuario.click(screen.getByRole('button', { name: 'Quitar Polo clásico blanco del carrito' }))

    expect(screen.queryByRole('heading', { name: 'Polo clásico blanco' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Quitar Jean clásico azul del carrito' })).toHaveFocus()
    expect(await screen.findByText('Prenda quitada')).toBeInTheDocument()
  })

  it('lleva el foco al título al quitar la última prenda', async () => {
    const usuario = userEvent.setup()
    useCarrito.getState().agregar(POLO)
    renderConTienda(<CarritoPage />)

    await usuario.click(screen.getByRole('button', { name: 'Quitar Polo clásico blanco del carrito' }))

    expect(screen.getByRole('heading', { level: 1, name: 'Tu carrito está vacío' })).toHaveFocus()
  })

  it('finaliza la compra simulada: registra el pedido, vacía el carrito y lleva al seguimiento', async () => {
    const usuario = userEvent.setup()
    useCarrito.getState().agregar(JEAN, 2)
    const { router } = renderConTienda(<CarritoPage />, { ruta: '/carrito' })

    await usuario.click(screen.getByRole('button', { name: 'Finalizar compra' }))

    const [pedido] = usePedidos.getState().pedidos
    expect(pedido).toMatchObject({ unidades: 2, total: 199.8, estado: 'confirmado' })
    await waitFor(() => expect(useCarrito.getState().items).toEqual([]))
    expect(router.state.location.pathname).toBe('/pedidos')
    expect(router.state.location.search).toBe(`?codigo=${pedido.codigo}`)
    expect(await screen.findByText(`Pedido ${pedido.codigo} registrado`)).toBeInTheDocument()
    expect(pedido.regalo).toBeUndefined()
  })

  it('el pedido guarda la envoltura y la dedicatoria sin espacios sobrantes', async () => {
    const usuario = userEvent.setup()
    useCarrito.getState().agregar(JEAN)
    useCarrito.getState().cambiarEnvoltura(true)
    useCarrito.getState().cambiarDedicatoria('  Para Ana  ')
    renderConTienda(<CarritoPage />, { ruta: '/carrito' })

    await usuario.click(screen.getByRole('button', { name: 'Finalizar compra' }))

    expect(usePedidos.getState().pedidos[0].regalo).toEqual({ dedicatoria: 'Para Ana' })
    expect(await screen.findByText('Va envuelto para regalo. Es una compra simulada: no se cobró nada.')).toBeInTheDocument()
    await waitFor(() => expect(useCarrito.getState()).toMatchObject({ envolver: false, dedicatoria: '' }))
  })
})
