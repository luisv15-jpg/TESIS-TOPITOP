import { useId, useState, type FormEvent } from 'react'
import { flushSync } from 'react-dom'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { Link, useSearchParams } from 'react-router'
import { CampoTexto } from '@/shared/components/CampoTexto/CampoTexto'
import { PaginaTienda } from '@/shared/components/PaginaTienda/PaginaTienda'
import { useValorExterno } from '@/shared/lib/useValorExterno'
import { useNotificar } from '@/shared/notificaciones/contexto'
import { DetallePedido } from '../../components/DetallePedido/DetallePedido'
import { esCodigoPedidoValido } from '../../lib/seguimiento'
import { buscarPedido, listarPedidosDemo, normalizarCodigo } from '../../services/pedidos.service'
import { usePedidos } from '../../store/pedidos.store'
import './PedidosPage.css'

const PARAMETRO = 'codigo'

export function PedidosPage() {
  const [parametros, setParametros] = useSearchParams()
  const propios = usePedidos((estado) => estado.pedidos)
  const notificar = useNotificar()
  const [error, setError] = useState<string>()
  const sugeridosId = useId()

  const codigo = normalizarCodigo(parametros.get(PARAMETRO) ?? '')
  const pedido = codigo ? buscarPedido(codigo, propios) : undefined
  // El campo sigue a la URL (atrás y adelante) sin volver a montarse: el foco no se pierde.
  const campoRef = useValorExterno(codigo)

  /** Muestra el error ya enlazado al campo y le lleva el foco, para que se anuncie. */
  function marcarError(mensaje: string) {
    flushSync(() => setError(mensaje))
    campoRef.current?.focus()
  }

  function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const escrito = normalizarCodigo(String(new FormData(evento.currentTarget).get(PARAMETRO) ?? ''))

    if (!escrito) {
      marcarError('Escribe el código de tu pedido.')
      return
    }
    if (!esCodigoPedidoValido(escrito)) {
      marcarError('El código tiene la forma TT-123456. Lo encuentras en el aviso de tu compra.')
      return
    }

    setError(undefined)
    setParametros({ [PARAMETRO]: escrito })
    if (!buscarPedido(escrito, propios)) {
      notificar({
        tipo: 'aviso',
        titulo: 'No encontramos ese pedido',
        detalle: `Revisa el código ${escrito} o prueba con uno de demostración.`,
        reemplazar: true,
      })
    }
  }

  const sugeridos = [...propios.slice(0, 3), ...listarPedidosDemo()]

  return (
    <>
      <title>{codigo ? `Topitop | Pedido ${codigo}` : 'Topitop | Seguir mi pedido'}</title>
      <PaginaTienda
        etiqueta="Seguir mi pedido"
        titulo="¿Dónde está mi pedido?"
        bajada="Escribe el código que te dimos al comprar y te mostramos en qué paso va."
      >
        <div className="pedidos">
          <div className="pedidos__columna">
            <form className="pedidos__buscador tarjeta-blanca" onSubmit={handleSubmit} noValidate>
              <CampoTexto
                etiqueta="Código de pedido"
                nombre={PARAMETRO}
                valorInicial={codigo}
                ref={campoRef}
                errorAnunciado
                autoComplete="off"
                maxLength={12}
                error={error}
                extra={
                  <button type="submit" className="boton-primario">
                    <MagnifyingGlassIcon weight="bold" aria-hidden="true" />
                    Buscar
                  </button>
                }
              />
            </form>

            <section className="pedidos__sugeridos" aria-labelledby={sugeridosId}>
              <h2 id={sugeridosId} className="pedidos__subtitulo">
                {propios.length > 0 ? 'Tus pedidos y los de prueba' : 'Pedidos de prueba'}
              </h2>
              <ul className="pedidos__chips">
                {sugeridos.map((sugerido) => (
                  <li key={sugerido.codigo}>
                    <Link
                      to={`?${PARAMETRO}=${sugerido.codigo}`}
                      className="pedidos__chip"
                      aria-current={sugerido.codigo === codigo ? 'true' : undefined}
                    >
                      {sugerido.codigo}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="pedidos__resultado" aria-live="polite">
            {pedido && <DetallePedido pedido={pedido} />}
            {codigo && !pedido && (
              <div className="pedidos__vacio tarjeta-blanca">
                <h2 className="pedidos__subtitulo">No encontramos el pedido {codigo}</h2>
                <p>Revisa que el código esté bien escrito. Los pedidos de esta demostración se guardan solo en este navegador.</p>
              </div>
            )}
          </div>
        </div>
      </PaginaTienda>
    </>
  )
}
