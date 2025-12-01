import { initInput, input, isKeyDown } from "./input.js";
import { createWorld, setCanvasSize, startGame, saveHighscore } from "./world.js";
import { updateGame } from "./systems.js";
import { render } from "./render.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const world = createWorld();

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = w * window.devicePixelRatio;
  canvas.height = h * window.devicePixelRatio;
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  setCanvasSize(world, w, h);
}
window.addEventListener("resize", resize);
resize();

initInput(canvas);

let lastTime = performance.now();

function loop(now) {
  const dt = Math.min(0.05, (now - lastTime) / 1000);
  lastTime = now;

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

function softReset() {
  startGame(world);
}

function update(dt) {
  if (world.state === "menu") {
    if (isKeyDown(" ") || isKeyDown("space")) {
      softReset();
      world.state = "playing";
    }
    return;
  }

  if (world.state === "paused") {
    if (isKeyDown(" ") || isKeyDown("space")) {
      world.state = "playing";
    } else if (isKeyDown("r")) {
      softReset();
      world.state = "playing";
    }
    return;
  }

  if (world.state === "gameover") {
    if (isKeyDown(" ") || isKeyDown("space") || isKeyDown("r")) {
      saveHighscore(world);
      softReset();
      world.state = "playing";
    }
    return;
  }

  if (isKeyDown("p")) {
    world.state = "paused";
    return;
  }

  updateGame(world, dt);
}
