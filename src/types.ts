export const ROUTES = {
  Landing: '/landing',
  Login: '/login',
  Dashboard: '/dashboard',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

// export type RouteKey = 'landing' | 'login' | 'dashboard';

export type AuthState = {
  isAuthenticated: boolean;
  login?: string;
  // password?: string;
};
