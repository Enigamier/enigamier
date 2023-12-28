import type { TilesAtlas, TilesMap } from '@/textures'
import { TileMapTexture } from '@/textures'
import { CollidableAsset } from './CollidableAsset'

export abstract class TileMapAsset extends CollidableAsset {
  declare public texture: TileMapTexture

  constructor(atlas: TilesAtlas, map: TilesMap) {
    super(new TileMapTexture(atlas, map))
  }

  protected get tileSizeDelta(): number {
    return this.texture.map.tileSize / this.texture.atlas.tileSize
  }

  public render(ctx: CanvasRenderingContext2D): void {
    this.updateVisibleArea()
    super.render(ctx)
  }

  private updateVisibleArea() {
    if (this.context.camera) {
      const { x, y, width, height } = this.context.camera
      const { map: { tileSize, rows, cols } } = this.texture
      const startRow = Math.floor(y / tileSize)
      const startCol = Math.floor(x / tileSize)
      this.texture.visibleArea = {
        startRow,
        startCol,
        endRow: Math.min(startRow + Math.ceil(height / tileSize), rows - 1),
        endCol: Math.min(startCol + Math.ceil(width / tileSize), cols - 1),
      }
    }
  }
}
