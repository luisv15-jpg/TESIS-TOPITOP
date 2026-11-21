import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderConTienda } from '@/test/renderConTienda'
import { AyudaPage } from './AyudaPage'

const PATRON = '/ayuda/:tema'

describe('AyudaPage', () => {
  it('abre la primera pregunta y despliega otras al tocarlas', async () => {
    const usuario = userEvent.setup()
    renderConTienda(<AyudaPage />, { ruta: '/ayuda/preguntas-frecuentes', patron: PATRON })

    const primera = screen.getByRole('button', { name: '¿Cómo uso el cupón NAVIDADTOP?' })
    const envio = screen.getByRole('button', { name: '¿Cuánto demora el envío?' })
    expect(primera).toHaveAttribute('aria-expanded', 'true')
    expect(envio).toHaveAttribute('aria-expanded', 'false')

    await usuario.click(envio)

    expect(envio).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText(/En Lima, de 2 a 4 días hábiles/)).toBeInTheDocument()
  })

  it('muestra las secciones de un tema de texto y marca el tema actual', () => {
    renderConTienda(<AyudaPage />, { ruta: '/ayuda/politica-de-privacidad', patron: PATRON })

    expect(screen.getByRole('heading', { level: 1, name: 'Política de privacidad' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Tus derechos' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Política de privacidad' })).toHaveAttribute('aria-current', 'page')
  })

  it('muestra el 404 si el tema no existe', () => {
    renderConTienda(<AyudaPage />, { ruta: '/ayuda/envios-a-marte', patron: PATRON })

    expect(screen.getByRole('heading', { name: 'No encontramos esta página' })).toBeInTheDocument()
  })
})
