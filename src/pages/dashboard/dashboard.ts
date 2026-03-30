import './dashboard.scss';
import { navigate } from '../../app/navigation';
import { ROUTES } from '../../types';
import { createEl, createButton } from '../../shared/dom';
import * as authService from '../../services/authService';
import { createErrorMessage } from '../../components/ui/error-message/error-message';

export const createDashboardView = (): HTMLElement => {
  const section = createEl('section', { className: 'page' });

  const status = createEl('div', { className: 'dashboard-status' });

  const updateConnectionStatus = () => {
    if (!navigator.onLine) {
      status.replaceChildren(createErrorMessage('No internet connection.'));
    } else {
      status.replaceChildren();
    }
  };

  updateConnectionStatus();

  const user = authService.getCurrentUser();
  const userEmail = user?.email || 'Unknown user';

  const createTopBar = () => {
    const optionsText = ['easy', 'medium', 'hard'];
    const topBar = createEl('div', { className: 'top-bar' });
    const difficultySelector = createEl('select', {
      className: 'difficulty-selector',
    });
    const gameSelector = createEl('select', { className: 'game-selector' });
    difficultySelector.setAttribute('name', 'difficulty');
    const createPlaceholder = (text: string) => {
      const placeholder = createEl('option');
      if (placeholder instanceof HTMLOptionElement) {
        placeholder.value = '';
        placeholder.textContent = text;
        placeholder.disabled = true;
        placeholder.selected = true;
        return placeholder;
      }
    };
    const difficultyPlaceholder = createPlaceholder('Difficulty');
    const gamePlaceholder = createPlaceholder('Select Game');
    difficultySelector.append(difficultyPlaceholder as Node);
    gameSelector.append(gamePlaceholder as Node);
    optionsText.forEach((text) => {
      const option = createEl('option');
      if (option instanceof HTMLOptionElement) {
        option.value = text;
        option.textContent = text;
        difficultySelector.append(option);
      }
    });
    topBar.append(difficultySelector, gameSelector);
    return topBar;
  };

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
        navigate(ROUTES.Landing, true);
      } catch (error) {
        console.error('Logout failed:', error);
        // Still navigate even if logout fails
        navigate(ROUTES.Landing, true);
      }
    },
    'btn'
  );
  const topBar = createTopBar();
  section.append(topBar, status, title, subtitle, btn);
  return section;
};
