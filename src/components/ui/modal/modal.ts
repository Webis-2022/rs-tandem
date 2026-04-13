import './modal.scss';
import { createEl, createButton } from '../../../shared/dom';
import type { ModalOptions, ModalResult } from '../../../types';

let activeModal: HTMLElement | null = null;
let activeEscapeHandler: ((e: KeyboardEvent) => void) | null = null;
let activeResolve: ((result: ModalResult) => void) | null = null;

/**
 * Shows a modal dialog with customizable content and buttons.
 * @param options Modal options:
 * - title: optional header text
 * - messageText: plain text body (rendered as text)
 * - messageStrongText: optional bold part appended to messageText
 * - messageHtml: trusted HTML for body content
 * - showConfirm: when true shows Cancel + Confirm buttons, otherwise one OK button
 * - confirmText/cancelText: custom labels for confirm mode buttons
 * @returns Promise resolved with user decision.
 */
export function showModal(options: ModalOptions): Promise<ModalResult> {
  // Close any existing modal first and resolve its promise
  if (activeModal) {
    // Resolve pending promise with cancelled result
    if (activeResolve) {
      activeResolve({ confirmed: false });
      activeResolve = null;
    }
    closeModal(activeModal);
  }

  const {
    title,
    messageText,
    messageStrongText,
    messageHtml,
    showConfirm = false,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
  } = options;

  return new Promise((resolve) => {
    // Store resolve function for cleanup
    activeResolve = resolve;
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
    const messageEl = createEl('div', {
      className: 'modal-message',
    });
    if (typeof messageText === 'string') {
      messageEl.textContent = messageText;

      if (typeof messageStrongText === 'string') {
        const strongEl = createEl('b', { text: messageStrongText });
        messageEl.append(strongEl);
      }
    } else {
      // messageHtml is expected to be trusted UI markup from app code.
      messageEl.innerHTML = messageHtml ?? '';
    }
    card.append(messageEl);

    // Buttons container
    const actions = createEl('div', { className: 'modal-actions' });

    const handleResult = (confirmed: boolean) => {
      closeModal(overlay);
      resolve({ confirmed });
      activeResolve = null;
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
    activeEscapeHandler = handleEscape;

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
  if (activeEscapeHandler) {
    document.removeEventListener('keydown', activeEscapeHandler);
    activeEscapeHandler = null;
  }

  // Wait for animation before removing from DOM
  setTimeout(() => {
    overlay.remove();
    if (activeModal === overlay) {
      activeModal = null;
    }
  }, 300); // match CSS transition duration
}
