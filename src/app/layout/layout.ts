import './layout.scss';
import { ROUTES } from '../../types';
import { createEl, createLink } from '../../shared/dom';

export type AppLayout = {
  root: HTMLElement;
  outlet: HTMLElement;
};

export function createLayout(): AppLayout {
  const root = createEl('div', { className: 'layout' });

  const header = createEl('header', { className: 'header' });
  const nav = createEl('nav', { className: 'nav' });

  nav.append(
    createLink('Landing', ROUTES.Landing, 'nav-link'),
    createLink('Login', ROUTES.Login, 'nav-link'),
    createLink('Dashboard', ROUTES.Dashboard, 'nav-link'),
    createLink('Library', ROUTES.Library, 'nav-link'),
    createLink('Practice', ROUTES.Practice, 'nav-link')
  );

  header.append(nav);

  const outlet = createEl('main', { className: 'main' });

  root.append(header, outlet);

  return { root, outlet };
}
