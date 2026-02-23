import { BaseComponent } from '../../core';
import { language$ } from '../../store/language.store';
import { translations, type TranslationKey } from '../../i18n';

export class Main extends BaseComponent<'main'> {
  private readonly todoText: BaseComponent<'p'>;
  private readonly unsubscribe: () => void;

  constructor() {
    super({ tag: 'main', className: ['landing-page-main'] });

    this.todoText = new BaseComponent({ tag: 'p' });
    this.append(this.todoText);

    this.unsubscribe = language$.subscribe(() => this.updateTexts());

    this.updateTexts();
  }

  private updateTexts(): void {
    const lang = language$.value;
    const dictionary = (key: TranslationKey) => translations[lang][key];

    this.todoText.element.textContent = dictionary('mainTempText');
  }

  public remove(): void {
    this.unsubscribe();
    super.remove();
  }
}
