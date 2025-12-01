// Keyboard + mouse input

export const input = {
  keys: new Set(),
  mouseDown: false,
  mouseX: 0,
  mouseY: 0,
};

export function initInput(canvas) {
  window.addEventListener('keydown', (e) => {
    input.keys.add(e.key.toLowerCase());
  });
  window.addEventListener('keyup', (e) => {
    input.keys.delete(e.key.toLowerCase());
  });
  canvas.addEventListener('mousedown', () => {
    input.mouseDown = true;
  });
  window.addEventListener('mouseup', () => {
    input.mouseDown = false;
  });
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    input.mouseX = e.clientX - rect.left;
    input.mouseY = e.clientY - rect.top;
  });
}

export function isKeyDown(k) {
  return input.keys.has(k.toLowerCase());
}
