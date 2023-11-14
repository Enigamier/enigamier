import { Asset } from '@/assets/Asset'

export class Scene {
  public id: string

  private assets: Record<string, Asset> = {}

  constructor(id: string) {
    this.id = id
  }

  public get assetsList() {
    return Object.values(this.assets)
  }

  public get sortedAssetsByTexture(): Asset[] {
    return this.assetsList.sort((assetA, assetB) => assetA.texture.index - assetB.texture.index)
  }

  public addAsset(asset: Asset) {
    this.assets[asset.id] = asset
  }
}
