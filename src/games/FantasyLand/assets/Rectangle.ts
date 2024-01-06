import type {
  AssetContext,
  AssetMovement,
  CollisionInfo,
  KeyboardController,
  MouseController,
  MouseEventPayload,
} from '@/index'
import { HitboxAsset, Texture, solidCollisionResolution } from '@/index'

class RectangleTexture extends Texture {

  public size = { width: 100, height: 100 }

  public color = 'rgb(255, 0, 0)'

  public render(cxt: CanvasRenderingContext2D) {
    cxt.fillStyle = this.color
    cxt.fillRect(0, 0, this.size.width, this.size.height)
  }
}

interface RectangleMoveKeys {
  up: string;
  down: string;
  right: string;
  left: string;
}

export class RectangleAsset extends HitboxAsset {
  declare public texture: RectangleTexture

  public id = 'RectangleAsset'

  public movement: AssetMovement = { speed: 500, angle: 0 }

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
      const relativeY = 0 + (isUp ? 1 : 0) + (isDown ? -1 : 0)
      if (relativeX || relativeY) {
        this.movement.angle = Math.atan2(relativeY, relativeX)
        this.move(delta)
        this.fixToScope()
      }
    }
  }

  public onCollide({ source, target }: CollisionInfo): void {
    solidCollisionResolution(this, source, target)

    // const { r, g, b } = {
    //   r: Math.round(Math.random() * 255),
    //   g: Math.round(Math.random() * 255),
    //   b: Math.round(Math.random() * 255),
    // }
    // this.texture.color = `rgb(${r}, ${g}, ${b})`
  }

  private isCoordinateInset(x: number, y: number): boolean {
    const { startX, startY, endX, endY } = this.globalCoords
    return (
      (x >= startX && x <= endX) &&
      (y >= startY && y <= endY)
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