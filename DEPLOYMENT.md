# 🚀 Cómo Publicar SIGNAL en GitHub Pages

## ✅ Archivos Ya Preparados

El juego ya está listo para publicarse. Se agregó el archivo `.nojekyll` para compatibilidad con GitHub Pages.

---

## 📝 Pasos para Publicar (5 minutos)

### **Opción 1: Desde la Interfaz de GitHub (Más Fácil)**

1. **Ve a tu repositorio en GitHub:**
   ```
   https://github.com/Bu-chip/Signal
   ```

2. **Ve a Settings (Configuración):**
   - Haz clic en la pestaña **Settings** (arriba a la derecha)

3. **Encuentra Pages:**
   - En el menú lateral izquierdo, busca **Pages** (en la sección "Code and automation")

4. **Configura la rama:**
   - En **Source**, selecciona la rama: `claude/retro-signal-game-01RpeiYW2uJdhLAxTcK6HpSc`
   - Deja **/ (root)** seleccionado
   - Haz clic en **Save**

5. **Espera 1-2 minutos:**
   - GitHub Pages construirá el sitio automáticamente
   - Aparecerá un mensaje verde con la URL:
     ```
     Your site is live at https://bu-chip.github.io/Signal/
     ```

6. **¡Listo!** Abre esa URL y juega 🎮

---

### **Opción 2: Usando GitHub CLI (Avanzado)**

Si tienes `gh` CLI instalado:

```bash
# Habilitar GitHub Pages
gh api repos/Bu-chip/Signal/pages -X POST -f source[branch]=claude/retro-signal-game-01RpeiYW2uJdhLAxTcK6HpSc -f source[path]=/
```

---

## 🌐 Alternativas de Hosting Gratuito

Si GitHub Pages te da problemas, estas son igual de fáciles:

### **Netlify (Drag & Drop)**

1. Ve a https://app.netlify.com/drop
2. Arrastra la carpeta `Signal/` completa
3. ¡Listo! Te da una URL tipo: `https://signal-synthwave.netlify.app`

### **Vercel**

```bash
# Instala Vercel CLI
npm i -g vercel

# En la carpeta del juego
cd /home/user/Signal
vercel --prod
```

### **Cloudflare Pages**

1. Ve a https://pages.cloudflare.com/
2. Conecta tu repo de GitHub
3. Selecciona la rama `claude/retro-signal-game-01RpeiYW2uJdhLAxTcK6HpSc`
4. Deploy automático

---

## 🔧 Solución de Problemas

### **El sitio muestra un 404**
- Espera 2-3 minutos después de habilitar Pages
- Verifica que la rama esté correcta en Settings → Pages

### **Los archivos CSS/JS no cargan**
- El archivo `.nojekyll` ya está incluido, esto no debería pasar
- Verifica que todos los archivos estén en la raíz del repo

### **Quiero un dominio personalizado**
1. Agrega un archivo `CNAME` con tu dominio:
   ```
   echo "tujuego.com" > CNAME
   git add CNAME
   git commit -m "Add custom domain"
   git push
   ```
2. Configura el DNS en tu proveedor de dominio

---

## 📊 Estado Actual

```
✅ Repositorio: https://github.com/Bu-chip/Signal
✅ Rama: claude/retro-signal-game-01RpeiYW2uJdhLAxTcK6HpSc
✅ Archivos listos: index.html, style.css, game.js, .nojekyll
⏳ Pendiente: Habilitar GitHub Pages en Settings
```

---

## 🎮 Después de Publicar

Comparte tu juego:
```
🎮 ¡Juega SIGNAL! - Synthwave Runner
🌐 https://bu-chip.github.io/Signal/

Esquiva la corrupción digital en este juego retro.
Controles: WASD + Espacio
```

¡Disfruta! 🚀
