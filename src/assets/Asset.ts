import type { GlobalController, Texture } from '@/index'

export interface AssetContext {
  gc: GlobalController;
}

export interface AssetMovement {
  angle: number;
  distance: number;
}

export interface AssetCoords {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export abstract class Asset {
  public abstract readonly id: string

  public texture: Texture

  protected movement: AssetMovement = { angle: 0, distance: 0 }

  protected context!: AssetContext

  protected abortController!: AbortController

  constructor(texture: Texture) {
    this.texture = texture
  }

  public get globalCoords(): AssetCoords {
    const { scope: { startX, startY }, position: { x, y }, size: { width, height } } = this.texture
    return {
      startX: startX + x,
      startY: startY + y,
      endX: startX + x + width,
      endY: startY + y + height,
    }
  }

  public load(context: AssetContext) {
    this.context = context
    this.abortController = new AbortController()
  }

  public unload() {
    this.abortController.abort()
  }

  public abstract update(): void

  protected move() {
    const { angle, distance } = this.movement
    if (distance > 0) {
      const { x, y } = this.texture.position
      this.texture.position = {
        x: x + Math.round(Math.cos(angle) * distance),
        y: y + Math.round(Math.sin(angle) * distance),
      }
    }
  }

  protected fixToScope() {
    const { x, y } = this.texture.position
    const { width, height } = this.texture.size
    const { startX, startY, endX, endY } = this.texture.scope
    this.texture.position = {
      x: Math.max(Math.min(x, endX! - width - startX), 0),
      y: Math.max(Math.min(y, endY! - height - startY), 0),
    }
  }
}
