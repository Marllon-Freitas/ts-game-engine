import { Shader } from "./webGL/shader";
import { WegGLUtilities } from "./webGL/webGL";

/**
 * The main engine class for the game.
 */
export class Engine {
  // private methods and attributes:
  private m_canvas: HTMLCanvasElement | null = null;
  private m_shader: Shader | null = null;
  private m_buffer: WebGLBuffer | null = null;

  private loop(): void {
    WegGLUtilities.gl.clear(WegGLUtilities.gl.COLOR_BUFFER_BIT);

    WegGLUtilities.gl.bindBuffer(WegGLUtilities.gl.ARRAY_BUFFER, this.m_buffer);
    WegGLUtilities.gl.vertexAttribPointer(0, 3, WegGLUtilities.gl.FLOAT, false, 0, 0);
    WegGLUtilities.gl.enableVertexAttribArray(0);

    WegGLUtilities.gl.drawArrays(WegGLUtilities.gl.TRIANGLES, 0, 3);

    requestAnimationFrame(this.loop.bind(this));
  }

  private loadShaders(): void {
    let vertexShaderSource = `
      attribute vec3 a_position;
      void main() {
        gl_Position = vec4(a_position, 1.0);
      }
    `;
    let fragmentShaderSource = `
      precision mediump float;
      void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
      }
    `;
    this.m_shader = new Shader("basicShader", vertexShaderSource, fragmentShaderSource);
  }

  private createBuffer(): void {
    this.m_buffer = WegGLUtilities.gl.createBuffer();
    if (!this.m_buffer) throw new Error("Unable to create buffer.");
    
    WegGLUtilities.gl.bindBuffer(WegGLUtilities.gl.ARRAY_BUFFER, this.m_buffer);
    const vertices = new Float32Array([
      // x, y, z
      0, 0, 0,
      0, 0.5, 0,
      0.5, 0.5, 0,
    ]);
    WegGLUtilities.gl.vertexAttribPointer(0, 3, WegGLUtilities.gl.FLOAT, false, 0, 0);
    WegGLUtilities.gl.enableVertexAttribArray(0);
    WegGLUtilities.gl.bufferData(WegGLUtilities.gl.ARRAY_BUFFER, vertices, WegGLUtilities.gl.STATIC_DRAW);

    WegGLUtilities.gl.bindBuffer(WegGLUtilities.gl.ARRAY_BUFFER, null);
    WegGLUtilities.gl.disableVertexAttribArray(0);
  }
  
  // public methods and attributes:
  public constructor() {
    console.log('Engine constructor called');
    this.m_canvas = null;
  }

  /**
   * Starts the engine.
   */
  public start(): void {
    this.m_canvas = WegGLUtilities.initWebGL();
    console.log('WebGL initialized on the canvas:', this.m_canvas);

    WegGLUtilities.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.loadShaders();
    this.m_shader?.use();
    this.createBuffer();

    this.loop();
  }

  /**
   * Resizes the canvas to fit the window.
   */
  public resize(): void {
    if (this.m_canvas) {
      this.m_canvas.width = window.innerWidth;
      this.m_canvas.height = window.innerHeight;
      WegGLUtilities.gl.viewport(0, 0, this.m_canvas.width, this.m_canvas.height);
    }
  }
}