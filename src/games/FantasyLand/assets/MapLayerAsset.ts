import { CollideEntityTypes, TileMapAsset } from '@/index'
import type { RectangleCollideEntity, TilesMap } from '@/index'

import type { TileAtlasInfo, TileObjectData } from '../utils/models'

export class MapLayerAsset extends TileMapAsset {
  public id: string

  private mapCollisionEntities: RectangleCollideEntity[] = []

  private readonly atlas: TileAtlasInfo

  constructor(id: string, atlas: TileAtlasInfo, map: TilesMap) {
    super(atlas, map)
    this.id = id
    this.atlas = atlas
  }

  public get collideEntities(): RectangleCollideEntity[] {
    return this.mapCollisionEntities
  }

  private get tileCollisionObjectsMap(): Record<number, TileObjectData[]> {
    const tilesEntitiesMap: Record<number, TileObjectData[]> = {}
    if (Array.isArray(this.atlas.tilesData)) {
      this.atlas.tilesData
        .filter(tileInfo => tileInfo.objectgroup)
        .forEach(tileInfo => {
          tilesEntitiesMap[tileInfo.id] = tileInfo.objectgroup!.objects.map(
            ({ x, y, width, height, ...rest }) => ({
              ...rest,
              x: Math.round(x * this.tileSizeDelta),
              y: Math.round(y * this.tileSizeDelta),
              width: Math.round(width * this.tileSizeDelta),
              height: Math.round(height * this.tileSizeDelta),
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
          collideEntities = this.tileCollisionObjectsMap[tileId].map(({ x, y, width, height, type }) => {
            const startX = this.globalCoords.startX + (col * tileSize) + x
            const startY = this.globalCoords.startY + (row * tileSize) + y
            return {
              type: CollideEntityTypes.rectangle,
              data: { startX, startY, endX: startX + width, endY: startY + height },
              kind: type,
            }
          })
        }
        return collideEntities
      })
      .filter(tileEntities => tileEntities.length)
      .flat()
  }
}
