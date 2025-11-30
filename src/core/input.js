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

    input.mouse.down = true;
  }, { passive: false });

  }, { passive: false });

}

export function isKeyDown(code) {
  return input.keys.has(code);
}
