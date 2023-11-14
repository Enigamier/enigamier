import { Enigamier, Asset, Scene, Texture } from '@/index'

class RectangeTexture extends Texture {
  public render(cxt: CanvasRenderingContext2D) {
    cxt.fillStyle = 'red'
    cxt.fillRect(this.position.x, this.position.y, 100, 100)
  }
}

class RectangleAsset extends Asset {
  constructor(id: string) {
    super(id, new RectangeTexture())
  }

  public update() {
    const { x, y } = this.texture.position
    this.texture.position = {
      x: x < 1000 ? x + 6 : 0,
      y: y < 500 ? y + 3 : 0,
    }
  }
}

export function DogePongGame(canvasId: string) {
  const enigamier = new Enigamier(canvasId)

  const asset = new RectangleAsset('asset')
  const scene = new Scene('scene')
  scene.addAsset(asset)

  enigamier.start(scene)
}
