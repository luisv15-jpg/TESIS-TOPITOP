import { useCarrito } from '@/modules/carrito/store/carrito.store'
import { useSesion } from '@/modules/cuenta/store/sesion.store'
import { useFavoritos } from '@/modules/favoritos/store/favoritos.store'
import { usePedidos } from '@/modules/pedidos/store/pedidos.store'

type StoreReiniciable<T> = {
  getInitialState: () => T
  setState: (estado: T, reemplazar: true) => void
}

function reiniciar<T>(store: StoreReiniciable<T>) {
  store.setState(store.getInitialState(), true)
}

/** Deja los stores y el navegador como recién abiertos: cada prueba empieza de cero. */
export function reiniciarStores() {
  localStorage.clear()
  reiniciar(useCarrito)
  reiniciar(useFavoritos)
  reiniciar(usePedidos)
  reiniciar(useSesion)
}
