import "./style.css";
import { CONFIG } from "./config.js";
import { initInput, isKeyDown } from "./input.js";
import { createWorld, resetGame, updateWorld } from "./world.js";
import { render } from "./renderer.js";

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
let prevSpace = false;
let prevP = false;
let prevR = false;

function loop(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.12);
  lastTime = now;

  const space = isKeyDown("Space");
  const p = isKeyDown("KeyP");
  const r = isKeyDown("KeyR");

  if (world.state === "menu") {
    if (space && !prevSpace) {
      resetGame(world);
      world.state = "playing";
    }
  } else if (world.state === "playing") {
    if (p && !prevP) {
      world.state = "paused";
    }
  } else if (world.state === "paused") {
    if (p && !prevP) {
      world.state = "playing";
    }
    if (r && !prevR) {
      resetGame(world);
      world.state = "playing";
    }
  } else if (world.state === "gameover") {
    if ((space && !prevSpace) || (r && !prevR)) {
      resetGame(world);
      world.state = "playing";
    }
  }

  prevSpace = space;
  prevP = p;
  prevR = r;

  updateWorld(world, dt);
  render(ctx, world);

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
