import type { BaseAssetContext } from '@/assets/BaseAsset'
import type { Asset } from '@/index'
import { type Enigamier, type GlobalController, type Texture } from '@/index'

export interface BaseSceneContext {
  enigamier: Enigamier;
  canvasContext: CanvasRenderingContext2D;
  gc: GlobalController;
}

export abstract class BaseScene {
  public abstract readonly id: string

  protected context!: SceneContext

  protected loaded = false

  protected assets: Record<string, Asset> = {}

  protected bgTexture?: Texture

  protected get assetsList() {
    return Object.values(this.assets)
  }

  protected get sortedAssetsByIndex(): Asset[] {
    return this.assetsList.sort((assetA, assetB) => assetA.index - assetB.index)
  }

  protected get assetsContext(): BaseAssetContext {
    return { gc: this.context.gc }
  }

  public load(context: SceneContext) {
    this.context = context
    this.initBgTexture()
    Object.values(this.assets).forEach(asset => asset.load(this.assetsContext))
    this.loaded = true
  }

  public unload() {
    Object.values(this.assets).forEach(this.removeAsset.bind(this))
    this.loaded = false
  }

  public update(delta: number) {
    this.updateAssets(delta)
  }

  public render() {
    this.renderBgTexture()
    this.sortedAssetsByIndex.forEach(this.renderAsset.bind(this))
  }

  protected addAsset(asset: Asset) {
    this.loaded && asset.load({ gc: this.context.gc })
    this.assets[asset.id] = asset
  }

  protected removeAsset(asset: Asset) {
    asset.unload()
    delete this.assets[asset.id]
  }

  protected updateAssets(delta: number) {
    this.assetsList.forEach(asset => asset.update && asset.update(delta))
  }

  protected renderBgTexture() {
    if (this.bgTexture) {
      const { canvasContext: ctx } = this.context
      ctx.save()
      this.bgTexture.render(this.context.canvasContext)
      ctx.restore()
    }
  }

  protected renderAsset(asset: Asset) {
    asset.render(this.context.canvasContext)
  }

  protected initBgTexture() {
    if (this.bgTexture) {
      const { enigamier: { canvas: { width, height } } } = this.context
      this.bgTexture.size = { width, height }
    }
  }
}
