import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderConTienda } from '@/test/renderConTienda'
import { CAMPANIAS } from '../../data/campanias'
import { BandaCupon } from './BandaCupon'

const campania = CAMPANIAS[0]

describe('BandaCupon', () => {
  it('muestra las condiciones de la campaña con montos en soles', () => {
    renderConTienda(<BandaCupon campania={campania} id="beneficios" />)

    expect(screen.getByText('S/. 30')).toBeInTheDocument()
    expect(screen.getByText('Por compras desde S/. 199')).toBeInTheDocument()
    expect(screen.getByText('Te regalamos un pack de medias navideñas')).toBeInTheDocument()
    expect(screen.getByText(campania.legal)).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Beneficios de Navidad Top' })).toHaveAttribute('id', 'beneficios')
  })

  it('lista los beneficios extra de la campaña', () => {
    renderConTienda(<BandaCupon campania={campania} id="beneficios" />)

    const extras = screen.getAllByRole('listitem').map((item) => item.textContent)
    expect(extras).toEqual(['Envoltura de regalo gratis', 'Cambios hasta el 31 de enero'])
  })

  it('copia el cupón y lo confirma con un aviso', async () => {
    const usuario = userEvent.setup()
    const escribir = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
    renderConTienda(<BandaCupon campania={campania} id="beneficios" />)

    await usuario.click(screen.getByRole('button', { name: 'NAVIDADTOP, copiar cupón' }))

    expect(escribir).toHaveBeenCalledWith('NAVIDADTOP')
    expect(await screen.findByText('Cupón copiado')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ir al carrito' })).toHaveAttribute('href', '/carrito')
  })

  it('explica qué hacer si el navegador no deja copiar', async () => {
    const usuario = userEvent.setup()
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('denegado'))
    renderConTienda(<BandaCupon campania={campania} id="beneficios" />)

    await usuario.click(screen.getByRole('button', { name: 'NAVIDADTOP, copiar cupón' }))

    expect(await screen.findByText('No pudimos copiarlo')).toBeInTheDocument()
    expect(screen.getByText('Escribe NAVIDADTOP en tu carrito de compras.')).toBeInTheDocument()
  })

  it('usa el aviso alternativo si el navegador no expone el portapapeles (http sin HTTPS)', async () => {
    const usuario = userEvent.setup()
    vi.spyOn(navigator, 'clipboard', 'get').mockReturnValue(undefined as unknown as Clipboard)
    renderConTienda(<BandaCupon campania={campania} id="beneficios" />)

    await usuario.click(screen.getByRole('button', { name: 'NAVIDADTOP, copiar cupón' }))

    expect(await screen.findByText('No pudimos copiarlo')).toBeInTheDocument()
  })

  it('deja un solo aviso aunque se copie varias veces', async () => {
    const usuario = userEvent.setup()
    vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
    renderConTienda(<BandaCupon campania={campania} id="beneficios" />)
    const boton = screen.getByRole('button', { name: 'NAVIDADTOP, copiar cupón' })

    await usuario.click(boton)
    await usuario.click(boton)
    await usuario.click(boton)

    await screen.findByText('Cupón copiado')
    expect(screen.getAllByText('Cupón copiado')).toHaveLength(1)
    expect(screen.getByRole('button', { name: 'Cerrar aviso' })).toBeInTheDocument()
  })
})
