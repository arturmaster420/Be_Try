export function clamp(v, min, max) {
  return v < min ? min : v > max ? max : v;
}

export function length(x, y) {
  return Math.hypot(x, y);
}

export function normalize(x, y) {
  const d = Math.hypot(x, y) || 1;
  return [x / d, y / d];
}

export function randRange(min, max) {
  return min + Math.random() * (max - min);
}

export function randInt(min, maxInclusive) {
  return Math.floor(min + Math.random() * (maxInclusive - min + 1));
}

export function linePointDistance(x1, y1, x2, y2, px, py) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / len2;
  t = clamp(t, 0, 1);
  const cx = x1 + dx * t;
  const cy = y1 + dy * t;
  return Math.hypot(px - cx, py - cy);
}
