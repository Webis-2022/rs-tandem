import { createButton, createEl, createElement } from '../../../shared/dom';
import { createHintsContainer } from './hints-container/hints-container';
import { createDivider } from './divider/divider';
import { type Question } from '../../../types';
import './practice-card.scss';
import { checkAnswer } from '../../../shared/check-answer';
import { topicLinks } from '../../../pages/practice/topic-links';
import { getState } from '../../../app/state/store';
import { createPopover } from './theory-btn-popover/theory-btn-popover';
import { goToNextTopic } from '../../game/go-to-next-topic';
import { updateScore } from '../../game/updateScore';
import { navigate } from '../../../app/navigation';
import { ROUTES } from '../../../types';
type Question = {
  level: string;
  answer: string;
  options: string[];
  question: string;
};

export function createPracticeCard(
  question: Question,
  section: HTMLElement | null
) {
  const card = createElement('div', undefined, 'card');
  const cardHeader = createElement('div', undefined, 'card-header');
  const score = createElement('span', undefined, 'score');
  score.textContent = '0';
  const buttonContainer = createElement('div', undefined, 'button-container');
  const nextTopicButton = createButton(
    'Next topic',
    undefined,
    'next-topic-btn',
    true
  );
  nextTopicButton.addEventListener('click', goToNextTopic);
  const libraryButton = createButton('Library', undefined, 'library-btn', true);
  libraryButton.addEventListener('click', () => {
    navigate(ROUTES.Library, true);
  });
  const cardBody = createElement('div', undefined, 'card-body');
  const cardFooter = createElement('div', undefined, 'card-footer');
  const hintsContainer = createHintsContainer(question);
  const topDivider = createDivider();
  const bottomDivider = createDivider();
  const questionContainer = createElement(
    'div',
    undefined,
    'question-container'
  );
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
    document.addEventListener('click', (e) => {
      const popover = document.querySelector('.theory-btn-popover');
      const target = e.target as Node;
      if (!popover?.contains(target)) {
        popover?.remove();
      }
    });
  });
  questionContainer.textContent = question.question;
  const answerContainer = createElement('div', undefined, 'answer-container');
  const groupId = Date.now();
  question.options.forEach((option) => {
    const label = createElement('label', undefined, 'label');
    const radioInput = createElement('input', undefined, 'answer-button');
    if (radioInput instanceof HTMLInputElement) {
      radioInput.type = 'radio';
      radioInput.name = String(groupId);
      radioInput.value = option;
      radioInput.addEventListener('change', () => {
        const checkButton: HTMLButtonElement | null =
          document.querySelector('.check-button');
        if (!checkButton) return;
        checkButton.disabled = false;
      });
    }
    label.append(radioInput, option);
    answerContainer.append(label);
  });

  const checkButtonContainer = createElement(
    'div',
    undefined,
    'check-button-container'
  );
  const checkButton = createButton('Check', undefined, 'check-button');
  checkButton.disabled = true;
  checkButton.addEventListener(
    'click',
    () => {
      const selected: HTMLInputElement | null = document.querySelector(
        `input[name="${groupId}"]:checked`
      );
      const selectedValue = selected?.value;
      const correctAnswer = question.answer;
      checkAnswer(selectedValue, correctAnswer, section);
      updateScore();
    },
    { once: true }
  );

  const theoryBtnContainer = createEl('div', {
    className: 'theory-btn-container',
  });
  theoryBtnContainer.append(theoryBtn);

  buttonContainer.append(nextTopicButton, libraryButton);
  cardHeader.append(theoryBtnContainer, score, buttonContainer);
  checkButtonContainer.append(checkButton);
  answerContainer.append(checkButtonContainer);
  cardBody.append(
    topDivider,
    questionContainer,
    bottomDivider,
    answerContainer
  );
  cardFooter.append(hintsContainer);

  card.append(cardHeader, cardBody, cardFooter);
  return card;
}
