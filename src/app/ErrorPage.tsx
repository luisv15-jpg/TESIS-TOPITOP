import { isRouteErrorResponse, useRouteError } from 'react-router'
import { PaginaAviso } from '@/shared/components/PaginaAviso/PaginaAviso'

/** Respaldo del router: muestra un aviso en lugar de una pantalla en blanco. */
export function ErrorPage() {
  const error = useRouteError()
  const etiqueta = isRouteErrorResponse(error) ? `Error ${error.status}` : 'Error'

  return (
    <>
      <title>Topitop | Algo salió mal</title>
      <PaginaAviso etiqueta={etiqueta} titulo="Algo salió mal al cargar la página">
        <p>Recarga la página. Si el problema sigue, vuelve a la portada.</p>
      </PaginaAviso>
    </>
  )
}
