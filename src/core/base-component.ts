/**
 * Тип для допустимых HTML-тегов (ключи HTMLElementTagNameMap)
 */
type Tags = keyof HTMLElementTagNameMap;

/**
 * Конфигурационные свойства для компонента
 * @template T - тип HTML-тега
 */
export type ComponentProps<T extends Tags> = {
  tag?: T;
  className?: string[];
  text?: string;
  attrs?: Record<string, string | boolean>;
};

/**
 * Базовый компонент для создания DOM-элементов
 * @template T - тип HTML-тега (по умолчанию 'div')
 */
export class BaseComponent<T extends Tags = 'div'> {
  /**
   * DOM-элемент компонента
   */
  public readonly element: HTMLElementTagNameMap[T];

  /**
   * Дочерние компоненты
   */
  private children: BaseComponent<Tags>[] = [];

  /**
   * Создает новый компонент
   * @param props - конфигурационные свойства
   */
  constructor(props: ComponentProps<T> = {}) {
    this.element = document.createElement(
      props.tag ?? 'div'
    ) as HTMLElementTagNameMap[T];

    if (props.className?.length) {
      this.element.classList.add(...props.className);
    }

    if (props.text) {
      this.element.textContent = props.text;
    }

    if (props.attrs) {
      Object.entries(props.attrs).forEach(([key, value]) => {
        if (typeof value === 'boolean') {
          if (value) this.element.setAttribute(key, '');
        } else {
          this.element.setAttribute(key, value);
        }
      });
    }
  }

  /**
   * Добавляет дочерние компоненты
   * @param components - компоненты для добавления
   * @returns this для цепочки вызовов
   */
  public append(...components: BaseComponent<Tags>[]): this {
    components.forEach((component) => {
      this.element.append(component.element);
      this.children.push(component);
    });
    return this;
  }

  /**
   * Показывает элемент (убирает display: none)
   * @returns this для цепочки вызовов
   */
  public show(): this {
    this.element.style.display = '';
    return this;
  }

  /**
   * Скрывает элемент (устанавливает display: none)
   * @returns this для цепочки вызовов
   */
  public hide(): this {
    this.element.style.display = 'none';
    return this;
  }

  /**
   * Удаляет элемент и все его дочерние компоненты из DOM
   */
  public remove(): void {
    this.children.forEach((child) => child.remove());
    this.element.remove();
  }

  /**
   * Очищает все дочерние компоненты
   */
  public clear(): void {
    this.children.forEach((child) => child.remove());
    this.children = [];
  }

  /**
   * Добавляет обработчик события к элементу
   * @template K - тип события
   * @param event - тип события
   * @param handler - обработчик события
   * @param options - опции добавления обработчика
   */
  public addEventListener<K extends keyof HTMLElementEventMap>(
    event: K,
    handler: (event: HTMLElementEventMap[K]) => void,
    options?: AddEventListenerOptions
  ): void {
    this.element.addEventListener(event, handler as EventListener, options);
  }

  /**
   * Удаляет обработчик события с элемента
   * @template K - тип события
   * @param event - тип события
   * @param handler - обработчик события
   * @param options - опции удаления обработчика
   */
  public removeEventListeners<K extends keyof HTMLElementEventMap>(
    event: K,
    handler: (event: HTMLElementEventMap[K]) => void,
    options?: AddEventListenerOptions
  ): void {
    this.element.removeEventListener(event, handler as EventListener, options);
  }
}
