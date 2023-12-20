import type { SceneContext, TextureSize, TilesMap, TilesAtlas } from '@/index'
import { ScrollableScene, TileMapAsset } from '@/index'

import atlasImageSrc from './imgs/plains.png'
import { RectangleAsset } from '../ExampleScene/assets/Rectangle'

const tilesMap: TilesMap = {
  rows: 2,
  cols: 2,
  tileSize: 64,
}

export class WorldScene extends ScrollableScene {
  public readonly id = 'World'

  protected mapSize: TextureSize = {
    width: tilesMap.tileSize * tilesMap.cols,
    height: tilesMap.tileSize * tilesMap.rows,
  }

  private readonly tilesAtlas: TilesAtlas

  public tiles = [2, 3, 8, 9]

  constructor() {
    super()
    const atlasImage = new Image()
    atlasImage.src = atlasImageSrc
    this.tilesAtlas = {
      cols: 6,
      rows: 8,
      image: atlasImage,
      tileSize: 16,
    }
  }

  public load(context: SceneContext): void {
    const tileMapAsset = new TileMapAsset('map', this.tilesAtlas, tilesMap)
    tileMapAsset.texture.tiles = this.tiles

    const { width, height } = this.mapSize
    const rectanglesScope = {
      startX: 0,
      startY: 0,
      endX: width,
      endY: height,
    }
    const firstRectangleAsset = new RectangleAsset({
      up: 'ArrowUp',
      down: 'ArrowDown',
      left: 'ArrowLeft',
      right: 'ArrowRight',
    })
    firstRectangleAsset.id = 'Rectangle'
    firstRectangleAsset.texture.size = { width: 200, height: 200 }
    firstRectangleAsset.texture.scope = rectanglesScope

    this.addAsset(tileMapAsset)

    // this.addAsset(firstRectangleAsset)

    // this.followAsset('Rectangle')
    super.load(context)
  }
}
