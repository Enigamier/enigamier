type RenderCallback = (frameDelay?: number) => void
type UpdateCallback = () => void

const perfectFpsFrameDelay = 1000 / 60 // 60 frames per second
const updateCycleDelta = perfectFpsFrameDelay

export class Renderer {
  private speed = 1

  private rafId = 0

  private intervalId: NodeJS.Timeout | undefined

  private lastFrameTs = 0

  private renderCallback: RenderCallback = () => 0

  private updateCallback: UpdateCallback = () => 0

  public get currentSpeed() {
    return this.speed
  }

  public start(renderCallback: RenderCallback, updateCallback: UpdateCallback) {
    this.renderCallback = renderCallback
    this.updateCallback = updateCallback

    const nowTs = performance.now()
    this.lastFrameTs = nowTs - perfectFpsFrameDelay
    this.render(nowTs)
    this.intervalId = setInterval(this.updateCallback, updateCycleDelta * this.speed)
  }

  public stop() {
    cancelAnimationFrame(this.rafId)
    clearInterval(this.intervalId)
    this.renderCallback = () => 0
    this.rafId = 0
    this.intervalId = undefined
    this.lastFrameTs = 0
  }

  public setSpeed(speed: number) {
    const newSpeed = Math.max(
      Math.min(
        Math.round(speed * 10) / 10,
        1,
      ),
      0,
    )
    if (newSpeed !== this.speed) {
      clearInterval(this.intervalId)
      this.speed = newSpeed
      if (this.speed > 0) {
        const newDelta = updateCycleDelta - ((this.speed - 1) * updateCycleDelta)
        this.intervalId = setInterval(this.updateCallback, newDelta)
      }
    }
  }

  private render(frameTs: number) {
    this.rafId = requestAnimationFrame(this.render.bind(this))
    const frameDelay = frameTs - this.lastFrameTs
    this.lastFrameTs = frameTs
    this.renderCallback(frameDelay)
  }
}
