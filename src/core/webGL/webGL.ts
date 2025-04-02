/**
 * Responsible for setting up and managing WebGL rendering contexts.
 */
export class WegGLUtilities {
  // public methods and attributes:
  public static gl: WebGLRenderingContext;

  /**
   * Initializes a WebGL context for the given canvas element.
   * @param canvasId - The ID of the canvas element to use. If not provided, a new canvas will be created.
   * @returns The initialized canvas element.
   * @throws Will throw an error if the canvas element cannot be found.
   * @throws Will throw an error if the browser does not support WebGL.
   */
  public static initWebGL(canvasId?: string): HTMLCanvasElement {
    let canvas: HTMLCanvasElement = canvasId
      ? (document.getElementById(canvasId) as HTMLCanvasElement)
      : (document.createElement('canvas') as HTMLCanvasElement);

    if (!canvas) throw new Error(`Canvas with ID ${canvasId} not found.`);

    if (!canvasId) {
      document.body.appendChild(canvas);
    }

    let gl = canvas.getContext('webgl');

    if (!gl) {
      gl = canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
      if (!gl) throw new Error('WebGL not supported in this browser.');
    }

    WegGLUtilities.gl = gl;

    return canvas;
  }
}
