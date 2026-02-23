import { BaseComponent } from '../../core';

export class Header extends BaseComponent<'header'> {
  constructor() {
    super({ tag: 'header', className: ['landing-page-header'] });

    const logo = new BaseComponent({
      tag: 'span',
      className: ['logo'],
      text: 'Widget Trainer',
    });

    const navButtons = new BaseComponent({
      tag: 'div',
      className: ['nav-buttons'],
    });

    const signInBtn = new BaseComponent({
      tag: 'button',
      text: 'Sign In',
    });
    signInBtn.addEventListener('click', () => {
      alert('Sign In clicked');
    });

    const testApiBtn = new BaseComponent({
      tag: 'button',
      text: 'Test API',
    });
    testApiBtn.addEventListener('click', () => {
      alert('Test API clicked');
    });

    navButtons.append(signInBtn, testApiBtn);
    this.append(logo, navButtons);
  }
}
