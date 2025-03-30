/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Vector2 class
 * This class represents a 2D vector with x and y coordinates.
 */
export class Vector2 {
  // private methods and attributes:
  private m_x: number;
  private m_y: number;

  // public methods and attributes:
  constructor(x: number = 0, y: number = 0) {
    this.m_x = x;
    this.m_y = y;
  }

  public get x(): number {
    return this.m_x;
  }

  public set x(value: number) {
    this.m_x = value;
  }

  public get y(): number {
    return this.m_y;
  }

  public set y(value: number) {
    this.m_y = value;
  }

  public toArray(): number[] {
    return [this.m_x, this.m_y];
  }

  public toFloat32Array(): Float32Array {
    return new Float32Array(this.toArray());
  }

  public setFromJson(json: any): void {
    if (json.x !== undefined) this.m_x = Number(json.x);
    if (json.y !== undefined) this.m_y = Number(json.y);
  }
}
