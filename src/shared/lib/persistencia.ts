/*
  Ayudas para los stores guardados en localStorage con el middleware persist de zustand.
*/

type StorePersistido = {
  persist: {
    rehydrate: () => Promise<void> | void
    getOptions: () => { name?: string }
  }
}

/**
 * persist no escucha a las otras pestañas: cada una escribiría su estado viejo encima del
 * de la otra. Con esto, cuando otra pestaña cambia la clave, esta vuelve a leerla.
 */
export function sincronizarEntrePestanas(store: StorePersistido): void {
  if (typeof window === 'undefined') return
  const clave = store.persist.getOptions().name
  window.addEventListener('storage', (evento) => {
    // key null: otra pestaña vació todo el almacenamiento.
    if (evento.key === clave || evento.key === null) void store.persist.rehydrate()
  })
}

/** Lo guardado como objeto con claves sueltas; cualquier otra cosa, objeto vacío. */
export function comoObjeto(valor: unknown): Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor) ? (valor as Record<string, unknown>) : {}
}

export function esTexto(valor: unknown): valor is string {
  return typeof valor === 'string' && valor.length > 0
}

export function esNumero(valor: unknown): valor is number {
  return typeof valor === 'number' && Number.isFinite(valor)
}
