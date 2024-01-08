import { checkCollisions } from '@/collide'
import { Asset, type AssetContext } from '@/assets/Asset'

import { BaseScene, type BaseSceneContext } from './BaseScene'
import type { HudScene } from './HudScene'

export type SceneContext = BaseSceneContext

export abstract class Scene extends BaseScene {
  protected hud?: HudScene

  declare protected assets: Record<string, Asset>

  public get collidableAssetsList(): Asset[] {
    return this.assetsList.filter(asset => (
      asset instanceof Asset &&
      asset.collideEntities.length > 0
    )) as Asset[]
  }

  protected get assetsContext(): AssetContext {
    return { gc: this.context.gc }
  }

  public load(context: SceneContext): void {
    this.hud?.load(context)
    super.load(context)
  }

  public unload(): void {
    this.hud?.unload()
    super.unload()
  }

  public update(delta: number) {
    super.update(delta)
    this.hud?.update(delta)
    checkCollisions(this.collidableAssetsList)
  }

  public render(): void {
    super.render()
    this.hud?.render()
  }
}
