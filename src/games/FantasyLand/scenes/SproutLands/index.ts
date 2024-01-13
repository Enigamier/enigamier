import type { SceneContext, RectSize, HudScene } from '@/index'
import { ScrollableScene } from '@/index'

import { getTileAtlasFromData, getTileMapFromData } from '../../utils/parsers'
import type { TileAtlasInfo } from '../../utils/models'
import { MapLayerAsset } from '../../assets/MapLayerAsset'

import terrainTilesetImageSrc from './imgs/terrain-tileset.png'
import tilesetData from './tilesets/terrain.json'
import mapData from './maps/main.json'
import { SproutDoorAsset } from './assets/SproutDoor'
import { SproutHeroAsset } from './assets/Hero'
import { CowAsset } from './assets/Cow'
import { SproutHudScene } from './hud'

const tilesMap = getTileMapFromData(mapData)

export class SproutLandsScene extends ScrollableScene {
  public readonly id = 'SproutLands'

  protected hud: HudScene = new SproutHudScene()

  protected mapSize: RectSize = {
    width: tilesMap.tileSize * tilesMap.cols,
    height: tilesMap.tileSize * tilesMap.rows,
  }

  private readonly tilesAtlas: TileAtlasInfo

  constructor() {
    super()
    this.tilesAtlas = getTileAtlasFromData(tilesetData, terrainTilesetImageSrc)
  }

  public load(context: SceneContext): void {
    const { width, height } = this.mapSize

    const doorPosition = {
      x: 15 * tilesMap.tileSize,
      y: 43 * tilesMap.tileSize,
    }
    const doorAsset = new SproutDoorAsset('Door', doorPosition, tilesMap.tileSize)
    doorAsset.index = 4
    this.addAsset(doorAsset)

    const heroScope = { startX: 0, startY: 0, endX: width, endY: height }
    const heroAsset = new SproutHeroAsset(
      tilesMap.tileSize * 3,
      this.onHeroDie.bind(this),
      this.onHeroCollide.bind(this),
    )
    heroAsset.scope = heroScope
    heroAsset.position = { x: 13 * tilesMap.tileSize, y: 12 * tilesMap.tileSize }
    heroAsset.index = 3
    this.addAsset(heroAsset)

    const cowPosition = {

      // x: 14.5 * tilesMap.tileSize,
      // y: 43 * tilesMap.tileSize,
      x: 16 * tilesMap.tileSize,
      y: 13 * tilesMap.tileSize,
    }
    const cowAsset = new CowAsset('Cow', tilesMap.tileSize * 2)
    cowAsset.scope = heroScope
    cowAsset.position = cowPosition
    cowAsset.index = 4
    this.addAsset(cowAsset)

    tilesMap.layers.forEach((mapLayer, index) => {
      const mapLayerAsset = new MapLayerAsset(`map-layer-${index}`, this.tilesAtlas, tilesMap)
      mapLayerAsset.setTiles(mapLayer.data)
      mapLayerAsset.visible = mapLayer.visible
      mapLayerAsset.type = mapLayer.class
      mapLayerAsset.index = index
      this.addAsset(mapLayerAsset)
    })

    this.followAsset('SproutHero')
    super.load(context)
  }

  private onHeroDie() {
    console.log('Hero died!')
  }

  private onHeroCollide(kind?: string) {
    if (kind === 'house') {
      this.assetsList
        .filter(layer => layer instanceof MapLayerAsset && layer.type === 'roof')
        .forEach(layer => (layer as MapLayerAsset).visible = false)
    }
  }
}
