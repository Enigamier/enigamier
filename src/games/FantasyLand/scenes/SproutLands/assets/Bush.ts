import type { PointCoords, RectangleCollideEntity, TilesAnimationMap, TilesAtlas } from '@/index'
import { CollideEntityTypes, TileObjectAsset } from '@/index'

import terrainTilesetImageSrc from '../imgs/terrain-tileset.png'

const startTile = 362

export class SproutBushAsset extends TileObjectAsset {
  private static readonly atlas: TilesAtlas

  declare public readonly id: string

  protected tilesAnimationsMap: TilesAnimationMap = {
    full: { tiles: [startTile] },
    empty: { tiles: [startTile + 1] },
  }

  protected tilesAnimationId = 'full'

  constructor(id: string, { x, y }: PointCoords, size: number) {
    super(SproutBushAsset.getAtlas())
    this.id = id
    this.texture.size = { width: size, height: size }
    this.scope = { startX: x, startY: y, endX: x + size, endY: y + size }
  }

  public get collideEntities(): RectangleCollideEntity[] {
    const data = {
      ...this.scope,
      startY: this.scope.startY + this.texture.size.width * .2,
    }
    const entities = [{ type: CollideEntityTypes.rectangle, kind: 'wall', data }]
    if (this.tilesAnimationId === 'full') {
      entities.push({ type: CollideEntityTypes.rectangle, kind: 'bush', data })
    }
    return entities
  }

  public use() {
    if (this.tilesAnimationId === 'full') {
      this.setTilesAnimation('empty')
    }
  }

  private static getAtlas() {
    let atlas = SproutBushAsset.atlas
    if (!atlas) {
      const bushAtlasImage = new Image()
      bushAtlasImage.src = terrainTilesetImageSrc
      atlas = {
        cols: 22,
        rows: 19,
        image: bushAtlasImage,
        tileSize: 16,
      }
    }
    return atlas
  }
}
