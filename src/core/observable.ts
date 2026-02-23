import { EventEmitter } from './event-emitter';

/**
 * Реактивное значение Observable, которое автоматически оповещает подписчиков о своём изменении
 * @template T - тип хранимого значения
 */
export class Observable<T> extends EventEmitter<T> {
  /**
   * Текущее значение Observable
   */
  private currentValue: T;

  /**
   * Создает новое реактивное значение
   * @param initialValue - начальное значение
   */
  constructor(initialValue: T) {
    super();
    this.currentValue = initialValue;
  }

  /**
   * Получает текущее значение
   * @returns текущее значение
   */
  public get value(): T {
    return this.currentValue;
  }

  /**
   * Устанавливает новое значение и оповещает подписчиков
   * @param newValue - новое значение
   */
  public set(newValue: T): void {
    this.currentValue = newValue;
    this.emit(this.currentValue);
  }

  /**
   * Обновляет значение с помощью функции и оповещает подписчиков
   * @param callback - функция для преобразования значения
   */
  public update(callback: (value: T) => T): void {
    this.currentValue = callback(this.currentValue);
    this.emit(this.currentValue);
  }
}
