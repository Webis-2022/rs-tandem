import { ROUTES } from '../types';
import { createRouter } from './router';
import { createLayout } from './layout/layout';
import { navigate, setNavigate } from './navigation';
import * as authService from '../services/auth-service';

import { createDashboardView } from '../pages/dashboard/dashboard';
import { createLandingView } from '../pages/landing/landing';
import { createLoginView } from '../pages/auth/auth-page';
import { createLibraryView } from '../pages/library/library';
import { createPracticeView } from '../pages/practice/practice';
import { createLogoutView } from '../pages/logout/logout';
import { createNotFoundView } from '../pages/not-found/not-found';

import {
  applyTheme,
  restoreGameState,
  saveTopics,
  setActiveRoute,
} from './state/actions';
import { getState } from './state/store';
import { createLoadingView } from '../components/ui/loading/loading';
import { getTopics } from '../services/api/get-topics';
import {
  getResumeCandidate,
  runResumeGameFlow,
} from '../services/resume-active-game';

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
    navigate(ROUTES.Library, true);
  }
}

async function restorePracticeStateOnRefresh(): Promise<boolean> {
  if (window.location.pathname !== ROUTES.Practice) {
    return false;
  }

  if (!isAuthed()) {
    return false;
  }

  const candidate = await getResumeCandidate();

  if (!candidate) {
    return false;
  }

  if (getState().topics.length === 0) {
    try {
      const topics = await getTopics();
      saveTopics(topics);
    } catch (error) {
      console.error(
        'Failed to load topics while restoring practice state:',
        error
      );
    }
  }

  restoreGameState(candidate);
  return true;
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
  const restoredPracticeState = await restorePracticeStateOnRefresh();

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

  setNavigate(router.go);

  const shouldResumeBeforeStart =
    isAuthed() && window.location.pathname === ROUTES.Practice;

  if (shouldResumeBeforeStart) {
    await tryResumeGame();
  }

  router.start();

  if (restoredPracticeState) {
    return;
  }

  if (!shouldResumeBeforeStart && isAuthed()) {
    await waitForPaint();
    await tryResumeGame();
  }
}
