export const input = {
  keys: new Set(),
  mouse: { x: 0, y: 0, down: false },
};

export function initInput(canvas) {
  window.addEventListener("keydown", (e) => input.keys.add(e.code));
  window.addEventListener("keyup", (e) => input.keys.delete(e.code));

  const update = (clientX, clientY) => {
    const rect = canvas.getBoundingClientRect();
    input.mouse.x = ((clientX - rect.left) / rect.width) * canvas.width;
    input.mouse.y = ((clientY - rect.top) / rect.height) * canvas.height;
  };

  canvas.addEventListener("mousedown", (e) => {
    input.mouse.down = true;
    update(e.clientX, e.clientY);
  });
  window.addEventListener("mouseup", () => (input.mouse.down = false));
  canvas.addEventListener("mousemove", (e) => update(e.clientX, e.clientY));

  canvas.addEventListener("touchstart", (e) => {
    input.mouse.down = true;
    if (e.touches[0]) update(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: false });

  canvas.addEventListener("touchmove", (e) => {
    if (e.touches[0]) update(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: false });

  window.addEventListener("touchend", () => (input.mouse.down = false));
}

export function isKeyDown(code) {
  return input.keys.has(code);
}
