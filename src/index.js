import "./style.css";
import { CONFIG } from "./core/config.js";
import { initInput } from "./core/input.js";
import { createWorld, resetWorld, updateWorld } from "./core/world.js";
import { renderFrame } from "./rendering/renderer.js";

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

let lastTime = performance.now();
function loop(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;

  updateWorld(world, dt);
  renderFrame(ctx, world);

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

window.addEventListener("keydown", (e) => {
  if (e.code === "KeyP") {
    if (world.started && !world.gameOver) {
      world.paused = !world.paused;
    }
  } else if (e.code === "KeyR") {
    world.started = true;
    resetWorld(world);
  } else if (e.code === "Space") {
    world.started = true;
    resetWorld(world);
  }
});


