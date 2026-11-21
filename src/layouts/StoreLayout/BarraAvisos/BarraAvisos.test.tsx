import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { CAMPANIAS } from '@/modules/promociones/data/campanias'
import { formatearSoles } from '@/shared/lib/formato'
import { renderConTienda, renderTienda } from '@/test/renderConTienda'
import { BarraAvisos } from './BarraAvisos'

const campania = CAMPANIAS[0]
const textoCupon = `${formatearSoles(campania.descuento.monto)} de descuento con ${campania.cupon.codigo}`

describe('BarraAvisos', () => {
  it('anuncia el beneficio principal y el cupón de la campaña', () => {
    renderConTienda(<BarraAvisos />)

    expect(screen.getByText(campania.beneficios[0].texto)).toBeInTheDocument()
    expect(screen.getByText(`· ${textoCupon}`)).toBeInTheDocument()
  })

  it('lleva a seguir el pedido y a una página de ayuda que existe', async () => {
    const usuario = userEvent.setup()
    renderTienda('/')
    const ayuda = screen.getByRole('navigation', { name: 'Atención al cliente' })

    expect(within(ayuda).getByRole('link', { name: 'Sigue tu pedido' })).toHaveAttribute('href', '/pedidos')
    await usuario.click(within(ayuda).getByRole('link', { name: 'Ayuda' }))

    expect(await screen.findByRole('heading', { level: 1, name: 'Preguntas frecuentes' })).toBeInTheDocument()
  })

  it('sin beneficios, el cupón es el mensaje', () => {
    renderConTienda(<BarraAvisos campania={{ ...campania, beneficios: [] }} />)

    expect(screen.getByText(textoCupon)).toBeInTheDocument()
  })

  it('sin campaña muestra la frase de la marca y no rompe el marco', () => {
    renderConTienda(<BarraAvisos campania={null} />)

    expect(screen.getByText('Moda peruana para todos los días')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Atención al cliente' })).toBeInTheDocument()
  })
})
