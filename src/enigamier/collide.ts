import type { CollidableAsset } from '@/assets/CollidableAsset'
import type { AssetCoords } from '@/assets/Asset'

function areRectanglesOverlapping(rect1: AssetCoords, rect2: AssetCoords): boolean {
  return (
    rect1.startX < rect2.endX &&
    rect1.endX > rect2.startX &&
    rect1.startY < rect2.endY &&
    rect1.endY > rect2.startY
  )
}

export function checkCollisions(assets: CollidableAsset[]) {
  assets.forEach((asset1, index) => {
    const scope1 = asset1.texture.scope
    for (let collideI = index + 1; collideI < assets.length; collideI++) {
      const asset2 = assets[collideI]
      const { texture: { scope: scope2 } } = asset2
      if (
        areRectanglesOverlapping(scope1, scope2) &&
        areRectanglesOverlapping(asset1.globalHitbox, asset2.globalHitbox)
      ) {
        asset1.onCollide && asset1.onCollide(asset2)
        asset2.onCollide && asset2.onCollide(asset1)
      }
    }
  })
}
