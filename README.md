# Be_Try — Vite + JS (Full)

Top-down arena shooter for browser (Canvas) with bosses, boosters, crits and waves.

## Scripts

```bash
npm install
npm run dev
```

## GitHub Pages

- Repo name: `Be_Try`
- `vite.config.js` already configured with:

```js
base: "/Be_Try/";
```

If you change repo name, update `base`.

## Controls

Desktop:
- WASD / Arrows — move
- Mouse move + hold / LMB — aim & auto-fire
- **P** — pause
- **SPACE / R** — start / restart

Mobile:
- Tap & drag — move towards finger and auto-fire

## Highscores

Stored in `localStorage`:

- `boxhead2_highscore` — best score
- `boxhead2_bestWave` — best wave
- `boxhead2_bestTime` — best survival time in seconds
