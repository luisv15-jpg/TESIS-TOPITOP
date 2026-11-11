import { ArrowDownIcon } from '@phosphor-icons/react'
import { Button } from 'primereact/button'
import type { Campania } from '../../types'
import './HeroCampania.css'

type Props = {
  campania: Campania
  /** id de la sección a la que baja la flecha. */
  idDestino: string
}

function prefiereMenosMovimiento(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function HeroCampania({ campania, idDestino }: Props) {
  const { hero, titulo } = campania

  function handleBajar() {
    const destino = document.getElementById(idDestino)
    if (!destino) return
    destino.scrollIntoView({ behavior: prefiereMenosMovimiento() ? 'auto' : 'smooth', block: 'start' })
    destino.focus({ preventScroll: true })
  }

  return (
    <section className="hero-campania" aria-labelledby="hero-campania-titulo">
      <img
        className="hero-campania__foto"
        src={hero.src}
        srcSet={`${hero.src} ${hero.ancho}w, ${hero.src2x} ${hero.ancho * 2}w`}
        sizes="(min-width: 1100px) 100vw, 200vh"
        width={hero.ancho}
        height={hero.alto}
        alt={hero.alt}
        fetchPriority="high"
        data-enter
      />
      <div className="hero-campania__lienzo">
        <h1 id="hero-campania-titulo" className="hero-campania__titulo">
          {titulo.map((linea, indice) => (
            <span key={linea} className="hero-campania__linea" data-enter>
              {linea}
              {indice < titulo.length - 1 ? ' ' : null}
            </span>
          ))}
        </h1>
        <Button
          type="button"
          className="hero-campania__bajar"
          icon={<ArrowDownIcon weight="light" aria-hidden="true" />}
          aria-label="Ver los beneficios de la campaña"
          onClick={handleBajar}
        />
      </div>
    </section>
  )
}
