import { Texture } from '@/textures/Texture'

export abstract class Asset {
  public id: string

  public texture: Texture

  constructor(id: string, texture: Texture) {
    this.id = id
    this.texture = texture
  }

  public abstract update(): void
}
