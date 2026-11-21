"""Máscara de las personas del hero con ISNet (ONNX)."""
import sys
from pathlib import Path

import numpy as np
import onnxruntime as ort
from PIL import Image

S = Path(sys.argv[1])
HERO = Path(r"C:/Users/ABEL1/Documents/TESIS-TOPITOP/src/modules/promociones/assets/cyber-hero@2x.webp")
OUT = S / "anim"

foto = Image.open(HERO).convert("RGB")
W, H = foto.size
sesion = ort.InferenceSession(str(S / "modelos" / "isnet-general-use.onnx"), providers=["CPUExecutionProvider"])
entrada = sesion.get_inputs()[0]

x = np.asarray(foto.resize((1024, 1024), Image.LANCZOS)).astype(np.float32) / 255.0
x = (x - np.array([0.5, 0.5, 0.5])) / np.array([1.0, 1.0, 1.0])
x = x.transpose(2, 0, 1)[None].astype(np.float32)
salida = sesion.run(None, {entrada.name: x})[0][0, 0]
salida = (salida - salida.min()) / (salida.max() - salida.min() + 1e-8)
mascara = Image.fromarray((salida * 255).astype(np.uint8)).resize((W, H), Image.LANCZOS)
mascara.save(OUT / "mascara-personas.png")

# Vista de control: personas sobre gris claro
a = np.asarray(mascara).astype(np.float32)[..., None] / 255
vista = np.asarray(foto).astype(np.float32) * a + 200 * (1 - a)
Image.fromarray(vista.astype(np.uint8)).resize((1300, 658)).save(OUT / "control-recorte.jpg", quality=85)
print("listo", W, H)
