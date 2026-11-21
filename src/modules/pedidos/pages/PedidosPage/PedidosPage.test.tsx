import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderConTienda } from '@/test/renderConTienda'
import { usePedidos } from '../../store/pedidos.store'
import { PedidosPage } from './PedidosPage'

function campoCodigo() {
  return screen.getByRole('textbox', { name: 'Código de pedido' })
}

describe('PedidosPage', () => {
  it('muestra el pedido del código que llega en la URL con sus pasos', () => {
    renderConTienda(<PedidosPage />, { ruta: '/pedidos?codigo=TT-104832' })

    expect(screen.getByRole('heading', { level: 2, name: 'TT-104832' })).toBeInTheDocument()
    expect(campoCodigo()).toHaveValue('TT-104832')
    const actual = screen.getByText('En camino').closest('li')
    expect(actual).toHaveAttribute('aria-current', 'step')
    expect(screen.getByText('S/. 189.7')).toBeInTheDocument()
  })

  it('busca un código escrito en minúsculas y lo guarda en la URL', async () => {
    const usuario = userEvent.setup()
    const { router } = renderConTienda(<PedidosPage />, { ruta: '/pedidos' })

    await usuario.type(campoCodigo(), 'tt-209415')
    await usuario.click(screen.getByRole('button', { name: 'Buscar' }))

    expect(router.state.location.search).toBe('?codigo=TT-209415')
    expect(await screen.findByRole('heading', { level: 2, name: 'TT-209415' })).toBeInTheDocument()
  })

  it('pide el código si se busca vacío y explica la forma si está mal escrito', async () => {
    const usuario = userEvent.setup()
    renderConTienda(<PedidosPage />, { ruta: '/pedidos' })

    await usuario.click(screen.getByRole('button', { name: 'Buscar' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Escribe el código de tu pedido.')
    expect(campoCodigo()).toHaveAttribute('aria-invalid', 'true')
    expect(campoCodigo()).toHaveFocus()

    await usuario.type(campoCodigo(), '12345')
    await usuario.click(screen.getByRole('button', { name: 'Buscar' }))
    expect(screen.getByText(/forma TT-123456/)).toBeInTheDocument()
  })

  it('avisa cuando el código no existe', async () => {
    const usuario = userEvent.setup()
    renderConTienda(<PedidosPage />, { ruta: '/pedidos' })

    await usuario.type(campoCodigo(), 'TT-000001')
    await usuario.click(screen.getByRole('button', { name: 'Buscar' }))

    expect(await screen.findByText('No encontramos ese pedido')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'No encontramos el pedido TT-000001' })).toBeInTheDocument()
  })

  it('ofrece los pedidos propios y los de prueba como atajos', async () => {
    const usuario = userEvent.setup()
    const propio = usePedidos.getState().registrar({ unidades: 1, total: 29.9 })
    const { router } = renderConTienda(<PedidosPage />, { ruta: '/pedidos' })

    expect(screen.getByRole('heading', { name: 'Tus pedidos y los de prueba' })).toBeInTheDocument()
    await usuario.click(screen.getByRole('link', { name: propio.codigo }))

    expect(router.state.location.search).toBe(`?codigo=${propio.codigo}`)
    expect(await screen.findByText('Pedido confirmado')).toBeInTheDocument()
  })

  it('sigue a la URL al volver atrás sin perder el foco del botón', async () => {
    const usuario = userEvent.setup()
    const { router } = renderConTienda(<PedidosPage />, { ruta: '/pedidos?codigo=TT-104832' })

    await usuario.clear(campoCodigo())
    await usuario.type(campoCodigo(), 'TT-209415')
    const buscar = screen.getByRole('button', { name: 'Buscar' })
    await usuario.click(buscar)
    expect(buscar).toHaveFocus()

    await act(() => router.navigate(-1))

    expect(campoCodigo()).toHaveValue('TT-104832')
  })
})
