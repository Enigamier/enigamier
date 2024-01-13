import { Renderer } from '@/Renderer'
import { GlobalController } from '@/controllers/GlobalController'
import { AudioManager } from '@/managers'
import type { Scene, SceneContext } from '@/scenes'

interface EnigamierOptions {
  autoResize: boolean;
  imageSmoothingEnabled: boolean;
  baseAudioNodesMap?: Record<string, AudioNode>;
}

const defaultOptions: EnigamierOptions = {
  autoResize: false,
  imageSmoothingEnabled: false,
}

export class Enigamier {
  public canvas!: HTMLCanvasElement

  private canvasContext!: CanvasRenderingContext2D

  private readonly options: EnigamierOptions

  private scenes: Record<string, Scene> = {}

  private currentScene?: Scene

  private readonly renderer: Renderer

  private readonly globalController: GlobalController

  private readonly audioManager: AudioManager

  constructor(canvasId: string, options?: Partial<EnigamierOptions>) {
    this.initCanvas(canvasId)
    this.options = this.mergeDefaultOptions(options)
    this.renderer = new Renderer(this.onRender.bind(this), this.onUpdate.bind(this))
    this.globalController = new GlobalController(this.canvas)
    this.audioManager = new AudioManager()
    this.globalController.init()
  }

  private get sceneContext(): SceneContext {
    return {
      enigamier: this,
      gc: this.globalController,
      canvasContext: this.canvasContext,
      audioManager: this.audioManager,
    }
  }

  public start(id: string) {
    this.audioManager.init(this.options.baseAudioNodesMap)
    this.loadScene(id)
    this.renderer.start()
  }

  public shutdown() {
    this.unloadCurrentScene()
    this.audioManager.shutdown()
    this.globalController.shutdown()
    this.renderer.stop()
  }

  public registerScene(scene: Scene) {
    this.scenes[scene.id] = scene
  }

  public loadScene(id: string) {
    this.unloadCurrentScene()
    const newScene = this.scenes[id]
    newScene.load(this.sceneContext)
    this.currentScene = newScene
  }

  private initCanvas(canvasId: string) {
    const canvas: HTMLCanvasElement | null = document.querySelector(`#${canvasId}`)
    if (canvas) {
      this.canvas = canvas
      this.canvasContext = this.getContext(canvas)
      const observer = new MutationObserver(() => {
        const canvasElem = document.querySelector(`#${canvasId}`)
        if (canvasElem !== this.canvas) {
          this.shutdown()
          observer.disconnect()
        }
      })
      observer.observe(document, { subtree: true, childList: true })
    } else {
      throw `No canvas found with id #${canvasId}`
    }
  }

  private getContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    const context = canvas.getContext('2d', { desynchronized: true })
    if (context instanceof CanvasRenderingContext2D) {
      return context
    } else {
      throw 'Can not get rendering context'
    }
  }

  private mergeDefaultOptions(options: Partial<EnigamierOptions> = {}) {
    return { ...defaultOptions, ...options }
  }

  private unloadCurrentScene() {
    this.currentScene?.unload()
    this.currentScene = undefined
  }

  private clearCanvas() {
    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  private onUpdate(delta: number) {
    this.currentScene?.update(delta)
  }

  private onRender() {
    if (this.currentScene) {
      this.clearCanvas()
      this.canvasContext.imageSmoothingEnabled = this.options.imageSmoothingEnabled
      this.currentScene.render()
    }
  }
}
