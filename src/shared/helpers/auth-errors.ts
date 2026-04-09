import type { AuthError } from '../../types';

/**
 * Map Supabase auth error codes to user-friendly messages
 *
 * @param error - Auth error from Supabase
 * @returns User-friendly error message
 */
export function getAuthErrorMessage(error: AuthError): string {
  const { code, message, status } = error;

  // Rate limit
  if (code === 'over_email_send_rate_limit') {
    return 'Too many attempts. Please wait a few minutes and try again.';
  }

  // Invalid email
  if (code === 'invalid_email') {
    return 'Please enter a valid email address.';
  }

  // Generic 400 with email in message
  if (status === 400 && message?.toLowerCase().includes('email')) {
    return 'Please enter a valid email address.';
  }

  // User already exists
  if (code === 'user_already_exists') {
    return 'Email is already registered. Try logging in instead.';
  }

  // Invalid credentials
  if (code === 'invalid_credentials' || code === 'invalid_login_credentials') {
    return 'Invalid email or password.';
  }

  // Email not confirmed
  if (code === 'email_not_confirmed') {
    return 'Please confirm your email address.';
  }

  // Weak password
  if (code === 'weak_password') {
    return 'Password is too weak. Use at least 6 characters.';
  }

  // Network error
  if (code === 'network_error') {
    return 'Connection failed. Please check your internet.';
  }

  // Default fallback
  return message || 'Something went wrong. Please try again.';
}
