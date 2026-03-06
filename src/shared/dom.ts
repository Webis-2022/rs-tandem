export function createElement(
  tag: string,
  text?: string,
  className?: string
): HTMLElement {
  const element = document.createElement(tag);

  if (text !== undefined) {
    element.textContent = text;
  }

  if (className) {
    element.className = className;
  }

  return element;
}

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

export function createButton(
  text: string,
  onClick?: (event: MouseEvent) => void,
  className?: string,
  disabled: boolean = false
): HTMLButtonElement {
  const button = document.createElement('button');

  button.type = 'button';
  button.textContent = text;
  button.disabled = disabled;

  if (className) button.className = className;
  if (onClick) button.addEventListener('click', onClick);

  return button;
}

export function createLink(
  text: string,
  href: string,
  className?: string
): HTMLAnchorElement {
  const link = document.createElement('a');

  link.textContent = text;
  link.href = href;

  if (className) link.className = className;

  link.setAttribute('data-link', '');

  return link;
}
