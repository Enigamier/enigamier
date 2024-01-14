import { Enigamier } from '@/index'
import { ExampleScene } from './scenes/ExampleScene'
import { SproutLandsScene } from './scenes/SproutLands'

export function fantasyLandGame(canvasId: string) {
  const enigamier = new Enigamier(canvasId)
  ;[
    new ExampleScene(),
    new SproutLandsScene(),
  ].forEach(enigamier.registerScene.bind(enigamier))

  enigamier.start('SproutLands')
}
