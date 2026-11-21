import { BandaCupon } from '@/modules/promociones/components/BandaCupon/BandaCupon'
import { HeroCampania } from '@/modules/promociones/components/HeroCampania/HeroCampania'
import { obtenerCampaniaDestacada } from '@/modules/promociones/services/campanias.service'
import { formatearSoles } from '@/shared/lib/formato'
import { ComoRegalar } from '../../components/ComoRegalar/ComoRegalar'
import { CuentaRegresiva } from '../../components/CuentaRegresiva/CuentaRegresiva'
import { ParaQuien } from '../../components/ParaQuien/ParaQuien'
import { PijamasFamilia } from '../../components/PijamasFamilia/PijamasFamilia'
import { RegalosPorPresupuesto } from '../../components/RegalosPorPresupuesto/RegalosPorPresupuesto'

const ID_BENEFICIOS = 'beneficios-campania'
const ID_REGALOS = 'regalos'

export function HomePage() {
  const campania = obtenerCampaniaDestacada()
  const titulo = `Topitop | ${campania.titulo}: ${formatearSoles(campania.descuento.monto)} de descuento con ${campania.cupon.codigo}`

  return (
    <>
      <title>{titulo}</title>
      <HeroCampania campania={campania} idDestino={ID_BENEFICIOS} />
      <BandaCupon campania={campania} id={ID_BENEFICIOS} />
      <RegalosPorPresupuesto id={ID_REGALOS} />
      <ParaQuien />
      <PijamasFamilia />
      <ComoRegalar />
      <CuentaRegresiva idRegalos={ID_REGALOS} />
    </>
  )
}
