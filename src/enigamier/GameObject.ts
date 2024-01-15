import type { GlobalController } from '@/controllers'
import type { AudioManager } from '@/managers'

export interface GameObjectContext {
  gc: GlobalController;
  audioManager: AudioManager;
}

export interface AudioEffectInfo {
  src: string;
  gain?: number;
  pan?: number;
  delay?: number;
  offset?: number;
  duration?: number;
  loadOffset?: number;
  loadDuration?: number;
}

export abstract class GameObject {
  public abstract readonly id: string

  protected context!: GameObjectContext

  protected audioEffectsInfo: Record<string, AudioEffectInfo> = {}

  private audioEffectsMap: Record<string, AudioBuffer> = {}

  public load(context: GameObjectContext) {
    this.context = context
    this.initAudioEffects()
  }

  public abstract unload(): void

  public update?(delta: number): void

  public abstract render(ctx: CanvasRenderingContext2D): void

  private async loadAudioEffect(info: AudioEffectInfo): Promise<AudioBuffer> {
    const { src, loadOffset = 0, loadDuration = 0 } = info
    const audioBuffer = await this.context.audioManager.fetchAudioBuffer(src)
    const audioNode = await this.context.audioManager.connectBufferSource(audioBuffer)
    audioNode.start(0, loadOffset, loadDuration)
    return audioBuffer
  }

  private async initAudioEffects() {
    if (this.audioEffectsInfo) {
      const effectsLoadPromises = Object.values(this.audioEffectsInfo)
        .map(info => this.loadAudioEffect(info))
      const audioBuffers = await Promise.all(effectsLoadPromises)
      Object.keys(this.audioEffectsInfo).forEach((effectKey, index) => {
        this.audioEffectsMap[effectKey] = audioBuffers[index]
      })
    }
  }

  protected playAudioEffect(
    effect: string,
    options: Pick<AudioEffectInfo, 'gain' | 'pan' | 'offset' | 'duration' | 'delay'> = {},
  ) {
    const {
      gain = this.audioEffectsInfo[effect].gain ?? 1,
      pan = this.audioEffectsInfo[effect].pan ?? 0,
      delay = this.audioEffectsInfo[effect].delay ?? 0,
      offset = this.audioEffectsInfo[effect].offset ?? 0,
      duration = this.audioEffectsInfo[effect].duration ?? undefined,
    } = options
    const { audioManager: am } = this.context
    const audioBuffer = this.audioEffectsMap[effect]
    const audioNode = am.context.createBufferSource()
    audioNode.buffer = audioBuffer
    const gainNode = am.context.createGain()
    gainNode.gain.value = gain
    const pannerNode = am.context.createStereoPanner()
    pannerNode.pan.value = pan
    am.connectNode(audioNode.connect(pannerNode).connect(gainNode))
    audioNode.start(am.context.currentTime + delay, offset, duration)
    return new Promise<void>(resolve => audioNode.addEventListener('ended', () => resolve()))
  }
}
