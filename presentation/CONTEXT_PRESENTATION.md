# CONTEXT_PRESENTATION.md

# Контекст для генерации презентации DOMinator (RS Tandem)

Этот файл содержит всё необходимое для воссоздания презентации без доступа к исходному коду проекта.
Агент, получивший только этот файл, должен получить презентацию, эквивалентную оригинальной.

---

## 1. Мета-информация о презентации

| Параметр      | Значение                                     |
| ------------- | -------------------------------------------- |
| Название      | DOMinator — RS Tandem                        |
| Подзаголовок  | HTML & CSS Trainer for Interview Preparation |
| Событие       | RSS (Rolling Scopes School) Stage 2, 2026    |
| Команда       | Team DevBand                                 |
| Слайдов       | 23                                           |
| Инструмент    | [Slidev](https://sli.dev) v0.50.0            |
| Тема          | `seriph`                                     |
| Переход       | `slide-left`                                 |
| Язык контента | Русский (заголовки могут быть на английском) |

---

## 2. Продукт

### Что это

SPA-тренажёр по HTML/CSS для подготовки к техническим интервью.
Пользователь выбирает тему и уровень сложности, отвечает на вопросы с вариантами ответов,
получает очки, ачивки и историю результатов.

### Ключевая особенность

Вопросы генерируются языковой моделью (LLM) через Supabase Edge Function.
Готовые вопросы кэшируются в базе данных — повторный запрос по той же теме мгновенный.

### Деплой

- **Live:** https://webis-2022-rs-tandem.netlify.app/
- **GitHub:** https://github.com/Webis-2022/rs-tandem
- **Видео-демо (Checkpoint 7):** https://youtu.be/G-3mqGBa_RM
- **Видео-демо (Checkpoint 5):** https://youtu.be/HWwnsfwI7CI

---

## 3. Команда

| Участник            | GitHub      | Роли                  | Что реализовал                                                                                                                                                                                                                                                          |
| ------------------- | ----------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Евгений Верёвкин    | @Webis-2022 | Tech Lead, Архитектор | Настройка проекта (TS/Vite/ESLint/Husky/Vitest), структура папок, архитектура, API layer (Supabase CRUD), Edge Function + LLM-интеграция, prompt engineering, Practice экран, оптимизация рендера (partial update), Dashboard, Final Screen, система ачивок, юнит-тесты |
| Александра Потапова | @alekspanda | Frontend, Backend     | Auth экран (login/register, валидация), Library экран (выбор тем, сложности), resume flow (localStorage → Supabase active_games), таблица active_games, синхронизация прогресса, loading states, централизованная обработка ошибок, 404 страница, юнит-тесты            |
| Сергей Уразов       | @Urazof     | Frontend, UI          | Auth service (register/login/logout, токен-refresh, localStorage), модальное окно (singleton + Promise API), Layout (header/nav/main/footer, auth-aware, dark/light theme, a11y), Landing page (hero, features, FAQ, auth-aware CTA), юнит-тесты                        |

**Ментор:** Иван
**Командные встречи:** 5 встреч
**Timeline:** февраль — апрель 2026 (7 недель)
**Pull Requests:** ~180+ за время проекта

---

## 4. Технический стек

### Frontend

- **TypeScript** — строгая типизация, интерфейсы для публичных API
- **Vite** — быстрый dev-сервер и сборка
- **SCSS** — дизайн-токены через переменные, mobile-first, dark/light через CSS custom properties + `[data-theme]`
- **Vitest** + `@testing-library/dom` + jsdom — 123+ тестов, 12 тест-файлов
- **ESLint** + **Prettier** + **Husky** — качество кода и линтинг на pre-commit
- **GitHub Actions** — CI: `tsc --noEmit` + `eslint` + `vitest --run` на каждый PR

### Backend / Infrastructure

- **Supabase** — PostgreSQL, Auth, Edge Functions, Row Level Security (RLS)
- **LLM API** через Supabase Edge Function — генерация вопросов с кэшированием
- **Netlify** — деплой продакшн-версии
- **Trello** — управление задачами

### Нет фреймворка

SPA написан на чистом TypeScript. Router, state management, система подписок — всё реализовано с нуля.

---

## 5. Пользовательский путь (User Flow)

```
Landing (только для гостей)
  └── Register / Login
        └── Library (выбор темы + уровня сложности)
              └── Practice (игровой экран)
                    ├── Супер-игра (если были ошибки)
                    └── Final Screen (ачивки + действия)
                          └── Dashboard (история игр)
```

**Routing guards:**

- Guest на `/practice` → редирект на `/login`
- Авторизованный на `/` → редирект на `/library`
- Авторизованный на `/login` → редирект на `/library`
- Неизвестный путь → страница 404

---

## 6. Архитектурные слои

### App Core (`src/app/`)

- `app.ts` — точка инициализации. Строгий порядок: `initAuth` → `restoreState` → `createRouter` → `setNavigate` → `router.start`
- `router.ts` — SPA-роутер с guard-моделью (`guest` / `authed`), перехват кликов по `a[data-link]`, callback `onRouteChange`
- `navigation.ts` — абстракция `setNavigate()` / `navigate()`. `navigate()` доступен только после вызова `setNavigate(router.go)` — архитектурный контракт
- `layout/` — Header + Nav + Main outlet + Footer. Auth-aware навигация. Подписка на store для обновления активного пункта и темы
- `state/store.ts` — `getState()`, `setState()`, `subscribe()` с корректным `unsubscribe`
- `state/actions.ts` — все изменения state через actions (не прямые мутации)

### Pages (`src/pages/`)

- `landing/` — onboarding, hero + features + FAQ + CTA, auth-aware (разные кнопки для гостя и авторизованного)
- `auth/` — login/register, переключение режимов, валидация, редирект в Library после успеха
- `library/` — список тем с Supabase, выбор сложности, кнопки Start/Continue, модалки подтверждения
- `practice/` — игровой экран, загрузка вопросов через LLM/кэш, `isConnected` guard после async
- `dashboard/` — история игр, фильтр по сложности, таблица с ачивками
- `not-found/` — 404

### Components (`src/components/`)

- `game/` — `check-answer.ts`, `show-next-question.ts`, `update-score.ts`, super-game логика
- `ui/modal/` — singleton модалка, Promise API: `await showModal({...})`
- `ui/practice-card/` — карточка вопроса + варианты ответов + hints-container + side-panel (объяснение) + theory-btn-popover
- `ui/final-screen/` — финальный экран с ачивкой (Loser/Master/Guru) + кнопки restart/library

### Services (`src/services/`)

- `authService.ts` — register/login/logout, token refresh за 5 мин до истечения, localStorage (`tandem:session`, `tandem:user`)
- `resume-active-game.ts` — восстановление незавершённой игры: `silentlyRestoreActiveGame()` (без navigate), `runResumeGameFlow()` (с модалкой)
- `sync-active-game.ts` — синхронизация `state.game` в таблицу `active_games` в Supabase
- `finishCurrentGame.ts` — очистка: сначала localStorage, потом DELETE из `active_games`
- `api/` — `getTopics()`, `getQuestions()`, `saveGameResult()`, `getGames()`, `active-games.ts`

---

## 7. Глобальный State

Структура `AppState`:

```
AppState {
  user          — кто залогинен (null для гостей)
  isLoading     — глобальный флаг загрузки
  topics        — список тем из Supabase
  game {
    topicId       — id текущей темы
    difficulty    — easy / medium / hard
    round         — номер текущего вопроса
    score         — текущий счёт
    questions     — массив вопросов
    gameMode      — 'game' | 'super-game'
    usedHints     — какие подсказки уже использованы
    wrongAnswers  — вопросы с ошибками (для супер-игры)
  }
  ui {
    theme         — 'light' | 'dark'
    activeRoute   — текущий маршрут
    isNavOpen     — открыто ли мобильное меню
    onboardingSeen — видел ли пользователь onboarding
  }
}
```

**Persistence:**
| Данные | Хранилище |
|--------|-----------|
| user + session | `localStorage` (tandem:session, tandem:user) + Supabase Auth |
| game (active) | `localStorage` + таблица `active_games` в Supabase |
| ui.theme + onboardingSeen | `localStorage` (tandem:ui) |

---

## 8. Игровая механика

### Основной цикл

1. Library: выбор темы + сложности
2. `startNewGame()` → переход на Practice
3. Загрузка вопросов через Edge Function (кэш или LLM)
4. Показ вопросов по одному, проверка ответов
5. Правильный → +1 очко. Неправильный → -1 очко, запись в `wrongAnswers`
6. После последнего вопроса:
   - Нет ошибок → финальный экран
   - Есть ошибки → модалка «Сыграть Супер-игру?»

### Супер-игра

- Confirm → `gameMode = 'super-game'`, reset round, только вопросы из `wrongAnswers`
- Нужно ответить правильно на ВСЕ вопросы
- Любая ошибка → супер-игра заканчивается, теряешь очки за оставшиеся вопросы
- Победа → бонус очки

### Подсказки (каждая — 1 раз за игру)

- **50/50** — убирает 2 неправильных варианта
- **Call a Friend** — предлагает вероятный правильный ответ
- **I Don't Know** — открывает side-панель с объяснением (из поля `explanation` в вопросе)

Состояние подсказок хранится в `state.game.usedHints`, синхронизируется в `active_games`.

### Ачивки

| Результат | Ачивка    |
| --------- | --------- |
| ≤ 50%     | Loser 😔  |
| 51–85%    | Master ⚔️ |
| 86–100%   | Guru 🧘   |

Ачивка отображается на Final Screen и сохраняется в Supabase (видна в Dashboard).

---

## 9. Resume Flow (восстановление незавершённой игры)

**Где показывается модалка «Продолжить игру?»:**

1. После логина — если в `active_games` есть запись
2. В Library при нажатии Start — если уже есть активная игра

**При refresh на /practice:**

- Игра восстанавливается **тихо, без модалки**
- `silentlyRestoreActiveGame()` — без вызова `navigate()` (пользователь уже на нужной странице)
- `usedHints` восстанавливаются и сразу задизейблены

**Источники для восстановления (порядок):**

1. `state.game` (память, если приложение не перезагружалось)
2. `localStorage` (activeGame)
3. Supabase таблица `active_games`

---

## 10. Технические Челленджи (истории)

### Challenge 1: Вопросы из воздуха — LLM + Edge Function

**Задача:** откуда берутся сотни вопросов по десяткам HTML/CSS тем?
**Решение:** Supabase Edge Function — получает тему + сложность, проверяет кэш в `questions` таблице, при отсутствии — запрашивает LLM, сохраняет батч, возвращает клиенту.
**Нетривиально:** Prompt нужно было отточить для строгого JSON-формата. Каждый вопрос содержит поле `explanation` — оно показывается в хинте «I Don't Know».
**Вывод:** первый запрос по теме ~1-2 сек, повторный — мгновенно из кэша.

### Challenge 2: Supabase RLS — права доступа

**Ситуация:** нужно сохранять прогресс игры в таблицу `active_games`.
**Симптом:** первое сохранение работает, при следующем обновлении прогресса — ошибка сервера.
**Причина:** Supabase RLS (Row Level Security) запрещает всё по умолчанию. Для `upsert` (INSERT + UPDATE) нужны раздельные политики на каждую операцию. Была настроена только INSERT.
**Решение:** добавлены 4 политики: SELECT + INSERT + UPDATE + DELETE.
**Вывод:** BaaS ≠ «включил и забыл». Безопасность по умолчанию = всё запрещено, каждую операцию надо явно разрешать.

### Challenge 3: Игра завершалась дважды

**Симптом:** результат игры мог сохраниться дважды, супер-игра иногда запускалась снова после победы.
**Причина:** асинхронная функция «показать следующий вопрос» вызывалась без `await` — код шёл дальше и снова выполнял финальную логику. Плюс логика завершения игры была дублирована в двух файлах.
**Решение:** явный `await` на все async-вызовы в game flow, ранние `return` после терминальных веток, единая ответственность за завершение игры — один файл.
**Вывод:** в асинхронном коде порядок шагов критичен. Не дождался — следующий шаг начнётся раньше, чем завершился предыдущий.

### Challenge 4: Порядок запуска приложения

**Симптом:** при обновлении страницы Practice ошибка «навигация вызвана до инициализации».
**Причина:** восстановление игры пыталось вызвать `navigate()` для перехода, но роутер ещё не был готов. Функция `navigate()` становится доступной только после `setNavigate(router.go)`, но восстановление запускалось раньше.
**Решение:** при refresh на `/practice` — тихое восстановление состояния БЕЗ навигации (пользователь уже там). Порядок инициализации: `initAuth` → `restoreState` → `createRouter` → `setNavigate` → `router.start`.
**Вывод:** порядок инициализации — архитектурный контракт, а не «деталь реализации».

### Challenge 5: Призрак на чужой странице

**Симптом:** панель с объяснением вопроса появлялась на главной странице (Landing).
**Причина:** Practice загружала вопросы с сервера (~1-2 сек). Пока шёл запрос, пользователь уходил на Landing. Когда ответ приходил — код искал контейнер глобально (`document.querySelector('.page')`) и вставлял панель в текущую страницу.
**Решение:** после получения ответа сервера — проверить `section.isConnected`. Если DOM-элемент Practice уже вне документа — тихо выйти, ничего не делать.
**Вывод:** после любого `await` нужно проверять контекст. Пользователь мог уйти, пока мы ждали ответа.

### Challenge 6: Устаревший код в develop

**Симптом:** после merge в develop обнаружился откат части логики к старой версии.
**Причина:** участник не сделал `git pull origin develop` перед merge. Ветка содержала старый базовый код.
**Решение:** найдена актуальная ветка, сделан rebase с разрешением конфликтов, повторный merge.
**Вывод:** `git pull origin develop` — обязательный шаг перед началом любой задачи. Установлены правила: всегда с отдельной ветки, только через PR, конфликты разрешать локально.

---

## 11. Тестирование

**Фреймворк:** Vitest 4.x + `@testing-library/dom` + jsdom

**12 тест-файлов, 123+ тестов:**

- store.ts + actions.ts — все UI actions
- modal.ts — singleton, ESC, overlay, анимации
- layout.ts — auth-aware nav, active route, theme button
- landing.ts — guest/authed CTA, секции
- library.ts — resume flow, темы, сложности
- auth-service.ts — login/register/logout
- practice-card + hints — рендер, disabled state
- side-panel — открытие/закрытие
- dashboard.ts — stats, difficulty filter

**Нетривиальные аспекты:**

- `localStorage` недоступен при инициализации модулей в Vitest 4.x + jsdom — решение: мокировать `storage-service`, а не `localStorage` напрямую
- Supabase в тестах не вызывается — изолируется моком на уровне api-слоя
- CI (GitHub Actions): `tsc --noEmit` + `eslint` + `vitest --run` на каждый PR

---

## 12. Дизайн-система

**Цвета (из `_variables.scss`):**

- Primary: `#667eea` (gradient до `#764ba2`)
- Text: `#333`
- Success: `#51cf66`
- Error: `#ff6b6b`
- Background cards: white / dark: `#1e1e2e`

**Шрифты:**

- Headings: `Poppins`
- Body: `Roboto`
- Score display: `Digital7` (monospace цифровые)

**Темы:**

- Light (default): белый фон, тёмный текст
- Dark: `data-theme="dark"` на `<html>`, переключение через CSS custom properties без перезагрузки

**Дизайн компонентов:**

- Practice card: тёмный фон с gradient header, варианты ответов — кнопки
- Подсказки — ряд кнопок под карточкой, disabled при использовании
- Модалка — blur backdrop, overlay, анимации появления
- Score — digital-7 шрифт, большие цифры в header карточки

---

## 13. Статистика проекта

| Метрика          | Значение                         |
| ---------------- | -------------------------------- |
| Длительность     | 7 недель (февраль — апрель 2026) |
| Pull Requests    | ~180+                            |
| Unit тестов      | 123+                             |
| Тест-файлов      | 12                               |
| Командных встреч | 5                                |
| Участников       | 3 разработчика + ментор          |
| Вопросов от LLM  | ∞ (кэшируются, пополняются)      |

---

## 14. Структура презентации (23 слайда)

> **Фокус:** сначала контекст (зачем и для кого), потом продукт, потом техника, потом команда и итоги.

### Слайд 1 — Cover

- Название: **DOMinator**
- Подзаголовок: _HTML & CSS Trainer for Interview Preparation_
- Команда и событие: Team DevBand · RSS Stage 2 · 2026
- Кнопка: 🚀 Live Demo → https://webis-2022-rs-tandem.netlify.app/
- Фон: фото кода (Unsplash, тёмное)

### Слайд 2 — Команда DevBand

- Layout: `intro`
- 3 карточки (grid 3 cols): аватар-эмодзи, имя, роль, что реализовал
- Под сеткой: «Ментор: Иван · 5 командных встреч · ~180 PR за 7 недель»

### Слайд 3 — Что такое DOMinator?

- Layout: `two-cols`
- Слева: 6 пунктов через `v-clicks` о фичах
- Справа: ASCII user-flow дерево + scoring карточка (+1/-1)

### Слайд 4 — Проблема и цель ← _сразу после описания продукта_

- Layout: `center` (horizontally centred)
- Две равные карточки рядом (`flex gap-8`), заголовок по центру
- Левая карточка: 🎯 Проблема (оранжевый фон `bg-orange-50`) — нет инструмента для практики интервью по HTML/CSS
- Правая карточка: 💡 Цель (синий фон `bg-blue-50`) — тренажёр с вопросами, уровнями, подсказками, прогрессом
- **Без правой колонки / без v-clicks** — только две карточки крупным текстом
- Эмодзи 4xl, заголовок xl bold, текст base

### Слайд 5 — Tech Stack

- Layout: два столбца (Frontend | Backend/Infra)
- Каждый инструмент — карточка с эмодзи, названием и кратким описанием
- Frontend: TypeScript+Vite, SCSS, Vitest, ESLint+Prettier+Husky
- Backend: Supabase, LLM API (Edge Function), Netlify, Trello

### Слайд 6 — Архитектура приложения

- 4 карточки-слоя (grid 4 cols): App Core, Pages, Components, Services
- В каждой — краткий список того, что внутри
- Под сеткой: принцип изоляции (страницы не знают о Supabase напрямую)

### Слайд 7 — Глобальный State

- Layout: `two-cols`
- Слева: 3 карточки через `v-clicks` — user, game, ui
- Справа: таблица persistence (что где хранится: localStorage / Supabase Auth / active_games)

### Слайд 8 — Router: кто куда может попасть

- 2 столбца
- Слева: 2 блока — «Только для гостей» / «Только для авторизованных» с маршрутами
- Справа: через `v-clicks` — примеры редиректов + описание реализации (guard-модель)

### Слайд 9 — Модальное окно

- 2 столбца
- Слева: короткий пример кода `await showModal(...)` + подпись «Никаких коллбэков — линейный читаемый код»
- Справа: скриншот `screen-modal.png` (`<img src="/screen-modal.png" class="rounded-xl shadow-lg w-full max-h-72 object-contain" />`) + подпись «Singleton · ESC / клик по фону закрывает · Promise API»
- Файл скриншота: `presentation/public/screen-modal.png`

### Слайд 10 — Game Flow ⚠️ КЛЮЧЕВОЙ

- Layout: `center`
- **Mermaid `flowchart LR`** — горизонтальный, scale **0.56**
- Ноды: Library → Старт → Вопрос → Ответ → Ещё? → Финал | Супер-игра → Переигровка → Финал
- **ВАЖНО**: `flowchart LR` обязателен (TD вылезает за экран), scale ≤ 0.56, лейблы короткие

### Слайд 11 — Система подсказок (Hints)

- 3 карточки (grid 3 cols): 50/50 🎯, Call a Friend 📞, I Don't Know 📖
- Внизу через `v-clicks`: как персистятся подсказки (`state.game.usedHints` → `active_games`)

### Слайд 12 — Приложение в действии

- 3 колонки с скриншотами (или плейсхолдерами):
  - `screen-library.png` — Library: выбор темы
  - `screen-practice.png` — Practice: игровой экран
  - `screen-dashboard.png` — Dashboard: результаты
- Кнопка «Открыть живую версию» → https://webis-2022-rs-tandem.netlify.app/
- Скриншоты кладутся в `presentation/public/`, вставляются через `<img src="/screen-*.png" />`

### Слайд 13 — Challenge 1: Вопросы из воздуха

- 2 столбца
- Слева: задача + сравнение «написать вручную ❌» vs «попросить LLM ✅»
- Справа: через `v-clicks` — что было нетривиально (prompt формат, explanation, кэш)

### Слайд 14 — Организация работы команды

- 2 столбца
- Слева: 3 карточки — 5 регулярных встреч, Trello (Backlog→Done), PR-driven разработка
- Справа: через `v-clicks` — инцидент git-sync, как решили, правила branch strategy

### Слайд 15 — CI/CD: автоматика от коммита до деплоя

- 3 ступени пайплайна: Husky (pre-commit) → GitHub Actions (tsc+eslint+vitest) → Netlify (auto-deploy)
- Каждая ступень — карточка с эмодзи и кратким описанием

### Слайд 16 — Ключевые технические решения

- 6 карточек (grid 2x3 или 3x2): без фреймворка, Supabase BaaS, LLM-вопросы, custom router, Promise-модалка, triple restore
- Карточки: иконка + заголовок + 1 строка почему

### Слайд 17 — Технические сложности

- 4 карточки (grid 2x2) — консолидированный вид четырёх ключевых проблем:
  1. RLS upsert — права по умолчанию запрещают всё
  2. Двойное завершение игры — async без await
  3. Порядок инициализации — navigate() до setNavigate()
  4. Призрак на чужой странице — isConnected после await

### Слайд 18 — Тестирование

- Таблица покрытых модулей (слева)
- Справа: 3 нетривиальных аспекта — localStorage в Vitest 4.x, мок Supabase на api-слое, CI-пайплайн

### Слайд 19 — Система ачивок

- 3 карточки (grid 3 cols): Loser 😔 (≤50%), Master ⚔️ (51–85%), Guru 🧘 (86–100%)
- Под картами: сохраняется в Supabase, видна в Dashboard

### Слайд 20 — Сильные стороны проекта

- 6 карточек (grid 2x3 или 3x2): без фреймворка, LLM-генерация, resilience (resume/restore), a11y, 123+ тестов, code review культура

### Слайд 21 — Что получилось

- 2 столбца
- Слева: чеклист продуктовых результатов (всё реализовано — Library, Practice, Auth, Dashboard, Super-game, Hints, Achievements)
- Справа: командные итоги — что узнали (Supabase/RLS, LLM, командный процесс)

### Слайд 22 — Выводы

- 6 карточек через `v-clicks`: планирование, итерации, документация, code review, async дисциплина, git гигиена

### Слайд 23 — Итого (финальный)

- Layout: `center`
- Сетка статистики: 7 недель · 180+ PR · 123+ тестов · ∞ вопросов · 5 встреч · 23 слайда
- Большая ссылка на деплой: https://webis-2022-rs-tandem.netlify.app/
- GitHub + событие + год

---

## 15. Стилистические принципы

1. **Карточки вместо списков** — информация в цветных rounded блоках, а не в bullet points
2. **Цветовое кодирование проблем/решений:**
   - Красный (`bg-red-50`) — симптом / проблема
   - Жёлтый (`bg-yellow-50`) — причина / почему не очевидно
   - Зелёный (`bg-green-50`) — решение
   - Синий (`bg-blue-50`) — вывод / урок
3. **`v-clicks`** — постепенное раскрытие через клики, не показывать всё сразу
4. **Эмодзи** — только для иконок разделов и карточек, не в тексте
5. **Код** — только там, где без него невозможно объяснить (1 место на слайд максимум)
6. **Человеческий язык** — «игра завершалась дважды», а не «race condition in handleGameCompletion»

---

## 16. Slidev frontmatter (глобальный)

```yaml
theme: seriph
background: https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1920&q=80
class: text-center
highlighter: shiki
lineNumbers: false
info: |
  ## DOMinator — RS Tandem
  HTML & CSS Trainer built by Team DevBand (RSS Stage 2, 2026)
drawings:
  persist: false
transition: slide-left
title: DOMinator — RS Tandem
mdc: true
```

---

## 17. Технические ограничения и решения

| Проблема                                           | Решение                                                |
| -------------------------------------------------- | ------------------------------------------------------ |
| Mermaid `flowchart TD` вылезает за экран по высоте | Использовать `flowchart LR` + scale **0.56**           |
| Глубокие технические детали недоступны аудитории   | Storytelling: симптом → причина → решение → вывод      |
| Много кода на слайде → визуально перегружено       | Не более 1 блока кода на слайд, заменять prose-текстом |
| Длинные TypeScript-интерфейсы                      | Описывать структуру через карточки, а не код           |

---

## 18. Добавление скриншотов в презентацию

### Способ 1: Скриншоты вручную

Сделать скриншоты из деплоя `https://webis-2022-rs-tandem.netlify.app/` и положить в `presentation/public/`:

```
presentation/
  public/
    screen-library.png    ← слайд 12 (есть ✅)
    screen-practice.png   ← слайд 12 (есть ✅)
    screen-modal.png      ← слайд 9  (есть ✅)
    screen-dashboard.png  ← слайд 12 (добавить)
```

Вставить в слайд:

```markdown
<img src="/screen-practice.png" class="rounded-xl shadow-lg w-full mt-4" />
```

### Способ 2: Iframe живого сайта

```markdown
<iframe
  src="https://webis-2022-rs-tandem.netlify.app/"
  class="w-full h-80 rounded-xl border-0 mt-4"
  title="DOMinator App"
/>
```

Требует интернет во время презентации.

### Способ 3: Inline HTML-демо компонентов

Для автономного показа UI создать HTML-демо компонентов прямо в слайде через `<div>` с inline-стилями.
Цвета из дизайн-системы: primary `#667eea`, primary-dark `#764ba2`, success `#51cf66`, error `#ff6b6b`.
