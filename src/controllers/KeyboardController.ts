import { Controller } from './Controller'

export class KeyboardController extends Controller<KeyboardEvent, string> {
  public readonly id: string = 'keyboard'

  public inputs: Record<string, true> = {}

  public install() {
    const callback = this.onKeyEvent.bind(this)
    const element = document.body
    return [
      { element, event: 'keydown', callback },
      { element, event: 'keyup', callback },
    ]
  }

  private onKeyEvent(event: KeyboardEvent) {
    if (event.type === 'keydown') {
      this.inputs = { ...this.inputs, [event.key]: true }
    } else {
      delete this.inputs[event.key]
    }
    this.fireEvent(event.type, event.key)
  }
}
