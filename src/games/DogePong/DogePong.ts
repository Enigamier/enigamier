import { Enigamier } from '@/index'
import { MainMenuScene } from './scenes/MainMenu'
import { ControlsMenuScene } from './scenes/ControlsMenu'
import { ExampleScene } from './scenes/ExampleScene'
import { BattlegroundScene } from './scenes/Battleground'

export function dogePongGame(canvasId: string) {
  const enigamier = new Enigamier(canvasId)
  ;[
    new ExampleScene(),
    new MainMenuScene(),
    new ControlsMenuScene(),
    new BattlegroundScene(),
  ].forEach(enigamier.registerScene.bind(enigamier))

  enigamier.start('MainMenu')
}
