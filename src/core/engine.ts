import { AssetManager } from './assets/assetManager';
import { initializeComponents } from './components/init';
import { Color } from './graphics/color';
import { Material } from './graphics/material';
import { MaterialManager } from './graphics/materialManager';
import { Matrix4x4 } from './math/matrix4x4';
import { MessageManager } from './messages/messageManager';
import { BasicShader } from './webGL/shaders/basicShader';
import { WegGLUtilities } from './webGL/webGL';
import { LevelManager } from './world/levelManager';

/**
 * The main engine class for the game.
 */
export class Engine {
  // private methods and attributes:
  private m_canvas!: HTMLCanvasElement;
  private m_basicShader!: BasicShader;
  private m_projectionMatrix!: Matrix4x4;
  private m_previousTime: number = 0;

  private loop(): void {
    this.update();
    this.render();
  }

  private update(): void {
    let delta = performance.now() - this.m_previousTime;
    MessageManager.update();

    LevelManager.update(delta);

    this.m_previousTime = performance.now();
  }

  private render(): void {
    WegGLUtilities.gl.clear(WegGLUtilities.gl.COLOR_BUFFER_BIT);

    LevelManager.render(this.m_basicShader);

    let projectionLocation = this.m_basicShader.getUniformLocation('u_projection');
    WegGLUtilities.gl.uniformMatrix4fv(
      projectionLocation,
      false,
      new Float32Array(this.m_projectionMatrix.data)
    );

    requestAnimationFrame(this.loop.bind(this));
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
    initializeComponents();

    AssetManager.initialize();
    LevelManager.initialize();

    WegGLUtilities.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    WegGLUtilities.gl.enable(WegGLUtilities.gl.BLEND);
    WegGLUtilities.gl.blendFunc(WegGLUtilities.gl.SRC_ALPHA, WegGLUtilities.gl.ONE_MINUS_SRC_ALPHA);

    this.m_basicShader = new BasicShader();
    this.m_basicShader?.use();

    MaterialManager.registerMaterial(
      new Material('testMaterial', '/assets/textures/wood-texture.png', Color.WHITE())
    );

    MaterialManager.registerMaterial(
      new Material('ball', '/assets/textures/ball-Sheet.png', Color.WHITE())
    );

    LevelManager.changeLevel(0);

    this.resize();
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
      this.m_projectionMatrix = Matrix4x4.orthographic(
        0,
        this.m_canvas.width,
        this.m_canvas.height,
        0,
        -100.0,
        100.0
      );
    }
  }
}
