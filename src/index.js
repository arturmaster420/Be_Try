import "./style.css";
import { CONFIG } from "./core/config.js";
import { initInput, isKeyDown } from "./core/input.js";
import { createWorld, resetGame, updateWorld } from "./core/world.js";
import { renderFrame } from "./rendering/renderer.js";
import { createWeaponSystem } from "./gameplay/weaponSystem.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  const ratio = CONFIG.CANVAS_WIDTH / CONFIG.CANVAS_HEIGHT;
  let w = window.innerWidth;
  let h = window.innerHeight;
  if (w / h > ratio) {
    w = h * ratio;
  } else {
    h = w / ratio;
  }
  canvas.width = CONFIG.CANVAS_WIDTH;
  canvas.height = CONFIG.CANVAS_HEIGHT;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

initInput(canvas);
const world = createWorld();
const weaponSystem = createWeaponSystem();

let lastTime = performance.now();
function loop(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.12);
  lastTime = now;

  if (world.state === "menu") {
    if (isKeyDown("Space")) {
      resetGame(world);
      world.state = "playing";
    }
  } else if (world.state === "playing") {
    if (isKeyDown("KeyP")) {
      world.state = "paused";
    }
  } else if (world.state === "paused") {
    if (isKeyDown("KeyP")) {
      world.state = "playing";
    }
  } else if (world.state === "gameover") {
    if (isKeyDown("Space") || isKeyDown("KeyR")) {
      resetGame(world);
      world.state = "playing";
    }
  }

  updateWorld(world, dt, weaponSystem);
  renderFrame(ctx, world);

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
