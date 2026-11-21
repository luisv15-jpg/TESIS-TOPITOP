import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CAMPANIAS } from '../../data/campanias'
import { HeroCampania } from './HeroCampania'

const campania = CAMPANIAS[0]
const sinLuces = { ...campania, luces: undefined }

function renderHero(conDestino = true) {
  return render(
    <>
      <HeroCampania campania={campania} idDestino="destino" />
      {conDestino && <section id="destino" tabIndex={-1} />}
    </>,
  )
}

function simularMovimientoReducido(activo: boolean) {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) => ({ matches: activo, media: query }) as MediaQueryList,
  )
}

function escena() {
  return screen.getByRole('region', { name: 'Navidad Top' })
}

/** Las luces son decorativas (sin rol accesible): se buscan por su clase. */
function luces() {
  return escena().querySelectorAll('.hero-campania__luz')
}

describe('HeroCampania', () => {
  it('muestra el título como h1, el subtítulo y la foto con texto alternativo', () => {
    renderHero()

    expect(screen.getByRole('heading', { level: 1, name: 'Navidad Top' })).toBeInTheDocument()
    expect(screen.getByText('Regala momentos')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: campania.hero.alt })).toHaveAttribute('fetchpriority', 'high')
  })

  it('baja con desplazamiento suave hasta la sección destino y le pasa el foco', async () => {
    const usuario = userEvent.setup()
    simularMovimientoReducido(false)
    renderHero()
    const destino = document.getElementById('destino') as HTMLElement
    const desplazar = vi.spyOn(destino, 'scrollIntoView')

    await usuario.click(screen.getByRole('button', { name: 'Ver los beneficios de la campaña' }))

    expect(desplazar).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
    expect(destino).toHaveFocus()
  })

  it('salta sin animación cuando se pide menos movimiento', async () => {
    const usuario = userEvent.setup()
    simularMovimientoReducido(true)
    renderHero()
    const destino = document.getElementById('destino') as HTMLElement
    const desplazar = vi.spyOn(destino, 'scrollIntoView')

    await usuario.click(screen.getByRole('button', { name: 'Ver los beneficios de la campaña' }))

    expect(desplazar).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' })
  })

  it('no falla si la sección destino no existe', async () => {
    const usuario = userEvent.setup()
    renderHero(false)

    await usuario.click(screen.getByRole('button', { name: 'Ver los beneficios de la campaña' }))

    expect(screen.getByRole('button', { name: 'Ver los beneficios de la campaña' })).toBeInTheDocument()
  })
})

describe('HeroCampania: entrada con las luces del árbol', () => {
  it('enciende las tres capas de luces, ocultas para lectores de pantalla', () => {
    simularMovimientoReducido(false)
    renderHero()

    expect(escena()).toHaveAttribute('data-entrada', 'luces')
    expect(luces()).toHaveLength(3)
    expect(luces()[0].parentElement).toHaveAttribute('aria-hidden', 'true')
    expect(luces()[0]).toHaveAttribute('alt', '')
  })

  it('espera a que la foto y las luces carguen para empezar', async () => {
    simularMovimientoReducido(false)
    let cargar: () => void = () => undefined
    const carga = new Promise<void>((ok) => (cargar = ok))
    Object.defineProperty(HTMLImageElement.prototype, 'decode', { configurable: true, writable: true, value: () => carga })
    try {
      renderHero()
      expect(escena()).not.toHaveAttribute('data-lista')

      await act(async () => cargar())

      expect(escena()).toHaveAttribute('data-lista', 'true')
    } finally {
      Reflect.deleteProperty(HTMLImageElement.prototype, 'decode')
    }
  })

  it('arranca igual si las imágenes tardan demasiado', () => {
    vi.useFakeTimers()
    simularMovimientoReducido(false)
    Object.defineProperty(HTMLImageElement.prototype, 'decode', {
      configurable: true,
      writable: true,
      value: () => new Promise(() => undefined),
    })
    try {
      renderHero()
      act(() => vi.advanceTimersByTime(3000))

      expect(escena()).toHaveAttribute('data-lista', 'true')
    } finally {
      Reflect.deleteProperty(HTMLImageElement.prototype, 'decode')
    }
  })

  it('ubica las luces en porcentajes de la foto', () => {
    simularMovimientoReducido(false)
    renderHero()

    const caja = luces()[0].parentElement as HTMLElement
    const { hero, luces: datos } = campania
    expect(caja.style.getPropertyValue('--luces-x')).toBe(`${((datos?.caja.x ?? 0) / hero.ancho) * 100}%`)
    expect(caja.style.getPropertyValue('--luces-ancho')).toBe(`${((datos?.caja.ancho ?? 0) / hero.ancho) * 100}%`)
  })

  it('se ve una vez por carga: al volver a la portada queda la foto fija', () => {
    simularMovimientoReducido(false)
    const { unmount } = renderHero()
    unmount()

    renderHero()

    expect(escena()).toHaveAttribute('data-entrada', 'fija')
    expect(luces()).toHaveLength(0)
  })

  it('no anima nada si se pidió menos movimiento', () => {
    simularMovimientoReducido(true)
    renderHero()

    expect(escena()).toHaveAttribute('data-entrada', 'fija')
    expect(luces()).toHaveLength(0)
  })

  it('una campaña sin luces igual entra, solo con la sala que se aclara', () => {
    simularMovimientoReducido(false)
    render(<HeroCampania campania={sinLuces} idDestino="destino" />)

    expect(escena()).toHaveAttribute('data-entrada', 'luces')
    expect(luces()).toHaveLength(0)
  })
})
