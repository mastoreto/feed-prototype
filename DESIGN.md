---
name: Feed Prototype
description: "Hoja de pruebas de imprenta para simular feeds de Instagram y LinkedIn: reglas negras, esquinas rectas, un campo de cobalto y anotaciones a bolígrafo rojo."
colors:
  cobalt: "#2b3bff"
  on-cobalt: "#ffffff"
  red-pen: "#c8310a"
  ink: "#0a0c14"
  ink-muted: "#4a5063"
  hairline: "#c6cad6"
  paper: "#ffffff"
  desk: "#e8eaf0"
  bar: "#0a0c14"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(44px, 9.2vw, 96px)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 118"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(28px, 4.4vw, 52px)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 118"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 112"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "DM Mono, ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.07em"
rounded:
  none: "0px"
  full: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  touch: "44px"
components:
  button-primary:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.on-cobalt}"
    rounded: "{rounded.none}"
    padding: "10px 16px"
    height: "44px"
  button-default:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "10px 16px"
    height: "44px"
  button-default-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  segmented-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "6px 13px"
    height: "44px"
  chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "1px 8px"
  pin:
    backgroundColor: "{colors.red-pen}"
    textColor: "{colors.on-cobalt}"
    rounded: "{rounded.full}"
    size: "24px"
---

# Design System: Feed Prototype

## Overview

**Creative North Star: "La hoja de pruebas"**

Feed Prototype se ve como una prueba de imprenta que un diseñador revisa con el cliente: papel blanco sobre una mesa gris azulada, reglas negras de 1,5 px que ordenan la información, esquinas rectas, un único campo de cobalto y anotaciones en bolígrafo rojo. Las redes sociales simuladas son lo único que imita a otro producto; todo lo demás habla con esta voz de imprenta.

La interfaz es plana y segura de sí misma. Una sola familia tipográfica extendida (Archivo, con su eje de ancho) hace de titular, de cuerpo y de rótulo; el mono (DM Mono) se reserva para medidas, etiquetas y números. El color es contenido, no decoración: el cobalto marca el campo principal y la acción primaria, el rojo marca lo que el cliente debe mirar.

Es una herramienta de trabajo en móvil primero: cada control mide al menos 44 px, el lienzo manda y los paneles se pliegan para no tapar la pieza.

**Key Characteristics:**
- Reglas de tinta de 1,5 px en lugar de tarjetas, sombras o fondos de color.
- Esquinas rectas; el círculo se reserva a avatares y pines numerados.
- Titulares en mayúsculas extendidas (ancho 118) con tracking negativo.
- Un solo campo de cobalto por pantalla; el rojo solo para anotaciones.
- Modo claro y oscuro con los mismos roles; las barras siempre más oscuras que la página.

## Colors

Paleta de pocos colores con dos protagonistas: cobalto y rojo bolígrafo, sobre neutros fríos teñidos de azul.

### Primary
- **Cobalto de imprenta** (`#2b3bff`, oscuro `#8b96ff`): campo grande del hero, fondo del login, capa del muro de bloqueadores, botón primario y estado enfocado de los campos. En oscuro se aclara a lavanda y el texto sobre él pasa a `#07092b`.

### Secondary
- **Rojo bolígrafo** (`#c8310a`, oscuro `#ff6a3d`): pines numerados, notas para el cliente, errores, acciones destructivas y el número de pasos. Contraste 5,4:1 sobre blanco. Es la firma del producto.

### Neutral
- **Tinta** (`#0a0c14`, oscuro `#eef0f8`): texto, reglas de 1,5 px y estado activo de selectores.
- **Tinta atenuada** (`#4a5063`, oscuro `#9aa1b7`): texto secundario, etiquetas, contadores.
- **Línea fina** (`#c6cad6`, oscuro `#2a3042`): divisores suaves, bordes de elementos no seleccionados.
- **Papel** (`#ffffff`, oscuro `#10131d`): superficie de trabajo y contenido.
- **Mesa** (`#e8eaf0`, oscuro `#07080f`): fondo del lienzo y de la página.
- **Barra** (`#0a0c14`, oscuro `#03040a`): menú lateral, cabeceras y pie; siempre más oscura que la página en ambos modos.

### Named Rules
**The One Cobalt Field Rule.** Cada pantalla tiene como mucho un campo grande de cobalto. Los botones primarios son la excepción, no un segundo campo.

**The Red Pen Rule.** El rojo solo anota: pines, notas para el cliente, errores y acciones destructivas. Nunca decora ni rellena superficies.

**The Bar Rule.** Las barras usan `--bar`, no `--ink`. En oscuro, `--ink` es casi blanco y una barra hecha con él se invierte en un bloque claro.

## Typography

**Display Font:** Archivo (con `system-ui` de respaldo), eje de ancho 118%
**Body Font:** Archivo, ancho normal
**Label/Mono Font:** DM Mono

**Character:** Una grotesca extendida de imprenta que grita en los titulares y se calma en el cuerpo, con un mono técnico para todo lo que se mide.

### Hierarchy
- **Display** (800, `clamp(44px, 9.2vw, 96px)`, 0.95): titular del hero y de pantallas de error. Siempre en mayúsculas, ancho 118, tracking -0,025em.
- **Headline** (800, `clamp(28px, 4.4vw, 52px)`, 0.95): títulos de sección y de página. Mismo tratamiento que Display.
- **Title** (700, 18–22px, 1.15): nombres de cliente, de campaña y de pasos; ancho 108–112.
- **Body** (400, 15–16px, 1.5): texto corrido; medida máxima 60–72ch. Los campos usan 16px para que iOS no haga zoom.
- **Label** (DM Mono 500, 11px, 0.07em, mayúsculas): rótulos de campo, medidas, estados ("GUARDADO") y la etiqueta "PUBLICIDAD".

### Named Rules
**The Extended Caps Rule.** Solo `h1` y `h2` van en mayúsculas extendidas. Títulos menores y cuerpo mantienen mayúsculas y minúsculas para leerse.

**The Mono Is Measurement Rule.** DM Mono es para medidas, contadores, estados y etiquetas. Nunca para texto corrido ni como disfraz de lo "técnico".

## Layout

Móvil primero. El contenedor de la app es fluido y se divide a 768 px (`md`): por debajo, una columna con el lienzo primero, la tira de piezas, el anuncio y la hoja del inspector fija abajo; por encima, tres columnas (piezas 240 px, lienzo, inspector 340 px). El panel y las pantallas de cliente usan menú lateral de 200 px en escritorio y barra de pestañas fija abajo en móvil.

El ritmo se apoya en reglas: filas separadas por líneas de 1,5 px con relleno vertical de 12–16 px; separaciones grandes de sección de 40–84 px. Los márgenes laterales son 16 px en móvil y 56 px en las páginas de marketing.

Todo objetivo interactivo mide al menos 44×44 px en móvil. Los espacios de anuncio reservan su altura en CSS para no provocar desplazamiento de diseño.

## Elevation & Depth

La interfaz es plana por defecto: la jerarquía sale de las reglas de 1,5 px, del contraste y de la alternancia entre mesa, papel y barra, no de sombras. Solo dos elementos llevan sombra: las redes simuladas (que copian a los productos reales) y la hoja del inspector móvil, que flota sobre el lienzo.

### Shadow Vocabulary
- **Hoja flotante** (`box-shadow: 0 -12px 24px -16px rgba(0,0,0,.45)`): el inspector móvil sobre el lienzo.
- **Red simulada** (`box-shadow: 0 1px 3px rgba(0,0,0,.18), 0 10px 28px -12px rgba(0,0,0,.28)`): solo dentro de las piezas simuladas.

### Named Rules
**The Flat-By-Default Rule.** Ningún componente de la interfaz lleva sombra en reposo. Si necesita separarse, usa una regla o un cambio de superficie.

## Shapes

Esquinas rectas en toda la interfaz (0 px): botones, campos, selectores, chips, diálogos y hojas. El círculo se reserva a avatares y pines numerados. Las marcas de corte en las esquinas del lienzo (L de 16 px, línea de 1,5 px) enmarcan la pieza en escritorio. Las simulaciones de red conservan sus propias esquinas redondeadas porque imitan al producto real.

### Named Rules
**The Square Corners Rule.** Ningún `border-radius` en la interfaz propia. Los redondeos pertenecen a las redes simuladas.

## Components

### Buttons
- **Shape:** rectángulo recto (0 px), borde de tinta de 1,5 px, alto mínimo 44 px.
- **Primary:** fondo cobalto, texto blanco, relleno 10×16 px, peso 600.
- **Default:** transparente con borde de tinta; al pasar el cursor se invierte a tinta sólida con texto de papel.
- **On cobalt:** botón blanco con texto `#0a0c14` sobre campos de cobalto.
- **Press:** `transform: scale(0.97)` en 160 ms; sin animación de color más allá de 150 ms.

### Segmented control
- **Style:** grupo con borde de tinta de 1,5 px y divisores internos; el activo se rellena de tinta con texto de papel.
- **Uso:** red social, formatos de pieza, escala de exportación. En móvil el inspector usa pestañas con subrayado de cobalto de 4 px en lugar de este control.

### Chips
- **Style:** borde de tinta de 1 px, mono 10,5px en mayúsculas, relleno 1×8 px, sin radio.

### Inputs / Fields
- **Style:** línea inferior de tinta de 1,5 px sobre fondo transparente; los de varias líneas llevan caja completa.
- **Focus:** la línea inferior pasa a cobalto con sombra de 2 px de la misma tinta; sin contorno doble.
- **Error / Disabled:** el error usa rojo bolígrafo; el deshabilitado baja la opacidad a 0,5.

### Navigation
- **Escritorio:** riel lateral de 200 px sobre `--bar`; el elemento activo se rellena de cobalto.
- **Móvil:** barra inferior fija sobre `--bar` con iconos de 22 px y etiqueta de 11 px; el activo lleva una línea roja superior de 3 px.

### Pines y notas (componente firma)
Círculo de 24 px en rojo bolígrafo con número mono, anclado al borde izquierdo de la pieza, que remite a la lista numerada de la hoja ampliada. La nota para el cliente es una caja de borde y texto rojos, en cursiva, con rótulo mono.

### Espacio de anuncio
Caja de borde fino con trama diagonal, etiqueta "PUBLICIDAD" en mono sobre tinta atenuada, tamaño reservado (728×90, 320×50, 300×250 o 336×280). Nunca dentro del lienzo ni de la imagen exportada.

## Do's and Don'ts

### Do:
- **Do** separar con reglas de tinta de 1,5 px antes de recurrir a tarjetas, fondos o sombras.
- **Do** mantener todo objetivo táctil en 44×44 px como mínimo en móvil.
- **Do** usar `--bar` para barras, nunca `--ink`, para que funcionen en claro y oscuro.
- **Do** reservar la altura de cada espacio de anuncio en CSS.
- **Do** dejar que el rojo bolígrafo señale solo lo que el cliente debe mirar o corregir.
- **Do** mover el lienzo con una transición de 180 ms (opacidad, escala 0,985, desenfoque 2 px) y respetar `prefers-reduced-motion`.

### Don't:
- **Don't** añadir `border-radius` a botones, campos, chips ni diálogos propios.
- **Don't** usar degradados, sombras en reposo ni tarjetas anidadas en la interfaz.
- **Don't** poner un segundo campo grande de cobalto en la misma pantalla.
- **Don't** usar rojo para decorar ni para rellenar superficies.
- **Don't** usar mayúsculas extendidas fuera de `h1` y `h2`.
- **Don't** colocar anuncios sobre el lienzo, en el diálogo de exportación ni en la imagen descargada.
- **Don't** reproducir logotipos de Instagram o LinkedIn: las redes simuladas copian la estructura con iconos genéricos.
