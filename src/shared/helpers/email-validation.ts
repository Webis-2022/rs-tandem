/**
 * Validate email address using RFC 5322 compliant regex
 *
 * @param value - Email address to validate
 * @returns true if email is valid, false otherwise
 *
 * @example
 * isValidEmail('test@example.com') // true
 * isValidEmail('test@') // false
 * isValidEmail('test') // false
 */
export function isValidEmail(value: string): boolean {
  // RFC 5322 compliant (simplified version)
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(value)) return false;

  // Additional validation checks
  const parts = value.split('@');
  if (parts.length !== 2) return false;

  const [localPart, domain] = parts;

  // Local part should not be empty or longer than 64 characters
  if (!localPart || localPart.length > 64) return false;

  // Domain should contain a dot and not be longer than 255 characters
  if (!domain.includes('.') || domain.length > 255) return false;

  // Domain should not start or end with dot or hyphen
  if (
    domain.startsWith('.') ||
    domain.startsWith('-') ||
    domain.endsWith('.') ||
    domain.endsWith('-')
  )
    return false;

  return true;
}
