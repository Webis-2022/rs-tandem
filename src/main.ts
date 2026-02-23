import { LandingPage } from './components/landing-page';

import './styles/main.scss';

document.addEventListener('DOMContentLoaded', () => {
  const app = new LandingPage();
  document.body.appendChild(app.element);
});
