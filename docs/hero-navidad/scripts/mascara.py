"""Máscara de los elementos de interfaz del diseño navideño (logo, menú, buscador, iconos, títulos, flecha)."""
import sys
from pathlib import Path
import numpy as np
import cv2
from PIL import Image

D = Path(sys.argv[1])
a = np.asarray(Image.open(D / "diseno.png").convert("RGB"))
# Recorte del marco gris de la captura: contenido útil x 5..1357, y 6..690
img = a[6:691, 5:1358].copy()
H, W = img.shape[:2]
Image.fromarray(img).save(D / "foto-recortada.png")
OX, OY = 5, 6  # para pasar coordenadas de la captura al recorte

gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY).astype(int)
fondo = cv2.medianBlur(gray.astype(np.uint8), 41).astype(int)
r, g, b = [img[..., i].astype(int) for i in range(3)]

def caja(x0, y0, x1, y1):
    m = np.zeros((H, W), bool)
    m[y0 - OY:y1 - OY, x0 - OX:x1 - OX] = True
    return m

def dil(m, k):
    return cv2.dilate(m.astype(np.uint8) * 255, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k))) > 0

claro = (gray - fondo) > 10
rojo = (r > 120) & (r - g > 60) & (r - b > 60)
oscuro = (fondo - gray) > 35

m = np.zeros((H, W), bool)
# Logo (letras blancas y guion rojo)
m |= dil((claro | rojo) & caja(80, 48, 205, 100), 7)
# Menú de categorías
m |= dil(claro & caja(255, 58, 770, 86), 7)
# Buscador: la píldora entera
pildora = np.zeros((H, W), np.uint8)
cv2.rectangle(pildora, (830 - OX, 50 - OY), (1078 - OX, 92 - OY), 255, -1)
m |= pildora > 0
# Iconos de pedidos, cuenta y bolsa
m |= dil(claro & caja(1095, 52, 1290, 92), 7)
# Título rojo y subtítulo negro
m |= dil(rojo & caja(55, 200, 680, 290), 7)
m |= dil(oscuro & caja(55, 300, 510, 352), 7)
# Flecha: círculo blanco con su sombra
flecha = np.zeros((H, W), np.uint8)
cv2.circle(flecha, (694 - OX, 644 - OY), 31, 255, -1)
m |= flecha > 0

mask = (m * 255).astype(np.uint8)
Image.fromarray(mask).save(D / "mascara.png")
ver = img.copy()
ver[m] = (0.4 * ver[m] + 0.6 * np.array([0, 255, 0])).astype(np.uint8)
Image.fromarray(ver).save(D / "mascara-ver.png")
print("recorte", W, H, "pixeles en máscara", int(m.sum()))
