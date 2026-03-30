import './not-found.scss';
import { ROUTES } from '../../types';
import { navigate } from '../../app/navigation';
import { createEl, createButton } from '../../shared/dom';

export const createNotFoundView = (): HTMLElement => {
  const section = createEl('section', {
    className: 'page not-found',
  });

  const code = createEl('div', {
    text: '404',
    className: 'not-found-code',
  });

  const title = createEl('h1', {
    text: 'Page not found',
    className: 'not-found-title',
  });

  const text = createEl('p', {
    text: 'The page you are trying to open does not exist.',
    className: 'not-found-text',
  });

  const actions = createEl('div', {
    className: 'not-found-actions',
  });

  const backBtn = createButton(
    'Back',
    () => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        navigate(ROUTES.Landing, true);
      }
    },
    'btn'
  );

  const homeBtn = createButton(
    'To landing',
    () => navigate(ROUTES.Landing, true),
    'btn'
  );

  actions.append(backBtn, homeBtn);
  section.append(code, title, text, actions);

  return section;
};
