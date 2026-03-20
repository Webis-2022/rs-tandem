import './landing.scss';
import { ROUTES } from '../../types';
import { navigate } from '../../app/navigation';
import { createEl, createButton, createLink } from '../../shared/dom';
import { showModal } from '../../components/ui/modal/modal';
import * as authService from '../../services/authService';

type Feature = {
  title: string;
  text: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

const FEATURES: Feature[] = [
  {
    title: 'Практика по уровням',
    text: 'Выбирайте сложность и проходите вопросы от базовых до продвинутых.',
  },
  {
    title: 'Подсказки в процессе',
    text: 'Используйте игровые подсказки, когда нужно сохранить темп и концентрацию.',
  },
  {
    title: 'Прозрачный прогресс',
    text: 'Продолжайте с того же места: текущая игра сохраняется локально и синхронизируется.',
  },
];

const FAQ: FaqItem[] = [
  {
    question: 'Нужно ли регистрироваться?',
    answer:
      'Да, для сохранения прогресса и доступа к библиотеке Вам нужен аккаунт.',
  },
  {
    question: 'Сколько длится одна сессия?',
    answer: 'Обычно 5-15 минут. Вы можете остановиться и вернуться позже.',
  },
  {
    question: 'Можно ли начать сразу?',
    answer: 'Да. Достаточно авторизоваться и выбрать тему для первой практики.',
  },
];

function createFeatureCard(item: Feature): HTMLElement {
  const card = createEl('article', { className: 'landing-feature' });
  const title = createEl('h3', {
    text: item.title,
    className: 'landing-feature__title',
  });
  const text = createEl('p', {
    text: item.text,
    className: 'landing-feature__text',
  });
  card.append(title, text);
  return card;
}

function createFaqItem(item: FaqItem): HTMLElement {
  const entry = createEl('article', { className: 'landing-faq-item' });
  const question = createEl('h3', {
    text: item.question,
    className: 'landing-faq-item__question',
  });
  const answer = createEl('p', {
    text: item.answer,
    className: 'landing-faq-item__answer',
  });
  entry.append(question, answer);
  return entry;
}

async function openQuickGuide(): Promise<void> {
  await showModal({
    title: 'Как начать за 1 минуту',
    message:
      '1) Войдите в аккаунт. 2) Откройте Library и выберите тему. 3) Перейдите в Practice и отвечайте на вопросы. Если нужно - используйте подсказки, а после раунда переходите к следующей теме.',
  });
}

export const createLandingView = (): HTMLElement => {
  const isAuthed = Boolean(authService.getCurrentUser());

  const section = createEl('section', { className: 'landing page' });

  const hero = createEl('header', { className: 'landing-hero' });
  const badge = createEl('p', {
    text: 'RS Tandem',
    className: 'landing-hero__badge',
  });
  const title = createEl('h1', {
    text: 'Интерактивный тренажер для практики и закрепления знаний',
    className: 'landing-hero__title',
  });
  const subtitle = createEl('p', {
    text: 'Тренируйтесь в удобном темпе, отслеживайте прогресс и системно прокачивайте результат.',
    className: 'landing-hero__subtitle',
  });

  const heroActions = createEl('div', { className: 'landing-actions' });
  const primaryCta = createButton(
    isAuthed ? 'Перейти в Dashboard' : 'Начать с Login',
    () => navigate(isAuthed ? ROUTES.Dashboard : ROUTES.Login),
    'btn landing-actions__primary'
  );
  const secondaryCta = createButton(
    'Быстрый обзор',
    () => {
      void openQuickGuide();
    },
    'btn landing-actions__secondary'
  );
  heroActions.append(primaryCta, secondaryCta);

  const supportLinks = createEl('div', { className: 'landing-links' });
  const libraryLink = createLink(
    'Смотреть темы в Library',
    ROUTES.Library,
    'landing-links__link'
  );
  const practiceLink = createLink(
    'Открыть Practice',
    ROUTES.Practice,
    'landing-links__link'
  );
  supportLinks.append(libraryLink, practiceLink);

  hero.append(badge, title, subtitle, heroActions, supportLinks);

  const featuresSection = createEl('section', { className: 'landing-section' });
  const featuresTitle = createEl('h2', {
    text: 'Почему это удобно',
    className: 'landing-section__title',
  });
  const featuresGrid = createEl('div', { className: 'landing-features-grid' });
  FEATURES.map(createFeatureCard).forEach((card) => featuresGrid.append(card));
  featuresSection.append(featuresTitle, featuresGrid);

  const flowSection = createEl('section', { className: 'landing-section' });
  const flowTitle = createEl('h2', {
    text: 'Как проходит обучение',
    className: 'landing-section__title',
  });
  const flowList = createEl('ol', { className: 'landing-flow' });
  [
    'Выберите тему и уровень сложности.',
    'Ответьте на вопросы и применяйте подсказки.',
    'Переходите к следующим раундам, не теряя прогресс.',
  ].forEach((step) => {
    const item = createEl('li', {
      text: step,
      className: 'landing-flow__item',
    });
    flowList.append(item);
  });
  flowSection.append(flowTitle, flowList);

  const faqSection = createEl('section', { className: 'landing-section' });
  const faqTitle = createEl('h2', {
    text: 'FAQ',
    className: 'landing-section__title',
  });
  const faqList = createEl('div', { className: 'landing-faq' });
  FAQ.map(createFaqItem).forEach((item) => faqList.append(item));
  faqSection.append(faqTitle, faqList);

  const finalCta = createEl('section', { className: 'landing-final' });
  const finalText = createEl('p', {
    text: isAuthed
      ? 'Вы уже в системе - можно продолжать тренировку прямо сейчас.'
      : 'Создайте аккаунт и начните первую практическую сессию.',
    className: 'landing-final__text',
  });
  const finalButton = createButton(
    isAuthed ? 'Продолжить практику' : 'Войти и начать',
    () => navigate(isAuthed ? ROUTES.Practice : ROUTES.Login),
    'btn landing-final__btn'
  );
  finalCta.append(finalText, finalButton);

  section.append(hero, featuresSection, flowSection, faqSection, finalCta);

  return section;
};
