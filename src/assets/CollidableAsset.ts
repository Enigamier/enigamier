import type { AssetCoords } from './Asset'
import { Asset } from './Asset'

export abstract class CollidableAsset extends Asset {
  public hitbox: AssetCoords = { startX: 0, startY: 0, endX: 0, endY: 0 }

  public get globalHitbox(): AssetCoords {
    const { startX, startY, endX, endY } = this.globalCoords
    return {
      startX: startX + this.hitbox.startX,
      startY: startY + this.hitbox.startY,
      endX: endX + this.hitbox.endX,
      endY: endY + this.hitbox.endY,
    }
  }

  public onCollide?(collisionAsset: CollidableAsset): void
}
