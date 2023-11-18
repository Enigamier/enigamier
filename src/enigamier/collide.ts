import type { AssetCollidable, AssetHitbox } from '@/assets/AssetCollidable'
import type { TextureScope } from '@/textures/Texture'

function areScopesOverlapping(firstScope: TextureScope, secondCope: TextureScope): boolean {
  const startOverlapsX = firstScope.startX >= secondCope.startX && firstScope.startX <= secondCope.endX
  const startOverlapsY = firstScope.startY >= secondCope.startY && firstScope.startY <= secondCope.endY
  const endOverlapsX = firstScope.endX >= secondCope.startX && firstScope.endX <= secondCope.endX
  const endOverlapsY = firstScope.endY >= secondCope.startY && firstScope.endY <= secondCope.endY
  const startInsetX = secondCope.startX >= firstScope.startX && secondCope.startX <= firstScope.endX
  const startInsetY = secondCope.startY >= firstScope.startY && secondCope.startY <= firstScope.endY
  const endInsetX = secondCope.endX >= firstScope.startX && secondCope.endX <= firstScope.endX
  const endInsetY = secondCope.endY >= firstScope.startY && secondCope.endY <= firstScope.endY
  return (
    (startOverlapsX || endOverlapsX) && (startOverlapsY || endOverlapsY) ||
    (startInsetX || endInsetX) && (startInsetY || endInsetY)
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
  return areScopesOverlapping(globalHb1, globalHb2)
}

export function checkCollisions(assets: AssetCollidable[]) {
  assets.forEach((currentAsset, index) => {
    const currentScope = currentAsset.texture.scope
    for (let collideI = index + 1; collideI < assets.length; collideI++) {
      const checkingAsset = assets[collideI]
      const { texture: { scope: checkingScope } } = checkingAsset
      if (areScopesOverlapping(currentScope, checkingScope) && areHitboxesOverlapping(currentAsset, checkingAsset)) {
        currentAsset.onCollide && currentAsset.onCollide(checkingAsset)
        checkingAsset.onCollide && checkingAsset.onCollide(currentAsset)
      }
    }
  })
}
