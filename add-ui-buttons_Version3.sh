#!/usr/bin/env bash
#
# add-ui-buttons.sh
#
# Автоматически добавляет UI-файлы (src/ui.js, src/ui.css), вносит изменения в src/index.js,
# создаёт ветку, коммитит и пушит в origin, и (опционально) открывает PR через gh CLI.
#
# Требования:
# - git (локальный репозиторий должен быть чистым или вы согласны потереть незакоммиченные изменения)
# - gh (опционально, для автоматического создания PR). Если gh отсутствует — скрипт только пушит ветку.
# - Права на пуш в репозиторий (write access)
#
# Использование:
# 1) Сохраните файл как add-ui-buttons.sh в корне репозитория.
# 2) Сделайте исполняемым: chmod +x add-ui-buttons.sh
# 3) Запустите: ./add-ui-buttons.sh
#
set -euo pipefail

REPO_ROOT="$(pwd)"
SRC_DIR="${REPO_ROOT}/src"
INDEX_FILE="${SRC_DIR}/index.js"
UI_JS="${SRC_DIR}/ui.js"
UI_CSS="${SRC_DIR}/ui.css"

# По умолчанию имя ветки
DEFAULT_BRANCH="add-ui-buttons-$(date +%Y%m%d%H%M%S)"
BRANCH="${1:-$DEFAULT_BRANCH}"

echo "Repository root: $REPO_ROOT"
echo "Target branch: $BRANCH"
echo

# Проверки
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Ошибка: текущая папка не является git-репозиторием."
  exit 1
fi

if [ ! -f "$INDEX_FILE" ]; then
  echo "Ошибка: не найден $INDEX_FILE. Убедитесь, что вы запустили скрипт из корня репозитория."
  exit 2
fi

# Проверка чистоты рабочей директории
if [ -n "$(git status --porcelain)" ]; then
  echo "Внимание: рабочая директория содержит незакоммиченные изменения:"
  git status --porcelain
  echo
  read -p "Продолжить и создать ветку несмотря на несохранённые изменения? (y/N) " yn
  case "$yn" in
    [Yy]*) echo "Продолжаем...";;
    *) echo "Отмена."; exit 3;;
  esac
fi

# Создаём ветку
echo "Создаю ветку $BRANCH..."
git checkout -b "$BRANCH"

# Создаём src/ui.js
if [ -f "$UI_JS" ]; then
  echo "Файл $UI_JS уже существует — будет перезаписан. Делаем резервную копию ${UI_JS}.bak"
  cp -v "$UI_JS" "${UI_JS}.bak"
fi

cat > "$UI_JS" <<'EOF'
// src/ui.js
export function initUI() {
  const root = document.getElementById('ui') || (function () {
    const d = document.createElement('div');
    d.id = 'ui';
    document.body.appendChild(d);
    return d;
  })();

  // Если уже добавлено — не дублируем
  if (root.getAttribute('data-ui-initialized')) return;
  root.setAttribute('data-ui-initialized', '1');

  // Контейнер панели
  const panel = document.createElement('div');
  panel.className = 'bt-ui-panel';

  // Заголовок/инфо (можно редактировать)
  const title = document.createElement('div');
  title.className = 'bt-ui-title';
  title.textContent = 'BE_TRY';
  panel.appendChild(title);

  // Кнопки
  const btnContainer = document.createElement('div');
  btnContainer.className = 'bt-ui-btns';

  function makeBtn(text, onClick) {
    const b = document.createElement('button');
    b.className = 'bt-ui-btn';
    b.textContent = text;
    b.addEventListener('click', onClick);
    return b;
  }

  // Попытка безопасно вызвать старт
  function simulateStart() {
    if (typeof window.startGame === 'function') {
      try { window.startGame(); return; } catch (e) { /* ignore */ }
    }
    const ev = new KeyboardEvent('keydown', { key: ' ', code: 'Space', keyCode: 32, which: 32, bubbles: true });
    window.dispatchEvent(ev);
    const canvas = document.getElementById('game');
    if (canvas) {
      try { canvas.dispatchEvent(new MouseEvent('click', { bubbles: true })); } catch (e) {}
    }
    window.dispatchEvent(new CustomEvent('bt-ui-start'));
  }

  function simulatePause() {
    if (typeof window.togglePause === 'function') {
      try { window.togglePause(); return; } catch (e) { /* ignore */ }
    }
    const ev = new KeyboardEvent('keydown', { key: 'p', code: 'KeyP', keyCode: 80, which: 80, bubbles: true });
    window.dispatchEvent(ev);
    window.dispatchEvent(new CustomEvent('bt-ui-pause'));
  }

  function simulateRestart() {
    if (typeof window.restartGame === 'function') {
      try { window.restartGame(); return; } catch (e) { /* ignore */ }
    }
    const canvas = document.getElementById('game');
    if (canvas) {
      const ev = new KeyboardEvent('keydown', { key: 'r', code: 'KeyR', keyCode: 82, which: 82, bubbles: true });
      window.dispatchEvent(ev);
    } else {
      location.reload();
    }
    window.dispatchEvent(new CustomEvent('bt-ui-restart'));
  }

  const startBtn = makeBtn('Start', simulateStart);
  const pauseBtn = makeBtn('Pause', simulatePause);
  const restartBtn = makeBtn('Restart', simulateRestart);

  btnContainer.appendChild(startBtn);
  btnContainer.appendChild(pauseBtn);
  btnContainer.appendChild(restartBtn);
  panel.appendChild(btnContainer);

  const hint = document.createElement('div');
  hint.className = 'bt-ui-hint';
  hint.textContent = 'Press Space or click Start. WASD / arrows to move.';
  panel.appendChild(hint);

  root.appendChild(panel);

  panel.addEventListener('dblclick', () => {
    panel.classList.toggle('bt-ui-hidden');
  });
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(() => { initUI(); }, 0);
} else {
  window.addEventListener('DOMContentLoaded', () => initUI());
}
EOF

echo "Создан $UI_JS"

# Создаём src/ui.css
if [ -f "$UI_CSS" ]; then
  echo "Файл $UI_CSS уже существует — будет перезаписан. Делаем резервную копию ${UI_CSS}.bak"
  cp -v "$UI_CSS" "${UI_CSS}.bak"
fi

cat > "$UI_CSS" <<'EOF'
/* src/ui.css */
#ui {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  pointer-events: none; /* Чтобы клики шли на canvas, пока панель скрыта */
  font-family: Arial, Helvetica, sans-serif;
  z-index: 9999;
}

.bt-ui-panel {
  pointer-events: auto;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  min-width: 360px;
  background: linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.35) 100%);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 6px;
  padding: 18px 22px;
  color: #eee;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
}

.bt-ui-title {
  font-weight: 700;
  letter-spacing: 3px;
  font-size: 22px;
  margin-bottom: 10px;
}

.bt-ui-btns {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin: 8px 0 12px;
}

.bt-ui-btn {
  background: rgba(255,255,255,0.04);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.08);
  padding: 8px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: transform .06s ease, background .06s ease;
}

.bt-ui-btn:hover { transform: translateY(-2px); background: rgba(255,255,255,0.06); }
.bt-ui-btn:active { transform: translateY(0); }

.bt-ui-hint {
  font-size: 11px;
  color: #cfcfcf;
  opacity: 0.9;
}

.bt-ui-hidden { display: none !important; }
EOF

echo "Создан $UI_CSS"

# Редактируем src/index.js: добавим импорты и вызов initUI() при необходимости
# 1) Добавить импорты после строки с import "./style.css";
if grep -q "import './ui.css'" "$INDEX_FILE"; then
  echo "Импорт ui.css уже присутствует в $INDEX_FILE — пропускаем добавление импортов."
else
  echo "Добавляю импорты ui.css и ui.js в $INDEX_FILE"
  # делаем резервную копию
  cp -v "$INDEX_FILE" "${INDEX_FILE}.bak"
  awk '{
    print $0
    if (!added && $0 ~ /import [\"'\"].*style\.css[\"'\"].*;/) {
      print "import '\\''./ui.css'\\'';"
      print "import { initUI } from '\\''./ui.js'\\'';"
      added=1
    }
  } END { if (!added) { print \"\\nimport './ui.css';\"; print \"import { initUI } from './ui.js';\" } }' "$INDEX_FILE" > "${INDEX_FILE}.tmp"
  mv "${INDEX_FILE}.tmp" "$INDEX_FILE"
  echo "Импорты добавлены (резервная копия сохранена как ${INDEX_FILE}.bak)."
fi

# 2) Добавить initUI(); в конце файла, если нет
if grep -q "initUI()" "$INDEX_FILE"; then
  echo "Вызов initUI() уже присутствует в $INDEX_FILE — пропускаем добавление."
else
  echo "Добавляю вызов initUI(); в конец $INDEX_FILE"
  cat >> "$INDEX_FILE" <<'EOF'


// Инициализировать UI
initUI();
EOF
  echo "Вызов initUI() добавлен."
fi

# Git add / commit
git add "$UI_JS" "$UI_CSS" "$INDEX_FILE"
git commit -m "Add UI buttons (Start/Pause/Restart) and integrate into src/index.js"

echo "Коммит создан."

# Пушим ветку
echo "Пушим ветку в origin..."
git push -u origin "$BRANCH"

echo "Ветка $BRANCH запушена."

# Попробуем автоматически открыть PR через gh, если доступен
if command -v gh >/dev/null 2>&1; then
  echo "gh CLI найден — создаём PR..."
  PR_TITLE="Add UI buttons (Start/Pause/Restart)"
  PR_BODY="Добавляет панель Start/Pause/Restart и интеграцию в src/index.js. Кнопки вызывают существующие обработчики или симулируют Space/P/R и клик по canvas.\n\nПроверьте работу локально: npm install && npm run dev"
  # Попытка создать PR и вывести URL
  PR_URL=$(gh pr create --base main --head "$BRANCH" --title "$PR_TITLE" --body "$PR_BODY" --web 2>/dev/null || true)
  # gh pr create --web откроет веб-интерфейс и вернёт не URL; пробуем без --web если предыдущая команда вернула пусто
  if [ -z "$PR_URL" ]; then
    # попробуем создать программно и вывести URL
    gh pr create --base main --head "$BRANCH" --title "$PR_TITLE" --body "$PR_BODY"
    echo "PR создан (проверьте в GitHub)."
  else
    echo "Открыт браузер для создания PR: $PR_URL"
  fi
else
  echo "gh CLI не установлен или не доступен. Чтобы вручную создать PR, используйте:"
  echo "  git push -u origin $BRANCH"
  echo "Затем откройте репозиторий на GitHub и создайте Pull Request из ветки $BRANCH в main."
fi

echo
echo "Готово. Проверьте изменения, протестируйте локально (npm run dev) и создайте PR вручную если он не был автоматически создан."