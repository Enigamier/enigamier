import type { AssetContext, KeyboardController, MouseController, MouseEventPayload } from '@/index'
import { CollidableAsset, Texture } from '@/index'

class RectangleTexture extends Texture {

  public size = { width: 100, height: 100 }

  public color = 'rgb(255, 0, 0)'

  public render(cxt: CanvasRenderingContext2D) {
    super.render(cxt)
    cxt.fillStyle = this.color
    cxt.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
  }
}

interface RectangleMoveKeys {
  up: string;
  down: string;
  right: string;
  left: string;
}

export class RectangleAsset extends CollidableAsset {
  declare public texture: RectangleTexture

  public id = 'RectangleAsset'

  private readonly moveSpeed = 500 // per second

  private kbController!: KeyboardController

  private readonly moveKeys: RectangleMoveKeys

  constructor(moveKeys: RectangleMoveKeys) {
    super(new RectangleTexture())
    this.moveKeys = moveKeys
  }

  private get moveKeysCodesMap() {
    return Object.values(this.moveKeys).reduce((codesMap, keyCode) => ({ ...codesMap, [keyCode]: true }), {})
  }

  public load(context: AssetContext): void {
    super.load(context)
    this.kbController = context.gc.controllers.keyboard as KeyboardController
    const mouseController = context.gc.controllers.mouse as MouseController
    mouseController.addEventListener('click', this.onCanvasClick.bind(this), this.abortController.signal)
  }

  public update(delta: number): void {
    const areArrowsPressed = Object.keys(this.kbController.inputs).some(key => this.moveKeysCodesMap[key])

    if (areArrowsPressed) {
      const { up, down, left, right } = this.moveKeys
      const { [up]: isUp, [down]: isDown, [left]: isLeft, [right]: isRight } = this.kbController.inputs
      const relativeX = 0 + (isLeft ? -1 : 0) + (isRight ? 1 : 0)
      const relativeY = 0 + (isUp ? -1 : 0) + (isDown ? 1 : 0)
      if (relativeX || relativeY) {
        this.movement = {
          distance: this.moveSpeed * (delta / 1000),
          angle: Math.atan2(relativeY, relativeX),
        }
        this.move()
        this.fixToScope()
      }
    } else {
      this.movement.distance = 0
    }
  }

  public onCollide(): void {
    const { r, g, b } = {
      r: Math.round(Math.random() * 255),
      g: Math.round(Math.random() * 255),
      b: Math.round(Math.random() * 255),
    }
    this.texture.color = `rgb(${r}, ${g}, ${b})`
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
