import type {
  Texture,
  RectCoords,
  PointCoords,
} from '@/index'
import type { GameObjectContext } from '@/enigamier/GameObject'
import { GameObject } from '@/enigamier/GameObject'
import { getVectorEndPoint } from '@/utils/vectors'

type EventCallback = (payload: unknown) => void

export type BaseAssetContext = GameObjectContext

export interface AssetMovement {
  angle: number;

  /**
   * Pixels to move per second
   */
  speed: number;
}

export abstract class BaseAsset extends GameObject {
  declare protected context: BaseAssetContext

  public index = 0

  public position: PointCoords = { x: 0, y: 0 }

  public scope: RectCoords = { startX: 0, startY: 0, endX: 0, endY: 0 }

  public texture: Texture

  public movement: AssetMovement = { angle: 0, speed: 0 }

  protected abortController!: AbortController

  private listeners: Record<string, EventCallback[]> = {}

  constructor(texture: Texture) {
    super()
    this.texture = texture
  }

  public get globalPosition(): PointCoords {
    const { scope: { startX, startY }, position: { x, y } } = this
    return { x: startX + x, y: startY + y }
  }

  public get globalCenterPoint(): PointCoords {
    const { x, y } = this.globalPosition
    const { x: centerX, y: centerY } = this.texture.centerPoint
    return { x: x + centerX, y: y + centerY }
  }

  public get globalCoords(): RectCoords {
    const { x, y } = this.globalPosition
    const { size: { width, height } } = this.texture
    return {
      startX: x,
      startY: y,
      endX: x + width,
      endY: y + height,
    }
  }

  public load(context: BaseAssetContext) {
    super.load(context)
    this.abortController = new AbortController()
  }

  public unload() {
    this.abortController.abort()
  }

  public render(ctx: CanvasRenderingContext2D): void {
    const { x, y } = this.globalPosition
    ctx.save()
    ctx.translate(x, y)
    this.texture.render(ctx)
    ctx.restore()
  }

  public addEventListener(eventId: string, callback: EventCallback, signal?: AbortSignal) {
    this.listeners[eventId] = this.listeners[eventId] || []
    this.listeners[eventId].push(callback)
    if (signal) {
      signal.addEventListener('abort', () => this.removeEventListener(eventId, callback))
    }
  }

  public removeEventListener(eventId: string, callbackToRemove: EventCallback) {
    this.listeners[eventId] = this.listeners[eventId].filter(callback => callback === callbackToRemove)
  }

  protected fireEvent(eventId: string, payload?: unknown) {
    this.listeners[eventId]?.forEach(cb => cb(payload))
  }

  protected move(delta: number) {
    const { angle, speed } = this.movement
    if (speed !== 0) {
      const { x, y } = this.position
      const distance = speed * (delta / 1000)
      this.position = getVectorEndPoint({ x, y, angle, distance })
    }
  }

  protected fixToScope() {
    const { x, y } = this.position
    const { width, height } = this.texture.size
    const { startX, startY, endX, endY } = this.scope
    this.position = {
      x: Math.max(Math.min(x, endX - width - startX), 0),
      y: Math.max(Math.min(y, endY - height - startY), 0),
    }
  }
}
