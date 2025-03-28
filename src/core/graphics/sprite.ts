import { Vector3 } from '../math/vector3';
import { AttributeInfo, WGLBuffer } from '../webGL/wGLBuffer';

/**
 * The Sprite class represents a 2D sprite in the game engine.
 */
export class Sprite {
  // private methods and attributes:
  private m_name: string;
  private m_width: number;
  private m_height: number;
  private m_buffer!: WGLBuffer;

  // public methods and attributes:
  public position: Vector3 = new Vector3();

  constructor(name: string, width: number = 100, height: number = 100) {
    this.m_name = name;
    this.m_width = width;
    this.m_height = height;
  }

  public load(): void {
    this.m_buffer = new WGLBuffer(3);
    if (!this.m_buffer) throw new Error('Unable to create buffer.');

    let positionAttribute = new AttributeInfo();
    positionAttribute.location = 0;
    positionAttribute.offset = 0;
    positionAttribute.size = 3;
    this.m_buffer.setAttributeLocation(positionAttribute);

    // prettier-ignore
    const vertices = [
      // x, y, z
      0, 0, 0, 
      0, this.m_height, 0, 
      this.m_width, this.m_height, 0, 
      
      this.m_width, this.m_height, 0, 
      this.m_width, 0, 0, 
      0, 0, 0
    ];

    this.m_buffer.pushBackData(vertices);
    this.m_buffer.uploadData();
    this.m_buffer.unbind();
  }

  public draw(): void {
    this.m_buffer.bind();
    this.m_buffer.draw();
  }
}
