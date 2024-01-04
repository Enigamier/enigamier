import type { RectangleCollideEntity } from '@/collide'
import { CollideEntityTypes } from '@/collide'
import type { RectCoords } from '@/utils/coords'
import { Asset } from './Asset'

export abstract class HitboxAsset extends Asset {
  protected hitbox: RectCoords = { startX: 0, startY: 0, endX: 0, endY: 0 }

  private get globalHitbox(): RectCoords {
    const { startX, startY, endX, endY } = this.globalCoords
    return {
      startX: startX + this.hitbox.startX,
      startY: startY + this.hitbox.startY,
      endX: endX + this.hitbox.endX,
      endY: endY + this.hitbox.endY,
    }
  }

  private get hitboxCollideEntity(): RectangleCollideEntity {
    return {
      type: CollideEntityTypes.rectangle,
      data: this.globalHitbox,
    }
  }

  public get collideEntities(): [RectangleCollideEntity] {
    return [this.hitboxCollideEntity]
  }
}
