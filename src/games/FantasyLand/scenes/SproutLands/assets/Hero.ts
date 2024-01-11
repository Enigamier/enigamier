import type {
  AssetContext,
  AssetMovement,
  CollisionInfo,
  RectangleCollideEntity,
  TilesAnimationMap,
} from '@/index'
import { CollideEntityTypes } from '@/index'

import { gameData } from '../../../game-data'
import { HeroAsset } from '../../../assets/HeroAsset'

import heroTilesetImageSrc from '../imgs/hero-tileset.png'

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
  return ['pick', 'axe', 'can', 'fruit', 'grain', 'rock', 'wood'].reduce((map, item, index) => {
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

const normalSpeed = 300
const tileAtlasCols = 18
const actionKey = 'e'

export class SproutHeroAsset extends HeroAsset {
  public readonly id = 'SproutHero'

  public movement: AssetMovement = { angle: 0, speed: normalSpeed }

  protected tilesAnimationsMap: TilesAnimationMap = {
    ...getAnimationTiles(),
    ...getActionAnimationTiles(),
  }

  private readonly onCollideCallback?: (kind?: string) => void

  private isActioning = false

  constructor(onCollide?: (kind?: string) => void) {
    const heroAtlasImage = new Image()
    heroAtlasImage.src = heroTilesetImageSrc
    const heroTileAtlas = {
      cols: tileAtlasCols,
      rows: 4,
      image: heroAtlasImage,
      tileSize: 48,
    }
    super(heroTileAtlas)
    this.onCollideCallback = onCollide
  }

  public get collideEntities(): [RectangleCollideEntity] {
    const { startX, startY, endX, endY } = this.globalCoords
    return [
      {
        type: CollideEntityTypes.rectangle,
        kind: 'hero',
        collideWith: ['wall', 'door', 'house', 'door-zone'],
        data: {
          startX: startX + this.tileUnitSize,
          startY: startY + this.tileUnitSize,
          endX: endX - this.tileUnitSize,
          endY: endY - this.tileUnitSize,
        },
      },
    ]
  }

  private get tileUnitSize() {
    return Math.round(this.texture.size.width / 3)
  }

  public load(context: AssetContext): void {
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
    this.onCollideCallback && this.onCollideCallback(collisionInfo.target.kind)
  }

  protected onTilesAnimationEnds(): void {
    const [mode] = this.tilesAnimationId.split('-')
    if (mode === 'action') {
      this.isActioning = false
    }
  }

  private onKeyDown(key: string) {
    const { items, activeItem } = gameData.sproutLands
    if (gameData.sproutLands.items.length) {
      const keyNumber = parseInt(key)
      if (!isNaN(keyNumber) && keyNumber && keyNumber <= items.length) {
        const keyItem = items[keyNumber - 1]
        gameData.sproutLands.activeItem = keyItem
      } else if (key === 'e' && activeItem) {
        this.startActionAnimation()
      }
    }
  }

  private startActionAnimation() {
    const [mode, dir] = this.tilesAnimationId.split('-')
    if (mode !== 'action') {
      const { activeItem } = gameData.sproutLands
      this.isActioning = true
      this.setTilesAnimation(`action-${dir}-${activeItem}`)
    }
  }
}
