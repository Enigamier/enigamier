import type {
  GlobalController,
  Texture,
  CameraInfo,
  RectCoords,
  CollideEntity,
  CollisionInfo,
  PointCoords,
} from '@/index'

export interface AssetContext {
  gc: GlobalController;
  camera?: CameraInfo;
}

export interface AssetMovement {
  angle: number;
  speed: number;
}

export abstract class Asset {
  public abstract readonly id: string

  public index = 0

  public position: PointCoords = { x: 0, y: 0 }

  public scope: RectCoords = { startX: 0, startY: 0, endX: 0, endY: 0 }

  public texture: Texture

  public movement: AssetMovement = { angle: 0, speed: 0 }

  protected context!: AssetContext

  protected abortController!: AbortController

  constructor(texture: Texture) {
    this.texture = texture
  }

  public get globalPosition(): PointCoords {
    const { scope: { startX, startY }, position: { x, y } } = this
    return { x: startX + x, y: startY + y }
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

  public get collideEntities(): CollideEntity[] {
    return []
  }

  public onCollide?(collisionInfo: CollisionInfo): void

  public load(context: AssetContext) {
    this.context = context
    this.abortController = new AbortController()
  }

  public unload() {
    this.abortController.abort()
  }

  public update?(delta: number): void

  public render(ctx: CanvasRenderingContext2D): void {
    const { x, y } = this.globalPosition
    ctx.save()
    ctx.translate(x, y)
    this.texture.render(ctx)
    ctx.restore()
  }

  protected move(delta: number) {
    const { angle, speed } = this.movement
    if (speed !== 0) {
      const { x, y } = this.position
      const distance = speed * (delta / 1000)
      this.position = {
        x: Math.round(x + Math.cos(angle) * distance),
        y: Math.round(y - Math.sin(angle) * distance),
      }
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
