import type { ButtonAssetClickCallback } from '@/index'
import { ButtonAsset, Texture } from '@/index'

class ButtonTexture extends Texture {

  public size = { width: 100, height: 50 }

  public color = 'yellow'

  public render(cxt: CanvasRenderingContext2D) {
    super.render(cxt)
    cxt.fillStyle = this.color
    cxt.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
  }
}

export class Button extends ButtonAsset {
  declare public readonly id

  declare public texture: ButtonTexture

  constructor(x: number, y: number, callback: ButtonAssetClickCallback, id = `Button-${performance.now()}`) {
    super(new ButtonTexture(), callback)
    this.id = id
    this.texture.scope = {
      startX: x,
      startY: y,
      endX: this.texture.size.width,
      endY: this.texture.size.height,
    }
  }

  public update(): void {
    this.texture.color = 'yellow'
    if (!this.isDisabled && this.isHover) {
      this.texture.color = 'orange'
    }
    if (this.isActive) {
      this.texture.color = 'red'
    }
  }
}
