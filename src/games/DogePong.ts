import { Enigamier } from '@/index'
import { MainMenuScene } from './scenes/MainMenu'

export function DogePongGame(canvasId: string) {
  const enigamier = new Enigamier(canvasId)
  const mainMenuScene = new MainMenuScene()

  enigamier.start(mainMenuScene)
}
