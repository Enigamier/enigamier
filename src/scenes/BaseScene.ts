import type { BaseAsset, BaseAssetContext } from '@/assets/BaseAsset'
import type { Enigamier } from '@/enigamier'
import type { GlobalController } from '@/controllers'
import type { Texture } from '@/textures'

export interface BaseSceneContext {
  enigamier: Enigamier;
  canvasContext: CanvasRenderingContext2D;
  gc: GlobalController;
}

export abstract class BaseScene {
  public abstract readonly id: string

  protected context!: BaseSceneContext

  protected loaded = false

  protected assets: Record<string, BaseAsset> = {}

  protected bgTexture?: Texture

  protected get assetsList() {
    return Object.values(this.assets)
  }

  protected get sortedAssetsByIndex() {
    return this.assetsList.sort((assetA, assetB) => assetA.index - assetB.index)
  }

  protected get assetsContext(): BaseAssetContext {
    return { gc: this.context.gc }
  }

  public load(context: BaseSceneContext) {
    this.context = context
    this.initBgTexture()
    this.assetsList.forEach(this.loadAsset.bind(this))
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

  protected addAsset(asset: BaseAsset) {
    this.loaded && this.loadAsset(asset)
    this.assets[asset.id] = asset
  }

  protected removeAsset(asset: BaseAsset) {
    asset.unload()
    delete this.assets[asset.id]
  }

  protected loadAsset(asset: BaseAsset) {
    asset.load(this.assetsContext)
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

  protected renderAsset(asset: BaseAsset) {
    asset.render(this.context.canvasContext)
  }

  protected initBgTexture() {
    if (this.bgTexture) {
      const { enigamier: { canvas: { width, height } } } = this.context
      this.bgTexture.size = { width, height }
    }
  }
}
