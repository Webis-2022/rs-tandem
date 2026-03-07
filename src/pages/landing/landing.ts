import './landing.scss';
import { ROUTES } from '../../types';
import { navigate } from '../../app/navigation';
import { createEl, createButton } from '../../shared/dom';

export const createLandingView = (): HTMLElement => {
  const section = createEl('section', { className: 'page' });

  const title = createEl('h1', {
    text: 'Landing. Привет! Тут мы сделаем классное описание нашего тренажера :)',
  });

  const buttons = createEl('div', { className: 'page-actions' });

  const toLogin = createButton('Login', () => navigate(ROUTES.Login), 'btn');

  const toDash = createButton('Main', () => navigate(ROUTES.Dashboard), 'btn');

  buttons.append(toLogin, toDash);
  section.append(title, buttons);

  return section;
};
