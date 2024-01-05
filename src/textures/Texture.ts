import type { RectSize, PointCoords } from '@/utils/coords'

export abstract class Texture {
  public size: RectSize = { width: 0, height: 0 }

  public get centerPoint(): PointCoords {
    const { size: { width, height } } = this
    return { x: Math.round(width / 2), y: Math.round(height / 2) }
  }

  public abstract render(ctx: CanvasRenderingContext2D): void
}
