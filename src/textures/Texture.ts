interface TexturePosition {
  x: number; y: number;
}

interface TextureSize {
  width: number; height: number;
}

export interface TextureScope {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export abstract class Texture {
  public index = 0

  public position: TexturePosition = { x: 0, y: 0 }

  public size: TextureSize = { width: 0, height: 0 }

  public scope: TextureScope = { startX: 0, startY: 0, endX: 0, endY: 0 }

  public render(cxt: CanvasRenderingContext2D) {
    const { startX, startY } = this.scope
    cxt.translate(startX, startY)
  }
}
