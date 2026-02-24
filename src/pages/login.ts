import { ROUTES } from '../types';
import { auth } from '../app/services/auth';
import { navigate } from '../app/navigation';

export const createLoginView = (): HTMLElement => {
  const section = document.createElement('section');
  section.style.display = 'flex';
  section.style.flexDirection = 'column';
  section.style.gap = '16px';

  const title = document.createElement('h1');
  title.textContent = 'Login';

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = 'Mock login';

  btn.addEventListener('click', () => {
    auth.login();
    navigate(ROUTES.Dashboard, true);
  });

  section.append(title, btn);
  return section;
};
