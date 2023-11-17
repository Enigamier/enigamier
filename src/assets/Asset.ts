import type { GlobalController, Texture } from '@/index'

export interface AssetContext {
  gc: GlobalController;
}

export abstract class Asset {
  public abstract readonly id: string

  public texture: Texture

  protected context!: AssetContext

  protected abortController!: AbortController

  constructor(texture: Texture) {
    this.texture = texture
  }

  public load(context: AssetContext) {
    this.context = context
    this.abortController = new AbortController()
  }

  public unload() {
    this.abortController.abort()
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

  public abstract update(): void
}
