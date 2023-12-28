import type { AssetContext, AssetMovement, KeyboardController, TextureSize } from '@/index'
import { HitboxAsset, Texture } from '@/index'

class PlayerBarTexture extends Texture {
  public size: TextureSize = { width: 30, height: 130 }

  public orientation: 'left' | 'right' = 'left'

  public render(ctx: CanvasRenderingContext2D) {
    super.render(ctx)
    const { size: { width, height }, orientation } = this
    const { x, y } = this.position
    const backgroundColor = 'white'
    const font = `bold ${width / 1.7}px Comic Sans MS`
    const borderColor = 'black'
    const text = orientation === 'left' ? 'Wow Doge!!' : 'Such Pong!!'
    const textColor = orientation === 'left' ? 'red' : 'blue'
    const borderWidth = width / 30
    const borderOffset = borderWidth / 2

    // Background
    ctx.fillStyle = backgroundColor
    ctx.fillRect(x, y, width, height)

    // Border
    ctx.beginPath()

    ctx.moveTo(x, y + borderOffset)
    ctx.lineTo(x + width, y + borderOffset)
    ctx.moveTo(x, y + height - borderOffset)
    ctx.lineTo(x + width, y + height - borderOffset)
    ctx.moveTo(x + borderOffset, y)
    ctx.lineTo(x + borderOffset, y + height)
    ctx.moveTo(x + width - borderOffset, y)
    ctx.lineTo(x + width - borderOffset, y + height)
    ctx.lineWidth = borderWidth
    ctx.strokeStyle = borderColor
    ctx.stroke()

    //Texto
    ctx.translate(x + width / 2, y + height / 2)
    ctx.rotate((orientation == 'right' ? -1 : 1) * Math.PI / 2)
    ctx.font = font
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = textColor
    ctx.fillText(text, 0, 0)
  }
}

interface PlayerBarMoveKeys {
  up: string;
  down: string;
}

const moveSpeed = 500 // per second

export class PlayerBarAsset extends HitboxAsset {
  declare public texture: PlayerBarTexture

  public readonly id

  public movement: AssetMovement = { speed: moveSpeed, angle: 0 }

  private readonly moveKeys: PlayerBarMoveKeys

  private kbController!: KeyboardController

  constructor(id: string, orientation: 'left' | 'right', moveKeys: PlayerBarMoveKeys) {
    super(new PlayerBarTexture())
    this.id = id
    this.moveKeys = moveKeys
    this.texture.orientation = orientation
  }

  private get moveKeysCodesMap() {
    return Object.values(this.moveKeys).reduce((codesMap, keyCode) => ({ ...codesMap, [keyCode]: true }), {})
  }

  public load(context: AssetContext): void {
    super.load(context)
    this.kbController = context.gc.controllers.keyboard as KeyboardController
  }

  public update(delta: number): void {
    const areMoveKeysPressed = Object.keys(this.kbController.inputs).some(key => this.moveKeysCodesMap[key])

    if (areMoveKeysPressed) {
      const { [this.moveKeys.up]: isUp } = this.kbController.inputs
      this.movement.angle = Math.PI * (isUp ? .5 : -.5)
      this.move(delta)
      this.fixToScope()
    }
  }

  public freeze() {
    this.movement.speed = 0
  }

  public enable() {
    this.movement.speed = moveSpeed
  }
}
