import { PaginaAviso } from '@/shared/components/PaginaAviso/PaginaAviso'

export function NoEncontrado() {
  return (
    <>
      <title>Topitop | Página no encontrada</title>
      <PaginaAviso etiqueta="Error 404" titulo="No encontramos esta página">
        <p>Puede que el enlace haya cambiado. Vuelve a la portada para ver la campaña vigente.</p>
      </PaginaAviso>
    </>
  )
}
