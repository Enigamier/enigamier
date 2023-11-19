import { Controller } from './Controller'

interface Coordinates {
  x: number;
  y: number;
}
export interface MouseEventPayload extends Coordinates {
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
    const elem = event.target as HTMLCanvasElement
    const { button, type } = event
    const { x, y } = this.getRelativeCoords(event)
    if (type === 'mousedown') {
      this.inputs = { ...this.inputs, [button]: true }
    } else if (type === 'mouseup') {
      delete this.inputs[button]
    }
    this.fireEvent(type, { x, y, button, elem })
  }

  private onMouseMoveEvent(event: MouseEvent) {
    const { x, y } = this.getRelativeCoords(event)
    const elem = event.target as HTMLElement
    elem.style.cursor = ''
    this.fireEvent('mousemove', { x, y, elem })
  }

  private getRelativeCoords(event: MouseEvent): Coordinates {
    const elem = event.target as HTMLCanvasElement
    return {
      x: (elem.width / elem.offsetWidth) * event.offsetX,
      y: (elem.height / elem.offsetHeight) * event.offsetY,
    }
  }
}
