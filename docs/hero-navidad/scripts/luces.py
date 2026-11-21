"""Capas de luces del árbol: los puntos brillantes cálidos, con su halo, en tres grupos que titilan por turnos.

Uso: python luces.py <carpeta> [x0 y0 x1 y1]
  <carpeta> tiene foto-limpia.png. La caja opcional es la zona del árbol en píxeles de la foto
  (por omisión, la de la foto original de 1376 × 768). Guarda luces-1/2/3.webp recortadas a esa
  caja e imprime la caja para copiarla en campanias.ts.
"""
import sys
from pathlib import Path
import numpy as np
import cv2
from PIL import Image

D = Path(sys.argv[1])
X0, Y0, X1, Y1 = (int(v) for v in sys.argv[2:6]) if len(sys.argv) >= 6 else (1228, 96, 1376, 510)
HALO = 16  # margen para que el halo de las luces del borde no quede cortado

img = np.asarray(Image.open(D / "foto-limpia.png").convert("RGB")).astype(np.float32)
H, W = img.shape[:2]
X1, Y1 = min(X1, W), min(Y1, H)
lum = cv2.cvtColor(img.astype(np.uint8), cv2.COLOR_RGB2GRAY).astype(np.float32)
local = cv2.medianBlur(lum.astype(np.uint8), 15).astype(np.float32)
r, g, b = img[..., 0], img[..., 1], img[..., 2]

zona = np.zeros((H, W), bool)
zona[Y0:Y1, X0:X1] = True

calido = (r >= g) & (g >= b * 0.85)
punto = zona & calido & (lum > 175) & (lum - local > 22)
punto = cv2.morphologyEx(punto.astype(np.uint8), cv2.MORPH_OPEN, np.ones((2, 2), np.uint8)) > 0

n, etiquetas, stats, centros = cv2.connectedComponentsWithStats(punto.astype(np.uint8))
rng = np.random.default_rng(7)
grupo = rng.integers(0, 3, size=n)
grande = stats[:, cv2.CC_STAT_AREA] > 25
grupo[grande] = -1  # brillos de bolas y adornos, no luces
grupo[0] = -1
punto &= ~np.isin(etiquetas, np.nonzero(grande)[0])
print("luces detectadas", n - 1)

# Caja de salida: la zona más el margen del halo, dentro de la foto
cx0, cy0 = max(0, X0 - HALO), max(0, Y0 - HALO)
cx1, cy1 = min(W, X1 + HALO), min(H, Y1 + HALO)

for k in range(3):
    m = np.isin(etiquetas, np.nonzero(grupo == k)[0]) & punto
    nucleo = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 1.2)
    halo = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 5.0) * 6.0
    alfa = np.clip(nucleo * 1.6 + halo, 0, 1)
    color = np.zeros((H, W, 3), np.float32)
    color[...] = (255, 214, 150)  # luz cálida
    capa = Image.fromarray(np.dstack([color, alfa * 255]).astype(np.uint8), "RGBA").crop((cx0, cy0, cx1, cy1))
    capa.save(D / f"luces-{k + 1}.webp", quality=80, method=6)
    print("grupo", k + 1, int(m.sum()), "px")

print(f"caja: {{ x: {cx0}, y: {cy0}, ancho: {cx1 - cx0}, alto: {cy1 - cy0} }}")

ver = img.copy()
ver[punto] = (0, 255, 0)
Image.fromarray(ver.astype(np.uint8)).crop((cx0, cy0, cx1, cy1)).resize(((cx1 - cx0) * 2, (cy1 - cy0) * 2)).save(D / "luces-ver.png")
