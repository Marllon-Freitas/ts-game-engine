import { gl } from './webgl'

export class AttributeInfo {
  public location: number = 0
  public size: number = 0
  public offset: number = 0
}

export class GLBuffer {
  private m_buffer!: WebGLBuffer

  private m_hasAttributeLocation: boolean = false

  private m_elementSize!: number
  private m_stride!: number
  private m_targetBufferType!: number
  private m_dataType!: number
  private m_typeSize!: number
  private m_mode!: number

  private m_data: number[] = []
  private m_attributes: AttributeInfo[] = []

  public constructor(
    elementSize: number,
    dataType: number = gl.FLOAT,
    targetBufferType: number = gl.ARRAY_BUFFER,
    mode: number = gl.TRIANGLES
  ) {
    this.m_elementSize = elementSize
    this.m_dataType = dataType
    this.m_targetBufferType = targetBufferType
    this.m_mode = mode

    switch (this.m_dataType) {
      case gl.FLOAT:
      case gl.INT:
      case gl.UNSIGNED_INT:
        this.m_typeSize = 4
        break
      case gl.UNSIGNED_SHORT:
      case gl.SHORT:
        this.m_typeSize = 2
        break
      case gl.UNSIGNED_BYTE:
      case gl.BYTE:
        this.m_typeSize = 1
        break
      default:
        throw new Error(`[GLBuffer] Invalid data type: ${this.m_dataType}`)
    }

    this.m_stride = this.m_elementSize * this.m_typeSize
    this.m_buffer = gl.createBuffer() as WebGLBuffer
  }

  public destroy(): void {
    gl.deleteBuffer(this.m_buffer)
  }

  public bind(normalized: boolean = false): void {
    gl.bindBuffer(this.m_targetBufferType, this.m_buffer)

    if (this.m_hasAttributeLocation) {
      for (const attribute of this.m_attributes) {
        gl.vertexAttribPointer(
          attribute.location,
          attribute.size,
          this.m_dataType,
          normalized,
          this.m_stride,
          attribute.offset * this.m_typeSize
        )
        gl.enableVertexAttribArray(attribute.location)
      }
    }
  }

  public unbind(): void {
    for (const attribute of this.m_attributes) {
      gl.disableVertexAttribArray(attribute.location)
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.m_buffer)
  }

  public addAttributeLocation(info: AttributeInfo): void {
    this.m_hasAttributeLocation = true
    this.m_attributes.push(info)
  }

  public addData(data: number[]): void {
    for (const value of data) {
      this.m_data.push(value)
    }
  }

  public upload(): void {
    gl.bindBuffer(this.m_targetBufferType, this.m_buffer)

    let bufferData: ArrayBuffer

    switch (this.m_dataType) {
      case gl.FLOAT:
        bufferData = new Float32Array(this.m_data)
        break
      case gl.INT:
        bufferData = new Int32Array(this.m_data)
        break
      case gl.UNSIGNED_INT:
        bufferData = new Uint32Array(this.m_data)
        break
      case gl.UNSIGNED_SHORT:
        bufferData = new Uint16Array(this.m_data)
        break
      case gl.SHORT:
        bufferData = new Int16Array(this.m_data)
        break
      case gl.UNSIGNED_BYTE:
        bufferData = new Uint8Array(this.m_data)
        break
      case gl.BYTE:
        bufferData = new Int8Array(this.m_data)
        break
      default:
        throw new Error(`[GLBuffer] Invalid data type: ${this.m_dataType}`)
    }

    gl.bufferData(this.m_targetBufferType, bufferData, gl.STATIC_DRAW)
  }

  public draw(): void {
    if (this.m_targetBufferType === gl.ARRAY_BUFFER) {
      gl.drawArrays(this.m_mode, 0, this.m_data.length / this.m_elementSize)
    } else if (this.m_targetBufferType === gl.ELEMENT_ARRAY_BUFFER) {
      gl.drawElements(this.m_mode, this.m_data.length, this.m_dataType, 0)
    }
  }
}
