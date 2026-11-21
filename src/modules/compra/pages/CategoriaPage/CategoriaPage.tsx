import { useId, useRef } from 'react'
import { useParams, useSearchParams } from 'react-router'
import { FiltroPresupuesto } from '@/modules/catalogo/components/FiltroPresupuesto/FiltroPresupuesto'
import {
  buscarRango,
  enPresupuesto,
  esOrden,
  ORDENES,
  ordenarProductos,
  type OrdenProductos,
  type RangoPresupuesto,
} from '@/modules/catalogo/lib/presupuesto'
import { buscarCategoria } from '@/modules/catalogo/services/categorias.service'
import { listarPorCategoria } from '@/modules/catalogo/services/productos.service'
import { NoEncontrado } from '@/shared/components/NoEncontrado/NoEncontrado'
import { PaginaTienda } from '@/shared/components/PaginaTienda/PaginaTienda'
import { GrillaProductos } from '../../components/GrillaProductos/GrillaProductos'
import './CategoriaPage.css'

const PARAM_PRESUPUESTO = 'presupuesto'
const PARAM_ORDEN = 'orden'

/**
 * Página de una categoría (Mujer, Hombre…): sus prendas con compra rápida, filtro por presupuesto
 * y orden por precio. El filtro y el orden viven en la URL: se pueden compartir y el «atrás» los respeta.
 */
export function CategoriaPage() {
  const { slug } = useParams()
  const [parametros, setParametros] = useSearchParams()
  const ordenId = useId()
  const barraRef = useRef<HTMLDivElement>(null)
  const categoria = buscarCategoria(slug)

  if (!categoria) return <NoEncontrado />

  const tramo = buscarRango(parametros.get(PARAM_PRESUPUESTO))
  const valorOrden = parametros.get(PARAM_ORDEN)
  const orden: OrdenProductos = esOrden(valorOrden) ? valorOrden : 'recomendados'
  const todas = listarPorCategoria(categoria.slug)
  const visibles = ordenarProductos(tramo ? todas.filter((producto) => enPresupuesto(producto, tramo)) : todas, orden)

  function cambiarParametro(nombre: string, valor: string | null) {
    const siguientes = new URLSearchParams(parametros)
    if (valor) siguientes.set(nombre, valor)
    else siguientes.delete(nombre)
    setParametros(siguientes, { replace: true, preventScrollReset: true })
  }

  /** El botón desaparece al ver todo: el foco pasa a «Todos», que queda elegido. */
  function handleVerTodas() {
    cambiarParametro(PARAM_PRESUPUESTO, null)
    barraRef.current?.querySelector<HTMLInputElement>('input[value="todos"]')?.focus()
  }

  const conteo = `${visibles.length} ${visibles.length === 1 ? 'prenda' : 'prendas'}${tramo ? ` · ${tramo.etiqueta}` : ''}`

  return (
    <>
      <title>{`Topitop | ${categoria.nombre}`}</title>
      <PaginaTienda etiqueta={categoria.nombre} titulo={categoria.titular} bajada={categoria.descripcion}>
        <div className="categoria__barra" ref={barraRef}>
          <FiltroPresupuesto
            valor={tramo?.id ?? null}
            onCambiar={(valor: RangoPresupuesto['id'] | null) => cambiarParametro(PARAM_PRESUPUESTO, valor)}
            conTodos
          />
          <div className="categoria__orden">
            <label htmlFor={ordenId}>Ordenar por</label>
            <select
              id={ordenId}
              value={orden}
              onChange={(evento) =>
                cambiarParametro(PARAM_ORDEN, evento.target.value === 'recomendados' ? null : evento.target.value)
              }
            >
              {ORDENES.map(({ id, etiqueta }) => (
                <option key={id} value={id}>
                  {etiqueta}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="categoria__conteo" role="status">
          {conteo}
        </p>

        {visibles.length > 0 ? (
          <GrillaProductos productos={visibles} etiqueta={`Prendas de ${categoria.nombre}`} />
        ) : (
          <div className="categoria__vacio tarjeta-blanca">
            <p>No hay prendas de {categoria.nombre} en ese presupuesto.</p>
            <button type="button" className="boton-secundario" onClick={handleVerTodas}>
              Ver todas
            </button>
          </div>
        )}
      </PaginaTienda>
    </>
  )
}
