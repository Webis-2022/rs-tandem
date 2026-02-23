import { App } from './components';

import './styles/main.scss';

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  document.body.appendChild(app.element);
});
