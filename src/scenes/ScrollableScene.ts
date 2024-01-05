import type { Asset, AssetContext } from '@/assets'
import type { RectCoords, RectSize } from '@/utils/coords'
import { areRectanglesOverlapping } from '@/collide/utils'

import type { SceneContext } from './Scene'
import { Scene } from './Scene'

export interface CameraInfo {
  x: number;
  y: number;
  width: number;
  height: number;
  maxX: number;
  maxY: number;
}

export abstract class ScrollableScene extends Scene {
  protected abstract readonly mapSize: RectSize

  protected camera: CameraInfo = { x: 0, y: 0, width: 0, height: 0, maxX: 0, maxY: 0 }

  private followingAssets: Asset['id'][] = []

  protected get cameraScope(): RectCoords {
    const { x, y, width, height } = this.camera
    return {
      startX: x,
      startY: y,
      endX: x + width,
      endY: y + height,
    }
  }

  protected get sortedAssetsInCameraByTexture(): Asset[] {
    return this.sortedAssetsByTexture.filter(({ globalCoords }) => {
      return areRectanglesOverlapping(this.cameraScope, globalCoords)
    })
  }

  public load(context: SceneContext) {
    this.context = context
    this.initCamera()
    this.initBgTexture()
    const assetContext: AssetContext = { gc: context.gc, camera: this.camera }
    Object.values(this.assets).forEach(asset => asset.load(assetContext))
    this.loaded = true
  }

  public update(delta: number): void {
    super.update(delta)
    this.followAssetsWithCamera()
  }

  public render() {
    const ctx = this.context.canvasContext
    ctx.save()
    this.renderBgTexture()
    ctx.translate(-this.camera.x, -this.camera.y)
    this.sortedAssetsInCameraByTexture.forEach(this.renderAsset.bind(this))
    ctx.restore()
  }

  protected moveCamera(x: number, y: number) {
    const { maxX, maxY } = this.camera
    this.camera.x = Math.max(Math.min(x, maxX), 0)
    this.camera.y = Math.max(Math.min(y, maxY), 0)
  }

  protected followAsset(assetId: Asset['id']) {
    this.followingAssets = [...this.followingAssets, assetId]
  }

  protected unfollowAsset(assetId: Asset['id']) {
    this.followingAssets = this.followingAssets.filter(followedAssetId => followedAssetId !== assetId)
  }

  private followAssetsWithCamera() {
    if (this.followingAssets.length) {
      const followedAsset = this.assets[this.followingAssets[0]]
      const { width, height } = this.camera
      const { globalPosition: { x, y } } = followedAsset
      const { centerPoint } = followedAsset.texture
      const targetPoint = {
        x: x + centerPoint.x,
        y: y + centerPoint.y,
      }
      this.moveCamera(
        targetPoint.x - Math.round(width / 2),
        targetPoint.y - Math.round(height / 2),
      )
    }
  }

  private initCamera() {
    const { canvas: { width, height } } = this.context.enigamier

    this.camera.width = width
    this.camera.height = height
    this.camera.maxX = this.mapSize.width - width
    this.camera.maxY = this.mapSize.height - height
  }
}
