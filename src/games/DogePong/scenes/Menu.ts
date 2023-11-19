import type { SceneContext } from '@/index'
import { Scene } from '@/index'

import { MenuBackgroundTexture } from '../textures/MenuBackground'

export abstract class MenuScene extends Scene {
  protected bgTexture = new MenuBackgroundTexture()

  public load(context: SceneContext): void {
    super.load(context)
  }
}
