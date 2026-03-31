type CreateElOptions = {
  text?: string;
  className?: string;
};

export function createEl(
  tag: string,
  options: CreateElOptions = {}
): HTMLElement {
  const element = document.createElement(tag);

  if (options.text !== undefined) {
    element.textContent = options.text;
  }

  if (options.className) {
    element.className = options.className;
  }

  return element;
}
type ButtonClick =
  | ((event?: MouseEvent) => void)
  | ((
      event?: MouseEvent,
      difficultyLevel?: 'easy' | 'medium' | 'hard' | 'undefined'
    ) => void);

export function createButton(
  text: string,
  onClick?: ButtonClick,
  className?: string,
  disabled: boolean = false
): HTMLButtonElement {
  const button = createEl('button', { text }) as HTMLButtonElement;
  button.type = 'button';
  button.disabled = disabled;

  if (className) button.className = className;

  if (onClick) {
    button.addEventListener('click', (event) => {
      if (onClick.length === 1) {
        (onClick as (event?: MouseEvent) => void)(event);
      } else {
        (
          onClick as (
            event?: MouseEvent,
            difficultyLevel?: 'easy' | 'medium' | 'hard' | 'undefined'
          ) => void
        )(event);
      }
    });
  }

  return button;
}

export function createLink(
  text: string,
  href: string,
  className?: string
): HTMLAnchorElement {
  const link = createEl('a') as HTMLAnchorElement;

  link.textContent = text;
  link.href = href;

  if (className) link.className = className;

  link.setAttribute('data-link', '');

  return link;
}
