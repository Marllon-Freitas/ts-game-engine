import { AttributeInfo, GLBuffer } from './gl/glBuffer'
import { Shader } from './gl/shader'
import { gl, WebGLUtilities } from './gl/webgl'

export class Engine {
  private m_canvas!: HTMLCanvasElement
  private m_shader!: Shader
  private m_buffer!: GLBuffer

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

    // set uniforms
    const colorLocation = this.m_shader.getUniformLocation('u_color')
    gl.uniform4f(colorLocation, 1.0, 0.0, 0.0, 1.0)

    this.m_buffer.bind()
    this.m_buffer.draw()

    requestAnimationFrame(() => this.loop())
  }

  private createBuffer(): void {
    this.m_buffer = new GLBuffer(3)
    if (!this.m_buffer) {
      throw new Error('[Engine] Error creating buffer')
    }

    const positionAttribute = new AttributeInfo()
    positionAttribute.location =
      this.m_shader.getAttributeLocation('a_position')
    positionAttribute.offset = 0
    positionAttribute.size = 3
    this.m_buffer.addAttributeLocation(positionAttribute)

    const vertices = [
      // X,   Y,  Z
      0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.5, 0.5, 0.0
    ]
    this.m_buffer.addData(vertices)
    this.m_buffer.upload()
    this.m_buffer.unbind()
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
      uniform vec4 u_color;

      void main() {
        gl_FragColor = u_color;
      }
    `

    this.m_shader = new Shader('basic', vertexSource, fragmentSource)
  }
}
