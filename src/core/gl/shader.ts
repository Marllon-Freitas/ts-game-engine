import { gl } from './webgl'

export class Shader {
  private m_name: string
  private m_program!: WebGLProgram
  private m_attributes: { [name: string]: number } = {}
  private m_uniforms: { [name: string]: WebGLUniformLocation } = {}

  public constructor(
    name: string,
    vertexSource: string,
    fragmentSource: string
  ) {
    this.m_name = name
    const vertexShader = this.loadShader(gl.VERTEX_SHADER, vertexSource)
    const fragmentShader = this.loadShader(gl.FRAGMENT_SHADER, fragmentSource)

    this.m_program = this.createProgram(vertexShader, fragmentShader)
    this.detectAttributes()
    this.detectUniforms()
  }

  public get name(): string {
    return this.m_name
  }

  public getAttributeLocation(name: string): number {
    const location = this.m_attributes[name]
    if (location === undefined) {
      throw new Error(
        `[Shader] Attribute '${name}' not found in shader '${this.m_name}'`
      )
    }

    return location
  }

  public getUniformLocation(name: string): WebGLUniformLocation {
    const location = this.m_uniforms[name]
    if (!location) {
      throw new Error(
        `[Shader] Uniform '${name}' not found in shader '${this.m_name}'`
      )
    }

    return location
  }

  private loadShader(shaderType: number, source: string): WebGLShader {
    const shader = gl.createShader(shaderType)
    if (!shader) {
      throw new Error('[Shader] Error creating shader')
    }

    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    const error = gl.getShaderInfoLog(shader)
    if (error !== '') {
      throw new Error(
        `[Shader] Error compiling shader '${this.m_name}': ${error}`
      )
    }

    return shader
  }

  public useShader(): void {
    gl.useProgram(this.m_program)
  }

  private createProgram(
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ): WebGLProgram {
    this.m_program = gl.createProgram() as WebGLProgram

    if (!this.m_program) {
      throw new Error('[Shader] Error creating program')
    }

    gl.attachShader(this.m_program, vertexShader)
    gl.attachShader(this.m_program, fragmentShader)
    gl.linkProgram(this.m_program)

    const error = gl.getProgramInfoLog(this.m_program)
    if (error) {
      throw new Error(
        `[Shader] Error linking program '${this.m_name}': ${error}`
      )
    }

    return this.m_program
  }

  private detectAttributes(): void {
    const attributeCount = gl.getProgramParameter(
      this.m_program,
      gl.ACTIVE_ATTRIBUTES
    )
    for (let i = 0; i < attributeCount; i++) {
      const attributeInfo: WebGLActiveInfo | null = gl.getActiveAttrib(
        this.m_program,
        i
      )
      if (!attributeInfo) {
        break
      }

      const attributeLocation = gl.getAttribLocation(
        this.m_program,
        attributeInfo.name
      )
      if (attributeLocation < 0) {
        throw new Error(
          `[Shader] Error getting attribute location '${attributeInfo.name}'`
        )
      }

      this.m_attributes[attributeInfo.name] = attributeLocation
    }
  }

  private detectUniforms(): void {
    const uniformCount = gl.getProgramParameter(
      this.m_program,
      gl.ACTIVE_UNIFORMS
    )
    for (let i = 0; i < uniformCount; i++) {
      const uniformInfo: WebGLActiveInfo | null = gl.getActiveUniform(
        this.m_program,
        i
      )
      if (!uniformInfo) {
        break
      }

      const uniformLocation = gl.getUniformLocation(
        this.m_program,
        uniformInfo.name
      )
      if (!uniformLocation) {
        throw new Error(
          `[Shader] Error getting uniform location '${uniformInfo.name}'`
        )
      }

      this.m_uniforms[uniformInfo.name] = uniformLocation
    }
  }
}
