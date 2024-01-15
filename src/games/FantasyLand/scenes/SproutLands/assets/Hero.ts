import type {
  AssetContext,
  AssetMovement,
  AudioEffectInfo,
  CollisionInfo,
  PointCoords,
  RectCoords,
  RectSize,
  RectangleCollideEntity,
  TilesAnimationMap,
} from '@/index'
import { CollideEntityTypes, solidCollisionResolution } from '@/index'

import { gameData } from '../../../game-data'
import { HeroAsset } from '../../../assets/HeroAsset'

import heroTilesetImageSrc from '../imgs/hero-tileset.png'
import heroHitAudioSrc from '../audio/hero-hit.mp3'
import heroUseAudioSrc from '../audio/hero-use.mp3'
import heroAxeAudioSrc from '../audio/hero-axe.mp3'
import heroDeathAudioSrc from '../audio/hero-death.mp3'

function getAnimationTiles(): TilesAnimationMap {
  return ['front', 'back', 'left', 'right'].reduce((map, dir, index) => {
    const start = (index * tileAtlasCols) + 1
    const idSuffix = `-${dir}`
    return {
      ...map,
      [`stand${idSuffix}`]: {
        interval: 400,
        tiles: [start, start + 1],
      },
      [`walking${idSuffix}`]: {
        interval: 200,
        tiles: [start + 1, start + 2, start + 1, start + 3],
      },
    }
  }, {})
}

function getActionAnimationTiles(): TilesAnimationMap {
  return Object.keys(actionInfoMap).reduce((map, item, index) => {
    return {
      ...map,
      ...['front', 'back', 'left', 'right'].reduce((dirsMap, dir, dirIndex) => {
        const start = (dirIndex * tileAtlasCols) + (5 + index * 2)
        const id = `action-${dir}${item ? `-${item}` : ''}`
        return {
          ...dirsMap,
          [id]: {
            interval: 300,
            tiles: [start, start + 1],
          },
        }
      }, {}),
    }
  }, {})
}

interface ActionInfo {
  collideWith: string[];
  effect?: string;
}

const normalSpeed = 300
const tileAtlasCols = 20
const actionKey = 'e'
const defaultItemEffect = 'use'
const actionInfoMap: Record<string, ActionInfo> = {
  pickaxe: { collideWith: ['rock'], effect: 'axe' },
  axe: { collideWith: ['tree'], effect: 'axe' },
  can: { collideWith: ['grain'] },
  fruit: { collideWith: ['cow-smell'] },
  grain: { collideWith: ['chicken'] },
  rock: { collideWith: ['water'] },
  wood: { collideWith: ['bridge'] },
  use: { collideWith: ['chest', 'bush'] },
}

// For front direction
const actionEntitySizeDelta: RectSize = {
  width: .4,
  height: .3,
}

export class SproutHeroAsset extends HeroAsset {
  declare public readonly id

  public movement: AssetMovement = { angle: 0, speed: normalSpeed }

  protected tilesAnimationsMap: TilesAnimationMap = {
    ...getAnimationTiles(),
    ...getActionAnimationTiles(),
  }

  protected audioEffectsInfo: Record<string, AudioEffectInfo> = {
    hit: {
      src: heroHitAudioSrc,
      loadOffset: .5,
      offset: .3,
    },
    use: {
      src: heroUseAudioSrc,
      loadOffset: 2,
      duration: 1,
    },
    axe: {
      src: heroAxeAudioSrc,
      loadOffset: 2,
      delay: .1,
      duration: 1,
    },
    death: {
      src: heroDeathAudioSrc,
      loadOffset: 2,
      duration: 1,
    },
  }

  private isActioning = false

  constructor(
    id: string,
    globalPos: PointCoords,
    size: number,
  ) {
    const heroAtlasImage = new Image()
    heroAtlasImage.src = heroTilesetImageSrc
    const heroTileAtlas = {
      cols: tileAtlasCols,
      rows: 4,
      image: heroAtlasImage,
      tileSize: 48,
    }
    super(heroTileAtlas)
    this.id = id
    this.position = globalPos
    this.texture.size = { width: size, height: size }
  }

  public get collideEntities(): RectangleCollideEntity[] {
    const type = CollideEntityTypes.rectangle
    const entities: RectangleCollideEntity[] = [
      {
        type,
        kind: 'hero',
        collideWith: ['wall', 'door', 'house', 'cow', 'loot'],
        data: this.heroGlobalCoords,
      },
    ]
    if (this.isActioning) {
      entities.push(this.getActionCollideEntity())
    }
    return entities
  }

  private get tileUnitSize() {
    return Math.round(this.texture.size.width / 3)
  }

  private get heroGlobalCoords(): RectCoords {
    const { startX, startY, endX, endY } = this.globalCoords
    return {
      startX: startX + this.tileUnitSize,
      startY: startY + this.tileUnitSize,
      endX: endX - this.tileUnitSize,
      endY: endY - this.tileUnitSize,
    }
  }

  public async load(context: AssetContext) {
    super.load(context)
    this.kbController.addEventListener('keydown', this.onKeyDown.bind(this), this.abortController.signal)
  }

  public update(delta: number): void {
    super.update(delta)
    const [mode, dir] = this.tilesAnimationId.split('-')
    const { [actionKey]: isActionPressed } = this.kbController.inputs
    if (mode === 'action' && !isActionPressed) {
      if (!this.isActioning) {
        this.setTilesAnimation(`stand-${dir}`)
      }
    }
  }

  public onCollide(collisionInfo: CollisionInfo): void {
    super.onCollide(collisionInfo)
    const { source, target } = collisionInfo
    switch (source.kind) {
      case 'hero':
        switch (target.kind) {
          case 'cow':
            solidCollisionResolution(this, source, target)
        }
        break
    }
  }

  public async hit(damage: number) {
    const { lifes } = gameData
    gameData.lifes = Math.max(lifes - damage, 0)
    await this.playAudioEffect('hit')
    if (gameData.lifes === 0) {
      this.fireEvent('die')
      await this.playAudioEffect('death')
    }
  }

  protected onTilesAnimationEnds(): void {
    const [mode, _dir, item] = this.tilesAnimationId.split('-')
    if (mode === 'action') {
      const { [actionKey]: isActionPressed } = this.kbController.inputs
      this.isActioning = isActionPressed
      if (this.isActioning) {
        this.playAudioEffect(actionInfoMap[item].effect ?? defaultItemEffect)
      }
    }
  }

  private getActionCollideEntity(): RectangleCollideEntity {
    const { startX, startY, endX, endY } = this.heroGlobalCoords
    const { width: widthDelta, height: heightDelta } = actionEntitySizeDelta
    const [_mode, dir, item] = this.tilesAnimationId.split('-')
    const width = Math.round(this.tileUnitSize * widthDelta)
    const height = Math.round(this.tileUnitSize * heightDelta)
    const offset = Math.round((this.tileUnitSize - width) / 2)
    return {
      type: CollideEntityTypes.rectangle,
      kind: `hero-action-${item}`,
      collideWith: actionInfoMap[item].collideWith,
      data: {
        startX: (dir === 'front' || dir === 'back' ? startX + offset : (dir === 'left' ? startX - height : endX)),
        startY: (dir === 'left' || dir === 'right' ? startY + offset : (dir === 'front' ? endY : startY - height)),
        endX: (dir === 'front' || dir === 'back' ? endX - offset : (dir === 'left' ? startX : endX + height)),
        endY: (dir === 'left' || dir === 'right' ? endY - offset : (dir === 'front' ? endY + height : startY)),
      },
    }
  }

  private onKeyDown(key: string) {
    const { items, activeItem } = gameData.sproutLands
    if (key === 'e') {
      this.startActionAnimation()
    } else if (gameData.sproutLands.items.length) {
      const keyNumber = parseInt(key)
      if (!isNaN(keyNumber) && keyNumber && keyNumber <= items.length) {
        const keyItem = items[keyNumber - 1]
        gameData.sproutLands.activeItem = activeItem === keyItem ? '' : keyItem
      }
    }
  }

  private startActionAnimation() {
    const [mode, dir] = this.tilesAnimationId.split('-')
    if (mode !== 'action') {
      const { activeItem } = gameData.sproutLands
      const item = activeItem.length > 0 ? activeItem : 'use'
      this.isActioning = true
      this.setTilesAnimation(`action-${dir}-${item}`)
      this.playAudioEffect(actionInfoMap[item].effect ?? defaultItemEffect)
    }
  }
}
