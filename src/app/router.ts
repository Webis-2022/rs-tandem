import type { RoutePath } from '../types';

type RouteConfig = {
  createView: () => HTMLElement;
  guard?: 'authed' | 'guest'; // authed: только для залогиненных, guest: только для гостей
  redirectTo?: RoutePath; // куда редиректить если guard не прошёл
};

type RoutesMap = Partial<Record<RoutePath, RouteConfig>>;

// Опции роута
type CreateRouterOptions = {
  mount: HTMLElement; // куда "вставлять" текущую страницу
  routes: RoutesMap; // routes: список маршрутов
  fallback: RoutePath; // что показывать, если путь неизвестный
  isAuthed: () => boolean; // функция проверки авторизации (роутер не знает, где хранится токен/флаг)
};

export type Router = {
  start: () => void; // запуск слушателей + первый рендер
  go: (to: RoutePath, replace?: boolean) => void;
};

export const createRouter = (options: CreateRouterOptions): Router => {
  const { mount, routes, fallback, isAuthed } = options;

  // Получить конфиг маршрута по path:
  const resolve = (path: RoutePath): RouteConfig => {
    return (
      routes[path] ??
      routes[fallback] ?? { createView: () => document.createElement('div') }
    );
  };

  // Рендер текущего URL (посмотреть на текущий URL и отрисовать нужную страницу)
  const render = (): void => {
    const rawPath = window.location.pathname; // текущий путь из адресной строки

    // если путь неизвестен — заменяем URL на fallback (без записи в историю)
    if (!(rawPath in routes)) {
      go(fallback, true);
      return;
    }

    const path = rawPath as RoutePath; // приводим тип к RoutePath
    const route = resolve(path); // получаем настройки (конфигурацию) текущего маршрута ({ createView, guard, redirectTo })

    if (route.guard === 'authed' && !isAuthed()) {
      go(route.redirectTo ?? fallback, true);
      return;
    }

    if (route.guard === 'guest' && isAuthed()) {
      go(route.redirectTo ?? fallback, true);
      return;
    }

    // "Отрисовать" текущую страницу:
    mount.replaceChildren(route.createView());
    window.scrollTo(0, 0); // на всякий случай скроллим вверх при смене страницы
  };

  // Навигация на другой путь
  const go = (to: RoutePath, replace = false): void => {
    if (replace) history.replaceState(null, '', to);
    else history.pushState(null, '', to);
    render();
  };

  const start = (): void => {
    document.addEventListener('click', (event) => {
      const target = event.target instanceof Element ? event.target : null; // по типам TS это может быть не Element (напр, Text узел) -> приводим к Element | null.
      const link = target?.closest<HTMLAnchorElement>('a[data-link]') ?? null; // нашли link через closest
      if (!link) return;

      const href = link.getAttribute('href') as RoutePath | null;
      if (!href) return;

      event.preventDefault();
      go(href);
    });

    window.addEventListener('popstate', render); // пользователь нажал Back / Forward
    render();
  };

  return { start, go };
};
