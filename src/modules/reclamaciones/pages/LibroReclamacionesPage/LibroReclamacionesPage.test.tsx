import { screen } from '@testing-library/react'
import userEvent, { type UserEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderConTienda } from '@/test/renderConTienda'
import { LibroReclamacionesPage } from './LibroReclamacionesPage'

const campo = (nombre: string | RegExp) => screen.getByRole('textbox', { name: nombre })

const HOJA_VALIDA: [string, string][] = [
  ['Nombre completo', 'Ana Pérez Quispe'],
  ['Domicilio', 'Av. Gamarra, La Victoria'],
  ['Número de DNI', '45678912'],
  ['Celular', '987654321'],
  ['Correo', 'ana@correo.pe'],
  ['Descripción del producto o servicio', 'Polera rosa talla M'],
  ['¿Qué pasó?', 'Llegó con una costura abierta en la manga.'],
  ['¿Qué solución esperas?', 'Cambio por otra igual.'],
]

/** Pega cada valor (más rápido que escribir letra por letra) y acepta la declaración. */
async function llenarHojaValida(usuario: UserEvent) {
  for (const [etiqueta, valor] of HOJA_VALIDA) {
    await usuario.click(campo(etiqueta))
    await usuario.paste(valor)
  }
  await usuario.click(screen.getByRole('checkbox', { name: /Declaro que los datos/ }))
}

describe('LibroReclamacionesPage', () => {
  it('marca los campos obligatorios, avisa y lleva el foco al primero', async () => {
    const usuario = userEvent.setup()
    renderConTienda(<LibroReclamacionesPage />)

    await usuario.click(screen.getByRole('button', { name: 'Enviar hoja de reclamación' }))

    expect(campo('Nombre completo')).toHaveFocus()
    expect(campo('Nombre completo')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('El celular tiene 9 cifras y empieza con 9.')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /Declaro que los datos/ })).toHaveAttribute('aria-invalid', 'true')
    expect(await screen.findByText('Faltan datos en la hoja')).toBeInTheDocument()
    expect(screen.getByText('Revisa los 9 campos marcados en rojo.')).toBeInTheDocument()
  })

  it('pide el nombre del apoderado solo para menores de edad', async () => {
    const usuario = userEvent.setup()
    renderConTienda(<LibroReclamacionesPage />)

    expect(screen.queryByRole('textbox', { name: /apoderado/ })).not.toBeInTheDocument()
    await usuario.click(screen.getByRole('checkbox', { name: 'Soy menor de edad' }))

    expect(campo(/apoderado/)).toBeInTheDocument()
  })

  it('cambia la etiqueta del documento con el tipo elegido', async () => {
    const usuario = userEvent.setup()
    renderConTienda(<LibroReclamacionesPage />)

    await usuario.click(screen.getByRole('radio', { name: 'Carné de extranjería' }))

    expect(campo('Número de carné de extranjería')).toBeInTheDocument()
  })

  it('registra la hoja, muestra el código y permite empezar otra vacía', async () => {
    const usuario = userEvent.setup()
    renderConTienda(<LibroReclamacionesPage />)

    await llenarHojaValida(usuario)
    await usuario.click(screen.getByRole('button', { name: 'Enviar hoja de reclamación' }))

    const confirmacion = screen.getByRole('heading', { level: 2, name: /Hoja LR-\d{4}-000001 registrada/ })
    expect(confirmacion).toHaveFocus()
    expect(screen.getByText('ana@correo.pe')).toBeInTheDocument()
    expect(await screen.findByText(/Te responderemos a ana@correo.pe/)).toBeInTheDocument()

    await usuario.click(screen.getByRole('button', { name: 'Registrar otra hoja' }))

    expect(campo('Nombre completo')).toHaveValue('')
    expect(campo('Nombre completo')).toHaveFocus()
  })
})
