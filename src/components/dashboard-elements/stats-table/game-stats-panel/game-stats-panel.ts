import { createEl } from '../../../../shared/dom';
import { getState } from '../../../../app/state/store';
import './game-stats-panel.scss';

export function gameStatsPanel() {
  const state = getState();
  const panel = createEl('div', {
    className: 'game-stats-panel',
  });
  const panelTopBar = createEl('div', {
    className: 'panel-top-bar',
  });
  const username = createEl('div', {
    className: 'username',
  });
  username.textContent = `User: ${state.user?.email ?? ''}`;
  const achievements = createEl('div', {
    className: 'achievements',
  });
  const achievementsText = createEl('span', { className: 'achievements-text' });
  const badgesContainer = createEl('span', { className: 'badges-container' });
  achievementsText.textContent = 'Achievement';
  achievements.append(achievementsText, badgesContainer);

  panelTopBar.append(username, achievements);
  const panelContent = createEl('div', {
    className: 'panel-content',
  });
  panelContent.textContent =
    'Please select a difficulty level and game to see your results';

  panel.append(panelTopBar, panelContent);
  return panel;
}
