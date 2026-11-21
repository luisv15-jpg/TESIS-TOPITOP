"""Brazo de él colgando mientras camina: su brazo izquierdo (mano en el bolsillo) espejado al otro lado."""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

S = Path(sys.argv[1])
A = S / "anim"
HERO = Path(r"C:/Users/ABEL1/Documents/TESIS-TOPITOP/src/modules/promociones/assets/cyber-hero@2x.webp")
DESTINO = Path(r"C:/Users/ABEL1/Documents/TESIS-TOPITOP/src/modules/promociones/assets/entrada")
ESC = 2
# Brazo izquierdo de él (a la derecha de la foto), con la mano en el bolsillo
BRAZO_IZQ = [(1075, 248), (1100, 252), (1125, 290), (1140, 330), (1150, 390), (1152, 440), (1145, 490), (1130, 525),
             (1112, 548), (1070, 560), (1035, 565), (995, 560), (990, 545), (1020, 525), (1040, 505), (1060, 480),
             (1068, 420), (1070, 350), (1068, 290), (1070, 260)]
# Eje entre sus dos hombros: el brazo espejado nace en su hombro derecho
EJE_X = 984

foto = Image.open(HERO).convert("RGB")
personas = Image.open(A / "mascara-personas.png").convert("L")
m = Image.new("L", foto.size, 0)
ImageDraw.Draw(m).polygon([(x * ESC, y * ESC) for x, y in BRAZO_IZQ], fill=255)
alfa = np.minimum(np.asarray(m), np.asarray(personas))

rgba = np.dstack([np.asarray(foto), alfa]).astype(np.uint8)
# Espejo horizontal respecto del eje: x' = 2 * eje - x
espejo = np.zeros_like(rgba)
eje = EJE_X * ESC
xs = np.arange(rgba.shape[1])
destino = 2 * eje - xs
validos = (destino >= 0) & (destino < rgba.shape[1])
espejo[:, destino[validos]] = rgba[:, xs[validos]]

img = Image.fromarray(espejo, "RGBA").resize((1300, 658), Image.LANCZOS)
ruta = DESTINO / "brazo-colgando.webp"
img.save(ruta, "WEBP", quality=82, method=6, alpha_quality=90)
print("brazo-colgando", ruta.stat().st_size // 1024, "KB")
