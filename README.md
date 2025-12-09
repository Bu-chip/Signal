# 🎮 SIGNAL - Geometry Runner

**Un juego de plataformas rítmico estilo Geometry Dash con estética synthwave/retro.**

![Style: Synthwave](https://img.shields.io/badge/Style-Synthwave-ff006e?style=for-the-badge)
![Platform: Web](https://img.shields.io/badge/Platform-Browser-00f3ff?style=for-the-badge)
![Genre: Platformer](https://img.shields.io/badge/Genre-Platformer-8b00ff?style=for-the-badge)

---

## 🌟 **CARACTERÍSTICAS**

### **🎮 3 MODOS DE JUEGO**
- **CUBE MODE** 🟦 - Salta obstáculos con rotación Geometry Dash
- **SHIP MODE** 🚀 - Vuela suavemente controlando altura
- **WAVE MODE** 🌊 - Movimiento sinusoidal continuo

### **🌀 SISTEMA DE PORTALES**
Portales de colores cambian tu modo en medio del nivel:
- Cyan (■) → Cube Mode
- Rosa (▶) → Ship Mode
- Púrpura (◯) → Wave Mode

### **📦 5 NIVELES ÚNICOS**

| Nivel | Nombre | Tema | Dificultad | Desbloqueo |
|-------|--------|------|------------|------------|
| **01** | NEON GRID | Grid Synthwave | ⭐ Tutorial | Inicio |
| **02** | CYBER TUNNEL | Anillos Neón | ⭐⭐ Medio | 7 orbs |
| **03** | DIGITAL CITY | Ciudad Cyber | ⭐⭐⭐ Difícil | 15 orbs |
| **04** | VOID SPACE | Espacio Estelar | ⭐⭐⭐⭐ Muy Difícil | 23 orbs |
| **05** | CORRUPTION | Caos Glitch | ⭐⭐⭐⭐⭐ EXTREMO | 30 orbs |

Cada nivel tiene:
- ✅ 10 orbes coleccionables
- ✅ Diseño de obstáculos único
- ✅ Fondo animado temático
- ✅ Múltiples portales de cambio de modo

### **💎 SISTEMA DE PROGRESIÓN**
- **Orbes**: Colecta 10 por nivel para desbloquear siguientes niveles
- **Estrellas**: 1-3 estrellas según orbes recolectados
  - ⭐ = Completado (1+ orbs)
  - ⭐⭐ = Bueno (7+ orbs)
  - ⭐⭐⭐ = Perfecto (10 orbs)
- **Guardado**: Progreso guardado automáticamente en `localStorage`

### **🎯 OBSTÁCULOS**
- **Spikes** 🔺 - Pinchos triangulares mortales
- **Blocks** 🟥 - Bloques sólidos de plataforma
- **Saws** ⚙️ - Sierras circulares rotatorias

### **✨ EFECTOS VISUALES**
- 💥 Partículas al colectar orbes
- 📸 Screen shake en colisiones
- 🌈 Trails de color según modo de juego
- 🎨 5 fondos animados únicos
- 🔊 Efectos de glitch VHS

---

## 🚀 **CÓMO JUGAR**

### **Controles**
- **ESPACIO** / **CLICK** / **TOUCH** = Saltar (Cube) / Volar Arriba (Ship/Wave)
- **Soltar** = Gravedad (Cube) / Volar Abajo (Ship/Wave)

### **Objetivo**
1. Completa el nivel llegando al final
2. Evita obstáculos (spikes, blocks, saws)
3. Colecta los 10 orbes para máximo puntaje
4. Desbloquea niveles obteniendo orbes totales

### **Mecánicas**
- **Cube**: Salta en el suelo, rota en el aire
- **Ship**: Mantén presionado para subir, suelta para bajar
- **Wave**: Mantén presionado para subir, suelta para bajar (movimiento continuo)
- **Portales**: Atraviésalos para cambiar de modo instantáneamente

---

## 🛠️ **INSTALACIÓN**

### **Opción 1: Abrir Directo**
```bash
# Abre index.html en tu navegador
open index.html
# o
xdg-open index.html
```

### **Opción 2: Servidor Local (Recomendado)**
```bash
# Con Python
python3 -m http.server 8000

# Con Node.js
npx http-server

# Luego abre: http://localhost:8000
```

### **Opción 3: Online (GitHub Pages)**
Si el proyecto está publicado:
```
https://tu-usuario.github.io/Signal/
```

---

## 🎨 **PERSONALIZACIÓN**

### **Colores**
Edita `style.css` (líneas 7-13):
```css
:root {
    --neon-cyan: #00f3ff;      /* Cube / UI */
    --neon-pink: #ff006e;      /* Obstáculos / Ship */
    --neon-purple: #8b00ff;    /* Portales / Wave */
    --neon-yellow: #ffbe0b;    /* Orbes */
    --bg-black: #0a0a0f;       /* Fondo */
}
```

### **Dificultad del Jugador**
En `game.js` (líneas 118-123):
```javascript
// Más fácil:
this.gravity = 0.6;        // Default: 0.8
this.jumpPower = -15;      // Default: -13
this.shipSpeed = 8;        // Default: 6
```

### **Requisitos de Desbloqueo**
En `game.js` (líneas 45-96), modifica `unlockRequirement`:
```javascript
2: {
    unlockRequirement: 5,  // Default: 7
    // ...
}
```

---

## 📊 **ESTRUCTURA DEL PROYECTO**

```
Signal/
├── index.html          # Estructura HTML + Canvas
├── style.css           # Estilos synthwave + animaciones
├── game.js             # Motor del juego completo
├── README.md           # Este archivo
├── DEPLOYMENT.md       # Guía de publicación GitHub Pages
└── .nojekyll          # Compatibilidad GitHub Pages
```

---

## 🎮 **GUÍA DE NIVELES**

### **Nivel 1: NEON GRID** (Tutorial)
- **Longitud**: ~3500px
- **Modos**: Cube → Ship → Cube
- **Dificultad**: Fácil
- **Objetivo**: Aprender controles básicos

### **Nivel 2: CYBER TUNNEL** (Medio)
- **Longitud**: ~4000px
- **Modos**: Cube → Wave → Ship → Cube
- **Dificultad**: Media
- **Objetivo**: Dominar cambios de modo

### **Nivel 3: DIGITAL CITY** (Difícil)
- **Longitud**: ~4500px
- **Modos**: Cube → Ship → Wave → Cube
- **Dificultad**: Alta
- **Objetivo**: Patrones complejos

### **Nivel 4: VOID SPACE** (Muy Difícil)
- **Longitud**: ~5000px
- **Modos**: Cube → Ship → Wave → Cube (múltiples cambios)
- **Dificultad**: Muy Alta
- **Objetivo**: Timing perfecto

### **Nivel 5: CORRUPTION** (EXTREMO)
- **Longitud**: ~6000px
- **Modos**: Cube → Wave → Ship → Cube → Ship (caos total)
- **Dificultad**: EXTREMA
- **Objetivo**: Solo para maestros

---

## 🧩 **MECÁNICAS AVANZADAS**

### **Sistema de Partículas**
- Orbes: 15 partículas amarillas
- Portales: 20 partículas cyan
- Completar nivel: 50 partículas cyan
- Física: Gravedad + velocidad aleatoria

### **Screen Shake**
- Intensidad 15 en game over
- Decay 0.9x por frame
- Se detiene < 0.5 intensidad

### **Cámara**
- Sigue al jugador con offset de 150px
- Nunca retrocede (cameraX siempre aumenta)
- Muestra progreso del nivel en tiempo real

### **Colisiones**
- AABB (Axis-Aligned Bounding Box)
- Hitbox: tamaño del jugador (20x20px)
- Detección pixel-perfect con obstáculos

---

## 🎵 **AGREGAR MÚSICA** (Opcional)

1. Crea carpeta `audio/`:
```bash
mkdir audio
```

2. Agrega tu track synthwave como `audio/music.mp3`

3. Descomenta en `index.html` (líneas 131-133):
```html
<audio id="bgMusic" loop>
    <source src="audio/music.mp3" type="audio/mpeg">
</audio>
```

4. Agrega en `game.js` después de línea 1255:
```javascript
// Reproducir música al iniciar nivel
const music = document.getElementById('bgMusic');
if (music) {
    music.volume = 0.4;
    music.play();
}
```

### **Tracks Recomendados**:
- The Midnight - "Endless Summer"
- Perturbator - "Humans Are Such Easy Prey"
- Carpenter Brut - "Turbo Killer"
- FM-84 - "Running in the Night"

---

## 🐛 **SOLUCIÓN DE PROBLEMAS**

### **El juego no carga**
- Verifica que estés usando un servidor HTTP (no `file://`)
- Abre la consola del navegador (F12) para ver errores

### **Los niveles no se desbloquean**
- Borra el localStorage:
```javascript
localStorage.clear();
```
- Recarga la página

### **El juego va lento**
- Reduce el `maxTrailLength` en `game.js` (línea 126):
```javascript
this.maxTrailLength = 10;  // Default: 15
```

### **Las colisiones son muy difíciles**
- Reduce el hitbox del jugador en `game.js` (línea 108):
```javascript
this.size = 18;  // Default: 20
```

---

## 📱 **RESPONSIVE**

El juego se adapta a diferentes tamaños de pantalla:
- **Desktop**: Experiencia completa
- **Tablet**: Táctil optimizado
- **Mobile**: Controles táctiles

**Mejor experiencia**: Desktop en pantalla completa (F11)

---

## 🏆 **LOGROS** (Ideas para implementar)

- ✅ Completa nivel 1
- 🌟 Obtén 3 estrellas en todos los niveles
- 💎 Colecta todos los orbes (50 totales)
- 🚀 Completa nivel 5
- ⚡ Completa un nivel sin morir
- 🎯 Colecta 10/10 orbes en un nivel

---

## 📜 **LICENCIA**

Open Source - Úsalo, modifícalo y compártelo libremente.

---

## 🙏 **CRÉDITOS**

- **Motor**: HTML5 Canvas + Vanilla JavaScript
- **Fuente**: [Orbitron](https://fonts.google.com/specimen/Orbitron) (Google Fonts)
- **Inspiración**: Geometry Dash, Hotline Miami, estética Synthwave/Outrun
- **Concepto**: Plataformas rítmicas con cambios de modo dinámicos

---

## 📈 **ROADMAP** (Futuras mejoras)

- [ ] Modo práctica con checkpoints
- [ ] Editor de niveles
- [ ] Leaderboard online
- [ ] Más modos (UFO, Ball, Robot)
- [ ] Música sincronizada con obstáculos
- [ ] Sistema de logros completo
- [ ] Replay de mejores intentos
- [ ] Más portales (gravedad invertida, speed change)

---

## 🎮 **¡A JUGAR!**

```
 ███████╗██╗ ██████╗ ███╗   ██╗ █████╗ ██╗
 ██╔════╝██║██╔════╝ ████╗  ██║██╔══██╗██║
 ███████╗██║██║  ███╗██╔██╗ ██║███████║██║
 ╚════██║██║██║   ██║██║╚██╗██║██╔══██║██║
 ███████║██║╚██████╔╝██║ ╚████║██║  ██║███████╗
 ╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝

    G E O M E T R Y   R U N N E R
```

**Salta. Vuela. Esquiva. Domina.**

---

¿Preguntas? ¿Bugs? ¿Sugerencias?
Abre un issue o PR en el repositorio.

**¡Disfruta el juego!** 🚀
