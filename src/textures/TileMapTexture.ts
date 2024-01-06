import { Texture } from './Texture'

export interface TilesAtlas {
  image: HTMLImageElement;
  tileSize: number;
  rows: number;
  cols: number;
}

export interface TilesMap {
  tileSize: number;
  rows: number;
  cols: number;
}

interface TileMapVisibleArea {
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
}

export class TileMapTexture extends Texture {
  public tiles: number[] = []

  public visibleArea: TileMapVisibleArea

  public readonly atlas: TilesAtlas

  public readonly map: TilesMap

  constructor(atlas: TilesAtlas, map: TilesMap) {
    super()
    this.atlas = atlas
    this.map = map
    this.visibleArea = {
      startRow: 0,
      startCol: 0,
      endRow: map.rows - 1,
      endCol: map.cols - 1,
    }
    this.size = { width: map.cols * map.tileSize, height: map.rows * map.tileSize }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (this.tiles) {
      ctx.imageSmoothingEnabled = false
      const { startRow, startCol, endRow, endCol } = this.visibleArea
      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          const tile = this.getTile(r, c)
          if (tile !== 0) {
            const tileAtlasPos = this.getAtlasTilePos(tile - 1)
            ctx.drawImage(
              this.atlas.image,
              tileAtlasPos.x,
              tileAtlasPos.y,
              this.atlas.tileSize,
              this.atlas.tileSize,
              c * this.map.tileSize,
              r * this.map.tileSize,
              this.map.tileSize,
              this.map.tileSize,
            )
          }
        }
      }
    }
  }

  private getTile(row: number, col: number) {
    return this.tiles[(row * this.map.cols) + col]
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
