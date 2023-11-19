import type { SceneContext } from '@/index'
import { MenuScene } from '../Menu'
import { Button } from '../../assets/Button'
import { Text } from '../../assets/Text'
import { ControlsAsset } from './assets/Controls'

export class ControlsMenuScene extends MenuScene {
  public readonly id = 'ControlsMenu'

  public load(ctx: SceneContext): void {
    const { width, height } = ctx.enigamier.canvas

    // Title
    const dogeText = new Text(width * .05, height * .07, 'DOGE')
    dogeText.texture.size = { width: width * .3, height: height * .15 }
    dogeText.texture.isGradient = true
    const pongText = new Text(width * .65, height * .07, 'PONG')
    pongText.texture.size = { width: width * .3, height: height * .15 }
    pongText.texture.isGradient = true

    // Buttons
    const playButtonWidth = width * .16
    const playButton = new Button((width * .5) - (playButtonWidth / 2), height * .75, () => console.log('Play!!'))
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
}
