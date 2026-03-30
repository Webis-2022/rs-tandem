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

import { restoreGameState, saveTopics } from './state/actions';
import { createLoadingView } from '../components/ui/loading/loading';

import {
  discardResumeCandidate,
  getResumeCandidate,
  promptResumeGame,
} from '../services/resumeActiveGame';
import { getState } from './state/store';
import { getTopics } from '../services/api/get-topics';

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
 * Restore active game
 * Priority:
 * 1. localStorage (for authenticated users)
 * 2. Supabase fallback
 */

async function tryResumeGame(): Promise<void> {
  const game = await getResumeCandidate();

  if (!game) {
    return;
  }

  const shouldResume = await promptResumeGame(game);

  if (shouldResume) {
    restoreGameState(game);

    if (getState().topics.length === 0) {
      try {
        const topics = await getTopics();
        saveTopics(topics);
      } catch (error) {
        console.error('Failed to load topics for resumed game:', error);
      }
    }

    navigate(ROUTES.Practice, true);
    return;
  }

  await discardResumeCandidate();
}

function waitForPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

export async function initApp(mount: HTMLElement): Promise<void> {
  const layout = createLayout();
  mount.replaceChildren(layout.root);

  layout.outlet.replaceChildren(createLoadingView('Loading app...'));

  await waitForPaint();

  // Initialize auth state before setting up router
  await initAuth();
  // await restoreActiveGame();

  const router = createRouter({
    mount: layout.outlet,
    fallback: ROUTES.NotFound,
    isAuthed,
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

  await waitForPaint();
  await tryResumeGame();
}
