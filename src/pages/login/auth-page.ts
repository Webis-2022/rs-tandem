import './auth-page.scss';
import { ROUTES } from '../../types';
import { auth } from '../../app/services/auth';
import { navigate } from '../../app/navigation';
import { createElement, createButton, createLink } from '../../shared/dom';

type Mode = 'login' | 'register';

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

  const root = createElement('label', undefined, 'auth__field');

  const labelEl = createElement('span', label, 'auth__label');

  const hintEl = hint ? createElement('div', hint, 'auth__hint') : null;

  const input = createElement(
    'input',
    undefined,
    'auth__input'
  ) as HTMLInputElement;
  input.name = name;
  input.type = type;
  if (placeholder) input.placeholder = placeholder;
  if (autocomplete) input.setAttribute('autocomplete', autocomplete);

  const error = createElement('div', '', 'auth__error');

  root.append(labelEl);
  if (hintEl) root.append(hintEl);
  root.append(input, error);

  return { root, input, error };
}

function isValidEmail(value: string): boolean {
  // intentionally simple for UI stage
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validate(
  mode: Mode,
  values: { email: string; password: string; confirm: string }
) {
  const errors: Record<string, string> = {};

  if (!values.email.trim()) errors.email = 'Email is required';
  else if (!isValidEmail(values.email.trim()))
    errors.email = 'Enter a valid email';

  if (!values.password) errors.password = 'Password is required';
  else if (values.password.length < 6) errors.password = 'Min 6 characters';

  if (mode === 'register') {
    if (!values.confirm) errors.confirm = 'Please confirm password';
    else if (values.confirm !== values.password)
      errors.confirm = 'Passwords do not match';
  }

  return errors;
}

export function createAuthView(initialMode: Mode = 'login'): HTMLElement {
  let mode: Mode = initialMode;

  const section = createElement('section', undefined, 'auth');

  const card = createElement('div', undefined, 'auth__card');

  const title = createElement('h1', 'Welcome', 'auth__title');
  const subtitle = createElement(
    'p',
    'Use your email and password to continue',
    'auth__subtitle'
  );

  // Tabs
  const tabs = createElement('div', undefined, 'auth__tabs');

  const loginTab = createButton('Login', undefined, 'auth__tab');
  const registerTab = createButton('Register', undefined, 'auth__tab');

  tabs.append(loginTab, registerTab);

  // Form
  const form = createElement(
    'form',
    undefined,
    'auth__form'
  ) as HTMLFormElement;

  const formError = createElement('div', '', 'auth__form-error');

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
  const submitBtn = createButton('Continue', undefined, 'btn auth__submit');
  // createButton делает type="button" — для формы меняем на submit
  submitBtn.type = 'submit';

  // Footer links / mode switch text
  const footer = createElement('div', undefined, 'auth__footer');
  const backLink = createLink('Back to landing', ROUTES.Landing, 'auth__link');
  const switchText = createElement('div', '', 'auth__switch');

  const switchBtn = createButton('', undefined, 'auth__switch-btn');
  // тоже будет type="button" — ок

  footer.append(backLink, switchText);

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

  const setActiveModeUI = () => {
    loginTab.classList.toggle('is-active', mode === 'login');
    registerTab.classList.toggle('is-active', mode === 'register');

    confirmField.root.classList.toggle('is-hidden', mode !== 'register');

    // autocomplete: login vs register
    passwordField.input.setAttribute(
      'autocomplete',
      mode === 'login' ? 'current-password' : 'new-password'
    );

    submitBtn.textContent = mode === 'login' ? 'Sign in' : 'Create account';

    switchText.textContent =
      mode === 'login' ? 'No account? ' : 'Already have an account? ';
    switchBtn.textContent = mode === 'login' ? 'Register' : 'Login';

    // очистка confirm при уходе в login
    if (mode !== 'register') confirmField.input.value = '';

    // очистим ошибки при переключении
    formError.textContent = '';
    emailField.error.textContent = '';
    passwordField.error.textContent = '';
    confirmField.error.textContent = '';

    // обновим состояние кнопки
    updateValidity();
  };

  const getValues = () => ({
    email: emailField.input.value,
    password: passwordField.input.value,
    confirm: confirmField.input.value,
  });

  const showErrors = (errors: Record<string, string>) => {
    emailField.error.textContent = errors.email ?? '';
    passwordField.error.textContent = errors.password ?? '';
    confirmField.error.textContent = errors.confirm ?? '';
  };

  const updateValidity = () => {
    const values = getValues();
    const errors = validate(mode, values);
    showErrors(errors);

    const ok = Object.keys(errors).length === 0;
    submitBtn.disabled = !ok;
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

  switchBtn.addEventListener('click', () => {
    mode = mode === 'login' ? 'register' : 'login';
    setActiveModeUI();
  });

  // чтобы кнопка была рядом с текстом
  switchText.append(switchBtn);

  const onInput = () => updateValidity();
  emailField.input.addEventListener('input', onInput);
  passwordField.input.addEventListener('input', onInput);
  confirmField.input.addEventListener('input', onInput);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const values = getValues();
    const errors = validate(mode, values);
    if (Object.keys(errors).length) {
      showErrors(errors);
      return;
    }

    // пока нет AuthService — делаем mock flow
    try {
      auth.login();
      navigate(ROUTES.Dashboard, true);
    } catch {
      formError.textContent = 'Something went wrong. Please try again.';
    }
  });

  // Init
  setActiveModeUI();
  updateValidity();

  return section;
}

// чтобы роутинг не ломать: оставим createLoginView, но по факту это auth screen
export const createLoginView = (): HTMLElement => createAuthView('login');

// если позже добавишь ROUTES.Register — можно сразу использовать
export const createRegisterView = (): HTMLElement => createAuthView('register');
