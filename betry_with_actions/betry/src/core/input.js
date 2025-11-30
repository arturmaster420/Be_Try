export const input = {
  keys: new Set(),
  mouse: {
    x: 0,
    y: 0,
    down: false,
  },
};

export function initInput(canvas) {
  window.addEventListener("keydown", (e) => {
    input.keys.add(e.code);
  });
  window.addEventListener("keyup", (e) => {
    input.keys.delete(e.code);
  });

  canvas.addEventListener("mousedown", (e) => {
    input.mouse.down = true;
    updateMousePos(canvas, e);
  });
  window.addEventListener("mouseup", () => {
    input.mouse.down = false;
  });
  canvas.addEventListener("mousemove", (e) => {
    updateMousePos(canvas, e);
  });
  canvas.addEventListener("touchstart", (e) => {
    input.mouse.down = true;
    if (e.touches[0]) updateMouseTouch(canvas, e.touches[0]);
  }, { passive: false });
  canvas.addEventListener("touchmove", (e) => {
    if (e.touches[0]) updateMouseTouch(canvas, e.touches[0]);
  }, { passive: false });
  window.addEventListener("touchend", () => {
    input.mouse.down = false;
  });
}

function updateMousePos(canvas, e) {
  const rect = canvas.getBoundingClientRect();
  input.mouse.x = ((e.clientX - rect.left) / rect.width) * canvas.width;
  input.mouse.y = ((e.clientY - rect.top) / rect.height) * canvas.height;
}

function updateMouseTouch(canvas, t) {
  const rect = canvas.getBoundingClientRect();
  input.mouse.x = ((t.clientX - rect.left) / rect.width) * canvas.width;
  input.mouse.y = ((t.clientY - rect.top) / rect.height) * canvas.height;
}

export function isKeyDown(code) {
  return input.keys.has(code);
}
