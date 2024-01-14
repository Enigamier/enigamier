import type { SceneContext, RectSize, HudScene, CollisionInfo, AudioEffectInfo } from '@/index'
import { ScrollableScene } from '@/index'

import { gameData } from '../../game-data'
import { getTileAtlasFromData, getTileMapFromData } from '../../utils/parsers'
import type { TileAtlasInfo } from '../../utils/models'
import { MapLayerAsset } from '../../assets/MapLayerAsset'
import type { LootableAsset } from '../../assets/Lootable'

import { SproutDoorAsset } from './assets/Door'
import { SproutHeroAsset } from './assets/Hero'
import { SproutFruitAsset } from './assets/Fruit'
import { SproutCowAsset } from './assets/Cow'
import { SproutHudScene } from './hud'

import terrainTilesetImageSrc from './imgs/terrain-tileset.png'
import tilesetData from './tilesets/terrain.json'
import bgAudioSrc from './audio/lazy-village.mp3'
import lootAudioSrc from './audio/success.mp3'
import mapData from './maps/main.json'

const tilesMap = getTileMapFromData(mapData)

export class SproutLandsScene extends ScrollableScene {
  public readonly id = 'SproutLands'

  protected bgAudioSrc = bgAudioSrc

  // protected bgAudioVolume = .2
  protected bgAudioVolume = 0

  protected audioEffectsInfo: Record<string, AudioEffectInfo> = {
    loot: {
      src: lootAudioSrc,
      loadOffset: 1.5,
      duration: 1.2,
    },
  }

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
    heroAsset.position = { x: 13 * tilesMap.tileSize, y: 45 * tilesMap.tileSize }
    heroAsset.index = 3
    this.addAsset(heroAsset)

    const fruitPosition = {
      x: 16 * tilesMap.tileSize,
      y: 45 * tilesMap.tileSize,
    }
    const fruitAsset = new SproutFruitAsset('Fruit', fruitPosition, tilesMap.tileSize)
    fruitAsset.index = 3
    this.addAsset(fruitAsset)

    const cowPosition = {
      x: 14.5 * tilesMap.tileSize,
      y: 43.25 * tilesMap.tileSize,
    }
    const cowAsset = new SproutCowAsset('Cow', tilesMap.tileSize * 2)
    cowAsset.scope = heroScope
    cowAsset.position = cowPosition
    cowAsset.index = 3
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

  private onHeroCollide({ asset, target }: CollisionInfo) {
    if (target.kind === 'house') {
      this.assetsList
        .filter(layer => layer instanceof MapLayerAsset && layer.type === 'roof')
        .forEach(layer => (layer as MapLayerAsset).visible = false)
    } else if (target.kind === 'loot') {
      this.onLoot(asset as LootableAsset)
    }
  }

  private onLoot(asset: LootableAsset) {
    const items = gameData.sproutLands.items
    switch (asset.kind) {
      case 'fruit':
        if (!items.includes(asset.kind)) {
          items.push(asset.kind)
          this.removeAsset(asset)
          this.playAudioEffect('loot')
        }
    }
  }
}
