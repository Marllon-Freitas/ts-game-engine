import { Shader } from './gl/shader'
import { gl, WebGLUtilities } from './gl/webgl'
import { Sprite } from './graphics/sprite'
import { Matrix4x4 } from './math/matrix4x4'

export class Engine {
  private m_canvas!: HTMLCanvasElement
  private m_shader!: Shader
  private m_sprite!: Sprite
  private m_projectionMatrix!: Matrix4x4

  public constructor() {}

  public start(): void {
    this.m_canvas = WebGLUtilities.initialize()
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    this.resize()

    this.loadShader()
    this.m_shader.useShader()

    this.updateProjectionMatrix()

    this.m_sprite = new Sprite('test')
    this.m_sprite.load()
    this.m_sprite.position.x = 100
    this.m_sprite.position.y = 100

    this.loop()
  }

  public resize(): void {
    if (!this.m_canvas) {
      return
    }

    this.m_canvas.width = window.innerWidth
    this.m_canvas.height = window.innerHeight
    gl.viewport(0, 0, this.m_canvas.width, this.m_canvas.height)

    this.updateProjectionMatrix()
  }

  private updateProjectionMatrix(): void {
    const aspectRatio = this.m_canvas.width / this.m_canvas.height
    const orthoHeight = this.m_canvas.height
    const orthoWidth = orthoHeight * aspectRatio

    this.m_projectionMatrix = Matrix4x4.orthographic(
      0,
      orthoWidth,
      0,
      orthoHeight,
      -1.0,
      100.0
    )
  }

  private loop(): void {
    gl.clear(gl.COLOR_BUFFER_BIT)

    // set uniforms
    const colorLocation = this.m_shader.getUniformLocation('u_color')
    gl.uniform4f(colorLocation, 1.0, 0.5, 0.0, 1.0)

    const projectionLocation = this.m_shader.getUniformLocation('u_projection')
    gl.uniformMatrix4fv(
      projectionLocation,
      false,
      new Float32Array(this.m_projectionMatrix.data)
    )

    const modelLocation = this.m_shader.getUniformLocation('u_model')
    gl.uniformMatrix4fv(
      modelLocation,
      false,
      new Float32Array(Matrix4x4.translation(this.m_sprite.position).data)
    )

    this.m_sprite.draw()

    requestAnimationFrame(() => this.loop())
  }

  private loadShader(): void {
    const vertexSource = `
      attribute vec3 a_position;
      uniform mat4 u_projection;
      uniform mat4 u_model;

      void main() {
        gl_Position = u_projection * u_model * vec4(a_position, 1.0);
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
