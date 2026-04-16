let isSidePanelCloseInitialized = false;

function handleDocumentClick(event: MouseEvent) {
  const sidePanel = document.querySelector('.side-panel');
  if (!sidePanel) return;

  const target = event.target as Node;

  // Ignore clicks on the theme switcher button
  const layoutThemeSwitcher = document.querySelector('.layout-theme-switcher');
  if (layoutThemeSwitcher?.contains(target)) return;

  if (!sidePanel.contains(target)) {
    closeSidePanel();
  }
}

export function closeSidePanel() {
  const sidePanel: HTMLDivElement | null =
    document.querySelector('.side-panel');
  if (!sidePanel) return;
  sidePanel.classList.remove('opened');
  sidePanel.classList.add('closed');
  sidePanel.setAttribute('aria-hidden', 'true');
}

export function initSidePanelClose() {
  if (isSidePanelCloseInitialized) return;

  document.addEventListener('click', handleDocumentClick);
  isSidePanelCloseInitialized = true;
}
