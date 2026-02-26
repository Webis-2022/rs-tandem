import './landing.scss';
import { ROUTES } from '../../types';
import { navigate } from '../../app/navigation';
import { createElement, createButton } from '../../shared/dom';

export const createLandingView = (): HTMLElement => {
  const section = createElement('section', undefined, 'page');

  const title = createElement(
    'h1',
    'Landing. Привет! Тут мы сделаем классное описание нашего тренажера :)'
  );

  const buttons = createElement('div', undefined, 'page__actions');

  const toLogin = createButton('Login', () => navigate(ROUTES.Login), 'btn');

  const toDash = createButton('Main', () => navigate(ROUTES.Dashboard), 'btn');

  buttons.append(toLogin, toDash);
  section.append(title, buttons);

  return section;
};
