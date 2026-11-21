# Publicar la demo en la VPS

La demo se sirve como archivos estáticos en una **ruta oculta** del dominio de la empresa, por
ejemplo `https://empresoftperu.com/<ruta-oculta>/`. La ruta lleva 14 caracteres al azar y no
figura en ningún menú, `robots.txt` ni sitemap. La página y sus archivos llevan `noindex`
(meta y cabecera `X-Robots-Tag`) y `Referrer-Policy: no-referrer`, para que el enlace no se filtre
al pulsar una red social. La ruta real no se guarda en este repositorio.

Es un enlace oculto, no privado: quien lo tenga puede abrirlo. Para que pida clave, agrega
`auth_basic` al bloque de nginx de abajo.

## Compilar para la subruta

```bash
VITE_BASE=/<ruta-oculta>/ pnpm build
```

`VITE_BASE` cambia la base de Vite, y con ella las rutas de JS, CSS e imágenes. El router usa la
misma base (`import.meta.env.BASE_URL`), así que los enlaces internos quedan dentro de la ruta.
En PowerShell: `$env:VITE_BASE='/<ruta-oculta>/'; pnpm build`.

En Git Bash, anteponer `MSYS_NO_PATHCONV=1`. Si no, Git Bash convierte `/<ruta-oculta>/` en
`C:/Program Files/Git/<ruta-oculta>/` y el build sale con esas rutas.

## Subir

Los archivos van a `/var/www/TOPITOP-DEMO/<ruta-oculta>/`:

```bash
tar -czf dist.tgz -C dist .
scp dist.tgz vps-empresoft:/tmp/topitop-dist.tgz
ssh vps-empresoft 'set -e; D=/var/www/TOPITOP-DEMO/<ruta-oculta>; \
  [ -d "$D" ] && mv "$D" "$D.antes-$(date +%Y%m%d%H%M%S)"; mkdir -p "$D"; \
  tar -xzf /tmp/topitop-dist.tgz -C "$D"; chown -R www-data:www-data /var/www/TOPITOP-DEMO; rm /tmp/topitop-dist.tgz'
```

Si el despliegue anterior quedó guardado como `.antes-*`, bórralo cuando la nueva versión esté
comprobada (`/usr/local/sbin/dejar-ultimo '/var/www/TOPITOP-DEMO/<ruta-oculta>.antes-*'`).

## nginx (una sola vez)

`/etc/nginx/snippets/topitop-demo.conf`, incluido en el bloque `server` 443 de
`/etc/nginx/sites-enabled/empresoftperu`, antes de `location /`:

```nginx
location = /<ruta-oculta> { return 301 /<ruta-oculta>/; }

# JS, CSS e imágenes llevan hash en el nombre: se guardan un año
location ^~ /<ruta-oculta>/assets/ {
    root /var/www/TOPITOP-DEMO;
    add_header Cache-Control "public, max-age=31536000, immutable" always;
    add_header X-Robots-Tag "noindex, nofollow" always;
    try_files $uri =404;
}

# La app: toda ruta sin archivo (/hombre, /carrito…) devuelve index.html
location ^~ /<ruta-oculta>/ {
    root /var/www/TOPITOP-DEMO;
    add_header Cache-Control "no-cache" always;
    add_header X-Robots-Tag "noindex, nofollow" always;
    add_header Referrer-Policy "no-referrer" always;
    add_header X-Content-Type-Options "nosniff" always;
    try_files $uri $uri/ /<ruta-oculta>/index.html;
}
```

Antes de recargar nginx, respalda el sitio y prueba la configuración:

```bash
cp /etc/nginx/sites-enabled/empresoftperu /root/nginx-empresoftperu-antes-topitop-$(date +%Y%m%d%H%M%S).conf
nginx -t && systemctl reload nginx
```

El respaldo va en `/root/`, no en `sites-enabled/`: nginx carga todo lo que hay en esa carpeta.
