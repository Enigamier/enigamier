import { Enigamier } from '@/index'
import { ExampleScene } from './scenes/ExampleScene'

export function fantasyLandGame(canvasId: string) {
  const enigamier = new Enigamier(canvasId)
  ;[new ExampleScene()].forEach(enigamier.registerScene.bind(enigamier))

  enigamier.start('Example')
}
