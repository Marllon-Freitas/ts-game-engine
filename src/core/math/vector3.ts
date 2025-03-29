/**
 * Vector3 class
 * Represents a 3D vector with x, y, and z components.
 */
export class Vector3 {
  // private methods and attributes:
  private m_x: number;
  private m_y: number;
  private m_z: number;

  // public methods and attributes:
  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.m_x = x;
    this.m_y = y;
    this.m_z = z;
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

  public get z(): number {
    return this.m_z;
  }

  public set z(value: number) {
    this.m_z = value;
  }

  public toArray(): number[] {
    return [this.m_x, this.m_y, this.m_z];
  }

  public toFloat32Array(): Float32Array {
    return new Float32Array(this.toArray());
  }
}
