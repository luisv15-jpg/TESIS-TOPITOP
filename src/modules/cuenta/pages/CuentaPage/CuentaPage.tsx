import { flushSync } from 'react-dom'
import { SignOutIcon } from '@phosphor-icons/react'
import { useFavoritos } from '@/modules/favoritos/store/favoritos.store'
import { PaginaTienda } from '@/shared/components/PaginaTienda/PaginaTienda'
import { enfocarTituloPagina } from '@/shared/lib/dom'
import { useNotificar } from '@/shared/notificaciones/contexto'
import { FormularioIngreso } from '../../components/FormularioIngreso/FormularioIngreso'
import { PanelCuenta } from '../../components/PanelCuenta/PanelCuenta'
import { useSesion } from '../../store/sesion.store'
import './CuentaPage.css'

export function CuentaPage() {
  const usuario = useSesion((estado) => estado.usuario)
  const cerrar = useSesion((estado) => estado.cerrar)
  const cantidadFavoritos = useFavoritos((estado) => estado.ids.length)
  const notificar = useNotificar()

  if (!usuario) {
    const bajada =
      cantidadFavoritos > 0
        ? `Ingresa para ver tus ${cantidadFavoritos} ${cantidadFavoritos === 1 ? 'favorito' : 'favoritos'} y tus pedidos.`
        : 'Ingresa para ver tus favoritos y tus pedidos.'
    return (
      <>
        <title>Topitop | Ingresar</title>
        <PaginaTienda etiqueta="Mi cuenta" titulo="Ingresa a tu cuenta" bajada={bajada} ancho="angosto">
          <FormularioIngreso />
        </PaginaTienda>
      </>
    )
  }

  function handleCerrar() {
    flushSync(cerrar)
    enfocarTituloPagina()
    notificar({ tipo: 'info', titulo: 'Sesión cerrada', detalle: 'Vuelve cuando quieras.', reemplazar: true })
  }

  return (
    <>
      <title>Topitop | Mi cuenta</title>
      <PaginaTienda etiqueta="Mi cuenta" titulo={`Hola, ${usuario.nombre}`} bajada={`Ingresaste con ${usuario.email}.`}>
        <PanelCuenta />
        <button type="button" className="boton-secundario cuenta__salir" onClick={handleCerrar}>
          <SignOutIcon aria-hidden="true" />
          Cerrar sesión
        </button>
      </PaginaTienda>
    </>
  )
}
