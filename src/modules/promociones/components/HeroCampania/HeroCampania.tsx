import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import { ArrowDownIcon } from '@phosphor-icons/react'
import { Button } from 'primereact/button'
import type { Campania, LucesHero } from '../../types'
import { entradaYaVista, marcarEntradaVista } from './memoriaEntrada'
import './HeroCampania.css'

type Props = {
  campania: Campania
  /** id de la sección a la que baja la flecha. */
  idDestino: string
}

/**
 * Cómo entra la escena:
 * - «luces»: la sala empieza en penumbra, se encienden las luces del árbol, se aclara y entra el título.
 * - «fija»: la foto tal cual (menos movimiento o ya vista en esta carga de la página).
 */
type Entrada = 'luces' | 'fija'

/** Si la foto o las luces tardan más que esto, la entrada arranca igual: el título nunca queda oculto. */
const ESPERA_MAXIMA_MS = 2500

function prefiereMenosMovimiento(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function entradaInicial(): Entrada {
  return prefiereMenosMovimiento() || entradaYaVista() ? 'fija' : 'luces'
}

/** Ubica la caja de las luces en porcentajes de la foto, para que calce a cualquier tamaño. */
function estiloLuces({ caja }: LucesHero, ancho: number, alto: number): CSSProperties {
  return {
    '--luces-x': `${(caja.x / ancho) * 100}%`,
    '--luces-y': `${(caja.y / alto) * 100}%`,
    '--luces-ancho': `${(caja.ancho / ancho) * 100}%`,
    '--luces-alto': `${(caja.alto / alto) * 100}%`,
  } as CSSProperties
}

export function HeroCampania({ campania, idDestino }: Props) {
  const { hero, titulo, subtitulo, luces } = campania
  const tituloId = useId()
  const [entrada] = useState<Entrada>(entradaInicial)

  const escenaRef = useRef<HTMLDivElement>(null)
  const [lista, setLista] = useState(false)

  // Se marca al montar (no al renderizar): un render descartado no gasta la entrada
  useEffect(() => {
    if (entrada === 'luces') marcarEntradaVista()
  }, [entrada])

  // La entrada espera a la foto y a las luces: con una red lenta no se gasta sobre un marco vacío
  useEffect(() => {
    if (entrada !== 'luces') return
    let vivo = true
    const empezar = () => {
      if (vivo) setLista(true)
    }
    const espera = window.setTimeout(empezar, ESPERA_MAXIMA_MS)
    const imagenes = [...(escenaRef.current?.querySelectorAll('img') ?? [])]
    Promise.all(imagenes.map((img) => (typeof img.decode === 'function' ? img.decode().catch(() => undefined) : undefined))).then(
      empezar,
    )
    return () => {
      vivo = false
      window.clearTimeout(espera)
    }
  }, [entrada])

  function handleBajar() {
    const destino = document.getElementById(idDestino)
    if (!destino) return
    destino.scrollIntoView({ behavior: prefiereMenosMovimiento() ? 'auto' : 'smooth', block: 'start' })
    destino.focus({ preventScroll: true })
  }

  const medidas = {
    '--foto-ancho': String(hero.ancho),
    '--foto-alto': String(hero.alto),
    '--foto-proporcion': `${hero.ancho} / ${hero.alto}`,
  } as CSSProperties

  return (
    <section
      className="hero-campania"
      aria-labelledby={tituloId}
      data-entrada={entrada}
      data-lista={lista ? 'true' : undefined}
    >
      <div className="hero-campania__escena" style={medidas} ref={escenaRef}>
        <div className="hero-campania__lienzo">
          <img
            className="hero-campania__foto"
            src={hero.src}
            width={hero.ancho}
            height={hero.alto}
            alt={hero.alt}
            fetchPriority="high"
          />
          {luces && entrada === 'luces' && (
            <div className="hero-campania__luces" style={estiloLuces(luces, hero.ancho, hero.alto)} aria-hidden="true">
              {luces.capas.map((capa) => (
                <img
                  key={capa}
                  src={capa}
                  alt=""
                  className="hero-campania__luz"
                  width={luces.caja.ancho}
                  height={luces.caja.alto}
                  decoding="async"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="hero-campania__contenido">
        <h1 id={tituloId} className="hero-campania__titulo">
          {titulo}
        </h1>
        <p className="hero-campania__subtitulo">{subtitulo}</p>
      </div>

      <Button
        type="button"
        className="hero-campania__bajar"
        icon={<ArrowDownIcon weight="regular" aria-hidden="true" />}
        aria-label="Ver los beneficios de la campaña"
        onClick={handleBajar}
      />
    </section>
  )
}
