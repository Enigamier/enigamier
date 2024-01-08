import { checkCollisions } from '@/collide'
import { Asset, type AssetContext } from '@/assets/Asset'

import { BaseScene, type BaseSceneContext } from './BaseScene'

export type SceneContext = BaseSceneContext

export abstract class Scene extends BaseScene {
  public get collidableAssetsList(): Asset[] {
    return this.assetsList.filter(asset => (
      asset instanceof Asset &&
      asset.collideEntities.length > 0
    )) as Asset[]
  }

  protected get assetsContext(): AssetContext {
    return { gc: this.context.gc }
  }

  public update(delta: number) {
    super.update(delta)
    checkCollisions(this.collidableAssetsList)
  }
}
