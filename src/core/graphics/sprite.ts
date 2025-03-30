import { Matrix4x4 } from '../math/matrix4x4';
import { Vector3 } from '../math/vector3';
import { Shader } from '../webGL/shader';
import { WegGLUtilities } from '../webGL/webGL';
import { AttributeInfo, WGLBuffer } from '../webGL/wGLBuffer';
import { Texture } from './texture';
import { TextureManager } from './textureManager';

/**
 * The Sprite class represents a 2D sprite in the game engine.
 */
export class Sprite {
  // private methods and attributes:
  private m_name: string;
  private m_width: number;
  private m_height: number;
  private m_buffer!: WGLBuffer;
  private m_texture: Texture;
  private m_textureName: string;

  // public methods and attributes:
  public position: Vector3 = new Vector3();

  constructor(name: string, textureName: string, width: number = 100, height: number = 100) {
    this.m_name = name;
    this.m_width = width;
    this.m_height = height;
    this.m_textureName = textureName;
    this.m_texture = TextureManager.getTexture(textureName);
  }

  public get name(): string {
    return this.m_name;
  }

  public destroy(): void {
    if (this.m_buffer) {
      this.m_buffer.destroy();
      TextureManager.releaseTexture(this.m_textureName);
    }
  }

  public load(): void {
    this.m_buffer = new WGLBuffer(5);
    if (!this.m_buffer) throw new Error('Unable to create buffer.');

    let positionAttribute = new AttributeInfo();
    positionAttribute.location = 0;
    positionAttribute.offset = 0;
    positionAttribute.size = 3;
    this.m_buffer.setAttributeLocation(positionAttribute);

    let textCoordAttribute = new AttributeInfo();
    textCoordAttribute.location = 1;
    textCoordAttribute.offset = 3;
    textCoordAttribute.size = 2;
    this.m_buffer.setAttributeLocation(textCoordAttribute);

    // prettier-ignore
    const vertices = [
      // x, y, z,   u, v
      0, 0, 0, 0, 0,
      0, this.m_height, 0, 0, 1.0,
      this.m_width, this.m_height, 0, 1.0, 1.0, 
      
      this.m_width, this.m_height, 0, 1.0, 1.0,
      this.m_width, 0, 0, 1.0, 0,
      0, 0, 0, 0, 0,
    ];

    this.m_buffer.pushBackData(vertices);
    this.m_buffer.uploadData();
    this.m_buffer.unbind();
  }

  public draw(shader: Shader): void {
    let modelLocation = shader.getUniformLocation('u_model');
    WegGLUtilities.gl.uniformMatrix4fv(
      modelLocation,
      false,
      new Float32Array(Matrix4x4.translation(this.position).data)
    );

    let colorLocation = shader.getUniformLocation('u_tint');
    //WegGLUtilities.gl.uniform4f(colorLocation, 1.0, 1.0, 0.0, 1.0);
    WegGLUtilities.gl.uniform4f(colorLocation, 1.0, 1.0, 1.0, 1.0);

    this.m_texture.activateAndBind(0);

    let diffuseLocation = shader.getUniformLocation('u_diffuse');
    WegGLUtilities.gl.uniform1i(diffuseLocation, 0);

    this.m_buffer.bind();
    this.m_buffer.draw();
  }
}
