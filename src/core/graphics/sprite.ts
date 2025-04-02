import { Matrix4x4 } from '../math/matrix4x4';
import { Vector3 } from '../math/vector3';
import { Shader } from '../webGL/shader';
import { WegGLUtilities } from '../webGL/webGL';
import { AttributeInfo, WGLBuffer } from '../webGL/wGLBuffer';
import { Material } from './material';
import { MaterialManager } from './materialManager';
import { Vertex } from './vertex';

/**
 * The Sprite class represents a 2D sprite in the game engine.
 */
export class Sprite {
  // private methods and attributes:
  protected m_name: string;
  protected m_width: number;
  protected m_height: number;
  protected m_buffer!: WGLBuffer;
  protected m_material: Material | null;
  protected m_materialName: string;
  protected m_vertices: Vertex[] = [];
  protected m_origin: Vector3 = Vector3.zero;

  protected calculateVertices(): void {
    let minX = -(this.m_width * this.m_origin.x);
    let maxX = this.m_width * (1.0 - this.m_origin.x);

    let minY = -(this.m_height * this.m_origin.y);
    let maxY = this.m_height * (1.0 - this.m_origin.y);

    // prettier-ignore
    this.m_vertices = [
      // x, y, z,   u, v
      new Vertex(minX, minY, 0, 0, 0),
      new Vertex(minX, maxY, 0, 0, 1.0),
      new Vertex(maxX, maxY, 0, 1.0, 1.0,),
      
      new Vertex(maxX, maxY, 0, 1.0, 1.0),
      new Vertex(maxX, minY, 0, 1.0, 0),
      new Vertex(minX, minY, 0, 0, 0)
    ];

    for (let vertices of this.m_vertices) {
      this.m_buffer.pushBackData(vertices.toArray());
    }

    this.m_buffer.uploadData();
    this.m_buffer.unbind();
  }

  /**
   * Recalculates the position of the vertices.
   * @protected
   */
  protected reCalculateVertices(): void {
    let minX = -(this.m_width * this.m_origin.x);
    let maxX = this.m_width * (1.0 - this.m_origin.x);

    let minY = -(this.m_height * this.m_origin.y);
    let maxY = this.m_height * (1.0 - this.m_origin.y);

    this.m_vertices[0].position.set(minX, minY);
    this.m_vertices[1].position.set(minX, maxY);
    this.m_vertices[2].position.set(maxX, maxY);
    this.m_vertices[3].position.set(maxX, maxY);
    this.m_vertices[4].position.set(maxX, minY);
    this.m_vertices[5].position.set(minX, minY);

    this.m_buffer.clearData();
    for (let vertices of this.m_vertices) {
      this.m_buffer.pushBackData(vertices.toArray());
    }

    this.m_buffer.uploadData();
    this.m_buffer.unbind();
  }

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

  public get origin(): Vector3 {
    return this.m_origin;
  }

  public set origin(value: Vector3) {
    this.reCalculateVertices();
    this.m_origin = value;
  }

  public destroy(): void {
    if (this.m_buffer) {
      this.m_buffer.destroy();
      if (this.m_materialName) MaterialManager.releaseMaterial(this.m_materialName);
      this.m_material = null;
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

    this.calculateVertices();
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

  public update(deltaTime: number): void {}
}
