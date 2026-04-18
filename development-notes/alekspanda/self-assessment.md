## Self-Assessment: [GitHub Aleksandra](https://github.com/AleksPanda)

**Ссылка на PR с данным файлом:** [PR #169](https://github.com/Webis-2022/rs-tandem/pull/169)

## 📊 Feature Score Table

| Feature        | Points | Description                                                                                                                                                                                                                                                   | Link                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| -------------- | -----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rich UI Screen |     20 | Экран авторизации с логикой `Login / Register`, переключением состояний формы, валидацией, выводом ошибок и пользовательскими сценариями после успешного действия.                                                                                            | [src/pages/auth/auth-page.ts](https://github.com/Webis-2022/rs-tandem/blob/develop/src/pages/auth/auth-page.ts)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Rich UI Screen |     20 | Экран `Library` и связанный сценарий незавершенного прогресса: загрузка тем, выбор сложности, сценарии для кнопок `Continue / Start`, модалки подтверждения и работа с сохраненным прогрессом через localStorage и сервис.                                    | [src/pages/library/library.ts](https://github.com/Webis-2022/rs-tandem/blob/develop/src/pages/library/library.ts), [src/pages/library/library-resume-modals.ts](https://github.com/Webis-2022/rs-tandem/blob/develop/src/pages/library/library-resume-modals.ts), [src/services/topic-resume-flow.ts](https://github.com/Webis-2022/rs-tandem/blob/develop/src/services/topic-resume-flow.ts), [src/services/storage-service.ts](https://github.com/Webis-2022/rs-tandem/blob/develop/src/services/storage-service.ts)                                                                                                                                                          |
| BaaS CRUD      |     15 | Работа с Supabase для active session: чтение, сохранение/обновление и удаление данных в `active_games`, а также синхронизация состояния приложения с сервером.                                                                                                | [src/services/api/active-games.ts](https://github.com/Webis-2022/rs-tandem/blob/develop/src/services/api/active-games.ts), [src/services/sync-active-game.ts](https://github.com/Webis-2022/rs-tandem/blob/develop/src/services/sync-active-game.ts)                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Theme Switcher |     10 | Интеграция темной темы в компоненты и экраны: `Library`, `modal`, `loading`, `auth page`, `practice card`.                                                                                                                                                    | [src/pages/library/library.scss](https://github.com/Webis-2022/rs-tandem/blob/develop/src/pages/library/library.scss), [src/components/ui/modal/modal.scss](https://github.com/Webis-2022/rs-tandem/blob/develop/src/components/ui/modal/modal.scss), [src/components/ui/loading/loading.scss](https://github.com/Webis-2022/rs-tandem/blob/develop/src/components/ui/loading/loading.scss), [src/pages/auth/auth-page.scss](https://github.com/Webis-2022/rs-tandem/blob/develop/src/pages/auth/auth-page.scss), [src/components/ui/practice-card/practice-card.scss](https://github.com/Webis-2022/rs-tandem/blob/develop/src/components/ui/practice-card/practice-card.scss) |
| API Layer      |     10 | Выделение сервисного слоя для работы с API и Supabase отдельно от UI: централизованная обработка ошибок, сервисы active session/resume flow, логика определения текущей игры и кандидата на восстановление, изоляция сетевой логики от страниц и компонентов. | [src/shared/helpers/request-error.ts](https://github.com/Webis-2022/rs-tandem/blob/develop/src/shared/helpers/request-error.ts), [src/services/login-game-choice-flow.ts](https://github.com/Webis-2022/rs-tandem/blob/develop/src/services/login-game-choice-flow.ts), [src/services/topic-resume-flow.ts](https://github.com/Webis-2022/rs-tandem/blob/develop/src/services/topic-resume-flow.ts), [src/services/topic-resume-candidate.ts](https://github.com/Webis-2022/rs-tandem/blob/develop/src/services/topic-resume-candidate.ts), [src/services/current-game.ts](https://github.com/Webis-2022/rs-tandem/blob/develop/src/services/current-game.ts)                   |

---

## 🧮 Total Score: **75 points**

## Описание проделанной работы

В ходе работы над проектом я участвовала как в построении базовой структуры клиентской части, так и в разработке пользовательских feature-компонентов. На раннем этапе я помогала с определением архитектуры приложения, после чего реализовала базовый app core: инициализацию приложения, layout, SPA router и навигацию между страницами.

Далее я разработала UI экрана авторизации с переключением режимов Login / Register, валидацией и пользовательскими состояниями формы. Одним из основных направлений моей работы также стала страница Library: загрузка списка топиков с сервера, выбор уровня сложности, передача выбранных данных в Practice и дальнейшее развитие сценария незавершенного прогресса.

Отдельный блок моей работы был связан с сохранением и восстановлением незавершенного топика. Сначала я добавила восстановление прогресса через localStorage, затем реализовала хранение незавершенного топика в базе данных через таблицу `active_games` в Supabase. В рамках этой логики я работала с сохранением текущего состояния топика, его восстановлением после обновления страницы и синхронизацией клиентского состояния с сервером.

Позже я развивала пользовательские сценарии продолжения прогресса внутри Library: предупреждение о потере текущего прогресса при старте нового топика, отдельную кнопку `Continue` для незавершенного топика и донастройку модальных окон под разные сценарии пользователя.

Следующим этапом стала логика восстановления уже не только незавершенного топика, но и всей незавершенной игры пользователя при логине. Для этого пришлось доработать структуру хранения active session и добавить `gameId` в таблицу `active_games`, чтобы связать незавершенный топик с конкретной незавершенной игрой.

Кроме этого, я занималась улучшением общего UX приложения: добавляла loading states для основных пользовательских сценариев, централизованную обработку API-ошибок, 404 page.

## 2 личных Feature Components

### Library

Этот компонент является одним из основных пользовательских экранов приложения и отвечает за сценарий выбора темы для практики.

**Реализация:**  
Я разработала страницу `Library`, которая загружает список топиков с сервера, позволяет выбирать уровень сложности и отображает карточки тем в зависимости от их состояния. Экран поддерживает completed topics, active topic и передачу выбранных пользователем данных в `Practice`.

**Техническая ценность:**  
Этот экран объединяет UI и бизнес-логику: при обновлении списка тем он учитывает выбранную сложность, завершенные топики и сохраненный прогресс пользователя. За счет этого интерфейс адаптируется под текущее состояние пользователя и делает сценарий выбора темы более понятным и предсказуемым.

### Unfinished Topic Flow

Этот компонент отвечает за пользовательский сценарий продолжения незавершенного топика внутри `Library`.

**Реализация:**  
Я реализовала логику работы с незавершенным топиком: восстановление сохраненного прогресса, отображение отдельной кнопки `Continue`, предупреждение о потере текущего прогресса при старте нового топика и модальные окна подтверждения для разных сценариев (`Start new game`, `Start over`).

**Техническая ценность:**  
С технической точки зрения это не только UI-модалки, а отдельный пользовательский сценарий, который связывает между собой состояние страницы `Library`, сохраненный прогресс и поведение кнопок в карточках тем. В результате удалось сделать сценарий незавершенного топика прозрачным для пользователя: система явно показывает, где можно продолжить прогресс, а где старт нового действия приведет к замене текущего состояния.
