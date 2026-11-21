# Tienda Topitop (frontend de tesis)

Tienda virtual de Topitop con la campaña **Navidad Top — Regala momentos**, hecha en React y PrimeReact.
No hay backend: los datos son de prueba, viven dentro de cada módulo y lo que hace el cliente
(carrito, favoritos, pedidos, sesión) se guarda en el navegador. Cada acción responde con un aviso.

## Comandos

| Comando | Qué hace |
|---|---|
| `pnpm dev` | Servidor de desarrollo en http://localhost:5173 |
| `pnpm build` | Revisa los tipos y genera `dist/` |
| `pnpm preview` | Sirve el build para probarlo |
| `pnpm test` | Pruebas unitarias y de componentes (Vitest) |
| `pnpm coverage` | Pruebas con reporte de cobertura (mínimo 80%) |
| `pnpm lint` | ESLint |

Requisitos: Node 20.19 o superior, y pnpm 12 (la versión que creó `node_modules`).

## Qué se puede probar

| Dónde | Qué hace |
|---|---|
| Portada `/` | Hero con las luces del árbol que se encienden, cupón NAVIDADTOP para copiar, «Regalos por presupuesto» con compra rápida, «¿Para quién es el regalo?», pijamas para la familia, «Tu regalo, listo para entregar» (sección fija al bajar) y la cuenta regresiva a Navidad |
| Categorías `/mujer`, `/hombre`, `/infantil`, `/denim`, `/basico`, `/outlet` | Prendas con compra rápida, filtro por presupuesto y orden por precio; el filtro y el orden quedan en la URL |
| Buscador | `/buscar?q=…` lista prendas con compra rápida; sin resultados, sugiere búsquedas e ideas de regalo |
| Carrito `/carrito` | Cantidades, quitar prendas, cupón NAVIDADTOP (S/. 30), barra del regalo desde S/. 199, envoltura de regalo con dedicatoria y compra simulada que genera un pedido |
| Seguir mi pedido `/pedidos` | Busca por código (por ejemplo TT-104832) y muestra los pasos del pedido |
| Mi cuenta `/cuenta` | Ingreso simulado con cualquier correo; muestra favoritos y pedidos |
| Footer | Suscripción a cupones, ayuda, legal, redes oficiales y medios de pago |
| Ayuda `/ayuda/…` | Preguntas frecuentes (acordeón), cambios y devoluciones, términos y privacidad |
| Libro de Reclamaciones | Hoja virtual con validación; entrega un código LR-AAAA-000001 |

Pedidos de prueba para el seguimiento: TT-104832 (en camino), TT-209415 (entregado) y
TT-318806 (preparando).

## Stack

React 19, TypeScript 6 y Vite 8; PrimeReact 10 (Toast, Sidebar, Button, InputText, SelectButton,
ProgressBar y Accordion, sin tema: el estilo es propio), react-router 8, zustand 5 para el carrito,
los favoritos, los pedidos y la sesión, iconos Phosphor y la fuente Montserrat (la del diseño) con `@fontsource-variable`.
Para las pruebas: Vitest 4 con Testing Library y jsdom.

## Estructura

```
src/
  app/                 arranque: App, rutas y página de error
  layouts/StoreLayout/ encabezado, buscador, menú móvil, footer y suscripción
  modules/
    home/              portada: regalos por presupuesto, destinatarios, pijamas, pasos y cuenta regresiva
    promociones/       campaña: hero con luces y banda del cupón; datos e imágenes
    catalogo/          productos, categorías, tramos de precio, filtro y selector de talla
    compra/            compra rápida, tarjeta, grilla y página de categoría (une catálogo, carrito y favoritos)
    carrito/           store, cálculo del resumen y página del carrito
    favoritos/         store y botón de favorito
    pedidos/           pedidos de prueba, store y seguimiento
    cuenta/            sesión simulada e ingreso
    busqueda/          resultados del buscador
    ayuda/             preguntas frecuentes y páginas legales
    reclamaciones/     Libro de Reclamaciones
    novedades/         suscripción a cupones
  shared/              avisos, componentes y utilidades comunes
  styles/              tokens (colores, medidas) y estilos globales
  test/                utilidades de prueba
docs/                  hero de Navidad, despliegue, créditos de las fotos y archivo de Cyber Top
```

Reglas de la estructura:

- **Cada módulo declara sus rutas** en su `routes.ts`, y `app/routes.ts` las reúne. Las páginas
  internas se descargan al entrar (rutas diferidas), así la portada carga menos.
- **Ningún módulo importa de `app/`.** Lo que se usa en más de un sitio va en `shared/`.
- **Cada componente vive en su carpeta**, con su CSS y su prueba al lado.

## Datos de prueba

Los datos están en `modules/<módulo>/data/` y siempre se leen a través de
`modules/<módulo>/services/`. Cuando exista una API, solo cambian los servicios:
las pantallas no se tocan.

Lo que hace el cliente se guarda en `localStorage` con estas claves: `topitop-carrito`,
`topitop-favoritos`, `topitop-pedidos`, `topitop-sesion`, `topitop-suscripciones` y
`topitop-reclamos`. Para empezar de cero, bórralas desde las herramientas del navegador.

## Avisos

Hay un solo proveedor de avisos (`shared/notificaciones`). Cualquier componente los muestra con:

```ts
const notificar = useNotificar()
notificar({ tipo: 'exito', titulo: 'Agregado al carrito', accion: { etiqueta: 'Ver carrito', ruta: '/carrito' } })
```

`tipo` puede ser `exito`, `info`, `aviso` o `error`. Con `reemplazar: true` el aviso reemplaza a
los visibles en vez de apilarse.

## Estilo

La base sigue a la tienda real (topitop.pe): página blanca con paneles grises, esquinas rectas,
barra negra de avisos arriba, fichas de producto planas (foto sobre gris, sello negro con el
descuento, línea «TOPITOP MUJER» y precios a la derecha), pestañas de texto para filtrar y
banners de foto con «Ver todo». Lo propio de la campaña va encima: la banda pino con el cupón
en forma de etiqueta, las luces del hero, el dorado, la cuenta regresiva y el footer pino.

## Medidas del diseño

En escritorio (desde 1100 px), la portada usa `--u`, que equivale a 1 px del lienzo de 1300 px
del diseño original. Por eso los valores `calc(N * var(--u))` del CSS son medidas tomadas del diseño.
En pantallas más angostas, la portada pasa a una sola columna con menú lateral.

## Hero de Navidad

Al cargar, la sala aparece en penumbra, las luces del árbol se encienden por grupos, la sala se
aclara y entra el título; se ve una vez por carga de página. Las luces son capas sacadas de la
misma foto: el detalle y los guiones están en [docs/hero-navidad/](docs/hero-navidad/README.md).
Quien pide menos movimiento en su sistema ve la foto fija.

La campaña anterior, Cyber Top (con los modelos que entraban caminando), quedó respaldada: ver
[docs/archivo-cyber-top/](docs/archivo-cyber-top/README.md).

## Publicar

La demo se publica en una ruta oculta de la VPS: [docs/despliegue.md](docs/despliegue.md).
`VITE_BASE=/<ruta>/ pnpm build` compila para esa subruta.

## Imágenes

La foto del hero (`modules/promociones/assets/navidad/`) es la original de la campaña,
de 1376 × 768. El logo (`shared/assets/brand/`) se sacó de la imagen del diseño; conviene
reemplazarlo por el archivo original, con el mismo nombre.

Las fotos de productos y de la portada son temporales, de Unsplash: el detalle está en
[docs/creditos-fotos.md](docs/creditos-fotos.md).
