import { Texture } from './Texture'
import type { TilesAtlas } from './TileMapTexture'

export class TileObjectTexture extends Texture {
  public readonly atlas: TilesAtlas

  public tile = 0

  public flip = false

  constructor(atlas: TilesAtlas) {
    super()
    this.atlas = atlas
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (this.tile) {
      const tileAtlasPos = this.getAtlasTilePos(this.tile - 1)
      if (this.flip) {
        ctx.translate(this.size.width, 0)
        ctx.scale(-1, 1)
      }
      ctx.drawImage(
        this.atlas.image,
        tileAtlasPos.x,
        tileAtlasPos.y,
        this.atlas.tileSize,
        this.atlas.tileSize,
        0,
        0,
        this.size.width,
        this.size.height,
      )
    }
  }

  private getAtlasTilePos(index: number) {
    const { tileSize, cols } = this.atlas
    const row = Math.floor(index / cols)
    const col = index % cols
    return {
      x: col * tileSize,
      y: row * tileSize,
    }
  }
}
