import { createSidePanel } from './side-panel';
import { screen } from '@testing-library/dom';

describe('createSidePanel', () => {
  let sidePanel: HTMLDivElement | null;
  let container: HTMLDivElement;
  let card: HTMLDivElement;

  beforeEach(() => {
    document.body.innerHTML = `
      <div class="page"></div>
      <div class="card" style="height: 100px;"></div>
    `;

    container = document.querySelector('.page') as HTMLDivElement;
    card = document.querySelector('.card') as HTMLDivElement;
    createSidePanel(container, card);
    sidePanel = document.querySelector('.side-panel');
  });
  test('createSidePanel adds side panel', () => {
    expect(sidePanel).toBeInTheDocument();
  });
  test('side panel has correct children', () => {
    const closeButton = screen.getByText('X', {
      selector: 'button',
    });
    expect(closeButton).toBeInTheDocument();

    const title = screen.getByText('Explanation', { selector: 'h2' });
    expect(title).toBeInTheDocument();
  });
});
