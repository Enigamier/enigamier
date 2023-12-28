import type { CollidableAsset } from '@/assets/CollidableAsset'
import { areRectanglesOverlapping, getCollidedEntities } from './utils'
import type { CollideEntity } from './entities'

export interface CollisionInfo {
  asset: CollidableAsset;
  target: CollideEntity;
  source: CollideEntity;
}

export function checkCollisions(assets: CollidableAsset[]) {
  const activeAssets: CollidableAsset[] = []
  const passiveAssets: CollidableAsset[] = []
  assets.forEach(
    asset => (typeof asset.onCollide === 'function' ? activeAssets : passiveAssets).push(asset),
  )
  activeAssets.forEach((sourceAsset, sourceI) => {
    const sourceScope = sourceAsset.texture.scope
    const targetAssets = [...activeAssets.slice(sourceI + 1), ...passiveAssets]
    targetAssets.forEach(targetAsset => {
      const { texture: { scope: targetScope } } = targetAsset
      if (areRectanglesOverlapping(sourceScope, targetScope)) {
        sourceAsset.collideEntities.forEach(sourceEntity => {
          const collidedEntities = getCollidedEntities(sourceEntity, targetAsset)
          collidedEntities.forEach(targetEntity => {
            sourceAsset.onCollide?.({
              asset: targetAsset,
              source: sourceEntity,
              target: targetEntity,
            })
            targetAsset.onCollide?.({
              asset: sourceAsset,
              source: targetEntity,
              target: sourceEntity,
            })
          })
        })
      }
    })
  })
}
