import { render, screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PASOS_REGALO } from '../../data/portada'
import { ComoRegalar } from './ComoRegalar'

/** Pantalla ancha y alta, sin «menos movimiento»: la sección se fija. */
function simularEscritorio() {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        matches: query.includes('min-width'),
        media: query,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
      }) as unknown as MediaQueryList,
  )
  vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(900)
}

function seccion() {
  return screen.getByRole('region', { name: 'Tu regalo, listo para entregar' })
}

describe('ComoRegalar', () => {
  it('en reposo muestra cada paso con su foto debajo', () => {
    render(<ComoRegalar />)

    expect(seccion()).not.toHaveAttribute('data-fija')
    const pasos = within(seccion()).getAllByRole('listitem')
    expect(pasos).toHaveLength(PASOS_REGALO.length)
    PASOS_REGALO.forEach((paso, indice) => {
      expect(within(pasos[indice]).getByRole('heading', { level: 3 })).toHaveTextContent(paso.titulo)
      expect(within(pasos[indice]).getByRole('img', { name: paso.imagen.alt })).toBeInTheDocument()
    })
  })

  it('fija en escritorio: abre un paso a la vez y la foto acompaña al avance', async () => {
    simularEscritorio()
    render(<ComoRegalar />)

    expect(seccion()).toHaveAttribute('data-fija', 'true')
    const pasos = within(seccion()).getAllByRole('listitem')
    await waitFor(() => expect(pasos[0]).toHaveAttribute('aria-current', 'step'))
    // Solo la foto del paso activo queda expuesta a lectores de pantalla
    expect(within(seccion()).getAllByRole('img')).toHaveLength(1)

    // Recorrido de 900 px (1800 de alto − 900 de pantalla): al 90 % va en el último paso
    vi.spyOn(seccion(), 'getBoundingClientRect').mockReturnValue({ top: -810, height: 1800 } as DOMRect)
    window.dispatchEvent(new Event('scroll'))

    await waitFor(() => expect(pasos[2]).toHaveAttribute('aria-current', 'step'))
    expect(pasos[0]).not.toHaveAttribute('aria-current')
    expect(within(seccion()).getByRole('img')).toHaveAccessibleName(PASOS_REGALO[2].imagen.alt)
  })

  it('no se fija si se pidió menos movimiento', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query: string) =>
        ({ matches: true, media: query, addEventListener: () => undefined, removeEventListener: () => undefined }) as unknown as MediaQueryList,
    )
    render(<ComoRegalar />)

    expect(seccion()).not.toHaveAttribute('data-fija')
  })
})
