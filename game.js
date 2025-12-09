// ============================================
// SIGNAL - Geometry Runner (REVAMPED)
// Geometry Dash Style Game
// ============================================

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    console.log('Canvas resized to:', canvas.width, 'x', canvas.height);
}

// Ensure canvas is sized after DOM loads
setTimeout(resizeCanvas, 100);
window.addEventListener('resize', resizeCanvas);

// ============================================
// COLORS
// ============================================
const colors = {
    cyan: '#00f3ff',
    pink: '#ff006e',
    purple: '#8b00ff',
    yellow: '#ffbe0b',
    bg: '#0a0a0f'
};

// ============================================
// GAME STATE
// ============================================
const game = {
    state: 'menu', // 'menu', 'levelSelect', 'playing', 'gameOver', 'levelComplete'
    currentLevel: 1,
    attempts: 1,
    frame: 0,
    speed: 4,
    cameraX: 0,
    screenShake: 0,
    totalOrbs: parseInt(localStorage.getItem('signalTotalOrbs')) || 0
};

// ============================================
// LEVEL SYSTEM
// ============================================
const levelData = {
    1: {
        name: 'NEON GRID',
        length: 5000,
        theme: 'grid',
        orbs: 0,
        unlockRequirement: 0,
        obstacles: 'level1Pattern',
        bgColor1: colors.cyan,
        bgColor2: colors.pink
    },
    2: {
        name: 'CYBER TUNNEL',
        length: 6000,
        theme: 'tunnel',
        orbs: 0,
        unlockRequirement: 7,
        obstacles: 'level2Pattern',
        bgColor1: colors.purple,
        bgColor2: colors.yellow
    },
    3: {
        name: 'DIGITAL CITY',
        length: 7000,
        theme: 'city',
        orbs: 0,
        unlockRequirement: 15,
        obstacles: 'level3Pattern',
        bgColor1: colors.pink,
        bgColor2: colors.cyan
    },
    4: {
        name: 'VOID SPACE',
        length: 8000,
        theme: 'space',
        orbs: 0,
        unlockRequirement: 23,
        obstacles: 'level4Pattern',
        bgColor1: colors.purple,
        bgColor2: colors.pink
    },
    5: {
        name: 'CORRUPTION',
        length: 9000,
        theme: 'glitch',
        orbs: 0,
        unlockRequirement: 30,
        obstacles: 'level5Pattern',
        bgColor1: colors.yellow,
        bgColor2: colors.purple
    }
};

// Load saved orbs for each level
for (let i = 1; i <= 5; i++) {
    levelData[i].orbs = parseInt(localStorage.getItem(`level${i}Orbs`)) || 0;
}

// ============================================
// PLAYER CLASS (Multiple Modes)
// ============================================
class Player {
    constructor() {
        this.size = 20;
        this.x = 150;
        this.y = 0; // Will be set properly in reset
        this.velocityY = 0;
        this.isJumping = false;
        this.isOnGround = false;

        // Game modes: 'cube', 'ship', 'wave'
        this.mode = 'cube';

        // Mode-specific properties
        this.gravity = 0.8;
        this.jumpPower = -13;
        this.shipSpeed = 6;
        this.waveAmplitude = 3;
        this.waveSpeed = 0.1;

        this.trail = [];
        this.maxTrailLength = 15;
        this.rotation = 0;
    }

    update() {
        switch (this.mode) {
            case 'cube':
                this.updateCube();
                break;
            case 'ship':
                this.updateShip();
                break;
            case 'wave':
                this.updateWave();
                break;
        }

        // Update trail
        this.trail.push({ x: this.x, y: this.y, mode: this.mode });
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }

        // Rotation for cube
        if (this.mode === 'cube' && !this.isOnGround) {
            this.rotation += 0.15;
        } else if (this.mode === 'cube' && this.isOnGround) {
            // Snap to nearest 90° when landing
            this.rotation = Math.round(this.rotation / (Math.PI/2)) * (Math.PI/2);
        }
    }

    updateCube() {
        // Gravity
        this.velocityY += this.gravity;
        this.y += this.velocityY;

        // Ground collision
        const groundY = canvas.height - 60;
        if (this.y >= groundY) {
            this.y = groundY;
            this.velocityY = 0;
            this.isOnGround = true;
            this.isJumping = false;
        } else {
            this.isOnGround = false;
        }

        // Ceiling
        if (this.y < this.size) {
            this.y = this.size;
            this.velocityY = 0;
        }
    }

    updateShip() {
        // Smooth flight control
        if (keys[' '] || keys.mouseDown) {
            this.velocityY -= 0.6;
        } else {
            this.velocityY += 0.6;
        }

        // Max velocity
        this.velocityY = Math.max(-10, Math.min(10, this.velocityY));

        this.y += this.velocityY;

        // Boundaries
        this.y = Math.max(this.size, Math.min(canvas.height - 60, this.y));
    }

    updateWave() {
        // Sine wave movement
        if (keys[' '] || keys.mouseDown) {
            this.y -= this.waveAmplitude;
        } else {
            this.y += this.waveAmplitude;
        }

        // Boundaries
        this.y = Math.max(this.size + 10, Math.min(canvas.height - 70, this.y));
    }

    jump() {
        if (this.mode === 'cube' && this.isOnGround) {
            this.velocityY = this.jumpPower;
            this.isJumping = true;
            this.isOnGround = false;
        }
    }

    changeMode(newMode) {
        this.mode = newMode;
        this.rotation = 0;
        this.velocityY = 0;

        // Update mode indicator
        const modeNames = {
            'cube': '🎮 CUBE MODE',
            'ship': '🚀 SHIP MODE',
            'wave': '🌊 WAVE MODE'
        };
        document.getElementById('modeIndicator').textContent = modeNames[newMode];
    }

    draw() {
        ctx.save();

        // Draw trail
        this.trail.forEach((point, index) => {
            const alpha = (index / this.trail.length) * 0.4;
            const color = point.mode === 'cube' ? colors.cyan :
                         point.mode === 'ship' ? colors.pink : colors.purple;
            ctx.fillStyle = color.replace(')', `, ${alpha})`).replace('rgb', 'rgba').replace('#', 'rgba(');
            ctx.globalAlpha = alpha;
            ctx.fillRect(point.x - this.size/2, point.y - this.size/2, this.size, this.size);
        });

        ctx.globalAlpha = 1;

        // Draw player based on mode
        ctx.translate(this.x, this.y);

        if (this.mode === 'cube') {
            ctx.rotate(this.rotation);
            ctx.fillStyle = colors.cyan;
            ctx.shadowBlur = 20;
            ctx.shadowColor = colors.cyan;
            ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);

            // Inner square
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(-this.size/4, -this.size/4, this.size/2, this.size/2);
        }
        else if (this.mode === 'ship') {
            // Triangle ship
            ctx.fillStyle = colors.pink;
            ctx.shadowBlur = 25;
            ctx.shadowColor = colors.pink;
            ctx.beginPath();
            ctx.moveTo(this.size/2, 0);
            ctx.lineTo(-this.size/2, -this.size/2);
            ctx.lineTo(-this.size/2, this.size/2);
            ctx.closePath();
            ctx.fill();

            // Thruster
            ctx.fillStyle = colors.yellow;
            ctx.fillRect(-this.size/2 - 5, -3, 5, 6);
        }
        else if (this.mode === 'wave') {
            // Wave circle
            ctx.fillStyle = colors.purple;
            ctx.shadowBlur = 20;
            ctx.shadowColor = colors.purple;
            ctx.beginPath();
            ctx.arc(0, 0, this.size/2, 0, Math.PI * 2);
            ctx.fill();

            // Inner wave
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, this.size/3, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.restore();
    }

    getBounds() {
        return {
            x: this.x - this.size/2,
            y: this.y - this.size/2,
            width: this.size,
            height: this.size
        };
    }

    reset() {
        this.x = 150;
        this.y = canvas.height - 100;
        this.velocityY = 0;
        this.isJumping = false;
        this.isOnGround = false;
        this.mode = 'cube';
        this.rotation = 0;
        this.trail = [];
        console.log('Player reset at:', this.x, this.y, 'Canvas height:', canvas.height);
    }
}

// ============================================
// OBSTACLE CLASS
// ============================================
class Obstacle {
    constructor(x, y, width, height, type = 'spike') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type; // 'spike', 'block', 'saw'
        this.rotation = 0;
    }

    update() {
        if (this.type === 'saw') {
            this.rotation += 0.1;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x - game.cameraX, this.y);

        switch (this.type) {
            case 'spike':
                ctx.fillStyle = colors.pink;
                ctx.shadowBlur = 15;
                ctx.shadowColor = colors.pink;
                ctx.beginPath();
                ctx.moveTo(this.width/2, 0);
                ctx.lineTo(this.width, this.height);
                ctx.lineTo(0, this.height);
                ctx.closePath();
                ctx.fill();
                break;

            case 'block':
                ctx.fillStyle = colors.pink;
                ctx.shadowBlur = 15;
                ctx.shadowColor = colors.pink;
                ctx.fillRect(0, 0, this.width, this.height);

                // Grid lines
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.lineWidth = 2;
                ctx.strokeRect(5, 5, this.width - 10, this.height - 10);
                break;

            case 'saw':
                ctx.rotate(this.rotation);
                ctx.fillStyle = colors.yellow;
                ctx.shadowBlur = 20;
                ctx.shadowColor = colors.yellow;

                // Draw saw teeth
                const teeth = 12;
                ctx.beginPath();
                for (let i = 0; i < teeth; i++) {
                    const angle = (i / teeth) * Math.PI * 2;
                    const nextAngle = ((i + 1) / teeth) * Math.PI * 2;
                    const outerR = this.width / 2;
                    const innerR = this.width / 3;

                    if (i === 0) ctx.moveTo(Math.cos(angle) * outerR, Math.sin(angle) * outerR);
                    ctx.lineTo(Math.cos(angle) * outerR, Math.sin(angle) * outerR);
                    ctx.lineTo(Math.cos((angle + nextAngle) / 2) * innerR, Math.sin((angle + nextAngle) / 2) * innerR);
                }
                ctx.closePath();
                ctx.fill();

                // Center
                ctx.fillStyle = colors.bg;
                ctx.beginPath();
                ctx.arc(0, 0, this.width / 6, 0, Math.PI * 2);
                ctx.fill();
                break;
        }

        ctx.restore();
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

// ============================================
// PORTAL CLASS
// ============================================
class Portal {
    constructor(x, mode) {
        this.x = x;
        this.y = canvas.height / 2;
        this.mode = mode; // 'cube', 'ship', 'wave'
        this.width = 60;
        this.height = 120;
        this.activated = false;
        this.pulsePhase = 0;
    }

    update() {
        this.pulsePhase += 0.1;
    }

    draw() {
        const screenX = this.x - game.cameraX;

        ctx.save();

        // Portal glow
        const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
        const portalColors = {
            'cube': colors.cyan,
            'ship': colors.pink,
            'wave': colors.purple
        };
        const color = portalColors[this.mode];

        // Outer glow
        ctx.shadowBlur = 30 * pulse;
        ctx.shadowColor = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.globalAlpha = pulse;

        // Portal frame
        ctx.strokeRect(screenX, this.y - this.height/2, this.width, this.height);

        // Inner fill
        ctx.fillStyle = color.replace(')', ', 0.2)').replace('rgb', 'rgba').replace('#', 'rgba(');
        ctx.fillRect(screenX, this.y - this.height/2, this.width, this.height);

        // Icon
        ctx.globalAlpha = 1;
        ctx.fillStyle = color;
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const icons = { 'cube': '■', 'ship': '▶', 'wave': '◯' };
        ctx.fillText(icons[this.mode], screenX + this.width/2, this.y);

        ctx.restore();
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y - this.height/2,
            width: this.width,
            height: this.height
        };
    }
}

// ============================================
// ORB CLASS (Collectibles)
// ============================================
class Orb {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 12;
        this.collected = false;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.rotationSpeed = 0.05;
        this.rotation = 0;
    }

    update() {
        this.pulsePhase += 0.1;
        this.rotation += this.rotationSpeed;
    }

    draw() {
        if (this.collected) return;

        const screenX = this.x - game.cameraX;
        const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;

        ctx.save();
        ctx.translate(screenX, this.y);
        ctx.rotate(this.rotation);

        // Outer glow
        ctx.shadowBlur = 20 * pulse;
        ctx.shadowColor = colors.yellow;
        ctx.fillStyle = colors.yellow;
        ctx.globalAlpha = pulse * 0.5;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Main orb
        ctx.globalAlpha = 1;
        ctx.fillStyle = colors.yellow;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Inner shine
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(-3, -3, this.radius / 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    getBounds() {
        return {
            x: this.x - this.radius,
            y: this.y - this.radius,
            width: this.radius * 2,
            height: this.radius * 2
        };
    }
}

// ============================================
// PARTICLE SYSTEM
// ============================================
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
        this.life = 1;
        this.decay = 0.02;
        this.size = Math.random() * 4 + 2;
        this.color = color;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.2; // gravity
        this.life -= this.decay;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fillRect(this.x - game.cameraX, this.y, this.size, this.size);
        ctx.restore();
    }

    isDead() {
        return this.life <= 0;
    }
}

const particles = [];

function createParticles(x, y, count, color) {
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y, color));
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        if (particles[i].isDead()) {
            particles.splice(i, 1);
        }
    }
}

function drawParticles() {
    particles.forEach(p => p.draw());
}

// ============================================
// LEVEL MANAGER
// ============================================
class LevelManager {
    constructor(levelNum) {
        this.levelNum = levelNum;
        this.data = levelData[levelNum];
        this.obstacles = [];
        this.portals = [];
        this.orbs = [];
        this.orbsCollected = 0;
        this.totalOrbs = 10;
        this.progress = 0;

        this.generateLevel();
    }

    generateLevel() {
        const patterns = {
            level1Pattern: () => this.generateLevel1(),
            level2Pattern: () => this.generateLevel2(),
            level3Pattern: () => this.generateLevel3(),
            level4Pattern: () => this.generateLevel4(),
            level5Pattern: () => this.generateLevel5()
        };

        const patternFunc = patterns[this.data.obstacles];
        if (patternFunc) patternFunc();
    }

    generateLevel1() {
        // LEVEL 1: Introduction - Cube jumping basics
        let x = 500;

        // Tutorial: Simple spikes
        for (let i = 0; i < 5; i++) {
            this.obstacles.push(new Obstacle(x, canvas.height - 100, 40, 40, 'spike'));
            x += 200;
        }

        // Orb 1
        this.orbs.push(new Orb(x - 100, canvas.height - 200));

        // Single blocks
        for (let i = 0; i < 3; i++) {
            this.obstacles.push(new Obstacle(x, canvas.height - 140, 40, 40, 'block'));
            x += 180;
        }

        // Orb 2
        this.orbs.push(new Orb(x - 90, canvas.height - 180));

        // Portal to ship
        this.portals.push(new Portal(x, 'ship'));
        x += 300;

        // Ship section
        for (let i = 0; i < 4; i++) {
            this.obstacles.push(new Obstacle(x, 100 + i * 100, 80, 30, 'block'));
            x += 200;
        }

        // Orbs 3-5
        this.orbs.push(new Orb(x - 500, canvas.height / 2));
        this.orbs.push(new Orb(x - 300, canvas.height / 2 - 80));
        this.orbs.push(new Orb(x - 100, canvas.height / 2 + 80));

        // Back to cube
        this.portals.push(new Portal(x, 'cube'));
        x += 300;

        // Stairs
        for (let i = 0; i < 5; i++) {
            this.obstacles.push(new Obstacle(x, canvas.height - 100 - i * 40, 40, 40 + i * 40, 'block'));
            x += 150;
        }

        // Orb 6
        this.orbs.push(new Orb(x - 400, canvas.height - 250));

        // Saws
        for (let i = 0; i < 3; i++) {
            this.obstacles.push(new Obstacle(x, canvas.height - 130, 50, 50, 'saw'));
            x += 250;
        }

        // Orbs 7-10
        for (let i = 0; i < 4; i++) {
            this.orbs.push(new Orb(x + i * 200, canvas.height - 180));
        }

        x += 1000;
        this.data.length = x;
    }

    generateLevel2() {
        // LEVEL 2: Cyber Tunnel - More challenging
        let x = 500;

        // Fast spikes
        for (let i = 0; i < 8; i++) {
            this.obstacles.push(new Obstacle(x, canvas.height - 100, 40, 40, 'spike'));
            x += 120;
        }

        // Orbs 1-2
        this.orbs.push(new Orb(x - 600, canvas.height - 200));
        this.orbs.push(new Orb(x - 300, canvas.height - 200));

        // Wave portal
        this.portals.push(new Portal(x, 'wave'));
        x += 300;

        // Wave section with blocks
        for (let i = 0; i < 6; i++) {
            this.obstacles.push(new Obstacle(x, 150 + Math.sin(i) * 100, 60, 40, 'block'));
            x += 200;
        }

        // Orbs 3-5
        this.orbs.push(new Orb(x - 800, canvas.height / 2));
        this.orbs.push(new Orb(x - 500, canvas.height / 2 - 60));
        this.orbs.push(new Orb(x - 200, canvas.height / 2 + 60));

        // Ship portal
        this.portals.push(new Portal(x, 'ship'));
        x += 300;

        // Narrow passages
        for (let i = 0; i < 5; i++) {
            this.obstacles.push(new Obstacle(x, 80, 80, 40, 'block'));
            this.obstacles.push(new Obstacle(x, canvas.height - 150, 80, 40, 'block'));
            x += 200;
        }

        // Orbs 6-8
        for (let i = 0; i < 3; i++) {
            this.orbs.push(new Orb(x - 600 + i * 200, canvas.height / 2));
        }

        // Cube portal
        this.portals.push(new Portal(x, 'cube'));
        x += 300;

        // Saw gauntlet
        for (let i = 0; i < 5; i++) {
            this.obstacles.push(new Obstacle(x, canvas.height - 130, 50, 50, 'saw'));
            this.obstacles.push(new Obstacle(x + 100, canvas.height - 200, 50, 50, 'saw'));
            x += 250;
        }

        // Final orbs 9-10
        this.orbs.push(new Orb(x - 400, canvas.height - 250));
        this.orbs.push(new Orb(x - 100, canvas.height - 180));

        x += 800;
        this.data.length = x;
    }

    generateLevel3() {
        // LEVEL 3: Digital City - Complex patterns
        let x = 500;

        // Building blocks
        for (let i = 0; i < 4; i++) {
            const height = 100 + Math.random() * 100;
            this.obstacles.push(new Obstacle(x, canvas.height - 60 - height, 60, height, 'block'));
            x += 200;
        }

        // Orbs 1-2
        this.orbs.push(new Orb(x - 500, canvas.height - 250));
        this.orbs.push(new Orb(x - 200, canvas.height - 200));

        // Ship section
        this.portals.push(new Portal(x, 'ship'));
        x += 300;

        for (let i = 0; i < 6; i++) {
            this.obstacles.push(new Obstacle(x, 100 + (i % 2) * 200, 80, 40, 'block'));
            x += 180;
        }

        // Orbs 3-5
        for (let i = 0; i < 3; i++) {
            this.orbs.push(new Orb(x - 500 + i * 180, canvas.height / 2));
        }

        // Wave section
        this.portals.push(new Portal(x, 'wave'));
        x += 300;

        for (let i = 0; i < 8; i++) {
            this.obstacles.push(new Obstacle(x, 120 + i * 50, 50, 30, 'block'));
            x += 150;
        }

        // Orbs 6-8
        for (let i = 0; i < 3; i++) {
            this.orbs.push(new Orb(x - 700 + i * 250, canvas.height / 2 - 50));
        }

        // Cube section with mixed obstacles
        this.portals.push(new Portal(x, 'cube'));
        x += 300;

        for (let i = 0; i < 6; i++) {
            if (i % 2 === 0) {
                this.obstacles.push(new Obstacle(x, canvas.height - 100, 40, 40, 'spike'));
            } else {
                this.obstacles.push(new Obstacle(x, canvas.height - 130, 50, 50, 'saw'));
            }
            x += 180;
        }

        // Final orbs 9-10
        this.orbs.push(new Orb(x - 400, canvas.height - 220));
        this.orbs.push(new Orb(x - 100, canvas.height - 180));

        x += 1000;
        this.data.length = x;
    }

    generateLevel4() {
        // LEVEL 4: Void Space - Very challenging
        let x = 500;

        // Intense start
        for (let i = 0; i < 10; i++) {
            this.obstacles.push(new Obstacle(x, canvas.height - 100, 40, 40, 'spike'));
            if (i % 3 === 0) {
                this.obstacles.push(new Obstacle(x + 60, canvas.height - 170, 50, 50, 'saw'));
            }
            x += 140;
        }

        // Orbs 1-3
        for (let i = 0; i < 3; i++) {
            this.orbs.push(new Orb(x - 800 + i * 280, canvas.height - 220));
        }

        // All portals
        this.portals.push(new Portal(x, 'ship'));
        x += 300;

        // Ship chaos
        for (let i = 0; i < 8; i++) {
            this.obstacles.push(new Obstacle(x, 80 + (i % 3) * 100, 70, 35, 'block'));
            x += 160;
        }

        // Orbs 4-5
        this.orbs.push(new Orb(x - 600, canvas.height / 2));
        this.orbs.push(new Orb(x - 300, canvas.height / 2 - 80));

        this.portals.push(new Portal(x, 'wave'));
        x += 300;

        // Wave nightmare
        for (let i = 0; i < 10; i++) {
            this.obstacles.push(new Obstacle(x, 100 + Math.sin(i * 0.5) * 80, 50, 30, 'block'));
            x += 130;
        }

        // Orbs 6-7
        this.orbs.push(new Orb(x - 500, canvas.height / 2 - 70));
        this.orbs.push(new Orb(x - 200, canvas.height / 2 + 70));

        this.portals.push(new Portal(x, 'cube'));
        x += 300;

        // Final gauntlet
        for (let i = 0; i < 8; i++) {
            this.obstacles.push(new Obstacle(x, canvas.height - 130, 50, 50, 'saw'));
            this.obstacles.push(new Obstacle(x + 70, canvas.height - 100, 40, 40, 'spike'));
            x += 200;
        }

        // Final orbs 8-10
        for (let i = 0; i < 3; i++) {
            this.orbs.push(new Orb(x - 600 + i * 200, canvas.height - 250));
        }

        x += 1000;
        this.data.length = x;
    }

    generateLevel5() {
        // LEVEL 5: CORRUPTION - Ultimate challenge
        let x = 500;

        // Hell start
        for (let i = 0; i < 15; i++) {
            this.obstacles.push(new Obstacle(x, canvas.height - 100, 40, 40, 'spike'));
            if (i % 2 === 0) {
                this.obstacles.push(new Obstacle(x + 50, canvas.height - 160, 50, 50, 'saw'));
            }
            x += 110;
        }

        // Orbs 1-2
        this.orbs.push(new Orb(x - 1000, canvas.height - 250));
        this.orbs.push(new Orb(x - 600, canvas.height - 220));

        // Mode switch madness
        this.portals.push(new Portal(x, 'wave'));
        x += 250;

        for (let i = 0; i < 12; i++) {
            this.obstacles.push(new Obstacle(x, 90 + (i % 4) * 70, 45, 35, 'block'));
            x += 120;
        }

        // Orbs 3-4
        this.orbs.push(new Orb(x - 700, canvas.height / 2 - 60));
        this.orbs.push(new Orb(x - 350, canvas.height / 2 + 60));

        this.portals.push(new Portal(x, 'ship'));
        x += 250;

        for (let i = 0; i < 10; i++) {
            this.obstacles.push(new Obstacle(x, 70 + (i % 2) * 250, 80, 40, 'block'));
            x += 140;
        }

        // Orbs 5-6
        this.orbs.push(new Orb(x - 600, canvas.height / 2));
        this.orbs.push(new Orb(x - 300, canvas.height / 2 - 90));

        this.portals.push(new Portal(x, 'cube'));
        x += 250;

        // Saw hell
        for (let i = 0; i < 12; i++) {
            this.obstacles.push(new Obstacle(x, canvas.height - 130, 50, 50, 'saw'));
            if (i % 3 === 0) {
                this.obstacles.push(new Obstacle(x + 60, canvas.height - 100, 40, 40, 'spike'));
            }
            x += 150;
        }

        // Orbs 7-8
        this.orbs.push(new Orb(x - 800, canvas.height - 230));
        this.orbs.push(new Orb(x - 400, canvas.height - 200));

        // Final section
        this.portals.push(new Portal(x, 'ship'));
        x += 250;

        for (let i = 0; i < 15; i++) {
            this.obstacles.push(new Obstacle(x, 80 + (i % 5) * 80, 60, 35, 'block'));
            x += 130;
        }

        // Final orbs 9-10
        this.orbs.push(new Orb(x - 900, canvas.height / 2 - 80));
        this.orbs.push(new Orb(x - 450, canvas.height / 2 + 80));

        x += 1500;
        this.data.length = x;
    }

    update(player) {
        this.obstacles.forEach(obstacle => obstacle.update());
        this.portals.forEach(portal => {
            portal.update();
            if (!portal.activated && checkCollision(player.getBounds(), portal.getBounds())) {
                player.changeMode(portal.mode);
                portal.activated = true;
                createParticles(portal.x, portal.y, 20, colors.cyan);
            }
        });

        this.orbs.forEach(orb => {
            orb.update();
            if (!orb.collected && checkCollision(player.getBounds(), orb.getBounds())) {
                orb.collected = true;
                this.orbsCollected++;
                createParticles(orb.x, orb.y, 15, colors.yellow);
                updateOrbDisplay();
            }
        });

        // Update progress
        this.progress = Math.min((game.cameraX / this.data.length) * 100, 100);
        document.getElementById('progressFill').style.width = `${this.progress}%`;

        // Check level completion
        if (game.cameraX >= this.data.length && game.state === 'playing') {
            levelComplete();
        }
    }

    draw() {
        this.obstacles.forEach(obstacle => obstacle.draw());
        this.portals.forEach(portal => portal.draw());
        this.orbs.forEach(orb => orb.draw());
    }

    checkCollisions(player) {
        for (let obstacle of this.obstacles) {
            if (checkCollision(player.getBounds(), obstacle.getBounds())) {
                return true;
            }
        }
        return false;
    }
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// ============================================
// BACKGROUND RENDERING
// ============================================
function drawBackground(theme) {
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const currentData = levelData[game.currentLevel];
    const horizonY = canvas.height * 0.4;

    switch (theme) {
        case 'grid':
            drawGridBackground(currentData.bgColor1, horizonY);
            break;
        case 'tunnel':
            drawTunnelBackground(currentData.bgColor1, currentData.bgColor2);
            break;
        case 'city':
            drawCityBackground(currentData.bgColor1);
            break;
        case 'space':
            drawSpaceBackground();
            break;
        case 'glitch':
            drawGlitchBackground(currentData.bgColor1, currentData.bgColor2);
            break;
    }

    // Ground
    ctx.fillStyle = 'rgba(0, 243, 255, 0.1)';
    ctx.fillRect(0, canvas.height - 60, canvas.width, 60);
    ctx.strokeStyle = colors.cyan;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 60);
    ctx.lineTo(canvas.width, canvas.height - 60);
    ctx.stroke();
}

function drawGridBackground(color, horizonY) {
    const gridColor = color.replace(')', ', 0.2)').replace('#', 'rgba(').replace('rgb', 'rgba');
    const vanishingPointX = canvas.width / 2;

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;

    // Horizontal lines
    const horizontalLines = 15;
    for (let i = 0; i < horizontalLines; i++) {
        const progress = i / horizontalLines;
        const y = horizonY + (canvas.height - horizonY) * progress;
        const offset = (game.cameraX * 0.5) % 50;

        ctx.beginPath();
        ctx.moveTo(0, y - offset);
        ctx.lineTo(canvas.width, y - offset);
        ctx.stroke();
    }

    // Vertical lines
    const verticalLines = 20;
    for (let i = 0; i < verticalLines; i++) {
        const x = (canvas.width / verticalLines) * i;
        const offset = (game.cameraX % 100) * 2;

        ctx.beginPath();
        ctx.moveTo(x, canvas.height);
        ctx.lineTo(vanishingPointX + (x - vanishingPointX) * 0.3, horizonY - offset);
        ctx.stroke();
    }

    // Horizon glow
    const gradient = ctx.createLinearGradient(0, horizonY - 100, 0, horizonY + 100);
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(0.5, color.replace(')', ', 0.3)').replace('#', 'rgba(').replace('rgb', 'rgba'));
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, horizonY - 100, canvas.width, 200);
}

function drawTunnelBackground(color1, color2) {
    const centerY = canvas.height / 2;

    // Rings
    for (let i = 0; i < 10; i++) {
        const offset = (game.cameraX * 0.3 + i * 100) % 500;
        const radius = 50 + offset;
        const alpha = 1 - (offset / 500);

        ctx.strokeStyle = (i % 2 === 0 ? color1 : color2).replace(')', `, ${alpha * 0.5})`).replace('#', 'rgba(').replace('rgb', 'rgba');
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
    }
}

function drawCityBackground(color) {
    // Buildings silhouette
    const buildingCount = 15;
    for (let i = 0; i < buildingCount; i++) {
        const x = (i * 80 - (game.cameraX * 0.2)) % canvas.width;
        const height = 100 + Math.random() * 150;

        ctx.fillStyle = color.replace(')', ', 0.2)').replace('#', 'rgba(').replace('rgb', 'rgba');
        ctx.fillRect(x, canvas.height - 60 - height, 70, height);

        // Windows
        ctx.fillStyle = color.replace(')', ', 0.4)').replace('#', 'rgba(').replace('rgb', 'rgba');
        for (let j = 0; j < 3; j++) {
            for (let k = 0; k < Math.floor(height / 40); k++) {
                if (Math.random() > 0.5) {
                    ctx.fillRect(x + 10 + j * 20, canvas.height - 60 - height + 10 + k * 40, 10, 10);
                }
            }
        }
    }
}

function drawSpaceBackground() {
    // Stars
    for (let i = 0; i < 50; i++) {
        const x = (i * 50 - (game.cameraX * 0.1)) % canvas.width;
        const y = (i * 37) % (canvas.height - 100);
        const size = Math.random() * 2;

        ctx.fillStyle = 'white';
        ctx.globalAlpha = Math.random();
        ctx.fillRect(x, y, size, size);
    }
    ctx.globalAlpha = 1;
}

function drawGlitchBackground(color1, color2) {
    // Chaotic glitch lines
    for (let i = 0; i < 20; i++) {
        const x = (i * 100 - game.cameraX) % canvas.width;
        const y = Math.random() * canvas.height;
        const width = Math.random() * 200;
        const height = Math.random() * 5;

        ctx.fillStyle = (i % 2 === 0 ? color1 : color2).replace(')', ', 0.15)').replace('#', 'rgba(').replace('rgb', 'rgba');
        ctx.fillRect(x, y, width, height);
    }
}

// ============================================
// GAME FUNCTIONS
// ============================================
function updateOrbDisplay() {
    document.getElementById('orbsCollected').textContent = levelManager.orbsCollected;
}

function triggerScreenShake(intensity = 10) {
    game.screenShake = intensity;
}

function triggerGlitchEffect() {
    const overlay = document.getElementById('glitchOverlay');
    overlay.classList.add('active');
    setTimeout(() => overlay.classList.remove('active'), 300);
}

function gameOver() {
    game.state = 'gameOver';
    game.attempts++;

    document.getElementById('finalProgress').textContent = Math.floor(levelManager.progress);
    document.getElementById('finalOrbs').textContent = levelManager.orbsCollected;
    document.getElementById('finalAttempts').textContent = game.attempts;

    document.getElementById('gameOver').style.display = 'flex';
    document.getElementById('hud').style.display = 'none';

    triggerGlitchEffect();
    triggerScreenShake(15);
}

function levelComplete() {
    game.state = 'levelComplete';

    // Save orbs
    const currentOrbs = levelData[game.currentLevel].orbs;
    const newOrbs = levelManager.orbsCollected;

    if (newOrbs > currentOrbs) {
        levelData[game.currentLevel].orbs = newOrbs;
        localStorage.setItem(`level${game.currentLevel}Orbs`, newOrbs);

        // Add to total
        const orbsGained = newOrbs - currentOrbs;
        game.totalOrbs += orbsGained;
        localStorage.setItem('signalTotalOrbs', game.totalOrbs);
    }

    // Calculate stars
    let stars = 1;
    if (levelManager.orbsCollected >= 7) stars = 2;
    if (levelManager.orbsCollected === 10) stars = 3;

    const starText = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
    document.getElementById('starRating').textContent = starText;

    document.getElementById('completeOrbs').textContent = levelManager.orbsCollected;
    document.getElementById('completeAttempts').textContent = game.attempts;

    // Bonus text
    if (newOrbs > currentOrbs) {
        document.getElementById('bonusOrbs').textContent = `+${newOrbs - currentOrbs} NEW ORBS!`;
        document.getElementById('bonusOrbs').style.display = 'block';
    } else {
        document.getElementById('bonusOrbs').style.display = 'none';
    }

    document.getElementById('levelComplete').style.display = 'flex';
    document.getElementById('hud').style.display = 'none';

    createParticles(player.x, player.y, 50, colors.cyan);
}

function resetLevel() {
    console.log('Resetting level', game.currentLevel);
    game.state = 'playing';
    game.frame = 0;
    game.cameraX = 0;

    player.reset();
    levelManager = new LevelManager(game.currentLevel);

    particles.length = 0;

    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('levelComplete').style.display = 'none';
    document.getElementById('hud').style.display = 'flex';

    updateOrbDisplay();
    document.getElementById('attempts').textContent = game.attempts;
    console.log('Level reset complete. Player at:', player.x, player.y);
}

function loadLevel(levelNum) {
    console.log('Loading level', levelNum);
    game.currentLevel = levelNum;
    game.attempts = 1;
    game.frame = 0;
    game.cameraX = 0;

    player.reset();
    levelManager = new LevelManager(levelNum);

    particles.length = 0;

    document.getElementById('levelSelect').style.display = 'none';
    document.getElementById('hud').style.display = 'flex';
    game.state = 'playing';

    document.getElementById('currentLevel').textContent = String(levelNum).padStart(2, '0');
    updateOrbDisplay();
    document.getElementById('attempts').textContent = game.attempts;

    console.log('Level loaded. Canvas:', canvas.width, 'x', canvas.height);
    console.log('Player position:', player.x, player.y);
    console.log('Game state:', game.state);
}

function showLevelSelect() {
    game.state = 'levelSelect';
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('levelComplete').style.display = 'none';
    document.getElementById('levelSelect').style.display = 'flex';

    // Update orb counts and unlock status
    for (let i = 1; i <= 5; i++) {
        document.getElementById(`level${i}Orbs`).textContent = levelData[i].orbs;

        const card = document.querySelector(`.level-card[data-level="${i}"]`);
        if (game.totalOrbs >= levelData[i].unlockRequirement) {
            card.classList.remove('locked');
        } else {
            card.classList.add('locked');
        }
    }

    document.getElementById('highScoreDisplay').textContent = game.totalOrbs;
}

// ============================================
// INPUT HANDLING
// ============================================
const keys = { mouseDown: false };

window.addEventListener('keydown', (e) => {
    if (e.key === ' ' && game.state === 'playing') {
        e.preventDefault();
        keys[' '] = true;
        player.jump();
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === ' ') {
        keys[' '] = false;
    }
});

canvas.addEventListener('mousedown', () => {
    if (game.state === 'playing') {
        keys.mouseDown = true;
        player.jump();
    }
});

canvas.addEventListener('mouseup', () => {
    keys.mouseDown = false;
});

canvas.addEventListener('touchstart', (e) => {
    if (game.state === 'playing') {
        e.preventDefault();
        keys.mouseDown = true;
        player.jump();
    }
});

canvas.addEventListener('touchend', () => {
    keys.mouseDown = false;
});

// ============================================
// GAME LOOP
// ============================================
let player = new Player();
let levelManager = new LevelManager(1);

// Initialize player position after canvas is ready
setTimeout(() => {
    player.reset();
    console.log('Initial player position:', player.x, player.y);
}, 200);

function gameLoop() {
    // Apply screen shake
    if (game.screenShake > 0) {
        ctx.save();
        ctx.translate(
            Math.random() * game.screenShake - game.screenShake / 2,
            Math.random() * game.screenShake - game.screenShake / 2
        );
        game.screenShake *= 0.9;
        if (game.screenShake < 0.5) game.screenShake = 0;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    if (game.state === 'playing') {
        drawBackground(levelData[game.currentLevel].theme);
    } else {
        drawBackground('grid');
    }

    if (game.state === 'playing') {
        // Update
        game.frame++;
        player.update();
        levelManager.update(player);
        updateParticles();

        // Camera follows player
        game.cameraX = Math.max(0, player.x - 150);

        // Collision detection
        if (levelManager.checkCollisions(player)) {
            gameOver();
        }

        // Draw
        levelManager.draw();
        drawParticles();
        player.draw();
    } else {
        // Draw static player on menu
        if (game.state === 'menu' || game.state === 'levelSelect') {
            drawParticles();
        }
    }

    if (game.screenShake > 0) {
        ctx.restore();
    }

    requestAnimationFrame(gameLoop);
}

// ============================================
// UI EVENT LISTENERS
// ============================================
document.getElementById('startBtn').addEventListener('click', () => {
    showLevelSelect();
});

document.getElementById('backBtn').addEventListener('click', () => {
    document.getElementById('levelSelect').style.display = 'none';
    document.getElementById('startScreen').style.display = 'flex';
    game.state = 'menu';
});

document.querySelectorAll('.level-card').forEach(card => {
    card.addEventListener('click', () => {
        const levelNum = parseInt(card.dataset.level);
        if (!card.classList.contains('locked')) {
            loadLevel(levelNum);
        }
    });
});

document.getElementById('restartBtn').addEventListener('click', () => {
    resetLevel();
});

document.getElementById('menuBtn').addEventListener('click', () => {
    showLevelSelect();
});

document.getElementById('menuBtn2').addEventListener('click', () => {
    showLevelSelect();
});

document.getElementById('nextLevelBtn').addEventListener('click', () => {
    const nextLevel = game.currentLevel + 1;
    if (nextLevel <= 5 && game.totalOrbs >= levelData[nextLevel].unlockRequirement) {
        loadLevel(nextLevel);
    } else {
        showLevelSelect();
    }
});

// Display initial orb count
document.getElementById('highScoreDisplay').textContent = game.totalOrbs;

// ============================================
// START GAME
// ============================================
gameLoop();
