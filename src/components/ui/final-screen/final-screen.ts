import { navigate } from '../../../app/navigation';
import { startNewGame } from '../../../app/state/actions';
import { getState } from '../../../app/state/store';
import { deleteCompletedTopics } from '../../../services/api/delete-completed-topics';
import { saveAchievement } from '../../../services/api/save-achievement';
import { finishCurrentGame } from '../../../services/finishCurrentGame';
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
  const layoutHeader = document.querySelector('.layout-header');
  const layoutFooter = document.querySelector('.layout-footer');
  const layout = document.querySelector('.layout');
  const layoutMain = layout?.querySelector('.layout-main');
  const delayForModal = 600;

  const loserScore = 50;
  const masterScore = 85;
  const guruScore = 100;

  const guruText = `Congratulations! You have excellent knowledge of HTML and CSS. You scored ${score} points!`;
  const masterText = `Well done! You have a solid understanding of HTML and CSS, but there’s always room to improve. You scored ${score} points!`;
  const loserText = `Unfortunately, your HTML and CSS skills are far from ideal. We recommend more practice and review of the basics. You scored ${score} points!`;
  const achievementText = 'Your achievement:';

  const createBackground = (image: string) => {
    const backgroundDiv = createEl('div', {
      className: 'background-img',
    }) as HTMLImageElement;
    backgroundDiv.style.background = `url(${image}) no-repeat center / cover`;
    return backgroundDiv;
  };

  const handleRestartButton = async () => {
    const difficulty = getState().game.difficulty;

    if (!difficulty) {
      console.error('Difficulty is not selected');
      return;
    }

    try {
      await deleteCompletedTopics(difficulty);
      await finishCurrentGame();
      await startNewGame({ topicId: 1, difficulty });
      navigate(ROUTES.Practice, true);
    } catch (error) {
      console.error('Failed to restart progress:', error);
    }
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
      () => {
        handleRestartButton();
        layoutHeader?.classList.remove('not-visible');
        layoutFooter?.classList.remove('not-visible');
      },
      'restart-btn'
    );
    const libraryButton = createButton(
      'Library',
      () => {
        navigate(ROUTES.Library, true);
        layoutHeader?.classList.remove('not-visible');
        layoutFooter?.classList.remove('not-visible');
      },
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

  layoutHeader?.classList.add('not-visible');
  layoutFooter?.classList.add('not-visible');

  layoutMain?.replaceChildren();
  layoutMain?.append(background);
  await delay(delayForModal);
  layoutMain?.append(modalWindow);
}
