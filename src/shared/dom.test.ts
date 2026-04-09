import { createButton, createEl, createLink } from './dom';

test('createEl creates element from options object', () => {
  const element = createEl('span', { text: 'Text', className: 'label' });

  expect(element.tagName).toBe('SPAN');
  expect(element.textContent).toBe('Text');
  expect(element.className).toBe('label');
});

test('createButton creates disabled button with text', () => {
  const button = createButton('Start', undefined, 'btn', true);

  expect(button.tagName).toBe('BUTTON');
  expect(button.textContent).toBe('Start');
  expect(button.className).toBe('btn');
  expect(button.disabled).toBe(true);
});

test('createLink creates anchor with href and data-link attribute', () => {
  const link = createLink('Go', '/login', 'nav-link');

  expect(link.tagName).toBe('A');
  expect(link.textContent).toBe('Go');
  expect(link.className).toBe('nav-link');
  expect(link.getAttribute('data-link')).toBe('');
});
