interface TexturePosition {
  x: number; y: number;
}

interface TextureSize {
  width: number; height: number;
}

export abstract class Texture {
  public index = 0

  public position: TexturePosition = { x: 0, y: 0 }

  public size: TextureSize = { width: 0, height: 0 }

  public abstract render(cxt: CanvasRenderingContext2D): void
}
