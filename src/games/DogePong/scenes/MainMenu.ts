import type { SceneContext } from '@/index'
import { MenuScene } from './Menu'
import { Button } from '../assets/Button'
import { Text } from '../assets/Text'

export class MainMenuScene extends MenuScene {
  public readonly id = 'MainMenu'

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
    const buttonsSize = { width: width * .16, height: height * .07 }
    const buttonsY = (height / 2) - (buttonsSize.height / 2)
    const localButton = new Button(width * .05, buttonsY, this.onLocalButtonClick.bind(this))
    localButton.texture.size = buttonsSize
    localButton.texture.text = 'Local game'
    const networkButton = new Button(width * .79, buttonsY, () => undefined)
    networkButton.texture.size = buttonsSize
    networkButton.texture.text = 'Network game'
    networkButton.isDisabled = true

    this.addAsset(dogeText)
    this.addAsset(pongText)
    this.addAsset(localButton)
    this.addAsset(networkButton)
    super.load(ctx)
  }

  private onLocalButtonClick() {
    this.context.enigamier.loadScene('ControlsMenu')
  }
}
