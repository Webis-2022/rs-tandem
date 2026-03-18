import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { showModal } from './modal';
import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

describe('Modal Component', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    // Clean up any remaining modals
    document.querySelectorAll('.modal-overlay').forEach((el) => el.remove());
  });

  describe('Basic rendering', () => {
    it('should render modal with message and title', async () => {
      const promise = showModal({
        message: 'Test message',
        title: 'Test Title',
      });

      const overlay = document.querySelector('.modal-overlay');
      const modal = document.querySelector('.modal');
      const title = screen.getByText('Test Title');
      const message = screen.getByText('Test message');

      expect(overlay).toBeInTheDocument();
      expect(modal).toBeInTheDocument();
      expect(title).toHaveClass('modal-title');
      expect(message).toHaveClass('modal-message');

      const okBtn = screen.getByRole('button', { name: /ok/i });
      await user.click(okBtn);
      await promise;
    });

    it('should not render title when not provided', async () => {
      const promise = showModal({ message: 'Message only' });

      const title = document.querySelector('.modal-title');
      expect(title).not.toBeInTheDocument();

      const okBtn = screen.getByRole('button', { name: /ok/i });
      await user.click(okBtn);
      await promise;
    });
  });

  describe('Single button mode', () => {
    it('should show only OK button and resolve with true', async () => {
      const promise = showModal({ message: 'Test' });

      const buttons = document.querySelectorAll('.modal-btn');
      expect(buttons).toHaveLength(1);

      const okBtn = screen.getByRole('button', { name: /ok/i });
      await user.click(okBtn);

      const result = await promise;
      expect(result.confirmed).toBe(true);
    });
  });

  describe('Confirm mode', () => {
    it('should show both buttons with custom texts', async () => {
      const promise = showModal({
        message: 'Test',
        showConfirm: true,
        confirmText: 'Yes',
        cancelText: 'No',
      });

      const confirmBtn = screen.getByRole('button', { name: /yes/i });
      const cancelBtn = screen.getByRole('button', { name: /no/i });

      expect(confirmBtn).toBeInTheDocument();
      expect(cancelBtn).toBeInTheDocument();

      await user.click(confirmBtn);
      const result = await promise;
      expect(result.confirmed).toBe(true);
    });

    it('should resolve with false when Cancel clicked', async () => {
      const promise = showModal({
        message: 'Test',
        showConfirm: true,
      });

      const cancelBtn = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelBtn);

      const result = await promise;
      expect(result.confirmed).toBe(false);
    });
  });

  describe('Closing mechanisms', () => {
    it('should close when clicking on overlay', async () => {
      const promise = showModal({ message: 'Test' });

      const overlay = document.querySelector('.modal-overlay') as HTMLElement;
      await user.click(overlay);

      const result = await promise;
      expect(result.confirmed).toBe(false);

      await waitFor(
        () => {
          expect(
            document.querySelector('.modal-overlay')
          ).not.toBeInTheDocument();
        },
        { timeout: 500 }
      );
    });

    it('should NOT close when clicking modal card', async () => {
      const promise = showModal({ message: 'Test' });

      const card = document.querySelector('.modal-card') as HTMLElement;
      await user.click(card);

      const overlay = document.querySelector('.modal-overlay');
      expect(overlay).toBeInTheDocument();

      const okBtn = screen.getByRole('button', { name: /ok/i });
      await user.click(okBtn);
      await promise;
    });

    it('should close when pressing ESC key', async () => {
      const promise = showModal({ message: 'Test' });

      await user.keyboard('{Escape}');

      const result = await promise;
      expect(result.confirmed).toBe(false);
    });
  });

  describe('Singleton pattern', () => {
    it('should allow only one modal in DOM at a time', async () => {
      showModal({ message: 'First' });

      // Wait for first modal animation
      await waitFor(() => {
        const overlay = document.querySelector('.modal-overlay');
        expect(overlay).toHaveClass('is-visible');
      });

      // Open second modal - should close first
      const promise2 = showModal({ message: 'Second' });

      // After animation, only second modal should remain
      await waitFor(
        () => {
          const secondMessage = screen.queryByText('Second');
          expect(secondMessage).toBeInTheDocument();

          const firstMessage = screen.queryByText('First');
          expect(firstMessage).not.toBeInTheDocument();
        },
        { timeout: 500 }
      );

      // Close second modal
      const okBtn = screen.getByRole('button', { name: /ok/i });
      await user.click(okBtn);
      await promise2;
    });
  });

  describe('Animation', () => {
    it('should add is-visible class and remove after closing', async () => {
      const promise = showModal({ message: 'Test' });

      await waitFor(() => {
        const overlay = document.querySelector('.modal-overlay');
        expect(overlay).toHaveClass('is-visible');
      });

      const okBtn = screen.getByRole('button', { name: /ok/i });
      await user.click(okBtn);

      const overlay = document.querySelector('.modal-overlay');
      if (overlay) {
        expect(overlay).not.toHaveClass('is-visible');
      }

      await promise;

      await waitFor(
        () => {
          expect(
            document.querySelector('.modal-overlay')
          ).not.toBeInTheDocument();
        },
        { timeout: 500 }
      );
    });
  });

  describe('Event listener cleanup', () => {
    it('should remove ESC listener after closing', async () => {
      const promise = showModal({ message: 'Test' });

      const okBtn = screen.getByRole('button', { name: /ok/i });
      await user.click(okBtn);
      await promise;

      await waitFor(
        () => {
          expect(
            document.querySelector('.modal-overlay')
          ).not.toBeInTheDocument();
        },
        { timeout: 500 }
      );

      // Press ESC - should not create any new modal
      await user.keyboard('{Escape}');
      const overlay = document.querySelector('.modal-overlay');
      expect(overlay).not.toBeInTheDocument();
    });
  });
});
