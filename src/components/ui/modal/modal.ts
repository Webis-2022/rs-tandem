import './modal.scss';
import { createEl, createButton } from '../../../shared/dom';
import type { ModalOptions, ModalResult } from '../../../types';

let activeModal: HTMLElement | null = null;

interface OverlayWithHandler extends HTMLElement {
  _escapeHandler?: (e: KeyboardEvent) => void;
}

/**
 * Shows a modal dialog with customizable content and buttons.
 * Returns a promise that resolves when user clicks a button or closes the modal.
 */
export function showModal(options: ModalOptions): Promise<ModalResult> {
  // Close any existing modal first
  if (activeModal) {
    closeModal(activeModal);
  }

  const {
    title,
    message,
    showConfirm = false,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
  } = options;

  return new Promise((resolve) => {
    // Create modal structure
    const overlay = createEl('div', { className: 'modal-overlay' });
    const modal = createEl('div', { className: 'modal' });
    const card = createEl('div', { className: 'modal-card' });

    // Title (optional)
    if (title) {
      const titleEl = createEl('h2', { text: title, className: 'modal-title' });
      card.append(titleEl);
    }

    // Message
    const messageEl = createEl('p', {
      text: message,
      className: 'modal-message',
    });
    card.append(messageEl);

    // Buttons container
    const actions = createEl('div', { className: 'modal-actions' });

    const handleResult = (confirmed: boolean) => {
      closeModal(overlay);
      resolve({ confirmed });
    };

    if (showConfirm) {
      // Two buttons: Cancel + Confirm
      const cancelBtn = createButton(
        cancelText,
        () => handleResult(false),
        'btn modal-btn modal-btn-cancel'
      );
      const confirmBtn = createButton(
        confirmText,
        () => handleResult(true),
        'btn modal-btn modal-btn-confirm'
      );
      actions.append(cancelBtn, confirmBtn);
    } else {
      // Single OK button
      const okBtn = createButton(
        'OK',
        () => handleResult(true),
        'btn modal-btn modal-btn-confirm'
      );
      actions.append(okBtn);
    }

    card.append(actions);
    modal.append(card);
    overlay.append(modal);

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        handleResult(false);
      }
    });

    // Close on ESC key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleResult(false);
      }
    };
    document.addEventListener('keydown', handleEscape);

    // Store reference for cleanup
    overlay.dataset.escapeHandler = 'true';
    (overlay as OverlayWithHandler)._escapeHandler = handleEscape;

    // Add to DOM
    document.body.append(overlay);
    activeModal = overlay;

    // Trigger animation
    requestAnimationFrame(() => {
      overlay.classList.add('is-visible');
    });
  });
}

function closeModal(overlay: HTMLElement): void {
  overlay.classList.remove('is-visible');

  // Remove ESC listener
  const handler = (overlay as OverlayWithHandler)._escapeHandler;
  if (handler) {
    document.removeEventListener('keydown', handler);
  }

  // Wait for animation before removing from DOM
  setTimeout(() => {
    overlay.remove();
    if (activeModal === overlay) {
      activeModal = null;
    }
  }, 300); // match CSS transition duration
}
