export class Color {
  // private methods and attributes:
  private m_red: number;
  private m_green: number;
  private m_blue: number;
  private m_alpha: number;

  // public methods and attributes:
  constructor(red: number = 255, green: number = 255, blue: number = 255, alpha: number = 255) {
    this.m_red = red;
    this.m_green = green;
    this.m_blue = blue;
    this.m_alpha = alpha;
  }

  public get red(): number {
    return this.m_red;
  }

  public get redFloat(): number {
    return this.m_red / 255;
  }

  public set red(value: number) {
    this.m_red = value;
  }

  public get green(): number {
    return this.m_green;
  }

  public get greenFloat(): number {
    return this.m_green / 255;
  }

  public set green(value: number) {
    this.m_green = value;
  }

  public get blue(): number {
    return this.m_blue;
  }

  public get blueFloat(): number {
    return this.m_blue / 255;
  }

  public set blue(value: number) {
    this.m_blue = value;
  }

  public get alpha(): number {
    return this.m_alpha;
  }

  public get alphaFloat(): number {
    return this.m_alpha / 255;
  }

  public set alpha(value: number) {
    this.m_alpha = value;
  }

  public toArray(): number[] {
    return [this.m_red, this.m_green, this.m_blue, this.m_alpha];
  }

  public toFloatArray(): number[] {
    return [this.redFloat, this.greenFloat, this.blueFloat, this.alphaFloat];
  }

  public toFloat32Array(): Float32Array {
    return new Float32Array(this.toFloatArray());
  }

  // default colors
  public static WHITE(): Color {
    return new Color(255, 255, 255, 255);
  }

  public static BLACK(): Color {
    return new Color(0, 0, 0, 255);
  }

  public static RED(): Color {
    return new Color(255, 0, 0, 255);
  }

  public static GREEN(): Color {
    return new Color(0, 255, 0, 255);
  }

  public static BLUE(): Color {
    return new Color(0, 0, 255, 255);
  }
}
