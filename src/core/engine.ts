import { Shader } from './gl/shader'
import { gl, WebGLUtilities } from './gl/webgl'

export class Engine {
  private m_canvas!: HTMLCanvasElement
  private m_shader!: Shader

  public constructor() {}

  public start(): void {
    this.m_canvas = WebGLUtilities.initialize()
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    this.resize()
    this.loadShader()
    this.m_shader.useShader()
    this.loop()
  }

  public resize(): void {
    if (!this.m_canvas) {
      return
    }

    this.m_canvas.width = window.innerWidth
    this.m_canvas.height = window.innerHeight
  }

  private loop(): void {
    gl.clear(gl.COLOR_BUFFER_BIT)
    requestAnimationFrame(() => this.loop())
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
