import type { PointCoords, RectangleCollideEntity, TilesAnimationMap, TilesAtlas } from '@/index'
import { CollideEntityTypes, TileObjectAsset } from '@/index'

import grainTilesetImageSrc from '../imgs/grain-tileset.png'

export class SproutGrainAsset extends TileObjectAsset {
  private static readonly atlas: TilesAtlas

  declare public readonly id: string

  protected tilesAnimationsMap: TilesAnimationMap = {
    empty: { tiles: [1] },
    basic: { tiles: [2] },
    medium: { tiles: [3] },
    full: { tiles: [4] },
  }

  protected tilesAnimationId = 'basic'

  constructor(id: string, { x, y }: PointCoords, size: number) {
    super(SproutGrainAsset.getAtlas())
    this.id = id
    this.texture.size = { width: size, height: size }
    this.scope = { startX: x, startY: y, endX: x + size, endY: y + size }
  }

  public get collideEntities(): RectangleCollideEntity[] {
    const entities = []
    if (this.tilesAnimationId !== 'empty') {
      const kind = this.tilesAnimationId !== 'full' ? 'grain-plant' : 'grain'
      entities.push({ type: CollideEntityTypes.rectangle, kind, data: this.scope })
    }
    return entities
  }

  public use() {
    if (this.tilesAnimationId !== 'empty') {
      if (this.tilesAnimationId === 'full') {
        this.setTilesAnimation('empty')
        this.fireEvent('loot')
      } else {
        this.setTilesAnimation(this.tilesAnimationId === 'basic' ? 'medium' : 'full')
      }
    }
  }

  private static getAtlas() {
    let atlas = SproutGrainAsset.atlas
    if (!atlas) {
      const grainAtlasImage = new Image()
      grainAtlasImage.src = grainTilesetImageSrc
      atlas = {
        cols: 4,
        rows: 1,
        image: grainAtlasImage,
        tileSize: 16,
      }
    }
    return atlas
  }
}
