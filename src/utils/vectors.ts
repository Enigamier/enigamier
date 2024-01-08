import type { PointCoords } from '.'

export interface Vector extends PointCoords {
  angle: number;
  distance: number;
}

export function getVectorEndPoint({ x, y, angle, distance }: Vector): PointCoords {
  return {
    x: Math.round(x + Math.cos(angle) * distance),
    y: Math.round(y - Math.sin(angle) * distance),
  }
}
