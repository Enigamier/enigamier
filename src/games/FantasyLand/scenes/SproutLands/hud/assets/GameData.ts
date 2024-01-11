import { BaseAsset, Texture } from '@/index'

import { gameData } from '../../../../game-data'

import spriteImgSrc from '../imgs/sprite.png'

const tileSize = 16

class GameDataTexture extends Texture {
  private readonly sprite: CanvasImageSource

  constructor() {
    super()
    const spriteImg = new Image()
    spriteImg.src = spriteImgSrc
    this.sprite = spriteImg
  }

  public render(ctx: CanvasRenderingContext2D): void {
    const { lifes, points } = gameData

    // Base counter
    ctx.drawImage(this.sprite, 8, 3, 41, 41, 0, 0, 200, 200)

    // Hearts
    const hTileX = 48
    const fullHTileY = 0
    const halfHTileY = tileSize
    const hSize = 82
    const hFromX = -7
    const hY = 3
    const hGap = hSize - 33.5
    let lifesI = 0
    for (; lifesI < Math.floor(lifes / 2); lifesI++) {
      ctx.drawImage(this.sprite, hTileX, fullHTileY, tileSize, tileSize, hFromX + (hGap * lifesI), hY, hSize, hSize)
    }
    if (lifes % 2) {
      ctx.drawImage(this.sprite, hTileX, halfHTileY, tileSize, tileSize, hFromX + (hGap * lifesI), hY, hSize, hSize)
    }

    // Points
    ctx.font = '32px SproutLands'
    ctx.fillStyle = '#b68962'
    ctx.textAlign = 'right'
    ctx.fillText(points.toString(), 157, 173)
  }
}

export class GameDataAsset extends BaseAsset {
  public id = 'GameData'

  constructor() {
    super(new GameDataTexture())
  }
}
