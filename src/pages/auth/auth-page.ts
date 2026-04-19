import './auth-page.scss';
import { ROUTES, type AuthError } from '../../types';
import { navigate } from '../../app/navigation';
import { createEl, createButton, createLink } from '../../shared/dom';
import { getAuthErrorMessage } from '../../shared/helpers';
import type { Mode, AuthErrors } from './validate';
import { validateAuth, isValid } from './validate';
import * as authService from '../../services/auth-service';
import {
  resetGameState,
  saveGameId,
  saveUserData,
} from '../../app/state/actions';
import { createNewGame } from '../../services/api/create-new-game';
import { runLoginGameChoiceFlow } from '../../services/login-game-choice-flow';
import { deleteCompletedTopicsByUser } from '../../services/api/delete-completed-topics';
import { clearActiveSession } from '../../services/storage-service';
import { removeActiveGameFromServer } from '../../services/sync-active-game';

type Field = {
  root: HTMLElement;
  input: HTMLInputElement;
  error: HTMLElement;
};

function createField(params: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  autocomplete?: string;
  hint?: string;
}): Field {
  const {
    label,
    name,
    type = 'text',
    placeholder,
    autocomplete,
    hint,
  } = params;

  const root = createEl('label', { className: 'auth-field' });

  const labelEl = createEl('span', { text: label, className: 'auth-label' });

  const hintEl = hint
    ? createEl('div', { text: hint, className: 'auth-hint' })
    : null;

  const input = createEl('input', {
    className: 'auth-input',
  }) as HTMLInputElement;

  input.name = name;
  input.type = type;
  if (placeholder) input.placeholder = placeholder;
  if (autocomplete) input.setAttribute('autocomplete', autocomplete);

  const error = createEl('div', { text: '', className: 'auth-error' });

  root.append(labelEl);
  if (hintEl) root.append(hintEl);
  root.append(input, error);

  return { root, input, error };
}

export function createAuthView(initialMode: Mode = 'login'): HTMLElement {
  let mode: Mode = initialMode;

  // Layout
  const section = createEl('section', { className: 'auth' });
  const card = createEl('div', { className: 'auth-card' });

  const title = createEl('h1', { text: 'Welcome', className: 'auth-title' });
  const subtitle = createEl('p', {
    text: 'Use your email and password to continue',
    className: 'auth-subtitle',
  });

  // Tabs
  const tabs = createEl('div', { className: 'auth-tabs' });
  const loginTab = createButton('Login', undefined, 'auth-tab');
  const registerTab = createButton('Register', undefined, 'auth-tab');
  tabs.append(loginTab, registerTab);

  // Form
  const form = createEl('form', { className: 'auth-form' }) as HTMLFormElement;

  const formError = createEl('div', {
    text: '',
    className: 'auth-form-error',
  });

  const emailField = createField({
    label: 'Email',
    name: 'email',
    type: 'email',
    placeholder: 'name@example.com',
    autocomplete: 'email',
    hint: 'Example: name@example.com',
  });

  const passwordField = createField({
    label: 'Password',
    name: 'password',
    type: 'password',
    placeholder: '••••••••',
    autocomplete: 'current-password',
    hint: 'Min 6 characters',
  });

  const confirmField = createField({
    label: 'Confirm password',
    name: 'confirm',
    type: 'password',
    placeholder: '••••••••',
    autocomplete: 'new-password',
  });

  // Submit
  const submitBtn = createButton('Continue', undefined, 'btn auth-submit');
  submitBtn.type = 'submit';

  // Footer
  const footer = createEl('div', { className: 'auth-footer' });
  const backLink = createLink('Back to landing', ROUTES.Landing, 'auth-link');

  footer.append(backLink);

  // Compose
  form.append(
    formError,
    emailField.root,
    passwordField.root,
    confirmField.root,
    submitBtn,
    footer
  );

  card.append(title, subtitle, tabs, form);
  section.append(card);

  // Helpers
  const getValues = () => ({
    email: emailField.input.value,
    password: passwordField.input.value,
    confirm: confirmField.input.value,
  });

  const showErrors = (errors: AuthErrors) => {
    emailField.error.textContent = errors.email ?? '';
    passwordField.error.textContent = errors.password ?? '';
    confirmField.error.textContent = errors.confirm ?? '';
  };

  const clearErrors = () => {
    formError.textContent = '';
    showErrors({});
  };

  const updateValidity = () => {
    const errors = validateAuth(mode, getValues());
    showErrors(errors);
    submitBtn.disabled = !isValid(errors);
  };

  const setActiveModeUI = () => {
    loginTab.classList.toggle('is-active', mode === 'login');
    registerTab.classList.toggle('is-active', mode === 'register');

    confirmField.root.classList.toggle('is-hidden', mode !== 'register');

    passwordField.input.setAttribute(
      'autocomplete',
      mode === 'login' ? 'current-password' : 'new-password'
    );

    submitBtn.textContent = mode === 'login' ? 'Sign in' : 'Create account';

    if (mode !== 'register') confirmField.input.value = '';

    clearErrors();
    updateValidity();
  };

  // Events
  loginTab.addEventListener('click', () => {
    mode = 'login';
    setActiveModeUI();
  });

  registerTab.addEventListener('click', () => {
    mode = 'register';
    setActiveModeUI();
  });

  const onInput = () => updateValidity();
  emailField.input.addEventListener('input', onInput);
  passwordField.input.addEventListener('input', onInput);
  confirmField.input.addEventListener('input', onInput);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const errors = validateAuth(mode, getValues());
    if (!isValid(errors)) {
      showErrors(errors);
      return;
    }

    const { email, password } = getValues();

    try {
      // Disable form and show loading state
      submitBtn.disabled = true;
      emailField.input.disabled = true;
      passwordField.input.disabled = true;
      confirmField.input.disabled = true;

      submitBtn.textContent = 'Loading...';

      if (mode === 'register') {
        await authService.register(email, password);
        navigate(ROUTES.Library, true);
        return;
      }

      const user = await authService.login(email, password);
      saveUserData(user);

      const loginChoiceResult = await runLoginGameChoiceFlow(user.id);

      if (loginChoiceResult.status === 'error') {
        throw new Error('Failed to resolve current game.');
      }

      if (loginChoiceResult.status === 'continued') {
        saveGameId(loginChoiceResult.gameId);
        navigate(ROUTES.Library, true);
        return;
      }

      if (loginChoiceResult.status === 'start-new') {
        await deleteCompletedTopicsByUser(user.id);
        clearActiveSession();
        await removeActiveGameFromServer();

        resetGameState();
        await createNewGame(user.id);
        navigate(ROUTES.Library, true);
        return;
      }

      // Navigate to library on success // no-user / no-game
      navigate(ROUTES.Library, true);
    } catch (error) {
      const authError = error as AuthError;

      // Get user-friendly error message from helper
      formError.textContent = getAuthErrorMessage(authError);

      // Log error for debugging (not in production)
      if (import.meta.env.DEV) {
        console.error('Auth error:', authError);
      }
    } finally {
      // Re-enable form
      submitBtn.disabled = false;
      emailField.input.disabled = false;
      passwordField.input.disabled = false;
      confirmField.input.disabled = false;
      submitBtn.textContent = mode === 'login' ? 'Sign in' : 'Create account';
    }
  });

  // Init
  setActiveModeUI();
  updateValidity();

  return section;
}

// чтобы роутинг не ломать: оставим createLoginView, но по факту это auth screen
export const createLoginView = (): HTMLElement => createAuthView('login');
export const createRegisterView = (): HTMLElement => createAuthView('register');
