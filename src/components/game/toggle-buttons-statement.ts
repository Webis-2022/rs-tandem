export function toggleButtonsStatement() {
  const nextTopicButton = document.querySelector('.next-topic-btn');
  const libraryButton = document.querySelector('.library-btn');
  const hintButtons = document.querySelectorAll('.hint-btn');
  hintButtons.forEach((button) => button.setAttribute('disabled', ''));
  nextTopicButton?.removeAttribute('disabled');
  libraryButton?.removeAttribute('disabled');
}
