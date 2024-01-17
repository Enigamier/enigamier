import { CollideEntityTypes, TileMapAsset, ClockInterval } from '@/index'
import type { RectangleCollideEntity, TilesAnimationInfo, TilesMap } from '@/index'

import type { TileAtlasInfo, TileObjectData } from '../utils/models'

export interface MapTileCollideEntity extends RectangleCollideEntity {
  tileIndex: number;
}

export class MapLayerAsset extends TileMapAsset {
  declare public id: string

  public visible = true

  public type?: string

  private readonly atlas: TileAtlasInfo

  private mapCollisionEntities: MapTileCollideEntity[] = []

  private tilesAnimationsTimers: Record<number, { clock: ClockInterval; index: number }> = {}

  private loadedTiles: number[] = []

  constructor(id: string, atlas: TileAtlasInfo, map: TilesMap) {
    super(atlas, map)
    this.id = id
    this.atlas = atlas
  }

  public get collideEntities(): MapTileCollideEntity[] {
    return this.mapCollisionEntities
  }

  public get tiles(): number[] {
    return this.loadedTiles
  }

  public set tiles(tiles: number[]) {
    this.loadedTiles = tiles
    this.texture.tiles = tiles
    this.updateMapCollideEntities()
    this.startTilesAnimations()
  }

  private get tilesAnimationsMap(): Record<number, TilesAnimationInfo> {
    const tilesAnimationsMap: Record<number, TilesAnimationInfo> = {}
    if (Array.isArray(this.atlas.tilesData)) {
      this.atlas.tilesData
        .filter(tileInfo => tileInfo.animation && tileInfo.animation.length > 0)
        .forEach(tileInfo => {
          tilesAnimationsMap[tileInfo.id] = {
            interval: tileInfo.animation![0].duration,
            tiles: tileInfo.animation!.map(frame => frame.tileid),
          }
        })
    }
    return tilesAnimationsMap
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

  public update(delta: number): void {
    if (this.visible) {
      Object.values(this.tilesAnimationsTimers).forEach(({ clock }) => clock.check(delta))
    }
    this.visible = true
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (this.visible) {
      super.render(ctx)
    }
  }

  private startTilesAnimations(): void {
    this.tilesAnimationsTimers = {}
    Object.entries(this.tilesAnimationsMap).forEach(([id, animation]) => {
      this.tilesAnimationsTimers[parseInt(id)] = {
        clock: new ClockInterval(animation.interval!, () => this.incrementTileAnimation(parseInt(id))),
        index: 0,
      }
    })
  }

  private incrementTileAnimation(id: number) {
    const { tiles } = this.tilesAnimationsMap[id]
    const { index } = this.tilesAnimationsTimers[id]
    const nextIndex = (index + 1) % tiles.length
    const fromTile = tiles[index] + 1
    const targetTile = tiles[nextIndex] + 1
    this.tilesAnimationsTimers[id].index = nextIndex
    this.texture.tiles = this.texture.tiles.map(tile => tile === fromTile ? targetTile : tile)
  }

  private updateMapCollideEntities() {
    this.mapCollisionEntities = this.texture.tiles
      .map((mapTileId, tileIndex) => {
        const tileId = mapTileId - 1
        let collideEntities: MapTileCollideEntity[] = []
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
              tileIndex,
            }
          })
        }
        return collideEntities
      })
      .filter(tileEntities => tileEntities.length)
      .flat()
  }
}
