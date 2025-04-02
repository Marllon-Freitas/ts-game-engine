/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vector2 } from '../../math/vector2';
import { IShape2D } from './interfaces/IShape2D';
import { Rectangle2D } from './rectangle2D';

export class Circle2D implements IShape2D {
  public position: Vector2 = Vector2.zero;
  public radius: number = 0;
  public origin: Vector2 = Vector2.zero;

  public setFromJSON(json: any): void {
    if (json.position) this.position.setFromJson(json.position);
    if (!json.radius) throw new Error('Circle2D: radius is required');
    this.radius = Number(json.radius);
    if (json.origin) this.origin.setFromJson(json.origin);
  }

  public get offset(): Vector2 {
    return new Vector2(
      this.radius + this.radius * this.origin.x,
      this.radius + this.radius * this.origin.y
    );
  }

  public intersects(otherShape: IShape2D): boolean {
    if (otherShape instanceof Circle2D) {
      const distance = Math.abs(Vector2.distance(otherShape.position, this.position));
      return distance <= this.radius + otherShape.radius;
    }

    if (otherShape instanceof Rectangle2D) {
      let deltaX =
        this.position.x -
        Math.max(
          otherShape.position.x,
          Math.min(this.position.x, otherShape.position.x + otherShape.width)
        );
      let deltaY =
        this.position.y -
        Math.max(
          otherShape.position.y,
          Math.min(this.position.y, otherShape.position.y + otherShape.height)
        );
      return deltaX * deltaX + deltaY * deltaY < this.radius * this.radius;
    }

    return false;
  }

  public pointInShape(point: Vector2): boolean {
    const absoluteDistance = Math.abs(Vector2.distance(this.position, point));

    return absoluteDistance <= this.radius ? true : false;
  }
}
