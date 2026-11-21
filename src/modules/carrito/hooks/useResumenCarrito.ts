import { useMemo } from 'react'
import { buscarProducto } from '@/modules/catalogo/services/productos.service'
import { obtenerCampaniaDestacada } from '@/modules/promociones/services/campanias.service'
import { calcularResumen } from '../lib/resumen'
import { useCarrito } from '../store/carrito.store'
import type { CondicionesCarrito, ResumenCarrito } from '../types'

/** Reglas del carrito según la campaña vigente (cupón y regalo). */
export function obtenerCondicionesCarrito(): CondicionesCarrito {
  const { cupon, descuento, regalo } = obtenerCampaniaDestacada()
  return { codigoCupon: cupon.codigo, montoCupon: descuento.monto, montoRegalo: regalo.montoMinimo }
}

export function useResumenCarrito(): ResumenCarrito {
  const items = useCarrito((estado) => estado.items)
  const cupon = useCarrito((estado) => estado.cupon)
  return useMemo(() => calcularResumen(items, cupon, obtenerCondicionesCarrito(), buscarProducto), [items, cupon])
}
