import { Controller } from './Controller'

export interface MouseEventPayload {
  x: number;
  y: number;
  elem: HTMLElement;
  button?: number;
}

export class MouseController extends Controller<MouseEvent, MouseEventPayload> {
  public readonly id: string = 'mouse'

  public inputs: Record<number, true> = {}

  public install(element: HTMLCanvasElement) {
    const buttonCallback = this.onMouseButtonEvent.bind(this)
    const moveCallback = this.onMouseMoveEvent.bind(this)
    return [
      { element, event: 'mousedown', callback: buttonCallback },
      { element, event: 'mouseup', callback: buttonCallback },
      { element, event: 'click', callback: buttonCallback },
      { element, event: 'mousemove', callback: moveCallback },
      { element, event: 'contextmenu', callback: () => false },
    ]
  }

  private onMouseButtonEvent(event: MouseEvent) {
    const { button, type } = event
    if (type === 'mousedown') {
      this.inputs = { ...this.inputs, [button]: true }
    } else if (type === 'mouseup') {
      delete this.inputs[button]
    }
    this.fireEvent(type, {
      x: event.offsetX,
      y: event.offsetY,
      button,
      elem: event.target as HTMLElement,
    })
  }

  private onMouseMoveEvent(event: MouseEvent) {
    const { offsetX, offsetY } = event
    const elem = event.target as HTMLElement
    elem.style.cursor = ''
    this.fireEvent('mousemove', {
      x: offsetX,
      y: offsetY,
      elem,
    })
  }
}
