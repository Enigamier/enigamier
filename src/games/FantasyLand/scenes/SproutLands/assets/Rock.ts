import type { PointCoords, RectangleCollideEntity, TilesAnimationMap, TilesAtlas } from '@/index'
import { CollideEntityTypes, TileObjectAsset } from '@/index'

import terrainTilesetImageSrc from '../imgs/terrain-tileset.png'

const startTile = 373

export class SproutRockAsset extends TileObjectAsset {
  private static readonly atlas: TilesAtlas

  declare public readonly id: string

  protected tilesAnimationsMap: TilesAnimationMap = {
    full: { tiles: [startTile + 1] },
    empty: { tiles: [startTile] },
  }

  protected tilesAnimationId = 'full'

  constructor(id: string, { x, y }: PointCoords, size: number) {
    super(SproutRockAsset.getAtlas())
    this.id = id
    this.texture.size = { width: size, height: size }
    this.scope = { startX: x, startY: y, endX: x + size, endY: y + size }
  }

  public get collideEntities(): RectangleCollideEntity[] {
    const { startX, startY, endX, endY } = this.scope
    const size = this.texture.size.width
    const data = {
      startX: startX + size * (this.tilesAnimationId === 'full' ? .05 : .2),
      startY: startY + size * .2,
      endX: endX - size * (this.tilesAnimationId === 'full' ? .05 : .3),
      endY: endY - size * (this.tilesAnimationId === 'full' ? .1 : .35),
    }
    const entities = [{ type: CollideEntityTypes.rectangle, kind: 'wall', data }]
    if (this.tilesAnimationId === 'full') {
      entities.push({ type: CollideEntityTypes.rectangle, kind: 'rock', data })
    }
    return entities
  }

  public use() {
    if (this.tilesAnimationId === 'full') {
      this.setTilesAnimation('empty')
    }
  }

  private static getAtlas() {
    let atlas = SproutRockAsset.atlas
    if (!atlas) {
      const rockAtlasImage = new Image()
      rockAtlasImage.src = terrainTilesetImageSrc
      atlas = {
        cols: 22,
        rows: 19,
        image: rockAtlasImage,
        tileSize: 16,
      }
    }
    return atlas
  }
}
