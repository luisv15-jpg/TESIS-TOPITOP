import { formatearSoles } from '@/shared/lib/formato'
import './PrecioProducto.css'

type Props = {
  precio: number
  precioAntes?: number
  className?: string
}

export function PrecioProducto({ precio, precioAntes, className }: Props) {
  const clases = ['precio-producto', className].filter(Boolean).join(' ')
  return (
    <p className={clases}>
      <span className="precio-producto__actual">{formatearSoles(precio)}</span>
      {precioAntes !== undefined && (
        <span className="precio-producto__antes">
          <span className="sr-only">Antes </span>
          <s>{formatearSoles(precioAntes)}</s>
        </span>
      )}
    </p>
  )
}
