import { createLoadingView } from '../components/ui/loading/loading';
import { createEl } from '../shared/dom';
import type { RoutePath } from '../types';

type RouteConfig = {
  createView: () => HTMLElement;
  guard?: 'authed' | 'guest';
  redirectTo?: RoutePath;
};

type RoutesMap = Partial<Record<RoutePath, RouteConfig>>;

type CreateRouterOptions = {
  mount: HTMLElement;
  routes: RoutesMap;
  fallback: RoutePath;
  isAuthed: () => boolean | Promise<boolean>;
  onRouteChange?: (route: RoutePath) => void;
};

export type Router = {
  start: () => void;
  go: (to: RoutePath, replace?: boolean) => void;
};

export const createRouter = (options: CreateRouterOptions): Router => {
  const { mount, routes, fallback, isAuthed, onRouteChange } = options;

  // Возвращает конфиг маршрута для текущего пути или fallback-маршрута
  const resolve = (path: RoutePath): RouteConfig => {
    return (
      routes[path] ?? routes[fallback] ?? { createView: () => createEl('div') }
    );
  };

  const render = async (): Promise<void> => {
    // Показываем loading state до проверки guard-ов и рендера страницы
    mount.replaceChildren(createLoadingView());

    const rawPath = window.location.pathname;

    // Если путь не найден, перенаправляем на fallback без добавления записи в историю
    if (!(rawPath in routes)) {
      go(fallback, true);
      return;
    }

    const path = rawPath as RoutePath;
    const route = resolve(path);

    // Поддерживает и синхронную, и асинхронную проверку авторизации
    const authed = await Promise.resolve(isAuthed());

    if (route.guard === 'authed' && !authed) {
      go(route.redirectTo ?? fallback, true);
      return;
    }

    if (route.guard === 'guest' && authed) {
      go(route.redirectTo ?? fallback, true);
      return;
    }

    mount.replaceChildren(route.createView());
    onRouteChange?.(path);
    window.scrollTo(0, 0);
  };

  const go = (to: RoutePath, replace = false): void => {
    if (replace) history.replaceState(null, '', to);
    else history.pushState(null, '', to);

    render();
  };

  const start = (): void => {
    // Перехватываем клики по внутренним ссылкам и обрабатываем их через роутер
    document.addEventListener('click', (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const link = target?.closest<HTMLAnchorElement>('a[data-link]') ?? null;

      if (!link) return;

      const href = link.getAttribute('href') as RoutePath | null;
      if (!href) return;

      event.preventDefault();
      go(href);
    });

    window.addEventListener('popstate', render);
    render();
  };

  return { start, go };
};
