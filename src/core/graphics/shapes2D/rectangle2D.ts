/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vector2 } from '../../math/vector2';
import { Circle2D } from './circle2D';
import { IShape2D } from './interfaces/IShape2D';

export class Rectangle2D implements IShape2D {
  public position: Vector2 = Vector2.zero;
  public width: number = 0;
  public height: number = 0;
  public offset: Vector2 = Vector2.zero;

  public setFromJSON(json: any): void {
    if (json.position) this.position.setFromJson(json.position);
    if (!json.width) throw new Error('Rectangle2D: width is required');
    this.width = Number(json.width);
    if (!json.height) throw new Error('Rectangle2D: height is required');
    this.height = Number(json.height);
    if (!json.offset) throw new Error('Rectangle2D: offset is required');
    this.offset.setFromJson(json.offset);
  }

  public intersects(otherShape: IShape2D): boolean {
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

    if (otherShape instanceof Circle2D) {
      if (
        otherShape.pointInShape(this.position) ||
        otherShape.pointInShape(new Vector2(this.position.x + this.width, this.position.y)) ||
        otherShape.pointInShape(
          new Vector2(this.position.x + this.width, this.position.y + this.height)
        ) ||
        otherShape.pointInShape(new Vector2(this.position.x, this.position.y + this.height))
      ) {
        return true;
      }
    }
    return false;
  }

  public pointInShape(point: Vector2): boolean {
    return (
      point.x >= this.position.x &&
      point.x <= this.position.x + this.width &&
      point.y >= this.position.y &&
      point.y <= this.position.y + this.height
    );
  }
}
