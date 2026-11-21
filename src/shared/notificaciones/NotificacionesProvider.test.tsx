import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderConTienda } from '@/test/renderConTienda'
import { useNotificar, type Notificacion } from './contexto'

function Disparador({ aviso }: { aviso: Notificacion }) {
  const notificar = useNotificar()
  return (
    <button type="button" onClick={() => notificar(aviso)}>
      Avisar
    </button>
  )
}

describe('NotificacionesProvider', () => {
  it('muestra el título, el detalle y el enlace de la acción', async () => {
    const usuario = userEvent.setup()
    renderConTienda(
      <Disparador
        aviso={{ tipo: 'exito', titulo: 'Agregado al carrito', detalle: 'Polo · talla M', accion: { etiqueta: 'Ver carrito', ruta: '/carrito' } }}
      />,
    )

    await usuario.click(screen.getByRole('button', { name: 'Avisar' }))

    expect(await screen.findByText('Agregado al carrito')).toBeInTheDocument()
    expect(screen.getByText('Polo · talla M')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver carrito' })).toHaveAttribute('href', '/carrito')
    expect(screen.getByRole('button', { name: 'Cerrar aviso' })).toBeInTheDocument()
  })

  it('apila los avisos normales', async () => {
    const usuario = userEvent.setup()
    renderConTienda(<Disparador aviso={{ tipo: 'info', titulo: 'Hola' }} />)
    const boton = screen.getByRole('button', { name: 'Avisar' })

    await usuario.click(boton)
    await usuario.click(boton)

    expect(await screen.findAllByText('Hola')).toHaveLength(2)
  })

  it('reemplaza los avisos que piden reemplazar', async () => {
    const usuario = userEvent.setup()
    renderConTienda(<Disparador aviso={{ tipo: 'aviso', titulo: 'Elige una talla', reemplazar: true }} />)
    const boton = screen.getByRole('button', { name: 'Avisar' })

    await usuario.click(boton)
    await screen.findByText('Elige una talla')
    await usuario.click(boton)

    await waitFor(() => expect(screen.getAllByText('Elige una talla')).toHaveLength(1))
  })

  it('falla con un mensaje claro si se usa fuera del proveedor', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)

    expect(() => render(<Disparador aviso={{ tipo: 'error', titulo: 'x' }} />)).toThrow(
      'useNotificar debe usarse dentro de <NotificacionesProvider>',
    )
  })
})
