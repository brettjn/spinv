'use strict';

// ---------------------------------------------------------------------------
// Canvas setup
// ---------------------------------------------------------------------------
const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');

const W = 800;
const H = 600;
canvas.width  = W;
canvas.height = H;

// ---------------------------------------------------------------------------
// Pixel scale – every sprite "pixel" is P×P real pixels
// ---------------------------------------------------------------------------
const P = 3;

// ---------------------------------------------------------------------------
// Sprite definitions
// Each sprite lists { w, h, frames } where each frame is an array of rows,
// each row being an array of 0/1 values.
// ---------------------------------------------------------------------------
const SPRITES = {

  // Squid – top row – 30 pts – 8×8
  squid: {
    w: 8, h: 8,
    frames: [
      [
        [0,0,0,1,1,0,0,0],
        [0,0,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,0],
        [1,1,0,1,1,0,1,1],
        [1,1,1,1,1,1,1,1],
        [0,1,0,1,1,0,1,0],
        [1,0,0,0,0,0,0,1],
        [0,1,0,0,0,0,1,0],
      ],
      [
        [0,0,0,1,1,0,0,0],
        [0,0,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,0],
        [1,1,0,1,1,0,1,1],
        [1,1,1,1,1,1,1,1],
        [0,0,1,0,0,1,0,0],
        [0,1,0,1,1,0,1,0],
        [1,0,1,0,0,1,0,1],
      ],
    ],
  },

  // Crab – rows 2–3 – 20 pts – 11×8
  crab: {
    w: 11, h: 8,
    frames: [
      [
        [0,0,1,0,0,0,0,0,1,0,0],
        [0,0,0,1,0,0,0,1,0,0,0],
        [0,0,1,1,1,1,1,1,1,0,0],
        [0,1,1,0,1,1,1,0,1,1,0],
        [1,1,1,1,1,1,1,1,1,1,1],
        [1,0,1,1,1,1,1,1,1,0,1],
        [1,0,1,0,0,0,0,0,1,0,1],
        [0,0,0,1,1,0,1,1,0,0,0],
      ],
      [
        [0,0,1,0,0,0,0,0,1,0,0],
        [1,0,0,1,0,0,0,1,0,0,1],
        [1,0,1,1,1,1,1,1,1,0,1],
        [1,1,1,0,1,1,1,0,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1],
        [0,1,1,1,1,1,1,1,1,1,0],
        [0,0,1,0,0,0,0,0,1,0,0],
        [0,1,0,0,0,0,0,0,0,1,0],
      ],
    ],
  },

  // Octopus – rows 4–5 – 10 pts – 12×8
  octopus: {
    w: 12, h: 8,
    frames: [
      [
        [0,0,0,0,1,1,1,1,0,0,0,0],
        [0,1,1,1,1,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,0,0,1,1,0,0,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1],
        [0,0,0,1,1,0,0,1,1,0,0,0],
        [0,0,1,1,0,1,1,0,1,1,0,0],
        [1,1,0,0,0,0,0,0,0,0,1,1],
      ],
      [
        [0,0,0,0,1,1,1,1,0,0,0,0],
        [0,1,1,1,1,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,0,0,1,1,0,0,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1],
        [0,0,1,1,0,0,0,0,1,1,0,0],
        [0,1,1,0,0,1,1,0,0,1,1,0],
        [0,0,1,1,0,0,0,0,1,1,0,0],
      ],
    ],
  },

  // Player ship – 13×8
  player: {
    w: 13, h: 8,
    frames: [
      [
        [0,0,0,0,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,1,1,1,0,0,0,0,0],
        [0,0,0,0,0,1,1,1,0,0,0,0,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1],
      ],
    ],
  },

  // UFO / mystery ship – 16×7
  ufo: {
    w: 16, h: 7,
    frames: [
      [
        [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
        [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
        [0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [0,0,1,1,0,0,1,1,1,1,0,0,1,1,0,0],
        [0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0],
      ],
    ],
  },

  // Player explosion – 13×8
  explosion: {
    w: 13, h: 8,
    frames: [
      [
        [0,0,1,0,0,0,0,0,1,0,0,1,0],
        [0,0,0,1,0,0,0,1,0,0,0,0,0],
        [0,0,0,0,1,0,1,0,0,0,0,0,1],
        [1,0,0,1,0,1,0,1,0,0,1,0,0],
        [0,0,1,0,1,0,1,0,1,0,0,0,0],
        [1,0,0,0,0,1,0,0,0,0,0,1,0],
        [0,1,0,0,0,0,0,0,1,0,1,0,0],
        [0,0,0,1,0,0,0,0,0,1,0,0,0],
      ],
    ],
  },

};

// Draw a named sprite (or a raw sprite object) at (x,y) in the given colour
function drawSprite(sprite, frame, x, y, color) {
  const s    = (typeof sprite === 'string') ? SPRITES[sprite] : sprite;
  const rows = s.frames[frame % s.frames.length];
  ctx.fillStyle = color;
  for (let r = 0; r < s.h; r++) {
    for (let c = 0; c < s.w; c++) {
      if (rows[r][c]) {
        ctx.fillRect(Math.floor(x + c * P), Math.floor(y + r * P), P, P);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Layout constants
// ---------------------------------------------------------------------------
const HUD_H       = 55;           // height of top HUD area
const BOTTOM_H    = 55;           // height of bottom lives area
const PLAY_TOP    = HUD_H;
const PLAY_BOT    = H - BOTTOM_H;
const PLAY_LEFT   = 20;
const PLAY_RIGHT  = W - 20;

// Alien grid
const ALIEN_COLS      = 11;
const ALIEN_ROWS      = 5;
const ALIEN_SLOT_W    = 16 * P;   // 48 px – fits the widest sprite (12 px × P) + padding
const ALIEN_SLOT_H    = 12 * P;   // 36 px – fits 8-px-tall sprite + gap
const ALIEN_STEP      = 8;        // horizontal pixels per move step
const ALIEN_DROP      = ALIEN_SLOT_H / 2; // pixels dropped per wall-bounce
const FORMATION_W     = ALIEN_COLS * ALIEN_SLOT_W;   // 528
const FORMATION_H     = ALIEN_ROWS * ALIEN_SLOT_H;   // 180
const FORMATION_X0    = Math.floor((W - FORMATION_W) / 2);  // 136
const FORMATION_Y0    = PLAY_TOP + 35;

const ROW_TYPE   = ['squid',   'crab',  'crab',    'octopus', 'octopus'];
const ROW_POINTS = [30,         20,      20,         10,        10      ];

// Player
const PLAYER_W  = SPRITES.player.w * P;   // 39
const PLAYER_H  = SPRITES.player.h * P;   // 24
const PLAYER_Y  = PLAY_BOT - PLAYER_H - 10;
const PLAYER_SPD = 4;

// Bullets
const PBULLET_W  = P;
const PBULLET_H  = P * 5;
const PBULLET_SPD = 12;
const ABULLET_W  = P;
const ABULLET_H  = P * 5;
const ABULLET_SPD = 4;
const MAX_ALIEN_BULLETS = 3;

// Shields  (4 bunkers)
const SHIELD_COLS    = 22;
const SHIELD_ROWS    = 16;
const SHIELD_PX      = P;          // one shield "pixel" = P real pixels
const SHIELD_PX_W    = SHIELD_COLS * SHIELD_PX;   // 66
const SHIELD_PX_H    = SHIELD_ROWS * SHIELD_PX;   // 48
const SHIELD_COUNT   = 4;
const SHIELD_GAP     = Math.floor((W - SHIELD_COUNT * SHIELD_PX_W) / (SHIELD_COUNT + 1)); // ~26
const SHIELD_Y       = PLAYER_Y - SHIELD_PX_H - 20;

// Shield pixel pattern  (22 wide × 16 tall)
const SHIELD_PATTERN = [
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1],
  [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],
  [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
  [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
];

// UFO
const UFO_W      = SPRITES.ufo.w * P;   // 48
const UFO_H      = SPRITES.ufo.h * P;   // 21
const UFO_Y      = PLAY_TOP + 8;
const UFO_SPD    = 2;
const UFO_POINTS = [50, 100, 150, 300];
const UFO_INTERVAL = 25 * 60;           // ~25 s between appearances

// ---------------------------------------------------------------------------
// Game state variables
// ---------------------------------------------------------------------------
let state;       // 'start' | 'playing' | 'dying' | 'levelup' | 'gameover'
let score, hiScore, lives, level, frame, animFlip;

// Player
let player;       // { x, y }
let playerBullet; // null | { x, y }
let deathTimer;

// Aliens
let aliens;       // array of { col, row, type, pts, alive, x, y }
let alienDir;     // 1 | -1
let alienOX;      // current left-edge offset (origin X)
let alienOY;      // current top offset
let alienMoveTimer;
let totalAliens;
let aliensAlive;  // cached count — decremented on each kill
let bottomByCol;  // col → alien with highest row index still alive

// Alien bullets
let alienBullets; // array of { x, y }
let alienFireTimer;

// Shields
let shields;      // array of { x, y, px: 2-D array of 0/1 }

// UFO
let ufo;  // { active, x, dir, dead, deathTimer, pts }
let ufoTimer;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function overlaps(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function getAlienInterval() {
  if (aliensAlive === 0) return 2;
  const base = Math.max(5, 55 - (level - 1) * 8);
  return Math.max(2, Math.round(base * aliensAlive / totalAliens));
}

// Compute pixel position of alien (col, row) given current offsets
function alienPos(col, row) {
  const sp  = SPRITES[ROW_TYPE[row]];
  const slotX = alienOX + col * ALIEN_SLOT_W;
  const slotY = alienOY + row * ALIEN_SLOT_H;
  // Centre sprite inside slot
  const x = slotX + Math.floor((ALIEN_SLOT_W - sp.w * P) / 2);
  const y = slotY + Math.floor((ALIEN_SLOT_H - sp.h * P) / 2);
  return { x, y };
}

// Rebuild every alien's x/y from current offsets
function refreshAlienPositions() {
  for (const a of aliens) {
    if (!a.alive) continue;
    const pos = alienPos(a.col, a.row);
    a.x = pos.x;
    a.y = pos.y;
  }
}

// Create a fresh set of aliens for the current level
function createAliens() {
  aliens = [];
  for (let row = 0; row < ALIEN_ROWS; row++) {
    for (let col = 0; col < ALIEN_COLS; col++) {
      aliens.push({ col, row, type: ROW_TYPE[row], pts: ROW_POINTS[row], alive: true, x: 0, y: 0 });
    }
  }
  totalAliens    = aliens.length;
  aliensAlive    = totalAliens;
  alienDir       = 1;
  alienOX        = FORMATION_X0;
  alienOY        = FORMATION_Y0;
  alienMoveTimer = 0;
  // Build bottom-per-column cache (row index increases downward, so highest row = bottom)
  bottomByCol = {};
  for (const a of aliens) {
    if (!bottomByCol[a.col] || a.row > bottomByCol[a.col].row) bottomByCol[a.col] = a;
  }
  refreshAlienPositions();
}

// Create a fresh set of shields
function createShields() {
  shields = [];
  for (let i = 0; i < SHIELD_COUNT; i++) {
    const x = SHIELD_GAP + i * (SHIELD_PX_W + SHIELD_GAP);
    const px = [];
    for (let r = 0; r < SHIELD_ROWS; r++) {
      px.push([...SHIELD_PATTERN[r]]);
    }
    shields.push({ x, y: SHIELD_Y, px });
  }
}

// Damage shield pixels where a bullet (bx,by,bw,bh) hits; returns true if hit
function damageShield(shield, bx, by, bw, bh) {
  if (!overlaps(bx, by, bw, bh, shield.x, shield.y, SHIELD_PX_W, SHIELD_PX_H)) return false;
  const c0 = Math.floor((bx - shield.x) / SHIELD_PX);
  const r0 = Math.floor((by - shield.y) / SHIELD_PX);
  const c1 = Math.ceil((bx + bw - shield.x) / SHIELD_PX);
  const r1 = Math.ceil((by + bh - shield.y) / SHIELD_PX);

  let hit = false;
  for (let r = Math.max(0, r0); r < Math.min(SHIELD_ROWS, r1); r++) {
    for (let c = Math.max(0, c0); c < Math.min(SHIELD_COLS, c1); c++) {
      if (shield.px[r][c]) {
        // Blast a small crater around the impact point
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < SHIELD_ROWS && nc >= 0 && nc < SHIELD_COLS) {
              shield.px[nr][nc] = 0;
            }
          }
        }
        hit = true;
        break;
      }
    }
    if (hit) break;
  }
  return hit;
}

// ---------------------------------------------------------------------------
// Game lifecycle
// ---------------------------------------------------------------------------
function startGame() {
  score = 0;
  lives = 3;
  level = 1;
  resetLevel();
}

function resetLevel() {
  frame         = 0;
  animFlip      = 0;
  playerBullet  = null;
  alienBullets  = [];
  alienFireTimer = 0;
  deathTimer    = 0;
  ufoTimer      = Math.floor(UFO_INTERVAL * 0.4);
  ufo           = { active: false, x: 0, dir: 1, dead: false, deathTimer: 0, pts: 0 };

  player = { x: Math.floor((W - PLAYER_W) / 2), y: PLAYER_Y };
  createAliens();
  createShields();
  state = 'playing';
}

function nextLevel() {
  level++;
  resetLevel();
}

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------
const keys = { left: false, right: false };
let fireHeld = false;
let firePending = false;

window.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft'  || e.key === 'a' || e.key === 'A') keys.left  = true;
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
  if ((e.key === ' ' || e.key === 'z' || e.key === 'Z') && !fireHeld) {
    fireHeld    = true;
    firePending = true;
  }
  if (e.key === ' ' || e.key === 'Enter') {
    if (state === 'start' || state === 'gameover') startGame();
  }
  e.preventDefault();
});

window.addEventListener('keyup', e => {
  if (e.key === 'ArrowLeft'  || e.key === 'a' || e.key === 'A') keys.left  = false;
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
  if (e.key === ' ' || e.key === 'z' || e.key === 'Z') fireHeld = false;
});

// ---------------------------------------------------------------------------
// Update
// ---------------------------------------------------------------------------
function update() {
  if (state !== 'playing' && state !== 'dying') return;
  frame++;

  // Alien animation flip every 30 frames
  if (frame % 30 === 0) animFlip ^= 1;

  updatePlayer();
  updatePlayerBullet();
  updateAliens();
  updateAlienFire();
  updateAlienBullets();
  updateUFO();
}

function updatePlayer() {
  if (state === 'dying') {
    deathTimer--;
    if (deathTimer <= 0) {
      if (lives > 0) {
        playerBullet = null;
        player.x     = Math.floor((W - PLAYER_W) / 2);
        state        = 'playing';
      } else {
        state = 'gameover';
        if (score > hiScore) hiScore = score;
        try { localStorage.setItem('spinv_hi', String(hiScore)); } catch (_) {}
      }
    }
    return;
  }

  if (keys.left)  player.x = Math.max(PLAY_LEFT, player.x - PLAYER_SPD);
  if (keys.right) player.x = Math.min(PLAY_RIGHT - PLAYER_W, player.x + PLAYER_SPD);

  if (firePending && !playerBullet) {
    playerBullet = { x: player.x + Math.floor((PLAYER_W - PBULLET_W) / 2), y: player.y - PBULLET_H };
  }
  firePending = false;
}

function updatePlayerBullet() {
  if (!playerBullet) return;
  playerBullet.y -= PBULLET_SPD;

  // Off top
  if (playerBullet.y + PBULLET_H < PLAY_TOP) { playerBullet = null; return; }

  // Hit UFO
  if (ufo.active && !ufo.dead) {
    if (overlaps(playerBullet.x, playerBullet.y, PBULLET_W, PBULLET_H, ufo.x, UFO_Y, UFO_W, UFO_H)) {
      ufo.pts       = UFO_POINTS[Math.floor(Math.random() * UFO_POINTS.length)];
      score        += ufo.pts;
      ufo.dead      = true;
      ufo.deathTimer = 90;
      playerBullet  = null;
      return;
    }
  }

  // Hit alien
  for (const a of aliens) {
    if (!a.alive) continue;
    const sp = SPRITES[a.type];
    if (overlaps(playerBullet.x, playerBullet.y, PBULLET_W, PBULLET_H, a.x, a.y, sp.w * P, sp.h * P)) {
      a.alive      = false;
      aliensAlive--;
      score       += a.pts;
      playerBullet = null;
      // Update bottom-per-column cache: find next alive alien above in same column
      if (bottomByCol[a.col] === a) {
        bottomByCol[a.col] = null;
        for (let r = a.row - 1; r >= 0; r--) {
          const above = aliens[r * ALIEN_COLS + a.col];
          if (above && above.alive) { bottomByCol[a.col] = above; break; }
        }
      }
      // Win?
      if (aliensAlive === 0) {
        state = 'levelup';
        setTimeout(nextLevel, 2000);
      }
      return;
    }
  }

  // Hit shield
  for (const sh of shields) {
    if (damageShield(sh, playerBullet.x, playerBullet.y, PBULLET_W, PBULLET_H)) {
      playerBullet = null;
      return;
    }
  }
}

function updateAliens() {
  if (state !== 'playing') return;
  alienMoveTimer++;
  if (alienMoveTimer < getAlienInterval()) return;
  alienMoveTimer = 0;

  // Try moving in current direction
  alienOX += ALIEN_STEP * alienDir;

  // Find actual pixel bounds of living aliens
  let left = Infinity, right = -Infinity;
  for (const a of aliens) {
    if (!a.alive) continue;
    const sp = SPRITES[a.type];
    const pos = alienPos(a.col, a.row);
    left  = Math.min(left,  pos.x);
    right = Math.max(right, pos.x + sp.w * P);
  }

  // Bounce off walls
  if (alienDir === 1 && right > PLAY_RIGHT) {
    alienOX  -= ALIEN_STEP * alienDir;  // undo overshoot
    alienDir  = -1;
    alienOY  += ALIEN_DROP;
  } else if (alienDir === -1 && left < PLAY_LEFT) {
    alienOX  -= ALIEN_STEP * alienDir;
    alienDir  = 1;
    alienOY  += ALIEN_DROP;
  }

  refreshAlienPositions();

  // Check if any alien reached player level
  for (const a of aliens) {
    if (!a.alive) continue;
    const sp = SPRITES[a.type];
    if (a.y + sp.h * P >= PLAYER_Y) {
      state = 'gameover';
      if (score > hiScore) hiScore = score;
      try { localStorage.setItem('spinv_hi', String(hiScore)); } catch (_) {}
      return;
    }
  }
}

function updateAlienFire() {
  if (state !== 'playing') return;
  if (alienBullets.length >= MAX_ALIEN_BULLETS) return;
  alienFireTimer++;
  const interval = Math.max(25, 70 - level * 8);
  if (alienFireTimer < interval) return;
  alienFireTimer = 0;

  // Use cached bottom-per-column map
  const candidates = Object.values(bottomByCol).filter(a => a !== null);
  if (candidates.length === 0) return;

  const shooter = candidates[Math.floor(Math.random() * candidates.length)];
  const sp = SPRITES[shooter.type];
  alienBullets.push({
    x: shooter.x + Math.floor((sp.w * P - ABULLET_W) / 2),
    y: shooter.y + sp.h * P,
  });
}

function updateAlienBullets() {
  for (let i = alienBullets.length - 1; i >= 0; i--) {
    const b = alienBullets[i];
    b.y += ABULLET_SPD;

    // Off bottom
    if (b.y > H) { alienBullets.splice(i, 1); continue; }

    // Hit player
    if (state === 'playing' &&
        overlaps(b.x, b.y, ABULLET_W, ABULLET_H, player.x, player.y, PLAYER_W, PLAYER_H)) {
      alienBullets.splice(i, 1);
      lives--;
      state      = 'dying';
      deathTimer = 120;
      continue;
    }

    // Hit shield
    let blocked = false;
    for (const sh of shields) {
      if (damageShield(sh, b.x, b.y, ABULLET_W, ABULLET_H)) { blocked = true; break; }
    }
    if (blocked) { alienBullets.splice(i, 1); }
  }
}

function updateUFO() {
  if (ufo.dead) {
    ufo.deathTimer--;
    if (ufo.deathTimer <= 0) { ufo.active = false; ufo.dead = false; }
    return;
  }
  if (!ufo.active) {
    ufoTimer--;
    if (ufoTimer <= 0) {
      ufoTimer   = UFO_INTERVAL;
      ufo.active = true;
      ufo.dir    = (Math.random() > 0.5) ? 1 : -1;
      ufo.x      = ufo.dir === 1 ? -UFO_W : W;
    }
    return;
  }
  ufo.x += UFO_SPD * ufo.dir;
  if ((ufo.dir === 1 && ufo.x > W) || (ufo.dir === -1 && ufo.x + UFO_W < 0)) {
    ufo.active = false;
    ufoTimer   = UFO_INTERVAL;
  }
}

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------
function render() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);

  if (state === 'start')    { renderStartScreen(); return; }
  if (state === 'gameover') { renderGameOver(); return; }

  renderHUD();

  // Ground line
  ctx.fillStyle = '#00ff00';
  ctx.fillRect(0, PLAY_BOT, W, 2);

  // Shields
  ctx.fillStyle = '#00ff00';
  for (const sh of shields) {
    for (let r = 0; r < SHIELD_ROWS; r++) {
      for (let c = 0; c < SHIELD_COLS; c++) {
        if (sh.px[r][c]) {
          ctx.fillRect(sh.x + c * SHIELD_PX, sh.y + r * SHIELD_PX, SHIELD_PX, SHIELD_PX);
        }
      }
    }
  }

  // Aliens
  for (const a of aliens) {
    if (!a.alive) continue;
    const color = a.type === 'squid'   ? '#ffffff' :
                  a.type === 'crab'    ? '#aaffaa' : '#55ff55';
    drawSprite(a.type, animFlip, a.x, a.y, color);
  }

  // UFO
  if (ufo.active) {
    if (!ufo.dead) {
      drawSprite('ufo', 0, ufo.x, UFO_Y, '#ff2222');
    } else {
      ctx.fillStyle = '#ff2222';
      ctx.font      = `bold ${P * 5}px monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(String(ufo.pts), ufo.x + UFO_W / 2, UFO_Y + UFO_H / 2 + P);
    }
  }

  // Player bullet
  if (playerBullet) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(playerBullet.x, playerBullet.y, PBULLET_W, PBULLET_H);
  }

  // Alien bullets (drawn as small zigzag-ish lines)
  ctx.fillStyle = '#ff6633';
  for (const b of alienBullets) {
    ctx.fillRect(b.x, b.y,     ABULLET_W,     P);
    ctx.fillRect(b.x + P, b.y + P,   ABULLET_W, P);
    ctx.fillRect(b.x, b.y + P * 2,   ABULLET_W, P);
    ctx.fillRect(b.x + P, b.y + P * 3, ABULLET_W, P);
    ctx.fillRect(b.x, b.y + P * 4,   ABULLET_W, P);
  }

  // Player (or explosion)
  if (state === 'dying') {
    drawSprite('explosion', 0, player.x, player.y, '#ff6600');
  } else {
    drawSprite('player', 0, player.x, player.y, '#00ff00');
  }

  // Level-clear overlay
  if (state === 'levelup') {
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle   = '#ffffff';
    ctx.font        = `bold ${P * 12}px monospace`;
    ctx.textAlign   = 'center';
    ctx.fillText(`LEVEL ${level}`, W / 2, H / 2 - P * 6);
    ctx.font        = `${P * 6}px monospace`;
    ctx.fillText('CLEARED!', W / 2, H / 2 + P * 4);
  }
}

function renderHUD() {
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.font      = `${P * 4}px monospace`;
  ctx.fillText('SCORE', 30, 22);
  ctx.fillText(padScore(score), 30, 44);

  ctx.textAlign = 'center';
  ctx.fillText('HI-SCORE', W / 2, 22);
  ctx.fillText(padScore(hiScore), W / 2, 44);

  // Lives: label + icons
  ctx.textAlign = 'right';
  ctx.fillText(`${lives}`, W - 30, 22);
  for (let i = 0; i < lives; i++) {
    const lx = W - 30 - (lives - i) * (PLAYER_W + 6);
    drawSprite('player', 0, lx, 28, '#00ff00');
  }

  // Level
  ctx.textAlign   = 'center';
  ctx.fillStyle   = '#888';
  ctx.font        = `${P * 3}px monospace`;
  ctx.fillText(`LEVEL ${level}`, W / 2, H - 20);
}

function padScore(n) {
  return String(n).padStart(6, '0');
}

function renderStartScreen() {
  ctx.textAlign   = 'center';
  ctx.fillStyle   = '#00ff00';
  ctx.font        = `bold ${P * 16}px monospace`;
  ctx.fillText('SPACE', W / 2, 140);
  ctx.fillStyle   = '#ffffff';
  ctx.fillText('INVADERS', W / 2, 210);

  // Point table
  const tableEntries = [
    { sprite: 'ufo',     color: '#ff2222', label: '= ??? PTS' },
    { sprite: 'squid',   color: '#ffffff', label: '= 30 PTS'  },
    { sprite: 'crab',    color: '#aaffaa', label: '= 20 PTS'  },
    { sprite: 'octopus', color: '#55ff55', label: '= 10 PTS'  },
  ];
  let ty = 260;
  for (const e of tableEntries) {
    const sp = SPRITES[e.sprite];
    const sx = W / 2 - 80;
    drawSprite(e.sprite, 0, sx, ty, e.color);
    ctx.fillStyle   = e.color;
    ctx.font        = `${P * 5}px monospace`;
    ctx.textAlign   = 'left';
    ctx.fillText(e.label, sx + sp.w * P + 18, ty + sp.h * P / 2 + 6);
    ty += sp.h * P + 20;
  }

  if (Math.floor(Date.now() / 600) % 2 === 0) {
    ctx.fillStyle = '#ffffff';
    ctx.font      = `${P * 6}px monospace`;
    ctx.textAlign = 'center';
    ctx.fillText('PRESS SPACE TO PLAY', W / 2, ty + 48);
  }
  ctx.fillStyle = '#666';
  ctx.font      = `${P * 4}px monospace`;
  ctx.textAlign = 'center';
  ctx.fillText('← → MOVE    SPACE FIRE', W / 2, ty + 90);
}

function renderGameOver() {
  renderHUD();
  ctx.fillStyle   = '#ff0000';
  ctx.font        = `bold ${P * 14}px monospace`;
  ctx.textAlign   = 'center';
  ctx.fillText('GAME OVER', W / 2, H / 2 - 40);

  ctx.fillStyle   = '#ffffff';
  ctx.font        = `${P * 6}px monospace`;
  ctx.fillText(`SCORE  ${padScore(score)}`, W / 2, H / 2 + 30);

  if (score > 0 && score >= hiScore) {
    ctx.fillStyle = '#ffff00';
    ctx.font      = `${P * 5}px monospace`;
    ctx.fillText('NEW HI-SCORE!', W / 2, H / 2 + 70);
  }

  if (Math.floor(Date.now() / 600) % 2 === 0) {
    ctx.fillStyle = '#ffffff';
    ctx.font      = `${P * 5}px monospace`;
    ctx.fillText('PRESS SPACE TO PLAY AGAIN', W / 2, H / 2 + 115);
  }
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------
try { hiScore = parseInt(localStorage.getItem('spinv_hi') || '0') || 0; } catch (_) { hiScore = 0; }
state = 'start';

(function loop() {
  update();
  render();
  requestAnimationFrame(loop);
})();
