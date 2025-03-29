import { Sprite } from './graphics/sprite';
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

  private loop(): void {
    WegGLUtilities.gl.clear(WegGLUtilities.gl.COLOR_BUFFER_BIT);

    let colorLocation = this.m_shader.getUniformLocation('u_color');
    WegGLUtilities.gl.uniform4f(colorLocation, 1.0, 1.0, 0.0, 1.0);

    this.m_sprite.draw();

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

    this.m_sprite = new Sprite('testSprite', 10, 10);
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
      WegGLUtilities.gl.viewport(0, 0, this.m_canvas.width, this.m_canvas.height);
    }
  }
}
