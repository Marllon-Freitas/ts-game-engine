import { Vector3 } from './vector3';

export class Matrix4x4 {
  // private methods and attributes:
  private m_data: number[] = [];

  private constructor() {
    // identity matrix
    this.m_data = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  }

  // public methods and attributes:
  public get data(): number[] {
    return this.m_data;
  }

  public static identity(): Matrix4x4 {
    return new Matrix4x4();
  }

  public static orthographic(
    left: number,
    right: number,
    bottom: number,
    top: number,
    nearClip: number,
    farClip: number
  ): Matrix4x4 {
    const matrix = new Matrix4x4();
    const leftRight: number = 1.0 / (left - right);
    const bottomTop: number = 1.0 / (bottom - top);
    const nearFar: number = 1.0 / (nearClip - farClip);

    matrix.m_data[0] = -2.0 * leftRight;
    matrix.m_data[5] = -2.0 * bottomTop;
    matrix.m_data[10] = 2.0 * nearFar;
    matrix.m_data[12] = (left + right) * leftRight;
    matrix.m_data[13] = (top + bottom) * bottomTop;
    matrix.m_data[14] = (farClip + nearClip) * nearFar;

    return matrix;
  }

  public static translation(position: Vector3): Matrix4x4 {
    const matrix = new Matrix4x4();
    matrix.m_data[12] = position.x;
    matrix.m_data[13] = position.y;
    matrix.m_data[14] = position.z;

    return matrix;
  }

  public static rotationX(angleInRadians: number): Matrix4x4 {
    const matrix = new Matrix4x4();
    const cos = Math.cos(angleInRadians);
    const sin = Math.sin(angleInRadians);

    matrix.m_data[5] = cos;
    matrix.m_data[6] = sin;
    matrix.m_data[9] = -sin;
    matrix.m_data[10] = cos;

    return matrix;
  }

  public static rotationY(angleInRadians: number): Matrix4x4 {
    const matrix = new Matrix4x4();
    const cos = Math.cos(angleInRadians);
    const sin = Math.sin(angleInRadians);

    matrix.m_data[0] = cos;
    matrix.m_data[2] = -sin;
    matrix.m_data[8] = sin;
    matrix.m_data[10] = cos;

    return matrix;
  }

  public static rotationZ(angleInRadians: number): Matrix4x4 {
    const matrix = new Matrix4x4();
    const cos = Math.cos(angleInRadians);
    const sin = Math.sin(angleInRadians);

    matrix.m_data[0] = cos;
    matrix.m_data[1] = sin;
    matrix.m_data[4] = -sin;
    matrix.m_data[5] = cos;

    return matrix;
  }

  public static rotationXYZ(
    angleInRadiansX: number,
    angleInRadiansY: number,
    angleInRadiansZ: number
  ): Matrix4x4 {
    const matrixX = Matrix4x4.rotationX(angleInRadiansX);
    const matrixY = Matrix4x4.rotationY(angleInRadiansY);
    const matrixZ = Matrix4x4.rotationZ(angleInRadiansZ);

    // multiply matrices in the order: Z -> Y -> X
    return Matrix4x4.multiply(Matrix4x4.multiply(matrixZ, matrixY), matrixX);
  }

  public static multiply(a: Matrix4x4, b: Matrix4x4): Matrix4x4 {
    const result = new Matrix4x4();

    let b00 = b.m_data[0 * 4 + 0];
    let b01 = b.m_data[0 * 4 + 1];
    let b02 = b.m_data[0 * 4 + 2];
    let b03 = b.m_data[0 * 4 + 3];
    let b10 = b.m_data[1 * 4 + 0];
    let b11 = b.m_data[1 * 4 + 1];
    let b12 = b.m_data[1 * 4 + 2];
    let b13 = b.m_data[1 * 4 + 3];
    let b20 = b.m_data[2 * 4 + 0];
    let b21 = b.m_data[2 * 4 + 1];
    let b22 = b.m_data[2 * 4 + 2];
    let b23 = b.m_data[2 * 4 + 3];
    let b30 = b.m_data[3 * 4 + 0];
    let b31 = b.m_data[3 * 4 + 1];
    let b32 = b.m_data[3 * 4 + 2];
    let b33 = b.m_data[3 * 4 + 3];
    let a00 = a.m_data[0 * 4 + 0];
    let a01 = a.m_data[0 * 4 + 1];
    let a02 = a.m_data[0 * 4 + 2];
    let a03 = a.m_data[0 * 4 + 3];
    let a10 = a.m_data[1 * 4 + 0];
    let a11 = a.m_data[1 * 4 + 1];
    let a12 = a.m_data[1 * 4 + 2];
    let a13 = a.m_data[1 * 4 + 3];
    let a20 = a.m_data[2 * 4 + 0];
    let a21 = a.m_data[2 * 4 + 1];
    let a22 = a.m_data[2 * 4 + 2];
    let a23 = a.m_data[2 * 4 + 3];
    let a30 = a.m_data[3 * 4 + 0];
    let a31 = a.m_data[3 * 4 + 1];
    let a32 = a.m_data[3 * 4 + 2];
    let a33 = a.m_data[3 * 4 + 3];

    result.m_data[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
    result.m_data[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
    result.m_data[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
    result.m_data[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
    result.m_data[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
    result.m_data[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
    result.m_data[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
    result.m_data[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
    result.m_data[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
    result.m_data[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
    result.m_data[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
    result.m_data[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
    result.m_data[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
    result.m_data[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
    result.m_data[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
    result.m_data[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;

    return result;
  }

  public static scale(scale: Vector3): Matrix4x4 {
    const matrix = new Matrix4x4();
    matrix.m_data[0] = scale.x;
    matrix.m_data[5] = scale.y;
    matrix.m_data[10] = scale.z;

    return matrix;
  }

  public copyFrom(matrix: Matrix4x4): void {
    this.m_data = [...matrix.m_data];
  }

  public toFloat32Array(): Float32Array {
    return new Float32Array(this.m_data);
  }
}
