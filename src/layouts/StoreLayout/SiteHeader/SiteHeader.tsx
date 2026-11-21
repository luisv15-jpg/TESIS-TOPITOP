import { useState } from 'react'
import { ListIcon } from '@phosphor-icons/react'
import { Button } from 'primereact/button'
import { Link, NavLink } from 'react-router'
import { useCantidadEnCarrito } from '@/modules/carrito/store/carrito.store'
import { listarCategorias } from '@/modules/catalogo/services/categorias.service'
import logo from '@/shared/assets/brand/logo-topitop.svg'
import { ACCESOS_TIENDA } from '../accesos'
import { Buscador } from '../Buscador/Buscador'
import { MenuMovil } from '../MenuMovil/MenuMovil'
import './SiteHeader.css'

const ID_MENU_MOVIL = 'menu-movil'

export function SiteHeader() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const categorias = listarCategorias()
  const enCarrito = useCantidadEnCarrito()

  return (
    <header className="site-header">
      <div className="site-header__barra">
        <Link to="/" className="site-header__logo">
          <img src={logo} alt="Topitop, ir al inicio" width={98} height={40} />
        </Link>

        <nav className="site-header__nav" aria-label="Categorías">
          <ul className="site-header__categorias">
            {categorias.map((categoria) => (
              <li key={categoria.slug}>
                <NavLink to={`/${categoria.slug}`} className="site-header__categoria">
                  {categoria.nombre}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <Buscador className="site-header__buscador buscador--header" />

        <ul className="site-header__accesos" aria-label="Tu compra">
          {ACCESOS_TIENDA.map(({ id, ruta, etiqueta, Icono }) => {
            const contador = id === 'carrito' && enCarrito > 0 ? enCarrito : null
            const nombre = contador ? `${etiqueta} (${contador} ${contador === 1 ? 'prenda' : 'prendas'})` : etiqueta
            return (
              <li key={id} className={`site-header__acceso site-header__acceso--${id}`}>
                <NavLink to={ruta} className="site-header__icono" aria-label={nombre} title={etiqueta}>
                  <Icono weight="regular" aria-hidden="true" />
                  {contador && (
                    <span className="site-header__contador" aria-hidden="true">
                      {contador > 9 ? '9+' : contador}
                    </span>
                  )}
                </NavLink>
              </li>
            )
          })}
        </ul>

        <Button
          type="button"
          className="site-header__menu"
          icon={<ListIcon weight="regular" aria-hidden="true" />}
          aria-label="Abrir menú"
          aria-haspopup="dialog"
          aria-expanded={menuAbierto}
          aria-controls={ID_MENU_MOVIL}
          onClick={() => setMenuAbierto(true)}
        />
      </div>

      <MenuMovil
        id={ID_MENU_MOVIL}
        visible={menuAbierto}
        categorias={categorias}
        onCerrar={() => setMenuAbierto(false)}
      />
    </header>
  )
}
