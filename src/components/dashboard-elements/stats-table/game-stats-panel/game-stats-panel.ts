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
  const achievement = createEl('div', {
    className: 'achievement',
  });
  const achievementText = createEl('span', { className: 'achievement-text' });
  const badgeContainer = createEl('span', { className: 'badge-container' });
  achievementText.textContent = 'Achievement';
  achievement.append(achievementText, badgeContainer);

  panelTopBar.append(username, achievement);
  const panelContent = createEl('div', {
    className: 'panel-content',
  });
  panelContent.textContent =
    'Please select a difficulty level and game to see your results';

  panel.append(panelTopBar, panelContent);
  return panel;
}
