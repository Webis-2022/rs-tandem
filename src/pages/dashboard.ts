import { ROUTES } from '../types';
import { auth } from '../app/services/auth';
import { navigate } from '../app/navigation';

export const createDashboardView = (): HTMLElement => {
  const section = document.createElement('section');
  section.style.display = 'flex';
  section.style.flexDirection = 'column';
  section.style.gap = '16px';

  const title = document.createElement('h1');
  title.textContent =
    'Dashboard. Тут у нас будет профиль пользователя :) А еще много классных виджетов!';

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = 'Logout';

  btn.addEventListener('click', () => {
    auth.logout();
    navigate(ROUTES.Landing, true);
  });

  section.append(title, btn);
  return section;
};
