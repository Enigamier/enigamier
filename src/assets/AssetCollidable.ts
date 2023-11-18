import { Asset } from './Asset'

export interface AssetHitbox {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export abstract class AssetCollidable extends Asset {
  public hitbox: AssetHitbox = { startX: 0, startY: 0, endX: 0, endY: 0 }

  public onCollide?(collisionAsset: AssetCollidable): void
}
