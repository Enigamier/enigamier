import type { TextureSize } from '@/index'
import { CollidableAsset, Texture } from '@/index'

import type { PlayerBarAsset } from './PlayerBar'
import dogeImage from '../../../imgs/doge_disk49.png'

class DogeBallTexture extends Texture {
  public size: TextureSize = { width: 50, height: 50 }

  public rotation = 0

  private readonly img: HTMLImageElement

  constructor() {
    super()
    this.img = new Image()
    this.img.src = dogeImage
  }

  public render(ctx: CanvasRenderingContext2D) {
    super.render(ctx)
    const { size: { width, height }, img, rotation } = this
    const { x: centerX, y: centerY } = this.centerPoint
    const borderWidth = width / 50
    const borderColor = 'black'

    ctx.translate(centerX, centerY)
    ctx.rotate(rotation)

    // Image
    ctx.drawImage(img, -width / 2, -height / 2, width, height)

    // Border
    ctx.beginPath()
    ctx.arc(0, 0, (width - borderWidth) / 2, 0, Math.PI * 2, false)
    ctx.moveTo(width / -2, 0)
    ctx.strokeStyle = borderColor
    ctx.lineWidth = borderWidth
    ctx.stroke()
  }
}

const initialSpeed = 500
const initialRotationSpeed = Math.PI / 2

const speedIncrementPerCollide = 50
const rotationSpeedIncrementPerCollide = Math.PI / 12

function getAngleAfterCollide(angle: number, axis: 'x' | 'y') {
  return -angle + (axis === 'y' ? Math.PI : 0)
}

// Translate any angle into a equivalent positive angle from 0 to 2 * PI
function normalizeAngle(angle: number): number {
  return Math.abs((angle + Math.PI * 2) % (Math.PI * 2))
}

function getInitialAngle() {
  const angleAmmount = Math.random() * Math.PI / 4
  return angleAmmount + (Math.floor(Math.random() * 4) * Math.PI / 2) + Math.PI / 8
}

export type ScoreCallback = (player: 1 | 2) => void

export class DogeBallAsset extends CollidableAsset {
  declare public texture: DogeBallTexture

  public readonly id = 'DogeBall'

  public rotationSpeed = initialRotationSpeed

  private readonly onScore: ScoreCallback

  constructor(onScore: ScoreCallback) {
    super(new DogeBallTexture())
    this.onScore = onScore
  }

  public start() {
    this.movement = { speed: initialSpeed, angle: getInitialAngle() }
    this.rotationSpeed = initialRotationSpeed
  }

  public stop() {
    this.movement = { speed: 0, angle: 0 }
    this.rotationSpeed = 0
  }

  public reset() {
    this.stop()
    this.texture.rotation = 0
    const { scope: { startX, startY, endX, endY }, size: { width, height } } = this.texture
    this.texture.position = {
      x: (endX - startX) / 2 - width / 2,
      y: (endY - startY) / 2 - height / 2,
    }
  }

  public update(delta: number): void {
    this.checkScopeCollide()
    this.texture.rotation += this.rotationSpeed * (delta / 1000)
    this.move(delta)
  }

  public onCollide(barAsset: PlayerBarAsset): void {
    const { startX: ballStartX, endX: ballEndX } = this.globalHitbox
    const { startX: barStartX, endX: barEndX } = barAsset.globalHitbox
    const { y: ballCenterY } = this.texture.centerPoint
    const { y: barCenterY } = barAsset.texture.centerPoint
    const { height: barHeight } = barAsset.texture.size
    const offsetY = ballCenterY - barCenterY

    if (Math.abs(offsetY) <= barHeight / 2) {
      const newAngle = normalizeAngle(getAngleAfterCollide(this.movement.angle, 'y'))
      this.movement.angle = newAngle

      const offsetX = barAsset.id === 'Player1Bar' ? barEndX - ballStartX : barStartX - ballEndX
      this.texture.position.x += offsetX

      this.movement.speed += speedIncrementPerCollide
      this.rotationSpeed += rotationSpeedIncrementPerCollide
    }
  }

  private checkScopeCollide() {
    if (this.movement.speed) {
      const { startX: ballStartX, startY: ballStartY, endX: ballEndX, endY: ballEndY } = this.globalHitbox
      const { startX: scopeStartX, startY: scopeStartY, endX: scopeEndX, endY: scopeEndY } = this.texture.scope

      if (ballStartY < scopeStartY || ballEndY > scopeEndY) {
        this.movement.angle = getAngleAfterCollide(this.movement.angle, 'x')
      } else if (ballStartX < scopeStartX) {
        this.onScore(2)
      } else if (ballEndX > scopeEndX) {
        this.onScore(1)
      }
    }
  }
}
