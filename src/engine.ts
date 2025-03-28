import { WegGLUtilities } from "./webGL";

/**
 * The main engine class for the game.
 */
export class Engine {
  // private methods and attributes:
  private m_canvas: HTMLCanvasElement | null = null;

  private loop(): void {
    console.log('Engine loop running');

    WegGLUtilities.gl.clear(WegGLUtilities.gl.COLOR_BUFFER_BIT);
    requestAnimationFrame(this.loop.bind(this));
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
    console.log('Engine started');
    this.m_canvas = WegGLUtilities.initWebGL();
    console.log('WebGL initialized on the canvas:', this.m_canvas);

    WegGLUtilities.gl.clearColor(0.0, 0.0, 0.0, 1.0);

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