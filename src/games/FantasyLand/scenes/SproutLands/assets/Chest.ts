import type { PointCoords, RectangleCollideEntity, TilesAnimationMap, TilesAtlas } from '@/index'
import { CollideEntityTypes, TileObjectAsset } from '@/index'

import chestTilesetImageSrc from '../imgs/chest-tileset.png'

function getTilesAnimations(dir = 'front'): TilesAnimationMap {
  const first = dir === 'front' ? 1 : 6
  const flip = dir === 'right'
  return {
    opened: { tiles: [first + 4], flip },
    closed: { tiles: [first], flip },
    open: { tiles: [first, first + 1, first + 2, first + 3, first + 4], flip, interval: 200 },
    close: { tiles: [first + 4, first + 3, first + 2, first + 1, first], flip, interval: 200 },
  }
}

export class SproutChestAsset extends TileObjectAsset {
  private static readonly atlas: TilesAtlas

  declare public readonly id: string

  public loot: string[] = []

  protected tilesAnimationsMap: TilesAnimationMap = getTilesAnimations('front')

  protected tilesAnimationId = 'closed'

  private dir = 'front'

  constructor(id: string, { x, y }: PointCoords, size: number) {
    super(SproutChestAsset.getAtlas())
    this.id = id
    this.texture.size = { width: size, height: size }
    const offset = Math.round(size / 3)
    this.scope = {
      startX: x + offset,
      startY: y + offset,
      endX: x + size - offset,
      endY: y + size - offset,
    }
    this.position = { x: -offset, y: -offset }
  }

  public get direction(): string {
    return this.dir
  }

  public get collideEntities(): RectangleCollideEntity[] {
    return [
      { type: CollideEntityTypes.rectangle, kind: 'wall', data: this.scope },
      { type: CollideEntityTypes.rectangle, kind: 'chest', data: this.scope },
    ]
  }

  public update(delta: number): void {
    super.update(delta)
  }

  public use() {
    if (this.tilesAnimationId === 'closed') {
      this.setTilesAnimation('open')
    } else if (this.tilesAnimationId === 'opened') {
      this.setTilesAnimation('close')
    }
  }

  public setDirection(dir: string) {
    this.tilesAnimationsMap = getTilesAnimations(dir)
    this.dir = dir
    this.setTilesAnimation(this.tilesAnimationId)
  }

  protected onTilesAnimationEnds(): void {
    if (this.tilesAnimationId === 'open') {
      this.setTilesAnimation('opened')
      this.fireEvent('opened', this.loot)
      this.loot = []
    } else if (this.tilesAnimationId === 'close') {
      this.setTilesAnimation('closed')
    }
  }

  private static getAtlas() {
    let atlas = SproutChestAsset.atlas
    if (!atlas) {
      const chestAtlasImage = new Image()
      chestAtlasImage.src = chestTilesetImageSrc
      atlas = {
        cols: 5,
        rows: 2,
        image: chestAtlasImage,
        tileSize: 48,
      }
    }
    return atlas
  }
}
