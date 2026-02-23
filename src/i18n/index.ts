import type { Language } from '../types/language';
import { headerTranslations, type HeaderTranslationKey } from './header';
import { mainTranslations, type MainTranslationKey } from './main';

export type TranslationKey = HeaderTranslationKey | MainTranslationKey;

export const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    ...headerTranslations.en,
    ...mainTranslations.en,
  },
  ru: {
    ...headerTranslations.ru,
    ...mainTranslations.ru,
  },
};
