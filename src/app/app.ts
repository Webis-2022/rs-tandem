import { ROUTES } from '../types';
import { createRouter } from './router';
import { createLayout } from './layout/layout';
import { setNavigate } from './navigation';
import * as authService from '../services/authService';

import { createDashboardView } from '../pages/dashboard/dashboard';
import { createLandingView } from '../pages/landing/landing';
import { createLoginView } from '../pages/auth/auth-page';
import { createLibraryView } from '../pages/library/library';
import { createPracticeView } from '../pages/practice/practice';
import { createLogoutView } from '../pages/logout/logout';

import { getActiveGame } from '../services/storageService';
import { restoreGameState } from './state/store';

/**
 * Initialize authentication state
 * Attempts to restore session from localStorage and validate token
 */
async function initAuth(): Promise<void> {
  try {
    const isValid = await authService.validateToken();

    if (isValid) {
      const user = authService.getCurrentUser();
      if (user) {
        console.log('Session restored for user:', user.email);
      }
    } else {
      console.log('No valid session found');
    }
  } catch (error) {
    console.error('Failed to restore session:', error);
    // Clear invalid session
    await authService.logout();
  }
}

/**
 * Check if user is authenticated
 * This function is used by the router for guard checks
 */
function isAuthed(): boolean {
  const user = authService.getCurrentUser();
  return user !== null;
}

export async function initApp(mount: HTMLElement): Promise<void> {
  // Initialize auth state before setting up router
  await initAuth();

  const layout = createLayout();
  mount.replaceChildren(layout.root);

  const activeGame = getActiveGame(); // читаем сохраненную игру из браузера

  //если нашли сохраненную игру в браузере, подставляем ее обратно в store
  if (activeGame) {
    restoreGameState(activeGame);
  }

  const router = createRouter({
    mount: layout.outlet,
    fallback: ROUTES.Landing,
    isAuthed,
    routes: {
      [ROUTES.Landing]: { createView: createLandingView },
      [ROUTES.Login]: {
        createView: createLoginView,
        guard: 'guest',
        redirectTo: ROUTES.Dashboard,
      },
      [ROUTES.Logout]: {
        createView: createLogoutView,
        // No guard - logout should work regardless of auth state
      },
      [ROUTES.Dashboard]: {
        createView: createDashboardView,
        guard: 'authed',
        redirectTo: ROUTES.Login,
      },
      [ROUTES.Library]: {
        createView: createLibraryView,
        guard: 'authed',
        redirectTo: ROUTES.Login,
      },
      [ROUTES.Practice]: {
        createView: createPracticeView,
        guard: 'authed',
        redirectTo: ROUTES.Login,
      },
    },
  });

  setNavigate(router.go);
  router.start();
}
