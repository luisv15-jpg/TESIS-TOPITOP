import { PaginaAviso } from '@/shared/components/PaginaAviso/PaginaAviso'

export function CarritoPage() {
  return (
    <>
      <title>Topitop | Carrito de compras</title>
      <PaginaAviso etiqueta="Carrito de compras" titulo="Tu carrito está vacío">
        <p>Cuando agregues prendas, aquí podrás aplicar el cupón CYBERTOP30.</p>
      </PaginaAviso>
    </>
  )
}
