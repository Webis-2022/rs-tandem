import { ROUTES } from '../types';
import { createRouter } from './router';
import { createLayout } from './layout';
import { auth } from './services/auth';
import { setNavigate } from './navigation';

import { createLandingView } from '../pages/landing';
import { createLoginView } from '../pages/login';
import { createDashboardView } from '../pages/dashboard';

export function initApp(mount: HTMLElement): void {
  const layout = createLayout();
  mount.replaceChildren(layout.root);

  const router = createRouter({
    mount: layout.outlet,
    fallback: ROUTES.Landing,
    isAuthed: auth.isAuthed,
    routes: {
      [ROUTES.Landing]: { createView: createLandingView },
      [ROUTES.Login]: {
        createView: createLoginView,
        guard: 'guest',
        redirectTo: ROUTES.Dashboard,
      },
      [ROUTES.Dashboard]: {
        createView: createDashboardView,
        guard: 'authed',
        redirectTo: ROUTES.Login,
      },
    },
  });

  setNavigate(router.go);
  router.start();
}
