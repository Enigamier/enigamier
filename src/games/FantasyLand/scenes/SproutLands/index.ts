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
import { SproutCowAsset } from './assets/Cow'
import { SproutHudScene } from './hud'

import terrainTilesetImageSrc from './imgs/terrain-tileset.png'
import tilesetData from './tilesets/terrain.json'
import bgAudioSrc from './audio/lazy-village.mp3'
import lootAudioSrc from './audio/success.mp3'
import mapData from './maps/main.json'

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
    chest: { class: SproutChestAsset },
    door: { class: SproutDoorAsset },
  }

  constructor() {
    super(tilesetData, terrainTilesetImageSrc, mapData as TileMapData)
  }

  public load(context: SceneContext): void {
    super.load(context)
    this.createLoot('fruit', { x: 16 * this.tileMap.tileSize, y: 48 * this.tileMap.tileSize })
    const houseChest = this.assets.HouseChest as SproutChestAsset
    houseChest.setDirection('left')
    houseChest.loot = ['axe']
    houseChest.addEventListener('opened', () => this.onChestOpened(houseChest))
    this.assets.SproutHero.addEventListener('collide', info => this.onHeroCollide(info as CollisionInfo))
    this.assets.SproutHero.addEventListener('die', this.onHeroDie.bind(this))
    this.followAsset('SproutHero')
  }

  private onHeroDie() {
    console.log('Hero died!')
  }

  private onHeroCollide({ asset, source, target }: CollisionInfo) {
    if (target.kind === 'house') {
      this.assetsList
        .filter(layer => layer instanceof MapLayerAsset && layer.type === 'roof')
        .forEach(layer => (layer as MapLayerAsset).visible = false)
    } else if (target.kind === 'loot') {
      this.onHeroLoot(asset as LootableAsset)
    } else if (source.kind === 'hero-action-use' && target.kind === 'chest') {
      (asset as SproutChestAsset).use()
    }
  }

  private onHeroLoot(asset: LootableAsset) {
    const items = gameData.sproutLands.items
    if (!items.includes(asset.kind)) {
      items.push(asset.kind)
      this.removeAsset(asset)
      this.playAudioEffect('loot')
    }
  }

  private onChestOpened(chest: SproutChestAsset) {
    const { direction: dir, loot, scope: { startX: x, startY: y } } = chest
    const size = this.tileMap.tileSize
    loot.forEach(item => this.createLoot(item, {
      x: dir === 'left' ? x - size : (dir === 'right' ? x + size : x),
      y: dir === 'front' ? y + size : y,
    }))
    chest.loot = []
  }

  private createLoot(kind: string, pos: PointCoords) {
    const lootAsset = new SproutLootAsset(kind, pos, this.tileMap.tileSize)
    lootAsset.index = this.objectLayerIndex
    this.addAsset(lootAsset)
  }
}
