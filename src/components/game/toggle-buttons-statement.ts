export function toggleButtonsStatement() {
  const nextTopicButton = document.querySelector('.next-topic-btn');
  const libraryButton = document.querySelector('.library-btn');
  const hintButtons = document.querySelectorAll('.hint-btn');
  const checkButton = document.querySelector('.check-button');
  hintButtons.forEach((button) => button.setAttribute('disabled', ''));
  checkButton?.setAttribute('disabled', '');
  nextTopicButton?.removeAttribute('disabled');
  libraryButton?.removeAttribute('disabled');
}
