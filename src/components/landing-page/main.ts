import { BaseComponent } from '../../core';

export class Main extends BaseComponent<'main'> {
  constructor() {
    super({ tag: 'main', className: ['landing-page-main'] });

    const todoText = new BaseComponent({
      tag: 'p',
      text: 'ToDo',
    });
    this.append(todoText);
  }
}
