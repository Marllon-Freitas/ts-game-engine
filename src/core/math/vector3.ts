/* eslint-disable @typescript-eslint/no-explicit-any */
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

  public static get zero(): Vector3 {
    return new Vector3();
  }

  public static get one(): Vector3 {
    return new Vector3(1, 1, 1);
  }

  public copyFrom(vector: Vector3): void {
    this.m_x = vector.m_x;
    this.m_y = vector.m_y;
    this.m_z = vector.m_z;
  }

  public setFromJson(json: any): void {
    if (json.x !== undefined) this.m_x = Number(json.x);
    if (json.y !== undefined) this.m_y = Number(json.y);
    if (json.z !== undefined) this.m_z = Number(json.z);
  }

  public add(vector: Vector3): Vector3 {
    this.m_x += vector.m_x;
    this.m_y += vector.m_y;
    this.m_z += vector.m_z;
    return this;
  }

  public subtract(vector: Vector3): Vector3 {
    this.m_x -= vector.m_x;
    this.m_y -= vector.m_y;
    this.m_z -= vector.m_z;
    return this;
  }

  public multiply(vector: Vector3): Vector3 {
    this.m_x *= vector.m_x;
    this.m_y *= vector.m_y;
    this.m_z *= vector.m_z;
    return this;
  }

  public divide(vector: Vector3): Vector3 {
    this.m_x /= vector.m_x;
    this.m_y /= vector.m_y;
    this.m_z /= vector.m_z;
    return this;
  }
}
