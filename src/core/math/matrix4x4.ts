import { Vector3 } from './vector3'

export class Matrix4x4 {
  private m_data: number[] = []

  private constructor() {
    this.setIdentity()
  }

  public setIdentity(): void {
    this.m_data = [
      1,
      0,
      0,
      0, // first column
      0,
      1,
      0,
      0, // second column
      0,
      0,
      1,
      0, // third column
      0,
      0,
      0,
      1 // fourth column
    ]
  }

  public get data(): number[] {
    return this.m_data
  }

  public static identity(): Matrix4x4 {
    return new Matrix4x4()
  }

  public static translation(position: Vector3): Matrix4x4 {
    const m = new Matrix4x4()
    m.m_data[12] = position.x
    m.m_data[13] = position.y
    m.m_data[14] = position.z
    return m
  }

  public static orthographic(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ): Matrix4x4 {
    const m = new Matrix4x4()
    const leftMinusRight = 1.0 / (left - right)
    const bottomMinusTop = 1.0 / (bottom - top)
    const nearMinusFar = 1.0 / (near - far)

    m.m_data[0] = -2.0 * leftMinusRight
    m.m_data[5] = -2.0 * bottomMinusTop
    m.m_data[10] = 2.0 * nearMinusFar
    m.m_data[12] = (left + right) * leftMinusRight
    m.m_data[13] = (top + bottom) * bottomMinusTop
    m.m_data[14] = (far + near) * nearMinusFar
    return m
  }
}
