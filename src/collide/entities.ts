import type { AssetCoords } from '@/assets'

export enum CollideEntityTypes {
  rectangle = 'rectangle',
}

export interface CollideEntity {
  isPassive?: boolean;
  type: CollideEntityTypes;
  data: unknown;
}

export interface RectangleCollideEntity extends CollideEntity {
  type: CollideEntityTypes.rectangle;
  data: AssetCoords;
}
