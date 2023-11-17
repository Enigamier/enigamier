import type { AssetContext, KeyboardController, MouseController, MouseEventPayload } from '@/index'
import { Asset, Texture } from '@/index'

class RectangleTexture extends Texture {

  public size = { width: 100, height: 100 }

  public color = 'rgb(255, 0, 0)'

  public render(cxt: CanvasRenderingContext2D) {
    cxt.fillStyle = this.color
    cxt.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
  }
}

export class RectangleAsset extends Asset {
  public readonly id = 'RectangleAsset'

  private moveSpeed = 6

  private readonly kbController: KeyboardController

  declare public texture: RectangleTexture

  constructor(context: AssetContext) {
    super(context, new RectangleTexture())
    this.kbController = context.gc.controllers.keyboard as KeyboardController
    const mouseController = context.gc.controllers.mouse as MouseController
    mouseController.addEventListener('click', this.onCanvasClick.bind(this))
  }

  public update(): void {
    const { x, y } = this.texture.position
    const areArrowsPressed = Object.keys(this.kbController.inputs).filter(key => key.startsWith('Arrow')).length > 0

    if (areArrowsPressed) {
      const newX =
        x +
        (this.kbController.inputs.ArrowLeft ? -this.moveSpeed : 0) +
        (this.kbController.inputs.ArrowRight ? this.moveSpeed : 0)
      const newY =
        y +
        (this.kbController.inputs.ArrowUp ? -this.moveSpeed : 0) +
        (this.kbController.inputs.ArrowDown ? this.moveSpeed : 0)
      this.texture.position = {
        x: Math.min(Math.max(newX, 0), 1000),
        y: Math.min(Math.max(newY, 0), 600),
      }
    }
  }

  private isCoordinateInset(x: number, y: number): boolean {
    const { position, size } = this.texture
    return (
      (x >= position.x && x <= position.x + size.width) &&
      (y >= position.y && y <= position.y + size.height)
    )
  }

  private onCanvasClick({ x, y, button }: MouseEventPayload) {
    if (button === 0 && this.isCoordinateInset(x, y)) {
      const { r, g, b } = {
        r: Math.round(Math.random() * 255),
        g: Math.round(Math.random() * 255),
        b: Math.round(Math.random() * 255),
      }
      this.texture.color = `rgb(${r}, ${g}, ${b})`
    }
  }
}
