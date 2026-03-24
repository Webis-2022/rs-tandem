import { createButton, createEl } from '../../../shared/dom';
import { createHintsContainer } from './hints-container/hints-container';
import { createDivider } from './divider/divider';
import './practice-card.scss';
import { topicLinks } from '../../../pages/practice/topic-links';
import { getState, subscribe } from '../../../app/state/store';
import { createPopover } from './theory-btn-popover/theory-btn-popover';
import { goToNextTopic } from '../../game/go-to-next-topic';
import { navigate } from '../../../app/navigation';
import { ROUTES, type AppState } from '../../../types';
import { checkAnswer } from '../../game/check-answer';
import { saveProgress } from '../../../services/api/save-progress';

let unsubscribeTopic: () => void;
let unsubscribeDifficulty: () => void;

export function createPracticeCard() {
  if (unsubscribeTopic) unsubscribeTopic();
  if (unsubscribeDifficulty) unsubscribeDifficulty();
  const card = createEl('div', { className: 'card' });
  const cardHeader = createEl('div', { className: 'card-header' });
  const score = createEl('span', { className: 'score' });
  score.textContent = '0';
  const buttonContainer = createEl('div', { className: 'button-container' });
  const nextTopicButton = createButton(
    'Next topic',
    undefined,
    'next-topic-btn',
    true
  );
  nextTopicButton.addEventListener('click', () => {
    saveProgress();
    goToNextTopic();
  });
  const libraryButton = createButton('Library', undefined, 'library-btn', true);
  libraryButton.addEventListener('click', () => {
    navigate(ROUTES.Library, true);
  });
  const cardBody = createEl('div', { className: 'card-body' });
  const cardFooter = createEl('div', { className: 'card-footer' });
  const hintsContainer = createHintsContainer();
  const topic = createEl('h2', { className: 'topic' });
  const topDivider = createDivider();
  const difficulty = createEl('div', { className: 'difficulty' });
  const bottomDivider = createDivider();
  const questionContainer = createEl('div', {
    className: 'question-container',
  });

  const renderTopic = (state: AppState) => {
    topic.textContent = state.topics[state.game.topicId - 1]?.name ?? '';
  };

  unsubscribeTopic = subscribe(renderTopic);
  renderTopic(getState());

  const renderDifficulty = (state: AppState) =>
    (difficulty.textContent = `Difficulty: ${state.game.difficulty}`);
  unsubscribeDifficulty = subscribe(renderDifficulty);
  renderDifficulty(getState());

  const theoryBtn = createEl('img', {
    text: '',
    className: 'theory-btn',
  }) as HTMLImageElement;
  theoryBtn.src = './img/question.png';

  theoryBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const state = getState();
    const topicId = state.game.topicId;
    const baseUrl = 'https://www.w3schools.com/';
    let topicData;
    if (topicId in topicLinks) {
      topicData = topicLinks[topicId as keyof typeof topicLinks];
      if (typeof topicData === 'string') {
        const path = topicData
          .split('_')[0]
          .match(/html|css/g)
          ?.join('');
        const url = `${baseUrl}${path}/${topicData}.asp`;
        window.open(url);
      } else {
        createPopover(topicData, baseUrl);
      }
    }
    document.addEventListener(
      'click',
      (e) => {
        const popover = document.querySelector('.theory-btn-popover');
        const target = e.target as Node;
        if (!popover?.contains(target)) {
          popover?.remove();
        }
      },
      { once: true }
    );
  });
  const answerContainer = createEl('div', { className: 'answer-container' });
  const answers = createEl('div', { className: 'answers' });
  answerContainer.append(answers);

  const checkButtonContainer = createEl('div', {
    className: 'check-button-container',
  });
  const checkButton = createButton('Check', undefined, 'check-button');
  checkButton.disabled = true;

  checkButton.addEventListener('click', () => {
    const gameMode = getState().game.gameMode;
    checkAnswer(gameMode);
  });

  const theoryBtnContainer = createEl('div', {
    className: 'theory-btn-container',
  });
  theoryBtnContainer.append(theoryBtn);

  buttonContainer.append(nextTopicButton, libraryButton);
  cardHeader.append(theoryBtnContainer, score, buttonContainer);
  checkButtonContainer.append(checkButton);
  answerContainer.append(checkButtonContainer);
  cardBody.append(
    topic,
    difficulty,
    topDivider,
    questionContainer,
    bottomDivider,
    answerContainer
  );
  cardFooter.append(hintsContainer);

  card.append(cardHeader, cardBody, cardFooter);
  return card;
}
