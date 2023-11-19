import { Enigamier } from '@/index'
import { MainMenuScene } from './scenes/MainMenu'
import { ExampleScene } from './scenes/ExampleScene'

export function DogePongGame(canvasId: string) {
  const enigamier = new Enigamier(canvasId)
  ;[new ExampleScene(), new MainMenuScene()].forEach(enigamier.registerScene.bind(enigamier))

  enigamier.start('MainMenu')
}
