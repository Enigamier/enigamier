import { Texture } from '@/index'

export class BackgroundTexture extends Texture {
  public render(cxt: CanvasRenderingContext2D): void {
    const { position: { x, y }, size: { width, height } } = this
    const fill_grad = cxt.createLinearGradient(0, 0, 0, height)
    fill_grad.addColorStop(0, '#f2f2f2')
    fill_grad.addColorStop(1, '#e2e2e2')
    cxt.fillStyle = fill_grad
    cxt.fillRect(x, y, width, height)
  }
}
