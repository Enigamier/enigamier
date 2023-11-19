
import { MenuScene } from '../Menu'
import { BackgroundTexture } from './textures/Background'

export class MainMenuScene extends MenuScene {
  public readonly id = 'MainMenu'

  protected bgTexture = new BackgroundTexture()
}
