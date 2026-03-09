import { navigate } from '../../app/navigation';
import { ROUTES } from '../../types';
import * as authService from '../../services/authService';

/**
 * Logout page component
 * Performs logout and redirects to landing page
 */
export const createLogoutView = (): HTMLElement => {
  const div = document.createElement('div');
  div.textContent = 'Logging out...';

  // Perform logout immediately
  (async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Always redirect, even if logout fails
      navigate(ROUTES.Landing, true);
    }
  })();

  return div;
};
