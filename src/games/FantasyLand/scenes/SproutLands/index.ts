import type { SceneContext, HudScene, CollisionInfo, AudioEffectInfo } from '@/index'

import { gameData } from '../../game-data'
import type { TileMapData } from '../../utils/models'
import { MapLayerAsset } from '../../assets/MapLayerAsset'
import type { LootableAsset } from '../../assets/Lootable'
import type { ObjectInitInfo } from '../BaseScene'
import { BaseScene } from '../BaseScene'

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
    fruit: { class: SproutFruitAsset },
    cow: {
      class: SproutCowAsset,
      scope: { startX: 0, startY: 0, endX: this.mapSize.width, endY: this.mapSize.height },
    },
    hero: {
      class: SproutHeroAsset,
      scope: { startX: 0, startY: 0, endX: this.mapSize.width, endY: this.mapSize.height },
    },
    door: { class: SproutDoorAsset },
  }

  constructor() {
    super(tilesetData, terrainTilesetImageSrc, mapData as TileMapData)
  }

  public load(context: SceneContext): void {
    super.load(context)
    this.assets.SproutHero.addEventListener('collide', info => this.onHeroCollide(info as CollisionInfo))
    this.assets.SproutHero.addEventListener('die', this.onHeroDie.bind(this))
    this.followAsset('SproutHero')
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
