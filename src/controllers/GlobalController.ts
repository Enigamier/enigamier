import { KeyboardController, MouseController } from '@/index'
import { Controller } from './Controller'

export class GlobalController {
  public controllers: Record<string, Controller> = {}

  private readonly canvas: HTMLCanvasElement

  private readonly abortController: AbortController = new AbortController()

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
  }

  public get abortSignal() {
    return this.abortController.signal
  }

  public init() {
    this.installController(new KeyboardController())
    this.installController(new MouseController())
  }

  public shutdown() {
    this.abortController.abort()
  }

  public installController<T = Controller>(controller: T) {
    if (controller instanceof Controller && !this.controllers[controller.id]) {
      this.controllers[controller.id] = controller
      const listeners = controller.install(this.canvas)
      listeners.forEach(({ event, callback, element }) => {
        this.registerListener(element, event, callback)
      })
    }
  }

  private registerListener(element: HTMLElement, event: string, callback: (event: Event) => void) {
    element.addEventListener(
      event,
      ev => {
        ev.preventDefault()
        callback(ev)
      },
      { passive: false, signal: this.abortController.signal },
    )
  }
}
