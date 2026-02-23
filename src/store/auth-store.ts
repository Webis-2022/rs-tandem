import { Observable } from '../core';
import type { User } from '@supabase/supabase-js';
import { authService } from '../services/auth-service';

export const user$ = new Observable<User | null>(null);
authService.onAuthStateChange((user) => {
  user$.set(user);
});
