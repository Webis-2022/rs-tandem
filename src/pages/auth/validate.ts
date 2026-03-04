export type Mode = 'login' | 'register';

export type AuthValues = {
  email: string;
  password: string;
  confirm: string;
};

export type AuthErrors = Partial<Record<keyof AuthValues, string>>;

export function isValidEmail(value: string): boolean {
  // intentionally simple for UI stage
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateAuth(mode: Mode, values: AuthValues): AuthErrors {
  const errors: AuthErrors = {};

  const email = values.email.trim();
  if (!email) errors.email = 'Email is required';
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email';

  const password = values.password;
  if (!password) errors.password = 'Password is required';
  else if (password.trim().length < 6) errors.password = 'Min 6 characters';

  if (mode === 'register') {
    if (!values.confirm) errors.confirm = 'Please confirm password';
    else if (values.confirm !== values.password)
      errors.confirm = 'Passwords do not match';
  }

  return errors;
}

export function isValid(errors: AuthErrors): boolean {
  return Object.keys(errors).length === 0;
}
