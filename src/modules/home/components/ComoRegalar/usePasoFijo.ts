import { useEffect, useRef, useState } from 'react'

const MEDIA_ANCHA = '(min-width: 1024px)'
const MEDIA_MENOS_MOVIMIENTO = '(prefers-reduced-motion: reduce)'
/** Alto mínimo de pantalla para fijar la sección: más bajo, los pasos no caben junto a la foto. */
const ALTO_MINIMO = 640

/** Se fija solo en pantallas anchas y altas, sin «menos movimiento». */
function cabeFija(): boolean {
  return (
    window.matchMedia(MEDIA_ANCHA).matches &&
    !window.matchMedia(MEDIA_MENOS_MOVIMIENTO).matches &&
    window.innerHeight >= ALTO_MINIMO
  )
}

/** Sigue si la sección puede fijarse: cambia con el tamaño de la ventana y con «menos movimiento». */
function useCabeFija(): boolean {
  const [fija, setFija] = useState(cabeFija)
  useEffect(() => {
    const ancha = window.matchMedia(MEDIA_ANCHA)
    const menosMovimiento = window.matchMedia(MEDIA_MENOS_MOVIMIENTO)
    const actualizar = () => setFija(cabeFija())
    ancha.addEventListener('change', actualizar)
    menosMovimiento.addEventListener('change', actualizar)
    window.addEventListener('resize', actualizar)
    return () => {
      ancha.removeEventListener('change', actualizar)
      menosMovimiento.removeEventListener('change', actualizar)
      window.removeEventListener('resize', actualizar)
    }
  }, [])
  return fija
}

/**
 * Capítulos fijos: mientras la sección (dos pantallas de alto) cruza la pantalla, devuelve qué paso
 * toca según el avance. Mide en un requestAnimationFrame por desplazamiento o cambio de tamaño.
 */
export function usePasoFijo(total: number) {
  const seccionRef = useRef<HTMLElement>(null)
  const fija = useCabeFija()
  const [activo, setActivo] = useState(0)

  useEffect(() => {
    const seccion = seccionRef.current
    if (!fija || !seccion) return
    let cuadro = 0
    // El avance va de 0 (la sección llega arriba) a 1 (su final toca el borde inferior)
    const medir = () => {
      cuadro = 0
      const caja = seccion.getBoundingClientRect()
      const recorrido = caja.height - window.innerHeight
      const avance = recorrido > 0 ? Math.min(1, Math.max(0, -caja.top / recorrido)) : 0
      setActivo(Math.min(total - 1, Math.floor(avance * total)))
    }
    const programar = () => {
      if (!cuadro) cuadro = requestAnimationFrame(medir)
    }
    window.addEventListener('scroll', programar, { passive: true })
    window.addEventListener('resize', programar)
    cuadro = requestAnimationFrame(medir)
    return () => {
      window.removeEventListener('scroll', programar)
      window.removeEventListener('resize', programar)
      cancelAnimationFrame(cuadro)
    }
  }, [fija, total])

  return { seccionRef, fija, activo }
}
