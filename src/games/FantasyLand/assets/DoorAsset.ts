import type { RectangleCollideEntity } from '@/index'
import { CollideEntityTypes, TileObjectAsset } from '@/index'

export abstract class DoorAsset extends TileObjectAsset {
  public colliding = false

  public tilesAnimationId = 'closed'

  public get collideEntities(): [RectangleCollideEntity] {
    return [
      {
        type: CollideEntityTypes.rectangle,
        kind: 'door',
        data: this.globalCoords,
      },
    ]
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
