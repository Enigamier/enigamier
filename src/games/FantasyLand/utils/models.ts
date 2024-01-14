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
  animation?: {
    duration: number;
    tileid: number;
  }[];
  objectgroup?: {
    id?: number;
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

export interface BaseTileMapLayerData {
  name: string;
  type: string;
}

export interface TileMapLayerObjectData {
  id: number;
  x: number;
  y: number;
  type: string;
  name: string;
  width: number;
  height: number;
}

export interface ObjectLayerData extends BaseTileMapLayerData {
  type: 'objectgroup';
  objects: TileMapLayerObjectData[];
}

export interface TileLayerData extends BaseTileMapLayerData {
  type: 'tilelayer';
  visible: boolean;
  data: number[];
  class?: string;
}

export type TileMapLayerData = ObjectLayerData | TileLayerData

export interface TileMapData {
  height: number; // tiles rows
  width: number; // tiles cols
  tilewidth: number;
  tileheight: number;
  layers: TileMapLayerData[];
}

export interface TileAtlasInfo extends TilesAtlas {
  tilesData: TileData[];
}

export interface TileMapInfo extends TilesMap {
  layers: TileMapData['layers'];
}
