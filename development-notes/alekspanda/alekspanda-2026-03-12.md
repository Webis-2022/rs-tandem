# Дата: 2026-03-12

**Что было сделано:**

- Добавила локальное сохранение состояния игры через localStorage - PR: [feature: restore active game from localStorage after refresh #58](https://github.com/Webis-2022/rs-tandem/pull/58) - игра восстанавливается после обновления страницы / случайного закрытия вкладки.
- Изучила следующие PR: [feat: add auth service #51](https://github.com/Webis-2022/rs-tandem/pull/51), [Feature/implement game logic#55](https://github.com/Webis-2022/rs-tandem/pull/55) и [Feature/implement game hints #56](https://github.com/Webis-2022/rs-tandem/pull/56)
- Оставила комментарии к PR на github
- По [PR #55](https://github.com/Webis-2022/rs-tandem/pull/55) записала видео с демонстрацией экрана и поведения приложения, а также вопросами и комментариями по реализации.

**Проблемы:**

- При разборе [PR #55](https://github.com/Webis-2022/rs-tandem/pull/55) была обнаружена проблема с моим ранее уже замердженным в develop кодом по компоненту Library [PR #48](https://github.com/Webis-2022/rs-tandem/pull/48)

**Решения (или попытки):**

- По задаче [cоздания таблицы "active_game" для сохранения прогресса незаконченных игр](https://github.com/Webis-2022/rs-tandem/blob/meeting_notes/development-notes/meeting%20notes/DevBand-2026-03-08.md) было принято решение разделить сохранение активной игры на два уровня: localStorage - для быстрого восстановления в пределах одного браузера, и таблица active_games в Supabase - для сценария logout/login с восстановлением прогресса пользователя

**Мысли / Планы:**

- Реализовать таблицу active_games в Supabase, чтобы иметь устойчивое хранение незавершенных игр между logout/login и между устройствами
- Изучить что именно в компоненте Library приводит к ошибке поведения следующего экрана Practice, внести необходимые изменения.

**Затраченное время:** 5 часов
