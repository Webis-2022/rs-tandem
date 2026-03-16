import './styles/main.scss';
import { initApp } from './app/app';
import { createEl } from './shared/dom';

function getOrCreateMount(): HTMLElement {
  const existing = document.getElementById('app');
  if (existing) return existing;

  const root = createEl('div');
  root.id = 'app';
  document.body.append(root);
  return root;
}

// Initialize app with async auth restoration
(async () => {
  await initApp(getOrCreateMount());
})();
