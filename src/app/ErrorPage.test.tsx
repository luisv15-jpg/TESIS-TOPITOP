import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { ErrorPage } from './ErrorPage'

function renderConFallo(fallo: () => never) {
  const router = createMemoryRouter([{ path: '/', ErrorBoundary: ErrorPage, loader: fallo, Component: () => null }])
  return render(<RouterProvider router={router} />)
}

describe('ErrorPage', () => {
  it('muestra el código cuando el router recibe una respuesta de error', async () => {
    renderConFallo(() => {
      throw new Response('Servicio no disponible', { status: 503 })
    })

    expect(await screen.findByText('Error 503')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Algo salió mal al cargar la página' })).toBeInTheDocument()
  })

  it('muestra un aviso genérico ante una excepción', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    renderConFallo(() => {
      throw new Error('fallo inesperado')
    })

    expect(await screen.findByText('Error')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Volver al inicio' })).toHaveAttribute('href', '/')
  })
})
