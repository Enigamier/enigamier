import type { TextureSize } from '@/index'
import { Asset, Texture } from '@/index'

import dogeImage from '../../../imgs/doge_disk49.png'

class DogeBallTexture extends Texture {
  public size: TextureSize = { width: 50, height: 50 }

  public rotation = 0

  private readonly img: HTMLImageElement

  constructor() {
    super()
    this.img = new Image()
    this.img.src = dogeImage
  }

  public render(ctx: CanvasRenderingContext2D) {
    super.render(ctx)
    const { size: { width, height }, img, rotation } = this
    const { x: centerX, y: centerY } = this.centerPoint
    const { x, y } = this.position
    const borderWidth = width / 50
    const borderColor = 'black'

    ctx.rotate(rotation)

    // Image
    ctx.drawImage(img, x, y, width, height)

    // Border
    ctx.beginPath()
    ctx.arc(centerX, centerY, (width - borderWidth) / 2, 0, Math.PI * 2, false)
    ctx.moveTo(width / -2, 0)
    ctx.strokeStyle = borderColor
    ctx.lineWidth = borderWidth
    ctx.stroke()
  }
}

export class DogeBallAsset extends Asset {
  declare public texture: DogeBallTexture

  public readonly id = 'DogeBall'

  constructor() {
    super(new DogeBallTexture())
  }

  public update(): void {

    // const relativeX = 0 + (isLeft ? -1 : 0) + (isRight ? 1 : 0)
    // const relativeY = 0 + (isUp ? -1 : 0) + (isDown ? 1 : 0)
    // if (relativeX || relativeY) {
    //   this.movement = {
    //     distance: this.moveSpeed * (delta / 1000),
    //     angle: Math.atan2(relativeY, relativeX),
    //   }
    //   this.move()
    //   this.fixToScope()
    // }
  }
}
