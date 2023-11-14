import { Scene } from '@/scenes/Scene'
import { Renderer } from '@/Renderer'

interface EnigamierOptions {
  autoResize: boolean;
}

const defaultOptions: EnigamierOptions = { autoResize: false }

export class Enigamier {
  private canvas!: HTMLCanvasElement

  private canvasContext!: CanvasRenderingContext2D

  private options: EnigamierOptions

  private scenes: Record<string, Scene> = {}

  private currentScene: Scene | undefined

  private renderer: Renderer

  constructor(canvasId: string, options?: EnigamierOptions) {
    this.initCanvas(canvasId)
    this.options = this.mergeDefaultOptions(options)
    console.log(this.options)
    this.renderer = new Renderer()
  }

  public start(scene: Scene) {
    this.registerScene(scene)
    this.loadScene(scene.id)
    this.renderer.start(this.onRender.bind(this), this.onUpdate.bind(this))
  }

  public shutdown() {
    this.unloadCurrentScene()
    this.renderer.stop()
  }

  public registerScene(scene: Scene) {
    this.scenes[scene.id] = scene
  }

  private initCanvas(canvasId: string) {
    const canvas: HTMLCanvasElement | null = document.querySelector(`#${canvasId}`)
    if (canvas) {
      this.canvas = canvas
      this.canvasContext = this.getContext(canvas)
      document.addEventListener('keydown', (ev: KeyboardEvent) => {
        if (ev.key.includes('Arrow')) {
          const diff = ev.key.includes('Up') ? .1 : -.1
          this.renderer.setSpeed(this.renderer.currentSpeed + diff)
        }
      })
      const observer = new MutationObserver(() => {
        if (!document.querySelector(`#${canvasId}`)) {
          this.shutdown()
        }
      })
      observer.observe(document, { subtree: true, childList: true })
    } else {
      throw `No canvas found with id #${canvasId}`
    }
  }

  private getContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    const context = canvas.getContext('2d')
    if (context instanceof CanvasRenderingContext2D) {
      return context
    } else {
      throw 'Can not get rendering context'
    }
  }

  private mergeDefaultOptions(options?: EnigamierOptions) {
    const newOptions = typeof options === 'object' ? options : {}
    return { ...defaultOptions, ...newOptions }
  }

  private loadScene(id: string) {
    this.unloadCurrentScene()
    this.currentScene = this.scenes[id]
  }

  private unloadCurrentScene() {
    this.currentScene = undefined
  }

  private clearCanvas() {
    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  private onRender() {
    if (this.currentScene) {
      this.clearCanvas()
      this.currentScene.sortedAssetsByTexture.forEach(asset => asset.texture.render(this.canvasContext))
    }
  }

  private onUpdate() {
    if (this.currentScene) {
      this.currentScene.assetsList.forEach(asset => asset.update())
    }
  }
}
