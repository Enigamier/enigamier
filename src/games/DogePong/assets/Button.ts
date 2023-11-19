import type { ButtonAssetClickCallback } from '@/index'
import { ButtonAsset, Texture } from '@/index'

export type ButtonTextureState = 'default' | 'hover' | 'active' | 'disabled'

class ButtonTexture extends Texture {
  public size = { width: 150, height: 60 }

  public state: ButtonTextureState = 'default'

  public text = ''

  public icon = ''

  private get blur(): number {
    return this.getValueByState({ hover: 8, active: 1 }, 5)
  }

  private get offset() {
    return this.getValueByState({ active: .25 }, 0)
  }

  public render(cxt: CanvasRenderingContext2D) {
    super.render(cxt)
    const { width, height } = this.size
    const { x: centerX, y: centerY } = this.centerPoint
    const bgStartColor = 'red'
    const bgEndColor = 'yellow'
    const borderRadius = 10
    const textColor = 'white'

    // Background
    const fillGrad = cxt.createLinearGradient(0, 0, 0, height)
    fillGrad.addColorStop(this.offset, bgStartColor)
    fillGrad.addColorStop(1, bgEndColor)
    cxt.fillStyle = fillGrad
    cxt.miterLimit = 1

    // Squares
    cxt.beginPath()

    // Top-Left
    cxt.arc(borderRadius + 0.5, borderRadius + 0.5, borderRadius, Math.PI, Math.PI * 1.5)

    // Top-Right
    cxt.arc(width - borderRadius - 0.5, borderRadius + 0.5, borderRadius, Math.PI * 1.5, 2 * Math.PI)

    // Bottom-Right
    cxt.arc(width - borderRadius - 0.5, height - borderRadius - 0.5, borderRadius, 0, Math.PI / 2)

    // Bottom-Left
    cxt.arc(borderRadius + 0.5, height - borderRadius - 0.5, borderRadius, Math.PI / 2, Math.PI)

    cxt.shadowOffsetX = 0
    cxt.shadowOffsetY = 0
    cxt.shadowBlur = this.blur
    cxt.shadowColor = 'black'
    cxt.fill()

    cxt.fillStyle = textColor
    cxt.shadowBlur = this.blur / 2

    if (this.text) {
      cxt.translate(centerX, centerY)
      cxt.font = `bold ${height / 2}px Comic Sans MS`
      cxt.textAlign = 'center'
      cxt.textBaseline = 'middle'
      cxt.fillStyle = textColor
      cxt.fillText(this.text, 0, 0)
    } else if (this.icon) {
      cxt.beginPath()
      cxt.moveTo(width * 0.15, height * 0.5)
      cxt.lineTo(width * 0.4, height * 0.15)

      cxt.lineTo(width * 0.4, height * 0.4)
      cxt.lineTo(width * 0.8, height * 0.4)
      cxt.lineTo(width * 0.8, height * 0.6)
      cxt.lineTo(width * 0.4, height * 0.6)

      cxt.lineTo(width * 0.4, height * 0.85)
      cxt.fill()
    }
  }

  private getValueByState<T>(matrix: Partial<Record<ButtonTextureState, T>>, defaultValue: T): T {
    return matrix[this.state] ?? defaultValue
  }
}

let idIndex = 0

export class Button extends ButtonAsset {
  declare public readonly id

  declare public texture: ButtonTexture

  constructor(
    x: number,
    y: number,
    callback: ButtonAssetClickCallback,
    width = 150,
    id = `Button-${idIndex += 1}`,
  ) {
    super(new ButtonTexture(), callback)
    this.id = id
    this.texture.size.width = width
    this.texture.scope = {
      startX: x,
      startY: y,
      endX: this.texture.size.width,
      endY: this.texture.size.height,
    }
  }

  public update(): void {
    this.texture.state = 'default'
    if (!this.isDisabled && this.isHover) {
      this.texture.state = 'hover'
    }
    if (this.isActive) {
      this.texture.state = 'active'
    }
  }
}
