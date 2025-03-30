import { Matrix4x4 } from './matrix4x4';
import { Vector3 } from './vector3';

export class Transform {
  public position: Vector3 = Vector3.zero;
  public rotation: Vector3 = Vector3.zero;
  public scale: Vector3 = Vector3.one;

  public copyFrom(transform: Transform): void {
    this.position.copyFrom(transform.position);
    this.rotation.copyFrom(transform.rotation);
    this.scale.copyFrom(transform.scale);
  }

  public getTransformMatrix(): Matrix4x4 {
    let translationMatrix: Matrix4x4 = Matrix4x4.translation(this.position);
    let rotationMatrix: Matrix4x4 = Matrix4x4.rotationXYZ(
      this.rotation.x,
      this.rotation.y,
      this.rotation.z
    );
    let scaleMatrix: Matrix4x4 = Matrix4x4.scale(this.scale);

    // multiply matrices in the order: translation -> rotation -> scale
    return Matrix4x4.multiply(Matrix4x4.multiply(translationMatrix, rotationMatrix), scaleMatrix);
  }
}
