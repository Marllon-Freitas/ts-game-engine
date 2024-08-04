import { gl } from './webgl'

export class Shader {
  private m_name: string
  private m_program!: WebGLProgram

  public constructor(
    name: string,
    vertexSource: string,
    fragmentSource: string
  ) {
    this.m_name = name
    const vertexShader = this.loadShader(gl.VERTEX_SHADER, vertexSource)
    const fragmentShader = this.loadShader(gl.FRAGMENT_SHADER, fragmentSource)

    this.m_program = this.createProgram(vertexShader, fragmentShader)
  }

  public get name(): string {
    return this.m_name
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
}
