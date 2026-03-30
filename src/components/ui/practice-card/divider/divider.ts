import { createEl } from '../../../../shared/dom';
import './divider.scss';

export function createDivider() {
  return createEl('div', { className: 'divider' });
}
