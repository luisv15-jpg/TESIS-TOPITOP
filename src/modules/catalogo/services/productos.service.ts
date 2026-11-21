import { PRODUCTOS } from '../data/productos'
import type { Producto } from '../types'

/*
  Punto único de acceso a los productos. Hoy lee los datos de prueba;
  cuando exista backend, solo cambia este archivo.
*/

/** Minúsculas y sin tildes, para que «basico» encuentre «Básico». */
export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

export function listarProductos(): readonly Producto[] {
  return PRODUCTOS
}

export function buscarProducto(id: string): Producto | undefined {
  return PRODUCTOS.find((producto) => producto.id === id)
}

/** Prendas elegidas como idea de regalo de la campaña (portada). */
export function listarIdeasRegalo(): readonly Producto[] {
  return PRODUCTOS.filter((producto) => producto.ideaRegalo)
}

export function listarPorCategoria(slug: string): readonly Producto[] {
  const buscado = normalizar(slug)
  return PRODUCTOS.filter((producto) => producto.categorias.includes(buscado))
}

/** Todas las palabras de la consulta deben aparecer en el nombre, el titular, las categorías o los colores. */
export function buscarProductos(consulta: string): readonly Producto[] {
  const palabras = normalizar(consulta).split(/\s+/).filter(Boolean)
  if (palabras.length === 0) return []

  return PRODUCTOS.filter((producto) => {
    const texto = normalizar(
      [producto.nombre, producto.titular, ...producto.categorias, ...producto.colores.map((c) => c.nombre)].join(' '),
    )
    return palabras.every((palabra) => texto.includes(palabra))
  })
}
