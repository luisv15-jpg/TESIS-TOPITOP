import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider, useLocation } from 'react-router'
import { describe, expect, it } from 'vitest'
import { useCarrito } from '@/modules/carrito/store/carrito.store'
import { ID_RAIZ_APP } from '@/shared/lib/dom'
import { SiteHeader } from './SiteHeader'

function Ubicacion() {
  const { pathname, search } = useLocation()
  return <output aria-label="ubicación">{pathname + search}</output>
}

function renderHeader(rutaInicial = '/') {
  const router = createMemoryRouter(
    [
      {
        path: '*',
        element: (
          <>
            <SiteHeader />
            <Ubicacion />
          </>
        ),
      },
    ],
    { initialEntries: [rutaInicial] },
  )
  // Igual que en index.html: la app vive en #root y el Sidebar se monta fuera, en <body>.
  const raiz = document.body.appendChild(document.createElement('div'))
  raiz.id = ID_RAIZ_APP
  return render(<RouterProvider router={router} />, { container: raiz })
}

describe('SiteHeader', () => {
  it('enlaza el logo con la portada', () => {
    renderHeader()

    expect(screen.getByRole('link', { name: 'Topitop, ir al inicio' })).toHaveAttribute('href', '/')
  })

  it('lista las seis categorías con su ruta', () => {
    renderHeader()

    const nav = screen.getByRole('navigation', { name: 'Categorías' })
    const enlaces = within(nav).getAllByRole('link')
    expect(enlaces.map((enlace) => enlace.getAttribute('href'))).toEqual([
      '/mujer',
      '/hombre',
      '/infantil',
      '/denim',
      '/basico',
      '/outlet',
    ])
    expect(within(nav).getByRole('link', { name: 'Básico' })).toBeInTheDocument()
  })

  it('nombra los accesos de solo icono', () => {
    renderHeader()

    expect(screen.getByRole('link', { name: 'Seguir mi pedido' })).toHaveAttribute('href', '/pedidos')
    expect(screen.getByRole('link', { name: 'Mi cuenta' })).toHaveAttribute('href', '/cuenta')
    expect(screen.getByRole('link', { name: 'Carrito de compras' })).toHaveAttribute('href', '/carrito')
  })

  it('busca con el texto escrito, sin espacios sobrantes', async () => {
    const usuario = userEvent.setup()
    renderHeader()

    await usuario.type(screen.getByRole('searchbox', { name: 'Buscar productos' }), '  polo básico {enter}')

    expect(screen.getByLabelText('ubicación')).toHaveTextContent('/buscar?q=polo%20b%C3%A1sico')
  })

  it('no navega si la búsqueda está vacía', async () => {
    const usuario = userEvent.setup()
    renderHeader()

    await usuario.type(screen.getByRole('searchbox', { name: 'Buscar productos' }), '   {enter}')

    expect(screen.getByLabelText('ubicación')).toHaveTextContent(/^\/$/)
  })

  it('abre el menú móvil y lo cierra al elegir una categoría', async () => {
    const usuario = userEvent.setup()
    renderHeader()
    const boton = screen.getByRole('button', { name: 'Abrir menú' })
    expect(boton).toHaveAttribute('aria-expanded', 'false')

    await usuario.click(boton)

    const menu = await screen.findByRole('dialog', { name: 'Menú' })
    expect(menu).toHaveAttribute('aria-modal', 'true')
    expect(boton).toHaveAttribute('aria-expanded', 'true')
    await usuario.click(within(menu).getByRole('link', { name: 'Outlet' }))

    expect(screen.getByLabelText('ubicación')).toHaveTextContent('/outlet')
    await waitFor(() => expect(boton).toHaveAttribute('aria-expanded', 'false'))
  })

  it('deja inerte la app mientras el menú está abierto y, al cerrar con Escape, devuelve el foco', async () => {
    const usuario = userEvent.setup()
    renderHeader()
    const raiz = document.getElementById(ID_RAIZ_APP) as HTMLElement
    const boton = screen.getByRole('button', { name: 'Abrir menú' })

    await usuario.click(boton)
    await screen.findByRole('dialog', { name: 'Menú' })
    expect(raiz).toHaveAttribute('inert')

    await usuario.keyboard('{Escape}')

    await waitFor(() => expect(boton).toHaveAttribute('aria-expanded', 'false'))
    expect(raiz).not.toHaveAttribute('inert')
    expect(boton).toHaveFocus()
  })

  it('busca desde el menú móvil y lo cierra', async () => {
    const usuario = userEvent.setup()
    renderHeader()
    await usuario.click(screen.getByRole('button', { name: 'Abrir menú' }))
    const menu = await screen.findByRole('dialog', { name: 'Menú' })

    await usuario.type(within(menu).getByRole('searchbox', { name: 'Buscar productos' }), 'casaca{enter}')

    expect(screen.getByLabelText('ubicación')).toHaveTextContent('/buscar?q=casaca')
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Abrir menú' })).toHaveAttribute('aria-expanded', 'false'),
    )
  })

  it('muestra en el buscador la consulta de la URL cuando está en /buscar', () => {
    renderHeader('/buscar?q=jean')

    expect(screen.getByRole('searchbox', { name: 'Buscar productos' })).toHaveValue('jean')
  })

  it('deja el buscador vacío fuera de /buscar aunque la URL traiga q', () => {
    renderHeader('/mujer?q=jean')

    expect(screen.getByRole('searchbox', { name: 'Buscar productos' })).toHaveValue('')
  })

  it('muestra cuántas prendas hay en la bolsa y lo dice en su nombre', () => {
    useCarrito.getState().agregar({ productoId: 'polo-clasico-blanco', talla: 'M', color: 'Blanco' })
    const { unmount } = renderHeader()

    const bolsa = screen.getByRole('link', { name: 'Carrito de compras (1 prenda)' })
    expect(within(bolsa).getByText('1')).toHaveAttribute('aria-hidden', 'true')
    unmount()

    useCarrito.getState().agregar({ productoId: 'jean-clasico-azul', talla: '30', color: 'Azul' }, 10)
    renderHeader()
    expect(screen.getByRole('link', { name: 'Carrito de compras (11 prendas)' })).toHaveTextContent('9+')
  })

  it('no muestra contador con la bolsa vacía', () => {
    renderHeader()

    expect(screen.getByRole('link', { name: 'Carrito de compras' })).toHaveTextContent('')
  })
})
