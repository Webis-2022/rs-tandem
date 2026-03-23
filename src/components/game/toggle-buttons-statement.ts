export function toggleButtonsStatement(
  mode: 'allButtons' | 'oneButton',
  className?: string | undefined,
  isDisabled?: boolean | undefined
) {
  if (mode === 'allButtons') {
    const nextTopicButton = document.querySelector('.next-topic-btn');
    const libraryButton = document.querySelector('.library-btn');
    const hintButtons = document.querySelectorAll('.hint-btn');
    const checkButton = document.querySelector('.check-button');
    hintButtons.forEach((button) => button.setAttribute('disabled', ''));
    checkButton?.setAttribute('disabled', '');
    nextTopicButton?.removeAttribute('disabled');
    libraryButton?.removeAttribute('disabled');
  } else if (mode === 'oneButton') {
    console.log('called');
    const button: HTMLButtonElement | null = document.querySelector(
      className as string
    );
    if (!button) return;
    (button.disabled as boolean | undefined) = isDisabled;
  }
}
