export function showSidePanel(e: MouseEvent) {
  e.stopPropagation();
  const sidePanel: HTMLDivElement | null =
    document.querySelector('.side-panel');
  if (!sidePanel) return;
  sidePanel.classList.remove('closed');
  sidePanel.classList.add('opened');
}
