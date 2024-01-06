import { Enigamier } from '@/index'
import { ExampleScene } from './scenes/ExampleScene'
import { SproutLandsScene } from './scenes/SproutLands'
import { WorldScene } from './scenes/WorldScene'

export function fantasyLandGame(canvasId: string) {
  const enigamier = new Enigamier(canvasId)
  ;[
    new ExampleScene(),
    new WorldScene(),
    new SproutLandsScene(),
  ].forEach(enigamier.registerScene.bind(enigamier))

  enigamier.start('SproutLands')
}
