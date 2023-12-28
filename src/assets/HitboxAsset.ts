import type { RectangleCollideEntity } from '@/collide/entities'
import { CollideEntityTypes } from '@/collide/entities'
import type { AssetCoords } from './Asset'
import { CollidableAsset } from './CollidableAsset'

export abstract class HitboxAsset extends CollidableAsset {
  protected hitbox: AssetCoords = { startX: 0, startY: 0, endX: 0, endY: 0 }

  protected isPassive = false

  private get globalHitbox(): AssetCoords {
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
      isPassive: this.isPassive,
      data: this.globalHitbox,
    }
  }

  public get collideEntities(): [RectangleCollideEntity] {
    return [this.hitboxCollideEntity]
  }
}
