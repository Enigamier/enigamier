import { CollideEntityTypes } from '@/index'
import type { RectangleCollideEntity, TilesAtlas, TilesAnimationMap, PointCoords } from '@/index'
import { LootableAsset } from '../../../assets/Lootable'

import lootTilesetSrc from '../imgs/loot-tileset.png'

function getTilesAnimations(kind: string): TilesAnimationMap {
  const index = looteables.indexOf(kind)
  const first = (index * atlasColsCount) + 1

  return { [kind]: { tiles: [first, first + 1, first + 2, first + 1], interval: 300 } }
}

const looteables = ['fruit', 'can', 'rock', 'axe', 'pickaxe', 'wood', 'grain', 'heart']
const atlasColsCount = 3
let lootNextId = 0

export class SproutLootAsset extends LootableAsset {
  private static readonly atlas: TilesAtlas

  declare public readonly id: string

  public readonly kind: string

  protected readonly tilesAnimationsMap: TilesAnimationMap

  constructor(kind: string, globalPos: PointCoords, size: number) {
    super(SproutLootAsset.getAtlas(), globalPos, size)
    this.id = `loot-${lootNextId++}`
    this.kind = kind
    this.tilesAnimationsMap = getTilesAnimations(kind)
    this.setTilesAnimation(kind)
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
    let atlas = SproutLootAsset.atlas
    if (!atlas) {
      const lootAtlasImage = new Image()
      lootAtlasImage.src = lootTilesetSrc
      atlas = {
        cols: atlasColsCount,
        rows: 8,
        image: lootAtlasImage,
        tileSize: 16,
      }
    }
    return atlas
  }
}
