import type { BaseAsset } from '@/assets/BaseAsset'

import { BaseScene } from './BaseScene'

export abstract class HudScene extends BaseScene {
  protected loadAsset(asset: BaseAsset): void {
    const { width, height } = this.context.enigamier.canvas
    asset.scope = { startX: 0, startY: 0, endX: width, endY: height }
    super.loadAsset(asset)
  }
}
