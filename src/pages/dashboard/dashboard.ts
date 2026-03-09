import './dashboard.scss';
import { navigate } from '../../app/navigation';
import { auth } from '../../app/services/auth';
import { ROUTES } from '../../types';
import { createEl, createButton } from '../../shared/dom';

export const createDashboardView = (): HTMLElement => {
  const section = createEl('section', { className: 'page' });

  const title = createEl('h1', {
    text: 'Dashboard. Тут у нас будет профиль пользователя :) А еще много классных виджетов!',
  });

  const btn = createButton(
    'Logout',
    () => {
      auth.logout();
      navigate(ROUTES.Landing, true);
    },
    'btn'
  );

  section.append(title, btn);
  return section;
};
