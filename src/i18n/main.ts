import type { Language } from '../types/language';

export type MainTranslationKey = 'mainTempText';

export const mainTranslations: Record<
  Language,
  Record<MainTranslationKey, string>
> = {
  en: {
    mainTempText: 'TODO...',
  },
  ru: {
    mainTempText: 'Когда-нибудь тут будет посадочная страница...',
  },
};
