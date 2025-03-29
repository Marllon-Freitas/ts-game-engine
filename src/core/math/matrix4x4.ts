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
    matrix.m_data[12] = (left + top) * leftRight;
    matrix.m_data[13] = (top + bottom) * bottomTop;
    matrix.m_data[14] = (farClip + nearClip) * nearFar;

    return matrix;
  }
}
