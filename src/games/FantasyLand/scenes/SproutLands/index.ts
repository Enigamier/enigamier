import type { SceneContext, HudScene, CollisionInfo, AudioEffectInfo, PointCoords } from '@/index'

import { gameData } from '../../game-data'
import type { TileMapData } from '../../utils/models'
import type { MapTileCollideEntity } from '../../assets/MapLayerAsset'
import { MapLayerAsset } from '../../assets/MapLayerAsset'
import type { LootableAsset } from '../../assets/Lootable'
import type { ObjectInitInfo } from '../BaseScene'
import { BaseScene } from '../BaseScene'

import { SproutDoorAsset } from './assets/Door'
import { SproutHeroAsset } from './assets/Hero'
import { SproutLootAsset } from './assets/Loot'
import { SproutChestAsset } from './assets/Chest'
import { SproutBushAsset } from './assets/Bush'
import { SproutCowAsset } from './assets/Cow'
import { SproutHudScene } from './hud'

import terrainTilesetImageSrc from './imgs/terrain-tileset.png'
import tilesetData from './tilesets/terrain.json'
import bgAudioSrc from './audio/lazy-village.mp3'
import lootAudioSrc from './audio/success.mp3'
import bridgeBuildingAudioSrc from './audio/bridge-building.mp3'
import waterSplashAudioSrc from './audio/water-splash.mp3'
import mapData from './maps/main.json'
import { SproutTreeAsset } from './assets/Tree'
import { SproutRockAsset } from './assets/Rock'
import { SproutGrainAsset } from './assets/Grain'

export class SproutLandsScene extends BaseScene {
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
    bridgeBuilding: {
      src: bridgeBuildingAudioSrc,
      loadOffset: .7,
      loadDuration: .1,
      duration: 2,
      delay: .4,
    },
    waterSplash: {
      src: waterSplashAudioSrc,
      loadOffset: 1,
      duration: .7,
      offset: .1,
      delay: .2,
    },
  }

  protected hud: HudScene = new SproutHudScene()

  protected readonly objectInitInfoMap: Record<string, ObjectInitInfo> = {
    cow: {
      class: SproutCowAsset,
      scope: { startX: 0, startY: 0, endX: this.mapSize.width, endY: this.mapSize.height },
    },
    hero: {
      class: SproutHeroAsset,
      scope: { startX: 0, startY: 0, endX: this.mapSize.width, endY: this.mapSize.height },
      listeners: {
        collide: (_asset, info) => this.onHeroCollide(info as CollisionInfo),
        die: () => this.onHeroDie(),
      },
    },
    bush: { class: SproutBushAsset },
    rock: { class: SproutRockAsset },
    grain: {
      class: SproutGrainAsset,
      listeners: { loot: () => this.createLoot('grain', this.heroCharPosition) },
    },
    tree: {
      class: SproutTreeAsset,
      listeners: { felled: () => this.createLoot('wood', this.heroCharPosition) },
    },
    chest: {
      class: SproutChestAsset,
      listeners: { opened: (_asset, loot) => this.createLoot(loot as string, this.heroCharPosition) },
    },
    door: { class: SproutDoorAsset },
  }

  constructor() {
    super(tilesetData, terrainTilesetImageSrc, mapData as TileMapData)
  }

  private get heroAsset(): SproutHeroAsset {
    return this.assets.SproutHero as SproutHeroAsset
  }

  private get heroCharPosition(): PointCoords {
    const { x, y } = this.heroAsset.globalCenterPoint
    return { x: x - this.tileMap.tileSize / 2, y: y - this.tileMap.tileSize / 2 }
  }

  public load(context: SceneContext): void {
    super.load(context)

    // this.createLoot('fruit', { x: 16 * this.tileMap.tileSize, y: 48 * this.tileMap.tileSize })
    this.followAsset(this.heroAsset.id)
  }

  private async onHeroCollide({ asset, source, target }: CollisionInfo) {
    if (target.kind === 'house') {
      this.assetsList
        .filter(layer => layer instanceof MapLayerAsset && layer.type === 'roof')
        .forEach(layer => (layer as MapLayerAsset).visible = false)
    } else if (target.kind === 'loot') {
      this.onHeroLoot(asset as LootableAsset)
    } else if (source.kind === 'hero-action-use') {
      switch (target.kind) {
        case 'chest':
          (asset as SproutChestAsset).use()
          break
        case 'grain':
          (asset as SproutGrainAsset).use()
          break
        case 'bush':
          (asset as SproutBushAsset).use()
          this.createLoot('fruit', this.heroCharPosition)
          break
        case 'tree': {
          if ((asset as SproutTreeAsset).use()) {
            this.createLoot('heart', this.heroCharPosition)
          }
        }
      }
    } else if (source.kind === 'hero-action-axe') {
      (asset as SproutTreeAsset).chop()
    } else if (source.kind === 'hero-action-can') {
      (asset as SproutGrainAsset).use()
    } else if (source.kind === 'hero-action-pickaxe') {
      (asset as SproutRockAsset).use()
      this.createLoot('rock', this.heroCharPosition)
    } else if (source.kind === 'hero-action-rock') {
      const tileIndex = (target as MapTileCollideEntity).tileIndex
      const nonCollidingWaterTileId = 298
      const collidingWaterTileId = 299
      const waterRockTileId = 271
      const waterLayer = this.assets.Water as MapLayerAsset
      const floorLayer = this.assets['Floor 1'] as MapLayerAsset
      this.removeItem('rock')
      waterLayer.tiles = waterLayer.tiles.toSpliced(tileIndex, 1, collidingWaterTileId)
      await this.playAudioEffect('waterSplash')
      waterLayer.tiles = waterLayer.tiles.toSpliced(tileIndex, 1, nonCollidingWaterTileId)
      floorLayer.tiles = floorLayer.tiles.toSpliced(tileIndex, 1, waterRockTileId)
    } else if (source.kind === 'hero-action-wood') {
      const tileIndex = (target as MapTileCollideEntity).tileIndex
      const nonCollidingWaterTileId = 298
      const collidingWaterTileId = 301
      const bridgeTileId = target.kind === 'bridge-h' ? 319 : 338
      const waterLayer = this.assets.Water as MapLayerAsset
      const floorLayer = this.assets['Floor 2'] as MapLayerAsset
      this.removeItem('wood')
      console.log('bridge')
      waterLayer.tiles = waterLayer.tiles.toSpliced(tileIndex, 1, collidingWaterTileId)
      await this.playAudioEffect('bridgeBuilding')
      waterLayer.tiles = waterLayer.tiles.toSpliced(tileIndex, 1, nonCollidingWaterTileId)
      floorLayer.tiles = floorLayer.tiles.toSpliced(tileIndex, 1, bridgeTileId)
    }
  }

  private onHeroDie() {
    console.log('Hero died!')
  }

  private onHeroLoot(asset: LootableAsset) {
    const { lifes, sproutLands: { items } } = gameData
    if (asset.kind === 'heart') {
      if (lifes < 6) {
        gameData.lifes++
        this.removeAsset(asset)
        this.playAudioEffect('loot')
      }
    } else if (!items.includes(asset.kind)) {
      items.push(asset.kind)
      this.removeAsset(asset)
      this.playAudioEffect('loot')
    }
  }

  private createLoot(kind: string, pos: PointCoords) {
    const lootAsset = new SproutLootAsset(kind, pos, this.tileMap.tileSize)
    lootAsset.index = this.objectLayerIndex
    this.addAsset(lootAsset)
  }

  private removeItem(item: string) {
    const { items, activeItem } = gameData.sproutLands
    items.splice(items.indexOf(item), 1)
    if (activeItem === item) {
      gameData.sproutLands.activeItem = ''
    }
  }
}
