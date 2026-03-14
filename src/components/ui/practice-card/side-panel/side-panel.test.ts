import { createSidePanel } from './side-panel';
import { screen } from '@testing-library/dom';
import { createEl } from '../../../../shared/dom';
import { showSidePanel } from '../../../../shared/show-side-panel';

describe('createSidePanel', () => {
  let sidePanel: HTMLDivElement | null;
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="page"></div>
      <div class="card" style="height: 100px;"></div>
    `;
    createSidePanel();
    sidePanel = document.querySelector('.side-panel');
  });
  test('createSidePanel adds side panel', () => {
    expect(sidePanel).toBeInTheDocument();
  });
  test('side panel has correct children', () => {
    const closeButton = screen.getByRole('button', { name: 'X' });
    expect(closeButton).toBeInTheDocument();

    const title = screen.getByText('Explanation');
    expect(title).toBeInTheDocument();
  });
  test('contains className opened', async () => {
    const button = createEl('div', {
      text: "I don't know",
      className: 'hint-btn',
    });
    document.body.append(button);

    button.addEventListener('click', showSidePanel);
    const btn = screen.getByText("I don't know");

    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(sidePanel).toHaveClass('opened');
  });
});
