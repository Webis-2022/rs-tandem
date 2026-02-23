import type { Language } from '../types/language';

export type HeaderTranslationKey = 'appName' | 'home' | 'signIn' | 'testApi';

export const headerTranslations: Record<
  Language,
  Record<HeaderTranslationKey, string>
> = {
  en: {
    appName: 'Widget Trainer',
    home: 'Home',
    signIn: 'Sign In',
    testApi: 'Test API',
  },
  ru: {
    appName: 'Тренажёр виджетов',
    home: 'Главная',
    signIn: 'Войти',
    testApi: 'Тест API',
  },
};
