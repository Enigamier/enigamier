import type { PointCoords, RectangleCollideEntity, TilesAnimationMap, TilesAtlas } from '@/index'
import { CollideEntityTypes, TileObjectAsset } from '@/index'

import treeTilesetImageSrc from '../imgs/tree-tileset.png'

export class SproutTreeAsset extends TileObjectAsset {
  private static readonly atlas: TilesAtlas

  declare public readonly id: string

  protected tilesAnimationsMap: TilesAnimationMap = {
    fallen: { tiles: [1] },
    falling: { tiles: [6, 5, 4, 3, 2], interval: 200 },
    empty: { tiles: [6] },
    full: { tiles: [7] },
  }

  protected tilesAnimationId = 'full'

  constructor(id: string, { x, y }: PointCoords, size: number) {
    super(SproutTreeAsset.getAtlas())
    this.id = id
    this.texture.size = { width: size, height: size }
    this.scope = { startX: x, startY: y, endX: x + size, endY: y + size }
  }

  public get collideEntities(): RectangleCollideEntity[] {
    const { startX, endX, endY } = this.scope
    const size = this.texture.size.height
    const type = CollideEntityTypes.rectangle
    const startY = endY - (size / 8)
    const entities: RectangleCollideEntity[] = [
      {
        type: type,
        kind: 'wall',
        data: {
          startX: this.tilesAnimationId.startsWith('fall') ? startX + size * .2 : startX + size * .7,
          startY,
          endX: this.tilesAnimationId.startsWith('fall') ? endX - size * .375 : endX - size * .2,
          endY,
        },
      },
    ]
    if (!this.tilesAnimationId.startsWith('fall')) {
      entities.push({
        type,
        kind: 'tree',
        collideWith: ['hero-action-axe', ...(this.tilesAnimationId === 'full' ? ['hero-action-use'] : [])],
        data: { startX: startX + size * .7, startY, endX: endX - size * .2, endY },
      })
    }
    return entities
  }

  public use(): boolean {
    const isFull = this.tilesAnimationId === 'full'
    if (isFull) {
      this.setTilesAnimation('empty')
    }
    return isFull
  }

  public chop() {
    this.setTilesAnimation('falling')
  }

  protected onTilesAnimationEnds(): void {
    if (this.tilesAnimationId === 'falling') {
      this.setTilesAnimation('fallen')
      this.fireEvent('felled')
    }
  }

  private static getAtlas() {
    let atlas = SproutTreeAsset.atlas
    if (!atlas) {
      const treeAtlasImage = new Image()
      treeAtlasImage.src = treeTilesetImageSrc
      atlas = {
        cols: 7,
        rows: 1,
        image: treeAtlasImage,
        tileSize: 64,
      }
    }
    return atlas
  }
}
