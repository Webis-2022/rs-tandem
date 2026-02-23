import { BaseComponent } from '../../core';
import { Header } from './header.ts';
import { Main } from './main.ts';
import { Footer } from './footer.ts';

import '../../styles/landing-page.scss';

export class LandingPage extends BaseComponent<'div'> {
  private header: Header;
  private main: Main;
  private footer: Footer;

  constructor() {
    super({ tag: 'div', className: ['landing-page-container'] });

    this.header = new Header();
    this.main = new Main();
    this.footer = new Footer();

    this.append(this.header, this.main, this.footer);
  }
}
