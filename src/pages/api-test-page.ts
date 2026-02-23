import { BaseComponent } from '../core';
import type { Page } from '../core';

export function apiTestPage(): Page {
  let component: BaseComponent;

  return {
    render() {
      component = new BaseComponent({
        tag: 'div',
        className: ['api-test-page'],
        text: 'API Test Page is here',
      });
      return component;
    },
    onMount() {
      console.log('NOTE: API Test page mounted');
    },
    onDestroy() {
      console.log('NOTE: API Test page destroyed');
    },
  };
}
