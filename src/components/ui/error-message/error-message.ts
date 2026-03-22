import './error-message.scss';
import { createEl } from '../../../shared/dom';

export function createErrorMessage(
  message: string,
  className = 'error-message is-error'
): HTMLElement {
  return createEl('div', {
    text: message,
    className,
  });
}
