import { BaseComponent, Router } from '../core';
import { Header } from './header.ts';
import { Footer } from './footer.ts';

import { homePage, loginPage, apiTestPage, notFoundPage } from '../pages';

import '../styles/app.scss';

export class App extends BaseComponent<'div'> {
  private readonly header: Header;
  public mainContainer: BaseComponent<'div'>;
  private readonly footer: Footer;
  public router: Router;

  constructor() {
    super({ tag: 'div', className: ['app-container'] });

    this.header = new Header({
      onHome: () => this.router.navigate('/'),
      onSignIn: () => this.router.navigate('/login'),
      onTestApi: () => this.router.navigate('/api-test'),
    });

    this.mainContainer = new BaseComponent({
      tag: 'div',
      className: ['app-main'],
    });

    this.footer = new Footer();

    this.append(this.header, this.mainContainer, this.footer);

    this.router = new Router(this.mainContainer);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.addRoute('/', homePage);
    this.router.addRoute('/login', loginPage);
    this.router.addRoute('/api-test', apiTestPage);
    this.router.setNotFound(notFoundPage);
    this.router.start();
  }
}
