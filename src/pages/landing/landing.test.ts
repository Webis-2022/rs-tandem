import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/dom';
import { ROUTES } from '../../types';
import type { User } from '../../types';

const mocks = vi.hoisted(() => ({
  getCurrentUser: vi.fn<() => User | null>().mockReturnValue(null),
  navigate: vi.fn(),
  showModal: vi.fn().mockResolvedValue({ confirmed: true }),
}));

vi.mock('../../services/auth-service', () => ({
  getCurrentUser: mocks.getCurrentUser,
}));

vi.mock('../../app/navigation', () => ({
  navigate: mocks.navigate,
}));

vi.mock('../../components/ui/modal/modal', () => ({
  showModal: mocks.showModal,
}));

import { createLandingView } from './landing';

const mockUser: User = {
  id: 'user-1',
  email: 'test@example.com',
  created_at: '2026-01-01',
};

describe('createLandingView', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
    mocks.getCurrentUser.mockReturnValue(null);
    mocks.showModal.mockResolvedValue({ confirmed: true });
  });

  describe('structure', () => {
    it('renders section with landing and page classes', () => {
      const section = createLandingView();
      document.body.append(section);
      expect(
        document.querySelector('section.landing.page')
      ).toBeInTheDocument();
    });

    it('renders h1 hero title', () => {
      const section = createLandingView();
      document.body.append(section);
      expect(
        section.querySelector('h1.landing-hero-title')
      ).toBeInTheDocument();
    });

    it('renders 3 feature cards', () => {
      const section = createLandingView();
      document.body.append(section);
      expect(section.querySelectorAll('.landing-feature')).toHaveLength(3);
    });

    it('renders 3 FAQ items', () => {
      const section = createLandingView();
      document.body.append(section);
      expect(section.querySelectorAll('.landing-faq-item')).toHaveLength(3);
    });

    it('renders 3 flow steps', () => {
      const section = createLandingView();
      document.body.append(section);
      expect(section.querySelectorAll('.landing-flow-item')).toHaveLength(3);
    });

    it('renders Quick Guide button', () => {
      const section = createLandingView();
      document.body.append(section);
      expect(
        screen.getByRole('button', { name: 'Quick Guide' })
      ).toBeInTheDocument();
    });
  });

  describe('guest user (not authenticated)', () => {
    beforeEach(() => {
      mocks.getCurrentUser.mockReturnValue(null);
    });

    it('shows "Start from Login" as primary CTA', () => {
      const section = createLandingView();
      document.body.append(section);
      expect(
        screen.getByRole('button', { name: 'Start from Login' })
      ).toBeInTheDocument();
    });

    it('shows "Sign in and Start" as final CTA', () => {
      const section = createLandingView();
      document.body.append(section);
      expect(
        screen.getByRole('button', { name: 'Sign in and Start' })
      ).toBeInTheDocument();
    });

    it('primary CTA navigates to Login on click', () => {
      const section = createLandingView();
      document.body.append(section);
      fireEvent.click(screen.getByRole('button', { name: 'Start from Login' }));
      expect(mocks.navigate).toHaveBeenCalledWith(ROUTES.Login);
    });

    it('final CTA navigates to Login on click', () => {
      const section = createLandingView();
      document.body.append(section);
      fireEvent.click(
        screen.getByRole('button', { name: 'Sign in and Start' })
      );
      expect(mocks.navigate).toHaveBeenCalledWith(ROUTES.Login);
    });

    it('final section text mentions creating an account', () => {
      const section = createLandingView();
      document.body.append(section);
      expect(
        section.querySelector('.landing-final-text')?.textContent
      ).toContain('Create an account');
    });
  });

  describe('authenticated user', () => {
    beforeEach(() => {
      mocks.getCurrentUser.mockReturnValue(mockUser);
    });

    it('shows "Go to Library" as primary CTA', () => {
      const section = createLandingView();
      document.body.append(section);
      expect(
        screen.getByRole('button', { name: 'Go to Library' })
      ).toBeInTheDocument();
    });

    it('shows "Continue Practice" as final CTA', () => {
      const section = createLandingView();
      document.body.append(section);
      expect(
        screen.getByRole('button', { name: 'Continue Practice' })
      ).toBeInTheDocument();
    });

    it('primary CTA navigates to Library on click', () => {
      const section = createLandingView();
      document.body.append(section);
      fireEvent.click(screen.getByRole('button', { name: 'Go to Library' }));
      expect(mocks.navigate).toHaveBeenCalledWith(ROUTES.Library);
    });

    it('final CTA navigates to Practice on click', () => {
      const section = createLandingView();
      document.body.append(section);
      fireEvent.click(
        screen.getByRole('button', { name: 'Continue Practice' })
      );
      expect(mocks.navigate).toHaveBeenCalledWith(ROUTES.Practice);
    });

    it('final section text mentions being already signed in', () => {
      const section = createLandingView();
      document.body.append(section);
      expect(
        section.querySelector('.landing-final-text')?.textContent
      ).toContain('You are already signed in');
    });
  });

  describe('Quick Guide modal', () => {
    it('clicking Quick Guide button opens modal', async () => {
      const section = createLandingView();
      document.body.append(section);
      fireEvent.click(screen.getByRole('button', { name: 'Quick Guide' }));
      await vi.waitFor(() => {
        expect(mocks.showModal).toHaveBeenCalledOnce();
      });
    });

    it('modal is called with correct title', async () => {
      const section = createLandingView();
      document.body.append(section);
      fireEvent.click(screen.getByRole('button', { name: 'Quick Guide' }));
      await vi.waitFor(() => {
        expect(mocks.showModal).toHaveBeenCalledWith(
          expect.objectContaining({ title: 'How to Start in 1 Minute' })
        );
      });
    });
  });
});
