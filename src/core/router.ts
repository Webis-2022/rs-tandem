import { BaseComponent } from './base-component';

export type Page = {
  render(): BaseComponent;
  onMount?(): void;
  onDestroy?(): void;
};

type Route = {
  path: string;
  page: () => Page;
};

export class Router {
  private root: BaseComponent;
  private routes: Route[] = [];
  private currentPage: Page | null = null;
  private notFoundPage: (() => Page) | null = null;

  constructor(root: BaseComponent) {
    this.root = root;
    window.addEventListener('hashchange', this.handleHashChange.bind(this));
    this.handleInitialLoad();
  }

  /**
   * Добавляет маршрут
   */
  public addRoute(path: string, page: () => Page) {
    this.routes.push({ path, page });
  }

  /**
   * Устанавливает страницу 404
   */
  public setNotFound(page: () => Page): void {
    this.notFoundPage = page;
  }

  /**
   * Переход на указанный путь (без хэша)
   */
  public navigate(path: string) {
    window.location.hash = path;
  }

  /**
   * Обработчик изменения хэша
   */
  private handleHashChange() {
    const path = this.getPathFromHash();
    this.render(path);
  }

  /**
   * Обработка начальной загрузки — читаем хэш
   */
  private handleInitialLoad() {
    const path = this.getPathFromHash();
    this.render(path);
  }

  /**
   * Извлекает путь из хэша (убирает '#')
   */
  private getPathFromHash(): string {
    const hash = window.location.hash.slice(1);
    return hash || '/';
  }

  /**
   * Рендерит страницу по пути
   */
  private render(path: string) {
    const cleanPath = path.split('?')[0];

    const route = this.routes.find((r) => r.path === cleanPath);

    if (route) {
      this.currentPage = route.page();
    } else if (this.notFoundPage) {
      this.currentPage = this.notFoundPage();
    } else {
      console.error(`No route for path "${path}" and no not-found page set.`);
      return;
    }

    if (this.currentPage) {
      this.currentPage.onDestroy?.();
    }

    this.root.clear();
    this.root.append(this.currentPage.render());
    this.currentPage.onMount?.();
  }

  public start() {
    this.handleInitialLoad();
  }
}
