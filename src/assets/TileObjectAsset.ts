import type { TilesAtlas } from '@/textures'
import { TileObjectTexture } from '@/textures'
import { ClockInterval } from '@/utils'
import { Asset } from './Asset'
import type { AssetContext } from './Asset'

export interface TilesAnimationInfo {
  tiles: number[];
  interval?: number;
  flip?: boolean;
}

export type TilesAnimationMap = Record<string, TilesAnimationInfo>

export abstract class TileObjectAsset extends Asset {
  declare public texture: TileObjectTexture

  protected readonly tilesAnimationsMap: TilesAnimationMap = { default: { tiles: [1] } }

  protected tilesAnimationId = 'default'

  protected currentTilesAnimationIndex = 0

  private tilesAnimationClock: ClockInterval | undefined

  constructor(atlas: TilesAtlas) {
    super(new TileObjectTexture(atlas))
  }

  protected get tilesAnimation() {
    return this.tilesAnimationsMap[this.tilesAnimationId]
  }

  protected get tileSizeDelta(): number {
    return this.texture.size.height / this.texture.atlas.tileSize
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
      const { interval, flip } = this.tilesAnimationsMap[id]
      this.tilesAnimationId = id
      this.currentTilesAnimationIndex = 0
      this.texture.flip = flip === true
      this.updateAnimationTile()
      if (interval) {
        this.tilesAnimationClock = new ClockInterval(interval, this.incrementAnimationTile.bind(this))
      } else if (this.tilesAnimationClock) {
        delete this.tilesAnimationClock
      }
    }
  }

  protected onTilesAnimationEnds?(): void

  private updateAnimationTile() {
    this.texture.tile = this.tilesAnimation.tiles[this.currentTilesAnimationIndex]
  }

  private incrementAnimationTile() {
    const animationEnds = this.currentTilesAnimationIndex + 1 === this.tilesAnimation.tiles.length
    this.currentTilesAnimationIndex = (this.currentTilesAnimationIndex + 1) % this.tilesAnimation.tiles.length
    this.updateAnimationTile()
    if (animationEnds && this.onTilesAnimationEnds) {
      this.onTilesAnimationEnds()
    }
  }
}
