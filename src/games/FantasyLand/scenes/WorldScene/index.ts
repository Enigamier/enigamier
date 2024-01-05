import type { SceneContext, RectSize, TilesMap, TilesAtlas } from '@/index'
import { ScrollableScene } from '@/index'

import { MapLayerAsset } from './assets/MapLayerAsset'
import atlasImageSrc from './imgs/terrain.png'
import worldMapData from './maps/world-map.json'
import { RectangleAsset } from '../assets/Rectangle'
import { HeroAsset } from './assets/HeroAsset'

const tilesMap: TilesMap = {
  rows: 45,
  cols: 52,
  tileSize: 48,
}

export class WorldScene extends ScrollableScene {
  public readonly id = 'World'

  protected mapSize: RectSize = {
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
    firstRectangleAsset.position = { x: 16 * tilesMap.tileSize, y: 12 * tilesMap.tileSize }
    firstRectangleAsset.index = 1
    firstRectangleAsset.movement.speed = 300
    firstRectangleAsset.scope = rectanglesScope
    this.addAsset(firstRectangleAsset)

    const heroAsset = new HeroAsset()
    heroAsset.texture.size = { width: tilesMap.tileSize, height: tilesMap.tileSize }
    heroAsset.scope = rectanglesScope
    heroAsset.position = { x: 13 * tilesMap.tileSize, y: 12 * tilesMap.tileSize }
    heroAsset.index = 1
    this.addAsset(heroAsset)

    worldMapData.layers.forEach((mapLayer, index) => {
      const mapLayerAsset = new MapLayerAsset(`map-layer-${mapLayer.id}`, this.tilesAtlas, tilesMap)
      mapLayerAsset.setTiles(mapLayer.data)
      mapLayerAsset.index = index
      this.addAsset(mapLayerAsset)
    })

    this.followAsset('Rectangle')
    super.load(context)
  }
}
