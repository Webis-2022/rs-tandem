import './login.scss';
import { ROUTES } from '../../types';
import { auth } from '../../app/services/auth';
import { navigate } from '../../app/navigation';
import { createElement, createButton } from '../../shared/dom';

export const createLoginView = (): HTMLElement => {
  const section = createElement('section', undefined, 'login');

  const title = createElement('h1', 'Login');

  const btn = createButton(
    'Mock login',
    () => {
      auth.login();
      navigate(ROUTES.Dashboard, true);
    },
    'btn'
  );

  section.append(title, btn);
  return section;
};
