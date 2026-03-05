import './layout.scss';
import { ROUTES } from '../../types';
import { createElement, createLink } from '../../shared/dom';

export type AppLayout = {
  root: HTMLElement;
  outlet: HTMLElement;
};

export function createLayout(): AppLayout {
  const root = createElement('div', undefined, 'app');

  const header = createElement('header', undefined, 'app-header');
  const nav = createElement('nav', undefined, 'nav');

  nav.append(
    createLink('Landing', ROUTES.Landing, 'nav__link'),
    createLink('Login', ROUTES.Login, 'nav__link'),
    createLink('Dashboard', ROUTES.Dashboard, 'nav__link'),
    createLink('Practice', ROUTES.Practice, 'nav__link')
  );

  header.append(nav);

  const outlet = createElement('main', undefined, 'app-main');

  root.append(header, outlet);

  return { root, outlet };
}
