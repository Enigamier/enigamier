import { CollideEntityTypes, TileMapAsset } from '@/index'
import type { RectangleCollideEntity, TilesAtlas, TilesMap } from '@/index'

import terrainTiles from '../imgs/terrain.json'

interface TileObjectInfo {
  x: number;
  y: number;
  width: number;
  height: number;
  kind: string;
}

export class MapLayerAsset extends TileMapAsset {
  public id: string

  private mapCollisionEntities: RectangleCollideEntity[] = []

  constructor(id: string, atlas: TilesAtlas, map: TilesMap) {
    super(atlas, map)
    this.id = id
  }

  public get collideEntities(): RectangleCollideEntity[] {
    return this.mapCollisionEntities
  }

  private get tileCollisionObjectsMap(): Record<number, TileObjectInfo[]> {
    const tilesEntitiesMap: Record<number, TileObjectInfo[]> = {}
    if (Array.isArray(terrainTiles.tiles)) {
      terrainTiles.tiles.forEach(tileInfo => {
        tilesEntitiesMap[tileInfo.id] = tileInfo.objectgroup?.objects.map(
          ({ x, y, width, height, type }) => ({
            x: Math.round(x * this.tileSizeDelta),
            y: Math.round(y * this.tileSizeDelta),
            width: Math.round(width * this.tileSizeDelta),
            height: Math.round(height * this.tileSizeDelta),
            kind: type,
          }),
        )
      })
    }
    return tilesEntitiesMap
  }

  public setTiles(tiles: number[]) {
    this.texture.tiles = tiles
    this.updateMapCollideEntities()
  }

  private updateMapCollideEntities() {
    this.mapCollisionEntities = this.texture.tiles
      .map((mapTileId, tileIndex) => {
        const tileId = mapTileId - 1
        let collideEntities: RectangleCollideEntity[] = []
        if (this.tileCollisionObjectsMap[tileId]) {
          const { cols, tileSize } = this.texture.map
          const row = Math.floor(tileIndex / cols)
          const col = tileIndex % cols
          collideEntities = this.tileCollisionObjectsMap[tileId].map(({ x, y, width, height, kind }) => {
            const startX = this.globalCoords.startX + (col * tileSize) + x
            const startY = this.globalCoords.startY + (row * tileSize) + y
            return {
              type: CollideEntityTypes.rectangle,
              data: { startX, startY, endX: startX + width, endY: startY + height },
              kind,
            }
          })
        }
        return collideEntities
      })
      .filter(tileEntities => tileEntities.length)
      .flat()
  }
}
