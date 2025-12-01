export const input = {
  keys: new Set(),
  mouseX: 0,
  mouseY: 0,
  mouseDown: false,
};

export function initInput(canvas) {
  window.addEventListener("keydown", (e) => {
    input.keys.add(e.key.toLowerCase());
    if (e.key === " ") {
      input.keys.add("space");
    }
  });
  window.addEventListener("keyup", (e) => {
    input.keys.delete(e.key.toLowerCase());
    if (e.key === " ") {
      input.keys.delete("space");
    }
  });

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    input.mouseX = e.clientX - rect.left;
    input.mouseY = e.clientY - rect.top;
  });

  canvas.addEventListener("mousedown", () => {
    input.mouseDown = true;
  });
  canvas.addEventListener("mouseup", () => {
    input.mouseDown = false;
  });
}

export function isKeyDown(key) {
  return input.keys.has(key.toLowerCase());
}
