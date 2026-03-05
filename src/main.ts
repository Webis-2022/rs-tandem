import './styles/main.scss';
import { initApp } from './app/app';

function getOrCreateMount(): HTMLElement {
  const existing = document.getElementById('app');
  if (existing) return existing;

  const root = document.createElement('div');
  root.id = 'app';
  document.body.append(root);
  return root;
}

initApp(getOrCreateMount());
