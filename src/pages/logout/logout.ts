import { navigate } from '../../app/navigation';
import { ROUTES } from '../../types';
import * as authService from '../../services/auth-service';
import { createEl } from '../../shared/dom';
import { removeUserData, resetGameState } from '../../app/state/actions';

/**
 * Logout page component
 * Performs logout and redirects to landing page
 */
export const createLogoutView = (): HTMLElement => {
  const div = createEl('div');
  div.textContent = 'Logging out...';

  // Perform logout immediately
  (async () => {
    try {
      await authService.logout();
      removeUserData();
      resetGameState();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Always redirect, even if logout fails
      navigate(ROUTES.Landing, true);
    }
  })();

  return div;
};
