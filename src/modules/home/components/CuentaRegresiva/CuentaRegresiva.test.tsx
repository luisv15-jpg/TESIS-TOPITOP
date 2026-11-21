import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CuentaRegresiva } from './CuentaRegresiva'

function renderEl(dia: Date) {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(dia)
  return render(<CuentaRegresiva idRegalos="regalos" />)
}

describe('CuentaRegresiva', () => {
  it('cuenta los días que faltan y da las fechas límite de envío', () => {
    renderEl(new Date(2026, 10, 20, 10))

    expect(screen.getByRole('heading', { level: 2, name: '35 días para Navidad' })).toBeInTheDocument()
    expect(
      screen.getByText(
        'Pide hasta el 17 de diciembre en provincias y hasta el 21 de diciembre en Lima: tu regalo llega antes de Nochebuena.',
      ),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Elegir un regalo' })).toHaveAttribute('href', '#regalos')
  })

  it('usa el singular la víspera y ofrece el recojo cuando ya no llega el envío', () => {
    renderEl(new Date(2026, 11, 24, 9))

    expect(screen.getByRole('heading', { level: 2, name: '1 día para Navidad' })).toBeInTheDocument()
    expect(screen.getByText(/recoger tu pedido en tienda hasta el 24 de diciembre/)).toBeInTheDocument()
  })

  it('después del límite de provincias avisa que en Lima todavía llega', () => {
    renderEl(new Date(2026, 11, 19))

    expect(screen.getByText('En Lima todavía llega a tiempo: pide hasta el 21 de diciembre.')).toBeInTheDocument()
  })

  it('el 25 saluda y recuerda el plazo de cambios', () => {
    renderEl(new Date(2026, 11, 25, 12))

    expect(screen.getByRole('heading', { level: 2, name: '¡Feliz Navidad!' })).toBeInTheDocument()
    expect(screen.getByText(/Los cambios van hasta el 31 de enero/)).toBeInTheDocument()
  })
})
