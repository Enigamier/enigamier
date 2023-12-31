import type { Asset, AssetContext } from '@/assets/Asset'
import { checkCollisions } from '@/collide'
import { CollidableAsset, type Enigamier, type GlobalController, type Texture } from '@/index'

export interface SceneContext {
  enigamier: Enigamier;
  canvasContext: CanvasRenderingContext2D;
  gc: GlobalController;
}

export abstract class Scene {
  public abstract readonly id: string

  protected context!: SceneContext

  protected loaded = false

  protected assets: Record<string, Asset> = {}

  protected bgTexture?: Texture

  public get assetsList() {
    return Object.values(this.assets)
  }

  public get collidableAssetsList(): CollidableAsset[] {
    return this.assetsList.filter(asset => (
      asset instanceof CollidableAsset &&
      asset.collideEntities.length > 0
    )) as CollidableAsset[]
  }

  protected get sortedAssetsByTexture(): Asset[] {
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

  public update(delta: number) {
    this.updateAssets(delta)
    checkCollisions(this.collidableAssetsList)
  }

  public render() {
    this.renderBgTexture()
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
      const { scope } = this.bgTexture
      this.bgTexture.scope = { ...scope, endX: width, endY: height }
      this.bgTexture.size = { width, height }
    }
  }
}
