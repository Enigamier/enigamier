import type { Asset, AssetContext } from '@/assets/Asset'
import type { Enigamier, GlobalController, Texture } from '@/index'

export interface SceneContext {
  enigamier: Enigamier;
  canvasContext: CanvasRenderingContext2D;
  gc: GlobalController;
}

export abstract class Scene {
  public abstract readonly id: string

  protected context!: SceneContext

  private loaded = false

  private assets: Record<string, Asset> = {}

  protected bgTexture?: Texture

  public get assetsList() {
    return Object.values(this.assets)
  }

  private get sortedAssetsByTexture(): Asset[] {
    return this.assetsList.sort((assetA, assetB) => assetA.texture.index - assetB.texture.index)
  }

  public load(context: SceneContext) {
    this.context = context
    this.initBgTexture()
    const assetContext: AssetContext = { gc: context.gc }
    Object.values(this.assets).forEach(asset => asset.load(assetContext))
    this.loaded = true
  }

  public unload() {
    Object.values(this.assets).forEach(this.removeAsset.bind(this))
    this.loaded = false
  }

  public render() {
    this.bgTexture?.render(this.context.canvasContext)
    this.sortedAssetsByTexture.forEach(this.renderAsset.bind(this))
  }

  protected addAsset(asset: Asset) {
    this.loaded && asset.load({ gc: this.context.gc })
    this.assets[asset.id] = asset
  }

  protected removeAsset(asset: Asset) {
    asset.unload()
    delete this.assets[asset.id]
  }

  private renderAsset(asset: Asset) {
    const { canvasContext: ctx } = this.context
    ctx.save()
    asset.texture.render(ctx)
    ctx.restore()
  }

  private initBgTexture() {
    if (this.bgTexture) {
      const { enigamier: { canvas: { width, height } } } = this.context
      const { scope } = this.bgTexture
      this.bgTexture.scope = { ...scope, endX: width, endY: height }
      this.bgTexture.size = { width, height }
    }
  }
}
