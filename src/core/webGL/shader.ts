import { WegGLUtilities } from './webGL';

/**
 * Shader class for managing WebGL shaders.
 * This class is responsible for loading, compiling, and linking shaders.
 */
export class Shader {
  // private methods and attributes:
  private m_name: string;
  private m_program!: WebGLProgram;
  private m_attributes: { [name: string]: number } = {};

  /**
   * Loads a shader source code and compiles it.
   * @param source The source code of the shader.
   * @param shaderType The type of the shader (vertex or fragment).
   * @returns The compiled shader.
   * @throws Will throw an error if the shader cannot be created or compiled.
   */
  private loadShaderSource(source: string, shaderType: number): WebGLShader {
    let shader: WebGLShader | null = WegGLUtilities.gl.createShader(shaderType);
    if (!shader) throw new Error('Unable to create shader.');

    WegGLUtilities.gl.shaderSource(shader, source);
    WegGLUtilities.gl.compileShader(shader);

    let compiled = WegGLUtilities.gl.getShaderParameter(shader, WegGLUtilities.gl.COMPILE_STATUS);
    if (!compiled) {
      let error = WegGLUtilities.gl.getShaderInfoLog(shader);
      WegGLUtilities.gl.deleteShader(shader);
      throw new Error(`Error compiling shader ${this.m_name}: ${error}`);
    }

    return shader;
  }

  /**
   * Creates a shader program by linking the vertex and fragment shaders.
   * @param vertexShader The compiled vertex shader.
   * @param fragmentShader The compiled fragment shader.
   * @throws Will throw an error if the program cannot be linked.
   */
  private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): void {
    this.m_program = WegGLUtilities.gl.createProgram();
    if (!this.m_program) throw new Error('Unable to create shader program.');

    WegGLUtilities.gl.attachShader(this.m_program, vertexShader);
    WegGLUtilities.gl.attachShader(this.m_program, fragmentShader);
    WegGLUtilities.gl.linkProgram(this.m_program);

    let linked = WegGLUtilities.gl.getProgramParameter(
      this.m_program,
      WegGLUtilities.gl.LINK_STATUS
    );
    if (!linked) {
      let error = WegGLUtilities.gl.getProgramInfoLog(this.m_program);
      WegGLUtilities.gl.deleteProgram(this.m_program);
      throw new Error(`Error linking shader program ${this.m_name}: ${error}`);
    }
  }

  /**
   * Detects and stores the attributes of the shader program.
   * @throws Will throw an error if the shader program is not created.
   */
  private detectAttributes(): void {
    if (!this.m_program) throw new Error('Shader program not created.');
    let attributeCount = WegGLUtilities.gl.getProgramParameter(
      this.m_program,
      WegGLUtilities.gl.ACTIVE_ATTRIBUTES
    );
    for (let i = 0; i < attributeCount; i++) {
      let info = WegGLUtilities.gl.getActiveAttrib(this.m_program, i);
      if (!info) break;
      this.m_attributes[info.name] = WegGLUtilities.gl.getAttribLocation(this.m_program, info.name);
    }
  }

  // public methods and attributes:
  /**
   * Creates a new shader program.
   * @param name The name of the shader.
   * @param vertexShaderSource The source code for the vertex shader.
   * @param fragmentShaderSource The source code for the fragment shader.
   */
  constructor(name: string, vertexShaderSource: string, fragmentShaderSource: string) {
    this.m_name = name;
    let vertexShader = this.loadShaderSource(vertexShaderSource, WegGLUtilities.gl.VERTEX_SHADER);
    let fragmentShader = this.loadShaderSource(
      fragmentShaderSource,
      WegGLUtilities.gl.FRAGMENT_SHADER
    );
    this.createProgram(vertexShader, fragmentShader);
    this.detectAttributes();
  }

  public get name(): string {
    return this.m_name;
  }

  public use(): void {
    if (!this.m_program) throw new Error('Shader program not created.');
    WegGLUtilities.gl.useProgram(this.m_program);
  }

  /**
   * This method retrieves the location of a given attribute in the shader program
   * @param name The name of the attribute to get the location for.
   * @throws Will throw an error if the shader program is not created or the attribute is not found.
   * @returns The location of the attribute in the shader program.
   */
  public getAttributeLocation(name: string): number {
    if (!this.m_program) throw new Error('Shader program not created.');
    if (!(name in this.m_attributes))
      throw new Error(`Attribute ${name} not found in shader ${this.m_name}.`);
    return this.m_attributes[name];
  }
}
