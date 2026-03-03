import './styles/main.scss';
import { initApp } from './app/app';
import { getQuestions } from './services/api/get-questions';

//remove
getQuestions(7, 'easy');

function getOrCreateMount(): HTMLElement {
  const existing = document.getElementById('app');
  if (existing) return existing;

  const root = document.createElement('div');
  root.id = 'app';
  document.body.append(root);
  return root;
}

initApp(getOrCreateMount());
