import { useId, useRef, useState, type FormEvent } from 'react'
import { flushSync } from 'react-dom'
import { GiftIcon, MinusIcon, PlusIcon, TrashIcon } from '@phosphor-icons/react'
import { InputText } from 'primereact/inputtext'
import { ProgressBar } from 'primereact/progressbar'
import { Link, useNavigate } from 'react-router'
import { usePedidos } from '@/modules/pedidos/store/pedidos.store'
import { PaginaAviso } from '@/shared/components/PaginaAviso/PaginaAviso'
import { PaginaTienda } from '@/shared/components/PaginaTienda/PaginaTienda'
import { enfocarTituloPagina } from '@/shared/lib/dom'
import { formatearSoles } from '@/shared/lib/formato'
import { useNotificar } from '@/shared/notificaciones/contexto'
import { EnvolturaRegalo } from '../../components/EnvolturaRegalo/EnvolturaRegalo'
import { obtenerCondicionesCarrito, useResumenCarrito } from '../../hooks/useResumenCarrito'
import { esCuponValido, MAX_POR_LINEA } from '../../lib/resumen'
import { useCarrito } from '../../store/carrito.store'
import './CarritoPage.css'

export function CarritoPage() {
  const resumen = useResumenCarrito()
  const cambiarCantidad = useCarrito((estado) => estado.cambiarCantidad)
  const quitar = useCarrito((estado) => estado.quitar)
  const aplicarCupon = useCarrito((estado) => estado.aplicarCupon)
  const quitarCupon = useCarrito((estado) => estado.quitarCupon)
  const vaciar = useCarrito((estado) => estado.vaciar)
  const envolver = useCarrito((estado) => estado.envolver)
  const dedicatoria = useCarrito((estado) => estado.dedicatoria)
  const registrarPedido = usePedidos((estado) => estado.registrar)
  const notificar = useNotificar()
  const navigate = useNavigate()
  const cuponId = useId()
  const errorCuponId = useId()
  const [codigo, setCodigo] = useState('')
  const [errorCupon, setErrorCupon] = useState<string | null>(null)
  const [procesando, setProcesando] = useState(false)
  const listaRef = useRef<HTMLUListElement>(null)
  const cuponRef = useRef<HTMLInputElement>(null)
  const quitarCuponRef = useRef<HTMLButtonElement>(null)

  if (resumen.lineas.length === 0) {
    return (
      <>
        <title>Topitop | Carrito de compras</title>
        <PaginaAviso etiqueta="Carrito de compras" titulo="Tu carrito está vacío">
          <p>
            Elige un regalo en la portada y aplica el cupón {obtenerCondicionesCarrito().codigoCupon} aquí.
          </p>
        </PaginaAviso>
      </>
    )
  }

  function handleCupon(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const condiciones = obtenerCondicionesCarrito()
    if (!esCuponValido(codigo, condiciones)) {
      flushSync(() => setErrorCupon('Ese cupón no existe o ya venció. Revisa el código de la campaña en la portada.'))
      cuponRef.current?.focus()
      return
    }
    // El formulario se cambia por el bloque «Cupón aplicado»: el foco pasa a su botón.
    flushSync(() => {
      setErrorCupon(null)
      aplicarCupon(codigo)
      setCodigo('')
    })
    quitarCuponRef.current?.focus()
    notificar({
      tipo: 'exito',
      titulo: 'Cupón aplicado',
      detalle: `${condiciones.codigoCupon}: ${formatearSoles(condiciones.montoCupon)} de descuento.`,
      reemplazar: true,
    })
  }

  function handleQuitarCupon() {
    flushSync(quitarCupon)
    cuponRef.current?.focus()
  }

  function handleQuitar(clave: string, nombre: string, indice: number) {
    flushSync(() => quitar(clave))
    // El foco pasa a la prenda que quedó en ese lugar; sin prendas, al título de la página.
    const botones = listaRef.current?.querySelectorAll<HTMLButtonElement>('.carrito__quitar') ?? []
    const siguiente = botones[Math.min(indice, botones.length - 1)]
    if (siguiente) siguiente.focus()
    else enfocarTituloPagina()
    notificar({ tipo: 'info', titulo: 'Prenda quitada', detalle: nombre, reemplazar: true })
  }

  /** Los límites usan aria-disabled: el botón conserva el foco aunque no haga nada. */
  function handleCantidad(clave: string, cantidad: number) {
    if (cantidad < 1 || cantidad > MAX_POR_LINEA) return
    cambiarCantidad(clave, cantidad)
  }

  async function handleFinalizar() {
    if (procesando) return
    setProcesando(true)
    const pedido = registrarPedido({
      unidades: resumen.cantidad,
      total: resumen.total,
      regalo: envolver ? { dedicatoria: dedicatoria.trim() } : undefined,
    })
    notificar({
      tipo: 'exito',
      titulo: `Pedido ${pedido.codigo} registrado`,
      detalle: `${envolver ? 'Va envuelto para regalo. ' : ''}Es una compra simulada: no se cobró nada.`,
      accion: { etiqueta: 'Seguir mi pedido', ruta: `/pedidos?codigo=${pedido.codigo}` },
    })
    // Se vacía al llegar al seguimiento: mientras carga, no se ve «Tu carrito está vacío».
    await navigate(`/pedidos?codigo=${pedido.codigo}`)
    vaciar()
  }

  const textoRegalo = resumen.ganaRegalo
    ? 'Ya ganaste el regalo de la campaña.'
    : `Te faltan ${formatearSoles(resumen.faltaParaRegalo)} para llevarte un regalo.`

  return (
    <>
      <title>{`Topitop | Carrito (${resumen.cantidad})`}</title>
      <PaginaTienda etiqueta="Carrito de compras" titulo="Tu carrito">
        <div className="carrito">
          <ul className="carrito__lineas" ref={listaRef}>
            {resumen.lineas.map(({ clave, item, producto, importe }, indice) => (
              <li key={clave} className="carrito__linea tarjeta-blanca">
                <img
                  src={producto.imagen.src}
                  srcSet={producto.imagen.srcset}
                  sizes="80px"
                  alt=""
                  className="carrito__foto"
                  width={96}
                  height={128}
                />
                <div className="carrito__datos">
                  <h2 className="carrito__nombre">{producto.nombre}</h2>
                  <p className="carrito__variante">
                    Talla {item.talla} · {item.color}
                  </p>
                  <p className="carrito__unitario">{formatearSoles(producto.precio)} c/u</p>
                </div>
                <div className="carrito__cantidad" role="group" aria-label={`Cantidad de ${producto.nombre}`}>
                  <button
                    type="button"
                    className="carrito__paso"
                    aria-label="Quitar una unidad"
                    aria-disabled={item.cantidad <= 1}
                    onClick={() => handleCantidad(clave, item.cantidad - 1)}
                  >
                    <MinusIcon weight="bold" aria-hidden="true" />
                  </button>
                  <output className="carrito__numero" aria-live="polite">
                    {item.cantidad}
                  </output>
                  <button
                    type="button"
                    className="carrito__paso"
                    aria-label="Agregar una unidad"
                    aria-disabled={item.cantidad >= MAX_POR_LINEA}
                    onClick={() => handleCantidad(clave, item.cantidad + 1)}
                  >
                    <PlusIcon weight="bold" aria-hidden="true" />
                  </button>
                </div>
                <p className="carrito__importe">{formatearSoles(importe)}</p>
                <button
                  type="button"
                  className="carrito__quitar"
                  aria-label={`Quitar ${producto.nombre} del carrito`}
                  onClick={() => handleQuitar(clave, producto.nombre, indice)}
                >
                  <TrashIcon aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>

          <aside className="carrito__resumen tarjeta-blanca" aria-label="Resumen de compra">
            <div className="carrito__regalo">
              <p className="carrito__regalo-texto">
                <GiftIcon weight="duotone" aria-hidden="true" />
                {textoRegalo}
              </p>
              <ProgressBar
                value={Math.round(resumen.avanceRegalo * 100)}
                showValue={false}
                className="carrito__barra"
                aria-label="Avance hacia el regalo"
              />
            </div>

            {resumen.cuponAplicado ? (
              <div className="carrito__cupon-aplicado">
                <span>
                  Cupón <strong>{resumen.cuponAplicado}</strong> aplicado
                </span>
                <button type="button" className="boton-secundario" ref={quitarCuponRef} onClick={handleQuitarCupon}>
                  Quitar cupón
                </button>
              </div>
            ) : (
              <form className="carrito__cupon campo" onSubmit={handleCupon} noValidate>
                <label htmlFor={cuponId} className="campo__etiqueta">
                  Cupón de descuento
                </label>
                <div className="carrito__cupon-fila">
                  <InputText
                    ref={cuponRef}
                    id={cuponId}
                    value={codigo}
                    onChange={(evento) => setCodigo(evento.target.value)}
                    className="campo__control"
                    autoComplete="off"
                    aria-invalid={errorCupon ? true : undefined}
                    aria-describedby={errorCupon ? errorCuponId : undefined}
                  />
                  <button type="submit" className="boton-secundario">
                    Aplicar
                  </button>
                </div>
                {errorCupon && (
                  <p id={errorCuponId} className="campo__error" role="alert">
                    {errorCupon}
                  </p>
                )}
              </form>
            )}

            <EnvolturaRegalo />

            <dl className="carrito__totales">
              <div>
                <dt>Subtotal ({resumen.cantidad} {resumen.cantidad === 1 ? 'prenda' : 'prendas'})</dt>
                <dd>{formatearSoles(resumen.subtotal)}</dd>
              </div>
              {resumen.descuento > 0 && (
                <div className="carrito__descuento">
                  <dt>Descuento</dt>
                  <dd>− {formatearSoles(resumen.descuento)}</dd>
                </div>
              )}
              <div className="carrito__total">
                <dt>Total</dt>
                <dd>{formatearSoles(resumen.total)}</dd>
              </div>
            </dl>

            <button
              type="button"
              className="boton-primario carrito__finalizar"
              aria-disabled={procesando}
              onClick={handleFinalizar}
            >
              {procesando ? 'Registrando pedido…' : 'Finalizar compra'}
            </button>
            <p className="carrito__nota">Compra simulada: no se pide ni se cobra ninguna tarjeta.</p>
            <Link to="/" className="carrito__seguir">
              Seguir comprando
            </Link>
          </aside>
        </div>
      </PaginaTienda>
    </>
  )
}
