import type { SceneContext, RectSize, TilesAtlas, HudScene } from '@/index'
import { ScrollableScene } from '@/index'

import { getTileAtlasFromData, getTileMapFromData } from '../../utils/parsers'
import type { TileAtlasInfo } from '../../utils/models'
import { MapLayerAsset } from '../../assets/MapLayerAsset'
import { HeroAsset } from '../../assets/HeroAsset'

import terrainTilesetImageSrc from './imgs/terrain-tileset.png'
import heroTilesetImageSrc from './imgs/hero-tileset.png'
import tilesetData from './tilesets/terrain.json'
import mapData from './maps/main.json'
import { SproutDoorAsset } from './assets/SproutDoor'
import { SproutHudScene } from './SproutHud'

const tilesMap = getTileMapFromData(mapData)

export class SproutLandsScene extends ScrollableScene {
  public readonly id = 'SproutLands'

  protected hud: HudScene = new SproutHudScene()

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
      startX: 3 * tilesMap.tileSize,
      startY: 2 * tilesMap.tileSize,
      endX: width - (3 * tilesMap.tileSize),
      endY: height - (3 * tilesMap.tileSize),
    }

    const doorAsset = new SproutDoorAsset('Door')
    doorAsset.texture.size = { width: tilesMap.tileSize, height: tilesMap.tileSize }
    const doorStartX = 15 * tilesMap.tileSize
    const doorStartY = 43 * tilesMap.tileSize
    doorAsset.scope = {
      startX: doorStartX,
      startY: doorStartY,
      endX: doorStartX + tilesMap.tileSize,
      endY: doorStartY + tilesMap.tileSize,
    }
    doorAsset.index = 4
    this.addAsset(doorAsset)

    const heroAsset = new HeroAsset('Hero', this.heroTileAtlas, this.onHeroCollide.bind(this))
    heroAsset.texture.size = { width: tilesMap.tileSize, height: tilesMap.tileSize }
    heroAsset.scope = floorScope
    heroAsset.position = { x: 13 * tilesMap.tileSize, y: 12 * tilesMap.tileSize }
    heroAsset.index = 3
    this.addAsset(heroAsset)

    tilesMap.layers.forEach((mapLayer, index) => {
      const mapLayerAsset = new MapLayerAsset(`map-layer-${index}`, this.tilesAtlas, tilesMap)
      mapLayerAsset.setTiles(mapLayer.data)
      mapLayerAsset.visible = mapLayer.visible
      mapLayerAsset.type = mapLayer.class
      mapLayerAsset.index = index
      this.addAsset(mapLayerAsset)
    })

    this.followAsset('Hero')
    super.load(context)
  }

  private onHeroCollide(kind?: string) {
    if (kind === 'house') {
      (this.assetsList as MapLayerAsset[])
        .filter(layer => layer.type === 'roof')
        .forEach(layer => layer.visible = false)
    }
  }
}
