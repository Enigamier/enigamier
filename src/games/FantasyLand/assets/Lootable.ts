import type { PointCoords, RectangleCollideEntity, TilesAtlas } from '@/index'
import { CollideEntityTypes, TileObjectAsset } from '@/index'

export abstract class LootableAsset extends TileObjectAsset {
  public abstract kind: string

  constructor(atlas: TilesAtlas, { x, y }: PointCoords, size: number) {
    super(atlas)
    this.texture.size = { width: size, height: size }
    this.scope = { startX: x, startY: y, endX: x + size, endY: y + size }
  }

  public get collideEntities(): RectangleCollideEntity[] {
    const type = CollideEntityTypes.rectangle
    const entities = [{ type, kind: 'loot', data: this.scope }]
    return entities
  }
}
