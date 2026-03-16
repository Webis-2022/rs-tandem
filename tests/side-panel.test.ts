import { createSidePanel } from '../src/components/ui/practice-card/side-panel/side-panel';
import { screen } from '@testing-library/dom';

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
});
