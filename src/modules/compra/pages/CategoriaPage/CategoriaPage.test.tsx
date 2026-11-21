import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { listarPorCategoria } from '@/modules/catalogo/services/productos.service'
import { renderConTienda } from '@/test/renderConTienda'
import { CategoriaPage } from './CategoriaPage'

function renderCategoria(ruta: string) {
  return renderConTienda(<CategoriaPage />, { ruta, patron: '/:slug' })
}

function nombresVisibles(nombreLista: string): string[] {
  return within(screen.getByRole('list', { name: nombreLista }))
    .getAllByRole('article')
    .map((tarjeta) => within(tarjeta).getByRole('heading', { level: 3 }).textContent ?? '')
}

function precioDe(nombre: string): number {
  return listarPorCategoria('hombre').find((p) => p.nombre === nombre)?.precio ?? NaN
}

describe('CategoriaPage', () => {
  it('muestra el rótulo navideño de la categoría y todas sus prendas', () => {
    renderCategoria('/hombre')

    expect(screen.getByRole('heading', { level: 1, name: 'Regalos para él' })).toBeInTheDocument()
    expect(nombresVisibles('Prendas de Hombre')).toHaveLength(listarPorCategoria('hombre').length)
    expect(screen.getByRole('radio', { name: 'Todos' })).toBeChecked()
  })

  it('filtra por presupuesto y guarda el filtro en la URL', async () => {
    const usuario = userEvent.setup()
    const { router } = renderCategoria('/hombre')

    await usuario.click(screen.getByRole('radio', { name: 'S/. 50 a S/. 99' }))

    expect(router.state.location.search).toBe('?presupuesto=de-50-a-99')
    const precios = nombresVisibles('Prendas de Hombre').map(precioDe)
    expect(precios.every((precio) => precio >= 50 && precio < 100)).toBe(true)
    expect(screen.getByRole('status')).toHaveTextContent(`${precios.length} prendas · S/. 50 a S/. 99`)
  })

  it('ordena por precio desde la URL o desde el selector', async () => {
    const usuario = userEvent.setup()
    const { router } = renderCategoria('/hombre?orden=menor-precio')

    const ascendente = nombresVisibles('Prendas de Hombre').map(precioDe)
    expect(ascendente).toEqual([...ascendente].sort((a, b) => a - b))

    await usuario.selectOptions(screen.getByRole('combobox', { name: 'Ordenar por' }), 'Mayor precio')

    expect(router.state.location.search).toBe('?orden=mayor-precio')
    const descendente = nombresVisibles('Prendas de Hombre').map(precioDe)
    expect(descendente).toEqual([...descendente].sort((a, b) => b - a))
  })

  it('si el presupuesto no tiene prendas, ofrece volver a verlas todas', async () => {
    const usuario = userEvent.setup()
    const { router } = renderCategoria('/basico?presupuesto=desde-100')

    expect(screen.getByText('No hay prendas de Básico en ese presupuesto.')).toBeInTheDocument()
    await usuario.click(screen.getByRole('button', { name: 'Ver todas' }))

    expect(router.state.location.search).toBe('')
    expect(screen.getByRole('radio', { name: 'Todos' })).toHaveFocus()
    expect(screen.getByRole('list', { name: 'Prendas de Básico' })).toBeInTheDocument()
  })

  it('ignora filtros desconocidos en la URL', () => {
    renderCategoria('/hombre?presupuesto=gratis&orden=alfabetico')

    expect(screen.getByRole('radio', { name: 'Todos' })).toBeChecked()
    expect(screen.getByRole('combobox', { name: 'Ordenar por' })).toHaveValue('recomendados')
  })

  it('muestra el 404 para una categoría que no existe', () => {
    renderCategoria('/zapatillas')

    expect(screen.getByRole('heading', { name: 'No encontramos esta página' })).toBeInTheDocument()
  })
})
