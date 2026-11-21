import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'
import { olvidarEntradaVista } from '@/modules/promociones/components/HeroCampania/memoriaEntrada'
import { reiniciarStores } from './reiniciarStores'

beforeEach(() => {
  reiniciarStores()
  // Cada prueba es una carga nueva de la página: la entrada del hero aún no se vio.
  olvidarEntradaVista()
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.useRealTimers()
})

// jsdom no implementa estas APIs del navegador; PrimeReact y el hero las usan.
if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  })
}

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => undefined
}

// ScrollRestoration del router llama a window.scrollTo, que jsdom no implementa.
window.scrollTo = () => undefined
