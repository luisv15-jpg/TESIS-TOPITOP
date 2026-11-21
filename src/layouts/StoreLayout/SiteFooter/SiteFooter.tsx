import { useId } from 'react'
import { BookOpenTextIcon } from '@phosphor-icons/react'
import { Link } from 'react-router'
import { listarCategorias } from '@/modules/catalogo/services/categorias.service'
import logo from '@/shared/assets/brand/logo-topitop.svg'
import { Suscripcion } from '../Suscripcion/Suscripcion'
import { COLUMNAS_FOOTER, MEDIOS_DE_PAGO, REDES_SOCIALES } from './enlaces'
import './SiteFooter.css'

const ANIO = new Date().getFullYear()

export function SiteFooter() {
  const tituloSuscripcionId = useId()
  const columnas = [
    { titulo: 'Compra', enlaces: listarCategorias().map((c) => ({ etiqueta: c.nombre, ruta: `/${c.slug}` })) },
    ...COLUMNAS_FOOTER,
  ]

  return (
    <footer className="site-footer">
      <div className="site-footer__lienzo">
        <div className="site-footer__alto">
          <div className="site-footer__marca">
            <Link to="/" className="site-footer__logo">
              <img src={logo} alt="Topitop, ir al inicio" width={122} height={50} loading="lazy" />
            </Link>
            <p className="site-footer__lema">Moda peruana para todos los días.</p>
          </div>

          <section className="site-footer__suscripcion" aria-labelledby={tituloSuscripcionId}>
            <h2 id={tituloSuscripcionId} className="site-footer__titulo-suscripcion">
              Recibe los cupones antes que nadie
            </h2>
            <Suscripcion />
          </section>
        </div>

        <nav className="site-footer__columnas" aria-label="Enlaces del pie de página">
          {columnas.map((columna) => (
            <div key={columna.titulo} className="site-footer__columna">
              <h2 className="site-footer__titulo-columna">{columna.titulo}</h2>
              <ul>
                {columna.enlaces.map((enlace) => (
                  <li key={enlace.ruta}>
                    <Link to={enlace.ruta} className="site-footer__enlace">
                      {enlace.etiqueta}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="site-footer__columna">
            <h2 className="site-footer__titulo-columna">Síguenos</h2>
            <ul className="site-footer__redes">
              {REDES_SOCIALES.map(({ nombre, url, Icono }) => (
                <li key={nombre}>
                  <a
                    href={url}
                    className="site-footer__red"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${nombre} de Topitop (se abre en otra pestaña)`}
                  >
                    <Icono weight="fill" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="site-footer__bajo">
          <ul className="site-footer__pagos" aria-label="Medios de pago">
            {MEDIOS_DE_PAGO.map((medio) => (
              <li key={medio.nombre} className="site-footer__pago">
                <img src={medio.src} alt={medio.nombre} width={medio.ancho} height={24} loading="lazy" />
              </li>
            ))}
          </ul>

          <Link to="/libro-de-reclamaciones" className="site-footer__libro">
            <BookOpenTextIcon weight="duotone" aria-hidden="true" />
            Libro de Reclamaciones
          </Link>
        </div>
      </div>

      {/* Franja negra de cierre, como la de topitop.pe */}
      <div className="site-footer__cierre">
        <p className="site-footer__legal">
          © {ANIO} Topitop · Proyecto de tesis con datos de prueba. Fotos de referencia: Unsplash. Logos de pago: Gil
          Barbara (CC0).
        </p>
      </div>
    </footer>
  )
}
