import './dashboard.scss';
import { navigate } from '../../app/navigation';
import { ROUTES } from '../../types';
import { createEl, createButton } from '../../shared/dom';
import * as authService from '../../services/authService';
import { createErrorMessage } from '../../components/ui/error-message/error-message';
import { getGames } from '../../services/api/get-games';
import { type GameData } from '../../types';
import { getGameResult } from '../../services/api/get-game-result';

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

  const createTopBar = async () => {
    const optionsText = {
      easy: 'easy',
      medium: 'medium',
      hard: 'hard',
    };
    const topBar = createEl('div', { className: 'top-bar' });
    const difficultySelector = createEl('select', {
      className: 'difficulty-selector',
    }) as HTMLSelectElement;
    const gameSelector = createEl('select', {
      className: 'game-selector',
    }) as HTMLSelectElement;
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
    const createSelectOptions = (
      optionsData: { [key: string]: string },
      selector: HTMLSelectElement
    ) => {
      let option;
      Object.keys(optionsData).forEach((text) => {
        option = createEl('option');
        if (option instanceof HTMLOptionElement) {
          option.textContent = text;
          option.value = optionsData[text];
          selector.append(option);
        }
      });
    };

    difficultySelector.addEventListener('change', async (e) => {
      const target = e.target as HTMLOptionElement;
      const difficulty = target?.value;
      const games = await getGames(difficulty);
      const createOptionDataObj = (games: GameData[]) => {
        const obj: { [key: string]: string } = {};
        games.forEach((game, index) => {
          obj[`Game ${index + 1}`] = String(game.id);
        });
        return obj;
      };
      const optionData = createOptionDataObj(games);
      createSelectOptions(optionData, gameSelector);

      gameSelector.addEventListener('change', async (e) => {
        const target = e.target as HTMLOptionElement;
        const gameId = target?.value;
        const gameResult = await getGameResult(Number(gameId));
        console.log(gameResult);
      });
    });

    createSelectOptions(optionsText, difficultySelector);

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
  createTopBar().then((topBar) => {
    section.append(topBar, status, title, subtitle, btn);
  });
  return section;
};
