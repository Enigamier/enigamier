import { checkCollisions } from '@/collide'
import { Asset } from '@/assets/Asset'

import { BaseScene, type BaseSceneContext } from './BaseScene'
import type { HudScene } from './HudScene'

export type SceneContext = BaseSceneContext

export abstract class Scene extends BaseScene {
  declare protected assets: Record<string, Asset>

  protected hud?: HudScene

  protected bgAudioSrc?: string | HTMLAudioElement

  protected bgAudio?: HTMLMediaElement

  protected bgAudioVolume = 1

  public get collidableAssetsList(): Asset[] {
    return this.assetsList.filter(asset => (
      asset instanceof Asset &&
      asset.collideEntities.length > 0
    )) as Asset[]
  }

  public load(context: SceneContext): void {
    this.hud?.load(context)
    super.load(context)
    this.initBgAudio()
  }

  public unload(): void {
    this.hud?.unload()
    super.unload()
  }

  public update(delta: number) {
    super.update(delta)
    this.hud?.update(delta)
    checkCollisions(this.collidableAssetsList)
  }

  public render(): void {
    super.render()
    this.hud?.render()
  }

  protected initBgAudio() {
    if (this.bgAudioSrc) {
      const { audioManager } = this.context
      this.bgAudio = audioManager.connectMediaSource(this.bgAudioSrc)
      this.bgAudio.loop = true
      this.bgAudio.volume = this.bgAudioVolume
      this.bgAudio.play()
    }
  }
}
