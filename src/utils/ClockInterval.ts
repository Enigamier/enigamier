export class ClockInterval {

  private lastCheck = 0

  private readonly tickLength: number

  private readonly updateCallback: () => void

  constructor(tickLength: number, updateCallback: () => void) {
    this.tickLength = tickLength
    this.updateCallback = updateCallback
  }

  public check(delay: number) {
    this.lastCheck += delay
    if (this.lastCheck >= this.tickLength) {
      this.queueUpdates(Math.floor(this.lastCheck / this.tickLength))
      this.lastCheck = this.lastCheck % this.tickLength
    }
  }

  private queueUpdates(ticks: number) {
    for (let i = 0; i < ticks; i++) {
      this.updateCallback()
    }
  }
}
