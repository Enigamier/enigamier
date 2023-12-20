import { Texture } from '@/textures'
import type { AssetContext } from './Asset'
import { Asset } from './Asset'

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
    this.scope = {
      ...this.scope,
      endX: map.cols * map.tileSize,
      endY: map.rows * map.tileSize,
    }
    this.size = { width: this.scope.endX, height: this.scope.endY }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    super.render(ctx)
    if (this.tiles) {
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

export class TileMapAsset extends Asset {
  public id: string

  declare public texture: TileMapTexture

  constructor(id: string, atlas: TilesAtlas, map: TilesMap) {
    super(new TileMapTexture(atlas, map))
    this.id = id
  }

  public load(context: AssetContext): void {
    super.load(context)
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
