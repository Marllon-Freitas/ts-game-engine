import { Shader } from '../shader';

export class BasicShader extends Shader {
  // private methods and attributes:
  private getVertexShaderSource(): string {
    return `
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
  }

  private getFragmentShaderSource(): string {
    return `
      precision mediump float;

      uniform vec4 u_tint;
      uniform sampler2D u_diffuse;

      varying vec2 v_texCoord;

      void main() {
        gl_FragColor = u_tint * texture2D(u_diffuse, v_texCoord);
      }
    `;
  }

  // public methods and attributes:
  constructor() {
    super('basicShader');
    this.load(this.getVertexShaderSource(), this.getFragmentShaderSource());
  }
}
