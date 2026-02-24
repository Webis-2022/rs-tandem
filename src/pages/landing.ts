import { ROUTES } from '../types';
import { navigate } from '../app/navigation';

export const createLandingView = (): HTMLElement => {
  const section = document.createElement('section');
  section.style.display = 'flex';
  section.style.flexDirection = 'column';
  section.style.gap = '16px';

  const title = document.createElement('h1');
  title.textContent =
    'Landing. Привет! Тут мы сделаем классное описание нашего тренажера :)';

  const buttons = document.createElement('div');
  buttons.style.display = 'flex';
  buttons.style.gap = '12px';

  const toLogin = document.createElement('button');
  toLogin.textContent = 'Login';
  toLogin.onclick = () => navigate(ROUTES.Login);

  const toDash = document.createElement('button');
  toDash.textContent = 'Main';
  toDash.onclick = () => navigate(ROUTES.Dashboard);

  buttons.append(toLogin, toDash);
  section.append(title, buttons);

  return section;
};
