import { describe, expect, it } from 'vitest'
import { buscarTemaAyuda, listarTemasAyuda } from './ayuda.service'

describe('temas de ayuda', () => {
  it('tiene una página por cada enlace de ayuda y legal del footer', () => {
    expect(listarTemasAyuda().map((tema) => tema.slug)).toEqual([
      'preguntas-frecuentes',
      'cambios-y-devoluciones',
      'terminos-y-condiciones',
      'politica-de-privacidad',
    ])
  })

  it('arma las preguntas con los datos de la campaña destacada', () => {
    const preguntas = buscarTemaAyuda('preguntas-frecuentes')?.preguntas ?? []

    expect(preguntas[0].pregunta).toBe('¿Cómo uso el cupón NAVIDADTOP?')
    expect(preguntas[0].respuesta).toContain('S/. 30')
    expect(preguntas[1].respuesta).toContain('S/. 199')
  })

  it('devuelve undefined para un tema desconocido o vacío', () => {
    expect(buscarTemaAyuda('envios-a-marte')).toBeUndefined()
    expect(buscarTemaAyuda(undefined)).toBeUndefined()
  })
})
