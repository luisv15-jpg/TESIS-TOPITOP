import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { listarIdeasRegalo } from '@/modules/catalogo/services/productos.service'
import { renderConTienda } from '@/test/renderConTienda'
import { RegalosPorPresupuesto } from './RegalosPorPresupuesto'

/** Precios de las tarjetas visibles en la grilla, leídos del nombre de cada prenda. */
function preciosDe(lista: HTMLElement): number[] {
  return within(lista)
    .getAllByRole('article')
    .map((tarjeta) => {
      const nombre = within(tarjeta).getByRole('heading', { level: 3 }).textContent
      return listarIdeasRegalo().find((p) => p.nombre === nombre)?.precio ?? NaN
    })
}

describe('RegalosPorPresupuesto', () => {
  it('empieza en el tramo de S/. 50 a S/. 99 con sus ideas de regalo', () => {
    renderConTienda(<RegalosPorPresupuesto id="regalos" />)

    expect(screen.getByRole('heading', { level: 2, name: 'Regalos por presupuesto' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'S/. 50 a S/. 99' })).toBeChecked()
    const precios = preciosDe(screen.getByRole('list', { name: 'Regalos S/. 50 a S/. 99' }))
    expect(precios.length).toBeGreaterThan(0)
    expect(precios.length).toBeLessThanOrEqual(8)
    expect(precios.every((precio) => precio >= 50 && precio < 100)).toBe(true)
  })

  it('cambia las ideas al elegir otro presupuesto y lo anuncia', async () => {
    const usuario = userEvent.setup()
    renderConTienda(<RegalosPorPresupuesto id="regalos" />)

    await usuario.click(screen.getByRole('radio', { name: 'Menos de S/. 50' }))

    const lista = screen.getByRole('list', { name: 'Regalos Menos de S/. 50' })
    const precios = preciosDe(lista)
    expect(precios.every((precio) => precio < 50)).toBe(true)
    // Ordenadas del más barato al más caro
    expect(precios).toEqual([...precios].sort((a, b) => a - b))
    expect(screen.getByRole('status')).toHaveTextContent(`${precios.length} ideas de regalo · Menos de S/. 50`)
  })

  it('anuncia el total y abre las ideas que no entran en las dos filas', async () => {
    const usuario = userEvent.setup()
    renderConTienda(<RegalosPorPresupuesto id="regalos" />)
    const total = listarIdeasRegalo().filter((p) => p.precio >= 50 && p.precio < 100).length
    expect(total).toBeGreaterThan(8)

    expect(screen.getByRole('status')).toHaveTextContent(`${total} ideas de regalo`)
    expect(within(screen.getByRole('list', { name: 'Regalos S/. 50 a S/. 99' })).getAllByRole('article')).toHaveLength(8)

    await usuario.click(screen.getByRole('button', { name: `Ver las ${total} ideas` }))

    const lista = screen.getByRole('list', { name: 'Regalos S/. 50 a S/. 99' })
    expect(within(lista).getAllByRole('article')).toHaveLength(total)
    expect(within(within(lista).getAllByRole('article')[8]).getAllByRole('button')[0]).toHaveFocus()
    expect(screen.queryByRole('button', { name: /Ver las/ })).not.toBeInTheDocument()
  })

  it('se recorre con el teclado: las flechas cambian de tramo', async () => {
    const usuario = userEvent.setup()
    renderConTienda(<RegalosPorPresupuesto id="regalos" />)

    screen.getByRole('radio', { name: 'S/. 50 a S/. 99' }).focus()
    await usuario.keyboard('{ArrowRight}')

    expect(screen.getByRole('radio', { name: 'S/. 100 a más' })).toBeChecked()
    expect(screen.getByRole('list', { name: 'Regalos S/. 100 a más' })).toBeInTheDocument()
  })
})
