import type { SceneContext, HudScene, CollisionInfo, AudioEffectInfo, PointCoords } from '@/index'

import { gameData } from '../../game-data'
import type { TileMapData } from '../../utils/models'
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
import mapData from './maps/main.json'
import { SproutTreeAsset } from './assets/Tree'

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
    },
    bush: { class: SproutBushAsset },
    tree: { class: SproutTreeAsset },
    chest: { class: SproutChestAsset },
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
    const houseChest = this.assets.HouseChest as SproutChestAsset
    houseChest.setDirection('left')
    houseChest.loot = ['axe']
    houseChest.addEventListener('opened', loot => this.onChestOpened(loot as string[]))
    this.heroAsset.addEventListener('collide', info => this.onHeroCollide(info as CollisionInfo))
    this.heroAsset.addEventListener('die', this.onHeroDie.bind(this))
    this.followAsset(this.heroAsset.id)
  }

  private onHeroCollide({ asset, source, target }: CollisionInfo) {
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
      switch (target.kind) {
        case 'tree':
          (asset as SproutTreeAsset).chop()
          this.createLoot('wood', this.heroCharPosition)
      }
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

  private onChestOpened(loot: string[]) {
    loot.forEach(item => this.createLoot(item, this.heroCharPosition))
  }

  private createLoot(kind: string, pos: PointCoords) {
    const lootAsset = new SproutLootAsset(kind, pos, this.tileMap.tileSize)
    lootAsset.index = this.objectLayerIndex
    this.addAsset(lootAsset)
  }
}
