import type { GlobalController, Texture } from '@/index'

export interface AssetContext {
  gc: GlobalController;
}

export abstract class Asset {
  public abstract readonly id: string

  public texture: Texture

  protected context: AssetContext

  constructor(context: AssetContext, texture: Texture) {
    this.context = context
    this.texture = texture
  }

  public load?(): void

  public unload?(): void

  public abstract update(): void
}
