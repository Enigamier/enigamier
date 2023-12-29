import type { SceneContext, TextureSize } from '@/index'
import { ScrollableScene } from '@/index'
import { RectangleAsset } from '../assets/Rectangle'

export class ExampleScene extends ScrollableScene {
  public readonly id = 'Example'

  protected mapSize: TextureSize = {
    width: 3000,
    height: 2000,
  }

  public load(context: SceneContext): void {
    const { width, height } = this.mapSize
    const rectanglesScope = {
      startX: 0,
      startY: 0,
      endX: width,
      endY: height,
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

    this.addAsset(firstRectangleAsset)
    this.addAsset(secondRectangleAsset)

    this.followAsset('secondRectangle')
    super.load(context)
  }
}
