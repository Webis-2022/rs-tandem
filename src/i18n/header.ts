import type { Language } from '../types/language';

export type HeaderTranslationKey = 'appName' | 'signIn' | 'testApi';

export const headerTranslations: Record<
  Language,
  Record<HeaderTranslationKey, string>
> = {
  en: {
    appName: 'Widget Trainer',
    signIn: 'Sign In',
    testApi: 'Test API',
  },
  ru: {
    appName: 'Тренажёр перед собеседованием',
    signIn: 'Войти',
    testApi: 'Тест API',
  },
};
