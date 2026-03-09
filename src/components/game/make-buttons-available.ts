export function makeButtonsAvailable() {
  const nextTopicButton = document.querySelector('.next-topic-btn');
  const libraryButton = document.querySelector('.library-btn');
  nextTopicButton?.removeAttribute('disabled');
  libraryButton?.removeAttribute('disabled');
}
