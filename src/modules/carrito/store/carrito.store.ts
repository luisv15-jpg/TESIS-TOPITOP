import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { buscarProducto } from '@/modules/catalogo/services/productos.service'
import { sincronizarEntrePestanas } from '@/shared/lib/persistencia'
import { limitarCantidad, limpiarDedicatoria, sanearCarrito } from '../lib/persistencia'
import { claveItem } from '../lib/resumen'
import type { ItemCarrito } from '../types'

type EstadoCarrito = {
  items: ItemCarrito[]
  cupon: string | null
  /** Envolver el pedido para regalo (gratis). */
  envolver: boolean
  /** Mensaje de la tarjeta del regalo; solo cuenta si se envuelve. */
  dedicatoria: string
  /** Devuelve false si no sumó nada porque la prenda ya está en el máximo por línea. */
  agregar: (item: Omit<ItemCarrito, 'cantidad'>, cantidad?: number) => boolean
  cambiarCantidad: (clave: string, cantidad: number) => void
  quitar: (clave: string) => void
  aplicarCupon: (codigo: string) => void
  quitarCupon: () => void
  cambiarEnvoltura: (envolver: boolean) => void
  cambiarDedicatoria: (texto: string) => void
  vaciar: () => void
}

/**
 * Carrito de prueba guardado en el navegador (localStorage). Cada cambio crea
 * arreglos nuevos: nunca se modifica el estado anterior.
 */
export const useCarrito = create<EstadoCarrito>()(
  persist(
    (set, get) => ({
      items: [],
      cupon: null,
      envolver: false,
      dedicatoria: '',

      agregar: (nuevo, cantidad = 1) => {
        const clave = claveItem(nuevo)
        const existente = get().items.find((item) => claveItem(item) === clave)
        if (existente && limitarCantidad(existente.cantidad + cantidad) === existente.cantidad) return false

        set(({ items }) => ({
          items: existente
            ? items.map((item) =>
                claveItem(item) === clave ? { ...item, cantidad: limitarCantidad(item.cantidad + cantidad) } : item,
              )
            : [...items, { ...nuevo, cantidad: limitarCantidad(cantidad) }],
        }))
        return true
      },

      cambiarCantidad: (clave, cantidad) =>
        set(({ items }) => ({
          items: items.map((item) =>
            claveItem(item) === clave ? { ...item, cantidad: limitarCantidad(cantidad) } : item,
          ),
        })),

      quitar: (clave) => set(({ items }) => ({ items: items.filter((item) => claveItem(item) !== clave) })),

      aplicarCupon: (codigo) => set({ cupon: codigo.trim().toUpperCase() }),

      quitarCupon: () => set({ cupon: null }),

      cambiarEnvoltura: (envolver) => set({ envolver }),

      cambiarDedicatoria: (texto) => set({ dedicatoria: limpiarDedicatoria(texto) }),

      vaciar: () => set({ items: [], cupon: null, envolver: false, dedicatoria: '' }),
    }),
    {
      name: 'topitop-carrito',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Lo guardado puede venir viejo o editado a mano: se valida antes de usarlo.
      merge: (guardado, actual) => ({ ...actual, ...sanearCarrito(guardado, buscarProducto) }),
    },
  ),
)

sincronizarEntrePestanas(useCarrito)

/** Unidades en el carrito, para el contador de la bolsa. */
export function useCantidadEnCarrito(): number {
  return useCarrito((estado) => estado.items.reduce((suma, item) => suma + item.cantidad, 0))
}
