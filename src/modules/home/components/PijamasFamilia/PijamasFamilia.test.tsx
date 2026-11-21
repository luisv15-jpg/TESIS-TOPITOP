import { act, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { EDITORIAL_PIJAMAS } from '../../data/portada'
import { renderConTienda } from '@/test/renderConTienda'
import { PijamasFamilia } from './PijamasFamilia'

type Registro = { callback: IntersectionObserverCallback; opciones?: IntersectionObserverInit }

/** IntersectionObserver de mentira: guarda cada observador para dispararlo a mano. */
function simularObservadores() {
  const registros: Registro[] = []
  class Observador {
    constructor(callback: IntersectionObserverCallback, opciones?: IntersectionObserverInit) {
      registros.push({ callback, opciones })
    }
    observe() {}
    disconnect() {}
  }
  vi.stubGlobal('IntersectionObserver', Observador)
  const disparar = (indice: number, intersectionRatio = 1) =>
    act(async () =>
      registros[indice].callback([{ isIntersecting: true, intersectionRatio } as IntersectionObserverEntry], {} as IntersectionObserver),
    )
  return { registros, disparar }
}

function simularAnimacion() {
  let terminar: () => void = () => undefined
  const animacion = { cancel: vi.fn(), finished: new Promise<void>((ok) => (terminar = ok)) }
  const animar = vi.fn(() => animacion)
  Object.defineProperty(HTMLElement.prototype, 'animate', { configurable: true, writable: true, value: animar })
  Object.defineProperty(HTMLImageElement.prototype, 'decode', { configurable: true, writable: true, value: () => Promise.resolve() })
  return { animar, animacion, terminar: () => terminar() }
}

afterEach(() => {
  vi.unstubAllGlobals()
  Reflect.deleteProperty(HTMLElement.prototype, 'animate')
  Reflect.deleteProperty(HTMLImageElement.prototype, 'decode')
})

function marco() {
  return screen.getByRole('img', { name: EDITORIAL_PIJAMAS.imagen.alt }).parentElement as HTMLElement
}

describe('PijamasFamilia', () => {
  it('muestra el título, los puntos y el enlace a las pijamas', () => {
    renderConTienda(<PijamasFamilia />)

    expect(screen.getByRole('heading', { level: 2, name: 'Pijamas para toda la familia' })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(EDITORIAL_PIJAMAS.puntos.length)
    expect(screen.getByRole('link', { name: 'Ver pijamas' })).toHaveAttribute('href', '/buscar?q=pijama')
  })

  it('sin IntersectionObserver la foto se ve tal cual', () => {
    renderConTienda(<PijamasFamilia />)

    expect(marco()).not.toHaveAttribute('data-revelado')
  })

  it('espera como copia pálida y se revela una sola vez al entrar en pantalla', async () => {
    const { disparar } = simularObservadores()
    const { animar, terminar } = simularAnimacion()
    renderConTienda(<PijamasFamilia />)

    // Cerca de la pantalla: copia pálida
    await disparar(0)
    expect(marco()).toHaveAttribute('data-revelado', 'armado')

    // Asoma apenas: todavía no se revela
    await disparar(1, 0.01)
    expect(animar).not.toHaveBeenCalled()

    // Con la fracción pedida a la vista: se revela con un solo animate, sin dejar el filtro pegado
    await disparar(1)
    await disparar(1)
    expect(animar).toHaveBeenCalledTimes(1)
    expect(animar).toHaveBeenCalledWith(expect.any(Array), expect.objectContaining({ fill: 'backwards' }))
    expect(marco()).toHaveAttribute('data-revelado', 'revelando')

    await act(async () => terminar())
    expect(marco()).toHaveAttribute('data-revelado', 'listo')
  })

  it('con menos movimiento no anima', () => {
    simularObservadores()
    const { animar } = simularAnimacion()
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList)
    renderConTienda(<PijamasFamilia />)

    expect(animar).not.toHaveBeenCalled()
    expect(marco()).not.toHaveAttribute('data-revelado')
  })
})
