import { ROUTES } from '../types';
import { createRouter } from './router';
import { createLayout } from './layout/layout';
import { navigate, setNavigate } from './navigation';
import * as authService from '../services/authService';

import { createDashboardView } from '../pages/dashboard/dashboard';
import { createLandingView } from '../pages/landing/landing';
import { createLoginView } from '../pages/auth/auth-page';
import { createLibraryView } from '../pages/library/library';
import { createPracticeView } from '../pages/practice/practice';
import { createLogoutView } from '../pages/logout/logout';
import { createNotFoundView } from '../pages/not-found/not-found';

import { applyTheme, setActiveRoute } from './state/actions';
import { getState } from './state/store';
import { createLoadingView } from '../components/ui/loading/loading';
import { runResumeGameFlow } from '../services/resumeActiveGame';

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

/**
 * Checks for an unfinished game and asks the user
 * whether it should be resumed.
 */
async function tryResumeGame(): Promise<void> {
  const result = await runResumeGameFlow();

  if (result === 'discarded') {
    navigate(ROUTES.Dashboard, true);
  }
}

function waitForPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

export async function initApp(mount: HTMLElement): Promise<void> {
  applyTheme(getState().ui.theme);

  const layout = createLayout();
  mount.replaceChildren(layout.root);

  layout.outlet.replaceChildren(createLoadingView('Loading app...'));

  await waitForPaint();

  // Initialize auth state before setting up router
  await initAuth();

  const router = createRouter({
    mount: layout.outlet,
    fallback: ROUTES.NotFound,
    isAuthed,
    onRouteChange: (route) => {
      setActiveRoute(route);
    },
    routes: {
      [ROUTES.Landing]: {
        createView: createLandingView,
        guard: 'guest',
        redirectTo: ROUTES.Dashboard,
      },
      [ROUTES.NotFound]: { createView: createNotFoundView },
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
        createView: () => createLibraryView('easy'),
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

  await waitForPaint();
  await tryResumeGame();
}
