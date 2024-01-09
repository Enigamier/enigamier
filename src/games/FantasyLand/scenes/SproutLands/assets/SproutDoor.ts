import type { PointCoords, RectangleCollideEntity, TilesAnimationMap, TilesAtlas } from '@/index'
import { CollideEntityTypes } from '@/index'

import { DoorAsset } from '../../../assets/DoorAsset'

import doorTilesetImageSrc from '../imgs/door-tileset.png'

export class SproutDoorAsset extends DoorAsset {
  private static readonly atlas: TilesAtlas

  declare public readonly id: string

  protected tilesAnimationsMap: TilesAnimationMap = {
    opened: { tiles: [2] },
    closed: { tiles: [1] },
    open: { tiles: [1, 3, 2], interval: 200 },
    close: { tiles: [2, 3, 1], interval: 200 },
  }

  constructor(id: string, globalPos: PointCoords, size: number) {
    super(SproutDoorAsset.getAtlas(), globalPos, size)
    this.id = id
  }

  public get collideEntities(): RectangleCollideEntity[] {
    const { startY } = this.globalCoords
    return [
      {
        type: CollideEntityTypes.rectangle,
        kind: 'door',
        data: { ...this.globalCoords, startY: startY + (9 * this.tileSizeDelta) },
      },
      {
        type: CollideEntityTypes.rectangle,
        kind: 'door-zone',
        data: this.scope,
      },
    ]
  }

  private static getAtlas() {
    let atlas = SproutDoorAsset.atlas
    if (!atlas) {
      const doorAtlasImage = new Image()
      doorAtlasImage.src = doorTilesetImageSrc
      atlas = {
        cols: 1,
        rows: 3,
        image: doorAtlasImage,
        tileSize: 16,
      }
    }
    return atlas
  }
}
