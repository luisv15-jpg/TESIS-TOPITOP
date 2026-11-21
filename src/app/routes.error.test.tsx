import { render, screen, within } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { routes } from './routes'

// Simula datos de prueba rotos: ninguna campaña destacada.
vi.mock('@/modules/promociones/services/campanias.service', () => ({
  buscarCampaniaDestacada: () => undefined,
  obtenerCampaniaDestacada: () => {
    throw new Error('No hay ninguna campaña destacada en los datos de prueba')
  },
}))

describe('error dentro de una página', () => {
  it('muestra el aviso de error sin perder el encabezado de la tienda', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const router = createMemoryRouter(routes, { initialEntries: ['/'] })

    render(<RouterProvider router={router} />)

    expect(await screen.findByRole('heading', { name: 'Algo salió mal al cargar la página' })).toBeInTheDocument()
    expect(within(screen.getByRole('banner')).getByRole('link', { name: 'Topitop, ir al inicio' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Categorías' })).toBeInTheDocument()
    // La barra de avisos sigue en pie, con su mensaje neutro y la ayuda
    expect(screen.getByText('Moda peruana para todos los días')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Atención al cliente' })).toBeInTheDocument()
  })
})
