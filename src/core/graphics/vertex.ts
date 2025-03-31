import { Vector2 } from '../math/vector2';
import { Vector3 } from '../math/vector3';

/**
 * Represents the data for a single vertex.
 */
export class Vertex {
  public position: Vector3 = Vector3.zero;
  public textureCoordinates: Vector2 = Vector2.zero;

  constructor(x: number = 0, y: number = 0, z: number = 0, u: number = 0, v: number = 0) {
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;

    this.textureCoordinates.x = u;
    this.textureCoordinates.y = v;
  }

  public toArray(): number[] {
    return [...this.position.toArray(), ...this.textureCoordinates.toArray()];
  }

  public toFloat32Array(): Float32Array {
    return new Float32Array(this.toArray());
  }
}
