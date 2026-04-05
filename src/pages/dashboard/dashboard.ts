import './dashboard.scss';
import { createEl } from '../../shared/dom';
import { createErrorMessage } from '../../components/ui/error-message/error-message';
import { getGames } from '../../services/api/get-games';
import { getGameResult } from '../../services/api/get-game-result';
import { gameStatsPanel } from '../../components/dashboard-elements/stats-table/game-stats-panel/game-stats-panel';
import { createStatsTable } from '../../components/dashboard-elements/stats-table/stats-table';
import type { GameResult } from '../../types';

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

    type Game = {
      id: number;
      created_at: string;
      user_id: string;
      difficulty: string;
      achievements: string;
    };

    const handleDifficultySelector = async (e: Event) => {
      const target = e.target as HTMLOptionElement;
      const difficulty = target?.value;
      const games: Game[] = await getGames(difficulty);
      const createOptionDataObj = (games: Game[]) => {
        const obj: { [key: string]: string } = {};
        games.forEach((game, index) => {
          obj[`Game ${index + 1}`] = String(game.id);
        });
        return obj;
      };
      const optionData = createOptionDataObj(games);
      createSelectOptions(optionData, gameSelector);
    };

    difficultySelector.addEventListener('change', handleDifficultySelector);

    const handleGameChange = async (e: Event) => {
      const badgesContainer = document.querySelector('.badges-container');
      const badge = createEl('img', {
        className: 'badge-img',
      }) as HTMLImageElement;
      let achievementImg: string = '';
      const target = e.target as HTMLOptionElement;
      const gameId = target?.value;
      const gameResult: GameResult[] = await getGameResult(Number(gameId));
      gameResult.forEach((game) => {
        if (game.game_id === Number(gameId)) {
          achievementImg = game.achievement;
        }
      });
      badge.src = achievementImg;
      badgesContainer?.append(badge);
      const table = createStatsTable(gameResult);
      const panelContent: HTMLDivElement | null =
        document.querySelector('.panel-content');
      if (!panelContent) return;
      panelContent.textContent = '';
      panelContent.style.display = 'block';
      panelContent?.append(table);
    };

    gameSelector.addEventListener('change', handleGameChange);

    createSelectOptions(optionsText, difficultySelector);

    topBar.append(difficultySelector, gameSelector);
    return topBar;
  };

  createTopBar().then((topBar) => {
    section.append(topBar, status, gameStatsPanel());
  });
  return section;
};
