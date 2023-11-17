import type { SceneContext } from '@/index'
import { Scene } from '@/index'
import { RectangleAsset } from '../assets/Rectangle'

export class MainMenuScene extends Scene {
  public readonly id = 'MainMenu'

  public load(context: SceneContext): void {
    const { enigamier: { canvas } } = context
    const rectanglesScope = {
      startX: 0,
      startY: 0,
      endX: canvas.width,
      endY: canvas.height,
    }
    const firstRectangleAsset = new RectangleAsset({
      up: 'ArrowUp',
      down: 'ArrowDown',
      left: 'ArrowLeft',
      right: 'ArrowRight',
    })
    firstRectangleAsset.texture.scope = rectanglesScope
    const secondRectangleAsset = new RectangleAsset({
      up: 'w',
      down: 's',
      left: 'a',
      right: 'd',
    })
    secondRectangleAsset.id = 'secondRectangle'
    secondRectangleAsset.texture.position = { x: 200, y: 100 }
    secondRectangleAsset.texture.color = 'pink'
    secondRectangleAsset.texture.scope = rectanglesScope
    this.addAsset(firstRectangleAsset)
    this.addAsset(secondRectangleAsset)
    super.load(context)
  }
}
