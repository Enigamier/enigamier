import type { AssetCollidable, AssetHitbox } from '@/assets/AssetCollidable'
import type { TextureScope } from '@/textures/Texture'

function areRectanglesOverlapping(rect1: TextureScope, rect2: TextureScope): boolean {
  return (
    rect1.startX < rect2.endX &&
    rect1.endX > rect2.startX &&
    rect1.startY < rect2.endY &&
    rect1.endY > rect2.startY
  )
}

function getAssetGlobalHitbox(asset: AssetCollidable): AssetHitbox {
  const txt = asset.texture
  return {
    startX: txt.scope.startX + txt.position.x + asset.hitbox.startX,
    startY: txt.scope.startY + txt.position.y + asset.hitbox.startY,
    endX: txt.scope.startX + txt.position.x + txt.size.width + asset.hitbox.endX,
    endY: txt.scope.startY + txt.position.y + txt.size.height + asset.hitbox.endY,
  }
}

function areHitboxesOverlapping(asset1: AssetCollidable, asset2: AssetCollidable) {
  const globalHb1 = getAssetGlobalHitbox(asset1)
  const globalHb2 = getAssetGlobalHitbox(asset2)
  return areRectanglesOverlapping(globalHb1, globalHb2)
}

export function checkCollisions(assets: AssetCollidable[]) {
  assets.forEach((asset1, index) => {
    const currentScope = asset1.texture.scope
    for (let collideI = index + 1; collideI < assets.length; collideI++) {
      const asset2 = assets[collideI]
      const { texture: { scope: checkingScope } } = asset2
      if (
        areRectanglesOverlapping(currentScope, checkingScope) &&
        areHitboxesOverlapping(asset1, asset2)
      ) {
        asset1.onCollide && asset1.onCollide(asset2)
        asset2.onCollide && asset2.onCollide(asset1)
      }
    }
  })
}
