export const input = {
  keys: new Set(),
  mouse: { x: 0, y: 0, down: false },
};

export function initInput(canvas) {
  window.addEventListener("keydown", (e) => {
    input.keys.add(e.code);
  });
  window.addEventListener("keyup", (e) => {
    input.keys.delete(e.code);
  });

  const updateMouse = (clientX, clientY) => {
    const rect = canvas.getBoundingClientRect();
    input.mouse.x = ((clientX - rect.left) / rect.width) * canvas.width;
    input.mouse.y = ((clientY - rect.top) / rect.height) * canvas.height;
  };

  canvas.addEventListener("mousedown", (e) => {
    input.mouse.down = true;
    updateMouse(e.clientX, e.clientY);
  });

  window.addEventListener("mouseup", () => {
    input.mouse.down = false;
  });

  canvas.addEventListener("mousemove", (e) => {
    updateMouse(e.clientX, e.clientY);
  });
}

export function isKeyDown(code) {
  return input.keys.has(code);
}
