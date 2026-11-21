import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { comoObjeto, esTexto, sincronizarEntrePestanas } from '@/shared/lib/persistencia'

export type Usuario = { nombre: string; email: string }

type EstadoSesion = {
  usuario: Usuario | null
  iniciar: (email: string) => Usuario
  cerrar: () => void
}

/** «ana.perez@correo.pe» → «Ana». Solo para saludar en la sesión de prueba. */
export function nombreDesdeEmail(email: string): string {
  const parte = email.split('@')[0]?.split(/[._-]/)[0] ?? ''
  if (!parte) return 'Cliente'
  return parte.charAt(0).toUpperCase() + parte.slice(1).toLowerCase()
}

/**
 * Sesión SIMULADA: no hay backend ni se guarda ninguna contraseña. Solo recuerda el correo
 * en el navegador para la demostración.
 */
export const useSesion = create<EstadoSesion>()(
  persist(
    (set) => ({
      usuario: null,
      iniciar: (email) => {
        const usuario = { email: email.trim().toLowerCase(), nombre: nombreDesdeEmail(email.trim()) }
        set({ usuario })
        return usuario
      },
      cerrar: () => set({ usuario: null }),
    }),
    {
      name: 'topitop-sesion',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      merge: (guardado, actual) => {
        const { nombre, email } = comoObjeto(comoObjeto(guardado).usuario)
        return { ...actual, usuario: esTexto(nombre) && esTexto(email) ? { nombre, email } : null }
      },
    },
  ),
)

sincronizarEntrePestanas(useSesion)
