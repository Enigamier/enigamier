import type { SceneContext } from '@/index'
import { MenuScene } from '../Menu'
import { Button } from '../../assets/Button'
import { Text } from '../../assets/Text'
import { ControlsAsset } from './assets/Controls'
import { MenuBackgroundTexture } from '../../textures/MenuBackground'

const targetDogeRotation = Math.PI * 4
const targetDogeSize = .05
const targetDogeOffset = { x: 0, y: 0.055 }
const playTransitionTime = 2000

export class ControlsMenuScene extends MenuScene {
  public readonly id = 'ControlsMenu'

  private playTransition = false

  private playTransitionElapsedTime = 0

  public load(ctx: SceneContext): void {
    const { width, height } = ctx.enigamier.canvas

    this.bgTexture = new MenuBackgroundTexture()

    // Title
    const dogeText = new Text(width * .05, height * .07, 'DOGE')
    dogeText.texture.size = { width: width * .3, height: height * .15 }
    dogeText.texture.isGradient = true
    const pongText = new Text(width * .65, height * .07, 'PONG')
    pongText.texture.size = { width: width * .3, height: height * .15 }
    pongText.texture.isGradient = true

    // Buttons
    const playButtonWidth = width * .16
    const playButton = new Button((width * .5) - (playButtonWidth / 2), height * .75, () => {
      this.playTransition = true
      this.removeAsset(playButton)
      this.removeAsset(backButton)
    })
    playButton.texture.size = { width: playButtonWidth, height: height * .07 }
    playButton.texture.text = 'Let\'s play!!'
    const backButton = new Button(width * .05, height * .87, () => this.context.enigamier.loadScene('MainMenu'))
    backButton.texture.size = { width: width * .04, height: height * .05 }
    backButton.texture.bgStartColor = 'orange'
    backButton.texture.bgEndColor = 'orange'
    backButton.texture.icon = 'back'

    // Controls
    const controlsSize = width * 0.15
    const player1Controls = new ControlsAsset(width * .06, height * .4, 'left', { up: 'W', down: 'A' })
    player1Controls.texture.size = { width: controlsSize, height: controlsSize }
    const player2Controls = new ControlsAsset(width * .79, height * .4, 'right', { up: 'P', down: 'L' })
    player2Controls.texture.size = { width: controlsSize, height: controlsSize }

    this.addAsset(dogeText)
    this.addAsset(pongText)
    this.addAsset(playButton)
    this.addAsset(backButton)
    this.addAsset(player1Controls)
    this.addAsset(player2Controls)
    super.load(ctx)
  }

  public update(delta: number): void {
    this.updateBgTexture(delta)
    this.updateAssets(delta)
  }

  private onPlayTransitionEnds() {
    this.playTransition = false
    this.playTransitionElapsedTime = 0
    this.context.enigamier.loadScene('Battleground')
  }

  private updateBgTexture(frameDelay: number) {
    if (this.playTransition) {
      const remainingTime = playTransitionTime - this.playTransitionElapsedTime
      if (remainingTime > 0) {
        const delta = Math.min(remainingTime, frameDelay)
        const relativeDelta = delta / playTransitionTime
        const { dogeOffset } = this.bgTexture
        this.bgTexture.dogeRotation += targetDogeRotation * relativeDelta
        this.bgTexture.dogeSize -= (.45 - targetDogeSize) * relativeDelta
        this.bgTexture.dogeOffset = {
          x: dogeOffset.x + targetDogeOffset.x * relativeDelta,
          y: dogeOffset.y + targetDogeOffset.y * relativeDelta,
        }
        this.playTransitionElapsedTime += delta
      } else {
        this.onPlayTransitionEnds()
      }
    }
  }
}
