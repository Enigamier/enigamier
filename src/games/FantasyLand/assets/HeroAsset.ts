import type {
  AssetContext,
  CollisionInfo,
  KeyboardController,
} from '@/index'
import { TileObjectAsset, solidCollisionResolution } from '@/index'

import type { DoorAsset } from './DoorAsset'

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

export abstract class HeroAsset extends TileObjectAsset {
  protected tilesAnimationId = 'stand-front'

  protected kbController!: KeyboardController

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
        newAnimationId = this.getNewAnimationId('walking', newDirEntry[0])
      }
    }
    if (newAnimationId !== this.tilesAnimationId) {
      this.setTilesAnimation(newAnimationId)
    }
  }

  public onCollide({ asset, source, target }: CollisionInfo): void {
    if (target.kind === 'wall') {
      solidCollisionResolution(this, source, target)
    } else if (target.kind === 'door') {
      (asset as DoorAsset).colliding = true
    }
  }

  protected getNewAnimationId(newMode?: string, newDir?: string) {
    const [oldMode, oldDir, ...rest] = this.tilesAnimationId.split('-')
    const mode = newMode ?? (oldMode !== 'action' ? 'stand' : 'action')
    const dir = newDir ?? oldDir
    return [mode, dir, ...rest].join('-')
  }
}
