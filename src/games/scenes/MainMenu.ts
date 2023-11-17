import type { SceneContext } from '@/index'
import { Scene } from '@/index'
import { RectangleAsset } from '../assets/Rectangle'

export class MainMenuScene extends Scene {
  public readonly id = 'MainMenu'

  public register(context: SceneContext): void {
    super.register(context)
    const assetsContext = { gc: context.gc }

    this.addAsset(new RectangleAsset(assetsContext))
  }
}
