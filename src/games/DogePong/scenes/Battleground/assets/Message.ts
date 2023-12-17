import type { TextureSize } from '@/index'
import { Asset, Texture } from '@/index'

class MessageTexture extends Texture {
  public size: TextureSize = { width: 300, height: 100 }

  public fontSize = 35

  public lineHeightRel = 1.2

  public text = ''

  public render(ctx: CanvasRenderingContext2D) {
    super.render(ctx)

    if (this.text.length) {
      ctx.save()

      const { startX, startY, endX, endY } = this.scope
      const maxWidth = (endX - startX) / 2
      const padding = this.fontSize
      const lineHeight = this.fontSize * this.lineHeightRel
      const font = `bold ${this.fontSize}px Comic Sans MS`
      ctx.font = font

      const lines: string[] = ['']
      const words = this.text.split(' ')
      let lineI = 0
      for (const word of words) {
        const currentLine = `${lines[lineI]}${lines[lineI].length ? ' ' : ''}${word}`
        if (ctx.measureText(currentLine).width < maxWidth - (padding * 2)) {
          lines[lineI] = currentLine
        } else {
          ++lineI
          lines.push(word)
        }
      }

      const largerLineWidth = Math.max(...lines.map(line => ctx.measureText(line).width))
      this.size = {
        width: largerLineWidth + (padding * 2),
        height: (lines.length * lineHeight) + (padding * 2),
      }
      this.position = {
        x: startX + ((endX - startX) / 2) - this.size.width / 2,
        y: startY + ((endY - startY) / 2) - this.size.height / 2,
      }
      const { position: { x, y }, size: { width, height } } = this
      const startColor = 'red'
      const endColor = 'yellow'
      const fontColor = 'white'
      const radius = 10
      const blur = 10
      const offset = 0

      ctx.translate(x, y)

      const fillStyle = ctx.createLinearGradient(0, 0, 0, height)
      fillStyle.addColorStop(offset, startColor)
      fillStyle.addColorStop(1, endColor)
      ctx.fillStyle = fillStyle
      ctx.miterLimit = 1

      // Squares
      ctx.save()
      ctx.beginPath()

      //Top-Left
      ctx.arc(radius, radius, radius, Math.PI, Math.PI * 1.5)

      //Top-Right
      ctx.arc(width - radius, radius, radius, Math.PI * 1.5, 2 * Math.PI)

      //Bottom-Right
      ctx.arc(width - radius, height - radius, radius, 0, Math.PI / 2)

      //Bottom-Left
      ctx.arc(radius, height - radius, radius, Math.PI / 2, Math.PI)

      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
      ctx.shadowBlur = blur
      ctx.shadowColor = 'black'
      ctx.fill()
      ctx.restore()

      // Text
      ctx.fillStyle = fontColor
      ctx.shadowBlur = blur / 2
      ctx.shadowColor = 'black'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.translate(width / 2, padding + (lineHeight / 2))

      for (let lineI = 0; lineI < lines.length; lineI++) {
        ctx.fillText(lines[lineI], 0, lineI * lineHeight)
      }

      ctx.restore()
    }
  }
}

export class MessageAsset extends Asset {
  declare public texture: MessageTexture

  public readonly id = 'Message'

  private timeoutId?: NodeJS.Timeout

  constructor() {
    super(new MessageTexture())
  }

  public showMessage(text: string, timeout: number): Promise<void> {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }
    this.texture.text = text
    return new Promise(resolve => {
      this.timeoutId = setTimeout(() => {
        this.texture.text = ''
        delete this.timeoutId
        resolve()
      }, timeout)
    })
  }

  public async showCountdown(from: number): Promise<void> {
    await this.showMessage(from.toString(), 1000)
    if (from > 1) {
      await this.showCountdown(from - 1)
    }
  }
}
