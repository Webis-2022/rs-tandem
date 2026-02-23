/**
 * Тип функции-обработчика событий
 */
type Listener<T> = (value: T) => void;

/**
 * Реализация паттерна Наблюдатель (Observer)
 * @template T - тип передаваемого значения
 */
export class EventEmitter<T> {
  /**
   * Коллекция подписчиков на события
   */
  protected listeners: Set<Listener<T>> = new Set();

  /**
   * Отправляет событие всем подписчикам
   * @param value - значение для передачи подписчикам
   */
  public emit(value: T): void {
    this.listeners.forEach((listener) => listener(value));
  }

  /**
   * Подписывает обработчик на события
   * @param listener - функция-обработчик
   * @returns функция для отписки
   */
  public subscribe(listener: Listener<T>): () => void {
    this.listeners.add(listener);
    return this.unsubscribe.bind(this, listener);
  }

  /**
   * Отписывает обработчик от событий
   * @param callback - функция-обработчик для удаления
   */
  public unsubscribe(callback: Listener<T>): void {
    this.listeners.delete(callback);
  }
}
