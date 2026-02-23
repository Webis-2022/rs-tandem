import { BaseComponent } from '../core';
import type { Page } from '../core';

import { user$ } from '../store/auth-store';
import { authService } from '../services/auth-service';
import type { AuthError } from '@supabase/supabase-js';

import '../styles/api-test.scss';

export function apiTestPage(): Page {
  let container: BaseComponent<'div'>;
  let leftPanel: BaseComponent<'div'>;
  let rightPanel: BaseComponent<'div'>;
  let textarea: BaseComponent<'textarea'>;
  let emailInput: BaseComponent<'input'>;
  let passwordInput: BaseComponent<'input'>;
  let displayNameInput: BaseComponent<'input'>;

  const execute = async <T>(
    action: () => Promise<{ data: T | null; error: AuthError | null }>
  ) => {
    printResult('Loading...', null);
    try {
      const { data, error } = await action();
      printResult(data, error);
    } catch (err) {
      printResult(null, {
        message: `Unexpected error:\n${JSON.stringify(err, null, 2)}`,
      });
    }
  };

  const printResult = (data: unknown, error: unknown | null = null) => {
    if (error) {
      textarea.element.value = `Error:\n${JSON.stringify(error, null, 2)}`;
    } else {
      textarea.element.value = `Success:\n${JSON.stringify(data, null, 2)}`;
    }
  };

  const handleRegistration = async () => {
    const email = emailInput.element.value;
    const password = passwordInput.element.value;
    const displayName = displayNameInput.element.value;

    if (!email || !password) {
      printResult(null, { message: 'Email and password are required' });
      return;
    }

    await execute(() => authService.registration(email, password, displayName));
  };

  const handleSignIn = async () => {
    const email = emailInput.element.value;
    const password = passwordInput.element.value;
    if (!email || !password) {
      printResult(null, { message: 'Email and password are required' });
      return;
    }

    await execute(() => authService.signIn(email, password));
  };

  const handleSignOut = async () => {
    await execute(() => authService.signOut());
  };

  const handleUpdateDisplayName = async () => {
    const newName = displayNameInput.element.value;
    if (!newName) {
      printResult(null, { message: 'New display name is required' });
      return;
    }

    await execute(() => authService.updateDisplayName(newName));
  };

  const handleGetSession = async () => {
    await execute(() => authService.getSession());
  };

  const handleResetPassword = async () => {
    const email = emailInput.element.value;
    if (!email) {
      printResult(null, { message: 'Email is required' });
      return;
    }

    await execute(() => authService.resetPassword(email));
  };

  const handleGetCurrentUser = () => {
    const user = user$.value;
    if (user) {
      printResult(user, null);
    } else {
      printResult(null, { message: 'No user logged in' });
    }
  };

  const handleCopy = () => {
    const text = textarea.element.value;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        const copyBtn = document.querySelector('.copy-btn');
        if (copyBtn) {
          const originalText = copyBtn.textContent;
          copyBtn.textContent = 'Copied!';
          setTimeout(() => {
            copyBtn.textContent = originalText;
          }, 1500);
        }
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
      });
  };

  const createButton = (text: string, onClick: () => void) => {
    const btn = new BaseComponent({ tag: 'button', text });
    btn.addEventListener('click', onClick);
    return btn;
  };

  return {
    render() {
      container = new BaseComponent({
        tag: 'div',
        className: ['api-test-container'],
      });

      leftPanel = new BaseComponent({
        tag: 'div',
        className: ['api-test-left'],
      });

      const authTitle = new BaseComponent({
        tag: 'h3',
        className: ['auth-title'],
        text: 'Authorization Service',
      });

      emailInput = new BaseComponent({
        tag: 'input',
        attrs: { type: 'email', placeholder: 'Email', value: '' },
      });
      passwordInput = new BaseComponent({
        tag: 'input',
        attrs: { type: 'password', placeholder: 'Password', value: '' },
      });
      displayNameInput = new BaseComponent({
        tag: 'input',
        attrs: {
          type: 'text',
          placeholder: 'Display Name (optional)',
          value: '',
        },
      });

      const buttons = [
        createButton('Registration', handleRegistration),
        createButton('Sign In', handleSignIn),
        createButton('Sign Out', handleSignOut),
        createButton('Get Current User', handleGetCurrentUser),
        createButton('Update Display Name', handleUpdateDisplayName),
        createButton('Get Session', handleGetSession),
        createButton('Reset Password', handleResetPassword),
      ];

      leftPanel.append(
        authTitle,
        displayNameInput,
        emailInput,
        passwordInput,
        ...buttons
      );

      rightPanel = new BaseComponent({
        tag: 'div',
        className: ['api-test-right'],
      });

      const textareaHeader = new BaseComponent({
        tag: 'div',
        className: ['textarea-header'],
      });

      const docLink = new BaseComponent({
        tag: 'a',
        attrs: {
          href: 'https://supabase.com/docs/reference/javascript/auth-signup',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        text: 'Supabase Auth Docs',
      });

      const copyBtn = new BaseComponent({
        tag: 'button',
        className: ['copy-btn'],
        text: 'Copy',
      });
      copyBtn.addEventListener('click', handleCopy);

      textareaHeader.append(docLink, copyBtn);

      textarea = new BaseComponent({
        tag: 'textarea',
        attrs: {
          rows: '20',
          cols: '50',
          placeholder: 'Output will appear here...',
          readonly: true,
        },
      });

      rightPanel.append(textareaHeader, textarea);
      container.append(leftPanel, rightPanel);

      return container;
    },
    onMount() {
      console.log('NOTE: API Test page mounted');
    },
    onDestroy() {
      console.log('NOTE: API Test page destroyed');
    },
  };
}
