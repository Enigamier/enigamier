import type { RectCoords, RectSize, PointCoords } from '@/utils/coords'

export abstract class Texture {
  public index = 0

  public position: PointCoords = { x: 0, y: 0 }

  public size: RectSize = { width: 0, height: 0 }

  public scope: RectCoords = { startX: 0, startY: 0, endX: 0, endY: 0 }

  public get centerPoint(): PointCoords {
    const { position: { x, y }, size: { width, height } } = this
    return { x: x + width / 2, y: y + height / 2 }
  }

  public render(ctx: CanvasRenderingContext2D) {
    const { startX, startY } = this.scope
    ctx.translate(startX, startY)
  }
}
