# Piel Canela — Spa & Bronceo

Landing page de **Piel Canela**, spa de bronceado brasileño en el barrio San Alonso,
Bucaramanga. Sitio estático, sin dependencias ni paso de build: se abre directamente
en el navegador.

## Estructura

```
.
├── index.html        # Página única (todas las secciones)
├── css/
│   └── styles.css    # Estilos globales, animaciones y componentes
├── js/
│   └── main.js       # Interactividad (menú, carrusel, lightbox, scroll reveal)
└── assets/           # Imágenes optimizadas usadas por el sitio
```

## Cómo verlo

Abre `index.html` en cualquier navegador, o levanta un servidor local:

```bash
# Python
python -m http.server 8000
# luego abre http://localhost:8000
```

> Un servidor local es recomendable: el iframe del mapa de Google y el `loading="lazy"`
> de las imágenes se comportan mejor por `http://` que por `file://`.

## Funcionalidades

- Header transparente que se vuelve sólido al hacer scroll.
- Navegación responsive con menú hamburguesa en móvil.
- Animaciones de entrada (scroll reveal) y revelado de imágenes (clip-path).
- Carrusel de testimonios con autoplay, flechas y puntos.
- Galería con lightbox (clic para ampliar, `Esc` o clic para cerrar).
- Marquee infinito de resultados de bronceado.
- CTAs directos a WhatsApp e Instagram.

## Personalización rápida

- **Colores:** variables CSS (`--pc-pink`, `--pc-bronze`, …) al inicio de `css/styles.css`.
- **WhatsApp:** número `573115279321` en los enlaces `wa.me` de `index.html`.
- **Textos / testimonios:** el contenido vive en `index.html`; los testimonios se
  configuran en el array `testimonials` de `js/main.js`.
- **Imágenes:** en `assets/`, en formato **WebP** (optimizadas, ~1.1 MB en total).
  Reemplázalas conservando los nombres. El hero (`hero1.webp`) se precarga como
  imagen LCP, así que conviene mantenerlo liviano.
