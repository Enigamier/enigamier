import type { SceneContext, TextureSize } from '@/index'
import { Scene } from '@/index'

import { ScoreBarAsset } from './assets/ScoreBar'
import { Button } from '../../assets/Button'
import { PlayerBarAsset } from './assets/PlayerBar'
import { DogeBallAsset } from './assets/DogeBall'

export class BattlegroundScene extends Scene {
  public readonly id = 'Battleground'

  public load(context: SceneContext): void {
    const { width, height } = context.enigamier.canvas

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
      endX: playerBarsSize.width,
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
    const dogeBallAsset = new DogeBallAsset()
    dogeBallAsset.texture.position = {
      x: width / 2 - dogeBallSize / 2,
      y: (height - scoreBarHeight) / 2 - dogeBallSize / 2,
    }
    dogeBallAsset.texture.size = { width: dogeBallSize, height: dogeBallSize }
    dogeBallAsset.texture.scope = {
      startX: 0,
      startY: scoreBarHeight,
      endX: width,
      endY: height,
    }

    this.addAsset(scoreBarAsset)
    this.addAsset(backButton)
    this.addAsset(player1BarAsset)
    this.addAsset(player2BarAsset)
    this.addAsset(dogeBallAsset)
    super.load(context)
  }

  protected renderBgTexture(): void {
    const { canvasContext: ctx, enigamier: { canvas: { width, height } } } = this.context
    ctx.fillStyle = 'silver'
    ctx.fillRect(0, 0, width, height)
  }
}
