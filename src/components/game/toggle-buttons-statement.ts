export function toggleButtonsStatement(
  mode: 'allButtons' | 'oneButton',
  className?: string | undefined,
  isDisabled?: boolean | undefined
) {
  if (mode === 'allButtons') {
    const nextTopicButton = document.querySelector('.next-topic-btn');
    const libraryButton = document.querySelector(
      '.library-btn:not(.final-screen-btn)'
    );
    const hintButtons = document.querySelectorAll('.hint-btn');
    const checkButton = document.querySelector('.check-button');
    const answerButtons: NodeListOf<HTMLButtonElement> =
      document.querySelectorAll('.answer-button');
    hintButtons.forEach((button) => button.setAttribute('disabled', ''));
    checkButton?.setAttribute('disabled', '');
    nextTopicButton?.removeAttribute('disabled');
    nextTopicButton?.classList.add('animated-button');
    libraryButton?.removeAttribute('disabled');
    libraryButton?.classList.add('animated-button');
    Array.from(answerButtons).forEach((btn) => (btn.disabled = true));
  } else if (mode === 'oneButton') {
    if (!className) return;
    const button = document.querySelector<HTMLButtonElement>(className);
    if (!button) return;
    button.disabled = Boolean(isDisabled);
  }
}
