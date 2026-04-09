import type { RoutePath } from '../types';

let navigateImpl: ((to: RoutePath, replace?: boolean) => void) | null = null;

export function setNavigate(
  fn: (to: RoutePath, replace?: boolean) => void
): void {
  navigateImpl = fn;
}

export function navigate(to: RoutePath, replace = false): void {
  if (!navigateImpl) throw new Error('navigate() used before setNavigate()');
  navigateImpl(to, replace);
}
