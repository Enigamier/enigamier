import type { AssetContext, AssetMovement, KeyboardController, RectSize } from '@/index'
import { HitboxAsset, Texture } from '@/index'

class PlayerBarTexture extends Texture {
  public size: RectSize = { width: 30, height: 130 }

  public orientation: 'left' | 'right' = 'left'

  public render(ctx: CanvasRenderingContext2D) {
    const { size: { width, height }, orientation } = this
    const backgroundColor = 'white'
    const font = `bold ${width / 1.7}px Comic Sans MS`
    const borderColor = 'black'
    const text = orientation === 'left' ? 'Wow Doge!!' : 'Such Pong!!'
    const textColor = orientation === 'left' ? 'red' : 'blue'
    const borderWidth = width / 30
    const borderOffset = borderWidth / 2

    // Background
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, width, height)

    // Border
    ctx.beginPath()

    ctx.moveTo(0, borderOffset)
    ctx.lineTo(width, borderOffset)
    ctx.moveTo(0, height - borderOffset)
    ctx.lineTo(width, height - borderOffset)
    ctx.moveTo(borderOffset, 0)
    ctx.lineTo(borderOffset, height)
    ctx.moveTo(width - borderOffset, 0)
    ctx.lineTo(width - borderOffset, height)
    ctx.lineWidth = borderWidth
    ctx.strokeStyle = borderColor
    ctx.stroke()

    //Texto
    ctx.translate(width / 2, height / 2)
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
