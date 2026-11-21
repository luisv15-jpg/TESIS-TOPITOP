import { useEffect } from 'react'
import { XIcon } from '@phosphor-icons/react'
import { Sidebar } from 'primereact/sidebar'
import { NavLink } from 'react-router'
import type { Categoria } from '@/modules/catalogo/types'
import { ID_RAIZ_APP } from '@/shared/lib/dom'
import { ACCESOS_TIENDA } from '../accesos'
import { Buscador } from '../Buscador/Buscador'
import './MenuMovil.css'

type Props = {
  id: string
  visible: boolean
  categorias: readonly Categoria[]
  onCerrar: () => void
}

/**
 * Mientras el menú está abierto, la app queda inerte (el Sidebar vive en <body>, fuera de
 * #root): el foco no puede salir del menú. Al cerrarse, el foco vuelve a quien lo abrió.
 */
function useMenuModal(visible: boolean) {
  useEffect(() => {
    if (!visible) return
    const raiz = document.getElementById(ID_RAIZ_APP)
    const quienAbrio = document.activeElement instanceof HTMLElement ? document.activeElement : null
    raiz?.setAttribute('inert', '')
    return () => {
      raiz?.removeAttribute('inert')
      quienAbrio?.focus({ preventScroll: true })
    }
  }, [visible])
}

/** Menú lateral de pantallas angostas: buscador, categorías y accesos de la cuenta. */
export function MenuMovil({ id, visible, categorias, onCerrar }: Props) {
  useMenuModal(visible)

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
      pt={{ root: { role: 'dialog', 'aria-modal': true, 'aria-label': 'Menú' } }}
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
