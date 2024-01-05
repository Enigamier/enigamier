import type { Asset } from '@/assets'

import type { CollideEntity, RectangleCollideEntity } from './entities'
import { CollideEntityTypes } from './entities'

export function solidCollisionResolution(
  asset: Asset,
  source: CollideEntity,
  target: CollideEntity,
) {
  if (
    source.type === CollideEntityTypes.rectangle &&
    target.type === CollideEntityTypes.rectangle
  ) {
    const sourceData = (source as RectangleCollideEntity).data
    const targetData = (target as RectangleCollideEntity).data
    const sidesDistance = [
      Math.round(sourceData.startY - targetData.endY),
      Math.round(sourceData.endX - targetData.startX),
      Math.round(sourceData.endY - targetData.startY),
      Math.round(sourceData.startX - targetData.endX),
    ]
    const { side, distance } = sidesDistance.reduce((prev, distance, side) => {
      return Math.abs(distance) < Math.abs(prev.distance) ? { side, distance } : prev
    }, { side: 0, distance: 99999 })

    switch (side) {
      case 0:
      case 2:
        sourceData.startY -= distance
        sourceData.endY -= distance
        asset.position.y -= distance
        break
      case 1:
      case 3:
        sourceData.startX -= distance
        sourceData.endX -= distance
        asset.position.x -= distance
    }
  }
}
