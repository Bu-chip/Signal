// ============================================
// SIGNAL - Synthwave Runner
// Game Engine
// ============================================

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ============================================
// GAME STATE
// ============================================
const game = {
    state: 'start', // 'start', 'playing', 'gameOver'
    score: 0,
    combo: 0,
    maxCombo: 0,
    highScore: localStorage.getItem('signalHighScore') || 0,
    speed: 3,
    baseSpeed: 3,
    difficulty: 1,
    frame: 0,
    lastDodgeTime: 0
};

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
// PLAYER
// ============================================
class Player {
    constructor() {
        this.size = 15;
        this.x = canvas.width * 0.2;
        this.y = canvas.height / 2;
        this.speed = 5;
        this.color = colors.cyan;
        this.trail = [];
        this.maxTrailLength = 20;

        // Phase Shift
        this.phaseShift = {
            active: false,
            duration: 500, // 0.5 seconds
            cooldown: 2000, // 2 seconds
            lastUsed: 0
        };
    }

    move(dx, dy) {
        this.x += dx * this.speed;
        this.y += dy * this.speed;

        // Boundaries
        this.x = Math.max(this.size, Math.min(canvas.width - this.size, this.x));
        this.y = Math.max(this.size, Math.min(canvas.height - this.size, this.y));

        // Add to trail
        this.trail.push({ x: this.x, y: this.y, alpha: 1 });
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
    }

    activatePhaseShift() {
        const now = Date.now();
        const cooldownElapsed = now - this.phaseShift.lastUsed;

        if (cooldownElapsed >= this.phaseShift.cooldown) {
            this.phaseShift.active = true;
            this.phaseShift.lastUsed = now;

            // Reset combo when using phase shift
            game.combo = 0;

            setTimeout(() => {
                this.phaseShift.active = false;
            }, this.phaseShift.duration);
        }
    }

    getCooldownPercentage() {
        const now = Date.now();
        const elapsed = now - this.phaseShift.lastUsed;
        return Math.min(elapsed / this.phaseShift.cooldown, 1);
    }

    draw() {
        // Draw trail
        this.trail.forEach((point, index) => {
            const alpha = (index / this.trail.length) * 0.5;
            ctx.fillStyle = this.phaseShift.active
                ? `rgba(139, 0, 255, ${alpha})`
                : `rgba(0, 243, 255, ${alpha})`;
            ctx.fillRect(point.x - this.size / 2, point.y - this.size / 2, this.size, this.size);
        });

        // Draw player
        if (this.phaseShift.active) {
            // Phase shift visual: purple, semi-transparent, pulsing
            ctx.save();
            ctx.globalAlpha = 0.5 + Math.sin(Date.now() / 50) * 0.3;
            ctx.fillStyle = colors.purple;
            ctx.shadowBlur = 30;
            ctx.shadowColor = colors.purple;
            ctx.fillRect(this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
            ctx.restore();
        } else {
            // Normal visual: cyan, solid
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 20;
            ctx.shadowColor = this.color;
            ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
            ctx.shadowBlur = 0;
        }
    }

    getBounds() {
        return {
            x: this.x - this.size / 2,
            y: this.y - this.size / 2,
            width: this.size,
            height: this.size
        };
    }
}

// ============================================
// OBSTACLES
// ============================================
class Obstacle {
    constructor(x, y, width, height, type = 'block') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.passed = false;

        // Visual properties
        this.glitchOffset = 0;
        this.color = this.getColorByType();
    }

    getColorByType() {
        const types = {
            'block': colors.pink,
            'bar': colors.purple,
            'glitch': colors.yellow
        };
        return types[this.type] || colors.pink;
    }

    update() {
        this.x -= game.speed;
        this.glitchOffset = (Math.random() - 0.5) * 2;
    }

    draw() {
        ctx.save();

        switch (this.type) {
            case 'block':
                // Solid block with pixelated effect
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 15;
                ctx.shadowColor = this.color;
                ctx.fillRect(this.x, this.y, this.width, this.height);

                // Inner glitch lines
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.lineWidth = 2;
                for (let i = 0; i < 3; i++) {
                    const offsetY = (this.height / 4) * (i + 1);
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y + offsetY);
                    ctx.lineTo(this.x + this.width, this.y + offsetY + this.glitchOffset);
                    ctx.stroke();
                }
                break;

            case 'bar':
                // Horizontal bar (full width interference)
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 20;
                ctx.shadowColor = this.color;
                ctx.fillRect(this.x, this.y, this.width, this.height);

                // Animated scanline effect
                const scanY = (game.frame % 60) / 60 * this.height;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.fillRect(this.x, this.y + scanY, this.width, 2);
                break;

            case 'glitch':
                // Fragmented glitch blocks
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 25;
                ctx.shadowColor = this.color;

                const segments = 5;
                for (let i = 0; i < segments; i++) {
                    const segmentHeight = this.height / segments;
                    const offset = (Math.random() - 0.5) * 10;
                    ctx.fillRect(
                        this.x + offset,
                        this.y + i * segmentHeight,
                        this.width,
                        segmentHeight
                    );
                }
                break;
        }

        ctx.restore();
    }

    isOffScreen() {
        return this.x + this.width < 0;
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
// OBSTACLE MANAGER
// ============================================
class ObstacleManager {
    constructor() {
        this.obstacles = [];
        this.spawnTimer = 0;
        this.spawnInterval = 90; // frames between spawns
    }

    update() {
        this.spawnTimer++;

        // Spawn new obstacles
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawn();
            this.spawnTimer = 0;

            // Decrease spawn interval with difficulty (min 40 frames)
            this.spawnInterval = Math.max(40, 90 - game.difficulty * 5);
        }

        // Update and remove off-screen obstacles
        this.obstacles = this.obstacles.filter(obstacle => {
            obstacle.update();

            // Check if player passed obstacle (for combo)
            if (!obstacle.passed && obstacle.x + obstacle.width < player.x - player.size) {
                obstacle.passed = true;
                if (!player.phaseShift.active) {
                    game.combo++;
                    game.maxCombo = Math.max(game.maxCombo, game.combo);
                }
            }

            return !obstacle.isOffScreen();
        });
    }

    spawn() {
        const patterns = [
            this.spawnSingleBlock,
            this.spawnDoubleBlock,
            this.spawnBar,
            this.spawnWall,
            this.spawnGlitchPattern
        ];

        // Choose random pattern
        const pattern = patterns[Math.floor(Math.random() * patterns.length)];
        pattern.call(this);
    }

    spawnSingleBlock() {
        const size = 40 + Math.random() * 40;
        const y = Math.random() * (canvas.height - size);
        this.obstacles.push(new Obstacle(canvas.width, y, size, size, 'block'));
    }

    spawnDoubleBlock() {
        const size = 50;
        const gap = 150 + Math.random() * 100;
        const topY = Math.random() * (canvas.height - gap - size * 2);

        this.obstacles.push(new Obstacle(canvas.width, topY, size, size, 'block'));
        this.obstacles.push(new Obstacle(canvas.width, topY + size + gap, size, size, 'block'));
    }

    spawnBar() {
        const height = 20 + Math.random() * 30;
        const y = Math.random() * (canvas.height - height);
        this.obstacles.push(new Obstacle(canvas.width, y, 100, height, 'bar'));
    }

    spawnWall() {
        const gap = 120 + Math.random() * 80;
        const gapY = Math.random() * (canvas.height - gap);

        // Top wall
        if (gapY > 0) {
            this.obstacles.push(new Obstacle(canvas.width, 0, 60, gapY, 'block'));
        }

        // Bottom wall
        if (gapY + gap < canvas.height) {
            this.obstacles.push(new Obstacle(canvas.width, gapY + gap, 60, canvas.height - (gapY + gap), 'block'));
        }
    }

    spawnGlitchPattern() {
        const count = 2 + Math.floor(Math.random() * 3);
        for (let i = 0; i < count; i++) {
            const size = 30 + Math.random() * 30;
            const x = canvas.width + i * 80;
            const y = Math.random() * (canvas.height - size);
            this.obstacles.push(new Obstacle(x, y, size, size, 'glitch'));
        }
    }

    draw() {
        this.obstacles.forEach(obstacle => obstacle.draw());
    }

    checkCollision(player) {
        if (player.phaseShift.active) return false;

        const playerBounds = player.getBounds();

        for (let obstacle of this.obstacles) {
            const obstacleBounds = obstacle.getBounds();

            if (
                playerBounds.x < obstacleBounds.x + obstacleBounds.width &&
                playerBounds.x + playerBounds.width > obstacleBounds.x &&
                playerBounds.y < obstacleBounds.y + obstacleBounds.height &&
                playerBounds.y + playerBounds.height > obstacleBounds.y
            ) {
                return true;
            }
        }

        return false;
    }

    reset() {
        this.obstacles = [];
        this.spawnTimer = 0;
        this.spawnInterval = 90;
    }
}

// ============================================
// BACKGROUND - SYNTHWAVE GRID
// ============================================
function drawBackground() {
    // Black background
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Perspective grid
    const gridColor = 'rgba(0, 243, 255, 0.2)';
    const horizonY = canvas.height * 0.4;
    const vanishingPointX = canvas.width / 2;

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;

    // Horizontal lines (perspective)
    const horizontalLines = 15;
    for (let i = 0; i < horizontalLines; i++) {
        const progress = i / horizontalLines;
        const y = horizonY + (canvas.height - horizonY) * progress;
        const offset = (game.frame * game.speed * 0.5) % 50;

        ctx.beginPath();
        ctx.moveTo(0, y - offset);
        ctx.lineTo(canvas.width, y - offset);
        ctx.stroke();
    }

    // Vertical lines (converging to vanishing point)
    const verticalLines = 20;
    for (let i = 0; i < verticalLines; i++) {
        const x = (canvas.width / verticalLines) * i;
        const offset = ((game.frame * game.speed) % 100) * 2;

        ctx.beginPath();
        ctx.moveTo(x, canvas.height);
        ctx.lineTo(
            vanishingPointX + (x - vanishingPointX) * 0.3,
            horizonY - offset
        );
        ctx.stroke();
    }

    // Horizon glow
    const gradient = ctx.createLinearGradient(0, horizonY - 100, 0, horizonY + 100);
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(0.5, 'rgba(255, 0, 110, 0.3)');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, horizonY - 100, canvas.width, 200);
}

// ============================================
// GAME FUNCTIONS
// ============================================
function updateScore() {
    game.score = Math.floor(game.frame / 60 * game.speed);
    document.getElementById('score').textContent = game.score;
    document.getElementById('combo').textContent = `x${game.combo}`;
}

function updateDifficulty() {
    // Increase difficulty every 10 seconds
    const seconds = Math.floor(game.frame / 60);
    game.difficulty = 1 + Math.floor(seconds / 10);
    game.speed = game.baseSpeed + (game.difficulty - 1) * 0.5;
}

function triggerGlitchEffect() {
    const overlay = document.getElementById('glitchOverlay');
    overlay.classList.add('active');
    setTimeout(() => overlay.classList.remove('active'), 300);
}

function gameOver() {
    game.state = 'gameOver';

    // Update high score
    if (game.score > game.highScore) {
        game.highScore = game.score;
        localStorage.setItem('signalHighScore', game.highScore);
        document.getElementById('newRecord').style.display = 'block';
    } else {
        document.getElementById('newRecord').style.display = 'none';
    }

    // Display final stats
    document.getElementById('finalScore').textContent = game.score;
    document.getElementById('finalCombo').textContent = game.maxCombo;

    // Show game over screen
    document.getElementById('gameOver').style.display = 'flex';
    document.getElementById('hud').style.display = 'none';

    triggerGlitchEffect();
}

function resetGame() {
    game.state = 'playing';
    game.score = 0;
    game.combo = 0;
    game.maxCombo = 0;
    game.speed = game.baseSpeed;
    game.difficulty = 1;
    game.frame = 0;

    player = new Player();
    obstacleManager.reset();

    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('hud').style.display = 'flex';
}

// ============================================
// INPUT HANDLING
// ============================================
const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;

    // Phase shift
    if (e.key === ' ' && game.state === 'playing') {
        e.preventDefault();
        player.activatePhaseShift();
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

function handleInput() {
    let dx = 0;
    let dy = 0;

    if (keys['arrowup'] || keys['w']) dy = -1;
    if (keys['arrowdown'] || keys['s']) dy = 1;
    if (keys['arrowleft'] || keys['a']) dx = -1;
    if (keys['arrowright'] || keys['d']) dx = 1;

    if (dx !== 0 || dy !== 0) {
        player.move(dx, dy);
    }
}

// ============================================
// GAME LOOP
// ============================================
let player = new Player();
let obstacleManager = new ObstacleManager();

function gameLoop() {
    if (game.state === 'playing') {
        // Update
        game.frame++;
        handleInput();
        obstacleManager.update();
        updateScore();
        updateDifficulty();

        // Check collision
        if (obstacleManager.checkCollision(player)) {
            gameOver();
        }

        // Update phase shift cooldown UI
        const cooldownPercent = player.getCooldownPercentage();
        document.getElementById('phaseFill').style.width = `${cooldownPercent * 100}%`;
    }

    // Draw
    drawBackground();

    if (game.state === 'playing') {
        obstacleManager.draw();
        player.draw();
    }

    requestAnimationFrame(gameLoop);
}

// ============================================
// UI EVENT LISTENERS
// ============================================
document.getElementById('startBtn').addEventListener('click', () => {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('hud').style.display = 'flex';
    game.state = 'playing';
});

document.getElementById('restartBtn').addEventListener('click', () => {
    resetGame();
});

// Display high score on load
document.getElementById('highScoreDisplay').textContent = game.highScore;

// ============================================
// START GAME
// ============================================
gameLoop();
