import { BaseComponent } from '../core';
import type { Page } from '../core';

export function notFoundPage(): Page {
  let component: BaseComponent;

  return {
    render() {
      component = new BaseComponent({
        tag: 'div',
        className: ['not-found-page'],
        text: '404 — Hmm, you are on restricted area! What are you doing here?',
      });
      return component;
    },
    onMount() {
      console.log('404 page mounted');
    },
    onDestroy() {
      console.log('404 page destroyed');
    },
  };
}
