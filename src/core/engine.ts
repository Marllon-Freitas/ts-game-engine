import { Sprite } from './graphics/sprite';
import { Matrix4x4 } from './math/matrix4x4';
import { Shader } from './webGL/shader';
import { WegGLUtilities } from './webGL/webGL';

/**
 * The main engine class for the game.
 */
export class Engine {
  // private methods and attributes:
  private m_canvas!: HTMLCanvasElement;
  private m_shader!: Shader;
  private m_sprite!: Sprite;
  private m_projectionMatrix!: Matrix4x4;

  private loop(): void {
    WegGLUtilities.gl.clear(WegGLUtilities.gl.COLOR_BUFFER_BIT);

    let colorLocation = this.m_shader.getUniformLocation('u_color');
    WegGLUtilities.gl.uniform4f(colorLocation, 1.0, 1.0, 0.0, 1.0);

    let projectionLocation = this.m_shader.getUniformLocation('u_projection');
    WegGLUtilities.gl.uniformMatrix4fv(
      projectionLocation,
      false,
      new Float32Array(this.m_projectionMatrix.data)
    );

    this.m_sprite.draw();

    requestAnimationFrame(this.loop.bind(this));
  }

  private loadShaders(): void {
    let vertexShaderSource = `
      attribute vec3 a_position;
      uniform mat4 u_projection;

      void main() {
        gl_Position = u_projection * vec4(a_position, 1.0);
      }
    `;
    let fragmentShaderSource = `
      precision mediump float;
      uniform vec4 u_color;
      void main() {
        gl_FragColor = u_color;
      }
    `;
    this.m_shader = new Shader('basicShader', vertexShaderSource, fragmentShaderSource);
  }

  // public methods and attributes:
  public constructor() {
    // eslint-disable-next-line no-console
    console.log('Engine constructor called');
  }

  /**
   * Starts the engine.
   */
  public start(): void {
    this.m_canvas = WegGLUtilities.initWebGL();

    WegGLUtilities.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.loadShaders();
    this.m_shader?.use();

    this.m_projectionMatrix = Matrix4x4.orthographic(
      0,
      this.m_canvas.width,
      0,
      this.m_canvas.height,
      -1.0,
      100.0
    );

    this.m_sprite = new Sprite('testSprite');
    this.m_sprite.load();

    this.loop();
  }

  /**
   * Resizes the canvas to fit the window.
   */
  public resize(): void {
    if (this.m_canvas) {
      this.m_canvas.width = window.innerWidth;
      this.m_canvas.height = window.innerHeight;
      WegGLUtilities.gl.viewport(-1, 0, 0, -1);
    }
  }
}
