import type { SceneContext, RectSize, RectCoords, Asset, PointCoords } from '@/index'
import { ScrollableScene } from '@/index'

import { getTileAtlasFromData, getTileMapFromData } from '../utils/parsers'
import type {
  ObjectLayerData,
  TileAtlasInfo,
  TileLayerData,
  TileMapData,
  TileMapInfo,
  TilesetData,
} from '../utils/models'
import { MapLayerAsset } from '../assets/MapLayerAsset'

export interface ObjectInitInfo {
  class: ObjectClass;
  scope?: RectCoords;
  listeners?: Record<string, (asset: Asset, payload: unknown) => void>;
}

type ObjectClass = new(id: string, position: PointCoords, size: number) => Asset

export abstract class BaseScene extends ScrollableScene {
  protected abstract readonly objectInitInfoMap: Record<string, ObjectInitInfo>

  protected readonly mapSize: RectSize

  protected readonly tileMap: TileMapInfo

  private readonly tilesAtlas: TileAtlasInfo

  constructor(tilesetData: TilesetData, tilesetImgSrc: string, tileMapData: TileMapData) {
    super()
    this.tilesAtlas = getTileAtlasFromData(tilesetData, tilesetImgSrc)
    this.tileMap = getTileMapFromData(tileMapData)
    this.mapSize = {
      width: this.tileMap.tileSize * this.tileMap.cols,
      height: this.tileMap.tileSize * this.tileMap.rows,
    }
  }

  protected get objectLayerIndex(): number {
    const objectLayerIndex = this.tileMap.layers.findIndex(layer => layer.type === 'objectgroup')
    return objectLayerIndex >= 0 ? objectLayerIndex : 1
  }

  public load(context: SceneContext): void {
    this.addMapLayers()
    super.load(context)
  }

  protected addMapLayers() {
    this.tileMap.layers.forEach((mapLayer, index) => {
      switch (mapLayer.type) {
        case 'objectgroup':
          this.addObjectLayer(mapLayer, index)
          break
        case 'tilelayer':
          this.addTileLayer(mapLayer, index)
      }
    })
  }

  private addObjectLayer(layer: ObjectLayerData, index: number) {
    layer.objects.forEach(data => {
      const id = data.name.length > 0 ? data.name : `${data.type}-${data.id}`
      const position = { x: data.x, y: data.y }
      const size = data.width
      const objectInitInfo = this.objectInitInfoMap[data.type]
      if (objectInitInfo) {
        const { class: objectClass, scope, listeners = {} } = objectInitInfo
        const asset = new objectClass(id, position, size) as Asset & Record<string, unknown>
        asset.scope = scope ?? asset.scope
        asset.index = index
        data.properties?.forEach(prop => asset[prop.name] = prop.value)
        Object.entries(listeners).forEach(
          ([eventId, listener]) => asset.addEventListener(eventId, payload => listener(asset, payload)),
        )
        this.addAsset(asset)
      }
    })
  }

  private addTileLayer(layer: TileLayerData, index: number) {
    const id = typeof layer.name === 'string' && layer.name.length ? layer.name : `map-layer-${index}`
    const mapLayerAsset = new MapLayerAsset(id, this.tilesAtlas, this.tileMap)
    mapLayerAsset.tiles = layer.data
    mapLayerAsset.visible = layer.visible
    mapLayerAsset.type = layer.class
    mapLayerAsset.index = index
    this.addAsset(mapLayerAsset)
  }
}
