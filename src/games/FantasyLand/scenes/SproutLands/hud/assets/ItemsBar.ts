import { BaseAsset, Texture } from '@/index'

import { gameData } from '../../../../game-data'

import spriteImgSrc from '../imgs/items-bar.png'

const tileSize = 16
const itemsTilesIndex = ['can', 'axe', 'pick', 'rock', 'grain', 'wood', 'fruit']

class ItemsBarTexture extends Texture {
  private readonly sprite: CanvasImageSource

  constructor() {
    super()
    const spriteImg = new Image()
    spriteImg.src = spriteImgSrc
    this.sprite = spriteImg
  }

  public render(ctx: CanvasRenderingContext2D): void {
    const { items } = gameData.sproutLands
    if (items.length) {
      ctx.scale(3, 3)
      const offsetX = tileSize * (1 + items.length * 1.5)

      ctx.translate(-offsetX, 0)
      ctx.font = `${tileSize * .75}px SproutLands`
      ctx.fillStyle = 'whitesmoke'
      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'

      this.renderTiles(ctx, 0, 0, 1, 4, 0, 0)
      this.renderBarBorders(ctx)
      this.renderTiles(ctx, 4, 0, 1, 4, 1 + (items.length * 3), 0)

      this.renderItems(ctx)
    }
  }

  private renderTiles(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    dX: number,
    dY: number,
  ) {
    ctx.drawImage(
      this.sprite,
      x * tileSize,
      y * tileSize,
      width * tileSize,
      height * tileSize,
      dX * tileSize,
      dY * tileSize,
      width * tileSize,
      height * tileSize,
    )
  }

  private renderBarBorders(ctx: CanvasRenderingContext2D) {
    const { items } = gameData.sproutLands
    for (let index = 0; index < items.length; index++) {
      const targetX = 1 + (index * 3)
      this.renderTiles(ctx, 1, 0, 3, 4, targetX, 0)
    }
  }

  private renderItems(ctx: CanvasRenderingContext2D) {
    const { items, activeItem } = gameData.sproutLands
    items.forEach((item, index) => {
      const sourceX = item === activeItem ? 11 : 5
      const itemSourceX = 5 + itemsTilesIndex.findIndex(itemId => item === itemId)
      const targetX = 1.5 + (index * 3)
      ctx.fillText((index + 1).toString(), ((targetX + .55) * tileSize), 2 * tileSize)
      this.renderTiles(ctx, sourceX, 0, 3, 3, targetX, .5)
      this.renderTiles(ctx, itemSourceX, 3, 1, 1, targetX + 1, 1.5)
    })
  }
}

export class ItemsBarAsset extends BaseAsset {
  public id = 'ItemsBar'

  constructor() {
    super(new ItemsBarTexture())
  }
}
