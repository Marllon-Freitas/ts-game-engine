import { Color } from './color';
import { Texture } from './texture';
import { TextureManager } from './textureManager';

export class Material {
  // private methods and attributes:
  private m_name: string;
  private m_diffuseTextureName: string;
  private m_diffuseTexture!: Texture | null;
  private m_tint: Color;

  // public methods and attributes:
  constructor(
    name: string,
    diffuseTextureName: string,
    tint: Color = new Color(255, 255, 255, 255)
  ) {
    this.m_name = name;
    this.m_diffuseTextureName = diffuseTextureName;
    this.m_tint = tint;

    if (this.m_diffuseTextureName !== null)
      this.m_diffuseTexture = TextureManager.getTexture(this.m_diffuseTextureName);
  }

  public get name(): string {
    return this.m_name;
  }

  public get diffuseTextureName(): string {
    return this.m_diffuseTextureName;
  }

  public set diffuseTextureName(value: string) {
    if (this.m_diffuseTexture !== null) {
      TextureManager.releaseTexture(this.m_diffuseTextureName);
    }
    this.m_diffuseTextureName = value;
    if (this.m_diffuseTextureName !== null)
      this.m_diffuseTexture = TextureManager.getTexture(this.m_diffuseTextureName);
  }

  public get diffuseTexture(): Texture | null {
    return this.m_diffuseTexture;
  }

  public get tint(): Color {
    return this.m_tint;
  }

  public destroy(): void {
    TextureManager.releaseTexture(this.m_diffuseTextureName);
    this.m_diffuseTexture = null;
  }
}
