import type { Asset, AssetContext } from '@/assets/Asset'
import type { Enigamier, GlobalController } from '@/index'

export interface SceneContext {
  enigamier: Enigamier;
  gc: GlobalController;
}

export abstract class Scene {
  public abstract readonly id: string

  protected context!: SceneContext

  private loaded = false

  private assets: Record<string, Asset> = {}

  public get assetsList() {
    return Object.values(this.assets)
  }

  public get sortedAssetsByTexture(): Asset[] {
    return this.assetsList.sort((assetA, assetB) => assetA.texture.index - assetB.texture.index)
  }

  public load(context: SceneContext) {
    this.context = context
    const assetContext: AssetContext = { gc: context.gc }
    Object.values(this.assets).forEach(asset => asset.load(assetContext))
  }

  public unload() {
    Object.values(this.assets).forEach(this.removeAsset.bind(this))
  }

  protected addAsset(asset: Asset) {
    this.loaded && asset.load({ gc: this.context.gc })
    this.assets[asset.id] = asset
  }

  protected removeAsset(asset: Asset) {
    asset.unload()
    delete this.assets[asset.id]
  }
}
