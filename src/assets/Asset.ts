import type { GlobalController, Texture } from '@/index'

export interface AssetContext {
  gc: GlobalController;
}

export interface AssetMovement {
  angle: number;
  speed: number;
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

  public movement: AssetMovement = { angle: 0, speed: 0 }

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

  public update?(delta: number): void

  protected move(delta: number) {
    const { angle, speed } = this.movement
    if (speed > 0) {
      const { x, y } = this.texture.position
      const distance = speed * (delta / 1000)
      this.texture.position = {
        x: x + Math.cos(angle) * distance,
        y: y - Math.sin(angle) * distance,
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
