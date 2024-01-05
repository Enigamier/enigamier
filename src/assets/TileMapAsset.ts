import type { TilesAtlas, TilesMap } from '@/textures'
import { TileMapTexture } from '@/textures'
import { Asset } from './Asset'

export abstract class TileMapAsset extends Asset {
  declare public texture: TileMapTexture

  constructor(atlas: TilesAtlas, map: TilesMap) {
    super(new TileMapTexture(atlas, map))
    this.scope.endX += this.texture.size.width
    this.scope.endY += this.texture.size.height
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
