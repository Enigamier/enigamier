import { Asset, Texture } from '@/index'

class TextTexture extends Texture {
  public size = { width: 150, height: 60 }

  public text = ''

  public bgColor = 'transparent'

  public color = 'white'

  public startColor = 'yellow'

  public endColor = 'red'

  public isGradient = false

  public render(cxt: CanvasRenderingContext2D) {
    super.render(cxt)
    const { x, y } = this.position
    const { width, height } = this.size
    const { x: centerX, y: centerY } = this.centerPoint

    //Fondo
    if (this.bgColor != 'transparent') {
      cxt.fillStyle = this.bgColor
      cxt.fillRect(x, y, width, height)
    }

    //Texto
    cxt.translate(centerX, centerY)
    cxt.font = `bold ${height}px Comic Sans MS`
    cxt.textAlign = 'center'
    cxt.textBaseline = 'middle'
    cxt.fillStyle = this.color
    if (this.isGradient) {
      const fillGrad = cxt.createLinearGradient(0, height / -2, 0, height / 2)
      fillGrad.addColorStop(0, this.startColor)
      fillGrad.addColorStop(1, this.endColor)
      cxt.fillStyle = fillGrad
    }
    cxt.fillText(this.text, 0, 0)
  }
}

let idIndex = 0

export class Text extends Asset {
  declare public readonly id

  declare public texture: TextTexture

  constructor(
    x: number,
    y: number,
    text: string,
    id = `Text-${idIndex += 1}`,
  ) {
    super(new TextTexture())
    this.id = id
    this.texture.text = text
    this.texture.scope = {
      startX: x,
      startY: y,
      endX: this.texture.size.width,
      endY: this.texture.size.height,
    }
  }
}
