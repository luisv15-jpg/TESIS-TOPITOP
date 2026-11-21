import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { routes } from './routes'

function renderRuta(ruta: string) {
  const router = createMemoryRouter(routes, { initialEntries: [ruta] })
  return render(<RouterProvider router={router} />)
}

describe('rutas de la tienda', () => {
  it('muestra la portada Navidad Top en /', async () => {
    renderRuta('/')

    expect(await screen.findByRole('heading', { level: 1, name: 'Navidad Top' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'NAVIDADTOP, copiar cupón' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Regalos por presupuesto' })).toBeInTheDocument()
  })

  it('abre la página de una categoría del menú con sus prendas', async () => {
    renderRuta('/denim')

    expect(await screen.findByRole('heading', { level: 1, name: 'Denim para regalar' })).toBeInTheDocument()
    expect(screen.getByRole('list', { name: 'Prendas de Denim' })).toBeInTheDocument()
  })

  it('muestra el 404 para una categoría que no existe', async () => {
    renderRuta('/zapatillas')

    expect(await screen.findByRole('heading', { name: 'No encontramos esta página' })).toBeInTheDocument()
  })

  it('muestra el 404 para rutas profundas desconocidas', async () => {
    renderRuta('/mujer/polos/rojo')

    expect(await screen.findByRole('heading', { name: 'No encontramos esta página' })).toBeInTheDocument()
  })

  it('repite la consulta en la página de búsqueda', async () => {
    renderRuta('/buscar?q=jean%20mom')

    expect(await screen.findByRole('heading', { name: 'Resultados para «jean mom»' })).toBeInTheDocument()
  })

  it('pide una consulta cuando la búsqueda llega vacía', async () => {
    renderRuta('/buscar')

    expect(await screen.findByRole('heading', { name: 'Busca una prenda' })).toBeInTheDocument()
  })

  it.each([
    ['/pedidos', '¿Dónde está mi pedido?'],
    ['/cuenta', 'Ingresa a tu cuenta'],
    ['/carrito', 'Tu carrito está vacío'],
    ['/ayuda/preguntas-frecuentes', 'Preguntas frecuentes'],
    ['/ayuda/cambios-y-devoluciones', 'Cambios y devoluciones'],
    ['/libro-de-reclamaciones', 'Hoja de reclamación virtual'],
  ])('responde en %s', async (ruta, titulo) => {
    renderRuta(ruta)

    expect(await screen.findByRole('heading', { name: titulo })).toBeInTheDocument()
  })

  it('muestra el 404 para un tema de ayuda que no existe', async () => {
    renderRuta('/ayuda/envios-a-marte')

    expect(await screen.findByRole('heading', { name: 'No encontramos esta página' })).toBeInTheDocument()
  })

  it('muestra el footer con los enlaces de ayuda en todas las páginas', async () => {
    renderRuta('/cuenta')

    const footer = await screen.findByRole('contentinfo')
    expect(footer).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /Libro de Reclamaciones/ })[0]).toHaveAttribute(
      'href',
      '/libro-de-reclamaciones',
    )
  })

  it('ofrece volver a la portada desde las páginas de aviso', async () => {
    renderRuta('/carrito')

    const volver = await screen.findByRole('link', { name: 'Volver al inicio' })
    expect(volver).toHaveAttribute('href', '/')
  })
})
