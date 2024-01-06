import type { TileAtlasInfo, TileMapData, TileMapInfo, TilesetData } from './models'

export function getTileAtlasFromData(data: TilesetData, imgSrc: string): TileAtlasInfo {
  const { columns: cols, tileheight: tileSize, tiles, tilecount } = data
  const image = new Image()
  image.src = imgSrc
  return {
    cols,
    image,
    tileSize,
    rows: tilecount / cols,
    tilesData: tiles,
  }
}

export function getTileMapFromData(data: TileMapData, tileSize?: number): TileMapInfo {
  return {
    cols: data.width,
    rows: data.height,
    tileSize: tileSize ?? data.tileheight,
    layers: data.layers,
  }
}
