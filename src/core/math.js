// Math / helpers

export function randRange(min, max) {
  return Math.random() * (max - min) + min;
}

export function randInt(min, max) {
  return Math.floor(randRange(min, max));
}

export function clamp(v, min, max) {
  return v < min ? min : v > max ? max : v;
}

export function length(x, y) {
  return Math.hypot(x, y);
}

export function normalize(x, y) {
  const len = Math.hypot(x, y) || 1;
  return [x / len, y / len];
}

export function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function linePointDistance(x1, y1, x2, y2, px, py) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy || 1;
  const t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
  const tt = t < 0 ? 0 : t > 1 ? 1 : t;
  const cx = x1 + dx * tt;
  const cy = y1 + dy * tt;
  return Math.hypot(px - cx, py - cy);
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}
