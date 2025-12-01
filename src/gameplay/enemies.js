// src/gameplay/enemies.js
// Минималистичная система врагов для Be_Try core

import { CONFIG } from "../core/config.js";

// Вспомогательные функции
function randRange(min, max) {
  return min + Math.random() * (max - min);
}

function randFloat(min, max) {
  return min + Math.random() * (max - min);
}

// Создание врага по типу
function createEnemy(type = "normal") {
  if (type === "boss") {
    return {
      type,
      x: 0,
      y: 0,
      radius: 35,
      hp: 300,
      maxHp: 300,
      speed: 22,
      dead: false,
    };
  }

  // Обычный враг
  return {
    type,
    x: 0,
    y: 0,
    radius: 18,
    hp: 35,
    maxHp: 35,
    speed: 45,
    dead: false,
  };
}

// Спавн одного врага вокруг игрока
export function spawnEnemy(world, type = "normal") {
  const player = world.player;

  // Спавним не слишком далеко, но и не в кадре
  const inner = 800;
  const outer = 1400;
  const distance = randRange(inner, outer);
  const angle = randFloat(0, Math.PI * 2);

  const e = createEnemy(type);
  e.x = player.x + Math.cos(angle) * distance;
  e.y = player.y + Math.sin(angle) * distance;

  world.enemies.push(e);
}

// Спавн волны
export function spawnWave(world) {
  const wave = world.wave || 1;

  // Базовое количество врагов: растёт с волной
  const baseCount = 6 + wave * 2;

  for (let i = 0; i < baseCount; i++) {
    // Вероятность босса (можно подправить)
    const isBoss = Math.random() < (world.bossChance || 0.05);
    spawnEnemy(world, isBoss ? "boss" : "normal");
  }
}

// Обновление таймера волн
export function updateSpawns(world, dt) {
  if (world.spawnTimer == null) {
    world.spawnTimer = 0;
  }

  world.spawnTimer -= dt;

  if (world.spawnTimer <= 0) {
    // Новая волна
    world.wave = (world.wave || 1) + 1;
    spawnWave(world);

    // Интервал между волнами, можно регулировать
    world.spawnTimer = 8;
  }
}

// Обновление всех врагов
export function updateEnemies(world, dt) {
  const player = world.player;
  const enemies = world.enemies;

  for (let i = 0; i < enemies.length; i++) {
    const e = enemies[i];
    if (e.dead) continue;

    const dx = player.x - e.x;
    const dy = player.y - e.y;
    const dist = Math.hypot(dx, dy) || 1;

    // Движение к игроку
    const speed = e.speed * dt;
    e.x += (dx / dist) * speed;
    e.y += (dy / dist) * speed;

    // Простое столкновение с игроком
    if (dist < e.radius + player.radius) {
      // Урон игроку, если HP не бесконечный
      if (!CONFIG.infiniteHP) {
        player.hp -= 5;
        if (player.hp < 0) player.hp = 0;
      }
    }

    // Смерть врага
    if (e.hp <= 0 && !e.dead) {
      e.dead = true;
      world.score += e.type === "boss" ? 150 : 25;
    }
  }

  // Чистим мёртвых
  world.enemies = enemies.filter((e) => !e.dead);
}
