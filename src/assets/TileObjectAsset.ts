import type { TilesAtlas } from '@/textures'
import { TileObjectTexture } from '@/textures'
import { CollidableAsset } from './CollidableAsset'
import type { AssetContext } from './Asset'

class ClockInterval {

  private lastCheck = 0

  private readonly tickLength: number

  private readonly updateCallback: () => void

  constructor(tickLength: number, updateCallback: () => void) {
    this.tickLength = tickLength
    this.updateCallback = updateCallback
  }

  public check(delay: number) {
    this.lastCheck += delay
    if (this.lastCheck >= this.tickLength) {
      this.queueUpdates(Math.floor(this.lastCheck / this.tickLength))
      this.lastCheck = this.lastCheck % this.tickLength
    }
  }

  private queueUpdates(ticks: number) {
    for (let i = 0; i < ticks; i++) {
      this.updateCallback()
    }
  }
}

export interface TilesAnimationInfo {
  interval?: number;
  tiles: number[];
}

export type TilesAnimationMap = Record<string, TilesAnimationInfo>

export abstract class TileObjectAsset extends CollidableAsset {
  declare public texture: TileObjectTexture

  protected readonly tilesAnimationsMap: TilesAnimationMap = { default: { tiles: [1] } }

  protected tilesAnimationId = 'default'

  private currentTilesAnimationIndex = 0

  private tilesAnimationClock: ClockInterval | undefined

  constructor(atlas: TilesAtlas) {
    super(new TileObjectTexture(atlas))
  }

  protected get tilesAnimation() {
    return this.tilesAnimationsMap[this.tilesAnimationId]
  }

  public load(context: AssetContext): void {
    super.load(context)
    this.setTilesAnimation(this.tilesAnimationId)
  }

  public update(delta: number): void {
    if (this.tilesAnimationClock) {
      this.tilesAnimationClock.check(delta)
    }
  }

  public setTilesAnimation(id: string) {
    if (this.tilesAnimationsMap[id]) {
      const { interval } = this.tilesAnimationsMap[id]
      this.tilesAnimationId = id
      this.currentTilesAnimationIndex = 0
      this.updateAnimationTile()
      if (interval) {
        this.tilesAnimationClock = new ClockInterval(interval, this.incrementAnimationTile.bind(this))
      } else if (this.tilesAnimationClock) {
        delete this.tilesAnimationClock
      }
    }
  }

  private updateAnimationTile() {
    this.texture.tile = this.tilesAnimation.tiles[this.currentTilesAnimationIndex]
  }

  private incrementAnimationTile() {
    this.currentTilesAnimationIndex = (this.currentTilesAnimationIndex + 1) % this.tilesAnimation.tiles.length
    this.updateAnimationTile()
  }
}
