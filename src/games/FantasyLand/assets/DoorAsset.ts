import type { PointCoords, RectangleCollideEntity, TilesAtlas } from '@/index'
import { CollideEntityTypes, TileObjectAsset } from '@/index'

export abstract class DoorAsset extends TileObjectAsset {
  public colliding = false

  public tilesAnimationId = 'closed'

  protected actionOffsetDelta = .2

  constructor(atlas: TilesAtlas, globalPos: PointCoords, size: number) {
    super(atlas)
    this.texture.size = { width: size, height: size }
    const actionOffset = Math.round(size * this.actionOffsetDelta)
    this.scope = {
      startX: globalPos.x - actionOffset,
      startY: globalPos.y - actionOffset,
      endX: globalPos.x + size + actionOffset,
      endY: globalPos.y + size + actionOffset,
    }
    this.position = { x: actionOffset, y: actionOffset }
  }

  public get collideEntities(): RectangleCollideEntity[] {
    const type = CollideEntityTypes.rectangle
    const entities = [{ type, kind: 'door', data: this.scope }]
    if (this.tilesAnimationId !== 'opened') {
      entities.push({ type, kind: 'wall', data: this.globalCoords })
    }
    return entities
  }

  public update(delta: number): void {
    if (
      (this.tilesAnimationId === 'open' || this.tilesAnimationId === 'close') &&
      this.currentTilesAnimationIndex === this.tilesAnimationsMap.open.tiles.length - 1
    ) {
      this.setTilesAnimation(this.tilesAnimationId === 'open' ? 'opened' : 'closed')
    }
    if (this.colliding) {
      this.colliding = false
      if (this.tilesAnimationId === 'closed') {
        this.setTilesAnimation('open')
      }
    } else if (this.tilesAnimationId === 'opened') {
      this.setTilesAnimation('close')
    }
    super.update(delta)
  }
}
