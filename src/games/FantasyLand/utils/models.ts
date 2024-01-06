import type { TilesAtlas, TilesMap } from '@/index'

export interface TileObjectData {
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
}

export interface TileData {
  id: number;
  objectgroup?: {
    id: number;
    objects: TileObjectData[];
  };
}

export interface TilesetData {
  columns: number;
  tilecount: number;
  tilewidth: number;
  tileheight: number;
  tiles: TileData[];
}

export interface TileMapData {
  height: number; // tiles rows
  width: number; // tiles cols
  tilewidth: number;
  tileheight: number;
  layers: {
    name: string;
    data: number[];
  }[];
}

export interface TileAtlasInfo extends TilesAtlas {
  tilesData: TileData[];
}

export interface TileMapInfo extends TilesMap {
  layers: TileMapData['layers'];
}
