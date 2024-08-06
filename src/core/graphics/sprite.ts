import { AttributeInfo, GLBuffer } from '../gl/glBuffer'
import { Vector3 } from '../math/vector3'

export class Sprite {
  private m_buffer!: GLBuffer

  private m_name: string
  private m_width: number
  private m_height: number

  public position: Vector3 = new Vector3()

  public constructor(
    m_name: string,
    m_width: number = 100,
    m_height: number = 100
  ) {
    this.m_name = m_name
    this.m_width = m_width
    this.m_height = m_height
  }

  public load(): void {
    this.m_buffer = new GLBuffer(3)
    if (!this.m_buffer) {
      throw new Error('[Engine] Error creating buffer')
    }

    const positionAttribute = new AttributeInfo()
    positionAttribute.location = 0 // the position attribute will be the first attribute in the VAO
    positionAttribute.offset = 0
    positionAttribute.size = 3
    this.m_buffer.addAttributeLocation(positionAttribute)

    const vertices = [
      // X,   Y,  Z
      0.0,
      0.0,
      0.0,
      0.0,
      this.m_height,
      0.0,
      this.m_width,
      this.m_height,
      0.0,
      this.m_width,
      this.m_height,
      0.0,
      this.m_width,
      0.0,
      0.0,
      0.0,
      0.0,
      0.0
    ]
    this.m_buffer.addData(vertices)
    this.m_buffer.upload()
    this.m_buffer.unbind()
  }

  public draw(): void {
    this.m_buffer.bind()
    this.m_buffer.draw()
  }
}
