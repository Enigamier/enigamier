type RenderCallback = (delta?: number) => void
type UpdateCallback = (delta: number) => void

const perfectFpsDelta = 1000 / 60 // 60 frames per second

export class Renderer {
  private rafId = 0

  private intervalId: NodeJS.Timeout | undefined

  private lastFrameTs = 0

  private readonly renderCallback: RenderCallback

  private readonly updateCallback: UpdateCallback

  constructor(renderCallback: RenderCallback, updateCallback: UpdateCallback) {
    this.renderCallback = renderCallback
    this.updateCallback = updateCallback
  }

  public start() {
    this.render(perfectFpsDelta)
  }

  public stop() {
    cancelAnimationFrame(this.rafId)
    clearInterval(this.intervalId)
    this.rafId = 0
    this.intervalId = undefined
    this.lastFrameTs = 0
  }

  private render(frameTs: number) {
    this.rafId = requestAnimationFrame(this.render.bind(this))
    const frameDelay = frameTs - this.lastFrameTs
    this.lastFrameTs = frameTs
    this.updateCallback(frameDelay)
    this.renderCallback(frameDelay)
  }
}
