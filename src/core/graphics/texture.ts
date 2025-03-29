import { AssetManager } from '../assets/assetManager';
import { ImageAsset } from '../assets/imageAssetLoader';
import { IMessageHandler } from '../messages/interfaces/IMessageHandler';
import { Message } from '../messages/message';
import { MESSAGE_ASSET_LOADER_ASSET_LOADED } from '../utils';
import { WegGLUtilities } from '../webGL/webGL';

const LEVEL = 0;
const BORDER = 0;
const TEMP_IMAGE_DATA = new Uint8Array([255, 255, 255, 255]);

export class Texture implements IMessageHandler {
  // private methods and attributes:
  private m_name: string;
  private m_handle: WebGLTexture;
  private m_isLoaded: boolean = false;
  private m_width: number;
  private m_height: number;

  private loadTextureFromAsset(asset: ImageAsset): void {
    this.m_width = asset.width;
    this.m_height = asset.height;

    this.bind();

    WegGLUtilities.gl.texImage2D(
      WegGLUtilities.gl.TEXTURE_2D,
      LEVEL,
      WegGLUtilities.gl.RGBA,
      WegGLUtilities.gl.RGBA,
      WegGLUtilities.gl.UNSIGNED_BYTE,
      asset.data
    );

    if (this.isPowerOfTwo()) {
      WegGLUtilities.gl.generateMipmap(WegGLUtilities.gl.TEXTURE_2D);
    } else {
      WegGLUtilities.gl.texParameteri(
        WegGLUtilities.gl.TEXTURE_2D,
        WegGLUtilities.gl.TEXTURE_WRAP_S,
        WegGLUtilities.gl.CLAMP_TO_EDGE
      );
      WegGLUtilities.gl.texParameteri(
        WegGLUtilities.gl.TEXTURE_2D,
        WegGLUtilities.gl.TEXTURE_WRAP_T,
        WegGLUtilities.gl.CLAMP_TO_EDGE
      );
      WegGLUtilities.gl.texParameteri(
        WegGLUtilities.gl.TEXTURE_2D,
        WegGLUtilities.gl.TEXTURE_MIN_FILTER,
        WegGLUtilities.gl.LINEAR
      );
    }

    this.m_isLoaded = true;
  }

  private isPowerOfTwo(): boolean {
    return this.isValuePowerOfTwo(this.m_width) && this.isValuePowerOfTwo(this.m_height);
  }

  private isValuePowerOfTwo(value: number): boolean {
    return (value & (value - 1)) === 0;
  }

  // public methods and attributes:
  constructor(name: string, width: number = 1, height: number = 1) {
    this.m_name = name;
    this.m_width = width;
    this.m_height = height;

    this.m_handle = WegGLUtilities.gl.createTexture();

    Message.subscribe(MESSAGE_ASSET_LOADER_ASSET_LOADED + this.m_name, this);

    this.bind();

    WegGLUtilities.gl.texImage2D(
      WegGLUtilities.gl.TEXTURE_2D,
      LEVEL,
      WegGLUtilities.gl.RGBA,
      1,
      1,
      BORDER,
      WegGLUtilities.gl.RGBA,
      WegGLUtilities.gl.UNSIGNED_BYTE,
      TEMP_IMAGE_DATA
    );

    let asset = AssetManager.getAsset(this.m_name) as ImageAsset;
    if (asset) {
      this.loadTextureFromAsset(asset);
    }
  }

  public bind(): void {
    WegGLUtilities.gl.bindTexture(WegGLUtilities.gl.TEXTURE_2D, this.m_handle);
  }

  public unbind(): void {
    WegGLUtilities.gl.bindTexture(WegGLUtilities.gl.TEXTURE_2D, null);
  }

  public activateAndBind(textureUnit: number = 0): void {
    WegGLUtilities.gl.activeTexture(WegGLUtilities.gl.TEXTURE0 + textureUnit);
    this.bind();
  }

  public get name(): string {
    return this.m_name;
  }

  public get isLoaded(): boolean {
    return this.m_isLoaded;
  }

  public get width(): number {
    return this.m_width;
  }

  public get height(): number {
    return this.m_height;
  }

  public onMessage(message: Message): void {
    if (message.code === MESSAGE_ASSET_LOADER_ASSET_LOADED + this.m_name)
      this.loadTextureFromAsset(message.context as ImageAsset);
  }

  public destroy(): void {
    WegGLUtilities.gl.deleteTexture(this.m_handle);
  }
}
