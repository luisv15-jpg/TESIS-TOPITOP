import { CaretDownIcon } from '@phosphor-icons/react'
import { Accordion, AccordionTab } from 'primereact/accordion'
import { NavLink, useParams } from 'react-router'
import { NoEncontrado } from '@/shared/components/NoEncontrado/NoEncontrado'
import { PaginaTienda } from '@/shared/components/PaginaTienda/PaginaTienda'
import { buscarTemaAyuda, listarTemasAyuda } from '../../services/ayuda.service'
import './AyudaPage.css'

const ICONO_TAB = <CaretDownIcon weight="bold" className="p-accordion-toggle-icon" aria-hidden="true" />

export function AyudaPage() {
  const { tema: slug } = useParams()
  const tema = buscarTemaAyuda(slug)

  if (!tema) return <NoEncontrado />

  return (
    <>
      <title>{`Topitop | ${tema.titulo}`}</title>
      <PaginaTienda etiqueta="Ayuda" titulo={tema.titulo} bajada={tema.bajada}>
        <div className="ayuda">
          <nav className="ayuda__temas" aria-label="Temas de ayuda">
            <ul>
              {listarTemasAyuda().map((otro) => (
                <li key={otro.slug}>
                  <NavLink to={`/ayuda/${otro.slug}`} className="ayuda__tema">
                    {otro.titulo}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ayuda__contenido">
            {tema.preguntas && (
              <Accordion multiple activeIndex={[0]} expandIcon={ICONO_TAB} collapseIcon={ICONO_TAB} className="ayuda__preguntas">
                {tema.preguntas.map((item) => (
                  <AccordionTab key={item.pregunta} header={item.pregunta}>
                    <p>{item.respuesta}</p>
                  </AccordionTab>
                ))}
              </Accordion>
            )}

            {tema.secciones?.map((seccion) => (
              <section key={seccion.titulo} className="ayuda__seccion tarjeta-blanca">
                <h2>{seccion.titulo}</h2>
                {seccion.parrafos.map((parrafo) => (
                  <p key={parrafo}>{parrafo}</p>
                ))}
              </section>
            ))}

            <p className="ayuda__nota">Texto de demostración del proyecto de tesis: no reemplaza las políticas oficiales de Topitop.</p>
          </div>
        </div>
      </PaginaTienda>
    </>
  )
}
