import type { Scene } from '@/scenes/Scene'
import { Renderer } from '@/Renderer'
import { GlobalController } from '@/controllers/GlobalController'
import { CollidableAsset } from '@/assets/CollidableAsset'

import { checkCollisions } from './collide'

interface EnigamierOptions {
  autoResize: boolean;
}

const defaultOptions: EnigamierOptions = { autoResize: false }

export class Enigamier {
  public canvas!: HTMLCanvasElement

  private canvasContext!: CanvasRenderingContext2D

  private options: EnigamierOptions

  private scenes: Record<string, Scene> = {}

  private currentScene: Scene | undefined

  private renderer: Renderer

  private globalController: GlobalController

  constructor(canvasId: string, options?: EnigamierOptions) {
    this.initCanvas(canvasId)
    this.options = this.mergeDefaultOptions(options)
    console.log(this.options)
    this.renderer = new Renderer()
    this.globalController = new GlobalController(this.canvas)
    this.globalController.init()
  }

  public start(id: string) {
    this.loadScene(id)
    this.renderer.start(this.onRender.bind(this), this.onUpdate.bind(this))
  }

  public shutdown() {
    this.unloadCurrentScene()
    this.globalController.shutdown()
    this.renderer.stop()
  }

  public registerScene(scene: Scene) {
    this.scenes[scene.id] = scene
  }

  public loadScene(id: string) {
    this.unloadCurrentScene()
    const newScene = this.scenes[id]
    newScene.load({ enigamier: this, gc: this.globalController, canvasContext: this.canvasContext })
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

  private mergeDefaultOptions(options?: EnigamierOptions) {
    const newOptions = typeof options === 'object' ? options : {}
    return { ...defaultOptions, ...newOptions }
  }

  private unloadCurrentScene() {
    this.currentScene?.unload()
    this.currentScene = undefined
  }

  private clearCanvas() {
    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  private onUpdate() {
    if (this.currentScene) {
      const assets = this.currentScene.assetsList
      assets.forEach(asset => asset.update())
      checkCollisions(assets.filter(asset => asset instanceof CollidableAsset) as CollidableAsset[])
    }
  }

  private onRender() {
    if (this.currentScene) {
      this.clearCanvas()
      this.currentScene.render()
    }
  }
}
