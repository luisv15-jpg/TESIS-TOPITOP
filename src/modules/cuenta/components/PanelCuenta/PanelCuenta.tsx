import { useId, useState } from 'react'
import { Link } from 'react-router'
import { listarProductos } from '@/modules/catalogo/services/productos.service'
import { GrillaProductos } from '@/modules/compra/components/GrillaProductos/GrillaProductos'
import { useFavoritos } from '@/modules/favoritos/store/favoritos.store'
import { formatearFechaPedido } from '@/modules/pedidos/lib/seguimiento'
import { usePedidos } from '@/modules/pedidos/store/pedidos.store'
import { formatearSoles } from '@/shared/lib/formato'

/** Lo que ve el cliente con la sesión iniciada: sus favoritos y sus pedidos. */
export function PanelCuenta() {
  const idsFavoritos = useFavoritos((estado) => estado.ids)
  const pedidos = usePedidos((estado) => estado.pedidos)
  const favoritosId = useId()
  const pedidosId = useId()

  // Las tarjetas son las de los favoritos al entrar: si se quita un corazón, la tarjeta se queda
  // (con el corazón vacío para volver a guardarla) y el foco no se pierde.
  const [idsAlEntrar] = useState(idsFavoritos)
  const favoritos = listarProductos().filter((producto) => idsAlEntrar.includes(producto.id))
  const cantidadFavoritos = idsFavoritos.length

  return (
    <div className="cuenta__panel">
      <section aria-labelledby={favoritosId}>
        <h2 id={favoritosId} className="cuenta__subtitulo">
          Tus favoritos ({cantidadFavoritos})
        </h2>
        {favoritos.length > 0 ? (
          <GrillaProductos productos={favoritos} etiqueta="Tus favoritos" />
        ) : (
          <p className="cuenta__vacio">
            Toca el corazón de una prenda para guardarla aquí.{' '}
            <Link to="/" className="cuenta__enlace">
              Ver los básicos de la portada
            </Link>
          </p>
        )}
      </section>

      <section aria-labelledby={pedidosId}>
        <h2 id={pedidosId} className="cuenta__subtitulo">
          Tus pedidos ({pedidos.length})
        </h2>
        {pedidos.length > 0 ? (
          <ul className="cuenta__pedidos">
            {pedidos.map((pedido) => (
              <li key={pedido.codigo} className="cuenta__pedido tarjeta-blanca">
                <div>
                  <p className="cuenta__pedido-codigo">{pedido.codigo}</p>
                  <p className="cuenta__pedido-dato">
                    {formatearFechaPedido(pedido.fecha)} · {pedido.unidades}{' '}
                    {pedido.unidades === 1 ? 'prenda' : 'prendas'} · {formatearSoles(pedido.total)}
                  </p>
                </div>
                <Link to={`/pedidos?codigo=${pedido.codigo}`} className="boton-secundario">
                  Seguir pedido
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="cuenta__vacio">
            Aún no compras en esta demostración. Tus pedidos aparecen aquí al finalizar una compra.
          </p>
        )}
      </section>
    </div>
  )
}
