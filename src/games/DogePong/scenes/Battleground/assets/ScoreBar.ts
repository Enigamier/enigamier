import type { RectSize } from '@/index'
import { Asset, Texture } from '@/index'

const baseSize: RectSize = { width: 800, height: 50 }

class ScoreBarTexture extends Texture {
  public size = { ...baseSize }

  public playerNames = ['Player 1', 'Player 2']

  public scores = [0, 0]

  public render(cxt: CanvasRenderingContext2D) {
    super.render(cxt)
    const { width, height } = baseSize
    const backgroundColor = 'whitesmoke'
    const borderColor = 'black'
    const font = 'bold 20px Comic Sans MS'
    cxt.scale(this.size.width / width, this.size.height / height)

    // Background
    cxt.fillStyle = backgroundColor
    cxt.fillRect(0, 0, width, height)

    // Border bottom
    cxt.strokeStyle = borderColor

    // Wide line
    cxt.lineWidth = 2
    cxt.beginPath()
    cxt.moveTo(0, height - 1)
    cxt.lineTo(width, height - 1)
    cxt.stroke()

    // Thin line
    cxt.lineWidth = 1
    cxt.beginPath()
    cxt.moveTo(0, height - 5.5)
    cxt.lineTo(width, height - 5.5)
    cxt.stroke()

    // Player names
    cxt.font = font
    cxt.textBaseline = 'middle'
    cxt.textAlign = 'right'
    cxt.fillStyle = 'red'
    cxt.fillText(this.playerNames[0], (width / 2) - 65, height * .4)
    cxt.textAlign = 'left'
    cxt.fillStyle = 'blue'
    cxt.fillText(this.playerNames[1], (width / 2) + 65, height * .4)

    // Score squares
    cxt.beginPath()
    cxt.moveTo((width / 2) - 56.5, 0)
    cxt.lineTo((width / 2) - 56.5, height * .7)
    cxt.lineTo((width / 2) - 26.5, height * .7)
    cxt.lineTo((width / 2) - 26.5, 0)
    cxt.stroke()

    cxt.beginPath()
    cxt.moveTo((width / 2) + 56.5, 0)
    cxt.lineTo((width / 2) + 56.5, height * .7)
    cxt.lineTo((width / 2) + 26.5, height * .7)
    cxt.lineTo((width / 2) + 26.5, 0)
    cxt.stroke()

    // Score numbers
    cxt.font = font
    cxt.textAlign = 'center'
    cxt.textBaseline = 'middle'
    cxt.fillStyle = 'black'
    cxt.fillText(this.scores[0].toString(), (width / 2) - 41, height * .4)
    cxt.fillText(this.scores[1].toString(), (width / 2) + 41, height * .4)
  }
}

export class ScoreBarAsset extends Asset {
  declare public texture: ScoreBarTexture

  public readonly id = 'ScoreBar'

  constructor() {
    super(new ScoreBarTexture())
  }
}
