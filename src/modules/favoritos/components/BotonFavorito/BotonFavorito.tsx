import { HeartIcon } from '@phosphor-icons/react'
import type { Producto } from '@/modules/catalogo/types'
import { useNotificar } from '@/shared/notificaciones/contexto'
import { useFavoritos } from '../../store/favoritos.store'
import './BotonFavorito.css'

type Props = {
  producto: Producto
  className?: string
}

export function BotonFavorito({ producto, className }: Props) {
  const guardado = useFavoritos((estado) => estado.ids.includes(producto.id))
  const alternar = useFavoritos((estado) => estado.alternar)
  const notificar = useNotificar()

  function handleClick() {
    const ahora = alternar(producto.id)
    notificar({
      tipo: ahora ? 'exito' : 'info',
      titulo: ahora ? 'Guardado en favoritos' : 'Quitado de favoritos',
      detalle: producto.nombre,
      accion: ahora ? { etiqueta: 'Ver mis favoritos', ruta: '/cuenta' } : undefined,
      reemplazar: true,
    })
  }

  const clases = ['boton-favorito', className].filter(Boolean).join(' ')
  return (
    <button
      type="button"
      className={clases}
      aria-pressed={guardado}
      aria-label={`Guardar ${producto.nombre} en favoritos`}
      onClick={handleClick}
    >
      <HeartIcon weight={guardado ? 'fill' : 'regular'} aria-hidden="true" />
    </button>
  )
}
