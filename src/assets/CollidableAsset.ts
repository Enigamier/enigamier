import type { CollideEntity } from '@/collide/entities'
import type { CollisionInfo } from '@/collide'
import { Asset } from './Asset'

export abstract class CollidableAsset extends Asset {
  public abstract get collideEntities(): CollideEntity[]

  public onCollide?(collisionInfo: CollisionInfo): void
}
