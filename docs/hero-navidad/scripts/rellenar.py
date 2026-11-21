"""Borra la interfaz del diseño con LaMa en ventanas de 512 px a la resolución original."""
import sys
from pathlib import Path
import numpy as np
import cv2
import onnxruntime as ort
from PIL import Image

D = Path(sys.argv[1])
MODELOS = Path(sys.argv[2])
img = np.asarray(Image.open(D / "foto-recortada.png").convert("RGB")).astype(np.float32)
pend = np.asarray(Image.open(D / "mascara.png")) > 127
H, W = pend.shape
S = 512
MARGEN = 24

sesion = ort.InferenceSession(str(MODELOS / "lama_fp32.onnx"), providers=["CPUExecutionProvider"])
entradas = [e.name for e in sesion.get_inputs()]

n, etiquetas, stats, centros = cv2.connectedComponentsWithStats(pend.astype(np.uint8))
orden = sorted(range(1, n), key=lambda i: (stats[i, 1] // 120, stats[i, 0]))

for i in orden:
    if not (etiquetas == i).any() or not pend[etiquetas == i].any():
        continue
    x, y, w, h = stats[i, :4]
    cx, cy = x + w / 2, y + h / 2
    x0 = int(np.clip(cx - S / 2, 0, W - S))
    y0 = int(np.clip(cy - S / 2, 0, H - S))
    ventana = img[y0:y0 + S, x0:x0 + S]
    m = pend[y0:y0 + S, x0:x0 + S]
    entrada = ventana.transpose(2, 0, 1)[None] / 255.0
    salida = sesion.run(None, {entradas[0]: entrada.astype(np.float32), entradas[1]: m.astype(np.float32)[None, None]})[0][0]
    salida = np.clip(salida.transpose(1, 2, 0), 0, 255)
    # Se fija solo lo que queda lejos del borde de la ventana (salvo el borde de la imagen)
    interior = np.zeros((S, S), bool)
    a0 = 0 if y0 == 0 else MARGEN
    b0 = 0 if x0 == 0 else MARGEN
    a1 = S if y0 + S == H else S - MARGEN
    b1 = S if x0 + S == W else S - MARGEN
    interior[a0:a1, b0:b1] = True
    fijar = m & interior
    ventana[fijar] = salida[fijar]
    pend[y0:y0 + S, x0:x0 + S][fijar] = False
    print(f"componente {i}: ventana ({x0},{y0}) fijados {int(fijar.sum())}, quedan {int(pend.sum())}")

assert not pend.any(), "quedaron píxeles sin rellenar"
Image.fromarray(img.astype(np.uint8)).save(D / "foto-limpia.png")
print("listo", W, H)
