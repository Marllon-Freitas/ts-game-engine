export let gl: WebGLRenderingContext

export class WebGLUtilities {
  public static initialize(elementId?: string): HTMLCanvasElement {
    let canvas: HTMLCanvasElement

    if (!elementId) {
      canvas = document.createElement('canvas') as HTMLCanvasElement
      document.body.appendChild(canvas)
    } else {
      canvas = document.getElementById(elementId) as HTMLCanvasElement
      if (!canvas) {
        throw new Error('Canvas element not found')
      }
    }

    gl = canvas.getContext('webgl') as WebGLRenderingContext
    if (!gl) {
      throw new Error('WebGL not supported')
    }

    return canvas
  }
}
