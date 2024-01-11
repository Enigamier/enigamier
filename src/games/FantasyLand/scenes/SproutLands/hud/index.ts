import type { BaseSceneContext } from '@/index'
import { HudScene } from '@/index'

import { GameDataAsset } from './assets/GameData'
import { ItemsBarAsset } from './assets/ItemsBar'
import fontSrc from './fonts/PressStart2P-Regular.ttf'

export class SproutHudScene extends HudScene {
  public id = 'SproutHud'

  public load(context: BaseSceneContext): void {
    const { width, height } = context.enigamier.canvas
    const f = new FontFace('SproutLands', `url('${fontSrc}')`)
    document.fonts.add(f)
    f.load()

    const lifeCounter = new GameDataAsset()
    lifeCounter.position = { x: 50, y: 50 }
    this.addAsset(lifeCounter)

    const itemsBar = new ItemsBarAsset()
    itemsBar.position = { x: Math.round(width / 2), y: height - 200 }
    this.addAsset(itemsBar)

    super.load(context)
  }
}
