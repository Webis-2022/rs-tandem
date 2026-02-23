import { BaseComponent } from '../core';
import type { Page } from '../core';

export function loginPage(): Page {
  let component: BaseComponent;

  return {
    render() {
      component = new BaseComponent({
        tag: 'div',
        className: ['login-page'],
        text: 'Login Page is here',
      });
      return component;
    },
    onMount() {
      console.log('NOTE: Login page mounted');
    },
    onDestroy() {
      console.log('NOTE: Login page destroyed');
    },
  };
}
