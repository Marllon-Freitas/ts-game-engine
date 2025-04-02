/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vector2 } from '../../math/vector2';
import { IShape2D } from './interfaces/IShape2D';
import { Rectangle2D } from './rectangle2D';

export class Circle2D implements IShape2D {
  public position: Vector2 = Vector2.zero;
  public radius: number = 0;
  public offset: Vector2 = Vector2.zero;

  public setFromJSON(json: any): void {
    if (json.position) this.position.setFromJson(json.position);
    if (!json.radius) throw new Error('Circle2D: radius is required');
    this.radius = Number(json.radius);
    if (!json.offset) throw new Error('Circle2D: offset is required');
    this.offset.setFromJson(json.offset);
  }

  public intersects(otherShape: IShape2D): boolean {
    if (otherShape instanceof Circle2D) {
      const distance = Math.abs(Vector2.distance(otherShape.position, this.position));
      return distance <= this.radius + otherShape.radius;
    }

    if (otherShape instanceof Rectangle2D) {
      if (
        this.pointInShape(otherShape.position) ||
        this.pointInShape(
          new Vector2(otherShape.position.x + otherShape.width, otherShape.position.y)
        ) ||
        this.pointInShape(
          new Vector2(
            otherShape.position.x + otherShape.width,
            otherShape.position.y + otherShape.height
          )
        ) ||
        this.pointInShape(
          new Vector2(otherShape.position.x, otherShape.position.y + otherShape.height)
        )
      ) {
        return true;
      }
    }

    return false;
  }

  public pointInShape(point: Vector2): boolean {
    const absoluteDistance = Math.abs(Vector2.distance(this.position, point));

    return absoluteDistance <= this.radius ? true : false;
  }
}
