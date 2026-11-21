import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { useFavoritos } from '@/modules/favoritos/store/favoritos.store'
import { usePedidos } from '@/modules/pedidos/store/pedidos.store'
import { renderConTienda } from '@/test/renderConTienda'
import { useSesion } from '../../store/sesion.store'
import { CuentaPage } from './CuentaPage'

describe('CuentaPage', () => {
  it('marca los errores del ingreso y lleva el foco al primero', async () => {
    const usuario = userEvent.setup()
    renderConTienda(<CuentaPage />)

    await usuario.click(screen.getByRole('button', { name: 'Ingresar' }))

    const correo = screen.getByRole('textbox', { name: /Correo/ })
    expect(correo).toHaveFocus()
    expect(correo).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Escribe tu correo.')).toBeInTheDocument()
    expect(screen.getByText('Escribe tu contraseña.')).toBeInTheDocument()
  })

  it('muestra u oculta la contraseña', async () => {
    const usuario = userEvent.setup()
    renderConTienda(<CuentaPage />)
    const contrasenia = screen.getByLabelText(/^Contraseña/)

    expect(contrasenia).toHaveAttribute('type', 'password')
    await usuario.click(screen.getByRole('button', { name: 'Mostrar contraseña' }))
    expect(contrasenia).toHaveAttribute('type', 'text')
    expect(screen.getByRole('button', { name: 'Ocultar contraseña' })).toBeInTheDocument()
  })

  it('cuenta los favoritos guardados antes de ingresar', () => {
    useFavoritos.getState().alternar('polo-clasico-blanco')
    renderConTienda(<CuentaPage />)

    expect(screen.getByText('Ingresa para ver tus 1 favorito y tus pedidos.')).toBeInTheDocument()
  })

  it('ingresa, saluda y muestra favoritos y pedidos; luego cierra la sesión', async () => {
    const usuario = userEvent.setup()
    useFavoritos.getState().alternar('polo-clasico-blanco')
    const pedido = usePedidos.getState().registrar({ unidades: 2, total: 59.8 })
    renderConTienda(<CuentaPage />)

    await usuario.type(screen.getByRole('textbox', { name: /Correo/ }), 'ana.perez@correo.pe')
    await usuario.type(screen.getByLabelText(/^Contraseña/), 'secreto1')
    await usuario.click(screen.getByRole('button', { name: 'Ingresar' }))

    expect(screen.getByRole('heading', { level: 1, name: 'Hola, Ana' })).toHaveFocus()
    expect(await screen.findByText('Ingresaste a tu cuenta de prueba. Tu contraseña no se guarda.')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Tus favoritos (1)' })).toBeInTheDocument()
    const tarjeta = screen.getByRole('article', { name: 'Polo clásico blanco' })
    // Quitar el corazón no saca la tarjeta: el foco sigue en el botón.
    const corazon = within(tarjeta).getByRole('button', { name: /favoritos/ })
    await usuario.click(corazon)
    expect(corazon).toHaveFocus()
    expect(screen.getByRole('heading', { name: 'Tus favoritos (0)' })).toBeInTheDocument()
    await usuario.click(corazon)
    expect(screen.getByText(pedido.codigo)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Seguir pedido' })).toHaveAttribute('href', `/pedidos?codigo=${pedido.codigo}`)

    await usuario.click(screen.getByRole('button', { name: 'Cerrar sesión' }))

    expect(useSesion.getState().usuario).toBeNull()
    expect(screen.getByRole('heading', { level: 1, name: 'Ingresa a tu cuenta' })).toHaveFocus()
    expect(await screen.findByText('Sesión cerrada')).toBeInTheDocument()
  })

  it('explica cómo llenar los favoritos y los pedidos cuando están vacíos', () => {
    useSesion.getState().iniciar('luis@correo.pe')
    renderConTienda(<CuentaPage />)

    expect(screen.getByText(/Toca el corazón de una prenda/)).toBeInTheDocument()
    expect(screen.getByText(/Aún no compras en esta demostración/)).toBeInTheDocument()
  })
})
