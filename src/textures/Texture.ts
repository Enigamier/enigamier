export abstract class Texture {
  public index = 0

  public position = { x: 0, y: 0 }

  public size = { width: 0, height: 0 }

  public abstract render(cxt: CanvasRenderingContext2D): void
}
