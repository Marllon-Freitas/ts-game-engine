/* eslint-disable no-console */
import { SUPPORTED_FILE_EXTENSIONS } from '../utils';
import { AssetManager } from './assetManager';
import { IAsset } from './interfaces/IAsset';
import { IAssetLoader } from './interfaces/IAssetLoader';

export class ImageAsset implements IAsset {
  public readonly name: string;
  public readonly data: HTMLImageElement;

  constructor(name: string, image: HTMLImageElement) {
    this.name = name;
    this.data = image;
  }

  public get width(): number {
    return this.data.width;
  }

  public get height(): number {
    return this.data.height;
  }
}

export class ImageAssetLoader implements IAssetLoader {
  // private methods and attributes:
  private onImageLoaded(assetName: string, image: HTMLImageElement): void {
    console.log(`ImageAssetLoader: Image ${assetName} loaded.`);
    let asset: ImageAsset = new ImageAsset(assetName, image);
    AssetManager.onAssetLoaded(asset);
  }

  // public methods and attributes:
  public get supportedFileExtensions(): string[] {
    return SUPPORTED_FILE_EXTENSIONS;
  }

  public loadAsset(assetName: string): void {
    let image: HTMLImageElement = new Image();
    image.onload = this.onImageLoaded.bind(this, assetName, image);
    image.src = assetName;
  }
}
