import type { StorageService } from './storage';
import { createStorageService } from './storage';

const AUTH_KEY = 'auth:isAuthenticated';

export type AuthService = {
  isAuthed: () => boolean;
  login: () => void;
  logout: () => void;
};

export const createAuthService = (storage: StorageService): AuthService => ({
  isAuthed: () => storage.get(AUTH_KEY) === '1',
  login: () => storage.set(AUTH_KEY, '1'),
  logout: () => storage.remove(AUTH_KEY),
});

// singleton, чтобы можно было пользоваться из страниц и из App.ts
const storage = createStorageService();
export const auth = createAuthService(storage);
