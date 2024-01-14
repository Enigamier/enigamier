import { CollideEntityTypes } from '@/index'
import type { RectangleCollideEntity, TilesAtlas, TilesAnimationMap, PointCoords } from '@/index'
import { LootableAsset } from '../../../assets/Lootable'

import lootTilesetSrc from '../imgs/loot-tileset.png'

export class SproutFruitAsset extends LootableAsset {
  private static readonly atlas: TilesAtlas

  declare public readonly id: string

  public kind = 'fruit'

  protected tilesAnimationsMap: TilesAnimationMap = { default: { tiles: [1, 2, 3, 2], interval: 300 } }

  constructor(id: string, globalPos: PointCoords, size: number) {
    super(SproutFruitAsset.getAtlas(), globalPos, size)
    this.id = id
  }

  public get collideEntities(): RectangleCollideEntity[] {
    const { startX, startY, endX, endY } = this.globalCoords
    const size = this.texture.size.width
    return [
      {
        type: CollideEntityTypes.rectangle,
        kind: 'loot',
        data: {
          startX: startX + size * .2,
          startY: startY + size * .2,
          endX: endX - size * .2,
          endY: endY - size * .2,
        },
      },
    ]
  }

  private static getAtlas() {
    let atlas = SproutFruitAsset.atlas
    if (!atlas) {
      const doorAtlasImage = new Image()
      doorAtlasImage.src = lootTilesetSrc
      atlas = {
        cols: 3,
        rows: 1,
        image: doorAtlasImage,
        tileSize: 16,
      }
    }
    return atlas
  }
}
