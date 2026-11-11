import { XIcon } from '@phosphor-icons/react'
import { Sidebar } from 'primereact/sidebar'
import { NavLink } from 'react-router'
import type { Categoria } from '@/modules/catalogo/types'
import { ACCESOS_TIENDA } from '../accesos'
import { Buscador } from '../Buscador/Buscador'
import './MenuMovil.css'

type Props = {
  id: string
  visible: boolean
  categorias: readonly Categoria[]
  onCerrar: () => void
}

/** Menú lateral de pantallas angostas: buscador, categorías y accesos de la cuenta. */
export function MenuMovil({ id, visible, categorias, onCerrar }: Props) {
  return (
    <Sidebar
      id={id}
      visible={visible}
      onHide={onCerrar}
      position="right"
      blockScroll
      className="menu-movil"
      maskClassName="menu-movil__velo"
      ariaCloseLabel="Cerrar menú"
      closeIcon={<XIcon aria-hidden="true" />}
      header={<span className="menu-movil__titulo">Menú</span>}
    >
      <Buscador className="menu-movil__buscador" onBuscar={onCerrar} />

      <nav aria-label="Categorías">
        <ul className="menu-movil__lista">
          {categorias.map((categoria) => (
            <li key={categoria.slug}>
              <NavLink to={`/${categoria.slug}`} className="menu-movil__enlace" onClick={onCerrar}>
                {categoria.nombre}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <ul className="menu-movil__accesos" aria-label="Tu compra">
        {ACCESOS_TIENDA.map(({ id: idAcceso, ruta, etiqueta, Icono }) => (
          <li key={idAcceso}>
            <NavLink to={ruta} className="menu-movil__acceso" onClick={onCerrar}>
              <Icono aria-hidden="true" />
              <span>{etiqueta}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </Sidebar>
  )
}
