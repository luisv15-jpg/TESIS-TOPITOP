"""Divide a las personas en capas: ella, él y el brazo de él. Coordenadas del lienzo 1300 x 658."""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

S = Path(sys.argv[1])
A = S / "anim"
HERO = Path(r"C:/Users/ABEL1/Documents/TESIS-TOPITOP/src/modules/promociones/assets/cyber-hero@2x.webp")
ESC = 2  # se trabaja en 2x (2600 x 1316) y se exporta en 1x y 2x
W, H = 1300 * ESC, 658 * ESC

# Límite entre el brazo derecho de ella (puffer) y el cuerpo de él
LIMITE = [(872, 0), (874, 236), (872, 300), (866, 330), (871, 400), (873, 480), (871, 530), (866, 550), (856, 562), (852, 575), (852, 658)]
# Brazo de él apoyado en el hombro de ella: manga y mano
BRAZO = [(770, 250), (782, 238), (810, 232), (850, 228), (878, 232), (884, 252), (880, 290), (872, 318), (858, 326), (838, 322),
         (822, 310), (815, 288), (800, 282), (780, 278), (768, 266)]
# Hombro de ella bajo el brazo de él (se reconstruye)
HOMBRO_ELLA = [(768, 266), (780, 278), (800, 282), (815, 288), (835, 292), (858, 296), (872, 300), (872, 330), (768, 330)]
PIVOTE_BRAZO = (878, 258)  # hombro de él


def poligono(puntos, ancho=W, alto=H):
    m = Image.new("L", (ancho, alto), 0)
    ImageDraw.Draw(m).polygon([(x * ESC, y * ESC) for x, y in puntos], fill=255)
    return np.asarray(m) > 0


def izquierda_de(linea):
    """Máscara de lo que queda a la izquierda de la polilínea (de arriba a abajo)."""
    puntos = linea + [(0, 658), (0, 0)]
    return poligono(puntos)


if __name__ == "__main__":
    foto = Image.open(HERO).convert("RGB")
    personas = np.asarray(Image.open(A / "mascara-personas.png").convert("L")).astype(np.float32) / 255

    brazo = poligono(BRAZO)
    izq = izquierda_de(LIMITE)
    ella = personas * (izq & ~brazo)
    el = personas * (~izq & ~brazo)
    m_brazo = personas * brazo

    # Vista de control con los cortes dibujados
    vista = foto.copy()
    d = ImageDraw.Draw(vista)
    d.line([(x * ESC, y * ESC) for x, y in LIMITE], fill=(255, 0, 0), width=2)
    d.line([(x * ESC, y * ESC) for x, y in BRAZO + BRAZO[:1]], fill=(0, 255, 255), width=2)
    d.line([(x * ESC, y * ESC) for x, y in HOMBRO_ELLA + HOMBRO_ELLA[:1]], fill=(255, 255, 0), width=1)
    px, py = PIVOTE_BRAZO
    d.ellipse([(px - 4) * ESC, (py - 4) * ESC, (px + 4) * ESC, (py + 4) * ESC], outline=(0, 255, 0), width=2)
    vista.crop((740 * ESC, 200 * ESC, 960 * ESC, 620 * ESC)).point(lambda v: min(255, int(v * 1.5))).save(A / "control-cortes.jpg", quality=88)
    for nombre, alfa in (("ella", ella), ("el", el), ("brazo", m_brazo)):
        np.save(A / f"alfa-{nombre}.npy", alfa.astype(np.float32))
    print("listo")
