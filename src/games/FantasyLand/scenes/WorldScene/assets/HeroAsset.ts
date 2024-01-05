import type {
  AssetContext,
  AssetMovement,
  CollisionInfo,
  KeyboardController,
  RectangleCollideEntity,
  TilesAnimationMap,
} from '@/index'
import { CollideEntityTypes, TileObjectAsset, solidCollisionResolution } from '@/index'

import atlasImageSrc from '../imgs/player-tiles.png'

function getWalkingTiles(): TilesAnimationMap {
  return ['front', 'back', 'left', 'right'].reduce((map, dir, index) => {
    const start = (index * 4) + 2
    return {
      ...map,
      [`walking${dir[0].toUpperCase()}${dir.slice(1)}`]: {
        interval: 200,
        tiles: [start, start + 1, start, start + 2],
      },
    }
  }, {})
}

function getAnimationDirFromId(id: string): string {
  return id.replace(/(stand)|(walking)/g, '').toLowerCase()
}

interface HeroMoveKeys {
  up: string;
  down: string;
  right: string;
  left: string;
}

const moveKeys: HeroMoveKeys = {
  up: 'w',
  down: 's',
  left: 'a',
  right: 'd',
}

export class HeroAsset extends TileObjectAsset {
  public readonly id = 'HeroAsset'

  public movement: AssetMovement = { angle: 0, speed: 300 }

  protected tilesAnimationsMap: TilesAnimationMap = {
    standFront: { tiles: [1] },
    standBack: { tiles: [5] },
    standLeft: { tiles: [9] },
    standRight: { tiles: [13] },
    ...getWalkingTiles(),
  }

  protected tilesAnimationId = 'standFront'

  private kbController!: KeyboardController

  constructor() {
    const atlasImage = new Image()
    atlasImage.src = atlasImageSrc
    const tilesAtlas = {
      cols: 4,
      rows: 4,
      image: atlasImage,
      tileSize: 16,
    }
    super(tilesAtlas)
  }

  public get collideEntities(): [RectangleCollideEntity] {
    return [
      {
        type: CollideEntityTypes.rectangle,
        data: this.globalCoords,
      },
    ]
  }

  private get moveKeysCodesMap() {
    return Object.values(moveKeys).reduce((codesMap, keyCode) => ({ ...codesMap, [keyCode]: true }), {})
  }

  public load(context: AssetContext): void {
    super.load(context)
    this.kbController = context.gc.controllers.keyboard as KeyboardController
  }

  public update(delta: number): void {
    super.update(delta)
    const areArrowsPressed = Object.keys(this.kbController.inputs).some(key => this.moveKeysCodesMap[key])
    let newAnimationId = this.getNewAnimationId()

    if (areArrowsPressed) {
      const { up, down, left, right } = moveKeys
      const { [up]: isUp, [down]: isDown, [left]: isLeft, [right]: isRight } = this.kbController.inputs
      const relativeX = 0 + (isLeft ? -1 : 0) + (isRight ? 1 : 0)
      const relativeY = 0 + (isUp ? 1 : 0) + (isDown ? -1 : 0)
      if (relativeX || relativeY) {
        this.movement.angle = Math.atan2(relativeY, relativeX)
        this.move(delta)
        this.fixToScope()
        const newDirMap = {
          front: isDown,
          back: isUp,
          left: isLeft,
          right: isRight,
        }
        const newDirEntry = Object.entries(newDirMap).find(dirEntry => dirEntry[1])!
        newAnimationId = this.getNewAnimationId(newDirEntry[0])
      }
    }
    if (newAnimationId !== this.tilesAnimationId) {
      this.setTilesAnimation(newAnimationId)
    }
  }

  public onCollide({ source, target }: CollisionInfo): void {
    console.log('asdasd')
    solidCollisionResolution(this, source, target)
  }

  private getNewAnimationId(walkingDir?: string) {
    const newDir = walkingDir ?? getAnimationDirFromId(this.tilesAnimationId)
    const mode = walkingDir ? 'walking' : 'stand'
    return `${mode}${newDir[0].toUpperCase()}${newDir.slice(1)}`
  }
}
