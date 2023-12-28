import type { SceneContext, TextureSize, TilesMap, TilesAtlas } from '@/index'
import { ScrollableScene } from '@/index'

import { MapLayerAsset } from './assets/MapLayerAsset'
import atlasImageSrc from './imgs/terrain.png'
import worldMapData from './maps/world-map.json'
import { RectangleAsset } from '../ExampleScene/assets/Rectangle'

const tilesMap: TilesMap = {
  rows: 71,
  cols: 88,
  tileSize: 32,
}

export class WorldScene extends ScrollableScene {
  public readonly id = 'World'

  protected mapSize: TextureSize = {
    width: tilesMap.tileSize * tilesMap.cols,
    height: tilesMap.tileSize * tilesMap.rows,
  }

  private readonly tilesAtlas: TilesAtlas

  constructor() {
    super()
    const atlasImage = new Image()
    atlasImage.src = atlasImageSrc
    this.tilesAtlas = {
      cols: 6,
      rows: 8,
      image: atlasImage,
      tileSize: 16,
    }
  }

  public load(context: SceneContext): void {
    worldMapData.layers.forEach(mapLayer => {
      const mapLayerAsset = new MapLayerAsset(`map-layer-${mapLayer.id}`, this.tilesAtlas, tilesMap)
      mapLayerAsset.setTiles(mapLayer.data)
      mapLayerAsset.texture.index = mapLayer.id
      this.addAsset(mapLayerAsset)
    })

    const { width, height } = this.mapSize
    const rectanglesScope = {
      startX: 0,
      startY: 0,
      endX: width,
      endY: height,
    }
    const firstRectangleAsset = new RectangleAsset({
      up: 'ArrowUp',
      down: 'ArrowDown',
      left: 'ArrowLeft',
      right: 'ArrowRight',
    })
    firstRectangleAsset.id = 'Rectangle'
    firstRectangleAsset.texture.color = 'darkgreen'
    firstRectangleAsset.texture.size = { width: tilesMap.tileSize, height: tilesMap.tileSize }
    firstRectangleAsset.texture.position = { x: 40 * tilesMap.tileSize, y: 30 * tilesMap.tileSize }
    firstRectangleAsset.texture.index = 2
    firstRectangleAsset.movement.speed = 300
    firstRectangleAsset.texture.scope = rectanglesScope

    this.addAsset(firstRectangleAsset)

    this.followAsset('Rectangle')
    super.load(context)
  }
}
