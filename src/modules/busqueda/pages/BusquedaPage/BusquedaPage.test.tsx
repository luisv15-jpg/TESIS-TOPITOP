import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderConTienda } from '@/test/renderConTienda'
import { BusquedaPage } from './BusquedaPage'

describe('BusquedaPage', () => {
  it('lista las prendas que coinciden con la búsqueda', () => {
    renderConTienda(<BusquedaPage />, { ruta: '/buscar?q=polera' })

    expect(screen.getByRole('heading', { level: 1, name: 'Resultados para «polera»' })).toBeInTheDocument()
    expect(screen.getByText('2 prendas encontradas.')).toBeInTheDocument()
    const lista = screen.getByRole('list', { name: 'Resultados para polera' })
    expect(within(lista).getAllByRole('article')).toHaveLength(2)
  })

  it('usa el singular con un solo resultado', () => {
    renderConTienda(<BusquedaPage />, { ruta: '/buscar?q=casaca' })

    expect(screen.getByText('1 prenda encontrada.')).toBeInTheDocument()
  })

  it('sugiere búsquedas e ideas de regalo cuando no hay resultados', () => {
    renderConTienda(<BusquedaPage />, { ruta: '/buscar?q=zapatillas' })

    expect(screen.getByText(/No hay prendas con «zapatillas»/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Polo' })).toHaveAttribute('href', '/buscar?q=polo')
    expect(within(screen.getByRole('list', { name: 'Ideas de regalo' })).getAllByRole('article')).toHaveLength(4)
  })

  it('solo muestra sugerencias si la búsqueda llega vacía', () => {
    renderConTienda(<BusquedaPage />, { ruta: '/buscar' })

    expect(screen.getByRole('heading', { level: 1, name: 'Busca una prenda' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Prueba con' })).toBeInTheDocument()
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
  })
})
