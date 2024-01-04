import type { RectSize } from '@/index'
import { Asset, Texture } from '@/index'

type ControlsDir = 'left' | 'right'

interface ControlsKeys {
  up: string;
  down: string;
}

const baseSize: RectSize = { width: 150, height: 150 }

class ControlsTexture extends Texture {
  public size = { ...baseSize }

  private readonly dir: ControlsDir

  private readonly keys: ControlsKeys

  constructor(dir: ControlsDir, keys: ControlsKeys) {
    super()
    this.dir = dir
    this.keys = keys
  }

  public render(cxt: CanvasRenderingContext2D) {
    super.render(cxt)
    const { dir, keys } = this
    const { width, height } = baseSize
    const fillColor = 'rgba(255,255,255,0.6)'
    const textColor = '#9e9e9e'
    const borderColor = '#9e9e9e'
    const borderSize = 3
    const frameRadius = 6
    cxt.scale(this.size.width / width, this.size.height / height)

    // Frame
    // Squares
    cxt.beginPath()

    // Top-Left
    cxt.arc(frameRadius + 0.5, frameRadius + 0.5, frameRadius, Math.PI, Math.PI * 1.5)

    // Top-Right
    cxt.arc(width - frameRadius - 0.5, frameRadius + 0.5, frameRadius, Math.PI * 1.5, 2 * Math.PI)

    // Bottom-Right
    cxt.arc(width - frameRadius - 0.5, height - frameRadius - 0.5, frameRadius, 0, Math.PI / 2)

    // Bottom-Left
    cxt.arc(frameRadius + 0.5, height - frameRadius - 0.5, frameRadius, Math.PI / 2, Math.PI)

    // Finiquito
    cxt.lineTo(0.5, frameRadius)

    cxt.strokeStyle = borderColor
    cxt.fillStyle = fillColor
    cxt.lineWidth = borderSize
    cxt.stroke()
    cxt.fill()

    // Title
    const titleText = dir === 'left' ? 'Player 1' : 'Player 2'
    const titleOffsetX = dir === 'left' ? width - 75 : 5
    const arrowStartX = dir === 'left' ? 5 : width - 5
    const arrowSquareX = arrowStartX + (dir === 'left' ? 10 : -10)
    const arrowEndX = arrowSquareX + (dir === 'left' ? 20 : -20)

    // Title Text
    cxt.font = `bold ${20}px Comic Sans MS`
    cxt.textBaseline = 'middle'
    cxt.fillStyle = textColor
    cxt.fillText(titleText, titleOffsetX, -20)

    // Arrow
    cxt.beginPath()
    cxt.moveTo(arrowStartX, -20)
    cxt.lineTo(arrowSquareX, -30)

    cxt.lineTo(arrowSquareX, -24)
    cxt.lineTo(arrowEndX, -24)
    cxt.lineTo(arrowEndX, -16)
    cxt.lineTo(arrowSquareX, -16)

    cxt.lineTo(arrowSquareX, -10)
    cxt.fill()

    // Controls frame
    // Arrows
    // Up
    cxt.beginPath()
    cxt.moveTo(20, 10)
    cxt.lineTo(30, 18)

    cxt.lineTo(24, 18)
    cxt.lineTo(24, 28)
    cxt.lineTo(16, 28)
    cxt.lineTo(16, 18)

    cxt.lineTo(10, 18)
    cxt.fill()
    cxt.fillText(keys.up, 40, 18)

    // Down
    cxt.beginPath()
    cxt.moveTo(width / 2 + 20, 28)
    cxt.lineTo(width / 2 + 30, 20)

    cxt.lineTo(width / 2 + 24, 20)
    cxt.lineTo(width / 2 + 24, 10)
    cxt.lineTo(width / 2 + 16, 10)
    cxt.lineTo(width / 2 + 16, 20)

    cxt.lineTo(width / 2 + 10, 20)
    cxt.fill()
    cxt.fillText(keys.down, width / 2 + 40, 18)

    // Tactil info
    const tactilInfoTextOffsetX = 10
    cxt.fillText('Also, you can', tactilInfoTextOffsetX, 50)
    cxt.fillText('drag the bar', tactilInfoTextOffsetX, 75)
    cxt.fillText('with your', tactilInfoTextOffsetX, 100)
    cxt.fillText('finger.', tactilInfoTextOffsetX, 125)
  }
}

let idIndex = 0

export class ControlsAsset extends Asset {
  declare public readonly id

  declare public texture: ControlsTexture

  constructor(
    x: number,
    y: number,
    dir: ControlsDir,
    keys: ControlsKeys,
    id = `Controls-${idIndex += 1}`,
  ) {
    super(new ControlsTexture(dir, keys))
    this.id = id
    this.texture.scope = {
      ...this.texture.scope,
      startX: x,
      startY: y,
    }
  }
}
