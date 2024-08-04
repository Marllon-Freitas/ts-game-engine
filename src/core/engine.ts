import { Shader } from './gl/shader'
import { gl, WebGLUtilities } from './gl/webgl'

export class Engine {
  private m_canvas!: HTMLCanvasElement
  private m_shader!: Shader
  private m_buffer!: WebGLBuffer

  public constructor() {}

  public start(): void {
    this.m_canvas = WebGLUtilities.initialize()
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    this.resize()

    this.loadShader()
    this.m_shader.useShader()
    this.createBuffer()

    this.loop()
  }

  public resize(): void {
    if (!this.m_canvas) {
      return
    }

    this.m_canvas.width = window.innerWidth
    this.m_canvas.height = window.innerHeight
    gl.viewport(0, 0, this.m_canvas.width, this.m_canvas.height)
  }

  private loop(): void {
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.bindBuffer(gl.ARRAY_BUFFER, this.m_buffer)
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(0)
    gl.drawArrays(gl.TRIANGLES, 0, 3)

    requestAnimationFrame(() => this.loop())
  }

  private createBuffer(): void {
    this.m_buffer = gl.createBuffer() as WebGLBuffer
    if (!this.m_buffer) {
      throw new Error('[Engine] Error creating buffer')
    }

    const vertices = new Float32Array([
      // X,   Y,  Z
      0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.5, 0.5, 0.0
    ])
    gl.bindBuffer(gl.ARRAY_BUFFER, this.m_buffer)
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(0)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    gl.disableVertexAttribArray(0)
  }

  private loadShader(): void {
    const vertexSource = `
      attribute vec3 a_position;
      void main() {
        gl_Position = vec4(a_position, 1.0);
      }
    `
    const fragmentSource = `
      precision mediump float;
      void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
      }
    `

    this.m_shader = new Shader('basic', vertexSource, fragmentSource)
  }
}
