import type { Producto } from '@/modules/catalogo/types'
import { useNotificar } from '@/shared/notificaciones/contexto'
import { MAX_POR_LINEA } from '../lib/resumen'
import { useCarrito } from '../store/carrito.store'

type Seleccion = { talla: string | null; color: string }

/** Agrega al carrito con aviso. Sin talla elegida, avisa en lugar de agregar. Devuelve si agregó. */
export function useAgregarAlCarrito(): (producto: Producto, seleccion: Seleccion) => boolean {
  const agregar = useCarrito((estado) => estado.agregar)
  const notificar = useNotificar()

  return (producto, { talla, color }) => {
    if (!talla) {
      notificar({ tipo: 'aviso', titulo: 'Elige una talla', detalle: `Selecciona la talla de ${producto.nombre}.`, reemplazar: true })
      return false
    }
    if (!agregar({ productoId: producto.id, talla, color })) {
      notificar({
        tipo: 'aviso',
        titulo: `Máximo ${MAX_POR_LINEA} unidades por prenda`,
        detalle: `Ya tienes ${MAX_POR_LINEA} de ${producto.nombre} en talla ${talla}.`,
        accion: { etiqueta: 'Ver carrito', ruta: '/carrito' },
        reemplazar: true,
      })
      return false
    }
    notificar({
      tipo: 'exito',
      titulo: 'Agregado al carrito',
      detalle: `${producto.nombre} · talla ${talla} · ${color}`,
      accion: { etiqueta: 'Ver carrito', ruta: '/carrito' },
      // Reemplaza un «Elige una talla» anterior: ya no aplica.
      reemplazar: true,
    })
    return true
  }
}
