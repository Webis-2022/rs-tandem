import { BaseComponent } from '../core';

export class Footer extends BaseComponent<'footer'> {
  constructor() {
    super({ tag: 'footer', className: ['app-footer'] });

    const year = new Date().getFullYear();
    const text = new BaseComponent({
      tag: 'span',
      text: `© ${year} DevBand`,
    });
    this.append(text);
  }
}
