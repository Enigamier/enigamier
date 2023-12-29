import { Texture } from './Texture'
import type { TilesAtlas } from './TileMapTexture'

export class TileObjectTexture extends Texture {
  public tile = 0

  public readonly atlas: TilesAtlas

  constructor(atlas: TilesAtlas) {
    super()
    this.atlas = atlas
  }

  public render(ctx: CanvasRenderingContext2D): void {
    super.render(ctx)
    if (this.tile) {
      const tileAtlasPos = this.getAtlasTilePos(this.tile - 1)
      ctx.drawImage(
        this.atlas.image,
        tileAtlasPos.x,
        tileAtlasPos.y,
        this.atlas.tileSize,
        this.atlas.tileSize,
        this.position.x,
        this.position.y,
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
