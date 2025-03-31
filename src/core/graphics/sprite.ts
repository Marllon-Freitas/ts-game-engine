import { Matrix4x4 } from '../math/matrix4x4';
import { Shader } from '../webGL/shader';
import { WegGLUtilities } from '../webGL/webGL';
import { AttributeInfo, WGLBuffer } from '../webGL/wGLBuffer';
import { Material } from './material';
import { MaterialManager } from './materialManager';

/**
 * The Sprite class represents a 2D sprite in the game engine.
 */
export class Sprite {
  // private methods and attributes:
  private m_name: string;
  private m_width: number;
  private m_height: number;
  private m_buffer!: WGLBuffer;
  private m_material: Material | null;
  private m_materialName: string | null;

  // public methods and attributes:
  constructor(name: string, materialName: string, width: number = 100, height: number = 100) {
    this.m_name = name;
    this.m_width = width;
    this.m_height = height;
    this.m_materialName = materialName;
    this.m_material = MaterialManager.getMaterial(this.m_materialName);
  }

  public get name(): string {
    return this.m_name;
  }

  public destroy(): void {
    if (this.m_buffer) {
      this.m_buffer.destroy();
      if (this.m_materialName) MaterialManager.releaseMaterial(this.m_materialName);
      this.m_material = null;
      this.m_materialName = null;
    }
  }

  public load(): void {
    this.m_buffer = new WGLBuffer();
    if (!this.m_buffer) throw new Error('Unable to create buffer.');

    let positionAttribute = new AttributeInfo();
    positionAttribute.location = 0;
    positionAttribute.size = 3;
    this.m_buffer.setAttributeLocation(positionAttribute);

    let textCoordAttribute = new AttributeInfo();
    textCoordAttribute.location = 1;
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

  public draw(shader: Shader, modelMatrix: Matrix4x4): void {
    let modelLocation = shader.getUniformLocation('u_model');
    WegGLUtilities.gl.uniformMatrix4fv(modelLocation, false, modelMatrix.toFloat32Array());

    let colorLocation = shader.getUniformLocation('u_tint');
    if (this.m_material) {
      WegGLUtilities.gl.uniform4fv(colorLocation, this.m_material.tint.toFloat32Array());

      if (this.m_material.diffuseTexture) {
        this.m_material.diffuseTexture.activateAndBind(0);
        let diffuseLocation = shader.getUniformLocation('u_diffuse');
        WegGLUtilities.gl.uniform1i(diffuseLocation, 0);
      }
    }

    this.m_buffer.bind();
    this.m_buffer.draw();
  }
}
