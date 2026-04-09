import { saveUsedHint } from '../../../app/state/actions';
import type { HintCounter } from '../../../types';
import { toggleButtonsStatement } from '../toggle-buttons-statement';

export const countClicks = (
  mode: 'allButtons' | 'oneButton',
  className: string,
  isDisabled: boolean,
  hint: keyof HintCounter
) => {
  toggleButtonsStatement(mode, className, isDisabled);
  saveUsedHint(hint);
};
