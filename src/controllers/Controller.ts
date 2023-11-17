type EventCallback<T> = (payload: T) => void
export interface GlobalListenerInfo<T> {
  event: string;
  element: HTMLElement;
  callback(event: T): void;
}

export abstract class Controller<T = unknown, D = unknown> {
  public abstract readonly id: string

  public inputs: Record<string, unknown> = {}

  private listeners: Record<string, EventCallback<D>[]> = {}

  public abstract install(canvas?: HTMLCanvasElement): GlobalListenerInfo<T>[]

  public addEventListener(eventId: string, callback: EventCallback<D>, signal?: AbortSignal) {
    this.listeners[eventId] = this.listeners[eventId] || []
    this.listeners[eventId].push(callback)
    if (signal) {
      signal.addEventListener('abort', () => this.removeEventListener(eventId, callback))
    }
  }

  public removeEventListener(eventId: string, callbackToRemove: EventCallback<D>) {
    this.listeners[eventId] = this.listeners[eventId].filter(callback => callback === callbackToRemove)
  }

  protected fireEvent(eventId: string, payload: D) {
    this.listeners[eventId]?.forEach(cb => cb(payload))
  }
}
