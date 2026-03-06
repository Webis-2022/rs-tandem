import './layout.scss';
import { ROUTES } from '../../types';
import { createElement, createLink } from '../../shared/dom';

export type AppLayout = {
  root: HTMLElement;
  outlet: HTMLElement;
};

export function createLayout(): AppLayout {
  const root = createElement('div', undefined, 'layout');

  const header = createElement('header', undefined, 'header');
  const nav = createElement('nav', undefined, 'nav');

  nav.append(
    createLink('Landing', ROUTES.Landing, 'nav-link'),
    createLink('Login', ROUTES.Login, 'nav-link'),
    createLink('Dashboard', ROUTES.Dashboard, 'nav-link'),
    createLink('Library', ROUTES.Library, 'nav-link'),
    createLink('Practice', ROUTES.Practice, 'nav-link')
  );

  header.append(nav);

  const outlet = createElement('main', undefined, 'main');

  root.append(header, outlet);

  return { root, outlet };
}
