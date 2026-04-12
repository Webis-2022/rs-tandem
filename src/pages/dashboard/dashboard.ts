import './dashboard.scss';
import { createEl } from '../../shared/dom';
import { createErrorMessage } from '../../components/ui/error-message/error-message';
import { getGames } from '../../services/api/get-games';
import { getGameResult } from '../../services/api/get-game-result';
import { gameStatsPanel } from '../../components/dashboard-elements/stats-table/game-stats-panel/game-stats-panel';
import { createStatsTable } from '../../components/dashboard-elements/stats-table/stats-table';
import type { GameData, GameResult } from '../../types';

export const createDashboardView = (): HTMLElement => {
  const section = createEl('section', { className: 'page' });
  let difficulty: string;

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

    const handleDifficultySelector = async (e: Event) => {
      try {
        gameSelector.value = '';
        const target = e.target as HTMLOptionElement;
        difficulty = target?.value;
        const gameResults: GameResult[] = await getGameResult({
          gameId: undefined,
          difficulty,
        });
        const gameIds = gameResults.map((game) => game.game_id);
        const uniqueIds = Array.from(new Set(gameIds));
        const games: GameData[] =
          (await getGames({ gameIds: uniqueIds })) || [];
        const createOptionDataObj = (games: GameData[]) => {
          const obj: { [key: string]: string } = {};
          games.forEach((game, index) => {
            const date = new Date(game.created_at);
            obj[`Game ${index + 1}: ${date.toLocaleString()}`] = String(
              game.id
            );
          });
          return obj;
        };
        const options = gameSelector.children;
        Array.from(options).forEach((option, index) => {
          if (index !== 0) option.remove();
        });
        const optionData = createOptionDataObj(games);
        createSelectOptions(optionData, gameSelector);
      } catch (error) {
        console.error(error);
        gameSelector.value = '';
      }
    };

    difficultySelector.addEventListener('change', handleDifficultySelector);

    const handleGameChange = async (e: Event) => {
      try {
        const badgesContainer = document.querySelector('.badges-container');
        const badge = createEl('img', {
          className: 'badge-img',
        }) as HTMLImageElement;

        const target = e.target as HTMLSelectElement;
        const gameId = Number(target?.value);
        const gameResult: GameResult[] = await getGameResult({
          gameId,
          difficulty,
        });
        const games: GameData[] = (await getGames({ gameIds: [gameId] })) || [];
        badge.src = games[0].achievement;
        badgesContainer?.replaceChildren(badge);
        const table = createStatsTable(gameResult);
        const panelContent: HTMLDivElement | null =
          document.querySelector('.panel-content');
        if (!panelContent) return;
        panelContent.textContent = '';
        panelContent.style.display = 'block';
        panelContent?.append(table);
      } catch (error) {
        console.error(error);
      }
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
