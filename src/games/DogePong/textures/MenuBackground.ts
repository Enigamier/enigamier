import type { PointCoords } from '@/index'
import { Texture } from '@/index'

import dogeImage from '../imgs/doge_disk.png'

export class MenuBackgroundTexture extends Texture {
  private readonly img: HTMLImageElement

  public dogeRotation = 0

  public dogeSize = .45

  public dogeOffset: PointCoords = {
    x: 0,
    y: 0,
  }

  constructor() {
    super()
    this.img = new Image()
    this.img.src = dogeImage
  }

  public render(ctx: CanvasRenderingContext2D): void {
    const { width, height } = this.size
    const { x: centerX, y: centerY } = this.centerPoint
    const fillGrad = ctx.createLinearGradient(0, 0, 0, height)
    const imgSize = width * this.dogeSize
    fillGrad.addColorStop(0, '#f2f2f2')
    fillGrad.addColorStop(1, '#e2e2e2')
    ctx.fillStyle = fillGrad
    ctx.fillRect(0, 0, width, height)

    ctx.translate(centerX + this.dogeOffset.x * width, centerY + this.dogeOffset.y * height)
    ctx.rotate(this.dogeRotation)
    ctx.drawImage(this.img, -imgSize / 2, -imgSize / 2, imgSize, imgSize)
  }
}
