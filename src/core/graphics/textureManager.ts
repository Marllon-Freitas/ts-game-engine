import { Texture } from './texture';

class TextureReferenceNode {
  public texture: Texture | null;
  public referenceCount: number = 1;

  constructor(texture: Texture) {
    this.texture = texture;
  }
}

/**
 * TextureManager class
 * This class manages the textures in the application.
 * It loads, releases, and keeps track of the reference counts for each texture.
 */
export class TextureManager {
  // private methods and attributes:
  private static m_textures: { [name: string]: TextureReferenceNode } = {};

  private constructor() {}

  // public methods and attributes:
  public static getTexture(name: string): Texture {
    if (this.m_textures[name] === undefined) {
      let texture = new Texture(name);
      this.m_textures[name] = new TextureReferenceNode(texture);
    } else {
      this.m_textures[name].referenceCount++;
    }

    if (!this.m_textures[name].texture) {
      throw new Error(`TextureManager: Texture ${name} is unexpectedly null.`);
    }
    return this.m_textures[name].texture;
  }

  public static releaseTexture(name: string): void {
    if (this.m_textures[name] === undefined) {
      // eslint-disable-next-line no-console
      console.warn(`TextureManager: Texture ${name} not found.`);
    } else {
      this.m_textures[name].referenceCount--;
      if (this.m_textures[name].referenceCount < 1) {
        if (this.m_textures[name].texture) this.m_textures[name].texture.destroy();
        this.m_textures[name].texture = null;
        delete this.m_textures[name];
      }
    }
  }
}
