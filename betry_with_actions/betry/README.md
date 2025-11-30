# Be_Try — Vite + JS

Top‑down arena shooter prototype for browser (Canvas).

## Scripts

```bash
npm install
npm run dev
```

## GitHub Pages

1. Push this project into a repo named `Be_Try`.
2. Build:

```bash
npm run build
```

3. Deploy the `dist` folder to GitHub Pages (branch `gh-pages` or via Actions).
4. `vite.config.js` is configured with:

```js
base: "/Be_Try/"
```

Change it if your repo name is different.

## Controls

- **WASD / Arrows** — move
- **Mouse move + hold LMB / touch** — aim and auto‑fire
- **P** — pause (darken screen + `PAUSED` text)
- **R** — restart run

## Bosses & Crit System

- **Booster‑boss**
  - No limit on quantity (can spawn many times).
  - On death gives a temporary buff for **180 seconds**:
    - `+20% crit chance` (up to **90% total crit chance** cap)
    - `+50% crit damage`

- **Other bosses**
  - On death give **one *permanent* upgrade** (equal chance):
    - `+1% crit chance` (permanent part capped at **70%**)
    - `+1% crit damage`
    - `+1% fire rate`
    - `+1% range`
    - `+1% speed`
    - `+1% damage`

- Base crit chance: **0%**
- Base crit damage: **×2**
- Permanent crit chance ≤ **70%**
- Total crit chance (with Booster) ≤ **90%**
- Crit damage has **no upper cap**.

## Highscore

The best score is stored in

```text
localStorage.boxhead2_highscore
```

and shown in the top HUD.
