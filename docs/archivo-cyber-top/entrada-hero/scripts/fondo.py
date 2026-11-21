"""Estudio vacío: pared y foco con un modelo liso (polinomios + borde del círculo), piso con LaMa."""
import sys
from pathlib import Path

import numpy as np
import onnxruntime as ort
from PIL import Image, ImageDraw, ImageFilter

S = Path(sys.argv[1])
A = S / "anim"
HERO = Path(r"C:/Users/ABEL1/Documents/TESIS-TOPITOP/src/modules/promociones/assets/cyber-hero@2x.webp")
W, H = 1300, 658
# Círculo del foco en la pared, ajustado a sus bordes visibles (lienzo de 1300 x 658)
CX, CY, R = 901.7, 398.2, 401.9
BORDE = 9.0
PISO = 600  # desde aquí hacia abajo es el piso

foto = Image.open(HERO).convert("RGB").resize((W, H), Image.LANCZOS)
f = np.asarray(foto).astype(np.float64)
personas = np.asarray(Image.open(A / "mascara-personas.png").convert("L").resize((W, H), Image.LANCZOS))

SOMBRA = [(1080, 196), (1150, 192), (1205, 230), (1240, 300), (1262, 380), (1275, 470), (1278, 560), (1270, 620), (1160, 640), (1100, 600)]
m_sombra = Image.new("L", (W, H), 0)
ImageDraw.Draw(m_sombra).polygon(SOMBRA, fill=255)
hueco = np.maximum(personas > 6, np.asarray(m_sombra) > 0)
hueco = hueco | (np.hypot(np.arange(W)[None, :] - 802, np.arange(H)[:, None] - 212) < 14)  # punto oscuro suelto
# Isla de pared entre las dos cabezas (con la sombra de ella): se modela lisa como el resto
isla = Image.new("L", (W, H), 0)
ImageDraw.Draw(isla).rectangle([790, 90, 910, 235], fill=255)
hueco = hueco | (np.asarray(isla) > 0)
hueco_img = Image.fromarray((hueco * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(27))
hueco = np.asarray(hueco_img) > 127
hueco_img.save(A / "hueco.png")

Y, X = np.mgrid[0:H, 0:W].astype(np.float64)
r = np.hypot(X - CX, Y - CY)
xn, yn = X / W, Y / H


def terminos(xs, ys, grado=2):
    cols = [xs ** i * ys ** j for i in range(grado + 1) for j in range(grado + 1 - i)]
    return np.stack(cols, axis=-1)


def ajustar(zona):
    """Ajuste por mínimos cuadrados de cada canal sobre los píxeles visibles de la zona."""
    idx = zona & ~hueco
    T = terminos(xn[idx], yn[idx])
    modelo = np.zeros((H, W, 3))
    Tt = terminos(xn, yn)
    for c in range(3):
        coef, *_ = np.linalg.lstsq(T, f[..., c][idx], rcond=None)
        modelo[..., c] = Tt @ coef
    return modelo


pared = Y < PISO - 4
interior = ajustar(pared & (r < R - 2.5 * BORDE))
exterior = ajustar(pared & (r > R + 2.5 * BORDE))
t = np.clip((R - r) / (2 * BORDE) + 0.5, 0, 1)
t = t * t * (3 - 2 * t)
modelo = interior * t[..., None] + exterior * (1 - t[..., None])


def armonico(campo, conocido, iters=(500, 400, 300, 300)):
    """Interpola el campo dentro del hueco con la solución de Laplace (empata con el borde)."""
    res = None
    for esc, it in zip((8, 4, 2, 1), iters):
        h, w = H // esc, W // esc
        cm = campo.reshape(h, esc, w, esc, 3).mean(axis=(1, 3)) if esc > 1 else campo
        kn = conocido.reshape(h, esc, w, esc).all(axis=(1, 3)) if esc > 1 else conocido
        if res is None:
            res = np.where(kn[..., None], cm, cm[kn].mean(axis=0))
        else:
            res = np.repeat(np.repeat(res, 2, axis=0), 2, axis=1)[:h, :w]
            res = np.where(kn[..., None], cm, res)
        for _ in range(it):
            p = np.pad(res, ((1, 1), (1, 1), (0, 0)), mode='edge')
            prom = (p[:-2, 1:-1] + p[2:, 1:-1] + p[1:-1, :-2] + p[1:-1, 2:]) / 4
            res = np.where(kn[..., None], cm, prom)
    return res


# El tamaño debe ser divisible por 8 para las escalas: se trabaja con 1304 x 664 y se recorta.
Hp, Wp = 664, 1304
residuo = np.zeros((Hp, Wp, 3)); residuo[:H, :W] = f - modelo
# Solo la pared impone valores: el piso oscuro no debe arrastrar sombra hacia el foco.
conocido = np.zeros((Hp, Wp), bool); conocido[:H, :W] = ~hueco & (Y < PISO - 4)
H0, W0 = H, W
H, W = Hp, Wp
residuo = armonico(residuo, conocido)[:H0, :W0]
H, W = H0, W0
# La corrección empata con el borde y se apaga hacia adentro: lejos del borde manda el modelo liso.
import cv2
distancia = cv2.distanceTransform(hueco.astype(np.uint8), cv2.DIST_L2, 5)
# Solo en la esquina inferior derecha (borde del foco tapado por la sombra de él), con transición suave.
esquina = np.clip((X - 1120) / 50, 0, 1) * np.clip((Y - 340) / 50, 0, 1)
peso = (1 - esquina * (1 - np.exp(-distancia / 30.0)))[..., None]
modelo = modelo + residuo * peso

# Piso: LaMa sobre toda la imagen (el piso tiene su propio brillo y reflejo)
sesion = ort.InferenceSession(str(S / "modelos" / "lama_fp32.onnx"), providers=["CPUExecutionProvider"])
nombres = [i.name for i in sesion.get_inputs()]
x = np.asarray(foto.resize((512, 512), Image.LANCZOS)).astype(np.float32).transpose(2, 0, 1)[None] / 255
m = (np.asarray(hueco_img.resize((512, 512), Image.NEAREST)) > 127).astype(np.float32)[None, None]
lama = sesion.run(None, {nombres[0]: x, nombres[1]: m})[0][0].transpose(1, 2, 0)
lama = np.asarray(Image.fromarray(np.clip(lama, 0, 255).astype(np.uint8)).resize((W, H), Image.LANCZOS)).astype(np.float64)

paso = np.clip((Y - (PISO - 8)) / 14, 0, 1)[..., None]
relleno = modelo * (1 - paso) + lama * paso

suave = np.asarray(hueco_img.filter(ImageFilter.GaussianBlur(5))).astype(np.float64)[..., None] / 255
rng = np.random.default_rng(3)
grano = rng.normal(0, 1.7, (H, W))[..., None]
fondo = f * (1 - suave) + (relleno + grano) * suave
Image.fromarray(np.clip(fondo, 0, 255).astype(np.uint8)).save(A / "fondo-vacio.png")
print("listo; residuo interior", np.abs((interior - f)[pared & (r < R - 25) & ~hueco]).mean().round(2))
