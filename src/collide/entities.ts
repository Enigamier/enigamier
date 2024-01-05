import type { RectCoords } from '@/utils/coords'

export enum CollideEntityTypes {
  rectangle = 'rectangle',
}

export interface CollideEntity {
  type: CollideEntityTypes;
  data: unknown;
  kind?: string;
  collideWith?: string[];
}

export interface RectangleCollideEntity extends CollideEntity {
  type: CollideEntityTypes.rectangle;
  data: RectCoords;
}
