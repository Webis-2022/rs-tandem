export function highLightAnswer(answer: string | undefined, color: string) {
  const labels: NodeListOf<HTMLLabelElement> =
    document.querySelectorAll('.label');
  Array.from(labels).forEach((label) => {
    if (label.lastChild?.textContent === answer) {
      label.style.color = color;
    }
  });
}
