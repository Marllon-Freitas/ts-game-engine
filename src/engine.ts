import { gl, WebGLUtilities } from './webgl'

export class Engine {
  private m_canvas!: HTMLCanvasElement

  public constructor() {}

  public start(): void {
    this.m_canvas = WebGLUtilities.initialize()

    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    this.loop()
  }

  private loop(): void {
    gl.clear(gl.COLOR_BUFFER_BIT)
    requestAnimationFrame(() => this.loop())
  }
}
