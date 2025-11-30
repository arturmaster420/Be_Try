import { CONFIG } from "./config.js";

export function createCamera() {
  return {
    x: 0,
    y: 0,
  };
}

export function updateCamera(camera, player) {
  camera.x = player.x - CONFIG.CANVAS_WIDTH / 2;
  camera.y = player.y - CONFIG.CANVAS_HEIGHT / 2;
}
