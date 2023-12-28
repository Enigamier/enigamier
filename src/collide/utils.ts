import type { AssetCoords, CollidableAsset } from '@/assets'

import type { CollideEntity, RectangleCollideEntity } from './entities'
import { CollideEntityTypes } from './entities'

export function areRectanglesOverlapping(rect1: AssetCoords, rect2: AssetCoords): boolean {
  return (
    rect1.startX < rect2.endX &&
    rect1.endX > rect2.startX &&
    rect1.startY < rect2.endY &&
    rect1.endY > rect2.startY
  )
}

function getDistanceBetween2Rectangles(rect1: AssetCoords, rect2: AssetCoords): number {
  const center1 = {
    x: Math.round((rect1.startX - rect1.endX) / 2) + rect1.startX,
    y: Math.round((rect1.startY - rect1.endY) / 2) + rect1.startY,
  }
  const center2 = {
    x: Math.round((rect2.startX - rect2.endX) / 2) + rect2.startX,
    y: Math.round((rect2.startY - rect2.endY) / 2) + rect2.startY,
  }

  // √ (x2 – x1) + (y2 – y1) 2
  const x = center2.y - center1.y
  const y = center2.x - center1.x
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
}

function sortEntitiesByDistance(
  sourceEntity: CollideEntity,
  targetEntities: CollideEntity[],
): CollideEntity[] {
  const sortedEntities: CollideEntity[] = targetEntities
  if (sourceEntity.type === CollideEntityTypes.rectangle) {
    const sourceData = (sourceEntity as RectangleCollideEntity).data
    sortedEntities.sort((entityA, entityB) => {
      let distA = 0
      let distB = 0
      if (entityA.type === CollideEntityTypes.rectangle) {
        const entityAData = (entityA as RectangleCollideEntity).data
        distA = getDistanceBetween2Rectangles(sourceData, entityAData)
      }
      if (entityB.type === CollideEntityTypes.rectangle) {
        const entityBData = (entityB as RectangleCollideEntity).data
        distB = getDistanceBetween2Rectangles(sourceData, entityBData)
      }
      return distA - distB
    })
  }
  return sortedEntities
}

export function getCollidedEntities(
  sourceEntity: CollideEntity,
  targetAsset: CollidableAsset,
): CollideEntity[] {
  let collidedEntities = targetAsset.collideEntities.filter(targetEntity => (
    sourceEntity.type === CollideEntityTypes.rectangle &&
    targetEntity.type === CollideEntityTypes.rectangle &&
    areRectanglesOverlapping(
      (sourceEntity as RectangleCollideEntity).data,
      (targetEntity as RectangleCollideEntity).data,
    )
  ))
  collidedEntities = sortEntitiesByDistance(sourceEntity, collidedEntities)
  return collidedEntities
}
