import './landing.scss';
import { ROUTES } from '../../types';
import { navigate } from '../../app/navigation';
import { createEl, createButton, createLink } from '../../shared/dom';
import { buildModalParagraphsHtml } from '../../shared/helpers';
import { showModal } from '../../components/ui/modal/modal';
import * as authService from '../../services/auth-service';

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
    title: 'Practice by Levels',
    text: 'Choose a difficulty and move through questions from basic to advanced.',
  },
  {
    title: 'Hints During the Round',
    text: 'Use in-game hints when you need to keep your pace and focus.',
  },
  {
    title: 'Transparent Progress',
    text: 'Continue from where you stopped: the current game is saved locally and synced.',
  },
];

const FAQ: FaqItem[] = [
  {
    question: 'Do I need to sign up?',
    answer: 'Yes, you need an account to save progress and access the library.',
  },
  {
    question: 'How long is one session?',
    answer: 'Usually 5-15 minutes. You can pause and continue later.',
  },
  {
    question: 'Can I start right away?',
    answer: 'Yes. Just sign in and pick a topic for your first practice round.',
  },
];

function createFeatureCard(item: Feature): HTMLElement {
  const card = createEl('article', { className: 'landing-feature' });
  const title = createEl('h3', {
    text: item.title,
    className: 'landing-feature-title',
  });
  const text = createEl('p', {
    text: item.text,
    className: 'landing-feature-text',
  });
  card.append(title, text);
  return card;
}

function createFaqItem(item: FaqItem): HTMLElement {
  const entry = createEl('article', { className: 'landing-faq-item' });
  const question = createEl('h3', {
    text: item.question,
    className: 'landing-faq-item-question',
  });
  const answer = createEl('p', {
    text: item.answer,
    className: 'landing-faq-item-answer',
  });
  entry.append(question, answer);
  return entry;
}

async function openQuickGuide(): Promise<void> {
  await showModal({
    title: 'How to Start in 1 Minute',
    messageHtml: buildModalParagraphsHtml([
      '1) Sign in to your account.',
      '2) Open Library and choose a topic.',
      '3) Go to Practice and answer questions.',
      'If needed, use hints and move to the next topic after each round.',
    ]),
  });
}

export const createLandingView = (): HTMLElement => {
  const isAuthed = Boolean(authService.getCurrentUser());

  const section = createEl('section', { className: 'landing page' });

  const hero = createEl('header', { className: 'landing-hero' });
  const badge = createEl('p', {
    text: 'RS Tandem',
    className: 'landing-hero-badge',
  });
  const title = createEl('h1', {
    text: 'Interactive trainer for practice and knowledge reinforcement',
    className: 'landing-hero-title',
  });
  const subtitle = createEl('p', {
    text: 'Train at your own pace, track progress, and improve results systematically.',
    className: 'landing-hero-subtitle',
  });

  const heroActions = createEl('div', { className: 'landing-actions' });
  const primaryCta = createButton(
    isAuthed ? 'Go to Dashboard' : 'Start from Login',
    () => navigate(isAuthed ? ROUTES.Dashboard : ROUTES.Login),
    'btn landing-actions-primary'
  );
  const secondaryCta = createButton(
    'Quick Guide',
    () => {
      void openQuickGuide().catch(console.error);
    },
    'btn landing-actions-secondary'
  );
  heroActions.append(primaryCta, secondaryCta);

  const supportLinks = createEl('div', { className: 'landing-links' });
  const libraryLink = createLink(
    'Browse topics in Library',
    ROUTES.Library,
    'landing-links-link'
  );
  const practiceLink = createLink(
    'Open Practice',
    ROUTES.Practice,
    'landing-links-link'
  );
  supportLinks.append(libraryLink, practiceLink);

  hero.append(badge, title, subtitle, heroActions, supportLinks);

  const featuresSection = createEl('section', { className: 'landing-section' });
  const featuresTitle = createEl('h2', {
    text: 'Why it works well',
    className: 'landing-section-title',
  });
  const featuresGrid = createEl('div', { className: 'landing-features-grid' });
  FEATURES.map(createFeatureCard).forEach((card) => featuresGrid.append(card));
  featuresSection.append(featuresTitle, featuresGrid);

  const flowSection = createEl('section', { className: 'landing-section' });
  const flowTitle = createEl('h2', {
    text: 'How learning flow works',
    className: 'landing-section-title',
  });
  const flowList = createEl('ol', { className: 'landing-flow' });
  [
    'Choose a topic and difficulty level.',
    'Answer questions and use hints when needed.',
    'Move to the next rounds without losing progress.',
  ].forEach((step) => {
    const item = createEl('li', {
      text: step,
      className: 'landing-flow-item',
    });
    flowList.append(item);
  });
  flowSection.append(flowTitle, flowList);

  const faqSection = createEl('section', { className: 'landing-section' });
  const faqTitle = createEl('h2', {
    text: 'FAQ',
    className: 'landing-section-title',
  });
  const faqList = createEl('div', { className: 'landing-faq' });
  FAQ.map(createFaqItem).forEach((item) => faqList.append(item));
  faqSection.append(faqTitle, faqList);

  const finalCta = createEl('section', { className: 'landing-final' });
  const finalText = createEl('p', {
    text: isAuthed
      ? 'You are already signed in - continue your training now.'
      : 'Create an account and start your first practice session.',
    className: 'landing-final-text',
  });
  const finalButton = createButton(
    isAuthed ? 'Continue Practice' : 'Sign in and Start',
    () => navigate(isAuthed ? ROUTES.Practice : ROUTES.Login),
    'btn landing-final-btn'
  );
  finalCta.append(finalText, finalButton);

  section.append(hero, featuresSection, flowSection, faqSection, finalCta);

  return section;
};
