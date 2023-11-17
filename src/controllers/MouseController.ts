import { Controller } from './Controller'

export interface MouseEventPayload {
  button: number;
  x: number;
  y: number;
}

export class MouseController extends Controller<MouseEvent, MouseEventPayload> {
  public readonly id: string = 'mouse'

  public inputs: Record<number, true> = {}

  public install(element: HTMLCanvasElement) {
    const callback = this.onMouseEvent.bind(this)
    return [
      { element, event: 'mousedown', callback },
      { element, event: 'mouseup', callback },
      { element, event: 'click', callback },
      { element, event: 'contextmenu', callback: () => false },
    ]
  }

  private onMouseEvent(event: MouseEvent) {
    const { button, type } = event
    if (type === 'mousedown') {
      this.inputs = { ...this.inputs, [button]: true }
    } else if (type === 'mouseup') {
      delete this.inputs[button]
    }
    this.fireEvent(type, {
      button,
      x: event.offsetX,
      y: event.offsetY,
    })
  }
}
