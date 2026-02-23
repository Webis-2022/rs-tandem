import { BaseComponent } from '../core';
import { language$ } from '../store/language-store.ts';
import { translations, type TranslationKey } from '../i18n';

type HeaderCallbacks = {
  onHome: () => void;
  onSignIn: () => void;
  onTestApi: () => void;
};

export class Header extends BaseComponent<'header'> {
  private readonly logo: BaseComponent<'span'>;
  private homeBtn: BaseComponent<'button'>;
  private readonly signInBtn: BaseComponent<'button'>;
  private readonly testApiBtn: BaseComponent<'button'>;
  private readonly langRuBtn: BaseComponent<'button'>;
  private readonly langEnBtn: BaseComponent<'button'>;
  private callbacks: HeaderCallbacks;
  private readonly unsubscribe: () => void;

  constructor(callbacks: HeaderCallbacks) {
    super({ tag: 'header', className: ['app-header'] });
    this.callbacks = callbacks;

    this.logo = new BaseComponent({ tag: 'span', className: ['logo'] });

    const navButtons = new BaseComponent({
      tag: 'div',
      className: ['nav-buttons'],
    });

    this.homeBtn = new BaseComponent({ tag: 'button' });
    this.homeBtn.addEventListener('click', this.callbacks.onHome);

    this.signInBtn = new BaseComponent({ tag: 'button' });
    this.signInBtn.addEventListener('click', this.callbacks.onSignIn);

    this.testApiBtn = new BaseComponent({ tag: 'button' });
    this.testApiBtn.addEventListener('click', this.callbacks.onTestApi);

    const langButtons = new BaseComponent({
      tag: 'div',
      className: ['lang-buttons'],
    });

    this.langRuBtn = new BaseComponent({ tag: 'button', text: 'RU' });
    this.langEnBtn = new BaseComponent({ tag: 'button', text: 'EN' });

    this.langRuBtn.addEventListener('click', () => language$.set('ru'));
    this.langEnBtn.addEventListener('click', () => language$.set('en'));

    langButtons.append(this.langRuBtn, this.langEnBtn);
    navButtons.append(
      this.homeBtn,
      this.signInBtn,
      this.testApiBtn,
      langButtons
    );
    this.append(this.logo, navButtons);

    this.unsubscribe = language$.subscribe(() => this.updateHeader());

    this.updateHeader();
  }

  private updateHeader(): void {
    this.updateTexts();
    this.updateActiveLangButton();
  }

  private updateTexts(): void {
    const lang = language$.value;
    const dictionary = (key: TranslationKey) => translations[lang][key];

    this.logo.element.textContent = dictionary('appName');
    this.homeBtn.element.textContent = dictionary('home');
    this.signInBtn.element.textContent = dictionary('signIn');
    this.testApiBtn.element.textContent = dictionary('testApi');
  }

  private updateActiveLangButton(): void {
    const currentLang = language$.value;

    this.langRuBtn.element.classList.remove('active');
    this.langEnBtn.element.classList.remove('active');

    if (currentLang === 'ru') {
      this.langRuBtn.element.classList.add('active');
    } else {
      this.langEnBtn.element.classList.add('active');
    }
  }

  public remove(): void {
    this.unsubscribe();
    super.remove();
  }
}
