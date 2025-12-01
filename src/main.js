import { initInput, input, isKeyDown } from './core/input.js';
import { createInitialWorld, setCanvasSize, saveHighscore } from './core/world.js';
import { updatePlayer } from './core/player.js';
import { startGame, updateGameplay } from './gameplay/waves.js';
import { handleShooting } from './gameplay/shooting.js';
import { render } from './rendering/renderer.js';
import { WORLD } from './core/config.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const world = createInitialWorld();
world.width = WORLD.width;
world.height = WORLD.height;

initInput(canvas);

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = w * window.devicePixelRatio;
  canvas.height = h * window.devicePixelRatio;
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  setCanvasSize(world, w, h);
}
window.addEventListener('resize', resize);
resize();

let lastTime = performance.now();

function loop(now) {
  const dt = Math.min(0.05, (now - lastTime) / 1000);
  lastTime = now;

  // update mouse world coords
  const cam = world.camera;
  const cw = world.canvasWidth;
  const ch = world.canvasHeight;
  const mx = input.mouseX - cw / 2;
  const my = input.mouseY - ch / 2;
  const invZoom = 1 / cam.zoom;
  world.mouseWorldX = cam.x + mx * invZoom;
  world.mouseWorldY = cam.y + my * invZoom;

  update(dt);
  render(world, ctx);

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

function update(dt) {
  if (world.state === 'menu') {
    if (isKeyDown(' ') || isKeyDown('space')) {
      startGame(world);
    }
    return;
  }

  if (world.state === 'paused') {
    if (isKeyDown(' ') || isKeyDown('space')) {
      world.state = 'playing';
    }
    if (isKeyDown('r')) {
      startGame(world);
    }
    return;
  }

  if (world.state === 'gameover') {
    if (isKeyDown(' ') || isKeyDown('space') || isKeyDown('r')) {
      saveHighscore(world);
      startGame(world);
    }
    return;
  }

  // playing
  if (isKeyDown('p')) {
    world.state = 'paused';
    return;
  }

  updatePlayer(world, dt);
  handleShooting(world, dt);
  updateGameplay(world, dt);
}
