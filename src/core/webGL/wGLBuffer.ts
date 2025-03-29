import { WegGLUtilities } from './webGL';

/**
 * Represents the information about an attribute in a WebGL buffer.
 */
export class AttributeInfo {
  public location!: number;
  public size!: number;
  public offset!: number;
}

/**
 * Represents a WebGL buffer.
 */
export class WGLBuffer {
  // private methods and attributes:
  private m_hasAttributeLocation: boolean = false;
  private m_elementSize: number;
  private m_stride: number;
  private m_buffer: WebGLBuffer;
  private m_targetBufferType: number;
  private m_dataType: number;
  private m_mode: number;
  private m_typeSize: number;
  private m_data: number[] = [];
  private m_attributes: AttributeInfo[] = [];

  // public methods and attributes:
  /**
   * Creates a new WebGLBuffer instance.
   * @param elementSize The size of each element in the buffer.
   * @param dataType The data type of the buffer elements (e.g., FLOAT, INT). Default is FLOAT.
   * @param targetBufferType The target buffer type (e.g., ARRAY_BUFFER, ELEMENT_ARRAY_BUFFER). Default is ARRAY_BUFFER.
   * @param m_mode The drawing mode (e.g., LINES, TRIANGLES). Default is TRIANGLES.
   */
  constructor(
    elementSize: number,
    dataType: number = WegGLUtilities.gl.FLOAT,
    targetBufferType: number = WegGLUtilities.gl.ARRAY_BUFFER,
    m_mode: number = WegGLUtilities.gl.TRIANGLES
  ) {
    this.m_elementSize = elementSize;
    this.m_dataType = dataType;
    this.m_targetBufferType = targetBufferType;
    this.m_mode = m_mode;

    switch (this.m_dataType) {
      case WegGLUtilities.gl.FLOAT:
      case WegGLUtilities.gl.INT:
      case WegGLUtilities.gl.UNSIGNED_INT:
        this.m_typeSize = 4;
        break;
      case WegGLUtilities.gl.BYTE:
      case WegGLUtilities.gl.UNSIGNED_BYTE:
        this.m_typeSize = 1;
        break;
      case WegGLUtilities.gl.SHORT:
      case WegGLUtilities.gl.UNSIGNED_SHORT:
        this.m_typeSize = 2;
        break;
      default:
        throw new Error(`Unsupported data type: ${dataType.toString()}`);
    }

    this.m_stride = this.m_elementSize * this.m_typeSize;
    this.m_buffer = WegGLUtilities.gl.createBuffer();
  }

  public destroy(): void {
    WegGLUtilities.gl.deleteBuffer(this.m_buffer);
  }

  public bind(normalized: boolean = false): void {
    WegGLUtilities.gl.bindBuffer(this.m_targetBufferType, this.m_buffer);
    if (this.m_hasAttributeLocation) {
      for (let attribute of this.m_attributes) {
        WegGLUtilities.gl.vertexAttribPointer(
          attribute.location,
          attribute.size,
          this.m_dataType,
          normalized,
          this.m_stride,
          attribute.offset * this.m_typeSize
        );
        WegGLUtilities.gl.enableVertexAttribArray(attribute.location);
      }
    }
  }

  public unbind(): void {
    WegGLUtilities.gl.bindBuffer(this.m_targetBufferType, null);
    if (this.m_hasAttributeLocation) {
      for (let attribute of this.m_attributes) {
        WegGLUtilities.gl.disableVertexAttribArray(attribute.location);
      }
    }
  }

  public pushBackData(data: number[]): void {
    this.m_data.push(...data);
  }

  public uploadData(): void {
    WegGLUtilities.gl.bindBuffer(this.m_targetBufferType, this.m_buffer);
    let bufferData: ArrayBuffer;

    switch (this.m_dataType) {
      case WegGLUtilities.gl.FLOAT:
        bufferData = new Float32Array(this.m_data);
        break;
      case WegGLUtilities.gl.INT:
        bufferData = new Int32Array(this.m_data);
        break;
      case WegGLUtilities.gl.UNSIGNED_INT:
        bufferData = new Uint32Array(this.m_data);
        break;
      case WegGLUtilities.gl.BYTE:
        bufferData = new Int8Array(this.m_data);
        break;
      case WegGLUtilities.gl.UNSIGNED_BYTE:
        bufferData = new Uint8Array(this.m_data);
        break;
      case WegGLUtilities.gl.SHORT:
        bufferData = new Int16Array(this.m_data);
        break;
      case WegGLUtilities.gl.UNSIGNED_SHORT:
        bufferData = new Uint16Array(this.m_data);
        break;
      default:
        throw new Error(`Unsupported data type: ${this.m_dataType.toString()}`);
    }

    WegGLUtilities.gl.bufferData(
      this.m_targetBufferType,
      bufferData,
      WegGLUtilities.gl.STATIC_DRAW
    );
  }

  /**
   * Adds an attribute with the specified information to the buffer.
   * @param attributeInfo The attribute information to set.
   */
  public setAttributeLocation(attributeInfo: AttributeInfo): void {
    this.m_hasAttributeLocation = true;
    this.m_attributes.push(attributeInfo);
  }

  public draw(): void {
    if (this.m_targetBufferType === WegGLUtilities.gl.ARRAY_BUFFER) {
      WegGLUtilities.gl.drawArrays(this.m_mode, 0, this.m_data.length / this.m_elementSize);
    } else if (this.m_targetBufferType === WegGLUtilities.gl.ELEMENT_ARRAY_BUFFER) {
      WegGLUtilities.gl.drawElements(this.m_mode, this.m_data.length, this.m_dataType, 0);
    }
  }
}
