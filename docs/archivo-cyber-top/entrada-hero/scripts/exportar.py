"""Exporta las capas de la entrada animada como WebP con transparencia (lienzo completo 1300 x 658)."""
import sys
from pathlib import Path

import numpy as np
import onnxruntime as ort
from PIL import Image, ImageDraw, ImageFilter

S = Path(sys.argv[1])
A = S / "anim"
sys.path.insert(0, str(A))
from capas import BRAZO, ESC, HOMBRO_ELLA, poligono  # noqa: E402

DESTINO = Path(r"C:/Users/ABEL1/Documents/TESIS-TOPITOP/src/modules/promociones/assets/entrada")
DESTINO.mkdir(parents=True, exist_ok=True)
HERO = Path(r"C:/Users/ABEL1/Documents/TESIS-TOPITOP/src/modules/promociones/assets/cyber-hero@2x.webp")
W2, H2 = 2600, 1316

foto = np.asarray(Image.open(HERO).convert("RGB")).astype(np.float32)
fondo = np.asarray(Image.open(A / "fondo-vacio.png").convert("RGB").resize((W2, H2), Image.LANCZOS)).astype(np.float32)
alfa_ella = np.load(A / "alfa-ella.npy")
alfa_el = np.load(A / "alfa-el.npy")
alfa_brazo = np.load(A / "alfa-brazo.npy")

# --- Hombro de ella bajo el brazo de él: LaMa sobre ella sola encima del estudio vacío ---
hueco_hombro = poligono(BRAZO) & poligono(HOMBRO_ELLA)
sola = foto * alfa_ella[..., None] + fondo * (1 - alfa_ella[..., None])
caja = (700 * ESC, 180 * ESC, 956 * ESC, 436 * ESC)  # ventana cuadrada de 512 px alrededor del hombro
ventana = Image.fromarray(sola.astype(np.uint8)).crop(caja)
m = Image.fromarray((hueco_hombro * 255).astype(np.uint8)).crop(caja).filter(ImageFilter.MaxFilter(5))
sesion = ort.InferenceSession(str(S / "modelos" / "lama_fp32.onnx"), providers=["CPUExecutionProvider"])
nombres = [i.name for i in sesion.get_inputs()]
x = np.asarray(ventana).astype(np.float32).transpose(2, 0, 1)[None] / 255
mm = (np.asarray(m) > 127).astype(np.float32)[None, None]
salida = np.clip(sesion.run(None, {nombres[0]: x, nombres[1]: mm})[0][0].transpose(1, 2, 0), 0, 255)
relleno = sola.copy()
x0, y0, x1, y1 = caja
relleno[y0:y1, x0:x1] = np.where((np.asarray(m) > 127)[..., None], salida, relleno[y0:y1, x0:x1])
hombro_suave = np.asarray(Image.fromarray((hueco_hombro * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.5))).astype(np.float32) / 255
rgb_ella = foto * (1 - hombro_suave[..., None]) + relleno * hombro_suave[..., None]
alfa_ella_total = np.maximum(alfa_ella, hombro_suave)

# --- Sombra de él en la pared: cuánto oscurece la foto respecto del estudio vacío ---
SOMBRA = [(1080, 196), (1150, 192), (1205, 230), (1240, 300), (1262, 380), (1275, 470), (1278, 560), (1270, 620), (1160, 640), (1100, 600)]
zona = poligono(SOMBRA)
lum = lambda img: img @ np.array([0.299, 0.587, 0.114])  # noqa: E731
oscurece = np.clip(1 - (lum(foto) + 1) / (lum(fondo) + 1), 0, 0.92)
personas = np.maximum(np.maximum(alfa_ella, alfa_el), alfa_brazo)
alfa_sombra = oscurece * zona * (1 - personas)
alfa_sombra = np.asarray(Image.fromarray((alfa_sombra * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2))).astype(np.float32) / 255
rgb_sombra = np.zeros_like(foto) + 8


def guardar(nombre: str, rgb: np.ndarray, alfa: np.ndarray | None = None, calidad: int = 82):
    img = Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8))
    if alfa is not None:
        img = Image.merge("RGBA", (*img.split(), Image.fromarray((np.clip(alfa, 0, 1) * 255).astype(np.uint8))))
    img = img.resize((1300, 658), Image.LANCZOS)
    ruta = DESTINO / f"{nombre}.webp"
    img.save(ruta, "WEBP", quality=calidad, method=6, alpha_quality=90)
    print(f"{nombre:8} {ruta.stat().st_size // 1024} KB")


guardar("estudio", fondo, None, 80)
guardar("ella", rgb_ella, alfa_ella_total)
guardar("el", foto, alfa_el)
guardar("brazo", foto, alfa_brazo)
guardar("sombra", rgb_sombra, alfa_sombra, 70)

# Control: las capas en su lugar deben reconstruir la foto
def capa(rgb, alfa):
    return rgb, alfa[..., None]

comp = fondo.copy()
for rgb, a in (capa(rgb_sombra, alfa_sombra), capa(rgb_ella, alfa_ella_total), capa(foto, alfa_brazo), capa(foto, alfa_el)):
    comp = rgb * a + comp * (1 - a)
print("diferencia media con la foto:", np.abs(comp - foto).mean().round(2))
vista = np.concatenate([sola, rgb_ella * alfa_ella_total[..., None] + 200 * (1 - alfa_ella_total[..., None])], axis=1)
Image.fromarray(vista.astype(np.uint8)).crop((1400, 300, 1900, 900)).save(A / "control-hombro.jpg", quality=88)
