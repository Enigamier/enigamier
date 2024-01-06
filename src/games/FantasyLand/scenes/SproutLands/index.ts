import type { SceneContext, RectSize, TilesAtlas } from '@/index'
import { ScrollableScene } from '@/index'

import { getTileAtlasFromData, getTileMapFromData } from '../../utils/parsers'
import type { TileAtlasInfo } from '../../utils/models'
import { MapLayerAsset } from '../../assets/MapLayerAsset'
import { HeroAsset } from '../../assets/HeroAsset'

import terrainTilesetImageSrc from './imgs/terrain-tileset.png'
import heroTilesetImageSrc from './imgs/hero-tileset.png'
import tilesetData from './tilesets/terrain.json'
import mapData from './maps/main.json'

const tilesMap = getTileMapFromData(mapData)

export class SproutLandsScene extends ScrollableScene {
  public readonly id = 'SproutLands'

  protected mapSize: RectSize = {
    width: tilesMap.tileSize * tilesMap.cols,
    height: tilesMap.tileSize * tilesMap.rows,
  }

  private readonly tilesAtlas: TileAtlasInfo

  private readonly heroTileAtlas: TilesAtlas

  constructor() {
    super()
    this.tilesAtlas = getTileAtlasFromData(tilesetData, terrainTilesetImageSrc)
    const heroAtlasImage = new Image()
    heroAtlasImage.src = heroTilesetImageSrc
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
    heroAsset.index = 2
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
