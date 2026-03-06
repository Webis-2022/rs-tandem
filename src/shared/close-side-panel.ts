export function closeSidePanel() {
  const sidePanel: HTMLDivElement | null =
    document.querySelector('.side-panel');
  if (!sidePanel) return;
  sidePanel.classList.remove('opened');
  sidePanel.classList.add('closed');
}

export function initSidePanelClose() {
  document.addEventListener('click', (e) => {
    const sidePanel = document.querySelector('.side-panel');
    if (!sidePanel) return;

    const target = e.target as Node;

    if (!sidePanel.contains(target)) {
      closeSidePanel();
    }
  });
}
