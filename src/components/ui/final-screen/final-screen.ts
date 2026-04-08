import { navigate } from '../../../app/navigation';
import { getState } from '../../../app/state/store';
import { deleteCompletedTopics } from '../../../services/api/delete-completed-topics';
import { saveAchievement } from '../../../services/api/save-achievement';
import { createButton, createEl } from '../../../shared/dom';
import { ROUTES } from '../../../types';
import { delay } from '../../../utils/delay';
import './final-screen.scss';

export async function createFinalScreen() {
  let achievementImg: string = '';
  const state = getState();
  const score = state.game.score;
  let background = createEl('div');
  let modalWindow = createEl('div');
  const layout = document.querySelector('.layout');
  const layoutMain = layout?.querySelector('.layout-main');
  const delayForModal = 600;

  const loserScore = 50;
  const masterScore = 85;
  const guruScore = 100;

  const guruText =
    'Congratulations! You have excellent knowledge of HTML and CSS.';
  const masterText =
    'Well done! You have a solid understanding of HTML and CSS, but there’s always room to improve.';
  const loserText =
    'Unfortunately, your HTML and CSS skills are far from ideal. We recommend more practice and review of the basics.';
  const achievementText = 'Your achievement:';

  const createBackground = (image: string) => {
    const backgroundDiv = createEl('div', {
      className: 'background-img',
    }) as HTMLImageElement;
    backgroundDiv.style.background = `url(${image}) no-repeat center / cover`;
    return backgroundDiv;
  };

  const handleRestartButton = () => {
    deleteCompletedTopics();
  };

  const createModalWindow = (text: string, badge: string) => {
    const modalWindow = createEl('div', {
      className: 'final-screen-modal',
    }) as HTMLDivElement;
    const textContainer = createEl('div', { className: 'text-container' });
    textContainer.innerHTML = text;
    const badgeContainer = createEl('span', { className: 'badge-container' });
    badgeContainer.innerHTML = achievementText;
    const badgeImg = createEl('img', {
      className: 'badge-img-animated',
    }) as HTMLImageElement;
    badgeImg.src = badge;
    badgeContainer.append(badgeImg);
    const buttonSet = createEl('div', { className: 'button-set' });
    const restartButton = createButton(
      'Restart',
      handleRestartButton,
      'restart-btn'
    );
    const libraryButton = createButton(
      'Library',
      () => navigate(ROUTES.Library, true),
      'library-btn'
    );

    buttonSet.append(restartButton, libraryButton);
    modalWindow.append(textContainer, badgeContainer, buttonSet);
    return modalWindow;
  };

  if (score <= loserScore) {
    achievementImg = './img/html-and-css-loser.png';
    background = createBackground('./img/stormy-bg.webp');
    modalWindow = createModalWindow(loserText, achievementImg);
  } else if (score >= loserScore && score <= masterScore) {
    achievementImg = './img/html-and-css-master.png';
    background = createBackground('./img/celebration-bg.webp');
    modalWindow = createModalWindow(masterText, achievementImg);
  } else if (score >= masterScore && score <= guruScore) {
    achievementImg = './img/html-and-css-guru.png';
    background = createBackground('./img/celebration-bg.webp');
    modalWindow = createModalWindow(guruText, achievementImg);
  }

  if (!layout) return;

  try {
    await saveAchievement(achievementImg);
  } catch (e) {
    console.error('Failed to save achievement', e);
  }

  layout.firstChild?.remove();
  layoutMain?.replaceChildren();
  layoutMain?.append(background);
  await delay(delayForModal);
  layoutMain?.append(modalWindow);
}
