# Video de entrada del hero (opcional)

La portada ya tiene una entrada animada con código en la que los modelos entran caminando y
terminan posando ([docs/entrada-hero/](../entrada-hero/README.md)). Este documento explica cómo
usar en su lugar un clip de video generado con IA, si algún día se produce uno. Si la campaña
tiene video, el hero lo prefiere a la animación.

## Cómo funciona en la página

- El clip se reproduce **una sola vez**, sin sonido, sin controles y sin poster.
- Al terminar se desvanece en 600 ms y queda debajo la foto fija. Por eso el **último cuadro
  del clip tiene que ser idéntico a la foto**: si no calzan, se nota un salto.
- Se usa la entrada con código en cualquiera de estos casos: la persona pidió menos movimiento
  en su sistema, tiene activado el ahorro de datos, el navegador bloqueó la reproducción
  automática o el clip no empezó en 2,5 segundos.
- El clip se dibuja anclado abajo y 1080/972 más alto que la foto, de modo que su franja
  inferior coincide con ella en escritorio y en celular.

## Lo que hay que generar

| Dato | Valor |
|---|---|
| Tamaño | 1920 × 1080 (16:9) |
| Duración | 6 a 8 segundos |
| Cámara | **Fija**: sin paneo, sin zoom y sin temblor |
| Último cuadro | [`ultimo-cuadro-16x9.png`](./ultimo-cuadro-16x9.png) |
| Audio | Ninguno |
| Peso final | 4 MB como máximo |

`ultimo-cuadro-16x9.png` es la foto del hero a 1920 × 972 con 108 px de pared oscura agregados
arriba para completar el 16:9. Esa franja de arriba nunca se ve en la página.

## Herramientas

Sirve cualquier generador de video que acepte una imagen como **último cuadro** (en inglés,
*end frame* o *last keyframe*). Por ejemplo, Luma Dream Machine o Runway permiten usar solo el
último cuadro. Kling y Veo piden además un primer cuadro: para eso, borra a los dos modelos de
`ultimo-cuadro-16x9.png` con relleno generativo (en la misma herramienta o en un editor de
imágenes) y usa ese escenario vacío como primer cuadro. Estas herramientas cambian seguido, así
que revisa sus opciones actuales.

## Prompt

Los generadores suelen entender mejor el inglés:

```text
Fashion campaign film, 16:9, 8 seconds, static locked-off camera, one continuous shot.
A dark charcoal studio with a single round spotlight on the back wall.
0-3 s: a young woman with long wavy blonde hair, a glossy black puffer jacket, a burgundy
knit vest over a white shirt and blue jeans walks in from the LEFT edge of the frame; at the
same time a bearded man in a black beanie, a dark grey denim overshirt, a white T-shirt and
blue jeans walks in from the RIGHT edge. Relaxed, confident, fluid runway stride, natural arm
swing, his shadow sliding across the lit wall.
3-5 s: they meet in the spotlight, glance at each other and react: she smiles and laughs
softly, tucks her hair, he grins and nods, then rests his forearm on her shoulder.
5-7 s: both put their hands in their jeans pockets, turn to the camera, she tilts her head
slightly and gives a confident look, he lifts his chin with a cool, serious expression.
7-8 s: they hold that exact pose, matching the provided last frame, only breathing and a tiny
blink. Soft cinematic key light, realistic skin and fabric, no camera movement, no zoom,
no cuts, no text, no logos.
```

Prompt negativo, si la herramienta lo acepta:

```text
camera shake, zoom, pan, cut, scene change, text, watermark, extra people, extra limbs,
distorted hands, morphing faces, face swap, sliding feet, slow motion
```

En español: cámara fija y una sola toma de 8 segundos en el estudio oscuro con el foco en la pared.
- **0 a 3 s:** ella entra caminando por la izquierda y él por la derecha, al mismo tiempo, con paso fluido de pasarela.
- **3 a 5 s:** se encuentran en la luz y reaccionan: se miran, ella sonríe y se acomoda el pelo, él sonríe, asiente y le apoya el brazo en el hombro.
- **5 a 7 s:** meten las manos en los bolsillos y giran hacia la cámara; ella inclina la cabeza y él levanta el mentón.
- **7 a 8 s:** se quedan en la pose exacta del último cuadro, solo respirando y parpadeando.

## Activarlo

1. Comprime el clip y quítale el audio con [ffmpeg](https://ffmpeg.org/):

   ```bash
   ffmpeg -i clip.mp4 -an -vf "scale=1920:1080:flags=lanczos,fps=25" \
     -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart cyber-hero.mp4
   ```

   Si pesa más de 4 MB, sube `-crf` de a 2 (28, 30…).

2. Opcional, una versión WebM más liviana:

   ```bash
   ffmpeg -i clip.mp4 -an -c:v libvpx-vp9 -b:v 0 -crf 36 -row-mt 1 cyber-hero.webm
   ```

3. Comprueba que el último cuadro calce con la foto:

   ```bash
   ffmpeg -sseof -0.1 -i cyber-hero.mp4 -frames:v 1 ultimo-del-clip.png
   ```

   Compara `ultimo-del-clip.png` con `ultimo-cuadro-16x9.png`: los modelos deben estar en el
   mismo lugar y del mismo tamaño.

4. Copia `cyber-hero.mp4` (y `cyber-hero.webm`, si lo hiciste) en
   `src/modules/promociones/assets/`.

5. En `src/modules/promociones/data/campanias.ts`, importa el clip y descomenta `heroVideo`:

   ```ts
   import heroVideo from '../assets/cyber-hero.mp4'
   // dentro de la campaña:
   heroVideo: { mp4: heroVideo },
   ```

6. Revisa la portada con `pnpm build` y `pnpm preview`.

## Derechos

Los modelos son los de la foto de la campaña del diseño. Usa el clip solo para la demostración
de la tesis; para publicarlo se necesita el permiso de la marca y de los modelos.
