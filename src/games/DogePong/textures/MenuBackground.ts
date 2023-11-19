import { Texture } from '@/index'

import dogeImage from '../imgs/doge_disk.png'

export class MenuBackgroundTexture extends Texture {
  private readonly img: HTMLImageElement

  constructor() {
    super()
    this.img = new Image()
    this.img.src = dogeImage
  }

  public render(cxt: CanvasRenderingContext2D): void {
    const { position: { x, y }, size: { width, height } } = this
    const { x: centerX, y: centerY } = this.centerPoint
    const fillGrad = cxt.createLinearGradient(0, 0, 0, height)
    const imgSize = width * (45 / 100)
    fillGrad.addColorStop(0, '#f2f2f2')
    fillGrad.addColorStop(1, '#e2e2e2')
    cxt.fillStyle = fillGrad
    cxt.fillRect(x, y, width, height)

    cxt.drawImage(this.img, centerX - (imgSize / 2), centerY - (imgSize / 2), imgSize, imgSize)
  }
}
