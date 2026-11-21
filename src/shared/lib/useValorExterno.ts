import { useEffect, useRef, type RefObject } from 'react'

/**
 * Copia un valor externo (por ejemplo, el de la URL) a un campo no controlado sin volver a
 * montarlo, para que el foco no se pierda al buscar o al usar atrás y adelante.
 */
export function useValorExterno(valor: string): RefObject<HTMLInputElement | null> {
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (ref.current && ref.current.value !== valor) ref.current.value = valor
  }, [valor])
  return ref
}
