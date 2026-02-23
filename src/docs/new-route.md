# Добавление новой страницы в приложение

На текущий момент в проект добавлен простой хэш-роутер (`router.ts`), совместимый с Github Pages. Маршруты определяются по пути после `#` (например, `#/login`).

## 1. Создание компонента новой страницы

Файлы с кодом для создания страниц лежат в папке `src/pages/`. Пока что там один файл - одна страница, в теории большие страницы нужно будет бить на части. Пример самого минимального файла с подключением словаря (EN-RU):

```typescript
import { BaseComponent, type Page } from '../core';
import { language$ } from '../store/language-store.ts';
import { translations, type TranslationKey } from '../i18n';

export function homePage(): Page {
  let container: BaseComponent<'div'>;
  let textComponent: BaseComponent<'p'>;
  let unsubscribe: () => void;

  const updateTexts = () => {
    const lang = language$.value;
    const dictionary = (key: TranslationKey) => translations[lang][key];
    textComponent.element.textContent = dictionary('mainTempText');
  };

  return {
    render() {
      container = new BaseComponent({ tag: 'div', className: ['home-page'] });
      textComponent = new BaseComponent({ tag: 'p', className: ['home-text'] });

      container.append(textComponent);

      unsubscribe = language$.subscribe(updateTexts);
      updateTexts();

      return container;
    },
    onMount() {
      console.log('NOTE: Home page mounted');
    },
    onDestroy() {
      if (unsubscribe) unsubscribe();
      console.log('NOTE: Home page destroyed');
    },
  };
}
```

Пример файла без подключения словаря:

```typescript
import { BaseComponent } from '../core';
import type { Page } from '../core';

export function loginPage(): Page {
  let component: BaseComponent;

  return {
    render() {
      component = new BaseComponent({
        tag: 'div',
        className: ['login-page'],
        text: 'Login Page is here',
      });
      return component;
    },
    onMount() {
      console.log('NOTE: Login page mounted');
    },
    onDestroy() {
      console.log('NOTE: Login page destroyed');
    },
  };
}
```

Основные моменты:

- Основная функция в файле должна возвращать объект с методами render(), onMount?, onDestroy?.
- Функция render() возвращает корневой компонент страницы.
- Подписка на language$ нужна только если страница содержит текст, которые нужно переводить на английский / русский. От неё нужно отписаться в onDestroy.
- Стиль className предназначен для стилизации страницы в целом, если она нужна.

## 2. Добавление словаря с переводами (если нужен)

Если на новой странице есть текст, нужно добавить соответствующие ключи в папку интернационализации i18n.

Для этого нужно создать отдельный файл с таким содержимым:

```typescript
import type { Language } from '../types/language';

export type MainTranslationKey = 'mainTempText';

export const mainTranslations: Record<
  Language,
  Record<MainTranslationKey, string>
> = {
  en: {
    mainTempText: 'TODO...',
  },
  ru: {
    mainTempText: 'Когда-нибудь тут будет посадочная страница...',
  },
};
```

Здесь:

- MainTranslationKey содержит все ключи, которые используеются в фале словаря
- mainTranslations содержит переводы на en и ru языки в соответствующих объектах, по ключам из MainTranslationKey

Затем нужно добавить свой файл в `src/i18n/index.ts`. После этого он станет доступен для использования в приложении.

## 3. Добавление нового маршрута и новой страницы в роутер

В файле `src/components/app.ts` нужно найти метод setupRoutes() и добавить в него новую строку для своей страницы:

```typescript
private setupRoutes(): void {
  this.router.addRoute('/', homePage);
  this.router.addRoute('/login', loginPage);
  this.router.addRoute('/api-test', apiTestPage);
  this.router.setNotFound(notFoundPage);
  this.router.start();
}
```

Также нужно импортировать компонент страницы.

## 4. Добавление кнопки в header (если нужно)

Для разработки можно добавлять кнопку для перехода на страницу в header. Для этого нужно выполнить несколько шагов:

- В файле `src/components/header.ts` в компоненте Header создать новую кнопку:

```typescript
this.testApiBtn = new BaseComponent({ tag: 'button' });
this.testApiBtn.addEventListener('click', this.callbacks.onTestApi);
```

Если кнопка предназначена только для разработки, проще всего добавить тут textContent и задать нужный текст кнопки, чтобы меньше заморачиваться. Если это кнопка для пользователя, то в методе updateTexts() нужно менять текст кнопки в зависимости от выбранного языка (перед этим нужно добавить в словарь для header-a соответсвующий ключ):

```typescript
this.testApiBtn.element.textContent = dictionary('testApi');
```

- в тип HeaderCallbacks нужно добавить новый callback `onTestApi: () => void;`;
- в файле `src/components/app.ts` передать функцию отрисовки callback в header:

```typescript
this.header = new Header({
  onHome: () => this.router.navigate('/'),
  onSignIn: () => this.router.navigate('/login'),
  onTestApi: () => this.router.navigate('/api-test'),
});
```

Когда кнопка для разработки станет не нужна, выпилить код из header и app в обратном порядке.

## Проверка

Всё, после этих шагов можно проверять что путь работает:

- либо нажать кнопку и посмотнеть, что она ведёт куда надо
- либо ввести путь в адресную строку вручную, и посмотреть что выведется Ваша страница. Например, `http://localhost:5173/#/api-test`
