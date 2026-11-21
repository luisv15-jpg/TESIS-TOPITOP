import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderConTienda } from '@/test/renderConTienda'
import { SiteFooter } from './SiteFooter'

describe('SiteFooter', () => {
  it('enlaza categorías, ayuda, legal, redes oficiales y medios de pago', () => {
    renderConTienda(<SiteFooter />)

    const enlaces = within(screen.getByRole('navigation', { name: 'Enlaces del pie de página' }))
    expect(enlaces.getByRole('link', { name: 'Hombre' })).toHaveAttribute('href', '/hombre')
    expect(enlaces.getByRole('link', { name: 'Preguntas frecuentes' })).toHaveAttribute('href', '/ayuda/preguntas-frecuentes')
    const instagram = enlaces.getByRole('link', { name: /Instagram de Topitop/ })
    expect(instagram).toHaveAttribute('href', 'https://www.instagram.com/topitop_pe/')
    expect(instagram).toHaveAttribute('rel', expect.stringContaining('noopener'))
    expect(within(screen.getByRole('list', { name: 'Medios de pago' })).getAllByRole('img')).toHaveLength(4)
  })

  it('valida el correo de la suscripción antes de enviarlo', async () => {
    const usuario = userEvent.setup()
    renderConTienda(<SiteFooter />)
    const correo = screen.getByRole('textbox', { name: 'Tu correo' })

    await usuario.type(correo, 'ana@')
    await usuario.click(screen.getByRole('button', { name: 'Suscribirme' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Escribe un correo válido')
    expect(correo).toHaveAttribute('aria-invalid', 'true')
  })

  it('suscribe el correo, lo confirma y limpia el campo', async () => {
    const usuario = userEvent.setup()
    renderConTienda(<SiteFooter />)
    const correo = screen.getByRole('textbox', { name: 'Tu correo' })

    await usuario.type(correo, 'ana@correo.pe')
    await usuario.click(screen.getByRole('button', { name: 'Suscribirme' }))

    expect(await screen.findByText('Te suscribiste')).toBeInTheDocument()
    expect(correo).toHaveValue('')
    expect(localStorage.getItem('topitop-suscripciones')).not.toContain('ana@correo.pe')
  })

  it('avisa si el navegador no deja guardar el correo', async () => {
    const usuario = userEvent.setup()
    renderConTienda(<SiteFooter />)
    const guardar = Object.getPrototypeOf(localStorage) as Storage
    vi.spyOn(guardar, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })

    await usuario.type(screen.getByRole('textbox', { name: 'Tu correo' }), 'luis@correo.pe')
    await usuario.click(screen.getByRole('button', { name: 'Suscribirme' }))

    expect(await screen.findByText('No pudimos guardar tu correo')).toBeInTheDocument()
  })
})
