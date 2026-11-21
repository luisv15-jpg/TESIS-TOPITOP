/*
  La entrada animada se ve una vez por carga de la página: si la persona vuelve a la portada
  navegando dentro de la tienda, encuentra la foto en su pose. Al recargar, se vuelve a ver.
*/
let vista = false

export function entradaYaVista(): boolean {
  return vista
}

export function marcarEntradaVista(): void {
  vista = true
}

/** Solo para pruebas: vuelve al estado de una carga nueva. */
export function olvidarEntradaVista(): void {
  vista = false
}
