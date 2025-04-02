/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vector2 } from '../../../math/vector2';

export interface IShape2D {
  position: Vector2;
  origin: Vector2;
  readonly offset: Vector2;
  setFromJSON(json: any): void;
  intersects(otherShape: IShape2D): boolean;
  pointInShape(point: Vector2): boolean;
}
