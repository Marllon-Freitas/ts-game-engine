import { AssetManager } from './assets/assetManager';
import { Sprite } from './graphics/sprite';
import { Matrix4x4 } from './math/matrix4x4';
import { MessageManager } from './messages/messageManager';
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
    MessageManager.update();
    WegGLUtilities.gl.clear(WegGLUtilities.gl.COLOR_BUFFER_BIT);

    let colorLocation = this.m_shader.getUniformLocation('u_tint');
    //WegGLUtilities.gl.uniform4f(colorLocation, 1.0, 1.0, 0.0, 1.0);
    WegGLUtilities.gl.uniform4f(colorLocation, 1.0, 1.0, 1.0, 1.0);

    let projectionLocation = this.m_shader.getUniformLocation('u_projection');
    WegGLUtilities.gl.uniformMatrix4fv(
      projectionLocation,
      false,
      new Float32Array(this.m_projectionMatrix.data)
    );

    let modelLocation = this.m_shader.getUniformLocation('u_model');
    WegGLUtilities.gl.uniformMatrix4fv(
      modelLocation,
      false,
      new Float32Array(Matrix4x4.translation(this.m_sprite.position).data)
    );

    this.m_sprite.draw(this.m_shader);

    requestAnimationFrame(this.loop.bind(this));
  }

  private loadShaders(): void {
    let vertexShaderSource = `
      attribute vec3 a_position;
      attribute vec2 a_texCoord;

      uniform mat4 u_projection;
      uniform mat4 u_model;

      varying vec2 v_texCoord;

      void main() {
        gl_Position = u_projection * u_model * vec4(a_position, 1.0);
        v_texCoord = a_texCoord;
      }
    `;
    let fragmentShaderSource = `
      precision mediump float;

      uniform vec4 u_tint;
      uniform sampler2D u_diffuse;

      varying vec2 v_texCoord;

      void main() {
        gl_FragColor = u_tint * texture2D(u_diffuse, v_texCoord);
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

    AssetManager.initialize();

    WegGLUtilities.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.loadShaders();
    this.m_shader?.use();

    this.m_projectionMatrix = Matrix4x4.orthographic(
      0,
      this.m_canvas.width,
      0,
      this.m_canvas.height,
      -100.0,
      100.0
    );

    this.m_sprite = new Sprite('testSprite', 'public/assets/textures/wood-texture.png');
    this.m_sprite.load();
    this.m_sprite.position.x = 200;

    this.loop();
  }

  /**
   * Resizes the canvas to fit the window.
   */
  public resize(): void {
    if (this.m_canvas) {
      this.m_canvas.width = window.innerWidth;
      this.m_canvas.height = window.innerHeight;
      WegGLUtilities.gl.viewport(-1, 1, -1, 1);
    }
  }
}
