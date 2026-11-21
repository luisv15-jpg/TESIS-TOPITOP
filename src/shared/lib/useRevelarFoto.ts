import { useEffect, type RefObject } from 'react'

/*
  «La foto se revela»: cuando el marco entra en pantalla, la foto sale del papel como una copia en la
  cubeta de revelado: primero gris, pálida y sin contraste, luego llegan los oscuros y al final el
  color, mientras se asienta desde un leve acercamiento. Una sola vez, unos 1,6 s.
  Sin IntersectionObserver, sin Web Animations o con menos movimiento, la foto se ve tal cual.
*/
const CUADROS: Keyframe[] = [
  { filter: 'grayscale(1) contrast(.55) brightness(1.32)', transform: 'scale(1.06)' },
  { filter: 'grayscale(.8) contrast(.82) brightness(1.14)', offset: 0.3 },
  { filter: 'grayscale(.35) contrast(.95) brightness(1.04)', offset: 0.62 },
  { filter: 'grayscale(0) contrast(1) brightness(1)', transform: 'none' },
]

export function useRevelarFoto(ref: RefObject<HTMLElement | null>, duracion = 1600): void {
  useEffect(() => {
    const marco = ref.current
    const foto = marco?.querySelector('img')
    if (!marco || !foto) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (typeof IntersectionObserver === 'undefined' || typeof foto.animate !== 'function') return

    let animacion: Animation | null = null
    let empezado = false
    let vivo = true
    const armar = () => {
      if (!empezado) marco.dataset.revelado = 'armado'
    }
    const revelar = async () => {
      if (empezado) return
      empezado = true
      // Se espera la foto: revelar un marco vacío gastaría la única animación
      await foto.decode().catch(() => undefined)
      if (!vivo) return
      // fill «backwards»: al terminar no queda ningún filtro pegado sobre la foto
      animacion = foto.animate(CUADROS, { duration: duracion, easing: 'cubic-bezier(.3, .2, .3, 1)', fill: 'backwards' })
      marco.dataset.revelado = 'revelando'
      // Una cancelación (al desmontar) rechaza «finished»: solo un final real marca «listo»
      animacion.finished.then(
        () => {
          if (vivo) marco.dataset.revelado = 'listo'
        },
        () => undefined,
      )
    }

    // Ya cerca al montar (pantallas altas): queda como copia pálida desde el inicio
    const inicial = marco.getBoundingClientRect()
    if (inicial.bottom > 0 && inicial.top < window.innerHeight * 1.25) armar()

    const cerca = new IntersectionObserver(
      ([registro]) => {
        if (registro?.isIntersecting) armar()
      },
      { rootMargin: '0px 0px 25% 0px' },
    )
    // Se revela con un cuarto del marco a la vista (menos si el marco es más alto que media pantalla)
    const umbral = Math.min(0.25, (0.4 * window.innerHeight) / Math.max(1, inicial.height))
    // isIntersecting ya es true con un píxel: se exige la fracción visible pedida
    const visto = new IntersectionObserver(
      ([registro]) => {
        if (registro?.isIntersecting && registro.intersectionRatio >= umbral) void revelar()
      },
      { threshold: umbral },
    )
    cerca.observe(marco)
    visto.observe(marco)

    return () => {
      vivo = false
      cerca.disconnect()
      visto.disconnect()
      animacion?.cancel()
      delete marco.dataset.revelado
    }
  }, [ref, duracion])
}
