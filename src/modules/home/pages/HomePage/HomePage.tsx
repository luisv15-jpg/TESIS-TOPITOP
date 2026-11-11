import { BandaCupon } from '@/modules/promociones/components/BandaCupon/BandaCupon'
import { HeroCampania } from '@/modules/promociones/components/HeroCampania/HeroCampania'
import { obtenerCampaniaDestacada } from '@/modules/promociones/services/campanias.service'

const ID_BENEFICIOS = 'beneficios-campania'

export function HomePage() {
  const campania = obtenerCampaniaDestacada()

  return (
    <>
      <title>Topitop | Cyber Top: S/. 30 de descuento con CYBERTOP30</title>
      <HeroCampania campania={campania} idDestino={ID_BENEFICIOS} />
      <BandaCupon campania={campania} id={ID_BENEFICIOS} />
    </>
  )
}
