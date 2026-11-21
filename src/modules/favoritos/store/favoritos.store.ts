import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { comoObjeto, esTexto, sincronizarEntrePestanas } from '@/shared/lib/persistencia'

type EstadoFavoritos = {
  ids: string[]
  /** Agrega o quita. Devuelve true si quedó guardado. */
  alternar: (productoId: string) => boolean
}

/** Favoritos de prueba guardados en el navegador. */
export const useFavoritos = create<EstadoFavoritos>()(
  persist(
    (set, get) => ({
      ids: [],
      alternar: (productoId) => {
        const guardado = get().ids.includes(productoId)
        set(({ ids }) => ({ ids: guardado ? ids.filter((id) => id !== productoId) : [...ids, productoId] }))
        return !guardado
      },
    }),
    {
      name: 'topitop-favoritos',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      merge: (guardado, actual) => {
        const { ids } = comoObjeto(guardado)
        return { ...actual, ids: Array.isArray(ids) ? [...new Set(ids.filter(esTexto))] : [] }
      },
    },
  ),
)

sincronizarEntrePestanas(useFavoritos)
