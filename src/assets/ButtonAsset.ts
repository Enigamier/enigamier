import type { AssetContext, MouseController, MouseEventPayload, Texture } from '@/index'
import { Asset } from '@/index'

export type ButtonAssetClickCallback = () => void

export abstract class ButtonAsset extends Asset {
  public isDisabled = false

  protected isHover = false

  protected isActive = false

  private mouseController!: MouseController

  constructor(texture: Texture, callback: ButtonAssetClickCallback) {
    super(texture)
    this.onClick = callback
  }

  public load(context: AssetContext): void {
    super.load(context)
    this.mouseController = context.gc.controllers.mouse as MouseController
    this.mouseController.addEventListener('mousedown', this.onCanvasMouseDown.bind(this), this.abortController.signal)
    this.mouseController.addEventListener('mouseup', this.onCanvasMouseUp.bind(this), this.abortController.signal)
    this.mouseController.addEventListener('mousemove', this.onCanvasMouseMove.bind(this), this.abortController.signal)
  }

  private readonly onClick: ButtonAssetClickCallback

  private isPointInside(pointX: number, pointY: number): boolean {
    const { startX, startY, endX, endY } = this.globalCoords
    return (
      (pointX >= startX && pointX <= endX) &&
      (pointY >= startY && pointY <= endY)
    )
  }

  private onCanvasMouseMove({ x, y, elem }: MouseEventPayload) {
    const isInset = this.isPointInside(x, y)
    this.isHover = isInset
    if (isInset) {
      elem.style.cursor = this.isDisabled ? 'not-allowed' : 'pointer'
    }
  }

  private onCanvasMouseDown({ x, y, button }: MouseEventPayload) {
    if (!this.isDisabled && button === 0 && this.isPointInside(x, y)) {
      this.isActive = true
    }
  }

  private onCanvasMouseUp({ button, x, y }: MouseEventPayload) {
    if (!this.isDisabled && button === 0) {
      if (this.isActive && this.isPointInside(x, y)) {
        this.onClick && this.onClick()
      }
      this.isActive = false
    }
  }
}
