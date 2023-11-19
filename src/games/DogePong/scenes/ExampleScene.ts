import type { SceneContext } from '@/index'
import { Scene } from '@/index'
import { RectangleAsset } from '../assets/Rectangle'
import { Button } from '../assets/Button'

export class ExampleScene extends Scene {
  public readonly id = 'MainMenu'

  public load(context: SceneContext): void {
    const { enigamier: { canvas } } = context
    const button1 = new Button(300, 0, () => this.removeAsset(firstRectangleAsset))
    button1.isDisabled = true
    const button2 = new Button(400, 0, () => this.removeAsset(secondRectangleAsset))
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
    firstRectangleAsset.texture.size = { width: 200, height: 200 }
    firstRectangleAsset.texture.scope = rectanglesScope
    const secondRectangleAsset = new RectangleAsset({
      up: 'w',
      down: 's',
      left: 'a',
      right: 'd',
    })
    secondRectangleAsset.id = 'secondRectangle'
    secondRectangleAsset.texture.position = { x: 300, y: 200 }
    secondRectangleAsset.texture.color = 'pink'
    secondRectangleAsset.texture.scope = rectanglesScope
    this.addAsset(button1)
    this.addAsset(button2)
    this.addAsset(firstRectangleAsset)
    this.addAsset(secondRectangleAsset)
    super.load(context)
  }
}
