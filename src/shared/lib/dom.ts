/** id del nodo donde se monta la app (index.html). Los overlays de PrimeReact van fuera, en <body>. */
export const ID_RAIZ_APP = 'root'

/**
 * Lleva el foco al título de la página. Se usa cuando una acción desmonta el control que tenía
 * el foco (quitar la última prenda, ingresar, cerrar sesión): así no cae a <body>.
 */
export function enfocarTituloPagina(): void {
  document.querySelector<HTMLElement>('main h1')?.focus()
}
