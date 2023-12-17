import type { SceneContext, TextureSize } from '@/index'
import { Scene } from '@/index'

import { ScoreBarAsset } from './assets/ScoreBar'
import { Button } from '../../assets/Button'
import { PlayerBarAsset } from './assets/PlayerBar'
import { DogeBallAsset } from './assets/DogeBall'
import { MessageAsset } from './assets/Message'

const targetScore = 5
const initialDifficulty = {
  speed: 700,
  rotation: Math.PI / 2,
}
const maxDifficulty = {
  speed: 1500,
  rotation: Math.PI * 2,
}

export class BattlegroundScene extends Scene {
  public readonly id = 'Battleground'

  private scores!: [number, number]

  public load(context: SceneContext) {
    const { width, height } = context.enigamier.canvas
    this.scores = [0, 0]

    // Score Bar
    const scoreBarAsset = new ScoreBarAsset()
    const scoreBarHeight = width * (50 / 800)
    scoreBarAsset.texture.size = { width, height: scoreBarHeight }

    // Back button
    const backButton = new Button(width * .03, height * .025, () => context.enigamier.loadScene('MainMenu'))
    backButton.texture.size = { width: width * .04, height: height * .05 }
    backButton.texture.bgStartColor = 'orange'
    backButton.texture.bgEndColor = 'orange'
    backButton.texture.icon = 'back'

    // Payer bars
    const playerBarsScopeOffsetX = width * .01
    const playerBarsSize: TextureSize = { width: width * .025, height: height * .2 }
    const playerBarsStartPosition = (height - scoreBarHeight) / 2 - playerBarsSize.height / 2
    const player1BarAsset = new PlayerBarAsset('Player1Bar', 'left', { up: 'w', down: 'a' })
    player1BarAsset.texture.position.y = playerBarsStartPosition
    player1BarAsset.texture.size = playerBarsSize
    player1BarAsset.texture.scope = {
      startX: playerBarsScopeOffsetX,
      startY: scoreBarHeight,
      endX: playerBarsScopeOffsetX + playerBarsSize.width,
      endY: height,
    }

    const player2BarAsset = new PlayerBarAsset('Player2Bar', 'right', { up: 'p', down: 'l' })
    player2BarAsset.texture.position.y = playerBarsStartPosition
    player2BarAsset.texture.size = playerBarsSize
    player2BarAsset.texture.scope = {
      startX: width - playerBarsScopeOffsetX - playerBarsSize.width,
      startY: scoreBarHeight,
      endX: width - playerBarsScopeOffsetX,
      endY: height,
    }

    // DogeBall
    const dogeBallSize = width * 0.05
    const dogeBallScope = {
      startX: player1BarAsset.texture.scope.endX,
      startY: scoreBarHeight,
      endX: player2BarAsset.texture.scope.startX,
      endY: height,
    }
    const dogeBallAsset = new DogeBallAsset(this.onScore.bind(this))
    dogeBallAsset.texture.size = { width: dogeBallSize, height: dogeBallSize }
    dogeBallAsset.texture.scope = dogeBallScope
    dogeBallAsset.reset()

    // Message
    const messageAsset = new MessageAsset()
    messageAsset.texture.scope = {
      ...messageAsset.texture.scope,
      endX: width,
      endY: height,
    }

    this.addAsset(scoreBarAsset)
    this.addAsset(backButton)
    this.addAsset(player1BarAsset)
    this.addAsset(player2BarAsset)
    this.addAsset(dogeBallAsset)
    this.addAsset(messageAsset)

    this.startGame()
    super.load(context)
  }

  protected renderBgTexture(): void {
    const { canvasContext: ctx, enigamier: { canvas: { width, height } } } = this.context
    const dottedLinesOffset = width * .032

    ctx.save()

    ctx.fillStyle = 'silver'
    ctx.fillRect(0, 0, width, height)

    ctx.lineWidth = width * 0.0015
    ctx.setLineDash([width * 0.01])
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)'
    ctx.beginPath()
    ctx.moveTo(dottedLinesOffset, 0)
    ctx.lineTo(dottedLinesOffset, height)
    ctx.stroke()
    ctx.beginPath()
    ctx.strokeStyle = 'rgba(0, 0, 255, 0.3)'
    ctx.moveTo(width - dottedLinesOffset, 0)
    ctx.lineTo(width - dottedLinesOffset, height)
    ctx.stroke()

    ctx.restore()
  }

  private async onScore(player: 1 | 2) {
    const ballAsset = this.assets.DogeBall as DogeBallAsset
    const player1BarAsset = this.assets.Player1Bar as PlayerBarAsset
    const player2BarAsset = this.assets.Player2Bar as PlayerBarAsset
    const scoreBarAsset = this.assets.ScoreBar as ScoreBarAsset
    ballAsset.stop()
    player1BarAsset.freeze()
    player2BarAsset.freeze()

    this.scores[player - 1]++
    scoreBarAsset.texture.scores = this.scores
    await this.showScoreMessages(player)

    if (this.scores.every(score => score < targetScore)) {
      this.startNewSet()
    } else {
      this.endGame()
    }
  }

  private async startGame() {
    const messageAsset = this.assets.Message as MessageAsset
    await messageAsset.showMessage('Welcome to a new DogePong match!!!', 3000)
    await messageAsset.showMessage(`Score ${targetScore} times to win`, 3000)
    this.startNewSet()
  }

  private async showScoreMessages(player: 1 | 2) {
    const messageAsset = this.assets.Message as MessageAsset
    await messageAsset.showMessage(`GOOOOL!! for Player ${player}`, 3000)
  }

  private setDifficulty() {
    const ballAsset = this.assets.DogeBall as DogeBallAsset
    const steps = (targetScore * 2) - 2
    const currentScores = this.scores[0] + this.scores[1]
    const { speed: initialSpeed, rotation: initialRotation } = initialDifficulty
    const { speed: maxSpeed, rotation: maxRotation } = maxDifficulty
    const difficulty = {
      speed: initialSpeed + (((maxSpeed - initialSpeed) / steps) * currentScores),
      rotation: initialRotation + (((maxRotation - initialRotation) / steps) * currentScores),
    }
    ballAsset.movement.speed = difficulty.speed
    ballAsset.rotationSpeed = difficulty.rotation
  }

  private async startNewSet() {
    const messageAsset = this.assets.Message as MessageAsset
    const ballAsset = this.assets.DogeBall as DogeBallAsset
    const player1BarAsset = this.assets.Player1Bar as PlayerBarAsset
    const player2BarAsset = this.assets.Player2Bar as PlayerBarAsset
    ballAsset.reset()
    player1BarAsset.enable()
    player2BarAsset.enable()
    await messageAsset.showCountdown(5)
    ballAsset.start()
    this.setDifficulty()
  }

  private async endGame() {
    const winner = this.scores.findIndex(score => score === targetScore) + 1
    const messageAsset = this.assets.Message as MessageAsset
    await messageAsset.showMessage(`Player ${winner} wins!!!`, 3000)
    this.context.enigamier.loadScene('MainMenu')
  }
}
