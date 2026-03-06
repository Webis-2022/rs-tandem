import './library.scss';
import { createEl } from '../../shared/dom';

export const createLibraryView = (): HTMLElement => {
  const section = createEl('section', { className: 'page' });

  const title = createEl('h1', { text: 'Library' });

  section.append(title);
  return section;
};
