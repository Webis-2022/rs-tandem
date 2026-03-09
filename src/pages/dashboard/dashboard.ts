import './dashboard.scss';
import { navigate } from '../../app/navigation';
import { ROUTES } from '../../types';
import { createEl, createButton } from '../../shared/dom';
import * as authService from '../../services/authService';

export const createDashboardView = (): HTMLElement => {
  const section = createEl('section', { className: 'page' });

  const user = authService.getCurrentUser();
  const userEmail = user?.email || 'Unknown user';

  const title = createEl('h1', {
    text: `Welcome, ${userEmail}!`,
  });

  const subtitle = createEl('p', {
    text: 'Dashboard. Тут у нас будет профиль пользователя :) А еще много классных виджетов!',
  });

  const btn = createButton(
    'Logout',
    async () => {
      try {
        await authService.logout();
        debugger;
        navigate(ROUTES.Landing, true);
      } catch (error) {
        console.error('Logout failed:', error);
        // Still navigate even if logout fails
        navigate(ROUTES.Landing, true);
      }
    },
    'btn'
  );

  section.append(title, subtitle, btn);
  return section;
};
