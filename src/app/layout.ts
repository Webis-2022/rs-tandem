import { ROUTES } from '../types';

export type AppLayout = {
  root: HTMLElement;
  outlet: HTMLElement;
};

export function createLayout(): AppLayout {
  const root = document.createElement('div');
  root.className = 'app';
  root.style.display = 'flex';
  root.style.flexDirection = 'column';
  root.style.minHeight = '100vh';

  // HEADER
  const header = document.createElement('header');
  header.className = 'app-header';
  header.style.padding = '16px 24px';
  header.style.borderBottom = '1px solid #ddd';

  const nav = document.createElement('nav');
  nav.className = 'nav';
  nav.style.display = 'flex';
  nav.style.gap = '16px';

  const linkLanding = document.createElement('a');
  linkLanding.textContent = 'Landing';
  linkLanding.href = ROUTES.Landing;
  linkLanding.setAttribute('data-link', '');

  const linkLogin = document.createElement('a');
  linkLogin.textContent = 'Login';
  linkLogin.href = ROUTES.Login;
  linkLogin.setAttribute('data-link', '');

  const linkDashboard = document.createElement('a');
  linkDashboard.textContent = 'Dashboard';
  linkDashboard.href = ROUTES.Dashboard;
  linkDashboard.setAttribute('data-link', '');

  nav.append(linkLanding, linkLogin, linkDashboard);
  header.append(nav);

  // MAIN (outlet для страниц)
  const outlet = document.createElement('main');
  outlet.className = 'app-main';
  outlet.style.flex = '1';
  outlet.style.padding = '24px';

  root.append(header, outlet);

  return { root, outlet };
}
