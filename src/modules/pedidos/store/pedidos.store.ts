import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { comoObjeto, esNumero, esTexto, sincronizarEntrePestanas } from '@/shared/lib/persistencia'
import { listarPedidosDemo } from '../services/pedidos.service'
import { PASOS_PEDIDO, type Pedido } from '../types'

type EstadoPedidos = {
  pedidos: Pedido[]
  registrar: (datos: Pick<Pedido, 'unidades' | 'total' | 'regalo'>) => Pedido
}

const DIGITOS_CODIGO = 6
/** Igual que la dedicatoria del carrito: lo que entra en la tarjeta. */
const MAX_DEDICATORIA = 120

/** Código «TT-» con 6 cifras que no choca con los pedidos existentes. */
export function generarCodigo(existentes: readonly string[], azar: () => number = Math.random): string {
  for (;;) {
    const numero = Math.floor(azar() * 10 ** DIGITOS_CODIGO)
    const codigo = `TT-${String(numero).padStart(DIGITOS_CODIGO, '0')}`
    if (!existentes.includes(codigo)) return codigo
  }
}

function sanearRegalo(crudo: unknown): Pedido['regalo'] {
  const { dedicatoria } = comoObjeto(crudo)
  if (crudo === undefined || typeof dedicatoria !== 'string') return undefined
  return { dedicatoria: Array.from(dedicatoria).slice(0, MAX_DEDICATORIA).join('') }
}

/** Descarta los pedidos guardados con datos rotos (montos negativos, estados desconocidos). */
export function sanearPedidos(guardado: unknown): Pedido[] {
  const { pedidos } = comoObjeto(guardado)
  if (!Array.isArray(pedidos)) return []
  return pedidos.flatMap((crudo): Pedido[] => {
    const { codigo, fecha, unidades, total, estado, regalo } = comoObjeto(crudo)
    const estadoValido = PASOS_PEDIDO.find((paso) => paso.estado === estado)?.estado
    if (!esTexto(codigo) || !esTexto(fecha) || Number.isNaN(Date.parse(fecha))) return []
    if (!esNumero(unidades) || unidades < 1 || !esNumero(total) || total < 0 || !estadoValido) return []
    const regaloValido = sanearRegalo(regalo)
    return [{ codigo, fecha, unidades, total, estado: estadoValido, ...(regaloValido && { regalo: regaloValido }) }]
  })
}

/** Pedidos simulados guardados en el navegador. */
export const usePedidos = create<EstadoPedidos>()(
  persist(
    (set, get) => ({
      pedidos: [],
      registrar: ({ unidades, total, regalo }) => {
        const usados = [...get().pedidos, ...listarPedidosDemo()].map((pedido) => pedido.codigo)
        const pedido: Pedido = {
          codigo: generarCodigo(usados),
          fecha: new Date().toISOString(),
          unidades,
          total,
          estado: 'confirmado',
          ...(regalo && { regalo }),
        }
        set(({ pedidos }) => ({ pedidos: [pedido, ...pedidos] }))
        return pedido
      },
    }),
    {
      name: 'topitop-pedidos',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      merge: (guardado, actual) => ({ ...actual, pedidos: sanearPedidos(guardado) }),
    },
  ),
)

sincronizarEntrePestanas(usePedidos)
