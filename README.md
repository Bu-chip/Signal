# 🌆 SIGNAL - Synthwave Runner

Un juego retro/synthwave donde eres una señal digital navegando por un sistema de transmisión corrupto de los años 80/90.

![Aesthetic: Hotline Miami meets Geometry Dash](https://img.shields.io/badge/Style-Synthwave-ff006e?style=for-the-badge)
![Platform: Web](https://img.shields.io/badge/Platform-Browser-00f3ff?style=for-the-badge)

---

## 🎮 CÓMO JUGAR

### Controles
- **⬆⬇⬅➡** o **WASD**: Mover la señal
- **BARRA ESPACIADORA**: Activar **PHASE SHIFT** (invencibilidad temporal)

### Objetivo
Sobrevive el mayor tiempo posible esquivando la corrupción de datos y las interferencias.

### Mecánicas
- **Auto-scroll**: El mundo se mueve automáticamente de izquierda a derecha
- **Phase Shift**: Te vuelve invencible por 0.5 segundos (cooldown de 2 segundos)
  - **IMPORTANTE**: Usar Phase Shift resetea tu combo
- **Combos**: Esquiva obstáculos consecutivos SIN usar Phase Shift para multiplicar tu puntuación
- **Dificultad progresiva**: Cada 10 segundos aumenta la velocidad y cantidad de obstáculos

---

## 🎨 ESTÉTICA

### Visual
- **Fondo**: Grid de perspectiva neón (estilo synthwave clásico)
- **Colores**: Cyan (`#00f3ff`), Rosa neón (`#ff006e`), Púrpura (`#8b00ff`)
- **Efectos**:
  - Scanlines CRT horizontales
  - Trail luminoso detrás del jugador
  - Glitch VHS al colisionar
  - Distorsión de pantalla en game over

### Obstáculos
- **Bloques**: Cuadrados sólidos con líneas de interferencia
- **Barras**: Interferencia horizontal animada
- **Glitch**: Fragmentos distorsionados

---

## 🎵 MÚSICA (OPCIONAL)

El juego está listo para agregar tu track synthwave favorito.

### Cómo agregar música:

1. **Crea una carpeta `audio/`** en el directorio del proyecto
2. **Agrega tu archivo de música** (formato MP3, OGG o WAV):
   ```
   Signal/
   ├── audio/
   │   └── synthwave.mp3
   ├── index.html
   ├── style.css
   └── game.js
   ```
3. **Descomenta las líneas en `index.html`** (líneas 77-79):
   ```html
   <audio id="bgMusic" loop>
       <source src="audio/synthwave.mp3" type="audio/mpeg">
   </audio>
   ```
4. **Agrega este código en `game.js`** (después de la línea 562, donde se hace clic en "Start"):
   ```javascript
   document.getElementById('startBtn').addEventListener('click', () => {
       document.getElementById('startScreen').style.display = 'none';
       document.getElementById('hud').style.display = 'flex';
       game.state = 'playing';

       // Reproducir música
       const music = document.getElementById('bgMusic');
       if (music) {
           music.volume = 0.5; // Ajusta el volumen (0.0 a 1.0)
           music.play();
       }
   });
   ```

### Tracks recomendados (búscalos en YouTube/Spotify):
- **The Midnight** - "Endless Summer", "Sunset"
- **Timecop1983** - "On the Run"
- **FM-84** - "Running in the Night"
- **Perturbator** - "Humans Are Such Easy Prey"
- **Carpenter Brut** - "Turbo Killer"

---

## 🚀 INSTALACIÓN

### Opción 1: Local
1. Abre `index.html` directamente en tu navegador

### Opción 2: Servidor local
```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (http-server)
npx http-server
```
Luego abre: `http://localhost:8000`

---

## 🎯 PUNTUACIÓN

- **Distancia**: Metros recorridos (aumenta con el tiempo)
- **Combos**: Esquivas consecutivas sin Phase Shift
  - x5 combo = Buen ritmo
  - x10 combo = Maestro
  - x20+ combo = LEGENDARIO
- **High Score**: Se guarda automáticamente en `localStorage`

---

## 🛠️ PERSONALIZACIÓN

### Cambiar colores
Edita las variables CSS en `style.css` (líneas 7-12):
```css
:root {
    --neon-cyan: #00f3ff;      /* Color del jugador */
    --neon-pink: #ff006e;      /* Obstáculos tipo 1 */
    --neon-purple: #8b00ff;    /* Obstáculos tipo 2 / Phase Shift */
    --neon-yellow: #ffbe0b;    /* Obstáculos tipo 3 */
    --bg-black: #0a0a0f;       /* Fondo */
}
```

### Ajustar dificultad
En `game.js` (líneas 11-18), modifica:
```javascript
const game = {
    baseSpeed: 3,          // Velocidad inicial (más alto = más difícil)
    // ...
};

// Línea 455: Intervalo de spawn inicial
this.spawnInterval = 90;   // Menos frames = más obstáculos
```

### Cooldown de Phase Shift
En `game.js` (líneas 60-64):
```javascript
this.phaseShift = {
    duration: 500,    // Duración en ms (default: 0.5s)
    cooldown: 2000,   // Cooldown en ms (default: 2s)
};
```

---

## 📱 RESPONSIVE

El juego se adapta automáticamente a diferentes tamaños de pantalla.

**Mejor experiencia**: Navegador de escritorio en pantalla completa (F11)

---

## 🐛 PROBLEMAS CONOCIDOS

- **Chrome**: Si la música no se reproduce automáticamente, es debido a la política de autoplay del navegador. El usuario debe interactuar primero (clic en Start es suficiente).

---

## 📜 LICENCIA

Este proyecto es open source. Úsalo, modifícalo y compártelo como quieras.

---

## 🙏 CRÉDITOS

- **Fuente**: [Orbitron](https://fonts.google.com/specimen/Orbitron) (Google Fonts)
- **Inspiración visual**: Hotline Miami, Geometry Dash, estética Synthwave/Outrun
- **Concepto**: Juego retro de evasión con mecánicas modernas

---

## 🎮 ¡A JUGAR!

```
 ███████╗██╗ ██████╗ ███╗   ███╗ █████╗ ██╗
 ██╔════╝██║██╔════╝ ████╗ ████║██╔══██╗██║
 ███████╗██║██║  ███╗██╔████╔██║███████║██║
 ╚════██║██║██║   ██║██║╚██╔╝██║██╔══██║██║
 ███████║██║╚██████╔╝██║ ╚═╝ ██║██║  ██║███████╗
 ╚══════╝╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝
```

**Sobrevive. Esquiva. Domina el grid.**
