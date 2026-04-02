import './loading.scss';
import { createEl } from '../../../shared/dom';

export function createLoadingView(
  text = 'Loading...',
  className = 'loading-view'
): HTMLElement {
  const wrapper = createEl('div', { className });

  const loader = createEl('div', {
    className: 'loader',
  });

  loader.setAttribute('aria-hidden', 'true');

  for (let i = 0; i < 5; i += 1) {
    loader.append(
      createEl('span', {
        className: 'square',
      })
    );
  }

  const label = createEl('span', {
    className: 'loading-view-text',
    text,
  });

  wrapper.append(loader, label);

  return wrapper;
}
