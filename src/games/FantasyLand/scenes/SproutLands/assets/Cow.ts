import type {
  AssetContext,
  AssetMovement,
  AudioEffectInfo,
  CollisionInfo,
  PointCoords,
  RectangleCollideEntity,
  TilesAnimationMap,
  TilesAtlas,
} from '@/index'
import { ClockInterval, CollideEntityTypes, TileObjectAsset, solidCollisionResolution } from '@/index'

import type { SproutHeroAsset } from './Hero'
import cowTilesetImageSrc from '../imgs/cow-tileset.png'
import mooningCowAudioSrc from '../audio/mooing-cow.mp3'

const actionOffsetDelta = 1
const speed = 100
const attackDamage = 1
const attackInterval = 500
const mooningInterval = 2000

export class SproutCowAsset extends TileObjectAsset {
  public readonly id: string

  public movement: AssetMovement = { angle: 0, speed }

  public smelling = false

  public attacking = false

  public attackingClock?: ClockInterval

  public mooningClock?: ClockInterval

  protected tilesAnimationsMap: TilesAnimationMap = ['left', 'right'].reduce((map, dir) => {
    return {
      ...map,
      [`stand-${dir}`]: {
        tiles: [1, 2, 3],
        interval: 1000,
        flip: dir === 'left',
      },
      [`walking-${dir}`]: {
        tiles: [4, 5],
        interval: 400,
        flip: dir === 'left',
      },
    }
  }, {})

  protected tilesAnimationId = 'stand-right'

  protected audioEffectsInfo: Record<string, AudioEffectInfo> = {
    mooning: {
      src: mooningCowAudioSrc,
      loadDuration: .1,
      offset: .4,
      gain: .5,
    },
  }

  private static readonly atlas: TilesAtlas

  constructor(id: string, position: PointCoords, size: number) {
    super(SproutCowAsset.getAtlas())
    this.id = id
    this.texture.size = { width: size, height: size }
    this.position = position
  }

  public get collideEntities(): RectangleCollideEntity[] {
    const { startX, startY, endX, endY } = this.globalCoords
    const size = this.texture.size.width
    const actionOffset = Math.round(size * actionOffsetDelta)
    const type = CollideEntityTypes.rectangle
    return [
      {
        kind: 'cow',
        type,
        collideWith: ['wall', 'hero'],
        data: {
          startX: startX + size / 4,
          startY: startY + size / 2.5,
          endX: endX - size / 4,
          endY: endY - size / 8,
        },
      },
      {
        kind: 'cow-smell',
        type,
        collideWith: ['hero-action-fruit'],
        data: {
          startX: startX - actionOffset,
          startY: startY - actionOffset,
          endX: endX + actionOffset,
          endY: endY + actionOffset,
        },
      },
    ]
  }

  public async load(context: AssetContext) {
    super.load(context)
  }

  public update(delta: number): void {
    super.update(delta)
    const [_mode, dir] = this.tilesAnimationId.split('-')
    let newAnimationId = `stand-${dir}`

    if (this.smelling) {
      this.move(delta)
      this.mooningClock?.check(delta)
      const dir = Math.cos(this.movement.angle) > 0 ? 'right' : 'left'
      newAnimationId = `walking-${dir}`
    } else if (this.mooningClock) {
      delete this.mooningClock
    }
    this.smelling = false

    if (this.attacking && this.attackingClock) {
      this.attackingClock.check(delta)
    }
    this.attacking = false

    if (newAnimationId !== this.tilesAnimationId) {
      this.setTilesAnimation(newAnimationId)
    }
  }

  public onCollide({ asset, source, target }: CollisionInfo): void {
    switch (source.kind) {
      case 'cow':
        switch (target.kind) {
          case 'wall':
            solidCollisionResolution(this, source, target)
            break
          case 'hero':
            if (!this.attackingClock) {
              this.attackingClock = new ClockInterval(
                attackInterval,
                this.hitHero.bind(this, asset as SproutHeroAsset),
              )
            }
            this.attacking = true
        }
        break
      case 'cow-smell': {
        const { x: targetX, y: targetY } = asset.globalCenterPoint
        const { x, y } = this.globalCenterPoint
        this.movement.angle = (2 * Math.PI) - Math.atan2(targetY - y, targetX - x)
        if (!this.mooningClock) {
          this.playAudioEffect('mooning')
          this.mooningClock = new ClockInterval(
            mooningInterval,
            () => this.playAudioEffect('mooning'),
          )
        }
        this.smelling = true
      }
    }
  }

  private hitHero(heroAsset: SproutHeroAsset) {
    heroAsset.hit(attackDamage)
  }

  private static getAtlas() {
    let atlas = SproutCowAsset.atlas
    if (!atlas) {
      const cowAtlasImage = new Image()
      cowAtlasImage.src = cowTilesetImageSrc
      atlas = {
        cols: 3,
        rows: 2,
        image: cowAtlasImage,
        tileSize: 32,
      }
    }
    return atlas
  }
}
