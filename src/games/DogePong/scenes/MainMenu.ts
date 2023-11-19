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
    const buttonLocal = new Button(width * .05, height * .5, () => console.log('clicked'))
    buttonLocal.texture.size = { width: width * .16, height: height * .07 }
    buttonLocal.texture.text = 'Jugar en local'
    const buttonNetwork = new Button(width * .79, height * .5, () => console.log('clicked'))
    buttonNetwork.texture.size = { width: width * .16, height: height * .07 }
    buttonNetwork.texture.text = 'Jugar en red'

    this.addAsset(dogeText)
    this.addAsset(pongText)
    this.addAsset(buttonLocal)
    this.addAsset(buttonNetwork)
    super.load(ctx)
  }
}
