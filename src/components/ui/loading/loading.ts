import './loading.scss';
import { createEl } from '../../../shared/dom';

export function createLoadingView(
  text = 'Loading...',
  className = 'loading-view'
): HTMLElement {
  return createEl('div', {
    text,
    className,
  });
}
