import type { Asset } from '@/assets/Asset'
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

  public register(context: SceneContext) {
    this.context = context
  }

  public load() {
    Object.values(this.assets).forEach(asset => asset.load && asset.load())
  }

  public unload() {
    Object.values(this.assets).forEach(asset => asset.unload && asset.unload())
  }

  protected addAsset(asset: Asset) {
    this.assets[asset.id] = asset
    this.loaded && asset.load && asset.load()
  }

  protected removeAsset(asset: Asset) {
    asset.unload && asset.unload()
    delete this.assets[asset.id]
  }
}
