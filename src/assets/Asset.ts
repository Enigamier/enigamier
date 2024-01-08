import type {
  CameraInfo,
  CollideEntity,
  CollisionInfo,
} from '@/index'
import { BaseAsset, type BaseAssetContext } from './BaseAsset'

export interface AssetContext extends BaseAssetContext {
  camera?: CameraInfo;
}

export abstract class Asset extends BaseAsset {
  public abstract readonly id: string

  declare protected context: AssetContext

  public get collideEntities(): CollideEntity[] {
    return []
  }

  public onCollide?(collisionInfo: CollisionInfo): void
}
