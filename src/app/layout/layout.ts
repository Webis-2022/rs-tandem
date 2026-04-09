import './layout.scss';
import { ROUTES } from '../../types';
import { createButton, createEl, createLink } from '../../shared/dom';
import { getState, subscribe } from '../state/store';
import { closeNav, toggleNav, toggleTheme } from '../state/actions';

export type AppLayout = {
  root: HTMLElement;
  outlet: HTMLElement;
};

type NavVisibility = 'all' | 'guest' | 'authed';

type NavItem = {
  label: string;
  route: (typeof ROUTES)[keyof typeof ROUTES];
  visibility: NavVisibility;
};

type FooterAuthor = {
  name: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Login', route: ROUTES.Login, visibility: 'guest' },
  { label: 'Play the game', route: ROUTES.Library, visibility: 'authed' },
  { label: 'Score Results', route: ROUTES.Dashboard, visibility: 'authed' },
  { label: 'Logout', route: ROUTES.Logout, visibility: 'authed' },
];

const FOOTER_AUTHORS: FooterAuthor[] = [
  {
    name: 'Jevgeni Verjovkin',
    href: 'https://github.com/Webis-2022/Jevgeni-Verjovkin',
  },
  { name: 'Aleksandra Potapova', href: 'https://github.com/alekspanda' },
  { name: 'Sergei Urazov', href: 'https://github.com/urazof' },
];

function isVisible(visibility: NavVisibility, isAuthed: boolean): boolean {
  if (visibility === 'all') return true;
  return visibility === 'authed' ? isAuthed : !isAuthed;
}

export function createLayout(): AppLayout {
  const root = createEl('div', { className: 'layout' });

  const skipLink = createEl('a', {
    text: 'Skip to main content',
    className: 'layout-skip-link',
  }) as HTMLAnchorElement;
  skipLink.href = '#main-content';

  const header = createEl('header', { className: 'layout-header' });
  const headerInner = createEl('div', { className: 'layout-header-inner' });

  const brand = createLink('DOMinator', ROUTES.Landing, 'layout-brand');
  brand.setAttribute('aria-label', 'DOMinator home');

  const controls = createEl('div', { className: 'layout-controls' });
  const themeButton = createButton(
    'Theme: Light',
    () => toggleTheme(),
    'btn layout-theme-switcher'
  );
  themeButton.setAttribute('aria-label', 'Toggle color theme');

  const navToggleButton = createButton(
    'Menu',
    () => toggleNav(),
    'btn layout-nav-toggle'
  );
  navToggleButton.setAttribute('aria-controls', 'primary-navigation');
  navToggleButton.setAttribute('aria-expanded', 'false');

  controls.append(themeButton, navToggleButton);

  const nav = createEl('nav', { className: 'layout-nav' });
  nav.id = 'primary-navigation';
  nav.setAttribute('aria-label', 'Primary navigation');

  const navList = createEl('ul', { className: 'layout-nav-list' });
  nav.append(navList);

  navList.addEventListener('click', () => {
    closeNav();
  });

  headerInner.append(brand, controls, nav);
  header.append(headerInner);

  const outlet = createEl('main', { className: 'layout-main' });
  outlet.id = 'main-content';
  outlet.setAttribute('tabindex', '-1');

  const footer = createEl('footer', { className: 'layout-footer' });
  const footerInner = createEl('div', { className: 'layout-footer-inner' });
  const footerSchoolLink = createEl('a', {
    className: 'layout-footer-school-link',
  }) as HTMLAnchorElement;
  footerSchoolLink.href = 'https://rs.school/';
  footerSchoolLink.target = '_blank';
  footerSchoolLink.rel = 'noopener noreferrer';
  footerSchoolLink.setAttribute('aria-label', 'Open RS School website');

  const footerSchoolLogo = createEl('img', {
    className: 'layout-footer-school-logo',
  }) as HTMLImageElement;
  footerSchoolLogo.src = './img/rs-school-logo.svg';
  footerSchoolLogo.alt = 'RS School logo';

  const footerSchoolText = createEl('span', {
    text: 'RS School',
    className: 'layout-footer-school-text',
  });
  footerSchoolLink.append(footerSchoolLogo, footerSchoolText);

  const footerAuthors = createEl('div', { className: 'layout-footer-authors' });
  FOOTER_AUTHORS.forEach(({ name, href }) => {
    const authorLink = createEl('a', {
      text: name,
      className: 'layout-footer-author-link',
    }) as HTMLAnchorElement;
    authorLink.href = href;
    authorLink.target = '_blank';
    authorLink.rel = 'noopener noreferrer';
    authorLink.setAttribute('aria-label', `${name} GitHub profile`);
    footerAuthors.append(authorLink);
  });

  footerInner.append(footerSchoolLink, footerAuthors);
  footer.append(footerInner);

  const renderLayoutState = () => {
    const currentState = getState();
    const isAuthed = Boolean(currentState.user);

    navList.replaceChildren();

    NAV_ITEMS.filter((item) => isVisible(item.visibility, isAuthed)).forEach(
      (item) => {
        const listItem = createEl('li', { className: 'layout-nav-item' });
        const link = createLink(item.label, item.route, 'layout-nav-link');

        if (currentState.ui.activeRoute === item.route) {
          link.classList.add('is-active');
          link.setAttribute('aria-current', 'page');
        }

        listItem.append(link);
        navList.append(listItem);
      }
    );

    const isDarkTheme = currentState.ui.theme === 'dark';
    themeButton.textContent = isDarkTheme ? 'Theme: Dark' : 'Theme: Light';
    themeButton.setAttribute('aria-pressed', String(isDarkTheme));

    nav.classList.toggle('is-open', currentState.ui.isNavOpen);
    navToggleButton.setAttribute(
      'aria-expanded',
      String(currentState.ui.isNavOpen)
    );
  };

  subscribe(() => {
    renderLayoutState();
  });

  renderLayoutState();

  root.append(skipLink, header, outlet, footer);

  return { root, outlet };
}
