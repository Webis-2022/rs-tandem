import { ROUTES } from '../types';
import { createRouter } from './router';
import { createLayout } from './layout/layout';
import { setNavigate } from './navigation';
import * as authService from '../services/auth-service';

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
import { silentlyRestoreActiveGame } from '../services/resume-active-game';

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
 * If the user refreshed directly on /practice, silently restores game state
 * from localStorage / server without showing a modal and without calling navigate().
 * The "Continue game?" modal is shown only:
 *   - on the login page (auth-page.ts) after a successful login
 *   - in Library when the user clicks the Start button (library.ts)
 */
async function restorePracticeStateOnRefresh(): Promise<void> {
  if (window.location.pathname !== ROUTES.Practice || !isAuthed()) {
    return;
  }

  await silentlyRestoreActiveGame();
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

  // If the user refreshed directly on /practice — silently restore game state.
  // No modal, no navigate needed: user is already on the correct route.
  await restorePracticeStateOnRefresh();

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
        redirectTo: ROUTES.Library,
      },
      [ROUTES.NotFound]: { createView: createNotFoundView },
      [ROUTES.Login]: {
        createView: createLoginView,
        guard: 'guest',
        redirectTo: ROUTES.Library,
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

  // setNavigate must be called before router.start() so that any code
  // triggered by route rendering (e.g. auth-page resume flow) can call navigate().
  setNavigate(router.go);
  router.start();
}
