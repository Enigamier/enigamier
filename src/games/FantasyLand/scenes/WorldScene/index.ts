import type { SceneContext, RectSize, TilesAtlas } from '@/index'
import { ScrollableScene } from '@/index'

import { getTileAtlasFromData, getTileMapFromData } from '../../utils/parsers'
import type { TileAtlasInfo } from '../../utils/models'
import { MapLayerAsset } from '../../assets/MapLayerAsset'
import { HeroAsset } from '../../assets/HeroAsset'

import atlasImageSrc from './imgs/terrain.png'
import tilesetData from './tilesets/terrain.json'
import heroAtlasImageSrc from './imgs/player-tiles.png'
import worldMapData from './maps/world-map.json'

const tilesMap = getTileMapFromData(worldMapData, 37)

export class WorldScene extends ScrollableScene {
  public readonly id = 'World'

  protected mapSize: RectSize = {
    width: tilesMap.tileSize * tilesMap.cols,
    height: tilesMap.tileSize * tilesMap.rows,
  }

  private readonly tilesAtlas: TileAtlasInfo

  private readonly heroTileAtlas: TilesAtlas

  constructor() {
    super()
    this.tilesAtlas = getTileAtlasFromData(tilesetData, atlasImageSrc)
    const heroAtlasImage = new Image()
    heroAtlasImage.src = heroAtlasImageSrc
    this.heroTileAtlas = {
      cols: 4,
      rows: 4,
      image: heroAtlasImage,
      tileSize: 16,
    }
  }

  public load(context: SceneContext): void {
    const { width, height } = this.mapSize
    const floorScope = {
      startX: 0,
      startY: 0,
      endX: width,
      endY: height,
    }

    const heroAsset = new HeroAsset('Hero', this.heroTileAtlas)
    heroAsset.texture.size = { width: tilesMap.tileSize, height: tilesMap.tileSize }
    heroAsset.scope = floorScope
    heroAsset.position = { x: 13 * tilesMap.tileSize, y: 12 * tilesMap.tileSize }
    heroAsset.index = 1
    this.addAsset(heroAsset)

    tilesMap.layers.forEach((mapLayer, index) => {
      const mapLayerAsset = new MapLayerAsset(`map-layer-${index}`, this.tilesAtlas, tilesMap)
      mapLayerAsset.setTiles(mapLayer.data)
      mapLayerAsset.index = index
      this.addAsset(mapLayerAsset)
    })

    this.followAsset('Hero')
    super.load(context)
  }
}
